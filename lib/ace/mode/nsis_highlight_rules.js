/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2012, Ajax.org B.V.
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
 * ***** END LICENSE BLOCK ***** */

define(function(require, exports, module) {
"use strict";

var oop = require("../lib/oop");
var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

var NSISHighlightRules = function() {
    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used

    this.$rules = {
        start: [{
            token: "keyword.compiler.nsis",
            regex: /(?:\b|^\s*)\!(?:include|addincludedir|addplugindir|appendfile|cd|delfile|echo|error|execute|packhdr|finalize|getdllversion|system|tempfile|warning|verbose|define|undef|insertmacro|macro|macroend|makensis|searchparse|searchreplace)\b/,
            caseInsensitive: true
        }, {
            token: "keyword.command.nsis",
            regex: /(?:\b|^\s*)(?:Abort|AddBrandingImage|AddSize|AllowRootDirInstall|AllowSkipFiles|AutoCloseWindow|BGFont|BGGradient|BrandingText|BringToFront|Call|CallInstDLL|Caption|ChangeUI|CheckBitmap|ClearErrors|CompletedText|ComponentText|CopyFiles|CRCCheck|CreateDirectory|CreateFont|CreateShortCut|Delete|DeleteINISec|DeleteINIStr|DeleteRegKey|DeleteRegValue|DetailPrint|DetailsButtonText|DirText|DirVar|DirVerify|EnableWindow|EnumRegKey|EnumRegValue|Exch|Exec|ExecShell|ExecWait|ExpandEnvStrings|File|FileBufSize|FileClose|FileErrorText|FileOpen|FileRead|FileReadByte|FileReadUTF16LE|FileReadWord|FileWriteUTF16LE|FileSeek|FileWrite|FileWriteByte|FileWriteWord|FindClose|FindFirst|FindNext|FindWindow|FlushINI|GetCurInstType|GetCurrentAddress|GetDlgItem|GetDLLVersion|GetDLLVersionLocal|GetErrorLevel|GetFileTime|GetFileTimeLocal|GetFullPathName|GetFunctionAddress|GetInstDirError|GetLabelAddress|GetTempFileName|Goto|HideWindow|Icon|IfAbort|IfErrors|IfFileExists|IfRebootFlag|IfSilent|InitPluginsDir|InstallButtonText|InstallColors|InstallDir|InstallDirRegKey|InstProgressFlags|InstType|InstTypeGetText|InstTypeSetText|IntCmp|IntCmpU|IntFmt|IntOp|IsWindow|LangString|LicenseBkColor|LicenseData|LicenseForceSelection|LicenseLangString|LicenseText|LoadLanguageFile|LockWindow|LogSet|LogText|ManifestDPIAware|ManifestSupportedOS|MessageBox|MiscButtonText|Name|Nop|OutFile|Page|PageCallbacks|Pop|Push|Quit|ReadEnvStr|ReadINIStr|ReadRegDWORD|ReadRegStr|Reboot|RegDLL|Rename|RequestExecutionLevel|ReserveFile|Return|RMDir|SearchPath|SectionGetFlags|SectionGetInstTypes|SectionGetSize|SectionGetText|SectionIn|SectionSetFlags|SectionSetInstTypes|SectionSetSize|SectionSetText|SendMessage|SetAutoClose|SetBrandingImage|SetCompress|SetCompressor|SetCompressorDictSize|SetCtlColors|SetCurInstType|SetDatablockOptimize|SetDateSave|SetDetailsPrint|SetDetailsView|SetErrorLevel|SetErrors|SetFileAttributes|SetFont|SetOutPath|SetOverwrite|SetPluginUnload|SetRebootFlag|SetRegView|SetShellVarContext|SetSilent|ShowInstDetails|ShowUninstDetails|ShowWindow|SilentInstall|SilentUnInstall|Sleep|SpaceTexts|StrCmp|StrCmpS|StrCpy|StrLen|SubCaption|Unicode|UninstallButtonText|UninstallCaption|UninstallIcon|UninstallSubCaption|UninstallText|UninstPage|UnRegDLL|Var|VIAddVersionKey|VIFileVersion|VIProductVersion|WindowIcon|WriteINIStr|WriteRegBin|WriteRegDWORD|WriteRegExpandStr|WriteRegStr|WriteUninstaller|XPStyle)\b/,
            caseInsensitive: true
        }, {
            token: "keyword.control.nsis",
            regex: /(?:\b|^\s*)\!(?:ifdef|ifndef|if|ifmacrodef|ifmacrondef|else|endif)\b/,
            caseInsensitive: true
        }, {
            token: "keyword.plugin.nsis",
            regex: /(?:\b|^\s*)\w+\:\:\w+/,
            caseInsensitive: true
        }, {
            token: "keyword.operator.comparison.nsis",
            regex: /[!<>]?=|<>|<|>/
        }, {
            token: "support.function.nsis",
            regex: /(?:\b|^\s*)(?:Function|FunctionEnd|Section|SectionEnd|SectionGroup|SectionGroupEnd|SubSection|SubSectionEnd|PageEx|PageExEnd)\b/,
            caseInsensitive: true
        }, {
            token: "support.library.nsis",
            regex: /\${[\w]+}/
        }, {
            token: "constant.nsis",
            regex: /(?:\b|^\s*)(?:ARCHIVE|FILE_ATTRIBUTE_ARCHIVE|FILE_ATTRIBUTE_HIDDEN|FILE_ATTRIBUTE_NORMAL|FILE_ATTRIBUTE_OFFLINE|FILE_ATTRIBUTE_READONLY|FILE_ATTRIBUTE_SYSTEM|FILE_ATTRIBUTE_TEMPORARY|HIDDEN|HKCC|HKCR|HKCU|HKDD|HKEY_CLASSES_ROOT|HKEY_CURRENT_CONFIG|HKEY_CURRENT_USER|HKEY_DYN_DATA|HKEY_LOCAL_MACHINE|HKEY_PERFORMANCE_DATA|HKEY_USERS|HKLM|HKPD|HKU|IDABORT|IDCANCEL|IDD_DIR|IDD_INST|IDD_INSTFILES|IDD_LICENSE|IDD_SELCOM|IDD_UNINST|IDD_VERIFY|IDIGNORE|IDNO|IDOK|IDRETRY|IDYES|MB_ABORTRETRYIGNORE|MB_DEFBUTTON1|MB_DEFBUTTON2|MB_DEFBUTTON3|MB_DEFBUTTON4|MB_ICONEXCLAMATION|MB_ICONINFORMATION|MB_ICONQUESTION|MB_ICONSTOP|MB_OK|MB_OKCANCEL|MB_RETRYCANCEL|MB_RIGHT|MB_RTLREADING|MB_SETFOREGROUND|MB_TOPMOST|MB_USERICON|MB_YESNO|MB_YESNOCANCEL|NORMAL|OFFLINE|READONLY|SHCTX|SHELL_CONTEXT|SW_HIDE|SW_SHOWDEFAULT|SW_SHOWMAXIMIZED|SW_SHOWMINIMIZED|SW_SHOWNORMAL|SYSTEM|TEMPORARY)\b/,
            caseInsensitive: true
        }, {
            token: "constant.library.nsis",
            regex: /\${(?:AtLeastServicePack|AtLeastWin7|AtLeastWin8|AtLeastWin10|AtLeastWin95|AtLeastWin98|AtLeastWin2000|AtLeastWin2003|AtLeastWin2008|AtLeastWin2008R2|AtLeastWinME|AtLeastWinNT4|AtLeastWinVista|AtLeastWinXP|AtMostServicePack|AtMostWin7|AtMostWin8|AtMostWin10|AtMostWin95|AtMostWin98|AtMostWin2000|AtMostWin2003|AtMostWin2008|AtMostWin2008R2|AtMostWinME|AtMostWinNT4|AtMostWinVista|AtMostWinXP|IsNT|IsServer|IsServicePack|IsWin7|IsWin8|IsWin10|IsWin95|IsWin98|IsWin2000|IsWin2003|IsWin2008|IsWin2008R2|IsWinME|IsWinNT4|IsWinVista|IsWinXP)}/
        }, {
            token: "constant.language.boolean.true.nsis",
            regex: /\b(?:true|on)\b/
        }, {
            token: "constant.language.boolean.false.nsis",
            regex: /\b(?:false|off)\b/
        }, {
            token: "constant.language.option.nsis",
            regex: /(?:\b|^\s*)(?:(?:un\.)?components|(?:un\.)?custom|(?:un\.)?directory|(?:un\.)?instfiles|(?:un\.)?license|uninstConfirm|admin|all|auto|both|bottom|bzip2|current|force|hide|highest|ifdiff|ifnewer|lastused|leave|left|listonly|lzma|nevershow|none|normal|notset|right|show|silent|silentlog|textonly|top|try|user|Win10|Win7|Win8|WinVista|zlib)\b/,
            caseInsensitive: true
        }, {
            token: "constant.language.slash-option.nsis",
            regex: /\/(?:a|BRANDING|CENTER|COMPONENTSONLYONCUSTOM|CUSTOMSTRING\=|date|e|ENABLECANCEL|FILESONLY|file|FINAL|GLOBAL|gray|ifempty|ifndef|ignorecase|IMGID\=|ITALIC|LANG\=|NOCUSTOM|noerrors|NONFATAL|nonfatal|oname\=|o|REBOOTOK|redef|RESIZETOFIT|r|SHORT|SILENT|SOLID|STRIKE|TRIM|UNDERLINE|utcdate|windows|x)\b/,
            caseInsensitive: true
        }, {
            token: "constant.numeric.nsis",
            regex: /\b(?:0(?:x|X)[0-9a-fA-F]+|[0-9]+(?:\.[0-9]+)?)\b/
        }, {
            token: "entity.name.function.nsis",
            regex: /\${[\w]+}/
        }, {
            token: "storage.type.function.nsis",
            regex: /\$[\w]+/
        }, {
            token: "punctuation.definition.string.begin.nsis",
            regex: /`/,
            push: [{
                token: "punctuation.definition.string.end.nsis",
                regex: /`/,
                next: "pop"
            }, {
                token: "constant.character.escape.nsis",
                regex: /\$\\./
            }, {
                defaultToken: "string.quoted.back.nsis"
            }]
        }, {
            token: "punctuation.definition.string.begin.nsis",
            regex: /"/,
            push: [{
                token: "punctuation.definition.string.end.nsis",
                regex: /"/,
                next: "pop"
            }, {
                token: "constant.character.escape.nsis",
                regex: /\$\\./
            }, {
                defaultToken: "string.quoted.double.nsis"
            }]
        }, {
            token: "punctuation.definition.string.begin.nsis",
            regex: /'/,
            push: [{
                token: "punctuation.definition.string.end.nsis",
                regex: /'/,
                next: "pop"
            }, {
                token: "constant.character.escape.nsis",
                regex: /\$\\./
            }, {
                defaultToken: "string.quoted.single.nsis"
            }]
        }, {
            token: [
                "punctuation.definition.comment.nsis",
                "comment.line.nsis"
            ],
            regex: /(;|#)(.*$)/
        }, {
            token: "punctuation.definition.comment.nsis",
            regex: /\/\*/,
            push: [{
                token: "punctuation.definition.comment.nsis",
                regex: /\*\//,
                next: "pop"
            }, {
                defaultToken: "comment.block.nsis"
            }]
        }, {
            token: "text",
            regex: /(?:\!include|\!insertmacro)\b/
        }]
    };
    
    this.normalizeRules();
};

NSISHighlightRules.metaData = {
    comment: "\n\ttodo: - highlight functions\n\t",
    fileTypes: ["nsi", "nsh"],
    name: "NSIS",
    scopeName: "source.nsis"
};


oop.inherits(NSISHighlightRules, TextHighlightRules);

exports.NSISHighlightRules = NSISHighlightRules;
});