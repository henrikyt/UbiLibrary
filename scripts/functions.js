var menuState = [0, 0, 0, 0, 0];
var mainShown = true;

var shownHint = "Kirjaston valinnat".hashCode();
var helperTurn = 0;

var debug = true;

var progressPid = 0;
var conId2 = 0;
var bpid = null;

var helperName = "";
var helperGender = "";
var helperAge = "";
var helperShown = false;
var helperTooltip = true;

function mainMenuListeners(on) {
    if (on) {
        $('.main').on('click', function () {
            mainMenu()
        });
    }
    else {
        $('.main').off('click');
        setTimeout(function () {
            mainMenuListeners(true)
        }, vars.main_timeout);
    }
}

function mainMenu() {
    if (mainShown) {
        $('#ads').fadeOut();
        $('#events').fadeOut();
        setTimeout(function () {
            $('#ads').fadeIn();
            $('#events').fadeIn();
        }, 2000);
        return;
    }
    sessionCounter('main');
    mainShown = true;
    $('#close').hide();
    $('#clock').animate({left: 100}, 500);
    $('#clock_date').animate({left: 350}, 500);
    $('#ads').fadeIn(500);
    $('#events').fadeIn(500);
    $('#themes').animate({opacity: 1}, function () {
        $('#themes').children().css('visibility', 'visible');
    });
    mainMenuListeners(false);
    var $nodes = $('#element_container').children('.element');
    for (var i in menuState) {
        if (menuState[i] == 1) {
            menuState[i] = 0;
            $nodes.eq(i).children('.element-max').fadeOut(vars.fadeout_effect);
        }
    }
    $.each($nodes, function () {
        $(this).off('click');
    })
    $.each($nodes, function (i, v) {
        $(this).animate({
            width: vars.app_min_width,
            height: vars.app_min_height,
            top: vars.state_main_top,
            left: i * vars.widget_width + vars.state_main_left,
            margin: vars.widget_margin
        }, vars.minimize_effect, function () {
            $(this).children(".element-min").fadeIn(vars.fadein_effect);
            $(this).one('click', function () {
                animateMenu($(this));
            });
        })
    });
}

function animateMenu($e) {
    mainShown = false;
    if ($e.children('.element-max').eq(0).css('display') != "none")
        return;
    sessionCounter('e' + $e.index());
    $('#close').hide();
    $('#ads').fadeOut(500);
    $('#events').fadeOut(500);
    $('#themes').animate({opacity: 0}, function () {
        $('#themes').children().css('visibility', 'hidden');
    });
    $('#clock').animate({left: 420}, 500);
    $('#clock_date').animate({left: 650}, 500);
    mainMenuListeners(false);
    var j = 0;
    var $nodes = $e.parent().children();
    $.each($nodes, function () {
        $(this).off('click');
    })
    $.each($nodes, function (i, v) {
        if (i == $e.index()) {
            $(this).children(".element-min").fadeOut(vars.fadeout_effect);
            menuState[i] = 1;
            $(this).animate({
                    width: vars.app_max_width,
                    height: vars.app_max_height,
                    top: vars.state_app_top,
                    left: vars.state_app_left,
                    margin: vars.app_margin
                }
                , vars.maximize_effect, function () {
                    $('#close').fadeIn();
                    $(this).children(".element-max").fadeIn(vars.fadein_effect);
                    $.each($('#element_container').children('.element'), function () {
                        $(this).one('click', function () {
                            animateMenu($(this));
                        });
                    });
                });
        } else {
            if (menuState[i] == 1) {
                menuState[i] = 0;
                $(this).children(".element-max").fadeOut(vars.fadeout_effect);
                $(this).animate({
                        width: vars.app_min_width,
                        height: vars.app_min_height,
                        top: (j * vars.widget_height) + vars.state_app_widgets_top,
                        left: vars.state_app_widgets_left,
                        margin: vars.widget_margin}
                    , vars.minimize_effect, function () {
                        $(this).children(".element-min").fadeIn(vars.fadein_effect);

                    });
            } else {
                $(this).animate({
                        top: (j * vars.widget_height) + vars.state_app_widgets_top,
                        left: vars.state_app_widgets_left,
                        margin: vars.widget_margin}
                    , vars.minimize_effect, function () {

                    });
            }
            j++;
        }
    });
}

