// BUG: Since we're fetching products with AJAX, the order is non maintained since its an async request. We need to maintain the order that the product was viewed and display in that order.
sidneyGarber.recentlyViewed = function () {

    var $target = $(".recently-viewed");

    if(!$target.length){
        return false;
    }

    var $template = $("#recentlyViewedTemplate");    
    var source    = $template.html(), template;

    var STORAGE_KEY_PREFIX = "recently_viewed_";
    var MAX_PRODUCTS = $target.data("max-products");
    var SORT_ORDER_SEPARATOR = ",";

    var storageCount    = 0;
    var productsFetched = 0;

    var isPDP = function(){
        return location.pathname.indexOf("products") >= 0;
    };

    var updateCounter = function(){
        localStorage.recentlyViewedCounter = getCounter() + 1;
    };

    var getCounter = function(){
        return "recentlyViewedCounter" in localStorage ? parseInt(localStorage.recentlyViewedCounter) : 0;
    };

    /*
    Loops thru all keys in localStorage and returns the one that match our STORAGE_KEY_PREFIX.
    @param {boolean} limit - determines if we should stop getting products once we hit the limit (MAX_PRODUCTS).
    */
    var getProductsInStorage = function(limit){
        
        var products = [];
        var index = 0;
        
        $.each(localStorage, function(key, value){

            if(key.indexOf(STORAGE_KEY_PREFIX) !== -1){
                
                // Split the value which contains the product handle and it's order.
                value = value.split(SORT_ORDER_SEPARATOR);
        
                products.push({
                    key: key,
                    handle: value[0],
                    order:  value[1]
                });

            }

        });

        // Sort by order, then splice.
        var sorted = products.sort(function(a, b){
            return parseInt(a.order) < parseInt(b.order);
        });

        // Remove more than neccessary.
        if(limit){
            sorted.splice(MAX_PRODUCTS);
        }

        return sorted;

    };

    var clearStorage = function(){

        $.each(localStorage, function(key, value){

            if(key.indexOf(STORAGE_KEY_PREFIX) !== -1){
                localStorage.removeItem(key);
            }

        });

    };

    var printProductsInStorage = function(){
        
        $.each(localStorage, function(key, value){

            if(key.indexOf(STORAGE_KEY_PREFIX) !== -1){
                console.group("Recently viewed");
                console.log("Key: " + key);
                console.log("Value: " + value);
                console.groupEnd();
            }

        });

    };

    // Return the amount of products in storage.
    var getProductStorageCount = function(limit){
        return getProductsInStorage(limit).length;
    };

    // Checks for storage support.
    var supportsLocalStorage = function(){
        return "Storage" in window;
    };

    /*
    Adds a product to storage.
    @param {key} key - The product's key in localStorage.
    */
    var addProductToStorage = function(key, productHandle){
        
        // Add to storage, include the product's order.
        localStorage.setItem(
            STORAGE_KEY_PREFIX + key, productHandle + SORT_ORDER_SEPARATOR + getCounter()
        );

    };

    // Return the product's key from the markup.
    var getProductStorageKey = function(){
        return $target.data("product-storage-key");
    };

    // Return the product's handle from the markup.
    var getProductHandle = function(){
        return $target.data("product-handle");
    };

    // Fetch the product as JSON with AJAX.
    var getProduct = function(productHandle, callback){

        jQuery.getJSON('/products/' + productHandle + '.js', function(){

        })
        .done(function(product){

            if(typeof(callback) === "function"){
                callback(product);
            }

        })
        .fail(function(jqxhr, textStatus, error){
            
            // Clear storage on fail. Failure will occur if a product's handle changes as it's in storage.
            console.warn("Error getting product from storage. Error: " + error);
            console.log("Clearing products in storage...");

            clearStorage();

            console.log("Storage cleared... listing products in storage: (" + getProductStorageCount() + ")");
            printProductsInStorage();

        });

    };

    // Gathers the data needed to compile the handebars template.
    var getDataForTemplate = function(products){

        var data = {
            products: []
        };

        $.each(products, function(index, product){
            data.products.push(product);
        });

        var sorted = data.products.sort(function(a, b){
            return parseInt(a.order) < parseInt(b.order);
        });

        // Update products with sorted products.
        data.products = sorted;

        return data;

    };

    // Fn to start it all off.
    var init = function(){

        // Check for storage support and make sure were on the pdp.
        if( supportsLocalStorage() && isPDP() ){

            template = Handlebars.compile(source);
            var key    = getProductStorageKey();
            var handle = getProductHandle();
            var products = [];
            var data;

            // Update view counter.
            updateCounter();

            // Add current product to storage.
            addProductToStorage(key, handle);

            // Get count, with limit applied.
            storageCount = getProductStorageCount(true);

            // Gather data from products in storage, with limit applied.
            $.each(getProductsInStorage(true), function(index, productInStorage){
                
                // Fetch product's JSON.
                getProduct(productInStorage.handle, function(product){

                    // Add order to product object.
                    product.order = productInStorage.order;

                    // Increment number fetched to compare with total to be fetched.
                    productsFetched++;

                    // Push product to arr of products.
                    products.push(product);

                    // Fetched all of the products in storage.
                    if(productsFetched === storageCount){
                        data = getDataForTemplate(products);
                        $target.append( template(data) );
                    }

                });

            });

        }    

    };

    init();

};