var editor;
$(function() {
    this.isApi = location.href.indexOf("/api") >= 0;
    if (!this.isApi) {
        hljs.initHighlighting();
        editor = ace.edit("ace_editor_demo");
        var javascriptMode = require("ace/mode/javascript").Mode;
        editor.getSession().setMode(new javascriptMode());
    }
    
    $("ul.menu-list li").click(function(e) {
        if (e.target.tagName === "LI") {
            console.log($(this).find("a"));
            window.location = $(this).find("a").attr("href");
        }
        else if (e.target.tagName === "P") {
            var anchor = $(e.target).siblings();
            window.location = anchor.attr("href");
        }
    });
     var tabs = $("#tabnav"),
         tab_a_selector = "a";

     var firstLoad = true;
     var _self = this;
     tabs.find(tab_a_selector).click(function(e) {
        if (_self.isApi || $(this).attr("href").indexOf("/api/") >= 0) {
             window.location = $(this).attr("href");
        }
         
        e.preventDefault();
        if ($(this).attr("href") === "/")
            return;
        if ($(this).attr("href") === "#api") {
            $("#top_container").addClass("collapse");
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

        function scrollIntoPosition(el) {
            if ($("body").scrollTop() > 345) {
                $("body").stop().animate({
                    scrollTop: ($(el).offset().top - 15)
                }, 400);
            }
        }
    
        
        $(this).tab("show");

        var state = {};
        state["nav"] = $(this).attr("href").substr(1);
        $.bbq.pushState(state);
     });

    if (!this.isApi) {
         $(window).on("hashchange", function(e) {
             tabs.each(function() {
                var idx = $.bbq.getState("nav") || "about";
                $(this).find(tab_a_selector + "[href='#" + idx + "']").triggerHandler('click');
             });
         }).trigger("hashchange");
    }
});