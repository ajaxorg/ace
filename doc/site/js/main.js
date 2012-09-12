 $(function() {
     hljs.initHighlighting();

     var tabs = $("#tabnav"),
         tab_a_selector = "a";

    var firstLoad = true;
     tabs.find(tab_a_selector).click(function(e) {
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
                }, 700);
            }
            else {
                $("#top_container").removeClass("collapse");
            }
        }

        $(this).tab("show");

        var state = {};
        state["nav"] = $(this).attr("href").substr(1);
        $.bbq.pushState(state);
     });

     $(window).on("hashchange", function(e) {
         tabs.each(function() {
            var idx = $.bbq.getState("nav") || "embedding";
            $(this).find(tab_a_selector + "[href='#" + idx + "']").triggerHandler('click');
         });
     }).trigger("hashchange");
 });