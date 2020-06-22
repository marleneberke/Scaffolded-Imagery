/**
* jspsych-html-keyboard-response
* Josh de Leeuw
*
* plugin for displaying a stimulus and getting a keyboard response
*
* documentation: docs.jspsych.org
*
**/


jsPsych.plugins["grid-html-keyboard-response"] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'html-keyboard-response',
    description: '',
    parameters: {
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        array: true,
        pretty_name: 'Choices',
        default: jsPsych.ALL_KEYS,
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
      },
      bright_block_IDs: {
				type: jsPsych.plugins.parameterType.INT,
				pretty_name: "Bright block IDs",
				array: true,
				default: [],
				description: "The IDs of the blocks to make more bright"
			},
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show trial before it ends.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when subject makes a response.'
      },
      starting_brightness: {
        type: jsPsych.plugins.parameterType.FLOAT,
        pretty_name: "Starting brightness",
        default: 100,
        description: "The initial brightness of the blocks"
      },
      brightness_change: {
        type: jsPsych.plugins.parameterType.FLOAT,
        pretty_name: "Brightness change",
        default: 100,
        description: "The change in brightness"
      },
      text_above: {
				type: jsPsych.plugins.parameterType.STRING,
				pretty_name: "Text above",
				default: "",
				description: "Text to place above grid"
			},
      text_above_font: {
				type: jsPsych.plugins.parameterType.STRING,
				pretty_name: "Font for text above",
				default: "30px Arial",
				description: "Font for text above"
			},
			shape_in_text: {
				type: jsPsych.plugins.parameterType.STRING,
				pretty_name: "Shape in text",
				default: [],
				description: "Key for the shape to draw in text"
			},
			text_below: {
				type: jsPsych.plugins.parameterType.STRING,
				pretty_name: "Text below",
				default: "",
				description: "Text to place below grid"
			},
      outline: {
				type: jsPsych.plugins.parameterType.BOOL,
				pretty_name: "Whether or not to outline shape",
				default: false,
				description: "Whether or not to outline shape" // only implimented for L shape
			},
      compare_obvious_and_faint: {
				type: jsPsych.plugins.parameterType.BOOL, //for instructions showing a faint and an obvious change side-by-side
				pretty_name: "Whether to show an obvious and a faint change",
				default: false,
				description: "Whether to show an obvious and a faint change"
			},
    }
  }

  plugin.trial = function(display_element, trial) {

    var starting_brightness = trial.starting_brightness; //The brightness that the blocks start at
    var brighter_brightness = trial.brightness_change + starting_brightness //The brightness of the brighter blocks
    var bright_block_IDs = trial.bright_block_IDs; //The ID numbers of the blocks that get brighter
    var text_above = trial.text_above; //The text displayed above the grid
		var shape_in_text = trial.shape_in_text; // The shape to draw near the text. Is something like [0,1,2,4,7] for a T, for instance
		var text_below = trial.text_below; //The text displayed above the grid
    var text_above_font = trial.text_above_font; //The font for the text above
    var outline = trial.outline //Whether or not to outline shape
    var compare_obvious_and_faint = trial.compare_obvious_and_faint //Show a faint and an obvious change side-by-side

    ////////////////////Draw grid on canvasWidth
    backgroundColor = "white"

    //Create a canvas element and append it to the DOM
    var canvas = document.createElement("canvas");
    display_element.appendChild(canvas);


    //The document body IS 'display_element' (i.e. <body class="jspsych-display-element"> .... </body> )
    var body = document.getElementsByClassName("jspsych-display-element")[0];

    //Save the current settings to be restored later
    var originalMargin = body.style.margin;
    var originalPadding = body.style.padding;
    var originalBackgroundColor = body.style.backgroundColor;

    //Remove the margins and paddings of the display_element
    body.style.margin = 0;
    body.style.padding = 0;
    body.style.backgroundColor = backgroundColor; //Match the background of the display element to the background color of the canvas so that the removal of the canvas at the end of the trial is not noticed

    //Remove the margins and padding of the canvas
    canvas.style.margin = 0;
    canvas.style.padding = 0;

    //Get the context of the canvas so that it can be painted on.
    var ctx = canvas.getContext("2d");

    //Declare variables for width and height, and also set the canvas width and height to the window width and height
    var canvasWidth = canvas.width = window.innerWidth;
    var canvasHeight = canvas.height = window.innerHeight;

    //Set the canvas background color
    canvas.style.backgroundColor = backgroundColor;

    //Add the text above
		ctx.textAlign = "center";
		ctx.font = text_above_font;
		ctx.fillText(text_above, canvasWidth/2, canvasHeight/4, maxWidth = canvasWidth);

		//Add the text below
		ctx.textAlign = "center";
		ctx.font = "30px Arial";
		ctx.fillText(text_below, canvasWidth/2, canvasHeight*3/4);

		//Add the shape
		ctx.lineWidth = 8;
		starting_x = canvasWidth/2
		starting_y = canvasHeight/3 - 20
		if (shape_in_text.toString() == "0,1,2,3,6"){
			//horizontal line
			ctx.beginPath();
			ctx.moveTo(starting_x - 10, starting_y);
			ctx.lineTo(starting_x + 10, starting_y);
			ctx.stroke();
			//vertical line
			ctx.beginPath();
			ctx.moveTo(starting_x - 10, starting_y - 4);
			ctx.lineTo(starting_x - 10, starting_y + 20);
			ctx.stroke();
		} else if (shape_in_text.toString() == "0,1,2,5,8") {
			//horizontal line
			ctx.beginPath();
			ctx.moveTo(starting_x - 10, starting_y);
			ctx.lineTo(starting_x + 10, starting_y);
			ctx.stroke();
			//vertical line
			ctx.beginPath();
			ctx.moveTo(starting_x + 10, starting_y - 4);
			ctx.lineTo(starting_x + 10, starting_y + 20);
			ctx.stroke();
		} else if (shape_in_text.toString() == "0,3,6,7,8") {
			//horizontal line
			ctx.beginPath();
			ctx.moveTo(starting_x, starting_y + 12);
			ctx.lineTo(starting_x + 24, starting_y + 12);
			ctx.stroke();
			//vertical line
			ctx.beginPath();
			ctx.moveTo(starting_x, starting_y - 12);
			ctx.lineTo(starting_x, starting_y + 16);
			ctx.stroke();
		} else if (shape_in_text.toString() == "2,5,8,6,7") {
			//want to shift the whole thing up and left

			//horizontal line
			ctx.beginPath();
			ctx.moveTo(starting_x - 12, starting_y + 10);
			ctx.lineTo(starting_x + 12, starting_y + 10);
			ctx.stroke();
			//vertical line
			ctx.beginPath();
			ctx.moveTo(starting_x + 12, starting_y - 14);
			ctx.lineTo(starting_x + 12, starting_y + 14);
			ctx.stroke();
		} else if (shape_in_text.toString() == "0,1,2,4,7"){
			//horizontal line
			ctx.beginPath();
			ctx.moveTo(starting_x - 12, starting_y);
			ctx.lineTo(starting_x + 12, starting_y);
			ctx.stroke();
			//vertical line
			ctx.beginPath();
			ctx.moveTo(starting_x, starting_y - 4);
			ctx.lineTo(starting_x, starting_y + 20);
			ctx.stroke();
		} else if (shape_in_text.toString() == "1,4,6,7,8"){
			//horizontal line
			ctx.beginPath();
			ctx.moveTo(starting_x - 16, starting_y + 20);
			ctx.lineTo(starting_x + 16, starting_y + 20);
			ctx.stroke();
			//vertical line
			ctx.beginPath();
			ctx.moveTo(starting_x, starting_y - 4);
			ctx.lineTo(starting_x, starting_y + 20);
			ctx.stroke();
		} else if (shape_in_text.toString() == "0,3,6,4,5"){
			//horizontal line
			ctx.beginPath();
			ctx.moveTo(starting_x - 6, starting_y);
			ctx.lineTo(starting_x + 18, starting_y);
			ctx.stroke();
			//vertical line
			ctx.beginPath();
			ctx.moveTo(starting_x - 2, starting_y - 14);
			ctx.lineTo(starting_x - 2, starting_y + 14);
			ctx.stroke();
		} else if (shape_in_text.toString() == "3,4,5,2,8"){
			//horizontal line
			ctx.beginPath();
			ctx.moveTo(starting_x - 6, starting_y);
			ctx.lineTo(starting_x + 18, starting_y);
			ctx.stroke();
			//vertical line
			ctx.beginPath();
			ctx.moveTo(starting_x + 14, starting_y - 14);
			ctx.lineTo(starting_x + 14, starting_y + 14);
			ctx.stroke();
		}

		//set line width back to normal for drawing grid later
		ctx.lineWidth = 1;

    var dim = 3;
    var grid_side_length = canvasHeight/4
    var square_side_length = grid_side_length/dim

    if (compare_obvious_and_faint){
      //grid on left
      var x = canvasWidth/4 - grid_side_length/2 //upper left corner of grid
      display_grid(x, bright_block_IDs, starting_brightness, starting_brightness+50);

      //grid on right
      var x = 3*canvasWidth/4 - grid_side_length/2 //upper left corner of grid
      display_grid(x, bright_block_IDs, starting_brightness, starting_brightness+15);
    } else {
      var x = canvasWidth/2 - grid_side_length/2 //upper left corner of grid
      display_grid(x, bright_block_IDs, starting_brightness, brighter_brightness);
    }

    if (outline) outline_shape();

    //makes a 3-by-3 grid of squares
    function display_grid(x, bright_block_IDs, starting_brightness, brighter_brightness) {
      //var grid_side_length = canvasHeight/4
      //var square_side_length = grid_side_length/dim
      //var x = canvasWidth/2 - grid_side_length/2 //upper left corner of grid
      var y = canvasHeight/2 - grid_side_length/2 //upper left corner of grid

      //draw the 9 squares
      var dim = 3;

      var id = 0;
      for (j = 0; j < dim; j++){
        for (i = 0; i < dim; i++){
          if (bright_block_IDs.includes(id)){
						draw_square(x + i*square_side_length, y + j*square_side_length, square_side_length, brighter_brightness);
					} else {
						draw_square(x + i*square_side_length, y + j*square_side_length, square_side_length, starting_brightness);
					};
					id++;
        };
      };
    };

    //(x,y) is the location of the upper left corner of the square. side_length
    //is the length of the square's sides. color is a float between 0 and 255
    function draw_square(x, y, side_length, color){
      bs = color.toString();
      string = 'rgb(' + bs + ',' + bs + ',' + bs + ')'
      ctx.beginPath();
      ctx.fillStyle = string;
      ctx.fillRect(x, y, side_length, side_length);
      ctx.strokeRect(x, y, side_length, side_length);
    };

    //only implimented for L-shape
    function outline_shape(){
      var dim = 3;
      var grid_side_length = canvasHeight/4;
      var square_side_length = grid_side_length/dim;

      var x = canvasWidth/2 - grid_side_length/2; //upper left corner of grid
      var y = canvasHeight/2 - grid_side_length/2; //upper left corner of grid

      ctx.lineWidth = 4;

      //long vertical line
      ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(x, y + grid_side_length);
			ctx.stroke();

      //long horizontal line
      ctx.beginPath();
			ctx.moveTo(x, y + grid_side_length);
			ctx.lineTo(x + grid_side_length, y + grid_side_length);
			ctx.stroke();

      //short horizontal line at top
      ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(x + square_side_length, y);
			ctx.stroke();

      //vertical line down
      ctx.beginPath();
			ctx.moveTo(x + square_side_length, y);
			ctx.lineTo(x + square_side_length, y + 2*square_side_length);
			ctx.stroke();

      //horizontal line
      ctx.beginPath();
			ctx.moveTo(x + square_side_length, y + 2*square_side_length);
			ctx.lineTo(x + 3*square_side_length, y + 2*square_side_length);
			ctx.stroke();

      //short vertical line down
      ctx.beginPath();
			ctx.moveTo(x + grid_side_length, y + 2*square_side_length);
			ctx.lineTo(x + grid_side_length, y + grid_side_length);
			ctx.stroke();
    };

    function display_obvious_and_faint(){

    };

    /////////////////

    //var new_html = '<div id="jspsych-html-keyboard-response-stimulus">'+trial.stimulus+'</div>';
    //Add the text above
    ctx.fillStyle = "black";
		ctx.textAlign = "center";

    // draw
    //display_element.innerHTML = new_html;

    // store response
    var response = {
      rt: null,
      key: null
    };

    // function to end trial when it is time
    var end_trial = function() {

      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // kill keyboard listeners
      if (typeof keyboardListener !== 'undefined') {
        jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
      }

      // gather the data to store for the trial
      var trial_data = {
        "rt": response.rt,
        "stimulus": trial.stimulus,
        "key_press": response.key
      };

      // clear the display
      display_element.innerHTML = '';

      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    // function to handle responses by the subject
    var after_response = function(info) {

      // after a valid response, the stimulus will have the CSS class 'responded'
      // which can be used to provide visual feedback that a response was recorded
      //display_element.querySelector('#jspsych-html-keyboard-response-stimulus').className += ' responded';

      // only record the first response
      if (response.key == null) {
        response = info;
      }

      if (trial.response_ends_trial) {
        end_trial();
      }
    };

    // start the response listener
    if (trial.choices != jsPsych.NO_KEYS) {
      var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.choices,
        rt_method: 'date',
        persist: false,
        allow_held_key: false
      });
    }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

  };

  return plugin;
})();
