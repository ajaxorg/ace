var editor;
var embedded_editor;
$(function() {
    if (typeof ace !== "undefined") {
        ace.config.set("workerPath", "build/src-min");
        editor = ace.edit("ace_editor_demo");
        editor.container.style.opacity = "";
        embedded_editor = ace.edit("embedded_ace_code");
        embedded_editor.container.style.opacity = "";
        embedded_editor.session.setMode("ace/mode/html");
        embedded_editor.setAutoScrollEditorIntoView(true);
        embedded_editor.setOption("maxLines", 40);
        
        editor.setOptions({
            maxLines: 30,
            mode: "ace/mode/javascript",
            autoScrollEditorIntoView: true
        });
        
        ace.config.loadModule("ace/ext/emmet", function() {
            ace.require("ace/lib/net").loadScript("http://cloud9ide.github.io/emmet-core/emmet.js", function() {
                embedded_editor.setOption("enableEmmet", true);
                editor.setOption("enableEmmet", true);
            });
        });
        
        ace.config.loadModule("ace/ext/language_tools", function() {
            embedded_editor.setOptions({
                enableSnippets: true,
                enableBasicAutocompletion: true
            });
            editor.setOptions({
                enableSnippets: true,
                enableBasicAutocompletion: true
            });
        });
    } else {
        document.body.insertAdjacentHTML("afterbegin", '<div class="bs-docs-example">\
            <div class="alert alert-error">\
              <button type="button" class="close" data-dismiss="alert">\xd7</button>\
              <strong>Oh No!</strong> Couldn\'t load <code>build/src/ace.js</code>.<br>\
                You can build it by running <code>npm install ; node Makefile.dryice.js</code><br>\
                Or download older version by running <code>git submodule update --init --recursive</code><br>\
            </div>\
          </div>');
    }
    $("ul.menu-list").mousedown(function(e) {
        if (e.button === 1) {
            e.preventDefault();
        }
    });
    
    $("ul.menu-list li").click("click auxclick", function(e) {
        if (e.target.tagName !== "A") {
            var href = $(this).find("a").attr("href");
            if (e.originalEvent.button == 1)
                window.open(href, "_blank");
            else if (e.originalEvent.button == 0)
                window.location = href;
        }
    });
    
    // used when page is access directly
    function magicClickInterceptor(e) {
        e.preventDefault();
            
        var state = {};
        state.api = $(this).attr("href").substring(6, $(this).attr("href").length - 5);
        $.bbq.pushState(state);
        
        var _self = $(this);
        $("#apiHolder").load($(this).attr("href") + " #documentation", function(){
        $("#apiHolder").removeClass("apiIntro").removeClass("span9");
        $("#documentation").removeClass("span9").addClass("span7");
            ux();
            setupClicker();
        
            // handles dropping in from new link
            var section = $.bbq.getState("section");
            if (section) {
                $("li#dropdown_" + section.replace(/\./g, '\\.') + " a").triggerHandler('click');
            }
            
            //setupDisqus(_self.attr("href"));
        });
    }
    
    $('.menu-item a').click(magicClickInterceptor);
    $('a.argument').click(magicClickInterceptor);
    
    $('a.external').click(function(e) {
        e.preventDefault();
    });

    var tabs = $("#tabnav"),
        tab_a_selector = "a";

    var firstLoad = true;
     
    tabs.find(tab_a_selector).click(function(e) {
        e.preventDefault();
        if ($(this).attr("href") === "/") {
            window.location = "http://ace.ajax.org";
            return;
        }
        if ($(this).attr("href").indexOf("#api") === 0) {
            $("#top_container").addClass("collapse");
            scrollIntoPosition(null, 0);
        }
        else if ($(this).is(":visible")) {
            if (firstLoad) {
                firstLoad = false;
                setTimeout(function() {
                    $("#top_container").removeClass("collapse");
                    scrollIntoPosition(e.target);
                }, 700);
            }
            else {
                $("#top_container").removeClass("collapse");
                scrollIntoPosition(e.target);
            }
        }

        function scrollIntoPosition(el, overridePosition) {
            if (typeof overridePosition !== "undefined") {
                $("body").stop().animate({
                    scrollTop: overridePosition
                }, 400);
            }
            else if ($("body").scrollTop() > 345) {
                $("body").stop().animate({
                    scrollTop: ($(el).offset().top - 10)
                }, 400);
            }
        }

        $(this).tab("show");

        var state = {};
        state.nav = $(this).attr("href").substr(1);
        var oldState = $.bbq.getState("nav") || "about";
        if (state.nav != oldState)
            $.bbq.pushState(state);
     });

    $('#tabnav a[data-toggle="tab"]').on('shown', function (e) {
        $(".tab-content .tab-pane.active .ace_editor").each(function(i, el){
            el.env.onResize();
        });
    });

    $(window).on("hashchange", function(e) {
        _gaq.push(['_trackPageview',location.pathname + location.search  + location.hash]);
        tabs.each(function() {
            var idx = $.bbq.getState("nav") || "about";
            var section = e.fragment.split("&")[1] || "";
            $(this).find(tab_a_selector + "[href='#" + idx + "']").triggerHandler('click');
           
            // handles dropping in from new link
            var api = $.bbq.getState("api");
            if (api) {
                $(tab_a_selector + "[href='./api/" + api + ".html']").triggerHandler('click');
            }
        });
    }).trigger("hashchange");
     
    highlight();
});



function highlight() {
    var highlighter = ace.require("ace/ext/static_highlight")
    var dom = ace.require("ace/lib/dom")
    function qsa(sel) {
        var els = document.querySelectorAll(sel);
        var result = [];
        for (var i = 0, l = els.length; i < l; i++)
            result[i] = els[i];
        return result;
    }

    qsa("code[class]").forEach(function(el) {
        var m = el.className.match(/language-(\w+)|(javascript)/);
        if (!m) return
        var mode = "ace/mode/" + (m[1] || m[2]);
        highlighter.highlight(el, {mode: mode, theme: "ace/theme/xcode"})
    });
}