Beziehung Document <1-1> Buffer <1-n> Buffer State <1-1> Window

Document
========

In memory representation of a text file

Register
========

Holds a text fragment

Buffer
======

Document plus additional meta data.

* document
* filename
* undomanager
* language mode
* dirty flag

BufferState (ViewState?)
===========

Holds state specific for a buffer in a window.

* buffer
* window
* selection/cursor
* folding
* scroll positions

Window
======

A window is the viewport of a buffer

* one buffer state
* size on screen in px
* lineheight
* wrapping
* focused

Editor (Model)
==============

Holds the editor global state

* maanges buffer states
* list of buffers
* list of views
* active window
* registers
* search
* layout of windows (relative sizes)
* window aspect ratio

LayoutManager
=============

later

EditorView
==========

Renders the frame of the editor containing multiple windows and optionally a
command line.

* keyboard input
* renders layout of editor views
* provides parent DOM element for editor views

WindowView
==========

Renders a single window on the screen.

* mouse input
* scrolling
* gutter (line numbers)
* text rendering

Editor (Controller)
===================

Ties views and models together. Propagates user and model events.

Might act as a proxy to the editor model. This will be the main entry class for the user.

WindowController
================

Syncs one WindowView with one Window model


Transition/Refactoring
======================

* rename virutal_renderer to WindowView OK
* rename edit_session to Buffer OK
* create Window model OK
* move state from renderer to window model WIP
    - remove config.characterWidth OK
    - remove config.lineHeight OK
    - remove config from layers. Use this.model instead OK
    - move scrolling code to the model OK
    - move updateLayerConfig to model!
    - create unit tests for window model
* move event handling code from editor.js to window_controller.js
* split editor.js into Editor(Controller) and WindowController

* restore scroll position on buffer change
* editor.$search OK

* addEventListener -> on
* blockScrolling OK
* highlightBrackets OK
* textInput to window_view or pass in as constructor argument
* remove setSession from text layer
* text navigation code

* remove default settings OK
* remove dom.js selection code
* chrome detection OK

* get rid of "MockRenderer" OK
* update browser tests
* 
