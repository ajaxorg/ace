$(function() {
  // when hovering over arrow, add highlight (only if inactive)
  $("h3.methodToggle").hover(function () {
      if (!$("h3.methodToggle").hasClass('active'))
        $(this).addClass("methodToggleHover");
    },
    function () {
      $(this).removeClass("methodToggleHover");
    }
  );

  // after expanding the hidden description, hide the ellipsis
  $('.signature-call, .signature-returns', '.signature').click(function() {
      var $article = $(this).closest('.article'),
          $arrow   = $('h3.methodClicker', $article);

      if (!$article.hasClass('methodToggleOpen') || this.force) {
          $article.addClass('methodToggleOpen');
          $arrow.removeClass('inactive').addClass('active');
          
          var data = location.hash = $arrow[0].id.replace(/^js_/, "");
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

