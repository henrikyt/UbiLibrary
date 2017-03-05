vars = {};

vars.language = 'fi';
vars.goodreads_key = 'jMR65h5cRoyNEXrMwEhtg';
vars.accordion_settings = {heightStyle: 'content', collapsible: true, active: false};

vars.hints_category_descriptions = {"Suomen luetuimmat": "Kirjakauppaliitto", "Luetuimmat maailmalla": "N.Y. Times Best Sellers"};
vars.map_position = -735;

//LAYOUT
vars.widget_margin = 10;
vars.app_margin = 20;
vars.canvas_height = window.innerHeight;
vars.canvas_width = window.innerWidth;
vars.widget_count = 5;
vars.widget_width = 300;
vars.widget_height = 250;
vars.app_width = 1500;
vars.app_height = 900;
vars.content_padding = 20;

vars.app_min_width = vars.widget_width - vars.widget_margin * 2;
vars.app_max_width = vars.app_width - vars.app_margin * 2;
vars.app_min_height = vars.widget_height - vars.widget_margin * 2;
vars.app_max_height = vars.app_height - vars.app_margin * 2;

//DEFAULT STATE
vars.state_main_top = vars.canvas_height / 2 - vars.widget_height / 2 + 260;
vars.state_main_left = vars.canvas_width / 2 - (vars.widget_count * vars.widget_width) / 2;

//EXPANDED STATE
vars.state_app_widgets_top = vars.canvas_height / 2 - ((vars.widget_count - 1) * vars.widget_height) / 2;
vars.state_app_widgets_left = vars.canvas_width / 2 - (vars.widget_width + vars.app_width) / 2;
vars.state_app_top = vars.canvas_height / 2 - vars.app_height / 2;
vars.state_app_left = vars.state_app_widgets_left + vars.widget_width;

//EFFECTS
vars.minimize_effect = 400;
vars.maximize_effect = 500;
vars.fadein_effect = 300;
vars.fadeout_effect = 100;
vars.main_timeout = 1000;

//CLOUD
vars.cloud_font = "sans-serif"; //"Impact";
vars.cloud_layout = "rectangular"; //archimedean,rectangular
vars.cloud_font_size = "linear"; //sqrt,linear,log
vars.angles_count = 1;
vars.angles_from = 0;
vars.angles_to = 0;
vars.cloud_max_words = 35;
vars.cloud_width = vars.app_max_width / 2 - vars.content_padding;
vars.cloud_height = vars.app_max_height * (3 / 4) - vars.content_padding;

vars.popup_dialog = {
    modal: true,
    height: 250,
    width: 400,
    autoOpen: false,
    draggable: false,
    resizable: false,
    closeText: "Sulje",
    show: {
        effect: "scale",
        duration: 400
    },
    hide: {
        effect: "scale",
        duration: 400
    },
    buttons: [
        { text: "Sulje", click: function () {
            $(this).dialog("close");
            sessionActiveApp = sessionPreviousApp;
        } }
    ]
}

