#!/usr/bin/env python
"""static - A stupidly simple WSGI way to serve static (or mixed) content.

(See the docstrings of the various functions and classes.)

Copyright (C) 2006-2009 Luke Arno - http://lukearno.com/

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public
License along with this library; if not, write to:

The Free Software Foundation, Inc.,
51 Franklin Street, Fifth Floor,
Boston, MA  02110-1301, USA.

Luke Arno can be found at http://lukearno.com/

"""

import mimetypes
import rfc822
import time
import string
import sys
from os import path, stat, getcwd
from fnmatch import fnmatch
from wsgiref import util
from wsgiref.validate import validator
from wsgiref.headers import Headers
from wsgiref.simple_server import make_server
from optparse import OptionParser

try: from pkg_resources import resource_filename, Requirement
except: pass

try: import kid
except: pass


class MagicError(Exception): pass


class StatusApp:
    """Used by WSGI apps to return some HTTP status."""

    def __init__(self, status, message=None):
        self.status = status
        if message is None:
            self.message = status
        else:
            self.message = message

    def __call__(self, environ, start_response, headers=[]):
        if self.message:
            Headers(headers).add_header('Content-type', 'text/plain')
        start_response(self.status, headers)
        if environ['REQUEST_METHOD'] == 'HEAD':
            return [""]
        else:
            return [self.message]


class Cling(object):
    """A stupidly simple way to serve static content via WSGI.

    Serve the file of the same path as PATH_INFO in self.datadir.

    Look up the Content-type in self.content_types by extension
    or use 'text/plain' if the extension is not found.

    Serve up the contents of the file or delegate to self.not_found.
    """

    block_size = 16 * 4096
    index_file = 'index.html'
    not_found = StatusApp('404 Not Found')
    not_modified = StatusApp('304 Not Modified', "")
    moved_permanently = StatusApp('301 Moved Permanently')
    method_not_allowed = StatusApp('405 Method Not Allowed')
    success_no_content = StatusApp('204 No Content', "")
    server_error = StatusApp('500 Internal Server Error')

    def __init__(self, root, **kw):
        """Just set the root and any other attribs passes via **kw."""
        self.root = root
        for k, v in kw.iteritems():
            setattr(self, k, v)

    def __call__(self, environ, start_response):
        """Respond to a request when called in the usual WSGI way."""
        path_info = environ.get('PATH_INFO', '')
        full_path = self._full_path(path_info)
        if not self._is_under_root(full_path):
            return self.not_found(environ, start_response)
        if path.isdir(full_path):
            if full_path[-1] <> '/' or full_path == self.root:
                location = util.request_uri(environ, include_query=False) + '/'
                if environ.get('QUERY_STRING'):
                    location += '?' + environ.get('QUERY_STRING')
                headers = [('Location', location)]
                return self.moved_permanently(environ, start_response, headers)
            else:
                full_path = self._full_path(path_info + self.index_file)
        try:
            sz = int(environ['CONTENT_LENGTH'])
        except:
            sz = 0
        if environ['REQUEST_METHOD'] == 'PUT' and sz > 0:
            for putglob in self.puttable:
                if fnmatch(path_info, putglob):
                    data = environ['wsgi.input'].read(sz)
                    try:
                        with open(full_path, "wb") as f: f.write(data)
                        return self.success_no_content(environ, start_response)
                    except:
                        print sys.exc_info()[1]
                        return self.server_error(environ, start_response)
        if environ['REQUEST_METHOD'] not in ('GET', 'HEAD'):
            headers = [('Allow', 'GET, HEAD')]
            return self.method_not_allowed(environ, start_response, headers)
        content_type = self._guess_type(full_path)
        try:
            etag, last_modified = self._conditions(full_path, environ)
            headers = [('Date', rfc822.formatdate(time.time())),
                       ('Last-Modified', last_modified),
                       ('ETag', etag)]
            if_modified = environ.get('HTTP_IF_MODIFIED_SINCE')
            if if_modified and (rfc822.parsedate(if_modified)
                                >= rfc822.parsedate(last_modified)):
                return self.not_modified(environ, start_response, headers)
            if_none = environ.get('HTTP_IF_NONE_MATCH')
            if if_none and (if_none == '*' or etag in if_none):
                return self.not_modified(environ, start_response, headers)
            file_like = self._file_like(full_path)
            headers.append(('Content-Type', content_type))
            start_response("200 OK", headers)
            if environ['REQUEST_METHOD'] == 'GET':
                return self._body(full_path, environ, file_like)
            else:
                return ['']
        except (IOError, OSError), e:
            print e
            return self.not_found(environ, start_response)

    def _full_path(self, path_info):
        """Return the full path from which to read."""
        return self.root + path_info

    def _is_under_root(self, full_path):
        """Guard against arbitrary file retrieval."""
        if (path.abspath(full_path) + path.sep)\
            .startswith(path.abspath(self.root) + path.sep):
            return True
        else:
            return False

    def _guess_type(self, full_path):
        """Guess the mime type using the mimetypes module."""
        return mimetypes.guess_type(full_path)[0] or 'text/plain'

    def _conditions(self, full_path, environ):
        """Return a tuple of etag, last_modified by mtime from stat."""
        mtime = stat(full_path).st_mtime
        return str(mtime), rfc822.formatdate(mtime)

    def _file_like(self, full_path):
        """Return the appropriate file object."""
        return open(full_path, 'rb')

    def _body(self, full_path, environ, file_like):
        """Return an iterator over the body of the response."""
        way_to_send = environ.get('wsgi.file_wrapper', iter_and_close)
        return way_to_send(file_like, self.block_size)


