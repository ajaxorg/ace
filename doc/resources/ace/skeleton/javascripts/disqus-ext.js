function setupDisqus(href) {
    var disqus_shortname = 'aceapi';
    
    //var paths = window.location.pathname.split("/");
    //var fileName = paths[paths.length - 2] + "/" + paths[paths.length - 1];
    
    //var disqus_identifier = fileName;
    var disqus_identifier =  href.substring(2);
    
    (function() {
        if (document.getElementById("disqusScript") === null) {
            var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
            dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);       
        }
    })();
}