var startContent = ['klassikot', 'äänikirjat', 'tietokirjallisuus', 'tietokirjallisuus', 'nuortenkirjallisuus', 'nuortenkirjallisuus', 'lastenkirjallisuus', 'lastenkirjallisuus', 'aikakausiromaanit', 'aikakausiromaanit', 'elämäkertaromaanit', 'elämäkertaromaanit', 'elämäkertaromaanit', 'eräkertomukset', 'fantasiakirjallisuus', 'fantasiakirjallisuus', 'historialliset rakkausromaanit', 'historialliset romaanit', 'historialliset romaanit', 'huumori', 'huumori', 'jännityskirjallisuus', 'jännityskirjallisuus', 'jännityskirjallisuus', 'kauhukirjallisuus', 'kauhukirjallisuus', 'kehitysromaanit', 'maaseuturomaanit', 'muistelmat', 'muistelmat', 'murrekirjallisuus', 'naiskirjallisuus', 'perheromaanit', 'poliisikirjallisuus', 'psykologinen jännityskirjallisuus', 'psykologiset romaanit', 'rakkausromaanit', 'rakkausromaanit', 'romanttinen jännityskirjallisuus', 'salapoliisikirjallisuus', 'satiiri', 'satiiri', 'seikkailukirjallisuus', 'sotakirjallisuus', 'sotakirjallisuus', 'sukuromaanit', 'tieteiskirjallisuus', 'tieteiskirjallisuus', 'uskonnollinen kirjallisuus', 'vakoilukirjallisuus', 'viihdekirjallisuus', 'viihdekirjallisuus', 'yhteiskunnalliset romaanit']
var content = [];
var compareContent = [];
var cwords, swords;
var cloudProgressPid = 0;
var cloudKeep = null;
var turn = 0;
var con_id = 0;
var cloudProgress = false;

var fill = d3.scale.category20b();

var w = vars.cloud_width,
    h = vars.cloud_height;

var words = [],
    max,
    scale = 1,
    complete = 0,
    keyword = "",
    tags,
    fontSize,
    maxLength = 40;

var layout = d3.layout.cloud()
    .timeInterval(10)
    .size([w, h])
    .fontSize(function (d) {
        return fontSize(+d.value);
    })
    .text(function (d) {
        return d.key;
    })
    .on("word", progress)
    .on("end", draw);

var svg = d3.select("#vis").append("svg")
    .attr("width", w)
    .attr("height", h);

var background = svg.append("g"),
    vis = svg.append("g").attr("transform", "translate(" + [w >> 1, h >> 1] + ")");

d3.select(window).on("load", load);


var wordSeparators = /[\*]+/g;

function flatten(o, k) {
    if (typeof o === "string") return o;
    var text = [];
    for (k in o) {
        var v = flatten(o[k], k);
        if (v) text.push(v);
    }
    return text.join(" ");
}

function parseText(text) {
    tags = {};
    var cases = {};
    text.split(wordSeparators).forEach(function (word) {
        word = word.substr(0, maxLength);
        cases[word.toLowerCase()] = word;
        tags[word = word.toLowerCase()] = (tags[word] || 0) + 1;
    });
    tags = d3.entries(tags).sort(function (a, b) {
        return b.value - a.value;
    });
    tags.forEach(function (d) {
        d.key = cases[d.key];
    });
    generate();
}

function generate() {
    layout.font(vars.cloud_font).spiral(vars.cloud_layout);
    fontSize = d3.scale[vars.cloud_font_size]().range([20, 60]);
    if (tags.length) fontSize.domain([+tags[tags.length - 1].value || 1, +tags[0].value]);
    complete = 0;
    words = [];
    layout.stop().words(tags.slice(0, max = Math.min(tags.length, vars.cloud_max_words))).start();
    if (tags.length > vars.cloud_max_words) {
        $('#cloud_more_keywords').fadeIn(1000);
    } else {
        $('#cloud_more_keywords').fadeOut(1000);
    }
}

function progress(d) {
    complete++;
}

