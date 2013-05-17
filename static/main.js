
var currentlyShowing = null;

var state = {};

var setupFunctions = {};

function send(verb, body) {
    var d = $.Deferred();
    $.ajax({type: "POST", url: "/api",
            // what we send:
            contentType: "application/json",
            data: JSON.stringify({sessionID: sessionID, verb: verb, body: body}),
            // what we expect:
            dataType: "json",
            success: d.resolve
            });
    return d;
}

function switchTo(which) {
    function done() {
        var notes = $("#templates .notes-"+which);
        if (notes.length)
            $("#notes").empty().append(notes.clone());
        currentlyShowing = which;
        console.log(which);
        var f = setupFunctions[which];
        if (f)
            f();
    }
    function add() {
        $("#dialog").empty();
        console.log("showing", which);
        var entry = $("#templates ."+which).clone();
        $("#dialog").append(entry).fadeIn("fast", done);
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
    $("#dialog input.go").on("click", function() {
        var password = $("#dialog input.password").val();
        send("attach", {password: password})
            .then(function(r) {
                if (r.correct)
                    switchTo("t4-password-good");
                else
                    switchTo("t5-password-wrong");
            });
                    
    });

    $("#dialog input.hate").on("click", function() {
        switchTo("t7-hate-password");
    });

};

setupFunctions["t3-create-account"] = function() {
    $("#dialog input.go").on("click", function() {
        var password = $("#dialog input.password").val();
        send("create-account", {password: password})
            .then(function(r) {
                switchTo("t4a-account-created");
            });
                    
    });

    var randomPW = "correct-horse-battery-staple";
    $("#dialog input.generated-password").attr("value", randomPW);
    $("#dialog input.generated-password").on("click", function() {
        $("#dialog input.password").val(randomPW);
    });

};

setupFunctions["t5-password-wrong"] = function() {
    $("#dialog input.again").on("click", function() {
        switchTo("t2-get-password");
    });
}; 

setupFunctions["t7-hate-password"] = function() {
    $("#dialog input.pair").on("click", function() {
        switchTo("t12-pair-start");
    });
    $("#dialog input.reset").on("click", function() {
        switchTo("t8-reset-account-start");
    });
};

setupFunctions["t8-reset-account-start"] = function() {
    $("#dialog span.email").text(state.email);
    var code = "123-456-7890";
    $("#dialog span.code").text(code);
    $("#dialog input.go").on("click", function() {
        var gotCode = $("#dialog input.code").val();
        $("#dialog input.code").hide(); // show "checking.." message
        send("got-code", {code: gotCode})
            .then(function(r) {
                if (r.correct)
                    switchTo("t9-reset-account-set-password");
                else
                    switchTo("t8a-reset-account-bad-code");
            });
    });
};

setupFunctions["t8a-reset-account-bad-code"] = function() {
    $("#dialog input.again").on("click", function() {
        switchTo("t8-reset-account-start");
    });
}; 

setupFunctions["t9-reset-account-set-password"] = function() {
    $("#dialog input.go").on("click", function() {
        state.newPassword = $("#dialog input.password").val();
        switchTo("t10-reset-account-commit");
    });

    var randomPW = "correct-horse-battery-staple";
    $("#dialog input.generated-password").attr("value", randomPW);
    $("#dialog input.generated-password").on("click", function() {
        $("#dialog input.password").val(randomPW);
    });
};

setupFunctions["t10-reset-account-commit"] = function() {
    $("#dialog input.reset").on("click", function() {
        send("reset-account", {password: state.newPassword})
            .then(function(r) {
                switchTo("t11-reset-account-done");
            });
                    
    });
};

setupFunctions["t12-pair-start"] = function() {
    $("#dialog input.ok").on("click", function() {
        switchTo("t13-pair-more");
    });
};

setupFunctions["t13-pair-more"] = function() {
    $("#dialog div.code").text("123-456");
    $("#dialog input.ok").on("click", function() {
        switchTo("t14-pair-done");
    });
    $("#dialog input.wrong").on("click", function() {
        switchTo("t15-pair-wrong");
    });
};

setupFunctions["t15-pair-wrong"] = function() {
    $("#dialog input.again").on("click", function() {
        switchTo("t12-pair-start");
    });
};
   

$(function() {
    console.log("starting");
    switchTo("t1-get-email");
    //window.setTimeout(function() {switchTo("t2-get-password");}, 5000);
});
