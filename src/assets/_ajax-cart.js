/*============================================================================
  Ajax the add to cart experience by revealing it in a side drawer
  Plugin Documentation - http://shopify.github.io/Timber/#ajax-cart
  (c) Copyright 2015 Shopify Inc. Author: Carson Shold (@cshold). All Rights Reserved.

  This file includes:
    - Basic Shopify Ajax API calls
    - Ajax cart plugin

  This requires:
    - jQuery 1.8+
    - handlebars.min.js (for cart template)
    - modernizer.min.js
    - snippet/ajax-cart-template.liquid

  Customized version of Shopify's jQuery API
  (c) Copyright 2009-2015 Shopify Inc. Author: Caroline Schnapp. All Rights Reserved.
==============================================================================*/
/*============================================================================
  Money Format
  - Shopify.format money is defined in option_selection.js.
    If that file is not included, it is redefined here.
==============================================================================*/
if ((typeof Shopify) === 'undefined') {
    Shopify = {};
}

if (!Shopify.formatMoney) {

    Shopify.formatMoney = function (cents, format) {
        var value = '',
            placeholderRegex = /\{\{\s*(\w+)\s*\}\}/,
            formatString = (format || this.money_format);

        if (typeof cents == 'string') {
            cents = cents.replace('.', '');
        }

        function defaultOption(opt, def) {
            return (typeof opt == 'undefined' ? def : opt);
        }

        function formatWithDelimiters(number, precision, thousands, decimal) {
            precision = defaultOption(precision, 2);
            thousands = defaultOption(thousands, ',');
            decimal = defaultOption(decimal, '.');

            if (isNaN(number) || number === null) {
                return 0;
            }

            number = (number / 100.0).toFixed(precision);

            var parts = number.split('.'),
                dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
                cents = parts[1] ? (decimal + parts[1]) : '';

            return dollars + cents;
        }

        switch (formatString.match(placeholderRegex)[1]) {
            case 'amount':
                value = formatWithDelimiters(cents, 2);
                break;
            case 'amount_no_decimals':
                value = formatWithDelimiters(cents, 0);
                break;
            case 'amount_with_comma_separator':
                value = formatWithDelimiters(cents, 2, '.', ',');
                break;
            case 'amount_no_decimals_with_comma_separator':
                value = formatWithDelimiters(cents, 0, '.', ',');
                break;
        }

        return formatString.replace(placeholderRegex, value).replace(".00", "");
    };
}

if ((typeof ShopifyAPI) === 'undefined') {
    ShopifyAPI = {};
}

/*============================================================================
  API Helper Functions
==============================================================================*/
function attributeToString(attribute) {
    if ((typeof attribute) !== 'string') {
        attribute += '';
        if (attribute === 'undefined') {
            attribute = '';
        }
    }
    return jQuery.trim(attribute);
}

/*============================================================================
  API Functions
==============================================================================*/
ShopifyAPI.onCartUpdate = function (cart) {
    // alert('There are now ' + cart.item_count + ' items in the cart.');
};

ShopifyAPI.updateCartNote = function (note, callback) {
    var params = {
        type: 'POST',
        url: '/cart/update.js',
        data: 'note=' + attributeToString(note),
        dataType: 'json',
        success: function (cart) {
            if ((typeof callback) === 'function') {
                callback(cart);
            } else {
                ShopifyAPI.onCartUpdate(cart);
            }
        },
        error: function (XMLHttpRequest, textStatus) {
            ShopifyAPI.onError(XMLHttpRequest, textStatus);
        }
    };
    jQuery.ajax(params);
};

ShopifyAPI.onError = function (XMLHttpRequest, textStatus) {
    var data = eval('(' + XMLHttpRequest.responseText + ')');
    if (!!data.message) {
        console.log(data.message + '(' + data.status + '): ' + data.description);
    }
};

/*============================================================================
  POST to cart/add.js returns the JSON of the cart
    - Allow use of form element instead of just id
    - Allow custom error callback
==============================================================================*/
ShopifyAPI.addItemFromForm = function (form, callback, errorCallback) {
    var params = {
        type: 'POST',
        url: '/cart/add.js',
        data: jQuery(form).serialize(),
        dataType: 'json',
        success: function (line_item) {
            if ((typeof callback) === 'function') {
                callback(line_item, form);
            } else {
                ShopifyAPI.onItemAdded(line_item, form);
            }
        },
        error: function (XMLHttpRequest, textStatus) {
            if ((typeof errorCallback) === 'function') {
                errorCallback(XMLHttpRequest, textStatus);
            } else {
                ShopifyAPI.onError(XMLHttpRequest, textStatus);
            }
        }
    };
    jQuery.ajax(params);
};

