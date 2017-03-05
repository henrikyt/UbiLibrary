var noCache = new Date();

$(window).unload(function () {
    if (helperStateConnection)
        helperStateConnection.disconnect();
});

$(document).ready(function () {

    // CHANNEL LISTENERS

    if (window.location.href.indexOf('events=true') != -1)
        createEventHandlers();

    // ADDED BY tjh 16.12.2013
    // Flag to change the configuration of the standalone library displays
    if (window.location.href.indexOf('ubi=false') != -1) {
        $('#button_ubi').remove();
		$('#logo_ouka').after('<div id="logo_ubi" title="Palvelun tarjoaa UbiOulu (www.ubioulu.fi)"></div>');
    }

	if (window.location.href.indexOf('instance_id') != -1) {
		clickSessionCount.instance_id = gup('instance_id');
	}

    if (window.location.href.indexOf('hiddenstart') == -1) {
        $('#bg_full').fadeIn();
    } else {
        vars.canvas_height = 1200;
        vars.canvas_width = 1980;
    }

    // SESSION
    $(document).one('click', function () {
        session = true;
    });
    $(document).on('click', function () {
        sessionCount[sessionActiveApp][1]++;
		clickSessionCount.click++;
    });

    // LAYOUT
    $(".menu-container-large").css({width: vars.app_max_width / 2 - vars.content_padding, height: vars.app_max_height - vars.content_padding});
    $(".main-container-large").css({width: vars.app_max_width / 2 - vars.content_padding, left: vars.app_max_width / 2, height: vars.app_max_height - vars.content_padding});
    $(".menu-container-small").css({width: vars.app_max_width * 0.7 - vars.content_padding, height: vars.app_max_height - vars.content_padding});
    $(".main-container-small").css({width: vars.app_max_width * 0.3 - vars.content_padding, left: vars.app_max_width * 0.7, height: vars.app_max_height - vars.content_padding});

    //BUG FIX
    $("#helper_popup").children(".menu-container-large").css({height: 630});
    $("#helper_popup").children(".main-container-large").css({height: 630, left: 750});


    // MAIN
    $('button').button();
    $('.radio').buttonset();
    $('#menu').find('div').tooltip();
    $('#helper').tooltip();

    // MAP
    $('#map_main').accordion(vars.accordion_settings);
    $('#map_all').watch('display', function () {
        google.maps.event.trigger(map, 'resize');
        map.setZoom(10);
        map.panTo(new google.maps.LatLng(65.176689, 25.701177))
    });

    /*$('#element4 .element-min').one('click', function () {
     $('#map_popup').dialog('open');
     }) */

    $.getJSON('data/library.json', { "noCache": noCache }, function (data) {
        $.each(data, function (key, value) {
            var item = '<h1 id="i' + value['sid'] + '" onclick="mapSelectBack(\'' + null + '\',\'' + value['sid'] + '\',\'' + value['floor'] + '\',' + true + ')">' + key + '</h1><div>';
            if (value['img'])
                item += '<img class="map-img" src="' + value['img'] + '">';
            if (value['desc'])
                item += value['desc'] + '<br><br><br>';
            $.each(value['cat'], function (key, value2) {
//                item += '<button title="' + value2 + '" onclick="mapSelectBack(\'' + value['sid'] + '\',\'' + value['floor'] + '\',' + false + ')">' + key + '</button>';
                item += '<button onclick="mapSelectBack([' + value2[1] + '],\'' + value['sid'] + '\',\'' + value['floor'] + '\',' + false + ')" title="' + value2[0] + '" ">' + key + '</button>';
                $("#map_popup").append($('<a onclick="$(\'#map_popup\').dialog(\'close\');mapSelectBack([' + value2[1] + '],\'' + value['sid'] + '\',\'' + value['floor'] + '\',' + false + ')" style="color: ' + rainbow() + '"> ' + key + ' </a>'));
            })
            item += '</div>';
            $('#map_lib').append(item);
        });
        $('#map_lib').accordion(vars.accordion_settings);
        $('#map_lib button').button();
        $('#map_lib button').tooltip();

        $('#element4').find(".ui-accordion").on("accordionactivate", function (event, ui) {
            if (ui.newHeader.length) {
                ui.newHeader.parent().parent().animate({
                    scrollTop: ui.newHeader.offset().top - ui.newHeader.parent().parent().offset().top + ui.newHeader.parent().parent().scrollTop() - 120
                }, 'fast');
            }
        });

    });

    // FEEDBACK
    $('.feedback-input').keyboard(vars.keyboard_options);
    $.getJSON('data/questions.json', { "noCache": noCache }, function (data) {
        $.each(data, function (key, value) {
            var choises = value['choises'];
            var question = '<div class="feedback-question"><h1 class="ui-title">' + value['question'] + '</h1><div class="question">';
            if (value['type'] == 'radio') {
                for (var i = 0; i < choises.length; i++)
                    question += '<input id="' + value['id'] + i + '" type="radio" name="radio' + value['id'] + '" title="' + choises[i] + '" />' +
                        '<label for="' + value['id'] + i + '">' + choises[i] + '</label>';
            } else if (value['type'] == 'check') {
                for (var i = 0; i < choises.length; i++)
                    question += '<input id="' + value['id'] + i + '" type="checkbox" name="checkbox' + value['id'] + '" title="' + choises[i] + '" />' +
                        '<label for="' + value['id'] + i + '">' + choises[i] + '</label>';
            } else {
                question += '<input id="' + value['id'] + '" type="input" />';
            }
            $('#feedback_questions').append(question + '</div></div>');
        });

        $('#feedback_questions').find('.question').buttonset();
        $('#feedback_questions').find('input').keyboard(vars.keyboard_options);
    });

    $('#feedback_main').watch('display', function () {
        if ($(this).css('display') == "none") {
            var found = false;
            var res = $('#feedback_questions').children();
            $.each(res, function (key, value) {
                var e = $(value);
                var a = e.find(':checked');
                if (a.length > 0) {
                    found = true;
                }
                var a = e.find('input[type=input]');
                if (a.length > 0) {
                    found = true;
                }
            });
            var res = $('#feedback_free').children();
            $.each(res, function (key, value) {
                    var e = $(value);
                    var a = e.find('input[type=text]');
                    if (a.length > 1) {
                        found = true;
                    }
                }

            );
            if (found)
                $('#feedback_confirm').dialog('open');
        }
    });

    // PROGRESSBAR
    $("#progress").progressbar({});
    // $("#cloud_progress").progressbar({});

    // POPUPS

    $('#popup_small').dialog(vars.popup_dialog);
    vars.popup_dialog['width'] = 600;
    vars.popup_dialog['height'] = 350;
    $('#popup_big').dialog(vars.popup_dialog);
    vars.popup_dialog['title'] = 'Arvostelut';
    vars.popup_dialog['width'] = window.innerWidth - 500;
    vars.popup_dialog['height'] = 600;
    $('#reviews_popup').dialog(vars.popup_dialog);
    vars.popup_dialog['title'] = 'Ilmoitus';
    vars.popup_dialog['width'] = vars.app_max_width + 20;
    vars.popup_dialog['height'] = 850;
    $('#calendar_popup').dialog(vars.popup_dialog);
    vars.popup_dialog['title'] = 'Kirjasto suosittelee sinulle';
    $('#helper_popup').dialog(vars.popup_dialog);
    vars.popup_dialog['height'] = 900;
    vars.popup_dialog['width'] = 600;
    vars.popup_dialog['title'] = 'Kirjan paikka kirjastossa';
    $('#location_popup').dialog(vars.popup_dialog);
    $('#tag_popup').dialog({
            modal: true,
            maxHeight: 900,
            width: 900,
            autoOpen: false,
            draggable: false,
            resizable: false,
            closeText: "Sulje",
            title: "Asiasanat",
            show: {
                effect: "scale",
                duration: 400
            },
            hide: {
                effect: "scale",
                duration: 500
            },
            buttons: [
                { text: "Sulje", click: function () {
                    $(this).dialog("close");
                } }
            ]}
    );
    $('#map_popup').dialog({
            modal: true,
            height: 600,
            width: 1000,
            autoOpen: false,
            draggable: false,
            resizable: false,
            closeText: "Sulje",
            title: "Etsitkö jotain?",
            show: {
                effect: "scale",
                duration: 400
            },
            close: function () {
                var $this = $('#element4');
                $this.effect("transfer", {
                    to: "#map_button",
                    className: "ui-effects-transfer"
                }, 500, function () {
                });
            },
            buttons: [
                { text: "Sulje", click: function () {
                    $(this).dialog("close");
                } }
            ]}
    );
    $("#cloud_confirm").dialog({
        modal: true,
        height: 250,
        width: 500,
        autoOpen: false,
        draggable: false,
        resizable: false,
        closeText: "Sulje",
        show: {
            effect: "scale",
            duration: 500
        },
        hide: {
            effect: "scale",
            duration: 500
        },
        buttons: {
            "Kyllä, poista hakusanat": function () {
                $('#cloud_keywords').empty();
                var value = cloudKeep.value;
                if (value.indexOf(' ') != -1) {
                    var values = value.split(' ');
                    for (var i = 0; i < values.length - 1; i++) {
                        $("#cloud_keywords").append($('<a class="cloud-keyword" onclick="removeKeyWord($(this))" style="color: ' + rainbow() + '">' + values[i] + "\x18" + ' <div class="ui-icon-close ui-icon cloud-remove"></div></a>').hide().fadeIn(2000));
                    }
                    value = values[values.length - 1];
                }
                load(value + "\x18");
                cloudKeep.value = "";
                $(this).dialog("close");
            },
            "Ei, säilytä hakusanat": function () {
                var value = cloudKeep.value;
                if (value.indexOf(' ') != -1) {
                    var values = value.split(' ');
                    for (var i = 0; i < values.length - 1; i++) {
                        $("#cloud_keywords").append($('<a class="cloud-keyword" onclick="removeKeyWord($(this))" style="color: ' + rainbow() + '">' + values[i] + "\x18" + ' <div class="ui-icon-close ui-icon cloud-remove"></div></a>').hide().fadeIn(2000));
                    }
                    value = values[values.length - 1];
                }
                load(value + "\x18");
                cloudKeep.value = "";
                $(this).dialog("close");
            }
        }
    });

    $("#feedback_confirm").dialog({
        modal: true,
        height: 250,
        width: 500,
        autoOpen: false,
        draggable: false,
        resizable: false,
        closeText: "Sulje",
        show: {
            effect: "scale",
            duration: 500
        },
        hide: {
            effect: "scale",
            duration: 500
        },
        buttons: {
            "Kyllä": function () {
                $(this).dialog("close");
                feedback();
            },
            "Ei": function () {
                $(this).dialog("close");
            }
        }
    });

    // MENU
    mainMenuListeners(true);
    var $elements = $('#element_container').children('.element');
    $elements.css({width: vars.app_min_width,
        height: vars.app_min_height,
        top: vars.state_main_top,
        margin: vars.widget_margin});
    $.each($elements, function (i, v) {
        $(this).css('left', i * vars.widget_width + vars.state_main_left);
        $(this).children('.element-min').css({width: vars.app_min_width,
            height: vars.app_min_height});
        $(this).children('.element-max').css({width: vars.app_max_width,
            height: vars.app_max_height});
        $(this).one('click', function () {
            animateMenu($(this));
        });
    });


    //CALENDAR
    $('#calendar').fullCalendar(vars.calendar_options);
    $('#element1_max').watch('display', function () {
        setTimeout(function () {
            $('#calendar').fullCalendar('render')
        }, 500);
    });

    // CLOUD
    $("#cloud_main").accordion(vars.accordion_settings);
    $("#cloud_input").children('textarea').keyboard(vars.cloud_keyboard_options);
    $('#element3').find(".ui-accordion").on("accordionactivate", function (event, ui) {
        if (ui.newHeader.length) {
            ui.newHeader.parent().parent().animate({
                scrollTop: ui.newHeader.offset().top - ui.newHeader.parent().parent().offset().top + ui.newHeader.parent().parent().scrollTop() - 120
            }, 'fast');
        }
    });

    // HELPER
    $('#helper_main').accordion(vars.accordion_settings);
    $('#helper_popup').find(".ui-accordion").on("accordionactivate", function (event, ui) {
        if (ui.newHeader.length) {
            ui.newHeader.parent().parent().animate({
                scrollTop: ui.newHeader.offset().top - ui.newHeader.parent().parent().offset().top + ui.newHeader.parent().parent().scrollTop() - 120
            }, 'fast');
        }
    });
    // HINTS
    /*   $.getJSON('data/lib_msl.json', { "noCache": noCache }, function (data) {
     $.each(data, function (key, value) {
     var cat = value['category'];
     if (vars.hints_category_mappings["Suomen luetuimmat"].indexOf(cat) == -1) {
     vars.hints_category_mappings["Suomen luetuimmat"].push(cat);
     }
     createBookEntity('#hints_main', value, " " + cat.hashCode());
     });

     for (var i = 0; i < 100; i++) {
     var it = data[Math.floor(Math.random() * data.length)];
     if (createSmallBookEntity(it, '#hints_min'))
     break;
     }

     var selected = [];
     for (var j = 0; j < 20; j++) {
     for (var i = 0; i < 100; i++) {
     var it = data[Math.floor(Math.random() * data.length)];
     if ($.inArray(it['id'], selected) > -1)
     continue;
     if (createSubtleBookEntity(it)) {
     selected.push(it['id']);
     break;
     }
     }
     } */

    $.getJSON('data/lib_all.json', { "noCache": noCache }, function (data) {

        for (var i = 0; i < 100; i++) {
            var it = data[Math.floor(Math.random() * data.length)];
            if (createSmallBookEntity(it, '#cloud_min'))
                break;
        }

        for (var i = 0; i < 100; i++) {
            var it = data[Math.floor(Math.random() * data.length)];
            if (createSmallBookEntity(it, '#hints_min'))
                break;
        }

        var categories = {};

        $.each(data, function (key, value) {
            if (value) {
                var cat = "";
                if (value['category'] != "") {
                    var mcat = value['category'];
                    if (!(mcat in categories))
                        categories[mcat] = [];
                    cat = mcat;
                }
                if (value['subcategory'] != "") {
                    var cat = value['subcategory'];
                    if (categories[mcat].indexOf(cat) == -1)
                        categories[mcat].push(cat);
                }
                createBookEntity('#hints_main', value, " " + cat.hashCode());
            }
        });
        for (var cat in categories) {
            var desc = vars.hints_category_descriptions[cat];
            if (!desc)
                desc = 'Oulun kaupunginkirjasto-maakuntakirjasto';
            $('<div class="book-header" onclick="showHints(\'' + cat.hashCode() + '\')"><img class="book-img" src="files/np.png">' +
                '<div class="book-title">' + cat + '</div>' +
                '<div class="book-category">' + desc + '</div></div>').appendTo('#hints_menu');
            var scat = "";
            for (var i in categories[cat]) {
                var tmp = categories[cat][i];
                scat += '<button onclick="showHints(\'' + tmp.hashCode() + '\')">' + tmp + '</button>';
            }
            $('<div>' +
                scat +
                '</div>').appendTo('#hints_menu');
        }
        ;
        var settings = jQuery.extend(true, {}, vars.accordion_settings);
        $("#hints_menu").find('button').button();
        $("#hints_main").accordion(settings);
        $("#hints_menu").accordion(vars.accordion_settings);
        $("#hints_menu").one('click', function () {
            $('#hints_help').fadeOut();
        });

        var selected = [];
        for (var j = 0; j < 20; j++) {
            for (var i = 0; i < 100; i++) {
                var it = data[Math.floor(Math.random() * data.length)];
                if ($.inArray(it['id'], selected) > -1)
                    continue;
                if (createSubtleBookEntity(it)) {
                    selected.push(it['id']);
                    break;
                }
            }
        }
        $('#subtle_covers').bjqs(vars.slide_subtle_options);
        $('#hints_menu').parent().parent().find(".ui-accordion").on("accordionactivate", function (event, ui) {
            if (ui.newHeader.length) {
                ui.newHeader.parent().parent().animate({
                    scrollTop: ui.newHeader.offset().top - ui.newHeader.parent().parent().offset().top + ui.newHeader.parent().parent().scrollTop() - 120
                }, 'fast');
            }
        });
    });

    //WIDGETS
    $.getJSON('services/cal_next.php', { "noCache": noCache }, function (data) {
        if (data.length != 0) {
            var start = new Date(data['start']);
            var started = start.getUTCHours() + ":" + (start.getMinutes() < 10 ? '0' : '') + start.getMinutes();
            $('#cal_next').append('' +
                '<div class="min-cal-time">' + started + '</div>' +
                '<div class="min-cal-title">' + data['title'] + '</div>' +
                '<div class="min-cal-month">' + data['location'] + " " + start.getDate() + "." + (start.getMonth() + 1) + "." + start.getFullYear() + '</div>'
            );
        }
    });

    // EVENTS
    $.getJSON('data/rss_custom.json', { "noCache": noCache }, function (data) {
        $.each(data, function (key, value) {
            createEvent(value);
        });
        $("#slides").bjqs(vars.slide_options);
    });

    // MAP
    mapSlideDown();


    // THEME
    var col = ['green', 'blue', 'orange', 'gray'];
    changeTheme(col[Math.floor(Math.random() * col.length)])

    /*
     helperAge = 'ADULT';
     helperGender = 'FEMALE';
     loadHelper();
     bounceHelper(0);
     */

    if (window.location.href.indexOf('hiddenstart=true') == -1) {

        $('#blocker').hide();
        setTimeout(function () {
            $('#container').animate({opacity: 1});
        }, 1500)

        setTimeout(function () {
            $('#button_ubi').fadeOut('slow', function () {
                $('#button_ubi').fadeIn('slow', function () {
                    $('#button_ubi').tooltip('open');
                });
            });
        }, 10000);
        setTimeout(function () {
            $('#button_ubi').tooltip('close');
        }, 20000);
    }
});