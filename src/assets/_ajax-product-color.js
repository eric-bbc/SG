// // NOTE: not product ready.
// sidneyGarber.ajaxProductColor = function(){

//     var s = {
//         link: ".js-ajax-color",
//         $productAjaxWrap: $(".js-ajax-product"),
//         productData: ".page-content"
//     }; 

//     $(document).on("click", s.link, function(e){

//         e.preventDefault();

//         var href = $(this).attr("href");

//         getProduct(href, function(ajaxData){

//             var $data    = $(ajaxData.data);
//             var $product = $data.find(s.productData);

//             if($product.length){
//                 s.$productAjaxWrap.html($product);
//             }

//         });

//     });

//     var getProduct = function(url, callback){

//         $.ajax({
//             url: url,
//             success: function(data, textStatus, jqXHR){

//                 if(typeof(callback) === "function"){

//                     var cbData = {
//                         data: data,
//                         textStatus: textStatus,
//                         jqXHR: jqXHR
//                     }

//                     callback(cbData);

//                 }

//             }
//         });

//     };

// };