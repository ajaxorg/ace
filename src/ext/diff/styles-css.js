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
    background-color: #eaffea; /*rgb(74 251 74 / 12%); */
}
.ace_diff.delete {
    background-color: #ffecec; /*rgb(251 74 74 / 12%);*/
}
.ace_diff.aligned_diff {
    background: rgba(206, 194, 191, 0.26);
    background: repeating-linear-gradient(
                45deg,
              rgba(122, 111, 108, 0.26),
              rgba(122, 111, 108, 0.26) 5px,
              #FFFFFF 5px,
              #FFFFFF 10px 
    );
}

.ace_diff.insert.inline {
    background-color:  rgb(74 251 74 / 18%); 
}
.ace_diff.delete.inline {
    background-color: rgb(251 74 74 / 15%);
}

.ace_diff.delete.inline.empty {
    background-color: rgba(255, 128, 79, 0.8);
    width: 2px !important;
}

.ace_diff.insert.inline.empty {
    background-color: rgba(49, 230, 96, 0.8);
    width: 2px !important;
}

.ace_diff.selection {
    border-bottom: 1px solid black;
    border-top: 1px solid black;
    background: transparent;
}

/*
 * Dark Colors 
 */

.ace_dark .ace_diff.insert.inline {
    background-color: rgba(0, 130, 58, 0.45);
}
.ace_dark .ace_diff.delete.inline {
    background-color: rgba(169, 46, 33, 0.55);
}

.ace_dark .ace_diff.selection {
    border-bottom: 1px solid white;
    border-top: 1px solid white;
    background: transparent;
}
 

/* gutter changes */
.ace_mini-diff_gutter-enabled > .ace_gutter-cell {
    background-color: #f0f0f0;
}

.ace_mini-diff_gutter-enabled > .mini-diff-added {
    background-color: #eaffea;
    border-left: 3px solid #00FF00;
}

.ace_mini-diff_gutter-enabled > .mini-diff-deleted {
    background-color: #ffecec;
    border-left: 3px solid #FF0000;
}


.ace_mini-diff_gutter-enabled > .mini-diff-added:after {
    position: absolute;
    right: 2px;
    content: "+";
    color: darkgray;
    background-color: inherit;
}

.ace_mini-diff_gutter-enabled > .mini-diff-deleted:after {
    position: absolute;
    right: 2px;
    content: "-";
    color: darkgray;
    background-color: inherit;
}
.ace_fade-fold-widgets:hover .mini-diff-added:after {
    display: none;
}
.ace_fade-fold-widgets:hover .mini-diff-deleted:after {
    display: none;
}

`;
