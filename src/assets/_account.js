function accountForgotPass() {

    var emailVal = "";

    var setForgotPWVal = function (val) {
        $("#recover-email").val(val).trigger("change");
    };

    $(".js-forgot-password").on("click", function () {
        emailVal = $("#customer_email").val();
        setForgotPWVal(emailVal);
    });

    if ($(".forgot-password--success").length || location.hash.indexOf("recover") !== -1) {
        cache.$html.addClass("forgot-password--toggled");
        location.hash = "";
    }

}