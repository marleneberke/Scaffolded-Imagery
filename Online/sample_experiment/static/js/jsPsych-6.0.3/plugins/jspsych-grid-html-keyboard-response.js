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
      stimulus: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The HTML string to be displayed'
      },
      choices: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        array: true,
        pretty_name: 'Choices',
        default: jsPsych.ALL_KEYS,
        description: 'The keys the subject is allowed to press to respond to the stimulus.'
      },
      stimulus_font: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Font',
        default: "30px Arial",
        description: 'The font to use for the stimulus and prompt.'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: null,
        description: 'Any content here will be displayed below the stimulus.'
      },
      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.'
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
    }
  }

  plugin.trial = function(display_element, trial) {

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

    display_grid(trial.starting_brightness);

    //makes a 3-by-3 grid of squares
    function display_grid(starting_brightness) {
      //draw the 9 squares
      var dim = 3;
      var grid_side_length = canvasHeight/4
      var square_side_length = grid_side_length/dim
      var x = canvasWidth/2 - grid_side_length/2 //upper left corner of grid
      var y = canvasHeight/2 - grid_side_length/2 //upper left corner of grid

      for (j = 0; j < dim; j++){
        for (i = 0; i < dim; i++){
          draw_square(x + i*square_side_length, y + j*square_side_length, square_side_length, starting_brightness);
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
      ctx.strokeRect(x, y, side_length, side_length);
    };

    /////////////////

    //var new_html = '<div id="jspsych-html-keyboard-response-stimulus">'+trial.stimulus+'</div>';
    //Add the text above
    ctx.fillStyle = "black";
		ctx.textAlign = "center";
	  ctx.font = trial.stimulus_font;
		ctx.fillText(trial.stimulus, canvasWidth/2, canvasHeight/4);

    // add prompt
    ctx.font = "30px Arial"
    if(trial.prompt !== null){
      ctx.fillText(trial.prompt, canvasWidth/2, canvasHeight*3/4);
    }

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

    // hide stimulus if stimulus_duration is set
    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-html-keyboard-response-stimulus').style.visibility = 'hidden';
      }, trial.stimulus_duration);
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
