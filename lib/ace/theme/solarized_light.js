/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Ajax.org Code Editor (ACE).
 *
 * The Initial Developer of the Original Code is
 * Ajax.org B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Fabian Jakobs <fabian AT ajax DOT org>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {

    var dom = require("pilot/dom");

    var cssText = ".ace-solarized-light .ace_editor {\
  border: 2px solid rgb(159, 159, 159);\
}\
\
.ace-solarized-light .ace_editor.ace_focus {\
  border: 2px solid #327fbd;\
}\
\
.ace-solarized-light .ace_gutter {\
  width: 50px;\
  background: #e8e8e8;\
  color: #333;\
  overflow : hidden;\
}\
\
.ace-solarized-light .ace_gutter-layer {\
  width: 100%;\
  text-align: right;\
}\
\
.ace-solarized-light .ace_gutter-layer .ace_gutter-cell {\
  padding-right: 6px;\
}\
\
.ace-solarized-light .ace_print_margin {\
  width: 1px;\
  background: #e8e8e8;\
}\
\
.ace-solarized-light .ace_scroller {\
  background-color: #FDF6E3;\
}\
\
.ace-solarized-light .ace_text-layer {\
  cursor: text;\
  color: #586E75;\
}\
\
.ace-solarized-light .ace_cursor {\
  border-left: 2px solid #000000;\
}\
\
.ace-solarized-light .ace_cursor.ace_overwrite {\
  border-left: 0px;\
  border-bottom: 1px solid #000000;\
}\
 \
.ace-solarized-light .ace_marker-layer .ace_selection {\
  background: #073642;\
}\
\
.ace-solarized-light .ace_marker-layer .ace_step {\
  background: rgb(198, 219, 174);\
}\
\
.ace-solarized-light .ace_marker-layer .ace_bracket {\
  margin: -1px 0 0 -1px;\
  border: 1px solid rgba(147, 161, 161, 0.50);\
}\
\
.ace-solarized-light .ace_marker-layer .ace_active_line {\
  background: #EEE8D5;\
}\
\
       \
.ace-solarized-light .ace_invisible {\
  color: rgba(147, 161, 161, 0.50);\
}\
\
.ace-solarized-light .ace_keyword {\
  color:#859900;\
}\
\
.ace-solarized-light .ace_keyword.ace_operator {\
  \
}\
\
.ace-solarized-light .ace_constant {\
  \
}\
\
.ace-solarized-light .ace_constant.ace_language {\
  color:#B58900;\
}\
\
.ace-solarized-light .ace_constant.ace_library {\
  \
}\
\
.ace-solarized-light .ace_constant.ace_numeric {\
  color:#D33682;\
}\
\
.ace-solarized-light .ace_invalid {\
  \
}\
\
.ace-solarized-light .ace_invalid.ace_illegal {\
  \
}\
\
.ace-solarized-light .ace_invalid.ace_deprecated {\
  \
}\
\
.ace-solarized-light .ace_support {\
  \
}\
\
.ace-solarized-light .ace_support.ace_function {\
  color:#268BD2;\
}\
\
.ace-solarized-light .ace_function.ace_buildin {\
  \
}\
\
.ace-solarized-light .ace_string {\
  color:#2AA198;\
}\
\
.ace-solarized-light .ace_string.ace_regexp {\
  color:#D30102;\
}\
\
.ace-solarized-light .ace_comment {\
  color:#93A1A1;\
}\
\
.ace-solarized-light .ace_comment.ace_doc {\
  \
}\
\
.ace-solarized-light .ace_comment.ace_doc.ace_tag {\
  \
}\
\
.ace-solarized-light .ace_variable {\
  \
}\
\
.ace-solarized-light .ace_variable.ace_language {\
  color:#268BD2;\
}\
\
.ace-solarized-light .ace_xml_pe {\
  \
}\
\
.ace-solarized-light .ace_collab.ace_user1 {\
     \
}";

    // import CSS once
    dom.importCssString(cssText);

    exports.cssClass = "ace-solarized-light";
});