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

exports.isDark = true;
exports.cssClass = "ace-vibrant-ink";
exports.cssText = "\
.ace-vibrant-ink .ace_editor {\
  border: 2px solid rgb(159, 159, 159);\
}\
\
.ace-vibrant-ink .ace_editor.ace_focus {\
  border: 2px solid #327fbd;\
}\
\
.ace-vibrant-ink .ace_gutter {\
  background: #e8e8e8;\
  color: #333;\
}\
\
.ace-vibrant-ink .ace_print_margin {\
  width: 1px;\
  background: #e8e8e8;\
}\
\
.ace-vibrant-ink .ace_scroller {\
  background-color: #0F0F0F;\
}\
\
.ace-vibrant-ink .ace_text-layer {\
  cursor: text;\
  color: #FFFFFF;\
}\
\
.ace-vibrant-ink .ace_cursor {\
  border-left: 2px solid #FFFFFF;\
}\
\
.ace-vibrant-ink .ace_cursor.ace_overwrite {\
  border-left: 0px;\
  border-bottom: 1px solid #FFFFFF;\
}\
\
.ace-vibrant-ink .ace_marker-layer .ace_selection {\
  background: #6699CC;\
}\
\
.ace-vibrant-ink.multiselect .ace_selection.start {\
  box-shadow: 0 0 3px 0px #0F0F0F;\
  border-radius: 2px;\
}\
\
.ace-vibrant-ink .ace_marker-layer .ace_step {\
  background: rgb(198, 219, 174);\
}\
\
.ace-vibrant-ink .ace_marker-layer .ace_bracket {\
  margin: -1px 0 0 -1px;\
  border: 1px solid #404040;\
}\
\
.ace-vibrant-ink .ace_marker-layer .ace_active_line {\
  background: #333333;\
}\
\
.ace-vibrant-ink .ace_marker-layer .ace_selected_word {\
  border: 1px solid #6699CC;\
}\
\
.ace-vibrant-ink .ace_invisible {\
  color: #404040;\
}\
\
.ace-vibrant-ink .ace_keyword, .ace-vibrant-ink .ace_meta {\
  color:#FF6600;\
}\
\
.ace-vibrant-ink .ace_constant, .ace-vibrant-ink .ace_constant.ace_other {\
  color:#339999;\
}\
\
.ace-vibrant-ink .ace_constant.ace_character,  {\
  color:#339999;\
}\
\
.ace-vibrant-ink .ace_constant.ace_character.ace_escape,  {\
  color:#339999;\
}\
\
.ace-vibrant-ink .ace_constant.ace_numeric {\
  color:#99CC99;\
}\
\
.ace-vibrant-ink .ace_invalid {\
  color:#CCFF33;\
background-color:#000000;\
}\
\
.ace-vibrant-ink .ace_invalid.ace_deprecated {\
  color:#CCFF33;\
background-color:#000000;\
}\
\
.ace-vibrant-ink .ace_fold {\
    background-color: #FFCC00;\
    border-color: #FFFFFF;\
}\
\
.ace-vibrant-ink .ace_support.ace_function {\
  color:#FFCC00;\
}\
\
.ace-vibrant-ink .ace_variable {\
  color:#FFCC00;\
}\
\
.ace-vibrant-ink .ace_variable.ace_parameter {\
  font-style:italic;\
}\
\
.ace-vibrant-ink .ace_string {\
  color:#66FF00;\
}\
\
.ace-vibrant-ink .ace_string.ace_regexp {\
  color:#44B4CC;\
}\
\
.ace-vibrant-ink .ace_comment {\
  color:#9933CC;\
}\
\
.ace-vibrant-ink .ace_entity.ace_other.ace_attribute-name {\
  font-style:italic;\
color:#99CC99;\
}\
\
.ace-vibrant-ink .ace_entity.ace_name.ace_function {\
  color:#FFCC00;\
}\
\
.ace-vibrant-ink .ace_markup.ace_underline {\
    text-decoration:underline;\
}";

    var dom = require("../lib/dom");
    dom.importCssString(exports.cssText, exports.cssClass);
});
