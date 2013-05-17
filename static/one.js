
setupFunctions["t1-get-email"] = function() {
    enterMeansClick("#dialog input.email", "#dialog input.go");
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
    enterMeansClick("#dialog input.password", "#dialog input.go");
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
    enterMeansClick("#dialog input.password", "#dialog input.go");
    $("#dialog input.go").on("click", function() {
        var password = $("#dialog input.password").val();
        send("create-account", {password: password})
            .then(function(r) {
                switchTo("t4a-account-created");
            });
    });

    $("#dialog input.generated-password").on("click", function() {
        $("#dialog input.password").val(generatePassword());
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

    enterMeansClick("#dialog input.code", "#dialog input.go");
    $("#dialog input.go").on("click", function() {
        var gotCode = $("#dialog input.code").val();
        $("#dialog div.code-input").empty().append($("<span>Checking code..</span>"));
        send("got-reset-code", {code: gotCode})
            .then(function(r) {
                if (r.correct)
                    switchTo("t9-reset-account-set-password");
                else
                    switchTo("t8a-reset-account-bad-code");
            });
    });

    send("create-reset-code").then(function(r) {
        var side = showSidechannel("t8-reset-account");
        side.find("span.show-code").text(r.code);
    });

};

setupFunctions["t8a-reset-account-bad-code"] = function() {
    $("#dialog input.again").on("click", function() {
        switchTo("t8-reset-account-start");
    });
}; 

setupFunctions["t9-reset-account-set-password"] = function() {
    enterMeansClick("#dialog input.password", "#dialog input.go");
    $("#dialog input.go").on("click", function() {
        state.newPassword = $("#dialog input.password").val();
        // hide the stretching behind an extra user confirmation click
        switchTo("t10-reset-account-commit");
    });

    $("#dialog input.generated-password").on("click", function() {
        $("#dialog input.password").val(generatePassword());
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
    var side = showSidechannel("t12-pair-start");
    side.find("input.ok").on("click", function() {
        switchTo("t13-pair-more");
    });
};

setupFunctions["t13-pair-more"] = function() {
    send("create-pair-code", {}).then(function(r) {
        $("#dialog span.code").text(r.code).addClass("show-code");
    });
    var side = showSidechannel("t13-pair-more");
    enterMeansClick("#sidechannel-container input.code",
                    "#sidechannel-container input.go");
    side.find("input.code").focus();
    side.find("input.go").on("click", function() {
        var gotCode = side.find("input.code").val();
        $("#sidechannel-container div.code-input").empty().append($("<span>Checking code..</span>"));
        send("got-pair-code", {code: gotCode})
        .then(function(r) {
            if (r.correct)
                switchTo("t14-pair-done");
            else
                switchTo("t15-pair-wrong");
        });
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
