/*
styles = []
for (var i = 1; i < 16; i++) {
    styles.push(".ace_br" + i + "{" + (
        ["top-left", "top-right", "bottom-right", "bottom-left"]
    ).map(function(x, j) {
        return i & (1<<j) ? "border-" + x + "-radius: 3px;" : "" 
    }).filter(Boolean).join(" ") + "}")
}
styles.join("\\n")
*/
module.exports = `
.ace_br1 {border-top-left-radius    : 3px;}
.ace_br2 {border-top-right-radius   : 3px;}
.ace_br3 {border-top-left-radius    : 3px; border-top-right-radius:    3px;}
.ace_br4 {border-bottom-right-radius: 3px;}
.ace_br5 {border-top-left-radius    : 3px; border-bottom-right-radius: 3px;}
.ace_br6 {border-top-right-radius   : 3px; border-bottom-right-radius: 3px;}
.ace_br7 {border-top-left-radius    : 3px; border-top-right-radius:    3px; border-bottom-right-radius: 3px;}
.ace_br8 {border-bottom-left-radius : 3px;}
.ace_br9 {border-top-left-radius    : 3px; border-bottom-left-radius:  3px;}
.ace_br10{border-top-right-radius   : 3px; border-bottom-left-radius:  3px;}
.ace_br11{border-top-left-radius    : 3px; border-top-right-radius:    3px; border-bottom-left-radius:  3px;}
.ace_br12{border-bottom-right-radius: 3px; border-bottom-left-radius:  3px;}
.ace_br13{border-top-left-radius    : 3px; border-bottom-right-radius: 3px; border-bottom-left-radius:  3px;}
.ace_br14{border-top-right-radius   : 3px; border-bottom-right-radius: 3px; border-bottom-left-radius:  3px;}
.ace_br15{border-top-left-radius    : 3px; border-top-right-radius:    3px; border-bottom-right-radius: 3px; border-bottom-left-radius: 3px;}


.ace_editor {
    position: relative;
    overflow: hidden;
    padding: 0;
    font: 12px/normal 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'Source Code Pro', 'source-code-pro', monospace;
    direction: ltr;
    text-align: left;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    forced-color-adjust: none;
}

.ace_scroller {
    position: absolute;
    overflow: hidden;
    top: 0;
    bottom: 0;
    background-color: inherit;
    -ms-user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    cursor: text;
}

.ace_content {
    position: absolute;
    box-sizing: border-box;
    min-width: 100%;
    contain: style size layout;
    font-variant-ligatures: no-common-ligatures;
}

.ace_keyboard-focus:focus {
    box-shadow: inset 0 0 0 2px #5E9ED6;
    outline: none;
}

.ace_dragging .ace_scroller:before{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    content: '';
    background: rgba(250, 250, 250, 0.01);
    z-index: 1000;
}
.ace_dragging.ace_dark .ace_scroller:before{
    background: rgba(0, 0, 0, 0.01);
}

.ace_gutter {
    position: absolute;
    overflow : hidden;
    width: auto;
    top: 0;
    bottom: 0;
    left: 0;
    cursor: default;
    z-index: 4;
    -ms-user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    contain: style size layout;
}

.ace_gutter-active-line {
    position: absolute;
    left: 0;
    right: 0;
}

.ace_scroller.ace_scroll-left:after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    box-shadow: 17px 0 16px -16px rgba(0, 0, 0, 0.4) inset;
    pointer-events: none;
}

.ace_gutter-cell, .ace_gutter-cell_svg-icons {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    padding-left: 19px;
    padding-right: 6px;
    background-repeat: no-repeat;
}

.ace_gutter-cell_svg-icons .ace_gutter_annotation {
    margin-left: -14px;
    float: left;
}

.ace_gutter-cell .ace_gutter_annotation {
    margin-left: -19px;
    float: left;
}

.ace_gutter-cell.ace_error, .ace_icon.ace_error, .ace_icon.ace_error_fold, .ace_gutter-cell.ace_security, .ace_icon.ace_security, .ace_icon.ace_security_fold {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABOFBMVEX/////////QRswFAb/Ui4wFAYwFAYwFAaWGAfDRymzOSH/PxswFAb/SiUwFAYwFAbUPRvjQiDllog5HhHdRybsTi3/Tyv9Tir+Syj/UC3////XurebMBIwFAb/RSHbPx/gUzfdwL3kzMivKBAwFAbbvbnhPx66NhowFAYwFAaZJg8wFAaxKBDZurf/RB6mMxb/SCMwFAYwFAbxQB3+RB4wFAb/Qhy4Oh+4QifbNRcwFAYwFAYwFAb/QRzdNhgwFAYwFAbav7v/Uy7oaE68MBK5LxLewr/r2NXewLswFAaxJw4wFAbkPRy2PyYwFAaxKhLm1tMwFAazPiQwFAaUGAb/QBrfOx3bvrv/VC/maE4wFAbRPBq6MRO8Qynew8Dp2tjfwb0wFAbx6eju5+by6uns4uH9/f36+vr/GkHjAAAAYnRSTlMAGt+64rnWu/bo8eAA4InH3+DwoN7j4eLi4xP99Nfg4+b+/u9B/eDs1MD1mO7+4PHg2MXa347g7vDizMLN4eG+Pv7i5evs/v79yu7S3/DV7/498Yv24eH+4ufQ3Ozu/v7+y13sRqwAAADLSURBVHjaZc/XDsFgGIBhtDrshlitmk2IrbHFqL2pvXf/+78DPokj7+Fz9qpU/9UXJIlhmPaTaQ6QPaz0mm+5gwkgovcV6GZzd5JtCQwgsxoHOvJO15kleRLAnMgHFIESUEPmawB9ngmelTtipwwfASilxOLyiV5UVUyVAfbG0cCPHig+GBkzAENHS0AstVF6bacZIOzgLmxsHbt2OecNgJC83JERmePUYq8ARGkJx6XtFsdddBQgZE2nPR6CICZhawjA4Fb/chv+399kfR+MMMDGOQAAAABJRU5ErkJggg==");
    background-repeat: no-repeat;
    background-position: 2px center;
}

.ace_gutter-cell.ace_warning, .ace_icon.ace_warning, .ace_icon.ace_warning_fold {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAmVBMVEX///8AAAD///8AAAAAAABPSzb/5sAAAAB/blH/73z/ulkAAAAAAAD85pkAAAAAAAACAgP/vGz/rkDerGbGrV7/pkQICAf////e0IsAAAD/oED/qTvhrnUAAAD/yHD/njcAAADuv2r/nz//oTj/p064oGf/zHAAAAA9Nir/tFIAAAD/tlTiuWf/tkIAAACynXEAAAAAAAAtIRW7zBpBAAAAM3RSTlMAABR1m7RXO8Ln31Z36zT+neXe5OzooRDfn+TZ4p3h2hTf4t3k3ucyrN1K5+Xaks52Sfs9CXgrAAAAjklEQVR42o3PbQ+CIBQFYEwboPhSYgoYunIqqLn6/z8uYdH8Vmdnu9vz4WwXgN/xTPRD2+sgOcZjsge/whXZgUaYYvT8QnuJaUrjrHUQreGczuEafQCO/SJTufTbroWsPgsllVhq3wJEk2jUSzX3CUEDJC84707djRc5MTAQxoLgupWRwW6UB5fS++NV8AbOZgnsC7BpEAAAAABJRU5ErkJggg==");
    background-repeat: no-repeat;
    background-position: 2px center;
}

.ace_gutter-cell.ace_info, .ace_icon.ace_info, .ace_gutter-cell.ace_hint, .ace_icon.ace_hint {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAAAAAA6mKC9AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAJ0Uk5TAAB2k804AAAAPklEQVQY02NgIB68QuO3tiLznjAwpKTgNyDbMegwisCHZUETUZV0ZqOquBpXj2rtnpSJT1AEnnRmL2OgGgAAIKkRQap2htgAAAAASUVORK5CYII=");
    background-repeat: no-repeat;
    background-position: 2px center;
}

.ace_dark .ace_gutter-cell.ace_info, .ace_dark .ace_icon.ace_info, .ace_dark .ace_gutter-cell.ace_hint, .ace_dark .ace_icon.ace_hint {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAJFBMVEUAAAChoaGAgIAqKiq+vr6tra1ZWVmUlJSbm5s8PDxubm56enrdgzg3AAAAAXRSTlMAQObYZgAAAClJREFUeNpjYMAPdsMYHegyJZFQBlsUlMFVCWUYKkAZMxZAGdxlDMQBAG+TBP4B6RyJAAAAAElFTkSuQmCC");
}

.ace_icon_svg.ace_error {
    -webkit-mask-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAxNiI+CjxnIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlPSJyZWQiIHNoYXBlLXJlbmRlcmluZz0iZ2VvbWV0cmljUHJlY2lzaW9uIj4KPGNpcmNsZSBmaWxsPSJub25lIiBjeD0iOCIgY3k9IjgiIHI9IjciIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPGxpbmUgeDE9IjExIiB5MT0iNSIgeDI9IjUiIHkyPSIxMSIvPgo8bGluZSB4MT0iMTEiIHkxPSIxMSIgeDI9IjUiIHkyPSI1Ii8+CjwvZz4KPC9zdmc+");
    background-color: crimson;
}
.ace_icon_svg.ace_security {
    -webkit-mask-image: url("data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAgMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8ZyBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZT0iZGFya29yYW5nZSIgZmlsbD0ibm9uZSIgc2hhcGUtcmVuZGVyaW5nPSJnZW9tZXRyaWNQcmVjaXNpb24iPgogICAgICAgIDxwYXRoIGNsYXNzPSJzdHJva2UtbGluZWpvaW4tcm91bmQiIGQ9Ik04IDE0LjgzMDdDOCAxNC44MzA3IDIgMTIuOTA0NyAyIDguMDg5OTJWMy4yNjU0OEM1LjMxIDMuMjY1NDggNy45ODk5OSAxLjM0OTE4IDcuOTg5OTkgMS4zNDkxOEM3Ljk4OTk5IDEuMzQ5MTggMTAuNjkgMy4yNjU0OCAxNCAzLjI2NTQ4VjguMDg5OTJDMTQgMTIuOTA0NyA4IDE0LjgzMDcgOCAxNC44MzA3WiIvPgogICAgICAgIDxwYXRoIGQ9Ik0yIDguMDg5OTJWMy4yNjU0OEM1LjMxIDMuMjY1NDggNy45ODk5OSAxLjM0OTE4IDcuOTg5OTkgMS4zNDkxOCIvPgogICAgICAgIDxwYXRoIGQ9Ik0xMy45OSA4LjA4OTkyVjMuMjY1NDhDMTAuNjggMy4yNjU0OCA4IDEuMzQ5MTggOCAxLjM0OTE4Ii8+CiAgICAgICAgPHBhdGggY2xhc3M9InN0cm9rZS1saW5lam9pbi1yb3VuZCIgZD0iTTggNFY5Ii8+CiAgICAgICAgPHBhdGggY2xhc3M9InN0cm9rZS1saW5lam9pbi1yb3VuZCIgZD0iTTggMTBWMTIiLz4KICAgIDwvZz4KPC9zdmc+");
    background-color: crimson;
}
.ace_icon_svg.ace_warning {
    -webkit-mask-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAxNiI+CjxnIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlPSJkYXJrb3JhbmdlIiBzaGFwZS1yZW5kZXJpbmc9Imdlb21ldHJpY1ByZWNpc2lvbiI+Cjxwb2x5Z29uIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGZpbGw9Im5vbmUiIHBvaW50cz0iOCAxIDE1IDE1IDEgMTUgOCAxIi8+CjxyZWN0IHg9IjgiIHk9IjEyIiB3aWR0aD0iMC4wMSIgaGVpZ2h0PSIwLjAxIi8+CjxsaW5lIHgxPSI4IiB5MT0iNiIgeDI9IjgiIHkyPSIxMCIvPgo8L2c+Cjwvc3ZnPg==");
    background-color: darkorange;
}
.ace_icon_svg.ace_info {
    -webkit-mask-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAxNiI+CjxnIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlPSJibHVlIiBzaGFwZS1yZW5kZXJpbmc9Imdlb21ldHJpY1ByZWNpc2lvbiI+CjxjaXJjbGUgZmlsbD0ibm9uZSIgY3g9IjgiIGN5PSI4IiByPSI3IiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjxwb2x5bGluZSBwb2ludHM9IjggMTEgOCA4Ii8+Cjxwb2x5bGluZSBwb2ludHM9IjkgOCA2IDgiLz4KPGxpbmUgeDE9IjEwIiB5MT0iMTEiIHgyPSI2IiB5Mj0iMTEiLz4KPHJlY3QgeD0iOCIgeT0iNSIgd2lkdGg9IjAuMDEiIGhlaWdodD0iMC4wMSIvPgo8L2c+Cjwvc3ZnPg==");
    background-color: royalblue;
}
.ace_icon_svg.ace_hint {
    -webkit-mask-image: url("data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAgMTYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgICA8ZyBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZT0ic2lsdmVyIiBmaWxsPSJub25lIiBzaGFwZS1yZW5kZXJpbmc9Imdlb21ldHJpY1ByZWNpc2lvbiI+CiAgICAgICAgPHBhdGggY2xhc3M9InN0cm9rZS1saW5lam9pbi1yb3VuZCIgZD0iTTYgMTRIMTAiLz4KICAgICAgICA8cGF0aCBkPSJNOCAxMUg5QzkgOS40NzAwMiAxMiA4LjU0MDAyIDEyIDUuNzYwMDJDMTIuMDIgNC40MDAwMiAxMS4zOSAzLjM2MDAyIDEwLjQzIDIuNjcwMDJDOSAxLjY0MDAyIDcuMDAwMDEgMS42NDAwMiA1LjU3MDAxIDIuNjcwMDJDNC42MTAwMSAzLjM2MDAyIDMuOTggNC40MDAwMiA0IDUuNzYwMDJDNCA4LjU0MDAyIDcuMDAwMDEgOS40NzAwMiA3LjAwMDAxIDExSDhaIi8+CiAgICA8L2c+Cjwvc3ZnPg==");
    background-color: silver;
}

.ace_icon_svg.ace_error_fold {
    -webkit-mask-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAxNiIgZmlsbD0ibm9uZSI+CiAgPHBhdGggZD0ibSAxOC45Mjk4NTEsNy44Mjk4MDc2IGMgMC4xNDYzNTMsNi4zMzc0NjA0IC02LjMyMzE0Nyw3Ljc3Nzg0NDQgLTcuNDc3OTEyLDcuNzc3ODQ0NCAtMi4xMDcyNzI2LC0wLjEyODc1IDUuMTE3Njc4LDAuMzU2MjQ5IDUuMDUxNjk4LC03Ljg3MDA2MTggLTAuNjA0NjcyLC04LjAwMzk3MzQ5IC03LjA3NzI3MDYsLTcuNTYzMTE4OSAtNC44NTczLC03LjQzMDM5NTU2IDEuNjA2LC0wLjExNTE0MjI1IDYuODk3NDg1LDEuMjYyNTQ1OTYgNy4yODM1MTQsNy41MjI2MTI5NiB6IiBmaWxsPSJjcmltc29uIiBzdHJva2Utd2lkdGg9IjIiLz4KICA8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0ibSA4LjExNDc1NjIsMi4wNTI5ODI4IGMgMy4zNDkxNjk4LDAgNi4wNjQxMzI4LDIuNjc2ODYyNyA2LjA2NDEzMjgsNS45Nzg5NTMgMCwzLjMwMjExMjIgLTIuNzE0OTYzLDUuOTc4OTIwMiAtNi4wNjQxMzI4LDUuOTc4OTIwMiAtMy4zNDkxNDczLDAgLTYuMDY0MTc3MiwtMi42NzY4MDggLTYuMDY0MTc3MiwtNS45Nzg5MjAyIDAuMDA1MzksLTMuMjk5ODg2MSAyLjcxNzI2NTYsLTUuOTczNjQwOCA2LjA2NDE3NzIsLTUuOTc4OTUzIHogbSAwLC0xLjczNTgyNzE5IGMgLTQuMzIxNDgzNiwwIC03LjgyNDc0MDM4LDMuNDU0MDE4NDkgLTcuODI0NzQwMzgsNy43MTQ3ODAxOSAwLDQuMjYwNzI4MiAzLjUwMzI1Njc4LDcuNzE0NzQ1MiA3LjgyNDc0MDM4LDcuNzE0NzQ1MiA0LjMyMTQ0OTgsMCA3LjgyNDY5OTgsLTMuNDU0MDE3IDcuODI0Njk5OCwtNy43MTQ3NDUyIDAsLTIuMDQ2MDkxNCAtMC44MjQzOTIsLTQuMDA4MzY3MiAtMi4yOTE3NTYsLTUuNDU1MTc0NiBDIDEyLjE4MDIyNSwxLjEyOTk2NDggMTAuMTkwMDEzLDAuMzE3MTU1NjEgOC4xMTQ3NTYyLDAuMzE3MTU1NjEgWiBNIDYuOTM3NDU2Myw4LjI0MDU5ODUgNC42NzE4Njg1LDEwLjQ4NTg1MiA2LjAwODY4MTQsMTEuODc2NzI4IDguMzE3MDAzNSw5LjYwMDc5MTEgMTAuNjI1MzM3LDExLjg3NjcyOCAxMS45NjIxMzgsMTAuNDg1ODUyIDkuNjk2NTUwOCw4LjI0MDU5ODUgMTEuOTYyMTM4LDYuMDA2ODA2NiAxMC41NzMyNDYsNC42Mzc0MzM1IDguMzE3MDAzNSw2Ljg3MzQyOTcgNi4wNjA3NjA3LDQuNjM3NDMzNSA0LjY3MTg2ODUsNi4wMDY4MDY2IFoiIGZpbGw9ImNyaW1zb24iIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4=");
    background-color: crimson;
}
.ace_icon_svg.ace_security_fold {
    -webkit-mask-image: url("data:image/svg+xml;base64,CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTcgMTQiIGZpbGw9Im5vbmUiPgogICAgPHBhdGggZD0iTTEwLjAwMDEgMTMuNjk5MkMxMC4wMDAxIDEzLjY5OTIgMTEuOTI0MSAxMy40NzYzIDEzIDEyLjY5OTJDMTQuNDEzOSAxMS42NzgxIDE2IDEwLjUgMTYuMTI1MSA2LjgxMTI2VjIuNTg5ODdDMTYuMTI1MSAyLjU0NzY4IDE2LjEyMjEgMi41MDYxOSAxNi4xMTY0IDIuNDY1NTlWMS43MTQ4NUgxNS4yNDE0TDE1LjIzMDcgMS43MTQ4NEwxNC42MjUxIDEuNjk5MjJWNi44MTEyM0MxNC42MjUxIDguNTEwNjEgMTQuNjI1MSA5LjQ2NDYxIDEyLjc4MjQgMTEuNzIxQzEyLjE1ODYgMTIuNDg0OCAxMC4wMDAxIDEzLjY5OTIgMTAuMDAwMSAxMy42OTkyWiIgZmlsbD0iY3JpbXNvbiIgc3Ryb2tlLXdpZHRoPSIyIi8+CiAgICA8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTcuMzM2MDkgMC4zNjc0NzVDNy4wMzIxNCAwLjE1MjY1MiA2LjYyNTQ4IDAuMTUzNjE0IDYuMzIyNTMgMC4zNjk5OTdMNi4zMDg2OSAwLjM3OTU1NEM2LjI5NTUzIDAuMzg4NTg4IDYuMjczODggMC40MDMyNjYgNi4yNDQxNyAwLjQyMjc4OUM2LjE4NDcxIDAuNDYxODYgNi4wOTMyMSAwLjUyMDE3MSA1Ljk3MzEzIDAuNTkxMzczQzUuNzMyNTEgMC43MzQwNTkgNS4zNzk5IDAuOTI2ODY0IDQuOTQyNzkgMS4xMjAwOUM0LjA2MTQ0IDEuNTA5NyAyLjg3NTQxIDEuODgzNzcgMS41ODk4NCAxLjg4Mzc3SDAuNzE0ODQ0VjIuNzU4NzdWNi45ODAxNUMwLjcxNDg0NCA5LjQ5Mzc0IDIuMjg4NjYgMTEuMTk3MyAzLjcwMjU0IDEyLjIxODVDNC40MTg0NSAxMi43MzU1IDUuMTI4NzQgMTMuMTA1MyA1LjY1NzMzIDEzLjM0NTdDNS45MjI4NCAxMy40NjY0IDYuMTQ1NjYgMTMuNTU1OSA2LjMwNDY1IDEzLjYxNjFDNi4zODQyMyAxMy42NDYyIDYuNDQ4MDUgMTMuNjY5IDYuNDkzNDkgMTMuNjg0OEM2LjUxNjIyIDEzLjY5MjcgNi41MzQzOCAxMy42OTg5IDYuNTQ3NjQgMTMuNzAzM0w2LjU2MzgyIDEzLjcwODdMNi41NjkwOCAxMy43MTA0TDYuNTcwOTkgMTMuNzExTDYuODM5ODQgMTMuNzUzM0w2LjU3MjQyIDEzLjcxMTVDNi43NDYzMyAxMy43NjczIDYuOTMzMzUgMTMuNzY3MyA3LjEwNzI3IDEzLjcxMTVMNy4xMDg3IDEzLjcxMUw3LjExMDYxIDEzLjcxMDRMNy4xMTU4NyAxMy43MDg3TDcuMTMyMDUgMTMuNzAzM0M3LjE0NTMxIDEzLjY5ODkgNy4xNjM0NiAxMy42OTI3IDcuMTg2MTkgMTMuNjg0OEM3LjIzMTY0IDEzLjY2OSA3LjI5NTQ2IDEzLjY0NjIgNy4zNzUwMyAxMy42MTYxQzcuNTM0MDMgMTMuNTU1OSA3Ljc1Njg1IDEzLjQ2NjQgOC4wMjIzNiAxMy4zNDU3QzguNTUwOTUgMTMuMTA1MyA5LjI2MTIzIDEyLjczNTUgOS45NzcxNSAxMi4yMTg1QzExLjM5MSAxMS4xOTczIDEyLjk2NDggOS40OTM3NyAxMi45NjQ4IDYuOTgwMThWMi43NTg4QzEyLjk2NDggMi43MTY2IDEyLjk2MTkgMi42NzUxMSAxMi45NTYxIDIuNjM0NTFWMS44ODM3N0gxMi4wODExQzEyLjA3NzUgMS44ODM3NyAxMi4wNzQgMS44ODM3NyAxMi4wNzA0IDEuODgzNzdDMTAuNzk3OSAxLjg4MDA0IDkuNjE5NjIgMS41MTEwMiA4LjczODk0IDEuMTI0ODZDOC43MzUzNCAxLjEyMzI3IDguNzMxNzQgMS4xMjE2OCA4LjcyODE0IDEuMTIwMDlDOC4yOTEwMyAwLjkyNjg2NCA3LjkzODQyIDAuNzM0MDU5IDcuNjk3NzkgMC41OTEzNzNDNy41Nzc3MiAwLjUyMDE3MSA3LjQ4NjIyIDAuNDYxODYgNy40MjY3NiAwLjQyMjc4OUM3LjM5NzA1IDAuNDAzMjY2IDcuMzc1MzkgMC4zODg1ODggNy4zNjIyNCAwLjM3OTU1NEw3LjM0ODk2IDAuMzcwMzVDNy4zNDg5NiAwLjM3MDM1IDcuMzQ4NDcgMC4zNzAwMiA3LjM0NTYzIDAuMzc0MDU0TDcuMzM3NzkgMC4zNjg2NTlMNy4zMzYwOSAwLjM2NzQ3NVpNOC4wMzQ3MSAyLjcyNjkxQzguODYwNCAzLjA5MDYzIDkuOTYwNjYgMy40NjMwOSAxMS4yMDYxIDMuNTg5MDdWNi45ODAxNUgxMS4yMTQ4QzExLjIxNDggOC42Nzk1MyAxMC4xNjM3IDkuOTI1MDcgOC45NTI1NCAxMC43OTk4QzguMzU1OTUgMTEuMjMwNiA3Ljc1Mzc0IDExLjU0NTQgNy4yOTc5NiAxMS43NTI3QzcuMTE2NzEgMTEuODM1MSA2Ljk2MDYyIDExLjg5OTYgNi44Mzk4NCAxMS45NDY5QzYuNzE5MDYgMTEuODk5NiA2LjU2Mjk3IDExLjgzNTEgNi4zODE3MyAxMS43NTI3QzUuOTI1OTUgMTEuNTQ1NCA1LjMyMzczIDExLjIzMDYgNC43MjcxNSAxMC43OTk4QzMuNTE2MDMgOS45MjUwNyAyLjQ2NDg0IDguNjc5NTUgMi40NjQ4NCA2Ljk4MDE4VjMuNTg5MDlDMy43MTczOCAzLjQ2MjM5IDQuODIzMDggMy4wODYzOSA1LjY1MDMzIDIuNzIwNzFDNi4xNDIyOCAyLjUwMzI0IDYuNTQ0ODUgMi4yODUzNyA2LjgzMjU0IDIuMTE2MjRDNy4xMjE4MSAyLjI4NTM1IDcuNTI3IDIuNTAzNTIgOC4wMjE5NiAyLjcyMTMxQzguMDI2MiAyLjcyMzE3IDguMDMwNDUgMi43MjUwNCA4LjAzNDcxIDIuNzI2OTFaTTUuOTY0ODQgMy40MDE0N1Y3Ljc3NjQ3SDcuNzE0ODRWMy40MDE0N0g1Ljk2NDg0Wk01Ljk2NDg0IDEwLjQwMTVWOC42NTE0N0g3LjcxNDg0VjEwLjQwMTVINS45NjQ4NFoiIGZpbGw9ImNyaW1zb24iIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4=");
    background-color: crimson;
}
.ace_icon_svg.ace_warning_fold {
    -webkit-mask-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyMCAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0xNC43NzY5IDE0LjczMzdMOC42NTE5MiAyLjQ4MzY5QzguMzI5NDYgMS44Mzg3NyA3LjQwOTEzIDEuODM4NzcgNy4wODY2NyAyLjQ4MzY5TDAuOTYxNjY5IDE0LjczMzdDMC42NzA3NzUgMTUuMzE1NSAxLjA5MzgzIDE2IDEuNzQ0MjkgMTZIMTMuOTk0M0MxNC42NDQ4IDE2IDE1LjA2NzggMTUuMzE1NSAxNC43NzY5IDE0LjczMzdaTTMuMTYwMDcgMTQuMjVMNy44NjkyOSA0LjgzMTU2TDEyLjU3ODUgMTQuMjVIMy4xNjAwN1pNOC43NDQyOSAxMS42MjVWMTMuMzc1SDYuOTk0MjlWMTEuNjI1SDguNzQ0MjlaTTYuOTk0MjkgMTAuNzVWNy4yNUg4Ljc0NDI5VjEwLjc1SDYuOTk0MjlaIiBmaWxsPSIjRUM3MjExIi8+CjxwYXRoIGQ9Ik0xMS4xOTkxIDIuOTUyMzhDMTAuODgwOSAyLjMxNDY3IDEwLjM1MzcgMS44MDUyNiA5LjcwNTUgMS41MDlMMTEuMDQxIDEuMDY5NzhDMTEuNjg4MyAwLjk0OTgxNCAxMi4zMzcgMS4yNzI2MyAxMi42MzE3IDEuODYxNDFMMTcuNjEzNiAxMS44MTYxQzE4LjM1MjcgMTMuMjkyOSAxNy41OTM4IDE1LjA4MDQgMTYuMDE4IDE1LjU3NDVDMTYuNDA0NCAxNC40NTA3IDE2LjMyMzEgMTMuMjE4OCAxNS43OTI0IDEyLjE1NTVMMTEuMTk5MSAyLjk1MjM4WiIgZmlsbD0iI0VDNzIxMSIvPgo8L3N2Zz4=");
    background-color: darkorange;
}

.ace_scrollbar {
    contain: strict;
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 6;
}

.ace_scrollbar-inner {
    position: absolute;
    cursor: text;
    left: 0;
    top: 0;
}

.ace_scrollbar-v{
    overflow-x: hidden;
    overflow-y: scroll;
    top: 0;
}

.ace_scrollbar-h {
    overflow-x: scroll;
    overflow-y: hidden;
    left: 0;
}

.ace_print-margin {
    position: absolute;
    height: 100%;
}

.ace_text-input {
    position: absolute;
    z-index: 0;
    width: 0.5em;
    height: 1em;
    opacity: 0;
    background: transparent;
    -moz-appearance: none;
    appearance: none;
    border: none;
    resize: none;
    outline: none;
    overflow: hidden;
    font: inherit;
    padding: 0 1px;
    margin: 0 -1px;
    contain: strict;
    -ms-user-select: text;
    -moz-user-select: text;
    -webkit-user-select: text;
    user-select: text;
    /*with \`pre-line\` chrome inserts &nbsp; instead of space*/
    white-space: pre!important;
}
.ace_text-input.ace_composition {
    background: transparent;
    color: inherit;
    z-index: 1000;
    opacity: 1;
}
.ace_composition_placeholder { color: transparent }
.ace_composition_marker { 
    border-bottom: 1px solid;
    position: absolute;
    border-radius: 0;
    margin-top: 1px;
}

[ace_nocontext=true] {
    transform: none!important;
    filter: none!important;
    clip-path: none!important;
    mask : none!important;
    contain: none!important;
    perspective: none!important;
    mix-blend-mode: initial!important;
    z-index: auto;
}

.ace_layer {
    z-index: 1;
    position: absolute;
    overflow: hidden;
    /* workaround for chrome bug https://github.com/ajaxorg/ace/issues/2312*/
    word-wrap: normal;
    white-space: pre;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    /* setting pointer-events: auto; on node under the mouse, which changes
        during scroll, will break mouse wheel scrolling in Safari */
    pointer-events: none;
}

.ace_gutter-layer {
    position: relative;
    width: auto;
    text-align: right;
    pointer-events: auto;
    height: 1000000px;
    contain: style size layout;
}

.ace_text-layer {
    font: inherit !important;
    position: absolute;
    height: 1000000px;
    width: 1000000px;
    contain: style size layout;
}

.ace_text-layer > .ace_line, .ace_text-layer > .ace_line_group {
    contain: style size layout;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
}

.ace_hidpi .ace_text-layer,
.ace_hidpi .ace_gutter-layer,
.ace_hidpi .ace_content,
.ace_hidpi .ace_gutter {
    contain: strict;
}
.ace_hidpi .ace_text-layer > .ace_line, 
.ace_hidpi .ace_text-layer > .ace_line_group {
    contain: strict;
}

.ace_cjk {
    display: inline-block;
    text-align: center;
}

.ace_cursor-layer {
    z-index: 4;
}

.ace_cursor {
    z-index: 4;
    position: absolute;
    box-sizing: border-box;
    border-left: 2px solid;
    /* workaround for smooth cursor repaintng whole screen in chrome */
    transform: translatez(0);
}

.ace_multiselect .ace_cursor {
    border-left-width: 1px;
}

.ace_slim-cursors .ace_cursor {
    border-left-width: 1px;
}

.ace_overwrite-cursors .ace_cursor {
    border-left-width: 0;
    border-bottom: 1px solid;
}

.ace_hidden-cursors .ace_cursor {
    opacity: 0.2;
}

.ace_hasPlaceholder .ace_hidden-cursors .ace_cursor {
    opacity: 0;
}

.ace_smooth-blinking .ace_cursor {
    transition: opacity 0.18s;
}

.ace_animate-blinking .ace_cursor {
    animation-duration: 1000ms;
    animation-timing-function: step-end;
    animation-name: blink-ace-animate;
    animation-iteration-count: infinite;
}

.ace_animate-blinking.ace_smooth-blinking .ace_cursor {
    animation-duration: 1000ms;
    animation-timing-function: ease-in-out;
    animation-name: blink-ace-animate-smooth;
}
    
@keyframes blink-ace-animate {
    from, to { opacity: 1; }
    60% { opacity: 0; }
}

@keyframes blink-ace-animate-smooth {
    from, to { opacity: 1; }
    45% { opacity: 1; }
    60% { opacity: 0; }
    85% { opacity: 0; }
}

.ace_marker-layer .ace_step, .ace_marker-layer .ace_stack {
    position: absolute;
    z-index: 3;
}

.ace_marker-layer .ace_selection {
    position: absolute;
    z-index: 5;
}

.ace_marker-layer .ace_bracket {
    position: absolute;
    z-index: 6;
}

.ace_marker-layer .ace_error_bracket {
    position: absolute;
    border-bottom: 1px solid #DE5555;
    border-radius: 0;
}

.ace_marker-layer .ace_active-line {
    position: absolute;
    z-index: 2;
}

.ace_marker-layer .ace_selected-word {
    position: absolute;
    z-index: 4;
    box-sizing: border-box;
}

.ace_line .ace_fold {
    box-sizing: border-box;

    display: inline-block;
    height: 11px;
    margin-top: -2px;
    vertical-align: middle;

    background-image:
        url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAJCAYAAADU6McMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJpJREFUeNpi/P//PwOlgAXGYGRklAVSokD8GmjwY1wasKljQpYACtpCFeADcHVQfQyMQAwzwAZI3wJKvCLkfKBaMSClBlR7BOQikCFGQEErIH0VqkabiGCAqwUadAzZJRxQr/0gwiXIal8zQQPnNVTgJ1TdawL0T5gBIP1MUJNhBv2HKoQHHjqNrA4WO4zY0glyNKLT2KIfIMAAQsdgGiXvgnYAAAAASUVORK5CYII="),
        url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAA3CAYAAADNNiA5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACJJREFUeNpi+P//fxgTAwPDBxDxD078RSX+YeEyDFMCIMAAI3INmXiwf2YAAAAASUVORK5CYII=");
    background-repeat: no-repeat, repeat-x;
    background-position: center center, top left;
    color: transparent;

    border: 1px solid black;
    border-radius: 2px;

    cursor: pointer;
    pointer-events: auto;
}

.ace_dark .ace_fold {
}

.ace_fold:hover{
    background-image:
        url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAJCAYAAADU6McMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJpJREFUeNpi/P//PwOlgAXGYGRklAVSokD8GmjwY1wasKljQpYACtpCFeADcHVQfQyMQAwzwAZI3wJKvCLkfKBaMSClBlR7BOQikCFGQEErIH0VqkabiGCAqwUadAzZJRxQr/0gwiXIal8zQQPnNVTgJ1TdawL0T5gBIP1MUJNhBv2HKoQHHjqNrA4WO4zY0glyNKLT2KIfIMAAQsdgGiXvgnYAAAAASUVORK5CYII="),
        url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAA3CAYAAADNNiA5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAACBJREFUeNpi+P//fz4TAwPDZxDxD5X4i5fLMEwJgAADAEPVDbjNw87ZAAAAAElFTkSuQmCC");
}

.ace_tooltip {
    background-color: #f5f5f5;
    border: 1px solid gray;
    border-radius: 1px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    color: black;
    max-width: 100%;
    padding: 3px 4px;
    position: fixed;
    z-index: 999999;
    box-sizing: border-box;
    cursor: default;
    white-space: pre-wrap;
    word-wrap: break-word;
    line-height: normal;
    font-style: normal;
    font-weight: normal;
    letter-spacing: normal;
    pointer-events: none;
    overflow: auto;
    max-width: min(60em, 66vw);
    overscroll-behavior: contain;
}
.ace_tooltip pre {
    white-space: pre-wrap;
}

.ace_tooltip.ace_dark {
    background-color: #636363;
    color: #fff;
}

.ace_tooltip:focus {
    outline: 1px solid #5E9ED6;
}

.ace_icon {
    display: inline-block;
    width: 18px;
    vertical-align: top;
}

.ace_icon_svg {
    display: inline-block;
    width: 12px;
    vertical-align: top;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-size: 12px;
    -webkit-mask-position: center;
}

.ace_folding-enabled > .ace_gutter-cell, .ace_folding-enabled > .ace_gutter-cell_svg-icons {
    padding-right: 13px;
}

.ace_fold-widget {
    box-sizing: border-box;

    margin: 0 -12px 0 1px;
    display: none;
    width: 11px;
    vertical-align: top;

    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAANElEQVR42mWKsQ0AMAzC8ixLlrzQjzmBiEjp0A6WwBCSPgKAXoLkqSot7nN3yMwR7pZ32NzpKkVoDBUxKAAAAABJRU5ErkJggg==");
    background-repeat: no-repeat;
    background-position: center;

    border-radius: 3px;
    
    border: 1px solid transparent;
    cursor: pointer;
}

.ace_folding-enabled .ace_fold-widget {
    display: inline-block;   
}

.ace_fold-widget.ace_end {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAANElEQVR42m3HwQkAMAhD0YzsRchFKI7sAikeWkrxwScEB0nh5e7KTPWimZki4tYfVbX+MNl4pyZXejUO1QAAAABJRU5ErkJggg==");
}

.ace_fold-widget.ace_closed {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAGCAYAAAAG5SQMAAAAOUlEQVR42jXKwQkAMAgDwKwqKD4EwQ26sSOkVWjgIIHAzPiCgaqiqnJHZnKICBERHN194O5b9vbLuAVRL+l0YWnZAAAAAElFTkSuQmCCXA==");
}

.ace_fold-widget:hover {
    border: 1px solid rgba(0, 0, 0, 0.3);
    background-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 1px 1px rgba(255, 255, 255, 0.7);
}

.ace_fold-widget:active {
    border: 1px solid rgba(0, 0, 0, 0.4);
    background-color: rgba(0, 0, 0, 0.05);
    box-shadow: 0 1px 1px rgba(255, 255, 255, 0.8);
}
/**
 * Dark version for fold widgets
 */
.ace_dark .ace_fold-widget {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHklEQVQIW2P4//8/AzoGEQ7oGCaLLAhWiSwB146BAQCSTPYocqT0AAAAAElFTkSuQmCC");
}
.ace_dark .ace_fold-widget.ace_end {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAH0lEQVQIW2P4//8/AxQ7wNjIAjDMgC4AxjCVKBirIAAF0kz2rlhxpAAAAABJRU5ErkJggg==");
}
.ace_dark .ace_fold-widget.ace_closed {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAAFCAYAAACAcVaiAAAAHElEQVQIW2P4//+/AxAzgDADlOOAznHAKgPWAwARji8UIDTfQQAAAABJRU5ErkJggg==");
}
.ace_dark .ace_fold-widget:hover {
    box-shadow: 0 1px 1px rgba(255, 255, 255, 0.2);
    background-color: rgba(255, 255, 255, 0.1);
}
.ace_dark .ace_fold-widget:active {
    box-shadow: 0 1px 1px rgba(255, 255, 255, 0.2);
}

.ace_inline_button {
    border: 1px solid lightgray;
    display: inline-block;
    margin: -1px 8px;
    padding: 0 5px;
    pointer-events: auto;
    cursor: pointer;
}
.ace_inline_button:hover {
    border-color: gray;
    background: rgba(200,200,200,0.2);
    display: inline-block;
    pointer-events: auto;
}

.ace_fold-widget.ace_invalid {
    background-color: #FFB4B4;
    border-color: #DE5555;
}

.ace_fade-fold-widgets .ace_fold-widget {
    transition: opacity 0.4s ease 0.05s;
    opacity: 0;
}

.ace_fade-fold-widgets:hover .ace_fold-widget {
    transition: opacity 0.05s ease 0.05s;
    opacity:1;
}

.ace_underline {
    text-decoration: underline;
}

.ace_bold {
    font-weight: bold;
}

.ace_nobold .ace_bold {
    font-weight: normal;
}

.ace_italic {
    font-style: italic;
}


.ace_error-marker {
    background-color: rgba(255, 0, 0,0.2);
    position: absolute;
    z-index: 9;
}

.ace_highlight-marker {
    background-color: rgba(255, 255, 0,0.2);
    position: absolute;
    z-index: 8;
}

.ace_mobile-menu {
    position: absolute;
    line-height: 1.5;
    border-radius: 4px;
    -ms-user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    user-select: none;
    background: white;
    box-shadow: 1px 3px 2px grey;
    border: 1px solid #dcdcdc;
    color: black;
}
.ace_dark > .ace_mobile-menu {
    background: #333;
    color: #ccc;
    box-shadow: 1px 3px 2px grey;
    border: 1px solid #444;

}
.ace_mobile-button {
    padding: 2px;
    cursor: pointer;
    overflow: hidden;
}
.ace_mobile-button:hover {
    background-color: #eee;
    opacity:1;
}
.ace_mobile-button:active {
    background-color: #ddd;
}

.ace_placeholder {
    position: relative;
    font-family: arial;
    transform: scale(0.9);
    transform-origin: left;
    white-space: pre;
    opacity: 0.7;
    margin: 0 10px;
    z-index: 1;
}

.ace_ghost_text {
    opacity: 0.5;
    font-style: italic;
}

.ace_ghost_text_container > div {
    white-space: pre;
}

.ghost_text_line_wrapped::after {
    content: "↩";
    position: absolute;
}

.ace_lineWidgetContainer.ace_ghost_text {
    margin: 0px 4px
}

.ace_screenreader-only {
    position:absolute;
    left:-10000px;
    top:auto;
    width:1px;
    height:1px;
    overflow:hidden;
}

.ace_hidden_token {
    display: none;
}`;