function showHints(cat) {
    setTimeout(function () {
        $("#hints_main").fadeOut(100, function () {
            $('.' + shownHint).hide();
            $('.' + cat).show();
            shownHint = cat;
            $("#hints_main").accordion("refresh");
            $("#hints_main").accordion("option", "active", false);
            $("#hints_main").fadeIn(100);
        });
    }, 300);
}

function createBookEntity(parent, value, cat) {
    var st = "", ic = "", img = "", but = "", but2 = "", but3 = "", abs = "", auf = "", aus = "", pub = "", typ = "", loc = "";
    if (value['abstract'])
        abs = value['abstract'];
    if (value['publisher'])
        pub = '<div>Julkaisija: ' + value['publisher'] + '</div>';
    if (value['author_fn']) {
        auf = ' : ' + value['author_fn'];
        if (value['author_sn'])
            aus = ' ' + value['author_sn'];
    } else if (value['author_sn']) {
        aus = ' : ' + value['author_sn']
    }
    if (value['type'])
        typ = '<div>Tyyppi: ' + value['type'] + " " + value['length'] + '</div>';
    if (cat)
        st = ' style="display:none"';
    if (value['book_id'])
        but3 = '<button class="book-button" onclick="getAvailable(\'' + value['book_id'] + '\',\'' + value['name'] + '\',$(this))" class="book-button">Saatavuus</button>';
    if (value['location']) {
        if (value['type'].indexOf('Kirja') != -1 && locationCheck(value['location']))
            but2 = '<button onclick="showMap(\'' + value['location'] + '\',\'' + value['tags'] + '\',\'' + value['name'] + '\')" class="book-button">Paikka</button>';
        loc = "<div>" + value['location'] + "</div>"
    }
    else
        but2 = '<button onclick="showMessage(\'Valitettavasti tätä kirjaa ei ole saatavilla Oulun kirjastoissa. Kirjasta voi kuitenkin olla käännety teos saatavilla. Koeta hakea teosta kirjan tai kirjailijan nimellä ETSI KIRJAA osiosta.\')" class="book-button">Ei kirjastossa</button>';
    if (value['picture'])
        img = '<img class="book-img" src="' + value['picture'] + '"></img>';
    else
        img = '<img class="book-img" src="files/np.png"/>';
    if (value['rating']) {
        var r = Math.round(parseFloat(value['rating']));
        if (r > 0) {
            but = '<button class="book-button" onclick="getReviews(\'' + value['isbn'] + '\',\'' + value['name'] + '\',$(this))">Arvostelut</button>';
            ic = '<div class="book-star-container">';
            for (var i = 0; i < r; i++)
                ic += '<img class="book-star" src="files/star.png"/>';
            ic += '</div>';
        }
    }
    $('<h3' + st + ' class="book-header' + cat + '">' + img +
        '<div class="book-title">' + value['name'] + auf + aus + '</div>' + ic +
        '</h3>').appendTo(parent);
    if (value['picture'])
        img = '<img class="book-img-large" src="' + value['picture'] + '"></img>';
    else
        img = '';
    var but4 = '<button class="book-button" onclick="showKeywords(\'' + value['name'] + '\',\'' + value['author_fn'] + ' ' + value['author_sn'] + '\',\'' + value['tags'] + '\')">+</button>';
    var but5 = '<button class="book-button" onclick="findSimilar(\'' + value['tags'] + '\',0)">Samanlaisia</button>';
    $('<div' + st + ' class="book-content' + cat + '">' +
        '<div class="book-abstract">' + img + abs + pub + typ + loc +
        '<br>' + but + but2 + but3 + but5 + but4 + '</div>' +
        '</div>').appendTo(parent);
    $(parent).find('button').button();

}

function createSmallBookEntity(value, parent) {
    var ic = "", img = "";

    if ((value['author_fn'] + " " + value['author_sn'] + value['name']).length > 120)
        return false;

    if (!value['picture'])
        return false;
    else
        img = '<img class="min-img" src="' + value['picture'] + '"></img>';
    if (!value['rating']) {
        return false
    } else {
        var r = Math.round(parseFloat(value['rating']));
        if (r > 0) {
            ic = '<div class="min-star-container">';
            for (var i = 0; i < r; i++)
                ic += '<img class="book-star" src="files/star.png"/>';
            ic += '</div>';
        }
    }
    $(img + '<div class="min-title">' + value['name'] + ' <br> ' +
        value['author_fn'] + ' ' + value['author_sn'] + '</div>' + ic
    ).appendTo(parent);
    return true;
}