// Get from cart.js returns the cart in JSON
ShopifyAPI.getCart = function (callback) {
    jQuery.getJSON('/cart.js', function (cart, textStatus) {
        if ((typeof callback) === 'function') {
            callback(cart);
        } else {
            ShopifyAPI.onCartUpdate(cart);
        }
    });
};

// POST to cart/change.js returns the cart in JSON
ShopifyAPI.changeItem = function (line, quantity, callback) {
    var params = {
        type: 'POST',
        url: '/cart/change.js',
        data: 'quantity=' + quantity + '&line=' + line,
        dataType: 'json',
        success: function (cart) {
            if ((typeof callback) === 'function') {
                callback(cart);
            } else {
                ShopifyAPI.onCartUpdate(cart);
            }
        },
        error: function (XMLHttpRequest, textStatus) {
            ShopifyAPI.onError(XMLHttpRequest, textStatus);
        }
    };
    jQuery.ajax(params);
};

/*============================================================================
  Ajax Shopify Add To Cart
==============================================================================*/
var ajaxCart = (function (module, $) {

    'use strict';

    // Public functions
    var init, loadCart;

    // Private general variables
    var settings, isUpdating, $body;

    // Private plugin variables
    var $formContainer, $addToCart, $cartCountSelector, $cartCostSelector, $cartContainer, $drawerContainer, $fullCartContainer;

    // Private functions
    var updateCountPrice, formOverride, itemAddedCallback, itemErrorCallback, cartUpdateCallback, buildCart, cartCallback, adjustCart, adjustCartCallback, createQtySelectors, qtySelectors, validateQty, closeCartDrawer, openCartDrawer, $cartCountDataSelector;

    /*============================================================================
      Initialise the plugin and define global options
    ==============================================================================*/
    init = function (options) {

        // Default settings
        settings = {
            formSelector: 'form[action="/cart/add"]',
            cartContainer: '.mini-cart',
            fullCartContainer: '.cart',
            addToCartSelector: '.js-add-to-cart',
            cartCountSelector: ".js-cart-count",
            cartCostSelector: null,
            disableAjaxCart: false
        };

        settings.moneyFormat = $(settings.cartContainer).data("money-format");

        // Override defaults with arguments
        $.extend(settings, options);

        // Select DOM elements
        $formContainer = $(settings.formSelector);
        $cartContainer = $(settings.cartContainer);
        $fullCartContainer = $(settings.fullCartContainer);
        $cartCountDataSelector = $("[data-cart-count]");

        $addToCart = $formContainer.find(settings.addToCartSelector);
        $cartCountSelector = $(document).find($(settings.cartCountSelector));
        $cartCostSelector = $(settings.cartCostSelector);

        // General Selectors
        $body = $('body');

        // Track cart activity status
        isUpdating = false;

        // Take over the add to cart form submit action if ajax enabled
        if (!settings.disableAjaxCart && $addToCart.length) {
            formOverride();
        }

        // Run this function in case we're using the quantity selector outside of the cart
        adjustCart();

        ShopifyAPI.getCart(cartUpdateCallback);

        $addToCart.on("click", function () {
            $addToCart.val("Adding");
        });

    };

    updateCountPrice = function (cart) {

        if ($cartCostSelector) {
            $cartCostSelector.html(Shopify.formatMoney(cart.total_price, settings.moneyFormat));
        }

        if ($cartCountSelector) {
            $cartCountSelector.text(cart.item_count);
        }

        $cartCountDataSelector.attr("data-cart-count", cart.item_count);

    };

    formOverride = function () {

        $formContainer.on('submit', function (evt) {

            evt.preventDefault();

            ShopifyAPI.addItemFromForm(evt.target, itemAddedCallback, itemErrorCallback);

        });
    };

    itemAddedCallback = function (product) {

        ShopifyAPI.getCart(cartUpdateCallback);

        $formContainer.find(".message").remove();

        $('body').on('ajaxCart.afterCartLoad', function () {

            $addToCart.val($addToCart.data("default-value"));

            setTimeout(function () {
                openCartDrawer();
            }, 0);

        });

    };

    itemErrorCallback = function (XMLHttpRequest, textStatus) {

        var data = eval('(' + XMLHttpRequest.responseText + ')');

        if (!!data.message) {

            console.log(data);

            if (data.status === 422) {
                $(".js-form-status").text(data.description);
                $addToCart.val($addToCart.data("default-value"));
            }

        }

    };

    closeCartDrawer = function () {
        $(".js-mini-cart-close").eq(0).trigger("click");
    };

    openCartDrawer = function () {
        $(".js-mini-cart-open").eq(0).trigger("click");
    };

    cartUpdateCallback = function (cart) {
        // Update quantity and price
        buildCart(cart);
        updateCountPrice(cart);
    };

    buildCart = function (cart) {

        var fullCartTemplateSource,
            isCartPage = false,
            fullCartTemplate;

        if ($("#FullCartTemplate").length) {
            fullCartTemplateSource = $("#FullCartTemplate").html();
            isCartPage = true;
        }

        // Start with a fresh cart div
        $cartContainer.empty();

        if (isCartPage) {
            $fullCartContainer.empty();
        }

        // Show empty cart
        if (cart.item_count === 0) {

            $cartContainer.html($(".js-empty-mini-cart-html").html());

            if (isCartPage) {
                $fullCartContainer.html($(".js-empty-cart-html").html());
            }

            cartCallback(cart);

            setTimeout(function () {
                closeCartDrawer();
            }, 250);

            return;
        }

        // Handlebars.js cart layout
        var items = [],
            item = {},
            data = {},
            itemCount = cart.item_count,
            source = $("#MiniCartTemplate").html(),
            template = Handlebars.compile(source);

        if (isCartPage) {
            fullCartTemplate = Handlebars.compile(fullCartTemplateSource);
        }

        var prodImg, imgSize = "200x";

        // Add each item to our handlebars.js data
        $.each(cart.items, function (index, cartItem) {

            /* Hack to get product image thumbnail
             *   - If image is not null
             *     - Remove file extension, add size, and re-add extension
             *     - Create server relative link
             *   - A hard-coded url of no-image
             */
            if (cartItem.image !== null) {
                prodImg = cartItem.image.replace(".jpg", "_" + imgSize + ".progressive.jpg");
            } else {
                prodImg = "//cdn.shopify.com/s/assets/admin/no-image-large-cc9732cb976dd349a0df1d39816fbcc7.gif";
            }

            // Create item's data object and add to 'items' array
            item = {
                id: cartItem.variant_id,
                line: index + 1, // Shopify uses a 1+ index in the API
                url: cartItem.url,
                img: prodImg,
                name: cartItem.product_title,
                variation: cartItem.variant_title,
                properties: cartItem.properties,
                itemQty: cartItem.quantity,
                price: Shopify.formatMoney(cartItem.price, settings.moneyFormat),
                vendor: cartItem.vendor
            };

            items.push(item);

        });

        // Gather all cart data and add to DOM
        data = {
            items: items,
            itemCount: itemCount,
            note: cart.note,
            totalPrice: Shopify.formatMoney(cart.total_price, settings.moneyFormat)
        };

        $cartContainer.append(template(data));

        if (isCartPage) {
            $fullCartContainer.append(fullCartTemplate(data));
            $("html").trigger("cartPageScripted");
        }

        cartCallback(cart);

    };

    cartCallback = function (cart) {
        $body.trigger('ajaxCart.afterCartLoad', cart);
    };

    adjustCart = function () {
        // Delegate all events because elements reload with the cart

        $body.on("click", ".js-cart-remove", function (e) {

            e.preventDefault();

            var $self = $(this);

            $formContainer.find(".message").remove();

            // Slide up the removed item and block the remove button from being clicked again as it's being removed.
            $self
                .css("pointer-events", "none")
                .parents(".mini-cart__product").slideUp(250);

            updateQuantity($self.data("line"), 0);

        });


        // Add or remove from the quantity
        $body.on('change', '.js-cart-qty', function (e) {

            $formContainer.find(".message").remove();

            var $el = $(this),
                line = $el.data('line'),
                qty = $el.val();

            qty = validateQty(qty);

            // If it has a data-line, update the cart. Otherwise, just update the input's number
            if (line) {

                // To prevent a lot of fast clicks. Will enable when the cart template rebuilds.
                $el.prop("disabled", true);

                updateQuantity(line, qty);

            }

        });

        // Prevent cart from being submitted while quantities are changing
        $body.on('submit', 'form.ajaxcart', function (evt) {
            if (isUpdating) {
                evt.preventDefault();
            }
        });

        function updateQuantity(line, qty) {

            isUpdating = true;

            // Slight delay to make sure removed animation is done
            ShopifyAPI.changeItem(line, qty, adjustCartCallback);

        }

        // Save note anytime it's changed
        $body.on('change', 'textarea[name="note"]', function () {
            var newNote = $(this).val();

            // Update the cart note in case they don't click update/checkout
            ShopifyAPI.updateCartNote(newNote, function (cart) { });
        });
    };

    adjustCartCallback = function (cart) {

        isUpdating = false;

        // Reprint cart on short timeout so you don't see the content being removed
        setTimeout(function () {
            ShopifyAPI.getCart(buildCart);

            // Update quantity and price
            updateCountPrice(cart);

        }, 150);

    };


    validateQty = function (qty) {
        if ((parseFloat(qty) == parseInt(qty)) && !isNaN(qty)) {
            // We have a valid number!
        } else {
            // Not a number. Default to 1.
            qty = 1;
        }
        return qty;
    };


    module = {
        init: init,
        load: loadCart
    };

    return module;

}(ajaxCart || {}, jQuery));
