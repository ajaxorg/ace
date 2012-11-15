function setupClicker() {
  // when hovering over arrow, add highlight (only if inactive)
  $("i.methodToggle").hover(function () {
      if (!$("i.methodToggle").hasClass('active'))
        $(this).addClass("methodToggleHover");
    },
    function () {
      $(this).removeClass("methodToggleHover");
    }
  );

  function handleClick(e, linkHref) {
      //if (linkHref.indexOf("nav=api&api=") >= 0)
      //  return;
      if (linkHref == "api")
        return;
        
      e.preventDefault();
      
      var dstElem;
      if (linkHref) {
          dstElem = $("article[id='" + linkHref + "']");
      }
      
      var $article = (dstElem || $(this)).closest('.article'),
          $arrow   = $('i.methodClicker', $article);

      if (!$article.hasClass('methodToggleOpen') || this.force) {
          $article.addClass('methodToggleOpen');
          $arrow.removeClass('inactive').addClass('active');

          if (!$arrow[0])
            return;

          var data = $arrow[0].id.replace(/^js_/, "");
          //var state = {};
          //state.section = data;
          //$.bbq.pushState(state);
          
          scrollTo(null, data);
      }
      else {
          $article.removeClass('methodToggleOpen');
          $arrow.removeClass('active').addClass('inactive');
      }
  }
  
  function transformHash(e) {
      // some bs to figure out link hash
      var hashId = (e.srcElement ? e.srcElement.href : (e.hash || e.target.href)) || e.currentTarget.hash;
      
      handleClick(e, hashId.substring(hashId.indexOf("#") + 1));
  }
  
  // for the arrow
  $("i.methodToggle").click(handleClick);
  
  // for the signature
  $('.member-name').click(handleClick);
  
  // for the top dropdown
  $('li.memberLink a').click(transformHash);
  
  //$('a[href^="#"]').click(transformHash);
  
  $('.related-to', '.metaInfo').click(function(){
      location.hash = $(this).find('a').attr('href').split('#')[1];
  });
}