/**
 * ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK *****
 */

define(function(require, exports, module) {
"use strict";

var functionMap = {
    "abs": [
        "int abs(int number)",
        "Return the absolute value of the number"
    ],
    "acos": [
        "float acos(float number)",
        "Return the arc cosine of the number in radians"
    ],
    "acosh": [
        "float acosh(float number)",
        "Returns the inverse hyperbolic cosine of the number, i.e. the value whose hyperbolic cosine is number"
    ],
    "addGlob": [
        "bool addGlob(string pattern[,int flags [, array options]])",
        "Add files matching the glob pattern. See php's glob for the pattern syntax."
    ],
    "addPattern": [
        "bool addPattern(string pattern[, string path [, array options]])",
        "Add files matching the pcre pattern. See php's pcre for the pattern syntax."
    ],
    "addcslashes": [
        "string addcslashes(string str, string charlist)",
        "Escapes all chars mentioned in charlist with backslash. It creates octal representations if asked to backslash characters with 8th bit set or with ASCII<32 (except '\\n', '\\r', '\\t' etc...)"
    ],
    "addslashes": [
        "string addslashes(string str)",
        "Escapes single quote, double quotes and backslash characters in a string with backslashes"
    ],
    "apache_child_terminate": [
        "bool apache_child_terminate()",
        "Terminate apache process after this request"
    ],
    "apache_get_modules": [
        "array apache_get_modules()",
        "Get a list of loaded Apache modules"
    ],
    "apache_get_version": [
        "string apache_get_version()",
        "Fetch Apache version"
    ],
    "apache_getenv": [
        "bool apache_getenv(string variable [, bool walk_to_top])",
        "Get an Apache subprocess_env variable"
    ],
    "apache_lookup_uri": [
        "object apache_lookup_uri(string URI)",
        "Perform a partial request of the given URI to obtain information about it"
    ],
    "apache_note": [
        "string apache_note(string note_name [, string note_value])",
        "Get and set Apache request notes"
    ],
    "apache_request_auth_name": [
        "string apache_request_auth_name()",
        ""
    ],
    "apache_request_auth_type": [
        "string apache_request_auth_type()",
        ""
    ],
    "apache_request_discard_request_body": [
        "long apache_request_discard_request_body()",
        ""
    ],
    "apache_request_err_headers_out": [
        "array apache_request_err_headers_out([{string name|array list} [, string value [, bool replace = false]]])",
        "* fetch all headers that go out in case of an error or a subrequest"
    ],
    "apache_request_headers": [
        "array apache_request_headers()",
        "Fetch all HTTP request headers"
    ],
    "apache_request_headers_in": [
        "array apache_request_headers_in()",
        "* fetch all incoming request headers"
    ],
    "apache_request_headers_out": [
        "array apache_request_headers_out([{string name|array list} [, string value [, bool replace = false]]])",
        "* fetch all outgoing request headers"
    ],
    "apache_request_is_initial_req": [
        "bool apache_request_is_initial_req()",
        ""
    ],
    "apache_request_log_error": [
        "bool apache_request_log_error(string message, [long facility])",
        ""
    ],
    "apache_request_meets_conditions": [
        "long apache_request_meets_conditions()",
        ""
    ],
    "apache_request_remote_host": [
        "int apache_request_remote_host([int type])",
        ""
    ],
    "apache_request_run": [
        "long apache_request_run()",
        "This is a wrapper for ap_sub_run_req and ap_destory_sub_req.  It takes      sub_request, runs it, destroys it, and returns it's status."
    ],
    "apache_request_satisfies": [
        "long apache_request_satisfies()",
        ""
    ],
    "apache_request_server_port": [
        "int apache_request_server_port()",
        ""
    ],
    "apache_request_set_etag": [
        "void apache_request_set_etag()",
        ""
    ],
    "apache_request_set_last_modified": [
        "void apache_request_set_last_modified()",
        ""
    ],
    "apache_request_some_auth_required": [
        "bool apache_request_some_auth_required()",
        ""
    ],
    "apache_request_sub_req_lookup_file": [
        "object apache_request_sub_req_lookup_file(string file)",
        "Returns sub-request for the specified file.  You would     need to run it yourself with run()."
    ],
    "apache_request_sub_req_lookup_uri": [
        "object apache_request_sub_req_lookup_uri(string uri)",
        "Returns sub-request for the specified uri.  You would     need to run it yourself with run()"
    ],
    "apache_request_sub_req_method_uri": [
        "object apache_request_sub_req_method_uri(string method, string uri)",
        "Returns sub-request for the specified file.  You would     need to run it yourself with run()."
    ],
    "apache_request_update_mtime": [
        "long apache_request_update_mtime([int dependency_mtime])",
        ""
    ],
    "apache_reset_timeout": [
        "bool apache_reset_timeout()",
        "Reset the Apache write timer"
    ],
    "apache_response_headers": [
        "array apache_response_headers()",
        "Fetch all HTTP response headers"
    ],
    "apache_setenv": [
        "bool apache_setenv(string variable, string value [, bool walk_to_top])",
        "Set an Apache subprocess_env variable"
    ],
    "array_change_key_case": [
        "array array_change_key_case(array input [, int case=CASE_LOWER])",
        "Retuns an array with all string keys lowercased [or uppercased]"
    ],
    "array_chunk": [
        "array array_chunk(array input, int size [, bool preserve_keys])",
        "Split array into chunks"
    ],
    "array_combine": [
        "array array_combine(array keys, array values)",
        "Creates an array by using the elements of the first parameter as keys and the elements of the second as the corresponding values"
    ],
    "array_count_values": [
        "array array_count_values(array input)",
        "Return the value as key and the frequency of that value in input as value"
    ],
    "array_diff": [
        "array array_diff(array arr1, array arr2 [, array ...])",
        "Returns the entries of arr1 that have values which are not present in any of the others arguments."
    ],
    "array_diff_assoc": [
        "array array_diff_assoc(array arr1, array arr2 [, array ...])",
        "Returns the entries of arr1 that have values which are not present in any of the others arguments but do additional checks whether the keys are equal"
    ],
    "array_diff_key": [
        "array array_diff_key(array arr1, array arr2 [, array ...])",
        "Returns the entries of arr1 that have keys which are not present in any of the others arguments. This function is like array_diff() but works on the keys instead of the values. The associativity is preserved."
    ],
    "array_diff_uassoc": [
        "array array_diff_uassoc(array arr1, array arr2 [, array ...], callback data_comp_func)",
        "Returns the entries of arr1 that have values which are not present in any of the others arguments but do additional checks whether the keys are equal. Elements are compared by user supplied function."
    ],
    "array_diff_ukey": [
        "array array_diff_ukey(array arr1, array arr2 [, array ...], callback key_comp_func)",
        "Returns the entries of arr1 that have keys which are not present in any of the others arguments. User supplied function is used for comparing the keys. This function is like array_udiff() but works on the keys instead of the values. The associativity is preserved."
    ],
    "array_fill": [
        "array array_fill(int start_key, int num, mixed val)",
        "Create an array containing num elements starting with index start_key each initialized to val"
    ],
    "array_fill_keys": [
        "array array_fill_keys(array keys, mixed val)",
        "Create an array using the elements of the first parameter as keys each initialized to val"
    ],
    "array_filter": [
        "array array_filter(array input [, mixed callback])",
        "Filters elements from the array via the callback."
    ],
    "array_flip": [
        "array array_flip(array input)",
        "Return array with key <-> value flipped"
    ],
    "array_intersect": [
        "array array_intersect(array arr1, array arr2 [, array ...])",
        "Returns the entries of arr1 that have values which are present in all the other arguments"
    ],
    "array_intersect_assoc": [
        "array array_intersect_assoc(array arr1, array arr2 [, array ...])",
        "Returns the entries of arr1 that have values which are present in all the other arguments. Keys are used to do more restrictive check"
    ],
    "array_intersect_key": [
        "array array_intersect_key(array arr1, array arr2 [, array ...])",
        "Returns the entries of arr1 that have keys which are present in all the other arguments. Kind of equivalent to array_diff(array_keys($arr1), array_keys($arr2)[,array_keys(...)]). Equivalent of array_intersect_assoc() but does not do compare of the data."
    ],
    "array_intersect_uassoc": [
        "array array_intersect_uassoc(array arr1, array arr2 [, array ...], callback key_compare_func)",
        "Returns the entries of arr1 that have values which are present in all the other arguments. Keys are used to do more restrictive check and they are compared by using an user-supplied callback."
    ],
    "array_intersect_ukey": [
        "array array_intersect_ukey(array arr1, array arr2 [, array ...], callback key_compare_func)",
        "Returns the entries of arr1 that have keys which are present in all the other arguments. Kind of equivalent to array_diff(array_keys($arr1), array_keys($arr2)[,array_keys(...)]). The comparison of the keys is performed by a user supplied function. Equivalent of array_intersect_uassoc() but does not do compare of the data."
    ],
    "array_key_exists": [
        "bool array_key_exists(mixed key, array search)",
        "Checks if the given key or index exists in the array"
    ],
    "array_keys": [
        "array array_keys(array input [, mixed search_value[, bool strict]])",
        "Return just the keys from the input array, optionally only for the specified search_value"
    ],
    "array_key_first": [
        "mixed array_key_first(array arr)",
        "Returns the first key of arr if the array is not empty; NULL otherwise"
    ],
    "array_key_last": [
        "mixed array_key_last(array arr)",
        "Returns the last key of arr if the array is not empty; NULL otherwise"
    ],
    "array_map": [
        "array array_map(mixed callback, array input1 [, array input2 ,...])",
        "Applies the callback to the elements in given arrays."
    ],
    "array_merge": [
        "array array_merge(array arr1, array arr2 [, array ...])",
        "Merges elements from passed arrays into one array"
    ],
    "array_merge_recursive": [
        "array array_merge_recursive(array arr1, array arr2 [, array ...])",
        "Recursively merges elements from passed arrays into one array"
    ],
    "array_multisort": [
        "bool array_multisort(array ar1 [, SORT_ASC|SORT_DESC [, SORT_REGULAR|SORT_NUMERIC|SORT_STRING]] [, array ar2 [, SORT_ASC|SORT_DESC [, SORT_REGULAR|SORT_NUMERIC|SORT_STRING]], ...])",
        "Sort multiple arrays at once similar to how ORDER BY clause works in SQL"
    ],
    "array_pad": [
        "array array_pad(array input, int pad_size, mixed pad_value)",
        "Returns a copy of input array padded with pad_value to size pad_size"
    ],
    "array_pop": [
        "mixed array_pop(array stack)",
        "Pops an element off the end of the array"
    ],
    "array_product": [
        "mixed array_product(array input)",
        "Returns the product of the array entries"
    ],
    "array_push": [
        "int array_push(array stack, mixed var [, mixed ...])",
        "Pushes elements onto the end of the array"
    ],
    "array_rand": [
        "mixed array_rand(array input [, int num_req])",
        "Return key/keys for random entry/entries in the array"
    ],
    "array_reduce": [
        "mixed array_reduce(array input, mixed callback [, mixed initial])",
        "Iteratively reduce the array to a single value via the callback."
    ],
    "array_replace": [
        "array array_replace(array arr1, array arr2 [, array ...])",
        "Replaces elements from passed arrays into one array"
    ],
    "array_replace_recursive": [
        "array array_replace_recursive(array arr1, array arr2 [, array ...])",
        "Recursively replaces elements from passed arrays into one array"
    ],
    "array_reverse": [
        "array array_reverse(array input [, bool preserve keys])",
        "Return input as a new array with the order of the entries reversed"
    ],
    "array_search": [
        "mixed array_search(mixed needle, array haystack [, bool strict])",
        "Searches the array for a given value and returns the corresponding key if successful"
    ],
    "array_shift": [
        "mixed array_shift(array stack)",
        "Pops an element off the beginning of the array"
    ],
    "array_slice": [
        "array array_slice(array input, int offset [, int length [, bool preserve_keys]])",
        "Returns elements specified by offset and length"
    ],
    "array_splice": [
        "array array_splice(array input, int offset [, int length [, array replacement]])",
        "Removes the elements designated by offset and length and replace them with supplied array"
    ],
    "array_sum": [
        "mixed array_sum(array input)",
        "Returns the sum of the array entries"
    ],
    "array_udiff": [
        "array array_udiff(array arr1, array arr2 [, array ...], callback data_comp_func)",
        "Returns the entries of arr1 that have values which are not present in any of the others arguments. Elements are compared by user supplied function."
    ],
    "array_udiff_assoc": [
        "array array_udiff_assoc(array arr1, array arr2 [, array ...], callback key_comp_func)",
        "Returns the entries of arr1 that have values which are not present in any of the others arguments but do additional checks whether the keys are equal. Keys are compared by user supplied function."
    ],
    "array_udiff_uassoc": [
        "array array_udiff_uassoc(array arr1, array arr2 [, array ...], callback data_comp_func, callback key_comp_func)",
        "Returns the entries of arr1 that have values which are not present in any of the others arguments but do additional checks whether the keys are equal. Keys and elements are compared by user supplied functions."
    ],
    "array_uintersect": [
        "array array_uintersect(array arr1, array arr2 [, array ...], callback data_compare_func)",
        "Returns the entries of arr1 that have values which are present in all the other arguments. Data is compared by using an user-supplied callback."
    ],
    "array_uintersect_assoc": [
        "array array_uintersect_assoc(array arr1, array arr2 [, array ...], callback data_compare_func)",
        "Returns the entries of arr1 that have values which are present in all the other arguments. Keys are used to do more restrictive check. Data is compared by using an user-supplied callback."
    ],
    "array_uintersect_uassoc": [
        "array array_uintersect_uassoc(array arr1, array arr2 [, array ...], callback data_compare_func, callback key_compare_func)",
        "Returns the entries of arr1 that have values which are present in all the other arguments. Keys are used to do more restrictive check. Both data and keys are compared by using user-supplied callbacks."
    ],
    "array_unique": [
        "array array_unique(array input [, int sort_flags])",
        "Removes duplicate values from array"
    ],
    "array_unshift": [
        "int array_unshift(array stack, mixed var [, mixed ...])",
        "Pushes elements onto the beginning of the array"
    ],
    "array_values": [
        "array array_values(array input)",
        "Return just the values from the input array"
    ],
    "array_walk": [
        "bool array_walk(array input, string funcname [, mixed userdata])",
        "Apply a user function to every member of an array"
    ],
    "array_walk_recursive": [
        "bool array_walk_recursive(array input, string funcname [, mixed userdata])",
        "Apply a user function recursively to every member of an array"
    ],
    "arsort": [
        "bool arsort(array &array_arg [, int sort_flags])",
        "Sort an array in reverse order and maintain index association"
    ],
    "asin": [
        "float asin(float number)",
        "Returns the arc sine of the number in radians"
    ],
    "asinh": [
        "float asinh(float number)",
        "Returns the inverse hyperbolic sine of the number, i.e. the value whose hyperbolic sine is number"
    ],
    "asort": [
        "bool asort(array &array_arg [, int sort_flags])",
        "Sort an array and maintain index association"
    ],
    "assert": [
        "int assert(string|bool assertion)",
        "Checks if assertion is false"
    ],
    "assert_options": [
        "mixed assert_options(int what [, mixed value])",
        "Set/get the various assert flags"
    ],
    "atan": [
        "float atan(float number)",
        "Returns the arc tangent of the number in radians"
    ],
    "atan2": [
        "float atan2(float y, float x)",
        "Returns the arc tangent of y/x, with the resulting quadrant determined by the signs of y and x"
    ],
    "atanh": [
        "float atanh(float number)",
        "Returns the inverse hyperbolic tangent of the number, i.e. the value whose hyperbolic tangent is number"
    ],
    "attachIterator": [
        "void attachIterator(Iterator iterator[, mixed info])",
        "Attach a new iterator"
    ],
    "base64_decode": [
        "string base64_decode(string str[, bool strict])",
        "Decodes string using MIME base64 algorithm"
    ],
    "base64_encode": [
        "string base64_encode(string str)",
        "Encodes string using MIME base64 algorithm"
    ],
    "base_convert": [
        "string base_convert(string number, int frombase, int tobase)",
        "Converts a number in a string from any base <= 36 to any base <= 36"
    ],
    "basename": [
        "string basename(string path [, string suffix])",
        "Returns the filename component of the path"
    ],
    "bcadd": [
        "string bcadd(string left_operand, string right_operand [, int scale])",
        "Returns the sum of two arbitrary precision numbers"
    ],
    "bccomp": [
        "int bccomp(string left_operand, string right_operand [, int scale])",
        "Compares two arbitrary precision numbers"
    ],
    "bcdiv": [
        "string bcdiv(string left_operand, string right_operand [, int scale])",
        "Returns the quotient of two arbitrary precision numbers (division)"
    ],
    "bcmod": [
        "string bcmod(string left_operand, string right_operand)",
        "Returns the modulus of the two arbitrary precision operands"
    ],
    "bcmul": [
        "string bcmul(string left_operand, string right_operand [, int scale])",
        "Returns the multiplication of two arbitrary precision numbers"
    ],
    "bcpow": [
        "string bcpow(string x, string y [, int scale])",
        "Returns the value of an arbitrary precision number raised to the power of another"
    ],
    "bcpowmod": [
        "string bcpowmod(string x, string y, string mod [, int scale])",
        "Returns the value of an arbitrary precision number raised to the power of another reduced by a modulous"
    ],
    "bcscale": [
        "bool bcscale(int scale)",
        "Sets default scale parameter for all bc math functions"
    ],
    "bcsqrt": [
        "string bcsqrt(string operand [, int scale])",
        "Returns the square root of an arbitray precision number"
    ],
    "bcsub": [
        "string bcsub(string left_operand, string right_operand [, int scale])",
        "Returns the difference between two arbitrary precision numbers"
    ],
    "bin2hex": [
        "string bin2hex(string data)",
        "Converts the binary representation of data to hex"
    ],
    "bind_textdomain_codeset": [
        "string bind_textdomain_codeset (string domain, string codeset)",
        "Specify the character encoding in which the messages from the DOMAIN message catalog will be returned."
    ],
    "bindec": [
        "int bindec(string binary_number)",
        "Returns the decimal equivalent of the binary number"
    ],
    "bindtextdomain": [
        "string bindtextdomain(string domain_name, string dir)",
        "Bind to the text domain domain_name, looking for translations in dir. Returns the current domain"
    ],
    "birdstep_autocommit": [
        "bool birdstep_autocommit(int index)",
        ""
    ],
    "birdstep_close": [
        "bool birdstep_close(int id)",
        ""
    ],
    "birdstep_commit": [
        "bool birdstep_commit(int index)",
        ""
    ],
    "birdstep_connect": [
        "int birdstep_connect(string server, string user, string pass)",
        ""
    ],
    "birdstep_exec": [
        "int birdstep_exec(int index, string exec_str)",
        ""
    ],
    "birdstep_fetch": [
        "bool birdstep_fetch(int index)",
        ""
    ],
    "birdstep_fieldname": [
        "string birdstep_fieldname(int index, int col)",
        ""
    ],
    "birdstep_fieldnum": [
        "int birdstep_fieldnum(int index)",
        ""
    ],
    "birdstep_freeresult": [
        "bool birdstep_freeresult(int index)",
        ""
    ],
    "birdstep_off_autocommit": [
        "bool birdstep_off_autocommit(int index)",
        ""
    ],
    "birdstep_result": [
        "mixed birdstep_result(int index, mixed col)",
        ""
    ],
    "birdstep_rollback": [
        "bool birdstep_rollback(int index)",
        ""
    ],
    "bzcompress": [
        "string bzcompress(string source [, int blocksize100k [, int workfactor]])",
        "Compresses a string into BZip2 encoded data"
    ],
    "bzdecompress": [
        "string bzdecompress(string source [, int small])",
        "Decompresses BZip2 compressed data"
    ],
    "bzerrno": [
        "int bzerrno(resource bz)",
        "Returns the error number"
    ],
    "bzerror": [
        "array bzerror(resource bz)",
        "Returns the error number and error string in an associative array"
    ],
    "bzerrstr": [
        "string bzerrstr(resource bz)",
        "Returns the error string"
    ],
    "bzopen": [
        "resource bzopen(string|int file|fp, string mode)",
        "Opens a new BZip2 stream"
    ],
    "bzread": [
        "string bzread(resource bz[, int length])",
        "Reads up to length bytes from a BZip2 stream, or 1024 bytes if length is not specified"
    ],
    "cal_days_in_month": [
        "int cal_days_in_month(int calendar, int month, int year)",
        "Returns the number of days in a month for a given year and calendar"
    ],
    "cal_from_jd": [
        "array cal_from_jd(int jd, int calendar)",
        "Converts from Julian Day Count to a supported calendar and return extended information"
    ],
    "cal_info": [
        "array cal_info([int calendar])",
        "Returns information about a particular calendar"
    ],
    "cal_to_jd": [
        "int cal_to_jd(int calendar, int month, int day, int year)",
        "Converts from a supported calendar to Julian Day Count"
    ],
    "call_user_func": [
        "mixed call_user_func(mixed function_name [, mixed parmeter] [, mixed ...])",
        "Call a user function which is the first parameter"
    ],
    "call_user_func_array": [
        "mixed call_user_func_array(string function_name, array parameters)",
        "Call a user function which is the first parameter with the arguments contained in array"
    ],
    "call_user_method": [
        "mixed call_user_method(string method_name, mixed object [, mixed parameter] [, mixed ...])",
        "Call a user method on a specific object or class"
    ],
    "call_user_method_array": [
        "mixed call_user_method_array(string method_name, mixed object, array params)",
        "Call a user method on a specific object or class using a parameter array"
    ],
    "ceil": [
        "float ceil(float number)",
        "Returns the next highest integer value of the number"
    ],
    "chdir": [
        "bool chdir(string directory)",
        "Change the current directory"
    ],
    "checkdate": [
        "bool checkdate(int month, int day, int year)",
        "Returns true(1) if it is a valid date in gregorian calendar"
    ],
    "chgrp": [
        "bool chgrp(string filename, mixed group)",
        "Change file group"
    ],
    "chmod": [
        "bool chmod(string filename, int mode)",
        "Change file mode"
    ],
    "chown": [
        "bool chown(string filename, mixed user)",
        "Change file owner"
    ],
    "chr": [
        "string chr(int ascii)",
        "Converts ASCII code to a character"
    ],
    "chroot": [
        "bool chroot(string directory)",
        "Change root directory"
    ],
    "chunk_split": [
        "string chunk_split(string str [, int chunklen [, string ending]])",
        "Returns split line"
    ],
    "class_alias": [
        "bool class_alias(string user_class_name , string alias_name [, bool autoload])",
        "Creates an alias for user defined class"
    ],
    "class_exists": [
        "bool class_exists(string classname [, bool autoload])",
        "Checks if the class exists"
    ],
    "class_implements": [
        "array class_implements(mixed what [, bool autoload ])",
        "Return all classes and interfaces implemented by SPL"
    ],
    "class_parents": [
        "array class_parents(object instance [, bool autoload = true])",
        "Return an array containing the names of all parent classes"
    ],
    "clearstatcache": [
        "void clearstatcache([bool clear_realpath_cache[, string filename]])",
        "Clear file stat cache"
    ],
    "closedir": [
        "void closedir([resource dir_handle])",
        "Close directory connection identified by the dir_handle"
    ],
    "closelog": [
        "bool closelog()",
        "Close connection to system logger"
    ],
    "collator_asort": [
        "bool collator_asort( Collator $coll, array(string) $arr )",
        "* Sort array using specified collator, maintaining index association."
    ],
    "collator_compare": [
        "int collator_compare( Collator $coll, string $str1, string $str2 )",
        "* Compare two strings."
    ],
    "collator_create": [
        "Collator collator_create( string $locale )",
        "* Create collator."
    ],
    "collator_get_attribute": [
        "int collator_get_attribute( Collator $coll, int $attr )",
        "* Get collation attribute value."
    ],
    "collator_get_error_code": [
        "int collator_get_error_code( Collator $coll )",
        "* Get collator's last error code."
    ],
    "collator_get_error_message": [
        "string collator_get_error_message( Collator $coll )",
        "* Get text description for collator's last error code."
    ],
    "collator_get_locale": [
        "string collator_get_locale( Collator $coll, int $type )",
        "* Gets the locale name of the collator."
    ],
    "collator_get_sort_key": [
        "bool collator_get_sort_key( Collator $coll, string $str )",
        "* Get a sort key for a string from a Collator. }}}"
    ],
    "collator_get_strength": [
        "int collator_get_strength(Collator coll)",
        "* Returns the current collation strength."
    ],
    "collator_set_attribute": [
        "bool collator_set_attribute( Collator $coll, int $attr, int $val )",
        "* Set collation attribute."
    ],
    "collator_set_strength": [
        "bool collator_set_strength(Collator coll, int strength)",
        "* Set the collation strength."
    ],
    "collator_sort": [
        "bool collator_sort(  Collator $coll, array(string) $arr [, int $sort_flags] )",
        "* Sort array using specified collator."
    ],
    "collator_sort_with_sort_keys": [
        "bool collator_sort_with_sort_keys( Collator $coll, array(string) $arr )",
        "* Equivalent to standard PHP sort using Collator.  * Uses ICU ucol_getSortKey for performance."
    ],
    "com_create_guid": [
        "string com_create_guid()",
        "Generate a globally unique identifier (GUID)"
    ],
    "com_event_sink": [
        "bool com_event_sink(object comobject, object sinkobject [, mixed sinkinterface])",
        "Connect events from a COM object to a PHP object"
    ],
    "com_get_active_object": [
        "object com_get_active_object(string progid [, int code_page ])",
        "Returns a handle to an already running instance of a COM object"
    ],
    "com_load_typelib": [
        "bool com_load_typelib(string typelib_name [, int case_insensitive])",
        "Loads a Typelibrary and registers its constants"
    ],
    "com_message_pump": [
        "bool com_message_pump([int timeoutms])",
        "Process COM messages, sleeping for up to timeoutms milliseconds"
    ],
    "com_print_typeinfo": [
        "bool com_print_typeinfo(object comobject | string typelib, string dispinterface, bool wantsink)",
        "Print out a PHP class definition for a dispatchable interface"
    ],
    "compact": [
        "array compact(mixed var_names [, mixed ...])",
        "Creates a hash containing variables and their values"
    ],
    "compose_locale": [
        "static string compose_locale($array)",
        "* Creates a locale by combining the parts of locale-ID passed  * }}}"
    ],
    "confirm_extname_compiled": [
        "string confirm_extname_compiled(string arg)",
        "Return a string to confirm that the module is compiled in"
    ],
    "connection_aborted": [
        "int connection_aborted()",
        "Returns true if client disconnected"
    ],
    "connection_status": [
        "int connection_status()",
        "Returns the connection status bitfield"
    ],
    "constant": [
        "mixed constant(string const_name)",
        "Given the name of a constant this function will return the constant's associated value"
    ],
    "convert_cyr_string": [
        "string convert_cyr_string(string str, string from, string to)",
        "Convert from one Cyrillic character set to another"
    ],
    "convert_uudecode": [
        "string convert_uudecode(string data)",
        "decode a uuencoded string"
    ],
    "convert_uuencode": [
        "string convert_uuencode(string data)",
        "uuencode a string"
    ],
    "copy": [
        "bool copy(string source_file, string destination_file [, resource context])",
        "Copy a file"
    ],
    "cos": [
        "float cos(float number)",
        "Returns the cosine of the number in radians"
    ],
    "cosh": [
        "float cosh(float number)",
        "Returns the hyperbolic cosine of the number, defined as (exp(number) + exp(-number))/2"
    ],
    "count": [
        "int count(mixed var [, int mode])",
        "Count the number of elements in a variable (usually an array)"
    ],
    "count_chars": [
        "mixed count_chars(string input [, int mode])",
        "Returns info about what characters are used in input"
    ],
    "crc32": [
        "string crc32(string str)",
        "Calculate the crc32 polynomial of a string"
    ],
    "create_function": [
        "string create_function(string args, string code)",
        "Creates an anonymous function, and returns its name"
    ],
    "crypt": [
        "string crypt(string str [, string salt])",
        "Hash a string"
    ],
    "ctype_alnum": [
        "bool ctype_alnum(mixed c)",
        "Checks for alphanumeric character(s)"
    ],
    "ctype_alpha": [
        "bool ctype_alpha(mixed c)",
        "Checks for alphabetic character(s)"
    ],
    "ctype_cntrl": [
        "bool ctype_cntrl(mixed c)",
        "Checks for control character(s)"
    ],
    "ctype_digit": [
        "bool ctype_digit(mixed c)",
        "Checks for numeric character(s)"
    ],
    "ctype_graph": [
        "bool ctype_graph(mixed c)",
        "Checks for any printable character(s) except space"
    ],
    "ctype_lower": [
        "bool ctype_lower(mixed c)",
        "Checks for lowercase character(s)"
    ],
    "ctype_print": [
        "bool ctype_print(mixed c)",
        "Checks for printable character(s)"
    ],
    "ctype_punct": [
        "bool ctype_punct(mixed c)",
        "Checks for any printable character which is not whitespace or an alphanumeric character"
    ],
    "ctype_space": [
        "bool ctype_space(mixed c)",
        "Checks for whitespace character(s)"
    ],
    "ctype_upper": [
        "bool ctype_upper(mixed c)",
        "Checks for uppercase character(s)"
    ],
    "ctype_xdigit": [
        "bool ctype_xdigit(mixed c)",
        "Checks for character(s) representing a hexadecimal digit"
    ],
    "curl_close": [
        "void curl_close(resource ch)",
        "Close a cURL session"
    ],
    "curl_copy_handle": [
        "resource curl_copy_handle(resource ch)",
        "Copy a cURL handle along with all of it's preferences"
    ],
    "curl_errno": [
        "int curl_errno(resource ch)",
        "Return an integer containing the last error number"
    ],
    "curl_error": [
        "string curl_error(resource ch)",
        "Return a string contain the last error for the current session"
    ],
    "curl_exec": [
        "bool curl_exec(resource ch)",
        "Perform a cURL session"
    ],
    "curl_getinfo": [
        "mixed curl_getinfo(resource ch [, int option])",
        "Get information regarding a specific transfer"
    ],
    "curl_init": [
        "resource curl_init([string url])",
        "Initialize a cURL session"
    ],
    "curl_multi_add_handle": [
        "int curl_multi_add_handle(resource mh, resource ch)",
        "Add a normal cURL handle to a cURL multi handle"
    ],
    "curl_multi_close": [
        "void curl_multi_close(resource mh)",
        "Close a set of cURL handles"
    ],
    "curl_multi_exec": [
        "int curl_multi_exec(resource mh, int &still_running)",
        "Run the sub-connections of the current cURL handle"
    ],
    "curl_multi_getcontent": [
        "string curl_multi_getcontent(resource ch)",
        "Return the content of a cURL handle if CURLOPT_RETURNTRANSFER is set"
    ],
    "curl_multi_info_read": [
        "array curl_multi_info_read(resource mh [, long msgs_in_queue])",
        "Get information about the current transfers"
    ],
    "curl_multi_init": [
        "resource curl_multi_init()",
        "Returns a new cURL multi handle"
    ],
    "curl_multi_remove_handle": [
        "int curl_multi_remove_handle(resource mh, resource ch)",
        "Remove a multi handle from a set of cURL handles"
    ],
    "curl_multi_select": [
        "int curl_multi_select(resource mh[, double timeout])",
        "Get all the sockets associated with the cURL extension, which can then be \"selected\""
    ],
    "curl_setopt": [
        "bool curl_setopt(resource ch, int option, mixed value)",
        "Set an option for a cURL transfer"
    ],
    "curl_setopt_array": [
        "bool curl_setopt_array(resource ch, array options)",
        "Set an array of option for a cURL transfer"
    ],
    "curl_version": [
        "array curl_version([int version])",
        "Return cURL version information."
    ],
    "current": [
        "mixed current(array array_arg)",
        "Return the element currently pointed to by the internal array pointer"
    ],
    "date": [
        "string date(string format [, long timestamp])",
        "Format a local date/time"
    ],
    "date_add": [
        "DateTime date_add(DateTime object, DateInterval interval)",
        "Adds an interval to the current date in object."
    ],
    "date_create": [
        "DateTime date_create([string time[, DateTimeZone object]])",
        "Returns new DateTime object"
    ],
    "date_create_from_format": [
        "DateTime date_create_from_format(string format, string time[, DateTimeZone object])",
        "Returns new DateTime object formatted according to the specified format"
    ],
    "date_date_set": [
        "DateTime date_date_set(DateTime object, long year, long month, long day)",
        "Sets the date."
    ],
    "date_default_timezone_get": [
        "string date_default_timezone_get()",
        "Gets the default timezone used by all date/time functions in a script"
    ],
    "date_default_timezone_set": [
        "bool date_default_timezone_set(string timezone_identifier)",
        "Sets the default timezone used by all date/time functions in a script"
    ],
    "date_diff": [
        "DateInterval date_diff(DateTime object [, bool absolute])",
        "Returns the difference between two DateTime objects."
    ],
    "date_format": [
        "string date_format(DateTime object, string format)",
        "Returns date formatted according to given format"
    ],
    "date_get_last_errors": [
        "array date_get_last_errors()",
        "Returns the warnings and errors found while parsing a date/time string."
    ],
    "date_interval_create_from_date_string": [
        "DateInterval date_interval_create_from_date_string(string time)",
        "Uses the normal date parsers and sets up a DateInterval from the relative parts of the parsed string"
    ],
    "date_interval_format": [
        "string date_interval_format(DateInterval object, string format)",
        "Formats the interval."
    ],
    "date_isodate_set": [
        "DateTime date_isodate_set(DateTime object, long year, long week[, long day])",
        "Sets the ISO date."
    ],
    "date_modify": [
        "DateTime date_modify(DateTime object, string modify)",
        "Alters the timestamp."
    ],
    "date_offset_get": [
        "long date_offset_get(DateTime object)",
        "Returns the DST offset."
    ],
    "date_parse": [
        "array date_parse(string date)",
        "Returns associative array with detailed info about given date"
    ],
    "date_parse_from_format": [
        "array date_parse_from_format(string format, string date)",
        "Returns associative array with detailed info about given date"
    ],
    "date_sub": [
        "DateTime date_sub(DateTime object, DateInterval interval)",
        "Subtracts an interval to the current date in object."
    ],
    "date_sun_info": [
        "array date_sun_info(long time, float latitude, float longitude)",
        "Returns an array with information about sun set/rise and twilight begin/end"
    ],
    "date_sunrise": [
        "mixed date_sunrise(mixed time [, int format [, float latitude [, float longitude [, float zenith [, float gmt_offset]]]]])",
        "Returns time of sunrise for a given day and location"
    ],
    "date_sunset": [
        "mixed date_sunset(mixed time [, int format [, float latitude [, float longitude [, float zenith [, float gmt_offset]]]]])",
        "Returns time of sunset for a given day and location"
    ],
    "date_time_set": [
        "DateTime date_time_set(DateTime object, long hour, long minute[, long second])",
        "Sets the time."
    ],
    "date_timestamp_get": [
        "long date_timestamp_get(DateTime object)",
        "Gets the Unix timestamp."
    ],
    "date_timestamp_set": [
        "DateTime date_timestamp_set(DateTime object, long unixTimestamp)",
        "Sets the date and time based on an Unix timestamp."
    ],
    "date_timezone_get": [
        "DateTimeZone date_timezone_get(DateTime object)",
        "Return new DateTimeZone object relative to give DateTime"
    ],
    "date_timezone_set": [
        "DateTime date_timezone_set(DateTime object, DateTimeZone object)",
        "Sets the timezone for the DateTime object."
    ],
    "datefmt_create": [
        "IntlDateFormatter datefmt_create(string $locale, long date_type, long time_type[, string $timezone_str, long $calendar, string $pattern] )",
        "* Create formatter."
    ],
    "datefmt_format": [
        "string datefmt_format( [mixed]int $args or array $args )",
        "* Format the time value as a string. }}}"
    ],
    "datefmt_get_calendar": [
        "string datefmt_get_calendar( IntlDateFormatter $mf )",
        "* Get formatter calendar."
    ],
    "datefmt_get_datetype": [
        "string datefmt_get_datetype( IntlDateFormatter $mf )",
        "* Get formatter datetype."
    ],
    "datefmt_get_error_code": [
        "int datefmt_get_error_code( IntlDateFormatter $nf )",
        "* Get formatter's last error code."
    ],
    "datefmt_get_error_message": [
        "string datefmt_get_error_message( IntlDateFormatter $coll )",
        "* Get text description for formatter's last error code."
    ],
    "datefmt_get_locale": [
        "string datefmt_get_locale(IntlDateFormatter $mf)",
        "* Get formatter locale."
    ],
    "datefmt_get_pattern": [
        "string datefmt_get_pattern( IntlDateFormatter $mf )",
        "* Get formatter pattern."
    ],
    "datefmt_get_timetype": [
        "string datefmt_get_timetype( IntlDateFormatter $mf )",
        "* Get formatter timetype."
    ],
    "datefmt_get_timezone_id": [
        "string datefmt_get_timezone_id( IntlDateFormatter $mf )",
        "* Get formatter timezone_id."
    ],
    "datefmt_isLenient": [
        "string datefmt_isLenient(IntlDateFormatter $mf)",
        "* Get formatter locale."
    ],
    "datefmt_localtime": [
        "integer datefmt_localtime( IntlDateFormatter $fmt, string $text_to_parse[, int $parse_pos ])",
        "* Parse the string $value to a localtime array  }}}"
    ],
    "datefmt_parse": [
        "integer datefmt_parse( IntlDateFormatter $fmt, string $text_to_parse [, int $parse_pos] )",
        "* Parse the string $value starting at parse_pos to a Unix timestamp -int }}}"
    ],
    "datefmt_setLenient": [
        "string datefmt_setLenient(IntlDateFormatter $mf)",
        "* Set formatter lenient."
    ],
    "datefmt_set_calendar": [
        "bool datefmt_set_calendar( IntlDateFormatter $mf, int $calendar )",
        "* Set formatter calendar."
    ],
    "datefmt_set_pattern": [
        "bool datefmt_set_pattern( IntlDateFormatter $mf, string $pattern )",
        "* Set formatter pattern."
    ],
    "datefmt_set_timezone_id": [
        "bool datefmt_set_timezone_id( IntlDateFormatter $mf,$timezone_id)",
        "* Set formatter timezone_id."
    ],
    "dba_close": [
        "void dba_close(resource handle)",
        "Closes database"
    ],
    "dba_delete": [
        "bool dba_delete(string key, resource handle)",
        "Deletes the entry associated with key    If inifile: remove all other key lines"
    ],
    "dba_exists": [
        "bool dba_exists(string key, resource handle)",
        "Checks, if the specified key exists"
    ],
    "dba_fetch": [
        "string dba_fetch(string key, [int skip ,] resource handle)",
        "Fetches the data associated with key"
    ],
    "dba_firstkey": [
        "string dba_firstkey(resource handle)",
        "Resets the internal key pointer and returns the first key"
    ],
    "dba_handlers": [
        "array dba_handlers([bool full_info])",
        "List configured database handlers"
    ],
    "dba_insert": [
        "bool dba_insert(string key, string value, resource handle)",
        "If not inifile: Insert value as key, return false, if key exists already     If inifile: Add vakue as key (next instance of key)"
    ],
    "dba_key_split": [
        "array|false dba_key_split(string key)",
        "Splits an inifile key into an array of the form array(0=>group,1=>value_name) but returns false if input is false or null"
    ],
    "dba_list": [
        "array dba_list()",
        "List opened databases"
    ],
    "dba_nextkey": [
        "string dba_nextkey(resource handle)",
        "Returns the next key"
    ],
    "dba_open": [
        "resource dba_open(string path, string mode [, string handlername, string ...])",
        "Opens path using the specified handler in mode"
    ],
    "dba_optimize": [
        "bool dba_optimize(resource handle)",
        "Optimizes (e.g. clean up, vacuum) database"
    ],
    "dba_popen": [
        "resource dba_popen(string path, string mode [, string handlername, string ...])",
        "Opens path using the specified handler in mode persistently"
    ],
    "dba_replace": [
        "bool dba_replace(string key, string value, resource handle)",
        "Inserts value as key, replaces key, if key exists already    If inifile: remove all other key lines"
    ],
    "dba_sync": [
        "bool dba_sync(resource handle)",
        "Synchronizes database"
    ],
    "dcgettext": [
        "string dcgettext(string domain_name, string msgid, long category)",
        "Return the translation of msgid for domain_name and category, or msgid unaltered if a translation does not exist"
    ],
    "dcngettext": [
        "string dcngettext(string domain, string msgid1, string msgid2, int n, int category)",
        "Plural version of dcgettext()"
    ],
    "debug_backtrace": [
        "array debug_backtrace([bool provide_object])",
        "Return backtrace as array"
    ],
    "debug_print_backtrace": [
        "void debug_print_backtrace()",
        "Prints a PHP backtrace"
    ],
    "debug_zval_dump": [
        "void debug_zval_dump(mixed var)",
        "Dumps a string representation of an internal Zend value to output"
    ],
    "decbin": [
        "string decbin(int decimal_number)",
        "Returns a string containing a binary representation of the number"
    ],
    "dechex": [
        "string dechex(int decimal_number)",
        "Returns a string containing a hexadecimal representation of the given number"
    ],
    "decoct": [
        "string decoct(int decimal_number)",
        "Returns a string containing an octal representation of the given number"
    ],
    "define": [
        "bool define(string constant_name, mixed value, bool case_insensitive=false)",
        "Define a new constant"
    ],
    "define_syslog_variables": [
        "void define_syslog_variables()",
        "Initializes all syslog-related variables"
    ],
    "defined": [
        "bool defined(string constant_name)",
        "Check whether a constant exists"
    ],
    "deg2rad": [
        "float deg2rad(float number)",
        "Converts the number in degrees to the radian equivalent"
    ],
    "dgettext": [
        "string dgettext(string domain_name, string msgid)",
        "Return the translation of msgid for domain_name, or msgid unaltered if a translation does not exist"
    ],
    "die": [
        "void die([mixed status])",
        "Output a message and terminate the current script"
    ],
    "dir": [
        "object dir(string directory[, resource context])",
        "Directory class with properties, handle and class and methods read, rewind and close"
    ],
    "dirname": [
        "string dirname(string path)",
        "Returns the directory name component of the path"
    ],
    "disk_free_space": [
        "float disk_free_space(string path)",
        "Get free disk space for filesystem that path is on"
    ],
    "disk_total_space": [
        "float disk_total_space(string path)",
        "Get total disk space for filesystem that path is on"
    ],
    "display_disabled_function": [
        "void display_disabled_function()",
        "Dummy function which displays an error when a disabled function is called."
    ],
    "dl": [
        "int dl(string extension_filename)",
        "Load a PHP extension at runtime"
    ],
    "dngettext": [
        "string dngettext(string domain, string msgid1, string msgid2, int count)",
        "Plural version of dgettext()"
    ],
    "dns_check_record": [
        "bool dns_check_record(string host [, string type])",
        "Check DNS records corresponding to a given Internet host name or IP address"
    ],
    "dns_get_mx": [
        "bool dns_get_mx(string hostname, array mxhosts [, array weight])",
        "Get MX records corresponding to a given Internet host name"
    ],
    "dns_get_record": [
        "array|false dns_get_record(string hostname [, int type[, array authns, array addtl]])",
        "Get any Resource Record corresponding to a given Internet host name"
    ],
    "dom_attr_is_id": [
        "bool dom_attr_is_id()",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#Attr-isId Since: DOM Level 3"
    ],
    "dom_characterdata_append_data": [
        "void dom_characterdata_append_data(string arg)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-32791A2F Since:"
    ],
    "dom_characterdata_delete_data": [
        "void dom_characterdata_delete_data(int offset, int count)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-7C603781 Since:"
    ],
    "dom_characterdata_insert_data": [
        "void dom_characterdata_insert_data(int offset, string arg)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-3EDB695F Since:"
    ],
    "dom_characterdata_replace_data": [
        "void dom_characterdata_replace_data(int offset, int count, string arg)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-E5CBA7FB Since:"
    ],
    "dom_characterdata_substring_data": [
        "string dom_characterdata_substring_data(int offset, int count)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-6531BCCF Since:"
    ],
    "dom_document_adopt_node": [
        "DOMNode dom_document_adopt_node(DOMNode source)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-Document3-adoptNode Since: DOM Level 3"
    ],
    "dom_document_create_attribute": [
        "DOMAttr dom_document_create_attribute(string name)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-1084891198 Since:"
    ],
    "dom_document_create_attribute_ns": [
        "DOMAttr dom_document_create_attribute_ns(string namespaceURI, string qualifiedName)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-DocCrAttrNS Since: DOM Level 2"
    ],
    "dom_document_create_cdatasection": [
        "DOMCdataSection dom_document_create_cdatasection(string data)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-D26C0AF8 Since:"
    ],
    "dom_document_create_comment": [
        "DOMComment dom_document_create_comment(string data)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-1334481328 Since:"
    ],
    "dom_document_create_document_fragment": [
        "DOMDocumentFragment dom_document_create_document_fragment()",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-35CB04B5 Since:"
    ],
    "dom_document_create_element": [
        "DOMElement dom_document_create_element(string tagName [, string value])",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-2141741547 Since:"
    ],
    "dom_document_create_element_ns": [
        "DOMElement dom_document_create_element_ns(string namespaceURI, string qualifiedName [,string value])",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-DocCrElNS Since: DOM Level 2"
    ],
    "dom_document_create_entity_reference": [
        "DOMEntityReference dom_document_create_entity_reference(string name)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-392B75AE Since:"
    ],
    "dom_document_create_processing_instruction": [
        "DOMProcessingInstruction dom_document_create_processing_instruction(string target, string data)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-135944439 Since:"
    ],
    "dom_document_create_text_node": [
        "DOMText dom_document_create_text_node(string data)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-1975348127 Since:"
    ],
    "dom_document_get_element_by_id": [
        "DOMElement dom_document_get_element_by_id(string elementId)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-getElBId Since: DOM Level 2"
    ],
    "dom_document_get_elements_by_tag_name": [
        "DOMNodeList dom_document_get_elements_by_tag_name(string tagname)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-A6C9094 Since:"
    ],
    "dom_document_get_elements_by_tag_name_ns": [
        "DOMNodeList dom_document_get_elements_by_tag_name_ns(string namespaceURI, string localName)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-getElBTNNS Since: DOM Level 2"
    ],
    "dom_document_import_node": [
        "DOMNode dom_document_import_node(DOMNode importedNode, bool deep)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#Core-Document-importNode Since: DOM Level 2"
    ],
    "dom_document_load": [
        "DOMNode dom_document_load(string source [, int options])",
        "URL: http://www.w3.org/TR/DOM-Level-3-LS/load-save.html#LS-DocumentLS-load Since: DOM Level 3"
    ],
    "dom_document_load_html": [
        "DOMNode dom_document_load_html(string source)",
        "Since: DOM extended"
    ],
    "dom_document_load_html_file": [
        "DOMNode dom_document_load_html_file(string source)",
        "Since: DOM extended"
    ],
    "dom_document_loadxml": [
        "DOMNode dom_document_loadxml(string source [, int options])",
        "URL: http://www.w3.org/TR/DOM-Level-3-LS/load-save.html#LS-DocumentLS-loadXML Since: DOM Level 3"
    ],
    "dom_document_normalize_document": [
        "void dom_document_normalize_document()",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-Document3-normalizeDocument Since: DOM Level 3"
    ],
    "dom_document_relaxNG_validate_file": [
        "bool dom_document_relaxNG_validate_file(string filename); */",
        "PHP_FUNCTION(dom_document_relaxNG_validate_file) {  _dom_document_relaxNG_validate(INTERNAL_FUNCTION_PARAM_PASSTHRU, DOM_LOAD_FILE); } /* }}} end dom_document_relaxNG_validate_file"
    ],
    "dom_document_relaxNG_validate_xml": [
        "bool dom_document_relaxNG_validate_xml(string source); */",
        "PHP_FUNCTION(dom_document_relaxNG_validate_xml) {  _dom_document_relaxNG_validate(INTERNAL_FUNCTION_PARAM_PASSTHRU, DOM_LOAD_STRING); } /* }}} end dom_document_relaxNG_validate_xml"
    ],
    "dom_document_rename_node": [
        "DOMNode dom_document_rename_node(node n, string namespaceURI, string qualifiedName)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-Document3-renameNode Since: DOM Level 3"
    ],
    "dom_document_save": [
        "int dom_document_save(string file)",
        "Convenience method to save to file"
    ],
    "dom_document_save_html": [
        "string dom_document_save_html()",
        "Convenience method to output as html"
    ],
    "dom_document_save_html_file": [
        "int dom_document_save_html_file(string file)",
        "Convenience method to save to file as html"
    ],
    "dom_document_savexml": [
        "string dom_document_savexml([node n])",
        "URL: http://www.w3.org/TR/DOM-Level-3-LS/load-save.html#LS-DocumentLS-saveXML Since: DOM Level 3"
    ],
    "dom_document_schema_validate": [
        "bool dom_document_schema_validate(string source); */",
        "PHP_FUNCTION(dom_document_schema_validate_xml) {  _dom_document_schema_validate(INTERNAL_FUNCTION_PARAM_PASSTHRU, DOM_LOAD_STRING); } /* }}} end dom_document_schema_validate"
    ],
    "dom_document_schema_validate_file": [
        "bool dom_document_schema_validate_file(string filename); */",
        "PHP_FUNCTION(dom_document_schema_validate_file) {  _dom_document_schema_validate(INTERNAL_FUNCTION_PARAM_PASSTHRU, DOM_LOAD_FILE); } /* }}} end dom_document_schema_validate_file"
    ],
    "dom_document_validate": [
        "bool dom_document_validate()",
        "Since: DOM extended"
    ],
    "dom_document_xinclude": [
        "int dom_document_xinclude([int options])",
        "Substitutues xincludes in a DomDocument"
    ],
    "dom_domconfiguration_can_set_parameter": [
        "bool dom_domconfiguration_can_set_parameter(string name, domuserdata value)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#DOMConfiguration-canSetParameter Since:"
    ],
    "dom_domconfiguration_get_parameter": [
        "domdomuserdata dom_domconfiguration_get_parameter(string name)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#DOMConfiguration-getParameter Since:"
    ],
    "dom_domconfiguration_set_parameter": [
        "dom_void dom_domconfiguration_set_parameter(string name, domuserdata value)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#DOMConfiguration-property Since:"
    ],
    "dom_domerrorhandler_handle_error": [
        "dom_bool dom_domerrorhandler_handle_error(domerror error)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#ID-ERRORS-DOMErrorHandler-handleError Since:"
    ],
    "dom_domimplementation_create_document": [
        "DOMDocument dom_domimplementation_create_document(string namespaceURI, string qualifiedName, DOMDocumentType doctype)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#Level-2-Core-DOM-createDocument Since: DOM Level 2"
    ],
    "dom_domimplementation_create_document_type": [
        "DOMDocumentType dom_domimplementation_create_document_type(string qualifiedName, string publicId, string systemId)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#Level-2-Core-DOM-createDocType Since: DOM Level 2"
    ],
    "dom_domimplementation_get_feature": [
        "DOMNode dom_domimplementation_get_feature(string feature, string version)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#DOMImplementation3-getFeature Since: DOM Level 3"
    ],
    "dom_domimplementation_has_feature": [
        "bool dom_domimplementation_has_feature(string feature, string version)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#ID-5CED94D7 Since:"
    ],
    "dom_domimplementationlist_item": [
        "domdomimplementation dom_domimplementationlist_item(int index)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#DOMImplementationList-item Since:"
    ],
    "dom_domimplementationsource_get_domimplementation": [
        "domdomimplementation dom_domimplementationsource_get_domimplementation(string features)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#ID-getDOMImpl Since:"
    ],
    "dom_domimplementationsource_get_domimplementations": [
        "domimplementationlist dom_domimplementationsource_get_domimplementations(string features)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#ID-getDOMImpls Since:"
    ],
    "dom_domstringlist_item": [
        "domstring dom_domstringlist_item(int index)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#DOMStringList-item Since:"
    ],
    "dom_element_get_attribute": [
        "string dom_element_get_attribute(string name)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-666EE0F9 Since:"
    ],
    "dom_element_get_attribute_node": [
        "DOMAttr dom_element_get_attribute_node(string name)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-217A91B8 Since:"
    ],
    "dom_element_get_attribute_node_ns": [
        "DOMAttr dom_element_get_attribute_node_ns(string namespaceURI, string localName)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-ElGetAtNodeNS Since: DOM Level 2"
    ],
    "dom_element_get_attribute_ns": [
        "string dom_element_get_attribute_ns(string namespaceURI, string localName)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-ElGetAttrNS Since: DOM Level 2"
    ],
    "dom_element_get_elements_by_tag_name": [
        "DOMNodeList dom_element_get_elements_by_tag_name(string name)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-1938918D Since:"
    ],
    "dom_element_get_elements_by_tag_name_ns": [
        "DOMNodeList dom_element_get_elements_by_tag_name_ns(string namespaceURI, string localName)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-A6C90942 Since: DOM Level 2"
    ],
    "dom_element_has_attribute": [
        "bool dom_element_has_attribute(string name)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-ElHasAttr Since: DOM Level 2"
    ],
    "dom_element_has_attribute_ns": [
        "bool dom_element_has_attribute_ns(string namespaceURI, string localName)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-ElHasAttrNS Since: DOM Level 2"
    ],
    "dom_element_remove_attribute": [
        "void dom_element_remove_attribute(string name)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-6D6AC0F9 Since:"
    ],
    "dom_element_remove_attribute_node": [
        "DOMAttr dom_element_remove_attribute_node(DOMAttr oldAttr)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-D589198 Since:"
    ],
    "dom_element_remove_attribute_ns": [
        "void dom_element_remove_attribute_ns(string namespaceURI, string localName)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-ElRemAtNS Since: DOM Level 2"
    ],
    "dom_element_set_attribute": [
        "void dom_element_set_attribute(string name, string value)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-F68F082 Since:"
    ],
    "dom_element_set_attribute_node": [
        "DOMAttr dom_element_set_attribute_node(DOMAttr newAttr)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-887236154 Since:"
    ],
    "dom_element_set_attribute_node_ns": [
        "DOMAttr dom_element_set_attribute_node_ns(DOMAttr newAttr)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-ElSetAtNodeNS Since: DOM Level 2"
    ],
    "dom_element_set_attribute_ns": [
        "void dom_element_set_attribute_ns(string namespaceURI, string qualifiedName, string value)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-ElSetAttrNS Since: DOM Level 2"
    ],
    "dom_element_set_id_attribute": [
        "void dom_element_set_id_attribute(string name, bool isId)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-ElSetIdAttr Since: DOM Level 3"
    ],
    "dom_element_set_id_attribute_node": [
        "void dom_element_set_id_attribute_node(attr idAttr, bool isId)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-ElSetIdAttrNode Since: DOM Level 3"
    ],
    "dom_element_set_id_attribute_ns": [
        "void dom_element_set_id_attribute_ns(string namespaceURI, string localName, bool isId)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-ElSetIdAttrNS Since: DOM Level 3"
    ],
    "dom_import_simplexml": [
        "somNode dom_import_simplexml(sxeobject node)",
        "Get a simplexml_element object from dom to allow for processing"
    ],
    "dom_namednodemap_get_named_item": [
        "DOMNode dom_namednodemap_get_named_item(string name)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-1074577549 Since:"
    ],
    "dom_namednodemap_get_named_item_ns": [
        "DOMNode dom_namednodemap_get_named_item_ns(string namespaceURI, string localName)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-getNamedItemNS Since: DOM Level 2"
    ],
    "dom_namednodemap_item": [
        "DOMNode dom_namednodemap_item(int index)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-349467F9 Since:"
    ],
    "dom_namednodemap_remove_named_item": [
        "DOMNode dom_namednodemap_remove_named_item(string name)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-D58B193 Since:"
    ],
    "dom_namednodemap_remove_named_item_ns": [
        "DOMNode dom_namednodemap_remove_named_item_ns(string namespaceURI, string localName)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-removeNamedItemNS Since: DOM Level 2"
    ],
    "dom_namednodemap_set_named_item": [
        "DOMNode dom_namednodemap_set_named_item(DOMNode arg)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-1025163788 Since:"
    ],
    "dom_namednodemap_set_named_item_ns": [
        "DOMNode dom_namednodemap_set_named_item_ns(DOMNode arg)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-setNamedItemNS Since: DOM Level 2"
    ],
    "dom_namelist_get_name": [
        "string dom_namelist_get_name(int index)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#NameList-getName Since:"
    ],
    "dom_namelist_get_namespace_uri": [
        "string dom_namelist_get_namespace_uri(int index)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#NameList-getNamespaceURI Since:"
    ],
    "dom_node_append_child": [
        "DomNode dom_node_append_child(DomNode newChild)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-184E7107 Since:"
    ],
    "dom_node_clone_node": [
        "DomNode dom_node_clone_node(bool deep)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-3A0ED0A4 Since:"
    ],
    "dom_node_compare_document_position": [
        "short dom_node_compare_document_position(DomNode other)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#Node3-compareDocumentPosition Since: DOM Level 3"
    ],
    "dom_node_get_feature": [
        "DomNode dom_node_get_feature(string feature, string version)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#Node3-getFeature Since: DOM Level 3"
    ],
    "dom_node_get_user_data": [
        "mixed dom_node_get_user_data(string key)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#Node3-getUserData Since: DOM Level 3"
    ],
    "dom_node_has_attributes": [
        "bool dom_node_has_attributes()",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-NodeHasAttrs Since: DOM Level 2"
    ],
    "dom_node_has_child_nodes": [
        "bool dom_node_has_child_nodes()",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-810594187 Since:"
    ],
    "dom_node_insert_before": [
        "domnode dom_node_insert_before(DomNode newChild, DomNode refChild)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-952280727 Since:"
    ],
    "dom_node_is_default_namespace": [
        "bool dom_node_is_default_namespace(string namespaceURI)",
        "URL: http://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-isDefaultNamespace Since: DOM Level 3"
    ],
    "dom_node_is_equal_node": [
        "bool dom_node_is_equal_node(DomNode arg)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#Node3-isEqualNode Since: DOM Level 3"
    ],
    "dom_node_is_same_node": [
        "bool dom_node_is_same_node(DomNode other)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#Node3-isSameNode Since: DOM Level 3"
    ],
    "dom_node_is_supported": [
        "bool dom_node_is_supported(string feature, string version)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-Level-2-Core-Node-supports Since: DOM Level 2"
    ],
    "dom_node_lookup_namespace_uri": [
        "string dom_node_lookup_namespace_uri(string prefix)",
        "URL: http://www.w3.org/TR/DOM-Level-3-Core/core.html#Node3-lookupNamespaceURI Since: DOM Level 3"
    ],
    "dom_node_lookup_prefix": [
        "string dom_node_lookup_prefix(string namespaceURI)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#Node3-lookupNamespacePrefix Since: DOM Level 3"
    ],
    "dom_node_normalize": [
        "void dom_node_normalize()",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-normalize Since:"
    ],
    "dom_node_remove_child": [
        "DomNode dom_node_remove_child(DomNode oldChild)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-1734834066 Since:"
    ],
    "dom_node_replace_child": [
        "DomNode dom_node_replace_child(DomNode newChild, DomNode oldChild)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-785887307 Since:"
    ],
    "dom_node_set_user_data": [
        "mixed dom_node_set_user_data(string key, mixed data, userdatahandler handler)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#Node3-setUserData Since: DOM Level 3"
    ],
    "dom_nodelist_item": [
        "DOMNode dom_nodelist_item(int index)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#ID-844377136 Since:"
    ],
    "dom_string_extend_find_offset16": [
        "int dom_string_extend_find_offset16(int offset32)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#i18n-methods-StringExtend-findOffset16 Since:"
    ],
    "dom_string_extend_find_offset32": [
        "int dom_string_extend_find_offset32(int offset16)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#i18n-methods-StringExtend-findOffset32 Since:"
    ],
    "dom_text_is_whitespace_in_element_content": [
        "bool dom_text_is_whitespace_in_element_content()",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-Text3-isWhitespaceInElementContent Since: DOM Level 3"
    ],
    "dom_text_replace_whole_text": [
        "DOMText dom_text_replace_whole_text(string content)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-Text3-replaceWholeText Since: DOM Level 3"
    ],
    "dom_text_split_text": [
        "DOMText dom_text_split_text(int offset)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#core-ID-38853C1D Since:"
    ],
    "dom_userdatahandler_handle": [
        "dom_void dom_userdatahandler_handle(short operation, string key, domobject data, node src, node dst)",
        "URL: http://www.w3.org/TR/2003/WD-DOM-Level-3-Core-20030226/DOM3-Core.html#ID-handleUserDataEvent Since:"
    ],
    "dom_xpath_evaluate": [
        "mixed dom_xpath_evaluate(string expr [,DOMNode context])",
        ""
    ],
    "dom_xpath_query": [
        "DOMNodeList dom_xpath_query(string expr [,DOMNode context])",
        ""
    ],
    "dom_xpath_register_ns": [
        "bool dom_xpath_register_ns(string prefix, string uri)",
        ""
    ],
    "dom_xpath_register_php_functions": [
        "void dom_xpath_register_php_functions()",
        ""
    ],
    "each": [
        "array each(array arr)",
        "Return the currently pointed key..value pair in the passed array, and advance the pointer to the next element"
    ],
    "easter_date": [
        "int easter_date([int year])",
        "Return the timestamp of midnight on Easter of a given year (defaults to current year)"
    ],
    "easter_days": [
        "int easter_days([int year, [int method]])",
        "Return the number of days after March 21 that Easter falls on for a given year (defaults to current year)"
    ],
    "echo": [
        "void echo(string arg1 [, string ...])",
        "Output one or more strings"
    ],
    "empty": [
        "bool empty(mixed var)",
        "Determine whether a variable is empty"
    ],
    "enchant_broker_describe": [
        "array enchant_broker_describe(resource broker)",
        "Enumerates the Enchant providers and tells you some rudimentary information about them. The same info is provided through phpinfo()"
    ],
    "enchant_broker_dict_exists": [
        "bool enchant_broker_dict_exists(resource broker, string tag)",
        "Whether a dictionary exists or not. Using non-empty tag"
    ],
    "enchant_broker_free": [
        "bool enchant_broker_free(resource broker)",
        "Destroys the broker object and its dictionnaries"
    ],
    "enchant_broker_free_dict": [
        "resource enchant_broker_free_dict(resource dict)",
        "Free the dictionary resource"
    ],
    "enchant_broker_get_dict_path": [
        "string enchant_broker_get_dict_path(resource broker, int dict_type)",
        "Get the directory path for a given backend, works with ispell and myspell"
    ],
    "enchant_broker_get_error": [
        "string enchant_broker_get_error(resource broker)",
        "Returns the last error of the broker"
    ],
    "enchant_broker_init": [
        "resource enchant_broker_init()",
        "create a new broker object capable of requesting"
    ],
    "enchant_broker_list_dicts": [
        "string enchant_broker_list_dicts(resource broker)",
        "Lists the dictionaries available for the given broker"
    ],
    "enchant_broker_request_dict": [
        "resource enchant_broker_request_dict(resource broker, string tag)",
        "create a new dictionary using tag, the non-empty language tag you wish to request  a dictionary for (\"en_US\", \"de_DE\", ...)"
    ],
    "enchant_broker_request_pwl_dict": [
        "resource enchant_broker_request_pwl_dict(resource broker, string filename)",
        "creates a dictionary using a PWL file. A PWL file is personal word file one word per line. It must exist before the call."
    ],
    "enchant_broker_set_dict_path": [
        "bool enchant_broker_set_dict_path(resource broker, int dict_type, string value)",
        "Set the directory path for a given backend, works with ispell and myspell"
    ],
    "enchant_broker_set_ordering": [
        "bool enchant_broker_set_ordering(resource broker, string tag, string ordering)",
        "Declares a preference of dictionaries to use for the language  described/referred to by 'tag'. The ordering is a comma delimited  list of provider names. As a special exception, the \"*\" tag can  be used as a language tag to declare a default ordering for any  language that does not explictly declare an ordering."
    ],
    "enchant_dict_add_to_personal": [
        "void enchant_dict_add_to_personal(resource dict, string word)",
        "add 'word' to personal word list"
    ],
    "enchant_dict_add_to_session": [
        "void enchant_dict_add_to_session(resource dict, string word)",
        "add 'word' to this spell-checking session"
    ],
    "enchant_dict_check": [
        "bool enchant_dict_check(resource dict, string word)",
        "If the word is correctly spelled return true, otherwise return false"
    ],
    "enchant_dict_describe": [
        "array enchant_dict_describe(resource dict)",
        "Describes an individual dictionary 'dict'"
    ],
    "enchant_dict_get_error": [
        "string enchant_dict_get_error(resource dict)",
        "Returns the last error of the current spelling-session"
    ],
    "enchant_dict_is_in_session": [
        "bool enchant_dict_is_in_session(resource dict, string word)",
        "whether or not 'word' exists in this spelling-session"
    ],
    "enchant_dict_quick_check": [
        "bool enchant_dict_quick_check(resource dict, string word [, array &suggestions])",
        "If the word is correctly spelled return true, otherwise return false, if suggestions variable     is provided, fill it with spelling alternatives."
    ],
    "enchant_dict_store_replacement": [
        "void enchant_dict_store_replacement(resource dict, string mis, string cor)",
        "add a correction for 'mis' using 'cor'.  Notes that you replaced @mis with @cor, so it's possibly more likely  that future occurrences of @mis will be replaced with @cor. So it might  bump @cor up in the suggestion list."
    ],
    "enchant_dict_suggest": [
        "array enchant_dict_suggest(resource dict, string word)",
        "Will return a list of values if any of those pre-conditions are not met."
    ],
    "end": [
        "mixed end(array array_arg)",
        "Advances array argument's internal pointer to the last element and return it"
    ],
    "ereg": [
        "int ereg(string pattern, string string [, array registers])",
        "Regular expression match"
    ],
    "ereg_replace": [
        "string ereg_replace(string pattern, string replacement, string string)",
        "Replace regular expression"
    ],
    "eregi": [
        "int eregi(string pattern, string string [, array registers])",
        "Case-insensitive regular expression match"
    ],
    "eregi_replace": [
        "string eregi_replace(string pattern, string replacement, string string)",
        "Case insensitive replace regular expression"
    ],
    "error_get_last": [
        "array error_get_last()",
        "Get the last occurred error as associative array. Returns NULL if there hasn't been an error yet."
    ],
    "error_log": [
        "bool error_log(string message [, int message_type [, string destination [, string extra_headers]]])",
        "Send an error message somewhere"
    ],
    "error_reporting": [
        "int error_reporting([int new_error_level])",
        "Return the current error_reporting level, and if an argument was passed - change to the new level"
    ],
    "escapeshellarg": [
        "string escapeshellarg(string arg)",
        "Quote and escape an argument for use in a shell command"
    ],
    "escapeshellcmd": [
        "string escapeshellcmd(string command)",
        "Escape shell metacharacters"
    ],
    "exec": [
        "string exec(string command [, array &output [, int &return_value]])",
        "Execute an external program"
    ],
    "exif_imagetype": [
        "int exif_imagetype(string imagefile)",
        "Get the type of an image"
    ],
    "exif_read_data": [
        "array exif_read_data(string filename [, sections_needed [, sub_arrays[, read_thumbnail]]])",
        "Reads header data from the JPEG/TIFF image filename and optionally reads the internal thumbnails"
    ],
    "exif_tagname": [
        "string exif_tagname(index)",
        "Get headername for index or false if not defined"
    ],
    "exif_thumbnail": [
        "string exif_thumbnail(string filename [, &width, &height [, &imagetype]])",
        "Reads the embedded thumbnail"
    ],
    "exit": [
        "void exit([mixed status])",
        "Output a message and terminate the current script"
    ],
    "exp": [
        "float exp(float number)",
        "Returns e raised to the power of the number"
    ],
    "explode": [
        "array explode(string separator, string str [, int limit])",
        "Splits a string on string separator and return array of components. If limit is positive only limit number of components is returned. If limit is negative all components except the last abs(limit) are returned."
    ],
    "expm1": [
        "float expm1(float number)",
        "Returns exp(number) - 1, computed in a way that accurate even when the value of number is close to zero"
    ],
    "extension_loaded": [
        "bool extension_loaded(string extension_name)",
        "Returns true if the named extension is loaded"
    ],
    "extract": [
        "int extract(array var_array [, int extract_type [, string prefix]])",
        "Imports variables into symbol table from an array"
    ],
    "ezmlm_hash": [
        "int ezmlm_hash(string addr)",
        "Calculate EZMLM list hash value."
    ],
    "fclose": [
        "bool fclose(resource fp)",
        "Close an open file pointer"
    ],
    "feof": [
        "bool feof(resource fp)",
        "Test for end-of-file on a file pointer"
    ],
    "fflush": [
        "bool fflush(resource fp)",
        "Flushes output"
    ],
    "fgetc": [
        "string fgetc(resource fp)",
        "Get a character from file pointer"
    ],
    "fgetcsv": [
        "array fgetcsv(resource fp [,int length [, string delimiter [, string enclosure [, string escape]]]])",
        "Get line from file pointer and parse for CSV fields"
    ],
    "fgets": [
        "string fgets(resource fp[, int length])",
        "Get a line from file pointer"
    ],
    "fgetss": [
        "string fgetss(resource fp [, int length [, string allowable_tags]])",
        "Get a line from file pointer and strip HTML tags"
    ],
    "file": [
        "array file(string filename [, int flags[, resource context]])",
        "Read entire file into an array"
    ],
    "file_exists": [
        "bool file_exists(string filename)",
        "Returns true if filename exists"
    ],
    "file_get_contents": [
        "string file_get_contents(string filename [, bool use_include_path [, resource context [, long offset [, long maxlen]]]])",
        "Read the entire file into a string"
    ],
    "file_put_contents": [
        "int file_put_contents(string file, mixed data [, int flags [, resource context]])",
        "Write/Create a file with contents data and return the number of bytes written"
    ],
    "fileatime": [
        "int fileatime(string filename)",
        "Get last access time of file"
    ],
    "filectime": [
        "int filectime(string filename)",
        "Get inode modification time of file"
    ],
    "filegroup": [
        "int filegroup(string filename)",
        "Get file group"
    ],
    "fileinode": [
        "int fileinode(string filename)",
        "Get file inode"
    ],
    "filemtime": [
        "int filemtime(string filename)",
        "Get last modification time of file"
    ],
    "fileowner": [
        "int fileowner(string filename)",
        "Get file owner"
    ],
    "fileperms": [
        "int fileperms(string filename)",
        "Get file permissions"
    ],
    "filesize": [
        "int filesize(string filename)",
        "Get file size"
    ],
    "filetype": [
        "string filetype(string filename)",
        "Get file type"
    ],
    "filter_has_var": [
        "mixed filter_has_var(constant type, string variable_name)",
        "* Returns true if the variable with the name 'name' exists in source."
    ],
    "filter_input": [
        "mixed filter_input(constant type, string variable_name [, long filter [, mixed options]])",
        "* Returns the filtered variable 'name'* from source `type`."
    ],
    "filter_input_array": [
        "mixed filter_input_array(constant type, [, mixed options]])",
        "* Returns an array with all arguments defined in 'definition'."
    ],
    "filter_var": [
        "mixed filter_var(mixed variable [, long filter [, mixed options]])",
        "* Returns the filtered version of the vriable."
    ],
    "filter_var_array": [
        "mixed filter_var_array(array data, [, mixed options]])",
        "* Returns an array with all arguments defined in 'definition'."
    ],
    "finfo_buffer": [
        "string finfo_buffer(resource finfo, char *string [, int options [, resource context]])",
        "Return infromation about a string buffer."
    ],
    "finfo_close": [
        "resource finfo_close(resource finfo)",
        "Close fileinfo resource."
    ],
    "finfo_file": [
        "string finfo_file(resource finfo, char *file_name [, int options [, resource context]])",
        "Return information about a file."
    ],
    "finfo_open": [
        "resource finfo_open([int options [, string arg]])",
        "Create a new fileinfo resource."
    ],
    "finfo_set_flags": [
        "bool finfo_set_flags(resource finfo, int options)",
        "Set libmagic configuration options."
    ],
    "floatval": [
        "float floatval(mixed var)",
        "Get the float value of a variable"
    ],
    "flock": [
        "bool flock(resource fp, int operation [, int &wouldblock])",
        "Portable file locking"
    ],
    "floor": [
        "float floor(float number)",
        "Returns the next lowest integer value from the number"
    ],
    "flush": [
        "void flush()",
        "Flush the output buffer"
    ],
    "fmod": [
        "float fmod(float x, float y)",
        "Returns the remainder of dividing x by y as a float"
    ],
    "fnmatch": [
        "bool fnmatch(string pattern, string filename [, int flags])",
        "Match filename against pattern"
    ],
    "fopen": [
        "resource fopen(string filename, string mode [, bool use_include_path [, resource context]])",
        "Open a file or a URL and return a file pointer"
    ],
    "forward_static_call": [
        "mixed forward_static_call(mixed function_name [, mixed parmeter] [, mixed ...])",
        "Call a user function which is the first parameter"
    ],
    "fpassthru": [
        "int fpassthru(resource fp)",
        "Output all remaining data from a file pointer"
    ],
    "fprintf": [
        "int fprintf(resource stream, string format [, mixed arg1 [, mixed ...]])",
        "Output a formatted string into a stream"
    ],
    "fputcsv": [
        "int fputcsv(resource fp, array fields [, string delimiter [, string enclosure]])",
        "Format line as CSV and write to file pointer"
    ],
    "fread": [
        "string fread(resource fp, int length)",
        "Binary-safe file read"
    ],
    "frenchtojd": [
        "int frenchtojd(int month, int day, int year)",
        "Converts a french republic calendar date to julian day count"
    ],
    "fscanf": [
        "mixed fscanf(resource stream, string format [, string ...])",
        "Implements a mostly ANSI compatible fscanf()"
    ],
    "fseek": [
        "int fseek(resource fp, int offset [, int whence])",
        "Seek on a file pointer"
    ],
    "fsockopen": [
        "resource fsockopen(string hostname, int port [, int errno [, string errstr [, float timeout]]])",
        "Open Internet or Unix domain socket connection"
    ],
    "fstat": [
        "array fstat(resource fp)",
        "Stat() on a filehandle"
    ],
    "ftell": [
        "int ftell(resource fp)",
        "Get file pointer's read/write position"
    ],
    "ftok": [
        "int ftok(string pathname, string proj)",
        "Convert a pathname and a project identifier to a System V IPC key"
    ],
    "ftp_alloc": [
        "bool ftp_alloc(resource stream, int size[, &response])",
        "Attempt to allocate space on the remote FTP server"
    ],
    "ftp_cdup": [
        "bool ftp_cdup(resource stream)",
        "Changes to the parent directory"
    ],
    "ftp_chdir": [
        "bool ftp_chdir(resource stream, string directory)",
        "Changes directories"
    ],
    "ftp_chmod": [
        "int ftp_chmod(resource stream, int mode, string filename)",
        "Sets permissions on a file"
    ],
    "ftp_close": [
        "bool ftp_close(resource stream)",
        "Closes the FTP stream"
    ],
    "ftp_connect": [
        "resource ftp_connect(string host [, int port [, int timeout]])",
        "Opens a FTP stream"
    ],
    "ftp_delete": [
        "bool ftp_delete(resource stream, string file)",
        "Deletes a file"
    ],
    "ftp_exec": [
        "bool ftp_exec(resource stream, string command)",
        "Requests execution of a program on the FTP server"
    ],
    "ftp_fget": [
        "bool ftp_fget(resource stream, resource fp, string remote_file, int mode[, int resumepos])",
        "Retrieves a file from the FTP server and writes it to an open file"
    ],
    "ftp_fput": [
        "bool ftp_fput(resource stream, string remote_file, resource fp, int mode[, int startpos])",
        "Stores a file from an open file to the FTP server"
    ],
    "ftp_get": [
        "bool ftp_get(resource stream, string local_file, string remote_file, int mode[, int resume_pos])",
        "Retrieves a file from the FTP server and writes it to a local file"
    ],
    "ftp_get_option": [
        "mixed ftp_get_option(resource stream, int option)",
        "Gets an FTP option"
    ],
    "ftp_login": [
        "bool ftp_login(resource stream, string username, string password)",
        "Logs into the FTP server"
    ],
    "ftp_mdtm": [
        "int ftp_mdtm(resource stream, string filename)",
        "Returns the last modification time of the file, or -1 on error"
    ],
    "ftp_mkdir": [
        "string ftp_mkdir(resource stream, string directory)",
        "Creates a directory and returns the absolute path for the new directory or false on error"
    ],
    "ftp_nb_continue": [
        "int ftp_nb_continue(resource stream)",
        "Continues retrieving/sending a file nbronously"
    ],
    "ftp_nb_fget": [
        "int ftp_nb_fget(resource stream, resource fp, string remote_file, int mode[, int resumepos])",
        "Retrieves a file from the FTP server asynchronly and writes it to an open file"
    ],
    "ftp_nb_fput": [
        "int ftp_nb_fput(resource stream, string remote_file, resource fp, int mode[, int startpos])",
        "Stores a file from an open file to the FTP server nbronly"
    ],
    "ftp_nb_get": [
        "int ftp_nb_get(resource stream, string local_file, string remote_file, int mode[, int resume_pos])",
        "Retrieves a file from the FTP server nbhronly and writes it to a local file"
    ],
    "ftp_nb_put": [
        "int ftp_nb_put(resource stream, string remote_file, string local_file, int mode[, int startpos])",
        "Stores a file on the FTP server"
    ],
    "ftp_nlist": [
        "array ftp_nlist(resource stream, string directory)",
        "Returns an array of filenames in the given directory"
    ],
    "ftp_pasv": [
        "bool ftp_pasv(resource stream, bool pasv)",
        "Turns passive mode on or off"
    ],
    "ftp_put": [
        "bool ftp_put(resource stream, string remote_file, string local_file, int mode[, int startpos])",
        "Stores a file on the FTP server"
    ],
    "ftp_pwd": [
        "string ftp_pwd(resource stream)",
        "Returns the present working directory"
    ],
    "ftp_raw": [
        "array ftp_raw(resource stream, string command)",
        "Sends a literal command to the FTP server"
    ],
    "ftp_rawlist": [
        "array ftp_rawlist(resource stream, string directory [, bool recursive])",
        "Returns a detailed listing of a directory as an array of output lines"
    ],
    "ftp_rename": [
        "bool ftp_rename(resource stream, string src, string dest)",
        "Renames the given file to a new path"
    ],
    "ftp_rmdir": [
        "bool ftp_rmdir(resource stream, string directory)",
        "Removes a directory"
    ],
    "ftp_set_option": [
        "bool ftp_set_option(resource stream, int option, mixed value)",
        "Sets an FTP option"
    ],
    "ftp_site": [
        "bool ftp_site(resource stream, string cmd)",
        "Sends a SITE command to the server"
    ],
    "ftp_size": [
        "int ftp_size(resource stream, string filename)",
        "Returns the size of the file, or -1 on error"
    ],
    "ftp_ssl_connect": [
        "resource ftp_ssl_connect(string host [, int port [, int timeout]])",
        "Opens a FTP-SSL stream"
    ],
    "ftp_systype": [
        "string ftp_systype(resource stream)",
        "Returns the system type identifier"
    ],
    "ftruncate": [
        "bool ftruncate(resource fp, int size)",
        "Truncate file to 'size' length"
    ],
    "func_get_arg": [
        "mixed func_get_arg(int arg_num)",
        "Get the $arg_num'th argument that was passed to the function"
    ],
    "func_get_args": [
        "array func_get_args()",
        "Get an array of the arguments that were passed to the function"
    ],
    "func_num_args": [
        "int func_num_args()",
        "Get the number of arguments that were passed to the function"
    ],
    "function ": ["", ""],
    "foreach ": ["", ""],
    "function_exists": [
        "bool function_exists(string function_name)",
        "Checks if the function exists"
    ],
    "fwrite": [
        "int fwrite(resource fp, string str [, int length])",
        "Binary-safe file write"
    ],
    "gc_collect_cycles": [
        "int gc_collect_cycles()",
        "Forces collection of any existing garbage cycles.    Returns number of freed zvals"
    ],
    "gc_disable": [
        "void gc_disable()",
        "Deactivates the circular reference collector"
    ],
    "gc_enable": [
        "void gc_enable()",
        "Activates the circular reference collector"
    ],
    "gc_enabled": [
        "void gc_enabled()",
        "Returns status of the circular reference collector"
    ],
    "gd_info": [
        "array gd_info()",
        ""
    ],
    "getKeywords": [
        "static array getKeywords(string $locale) {",
        "* return an associative array containing keyword-value  * pairs for this locale. The keys are keys to the array  * }}}"
    ],
    "get_browser": [
        "mixed get_browser([string browser_name [, bool return_array]])",
        "Get information about the capabilities of a browser. If browser_name is omitted or null, HTTP_USER_AGENT is used. Returns an object by default; if return_array is true, returns an array."
    ],
    "get_called_class": [
        "string get_called_class()",
        "Retrieves the \"Late Static Binding\" class name"
    ],
    "get_cfg_var": [
        "mixed get_cfg_var(string option_name)",
        "Get the value of a PHP configuration option"
    ],
    "get_class": [
        "string get_class([object object])",
        "Retrieves the class name"
    ],
    "get_class_methods": [
        "array get_class_methods(mixed class)",
        "Returns an array of method names for class or class instance."
    ],
    "get_class_vars": [
        "array get_class_vars(string class_name)",
        "Returns an array of default properties of the class."
    ],
    "get_current_user": [
        "string get_current_user()",
        "Get the name of the owner of the current PHP script"
    ],
    "get_declared_classes": [
        "array get_declared_classes()",
        "Returns an array of all declared classes."
    ],
    "get_declared_interfaces": [
        "array get_declared_interfaces()",
        "Returns an array of all declared interfaces."
    ],
    "get_defined_constants": [
        "array get_defined_constants([bool categorize])",
        "Return an array containing the names and values of all defined constants"
    ],
    "get_defined_functions": [
        "array get_defined_functions()",
        "Returns an array of all defined functions"
    ],
    "get_defined_vars": [
        "array get_defined_vars()",
        "Returns an associative array of names and values of all currently defined variable names (variables in the current scope)"
    ],
    "get_display_language": [
        "static string get_display_language($locale[, $in_locale = null])",
        "* gets the language for the $locale in $in_locale or default_locale"
    ],
    "get_display_name": [
        "static string get_display_name($locale[, $in_locale = null])",
        "* gets the name for the $locale in $in_locale or default_locale"
    ],
    "get_display_region": [
        "static string get_display_region($locale, $in_locale = null)",
        "* gets the region for the $locale in $in_locale or default_locale"
    ],
    "get_display_script": [
        "static string get_display_script($locale, $in_locale = null)",
        "* gets the script for the $locale in $in_locale or default_locale"
    ],
    "get_extension_funcs": [
        "array get_extension_funcs(string extension_name)",
        "Returns an array with the names of functions belonging to the named extension"
    ],
    "get_headers": [
        "array get_headers(string url[, int format])",
        "fetches all the headers sent by the server in response to a HTTP request"
    ],
    "get_html_translation_table": [
        "array get_html_translation_table([int table [, int quote_style]])",
        "Returns the internal translation table used by htmlspecialchars and htmlentities"
    ],
    "get_include_path": [
        "string get_include_path()",
        "Get the current include_path configuration option"
    ],
    "get_included_files": [
        "array get_included_files()",
        "Returns an array with the file names that were include_once()'d"
    ],
    "get_loaded_extensions": [
        "array get_loaded_extensions([bool zend_extensions])",
        "Return an array containing names of loaded extensions"
    ],
    "get_magic_quotes_gpc": [
        "int get_magic_quotes_gpc()",
        "Get the current active configuration setting of magic_quotes_gpc"
    ],
    "get_magic_quotes_runtime": [
        "int get_magic_quotes_runtime()",
        "Get the current active configuration setting of magic_quotes_runtime"
    ],
    "get_meta_tags": [
        "array get_meta_tags(string filename [, bool use_include_path])",
        "Extracts all meta tag content attributes from a file and returns an array"
    ],
    "get_object_vars": [
        "array get_object_vars(object obj)",
        "Returns an array of object properties"
    ],
    "get_parent_class": [
        "string get_parent_class([mixed object])",
        "Retrieves the parent class name for object or class or current scope."
    ],
    "get_resource_type": [
        "string get_resource_type(resource res)",
        "Get the resource type name for a given resource"
    ],
    "getallheaders": [
        "array getallheaders()",
        ""
    ],
    "getcwd": [
        "mixed getcwd()",
        "Gets the current directory"
    ],
    "getdate": [
        "array getdate([int timestamp])",
        "Get date/time information"
    ],
    "getenv": [
        "string getenv(string varname)",
        "Get the value of an environment variable"
    ],
    "gethostbyaddr": [
        "string gethostbyaddr(string ip_address)",
        "Get the Internet host name corresponding to a given IP address"
    ],
    "gethostbyname": [
        "string gethostbyname(string hostname)",
        "Get the IP address corresponding to a given Internet host name"
    ],
    "gethostbynamel": [
        "array gethostbynamel(string hostname)",
        "Return a list of IP addresses that a given hostname resolves to."
    ],
    "gethostname": [
        "string gethostname()",
        "Get the host name of the current machine"
    ],
    "getimagesize": [
        "array getimagesize(string imagefile [, array info])",
        "Get the size of an image as 4-element array"
    ],
    "getlastmod": [
        "int getlastmod()",
        "Get time of last page modification"
    ],
    "getmygid": [
        "int getmygid()",
        "Get PHP script owner's GID"
    ],
    "getmyinode": [
        "int getmyinode()",
        "Get the inode of the current script being parsed"
    ],
    "getmypid": [
        "int getmypid()",
        "Get current process ID"
    ],
    "getmyuid": [
        "int getmyuid()",
        "Get PHP script owner's UID"
    ],
    "getopt": [
        "array getopt(string options [, array longopts])",
        "Get options from the command line argument list"
    ],
    "getprotobyname": [
        "int getprotobyname(string name)",
        "Returns protocol number associated with name as per /etc/protocols"
    ],
    "getprotobynumber": [
        "string getprotobynumber(int proto)",
        "Returns protocol name associated with protocol number proto"
    ],
    "getrandmax": [
        "int getrandmax()",
        "Returns the maximum value a random number can have"
    ],
    "getrusage": [
        "array getrusage([int who])",
        "Returns an array of usage statistics"
    ],
    "getservbyname": [
        "int getservbyname(string service, string protocol)",
        "Returns port associated with service. Protocol must be \"tcp\" or \"udp\""
    ],
    "getservbyport": [
        "string getservbyport(int port, string protocol)",
        "Returns service name associated with port. Protocol must be \"tcp\" or \"udp\""
    ],
    "gettext": [
        "string gettext(string msgid)",
        "Return the translation of msgid for the current domain, or msgid unaltered if a translation does not exist"
    ],
    "gettimeofday": [
        "array gettimeofday([bool get_as_float])",
        "Returns the current time as array"
    ],
    "gettype": [
        "string gettype(mixed var)",
        "Returns the type of the variable"
    ],
    "glob": [
        "array glob(string pattern [, int flags])",
        "Find pathnames matching a pattern"
    ],
    "gmdate": [
        "string gmdate(string format [, long timestamp])",
        "Format a GMT date/time"
    ],
    "gmmktime": [
        "int gmmktime([int hour [, int min [, int sec [, int mon [, int day [, int year]]]]]])",
        "Get UNIX timestamp for a GMT date"
    ],
    "gmp_abs": [
        "resource gmp_abs(resource a)",
        "Calculates absolute value"
    ],
    "gmp_add": [
        "resource gmp_add(resource a, resource b)",
        "Add a and b"
    ],
    "gmp_and": [
        "resource gmp_and(resource a, resource b)",
        "Calculates logical AND of a and b"
    ],
    "gmp_clrbit": [
        "void gmp_clrbit(resource &a, int index)",
        "Clears bit in a"
    ],
    "gmp_cmp": [
        "int gmp_cmp(resource a, resource b)",
        "Compares two numbers"
    ],
    "gmp_com": [
        "resource gmp_com(resource a)",
        "Calculates one's complement of a"
    ],
    "gmp_div_q": [
        "resource gmp_div_q(resource a, resource b [, int round])",
        "Divide a by b, returns quotient only"
    ],
    "gmp_div_qr": [
        "array gmp_div_qr(resource a, resource b [, int round])",
        "Divide a by b, returns quotient and reminder"
    ],
    "gmp_div_r": [
        "resource gmp_div_r(resource a, resource b [, int round])",
        "Divide a by b, returns reminder only"
    ],
    "gmp_divexact": [
        "resource gmp_divexact(resource a, resource b)",
        "Divide a by b using exact division algorithm"
    ],
    "gmp_fact": [
        "resource gmp_fact(int a)",
        "Calculates factorial function"
    ],
    "gmp_gcd": [
        "resource gmp_gcd(resource a, resource b)",
        "Computes greatest common denominator (gcd) of a and b"
    ],
    "gmp_gcdext": [
        "array gmp_gcdext(resource a, resource b)",
        "Computes G, S, and T, such that AS + BT = G = `gcd' (A, B)"
    ],
    "gmp_hamdist": [
        "int gmp_hamdist(resource a, resource b)",
        "Calculates hamming distance between a and b"
    ],
    "gmp_init": [
        "resource gmp_init(mixed number [, int base])",
        "Initializes GMP number"
    ],
    "gmp_intval": [
        "int gmp_intval(resource gmpnumber)",
        "Gets signed long value of GMP number"
    ],
    "gmp_invert": [
        "resource gmp_invert(resource a, resource b)",
        "Computes the inverse of a modulo b"
    ],
    "gmp_jacobi": [
        "int gmp_jacobi(resource a, resource b)",
        "Computes Jacobi symbol"
    ],
    "gmp_legendre": [
        "int gmp_legendre(resource a, resource b)",
        "Computes Legendre symbol"
    ],
    "gmp_mod": [
        "resource gmp_mod(resource a, resource b)",
        "Computes a modulo b"
    ],
    "gmp_mul": [
        "resource gmp_mul(resource a, resource b)",
        "Multiply a and b"
    ],
    "gmp_neg": [
        "resource gmp_neg(resource a)",
        "Negates a number"
    ],
    "gmp_nextprime": [
        "resource gmp_nextprime(resource a)",
        "Finds next prime of a"
    ],
    "gmp_or": [
        "resource gmp_or(resource a, resource b)",
        "Calculates logical OR of a and b"
    ],
    "gmp_perfect_square": [
        "bool gmp_perfect_square(resource a)",
        "Checks if a is an exact square"
    ],
    "gmp_popcount": [
        "int gmp_popcount(resource a)",
        "Calculates the population count of a"
    ],
    "gmp_pow": [
        "resource gmp_pow(resource base, int exp)",
        "Raise base to power exp"
    ],
    "gmp_powm": [
        "resource gmp_powm(resource base, resource exp, resource mod)",
        "Raise base to power exp and take result modulo mod"
    ],
    "gmp_prob_prime": [
        "int gmp_prob_prime(resource a[, int reps])",
        "Checks if a is \"probably prime\""
    ],
    "gmp_random": [
        "resource gmp_random([int limiter])",
        "Gets random number"
    ],
    "gmp_scan0": [
        "int gmp_scan0(resource a, int start)",
        "Finds first zero bit"
    ],
    "gmp_scan1": [
        "int gmp_scan1(resource a, int start)",
        "Finds first non-zero bit"
    ],
    "gmp_setbit": [
        "void gmp_setbit(resource &a, int index[, bool set_clear])",
        "Sets or clear bit in a"
    ],
    "gmp_sign": [
        "int gmp_sign(resource a)",
        "Gets the sign of the number"
    ],
    "gmp_sqrt": [
        "resource gmp_sqrt(resource a)",
        "Takes integer part of square root of a"
    ],
    "gmp_sqrtrem": [
        "array gmp_sqrtrem(resource a)",
        "Square root with remainder"
    ],
    "gmp_strval": [
        "string gmp_strval(resource gmpnumber [, int base])",
        "Gets string representation of GMP number"
    ],
    "gmp_sub": [
        "resource gmp_sub(resource a, resource b)",
        "Subtract b from a"
    ],
    "gmp_testbit": [
        "bool gmp_testbit(resource a, int index)",
        "Tests if bit is set in a"
    ],
    "gmp_xor": [
        "resource gmp_xor(resource a, resource b)",
        "Calculates logical exclusive OR of a and b"
    ],
    "gmstrftime": [
        "string gmstrftime(string format [, int timestamp])",
        "Format a GMT/UCT time/date according to locale settings"
    ],
    "grapheme_extract": [
        "string grapheme_extract(string str, int size[, int extract_type[, int start[, int next]]])",
        "Function to extract a sequence of default grapheme clusters"
    ],
    "grapheme_stripos": [
        "int grapheme_stripos(string haystack, string needle [, int offset ])",
        "Find position of first occurrence of a string within another, ignoring case differences"
    ],
    "grapheme_stristr": [
        "string grapheme_stristr(string haystack, string needle[, bool part])",
        "Finds first occurrence of a string within another"
    ],
    "grapheme_strlen": [
        "int grapheme_strlen(string str)",
        "Get number of graphemes in a string"
    ],
    "grapheme_strpos": [
        "int grapheme_strpos(string haystack, string needle [, int offset ])",
        "Find position of first occurrence of a string within another"
    ],
    "grapheme_strripos": [
        "int grapheme_strripos(string haystack, string needle [, int offset])",
        "Find position of last occurrence of a string within another, ignoring case"
    ],
    "grapheme_strrpos": [
        "int grapheme_strrpos(string haystack, string needle [, int offset])",
        "Find position of last occurrence of a string within another"
    ],
    "grapheme_strstr": [
        "string grapheme_strstr(string haystack, string needle[, bool part])",
        "Finds first occurrence of a string within another"
    ],
    "grapheme_substr": [
        "string grapheme_substr(string str, int start [, int length])",
        "Returns part of a string"
    ],
    "gregoriantojd": [
        "int gregoriantojd(int month, int day, int year)",
        "Converts a gregorian calendar date to julian day count"
    ],
    "gzcompress": [
        "string gzcompress(string data [, int level])",
        "Gzip-compress a string"
    ],
    "gzdeflate": [
        "string gzdeflate(string data [, int level])",
        "Gzip-compress a string"
    ],
    "gzencode": [
        "string gzencode(string data [, int level [, int encoding_mode]])",
        "GZ encode a string"
    ],
    "gzfile": [
        "array gzfile(string filename [, int use_include_path])",
        "Read und uncompress entire .gz-file into an array"
    ],
    "gzinflate": [
        "string gzinflate(string data [, int length])",
        "Unzip a gzip-compressed string"
    ],
    "gzopen": [
        "resource gzopen(string filename, string mode [, int use_include_path])",
        "Open a .gz-file and return a .gz-file pointer"
    ],
    "gzuncompress": [
        "string gzuncompress(string data [, int length])",
        "Unzip a gzip-compressed string"
    ],
    "hash": [
        "string hash(string algo, string data[, bool raw_output = false])",
        "Generate a hash of a given input string Returns lowercase hexits by default"
    ],
    "hash_algos": [
        "array hash_algos()",
        "Return a list of registered hashing algorithms"
    ],
    "hash_copy": [
        "resource hash_copy(resource context)",
        "Copy hash resource"
    ],
    "hash_file": [
        "string hash_file(string algo, string filename[, bool raw_output = false])",
        "Generate a hash of a given file Returns lowercase hexits by default"
    ],
    "hash_final": [
        "string hash_final(resource context[, bool raw_output=false])",
        "Output resulting digest"
    ],
    "hash_hmac": [
        "string hash_hmac(string algo, string data, string key[, bool raw_output = false])",
        "Generate a hash of a given input string with a key using HMAC Returns lowercase hexits by default"
    ],
    "hash_hmac_file": [
        "string hash_hmac_file(string algo, string filename, string key[, bool raw_output = false])",
        "Generate a hash of a given file with a key using HMAC Returns lowercase hexits by default"
    ],
    "hash_init": [
        "resource hash_init(string algo[, int options, string key])",
        "Initialize a hashing context"
    ],
    "hash_update": [
        "bool hash_update(resource context, string data)",
        "Pump data into the hashing algorithm"
    ],
    "hash_update_file": [
        "bool hash_update_file(resource context, string filename[, resource context])",
        "Pump data into the hashing algorithm from a file"
    ],
    "hash_update_stream": [
        "int hash_update_stream(resource context, resource handle[, integer length])",
        "Pump data into the hashing algorithm from an open stream"
    ],
    "header": [
        "void header(string header [, bool replace, [int http_response_code]])",
        "Sends a raw HTTP header"
    ],
    "header_remove": [
        "void header_remove([string name])",
        "Removes an HTTP header previously set using header()"
    ],
    "headers_list": [
        "array headers_list()",
        "Return list of headers to be sent / already sent"
    ],
    "headers_sent": [
        "bool headers_sent([string &$file [, int &$line]])",
        "Returns true if headers have already been sent, false otherwise"
    ],
    "hebrev": [
        "string hebrev(string str [, int max_chars_per_line])",
        "Converts logical Hebrew text to visual text"
    ],
    "hebrevc": [
        "string hebrevc(string str [, int max_chars_per_line])",
        "Converts logical Hebrew text to visual text with newline conversion"
    ],
    "hexdec": [
        "int hexdec(string hexadecimal_number)",
        "Returns the decimal equivalent of the hexadecimal number"
    ],
    "highlight_file": [
        "bool highlight_file(string file_name [, bool return] )",
        "Syntax highlight a source file"
    ],
    "highlight_string": [
        "bool highlight_string(string string [, bool return] )",
        "Syntax highlight a string or optionally return it"
    ],
    "html_entity_decode": [
        "string html_entity_decode(string string [, int quote_style][, string charset])",
        "Convert all HTML entities to their applicable characters"
    ],
    "htmlentities": [
        "string htmlentities(string string [, int quote_style[, string charset[, bool double_encode]]])",
        "Convert all applicable characters to HTML entities"
    ],
    "htmlspecialchars": [
        "string htmlspecialchars(string string [, int quote_style[, string charset[, bool double_encode]]])",
        "Convert special characters to HTML entities"
    ],
    "htmlspecialchars_decode": [
        "string htmlspecialchars_decode(string string [, int quote_style])",
        "Convert special HTML entities back to characters"
    ],
    "http_build_query": [
        "string http_build_query(mixed formdata [, string prefix [, string arg_separator]])",
        "Generates a form-encoded query string from an associative array or object."
    ],
    "hypot": [
        "float hypot(float num1, float num2)",
        "Returns sqrt(num1*num1 + num2*num2)"
    ],
    "ibase_add_user": [
        "bool ibase_add_user(resource service_handle, string user_name, string password [, string first_name [, string middle_name [, string last_name]]])",
        "Add a user to security database"
    ],
    "ibase_affected_rows": [
        "int ibase_affected_rows( [ resource link_identifier ] )",
        "Returns the number of rows affected by the previous INSERT, UPDATE or DELETE statement"
    ],
    "ibase_backup": [
        "mixed ibase_backup(resource service_handle, string source_db, string dest_file [, int options [, bool verbose]])",
        "Initiates a backup task in the service manager and returns immediately"
    ],
    "ibase_blob_add": [
        "bool ibase_blob_add(resource blob_handle, string data)",
        "Add data into created blob"
    ],
    "ibase_blob_cancel": [
        "bool ibase_blob_cancel(resource blob_handle)",
        "Cancel creating blob"
    ],
    "ibase_blob_close": [
        "string ibase_blob_close(resource blob_handle)",
        "Close blob"
    ],
    "ibase_blob_create": [
        "resource ibase_blob_create([resource link_identifier])",
        "Create blob for adding data"
    ],
    "ibase_blob_echo": [
        "bool ibase_blob_echo([ resource link_identifier, ] string blob_id)",
        "Output blob contents to browser"
    ],
    "ibase_blob_get": [
        "string ibase_blob_get(resource blob_handle, int len)",
        "Get len bytes data from open blob"
    ],
    "ibase_blob_import": [
        "string ibase_blob_import([ resource link_identifier, ] resource file)",
        "Create blob, copy file in it, and close it"
    ],
    "ibase_blob_info": [
        "array ibase_blob_info([ resource link_identifier, ] string blob_id)",
        "Return blob length and other useful info"
    ],
    "ibase_blob_open": [
        "resource ibase_blob_open([ resource link_identifier, ] string blob_id)",
        "Open blob for retrieving data parts"
    ],
    "ibase_close": [
        "bool ibase_close([resource link_identifier])",
        "Close an InterBase connection"
    ],
    "ibase_commit": [
        "bool ibase_commit( resource link_identifier )",
        "Commit transaction"
    ],
    "ibase_commit_ret": [
        "bool ibase_commit_ret( resource link_identifier )",
        "Commit transaction and retain the transaction context"
    ],
    "ibase_connect": [
        "resource ibase_connect(string database [, string username [, string password [, string charset [, int buffers [, int dialect [, string role]]]]]])",
        "Open a connection to an InterBase database"
    ],
    "ibase_db_info": [
        "string ibase_db_info(resource service_handle, string db, int action [, int argument])",
        "Request statistics about a database"
    ],
    "ibase_delete_user": [
        "bool ibase_delete_user(resource service_handle, string user_name, string password [, string first_name [, string middle_name [, string last_name]]])",
        "Delete a user from security database"
    ],
    "ibase_drop_db": [
        "bool ibase_drop_db([resource link_identifier])",
        "Drop an InterBase database"
    ],
    "ibase_errcode": [
        "int ibase_errcode()",
        "Return error code"
    ],
    "ibase_errmsg": [
        "string ibase_errmsg()",
        "Return error message"
    ],
    "ibase_execute": [
        "mixed ibase_execute(resource query [, mixed bind_arg [, mixed bind_arg [, ...]]])",
        "Execute a previously prepared query"
    ],
    "ibase_fetch_assoc": [
        "array ibase_fetch_assoc(resource result [, int fetch_flags])",
        "Fetch a row  from the results of a query"
    ],
    "ibase_fetch_object": [
        "object ibase_fetch_object(resource result [, int fetch_flags])",
        "Fetch a object from the results of a query"
    ],
    "ibase_fetch_row": [
        "array ibase_fetch_row(resource result [, int fetch_flags])",
        "Fetch a row  from the results of a query"
    ],
    "ibase_field_info": [
        "array ibase_field_info(resource query_result, int field_number)",
        "Get information about a field"
    ],
    "ibase_free_event_handler": [
        "bool ibase_free_event_handler(resource event)",
        "Frees the event handler set by ibase_set_event_handler()"
    ],
    "ibase_free_query": [
        "bool ibase_free_query(resource query)",
        "Free memory used by a query"
    ],
    "ibase_free_result": [
        "bool ibase_free_result(resource result)",
        "Free the memory used by a result"
    ],
    "ibase_gen_id": [
        "int ibase_gen_id(string generator [, int increment [, resource link_identifier ]])",
        "Increments the named generator and returns its new value"
    ],
    "ibase_maintain_db": [
        "bool ibase_maintain_db(resource service_handle, string db, int action [, int argument])",
        "Execute a maintenance command on the database server"
    ],
    "ibase_modify_user": [
        "bool ibase_modify_user(resource service_handle, string user_name, string password [, string first_name [, string middle_name [, string last_name]]])",
        "Modify a user in security database"
    ],
    "ibase_name_result": [
        "bool ibase_name_result(resource result, string name)",
        "Assign a name to a result for use with ... WHERE CURRENT OF <name> statements"
    ],
    "ibase_num_fields": [
        "int ibase_num_fields(resource query_result)",
        "Get the number of fields in result"
    ],
    "ibase_num_params": [
        "int ibase_num_params(resource query)",
        "Get the number of params in a prepared query"
    ],
    "ibase_num_rows": [
        "int ibase_num_rows( resource result_identifier )",
        "Return the number of rows that are available in a result"
    ],
    "ibase_param_info": [
        "array ibase_param_info(resource query, int field_number)",
        "Get information about a parameter"
    ],
    "ibase_pconnect": [
        "resource ibase_pconnect(string database [, string username [, string password [, string charset [, int buffers [, int dialect [, string role]]]]]])",
        "Open a persistent connection to an InterBase database"
    ],
    "ibase_prepare": [
        "resource ibase_prepare(resource link_identifier[, string query [, resource trans_identifier ]])",
        "Prepare a query for later execution"
    ],
    "ibase_query": [
        "mixed ibase_query([resource link_identifier, [ resource link_identifier, ]] string query [, mixed bind_arg [, mixed bind_arg [, ...]]])",
        "Execute a query"
    ],
    "ibase_restore": [
        "mixed ibase_restore(resource service_handle, string source_file, string dest_db [, int options [, bool verbose]])",
        "Initiates a restore task in the service manager and returns immediately"
    ],
    "ibase_rollback": [
        "bool ibase_rollback( resource link_identifier )",
        "Rollback transaction"
    ],
    "ibase_rollback_ret": [
        "bool ibase_rollback_ret( resource link_identifier )",
        "Rollback transaction and retain the transaction context"
    ],
    "ibase_server_info": [
        "string ibase_server_info(resource service_handle, int action)",
        "Request information about a database server"
    ],
    "ibase_service_attach": [
        "resource ibase_service_attach(string host, string dba_username, string dba_password)",
        "Connect to the service manager"
    ],
    "ibase_service_detach": [
        "bool ibase_service_detach(resource service_handle)",
        "Disconnect from the service manager"
    ],
    "ibase_set_event_handler": [
        "resource ibase_set_event_handler([resource link_identifier,] callback handler, string event [, string event [, ...]])",
        "Register the callback for handling each of the named events"
    ],
    "ibase_trans": [
        "resource ibase_trans([int trans_args [, resource link_identifier [, ... ], int trans_args [, resource link_identifier [, ... ]] [, ...]]])",
        "Start a transaction over one or several databases"
    ],
    "ibase_wait_event": [
        "string ibase_wait_event([resource link_identifier,] string event [, string event [, ...]])",
        "Waits for any one of the passed Interbase events to be posted by the database, and returns its name"
    ],
    "iconv": [
        "string iconv(string in_charset, string out_charset, string str)",
        "Returns str converted to the out_charset character set"
    ],
    "iconv_get_encoding": [
        "mixed iconv_get_encoding([string type])",
        "Get internal encoding and output encoding for ob_iconv_handler()"
    ],
    "iconv_mime_decode": [
        "string iconv_mime_decode(string encoded_string [, int mode, string charset])",
        "Decodes a mime header field"
    ],
    "iconv_mime_decode_headers": [
        "array iconv_mime_decode_headers(string headers [, int mode, string charset])",
        "Decodes multiple mime header fields"
    ],
    "iconv_mime_encode": [
        "string iconv_mime_encode(string field_name, string field_value [, array preference])",
        "Composes a mime header field with field_name and field_value in a specified scheme"
    ],
    "iconv_set_encoding": [
        "bool iconv_set_encoding(string type, string charset)",
        "Sets internal encoding and output encoding for ob_iconv_handler()"
    ],
    "iconv_strlen": [
        "int iconv_strlen(string str [, string charset])",
        "Returns the character count of str"
    ],
    "iconv_strpos": [
        "int iconv_strpos(string haystack, string needle [, int offset [, string charset]])",
        "Finds position of first occurrence of needle within part of haystack beginning with offset"
    ],
    "iconv_strrpos": [
        "int iconv_strrpos(string haystack, string needle [, string charset])",
        "Finds position of last occurrence of needle within part of haystack beginning with offset"
    ],
    "iconv_substr": [
        "string iconv_substr(string str, int offset, [int length, string charset])",
        "Returns specified part of a string"
    ],
    "idate": [
        "int idate(string format [, int timestamp])",
        "Format a local time/date as integer"
    ],
    "idn_to_ascii": [
        "int idn_to_ascii(string domain[, int options])",
        "Converts an Unicode domain to ASCII representation, as defined in the IDNA RFC"
    ],
    "idn_to_utf8": [
        "int idn_to_utf8(string domain[, int options])",
        "Converts an ASCII representation of the domain to Unicode (UTF-8), as defined in the IDNA RFC"
    ],
    "ignore_user_abort": [
        "int ignore_user_abort([string value])",
        "Set whether we want to ignore a user abort event or not"
    ],
    "image2wbmp": [
        "bool image2wbmp(resource im [, string filename [, int threshold]])",
        "Output WBMP image to browser or file"
    ],
    "image_type_to_extension": [
        "string image_type_to_extension(int imagetype [, bool include_dot])",
        "Get file extension for image-type returned by getimagesize, exif_read_data, exif_thumbnail, exif_imagetype"
    ],
    "image_type_to_mime_type": [
        "string image_type_to_mime_type(int imagetype)",
        "Get Mime-Type for image-type returned by getimagesize, exif_read_data, exif_thumbnail, exif_imagetype"
    ],
    "imagealphablending": [
        "bool imagealphablending(resource im, bool on)",
        "Turn alpha blending mode on or off for the given image"
    ],
    "imageantialias": [
        "bool imageantialias(resource im, bool on)",
        "Should antialiased functions used or not"
    ],
    "imagearc": [
        "bool imagearc(resource im, int cx, int cy, int w, int h, int s, int e, int col)",
        "Draw a partial ellipse"
    ],
    "imagechar": [
        "bool imagechar(resource im, int font, int x, int y, string c, int col)",
        "Draw a character"
    ],
    "imagecharup": [
        "bool imagecharup(resource im, int font, int x, int y, string c, int col)",
        "Draw a character rotated 90 degrees counter-clockwise"
    ],
    "imagecolorallocate": [
        "int imagecolorallocate(resource im, int red, int green, int blue)",
        "Allocate a color for an image"
    ],
    "imagecolorallocatealpha": [
        "int imagecolorallocatealpha(resource im, int red, int green, int blue, int alpha)",
        "Allocate a color with an alpha level.  Works for true color and palette based images"
    ],
    "imagecolorat": [
        "int imagecolorat(resource im, int x, int y)",
        "Get the index of the color of a pixel"
    ],
    "imagecolorclosest": [
        "int imagecolorclosest(resource im, int red, int green, int blue)",
        "Get the index of the closest color to the specified color"
    ],
    "imagecolorclosestalpha": [
        "int imagecolorclosestalpha(resource im, int red, int green, int blue, int alpha)",
        "Find the closest matching colour with alpha transparency"
    ],
    "imagecolorclosesthwb": [
        "int imagecolorclosesthwb(resource im, int red, int green, int blue)",
        "Get the index of the color which has the hue, white and blackness nearest to the given color"
    ],
    "imagecolordeallocate": [
        "bool imagecolordeallocate(resource im, int index)",
        "De-allocate a color for an image"
    ],
    "imagecolorexact": [
        "int imagecolorexact(resource im, int red, int green, int blue)",
        "Get the index of the specified color"
    ],
    "imagecolorexactalpha": [
        "int imagecolorexactalpha(resource im, int red, int green, int blue, int alpha)",
        "Find exact match for colour with transparency"
    ],
    "imagecolormatch": [
        "bool imagecolormatch(resource im1, resource im2)",
        "Makes the colors of the palette version of an image more closely match the true color version"
    ],
    "imagecolorresolve": [
        "int imagecolorresolve(resource im, int red, int green, int blue)",
        "Get the index of the specified color or its closest possible alternative"
    ],
    "imagecolorresolvealpha": [
        "int imagecolorresolvealpha(resource im, int red, int green, int blue, int alpha)",
        "Resolve/Allocate a colour with an alpha level.  Works for true colour and palette based images"
    ],
    "imagecolorset": [
        "void imagecolorset(resource im, int col, int red, int green, int blue)",
        "Set the color for the specified palette index"
    ],
    "imagecolorsforindex": [
        "array imagecolorsforindex(resource im, int col)",
        "Get the colors for an index"
    ],
    "imagecolorstotal": [
        "int imagecolorstotal(resource im)",
        "Find out the number of colors in an image's palette"
    ],
    "imagecolortransparent": [
        "int imagecolortransparent(resource im [, int col])",
        "Define a color as transparent"
    ],
    "imageconvolution": [
        "resource imageconvolution(resource src_im, array matrix3x3, double div, double offset)",
        "Apply a 3x3 convolution matrix, using coefficient div and offset"
    ],
    "imagecopy": [
        "bool imagecopy(resource dst_im, resource src_im, int dst_x, int dst_y, int src_x, int src_y, int src_w, int src_h)",
        "Copy part of an image"
    ],
    "imagecopymerge": [
        "bool imagecopymerge(resource src_im, resource dst_im, int dst_x, int dst_y, int src_x, int src_y, int src_w, int src_h, int pct)",
        "Merge one part of an image with another"
    ],
    "imagecopymergegray": [
        "bool imagecopymergegray(resource src_im, resource dst_im, int dst_x, int dst_y, int src_x, int src_y, int src_w, int src_h, int pct)",
        "Merge one part of an image with another"
    ],
    "imagecopyresampled": [
        "bool imagecopyresampled(resource dst_im, resource src_im, int dst_x, int dst_y, int src_x, int src_y, int dst_w, int dst_h, int src_w, int src_h)",
        "Copy and resize part of an image using resampling to help ensure clarity"
    ],
    "imagecopyresized": [
        "bool imagecopyresized(resource dst_im, resource src_im, int dst_x, int dst_y, int src_x, int src_y, int dst_w, int dst_h, int src_w, int src_h)",
        "Copy and resize part of an image"
    ],
    "imagecreate": [
        "resource imagecreate(int x_size, int y_size)",
        "Create a new image"
    ],
    "imagecreatefromgd": [
        "resource imagecreatefromgd(string filename)",
        "Create a new image from GD file or URL"
    ],
    "imagecreatefromgd2": [
        "resource imagecreatefromgd2(string filename)",
        "Create a new image from GD2 file or URL"
    ],
    "imagecreatefromgd2part": [
        "resource imagecreatefromgd2part(string filename, int srcX, int srcY, int width, int height)",
        "Create a new image from a given part of GD2 file or URL"
    ],
    "imagecreatefromgif": [
        "resource imagecreatefromgif(string filename)",
        "Create a new image from GIF file or URL"
    ],
    "imagecreatefromjpeg": [
        "resource imagecreatefromjpeg(string filename)",
        "Create a new image from JPEG file or URL"
    ],
    "imagecreatefrompng": [
        "resource imagecreatefrompng(string filename)",
        "Create a new image from PNG file or URL"
    ],
    "imagecreatefromstring": [
        "resource imagecreatefromstring(string image)",
        "Create a new image from the image stream in the string"
    ],
    "imagecreatefromwbmp": [
        "resource imagecreatefromwbmp(string filename)",
        "Create a new image from WBMP file or URL"
    ],
    "imagecreatefromxbm": [
        "resource imagecreatefromxbm(string filename)",
        "Create a new image from XBM file or URL"
    ],
    "imagecreatefromxpm": [
        "resource imagecreatefromxpm(string filename)",
        "Create a new image from XPM file or URL"
    ],
    "imagecreatetruecolor": [
        "resource imagecreatetruecolor(int x_size, int y_size)",
        "Create a new true color image"
    ],
    "imagedashedline": [
        "bool imagedashedline(resource im, int x1, int y1, int x2, int y2, int col)",
        "Draw a dashed line"
    ],
    "imagedestroy": [
        "bool imagedestroy(resource im)",
        "Destroy an image"
    ],
    "imageellipse": [
        "bool imageellipse(resource im, int cx, int cy, int w, int h, int color)",
        "Draw an ellipse"
    ],
    "imagefill": [
        "bool imagefill(resource im, int x, int y, int col)",
        "Flood fill"
    ],
    "imagefilledarc": [
        "bool imagefilledarc(resource im, int cx, int cy, int w, int h, int s, int e, int col, int style)",
        "Draw a filled partial ellipse"
    ],
    "imagefilledellipse": [
        "bool imagefilledellipse(resource im, int cx, int cy, int w, int h, int color)",
        "Draw an ellipse"
    ],
    "imagefilledpolygon": [
        "bool imagefilledpolygon(resource im, array point, int num_points, int col)",
        "Draw a filled polygon"
    ],
    "imagefilledrectangle": [
        "bool imagefilledrectangle(resource im, int x1, int y1, int x2, int y2, int col)",
        "Draw a filled rectangle"
    ],
    "imagefilltoborder": [
        "bool imagefilltoborder(resource im, int x, int y, int border, int col)",
        "Flood fill to specific color"
    ],
    "imagefilter": [
        "bool imagefilter(resource src_im, int filtertype, [args] )",
        "Applies Filter an image using a custom angle"
    ],
    "imagefontheight": [
        "int imagefontheight(int font)",
        "Get font height"
    ],
    "imagefontwidth": [
        "int imagefontwidth(int font)",
        "Get font width"
    ],
    "imageftbbox": [
        "array imageftbbox(float size, float angle, string font_file, string text [, array extrainfo])",
        "Give the bounding box of a text using fonts via freetype2"
    ],
    "imagefttext": [
        "array imagefttext(resource im, float size, float angle, int x, int y, int col, string font_file, string text [, array extrainfo])",
        "Write text to the image using fonts via freetype2"
    ],
    "imagegammacorrect": [
        "bool imagegammacorrect(resource im, float inputgamma, float outputgamma)",
        "Apply a gamma correction to a GD image"
    ],
    "imagegd": [
        "bool imagegd(resource im [, string filename])",
        "Output GD image to browser or file"
    ],
    "imagegd2": [
        "bool imagegd2(resource im [, string filename, [, int chunk_size, [, int type]]])",
        "Output GD2 image to browser or file"
    ],
    "imagegif": [
        "bool imagegif(resource im [, string filename])",
        "Output GIF image to browser or file"
    ],
    "imagegrabscreen": [
        "resource imagegrabscreen()",
        "Grab a screenshot"
    ],
    "imagegrabwindow": [
        "resource imagegrabwindow(int window_handle [, int client_area])",
        "Grab a window or its client area using a windows handle (HWND property in COM instance)"
    ],
    "imageinterlace": [
        "int imageinterlace(resource im [, int interlace])",
        "Enable or disable interlace"
    ],
    "imageistruecolor": [
        "bool imageistruecolor(resource im)",
        "return true if the image uses truecolor"
    ],
    "imagejpeg": [
        "bool imagejpeg(resource im [, string filename [, int quality]])",
        "Output JPEG image to browser or file"
    ],
    "imagelayereffect": [
        "bool imagelayereffect(resource im, int effect)",
        "Set the alpha blending flag to use the bundled libgd layering effects"
    ],
    "imageline": [
        "bool imageline(resource im, int x1, int y1, int x2, int y2, int col)",
        "Draw a line"
    ],
    "imageloadfont": [
        "int imageloadfont(string filename)",
        "Load a new font"
    ],
    "imagepalettecopy": [
        "void imagepalettecopy(resource dst, resource src)",
        "Copy the palette from the src image onto the dst image"
    ],
    "imagepng": [
        "bool imagepng(resource im [, string filename])",
        "Output PNG image to browser or file"
    ],
    "imagepolygon": [
        "bool imagepolygon(resource im, array point, int num_points, int col)",
        "Draw a polygon"
    ],
    "imagepsbbox": [
        "array imagepsbbox(string text, resource font, int size [, int space, int tightness, float angle])",
        "Return the bounding box needed by a string if rasterized"
    ],
    "imagepscopyfont": [
        "int imagepscopyfont(int font_index)",
        "Make a copy of a font for purposes like extending or reenconding"
    ],
    "imagepsencodefont": [
        "bool imagepsencodefont(resource font_index, string filename)",
        "To change a fonts character encoding vector"
    ],
    "imagepsextendfont": [
        "bool imagepsextendfont(resource font_index, float extend)",
        "Extend or or condense if (extend < 1) a font"
    ],
    "imagepsfreefont": [
        "bool imagepsfreefont(resource font_index)",
        "Free memory used by a font"
    ],
    "imagepsloadfont": [
        "resource imagepsloadfont(string pathname)",
        "Load a new font from specified file"
    ],
    "imagepsslantfont": [
        "bool imagepsslantfont(resource font_index, float slant)",
        "Slant a font"
    ],
    "imagepstext": [
        "array imagepstext(resource image, string text, resource font, int size, int foreground, int background, int xcoord, int ycoord [, int space [, int tightness [, float angle [, int antialias])",
        "Rasterize a string over an image"
    ],
    "imagerectangle": [
        "bool imagerectangle(resource im, int x1, int y1, int x2, int y2, int col)",
        "Draw a rectangle"
    ],
    "imagerotate": [
        "resource imagerotate(resource src_im, float angle, int bgdcolor [, int ignoretransparent])",
        "Rotate an image using a custom angle"
    ],
    "imagesavealpha": [
        "bool imagesavealpha(resource im, bool on)",
        "Include alpha channel to a saved image"
    ],
    "imagesetbrush": [
        "bool imagesetbrush(resource image, resource brush)",
        "Set the brush image to $brush when filling $image with the \"IMG_COLOR_BRUSHED\" color"
    ],
    "imagesetpixel": [
        "bool imagesetpixel(resource im, int x, int y, int col)",
        "Set a single pixel"
    ],
    "imagesetstyle": [
        "bool imagesetstyle(resource im, array styles)",
        "Set the line drawing styles for use with imageline and IMG_COLOR_STYLED."
    ],
    "imagesetthickness": [
        "bool imagesetthickness(resource im, int thickness)",
        "Set line thickness for drawing lines, ellipses, rectangles, polygons etc."
    ],
    "imagesettile": [
        "bool imagesettile(resource image, resource tile)",
        "Set the tile image to $tile when filling $image with the \"IMG_COLOR_TILED\" color"
    ],
    "imagestring": [
        "bool imagestring(resource im, int font, int x, int y, string str, int col)",
        "Draw a string horizontally"
    ],
    "imagestringup": [
        "bool imagestringup(resource im, int font, int x, int y, string str, int col)",
        "Draw a string vertically - rotated 90 degrees counter-clockwise"
    ],
    "imagesx": [
        "int imagesx(resource im)",
        "Get image width"
    ],
    "imagesy": [
        "int imagesy(resource im)",
        "Get image height"
    ],
    "imagetruecolortopalette": [
        "void imagetruecolortopalette(resource im, bool ditherFlag, int colorsWanted)",
        "Convert a true colour image to a palette based image with a number of colours, optionally using dithering."
    ],
    "imagettfbbox": [
        "array imagettfbbox(float size, float angle, string font_file, string text)",
        "Give the bounding box of a text using TrueType fonts"
    ],
    "imagettftext": [
        "array imagettftext(resource im, float size, float angle, int x, int y, int col, string font_file, string text)",
        "Write text to the image using a TrueType font"
    ],
    "imagetypes": [
        "int imagetypes()",
        "Return the types of images supported in a bitfield - 1=GIF, 2=JPEG, 4=PNG, 8=WBMP, 16=XPM"
    ],
    "imagewbmp": [
        "bool imagewbmp(resource im [, string filename, [, int foreground]])",
        "Output WBMP image to browser or file"
    ],
    "imagexbm": [
        "int imagexbm(int im, string filename [, int foreground])",
        "Output XBM image to browser or file"
    ],
    "imap_8bit": [
        "string imap_8bit(string text)",
        "Convert an 8-bit string to a quoted-printable string"
    ],
    "imap_alerts": [
        "array imap_alerts()",
        "Returns an array of all IMAP alerts that have been generated since the last page load or since the last imap_alerts() call, whichever came last. The alert stack is cleared after imap_alerts() is called."
    ],
    "imap_append": [
        "bool imap_append(resource stream_id, string folder, string message [, string options [, string internal_date]])",
        "Append a new message to a specified mailbox"
    ],
    "imap_base64": [
        "string imap_base64(string text)",
        "Decode BASE64 encoded text"
    ],
    "imap_binary": [
        "string imap_binary(string text)",
        "Convert an 8bit string to a base64 string"
    ],
    "imap_body": [
        "string imap_body(resource stream_id, int msg_no [, int options])",
        "Read the message body"
    ],
    "imap_bodystruct": [
        "object imap_bodystruct(resource stream_id, int msg_no, string section)",
        "Read the structure of a specified body section of a specific message"
    ],
    "imap_check": [
        "object imap_check(resource stream_id)",
        "Get mailbox properties"
    ],
    "imap_clearflag_full": [
        "bool imap_clearflag_full(resource stream_id, string sequence, string flag [, int options])",
        "Clears flags on messages"
    ],
    "imap_close": [
        "bool imap_close(resource stream_id [, int options])",
        "Close an IMAP stream"
    ],
    "imap_createmailbox": [
        "bool imap_createmailbox(resource stream_id, string mailbox)",
        "Create a new mailbox"
    ],
    "imap_delete": [
        "bool imap_delete(resource stream_id, int msg_no [, int options])",
        "Mark a message for deletion"
    ],
    "imap_deletemailbox": [
        "bool imap_deletemailbox(resource stream_id, string mailbox)",
        "Delete a mailbox"
    ],
    "imap_errors": [
        "array imap_errors()",
        "Returns an array of all IMAP errors generated since the last page load, or since the last imap_errors() call, whichever came last. The error stack is cleared after imap_errors() is called."
    ],
    "imap_expunge": [
        "bool imap_expunge(resource stream_id)",
        "Permanently delete all messages marked for deletion"
    ],
    "imap_fetch_overview": [
        "array imap_fetch_overview(resource stream_id, string sequence [, int options])",
        "Read an overview of the information in the headers of the given message sequence"
    ],
    "imap_fetchbody": [
        "string imap_fetchbody(resource stream_id, int msg_no, string section [, int options])",
        "Get a specific body section"
    ],
    "imap_fetchheader": [
        "string imap_fetchheader(resource stream_id, int msg_no [, int options])",
        "Get the full unfiltered header for a message"
    ],
    "imap_fetchstructure": [
        "object imap_fetchstructure(resource stream_id, int msg_no [, int options])",
        "Read the full structure of a message"
    ],
    "imap_gc": [
        "bool imap_gc(resource stream_id, int flags)",
        "This function garbage collects (purges) the cache of entries of a specific type."
    ],
    "imap_get_quota": [
        "array imap_get_quota(resource stream_id, string qroot)",
        "Returns the quota set to the mailbox account qroot"
    ],
    "imap_get_quotaroot": [
        "array imap_get_quotaroot(resource stream_id, string mbox)",
        "Returns the quota set to the mailbox account mbox"
    ],
    "imap_getacl": [
        "array imap_getacl(resource stream_id, string mailbox)",
        "Gets the ACL for a given mailbox"
    ],
    "imap_getmailboxes": [
        "array imap_getmailboxes(resource stream_id, string ref, string pattern)",
        "Reads the list of mailboxes and returns a full array of objects containing name, attributes, and delimiter"
    ],
    "imap_getsubscribed": [
        "array imap_getsubscribed(resource stream_id, string ref, string pattern)",
        "Return a list of subscribed mailboxes, in the same format as imap_getmailboxes()"
    ],
    "imap_headerinfo": [
        "object imap_headerinfo(resource stream_id, int msg_no [, int from_length [, int subject_length [, string default_host]]])",
        "Read the headers of the message"
    ],
    "imap_headers": [
        "array imap_headers(resource stream_id)",
        "Returns headers for all messages in a mailbox"
    ],
    "imap_last_error": [
        "string imap_last_error()",
        "Returns the last error that was generated by an IMAP function. The error stack is NOT cleared after this call."
    ],
    "imap_list": [
        "array imap_list(resource stream_id, string ref, string pattern)",
        "Read the list of mailboxes"
    ],
    "imap_listscan": [
        "array imap_listscan(resource stream_id, string ref, string pattern, string content)",
        "Read list of mailboxes containing a certain string"
    ],
    "imap_lsub": [
        "array imap_lsub(resource stream_id, string ref, string pattern)",
        "Return a list of subscribed mailboxes"
    ],
    "imap_mail": [
        "bool imap_mail(string to, string subject, string message [, string additional_headers [, string cc [, string bcc [, string rpath]]]])",
        "Send an email message"
    ],
    "imap_mail_compose": [
        "string imap_mail_compose(array envelope, array body)",
        "Create a MIME message based on given envelope and body sections"
    ],
    "imap_mail_copy": [
        "bool imap_mail_copy(resource stream_id, string msglist, string mailbox [, int options])",
        "Copy specified message to a mailbox"
    ],
    "imap_mail_move": [
        "bool imap_mail_move(resource stream_id, string sequence, string mailbox [, int options])",
        "Move specified message to a mailbox"
    ],
    "imap_mailboxmsginfo": [
        "object imap_mailboxmsginfo(resource stream_id)",
        "Returns info about the current mailbox"
    ],
    "imap_mime_header_decode": [
        "array imap_mime_header_decode(string str)",
        "Decode mime header element in accordance with RFC 2047 and return array of objects containing 'charset' encoding and decoded 'text'"
    ],
    "imap_msgno": [
        "int imap_msgno(resource stream_id, int unique_msg_id)",
        "Get the sequence number associated with a UID"
    ],
    "imap_mutf7_to_utf8": [
        "string imap_mutf7_to_utf8(string in)",
        "Decode a modified UTF-7 string to UTF-8"
    ],
    "imap_num_msg": [
        "int imap_num_msg(resource stream_id)",
        "Gives the number of messages in the current mailbox"
    ],
    "imap_num_recent": [
        "int imap_num_recent(resource stream_id)",
        "Gives the number of recent messages in current mailbox"
    ],
    "imap_open": [
        "resource imap_open(string mailbox, string user, string password [, int options [, int n_retries]])",
        "Open an IMAP stream to a mailbox"
    ],
    "imap_ping": [
        "bool imap_ping(resource stream_id)",
        "Check if the IMAP stream is still active"
    ],
    "imap_qprint": [
        "string imap_qprint(string text)",
        "Convert a quoted-printable string to an 8-bit string"
    ],
    "imap_renamemailbox": [
        "bool imap_renamemailbox(resource stream_id, string old_name, string new_name)",
        "Rename a mailbox"
    ],
    "imap_reopen": [
        "bool imap_reopen(resource stream_id, string mailbox [, int options [, int n_retries]])",
        "Reopen an IMAP stream to a new mailbox"
    ],
    "imap_rfc822_parse_adrlist": [
        "array imap_rfc822_parse_adrlist(string address_string, string default_host)",
        "Parses an address string"
    ],
    "imap_rfc822_parse_headers": [
        "object imap_rfc822_parse_headers(string headers [, string default_host])",
        "Parse a set of mail headers contained in a string, and return an object similar to imap_headerinfo()"
    ],
    "imap_rfc822_write_address": [
        "string imap_rfc822_write_address(string mailbox, string host, string personal)",
        "Returns a properly formatted email address given the mailbox, host, and personal info"
    ],
    "imap_savebody": [
        "bool imap_savebody(resource stream_id, string|resource file, int msg_no[, string section = \"\"[, int options = 0]])",
        "Save a specific body section to a file"
    ],
    "imap_search": [
        "array imap_search(resource stream_id, string criteria [, int options [, string charset]])",
        "Return a list of messages matching the given criteria"
    ],
    "imap_set_quota": [
        "bool imap_set_quota(resource stream_id, string qroot, int mailbox_size)",
        "Will set the quota for qroot mailbox"
    ],
    "imap_setacl": [
        "bool imap_setacl(resource stream_id, string mailbox, string id, string rights)",
        "Sets the ACL for a given mailbox"
    ],
    "imap_setflag_full": [
        "bool imap_setflag_full(resource stream_id, string sequence, string flag [, int options])",
        "Sets flags on messages"
    ],
    "imap_sort": [
        "array imap_sort(resource stream_id, int criteria, int reverse [, int options [, string search_criteria [, string charset]]])",
        "Sort an array of message headers, optionally including only messages that meet specified criteria."
    ],
    "imap_status": [
        "object imap_status(resource stream_id, string mailbox, int options)",
        "Get status info from a mailbox"
    ],
    "imap_subscribe": [
        "bool imap_subscribe(resource stream_id, string mailbox)",
        "Subscribe to a mailbox"
    ],
    "imap_thread": [
        "array imap_thread(resource stream_id [, int options])",
        "Return threaded by REFERENCES tree"
    ],
    "imap_timeout": [
        "mixed imap_timeout(int timeout_type [, int timeout])",
        "Set or fetch imap timeout"
    ],
    "imap_uid": [
        "int imap_uid(resource stream_id, int msg_no)",
        "Get the unique message id associated with a standard sequential message number"
    ],
    "imap_undelete": [
        "bool imap_undelete(resource stream_id, int msg_no [, int flags])",
        "Remove the delete flag from a message"
    ],
    "imap_unsubscribe": [
        "bool imap_unsubscribe(resource stream_id, string mailbox)",
        "Unsubscribe from a mailbox"
    ],
    "imap_utf7_decode": [
        "string imap_utf7_decode(string buf)",
        "Decode a modified UTF-7 string"
    ],
    "imap_utf7_encode": [
        "string imap_utf7_encode(string buf)",
        "Encode a string in modified UTF-7"
    ],
    "imap_utf8": [
        "string imap_utf8(string mime_encoded_text)",
        "Convert a mime-encoded text to UTF-8"
    ],
    "imap_utf8_to_mutf7": [
        "string imap_utf8_to_mutf7(string in)",
        "Encode a UTF-8 string to modified UTF-7"
    ],
    "implode": [
        "string implode([string glue,] array pieces)",
        "Joins array elements placing glue string between items and return one string"
    ],
    "import_request_variables": [
        "bool import_request_variables(string types [, string prefix])",
        "Import GET/POST/Cookie variables into the global scope"
    ],
    "in_array": [
        "bool in_array(mixed needle, array haystack [, bool strict])",
        "Checks if the given value exists in the array"
    ],
    "include": [
        "bool include(string path)",
        "Includes and evaluates the specified file"
    ],
    "include_once": [
        "bool include_once(string path)",
        "Includes and evaluates the specified file"
    ],
    "inet_ntop": [
        "string inet_ntop(string in_addr)",
        "Converts a packed inet address to a human readable IP address string"
    ],
    "inet_pton": [
        "string inet_pton(string ip_address)",
        "Converts a human readable IP address to a packed binary string"
    ],
    "ini_get": [
        "string ini_get(string varname)",
        "Get a configuration option"
    ],
    "ini_get_all": [
        "array ini_get_all([string extension[, bool details = true]])",
        "Get all configuration options"
    ],
    "ini_restore": [
        "void ini_restore(string varname)",
        "Restore the value of a configuration option specified by varname"
    ],
    "ini_set": [
        "string ini_set(string varname, string newvalue)",
        "Set a configuration option, returns false on error and the old value of the configuration option on success"
    ],
    "interface_exists": [
        "bool interface_exists(string classname [, bool autoload])",
        "Checks if the class exists"
    ],
    "intl_error_name": [
        "string intl_error_name()",
        "* Return a string for a given error code.  * The string will be the same as the name of the error code constant."
    ],
    "intl_get_error_code": [
        "int intl_get_error_code()",
        "* Get code of the last occured error."
    ],
    "intl_get_error_message": [
        "string intl_get_error_message()",
        "* Get text description of the last occured error."
    ],
    "intl_is_failure": [
        "bool intl_is_failure()",
        "* Check whether the given error code indicates a failure.  * Returns true if it does, and false if the code  * indicates success or a warning."
    ],
    "intval": [
        "int intval(mixed var [, int base])",
        "Get the integer value of a variable using the optional base for the conversion"
    ],
    "ip2long": [
        "int ip2long(string ip_address)",
        "Converts a string containing an (IPv4) Internet Protocol dotted address into a proper address"
    ],
    "iptcembed": [
        "array iptcembed(string iptcdata, string jpeg_file_name [, int spool])",
        "Embed binary IPTC data into a JPEG image."
    ],
    "iptcparse": [
        "array iptcparse(string iptcdata)",
        "Parse binary IPTC-data into associative array"
    ],
    "is_a": [
        "bool is_a(object object, string class_name)",
        "Returns true if the object is of this class or has this class as one of its parents"
    ],
    "is_array": [
        "bool is_array(mixed var)",
        "Returns true if variable is an array"
    ],
    "is_bool": [
        "bool is_bool(mixed var)",
        "Returns true if variable is a boolean"
    ],
    "is_callable": [
        "bool is_callable(mixed var [, bool syntax_only [, string callable_name]])",
        "Returns true if var is callable."
    ],
    "is_countable": [
        "bool is_countable(mixed var)",
        "Returns true if var is countable, false otherwise"
    ],
    "is_dir": [
        "bool is_dir(string filename)",
        "Returns true if file is directory"
    ],
    "is_executable": [
        "bool is_executable(string filename)",
        "Returns true if file is executable"
    ],
    "is_file": [
        "bool is_file(string filename)",
        "Returns true if file is a regular file"
    ],
    "is_finite": [
        "bool is_finite(float val)",
        "Returns whether argument is finite"
    ],
    "is_float": [
        "bool is_float(mixed var)",
        "Returns true if variable is float point"
    ],
    "is_infinite": [
        "bool is_infinite(float val)",
        "Returns whether argument is infinite"
    ],
    "is_link": [
        "bool is_link(string filename)",
        "Returns true if file is symbolic link"
    ],
    "is_long": [
        "bool is_long(mixed var)",
        "Returns true if variable is a long (integer)"
    ],
    "is_nan": [
        "bool is_nan(float val)",
        "Returns whether argument is not a number"
    ],
    "is_null": [
        "bool is_null(mixed var)",
        "Returns true if variable is null"
    ],
    "is_numeric": [
        "bool is_numeric(mixed value)",
        "Returns true if value is a number or a numeric string"
    ],
    "is_object": [
        "bool is_object(mixed var)",
        "Returns true if variable is an object"
    ],
    "is_readable": [
        "bool is_readable(string filename)",
        "Returns true if file can be read"
    ],
    "is_resource": [
        "bool is_resource(mixed var)",
        "Returns true if variable is a resource"
    ],
    "is_scalar": [
        "bool is_scalar(mixed value)",
        "Returns true if value is a scalar"
    ],
    "is_string": [
        "bool is_string(mixed var)",
        "Returns true if variable is a string"
    ],
    "is_subclass_of": [
        "bool is_subclass_of(object object, string class_name)",
        "Returns true if the object has this class as one of its parents"
    ],
    "is_uploaded_file": [
        "bool is_uploaded_file(string path)",
        "Check if file was created by rfc1867 upload"
    ],
    "is_writable": [
        "bool is_writable(string filename)",
        "Returns true if file can be written"
    ],
    "isset": [
        "bool isset(mixed var [, mixed var])",
        "Determine whether a variable is set"
    ],
    "iterator_apply": [
        "int iterator_apply(Traversable iterator, callable function [, array args = null)",
        "Calls a function for every element in an iterator"
    ],
    "iterator_count": [
        "int iterator_count(Traversable iterator)",
        "Count the elements in an iterator"
    ],
    "iterator_to_array": [
        "array iterator_to_array(Traversable iterator [, bool use_keys = true])",
        "Copy the iterator into an array"
    ],
    "jddayofweek": [
        "mixed jddayofweek(int juliandaycount [, int mode])",
        "Returns name or number of day of week from julian day count"
    ],
    "jdmonthname": [
        "string jdmonthname(int juliandaycount, int mode)",
        "Returns name of month for julian day count"
    ],
    "jdtofrench": [
        "string jdtofrench(int juliandaycount)",
        "Converts a julian day count to a french republic calendar date"
    ],
    "jdtogregorian": [
        "string jdtogregorian(int juliandaycount)",
        "Converts a julian day count to a gregorian calendar date"
    ],
    "jdtojewish": [
        "string jdtojewish(int juliandaycount [, bool hebrew [, int fl]])",
        "Converts a julian day count to a jewish calendar date"
    ],
    "jdtojulian": [
        "string jdtojulian(int juliandaycount)",
        "Convert a julian day count to a julian calendar date"
    ],
    "jdtounix": [
        "int jdtounix(int jday)",
        "Convert Julian Day to UNIX timestamp"
    ],
    "jewishtojd": [
        "int jewishtojd(int month, int day, int year)",
        "Converts a jewish calendar date to a julian day count"
    ],
    "join": [
        "string join([string glue,] array pieces)",
        "Returns a string containing a string representation of all the arrayelements in the same order, with the glue string between each element"
    ],
    "jpeg2wbmp": [
        "bool jpeg2wbmp(string f_org, string f_dest, int d_height, int d_width, int threshold)",
        "Convert JPEG image to WBMP image"
    ],
    "json_decode": [
        "mixed json_decode(string json [, bool assoc [, long depth]])",
        "Decodes the JSON representation into a PHP value"
    ],
    "json_encode": [
        "string json_encode(mixed data [, int options])",
        "Returns the JSON representation of a value"
    ],
    "json_last_error": [
        "int json_last_error()",
        "Returns the error code of the last json_decode()."
    ],
    "juliantojd": [
        "int juliantojd(int month, int day, int year)",
        "Converts a julian calendar date to julian day count"
    ],
    "key": [
        "mixed key(array array_arg)",
        "Return the key of the element currently pointed to by the internal array pointer"
    ],
    "krsort": [
        "bool krsort(array &array_arg [, int sort_flags])",
        "Sort an array by key value in reverse order"
    ],
    "ksort": [
        "bool ksort(array &array_arg [, int sort_flags])",
        "Sort an array by key"
    ],
    "lcfirst": [
        "string lcfirst(string str)",
        "Make a string's first character lowercase"
    ],
    "lcg_value": [
        "float lcg_value()",
        "Returns a value from the combined linear congruential generator"
    ],
    "lchgrp": [
        "bool lchgrp(string filename, mixed group)",
        "Change symlink group"
    ],
    "ldap_8859_to_t61": [
        "string ldap_8859_to_t61(string value)",
        "Translate 8859 characters to t61 characters"
    ],
    "ldap_add": [
        "bool ldap_add(resource link, string dn, array entry)",
        "Add entries to LDAP directory"
    ],
    "ldap_bind": [
        "bool ldap_bind(resource link [, string dn [, string password]])",
        "Bind to LDAP directory"
    ],
    "ldap_compare": [
        "bool ldap_compare(resource link, string dn, string attr, string value)",
        "Determine if an entry has a specific value for one of its attributes"
    ],
    "ldap_connect": [
        "resource ldap_connect([string host [, int port [, string wallet [, string wallet_passwd [, int authmode]]]]])",
        "Connect to an LDAP server"
    ],
    "ldap_count_entries": [
        "int ldap_count_entries(resource link, resource result)",
        "Count the number of entries in a search result"
    ],
    "ldap_delete": [
        "bool ldap_delete(resource link, string dn)",
        "Delete an entry from a directory"
    ],
    "ldap_dn2ufn": [
        "string ldap_dn2ufn(string dn)",
        "Convert DN to User Friendly Naming format"
    ],
    "ldap_err2str": [
        "string ldap_err2str(int errno)",
        "Convert error number to error string"
    ],
    "ldap_errno": [
        "int ldap_errno(resource link)",
        "Get the current ldap error number"
    ],
    "ldap_error": [
        "string ldap_error(resource link)",
        "Get the current ldap error string"
    ],
    "ldap_explode_dn": [
        "array ldap_explode_dn(string dn, int with_attrib)",
        "Splits DN into its component parts"
    ],
    "ldap_first_attribute": [
        "string ldap_first_attribute(resource link, resource result_entry)",
        "Return first attribute"
    ],
    "ldap_first_entry": [
        "resource ldap_first_entry(resource link, resource result)",
        "Return first result id"
    ],
    "ldap_first_reference": [
        "resource ldap_first_reference(resource link, resource result)",
        "Return first reference"
    ],
    "ldap_free_result": [
        "bool ldap_free_result(resource result)",
        "Free result memory"
    ],
    "ldap_get_attributes": [
        "array ldap_get_attributes(resource link, resource result_entry)",
        "Get attributes from a search result entry"
    ],
    "ldap_get_dn": [
        "string ldap_get_dn(resource link, resource result_entry)",
        "Get the DN of a result entry"
    ],
    "ldap_get_entries": [
        "array ldap_get_entries(resource link, resource result)",
        "Get all result entries"
    ],
    "ldap_get_option": [
        "bool ldap_get_option(resource link, int option, mixed retval)",
        "Get the current value of various session-wide parameters"
    ],
    "ldap_get_values_len": [
        "array ldap_get_values_len(resource link, resource result_entry, string attribute)",
        "Get all values with lengths from a result entry"
    ],
    "ldap_list": [
        "resource ldap_list(resource|array link, string base_dn, string filter [, array attrs [, int attrsonly [, int sizelimit [, int timelimit [, int deref]]]]])",
        "Single-level search"
    ],
    "ldap_mod_add": [
        "bool ldap_mod_add(resource link, string dn, array entry)",
        "Add attribute values to current"
    ],
    "ldap_mod_del": [
        "bool ldap_mod_del(resource link, string dn, array entry)",
        "Delete attribute values"
    ],
    "ldap_mod_replace": [
        "bool ldap_mod_replace(resource link, string dn, array entry)",
        "Replace attribute values with new ones"
    ],
    "ldap_next_attribute": [
        "string ldap_next_attribute(resource link, resource result_entry)",
        "Get the next attribute in result"
    ],
    "ldap_next_entry": [
        "resource ldap_next_entry(resource link, resource result_entry)",
        "Get next result entry"
    ],
    "ldap_next_reference": [
        "resource ldap_next_reference(resource link, resource reference_entry)",
        "Get next reference"
    ],
    "ldap_parse_reference": [
        "bool ldap_parse_reference(resource link, resource reference_entry, array referrals)",
        "Extract information from reference entry"
    ],
    "ldap_parse_result": [
        "bool ldap_parse_result(resource link, resource result, int errcode, string matcheddn, string errmsg, array referrals)",
        "Extract information from result"
    ],
    "ldap_read": [
        "resource ldap_read(resource|array link, string base_dn, string filter [, array attrs [, int attrsonly [, int sizelimit [, int timelimit [, int deref]]]]])",
        "Read an entry"
    ],
    "ldap_rename": [
        "bool ldap_rename(resource link, string dn, string newrdn, string newparent, bool deleteoldrdn)",
        "Modify the name of an entry"
    ],
    "ldap_sasl_bind": [
        "bool ldap_sasl_bind(resource link [, string binddn [, string password [, string sasl_mech [, string sasl_realm [, string sasl_authc_id [, string sasl_authz_id [, string props]]]]]]])",
        "Bind to LDAP directory using SASL"
    ],
    "ldap_search": [
        "resource ldap_search(resource|array link, string base_dn, string filter [, array attrs [, int attrsonly [, int sizelimit [, int timelimit [, int deref]]]]])",
        "Search LDAP tree under base_dn"
    ],
    "ldap_set_option": [
        "bool ldap_set_option(resource link, int option, mixed newval)",
        "Set the value of various session-wide parameters"
    ],
    "ldap_set_rebind_proc": [
        "bool ldap_set_rebind_proc(resource link, string callback)",
        "Set a callback function to do re-binds on referral chasing."
    ],
    "ldap_sort": [
        "bool ldap_sort(resource link, resource result, string sortfilter)",
        "Sort LDAP result entries"
    ],
    "ldap_start_tls": [
        "bool ldap_start_tls(resource link)",
        "Start TLS"
    ],
    "ldap_t61_to_8859": [
        "string ldap_t61_to_8859(string value)",
        "Translate t61 characters to 8859 characters"
    ],
    "ldap_unbind": [
        "bool ldap_unbind(resource link)",
        "Unbind from LDAP directory"
    ],
    "leak": [
        "void leak(int num_bytes=3)",
        "Cause an intentional memory leak, for testing/debugging purposes"
    ],
    "levenshtein": [
        "int levenshtein(string str1, string str2[, int cost_ins, int cost_rep, int cost_del])",
        "Calculate Levenshtein distance between two strings"
    ],
    "libxml_clear_errors": [
        "void libxml_clear_errors()",
        "Clear last error from libxml"
    ],
    "libxml_disable_entity_loader": [
        "bool libxml_disable_entity_loader([bool disable])",
        "Disable/Enable ability to load external entities"
    ],
    "libxml_get_errors": [
        "object libxml_get_errors()",
        "Retrieve array of errors"
    ],
    "libxml_get_last_error": [
        "object libxml_get_last_error()",
        "Retrieve last error from libxml"
    ],
    "libxml_set_streams_context": [
        "void libxml_set_streams_context(resource streams_context)",
        "Set the streams context for the next libxml document load or write"
    ],
    "libxml_use_internal_errors": [
        "bool libxml_use_internal_errors([bool use_errors])",
        "Disable libxml errors and allow user to fetch error information as needed"
    ],
    "link": [
        "int link(string target, string link)",
        "Create a hard link"
    ],
    "linkinfo": [
        "int linkinfo(string filename)",
        "Returns the st_dev field of the UNIX C stat structure describing the link"
    ],
    "litespeed_request_headers": [
        "array litespeed_request_headers()",
        "Fetch all HTTP request headers"
    ],
    "litespeed_response_headers": [
        "array litespeed_response_headers()",
        "Fetch all HTTP response headers"
    ],
    "locale_accept_from_http": [
        "string locale_accept_from_http(string $http_accept)",
        null
    ],
    "locale_canonicalize": [
        "static string locale_canonicalize(Locale $loc, string $locale)",
        "* @param string $locale The locale string to canonicalize"
    ],
    "locale_filter_matches": [
        "bool locale_filter_matches(string $langtag, string $locale[, bool $canonicalize])",
        "* Checks if a $langtag filter matches with $locale according to RFC 4647's basic filtering algorithm"
    ],
    "locale_get_all_variants": [
        "static array locale_get_all_variants($locale)",
        "* gets an array containing the list of variants, or null"
    ],
    "locale_get_default": [
        "static string locale_get_default( )",
        "Get default locale"
    ],
    "locale_get_keywords": [
        "static array locale_get_keywords(string $locale) {",
        "* return an associative array containing keyword-value  * pairs for this locale. The keys are keys to the array"
    ],
    "locale_get_primary_language": [
        "static string locale_get_primary_language($locale)",
        "* gets the primary language for the $locale"
    ],
    "locale_get_region": [
        "static string locale_get_region($locale)",
        "* gets the region for the $locale"
    ],
    "locale_get_script": [
        "static string locale_get_script($locale)",
        "* gets the script for the $locale"
    ],
    "locale_lookup": [
        "string locale_lookup(array $langtag, string $locale[, bool $canonicalize[, string $default = null]])",
        "* Searchs the items in $langtag for the best match to the language * range"
    ],
    "locale_set_default": [
        "static string locale_set_default( string $locale )",
        "Set default locale"
    ],
    "localeconv": [
        "array localeconv()",
        "Returns numeric formatting information based on the current locale"
    ],
    "localtime": [
        "array localtime([int timestamp [, bool associative_array]])",
        "Returns the results of the C system call localtime as an associative array if the associative_array argument is set to 1 other wise it is a regular array"
    ],
    "log": [
        "float log(float number, [float base])",
        "Returns the natural logarithm of the number, or the base log if base is specified"
    ],
    "log10": [
        "float log10(float number)",
        "Returns the base-10 logarithm of the number"
    ],
    "log1p": [
        "float log1p(float number)",
        "Returns log(1 + number), computed in a way that accurate even when the value of number is close to zero"
    ],
    "long2ip": [
        "string long2ip(int proper_address)",
        "Converts an (IPv4) Internet network address into a string in Internet standard dotted format"
    ],
    "lstat": [
        "array lstat(string filename)",
        "Give information about a file or symbolic link"
    ],
    "ltrim": [
        "string ltrim(string str [, string character_mask])",
        "Strips whitespace from the beginning of a string"
    ],
    "mail": [
        "int mail(string to, string subject, string message [, string additional_headers [, string additional_parameters]])",
        "Send an email message"
    ],
    "max": [
        "mixed max(mixed arg1 [, mixed arg2 [, mixed ...]])",
        "Return the highest value in an array or a series of arguments"
    ],
    "mb_check_encoding": [
        "bool mb_check_encoding([string var[, string encoding]])",
        "Check if the string is valid for the specified encoding"
    ],
    "mb_convert_case": [
        "string mb_convert_case(string sourcestring, int mode [, string encoding])",
        "Returns a case-folded version of sourcestring"
    ],
    "mb_convert_encoding": [
        "string mb_convert_encoding(string str, string to-encoding [, mixed from-encoding])",
        "Returns converted string in desired encoding"
    ],
    "mb_convert_kana": [
        "string mb_convert_kana(string str [, string option] [, string encoding])",
        "Conversion between full-width character and half-width character (Japanese)"
    ],
    "mb_convert_variables": [
        "string mb_convert_variables(string to-encoding, mixed from-encoding, mixed vars [, ...])",
        "Converts the string resource in variables to desired encoding"
    ],
    "mb_decode_mimeheader": [
        "string mb_decode_mimeheader(string string)",
        "Decodes the MIME \"encoded-word\" in the string"
    ],
    "mb_decode_numericentity": [
        "string mb_decode_numericentity(string string, array convmap [, string encoding])",
        "Converts HTML numeric entities to character code"
    ],
    "mb_detect_encoding": [
        "string mb_detect_encoding(string str [, mixed encoding_list [, bool strict]])",
        "Encodings of the given string is returned (as a string)"
    ],
    "mb_detect_order": [
        "bool|array mb_detect_order([mixed encoding-list])",
        "Sets the current detect_order or Return the current detect_order as a array"
    ],
    "mb_encode_mimeheader": [
        "string mb_encode_mimeheader(string str [, string charset [, string transfer-encoding [, string linefeed [, int indent]]]])",
        "Converts the string to MIME \"encoded-word\" in the format of =?charset?(B|Q)?encoded_string?="
    ],
    "mb_encode_numericentity": [
        "string mb_encode_numericentity(string string, array convmap [, string encoding])",
        "Converts specified characters to HTML numeric entities"
    ],
    "mb_encoding_aliases": [
        "array mb_encoding_aliases(string encoding)",
        "Returns an array of the aliases of a given encoding name"
    ],
    "mb_ereg": [
        "int mb_ereg(string pattern, string string [, array registers])",
        "Regular expression match for multibyte string"
    ],
    "mb_ereg_match": [
        "bool mb_ereg_match(string pattern, string string [,string option])",
        "Regular expression match for multibyte string"
    ],
    "mb_ereg_replace": [
        "string mb_ereg_replace(string pattern, string replacement, string string [, string option])",
        "Replace regular expression for multibyte string"
    ],
    "mb_ereg_search": [
        "bool mb_ereg_search([string pattern[, string option]])",
        "Regular expression search for multibyte string"
    ],
    "mb_ereg_search_getpos": [
        "int mb_ereg_search_getpos()",
        "Get search start position"
    ],
    "mb_ereg_search_getregs": [
        "array mb_ereg_search_getregs()",
        "Get matched substring of the last time"
    ],
    "mb_ereg_search_init": [
        "bool mb_ereg_search_init(string string [, string pattern[, string option]])",
        "Initialize string and regular expression for search."
    ],
    "mb_ereg_search_pos": [
        "array mb_ereg_search_pos([string pattern[, string option]])",
        "Regular expression search for multibyte string"
    ],
    "mb_ereg_search_regs": [
        "array mb_ereg_search_regs([string pattern[, string option]])",
        "Regular expression search for multibyte string"
    ],
    "mb_ereg_search_setpos": [
        "bool mb_ereg_search_setpos(int position)",
        "Set search start position"
    ],
    "mb_eregi": [
        "int mb_eregi(string pattern, string string [, array registers])",
        "Case-insensitive regular expression match for multibyte string"
    ],
    "mb_eregi_replace": [
        "string mb_eregi_replace(string pattern, string replacement, string string)",
        "Case insensitive replace regular expression for multibyte string"
    ],
    "mb_get_info": [
        "mixed mb_get_info([string type])",
        "Returns the current settings of mbstring"
    ],
    "mb_http_input": [
        "mixed mb_http_input([string type])",
        "Returns the input encoding"
    ],
    "mb_http_output": [
        "string mb_http_output([string encoding])",
        "Sets the current output_encoding or returns the current output_encoding as a string"
    ],
    "mb_internal_encoding": [
        "string mb_internal_encoding([string encoding])",
        "Sets the current internal encoding or Returns the current internal encoding as a string"
    ],
    "mb_language": [
        "string mb_language([string language])",
        "Sets the current language or Returns the current language as a string"
    ],
    "mb_list_encodings": [
        "mixed mb_list_encodings()",
        "Returns an array of all supported entity encodings"
    ],
    "mb_output_handler": [
        "string mb_output_handler(string contents, int status)",
        "Returns string in output buffer converted to the http_output encoding"
    ],
    "mb_parse_str": [
        "bool mb_parse_str(string encoded_string [, array result])",
        "Parses GET/POST/COOKIE data and sets global variables"
    ],
    "mb_preferred_mime_name": [
        "string mb_preferred_mime_name(string encoding)",
        "Return the preferred MIME name (charset) as a string"
    ],
    "mb_regex_encoding": [
        "string mb_regex_encoding([string encoding])",
        "Returns the current encoding for regex as a string."
    ],
    "mb_regex_set_options": [
        "string mb_regex_set_options([string options])",
        "Set or get the default options for mbregex functions"
    ],
    "mb_send_mail": [
        "int mb_send_mail(string to, string subject, string message [, string additional_headers [, string additional_parameters]])",
        "*  Sends an email message with MIME scheme"
    ],
    "mb_split": [
        "array mb_split(string pattern, string string [, int limit])",
        "split multibyte string into array by regular expression"
    ],
    "mb_strcut": [
        "string mb_strcut(string str, int start [, int length [, string encoding]])",
        "Returns part of a string"
    ],
    "mb_strimwidth": [
        "string mb_strimwidth(string str, int start, int width [, string trimmarker [, string encoding]])",
        "Trim the string in terminal width"
    ],
    "mb_stripos": [
        "int mb_stripos(string haystack, string needle [, int offset [, string encoding]])",
        "Finds position of first occurrence of a string within another, case insensitive"
    ],
    "mb_stristr": [
        "string mb_stristr(string haystack, string needle[, bool part[, string encoding]])",
        "Finds first occurrence of a string within another, case insensitive"
    ],
    "mb_strlen": [
        "int mb_strlen(string str [, string encoding])",
        "Get character numbers of a string"
    ],
    "mb_strpos": [
        "int mb_strpos(string haystack, string needle [, int offset [, string encoding]])",
        "Find position of first occurrence of a string within another"
    ],
    "mb_strrchr": [
        "string mb_strrchr(string haystack, string needle[, bool part[, string encoding]])",
        "Finds the last occurrence of a character in a string within another"
    ],
    "mb_strrichr": [
        "string mb_strrichr(string haystack, string needle[, bool part[, string encoding]])",
        "Finds the last occurrence of a character in a string within another, case insensitive"
    ],
    "mb_strripos": [
        "int mb_strripos(string haystack, string needle [, int offset [, string encoding]])",
        "Finds position of last occurrence of a string within another, case insensitive"
    ],
    "mb_strrpos": [
        "int mb_strrpos(string haystack, string needle [, int offset [, string encoding]])",
        "Find position of last occurrence of a string within another"
    ],
    "mb_strstr": [
        "string mb_strstr(string haystack, string needle[, bool part[, string encoding]])",
        "Finds first occurrence of a string within another"
    ],
    "mb_strtolower": [
        "string mb_strtolower(string sourcestring [, string encoding])",
        "*  Returns a lowercased version of sourcestring"
    ],
    "mb_strtoupper": [
        "string mb_strtoupper(string sourcestring [, string encoding])",
        "*  Returns a uppercased version of sourcestring"
    ],
    "mb_strwidth": [
        "int mb_strwidth(string str [, string encoding])",
        "Gets terminal width of a string"
    ],
    "mb_substitute_character": [
        "mixed mb_substitute_character([mixed substchar])",
        "Sets the current substitute_character or returns the current substitute_character"
    ],
    "mb_substr": [
        "string mb_substr(string str, int start [, int length [, string encoding]])",
        "Returns part of a string"
    ],
    "mb_substr_count": [
        "int mb_substr_count(string haystack, string needle [, string encoding])",
        "Count the number of substring occurrences"
    ],
    "mcrypt_cbc": [
        "string mcrypt_cbc(int cipher, string key, string data, int mode, string iv)",
        "CBC crypt/decrypt data using key key with cipher cipher starting with iv"
    ],
    "mcrypt_cfb": [
        "string mcrypt_cfb(int cipher, string key, string data, int mode, string iv)",
        "CFB crypt/decrypt data using key key with cipher cipher starting with iv"
    ],
    "mcrypt_create_iv": [
        "string mcrypt_create_iv(int size, int source)",
        "Create an initialization vector (IV)"
    ],
    "mcrypt_decrypt": [
        "string mcrypt_decrypt(string cipher, string key, string data, string mode, string iv)",
        "OFB crypt/decrypt data using key key with cipher cipher starting with iv"
    ],
    "mcrypt_ecb": [
        "string mcrypt_ecb(int cipher, string key, string data, int mode, string iv)",
        "ECB crypt/decrypt data using key key with cipher cipher starting with iv"
    ],
    "mcrypt_enc_get_algorithms_name": [
        "string mcrypt_enc_get_algorithms_name(resource td)",
        "Returns the name of the algorithm specified by the descriptor td"
    ],
    "mcrypt_enc_get_block_size": [
        "int mcrypt_enc_get_block_size(resource td)",
        "Returns the block size of the cipher specified by the descriptor td"
    ],
    "mcrypt_enc_get_iv_size": [
        "int mcrypt_enc_get_iv_size(resource td)",
        "Returns the size of the IV in bytes of the algorithm specified by the descriptor td"
    ],
    "mcrypt_enc_get_key_size": [
        "int mcrypt_enc_get_key_size(resource td)",
        "Returns the maximum supported key size in bytes of the algorithm specified by the descriptor td"
    ],
    "mcrypt_enc_get_modes_name": [
        "string mcrypt_enc_get_modes_name(resource td)",
        "Returns the name of the mode specified by the descriptor td"
    ],
    "mcrypt_enc_get_supported_key_sizes": [
        "array mcrypt_enc_get_supported_key_sizes(resource td)",
        "This function decrypts the crypttext"
    ],
    "mcrypt_enc_is_block_algorithm": [
        "bool mcrypt_enc_is_block_algorithm(resource td)",
        "Returns TRUE if the alrogithm is a block algorithms"
    ],
    "mcrypt_enc_is_block_algorithm_mode": [
        "bool mcrypt_enc_is_block_algorithm_mode(resource td)",
        "Returns TRUE if the mode is for use with block algorithms"
    ],
    "mcrypt_enc_is_block_mode": [
        "bool mcrypt_enc_is_block_mode(resource td)",
        "Returns TRUE if the mode outputs blocks"
    ],
    "mcrypt_enc_self_test": [
        "int mcrypt_enc_self_test(resource td)",
        "This function runs the self test on the algorithm specified by the descriptor td"
    ],
    "mcrypt_encrypt": [
        "string mcrypt_encrypt(string cipher, string key, string data, string mode, string iv)",
        "OFB crypt/decrypt data using key key with cipher cipher starting with iv"
    ],
    "mcrypt_generic": [
        "string mcrypt_generic(resource td, string data)",
        "This function encrypts the plaintext"
    ],
    "mcrypt_generic_deinit": [
        "bool mcrypt_generic_deinit(resource td)",
        "This function terminates encrypt specified by the descriptor td"
    ],
    "mcrypt_generic_init": [
        "int mcrypt_generic_init(resource td, string key, string iv)",
        "This function initializes all buffers for the specific module"
    ],
    "mcrypt_get_block_size": [
        "int mcrypt_get_block_size(string cipher, string module)",
        "Get the key size of cipher"
    ],
    "mcrypt_get_cipher_name": [
        "string mcrypt_get_cipher_name(string cipher)",
        "Get the key size of cipher"
    ],
    "mcrypt_get_iv_size": [
        "int mcrypt_get_iv_size(string cipher, string module)",
        "Get the IV size of cipher (Usually the same as the blocksize)"
    ],
    "mcrypt_get_key_size": [
        "int mcrypt_get_key_size(string cipher, string module)",
        "Get the key size of cipher"
    ],
    "mcrypt_list_algorithms": [
        "array mcrypt_list_algorithms([string lib_dir])",
        "List all algorithms in \"module_dir\""
    ],
    "mcrypt_list_modes": [
        "array mcrypt_list_modes([string lib_dir])",
        "List all modes \"module_dir\""
    ],
    "mcrypt_module_close": [
        "bool mcrypt_module_close(resource td)",
        "Free the descriptor td"
    ],
    "mcrypt_module_get_algo_block_size": [
        "int mcrypt_module_get_algo_block_size(string algorithm [, string lib_dir])",
        "Returns the block size of the algorithm"
    ],
    "mcrypt_module_get_algo_key_size": [
        "int mcrypt_module_get_algo_key_size(string algorithm [, string lib_dir])",
        "Returns the maximum supported key size of the algorithm"
    ],
    "mcrypt_module_get_supported_key_sizes": [
        "array mcrypt_module_get_supported_key_sizes(string algorithm [, string lib_dir])",
        "This function decrypts the crypttext"
    ],
    "mcrypt_module_is_block_algorithm": [
        "bool mcrypt_module_is_block_algorithm(string algorithm [, string lib_dir])",
        "Returns TRUE if the algorithm is a block algorithm"
    ],
    "mcrypt_module_is_block_algorithm_mode": [
        "bool mcrypt_module_is_block_algorithm_mode(string mode [, string lib_dir])",
        "Returns TRUE if the mode is for use with block algorithms"
    ],
    "mcrypt_module_is_block_mode": [
        "bool mcrypt_module_is_block_mode(string mode [, string lib_dir])",
        "Returns TRUE if the mode outputs blocks of bytes"
    ],
    "mcrypt_module_open": [
        "resource mcrypt_module_open(string cipher, string cipher_directory, string mode, string mode_directory)",
        "Opens the module of the algorithm and the mode to be used"
    ],
    "mcrypt_module_self_test": [
        "bool mcrypt_module_self_test(string algorithm [, string lib_dir])",
        "Does a self test of the module \"module\""
    ],
    "mcrypt_ofb": [
        "string mcrypt_ofb(int cipher, string key, string data, int mode, string iv)",
        "OFB crypt/decrypt data using key key with cipher cipher starting with iv"
    ],
    "md5": [
        "string md5(string str, [ bool raw_output])",
        "Calculate the md5 hash of a string"
    ],
    "md5_file": [
        "string md5_file(string filename [, bool raw_output])",
        "Calculate the md5 hash of given filename"
    ],
    "mdecrypt_generic": [
        "string mdecrypt_generic(resource td, string data)",
        "This function decrypts the plaintext"
    ],
    "memory_get_peak_usage": [
        "int memory_get_peak_usage([real_usage])",
        "Returns the peak allocated by PHP memory"
    ],
    "memory_get_usage": [
        "int memory_get_usage([real_usage])",
        "Returns the allocated by PHP memory"
    ],
    "metaphone": [
        "string metaphone(string text[, int phones])",
        "Break english phrases down into their phonemes"
    ],
    "method_exists": [
        "bool method_exists(object object, string method)",
        "Checks if the class method exists"
    ],
    "mhash": [
        "string mhash(int hash, string data [, string key])",
        "Hash data with hash"
    ],
    "mhash_count": [
        "int mhash_count()",
        "Gets the number of available hashes"
    ],
    "mhash_get_block_size": [
        "int mhash_get_block_size(int hash)",
        "Gets the block size of hash"
    ],
    "mhash_get_hash_name": [
        "string mhash_get_hash_name(int hash)",
        "Gets the name of hash"
    ],
    "mhash_keygen_s2k": [
        "string mhash_keygen_s2k(int hash, string input_password, string salt, int bytes)",
        "Generates a key using hash functions"
    ],
    "microtime": [
        "mixed microtime([bool get_as_float])",
        "Returns either a string or a float containing the current time in seconds and microseconds"
    ],
    "mime_content_type": [
        "string mime_content_type(string filename|resource stream)",
        "Return content-type for file"
    ],
    "min": [
        "mixed min(mixed arg1 [, mixed arg2 [, mixed ...]])",
        "Return the lowest value in an array or a series of arguments"
    ],
    "mkdir": [
        "bool mkdir(string pathname [, int mode [, bool recursive [, resource context]]])",
        "Create a directory"
    ],
    "mktime": [
        "int mktime([int hour [, int min [, int sec [, int mon [, int day [, int year]]]]]])",
        "Get UNIX timestamp for a date"
    ],
    "money_format": [
        "string money_format(string format , float value)",
        "Convert monetary value(s) to string"
    ],
    "move_uploaded_file": [
        "bool move_uploaded_file(string path, string new_path)",
        "Move a file if and only if it was created by an upload"
    ],
    "msg_get_queue": [
        "resource msg_get_queue(int key [, int perms])",
        "Attach to a message queue"
    ],
    "msg_queue_exists": [
        "bool msg_queue_exists(int key)",
        "Check whether a message queue exists"
    ],
    "msg_receive": [
        "mixed msg_receive(resource queue, int desiredmsgtype, int &msgtype, int maxsize, mixed message [, bool unserialize=true [, int flags=0 [, int errorcode]]])",
        "Send a message of type msgtype (must be > 0) to a message queue"
    ],
    "msg_remove_queue": [
        "bool msg_remove_queue(resource queue)",
        "Destroy the queue"
    ],
    "msg_send": [
        "bool msg_send(resource queue, int msgtype, mixed message [, bool serialize=true [, bool blocking=true [, int errorcode]]])",
        "Send a message of type msgtype (must be > 0) to a message queue"
    ],
    "msg_set_queue": [
        "bool msg_set_queue(resource queue, array data)",
        "Set information for a message queue"
    ],
    "msg_stat_queue": [
        "array msg_stat_queue(resource queue)",
        "Returns information about a message queue"
    ],
    "msgfmt_create": [
        "MessageFormatter msgfmt_create( string $locale, string $pattern )",
        "* Create formatter."
    ],
    "msgfmt_format": [
        "mixed msgfmt_format( MessageFormatter $nf, array $args )",
        "* Format a message."
    ],
    "msgfmt_format_message": [
        "mixed msgfmt_format_message( string $locale, string $pattern, array $args )",
        "* Format a message."
    ],
    "msgfmt_get_error_code": [
        "int msgfmt_get_error_code( MessageFormatter $nf )",
        "* Get formatter's last error code."
    ],
    "msgfmt_get_error_message": [
        "string msgfmt_get_error_message( MessageFormatter $coll )",
        "* Get text description for formatter's last error code."
    ],
    "msgfmt_get_locale": [
        "string msgfmt_get_locale(MessageFormatter $mf)",
        "* Get formatter locale."
    ],
    "msgfmt_get_pattern": [
        "string msgfmt_get_pattern( MessageFormatter $mf )",
        "* Get formatter pattern."
    ],
    "msgfmt_parse": [
        "array msgfmt_parse( MessageFormatter $nf, string $source )",
        "* Parse a message."
    ],
    "msgfmt_set_pattern": [
        "bool msgfmt_set_pattern( MessageFormatter $mf, string $pattern )",
        "* Set formatter pattern."
    ],
    "mssql_bind": [
        "bool mssql_bind(resource stmt, string param_name, mixed var, int type [, bool is_output [, bool is_null [, int maxlen]]])",
        "Adds a parameter to a stored procedure or a remote stored procedure"
    ],
    "mssql_close": [
        "bool mssql_close([resource conn_id])",
        "Closes a connection to a MS-SQL server"
    ],
    "mssql_connect": [
        "int mssql_connect([string servername [, string username [, string password [, bool new_link]]]])",
        "Establishes a connection to a MS-SQL server"
    ],
    "mssql_data_seek": [
        "bool mssql_data_seek(resource result_id, int offset)",
        "Moves the internal row pointer of the MS-SQL result associated with the specified result identifier to pointer to the specified row number"
    ],
    "mssql_execute": [
        "mixed mssql_execute(resource stmt [, bool skip_results = false])",
        "Executes a stored procedure on a MS-SQL server database"
    ],
    "mssql_fetch_array": [
        "array mssql_fetch_array(resource result_id [, int result_type])",
        "Returns an associative array of the current row in the result set specified by result_id"
    ],
    "mssql_fetch_assoc": [
        "array mssql_fetch_assoc(resource result_id)",
        "Returns an associative array of the current row in the result set specified by result_id"
    ],
    "mssql_fetch_batch": [
        "int mssql_fetch_batch(resource result_index)",
        "Returns the next batch of records"
    ],
    "mssql_fetch_field": [
        "object mssql_fetch_field(resource result_id [, int offset])",
        "Gets information about certain fields in a query result"
    ],
    "mssql_fetch_object": [
        "object mssql_fetch_object(resource result_id)",
        "Returns a pseudo-object of the current row in the result set specified by result_id"
    ],
    "mssql_fetch_row": [
        "array mssql_fetch_row(resource result_id)",
        "Returns an array of the current row in the result set specified by result_id"
    ],
    "mssql_field_length": [
        "int mssql_field_length(resource result_id [, int offset])",
        "Get the length of a MS-SQL field"
    ],
    "mssql_field_name": [
        "string mssql_field_name(resource result_id [, int offset])",
        "Returns the name of the field given by offset in the result set given by result_id"
    ],
    "mssql_field_seek": [
        "bool mssql_field_seek(resource result_id, int offset)",
        "Seeks to the specified field offset"
    ],
    "mssql_field_type": [
        "string mssql_field_type(resource result_id [, int offset])",
        "Returns the type of a field"
    ],
    "mssql_free_result": [
        "bool mssql_free_result(resource result_index)",
        "Free a MS-SQL result index"
    ],
    "mssql_free_statement": [
        "bool mssql_free_statement(resource result_index)",
        "Free a MS-SQL statement index"
    ],
    "mssql_get_last_message": [
        "string mssql_get_last_message()",
        "Gets the last message from the MS-SQL server"
    ],
    "mssql_guid_string": [
        "string mssql_guid_string(string binary [,bool short_format])",
        "Converts a 16 byte binary GUID to a string"
    ],
    "mssql_init": [
        "int mssql_init(string sp_name [, resource conn_id])",
        "Initializes a stored procedure or a remote stored procedure"
    ],
    "mssql_min_error_severity": [
        "void mssql_min_error_severity(int severity)",
        "Sets the lower error severity"
    ],
    "mssql_min_message_severity": [
        "void mssql_min_message_severity(int severity)",
        "Sets the lower message severity"
    ],
    "mssql_next_result": [
        "bool mssql_next_result(resource result_id)",
        "Move the internal result pointer to the next result"
    ],
    "mssql_num_fields": [
        "int mssql_num_fields(resource mssql_result_index)",
        "Returns the number of fields fetched in from the result id specified"
    ],
    "mssql_num_rows": [
        "int mssql_num_rows(resource mssql_result_index)",
        "Returns the number of rows fetched in from the result id specified"
    ],
    "mssql_pconnect": [
        "int mssql_pconnect([string servername [, string username [, string password [, bool new_link]]]])",
        "Establishes a persistent connection to a MS-SQL server"
    ],
    "mssql_query": [
        "resource mssql_query(string query [, resource conn_id [, int batch_size]])",
        "Perform an SQL query on a MS-SQL server database"
    ],
    "mssql_result": [
        "string mssql_result(resource result_id, int row, mixed field)",
        "Returns the contents of one cell from a MS-SQL result set"
    ],
    "mssql_rows_affected": [
        "int mssql_rows_affected(resource conn_id)",
        "Returns the number of records affected by the query"
    ],
    "mssql_select_db": [
        "bool mssql_select_db(string database_name [, resource conn_id])",
        "Select a MS-SQL database"
    ],
    "mt_getrandmax": [
        "int mt_getrandmax()",
        "Returns the maximum value a random number from Mersenne Twister can have"
    ],
    "mt_rand": [
        "int mt_rand([int min, int max])",
        "Returns a random number from Mersenne Twister"
    ],
    "mt_srand": [
        "void mt_srand([int seed])",
        "Seeds Mersenne Twister random number generator"
    ],
    "mysql_affected_rows": [
        "int mysql_affected_rows([int link_identifier])",
        "Gets number of affected rows in previous MySQL operation"
    ],
    "mysql_client_encoding": [
        "string mysql_client_encoding([int link_identifier])",
        "Returns the default character set for the current connection"
    ],
    "mysql_close": [
        "bool mysql_close([int link_identifier])",
        "Close a MySQL connection"
    ],
    "mysql_connect": [
        "resource mysql_connect([string hostname[:port][:/path/to/socket] [, string username [, string password [, bool new [, int flags]]]]])",
        "Opens a connection to a MySQL Server"
    ],
    "mysql_create_db": [
        "bool mysql_create_db(string database_name [, int link_identifier])",
        "Create a MySQL database"
    ],
    "mysql_data_seek": [
        "bool mysql_data_seek(resource result, int row_number)",
        "Move internal result pointer"
    ],
    "mysql_db_query": [
        "resource mysql_db_query(string database_name, string query [, int link_identifier])",
        "Sends an SQL query to MySQL"
    ],
    "mysql_drop_db": [
        "bool mysql_drop_db(string database_name [, int link_identifier])",
        "Drops (delete) a MySQL database"
    ],
    "mysql_errno": [
        "int mysql_errno([int link_identifier])",
        "Returns the number of the error message from previous MySQL operation"
    ],
    "mysql_error": [
        "string mysql_error([int link_identifier])",
        "Returns the text of the error message from previous MySQL operation"
    ],
    "mysql_escape_string": [
        "string mysql_escape_string(string to_be_escaped)",
        "Escape string for mysql query"
    ],
    "mysql_fetch_array": [
        "array mysql_fetch_array(resource result [, int result_type])",
        "Fetch a result row as an array (associative, numeric or both)"
    ],
    "mysql_fetch_assoc": [
        "array mysql_fetch_assoc(resource result)",
        "Fetch a result row as an associative array"
    ],
    "mysql_fetch_field": [
        "object mysql_fetch_field(resource result [, int field_offset])",
        "Gets column information from a result and return as an object"
    ],
    "mysql_fetch_lengths": [
        "array mysql_fetch_lengths(resource result)",
        "Gets max data size of each column in a result"
    ],
    "mysql_fetch_object": [
        "object mysql_fetch_object(resource result [, string class_name [, NULL|array ctor_params]])",
        "Fetch a result row as an object"
    ],
    "mysql_fetch_row": [
        "array mysql_fetch_row(resource result)",
        "Gets a result row as an enumerated array"
    ],
    "mysql_field_flags": [
        "string mysql_field_flags(resource result, int field_offset)",
        "Gets the flags associated with the specified field in a result"
    ],
    "mysql_field_len": [
        "int mysql_field_len(resource result, int field_offset)",
        "Returns the length of the specified field"
    ],
    "mysql_field_name": [
        "string mysql_field_name(resource result, int field_index)",
        "Gets the name of the specified field in a result"
    ],
    "mysql_field_seek": [
        "bool mysql_field_seek(resource result, int field_offset)",
        "Sets result pointer to a specific field offset"
    ],
    "mysql_field_table": [
        "string mysql_field_table(resource result, int field_offset)",
        "Gets name of the table the specified field is in"
    ],
    "mysql_field_type": [
        "string mysql_field_type(resource result, int field_offset)",
        "Gets the type of the specified field in a result"
    ],
    "mysql_free_result": [
        "bool mysql_free_result(resource result)",
        "Free result memory"
    ],
    "mysql_get_client_info": [
        "string mysql_get_client_info()",
        "Returns a string that represents the client library version"
    ],
    "mysql_get_host_info": [
        "string mysql_get_host_info([int link_identifier])",
        "Returns a string describing the type of connection in use, including the server host name"
    ],
    "mysql_get_proto_info": [
        "int mysql_get_proto_info([int link_identifier])",
        "Returns the protocol version used by current connection"
    ],
    "mysql_get_server_info": [
        "string mysql_get_server_info([int link_identifier])",
        "Returns a string that represents the server version number"
    ],
    "mysql_info": [
        "string mysql_info([int link_identifier])",
        "Returns a string containing information about the most recent query"
    ],
    "mysql_insert_id": [
        "int mysql_insert_id([int link_identifier])",
        "Gets the ID generated from the previous INSERT operation"
    ],
    "mysql_list_dbs": [
        "resource mysql_list_dbs([int link_identifier])",
        "List databases available on a MySQL server"
    ],
    "mysql_list_fields": [
        "resource mysql_list_fields(string database_name, string table_name [, int link_identifier])",
        "List MySQL result fields"
    ],
    "mysql_list_processes": [
        "resource mysql_list_processes([int link_identifier])",
        "Returns a result set describing the current server threads"
    ],
    "mysql_list_tables": [
        "resource mysql_list_tables(string database_name [, int link_identifier])",
        "List tables in a MySQL database"
    ],
    "mysql_num_fields": [
        "int mysql_num_fields(resource result)",
        "Gets number of fields in a result"
    ],
    "mysql_num_rows": [
        "int mysql_num_rows(resource result)",
        "Gets number of rows in a result"
    ],
    "mysql_pconnect": [
        "resource mysql_pconnect([string hostname[:port][:/path/to/socket] [, string username [, string password [, int flags]]]])",
        "Opens a persistent connection to a MySQL Server"
    ],
    "mysql_ping": [
        "bool mysql_ping([int link_identifier])",
        "Ping a server connection. If no connection then reconnect."
    ],
    "mysql_query": [
        "resource mysql_query(string query [, int link_identifier])",
        "Sends an SQL query to MySQL"
    ],
    "mysql_real_escape_string": [
        "string mysql_real_escape_string(string to_be_escaped [, int link_identifier])",
        "Escape special characters in a string for use in a SQL statement, taking into account the current charset of the connection"
    ],
    "mysql_result": [
        "mixed mysql_result(resource result, int row [, mixed field])",
        "Gets result data"
    ],
    "mysql_select_db": [
        "bool mysql_select_db(string database_name [, int link_identifier])",
        "Selects a MySQL database"
    ],
    "mysql_set_charset": [
        "bool mysql_set_charset(string csname [, int link_identifier])",
        "sets client character set"
    ],
    "mysql_stat": [
        "string mysql_stat([int link_identifier])",
        "Returns a string containing status information"
    ],
    "mysql_thread_id": [
        "int mysql_thread_id([int link_identifier])",
        "Returns the thread id of current connection"
    ],
    "mysql_unbuffered_query": [
        "resource mysql_unbuffered_query(string query [, int link_identifier])",
        "Sends an SQL query to MySQL, without fetching and buffering the result rows"
    ],
    "mysqli_affected_rows": [
        "mixed mysqli_affected_rows(object link)",
        "Get number of affected rows in previous MySQL operation"
    ],
    "mysqli_autocommit": [
        "bool mysqli_autocommit(object link, bool mode)",
        "Turn auto commit on or of"
    ],
    "mysqli_cache_stats": [
        "array mysqli_cache_stats()",
        "Returns statistics about the zval cache"
    ],
    "mysqli_change_user": [
        "bool mysqli_change_user(object link, string user, string password, string database)",
        "Change logged-in user of the active connection"
    ],
    "mysqli_character_set_name": [
        "string mysqli_character_set_name(object link)",
        "Returns the name of the character set used for this connection"
    ],
    "mysqli_close": [
        "bool mysqli_close(object link)",
        "Close connection"
    ],
    "mysqli_commit": [
        "bool mysqli_commit(object link)",
        "Commit outstanding actions and close transaction"
    ],
    "mysqli_connect": [
        "object mysqli_connect([string hostname [,string username [,string passwd [,string dbname [,int port [,string socket]]]]]])",
        "Open a connection to a mysql server"
    ],
    "mysqli_connect_errno": [
        "int mysqli_connect_errno()",
        "Returns the numerical value of the error message from last connect command"
    ],
    "mysqli_connect_error": [
        "string mysqli_connect_error()",
        "Returns the text of the error message from previous MySQL operation"
    ],
    "mysqli_data_seek": [
        "bool mysqli_data_seek(object result, int offset)",
        "Move internal result pointer"
    ],
    "mysqli_debug": [
        "void mysqli_debug(string debug)",
        ""
    ],
    "mysqli_dump_debug_info": [
        "bool mysqli_dump_debug_info(object link)",
        ""
    ],
    "mysqli_embedded_server_end": [
        "void mysqli_embedded_server_end()",
        ""
    ],
    "mysqli_embedded_server_start": [
        "bool mysqli_embedded_server_start(bool start, array arguments, array groups)",
        "initialize and start embedded server"
    ],
    "mysqli_errno": [
        "int mysqli_errno(object link)",
        "Returns the numerical value of the error message from previous MySQL operation"
    ],
    "mysqli_error": [
        "string mysqli_error(object link)",
        "Returns the text of the error message from previous MySQL operation"
    ],
    "mysqli_fetch_all": [
        "mixed mysqli_fetch_all(object result [,int resulttype])",
        "Fetches all result rows as an associative array, a numeric array, or both"
    ],
    "mysqli_fetch_array": [
        "mixed mysqli_fetch_array(object result [,int resulttype])",
        "Fetch a result row as an associative array, a numeric array, or both"
    ],
    "mysqli_fetch_assoc": [
        "mixed mysqli_fetch_assoc(object result)",
        "Fetch a result row as an associative array"
    ],
    "mysqli_fetch_field": [
        "mixed mysqli_fetch_field(object result)",
        "Get column information from a result and return as an object"
    ],
    "mysqli_fetch_field_direct": [
        "mixed mysqli_fetch_field_direct(object result, int offset)",
        "Fetch meta-data for a single field"
    ],
    "mysqli_fetch_fields": [
        "mixed mysqli_fetch_fields(object result)",
        "Return array of objects containing field meta-data"
    ],
    "mysqli_fetch_lengths": [
        "mixed mysqli_fetch_lengths(object result)",
        "Get the length of each output in a result"
    ],
    "mysqli_fetch_object": [
        "mixed mysqli_fetch_object(object result [, string class_name [, NULL|array ctor_params]])",
        "Fetch a result row as an object"
    ],
    "mysqli_fetch_row": [
        "array mysqli_fetch_row(object result)",
        "Get a result row as an enumerated array"
    ],
    "mysqli_field_count": [
        "int mysqli_field_count(object link)",
        "Fetch the number of fields returned by the last query for the given link"
    ],
    "mysqli_field_seek": [
        "int mysqli_field_seek(object result, int fieldnr)",
        "Set result pointer to a specified field offset"
    ],
    "mysqli_field_tell": [
        "int mysqli_field_tell(object result)",
        "Get current field offset of result pointer"
    ],
    "mysqli_free_result": [
        "void mysqli_free_result(object result)",
        "Free query result memory for the given result handle"
    ],
    "mysqli_get_charset": [
        "object mysqli_get_charset(object link)",
        "returns a character set object"
    ],
    "mysqli_get_client_info": [
        "string mysqli_get_client_info()",
        "Get MySQL client info"
    ],
    "mysqli_get_client_stats": [
        "array mysqli_get_client_stats()",
        "Returns statistics about the zval cache"
    ],
    "mysqli_get_client_version": [
        "int mysqli_get_client_version()",
        "Get MySQL client info"
    ],
    "mysqli_get_connection_stats": [
        "array mysqli_get_connection_stats()",
        "Returns statistics about the zval cache"
    ],
    "mysqli_get_host_info": [
        "string mysqli_get_host_info(object link)",
        "Get MySQL host info"
    ],
    "mysqli_get_proto_info": [
        "int mysqli_get_proto_info(object link)",
        "Get MySQL protocol information"
    ],
    "mysqli_get_server_info": [
        "string mysqli_get_server_info(object link)",
        "Get MySQL server info"
    ],
    "mysqli_get_server_version": [
        "int mysqli_get_server_version(object link)",
        "Return the MySQL version for the server referenced by the given link"
    ],
    "mysqli_get_warnings": [
        "object mysqli_get_warnings(object link)",
        ""
    ],
    "mysqli_info": [
        "string mysqli_info(object link)",
        "Get information about the most recent query"
    ],
    "mysqli_init": [
        "resource mysqli_init()",
        "Initialize mysqli and return a resource for use with mysql_real_connect"
    ],
    "mysqli_insert_id": [
        "mixed mysqli_insert_id(object link)",
        "Get the ID generated from the previous INSERT operation"
    ],
    "mysqli_kill": [
        "bool mysqli_kill(object link, int processid)",
        "Kill a mysql process on the server"
    ],
    "mysqli_link_construct": [
        "object mysqli_link_construct()",
        ""
    ],
    "mysqli_more_results": [
        "bool mysqli_more_results(object link)",
        "check if there any more query results from a multi query"
    ],
    "mysqli_multi_query": [
        "bool mysqli_multi_query(object link, string query)",
        "allows to execute multiple queries"
    ],
    "mysqli_next_result": [
        "bool mysqli_next_result(object link)",
        "read next result from multi_query"
    ],
    "mysqli_num_fields": [
        "int mysqli_num_fields(object result)",
        "Get number of fields in result"
    ],
    "mysqli_num_rows": [
        "mixed mysqli_num_rows(object result)",
        "Get number of rows in result"
    ],
    "mysqli_options": [
        "bool mysqli_options(object link, int flags, mixed values)",
        "Set options"
    ],
    "mysqli_ping": [
        "bool mysqli_ping(object link)",
        "Ping a server connection or reconnect if there is no connection"
    ],
    "mysqli_poll": [
        "int mysqli_poll(array read, array write, array error, long sec [, long usec])",
        "Poll connections"
    ],
    "mysqli_prepare": [
        "mixed mysqli_prepare(object link, string query)",
        "Prepare a SQL statement for execution"
    ],
    "mysqli_query": [
        "mixed mysqli_query(object link, string query [,int resultmode])",
        ""
    ],
    "mysqli_real_connect": [
        "bool mysqli_real_connect(object link [,string hostname [,string username [,string passwd [,string dbname [,int port [,string socket [,int flags]]]]]]])",
        "Open a connection to a mysql server"
    ],
    "mysqli_real_escape_string": [
        "string mysqli_real_escape_string(object link, string escapestr)",
        "Escapes special characters in a string for use in a SQL statement, taking into account the current charset of the connection"
    ],
    "mysqli_real_query": [
        "bool mysqli_real_query(object link, string query)",
        "Binary-safe version of mysql_query()"
    ],
    "mysqli_reap_async_query": [
        "int mysqli_reap_async_query(object link)",
        "Poll connections"
    ],
    "mysqli_refresh": [
        "bool mysqli_refresh(object link, long options)",
        "Flush tables or caches, or reset replication server information"
    ],
    "mysqli_report": [
        "bool mysqli_report(int flags)",
        "sets report level"
    ],
    "mysqli_rollback": [
        "bool mysqli_rollback(object link)",
        "Undo actions from current transaction"
    ],
    "mysqli_select_db": [
        "bool mysqli_select_db(object link, string dbname)",
        "Select a MySQL database"
    ],
    "mysqli_set_charset": [
        "bool mysqli_set_charset(object link, string csname)",
        "sets client character set"
    ],
    "mysqli_set_local_infile_default": [
        "void mysqli_set_local_infile_default(object link)",
        "unsets user defined handler for load local infile command"
    ],
    "mysqli_set_local_infile_handler": [
        "bool mysqli_set_local_infile_handler(object link, callback read_func)",
        "Set callback functions for LOAD DATA LOCAL INFILE"
    ],
    "mysqli_sqlstate": [
        "string mysqli_sqlstate(object link)",
        "Returns the SQLSTATE error from previous MySQL operation"
    ],
    "mysqli_ssl_set": [
        "bool mysqli_ssl_set(object link ,string key ,string cert ,string ca ,string capath ,string cipher])",
        ""
    ],
    "mysqli_stat": [
        "mixed mysqli_stat(object link)",
        "Get current system status"
    ],
    "mysqli_stmt_affected_rows": [
        "mixed mysqli_stmt_affected_rows(object stmt)",
        "Return the number of rows affected in the last query for the given link"
    ],
    "mysqli_stmt_attr_get": [
        "int mysqli_stmt_attr_get(object stmt, long attr)",
        ""
    ],
    "mysqli_stmt_attr_set": [
        "int mysqli_stmt_attr_set(object stmt, long attr, long mode)",
        ""
    ],
    "mysqli_stmt_bind_param": [
        "bool mysqli_stmt_bind_param(object stmt, string types, mixed variable [,mixed,....])",
        "Bind variables to a prepared statement as parameters"
    ],
    "mysqli_stmt_bind_result": [
        "bool mysqli_stmt_bind_result(object stmt, mixed var, [,mixed, ...])",
        "Bind variables to a prepared statement for result storage"
    ],
    "mysqli_stmt_close": [
        "bool mysqli_stmt_close(object stmt)",
        "Close statement"
    ],
    "mysqli_stmt_data_seek": [
        "void mysqli_stmt_data_seek(object stmt, int offset)",
        "Move internal result pointer"
    ],
    "mysqli_stmt_errno": [
        "int mysqli_stmt_errno(object stmt)",
        ""
    ],
    "mysqli_stmt_error": [
        "string mysqli_stmt_error(object stmt)",
        ""
    ],
    "mysqli_stmt_execute": [
        "bool mysqli_stmt_execute(object stmt)",
        "Execute a prepared statement"
    ],
    "mysqli_stmt_fetch": [
        "mixed mysqli_stmt_fetch(object stmt)",
        "Fetch results from a prepared statement into the bound variables"
    ],
    "mysqli_stmt_field_count": [
        "int mysqli_stmt_field_count(object stmt) {",
        "Return the number of result columns for the given statement"
    ],
    "mysqli_stmt_free_result": [
        "void mysqli_stmt_free_result(object stmt)",
        "Free stored result memory for the given statement handle"
    ],
    "mysqli_stmt_get_result": [
        "object mysqli_stmt_get_result(object link)",
        "Buffer result set on client"
    ],
    "mysqli_stmt_get_warnings": [
        "object mysqli_stmt_get_warnings(object link)",
        ""
    ],
    "mysqli_stmt_init": [
        "mixed mysqli_stmt_init(object link)",
        "Initialize statement object"
    ],
    "mysqli_stmt_insert_id": [
        "mixed mysqli_stmt_insert_id(object stmt)",
        "Get the ID generated from the previous INSERT operation"
    ],
    "mysqli_stmt_next_result": [
        "bool mysqli_stmt_next_result(object link)",
        "read next result from multi_query"
    ],
    "mysqli_stmt_num_rows": [
        "mixed mysqli_stmt_num_rows(object stmt)",
        "Return the number of rows in statements result set"
    ],
    "mysqli_stmt_param_count": [
        "int mysqli_stmt_param_count(object stmt)",
        "Return the number of parameter for the given statement"
    ],
    "mysqli_stmt_prepare": [
        "bool mysqli_stmt_prepare(object stmt, string query)",
        "prepare server side statement with query"
    ],
    "mysqli_stmt_reset": [
        "bool mysqli_stmt_reset(object stmt)",
        "reset a prepared statement"
    ],
    "mysqli_stmt_result_metadata": [
        "mixed mysqli_stmt_result_metadata(object stmt)",
        "return result set from statement"
    ],
    "mysqli_stmt_send_long_data": [
        "bool mysqli_stmt_send_long_data(object stmt, int param_nr, string data)",
        ""
    ],
    "mysqli_stmt_sqlstate": [
        "string mysqli_stmt_sqlstate(object stmt)",
        ""
    ],
    "mysqli_stmt_store_result": [
        "bool mysqli_stmt_store_result(stmt)",
        ""
    ],
    "mysqli_store_result": [
        "object mysqli_store_result(object link)",
        "Buffer result set on client"
    ],
    "mysqli_thread_id": [
        "int mysqli_thread_id(object link)",
        "Return the current thread ID"
    ],
    "mysqli_thread_safe": [
        "bool mysqli_thread_safe()",
        "Return whether thread safety is given or not"
    ],
    "mysqli_use_result": [
        "mixed mysqli_use_result(object link)",
        "Directly retrieve query results - do not buffer results on client side"
    ],
    "mysqli_warning_count": [
        "int mysqli_warning_count(object link)",
        "Return number of warnings from the last query for the given link"
    ],
    "natcasesort": [
        "void natcasesort(array &array_arg)",
        "Sort an array using case-insensitive natural sort"
    ],
    "natsort": [
        "void natsort(array &array_arg)",
        "Sort an array using natural sort"
    ],
    "next": [
        "mixed next(array array_arg)",
        "Move array argument's internal pointer to the next element and return it"
    ],
    "ngettext": [
        "string ngettext(string MSGID1, string MSGID2, int N)",
        "Plural version of gettext()"
    ],
    "nl2br": [
        "string nl2br(string str [, bool is_xhtml])",
        "Converts newlines to HTML line breaks"
    ],
    "nl_langinfo": [
        "string nl_langinfo(int item)",
        "Query language and locale information"
    ],
    "normalizer_is_normalize": [
        "bool normalizer_is_normalize( string $input [, string $form = FORM_C] )",
        "* Test if a string is in a given normalization form."
    ],
    "normalizer_normalize": [
        "string normalizer_normalize( string $input [, string $form = FORM_C] )",
        "* Normalize a string."
    ],
    "nsapi_request_headers": [
        "array nsapi_request_headers()",
        "Get all headers from the request"
    ],
    "nsapi_response_headers": [
        "array nsapi_response_headers()",
        "Get all headers from the response"
    ],
    "nsapi_virtual": [
        "bool nsapi_virtual(string uri)",
        "Perform an NSAPI sub-request"
    ],
    "number_format": [
        "string number_format(float number [, int num_decimal_places [, string dec_seperator, string thousands_seperator]])",
        "Formats a number with grouped thousands"
    ],
    "numfmt_create": [
        "NumberFormatter numfmt_create( string $locale, int style[, string $pattern ] )",
        "* Create number formatter."
    ],
    "numfmt_format": [
        "mixed numfmt_format( NumberFormatter $nf, mixed $num[, int type] )",
        "* Format a number."
    ],
    "numfmt_format_currency": [
        "mixed numfmt_format_currency( NumberFormatter $nf, double $num, string $currency )",
        "* Format a number as currency."
    ],
    "numfmt_get_attribute": [
        "mixed numfmt_get_attribute( NumberFormatter $nf, int $attr )",
        "* Get formatter attribute value."
    ],
    "numfmt_get_error_code": [
        "int numfmt_get_error_code( NumberFormatter $nf )",
        "* Get formatter's last error code."
    ],
    "numfmt_get_error_message": [
        "string numfmt_get_error_message( NumberFormatter $nf )",
        "* Get text description for formatter's last error code."
    ],
    "numfmt_get_locale": [
        "string numfmt_get_locale( NumberFormatter $nf[, int type] )",
        "* Get formatter locale."
    ],
    "numfmt_get_pattern": [
        "string numfmt_get_pattern( NumberFormatter $nf )",
        "* Get formatter pattern."
    ],
    "numfmt_get_symbol": [
        "string numfmt_get_symbol( NumberFormatter $nf, int $attr )",
        "* Get formatter symbol value."
    ],
    "numfmt_get_text_attribute": [
        "string numfmt_get_text_attribute( NumberFormatter $nf, int $attr )",
        "* Get formatter attribute value."
    ],
    "numfmt_parse": [
        "mixed numfmt_parse( NumberFormatter $nf, string $str[, int $type, int &$position ])",
        "* Parse a number."
    ],
    "numfmt_parse_currency": [
        "double numfmt_parse_currency( NumberFormatter $nf, string $str, string $&currency[, int $&position] )",
        "* Parse a number as currency."
    ],
    "numfmt_parse_message": [
        "array numfmt_parse_message( string $locale, string $pattern, string $source )",
        "* Parse a message."
    ],
    "numfmt_set_attribute": [
        "bool numfmt_set_attribute( NumberFormatter $nf, int $attr, mixed $value )",
        "* Get formatter attribute value."
    ],
    "numfmt_set_pattern": [
        "bool numfmt_set_pattern( NumberFormatter $nf, string $pattern )",
        "* Set formatter pattern."
    ],
    "numfmt_set_symbol": [
        "bool numfmt_set_symbol( NumberFormatter $nf, int $attr, string $symbol )",
        "* Set formatter symbol value."
    ],
    "numfmt_set_text_attribute": [
        "bool numfmt_set_text_attribute( NumberFormatter $nf, int $attr, string $value )",
        "* Get formatter attribute value."
    ],
    "ob_clean": [
        "bool ob_clean()",
        "Clean (delete) the current output buffer"
    ],
    "ob_end_clean": [
        "bool ob_end_clean()",
        "Clean the output buffer, and delete current output buffer"
    ],
    "ob_end_flush": [
        "bool ob_end_flush()",
        "Flush (send) the output buffer, and delete current output buffer"
    ],
    "ob_flush": [
        "bool ob_flush()",
        "Flush (send) contents of the output buffer. The last buffer content is sent to next buffer"
    ],
    "ob_get_clean": [
        "bool ob_get_clean()",
        "Get current buffer contents and delete current output buffer"
    ],
    "ob_get_contents": [
        "string ob_get_contents()",
        "Return the contents of the output buffer"
    ],
    "ob_get_flush": [
        "bool ob_get_flush()",
        "Get current buffer contents, flush (send) the output buffer, and delete current output buffer"
    ],
    "ob_get_length": [
        "int ob_get_length()",
        "Return the length of the output buffer"
    ],
    "ob_get_level": [
        "int ob_get_level()",
        "Return the nesting level of the output buffer"
    ],
    "ob_get_status": [
        "false|array ob_get_status([bool full_status])",
        "Return the status of the active or all output buffers"
    ],
    "ob_gzhandler": [
        "string ob_gzhandler(string str, int mode)",
        "Encode str based on accept-encoding setting - designed to be called from ob_start()"
    ],
    "ob_iconv_handler": [
        "string ob_iconv_handler(string contents, int status)",
        "Returns str in output buffer converted to the iconv.output_encoding character set"
    ],
    "ob_implicit_flush": [
        "void ob_implicit_flush([int flag])",
        "Turn implicit flush on/off and is equivalent to calling flush() after every output call"
    ],
    "ob_list_handlers": [
        "false|array ob_list_handlers()",
        "*  List all output_buffers in an array"
    ],
    "ob_start": [
        "bool ob_start([ string|array user_function [, int chunk_size [, bool erase]]])",
        "Turn on Output Buffering (specifying an optional output handler)."
    ],
    "oci_bind_array_by_name": [
        "bool oci_bind_array_by_name(resource stmt, string name, array &var, int max_table_length [, int max_item_length [, int type ]])",
        "Bind a PHP array to an Oracle PL/SQL type by name"
    ],
    "oci_bind_by_name": [
        "bool oci_bind_by_name(resource stmt, string name, mixed &var, [, int maxlength [, int type]])",
        "Bind a PHP variable to an Oracle placeholder by name"
    ],
    "oci_cancel": [
        "bool oci_cancel(resource stmt)",
        "Cancel reading from a cursor"
    ],
    "oci_close": [
        "bool oci_close(resource connection)",
        "Disconnect from database"
    ],
    "oci_collection_append": [
        "bool oci_collection_append(string value)",
        "Append an object to the collection"
    ],
    "oci_collection_assign": [
        "bool oci_collection_assign(object from)",
        "Assign a collection from another existing collection"
    ],
    "oci_collection_element_assign": [
        "bool oci_collection_element_assign(int index, string val)",
        "Assign element val to collection at index ndx"
    ],
    "oci_collection_element_get": [
        "string oci_collection_element_get(int ndx)",
        "Retrieve the value at collection index ndx"
    ],
    "oci_collection_max": [
        "int oci_collection_max()",
        "Return the max value of a collection. For a varray this is the maximum length of the array"
    ],
    "oci_collection_size": [
        "int oci_collection_size()",
        "Return the size of a collection"
    ],
    "oci_collection_trim": [
        "bool oci_collection_trim(int num)",
        "Trim num elements from the end of a collection"
    ],
    "oci_commit": [
        "bool oci_commit(resource connection)",
        "Commit the current context"
    ],
    "oci_connect": [
        "resource oci_connect(string user, string pass [, string db [, string charset [, int session_mode ]])",
        "Connect to an Oracle database and log on. Returns a new session."
    ],
    "oci_define_by_name": [
        "bool oci_define_by_name(resource stmt, string name, mixed &var [, int type])",
        "Define a PHP variable to an Oracle column by name"
    ],
    "oci_error": [
        "array oci_error([resource stmt|connection|global])",
        "Return the last error of stmt|connection|global. If no error happened returns false."
    ],
    "oci_execute": [
        "bool oci_execute(resource stmt [, int mode])",
        "Execute a parsed statement"
    ],
    "oci_fetch": [
        "bool oci_fetch(resource stmt)",
        "Prepare a new row of data for reading"
    ],
    "oci_fetch_all": [
        "int oci_fetch_all(resource stmt, array &output[, int skip[, int maxrows[, int flags]]])",
        "Fetch all rows of result data into an array"
    ],
    "oci_fetch_array": [
        "array oci_fetch_array( resource stmt [, int mode ])",
        "Fetch a result row as an array"
    ],
    "oci_fetch_assoc": [
        "array oci_fetch_assoc( resource stmt )",
        "Fetch a result row as an associative array"
    ],
    "oci_fetch_object": [
        "object oci_fetch_object( resource stmt )",
        "Fetch a result row as an object"
    ],
    "oci_fetch_row": [
        "array oci_fetch_row( resource stmt )",
        "Fetch a result row as an enumerated array"
    ],
    "oci_field_is_null": [
        "bool oci_field_is_null(resource stmt, int col)",
        "Tell whether a column is NULL"
    ],
    "oci_field_name": [
        "string oci_field_name(resource stmt, int col)",
        "Tell the name of a column"
    ],
    "oci_field_precision": [
        "int oci_field_precision(resource stmt, int col)",
        "Tell the precision of a column"
    ],
    "oci_field_scale": [
        "int oci_field_scale(resource stmt, int col)",
        "Tell the scale of a column"
    ],
    "oci_field_size": [
        "int oci_field_size(resource stmt, int col)",
        "Tell the maximum data size of a column"
    ],
    "oci_field_type": [
        "mixed oci_field_type(resource stmt, int col)",
        "Tell the data type of a column"
    ],
    "oci_field_type_raw": [
        "int oci_field_type_raw(resource stmt, int col)",
        "Tell the raw oracle data type of a column"
    ],
    "oci_free_collection": [
        "bool oci_free_collection()",
        "Deletes collection object"
    ],
    "oci_free_descriptor": [
        "bool oci_free_descriptor()",
        "Deletes large object description"
    ],
    "oci_free_statement": [
        "bool oci_free_statement(resource stmt)",
        "Free all resources associated with a statement"
    ],
    "oci_internal_debug": [
        "void oci_internal_debug(int onoff)",
        "Toggle internal debugging output for the OCI extension"
    ],
    "oci_lob_append": [
        "bool oci_lob_append( object lob )",
        "Appends data from a LOB to another LOB"
    ],
    "oci_lob_close": [
        "bool oci_lob_close()",
        "Closes lob descriptor"
    ],
    "oci_lob_copy": [
        "bool oci_lob_copy( object lob_to, object lob_from [, int length ] )",
        "Copies data from a LOB to another LOB"
    ],
    "oci_lob_eof": [
        "bool oci_lob_eof()",
        "Checks if EOF is reached"
    ],
    "oci_lob_erase": [
        "int oci_lob_erase( [ int offset [, int length ] ] )",
        "Erases a specified portion of the internal LOB, starting at a specified offset"
    ],
    "oci_lob_export": [
        "bool oci_lob_export([string filename [, int start [, int length]]])",
        "Writes a large object into a file"
    ],
    "oci_lob_flush": [
        "bool oci_lob_flush( [ int flag ] )",
        "Flushes the LOB buffer"
    ],
    "oci_lob_import": [
        "bool oci_lob_import( string filename )",
        "Loads file into a LOB"
    ],
    "oci_lob_is_equal": [
        "bool oci_lob_is_equal( object lob1, object lob2 )",
        "Tests to see if two LOB/FILE locators are equal"
    ],
    "oci_lob_load": [
        "string oci_lob_load()",
        "Loads a large object"
    ],
    "oci_lob_read": [
        "string oci_lob_read( int length )",
        "Reads particular part of a large object"
    ],
    "oci_lob_rewind": [
        "bool oci_lob_rewind()",
        "Rewind pointer of a LOB"
    ],
    "oci_lob_save": [
        "bool oci_lob_save( string data [, int offset ])",
        "Saves a large object"
    ],
    "oci_lob_seek": [
        "bool oci_lob_seek( int offset [, int whence ])",
        "Moves the pointer of a LOB"
    ],
    "oci_lob_size": [
        "int oci_lob_size()",
        "Returns size of a large object"
    ],
    "oci_lob_tell": [
        "int oci_lob_tell()",
        "Tells LOB pointer position"
    ],
    "oci_lob_truncate": [
        "bool oci_lob_truncate( [ int length ])",
        "Truncates a LOB"
    ],
    "oci_lob_write": [
        "int oci_lob_write( string string [, int length ])",
        "Writes data to current position of a LOB"
    ],
    "oci_lob_write_temporary": [
        "bool oci_lob_write_temporary(string var [, int lob_type])",
        "Writes temporary blob"
    ],
    "oci_new_collection": [
        "object oci_new_collection(resource connection, string tdo [, string schema])",
        "Initialize a new collection"
    ],
    "oci_new_connect": [
        "resource oci_new_connect(string user, string pass [, string db])",
        "Connect to an Oracle database and log on. Returns a new session."
    ],
    "oci_new_cursor": [
        "resource oci_new_cursor(resource connection)",
        "Return a new cursor (Statement-Handle) - use this to bind ref-cursors!"
    ],
    "oci_new_descriptor": [
        "object oci_new_descriptor(resource connection [, int type])",
        "Initialize a new empty descriptor LOB/FILE (LOB is default)"
    ],
    "oci_num_fields": [
        "int oci_num_fields(resource stmt)",
        "Return the number of result columns in a statement"
    ],
    "oci_num_rows": [
        "int oci_num_rows(resource stmt)",
        "Return the row count of an OCI statement"
    ],
    "oci_parse": [
        "resource oci_parse(resource connection, string query)",
        "Parse a query and return a statement"
    ],
    "oci_password_change": [
        "bool oci_password_change(resource connection, string username, string old_password, string new_password)",
        "Changes the password of an account"
    ],
    "oci_pconnect": [
        "resource oci_pconnect(string user, string pass [, string db [, string charset ]])",
        "Connect to an Oracle database using a persistent connection and log on. Returns a new session."
    ],
    "oci_result": [
        "string oci_result(resource stmt, mixed column)",
        "Return a single column of result data"
    ],
    "oci_rollback": [
        "bool oci_rollback(resource connection)",
        "Rollback the current context"
    ],
    "oci_server_version": [
        "string oci_server_version(resource connection)",
        "Return a string containing server version information"
    ],
    "oci_set_action": [
        "bool oci_set_action(resource connection, string value)",
        "Sets the action attribute on the connection"
    ],
    "oci_set_client_identifier": [
        "bool oci_set_client_identifier(resource connection, string value)",
        "Sets the client identifier attribute on the connection"
    ],
    "oci_set_client_info": [
        "bool oci_set_client_info(resource connection, string value)",
        "Sets the client info attribute on the connection"
    ],
    "oci_set_edition": [
        "bool oci_set_edition(string value)",
        "Sets the edition attribute for all subsequent connections created"
    ],
    "oci_set_module_name": [
        "bool oci_set_module_name(resource connection, string value)",
        "Sets the module attribute on the connection"
    ],
    "oci_set_prefetch": [
        "bool oci_set_prefetch(resource stmt, int prefetch_rows)",
        "Sets the number of rows to be prefetched on execute to prefetch_rows for stmt"
    ],
    "oci_statement_type": [
        "string oci_statement_type(resource stmt)",
        "Return the query type of an OCI statement"
    ],
    "ocifetchinto": [
        "int ocifetchinto(resource stmt, array &output [, int mode])",
        "Fetch a row of result data into an array"
    ],
    "ocigetbufferinglob": [
        "bool ocigetbufferinglob()",
        "Returns current state of buffering for a LOB"
    ],
    "ocisetbufferinglob": [
        "bool ocisetbufferinglob( bool flag )",
        "Enables/disables buffering for a LOB"
    ],
    "octdec": [
        "int octdec(string octal_number)",
        "Returns the decimal equivalent of an octal string"
    ],
    "odbc_autocommit": [
        "mixed odbc_autocommit(resource connection_id [, int OnOff])",
        "Toggle autocommit mode or get status"
    ],
    "odbc_binmode": [
        "bool odbc_binmode(int result_id, int mode)",
        "Handle binary column data"
    ],
    "odbc_close": [
        "void odbc_close(resource connection_id)",
        "Close an ODBC connection"
    ],
    "odbc_close_all": [
        "void odbc_close_all()",
        "Close all ODBC connections"
    ],
    "odbc_columnprivileges": [
        "resource odbc_columnprivileges(resource connection_id, string catalog, string schema, string table, string column)",
        "Returns a result identifier that can be used to fetch a list of columns and associated privileges for the specified table"
    ],
    "odbc_columns": [
        "resource odbc_columns(resource connection_id [, string qualifier [, string owner [, string table_name [, string column_name]]]])",
        "Returns a result identifier that can be used to fetch a list of column names in specified tables"
    ],
    "odbc_commit": [
        "bool odbc_commit(resource connection_id)",
        "Commit an ODBC transaction"
    ],
    "odbc_connect": [
        "resource odbc_connect(string DSN, string user, string password [, int cursor_option])",
        "Connect to a datasource"
    ],
    "odbc_cursor": [
        "string odbc_cursor(resource result_id)",
        "Get cursor name"
    ],
    "odbc_data_source": [
        "array odbc_data_source(resource connection_id, int fetch_type)",
        "Return information about the currently connected data source"
    ],
    "odbc_error": [
        "string odbc_error([resource connection_id])",
        "Get the last error code"
    ],
    "odbc_errormsg": [
        "string odbc_errormsg([resource connection_id])",
        "Get the last error message"
    ],
    "odbc_exec": [
        "resource odbc_exec(resource connection_id, string query [, int flags])",
        "Prepare and execute an SQL statement"
    ],
    "odbc_execute": [
        "bool odbc_execute(resource result_id [, array parameters_array])",
        "Execute a prepared statement"
    ],
    "odbc_fetch_array": [
        "array odbc_fetch_array(int result [, int rownumber])",
        "Fetch a result row as an associative array"
    ],
    "odbc_fetch_into": [
        "int odbc_fetch_into(resource result_id, array &result_array, [, int rownumber])",
        "Fetch one result row into an array"
    ],
    "odbc_fetch_object": [
        "object odbc_fetch_object(int result [, int rownumber])",
        "Fetch a result row as an object"
    ],
    "odbc_fetch_row": [
        "bool odbc_fetch_row(resource result_id [, int row_number])",
        "Fetch a row"
    ],
    "odbc_field_len": [
        "int odbc_field_len(resource result_id, int field_number)",
        "Get the length (precision) of a column"
    ],
    "odbc_field_name": [
        "string odbc_field_name(resource result_id, int field_number)",
        "Get a column name"
    ],
    "odbc_field_num": [
        "int odbc_field_num(resource result_id, string field_name)",
        "Return column number"
    ],
    "odbc_field_scale": [
        "int odbc_field_scale(resource result_id, int field_number)",
        "Get the scale of a column"
    ],
    "odbc_field_type": [
        "string odbc_field_type(resource result_id, int field_number)",
        "Get the datatype of a column"
    ],
    "odbc_foreignkeys": [
        "resource odbc_foreignkeys(resource connection_id, string pk_qualifier, string pk_owner, string pk_table, string fk_qualifier, string fk_owner, string fk_table)",
        "Returns a result identifier to either a list of foreign keys in the specified table or a list of foreign keys in other tables that refer to the primary key in the specified table"
    ],
    "odbc_free_result": [
        "bool odbc_free_result(resource result_id)",
        "Free resources associated with a result"
    ],
    "odbc_gettypeinfo": [
        "resource odbc_gettypeinfo(resource connection_id [, int data_type])",
        "Returns a result identifier containing information about data types supported by the data source"
    ],
    "odbc_longreadlen": [
        "bool odbc_longreadlen(int result_id, int length)",
        "Handle LONG columns"
    ],
    "odbc_next_result": [
        "bool odbc_next_result(resource result_id)",
        "Checks if multiple results are avaiable"
    ],
    "odbc_num_fields": [
        "int odbc_num_fields(resource result_id)",
        "Get number of columns in a result"
    ],
    "odbc_num_rows": [
        "int odbc_num_rows(resource result_id)",
        "Get number of rows in a result"
    ],
    "odbc_pconnect": [
        "resource odbc_pconnect(string DSN, string user, string password [, int cursor_option])",
        "Establish a persistent connection to a datasource"
    ],
    "odbc_prepare": [
        "resource odbc_prepare(resource connection_id, string query)",
        "Prepares a statement for execution"
    ],
    "odbc_primarykeys": [
        "resource odbc_primarykeys(resource connection_id, string qualifier, string owner, string table)",
        "Returns a result identifier listing the column names that comprise the primary key for a table"
    ],
    "odbc_procedurecolumns": [
        "resource odbc_procedurecolumns(resource connection_id [, string qualifier, string owner, string proc, string column])",
        "Returns a result identifier containing the list of input and output parameters, as well as the columns that make up the result set for the specified procedures"
    ],
    "odbc_procedures": [
        "resource odbc_procedures(resource connection_id [, string qualifier, string owner, string name])",
        "Returns a result identifier containg the list of procedure names in a datasource"
    ],
    "odbc_result": [
        "mixed odbc_result(resource result_id, mixed field)",
        "Get result data"
    ],
    "odbc_result_all": [
        "int odbc_result_all(resource result_id [, string format])",
        "Print result as HTML table"
    ],
    "odbc_rollback": [
        "bool odbc_rollback(resource connection_id)",
        "Rollback a transaction"
    ],
    "odbc_setoption": [
        "bool odbc_setoption(resource conn_id|result_id, int which, int option, int value)",
        "Sets connection or statement options"
    ],
    "odbc_specialcolumns": [
        "resource odbc_specialcolumns(resource connection_id, int type, string qualifier, string owner, string table, int scope, int nullable)",
        "Returns a result identifier containing either the optimal set of columns that uniquely identifies a row in the table or columns that are automatically updated when any value in the row is updated by a transaction"
    ],
    "odbc_statistics": [
        "resource odbc_statistics(resource connection_id, string qualifier, string owner, string name, int unique, int accuracy)",
        "Returns a result identifier that contains statistics about a single table and the indexes associated with the table"
    ],
    "odbc_tableprivileges": [
        "resource odbc_tableprivileges(resource connection_id, string qualifier, string owner, string name)",
        "Returns a result identifier containing a list of tables and the privileges associated with each table"
    ],
    "odbc_tables": [
        "resource odbc_tables(resource connection_id [, string qualifier [, string owner [, string name [, string table_types]]]])",
        "Call the SQLTables function"
    ],
    "opendir": [
        "mixed opendir(string path[, resource context])",
        "Open a directory and return a dir_handle"
    ],
    "openlog": [
        "bool openlog(string ident, int option, int facility)",
        "Open connection to system logger"
    ],
    "openssl_csr_export": [
        "bool openssl_csr_export(resource csr, string &out [, bool notext=true])",
        "Exports a CSR to file or a var"
    ],
    "openssl_csr_export_to_file": [
        "bool openssl_csr_export_to_file(resource csr, string outfilename [, bool notext=true])",
        "Exports a CSR to file"
    ],
    "openssl_csr_get_public_key": [
        "mixed openssl_csr_get_public_key(mixed csr)",
        "Returns the subject of a CERT or FALSE on error"
    ],
    "openssl_csr_get_subject": [
        "mixed openssl_csr_get_subject(mixed csr)",
        "Returns the subject of a CERT or FALSE on error"
    ],
    "openssl_csr_new": [
        "bool openssl_csr_new(array dn, resource &privkey [, array configargs [, array extraattribs]])",
        "Generates a privkey and CSR"
    ],
    "openssl_csr_sign": [
        "resource openssl_csr_sign(mixed csr, mixed x509, mixed priv_key, long days [, array config_args [, long serial]])",
        "Signs a cert with another CERT"
    ],
    "openssl_decrypt": [
        "string openssl_decrypt(string data, string method, string password [, bool raw_input=false])",
        "Takes raw or base64 encoded string and dectupt it using given method and key"
    ],
    "openssl_dh_compute_key": [
        "string openssl_dh_compute_key(string pub_key, resource dh_key)",
        "Computes shared sicret for public value of remote DH key and local DH key"
    ],
    "openssl_digest": [
        "string openssl_digest(string data, string method [, bool raw_output=false])",
        "Computes digest hash value for given data using given method, returns raw or binhex encoded string"
    ],
    "openssl_encrypt": [
        "string openssl_encrypt(string data, string method, string password [, bool raw_output=false])",
        "Encrypts given data with given method and key, returns raw or base64 encoded string"
    ],
    "openssl_error_string": [
        "mixed openssl_error_string()",
        "Returns a description of the last error, and alters the index of the error messages. Returns false when the are no more messages"
    ],
    "openssl_get_cipher_methods": [
        "array openssl_get_cipher_methods([bool aliases = false])",
        "Return array of available cipher methods"
    ],
    "openssl_get_md_methods": [
        "array openssl_get_md_methods([bool aliases = false])",
        "Return array of available digest methods"
    ],
    "openssl_open": [
        "bool openssl_open(string data, &string opendata, string ekey, mixed privkey)",
        "Opens data"
    ],
    "openssl_pkcs12_export": [
        "bool openssl_pkcs12_export(mixed x509, string &out, mixed priv_key, string pass[, array args])",
        "Creates and exports a PKCS12 to a var"
    ],
    "openssl_pkcs12_export_to_file": [
        "bool openssl_pkcs12_export_to_file(mixed x509, string filename, mixed priv_key, string pass[, array args])",
        "Creates and exports a PKCS to file"
    ],
    "openssl_pkcs12_read": [
        "bool openssl_pkcs12_read(string PKCS12, array &certs, string pass)",
        "Parses a PKCS12 to an array"
    ],
    "openssl_pkcs7_decrypt": [
        "bool openssl_pkcs7_decrypt(string infilename, string outfilename, mixed recipcert [, mixed recipkey])",
        "Decrypts the S/MIME message in the file name infilename and output the results to the file name outfilename.  recipcert is a CERT for one of the recipients. recipkey specifies the private key matching recipcert, if recipcert does not include the key"
    ],
    "openssl_pkcs7_encrypt": [
        "bool openssl_pkcs7_encrypt(string infile, string outfile, mixed recipcerts, array headers [, long flags [, long cipher]])",
        "Encrypts the message in the file named infile with the certificates in recipcerts and output the result to the file named outfile"
    ],
    "openssl_pkcs7_sign": [
        "bool openssl_pkcs7_sign(string infile, string outfile, mixed signcert, mixed signkey, array headers [, long flags [, string extracertsfilename]])",
        "Signs the MIME message in the file named infile with signcert/signkey and output the result to file name outfile. headers lists plain text headers to exclude from the signed portion of the message, and should include to, from and subject as a minimum"
    ],
    "openssl_pkcs7_verify": [
        "bool openssl_pkcs7_verify(string filename, long flags [, string signerscerts [, array cainfo [, string extracerts [, string content]]]])",
        "Verifys that the data block is intact, the signer is who they say they are, and returns the CERTs of the signers"
    ],
    "openssl_pkey_export": [
        "bool openssl_pkey_export(mixed key, &mixed out [, string passphrase [, array config_args]])",
        "Gets an exportable representation of a key into a string or file"
    ],
    "openssl_pkey_export_to_file": [
        "bool openssl_pkey_export_to_file(mixed key, string outfilename [, string passphrase, array config_args)",
        "Gets an exportable representation of a key into a file"
    ],
    "openssl_pkey_free": [
        "void openssl_pkey_free(int key)",
        "Frees a key"
    ],
    "openssl_pkey_get_details": [
        "resource openssl_pkey_get_details(resource key)",
        "returns an array with the key details (bits, pkey, type)"
    ],
    "openssl_pkey_get_private": [
        "int openssl_pkey_get_private(string key [, string passphrase])",
        "Gets private keys"
    ],
    "openssl_pkey_get_public": [
        "int openssl_pkey_get_public(mixed cert)",
        "Gets public key from X.509 certificate"
    ],
    "openssl_pkey_new": [
        "resource openssl_pkey_new([array configargs])",
        "Generates a new private key"
    ],
    "openssl_private_decrypt": [
        "bool openssl_private_decrypt(string data, string &decrypted, mixed key [, int padding])",
        "Decrypts data with private key"
    ],
    "openssl_private_encrypt": [
        "bool openssl_private_encrypt(string data, string &crypted, mixed key [, int padding])",
        "Encrypts data with private key"
    ],
    "openssl_public_decrypt": [
        "bool openssl_public_decrypt(string data, string &crypted, resource key [, int padding])",
        "Decrypts data with public key"
    ],
    "openssl_public_encrypt": [
        "bool openssl_public_encrypt(string data, string &crypted, mixed key [, int padding])",
        "Encrypts data with public key"
    ],
    "openssl_random_pseudo_bytes": [
        "string openssl_random_pseudo_bytes(integer length [, &bool returned_strong_result])",
        "Returns a string of the length specified filled with random pseudo bytes"
    ],
    "openssl_seal": [
        "int openssl_seal(string data, &string sealdata, &array ekeys, array pubkeys)",
        "Seals data"
    ],
    "openssl_sign": [
        "bool openssl_sign(string data, &string signature, mixed key[, mixed method])",
        "Signs data"
    ],
    "openssl_verify": [
        "int openssl_verify(string data, string signature, mixed key[, mixed method])",
        "Verifys data"
    ],
    "openssl_x509_check_private_key": [
        "bool openssl_x509_check_private_key(mixed cert, mixed key)",
        "Checks if a private key corresponds to a CERT"
    ],
    "openssl_x509_checkpurpose": [
        "int openssl_x509_checkpurpose(mixed x509cert, int purpose, array cainfo [, string untrustedfile])",
        "Checks the CERT to see if it can be used for the purpose in purpose. cainfo holds information about trusted CAs"
    ],
    "openssl_x509_export": [
        "bool openssl_x509_export(mixed x509, string &out [, bool notext = true])",
        "Exports a CERT to file or a var"
    ],
    "openssl_x509_export_to_file": [
        "bool openssl_x509_export_to_file(mixed x509, string outfilename [, bool notext = true])",
        "Exports a CERT to file or a var"
    ],
    "openssl_x509_free": [
        "void openssl_x509_free(resource x509)",
        "Frees X.509 certificates"
    ],
    "openssl_x509_parse": [
        "array openssl_x509_parse(mixed x509 [, bool shortnames=true])",
        "Returns an array of the fields/values of the CERT"
    ],
    "openssl_x509_read": [
        "resource openssl_x509_read(mixed cert)",
        "Reads X.509 certificates"
    ],
    "ord": [
        "int ord(string character)",
        "Returns ASCII value of character"
    ],
    "output_add_rewrite_var": [
        "bool output_add_rewrite_var(string name, string value)",
        "Add URL rewriter values"
    ],
    "output_reset_rewrite_vars": [
        "bool output_reset_rewrite_vars()",
        "Reset(clear) URL rewriter values"
    ],
    "pack": [
        "string pack(string format, mixed arg1 [, mixed arg2 [, mixed ...]])",
        "Takes one or more arguments and packs them into a binary string according to the format argument"
    ],
    "parse_ini_file": [
        "array parse_ini_file(string filename [, bool process_sections [, int scanner_mode]])",
        "Parse configuration file"
    ],
    "parse_ini_string": [
        "array parse_ini_string(string ini_string [, bool process_sections [, int scanner_mode]])",
        "Parse configuration string"
    ],
    "parse_locale": [
        "static array parse_locale($locale)",
        "* parses a locale-id into an array the different parts of it"
    ],
    "parse_str": [
        "void parse_str(string encoded_string [, array result])",
        "Parses GET/POST/COOKIE data and sets global variables"
    ],
    "parse_url": [
        "mixed parse_url(string url, [int url_component])",
        "Parse a URL and return its components"
    ],
    "passthru": [
        "void passthru(string command [, int &return_value])",
        "Execute an external program and display raw output"
    ],
    "pathinfo": [
        "array pathinfo(string path[, int options])",
        "Returns information about a certain string"
    ],
    "pclose": [
        "int pclose(resource fp)",
        "Close a file pointer opened by popen()"
    ],
    "pcnlt_sigwaitinfo": [
        "int pcnlt_sigwaitinfo(array set[, array &siginfo])",
        "Synchronously wait for queued signals"
    ],
    "pcntl_alarm": [
        "int pcntl_alarm(int seconds)",
        "Set an alarm clock for delivery of a signal"
    ],
    "pcntl_exec": [
        "bool pcntl_exec(string path [, array args [, array envs]])",
        "Executes specified program in current process space as defined by exec(2)"
    ],
    "pcntl_fork": [
        "int pcntl_fork()",
        "Forks the currently running process following the same behavior as the UNIX fork() system call"
    ],
    "pcntl_getpriority": [
        "int pcntl_getpriority([int pid [, int process_identifier]])",
        "Get the priority of any process"
    ],
    "pcntl_setpriority": [
        "bool pcntl_setpriority(int priority [, int pid [, int process_identifier]])",
        "Change the priority of any process"
    ],
    "pcntl_signal": [
        "bool pcntl_signal(int signo, callback handle [, bool restart_syscalls])",
        "Assigns a system signal handler to a PHP function"
    ],
    "pcntl_signal_dispatch": [
        "bool pcntl_signal_dispatch()",
        "Dispatch signals to signal handlers"
    ],
    "pcntl_sigprocmask": [
        "bool pcntl_sigprocmask(int how, array set[, array &oldset])",
        "Examine and change blocked signals"
    ],
    "pcntl_sigtimedwait": [
        "int pcntl_sigtimedwait(array set[, array &siginfo[, int seconds[, int nanoseconds]]])",
        "Wait for queued signals"
    ],
    "pcntl_wait": [
        "int pcntl_wait(int &status)",
        "Waits on or returns the status of a forked child as defined by the waitpid() system call"
    ],
    "pcntl_waitpid": [
        "int pcntl_waitpid(int pid, int &status, int options)",
        "Waits on or returns the status of a forked child as defined by the waitpid() system call"
    ],
    "pcntl_wexitstatus": [
        "int pcntl_wexitstatus(int status)",
        "Returns the status code of a child's exit"
    ],
    "pcntl_wifexited": [
        "bool pcntl_wifexited(int status)",
        "Returns true if the child status code represents a successful exit"
    ],
    "pcntl_wifsignaled": [
        "bool pcntl_wifsignaled(int status)",
        "Returns true if the child status code represents a process that was terminated due to a signal"
    ],
    "pcntl_wifstopped": [
        "bool pcntl_wifstopped(int status)",
        "Returns true if the child status code represents a stopped process (WUNTRACED must have been used with waitpid)"
    ],
    "pcntl_wstopsig": [
        "int pcntl_wstopsig(int status)",
        "Returns the number of the signal that caused the process to stop who's status code is passed"
    ],
    "pcntl_wtermsig": [
        "int pcntl_wtermsig(int status)",
        "Returns the number of the signal that terminated the process who's status code is passed"
    ],
    "pdo_drivers": [
        "array pdo_drivers()",
        "Return array of available PDO drivers"
    ],
    "pfsockopen": [
        "resource pfsockopen(string hostname, int port [, int errno [, string errstr [, float timeout]]])",
        "Open persistent Internet or Unix domain socket connection"
    ],
    "pg_affected_rows": [
        "int pg_affected_rows(resource result)",
        "Returns the number of affected tuples"
    ],
    "pg_cancel_query": [
        "bool pg_cancel_query(resource connection)",
        "Cancel request"
    ],
    "pg_client_encoding": [
        "string pg_client_encoding([resource connection])",
        "Get the current client encoding"
    ],
    "pg_close": [
        "bool pg_close([resource connection])",
        "Close a PostgreSQL connection"
    ],
    "pg_connect": [
        "resource pg_connect(string connection_string[, int connect_type] | [string host, string port [, string options [, string tty,]]] string database)",
        "Open a PostgreSQL connection"
    ],
    "pg_connection_busy": [
        "bool pg_connection_busy(resource connection)",
        "Get connection is busy or not"
    ],
    "pg_connection_reset": [
        "bool pg_connection_reset(resource connection)",
        "Reset connection (reconnect)"
    ],
    "pg_connection_status": [
        "int pg_connection_status(resource connnection)",
        "Get connection status"
    ],
    "pg_convert": [
        "array pg_convert(resource db, string table, array values[, int options])",
        "Check and convert values for PostgreSQL SQL statement"
    ],
    "pg_copy_from": [
        "bool pg_copy_from(resource connection, string table_name , array rows [, string delimiter [, string null_as]])",
        "Copy table from array"
    ],
    "pg_copy_to": [
        "array pg_copy_to(resource connection, string table_name [, string delimiter [, string null_as]])",
        "Copy table to array"
    ],
    "pg_dbname": [
        "string pg_dbname([resource connection])",
        "Get the database name"
    ],
    "pg_delete": [
        "mixed pg_delete(resource db, string table, array ids[, int options])",
        "Delete records has ids (id => value)"
    ],
    "pg_end_copy": [
        "bool pg_end_copy([resource connection])",
        "Sync with backend. Completes the Copy command"
    ],
    "pg_escape_bytea": [
        "string pg_escape_bytea([resource connection,] string data)",
        "Escape binary for bytea type"
    ],
    "pg_escape_string": [
        "string pg_escape_string([resource connection,] string data)",
        "Escape string for text/char type"
    ],
    "pg_execute": [
        "resource pg_execute([resource connection,] string stmtname, array params)",
        "Execute a prepared query"
    ],
    "pg_fetch_all": [
        "array pg_fetch_all(resource result)",
        "Fetch all rows into array"
    ],
    "pg_fetch_all_columns": [
        "array pg_fetch_all_columns(resource result [, int column_number])",
        "Fetch all rows into array"
    ],
    "pg_fetch_array": [
        "array pg_fetch_array(resource result [, int row [, int result_type]])",
        "Fetch a row as an array"
    ],
    "pg_fetch_assoc": [
        "array pg_fetch_assoc(resource result [, int row])",
        "Fetch a row as an assoc array"
    ],
    "pg_fetch_object": [
        "object pg_fetch_object(resource result [, int row [, string class_name [, NULL|array ctor_params]]])",
        "Fetch a row as an object"
    ],
    "pg_fetch_result": [
        "mixed pg_fetch_result(resource result, [int row_number,] mixed field_name)",
        "Returns values from a result identifier"
    ],
    "pg_fetch_row": [
        "array pg_fetch_row(resource result [, int row [, int result_type]])",
        "Get a row as an enumerated array"
    ],
    "pg_field_is_null": [
        "int pg_field_is_null(resource result, [int row,] mixed field_name_or_number)",
        "Test if a field is NULL"
    ],
    "pg_field_name": [
        "string pg_field_name(resource result, int field_number)",
        "Returns the name of the field"
    ],
    "pg_field_num": [
        "int pg_field_num(resource result, string field_name)",
        "Returns the field number of the named field"
    ],
    "pg_field_prtlen": [
        "int pg_field_prtlen(resource result, [int row,] mixed field_name_or_number)",
        "Returns the printed length"
    ],
    "pg_field_size": [
        "int pg_field_size(resource result, int field_number)",
        "Returns the internal size of the field"
    ],
    "pg_field_table": [
        "mixed pg_field_table(resource result, int field_number[, bool oid_only])",
        "Returns the name of the table field belongs to, or table's oid if oid_only is true"
    ],
    "pg_field_type": [
        "string pg_field_type(resource result, int field_number)",
        "Returns the type name for the given field"
    ],
    "pg_field_type_oid": [
        "string pg_field_type_oid(resource result, int field_number)",
        "Returns the type oid for the given field"
    ],
    "pg_free_result": [
        "bool pg_free_result(resource result)",
        "Free result memory"
    ],
    "pg_get_notify": [
        "array pg_get_notify([resource connection[, result_type]])",
        "Get asynchronous notification"
    ],
    "pg_get_pid": [
        "int pg_get_pid([resource connection)",
        "Get backend(server) pid"
    ],
    "pg_get_result": [
        "resource pg_get_result(resource connection)",
        "Get asynchronous query result"
    ],
    "pg_host": [
        "string pg_host([resource connection])",
        "Returns the host name associated with the connection"
    ],
    "pg_insert": [
        "mixed pg_insert(resource db, string table, array values[, int options])",
        "Insert values (filed => value) to table"
    ],
    "pg_last_error": [
        "string pg_last_error([resource connection])",
        "Get the error message string"
    ],
    "pg_last_notice": [
        "string pg_last_notice(resource connection)",
        "Returns the last notice set by the backend"
    ],
    "pg_last_oid": [
        "string pg_last_oid(resource result)",
        "Returns the last object identifier"
    ],
    "pg_lo_close": [
        "bool pg_lo_close(resource large_object)",
        "Close a large object"
    ],
    "pg_lo_create": [
        "mixed pg_lo_create([resource connection],[mixed large_object_oid])",
        "Create a large object"
    ],
    "pg_lo_export": [
        "bool pg_lo_export([resource connection, ] int objoid, string filename)",
        "Export large object direct to filesystem"
    ],
    "pg_lo_import": [
        "int pg_lo_import([resource connection, ] string filename [, mixed oid])",
        "Import large object direct from filesystem"
    ],
    "pg_lo_open": [
        "resource pg_lo_open([resource connection,] int large_object_oid, string mode)",
        "Open a large object and return fd"
    ],
    "pg_lo_read": [
        "string pg_lo_read(resource large_object [, int len])",
        "Read a large object"
    ],
    "pg_lo_read_all": [
        "int pg_lo_read_all(resource large_object)",
        "Read a large object and send straight to browser"
    ],
    "pg_lo_seek": [
        "bool pg_lo_seek(resource large_object, int offset [, int whence])",
        "Seeks position of large object"
    ],
    "pg_lo_tell": [
        "int pg_lo_tell(resource large_object)",
        "Returns current position of large object"
    ],
    "pg_lo_unlink": [
        "bool pg_lo_unlink([resource connection,] string large_object_oid)",
        "Delete a large object"
    ],
    "pg_lo_write": [
        "int pg_lo_write(resource large_object, string buf [, int len])",
        "Write a large object"
    ],
    "pg_meta_data": [
        "array pg_meta_data(resource db, string table)",
        "Get meta_data"
    ],
    "pg_num_fields": [
        "int pg_num_fields(resource result)",
        "Return the number of fields in the result"
    ],
    "pg_num_rows": [
        "int pg_num_rows(resource result)",
        "Return the number of rows in the result"
    ],
    "pg_options": [
        "string pg_options([resource connection])",
        "Get the options associated with the connection"
    ],
    "pg_parameter_status": [
        "string|false pg_parameter_status([resource connection,] string param_name)",
        "Returns the value of a server parameter"
    ],
    "pg_pconnect": [
        "resource pg_pconnect(string connection_string | [string host, string port [, string options [, string tty,]]] string database)",
        "Open a persistent PostgreSQL connection"
    ],
    "pg_ping": [
        "bool pg_ping([resource connection])",
        "Ping database. If connection is bad, try to reconnect."
    ],
    "pg_port": [
        "int pg_port([resource connection])",
        "Return the port number associated with the connection"
    ],
    "pg_prepare": [
        "resource pg_prepare([resource connection,] string stmtname, string query)",
        "Prepare a query for future execution"
    ],
    "pg_put_line": [
        "bool pg_put_line([resource connection,] string query)",
        "Send null-terminated string to backend server"
    ],
    "pg_query": [
        "resource pg_query([resource connection,] string query)",
        "Execute a query"
    ],
    "pg_query_params": [
        "resource pg_query_params([resource connection,] string query, array params)",
        "Execute a query"
    ],
    "pg_result_error": [
        "string pg_result_error(resource result)",
        "Get error message associated with result"
    ],
    "pg_result_error_field": [
        "string pg_result_error_field(resource result, int fieldcode)",
        "Get error message field associated with result"
    ],
    "pg_result_seek": [
        "bool pg_result_seek(resource result, int offset)",
        "Set internal row offset"
    ],
    "pg_result_status": [
        "mixed pg_result_status(resource result[, long result_type])",
        "Get status of query result"
    ],
    "pg_select": [
        "mixed pg_select(resource db, string table, array ids[, int options])",
        "Select records that has ids (id => value)"
    ],
    "pg_send_execute": [
        "bool pg_send_execute(resource connection, string stmtname, array params)",
        "Executes prevriously prepared stmtname asynchronously"
    ],
    "pg_send_prepare": [
        "bool pg_send_prepare(resource connection, string stmtname, string query)",
        "Asynchronously prepare a query for future execution"
    ],
    "pg_send_query": [
        "bool pg_send_query(resource connection, string query)",
        "Send asynchronous query"
    ],
    "pg_send_query_params": [
        "bool pg_send_query_params(resource connection, string query, array params)",
        "Send asynchronous parameterized query"
    ],
    "pg_set_client_encoding": [
        "int pg_set_client_encoding([resource connection,] string encoding)",
        "Set client encoding"
    ],
    "pg_set_error_verbosity": [
        "int pg_set_error_verbosity([resource connection,] int verbosity)",
        "Set error verbosity"
    ],
    "pg_trace": [
        "bool pg_trace(string filename [, string mode [, resource connection]])",
        "Enable tracing a PostgreSQL connection"
    ],
    "pg_transaction_status": [
        "int pg_transaction_status(resource connnection)",
        "Get transaction status"
    ],
    "pg_tty": [
        "string pg_tty([resource connection])",
        "Return the tty name associated with the connection"
    ],
    "pg_unescape_bytea": [
        "string pg_unescape_bytea(string data)",
        "Unescape binary for bytea type"
    ],
    "pg_untrace": [
        "bool pg_untrace([resource connection])",
        "Disable tracing of a PostgreSQL connection"
    ],
    "pg_update": [
        "mixed pg_update(resource db, string table, array fields, array ids[, int options])",
        "Update table using values (field => value) and ids (id => value)"
    ],
    "pg_version": [
        "array pg_version([resource connection])",
        "Returns an array with client, protocol and server version (when available)"
    ],
    "php_egg_logo_guid": [
        "string php_egg_logo_guid()",
        "Return the special ID used to request the PHP logo in phpinfo screens"
    ],
    "php_ini_loaded_file": [
        "string php_ini_loaded_file()",
        "Return the actual loaded ini filename"
    ],
    "php_ini_scanned_files": [
        "string php_ini_scanned_files()",
        "Return comma-separated string of .ini files parsed from the additional ini dir"
    ],
    "php_logo_guid": [
        "string php_logo_guid()",
        "Return the special ID used to request the PHP logo in phpinfo screens"
    ],
    "php_real_logo_guid": [
        "string php_real_logo_guid()",
        "Return the special ID used to request the PHP logo in phpinfo screens"
    ],
    "php_sapi_name": [
        "string php_sapi_name()",
        "Return the current SAPI module name"
    ],
    "php_snmpv3": [
        "void php_snmpv3(INTERNAL_FUNCTION_PARAMETERS, int st)",
        "* * Generic SNMPv3 object fetcher * From here is passed on the the common internal object fetcher. * * st=SNMP_CMD_GET   snmp3_get() - query an agent and return a single value. * st=SNMP_CMD_GETNEXT   snmp3_getnext() - query an agent and return the next single value. * st=SNMP_CMD_WALK   snmp3_walk() - walk the mib and return a single dimensional array  *                       containing the values. * st=SNMP_CMD_REALWALK   snmp3_real_walk() - walk the mib and return an  *                            array of oid,value pairs. * st=SNMP_CMD_SET  snmp3_set() - query an agent and set a single value *"
    ],
    "php_strip_whitespace": [
        "string php_strip_whitespace(string file_name)",
        "Return source with stripped comments and whitespace"
    ],
    "php_uname": [
        "string php_uname()",
        "Return information about the system PHP was built on"
    ],
    "phpcredits": [
        "void phpcredits([int flag])",
        "Prints the list of people who've contributed to the PHP project"
    ],
    "phpinfo": [
        "void phpinfo([int what])",
        "Output a page of useful information about PHP and the current request"
    ],
    "phpversion": [
        "string phpversion([string extension])",
        "Return the current PHP version"
    ],
    "pi": [
        "float pi()",
        "Returns an approximation of pi"
    ],
    "png2wbmp": [
        "bool png2wbmp(string f_org, string f_dest, int d_height, int d_width, int threshold)",
        "Convert PNG image to WBMP image"
    ],
    "popen": [
        "resource popen(string command, string mode)",
        "Execute a command and open either a read or a write pipe to it"
    ],
    "posix_access": [
        "bool posix_access(string file [, int mode])",
        "Determine accessibility of a file (POSIX.1 5.6.3)"
    ],
    "posix_ctermid": [
        "string posix_ctermid()",
        "Generate terminal path name (POSIX.1, 4.7.1)"
    ],
    "posix_get_last_error": [
        "int posix_get_last_error()",
        "Retrieve the error number set by the last posix function which failed."
    ],
    "posix_getcwd": [
        "string posix_getcwd()",
        "Get working directory pathname (POSIX.1, 5.2.2)"
    ],
    "posix_getegid": [
        "int posix_getegid()",
        "Get the current effective group id (POSIX.1, 4.2.1)"
    ],
    "posix_geteuid": [
        "int posix_geteuid()",
        "Get the current effective user id (POSIX.1, 4.2.1)"
    ],
    "posix_getgid": [
        "int posix_getgid()",
        "Get the current group id (POSIX.1, 4.2.1)"
    ],
    "posix_getgrgid": [
        "array posix_getgrgid(long gid)",
        "Group database access (POSIX.1, 9.2.1)"
    ],
    "posix_getgrnam": [
        "array posix_getgrnam(string groupname)",
        "Group database access (POSIX.1, 9.2.1)"
    ],
    "posix_getgroups": [
        "array posix_getgroups()",
        "Get supplementary group id's (POSIX.1, 4.2.3)"
    ],
    "posix_getlogin": [
        "string posix_getlogin()",
        "Get user name (POSIX.1, 4.2.4)"
    ],
    "posix_getpgid": [
        "int posix_getpgid()",
        "Get the process group id of the specified process (This is not a POSIX function, but a SVR4ism, so we compile conditionally)"
    ],
    "posix_getpgrp": [
        "int posix_getpgrp()",
        "Get current process group id (POSIX.1, 4.3.1)"
    ],
    "posix_getpid": [
        "int posix_getpid()",
        "Get the current process id (POSIX.1, 4.1.1)"
    ],
    "posix_getppid": [
        "int posix_getppid()",
        "Get the parent process id (POSIX.1, 4.1.1)"
    ],
    "posix_getpwnam": [
        "array posix_getpwnam(string groupname)",
        "User database access (POSIX.1, 9.2.2)"
    ],
    "posix_getpwuid": [
        "array posix_getpwuid(long uid)",
        "User database access (POSIX.1, 9.2.2)"
    ],
    "posix_getrlimit": [
        "array posix_getrlimit()",
        "Get system resource consumption limits (This is not a POSIX function, but a BSDism and a SVR4ism. We compile conditionally)"
    ],
    "posix_getsid": [
        "int posix_getsid()",
        "Get process group id of session leader (This is not a POSIX function, but a SVR4ism, so be compile conditionally)"
    ],
    "posix_getuid": [
        "int posix_getuid()",
        "Get the current user id (POSIX.1, 4.2.1)"
    ],
    "posix_initgroups": [
        "bool posix_initgroups(string name, int base_group_id)",
        "Calculate the group access list for the user specified in name."
    ],
    "posix_isatty": [
        "bool posix_isatty(int fd)",
        "Determine if filedesc is a tty (POSIX.1, 4.7.1)"
    ],
    "posix_kill": [
        "bool posix_kill(int pid, int sig)",
        "Send a signal to a process (POSIX.1, 3.3.2)"
    ],
    "posix_mkfifo": [
        "bool posix_mkfifo(string pathname, int mode)",
        "Make a FIFO special file (POSIX.1, 5.4.2)"
    ],
    "posix_mknod": [
        "bool posix_mknod(string pathname, int mode [, int major [, int minor]])",
        "Make a special or ordinary file (POSIX.1)"
    ],
    "posix_setegid": [
        "bool posix_setegid(long uid)",
        "Set effective group id"
    ],
    "posix_seteuid": [
        "bool posix_seteuid(long uid)",
        "Set effective user id"
    ],
    "posix_setgid": [
        "bool posix_setgid(int uid)",
        "Set group id (POSIX.1, 4.2.2)"
    ],
    "posix_setpgid": [
        "bool posix_setpgid(int pid, int pgid)",
        "Set process group id for job control (POSIX.1, 4.3.3)"
    ],
    "posix_setsid": [
        "int posix_setsid()",
        "Create session and set process group id (POSIX.1, 4.3.2)"
    ],
    "posix_setuid": [
        "bool posix_setuid(long uid)",
        "Set user id (POSIX.1, 4.2.2)"
    ],
    "posix_strerror": [
        "string posix_strerror(int errno)",
        "Retrieve the system error message associated with the given errno."
    ],
    "posix_times": [
        "array posix_times()",
        "Get process times (POSIX.1, 4.5.2)"
    ],
    "posix_ttyname": [
        "string posix_ttyname(int fd)",
        "Determine terminal device name (POSIX.1, 4.7.2)"
    ],
    "posix_uname": [
        "array posix_uname()",
        "Get system name (POSIX.1, 4.4.1)"
    ],
    "pow": [
        "number pow(number base, number exponent)",
        "Returns base raised to the power of exponent. Returns integer result when possible"
    ],
    "preg_filter": [
        "mixed preg_filter(mixed regex, mixed replace, mixed subject [, int limit [, int &count]])",
        "Perform Perl-style regular expression replacement and only return matches."
    ],
    "preg_grep": [
        "array preg_grep(string regex, array input [, int flags])",
        "Searches array and returns entries which match regex"
    ],
    "preg_last_error": [
        "int preg_last_error()",
        "Returns the error code of the last regexp execution."
    ],
    "preg_match": [
        "int preg_match(string pattern, string subject [, array &subpatterns [, int flags [, int offset]]])",
        "Perform a Perl-style regular expression match"
    ],
    "preg_match_all": [
        "int preg_match_all(string pattern, string subject, array &subpatterns [, int flags [, int offset]])",
        "Perform a Perl-style global regular expression match"
    ],
    "preg_quote": [
        "string preg_quote(string str [, string delim_char])",
        "Quote regular expression characters plus an optional character"
    ],
    "preg_replace": [
        "mixed preg_replace(mixed regex, mixed replace, mixed subject [, int limit [, int &count]])",
        "Perform Perl-style regular expression replacement."
    ],
    "preg_replace_callback": [
        "mixed preg_replace_callback(mixed regex, mixed callback, mixed subject [, int limit [, int &count]])",
        "Perform Perl-style regular expression replacement using replacement callback."
    ],
    "preg_split": [
        "array preg_split(string pattern, string subject [, int limit [, int flags]])",
        "Split string into an array using a perl-style regular expression as a delimiter"
    ],
    "prev": [
        "mixed prev(array array_arg)",
        "Move array argument's internal pointer to the previous element and return it"
    ],
    "print": [
        "int print(string arg)",
        "Output a string"
    ],
    "print_r": [
        "mixed print_r(mixed var [, bool return])",
        "Prints out or returns information about the specified variable"
    ],
    "printf": [
        "int printf(string format [, mixed arg1 [, mixed ...]])",
        "Output a formatted string"
    ],
    "proc_close": [
        "int proc_close(resource process)",
        "close a process opened by proc_open"
    ],
    "proc_get_status": [
        "array proc_get_status(resource process)",
        "get information about a process opened by proc_open"
    ],
    "proc_nice": [
        "bool proc_nice(int priority)",
        "Change the priority of the current process"
    ],
    "proc_open": [
        "resource proc_open(string command, array descriptorspec, array &pipes [, string cwd [, array env [, array other_options]]])",
        "Run a process with more control over it's file descriptors"
    ],
    "proc_terminate": [
        "bool proc_terminate(resource process [, long signal])",
        "kill a process opened by proc_open"
    ],
    "property_exists": [
        "bool property_exists(mixed object_or_class, string property_name)",
        "Checks if the object or class has a property"
    ],
    "pspell_add_to_personal": [
        "bool pspell_add_to_personal(int pspell, string word)",
        "Adds a word to a personal list"
    ],
    "pspell_add_to_session": [
        "bool pspell_add_to_session(int pspell, string word)",
        "Adds a word to the current session"
    ],
    "pspell_check": [
        "bool pspell_check(int pspell, string word)",
        "Returns true if word is valid"
    ],
    "pspell_clear_session": [
        "bool pspell_clear_session(int pspell)",
        "Clears the current session"
    ],
    "pspell_config_create": [
        "int pspell_config_create(string language [, string spelling [, string jargon [, string encoding]]])",
        "Create a new config to be used later to create a manager"
    ],
    "pspell_config_data_dir": [
        "bool pspell_config_data_dir(int conf, string directory)",
        "location of language data files"
    ],
    "pspell_config_dict_dir": [
        "bool pspell_config_dict_dir(int conf, string directory)",
        "location of the main word list"
    ],
    "pspell_config_ignore": [
        "bool pspell_config_ignore(int conf, int ignore)",
        "Ignore words <= n chars"
    ],
    "pspell_config_mode": [
        "bool pspell_config_mode(int conf, long mode)",
        "Select mode for config (PSPELL_FAST, PSPELL_NORMAL or PSPELL_BAD_SPELLERS)"
    ],
    "pspell_config_personal": [
        "bool pspell_config_personal(int conf, string personal)",
        "Use a personal dictionary for this config"
    ],
    "pspell_config_repl": [
        "bool pspell_config_repl(int conf, string repl)",
        "Use a personal dictionary with replacement pairs for this config"
    ],
    "pspell_config_runtogether": [
        "bool pspell_config_runtogether(int conf, bool runtogether)",
        "Consider run-together words as valid components"
    ],
    "pspell_config_save_repl": [
        "bool pspell_config_save_repl(int conf, bool save)",
        "Save replacement pairs when personal list is saved for this config"
    ],
    "pspell_new": [
        "int pspell_new(string language [, string spelling [, string jargon [, string encoding [, int mode]]]])",
        "Load a dictionary"
    ],
    "pspell_new_config": [
        "int pspell_new_config(int config)",
        "Load a dictionary based on the given config"
    ],
    "pspell_new_personal": [
        "int pspell_new_personal(string personal, string language [, string spelling [, string jargon [, string encoding [, int mode]]]])",
        "Load a dictionary with a personal wordlist"
    ],
    "pspell_save_wordlist": [
        "bool pspell_save_wordlist(int pspell)",
        "Saves the current (personal) wordlist"
    ],
    "pspell_store_replacement": [
        "bool pspell_store_replacement(int pspell, string misspell, string correct)",
        "Notify the dictionary of a user-selected replacement"
    ],
    "pspell_suggest": [
        "array pspell_suggest(int pspell, string word)",
        "Returns array of suggestions"
    ],
    "putenv": [
        "bool putenv(string setting)",
        "Set the value of an environment variable"
    ],
    "quoted_printable_decode": [
        "string quoted_printable_decode(string str)",
        "Convert a quoted-printable string to an 8 bit string"
    ],
    "quoted_printable_encode": [
        "string quoted_printable_encode(string str)",
        ""
    ],
    "quotemeta": [
        "string quotemeta(string str)",
        "Quotes meta characters"
    ],
    "rad2deg": [
        "float rad2deg(float number)",
        "Converts the radian number to the equivalent number in degrees"
    ],
    "rand": [
        "int rand([int min, int max])",
        "Returns a random number"
    ],
    "range": [
        "array range(mixed low, mixed high[, int step])",
        "Create an array containing the range of integers or characters from low to high (inclusive)"
    ],
    "rawurldecode": [
        "string rawurldecode(string str)",
        "Decodes URL-encodes string"
    ],
    "rawurlencode": [
        "string rawurlencode(string str)",
        "URL-encodes string"
    ],
    "readdir": [
        "string readdir([resource dir_handle])",
        "Read directory entry from dir_handle"
    ],
    "readfile": [
        "int readfile(string filename [, bool use_include_path[, resource context]])",
        "Output a file or a URL"
    ],
    "readgzfile": [
        "int readgzfile(string filename [, int use_include_path])",
        "Output a .gz-file"
    ],
    "readline": [
        "string readline([string prompt])",
        "Reads a line"
    ],
    "readline_add_history": [
        "bool readline_add_history(string prompt)",
        "Adds a line to the history"
    ],
    "readline_callback_handler_install": [
        "void readline_callback_handler_install(string prompt, mixed callback)",
        "Initializes the readline callback interface and terminal, prints the prompt and returns immediately"
    ],
    "readline_callback_handler_remove": [
        "bool readline_callback_handler_remove()",
        "Removes a previously installed callback handler and restores terminal settings"
    ],
    "readline_callback_read_char": [
        "void readline_callback_read_char()",
        "Informs the readline callback interface that a character is ready for input"
    ],
    "readline_clear_history": [
        "bool readline_clear_history()",
        "Clears the history"
    ],
    "readline_completion_function": [
        "bool readline_completion_function(string funcname)",
        "Readline completion function?"
    ],
    "readline_info": [
        "mixed readline_info([string varname [, string newvalue]])",
        "Gets/sets various internal readline variables."
    ],
    "readline_list_history": [
        "array readline_list_history()",
        "Lists the history"
    ],
    "readline_on_new_line": [
        "void readline_on_new_line()",
        "Inform readline that the cursor has moved to a new line"
    ],
    "readline_read_history": [
        "bool readline_read_history([string filename])",
        "Reads the history"
    ],
    "readline_redisplay": [
        "void readline_redisplay()",
        "Ask readline to redraw the display"
    ],
    "readline_write_history": [
        "bool readline_write_history([string filename])",
        "Writes the history"
    ],
    "readlink": [
        "string readlink(string filename)",
        "Return the target of a symbolic link"
    ],
    "realpath": [
        "string realpath(string path)",
        "Return the resolved path"
    ],
    "realpath_cache_get": [
        "bool realpath_cache_get()",
        "Get current size of realpath cache"
    ],
    "realpath_cache_size": [
        "bool realpath_cache_size()",
        "Get current size of realpath cache"
    ],
    "recode_file": [
        "bool recode_file(string request, resource input, resource output)",
        "Recode file input into file output according to request"
    ],
    "recode_string": [
        "string recode_string(string request, string str)",
        "Recode string str according to request string"
    ],
    "register_shutdown_function": [
        "void register_shutdown_function(string function_name)",
        "Register a user-level function to be called on request termination"
    ],
    "register_tick_function": [
        "bool register_tick_function(string function_name [, mixed arg [, mixed ... ]])",
        "Registers a tick callback function"
    ],
    "rename": [
        "bool rename(string old_name, string new_name[, resource context])",
        "Rename a file"
    ],
    "require": [
        "bool require(string path)",
        "Includes and evaluates the specified file, erroring if the file cannot be included"
    ],
    "require_once": [
        "bool require_once(string path)",
        "Includes and evaluates the specified file, erroring if the file cannot be included"
    ],
    "reset": [
        "mixed reset(array array_arg)",
        "Set array argument's internal pointer to the first element and return it"
    ],
    "restore_error_handler": [
        "void restore_error_handler()",
        "Restores the previously defined error handler function"
    ],
    "restore_exception_handler": [
        "void restore_exception_handler()",
        "Restores the previously defined exception handler function"
    ],
    "restore_include_path": [
        "void restore_include_path()",
        "Restore the value of the include_path configuration option"
    ],
    "rewind": [
        "bool rewind(resource fp)",
        "Rewind the position of a file pointer"
    ],
    "rewinddir": [
        "void rewinddir([resource dir_handle])",
        "Rewind dir_handle back to the start"
    ],
    "rmdir": [
        "bool rmdir(string dirname[, resource context])",
        "Remove a directory"
    ],
    "round": [
        "float round(float number [, int precision [, int mode]])",
        "Returns the number rounded to specified precision"
    ],
    "rsort": [
        "bool rsort(array &array_arg [, int sort_flags])",
        "Sort an array in reverse order"
    ],
    "rtrim": [
        "string rtrim(string str [, string character_mask])",
        "Removes trailing whitespace"
    ],
    "scandir": [
        "array scandir(string dir [, int sorting_order [, resource context]])",
        "List files & directories inside the specified path"
    ],
    "sem_acquire": [
        "bool sem_acquire(resource id)",
        "Acquires the semaphore with the given id, blocking if necessary"
    ],
    "sem_get": [
        "resource sem_get(int key [, int max_acquire [, int perm [, int auto_release]])",
        "Return an id for the semaphore with the given key, and allow max_acquire (default 1) processes to acquire it simultaneously"
    ],
    "sem_release": [
        "bool sem_release(resource id)",
        "Releases the semaphore with the given id"
    ],
    "sem_remove": [
        "bool sem_remove(resource id)",
        "Removes semaphore from Unix systems"
    ],
    "serialize": [
        "string serialize(mixed variable)",
        "Returns a string representation of variable (which can later be unserialized)"
    ],
    "session_cache_expire": [
        "int session_cache_expire([int new_cache_expire])",
        "Return the current cache expire. If new_cache_expire is given, the current cache_expire is replaced with new_cache_expire"
    ],
    "session_cache_limiter": [
        "string session_cache_limiter([string new_cache_limiter])",
        "Return the current cache limiter. If new_cache_limited is given, the current cache_limiter is replaced with new_cache_limiter"
    ],
    "session_decode": [
        "bool session_decode(string data)",
        "Deserializes data and reinitializes the variables"
    ],
    "session_destroy": [
        "bool session_destroy()",
        "Destroy the current session and all data associated with it"
    ],
    "session_encode": [
        "string session_encode()",
        "Serializes the current setup and returns the serialized representation"
    ],
    "session_get_cookie_params": [
        "array session_get_cookie_params()",
        "Return the session cookie parameters"
    ],
    "session_id": [
        "string session_id([string newid])",
        "Return the current session id. If newid is given, the session id is replaced with newid"
    ],
    "session_is_registered": [
        "bool session_is_registered(string varname)",
        "Checks if a variable is registered in session"
    ],
    "session_module_name": [
        "string session_module_name([string newname])",
        "Return the current module name used for accessing session data. If newname is given, the module name is replaced with newname"
    ],
    "session_name": [
        "string session_name([string newname])",
        "Return the current session name. If newname is given, the session name is replaced with newname"
    ],
    "session_regenerate_id": [
        "bool session_regenerate_id([bool delete_old_session])",
        "Update the current session id with a newly generated one. If delete_old_session is set to true, remove the old session."
    ],
    "session_register": [
        "bool session_register(mixed var_names [, mixed ...])",
        "Adds varname(s) to the list of variables which are freezed at the session end"
    ],
    "session_save_path": [
        "string session_save_path([string newname])",
        "Return the current save path passed to module_name. If newname is given, the save path is replaced with newname"
    ],
    "session_set_cookie_params": [
        "void session_set_cookie_params(int lifetime [, string path [, string domain [, bool secure[, bool httponly]]]])",
        "Set session cookie parameters"
    ],
    "session_set_save_handler": [
        "void session_set_save_handler(string open, string close, string read, string write, string destroy, string gc)",
        "Sets user-level functions"
    ],
    "session_start": [
        "bool session_start()",
        "Begin session - reinitializes freezed variables, registers browsers etc"
    ],
    "session_unregister": [
        "bool session_unregister(string varname)",
        "Removes varname from the list of variables which are freezed at the session end"
    ],
    "session_unset": [
        "void session_unset()",
        "Unset all registered variables"
    ],
    "session_write_close": [
        "void session_write_close()",
        "Write session data and end session"
    ],
    "set_error_handler": [
        "string set_error_handler(string error_handler [, int error_types])",
        "Sets a user-defined error handler function.  Returns the previously defined error handler, or false on error"
    ],
    "set_exception_handler": [
        "string set_exception_handler(callable exception_handler)",
        "Sets a user-defined exception handler function.  Returns the previously defined exception handler, or false on error"
    ],
    "set_include_path": [
        "string set_include_path(string new_include_path)",
        "Sets the include_path configuration option"
    ],
    "set_magic_quotes_runtime": [
        "bool set_magic_quotes_runtime(int new_setting)",
        "Set the current active configuration setting of magic_quotes_runtime and return previous"
    ],
    "set_time_limit": [
        "bool set_time_limit(int seconds)",
        "Sets the maximum time a script can run"
    ],
    "setcookie": [
        "bool setcookie(string name [, string value [, int expires [, string path [, string domain [, bool secure[, bool httponly]]]]]])",
        "Send a cookie"
    ],
    "setlocale": [
        "string setlocale(mixed category, string locale [, string ...])",
        "Set locale information"
    ],
    "setrawcookie": [
        "bool setrawcookie(string name [, string value [, int expires [, string path [, string domain [, bool secure[, bool httponly]]]]]])",
        "Send a cookie with no url encoding of the value"
    ],
    "settype": [
        "bool settype(mixed var, string type)",
        "Set the type of the variable"
    ],
    "sha1": [
        "string sha1(string str [, bool raw_output])",
        "Calculate the sha1 hash of a string"
    ],
    "sha1_file": [
        "string sha1_file(string filename [, bool raw_output])",
        "Calculate the sha1 hash of given filename"
    ],
    "shell_exec": [
        "string shell_exec(string cmd)",
        "Execute command via shell and return complete output as string"
    ],
    "shm_attach": [
        "int shm_attach(int key [, int memsize [, int perm]])",
        "Creates or open a shared memory segment"
    ],
    "shm_detach": [
        "bool shm_detach(resource shm_identifier)",
        "Disconnects from shared memory segment"
    ],
    "shm_get_var": [
        "mixed shm_get_var(resource id, int variable_key)",
        "Returns a variable from shared memory"
    ],
    "shm_has_var": [
        "bool shm_has_var(resource id, int variable_key)",
        "Checks whether a specific entry exists"
    ],
    "shm_put_var": [
        "bool shm_put_var(resource shm_identifier, int variable_key, mixed variable)",
        "Inserts or updates a variable in shared memory"
    ],
    "shm_remove": [
        "bool shm_remove(resource shm_identifier)",
        "Removes shared memory from Unix systems"
    ],
    "shm_remove_var": [
        "bool shm_remove_var(resource id, int variable_key)",
        "Removes variable from shared memory"
    ],
    "shmop_close": [
        "void shmop_close(int shmid)",
        "closes a shared memory segment"
    ],
    "shmop_delete": [
        "bool shmop_delete(int shmid)",
        "mark segment for deletion"
    ],
    "shmop_open": [
        "int shmop_open(int key, string flags, int mode, int size)",
        "gets and attaches a shared memory segment"
    ],
    "shmop_read": [
        "string shmop_read(int shmid, int start, int count)",
        "reads from a shm segment"
    ],
    "shmop_size": [
        "int shmop_size(int shmid)",
        "returns the shm size"
    ],
    "shmop_write": [
        "int shmop_write(int shmid, string data, int offset)",
        "writes to a shared memory segment"
    ],
    "shuffle": [
        "bool shuffle(array array_arg)",
        "Randomly shuffle the contents of an array"
    ],
    "similar_text": [
        "int similar_text(string str1, string str2 [, float percent])",
        "Calculates the similarity between two strings"
    ],
    "simplexml_import_dom": [
        "simplemxml_element simplexml_import_dom(domNode node [, string class_name])",
        "Get a simplexml_element object from dom to allow for processing"
    ],
    "simplexml_load_file": [
        "simplemxml_element simplexml_load_file(string filename [, string class_name [, int options [, string ns [, bool is_prefix]]]])",
        "Load a filename and return a simplexml_element object to allow for processing"
    ],
    "simplexml_load_string": [
        "simplemxml_element simplexml_load_string(string data [, string class_name [, int options [, string ns [, bool is_prefix]]]])",
        "Load a string and return a simplexml_element object to allow for processing"
    ],
    "sin": [
        "float sin(float number)",
        "Returns the sine of the number in radians"
    ],
    "sinh": [
        "float sinh(float number)",
        "Returns the hyperbolic sine of the number, defined as (exp(number) - exp(-number))/2"
    ],
    "sleep": [
        "void sleep(int seconds)",
        "Delay for a given number of seconds"
    ],
    "smfi_addheader": [
        "bool smfi_addheader(string headerf, string headerv)",
        "Adds a header to the current message."
    ],
    "smfi_addrcpt": [
        "bool smfi_addrcpt(string rcpt)",
        "Add a recipient to the message envelope."
    ],
    "smfi_chgheader": [
        "bool smfi_chgheader(string headerf, string headerv)",
        "Changes a header's value for the current message."
    ],
    "smfi_delrcpt": [
        "bool smfi_delrcpt(string rcpt)",
        "Removes the named recipient from the current message's envelope."
    ],
    "smfi_getsymval": [
        "string smfi_getsymval(string macro)",
        "Returns the value of the given macro or NULL if the macro is not defined."
    ],
    "smfi_replacebody": [
        "bool smfi_replacebody(string body)",
        "Replaces the body of the current message. If called more than once,    subsequent calls result in data being appended to the new body."
    ],
    "smfi_setflags": [
        "void smfi_setflags(long flags)",
        "Sets the flags describing the actions the filter may take."
    ],
    "smfi_setreply": [
        "bool smfi_setreply(string rcode, string xcode, string message)",
        "Directly set the SMTP error reply code for this connection.    This code will be used on subsequent error replies resulting from actions taken by this filter."
    ],
    "smfi_settimeout": [
        "void smfi_settimeout(long timeout)",
        "Sets the number of seconds libmilter will wait for an MTA connection before timing out a socket."
    ],
    "snmp2_get": [
        "string snmp2_get(string host, string community, string object_id [, int timeout [, int retries]])",
        "Fetch a SNMP object"
    ],
    "snmp2_getnext": [
        "string snmp2_getnext(string host, string community, string object_id [, int timeout [, int retries]])",
        "Fetch a SNMP object"
    ],
    "snmp2_real_walk": [
        "array snmp2_real_walk(string host, string community, string object_id [, int timeout [, int retries]])",
        "Return all objects including their respective object id withing the specified one"
    ],
    "snmp2_set": [
        "int snmp2_set(string host, string community, string object_id, string type, mixed value [, int timeout [, int retries]])",
        "Set the value of a SNMP object"
    ],
    "snmp2_walk": [
        "array snmp2_walk(string host, string community, string object_id [, int timeout [, int retries]])",
        "Return all objects under the specified object id"
    ],
    "snmp3_get": [
        "int snmp3_get(string host, string sec_name, string sec_level, string auth_protocol, string auth_passphrase, string priv_protocol, string priv_passphrase, string object_id [, int timeout [, int retries]])",
        "Fetch the value of a SNMP object"
    ],
    "snmp3_getnext": [
        "int snmp3_getnext(string host, string sec_name, string sec_level, string auth_protocol, string auth_passphrase, string priv_protocol, string priv_passphrase, string object_id [, int timeout [, int retries]])",
        "Fetch the value of a SNMP object"
    ],
    "snmp3_real_walk": [
        "int snmp3_real_walk(string host, string sec_name, string sec_level, string auth_protocol, string auth_passphrase, string priv_protocol, string priv_passphrase, string object_id [, int timeout [, int retries]])",
        "Fetch the value of a SNMP object"
    ],
    "snmp3_set": [
        "int snmp3_set(string host, string sec_name, string sec_level, string auth_protocol, string auth_passphrase, string priv_protocol, string priv_passphrase, string object_id, string type, mixed value [, int timeout [, int retries]])",
        "Fetch the value of a SNMP object"
    ],
    "snmp3_walk": [
        "int snmp3_walk(string host, string sec_name, string sec_level, string auth_protocol, string auth_passphrase, string priv_protocol, string priv_passphrase, string object_id [, int timeout [, int retries]])",
        "Fetch the value of a SNMP object"
    ],
    "snmp_get_quick_print": [
        "bool snmp_get_quick_print()",
        "Return the current status of quick_print"
    ],
    "snmp_get_valueretrieval": [
        "int snmp_get_valueretrieval()",
        "Return the method how the SNMP values will be returned"
    ],
    "snmp_read_mib": [
        "int snmp_read_mib(string filename)",
        "Reads and parses a MIB file into the active MIB tree."
    ],
    "snmp_set_enum_print": [
        "void snmp_set_enum_print(int enum_print)",
        "Return all values that are enums with their enum value instead of the raw integer"
    ],
    "snmp_set_oid_output_format": [
        "void snmp_set_oid_output_format(int oid_format)",
        "Set the OID output format."
    ],
    "snmp_set_quick_print": [
        "void snmp_set_quick_print(int quick_print)",
        "Return all objects including their respective object id withing the specified one"
    ],
    "snmp_set_valueretrieval": [
        "void snmp_set_valueretrieval(int method)",
        "Specify the method how the SNMP values will be returned"
    ],
    "snmpget": [
        "string snmpget(string host, string community, string object_id [, int timeout [, int retries]])",
        "Fetch a SNMP object"
    ],
    "snmpgetnext": [
        "string snmpgetnext(string host, string community, string object_id [, int timeout [, int retries]])",
        "Fetch a SNMP object"
    ],
    "snmprealwalk": [
        "array snmprealwalk(string host, string community, string object_id [, int timeout [, int retries]])",
        "Return all objects including their respective object id withing the specified one"
    ],
    "snmpset": [
        "int snmpset(string host, string community, string object_id, string type, mixed value [, int timeout [, int retries]])",
        "Set the value of a SNMP object"
    ],
    "snmpwalk": [
        "array snmpwalk(string host, string community, string object_id [, int timeout [, int retries]])",
        "Return all objects under the specified object id"
    ],
    "socket_accept": [
        "resource socket_accept(resource socket)",
        "Accepts a connection on the listening socket fd"
    ],
    "socket_bind": [
        "bool socket_bind(resource socket, string addr [, int port])",
        "Binds an open socket to a listening port, port is only specified in AF_INET family."
    ],
    "socket_clear_error": [
        "void socket_clear_error([resource socket])",
        "Clears the error on the socket or the last error code."
    ],
    "socket_close": [
        "void socket_close(resource socket)",
        "Closes a file descriptor"
    ],
    "socket_connect": [
        "bool socket_connect(resource socket, string addr [, int port])",
        "Opens a connection to addr:port on the socket specified by socket"
    ],
    "socket_create": [
        "resource socket_create(int domain, int type, int protocol)",
        "Creates an endpoint for communication in the domain specified by domain, of type specified by type"
    ],
    "socket_create_listen": [
        "resource socket_create_listen(int port[, int backlog])",
        "Opens a socket on port to accept connections"
    ],
    "socket_create_pair": [
        "bool socket_create_pair(int domain, int type, int protocol, array &fd)",
        "Creates a pair of indistinguishable sockets and stores them in fds."
    ],
    "socket_get_option": [
        "mixed socket_get_option(resource socket, int level, int optname)",
        "Gets socket options for the socket"
    ],
    "socket_getpeername": [
        "bool socket_getpeername(resource socket, string &addr[, int &port])",
        "Queries the remote side of the given socket which may either result in host/port or in a UNIX filesystem path, dependent on its type."
    ],
    "socket_getsockname": [
        "bool socket_getsockname(resource socket, string &addr[, int &port])",
        "Queries the remote side of the given socket which may either result in host/port or in a UNIX filesystem path, dependent on its type."
    ],
    "socket_last_error": [
        "int socket_last_error([resource socket])",
        "Returns the last socket error (either the last used or the provided socket resource)"
    ],
    "socket_listen": [
        "bool socket_listen(resource socket[, int backlog])",
        "Sets the maximum number of connections allowed to be waited for on the socket specified by fd"
    ],
    "socket_read": [
        "string socket_read(resource socket, int length [, int type])",
        "Reads a maximum of length bytes from socket"
    ],
    "socket_recv": [
        "int socket_recv(resource socket, string &buf, int len, int flags)",
        "Receives data from a connected socket"
    ],
    "socket_recvfrom": [
        "int socket_recvfrom(resource socket, string &buf, int len, int flags, string &name [, int &port])",
        "Receives data from a socket, connected or not"
    ],
    "socket_select": [
        "int socket_select(array &read_fds, array &write_fds, array &except_fds, int tv_sec[, int tv_usec])",
        "Runs the select() system call on the sets mentioned with a timeout specified by tv_sec and tv_usec"
    ],
    "socket_send": [
        "int socket_send(resource socket, string buf, int len, int flags)",
        "Sends data to a connected socket"
    ],
    "socket_sendto": [
        "int socket_sendto(resource socket, string buf, int len, int flags, string addr [, int port])",
        "Sends a message to a socket, whether it is connected or not"
    ],
    "socket_set_block": [
        "bool socket_set_block(resource socket)",
        "Sets blocking mode on a socket resource"
    ],
    "socket_set_nonblock": [
        "bool socket_set_nonblock(resource socket)",
        "Sets nonblocking mode on a socket resource"
    ],
    "socket_set_option": [
        "bool socket_set_option(resource socket, int level, int optname, int|array optval)",
        "Sets socket options for the socket"
    ],
    "socket_shutdown": [
        "bool socket_shutdown(resource socket[, int how])",
        "Shuts down a socket for receiving, sending, or both."
    ],
    "socket_strerror": [
        "string socket_strerror(int errno)",
        "Returns a string describing an error"
    ],
    "socket_write": [
        "int socket_write(resource socket, string buf[, int length])",
        "Writes the buffer to the socket resource, length is optional"
    ],
    "solid_fetch_prev": [
        "bool solid_fetch_prev(resource result_id)",
        ""
    ],
    "sort": [
        "bool sort(array &array_arg [, int sort_flags])",
        "Sort an array"
    ],
    "soundex": [
        "string soundex(string str)",
        "Calculate the soundex key of a string"
    ],
    "spl_autoload": [
        "void spl_autoload(string class_name [, string file_extensions])",
        "Default implementation for __autoload()"
    ],
    "spl_autoload_call": [
        "void spl_autoload_call(string class_name)",
        "Try all registerd autoload function to load the requested class"
    ],
    "spl_autoload_extensions": [
        "string spl_autoload_extensions([string file_extensions])",
        "Register and return default file extensions for spl_autoload"
    ],
    "spl_autoload_functions": [
        "false|array spl_autoload_functions()",
        "Return all registered __autoload() functionns"
    ],
    "spl_autoload_register": [
        "bool spl_autoload_register([mixed autoload_function = \"spl_autoload\" [, throw = true [, prepend]]])",
        "Register given function as __autoload() implementation"
    ],
    "spl_autoload_unregister": [
        "bool spl_autoload_unregister(mixed autoload_function)",
        "Unregister given function as __autoload() implementation"
    ],
    "spl_classes": [
        "array spl_classes()",
        "Return an array containing the names of all clsses and interfaces defined in SPL"
    ],
    "spl_object_hash": [
        "string spl_object_hash(object obj)",
        "Return hash id for given object"
    ],
    "split": [
        "array split(string pattern, string string [, int limit])",
        "Split string into array by regular expression"
    ],
    "spliti": [
        "array spliti(string pattern, string string [, int limit])",
        "Split string into array by regular expression case-insensitive"
    ],
    "sprintf": [
        "string sprintf(string format [, mixed arg1 [, mixed ...]])",
        "Return a formatted string"
    ],
    "sql_regcase": [
        "string sql_regcase(string string)",
        "Make regular expression for case insensitive match"
    ],
    "sqlite_array_query": [
        "array sqlite_array_query(resource db, string query [ , int result_type [, bool decode_binary]])",
        "Executes a query against a given database and returns an array of arrays."
    ],
    "sqlite_busy_timeout": [
        "void sqlite_busy_timeout(resource db, int ms)",
        "Set busy timeout duration. If ms <= 0, all busy handlers are disabled."
    ],
    "sqlite_changes": [
        "int sqlite_changes(resource db)",
        "Returns the number of rows that were changed by the most recent SQL statement."
    ],
    "sqlite_close": [
        "void sqlite_close(resource db)",
        "Closes an open sqlite database."
    ],
    "sqlite_column": [
        "mixed sqlite_column(resource result, mixed index_or_name [, bool decode_binary])",
        "Fetches a column from the current row of a result set."
    ],
    "sqlite_create_aggregate": [
        "bool sqlite_create_aggregate(resource db, string funcname, mixed step_func, mixed finalize_func[, long num_args])",
        "Registers an aggregate function for queries."
    ],
    "sqlite_create_function": [
        "bool sqlite_create_function(resource db, string funcname, mixed callback[, long num_args])",
        "Registers a \"regular\" function for queries."
    ],
    "sqlite_current": [
        "array sqlite_current(resource result [, int result_type [, bool decode_binary]])",
        "Fetches the current row from a result set as an array."
    ],
    "sqlite_error_string": [
        "string sqlite_error_string(int error_code)",
        "Returns the textual description of an error code."
    ],
    "sqlite_escape_string": [
        "string sqlite_escape_string(string item)",
        "Escapes a string for use as a query parameter."
    ],
    "sqlite_exec": [
        "bool sqlite_exec(string query, resource db[, string &error_message])",
        "Executes a result-less query against a given database"
    ],
    "sqlite_factory": [
        "object sqlite_factory(string filename [, int mode [, string &error_message]])",
        "Opens a SQLite database and creates an object for it. Will create the database if it does not exist."
    ],
    "sqlite_fetch_all": [
        "array sqlite_fetch_all(resource result [, int result_type [, bool decode_binary]])",
        "Fetches all rows from a result set as an array of arrays."
    ],
    "sqlite_fetch_array": [
        "array sqlite_fetch_array(resource result [, int result_type [, bool decode_binary]])",
        "Fetches the next row from a result set as an array."
    ],
    "sqlite_fetch_column_types": [
        "resource sqlite_fetch_column_types(string table_name, resource db [, int result_type])",
        "Return an array of column types from a particular table."
    ],
    "sqlite_fetch_object": [
        "object sqlite_fetch_object(resource result [, string class_name [, NULL|array ctor_params [, bool decode_binary]]])",
        "Fetches the next row from a result set as an object."
    ],
    "sqlite_fetch_single": [
        "string sqlite_fetch_single(resource result [, bool decode_binary])",
        "Fetches the first column of a result set as a string."
    ],
    "sqlite_field_name": [
        "string sqlite_field_name(resource result, int field_index)",
        "Returns the name of a particular field of a result set."
    ],
    "sqlite_has_prev": [
        "bool sqlite_has_prev(resource result)",
        "* Returns whether a previous row is available."
    ],
    "sqlite_key": [
        "int sqlite_key(resource result)",
        "Return the current row index of a buffered result."
    ],
    "sqlite_last_error": [
        "int sqlite_last_error(resource db)",
        "Returns the error code of the last error for a database."
    ],
    "sqlite_last_insert_rowid": [
        "int sqlite_last_insert_rowid(resource db)",
        "Returns the rowid of the most recently inserted row."
    ],
    "sqlite_libencoding": [
        "string sqlite_libencoding()",
        "Returns the encoding (iso8859 or UTF-8) of the linked SQLite library."
    ],
    "sqlite_libversion": [
        "string sqlite_libversion()",
        "Returns the version of the linked SQLite library."
    ],
    "sqlite_next": [
        "bool sqlite_next(resource result)",
        "Seek to the next row number of a result set."
    ],
    "sqlite_num_fields": [
        "int sqlite_num_fields(resource result)",
        "Returns the number of fields in a result set."
    ],
    "sqlite_num_rows": [
        "int sqlite_num_rows(resource result)",
        "Returns the number of rows in a buffered result set."
    ],
    "sqlite_open": [
        "resource sqlite_open(string filename [, int mode [, string &error_message]])",
        "Opens a SQLite database. Will create the database if it does not exist."
    ],
    "sqlite_popen": [
        "resource sqlite_popen(string filename [, int mode [, string &error_message]])",
        "Opens a persistent handle to a SQLite database. Will create the database if it does not exist."
    ],
    "sqlite_prev": [
        "bool sqlite_prev(resource result)",
        "* Seek to the previous row number of a result set."
    ],
    "sqlite_query": [
        "resource sqlite_query(string query, resource db [, int result_type [, string &error_message]])",
        "Executes a query against a given database and returns a result handle."
    ],
    "sqlite_rewind": [
        "bool sqlite_rewind(resource result)",
        "Seek to the first row number of a buffered result set."
    ],
    "sqlite_seek": [
        "bool sqlite_seek(resource result, int row)",
        "Seek to a particular row number of a buffered result set."
    ],
    "sqlite_single_query": [
        "array sqlite_single_query(resource db, string query [, bool first_row_only [, bool decode_binary]])",
        "Executes a query and returns either an array for one single column or the value of the first row."
    ],
    "sqlite_udf_decode_binary": [
        "string sqlite_udf_decode_binary(string data)",
        "Decode binary encoding on a string parameter passed to an UDF."
    ],
    "sqlite_udf_encode_binary": [
        "string sqlite_udf_encode_binary(string data)",
        "Apply binary encoding (if required) to a string to return from an UDF."
    ],
    "sqlite_unbuffered_query": [
        "resource sqlite_unbuffered_query(string query, resource db [ , int result_type [, string &error_message]])",
        "Executes a query that does not prefetch and buffer all data."
    ],
    "sqlite_valid": [
        "bool sqlite_valid(resource result)",
        "Returns whether more rows are available."
    ],
    "sqrt": [
        "float sqrt(float number)",
        "Returns the square root of the number"
    ],
    "srand": [
        "void srand([int seed])",
        "Seeds random number generator"
    ],
    "sscanf": [
        "mixed sscanf(string str, string format [, string ...])",
        "Implements an ANSI C compatible sscanf"
    ],
    "stat": [
        "array stat(string filename)",
        "Give information about a file"
    ],
    "str_getcsv": [
        "array str_getcsv(string input[, string delimiter[, string enclosure[, string escape]]])",
        "Parse a CSV string into an array"
    ],
    "str_ireplace": [
        "mixed str_ireplace(mixed search, mixed replace, mixed subject [, int &replace_count])",
        "Replaces all occurrences of search in haystack with replace / case-insensitive"
    ],
    "str_pad": [
        "string str_pad(string input, int pad_length [, string pad_string [, int pad_type]])",
        "Returns input string padded on the left or right to specified length with pad_string"
    ],
    "str_repeat": [
        "string str_repeat(string input, int mult)",
        "Returns the input string repeat mult times"
    ],
    "str_replace": [
        "mixed str_replace(mixed search, mixed replace, mixed subject [, int &replace_count])",
        "Replaces all occurrences of search in haystack with replace"
    ],
    "str_rot13": [
        "string str_rot13(string str)",
        "Perform the rot13 transform on a string"
    ],
    "str_shuffle": [
        "void str_shuffle(string str)",
        "Shuffles string. One permutation of all possible is created"
    ],
    "str_split": [
        "array str_split(string str [, int split_length])",
        "Convert a string to an array. If split_length is specified, break the string down into chunks each split_length characters long."
    ],
    "str_word_count": [
        "mixed str_word_count(string str, [int format [, string charlist]])",
        "Counts the number of words inside a string. If format of 1 is specified,     then the function will return an array containing all the words     found inside the string. If format of 2 is specified, then the function     will return an associated array where the position of the word is the key     and the word itself is the value.          For the purpose of this function, 'word' is defined as a locale dependent     string containing alphabetic characters, which also may contain, but not start     with \"'\" and \"-\" characters."
    ],
    "strcasecmp": [
        "int strcasecmp(string str1, string str2)",
        "Binary safe case-insensitive string comparison"
    ],
    "strchr": [
        "string strchr(string haystack, string needle)",
        "An alias for strstr"
    ],
    "strcmp": [
        "int strcmp(string str1, string str2)",
        "Binary safe string comparison"
    ],
    "strcoll": [
        "int strcoll(string str1, string str2)",
        "Compares two strings using the current locale"
    ],
    "strcspn": [
        "int strcspn(string str, string mask [, start [, len]])",
        "Finds length of initial segment consisting entirely of characters not found in mask. If start or/and length is provide works like strcspn(substr($s,$start,$len),$bad_chars)"
    ],
    "stream_bucket_append": [
        "void stream_bucket_append(resource brigade, resource bucket)",
        "Append bucket to brigade"
    ],
    "stream_bucket_make_writeable": [
        "object stream_bucket_make_writeable(resource brigade)",
        "Return a bucket object from the brigade for operating on"
    ],
    "stream_bucket_new": [
        "resource stream_bucket_new(resource stream, string buffer)",
        "Create a new bucket for use on the current stream"
    ],
    "stream_bucket_prepend": [
        "void stream_bucket_prepend(resource brigade, resource bucket)",
        "Prepend bucket to brigade"
    ],
    "stream_context_create": [
        "resource stream_context_create([array options[, array params]])",
        "Create a file context and optionally set parameters"
    ],
    "stream_context_get_default": [
        "resource stream_context_get_default([array options])",
        "Get a handle on the default file/stream context and optionally set parameters"
    ],
    "stream_context_get_options": [
        "array stream_context_get_options(resource context|resource stream)",
        "Retrieve options for a stream/wrapper/context"
    ],
    "stream_context_get_params": [
        "array stream_context_get_params(resource context|resource stream)",
        "Get parameters of a file context"
    ],
    "stream_context_set_default": [
        "resource stream_context_set_default(array options)",
        "Set default file/stream context, returns the context as a resource"
    ],
    "stream_context_set_option": [
        "bool stream_context_set_option(resource context|resource stream, string wrappername, string optionname, mixed value)",
        "Set an option for a wrapper"
    ],
    "stream_context_set_params": [
        "bool stream_context_set_params(resource context|resource stream, array options)",
        "Set parameters for a file context"
    ],
    "stream_copy_to_stream": [
        "long stream_copy_to_stream(resource source, resource dest [, long maxlen [, long pos]])",
        "Reads up to maxlen bytes from source stream and writes them to dest stream."
    ],
    "stream_filter_append": [
        "resource stream_filter_append(resource stream, string filtername[, int read_write[, string filterparams]])",
        "Append a filter to a stream"
    ],
    "stream_filter_prepend": [
        "resource stream_filter_prepend(resource stream, string filtername[, int read_write[, string filterparams]])",
        "Prepend a filter to a stream"
    ],
    "stream_filter_register": [
        "bool stream_filter_register(string filtername, string classname)",
        "Registers a custom filter handler class"
    ],
    "stream_filter_remove": [
        "bool stream_filter_remove(resource stream_filter)",
        "Flushes any data in the filter's internal buffer, removes it from the chain, and frees the resource"
    ],
    "stream_get_contents": [
        "string stream_get_contents(resource source [, long maxlen [, long offset]])",
        "Reads all remaining bytes (or up to maxlen bytes) from a stream and returns them as a string."
    ],
    "stream_get_filters": [
        "array stream_get_filters()",
        "Returns a list of registered filters"
    ],
    "stream_get_line": [
        "string stream_get_line(resource stream, int maxlen [, string ending])",
        "Read up to maxlen bytes from a stream or until the ending string is found"
    ],
    "stream_get_meta_data": [
        "array stream_get_meta_data(resource fp)",
        "Retrieves header/meta data from streams/file pointers"
    ],
    "stream_get_transports": [
        "array stream_get_transports()",
        "Retrieves list of registered socket transports"
    ],
    "stream_get_wrappers": [
        "array stream_get_wrappers()",
        "Retrieves list of registered stream wrappers"
    ],
    "stream_is_local": [
        "bool stream_is_local(resource stream|string url)",
        ""
    ],
    "stream_resolve_include_path": [
        "string stream_resolve_include_path(string filename)",
        "Determine what file will be opened by calls to fopen() with a relative path"
    ],
    "stream_select": [
        "int stream_select(array &read_streams, array &write_streams, array &except_streams, int tv_sec[, int tv_usec])",
        "Runs the select() system call on the sets of streams with a timeout specified by tv_sec and tv_usec"
    ],
    "stream_set_blocking": [
        "bool stream_set_blocking(resource socket, int mode)",
        "Set blocking/non-blocking mode on a socket or stream"
    ],
    "stream_set_timeout": [
        "bool stream_set_timeout(resource stream, int seconds [, int microseconds])",
        "Set timeout on stream read to seconds + microseonds"
    ],
    "stream_set_write_buffer": [
        "int stream_set_write_buffer(resource fp, int buffer)",
        "Set file write buffer"
    ],
    "stream_socket_accept": [
        "resource stream_socket_accept(resource serverstream, [ double timeout [, string &peername ]])",
        "Accept a client connection from a server socket"
    ],
    "stream_socket_client": [
        "resource stream_socket_client(string remoteaddress [, long &errcode [, string &errstring [, double timeout [, long flags [, resource context]]]]])",
        "Open a client connection to a remote address"
    ],
    "stream_socket_enable_crypto": [
        "int stream_socket_enable_crypto(resource stream, bool enable [, int cryptokind [, resource sessionstream]])",
        "Enable or disable a specific kind of crypto on the stream"
    ],
    "stream_socket_get_name": [
        "string stream_socket_get_name(resource stream, bool want_peer)",
        "Returns either the locally bound or remote name for a socket stream"
    ],
    "stream_socket_pair": [
        "array stream_socket_pair(int domain, int type, int protocol)",
        "Creates a pair of connected, indistinguishable socket streams"
    ],
    "stream_socket_recvfrom": [
        "string stream_socket_recvfrom(resource stream, long amount [, long flags [, string &remote_addr]])",
        "Receives data from a socket stream"
    ],
    "stream_socket_sendto": [
        "long stream_socket_sendto(resouce stream, string data [, long flags [, string target_addr]])",
        "Send data to a socket stream.  If target_addr is specified it must be in dotted quad (or [ipv6]) format"
    ],
    "stream_socket_server": [
        "resource stream_socket_server(string localaddress [, long &errcode [, string &errstring [, long flags [, resource context]]]])",
        "Create a server socket bound to localaddress"
    ],
    "stream_socket_shutdown": [
        "int stream_socket_shutdown(resource stream, int how)",
        "causes all or part of a full-duplex connection on the socket associated  with stream to be shut down.  If how is SHUT_RD,  further receptions will  be disallowed. If how is SHUT_WR, further transmissions will be disallowed.  If how is SHUT_RDWR,  further  receptions and transmissions will be  disallowed."
    ],
    "stream_supports_lock": [
        "bool stream_supports_lock(resource stream)",
        "Tells whether the stream supports locking through flock()."
    ],
    "stream_wrapper_register": [
        "bool stream_wrapper_register(string protocol, string classname[, integer flags])",
        "Registers a custom URL protocol handler class"
    ],
    "stream_wrapper_restore": [
        "bool stream_wrapper_restore(string protocol)",
        "Restore the original protocol handler, overriding if necessary"
    ],
    "stream_wrapper_unregister": [
        "bool stream_wrapper_unregister(string protocol)",
        "Unregister a wrapper for the life of the current request."
    ],
    "strftime": [
        "string strftime(string format [, int timestamp])",
        "Format a local time/date according to locale settings"
    ],
    "strip_tags": [
        "string strip_tags(string str [, string allowable_tags])",
        "Strips HTML and PHP tags from a string"
    ],
    "stripcslashes": [
        "string stripcslashes(string str)",
        "Strips backslashes from a string. Uses C-style conventions"
    ],
    "stripos": [
        "int stripos(string haystack, string needle [, int offset])",
        "Finds position of first occurrence of a string within another, case insensitive"
    ],
    "stripslashes": [
        "string stripslashes(string str)",
        "Strips backslashes from a string"
    ],
    "stristr": [
        "string stristr(string haystack, string needle[, bool part])",
        "Finds first occurrence of a string within another, case insensitive"
    ],
    "strlen": [
        "int strlen(string str)",
        "Get string length"
    ],
    "strnatcasecmp": [
        "int strnatcasecmp(string s1, string s2)",
        "Returns the result of case-insensitive string comparison using 'natural' algorithm"
    ],
    "strnatcmp": [
        "int strnatcmp(string s1, string s2)",
        "Returns the result of string comparison using 'natural' algorithm"
    ],
    "strncasecmp": [
        "int strncasecmp(string str1, string str2, int len)",
        "Binary safe string comparison"
    ],
    "strncmp": [
        "int strncmp(string str1, string str2, int len)",
        "Binary safe string comparison"
    ],
    "strpbrk": [
        "array strpbrk(string haystack, string char_list)",
        "Search a string for any of a set of characters"
    ],
    "strpos": [
        "int strpos(string haystack, string needle [, int offset])",
        "Finds position of first occurrence of a string within another"
    ],
    "strptime": [
        "string strptime(string timestamp, string format)",
        "Parse a time/date generated with strftime()"
    ],
    "strrchr": [
        "string strrchr(string haystack, string needle)",
        "Finds the last occurrence of a character in a string within another"
    ],
    "strrev": [
        "string strrev(string str)",
        "Reverse a string"
    ],
    "strripos": [
        "int strripos(string haystack, string needle [, int offset])",
        "Finds position of last occurrence of a string within another string"
    ],
    "strrpos": [
        "int strrpos(string haystack, string needle [, int offset])",
        "Finds position of last occurrence of a string within another string"
    ],
    "strspn": [
        "int strspn(string str, string mask [, start [, len]])",
        "Finds length of initial segment consisting entirely of characters found in mask. If start or/and length is provided works like strspn(substr($s,$start,$len),$good_chars)"
    ],
    "strstr": [
        "string strstr(string haystack, string needle[, bool part])",
        "Finds first occurrence of a string within another"
    ],
    "strtok": [
        "string strtok([string str,] string token)",
        "Tokenize a string"
    ],
    "strtolower": [
        "string strtolower(string str)",
        "Makes a string lowercase"
    ],
    "strtotime": [
        "int strtotime(string time [, int now ])",
        "Convert string representation of date and time to a timestamp"
    ],
    "strtoupper": [
        "string strtoupper(string str)",
        "Makes a string uppercase"
    ],
    "strtr": [
        "string strtr(string str, string from[, string to])",
        "Translates characters in str using given translation tables"
    ],
    "strval": [
        "string strval(mixed var)",
        "Get the string value of a variable"
    ],
    "substr": [
        "string substr(string str, int start [, int length])",
        "Returns part of a string"
    ],
    "substr_compare": [
        "int substr_compare(string main_str, string str, int offset [, int length [, bool case_sensitivity]])",
        "Binary safe optionally case insensitive comparison of 2 strings from an offset, up to length characters"
    ],
    "substr_count": [
        "int substr_count(string haystack, string needle [, int offset [, int length]])",
        "Returns the number of times a substring occurs in the string"
    ],
    "substr_replace": [
        "mixed substr_replace(mixed str, mixed repl, mixed start [, mixed length])",
        "Replaces part of a string with another string"
    ],
    "sybase_affected_rows": [
        "int sybase_affected_rows([resource link_id])",
        "Get number of affected rows in last query"
    ],
    "sybase_close": [
        "bool sybase_close([resource link_id])",
        "Close Sybase connection"
    ],
    "sybase_connect": [
        "int sybase_connect([string host [, string user [, string password [, string charset [, string appname [, bool new]]]]]])",
        "Open Sybase server connection"
    ],
    "sybase_data_seek": [
        "bool sybase_data_seek(resource result, int offset)",
        "Move internal row pointer"
    ],
    "sybase_deadlock_retry_count": [
        "void sybase_deadlock_retry_count(int retry_count)",
        "Sets deadlock retry count"
    ],
    "sybase_fetch_array": [
        "array sybase_fetch_array(resource result)",
        "Fetch row as array"
    ],
    "sybase_fetch_assoc": [
        "array sybase_fetch_assoc(resource result)",
        "Fetch row as array without numberic indices"
    ],
    "sybase_fetch_field": [
        "object sybase_fetch_field(resource result [, int offset])",
        "Get field information"
    ],
    "sybase_fetch_object": [
        "object sybase_fetch_object(resource result [, mixed object])",
        "Fetch row as object"
    ],
    "sybase_fetch_row": [
        "array sybase_fetch_row(resource result)",
        "Get row as enumerated array"
    ],
    "sybase_field_seek": [
        "bool sybase_field_seek(resource result, int offset)",
        "Set field offset"
    ],
    "sybase_free_result": [
        "bool sybase_free_result(resource result)",
        "Free result memory"
    ],
    "sybase_get_last_message": [
        "string sybase_get_last_message()",
        "Returns the last message from server (over min_message_severity)"
    ],
    "sybase_min_client_severity": [
        "void sybase_min_client_severity(int severity)",
        "Sets minimum client severity"
    ],
    "sybase_min_server_severity": [
        "void sybase_min_server_severity(int severity)",
        "Sets minimum server severity"
    ],
    "sybase_num_fields": [
        "int sybase_num_fields(resource result)",
        "Get number of fields in result"
    ],
    "sybase_num_rows": [
        "int sybase_num_rows(resource result)",
        "Get number of rows in result"
    ],
    "sybase_pconnect": [
        "int sybase_pconnect([string host [, string user [, string password [, string charset [, string appname]]]]])",
        "Open persistent Sybase connection"
    ],
    "sybase_query": [
        "int sybase_query(string query [, resource link_id])",
        "Send Sybase query"
    ],
    "sybase_result": [
        "string sybase_result(resource result, int row, mixed field)",
        "Get result data"
    ],
    "sybase_select_db": [
        "bool sybase_select_db(string database [, resource link_id])",
        "Select Sybase database"
    ],
    "sybase_set_message_handler": [
        "bool sybase_set_message_handler(mixed error_func [, resource connection])",
        "Set the error handler, to be called when a server message is raised.     If error_func is NULL the handler will be deleted"
    ],
    "sybase_unbuffered_query": [
        "int sybase_unbuffered_query(string query [, resource link_id])",
        "Send Sybase query"
    ],
    "symlink": [
        "int symlink(string target, string link)",
        "Create a symbolic link"
    ],
    "sys_get_temp_dir": [
        "string sys_get_temp_dir()",
        "Returns directory path used for temporary files"
    ],
    "sys_getloadavg": [
        "array sys_getloadavg()",
        ""
    ],
    "syslog": [
        "bool syslog(int priority, string message)",
        "Generate a system log message"
    ],
    "system": [
        "int system(string command [, int &return_value])",
        "Execute an external program and display output"
    ],
    "tan": [
        "float tan(float number)",
        "Returns the tangent of the number in radians"
    ],
    "tanh": [
        "float tanh(float number)",
        "Returns the hyperbolic tangent of the number, defined as sinh(number)/cosh(number)"
    ],
    "tempnam": [
        "string tempnam(string dir, string prefix)",
        "Create a unique filename in a directory"
    ],
    "textdomain": [
        "string textdomain(string domain)",
        "Set the textdomain to \"domain\". Returns the current domain"
    ],
    "tidy_access_count": [
        "int tidy_access_count()",
        "Returns the Number of Tidy accessibility warnings encountered for specified document."
    ],
    "tidy_clean_repair": [
        "bool tidy_clean_repair()",
        "Execute configured cleanup and repair operations on parsed markup"
    ],
    "tidy_config_count": [
        "int tidy_config_count()",
        "Returns the Number of Tidy configuration errors encountered for specified document."
    ],
    "tidy_diagnose": [
        "bool tidy_diagnose()",
        "Run configured diagnostics on parsed and repaired markup."
    ],
    "tidy_error_count": [
        "int tidy_error_count()",
        "Returns the Number of Tidy errors encountered for specified document."
    ],
    "tidy_get_body": [
        "TidyNode tidy_get_body(resource tidy)",
        "Returns a TidyNode Object starting from the <BODY> tag of the tidy parse tree"
    ],
    "tidy_get_config": [
        "array tidy_get_config()",
        "Get current Tidy configuarion"
    ],
    "tidy_get_error_buffer": [
        "string tidy_get_error_buffer([bool detailed])",
        "Return warnings and errors which occured parsing the specified document"
    ],
    "tidy_get_head": [
        "TidyNode tidy_get_head()",
        "Returns a TidyNode Object starting from the <HEAD> tag of the tidy parse tree"
    ],
    "tidy_get_html": [
        "TidyNode tidy_get_html()",
        "Returns a TidyNode Object starting from the <HTML> tag of the tidy parse tree"
    ],
    "tidy_get_html_ver": [
        "int tidy_get_html_ver()",
        "Get the Detected HTML version for the specified document."
    ],
    "tidy_get_opt_doc": [
        "string tidy_get_opt_doc(tidy resource, string optname)",
        "Returns the documentation for the given option name"
    ],
    "tidy_get_output": [
        "string tidy_get_output()",
        "Return a string representing the parsed tidy markup"
    ],
    "tidy_get_release": [
        "string tidy_get_release()",
        "Get release date (version) for Tidy library"
    ],
    "tidy_get_root": [
        "TidyNode tidy_get_root()",
        "Returns a TidyNode Object representing the root of the tidy parse tree"
    ],
    "tidy_get_status": [
        "int tidy_get_status()",
        "Get status of specfied document."
    ],
    "tidy_getopt": [
        "mixed tidy_getopt(string option)",
        "Returns the value of the specified configuration option for the tidy document."
    ],
    "tidy_is_xhtml": [
        "bool tidy_is_xhtml()",
        "Indicates if the document is a XHTML document."
    ],
    "tidy_is_xml": [
        "bool tidy_is_xml()",
        "Indicates if the document is a generic (non HTML/XHTML) XML document."
    ],
    "tidy_parse_file": [
        "bool tidy_parse_file(string file [, mixed config_options [, string encoding [, bool use_include_path]]])",
        "Parse markup in file or URI"
    ],
    "tidy_parse_string": [
        "bool tidy_parse_string(string input [, mixed config_options [, string encoding]])",
        "Parse a document stored in a string"
    ],
    "tidy_repair_file": [
        "bool tidy_repair_file(string filename [, mixed config_file [, string encoding [, bool use_include_path]]])",
        "Repair a file using an optionally provided configuration file"
    ],
    "tidy_repair_string": [
        "bool tidy_repair_string(string data [, mixed config_file [, string encoding]])",
        "Repair a string using an optionally provided configuration file"
    ],
    "tidy_warning_count": [
        "int tidy_warning_count()",
        "Returns the Number of Tidy warnings encountered for specified document."
    ],
    "time": [
        "int time()",
        "Return current UNIX timestamp"
    ],
    "time_nanosleep": [
        "mixed time_nanosleep(long seconds, long nanoseconds)",
        "Delay for a number of seconds and nano seconds"
    ],
    "time_sleep_until": [
        "mixed time_sleep_until(float timestamp)",
        "Make the script sleep until the specified time"
    ],
    "timezone_abbreviations_list": [
        "array timezone_abbreviations_list()",
        "Returns associative array containing dst, offset and the timezone name"
    ],
    "timezone_identifiers_list": [
        "array timezone_identifiers_list([long what[, string country]])",
        "Returns numerically index array with all timezone identifiers."
    ],
    "timezone_location_get": [
        "array timezone_location_get()",
        "Returns location information for a timezone, including country code, latitude/longitude and comments"
    ],
    "timezone_name_from_abbr": [
        "string timezone_name_from_abbr(string abbr[, long gmtOffset[, long isdst]])",
        "Returns the timezone name from abbrevation"
    ],
    "timezone_name_get": [
        "string timezone_name_get(DateTimeZone object)",
        "Returns the name of the timezone."
    ],
    "timezone_offset_get": [
        "long timezone_offset_get(DateTimeZone object, DateTime object)",
        "Returns the timezone offset."
    ],
    "timezone_open": [
        "DateTimeZone timezone_open(string timezone)",
        "Returns new DateTimeZone object"
    ],
    "timezone_transitions_get": [
        "array timezone_transitions_get(DateTimeZone object [, long timestamp_begin [, long timestamp_end ]])",
        "Returns numerically indexed array containing associative array for all transitions in the specified range for the timezone."
    ],
    "timezone_version_get": [
        "array timezone_version_get()",
        "Returns the Olson database version number."
    ],
    "tmpfile": [
        "resource tmpfile()",
        "Create a temporary file that will be deleted automatically after use"
    ],
    "token_get_all": [
        "array token_get_all(string source)",
        ""
    ],
    "token_name": [
        "string token_name(int type)",
        ""
    ],
    "touch": [
        "bool touch(string filename [, int time [, int atime]])",
        "Set modification time of file"
    ],
    "trigger_error": [
        "void trigger_error(string messsage [, int error_type])",
        "Generates a user-level error/warning/notice message"
    ],
    "trim": [
        "string trim(string str [, string character_mask])",
        "Strips whitespace from the beginning and end of a string"
    ],
    "uasort": [
        "bool uasort(array array_arg, string cmp_function)",
        "Sort an array with a user-defined comparison function and maintain index association"
    ],
    "ucfirst": [
        "string ucfirst(string str)",
        "Make a string's first character lowercase"
    ],
    "ucwords": [
        "string ucwords(string str)",
        "Uppercase the first character of every word in a string"
    ],
    "uksort": [
        "bool uksort(array array_arg, string cmp_function)",
        "Sort an array by keys using a user-defined comparison function"
    ],
    "umask": [
        "int umask([int mask])",
        "Return or change the umask"
    ],
    "uniqid": [
        "string uniqid([string prefix [, bool more_entropy]])",
        "Generates a unique ID"
    ],
    "unixtojd": [
        "int unixtojd([int timestamp])",
        "Convert UNIX timestamp to Julian Day"
    ],
    "unlink": [
        "bool unlink(string filename[, context context])",
        "Delete a file"
    ],
    "unpack": [
        "array unpack(string format, string input)",
        "Unpack binary string into named array elements according to format argument"
    ],
    "unregister_tick_function": [
        "void unregister_tick_function(string function_name)",
        "Unregisters a tick callback function"
    ],
    "unserialize": [
        "mixed unserialize(string variable_representation)",
        "Takes a string representation of variable and recreates it"
    ],
    "unset": [
        "void unset(mixed var [, mixed var])",
        "Unset a given variable"
    ],
    "urldecode": [
        "string urldecode(string str)",
        "Decodes URL-encoded string"
    ],
    "urlencode": [
        "string urlencode(string str)",
        "URL-encodes string"
    ],
    "usleep": [
        "void usleep(int micro_seconds)",
        "Delay for a given number of micro seconds"
    ],
    "usort": [
        "bool usort(array array_arg, string cmp_function)",
        "Sort an array by values using a user-defined comparison function"
    ],
    "utf8_decode": [
        "string utf8_decode(string data)",
        "Converts a UTF-8 encoded string to ISO-8859-1"
    ],
    "utf8_encode": [
        "string utf8_encode(string data)",
        "Encodes an ISO-8859-1 string to UTF-8"
    ],
    "var_dump": [
        "void var_dump(mixed var)",
        "Dumps a string representation of variable to output"
    ],
    "var_export": [
        "string var_export(mixed var [, bool return])",
        "Outputs or returns a string representation of a variable"
    ],
    "variant_abs": [
        "mixed variant_abs(mixed left)",
        "Returns the absolute value of a variant"
    ],
    "variant_add": [
        "mixed variant_add(mixed left, mixed right)",
        "\"Adds\" two variant values together and returns the result"
    ],
    "variant_and": [
        "mixed variant_and(mixed left, mixed right)",
        "performs a bitwise AND operation between two variants and returns the result"
    ],
    "variant_cast": [
        "object variant_cast(object variant, int type)",
        "Convert a variant into a new variant object of another type"
    ],
    "variant_cat": [
        "mixed variant_cat(mixed left, mixed right)",
        "concatenates two variant values together and returns the result"
    ],
    "variant_cmp": [
        "int variant_cmp(mixed left, mixed right [, int lcid [, int flags]])",
        "Compares two variants"
    ],
    "variant_date_from_timestamp": [
        "object variant_date_from_timestamp(int timestamp)",
        "Returns a variant date representation of a unix timestamp"
    ],
    "variant_date_to_timestamp": [
        "int variant_date_to_timestamp(object variant)",
        "Converts a variant date/time value to unix timestamp"
    ],
    "variant_div": [
        "mixed variant_div(mixed left, mixed right)",
        "Returns the result from dividing two variants"
    ],
    "variant_eqv": [
        "mixed variant_eqv(mixed left, mixed right)",
        "Performs a bitwise equivalence on two variants"
    ],
    "variant_fix": [
        "mixed variant_fix(mixed left)",
        "Returns the integer part ? of a variant"
    ],
    "variant_get_type": [
        "int variant_get_type(object variant)",
        "Returns the VT_XXX type code for a variant"
    ],
    "variant_idiv": [
        "mixed variant_idiv(mixed left, mixed right)",
        "Converts variants to integers and then returns the result from dividing them"
    ],
    "variant_imp": [
        "mixed variant_imp(mixed left, mixed right)",
        "Performs a bitwise implication on two variants"
    ],
    "variant_int": [
        "mixed variant_int(mixed left)",
        "Returns the integer portion of a variant"
    ],
    "variant_mod": [
        "mixed variant_mod(mixed left, mixed right)",
        "Divides two variants and returns only the remainder"
    ],
    "variant_mul": [
        "mixed variant_mul(mixed left, mixed right)",
        "multiplies the values of the two variants and returns the result"
    ],
    "variant_neg": [
        "mixed variant_neg(mixed left)",
        "Performs logical negation on a variant"
    ],
    "variant_not": [
        "mixed variant_not(mixed left)",
        "Performs bitwise not negation on a variant"
    ],
    "variant_or": [
        "mixed variant_or(mixed left, mixed right)",
        "Performs a logical disjunction on two variants"
    ],
    "variant_pow": [
        "mixed variant_pow(mixed left, mixed right)",
        "Returns the result of performing the power function with two variants"
    ],
    "variant_round": [
        "mixed variant_round(mixed left, int decimals)",
        "Rounds a variant to the specified number of decimal places"
    ],
    "variant_set": [
        "void variant_set(object variant, mixed value)",
        "Assigns a new value for a variant object"
    ],
    "variant_set_type": [
        "void variant_set_type(object variant, int type)",
        "Convert a variant into another type.  Variant is modified \"in-place\""
    ],
    "variant_sub": [
        "mixed variant_sub(mixed left, mixed right)",
        "subtracts the value of the right variant from the left variant value and returns the result"
    ],
    "variant_xor": [
        "mixed variant_xor(mixed left, mixed right)",
        "Performs a logical exclusion on two variants"
    ],
    "version_compare": [
        "int version_compare(string ver1, string ver2 [, string oper])",
        "Compares two \"PHP-standardized\" version number strings"
    ],
    "vfprintf": [
        "int vfprintf(resource stream, string format, array args)",
        "Output a formatted string into a stream"
    ],
    "virtual": [
        "bool virtual(string filename)",
        "Perform an Apache sub-request"
    ],
    "vprintf": [
        "int vprintf(string format, array args)",
        "Output a formatted string"
    ],
    "vsprintf": [
        "string vsprintf(string format, array args)",
        "Return a formatted string"
    ],
    "wddx_add_vars": [
        "int wddx_add_vars(resource packet_id, mixed var_names [, mixed ...])",
        "Serializes given variables and adds them to packet given by packet_id"
    ],
    "wddx_deserialize": [
        "mixed wddx_deserialize(mixed packet)",
        "Deserializes given packet and returns a PHP value"
    ],
    "wddx_packet_end": [
        "string wddx_packet_end(resource packet_id)",
        "Ends specified WDDX packet and returns the string containing the packet"
    ],
    "wddx_packet_start": [
        "resource wddx_packet_start([string comment])",
        "Starts a WDDX packet with optional comment and returns the packet id"
    ],
    "wddx_serialize_value": [
        "string wddx_serialize_value(mixed var [, string comment])",
        "Creates a new packet and serializes the given value"
    ],
    "wddx_serialize_vars": [
        "string wddx_serialize_vars(mixed var_name [, mixed ...])",
        "Creates a new packet and serializes given variables into a struct"
    ],
    "wordwrap": [
        "string wordwrap(string str [, int width [, string break [, bool cut]]])",
        "Wraps buffer to selected number of characters using string break char"
    ],
    "xml_error_string": [
        "string xml_error_string(int code)",
        "Get XML parser error string"
    ],
    "xml_get_current_byte_index": [
        "int xml_get_current_byte_index(resource parser)",
        "Get current byte index for an XML parser"
    ],
    "xml_get_current_column_number": [
        "int xml_get_current_column_number(resource parser)",
        "Get current column number for an XML parser"
    ],
    "xml_get_current_line_number": [
        "int xml_get_current_line_number(resource parser)",
        "Get current line number for an XML parser"
    ],
    "xml_get_error_code": [
        "int xml_get_error_code(resource parser)",
        "Get XML parser error code"
    ],
    "xml_parse": [
        "int xml_parse(resource parser, string data [, int isFinal])",
        "Start parsing an XML document"
    ],
    "xml_parse_into_struct": [
        "int xml_parse_into_struct(resource parser, string data, array &values [, array &index ])",
        "Parsing a XML document"
    ],
    "xml_parser_create": [
        "resource xml_parser_create([string encoding])",
        "Create an XML parser"
    ],
    "xml_parser_create_ns": [
        "resource xml_parser_create_ns([string encoding [, string sep]])",
        "Create an XML parser"
    ],
    "xml_parser_free": [
        "int xml_parser_free(resource parser)",
        "Free an XML parser"
    ],
    "xml_parser_get_option": [
        "int xml_parser_get_option(resource parser, int option)",
        "Get options from an XML parser"
    ],
    "xml_parser_set_option": [
        "int xml_parser_set_option(resource parser, int option, mixed value)",
        "Set options in an XML parser"
    ],
    "xml_set_character_data_handler": [
        "int xml_set_character_data_handler(resource parser, string hdl)",
        "Set up character data handler"
    ],
    "xml_set_default_handler": [
        "int xml_set_default_handler(resource parser, string hdl)",
        "Set up default handler"
    ],
    "xml_set_element_handler": [
        "int xml_set_element_handler(resource parser, string shdl, string ehdl)",
        "Set up start and end element handlers"
    ],
    "xml_set_end_namespace_decl_handler": [
        "int xml_set_end_namespace_decl_handler(resource parser, string hdl)",
        "Set up character data handler"
    ],
    "xml_set_external_entity_ref_handler": [
        "int xml_set_external_entity_ref_handler(resource parser, string hdl)",
        "Set up external entity reference handler"
    ],
    "xml_set_notation_decl_handler": [
        "int xml_set_notation_decl_handler(resource parser, string hdl)",
        "Set up notation declaration handler"
    ],
    "xml_set_object": [
        "int xml_set_object(resource parser, object &obj)",
        "Set up object which should be used for callbacks"
    ],
    "xml_set_processing_instruction_handler": [
        "int xml_set_processing_instruction_handler(resource parser, string hdl)",
        "Set up processing instruction (PI) handler"
    ],
    "xml_set_start_namespace_decl_handler": [
        "int xml_set_start_namespace_decl_handler(resource parser, string hdl)",
        "Set up character data handler"
    ],
    "xml_set_unparsed_entity_decl_handler": [
        "int xml_set_unparsed_entity_decl_handler(resource parser, string hdl)",
        "Set up unparsed entity declaration handler"
    ],
    "xmlrpc_decode": [
        "array xmlrpc_decode(string xml [, string encoding])",
        "Decodes XML into native PHP types"
    ],
    "xmlrpc_decode_request": [
        "array xmlrpc_decode_request(string xml, string& method [, string encoding])",
        "Decodes XML into native PHP types"
    ],
    "xmlrpc_encode": [
        "string xmlrpc_encode(mixed value)",
        "Generates XML for a PHP value"
    ],
    "xmlrpc_encode_request": [
        "string xmlrpc_encode_request(string method, mixed params [, array output_options])",
        "Generates XML for a method request"
    ],
    "xmlrpc_get_type": [
        "string xmlrpc_get_type(mixed value)",
        "Gets xmlrpc type for a PHP value. Especially useful for base64 and datetime strings"
    ],
    "xmlrpc_is_fault": [
        "bool xmlrpc_is_fault(array)",
        "Determines if an array value represents an XMLRPC fault."
    ],
    "xmlrpc_parse_method_descriptions": [
        "array xmlrpc_parse_method_descriptions(string xml)",
        "Decodes XML into a list of method descriptions"
    ],
    "xmlrpc_server_add_introspection_data": [
        "int xmlrpc_server_add_introspection_data(resource server, array desc)",
        "Adds introspection documentation"
    ],
    "xmlrpc_server_call_method": [
        "mixed xmlrpc_server_call_method(resource server, string xml, mixed user_data [, array output_options])",
        "Parses XML requests and call methods"
    ],
    "xmlrpc_server_create": [
        "resource xmlrpc_server_create()",
        "Creates an xmlrpc server"
    ],
    "xmlrpc_server_destroy": [
        "int xmlrpc_server_destroy(resource server)",
        "Destroys server resources"
    ],
    "xmlrpc_server_register_introspection_callback": [
        "bool xmlrpc_server_register_introspection_callback(resource server, string function)",
        "Register a PHP function to generate documentation"
    ],
    "xmlrpc_server_register_method": [
        "bool xmlrpc_server_register_method(resource server, string method_name, string function)",
        "Register a PHP function to handle method matching method_name"
    ],
    "xmlrpc_set_type": [
        "bool xmlrpc_set_type(string value, string type)",
        "Sets xmlrpc type, base64 or datetime, for a PHP string value"
    ],
    "xmlwriter_end_attribute": [
        "bool xmlwriter_end_attribute(resource xmlwriter)",
        "End attribute - returns FALSE on error"
    ],
    "xmlwriter_end_cdata": [
        "bool xmlwriter_end_cdata(resource xmlwriter)",
        "End current CDATA - returns FALSE on error"
    ],
    "xmlwriter_end_comment": [
        "bool xmlwriter_end_comment(resource xmlwriter)",
        "Create end comment - returns FALSE on error"
    ],
    "xmlwriter_end_document": [
        "bool xmlwriter_end_document(resource xmlwriter)",
        "End current document - returns FALSE on error"
    ],
    "xmlwriter_end_dtd": [
        "bool xmlwriter_end_dtd(resource xmlwriter)",
        "End current DTD - returns FALSE on error"
    ],
    "xmlwriter_end_dtd_attlist": [
        "bool xmlwriter_end_dtd_attlist(resource xmlwriter)",
        "End current DTD AttList - returns FALSE on error"
    ],
    "xmlwriter_end_dtd_element": [
        "bool xmlwriter_end_dtd_element(resource xmlwriter)",
        "End current DTD element - returns FALSE on error"
    ],
    "xmlwriter_end_dtd_entity": [
        "bool xmlwriter_end_dtd_entity(resource xmlwriter)",
        "End current DTD Entity - returns FALSE on error"
    ],
    "xmlwriter_end_element": [
        "bool xmlwriter_end_element(resource xmlwriter)",
        "End current element - returns FALSE on error"
    ],
    "xmlwriter_end_pi": [
        "bool xmlwriter_end_pi(resource xmlwriter)",
        "End current PI - returns FALSE on error"
    ],
    "xmlwriter_flush": [
        "mixed xmlwriter_flush(resource xmlwriter [,bool empty])",
        "Output current buffer"
    ],
    "xmlwriter_full_end_element": [
        "bool xmlwriter_full_end_element(resource xmlwriter)",
        "End current element - returns FALSE on error"
    ],
    "xmlwriter_open_memory": [
        "resource xmlwriter_open_memory()",
        "Create new xmlwriter using memory for string output"
    ],
    "xmlwriter_open_uri": [
        "resource xmlwriter_open_uri(resource xmlwriter, string source)",
        "Create new xmlwriter using source uri for output"
    ],
    "xmlwriter_output_memory": [
        "string xmlwriter_output_memory(resource xmlwriter [,bool flush])",
        "Output current buffer as string"
    ],
    "xmlwriter_set_indent": [
        "bool xmlwriter_set_indent(resource xmlwriter, bool indent)",
        "Toggle indentation on/off - returns FALSE on error"
    ],
    "xmlwriter_set_indent_string": [
        "bool xmlwriter_set_indent_string(resource xmlwriter, string indentString)",
        "Set string used for indenting - returns FALSE on error"
    ],
    "xmlwriter_start_attribute": [
        "bool xmlwriter_start_attribute(resource xmlwriter, string name)",
        "Create start attribute - returns FALSE on error"
    ],
    "xmlwriter_start_attribute_ns": [
        "bool xmlwriter_start_attribute_ns(resource xmlwriter, string prefix, string name, string uri)",
        "Create start namespaced attribute - returns FALSE on error"
    ],
    "xmlwriter_start_cdata": [
        "bool xmlwriter_start_cdata(resource xmlwriter)",
        "Create start CDATA tag - returns FALSE on error"
    ],
    "xmlwriter_start_comment": [
        "bool xmlwriter_start_comment(resource xmlwriter)",
        "Create start comment - returns FALSE on error"
    ],
    "xmlwriter_start_document": [
        "bool xmlwriter_start_document(resource xmlwriter, string version, string encoding, string standalone)",
        "Create document tag - returns FALSE on error"
    ],
    "xmlwriter_start_dtd": [
        "bool xmlwriter_start_dtd(resource xmlwriter, string name, string pubid, string sysid)",
        "Create start DTD tag - returns FALSE on error"
    ],
    "xmlwriter_start_dtd_attlist": [
        "bool xmlwriter_start_dtd_attlist(resource xmlwriter, string name)",
        "Create start DTD AttList - returns FALSE on error"
    ],
    "xmlwriter_start_dtd_element": [
        "bool xmlwriter_start_dtd_element(resource xmlwriter, string name)",
        "Create start DTD element - returns FALSE on error"
    ],
    "xmlwriter_start_dtd_entity": [
        "bool xmlwriter_start_dtd_entity(resource xmlwriter, string name, bool isparam)",
        "Create start DTD Entity - returns FALSE on error"
    ],
    "xmlwriter_start_element": [
        "bool xmlwriter_start_element(resource xmlwriter, string name)",
        "Create start element tag - returns FALSE on error"
    ],
    "xmlwriter_start_element_ns": [
        "bool xmlwriter_start_element_ns(resource xmlwriter, string prefix, string name, string uri)",
        "Create start namespaced element tag - returns FALSE on error"
    ],
    "xmlwriter_start_pi": [
        "bool xmlwriter_start_pi(resource xmlwriter, string target)",
        "Create start PI tag - returns FALSE on error"
    ],
    "xmlwriter_text": [
        "bool xmlwriter_text(resource xmlwriter, string content)",
        "Write text - returns FALSE on error"
    ],
    "xmlwriter_write_attribute": [
        "bool xmlwriter_write_attribute(resource xmlwriter, string name, string content)",
        "Write full attribute - returns FALSE on error"
    ],
    "xmlwriter_write_attribute_ns": [
        "bool xmlwriter_write_attribute_ns(resource xmlwriter, string prefix, string name, string uri, string content)",
        "Write full namespaced attribute - returns FALSE on error"
    ],
    "xmlwriter_write_cdata": [
        "bool xmlwriter_write_cdata(resource xmlwriter, string content)",
        "Write full CDATA tag - returns FALSE on error"
    ],
    "xmlwriter_write_comment": [
        "bool xmlwriter_write_comment(resource xmlwriter, string content)",
        "Write full comment tag - returns FALSE on error"
    ],
    "xmlwriter_write_dtd": [
        "bool xmlwriter_write_dtd(resource xmlwriter, string name, string pubid, string sysid, string subset)",
        "Write full DTD tag - returns FALSE on error"
    ],
    "xmlwriter_write_dtd_attlist": [
        "bool xmlwriter_write_dtd_attlist(resource xmlwriter, string name, string content)",
        "Write full DTD AttList tag - returns FALSE on error"
    ],
    "xmlwriter_write_dtd_element": [
        "bool xmlwriter_write_dtd_element(resource xmlwriter, string name, string content)",
        "Write full DTD element tag - returns FALSE on error"
    ],
    "xmlwriter_write_dtd_entity": [
        "bool xmlwriter_write_dtd_entity(resource xmlwriter, string name, string content [, int pe [, string pubid [, string sysid [, string ndataid]]]])",
        "Write full DTD Entity tag - returns FALSE on error"
    ],
    "xmlwriter_write_element": [
        "bool xmlwriter_write_element(resource xmlwriter, string name[, string content])",
        "Write full element tag - returns FALSE on error"
    ],
    "xmlwriter_write_element_ns": [
        "bool xmlwriter_write_element_ns(resource xmlwriter, string prefix, string name, string uri[, string content])",
        "Write full namespaced element tag - returns FALSE on error"
    ],
    "xmlwriter_write_pi": [
        "bool xmlwriter_write_pi(resource xmlwriter, string target, string content)",
        "Write full PI tag - returns FALSE on error"
    ],
    "xmlwriter_write_raw": [
        "bool xmlwriter_write_raw(resource xmlwriter, string content)",
        "Write text - returns FALSE on error"
    ],
    "xsl_xsltprocessor_get_parameter": [
        "string xsl_xsltprocessor_get_parameter(string namespace, string name)",
        ""
    ],
    "xsl_xsltprocessor_has_exslt_support": [
        "bool xsl_xsltprocessor_has_exslt_support()",
        ""
    ],
    "xsl_xsltprocessor_import_stylesheet": [
        "void xsl_xsltprocessor_import_stylesheet(domdocument doc)",
        ""
    ],
    "xsl_xsltprocessor_register_php_functions": [
        "void xsl_xsltprocessor_register_php_functions([mixed $restrict])",
        ""
    ],
    "xsl_xsltprocessor_remove_parameter": [
        "bool xsl_xsltprocessor_remove_parameter(string namespace, string name)",
        ""
    ],
    "xsl_xsltprocessor_set_parameter": [
        "bool xsl_xsltprocessor_set_parameter(string namespace, mixed name [, string value])",
        ""
    ],
    "xsl_xsltprocessor_set_profiling": [
        "bool xsl_xsltprocessor_set_profiling(string filename)",
        ""
    ],
    "xsl_xsltprocessor_transform_to_doc": [
        "domdocument xsl_xsltprocessor_transform_to_doc(domnode doc)",
        ""
    ],
    "xsl_xsltprocessor_transform_to_uri": [
        "int xsl_xsltprocessor_transform_to_uri(domdocument doc, string uri)",
        ""
    ],
    "xsl_xsltprocessor_transform_to_xml": [
        "string xsl_xsltprocessor_transform_to_xml(domdocument doc)",
        ""
    ],
    "zend_logo_guid": [
        "string zend_logo_guid()",
        "Return the special ID used to request the Zend logo in phpinfo screens"
    ],
    "zend_version": [
        "string zend_version()",
        "Get the version of the Zend Engine"
    ],
    "zip_close": [
        "void zip_close(resource zip)",
        "Close a Zip archive"
    ],
    "zip_entry_close": [
        "void zip_entry_close(resource zip_ent)",
        "Close a zip entry"
    ],
    "zip_entry_compressedsize": [
        "int zip_entry_compressedsize(resource zip_entry)",
        "Return the compressed size of a ZZip entry"
    ],
    "zip_entry_compressionmethod": [
        "string zip_entry_compressionmethod(resource zip_entry)",
        "Return a string containing the compression method used on a particular entry"
    ],
    "zip_entry_filesize": [
        "int zip_entry_filesize(resource zip_entry)",
        "Return the actual filesize of a ZZip entry"
    ],
    "zip_entry_name": [
        "string zip_entry_name(resource zip_entry)",
        "Return the name given a ZZip entry"
    ],
    "zip_entry_open": [
        "bool zip_entry_open(resource zip_dp, resource zip_entry [, string mode])",
        "Open a Zip File, pointed by the resource entry"
    ],
    "zip_entry_read": [
        "mixed zip_entry_read(resource zip_entry [, int len])",
        "Read from an open directory entry"
    ],
    "zip_open": [
        "resource zip_open(string filename)",
        "Create new zip using source uri for output"
    ],
    "zip_read": [
        "resource zip_read(resource zip)",
        "Returns the next file in the archive"
    ],
    "zlib_get_coding_type": [
        "string zlib_get_coding_type()",
        "Returns the coding type used for output compression"
    ]
};

var variableMap = {
    "$_COOKIE": {
        type: "array"
    },
    "$_ENV": {
        type: "array"
    },
    "$_FILES": {
        type: "array"
    },
    "$_GET": {
        type: "array"
    },
    "$_POST": {
        type: "array"
    },
    "$_REQUEST": {
        type: "array"
    },
    "$_SERVER": {
        type: "array",
        value: {
            "DOCUMENT_ROOT":  1,
            "GATEWAY_INTERFACE":  1,
            "HTTP_ACCEPT":  1,
            "HTTP_ACCEPT_CHARSET":  1,
            "HTTP_ACCEPT_ENCODING":  1 ,
            "HTTP_ACCEPT_LANGUAGE":  1,
            "HTTP_CONNECTION":  1,
            "HTTP_HOST":  1,
            "HTTP_REFERER":  1,
            "HTTP_USER_AGENT":  1,
            "PATH_TRANSLATED":  1,
            "PHP_SELF":  1,
            "QUERY_STRING":  1,
            "REMOTE_ADDR":  1,
            "REMOTE_PORT":  1,
            "REQUEST_METHOD":  1,
            "REQUEST_URI":  1,
            "SCRIPT_FILENAME":  1,
            "SCRIPT_NAME":  1,
            "SERVER_ADMIN":  1,
            "SERVER_NAME":  1,
            "SERVER_PORT":  1,
            "SERVER_PROTOCOL":  1,
            "SERVER_SIGNATURE":  1,
            "SERVER_SOFTWARE":  1,
            "argv":  1,
            "argc":  1
        }
    },
    "$_SESSION": {
        type: "array"
    },
    "$GLOBALS": {
        type: "array"
    },
    '$argv': {
        type: "array"
    },
    '$argc': {
        type: "int"
    }
};

function is(token, type) {
    return token.type.lastIndexOf(type) > -1;
}

var PhpCompletions = function() {

};

(function() {

    this.getCompletions = function(state, session, pos, prefix) {
        var token = session.getTokenAt(pos.row, pos.column);

        if (!token)
            return [];
        
        if (token.type==='support.php_tag' && token.value==='<?')
            return this.getTagCompletions(state, session, pos, prefix);

        // php function
        if (token.type==='identifier') {
            if (token.index > 0) {
                var prevToken = session.getTokenAt(pos.row, token.start);
                if (prevToken.type==='support.php_tag') {
                    return this.getTagCompletions(state, session, pos, prefix);
                }
            }
            return this.getFunctionCompletions(state, session, pos, prefix);
        }

        // php variable
        if (is(token, "variable"))
            return this.getVariableCompletions(state, session, pos, prefix);

        // php array key
        var line = session.getLine(pos.row).substr(0, pos.column);
        if (token.type==='string' && /(\$[\w]*)\[["']([^'"]*)$/i.test(line))
            return this.getArrayKeyCompletions(state, session, pos, prefix);

        return [];
    };
    
    this.getTagCompletions = function(state, session, pos, prefix) {
        return [{
            caption: 'php',
            value: 'php',
            meta: "php tag",
            score: 1000000
        }, {
            caption: '=',
            value: '=',
            meta: "php tag",
            score: 1000000
        }];
    };

    this.getFunctionCompletions = function(state, session, pos, prefix) {
        var functions = Object.keys(functionMap);
        return functions.map(function(func){
            return {
                caption: func,
                snippet: func + '($0)',
                meta: "php function",
                score: 1000000,
                docHTML: functionMap[func][1]
            };
        });
    };

    this.getVariableCompletions = function(state, session, pos, prefix) {
        var variables = Object.keys(variableMap);
        return variables.map(function(variable){
            return {
                caption: variable,
                value: variable,
                meta: "php variable",
                score: 1000000
            };
        });
    };

    this.getArrayKeyCompletions = function(state, session, pos, prefix) {
        var line = session.getLine(pos.row).substr(0, pos.column);
        var variable = line.match(/(\$[\w]*)\[["']([^'"]*)$/i)[1];

        if (!variableMap[variable]) {
            return [];
        }

        var keys = [];
        if (variableMap[variable].type==='array' && variableMap[variable].value)
            keys = Object.keys(variableMap[variable].value);

        return keys.map(function(key) {
            return {
                caption: key,
                value: key,
                meta: "php array key",
                score: 1000000
            };
        });
    };

}).call(PhpCompletions.prototype);

exports.PhpCompletions = PhpCompletions;
});
