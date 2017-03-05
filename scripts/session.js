var session = false;
var helperLoaded = false;
var helperStateConnection = null;
var sessionPreviousApp = 'main';
var sessionActiveApp = 'main';
var subtlehiding = false;
var sessionCount = {'e0': [0, 0], 'e1': [0, 0], 'e2': [0, 0], 'e3': [0, 0], 'e4': [0, 0], 'main': [0, 0], 'review': [0, 0], 'available': [0, 0], 'helper': [0, 0], 'calendar': [0, 0], 'location': [0, 0], 'events': [0, 0], 'gender': '', 'age': '', 'session_id': ''};
var clickSessionCount = {'name': '', 'click': 0, 'gender': '', 'age': '', 'session_id': '', 'app_session_id': makeid(), 'old_app_session_id': '', 'instance_id': ''};

function sessionCounter(element) {
    sessionCount[element][0]++;
    sessionActiveApp = element;
	logapplicationclicks(element);
}

function sessionLaunher(element) {
    sessionPreviousApp = sessionActiveApp;
    sessionActiveApp = element;
    sessionCount[element][0]++;
	logapplicationclicks(element);
}

function logapplicationclicks(element) {
	clickSessionCount.name = element;
	clickSessionCount.old_app_session_id = clickSessionCount.app_session_id;
	clickSessionCount.app_session_id = makeid()
	$.post('services/clicksession.php?', { data: clickSessionCount }, function (data) {});
	clickSessionCount.click = 0;
}

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 13; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function handleMessage(msg) {
    var message = JSON.parse(msg.body);
    if (message['event_type'] == "Persons_in_track_triggered") {
    } else if (message['event_type'] == "New_person_triggered") {
        if (message['age'] && message['gender']) {
            try {
                var ages = {
                    'CHILD': [0, 10],
                    'TEEN': [10, 18],
                    'YOUNGADULT': [18, 25],
                    'ADULT': [25, 55],
                    'SENIOR': [55, 150]
                }
                var age = message['age'].split('-');
                age = Math.round((parseInt(age[0]) + parseInt(age[1].substring(0, age[1].length - 1))) / 2);
                for (var key in ages) {
                    if (ages[key][0] <= age && ages[key][1] >= age) {
                        age = key;
                        break;
                    }
                }
            } catch (e) {
                var age = "ADULT";
            }
            if (helperAge != age || helperGender != message['gender']) {
                helperAge = age;
                helperGender = message['gender'];
                helperShown = false;
                helperLoaded = true;
                loadHelper();
                if (session)
                    loadHelperBouncer();
                else {
                    setTimeout(function () {
                        helperLoaded = false;
                    }, 30000);
                }
            }
        }
    } else if (message['event_type'] == "Persons_exited") {
    }
}

function handleState(msg) {
    var message = JSON.parse(msg.body);
    if (message['message_type'] == "changeState") {
        if (message['target_state'] == "interactive") {
            session=true;
            $('#subtle').animate({opacity: 0}, function () {
                $('#subtle').css('z-index:', '-5')
            });

            setTimeout(function () {
                $('#bg_full').fadeIn();
                $('#blocker').hide();
                $('#container').animate({opacity: 1});
            }, 500);

            if (helperLoaded)
                loadHelperBouncer();

            setTimeout(function () {
                $('#button_ubi').fadeOut('slow', function () {
                    $('#button_ubi').fadeIn('slow', function () {
                        $('#button_ubi').tooltip('open');
                    });
                });
            }, 5000);
            setTimeout(function () {
                $('#button_ubi').tooltip('close');
            }, 15000);

        } else if (message['target_state'] == "subtle") {
            subtlehiding = false;
            if (session) {
                session = false;
                sessionCount['gender'] = helperGender;
                sessionCount['age'] = helperAge;
				sessionCount['session_id'] = makeid();
				clickSessionCount['gender'] = helperGender;
                clickSessionCount['age'] = helperAge;
				clickSessionCount['session_id'] = sessionCount.session_id;
                $.post('services/session.php?', { data: sessionCount }, function (data) {
                    setTimeout(function () {
                        if (!session)
                            window.location.reload();
                    }, 20000);
                });
            }

            $('#container').css({opacity: 0});
            $('#bg_full').hide();
            $('#blocker').show();
            $('#subtle').css('z-index:', '10001')
            $('#subtle').animate({opacity: 1});

        } else if (message['target_state'] == "broadcast") {
            if (session) {
                sessionCount['gender'] = helperGender;
                sessionCount['age'] = helperAge;
				sessionCount['session_id'] = makeid();
				clickSessionCount['gender'] = helperGender;
                clickSessionCount['age'] = helperAge;
				clickSessionCount['session_id'] = sessionCount.session_id;
                session = false;
                $.post('services/session.php?', { data: sessionCount }, function (data) {
                    setTimeout(function () {
                        if (!session)
                            window.location.reload();
                    }, 20000)
                });
            }

            $('#container').animate({opacity: 0});
            $('#bg_full').fadeOut();
            $('#blocker').show();
            subtlehiding = true;
            setTimeout(function () {
                if (subtlehiding) {
                    $('#subtle').animate({opacity: 0}, function () {
                        $('#subtle').css('z-index:', '-5')
                        subtlehiding = false;
                    });
                }
            }, 3000);
        }
    }
}

function createEventHandlers() {
    helperStateConnection = new RabbitConnection('ws://vm0076.virtues.fi:15674/stomp/websocket', 'middleware', '5492pn0GE884E5Ma6nO44KO0N7875W4v', '/', '/exchange/lmevent/fi.ubioulu.lmevent.ubi-hotspot-15', function (d) {
        handleState(d)
    }, '/exchange/cameraevent/fi.ubioulu.cameraevent.ubi-hotspot-15', function (d) {
        handleMessage(d)
    });
    helperStateConnection.connect();
}

function gup( name ) //stands for get url param
{
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return results[1];
}

function RabbitConnection(wsAddress, user, pass, virtualHost, event1, callback1, event2, callback2) {

    /*
     * Stomp client configuration
     */
    var rabbitClient = Stomp.client(wsAddress);
    rabbitClient.heartbeat.outgoing = 20000;
    rabbitClient.heartbeat.incoming = 0;

    var on_connect = function () {
        console.log('STOMP: connected');
        sessionSubId = rabbitClient.subscribe(event1, function (d) {
            callback1(d);
        });
        sessionSubId = rabbitClient.subscribe(event2, function (d) {
            callback2(d);
        });
    };

    var on_error = function (msg) {
        console.log('STOMP: ' + msg);
        try {
            rabbitClient.disconnect();
        } catch (e) {
        }
        ;
        setTimeout(function () {
            createEventHandlers();
        }, 1000);
    };

    return {
        connect: function () {
            rabbitClient.connect(user, pass, on_connect, on_error, virtualHost);
        },
        disconnect: function () {
            rabbitClient.disconnect();
        }
    };
};