function createSubtleBookEntity(value) {
    var ic = "", img = "";
    if (!value['picture'])
        return false;
    else
        img = '<img class="subtle-img" src="' + value['picture'] + '"></img>';
    if (value['rating'] == "0") {
        return false;
    } else {
        var r = Math.round(parseFloat(value['rating']));
        if (r > 0) {
            ic = '<div class="subtle-star-container">';
            for (var i = 0; i < r; i++)
                ic += '<img class="book-star" src="files/star.png"/>';
            ic += '</div>';
        }
    }
    $('#subtle_slider').append('<li>' +
        '<div>' + img + ic + '</div>' +
        '</li>');
    return true;
}

function showKeywords(name, author, words) {
    words = words.split(';');
    var result = '<a onclick="searchKeyWord2(\'' + author + '\',true)"> Tekijän muut teokset: <span style="color: ' + rainbow() + '"> ' + author + ' </span></a><br>';
    result += '<a onclick="searchKeyWord2(\'' + name + '\',false)"> Muut versiot teoksesta: <span style="color: ' + rainbow() + '"> ' + name + ' </span></a><br><br>Asiasanat: ';
    for (var i = 0; i < words.length; i++) {
        if (words[i]) {
            result += '<a onclick="searchKeyWord(\'' + words[i] + '\')" style="color: ' + rainbow() + '">' + words[i] + ' </a>';
        }
    }
    $('#tag_popup').empty();
    $('#tag_popup').append(result);
    $('#tag_popup').dialog('option', 'title', 'Asiasanat teokselle ' + name);
    $('#tag_popup').dialog('open');
    $('.ui-widget-overlay').on('click', function () {
        $('#tag_popup').dialog('close');
        sessionActiveApp = sessionPreviousApp;
    });
}

function findSimilar(keywords, nturn) {
    if ($('#element3 .element-max').css('display') == "none") {
        animateMenu($('#element3'));
        $('#cloud_keywords').empty();
    }
    con_id = guid();
    $.ajax({
        type: 'GET',
        url: 'services/similar.php?turn=' + nturn + '&keywords=' + keywords,
        dataType: 'json',
        contentType: 'application/json',
        timeout: 30000,
        cache: false,
        headers: {'id': con_id},
        error: function (data, textStatus, request) {
            console.log(textStatus);
        },
        success: function (data, textStatus, request) {
            content = [];
            var parse = false;
            $.each(data, function (key, value) {
                if (value == 'CONTINUE') {
                    loadMoreResults();
                } else {
                    if (!parse) {
                        $('#cloud_main').accordion('option', 'active', false);
                        $('#cloud_main').hide();
                        $('#cloud_main').empty();
                        parse = true;
                    }
                    if (key < 13)
                        createBookEntity('#cloud_main', value, "");
                    if (content && value['tags']) {
                        var newContent = value['tags'].split(';');
                        var acceptedContent = [];
                        $.each(newContent, function (key, value) {
                            if (jQuery.inArray(value.replace(' ', ''), compareContent) == -1)
                                acceptedContent.push(value);
                        });
                        content = content.concat(acceptedContent);
                    }
                }
            });
            if (parse) {
                $('<div id="cloud_more" class="book-header" onclick="findSimilar(\'' + keywords + '\',\'' + nturn + 1 + '\')"><img class="book-img" src="files/np.png"/><p class="book-title">Lataa lisää tuloksia</p></div>').appendTo('#cloud_main');
                $('<div class="book-content">Ladataan<div id="cloud_progress"><div id="cloud_progress_text">Hetkinen, haetaan lisää KirjaSammosta</div></div></div>').appendTo('#cloud_main');
                $('#cloud_main').fadeIn(500);
                $('#cloud_progress').progressbar();
            }
            var p = content.join('*');
            if (parse)
                parseText(p);
            $('#cloud_main').accordion('refresh');
        }
    });
}

