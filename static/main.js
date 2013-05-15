
var currentlyShowing = null;

function switchTo(which) {
    function add() {
        var entry = $("#templates ."+which).clone();
        $("#dialog").empty().append(entry).show();
    }
    if (currentlyShowing) {
        $("#dialog").hide(500, add);
    } else {
        add();
    }
}

$(function() {
    switchTo("t1");
});
