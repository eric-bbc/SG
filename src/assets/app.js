/* Vendor code */
// @codekit-prepend "_slick-slider.js"
// @codekit-prepend "_lazyload.js"
// @codekit-prepend "_instafeed.js"
// @codekit-prepend "_handlebars.min.js"
// @codekit-prepend "_jquery.zoom.min.js"
// @codekit-prepend "_jquery.cookie.js"
// @codekit-prepend "_jquery.ba-throttle-debounce.min.js"


/* Init global app object */
// @codekit-prepend "_app-init.js"


/* Vendor related code, not vendor code itself */
// @codekit-prepend "_vendor.js"


/* Utils */
// @codekit-prepend "_element-toggle-class.js"
// @codekit-prepend "_utils.js"
// @codekit-prepend "_site-modal.js"
// @codekit-prepend "_shipping-modal.js"
// @codekit-prepend "_privacy-modal.js"
// @codekit-prepend "_tabs.js"
// @codekit-prepend "_dropdowns.js"
// @codekit-prepend "_smooth-scroll.js"
// @codekit-prepend "_recently-viewed.js"


/* Other stuff */
// @codekit-prepend "_ajax-cart.js"
// @codekit-prepend "_account.js"
// @codekit-prepend "_newsletter-form.js"
// @codekit-prepend "_partner-maps.js"
// @codekit-prepend "_boutiques.js"
// @codekit-prepend "_articles.js"
// @codekit-prepend "_paginate.js"


// Our main function to init our other functions.

sidneyGarber.main = function () {

    "use-strict";

    var init = function(){
        sidneyGarber.elementToggleClass();
        sidneyGarber.headerOffset();
        sidneyGarber.initSlickSlider();
        sidneyGarber.initInstafeed();
        sidneyGarber.initLazyLoad();
        sidneyGarber.initJqueryZoom();
        sidneyGarber.initMobileZoom()
        sidneyGarber.toggleTabs();
        sidneyGarber.toggleDropdown();
        sidneyGarber.recentlyViewed();
        sidneyGarber.partnerMaps();
        sidneyGarber.boutiques();
        sidneyGarber.handleNewsletterForm();
        sidneyGarber.toggleForm("#contact-form", $(".js-contact-form-toggle"), "contact-form");
        sidneyGarber.toggleForm("#press-form", $(".js-press-form-toggle"), "press-form");
        sidneyGarber.toggleForm("#product-here-to-help-form", $(".js-product-here-to-help-form-toggle"), "product-here-to-help-form");
        sidneyGarber.showShippingModal();
        sidneyGarber.showPrivacyModal();
        sidneyGarber.showSiteModal();
        sidneyGarber.headerSearch();
        sidneyGarber.headerDropdowns();
        sidneyGarber.articles();
        sidneyGarber.paginate();
        sidneyGarber.sortKeywords()
        sidneyGarber.filterInit();

        $("html").addClass("dom-ready");

    };

    init();

};

sidneyGarber.main();