function getAvailable(id, name, $e) {
    helperName = name;
    var url = 'services/available.php?id=' + id;
    showProgress($e.parent(), 'Haetaan saatavuutta');
    conId2 = guid();
    $.ajax({
        type: 'GET',
        url: url,
        dataType: 'json',
        contentType: 'application/json',
        timeout: 30000,
        cache: false,
        headers: {'id': conId2},
        error: function (data, textStatus, request) {
            hideProgress();
            if (request.getResponseHeader('id') == conId2)
                showMessage('Tietoja ei saatavilla');
            console.log(textStatus);
        },
        success: function (data, textStatus, request) {
            hideProgress();
            if (request.getResponseHeader('id') != conId2)
                return;
            sessionCounter('available');
            showBigMessage('<div><img class="qr-image" src="data/qr.png" /></div>' +
                '<div><p>Saatavilla pääkirjastossa: ' + data['lib_av'] + ' / ' + (parseInt(data['lib_na']) + parseInt(data['lib_av'])) + '</p>' +
                '<p>Saatavilla Oulun kirjastoissa: ' + data['tot_av'] + ' / ' + (parseInt(data['tot_na']) + parseInt(data['tot_av'])) + '</p>' +
                '<p>Varauksia: ' + data['tot_lo'] + '</p>' + '<br>' +
                '<p>Varaa kirja puhelimella</p>' +
                '<p>lukemalla oheinen QR-koodi</p></div>'
                , 'Saatavuus teokselle ' + helperName);
        }
    });
}

function getReviews(id, name, $e) {
    helperName = name;
    showProgress($e.parent(), 'Haetaan arvosteluita');
    var url = 'services/reviews.php?isbn=' + id;
    conId2 = guid();
    $.ajax({
        type: 'GET',
        url: url,
        dataType: 'json',
        contentType: 'application/json',
        timeout: 10000,
        cache: false,
        headers: {'id': conId2},
        error: function (data, textStatus, request) {
            hideProgress();
            if (request.getResponseHeader('id') == conId2)
                showMessage('Tietoja ei saatavilla');
            console.log(textStatus);
        },
        success: function (data, textStatus, request) {
            hideProgress();
            if (request.getResponseHeader('id') != conId2)
                return;
            sessionLaunher('review');
            $('#reviews_popup').empty();
            var parsed = $(data['reviews_widget']);
            $('#reviews_popup').append(parsed);
            $('#reviews_popup').append('<div class="popup-blocker"></div>');
            $('#goodreads-widget').css('width', 'auto');
            $("#the_iframe").css('width', window.innerWidth - 520);
            $('#reviews_popup').dialog('option', 'title', 'Arvostelut GoodReads palvelusta teokselle ' + helperName);
            $('#reviews_popup').dialog('open');
            $('.ui-widget-overlay').on('click', function () {
                $('#reviews_popup').dialog('close');
                sessionActiveApp = sessionPreviousApp;
            });
            $('#goodreads-widget').css('width', 'auto');
            $('#goodreads-widget a').remove();

            $("#the_iframe").load(function () {
                //  $("#the_iframe").off('click');//.find('.gr_reviews_showing').hide();
                //  $('#the_iframe').contents().find('a').click(function (event) {
                //      alert("demo only");
                //      event.preventDefault();
            });
        }
    });
}

function showMap(loc, tags, title) {
    $.getJSON('data/locations.json', { "noCache": noCache }, function (data) {
            var genres = data['genres'];
            var alphapetical = data['alphapetical'];
            sessionLaunher('location');
            var arr = tags.split(';');
            var found = false;
            $.each(arr, function (key, value) {
                if (value in genres) {
                    var pos = genres[value];
                    $('#location_marker').css({top: pos[1], left: pos[0]});
                    found = true;
                    return false;
                }
            });
            if (!found) {
                var loc1 = loc.split(' ');
                if (true) {/// TODOD: mitkä luokat if (loc[1] == '84.2') {
                    var pos = alphapetical[loc1[2].charAt(0)];
                    $('#location_marker').css({top: pos[1], left: pos[0]});
                } else {
                    showMessage('Valitettavasti teosta ei voitu paikantaa');
                    return false;
                }
            }
            $('#location_popup').dialog('option', 'title', title + ' teoksen paikka kirjastossa ' + loc);
            $('#location_desc').empty();
            $('#location_desc').append(loc);
            $('#location_popup').dialog('open');
            $('.ui-widget-overlay').on('click', function () {
                $('#location_popup').dialog('close');
                sessionActiveApp = sessionPreviousApp;
            });
        }
    )
    ;
}

function showThanks() {
    $('#popup2').dialog('close');
    showMessage('Kiitos, palautteesi otetaan huomioon!')
}

function showMessage(message) {
    var popup = $('#popup_small');
    popup.dialog('close');
    popup.empty();
    popup.append('<div>' + message + '</div>');
    popup.dialog('open');
    $('.ui-widget-overlay').on('click', function () {
        $('#popup_small').dialog('close');
        sessionActiveApp = sessionPreviousApp;
    });
}

