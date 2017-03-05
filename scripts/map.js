var map, shownMap;
var currentFloor = 1;
var loc = {
    "paa": [65.015328, 25.463813, 0],
    "as": [65.198660, 25.395749, 1],
    "ha": [65.176696, 25.355039, 2],
    "ja": [65.091997, 25.688877, 3],
    "ka": [64.955612, 25.532708, 4],
    "kai": [65.06113, 25.48085, 5],
    "kar": [65.005375, 25.481499, 6],
    "kau": [64.993477, 25.514993, 7],
    "ke": [65.128829, 25.352276, 8],
    "ki": [65.129136, 25.770639, 9],
    "ko": [65.045229, 25.447735, 10],
    "ma": [64.983134, 25.567196, 11],
    "mar": [65.210035, 25.31554, 12],
    "my": [65.018953, 25.554364, 13],
    "ou": [64.934662, 25.400625, 14],
    "pa": [65.086398, 25.40519, 15],
    "pu": [65.041933, 25.478398, 16],
    "ra": [65.06797, 25.420772, 17],
    "ri": [65.081493, 25.455632, 18],
    "tu": [65.025783, 25.476489, 19],
    "yi": [65.369162, 25.825417, 20],
    "yk": [65.029318, 26.152641, 21]

}
var points = {};

function initialize() {
    var marker;

    var myStyles = [
        {
            featureType: "poi",
            elementType: "labels",
            stylers: [
                { visibility: "off" }
            ]
        }
    ];

    var mapProp = {
        center: new google.maps.LatLng(65.176689, 25.801177),
        zoom: 10,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: myStyles
    };
    map = new google.maps.Map(document.getElementById("google_map"), mapProp);
    var j = 0;
    $.each(loc, function (key, value) {
        marker = new google.maps.Marker({
            shape: {coords: [0, 0, 500, 500], type: "rect"},
            position: new google.maps.LatLng(value[0], value[1])
        });
        google.maps.event.addListener(marker, 'click', function () {
            $("#map_main").accordion("option", "active", loc[key][2]);
            marker.setAnimation(google.maps.Animation.DROP);
        });
        points[key] = marker;
        marker.setMap(map);
        j++;
    });

}

google.maps.event.addDomListener(window, 'load', initialize);

function goToMarker(e) {
    map.setZoom(13);
    var loc = points[e];
    map.panTo(loc.getPosition());
    loc.setAnimation(google.maps.Animation.DROP);
    loc.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function () {
        loc.setAnimation(null);
    }, 2800)
}

function changeMap() {
    $('.map-header').toggleClass('ui-app-header-down');
    if ($('#map_all').css('display') == 'none') {
        $('#map_loc').fadeOut(500, function () {
            $('#map_all').fadeIn(500);
        });
    } else {
        $('#map_all').fadeOut(500, function () {
            $('#map_loc').fadeIn(500);
        });
    }
}

function mapSlideUp() {
    var floors = $('#map_floors');
    var pos = Math.round(parseInt(floors.css('top')) / 100) * 100;
    var com = Math.round(vars.map_position / 100) * 100
    if (pos != com) {
        floors.animate({
            top: vars.map_position
        });
        $('#m3e').animate({
            opacity: '0.2'
        });

        $('#m2e').animate({
            opacity: '1'
        });

        $('#m1e').animate({
            opacity: '0.2'
        });
        mapShowCategory('m2');
        $('#map_down').fadeIn();
        currentFloor = 2;
    } else {
        floors.animate({
            top: pos + 710
        });
        $('#m3e').animate({
            opacity: '1'
        });

        $('#m2e').animate({
            opacity: '0.2'
        });

        $('#m1e').animate({
            opacity: '0.2'
        });

        mapShowCategory('m3');
        $('#map_up').fadeOut();
        currentFloor = 3;
    }
}
function mapSlideDown() {
    var floors = $('#map_floors');
    var pos = Math.round(parseInt(floors.css('top')) / 100) * 100;
    var com = Math.round(vars.map_position / 100) * 100
    if (pos != com) {
        floors.animate({
            top: vars.map_position
        });
        $('#m3e').animate({
            opacity: '0.2'
        });

        $('#m2e').animate({
            opacity: '1'
        });

        $('#m1e').animate({
            opacity: '0.2'
        });
        mapShowCategory('m2');
        $('#map_up').fadeIn();
        currentFloor = 2;
    } else {
        floors.animate({
            top: pos - 790
        });
        $('#m3e').animate({
            opacity: '0.2'
        });

        $('#m2e').animate({
            opacity: '0.2'
        });

        $('#m1e').animate({
            opacity: '1'
        });
        mapShowCategory('m1');
        $('#map_down').fadeOut();
        currentFloor = 1;
    }
}

function mapSelect(item) {
    $.each($('#map_lib h1'), function (key, value) {
        var id = $(value).attr('id');
        if ('i' + item == id) {
            $("#map_lib").accordion("option", "active", key);
        }
    })
}

function mapSelectBack(loc, item, floor, select) {
    if (parseInt(floor) < currentFloor) {
        mapSlideDown();
    }
    if (parseInt(floor) < currentFloor) {
        setTimeout(function () {
            mapSlideDown()
        }, 510);
    }
    if (parseInt(floor) > currentFloor) {
        mapSlideUp();
    }
    if (parseInt(floor) > currentFloor) {
        setTimeout(function () {
            mapSlideUp()
        }, 510);
    }
    if (!select) {
        $('#map_pointer').appendTo($('#' + item).parent());
        $('#map_pointer').css({top: loc[1], left: loc[0]});
        $('#map_pointer').fadeIn();
        $('#map_pointer').effect("highlight", {}, 1000);
        setTimeout(function () {
            $('#map_pointer').effect("highlight", {}, 1000);
        }, 1000)
        mapSelect(item);
    } else {
        $('#map_pointer').fadeOut();
        $('#' + item).effect("highlight", {}, 1000);
        setTimeout(function () {
            $('#' + item).effect("highlight", {}, 1000);
        }, 1000)
        setTimeout(function () {
            $('#' + item).effect("highlight", {}, 1000);
        }, 2000)
    }
}

function mapShowCategory(item) {
    if (item == 'm1') {
        item = '1. kerros';
    } else if (item == 'm2') {
        item = '2. kerros';
    } else if (item == 'm3') {
        item = '3. kerros';
    }
    $('#map_floor_number').text(item);
    $('#map_floor_number').fadeIn(400, function () {
        $('#map_floor_number').fadeOut(400);
    });

}

function mapPing(key, value) {

    //$('#' + item).effect("highlight", {}, 1000);
}