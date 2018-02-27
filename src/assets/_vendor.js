sidneyGarber.initInstafeed = function () {
    console.log('inifite scroll');


    var $el = $( "#instafeed" );
    var $loadMore = $(".js-instafeed-load");

    var config = {
        get: "user",
        limit: $el.data("limit") || 20,
        resolution: "low_resolution",
        // accessToken: "371208668.1677ed0.a0ae12e2312d4b09b8c62cc47cb21785",
        accessToken: "371208668.1677ed0.0113f377bb4846998c5dc819d65223e0",
        userId: 371208668,
        clientId: "01c2df2a64c64f91816b039b4390ff6e",
        template: '<div class="instafeed__item  figure"><a href="{{link}}" target="_blank"><img src="{{image}}" alt="" class="figure__image"><div class="figure__caption"> {{caption}}</div></a></div>',
        mock: true,
        success: function(json){

            var self = this;
            var template = self.options.template;
            var items    = [];

            $.each(json.data, function(index, obj){

                // Populate variables and push each item to an array of items.
                items.push(
                    template
                    .replace("{{link}}", obj.link)
                    .replace("{{caption}}", removeHashTags(obj.caption.text))
                    .replace("{{image}}", obj.images[self.options.resolution].url)
                );

            });

            // Append to the DOM.
            $el.append(items);

        },
        after: function() {

            // disable button if no more results to load
            if ( !this.hasNext() ) {
                $loadMore.remove();
            }

        },
        error: function(e) {
          console.log(e);
          console.log('error');
        }
    };

    var removeHashTags = function(str){

        // Remove whitespace chars.
        str = str.replace(/\r?\n|\r/g, "");
        var words = str.split(" ");

        var nonHashWords = [];

        $.each(words, function(index, word){

            // Check if the word doesn't begin with #.
            if(word.indexOf("#") !== 0){
                nonHashWords.push(word);
            }

        });

        return nonHashWords.join(" ");

    };

    if ($("#instafeed").length) {
        var feed = new Instafeed(config);

        $loadMore.on('click', function(){
            console.log(feed);
            feed.next();
        });

        feed.run();
    }

};



/*
This function inits lazy load.
*/
sidneyGarber.initLazyLoad = function () {

    var s = {
        $selector: $("[data-original]"),
        config: {
            effect: "fadeIn"
        }
    };

    if (s.$selector.length) {
        s.$selector.lazyload(s.config);
    }

};



/*
This function inits our slick slider.
*/
sidneyGarber.initSlickSlider = function () {

    var s = {
        selector: ".js-slick-slider",
        $selector: $(".js-slick-slider"),
        config: {
            lazyLoad: 'ondemand',
            arrows: true,
            prevArrow: '<button type="button" class="slick-prev" title="Back"></button>',
            nextArrow: '<button type="button" class="slick-next" title="Next"></button>',
            speed: 250,
            fade: false,
            cssEase: 'ease',
            mobileFirst: true,
            dots: true,
            waitForAnimate: false,
            zIndex: 2
        }
    };

    /**
    @param {property} data.$slider - The slider where we are searching for the dot navigation.
    @param {property} data.adjustment - The adjustment amount for the dots.
    */
    var setDotAdjustment = function (data) {
        data.$slider.find(".slick-dots").css("bottom", data.adjustment);
    };

    var shouldAdjustDots = function ($slider) {
        return !$slider.hasClass("slick-slider--no-dots");
    };

    var findDotsForAdjustment = function ($slider) {

        var heights = [],
            height, offset = 10;

        // Get the heights in each slide.
        $.each($slider.find(".slick-slide"), function (index, slide) {
            height = $(slide).find(".js-adjust-dots").outerHeight(true);
            heights.push(height);
        });

        // Get the max slide height.
        var maxSlideHeight = heights.reduce(function (a, b) {
            return Math.max(a, b);
        });

        // Add offset to maxSlideHeight.
        maxSlideHeight = maxSlideHeight + offset;

        return {
            adjustment: maxSlideHeight,
            $slider: $slider
        };

    };

    var findSlidersForDotAdjustment = function () {

        s.$selector.each(function (index, slider) {

            if (shouldAdjustDots($(slider))) {

                $(slider).on("init", function () {
                    setDotAdjustment(findDotsForAdjustment($(slider)));
                });

            }

        });

    };

    if (s.$selector.length) {

        findSlidersForDotAdjustment();

        // Basic slick init.
        s.$selector.slick(s.config);

    }

    //Slick zoom intergration trigger on all slides
    $(document).ready(function() {
      $('.slick-arrow').on('click', function() {
        var t = $(this)
        t = t.parent().parent()
        t = t.find('.slick-track').children()
        for (var i = 0; i < t.length; i++) {
          if (t[i].classList.contains("slick-active")) {
            sidneyGarber.initJqueryZoom(i)
          }
        }
      })
    })
};


/*
J-query zoom
*/

sidneyGarber.initJqueryZoom = function (index) {
  if (index === undefined) {
    var $fig1 = $('figure')[1]
  } else {
    var $fig1 = $('figure')[index]
  }

  if ( !$('html').hasClass('touchevents') ) {
    $(document).ready(function(){
      $('.image-zoom')
         .css('display', 'block')
         .parent()
         .zoom({
           url: $(this).find( $fig1 ).attr('data-zoom'),
           duration: 400
         });
       });
  }
};


sidneyGarber.initMobileZoom = function(index) {
  var $img;
  $(document).ready(function() {
    if ($('html').hasClass('touchevents')) {
      var overlay;

      if (($('.slick-arrow').length > 0) === true) {
        $img = $('.slick-active .object-wrap--product-image figure').css('background-image')

        $('.slick-arrow').on('click', function() {
          $img = $('.slick-active .object-wrap--product-image figure').css('background-image')
        })
      } else {
        $img = $('.object-wrap--product-image figure').css('background-image')
      }

      $('.object-wrap--product-image').on('click touch', function(e) {
        e.stopPropagation()
        overlay = jQuery('<div id="overlay" class="mobile-zoom__toggled" > <div class="close-toggle"></div> </div>').css('background-image', $img);
        overlay.appendTo(document.body)

        //remove overlay
        $('.mobile-zoom__toggled').on('click touch', function() {
          overlay.remove()
        })
      })


    }
  })
}
