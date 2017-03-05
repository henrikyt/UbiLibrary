var oldCal = "";
var daynames = ['su', 'ma', 'ti', 'ke', 'to', 'pe', 'la'];

function loadTimeline(location) {
    // TIMELINE
    
    var e = document.getElementById('timeline_container');
    e.removeChild(document.getElementById('timeline'));
    var j = document.createElement("div");
    j.setAttribute("id", "timeline");
    e.appendChild(j);
    createStoryJS({
        type: 'timeline',
        width: '100%',
        height: '100%',
        source: 'data/' + location + '.json',
        embed_id: 'timeline',
        start_at_end: false,							//OPTIONAL START AT LATEST DATE
        start_at_slide: '0',							//OPTIONAL START AT SPECIFIC SLIDE
        start_zoom_adjust: '4',							//OPTIONAL TWEAK THE DEFAULT ZOOM LEVEL
        //    hash_bookmark:		true,							//OPTIONAL LOCATION BAR HASHES
        font: 'Bevan-PotanoSans',				//OPTIONAL FONT
        debug: false,							//OPTIONAL DEBUG TO CONSOLE
        lang: 'fi',							//OPTIONAL LANGUAGE
        //    maptype:			'watercolor',					//OPTIONAL MAP STYLE
        css: 'styles/timeline/timeline.css',		//OPTIONAL PATH TO CSS
        js: 'scripts/lib/timeline/timeline.js'	//OPTIONAL PATH TO JS

    });
}


function loadCalEvent(event) {
    var cal = $('#calendar_content');
    var cost = "";
    cal.fadeOut(500, function () {
            cal.empty();
            var url = event['url'];
            if (url) {
                if (event['url'].indexOf('https') == -1)
                    url = '<button class="cal-button" onclick="loadCalIframe(\'' + event['url'] + '\')">Ilmoitus</button>';
                else
                    url = "";
            } else
                url = "";
            if (event['cost'])
                cost = '<div class="cal-location">Hinta ' + event['cost'] + '</div>';
            var start = new Date(event['start']);
            var end = " - päättymisaikaa ei määritelty";
            if (!event['noEnd']) {
                end = new Date(event['end']);
                end = ' - ' + daynames[end.getDay()] + " " + " " + end.getDate() + "." + (end.getMonth() + 1) + ". " + end.getHours() + ":" + (end.getMinutes() < 10 ? '0' : '') + end.getMinutes();
            }

            start = daynames[start.getDay()] + " " + start.getDate() + "." + (start.getMonth() + 1) + ". " + start.getHours() + ":" + (start.getMinutes() < 10 ? '0' : '') + start.getMinutes();
            cal.append('' +
                '<div class="cal-time">' + start + end + '</div>' +
                '<div class="cal-title ui-title">' + event['title'] + '</div>' +
                '<div class="cal-desc">' + event['description'] + '</div>' +
                '<div class="cal-location">' + event['location'] + '</div>' +
                cost +
                url +
                '');
            cal.find('button').button();
            cal.fadeIn(500);
        }
    )
    ;
}

function loadCalIframe(url) {
    sessionLaunher('calendar');
    var cal = $('#calendar_popup');
    cal.empty();
    cal.append('<iframe class="cal-popup" src="' + url + '"/>');
    cal.append('<div class="popup-blocker" />');
    cal.dialog('open');
    $('.ui-widget-overlay').on('click', function () {
        $('#calendar_popup').dialog('close');
        sessionActiveApp = sessionPreviousApp;
    });
}

function loadCal($e) {
    var url = $e.attr('name');
    if (url in vars.calendar_lib)
        url = vars.calendar_lib[url];
    else
        url = 'services/cal_ouka.php?cat=' + url;
    if ($e.hasClass('button-up')) {
        $e.removeClass('button-up');
        $e.addClass('button-down');
        $e.css('background-color', $e.css('outline-color'));
        $e.css('color', 'white');
        $('#calendar').fullCalendar('addEventSource', {url: url, color: $e.css('background-color')});
    } else {
        $e.removeClass('button-down');
        $e.addClass('button-up');
        $e.css('outline-color', $e.css('background-color'));
        $e.css('background-color', 'buttonface');
        $e.css('color', 'black');
        $('#calendar').fullCalendar('removeEventSource', {url: url});
    }
}

function loadCalRadio(url) {
    if (url == "tyhja")
        url = "";
    else {
        var url = 'services/cal_ouka.php?cat=' + url;
        $('#calendar').fullCalendar('addEventSource', {url: url, color: $('.ui-title').css('color'), allDayDefault: true});
    }
    $('#calendar').fullCalendar('removeEventSource', {url: oldCal});
    oldCal = url;
}

function createEvent(value) {
    var start = new Date(value['start']);
    start = start.getDay() + "." + (start.getMonth() +1) + " " + start.getFullYear();
    if (value['background']) {
        $('#news').append('<li>' +
            '<img title="' + value['title'] + '" src="' + value['background'] + '" />' +
            '</li>');
    } else {
        if (value['image']) {
            $('#news').append('<li>' +
                '<div class="news-title ui-news-title">' + value['title'] + '</div>' +
                '<div class="news-time">' + start + '</div>' +
                '<div class="news-content">' +
                '<img class="news-image" src="' + value['image'] + '" />' + value['description'] +
                '</div>' +

                '</li>');
        } else {
            $('#news').append('<li>' +
                '<div class="news-title ui-news-title">' + value['title'] + '</div>' +
                '<div class="news-time">' + start + '</div>' +
                '<div class="news-content">' + value['description'] + '</div>' +
                '</li>');
        }
    }
}