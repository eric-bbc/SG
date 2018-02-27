sidneyGarber.showSiteModal = function() {

    var $modal = $(".site-modal");

    $modal.on("click", function (e) {

        if ($(e.target).hasClass("modal")) {
            hide();
            $modal.off("click");
        }

    });

    $(document).on("keyup", function (e) {

        if ( e.which === 27 && shown() ) {
            hide();
        }

    });

    var hide = function () {
        $modal.removeClass("modal--toggled");
        $("#email_0").blur();
    };

    var show = function () {

        setTimeout(function () {
            $("#email_0").focus();
        }, 150);

        $modal.addClass("modal--toggled");
        localStorage.setItem("modalShown", true);

    };

    var shown = function () {
        return localStorage.modalShown;
    };

    var shouldShow = function () {
        return "Storage" in window && $modal.length && !shown();
        // false
    };

    if ( shouldShow() ) {
        show();
    }

};