def iter_and_close(file_like, block_size):
    """Yield file contents by block then close the file."""
    while 1:
        try:
            block = file_like.read(block_size)
            if block: yield block
            else: raise StopIteration
        except StopIteration, si:
            file_like.close()
            return


def cling_wrap(package_name, dir_name, **kw):
    """Return a Cling that serves from the given package and dir_name.

    This uses pkg_resources.resource_filename which is not the
    recommended way, since it extracts the files.

    I think this works fine unless you have some _very_ serious
    requirements for static content, in which case you probably
    shouldn't be serving it through a WSGI app, IMHO. YMMV.
    """
    resource = Requirement.parse(package_name)
    return Cling(resource_filename(resource, dir_name), **kw)


def command():
    usage = "%prog [--help] [-d DIR] [-l [HOST][:PORT]] [-p GLOB[,GLOB...]]"
    parser = OptionParser(usage=usage, version="static 0.3.6")
    parser.add_option("-d", "--dir", dest="rootdir", default=".",
        help="Root directory to serve. Defaults to '.' .", metavar="DIR")
    parser.add_option("-l", "--listen", dest="listen", default="127.0.0.1:8888",
        help="Listen on this interface (given by its hostname or IP) and port."+
             " HOST defaults to 127.0.0.1. PORT defaults to 8888. "+
             "Leave HOST empty to listen on all interfaces (INSECURE!).",
             metavar="[HOST][:PORT]")
    parser.add_option("-p", "--puttable", dest="puttable", default="",
             help="Comma or space-separated list of request paths for which to"+
                  " permit PUT requests. Each path is a glob pattern that may "+
                  "contain wildcard characters '*' and/or '?'. "+
                  "'*' matches any sequence of characters, including the empty"+
                  " string. '?' matches exactly 1 arbitrary character. "+
                  "NOTE: Both '*' and '?' match slashes and dots. "+
                  "I.e. --puttable=* makes every file under DIR writable!",
                  metavar="GLOB[,GLOB...]")
    parser.add_option("--validate", dest="validate", action="store_true",
                  default=False,
                  help="Enable HTTP validation. You don't need this unless "+
                       "you're developing static.py itself.")

    options, args = parser.parse_args()
    if len(args) > 0:
        parser.print_help(sys.stderr)
        sys.exit(1)

    parts = options.listen.split(":")
    if len(parts) == 1:
        try: # if the the listen argument consists only of a port number
            port = int(parts[0])
            host = None
        except: # could not parse as port number => must be a host IP or name
            host = parts[0]
            port = None
    elif len(parts) == 2:
        host, port = parts
    else:
        sys.exit("Invalid host:port specification.")

    if not host:
        host = '0.0.0.0'
    if not port:
        port = 8888
    try:
        port = int(port)
        if port <= 0 or port > 65535: raise ValueError
    except:
        sys.exit("Invalid host:port specification.")

    puttable = set(path.abspath(p) for p in
                                     options.puttable.replace(","," ").split())
    if puttable and host not in ('127.0.0.1', 'localhost'):
        print("Permitting PUT access for non-localhost connections may be unwise.")

    options.rootdir = path.abspath(options.rootdir)

    for p in puttable:
        if not p.startswith(options.rootdir):
            sys.exit("puttable path '%s' not under root '%s'" % (p, options.rootdir))

    # cut off root prefix from puttable paths
    puttable = set(p[len(options.rootdir):] for p in puttable)

    app = Cling(options.rootdir, puttable=puttable)

    if options.validate:
        app = validator(app)

    try:
        print "Serving %s to http://%s:%d" % (options.rootdir, host, port)
        if puttable:
            print("The following paths (relative to server root) may be "+
                  "OVERWRITTEN via HTTP PUT.")
            for p in puttable:
                print p
        make_server(host, port, app).serve_forever()
    except KeyboardInterrupt, ki:
        print "Ciao, baby!"
    except:
        sys.exit("Problem initializing server: %s" % sys.exc_info()[1])


if __name__ == '__main__':
    command()

