var generate = function(n){
    var output = '';
    var sample = "<div><p>lorem ipsum</p></div>";
    for(var i=0;i<n;i++){
        output += sample;
    }
    return output;
}
var largeHtmlString = generate(100);
editor.session.setValue(largeHtmlString);

