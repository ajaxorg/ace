exports.cssText = `
/*
 * Line Markers
 */
.ace_diff {
    position: absolute;
    z-index: 0;
}
.ace_diff.inline {
    z-index: 20;
}
/*
 * Light Colors 
 */
.ace_diff.insert {
    background-color: #EFFFF1;
}
.ace_diff.delete {
    background-color: #FFF1F1;
}
.ace_diff.aligned_diff {
    background: rgba(206, 194, 191, 0.26);
    background: repeating-linear-gradient(
                45deg,
              rgba(122, 111, 108, 0.26),
              rgba(122, 111, 108, 0.26) 5px,
              rgba(0, 0, 0, 0) 5px,
              rgba(0, 0, 0, 0) 10px 
    );
}

.ace_diff.insert.inline {
    background-color:  rgb(74 251 74 / 18%); 
}
.ace_diff.delete.inline {
    background-color: rgb(251 74 74 / 15%);
}

.ace_diff.delete.inline.empty {
    background-color: rgba(255, 128, 79, 0.7);
    width: 2px !important;
}

.ace_diff.insert.inline.empty {
    background-color: rgba(49, 230, 96, 0.7);
    width: 2px !important;
}

.ace_diff-active-line {
    border-bottom: 1px solid;
    border-top: 1px solid;
    background: transparent;
    position: absolute;
    box-sizing: border-box;
    border-color: #9191ac;
}

.ace_dark .ace_diff-active-line {
    background: transparent;
    border-color: #75777a;
}
 

/* gutter changes */
.ace_mini-diff_gutter-enabled > .ace_gutter-cell,
.ace_mini-diff_gutter-enabled > .ace_gutter-cell_svg-icons {
    padding-right: 13px;
}

.ace_mini-diff_gutter_other > .ace_gutter-cell,
.ace_mini-diff_gutter_other > .ace_gutter-cell_svg-icons  {
    display: none;
}

.ace_mini-diff_gutter_other {
    pointer-events: none;
}


.ace_mini-diff_gutter-enabled > .mini-diff-added {
    background-color: #EFFFF1;
    border-left: 3px solid #2BB534;
    padding-left: 16px;
    display: block;
}

.ace_mini-diff_gutter-enabled > .mini-diff-deleted {
    background-color: #FFF1F1;
    border-left: 3px solid #EA7158;
    padding-left: 16px;
    display: block;
}


.ace_mini-diff_gutter-enabled > .mini-diff-added:after {
    position: absolute;
    right: 2px;
    content: "+";
    background-color: inherit;
}

.ace_mini-diff_gutter-enabled > .mini-diff-deleted:after {
    position: absolute;
    right: 2px;
    content: "-";
    background-color: inherit;
}
.ace_fade-fold-widgets:hover > .ace_folding-enabled > .mini-diff-added:after,
.ace_fade-fold-widgets:hover > .ace_folding-enabled > .mini-diff-deleted:after {
    display: none;
}

.ace_diff_other .ace_selection {
    filter: drop-shadow(1px 2px 3px darkgray);
}

.ace_hidden_marker-layer .ace_bracket,
.ace_hidden_marker-layer .ace_error_bracket {
    display: none;
}



/*
 * Dark Colors 
 */

.ace_dark .ace_diff.insert {
    background-color: #212E25;
}
.ace_dark .ace_diff.delete {
    background-color: #3F2222;
}

.ace_dark .ace_mini-diff_gutter-enabled > .mini-diff-added {
    background-color: #212E25;
    border-left-color:#00802F;
}

.ace_dark .ace_mini-diff_gutter-enabled > .mini-diff-deleted {
    background-color: #3F2222;
    border-left-color: #9C3838;
}

`;
