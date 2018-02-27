// Get our main-header's height.
sidneyGarber.getHeaderHeight = function() {

  var height = $(".main-header").outerHeight(true);
  var $activeDropdown = $(".desktop-nav__dropdown--active");

  if ($activeDropdown.length) {
    height += $activeDropdown.eq(0).outerHeight(true);
  }

  return height;

};



// Provide an offset from our fixed main-header.
sidneyGarber.headerOffset = function() {

  var s = {
    $selector: $(".js-header-offset")
  };

  var bindUI = function() {

    $(window).on("resize", function(e) {
      setOffsetsForEach();
    });

  };

  var setOffsetsForEach = function() {

    var prop;

    $.each(s.$selector, function(index, item) {
      prop = $(item).data("offset-prop") || "margin-top";
      setOffset($(item), prop);
    });

  };

  /*
  @param {jQuery} $item - The element to apply the offset to.
  @param {CSS Propery} prop - The CSS property the offset will apply to.
  @param {number} offset - The offset value.
  */
  var setOffset = function($item, prop) {
    $item.css(prop, sidneyGarber.getHeaderHeight());
  };

  var init = function() {
    bindUI();
    setOffsetsForEach();
  };

  init();

};



// Sorry, all these shopify forms in overlays gets complicated.
sidneyGarber.toggleForm = function(locationHash, $toggle, formName) {

  // Toggle form if specified hash is present.
  if (location.hash === locationHash) {
    $toggle.eq(0).trigger("click");
    $("." + formName).addClass("form-overlay--success");
  }

  // Close on overlay click.
  $("." + formName).on("click", function(e) {

    if ($("html").hasClass(formName + "--toggled")) {

      if ($(e.target).hasClass("form-overlay__inner") || $(e.target).hasClass("form-overlay")) {
        // Trigger only one.
        $toggle.eq(0).trigger("click");
      }

    }

  });

  $toggle.on("click", function() {

    if (location.hash === locationHash) {
      location.hash = "";
    }

    setTimeout(function() {
      $("." + formName).removeClass("form-overlay--success");
    }, 250);

  });

};



sidneyGarber.headerSearch = function() {

  var $form = $(".js-header-search");

  $form.on("submit", function(e) {

    var $self = $(this);
    var $submit = $self.find(".js-header-search-submit");
    var $input = $self.find(".js-header-search-input");

    if ($input.val().length === 0) {

      e.preventDefault();

      $form.toggleClass("desktop-header__search--expanded");

      if ($form.hasClass("desktop-header__search--expanded")) {
        $input.focus();
      } else {
        $input.blur();
      }

    }

  });

};



sidneyGarber.headerDropdowns = function() {

  // Prevent click if no hover media.
  if (!matchMedia("(hover:hover)").matches) {
    $(".desktop-nav__dropdown-summary").on("click", function(e) {
      e.preventDefault();
    });
  }

};

sidneyGarber.filterInit = function() {

  var $toggle = $('.filter-toggle')

  $toggle.on('click', function() {
    if ($('.filter-toggle-section').css('display') == "none") {

      if ($('#sort-menu').css('display') == 'inline-grid') {
        $('#sort-menu').css('display', 'none')
      }

      if ($('html').hasClass('touchevents')) {
        $('.filter-toggle-section').css('display', 'table')
      } else {
        $('.filter-toggle-section').css('display', 'inline-flex')
      }
    } else {
      $('.filter-toggle-section').css('display', 'none')
    }
  })

  //SORT TOGGLE
  $('.sort-trigger').on('click', function() {
    var list = $('.dropdown-menu')
    if (list.css('display') == "none") {
      if ($('filter-toggle-section').css('display') !== "none") {
        $('.filter-toggle-section').css('display', 'none')
      }
      list.css("display", "inline-grid")
    } else {
      list.css("display", "none")
    }
  })

  //Arrow toggle class
  $('.filter-toggle').on('click', function() {
    var $toggle = $('.filter-toggle')
    if ($toggle.hasClass('arrow-right')) {
      $toggle.removeClass('arrow-right')
      $toggle.addClass('arrow-down')
    } else {
      $toggle.removeClass('arrow-down')
      $toggle.addClass('arrow-right')
    }
  })

  $('.sort-trigger').on('click', function() {
    var $toggle = $('.sort-trigger')
    if ($toggle.hasClass('arrow-right')) {
      $toggle.removeClass('arrow-right')
      $toggle.addClass('arrow-down')
    } else {
      $toggle.removeClass('arrow-down')
      $toggle.addClass('arrow-right')
    }
  })

  function formatCurrency($selector) {
    var prices = $selector

    if (prices !== undefined) {
      if (prices.length > 1) {
        Object.keys(prices).forEach(function(key) {
          var value = prices[key].innerText
          if (value !== undefined) {
            value = value.split('-')
            if (value[0].includes('price')) {
              var first = value[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              var second = value[2].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
              var strCheck = /under|over/.test(value[1])

              if (!strCheck) {
                prices[key].innerText = ('$' + first + ' - $' + second);
              } else {
                prices[key].innerText = (first + ' $' + second);
              }
            }
          }
        })
      } else {
        var text = prices.text().split('-')
        if (text[0].includes('price')) {
          var first = text[1].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          var second = text[2].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          var strCheck = /under|over/.test(text[1])

          if (!strCheck) {
            prices[0].innerText = ('$' + first + ' - $' + second);
          } else {
            prices[0].innerText = (first + ' $' + second);
          }
        }
      }
    }

  }

  $(document).ready(function() {
    formatCurrency($('.price-tags a[href*="price-"]'))
    formatCurrency($('.price-tag'))
    formatCurrency($('.price-tags .active'))
  })
}

sidneyGarber.sortKeywords = function() {

  $.urlParam = function(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    return results || 0;
  }

  $(document).on('click', '.js-sort-cookie', function(e) {
    $this = $(this);
    sortKeyWord = $this.text();
    $.cookie('collection_sort_keyword', sortKeyWord, {
      expires: 7,
      path: '/'
    });
  });

  var collectionSortKeyword = $.cookie('collection_sort_keyword');
  if (collectionSortKeyword && $.urlParam('sort_by')) {
    $('.sort-trigger').text(collectionSortKeyword);
  }

}
