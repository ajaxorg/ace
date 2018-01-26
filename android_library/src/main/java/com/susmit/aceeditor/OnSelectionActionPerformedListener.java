package com.susmit.aceeditor;

/**
 * Created by susmit on 26/1/18.
 */

public interface OnSelectionActionPerformedListener {

    void onSelectionFinished(boolean usingSelectAllOption);
    void onCut();
    void onCopy();
    void onPaste();
    void onUndo();
    void onRedo();

}
