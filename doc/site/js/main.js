var editor;
var embedded_editor;
$(function() {
    hljs.initHighlighting();
    ace.config.set("workerPath", "build/src-min");
    editor = ace.edit("ace_editor_demo");
    editor.container.style.opacity = "";
    embedded_editor = ace.edit("embedded_ace_code");
    embedded_editor.container.style.opacity = "";
    editor.session.setMode("ace/mode/javascript");
    editor.session.setMode("ace/mode/javascript");
    embedded_editor.session.setMode("ace/mode/html");

    embedded_editor.setAutoScrollEditorIntoView(true);
    editor.setAutoScrollEditorIntoView(true);
    
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
        embedded_editor.resize();
        editor.resize();
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
        $.bbq.pushState(state);
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
});