vars.keyboard_options =
{
    // *** choose layout ***
    layout: 'swedish-qwerty',

    /* position: {
     of: '#cloud_input', // optional - null (attach to input/textarea) or a jQuery object (attach elsewhere)
     my: 'center bottom',
     at: 'center bottom',
     at2: 'center bottom' // used when "usePreview" is false (centers keyboard at bottom of the input/textarea)
     },*/

    // preview added above keyboard if true, original input/textarea used if false
    usePreview: true,

    // if true, the keyboard will always be visible
    alwaysOpen: false,

    // give the preview initial focus when the keyboard becomes visible
    initialFocus: false,

    // if true, keyboard will remain open even if the input loses focus.
    stayOpen: false,

    // *** change keyboard language & look ***
    display: {
        'a': '\u2714:Hyväksy (Shift-Enter)', // check mark - same action as accept
        'accept': 'Hyväksy:Hyväksy (Shift-Enter)',
        'alt': 'AltGr:Alternate Graphemes',
        'b': '\u2190:Backspace',    // Left arrow (same as &larr;)
        'bksp': 'Bksp:Backspace',
        'c': '\u2716:Peruuta (Esc)', // big X, close - same action as cancel
        'cancel': 'Peruuta:Peruuta (Esc)',
        'clear': 'C:Clear',             // clear num pad
        'combo': '\u00f6:Toggle Combo Keys',
        'dec': '.:Decimal',           // decimal point for num pad (optional), change '.' to ',' for European format
        'e': '\u21b5:Enter',        // down, then left arrow - enter symbol
        'enter': 'Enter:Enter',
        'lock': '\u21ea Lock:Caps Lock', // caps lock
        'next': 'Next',
        'prev': 'Prev',
        's': '\u21e7:Shift',        // thick hollow up arrow
        'shift': 'Shift:Shift',
        'sign': '\u00b1:Change Sign',  // +/- sign for num pad
        'space': '&nbsp;:Space',
        't': '\u21e5:Tab',          // right arrow to bar (used since this virtual keyboard works with one directional tabs)
        'tab': '\u21e5 Tab:Tab'       // \u21b9 is the true tab symbol (left & right arrows)
    },

    // Message added to the key title while hovering, if the mousewheel plugin exists
    wheelMessage: 'Use mousewheel to see other keys',

    css: {
        input: 'ui-widget-content ui-corner-all', // input & preview
        container: 'ui-widget-content ui-widget ui-corner-all ui-helper-clearfix', // keyboard container
        buttonDefault: 'ui-state-default ui-corner-all', // default state
        buttonHover: 'ui-state-hover',  // hovered button
        buttonAction: 'ui-state-active', // Action keys (e.g. Accept, Cancel, Tab, etc); replaces "actionClass"
        buttonDisabled: 'ui-state-disabled' // used when disabling the decimal button {dec}
    },

    // *** Useability ***
    // Auto-accept content when clicking outside the keyboard (popup will close)
    autoAccept: true,

    // Prevents direct input in the preview window when true
    lockInput: false,

    // Prevent keys not in the displayed keyboard from being typed in
    restrictInput: false,

    // Check input against validate function, if valid the accept button is clickable;
    // if invalid, the accept button is disabled.
    acceptValid: true,

    // Use tab to navigate between input fields
    tabNavigation: false,

    // press enter (shift-enter in textarea) to go to the next input field
    enterNavigation: false,
    // mod key options: 'ctrlKey', 'shiftKey', 'altKey', 'metaKey' (MAC only)
    enterMod: 'altKey', // alt-enter to go to previous; shift-alt-enter to accept & go to previous

    // if true, the next button will stop on the last keyboard input/textarea; prev button stops at first
    // if false, the next button will wrap to target the first input/textarea; prev will go to the last
    stopAtEnd: true,

    // Set this to append the keyboard immediately after the input/textarea it is attached to.
    // This option works best when the input container doesn't have a set width and when the
    // "tabNavigation" option is true
    appendLocally: false,

    // If false, the shift key will remain active until the next key is (mouse) clicked on;
    // if true it will stay active until pressed again
    stickyShift: false,

    // Prevent pasting content into the area
    preventPaste: false,

    // Set the max number of characters allowed in the input, setting it to false disables this option
    maxLength: false,

    // Mouse repeat delay - when clicking/touching a virtual keyboard key, after this delay the key
    // will start repeating
    repeatDelay: 500,

    // Mouse repeat rate - after the repeatDelay, this is the rate (characters per second) at which the
    // key is repeated. Added to simulate holding down a real keyboard key and having it repeat. I haven't
    // calculated the upper limit of this rate, but it is limited to how fast the javascript can process
    // the keys. And for me, in Firefox, it's around 20.
    repeatRate: 20,

    // resets the keyboard to the default keyset when visible
    resetDefault: false,

    // Event (namespaced) on the input to reveal the keyboard. To disable it, just set it to ''.
    openOn: 'focus',

    // When the character is added to the input
    keyBinding: 'mousedown',

    // combos (emulate dead keycs : http://en.wikipedia.org/wiki/Keyboard_layout#US-International)
    // if user inputs `a the script converts it to à, ^o becomes ô, etc.
    useCombos: true,

    // *** Methods ***
    // Callbacks - add code inside any of these callback functions as desired
    initialized: function (e, keyboard, el) {
    },
    visible: function (e, keyboard, el) {
    },
    change: function (e, keyboard, el) {
        // $("#keyboard").autocomplete("search", el.value );
    },
    beforeClose: function (e, keyboard, el, accepted) {
    },
    accepted: function (e, keyboard, el) {
    },
    canceled: function (e, keyboard, el) {
    },
    hidden: function (e, keyboard, el) {
    },

    switchInput: null, // called instead of base.switchInput

    // this callback is called just before the "beforeClose" to check the value
    // if the value is valid, return true and the keyboard will continue as it should
    // (close if not always open, etc)
    // if the value is not value, return false and the clear the keyboard value
    // ( like this "keyboard.$preview.val('');" ), if desired
    // The validate function is called after each input, the "isClosing" value will be false;
    // when the accept button is clicked, "isClosing" is true
    validate: function (keyboard, value, isClosing) {
        return true;
    }
}

