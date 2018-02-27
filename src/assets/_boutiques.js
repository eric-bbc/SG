sidneyGarber.boutiques = function(){

    "use-strict";

    var s = {
        $toggle: $(".boutique__gallery-toggle"),
        $gallery: $(".boutique-gallery"),
        active: "boutique-gallery--toggled",
        $active: undefined
    };

    var bindUI = function(){

        s.$toggle.on("click", function(){

            var index = $(this).data("index");
            var $gallery = getGallery(index);

            // Set active gallery.
            s.$active = $gallery;

            // Hide all
            hideGallery(s.$gallery);

            // Show clicked.
            showGallery($gallery);

        });

        $(document).on("keyup", function(e){

            // Check if any galleries are active first.
            if( galleryIsActive(s.$gallery) ){

                if(e.which === 27){
                    hideGallery(s.$gallery);
                } else if( e.which === 37){
                    getGallerySlider(s.$active).slick("slickPrev");
                } else if( e.which === 39 ){
                    getGallerySlider(s.$active).slick("slickNext");
                }

            }

        });

        s.$gallery.on("click", function(e){
            if( $(e.target).hasClass(s.active) ){
                hideGallery(s.$gallery);
            }
        });
    
    };

    var showGallery = function($gallery){
        $gallery.addClass(s.active);
    };

    var hideGallery = function($gallery){
        $gallery.removeClass(s.active);
    };

    var getGallery = function(index){
        return s.$gallery.filter("[data-index='" + index + "']");
    };

    var getGallerySlider = function($gallery){
        return $gallery.find(".js-slick-slider");
    };

    var galleryIsActive = function($gallery){
        return $gallery.hasClass(s.active);
    };

    var init = function(){
        bindUI();
    };

    init();

};