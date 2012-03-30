function foo  (items, nada) {
    for (var i=0; i<items.length; i++) {
        alert(items[i] + "juhu\n");
    }	// Real Tab.
}

object = {
    abra = kadabra;
    bar = baz;
    boo = moo;
    foo = opera;
}




object.say = function(items) {
    var self = this;
    setTimeout(function() {
        console.log(this.abra)
        console.log me(this.bar)
        console.warn(this.boo)

        console.error(this.foo)
    }, 100)
}