function showBigMessage(message, title) {
    var popup = $('#popup_big');
    popup.dialog('close');
    popup.empty();
    popup.append('<div>' + message + '</div>');
    popup.dialog('option', 'title', title);
    popup.dialog('open');
}

function showProgress(location, text) {
    var progress = $('#progress');
    if (progress.length == 0) {
        progress = $('<div id="progress"><div id="progress_text">' + text + '</div></div>')
        progress.progressbar();
    }
    $('#progress_text').text(text);
    progress.appendTo(location);
    progress.fadeIn(1000);
    progress.progressbar("value", 0);
    if (progressPid != 0)
        clearInterval(progressPid);
    progressPid = setInterval(function () {
        updateProgress()
    }, 50);
}

function hideProgress() {
    if (progressPid != 0) {
        clearInterval(progressPid);
        var progress = $('#progress');
        progress.fadeOut(500);
        progressPid = 0;
    }
}

function updateProgress() {
    var progress = $('#progress');
    var val = progress.progressbar("value") || 0;
    progress.progressbar("value", val + 1);
    if (val > 99) {
        progress.progressbar("value", 0);
    }
}

function feedback() {
    var res = $('#feedback_questions').children();
    var mail = "?feedback-input";
    $.each(res, function (key, value) {
        var e = $(value);
        var a = e.find(':checked');
        if (a.length > 0) {
            mail += '&' + encodeURI(e.children('h1')[0].textContent) + '=';
            $.each(a, function (key, value) {
                mail += encodeURI($(value).attr('title')) + ";";
                $(value).prop('checked', false);
            });
        }
        var a = e.find('input[type=input]');
        if (a.length > 0) {
            mail += '&' + encodeURI(e.children('h1')[0].textContent) + '=';
            mail += encodeURI(a[0].value);
            a[0].value = "";
        }
    });
    $('.question').buttonset('refresh');
    var res = $('#feedback_free').children();
    $.each(res, function (key, value) {
            var e = $(value);
            var a = e.find('input[type=text]');
            if (a.length > 0) {
                mail += '&' + encodeURI(e.children('h3')[0].textContent) + '=';
                mail += encodeURI(a[0].value);
                a[0].value = "";
            }
        }

    );
    $.get('services/feedback.php' + mail, function () {
    });
    showMessage('Kiitos palautteesta, toiveesi otetaan huomioon kirjaston palvelujen kehittämisessä!');
    mainMenu();
}
function changeTheme(theme) {
    $("#container").fadeOut(function () {
        $('#theme').attr('href', 'styles/theme_' + theme + '.css');
        $('#theme_jquery').attr('href', 'styles/jquery-ui/' + theme + '/jquery-ui.css');
        $("#container").fadeIn();
    })
}

function showHelper() {
    sessionLaunher('helper');
    $('#helper_popup').dialog('open');
    $('.ui-widget-overlay').on('click', function () {
        $('#helper_popup').dialog('close');
        sessionActiveApp = sessionPreviousApp;
    });
    helperShown = true;
}

function loadHelper() {
    $.getJSON('services/cal_next.php?type=' + helperAge, { "noCache": noCache }, function (data) {
        var start = new Date(data['start']);
        var started = start.getUTCHours() + ":" + (start.getMinutes() < 10 ? '0' : '') + start.getMinutes();
        $('#helper_cal').empty();
        $('#helper_cal').append('' +
            '<div class="min-cal-time">' + started + '</div>' +
            '<div class="min-cal-title">' + data['title'] + '</div>' +
            '<div class="min-cal-month">' + data['location'] + " " + start.getDate() + "." + (start.getMonth() + 1) + "." + start.getFullYear() + '</div>'
        );
    });
    $.getJSON('data/library.json', { "noCache": noCache }, function (data) {
        var selected = [];
        for (var item in data) {
            if (data[item]['recommend'].indexOf(helperAge) != -1) {
                selected.push(data[item]);
            }
        }
        var item = selected[Math.floor(Math.random() * selected.length)];
        $('#helper_loc').empty();
        $('#helper_loc').off('click');
        $('#helper_loc').on('click', function () {
            mapSelectBack(null, item['sid'], item['floor'], true);
            mapSelect(item['sid']);
            ;
        });

        $('#helper_loc').append(
            '<div>' +
                '<div class="min-cal-title">' + item['name'] + '</div>' +
                '<div>' + item['desc'] + '</div>' +
                '</div>'
        );
    });
    loadHelperBooks();
}

