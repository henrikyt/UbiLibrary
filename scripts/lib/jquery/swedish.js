/* Swedish keyboard layouts
 * contains layout: 'swedish-qwerty' & 'swedish-dvorak'
 *
 * To use:
 *  Point to this js file into your page header: <script src="layouts/scandinavian.js" type="text/javascript"></script>
 *  Initialize the keyboard using: $('input').keyboard({ layout: 'swedish-qwerty' });
 *
 * license for this file: WTFPL, unless the source layout site has a problem with me using them as a reference
 */

/* qwerty by Mika Perreri Korhonen (https://github.com/jouk0) -  */
$.keyboard.layouts['swedish-qwerty'] = {
    'default' : [
        "@ 1 2 3 4 5 6 7 8 9 0 + {bksp}",
        "q w e r t y u i o p \u00e5 '",
        "a s d f g h j k l \u00f6 \u00e4",
        "{shift} z x c v b n m , . - {shift}",
        "{cancel} {space} {accept}"
    ],
    'shift' : [
        '\u00bd ! " # \u00a4 % & / ( ) = ? {bksp}',
        "Q W E R T Y U I O P \u00c5 *",
        "A S D F G H J K L \u00d6 \u00c4",
        "{shift} Z X C V B N M ; : _ {shift}",
        "{cancel} {space} {accept}"
    ],
    'alt' : [
        '\u00a7 1 @ \u00a3 $ 5 6 { [ ] } \\ {bksp}',
        '{tab} q w € r t y u i o p \u00e5',
        "a s d f g h j k l \u00f6 \u00e4 '",
        '{shift} | z x c v b n \u00b5 , . - {shift}',
        '{accept} {space} {alt} {cancel}'
    ]
};

// Keyboard Language
// please update this section to match this language and email me with corrections!
// ***********************
if (typeof(language) === 'undefined') { var language = {}; };
language.swedish = {
	display : {
		'a'      : '\u2714:Accept (Shift-Enter)', // check mark - same action as accept
		'accept' : 'Accept:Accept (Shift-Enter)',
		'alt'    : 'AltGr:Alternate Graphemes',
		'b'      : '\u2190:Backspace',    // Left arrow (same as &larr;)
		'bksp'   : 'Bksp:Backspace',
		'c'      : '\u2716:Cancel (Esc)', // big X, close - same action as cancel
		'cancel' : 'Cancel:Cancel (Esc)',
		'clear'  : 'C:Clear',             // clear num pad
		'combo'  : '\u00f6:Toggle Combo Keys',
		'dec'    : '.:Decimal',           // decimal point for num pad (optional), change '.' to ',' for European format
		'e'      : '\u21b5:Enter',        // down, then left arrow - enter symbol
		'enter'  : 'Enter:Enter',
		'lock'   : '\u21ea Lock:Caps Lock', // caps lock
		's'      : '\u21e7:Shift',        // thick hollow up arrow
		'shift'  : 'Shift:Shift',
		'sign'   : '\u00b1:Change Sign',  // +/- sign for num pad
		'space'  : '&nbsp;:Space',
		't'      : '\u21e5:Tab',          // right arrow to bar (used since this virtual keyboard works with one directional tabs)
		'tab'    : '\u21e5 Tab:Tab'       // \u21b9 is the true tab symbol (left & right arrows)
	},
	// Message added to the key title while hovering, if the mousewheel plugin exists
	wheelMessage : 'Use mousewheel to see other keys'
};

// This will replace all default language options with these language options.
// it is separated out here so the layout demo will work properly.
$.extend(true, $.keyboard.defaultOptions, language.swedish);
