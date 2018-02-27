sidneyGarber.partnerMaps = function(){

    var s = {
        $mapToggle: $(".js-partner-map-toggle"),
        $map: $(".js-partner-map"),
        $close: $(".partner-maps__close"),
        $mapOverlay: $(".js-partner-maps"),
        mapOverlayToggled: "partner-maps--toggled",
        mapToggled: "partner-maps__inner--toggled",
        mapWrap: ".partner-maps__inner"
    };

    var toggleMapOverlay = function(method){
        
        switch (method) {

            case "add":
                s.$mapOverlay.addClass(s.mapOverlayToggled);
                break;
            case "remove":
                s.$mapOverlay.removeClass(s.mapOverlayToggled);
                break;
            case "toggle":
                s.$mapOverlay.toggleClass(s.mapOverlayToggled);
                break;
        }

    };

    var getMap = function(mapIndex){

        if(typeof(mapIndex) === "number"){
            $map = s.$map.filter("[data-map-index='" + mapIndex + "']").parents(s.mapWrap);
        } else {
            $map = $(s.mapWrap);
        }

        return $map;

    };

    var toggleMap = function(method, mapIndex){

        // Get the map.
        var $map = getMap(mapIndex);

        switch (method) {

            case "add":
                $map.addClass(s.mapToggled);
                break;
            case "remove":
                $map.removeClass(s.mapToggled);
                break;
            case "toggle":
                $map.toggleClass(s.mapToggled);
                break;
        }

    };

    var bindUI = function(){

        s.$mapToggle.on("click", function(){

            var mapIndex = $(this).data("map-index");

            // Show clicked map and overlay.
            toggleMapOverlay("add");
            toggleMap("add", mapIndex);

        });

        s.$mapOverlay.on("click", function(e){

            if( $(e.target).hasClass("partner-maps__inner") || $(e.target).hasClass("partner-maps") ){
                toggleMapOverlay("remove");
                toggleMap("remove");
            }

        });

        s.$close.on("click", function(){
            toggleMapOverlay("remove");
            toggleMap("remove");
        });

    };

    var init = function(){
        bindUI();
    };

    init();

};