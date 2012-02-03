# Introduction

The beginnings of an API documentation set for Ace. 

This documentation can't be build without [C9's version of ndoc](https://github.com/c9/ndoc), so you should clone that repo somewhere, too. Note to self: since there's a billion people following this project, should I just make this ndoc a submodule, similair to NodeManual? I'd rather not.

# Building

In this directory, just run 

    node build.js [path_to_ndoc]

`[path_to_ndoc]` is a required argument, indicating the location of your ndoc install, relative to the `build.js` file. By default, this will point to `./build/ndoc/bin/ndoc`. 

Right now, yes, we're using the [NodeManual.org](http://www.nodemanual.org) theme. A real style is pending. Also there are a lot of *TODO* items so you should really be more concerned about that.