vars.cloud_keyboard_options =
{
    // *** choose layout ***
    layout: 'swedish-qwerty',

    position: {
        of: '#cloud_input', // optional - null (attach to input/textarea) or a jQuery object (attach elsewhere)
        my: 'center bottom',
        at: 'center bottom',
        at2: 'center bottom' // used when "usePreview" is false (centers keyboard at bottom of the input/textarea)
    },

    // preview added above keyboard if true, original input/textarea used if false
    usePreview: true,

    // if true, the keyboard will always be visible
    alwaysOpen: false,

    // give the preview initial focus when the keyboard becomes visible
    initialFocus: false,

    // if true, keyboard will remain open even if the input loses focus.
    stayOpen: false,

    // *** change keyboard language & look ***
    display: {
        'cancel': 'Peruuta:Peruuta (Esc)',
        'a': '\u2714:Hae (Shift-Enter)', // check mark - same action as accept
        'accept': 'Hae:Hae (Shift-Enter)',
        'alt': 'AltGr:Alternate Graphemes',
        'b': '\u2190:Backspace',    // Left arrow (same as &larr;)
        'bksp': 'Bksp:Backspace',
        'c': '\u2716:Peruuta (Esc)', // big X, close - same action as cancel

        'clear': 'C:Clear',             // clear num pad
        'combo': '\u00f6:Toggle Combo Keys',
        'dec': '.:Decimal',           // decimal point for num pad (optional), change '.' to ',' for European format
        'e': '\u21b5:Enter',        // down, then left arrow - enter symbol
        // 'enter': 'Enter:Enter',
        'lock': '\u21ea Lock:Caps Lock', // caps lock
        'next': 'Next',
        'prev': 'Prev',
        's': '\u21e7:Shift',        // thick hollow up arrow
        'shift': 'Shift:Shift',
        'sign': '\u00b1:Change Sign',  // +/- sign for num pad
        'space': '&nbsp;:Space',
        't': '\u21e5:Tab',          // right arrow to bar (used since this virtual keyboard works with one directional tabs)
        'tab': '\u21e5 Tab:Tab'       // \u21b9 is the true tab symbol (left & right arrows)
    },

    // Message added to the key title while hovering, if the mousewheel plugin exists
    wheelMessage: 'Use mousewheel to see other keys',

    css: {
        input: 'ui-widget-content ui-corner-all', // input & preview
        container: 'ui-widget-content ui-widget ui-corner-all ui-helper-clearfix', // keyboard container
        buttonDefault: 'ui-state-default ui-corner-all', // default state
        buttonHover: 'ui-state-hover',  // hovered button
        buttonAction: 'ui-state-active', // Action keys (e.g. Accept, Cancel, Tab, etc); replaces "actionClass"
        buttonDisabled: 'ui-state-disabled' // used when disabling the decimal button {dec}
    },

    // *** Useability ***
    // Auto-accept content when clicking outside the keyboard (popup will close)
    autoAccept: true,

    // Prevents direct input in the preview window when true
    lockInput: false,

    // Prevent keys not in the displayed keyboard from being typed in
    restrictInput: false,

    // Check input against validate function, if valid the accept button is clickable;
    // if invalid, the accept button is disabled.
    acceptValid: true,

    // Use tab to navigate between input fields
    tabNavigation: false,

    // press enter (shift-enter in textarea) to go to the next input field
    enterNavigation: true,
    // mod key options: 'ctrlKey', 'shiftKey', 'altKey', 'metaKey' (MAC only)
    enterMod: 'altKey', // alt-enter to go to previous; shift-alt-enter to accept & go to previous

    // if true, the next button will stop on the last keyboard input/textarea; prev button stops at first
    // if false, the next button will wrap to target the first input/textarea; prev will go to the last
    stopAtEnd: true,

    // Set this to append the keyboard immediately after the input/textarea it is attached to.
    // This option works best when the input container doesn't have a set width and when the
    // "tabNavigation" option is true
    appendLocally: false,

    // If false, the shift key will remain active until the next key is (mouse) clicked on;
    // if true it will stay active until pressed again
    stickyShift: false,

    // Prevent pasting content into the area
    preventPaste: false,

    // Set the max number of characters allowed in the input, setting it to false disables this option
    maxLength: false,

    // Mouse repeat delay - when clicking/touching a virtual keyboard key, after this delay the key
    // will start repeating
    repeatDelay: 500,

    // Mouse repeat rate - after the repeatDelay, this is the rate (characters per second) at which the
    // key is repeated. Added to simulate holding down a real keyboard key and having it repeat. I haven't
    // calculated the upper limit of this rate, but it is limited to how fast the javascript can process
    // the keys. And for me, in Firefox, it's around 20.
    repeatRate: 20,

    // resets the keyboard to the default keyset when visible
    resetDefault: false,

    // Event (namespaced) on the input to reveal the keyboard. To disable it, just set it to ''.
    openOn: 'focus',

    // When the character is added to the input
    keyBinding: 'mousedown',

    // combos (emulate dead keycs : http://en.wikipedia.org/wiki/Keyboard_layout#US-International)
    // if user inputs `a the script converts it to à, ^o becomes ô, etc.
    useCombos: true,

    // *** Methods ***
    // Callbacks - add code inside any of these callback functions as desired
    initialized: function (e, keyboard, el) {
    },
    visible: function (e, keyboard, el) {
    },
    change: function (e, keyboard, el) {
        // $("#keyboard").autocomplete("search", el.value );
    },
    beforeClose: function (e, keyboard, el, accepted) {
    },
    accepted: function (e, keyboard, el) {
        if ($("#cloud_keywords").children().length == 0) {
            var value = el.value;
            value = value.replace(/,/gi, ' ');
            if (value.indexOf(' ') != -1) {
                var values = value.split(' ');
                for (var i = 0; i < values.length - 1; i++) {
                    $("#cloud_keywords").append($('<a class="cloud-keyword" onclick="removeKeyWord($(this))" style="color: ' + rainbow() + '">' + values[i] + "\x18" + ' <div class="ui-icon-close ui-icon cloud-remove"></div></a>').hide().fadeIn(2000));
                }
                value = values[values.length - 1];
            }
            load(value + "\x18");
            el.value = "";
        } else {
            cloudKeep = el;
            $('#cloud_confirm').dialog('open');
        }
    },
    canceled: function (e, keyboard, el) {
    },
    hidden: function (e, keyboard, el) {
    },

    switchInput: null, // called instead of base.switchInput

    // this callback is called just before the "beforeClose" to check the value
    // if the value is valid, return true and the keyboard will continue as it should
    // (close if not always open, etc)
    // if the value is not value, return false and the clear the keyboard value
    // ( like this "keyboard.$preview.val('');" ), if desired
    // The validate function is called after each input, the "isClosing" value will be false;
    // when the accept button is clicked, "isClosing" is true
    validate: function (keyboard, value, isClosing) {
        if (value != "")
            return true;
        else
            return false;
    }
}

