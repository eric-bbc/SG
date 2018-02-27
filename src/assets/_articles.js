sidneyGarber.articles = function(){

    var $carousel = $(".js-article-slider");
    var $close    = $(".article-carousel__close");
    
    $(".js-article").on("click", function(){
        var index = $(this).data("index");
        $carousel.slick("slickGoTo", index);
    });

    $(".article-carousel").on("click", function(e){
        if( $(e.target).hasClass("article-carousel") ){
            $close.eq(0).trigger("click");
        }
    });

    $(document).on("keyup", function(e){

        if(e.which === 37){
            $carousel.slick("slickPrev");
        } else if(e.which === 39){
            $carousel.slick("slickNext");
        }

    });

};