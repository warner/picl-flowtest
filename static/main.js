
var currentlyShowing = null;

var state = {};

var setupFunctions = {};

function send(verb, body) {
    var d = $.Deferred();
    $.ajax({type: "POST", url: "/api",
            // what we send:
            contentType: "application/json",
            data: JSON.stringify({verb: verb, body: body}),
            // what we expect:
            dataType: "json",
            success: d.resolve
            });
    return d;
}

function switchTo(which) {
    function add() {
        $("#dialog").empty();
        console.log("showing", which);
        var entry = $("#templates ."+which).clone();
        $("#dialog").append(entry).fadeIn("fast",
                                         function() {
                                             currentlyShowing = which;
                                             console.log(which);
                                             var f = setupFunctions[which];
                                             if (f)
                                                 f();
                                         });
    }
    $("#dialog").fadeOut("fast", add);
}

setupFunctions["t1-get-email"] = function() {
    $("#dialog input.go").on("click", function() {
        state.email = $("#dialog input.email").val();
        console.log("clicked", state.email);
        send("email", {email: state.email})
            .then(function(r) {
                if (r.known)
                    switchTo("t2-get-password");
                else
                    switchTo("t3-create-account");
            });
                    
    });
};

setupFunctions["t2-get-password"] = function() {
    $("#dialog input.password").on("click", function() {
        var password = $("#dialog input.password").val();
        send("password", {password: password})
            .then(function(r) {
                if (r.correct)
                    switchTo("t4-password-good");
                else
                    switchTo("t5-password-wrong");
            });
                    
    });

    $("#dialog input.forgot").on("click", function() {
        switchTo("t6-forgot-password-start");
    });

    $("#dialog input.hate").on("click", function() {
        switchTo("t7-hate-password");
    });

};
    

$(function() {
    console.log("starting");
    switchTo("t1-get-email");
    //window.setTimeout(function() {switchTo("t2-get-password");}, 5000);
});
