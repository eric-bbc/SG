sidneyGarber.showShippingModal = function() {

    var $modal = $(".shipping-modal");


    $('.js-shipping-modal-toggle').on('click', function () {
      $modal.addClass('modal--toggled')
    })

  
    $modal.on("click", function (e) {

        if ($(e.target).hasClass("modal")) {
            hide();
            // $modal.off("click");
        } else {
          show()
        }

    });

    $(document).on("keyup", function (e) {

        if ( e.which === 27 && shown() ) {
            hide();
        }

    });

    var hide = function () {
        $modal.removeClass("modal--toggled");
    };

    var show = function () {

        $modal.addClass("modal--toggled");

    };

};
