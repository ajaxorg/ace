$(document).ready(function () {
  // when hovering over arrow, add highlight (only if inactive)
  $("i.methodToggle").hover(function () {
      if (!$("i.methodToggle").hasClass('active'))
        $(this).addClass("methodToggleHover");
    },
    function () {
      $(this).removeClass("methodToggleHover");
    }
  );

  // after expanding the hidden description, hide the ellipsis
  $("i.methodToggle").click(function() {
      var $article = $(this).closest('.article'),
          $arrow   = $('i.methodClicker', $article);

      if (!$article.hasClass('methodToggleOpen') || this.force) {
          $article.addClass('methodToggleOpen');
          $arrow.removeClass('inactive').addClass('active');
          
          var data = $arrow[0].id.replace(/^js_/, "");
          location.hash = data + "#nav=api";
          scrollTo(null, data);
      }
      else {
          $article.removeClass('methodToggleOpen');
          $arrow.removeClass('active').addClass('inactive');
      }
  });
  
  $('.signature-call, .signature-returns', '.signature').click(function() {
      var $article = $(this).closest('.article'),
          $arrow   = $('i.methodClicker', $article);

      if (!$article.hasClass('methodToggleOpen') || this.force) {
          $article.addClass('methodToggleOpen');
          $arrow.removeClass('inactive').addClass('active');
          
          var data = $arrow[0].id.replace(/^js_/, "");
          location.hash = data + "#nav=api";
          scrollTo(null, data);
      }
      else {
          $article.removeClass('methodToggleOpen');
          $arrow.removeClass('active').addClass('inactive');
      }
  });
  
  $('.related-to', '.metaInfo').click(function(){
      location.hash = $(this).find('a').attr('href').split('#')[1];
  });
  
});