function loadHelperBooks() {
    $.ajax({
        type: 'GET',
        url: 'services/recommend.php?gender=' + encodeURIComponent(helperGender) + "&age=" + encodeURIComponent(helperAge) + "&turn=" + helperTurn,
        dataType: 'json',
        contentType: 'application/json',
        timeout: 10000,
        cache: false,
        error: function (data, textStatus, request) {
            console.log(textStatus);
        },
        success: function (data, textStatus, request) {
            $('#helper_main').accordion('option', 'active', false);
            $('#helper_main').hide();
            $('#helper_main').empty();
            $('#helper_tags').hide();
            $('#helper_tags').empty();
            var tags = {};
            var cases = {};
            $.each(data, function (key, value) {
                if (key < 10)
                    createBookEntity('#helper_main', value, "");
                value['tags'].split(';').forEach(function (word) {
                    word = word.substr(0, maxLength);
                    cases[word.toLowerCase()] = word;
                    tags[word = word.toLowerCase()] = (tags[word] || 0) + 1;
                });
            });
            tags = d3.entries(tags).sort(function (a, b) {
                return b.value - a.value;
            });
            tags.forEach(function (d) {
                d.key = cases[d.key];
            });
            tags = tags.slice(0, 50);
            $.each(tags, function (key, value) {
                $("#helper_tags").append($('<a onclick="searchKeyWord(\'' + value['key'] + '\')" style="color: ' + rainbow() + '">' + value['key'] + ' </a>'));
            });
            $('<div class="book-header" onclick="loadMoreHelper()"><p class="book-more">Lataa lisää tuloksia</p></div>').appendTo('#helper_main');
            $('<div class="book-content">Ladataan</div>').appendTo('#helper_main');
            $('#helper_main').accordion('refresh');
            $('#helper_main').fadeIn(500);
            $('#helper_tags').fadeIn(500);
        }
    });
}

function loadMoreHelper() {
    helperTurn++;
    loadHelperBooks();
}

function loadHelperBouncer() {
    if (bpid)
        clearInterval(bpid);
    setTimeout(function () {
        bounceHelper(0)
    }, 5000);
    setInterval(function () {
        bpid = bounceHelper(0)
    }, 90000);
}

function bounceHelper(i) {
    if (!helperShown) {
        if (i == 0)
            $('#helper').show();
        if (helperTooltip) {
            $('#helper').tooltip('open');
            helperTooltip = false;
        }
        if (i < 4) {
            i++;
            $('#helper').effect('puff', 'slow', function () {
                $('#helper').fadeIn('slow', function () {
                    bounceHelper(i);
                });
            });
        } else {
            $('#helper').tooltip('close');
        }
    }
}

function searchKeyWord(word) {
    if ($('#element3 .element-max').css('display') == "none") {
        animateMenu($('#element3'));
        $('#cloud_keywords').empty();
    }
    load(word);
    $('#helper_popup').dialog('close');
    $('#tag_popup').dialog('close');
}

function searchKeyWord2(word) {
    $('#cloud_keywords').empty();
    if ($('#element3 .element-max').css('display') == "none") {
        animateMenu($('#element3'));
    }
    word = word.trim();
    word = word.split(' ');
    for (var i = 0; i < word.length - 1; i++) {
        if (word[i] && word.length > 1)
            $("#cloud_keywords").append($('<a class="cloud-keyword" onclick="removeKeyWord($(this))" style="color: ' + rainbow() + '">' + word[i] + "\x18" + ' <div class="ui-icon-close ui-icon cloud-remove"></div></a>').hide().fadeIn(2000));
    }
    load(word[word.length - 1] + "\x18");
    $('#tag_popup').dialog('close');
}


function loadUbiChannel() {
	sessionCount['gender'] = helperGender;
	sessionCount['age'] = helperAge;
	sessionCount['session_id'] = makeid();
	clickSessionCount['gender'] = helperGender;
	clickSessionCount['age'] = helperAge;
	clickSessionCount['session_id'] = sessionCount.session_id;
    $.post('services/session.php?', { data: sessionCount });
    $.post("http://vm.ubi-hotspot-15.ubioulu.fi/menu/rm_signaling.php", {message: '{"signal":"openapp","app_id":"42","user_id":"null","language":"fi","multisession_id":"' + guid() + '","session_master":"true"}'});
}                     // document.location.hostname

function locationCheck(e) {
    e = parseFloat(e.substr(7, 4));
    if (e >= 81 && e <= 85)
        return true
    return false;
}