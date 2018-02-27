sidneyGarber.paginate = function() {

    var products = '.js-paginate-products';
    var product  = '.js-paginate-product';
    var load     = '.js-paginate-load';
    var paginate = '.js-paginate-wrap';

    var refresh = function(){
        sidneyGarber.initLazyLoad();
    };

     var paginationIsLoading = false;

    $(document).on("click", load, function(e){

        e.preventDefault();

        var $self = $(this);
        var href  = $self.attr("href");

        $.ajax({
            type: "GET",
            url: href,
            success: function (response) {

                var returnedProducts = $(response).find(product);
                var returnedLoad     = $(response).find(load);

                // Check if any products are returned.
                if(returnedProducts.length){

                    // Append new products to DOM.
                    $(products).append(returnedProducts);

                    // Update load more URL to continue with pagination.
                    $(load).attr("href", returnedLoad.attr("href"));

                    // Refresh any plugins needed.
                    refresh();


                }

                // Check if there's more to load. Load more button only shows if there's additional pages, so this checks its presence in the DOM.
                if(!returnedLoad.length){
                    $(paginate).remove();
                }

                //set the flag
                 paginationIsLoading = false;

            }
        });

    });

    if ($('.collection').length) {

       // if ($('html.no-touchevents').length) {
          $(window).scroll($.throttle(250, function() {
             var limit = 3 * $(window).height();
             if ($(document).height() - $(window).scrollTop() < limit) {
                if(!paginationIsLoading){
                   paginationIsLoading = true;
                   $(load).trigger('click');
                }
             }

          }
        ))


       // }  <==closing bracket for mobile check

    }

};
