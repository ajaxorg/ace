$(function () {
    'use strict';

   var pagePath = document.location.pathname.substring(document.location.pathname.lastIndexOf("/") + 1);

   // select current page in sidenav and set up prev/next links if they exist
   var $selNavLink = $('#sidebar').find('a[href="' + pagePath + '"]');
   if ($selNavLink.length) {
      //$selListItem = $selNavLink.closest('li');

      $selNavLink.addClass('currentItem');
   }

    if (window.addEventListener) window.addEventListener('load', loadCallback, true);
    else window.attachEvent('load', loadCallback, true);

    function loadCallback(evt) {
        var form = document.getElementById("searchbox");

        if (form) {
            var input = form.query;
            form.onsubmit = function (evt) {
                var query = input.value;
                if (query) {
                    input.value = "";
                    input.blur();
                    var url = "https://www.google.com/search?q=" + encodeURIComponent("site:ace.ajax.org" + " " + query);
                    window.open(url);
                }
                return false;
            };
        }
    }

    // init search
    $('#search')
    // prevent from form submit
    .on('submit', function () {
        return false;
    }).find('input');
});

function ux() {
    var d = 'a.menu, .dropdown-toggle'

    function clearMenus() {
        $(d).parent('li').each(function () {
            $(this).removeClass('open')
        });
    }

    var s, sx;

    // scrolling offset calculation via www.quirksmode.org
    if (window.pageYOffset || window.pageXOffset) {
        s = window.pageYOffset;
        sx = window.pageXOffset;
    }
    else if (document.documentElement && (document.documentElement.scrollTop || document.documentElement.scrollLeft)) {
        s = document.documentElement.scrollTop;
        sx = document.documentElement.scrollLeft;
    }
    else if (document.body) {
        s = document.body.scrollTop;
        sx = document.body.scrollLeft;
    }

    if (document.documentElement.offsetWidth < 1010) {
        if (sx <= 0) sx = 0;
        else if (sx + document.documentElement.offsetWidth > 1010) sx = 1010 - document.documentElement.offsetWidth;
    }
    else sx = 0;

    $('span.methodClicker, article.article, i.methodClicker').each(function () {
        var a = $(this);
        var constructorPos = a.attr("id").indexOf("new ");

        var objName = a.attr("id");
        if (constructorPos >= 0) {
            objName = objName.substring(constructorPos + 4);
            objName += ".new";
        }

        a.attr("id", objName);
    });
    
    function showMethodContent() {
        var locationHash = location.hash.replace(/^#/, '').replace(/\./g, '\\.');
        var equalsPos = location.hash.indexOf("=");
        
        if (equalsPos >=0) {
            locationHash = locationHash.substring(0, location.hash.indexOf("="));
        }
        
        var $clickerEl = $('span#' + locationHash);
        if ($clickerEl.length > 0 && $clickerEl.hasClass('methodClicker')) {
            var p = $clickerEl.parent();
            p[0].force = true;
            p.trigger('click');
            p[0].force = false;
        }
    }

    if (location.hash.indexOf("section") >= 1) {
        showMethodContent();
        var data = location.hash;
        scrollTo(null, data.substr(1));
    }

    window.onhashchange = function () {
        showMethodContent();
    }
};

function scrollTo(el, data) {
    if (!data) {
        data = el.getAttribute("data-id");
        //location.hash = data;
    }
    var el = $("span#" + data.replace(/\./g, "\\."))[0];
    if (!el) return;

    var article = $(el).closest('.article')[0];

    var top = article.offsetTop - 100;

    if (document.body.scrollTop > top || document.body.scrollTop != top && document.body.scrollTop + (window.innerHeight || document.documentElement.offsetHeight) < top + article.offsetHeight) {
        $('body').animate({
            scrollTop: top
        }, {
            duration: 200,
            easing: "swing"
        });
    }
}