vars.autocomplete_options = {
    source: 'data/keywords.json'
}

vars.slide_options = {
    width: 700,
    height: 432,

// animation values
    animtype: 'slide', // accepts 'fade' or 'slide'
    animduration: 450, // how fast the animation are
    animspeed: 10000, // the delay between each slide
    automatic: true, // automatic

// control and marker configuration
    showcontrols: true, // show next and prev controls
    centercontrols: true, // center controls verically
    nexttext: '<div onclick="sessionCounter([\'events\'])" class="ricon ui-app-header">></div><div onclick="sessionCounter([\'events\'])" class="news-hidden"></div>',//'<img class="news-next" src="data/next.png" />', // Text for 'next' button (can use HTML)
    prevtext: '<div onclick="sessionCounter([\'events\'])" class="licon ui-app-header"><</div>',//'<img class="news-prev" src="data/prev.png" />', // Text for 'previous' button (can use HTML)
    showmarkers: true, // Show individual slide markers
    centermarkers: true, // Center markers horizontally

// interaction values
    keyboardnav: true, // enable keyboard navigation
    hoverpause: true, // pause the slider on hover

// presentational options
    usecaptions: true, // show captions for images using the image title tag
    randomstart: true, // start slider at random slide
    responsive: true // enable responsive capabilities (beta)
}

