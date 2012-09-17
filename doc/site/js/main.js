var editor;
var embedded_editor;
$(function() {
    hljs.initHighlighting();
    editor = ace.edit("ace_editor_demo");
    embedded_editor = ace.edit("embedded_ace_code");
    var javascriptMode = require("ace/mode/javascript").Mode;
    var htmlMode = require("ace/mode/html").Mode;
    editor.getSession().setMode(new javascriptMode());
    embedded_editor.getSession().setMode(new htmlMode());
    
    $("ul.menu-list li").click(function(e) {
        if (e.target.tagName === "LI") {
            console.log($(this).find("a"));
            window.location = $(this).find("a").attr("href");
        }
        else if (e.target.tagName === "P" || e.target.tagName === "IMG") {
            var anchor = $(e.target).siblings();
            window.location = anchor.attr("href");
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
            $("#apiHolder").removeClass("apiIntro").removeClass("span8");
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
    
     var tabs = $("#tabnav"),
         tab_a_selector = "a";

     var firstLoad = true;
     
     tabs.find(tab_a_selector).click(function(e) {         
        e.preventDefault();
        embedded_editor.resize();
        editor.resize();
        if ($(this).attr("href") === "/")
            return;
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
                    scrollTop: ($(el).offset().top - 15)
                }, 400);
            }
        }

        $(this).tab("show");

        var state = {};
        state.nav = $(this).attr("href").substr(1);
        $.bbq.pushState(state);
     });

     $(window).on("hashchange", function(e) {
         tabs.each(function() {
            var idx = $.bbq.getState("nav") || "about";
            $(this).find(tab_a_selector + "[href='#" + idx + "']").triggerHandler('click');
            
            // handles dropping in from new link
            var api = $.bbq.getState("api");
            if (api) {
                $(tab_a_selector + "[href='./api/" + api + ".html']").triggerHandler('click');
            }
         });
     }).trigger("hashchange");
});