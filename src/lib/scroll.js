exports.preventParentScroll = function preventParentScroll(event) {
    event.stopPropagation();
    var target = event.currentTarget;
    var contentOverflows = target.scrollHeight > target.clientHeight;
    if (!contentOverflows) {
        event.preventDefault();
    }
};