function draw(data, bounds) {
    scale = bounds ? Math.min(
        w / Math.abs(bounds[1].x - w / 2),
        w / Math.abs(bounds[0].x - w / 2),
        h / Math.abs(bounds[1].y - h / 2),
        h / Math.abs(bounds[0].y - h / 2)) / 2 : 1;
    words = data;
    var text = vis.selectAll("text")
        .data(words, function (d) {
            return d.text.toLowerCase();
        });
    text.transition()
        .duration(1000)
        .attr("transform", function (d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .style("font-size", function (d) {
            return d.size + "px";
        });
    text.enter().append("text")
        .attr("text-anchor", "middle")
        .attr("transform", function (d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .style("font-size", function (d) {
            return d.size + "px";
        })
        .on("click", function (d) {
            load(d.text);
        })
        .style("opacity", 1e-6)
        .transition()
        .duration(1000)
        .style("opacity", 1);
    text.style("font-family", function (d) {
        return d.font;
    })
        .style("fill", function (d) {
            return fill(d.text.toLowerCase());
        })
        .text(function (d) {
            return d.text;
        });
    var exitGroup = background.append("g")
        .attr("transform", vis.attr("transform"));
    var exitGroupNode = exitGroup.node();
    text.exit().each(function () {
        exitGroupNode.appendChild(this);
    });
    exitGroup.transition()
        .duration(1000)
        .style("opacity", 1e-6)
        .remove();
    vis.transition()
        .delay(1000)
        .duration(750)
        .attr("transform", "translate(" + [w >> 1, h >> 1] + ")scale(" + scale + ")");

}

function load(d) {
    hideCloudProgress();
    if (d) {
        turn = 0;
        $('#cloud_clear_keywords').fadeIn('slow');
        $("#cloud_keywords").append($('<a class="cloud-keyword" onclick="removeKeyWord($(this))" style="color: ' + rainbow() + '">' + d.replace(' ', '&nbsp;') + ' <div class="ui-icon-close ui-icon cloud-remove"></div></a>').hide().fadeIn(2000));
    }
    swords = []
    var newcwords = [];
    cwords = $('#cloud_keywords a').text().split(' ');
    cwords = $.grep(cwords, function (n) {
        return(n)
    });
    if (cwords.length == 0) {
        $('#cloud_clear_keywords').fadeOut('slow');
        cwords = 'STARTCONTENT';
    } else {
        $.each(cwords, function (key, value) {
            if (value.indexOf('\x18') > 0) {
                swords.push(value.replace('\x18', ''));
            } else {
                newcwords.push(value);
            }
        });
        cwords = newcwords;
        compareContent = cwords.slice();
        compareContent = compareContent.concat(swords);
        compareContent = $.map(compareContent, function (val, i) {
            if (typeof (val) == 'string')
                return val.replace(/\u00a0/g, '');
        });
        swords = swords.join(',');
        cwords = cwords.join(',');
    }
    con_id = guid();
    $.ajax({
        type: 'GET',
        url: 'services/suggestdb.php?turn=' + turn + '&keywords=' + encodeURIComponent(cwords) + '&searchwords=' + encodeURIComponent(swords),
        dataType: 'json',
        contentType: 'application/json',
        timeout: 10000,
        cache: false,
        headers: {'id': con_id},
        error: function (data, textStatus, request) {
            try {
                console.log(textStatus);
                if (request.getResponseHeader('id') == con_id)
                    showMessage('Haulla ei löytynyt uusia tuloksia');
            } catch (e) {
                clearKeyWords();
            }
        },
        success: function (data, textStatus, request) {
            if (request.getResponseHeader('id') != con_id)
                return;
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
                $('<div id="cloud_more" class="book-header" onclick="loadMoreBooks()"><img class="book-img" src="files/np.png"/><p class="book-title">Lataa lisää tuloksia</p></div>').appendTo('#cloud_main');
                $('<div class="book-content">Ladataan<div id="cloud_progress"><div id="cloud_progress_text">Hetkinen, haetaan lisää KirjaSammosta</div></div></div>').appendTo('#cloud_main');
                $('#cloud_main').fadeIn(500);
                $('#cloud_progress').progressbar();
            }

            if (cwords == 'STARTCONTENT')
                content = startContent;
            var p = content.join('*');
            if (parse)
                parseText(p);
            $('#cloud_main').accordion('refresh');
        }
    });
}

function loadMoreResults() {
    showCloudProgress();
    con_id = guid();
    $.ajax({
        type: 'GET',
        url: 'services/suggest.php?turn=' + turn + '&keywords=' + encodeURIComponent(cwords) + '&searchwords=' + encodeURIComponent(swords),
        dataType: 'json',
        contentType: 'application/json',
        timeout: 1000000,
        cache: false,
        headers: {'id': con_id},
        error: function (data, textStatus, request) {
            hideCloudProgress();
            console.log(textStatus);
            if (request.getResponseHeader('id') == con_id)
                showMessage('Haulla ei löytynyt uusia tuloksia');
        },
        success: function (data, textStatus, request) {
            hideCloudProgress();
            if (request.getResponseHeader('id') != con_id)
                return;
            if (data.length == 0) {
                showMessage('Haulla ei löytynyt uusia tuloksia');
                return;
            }
            $('#cloud_main').hide();
            $('#cloud_main').accordion('option', 'active', false);
            $('#cloud_main').empty();
            $.each(data, function (key, value) {
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
            });
            $('<div id="cloud_more" class="book-header" onclick="loadMoreBooks()"><img class="book-img" src="files/np.png"/><p class="book-title">Lataa lisää tuloksia</p></div>').appendTo('#cloud_main');
            $('<div class="book-content">Ladataan<div id="cloud_progress"><div id="cloud_progress_text">Hetkinen, haetaan lisää KirjaSammosta</div></div></div>').appendTo('#cloud_main');
            $('#cloud_main').fadeIn(500);
            var p = content.join('*');
            parseText(p);
            $('#cloud_main').accordion('refresh');
        }
    })
}

function showCloudProgress() {
    cloudProgress = true;
    var i = $('#cloud_main h3').length;
    $('#cloud_main').accordion('option', 'active', i);
    $('#cloud_more').off('click', '**');
    $('#cloud_progress').progressbar("value", 0);
    $('#cloud_progress').fadeIn(1000);
    if (cloudProgressPid != 0)
        clearInterval(cloudProgressPid);
    cloudProgressPid = setInterval(function () {
        updateCloudProgress()
    }, 80);
}

function hideCloudProgress() {
    cloudProgress = false;
    if (cloudProgressPid != 0) {
        clearInterval(cloudProgressPid);
        cloudProgressPid = 0;
        $('#cloud_progress').fadeOut(500);
    }
}

function loadMoreBooks() {
    if (!cloudProgress) {
        turn++;
        load(null);
    }
}

function updateCloudProgress() {
    var progress = $('#cloud_progress');
    var val = progress.progressbar("value") || 0;
    progress.progressbar("value", val + 1);
    if (val > 99) {
        progress.progressbar("value", 0);
    }
}

function loadMoreKeyWords() {
    for (var j = 0; j < content.length; j++) {
        if (content[j] == "") {
            content.splice(j, 1);
            j = 0;
        } else {
            for (var i = 0; i < words.length; i++) {
                if (content[j] == words[i].text) {
                    content.splice(j, 1);
                    j = 0;
                }
            }
        }
    }
    parseText(content.join('*'));
}

function clearKeyWords() {
    $('#cloud_keywords').empty();
    load(null);
}

function rainbow() {
    var hue = Math.floor(Math.random() * 30) * 12;
    return $.Color({
        hue: hue,
        saturation: 1,
        lightness: 0.2,
        alpha: 1
    }).toHexString();
};

function removeKeyWord($e) {
    turn = 0;
    $e.fadeOut(500, function () {
        $(this).remove();
        load(null);
    });

}

function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
function guid() {
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

(function () {

    $('#cloud_main').accordion(vars.accordion_settings);

    var r = 40.5,
        px = 35,
        py = 20;

    var angles = d3.select("#angles").append("svg")
        .attr("width", 2 * (r + px))
        .attr("height", r + 1.5 * py)
        .append("g")
        .attr("transform", "translate(" + [r + px, r + py] + ")");

    angles.append("path")
        .style("fill", "none")
        .attr("d", ["M", -r, 0, "A", r, r, 0, 0, 1, r, 0].join(" "));

    angles.append("line")
        .attr("x1", -r - 7)
        .attr("x2", r + 7);

    angles.append("line")
        .attr("y2", -r - 7);

    angles.selectAll("text")
        .data([-90, 0, 90])
        .enter().append("text")
        .attr("dy", function (d, i) {
            return i === 1 ? null : ".3em";
        })
        .attr("text-anchor", function (d, i) {
            return ["end", "middle", "start"][i];
        })
        .attr("transform", function (d) {
            d += 90;
            return "rotate(" + d + ")translate(" + -(r + 10) + ")rotate(" + -d + ")translate(2)";
        })
        .text(function (d) {
            return d + "°";
        });

    var radians = Math.PI / 180,
        from = vars.angles_from,
        to = vars.angles_to,
        count = vars.angles_count,
        scale = d3.scale.linear(),
        arc = d3.svg.arc()
            .innerRadius(0)
            .outerRadius(r);

    update();

    function update() {
        scale.domain([0, count - 1]).range([from, to]);
        var step = (to - from) / count;

        var path = angles.selectAll("path.angle")
            .data([
                {startAngle: from * radians, endAngle: to * radians}
            ]);
        path.enter().insert("path", "circle")
            .attr("class", "angle")
            .style("fill", "#fc0");
        path.attr("d", arc);

        var line = angles.selectAll("line.angle")
            .data(d3.range(count).map(scale));
        line.enter().append("line")
            .attr("class", "angle");
        line.exit().remove();
        line.attr("transform", function (d) {
            return "rotate(" + (90 + d) + ")";
        })
            .attr("x2", function (d, i) {
                return !i || i === count - 1 ? -r - 5 : -r;
            });

        layout.rotate(function () {
            return scale(~~(Math.random() * count));
        });

    }
})();