vars.slide_subtle_options = {
    height: 421,
    width: 294,

// animation values
    animtype: 'slide', // accepts 'fade' or 'slide'
    animduration: 450, // how fast the animation are
    animspeed: 3000, // the delay between each slide
    automatic: true, // automatic

// control and marker configuration
    showcontrols: false, // show next and prev controls
    centercontrols: false, // center controls verically
    nexttext: '',
    prevtext: '',
    showmarkers: false, // Show individual slide markers
    centermarkers: false, // Center markers horizontally

// interaction values
    keyboardnav: false, // enable keyboard navigation
    hoverpause: false, // pause the slider on hover

// presentational options
    usecaptions: false, // show captions for images using the image title tag
    randomstart: true, // start slider at random slide
    responsive: true // enable responsive capabilities (beta)
}

//CALENDAR

vars.calendar_lib = {
    'lib_kurssit': 'https://www.google.com/calendar/feeds/uag9tnhpfqk6ed90a8a84ula80%40group.calendar.google.com/public/basic',
    'lib_lapset': 'https://www.google.com/calendar/feeds/29dbsq2s4foubgoem4vdvj6epk%40group.calendar.google.com/public/basic',
    'lib_tapahtumat': 'https://www.google.com/calendar/feeds/juahjt5h32q2qqfms5qjjknm48%40group.calendar.google.com/public/basic'
};

vars.calendar_options = {
    eventSources: [
        {
            url: vars.calendar_lib['lib_kurssit'],
            color: 'green'
        },
        {
            url: vars.calendar_lib['lib_lapset'],
            color: 'red'
        },
        {
            url: vars.calendar_lib['lib_tapahtumat'],
            color: 'blue',
            allDayDefault: true,
            currentTimezone: 'Europe/Helsinki'
        }
    ],
    eventClick: function (event) {
        loadCalEvent(event);
        return false;
    },
    header: {
        left: 'title',
        center: 'month basicWeek basicDay',
        right: 'today prev,next'
    },
    firstDay: 1,
    weekNumbers: true,
    timeFormat: {
        '': 'HH:mm{ - HH:mm}\r\n'
    },
    columnFormat: {
        month: 'ddd',    // Mon
        week: 'ddd d/M', // Mon 9/7
        day: 'dddd d/M'  // Monday 9/7
    },
    titleFormat: {
        month: 'MMMM yyyy',                             // September 2009
        week: "d.M.[ yyyy]{ '&#8212;' d.M. yyyy}", // Sep 7 - 13 2009
        day: 'dddd, d.M. yyyy'                  // Tuesday, Sep 8, 2009
    },
    theme: true,
    height: vars.app_max_height - vars.content_padding,
    defaultView: 'basicWeek',
    monthNames: ['Tammikuu', 'Helmikuu', 'Maaliskuu', 'Huhtikuu', 'Toukokuu', 'Kesäkuu', 'Heinäkuu', 'Elokuu', 'Syyskuu', 'Lokakuu', 'Marraskuu', 'Joulukuu'],
    monthNamesShort: ['Tammi', 'Helmi', 'Maals', 'Huhti', 'Touko', 'Kesä', 'Heinä', 'Elo', 'Syys', 'Loka', 'Marras', 'Joulu'],
    dayNames: ['Sunnuntai', 'Maanantai', 'Tiistai', 'Keskiviikko', 'Torstai', 'Perjantai', 'Lauantai'],
    dayNamesShort: ['Su', 'Ma', 'Ti', 'Ke', 'To', 'Pe', 'La'],
    weekNumberTitle: 'Viikko',
    buttonText: {
        prev: '&lt;',
        next: '&gt;',
        prevYear: '&laquo;',  // <<
        nextYear: '&raquo;',  // >>
        today: 'tänään',
        month: 'kuukausi',
        week: 'viikko',
        day: 'päivä'

    }
}