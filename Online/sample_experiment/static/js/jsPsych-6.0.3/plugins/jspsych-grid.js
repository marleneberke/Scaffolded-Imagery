/*

   Draw grid plugin for JsPsych

	 Draws a 3x3 grid and increases brightness of some subset of squares
	----------------------

	This code is by Marlene Berke (2020)
	----------------------

*/


jsPsych.plugins["grid"] = (function() {

	var plugin = {};

	plugin.info = {
	    name: "draw-grid",
			parameters: {
		    // choices: {
		    //   type: jsPsych.plugins.parameterType.INT,
		    //   pretty_name: "Choices",
		    //   default: [],
		    //   array: true,
		    //   description: "The valid keys that the subject can press to indicate a response"
		    // },
		    trial_duration: {
		      type: jsPsych.plugins.parameterType.INT,
		      pretty_name: "Trial duration",
		      default: 10000,
		      description: "The length of stimulus presentation"
		    },
				time_per_frame: {
		      type: jsPsych.plugins.parameterType.INT,
		      pretty_name: "Trial duration",
		      default: 500,
		      description: "The length of each frame of the animation"
		    },
		    bright_block_IDs: {
		      type: jsPsych.plugins.parameterType.INT,
		      pretty_name: "Bright block IDs",
					array: true,
		      default: [],
		      description: "The IDs of the blocks to make more bright"
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
		    animation_duration: {
		      type: jsPsych.plugins.parameterType.FLOAT,
		      pretty_name: "Duration of animation",
		      default: 5000,
		      description: "How long the animation takes. Must be less than duration of trial"
		    },
		    text_above: {																	//Martin
		      type: jsPsych.plugins.parameterType.STRING,									//Martin
		      pretty_name: "Text above",													//Martin
		      default: "",																	//Martin
		      description: "Text to place above grid"								//Martin
		    }
	    }
	 }


	//BEGINNING OF TRIAL
	plugin.trial = function(display_element, trial) {

		//--------------------------------------
		//---------SET PARAMETERS BEGIN---------
		//--------------------------------------


		//Note on '||' logical operator: If the first option is 'undefined', it evalutes to 'false' and the second option is returned as the assignment
		//trial.choices = assignParameterValue(trial.choices, []);
		// trial.trial_duration = assignParameterValue(trial.trial_duration, 1000);
		// trial.bright_block_IDs = assignParameterValue(trial.bright_block_IDs, []);
		// trial.starting_brightness = assignParameterValue(trial.starting_brightness, 0.0);
		// trial.brightness_change = assignParameterValue(trial.brightness_change, 0.0);
		// trial.duration_of_fade_in = assignParameterValue(trial.duration_of_fade_in, 500);
		// trial.text_above = assignParameterValue(trial.text_above, "");

		//Convert the parameter variables to those that the code below can use
		var trial_duration = trial.trial_duration; //The duration of the trial
		var time_per_frame = trial.time_per_frame //The time each frame in the animation lasts
		var bright_block_IDs = trial.bright_block_IDs; //The ID numbers of the blocks that get brighter
		var starting_brightness = trial.starting_brightness; //The brightness that the blocks start at
		var brightness_change = trial.brightness_change; //The amount by which the brightness of the blocks specified in bright_block_IDs change
		var animation_duration = trial.animation_duration; //Time for fade-in
		var text_above = trial.text_above; //The text displayed above the grid


		//--------------------------------------
		//----------SET PARAMETERS END----------
		//--------------------------------------

		//--------Set up Canvas begin-------

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


		//--------Set up Canvas end-------

		// //set timeout
		// jsPsych.pluginAPI.setTimeout(function() {
    //   endTrial();
    // }, trial.trial_duration);


		//--------Set up animation start

		var onset_of_animation = trial_duration - animation_duration

		console.log("starting_brightness", starting_brightness);
		display_grid(starting_brightness);

		//as it's currently set up, the grid is displayed plain for onset_of_animaption + time_per_frame amont of time
		var frame_times = make_array(start = onset_of_animation, to = trial_duration-time_per_frame, by = time_per_frame)
		var brightnesses = make_array(start = starting_brightness+brightness_change/(frame_times.length), to = starting_brightness+brightness_change, by = brightness_change/(frame_times.length))

		console.log("frame_times", frame_times)
		console.log("brightnesses", brightnesses)

		for (index = 0; index < frame_times.length; index++) {
			index_dynamic = 0;//need an index that changes dynamically as we go through
			//timeouts
			jsPsych.pluginAPI.setTimeout(function() {

				console.log("index_dynamic", index_dynamic)
				show_next_frame(brightnesses[index_dynamic]);
				index_dynamic++
			}, frame_times[index]);
		};

		// end the trial after trial_duration
		jsPsych.pluginAPI.setTimeout(function() {
      endTrial();
    }, trial_duration);

		function display_grid(starting_brightness) {
			bs = starting_brightness.toString();
			grid_side_length = canvasHeight/2
			x = canvasWidth/2 - grid_side_length/2
			y = canvasHeight/2 - grid_side_length/2
			ctx.beginPath();
			string = 'rgb(' + bs + ',' + bs + ',' + bs + ')'
			ctx.fillStyle = string;
			ctx.fillRect(x, y, grid_side_length, grid_side_length);
			ctx.strokeRect(x, y, grid_side_length, grid_side_length);
		}

		function show_next_frame(brightness) {
			bs = brightness.toString();
			console.log("bs", bs)

			//Drawing the grid
			grid_side_length = canvasHeight/2
			x = canvasWidth/2 - grid_side_length/2
			y = canvasHeight/2 - grid_side_length/2
			ctx.beginPath();
			//ctx.fillStyle = "#A9A9A9"; //dark gray
			string = 'rgb(' + bs + ',' + bs + ',' + bs + ')'
			ctx.fillStyle = string;
			ctx.fillRect(x, y, grid_side_length, grid_side_length);
			ctx.strokeRect(x, y, grid_side_length, grid_side_length);
		}

		//returns an array of ints starting with the value start and increasing by
		//by until reaching to
		function make_array(start, to, by){
			var result = [];
			var i = start;
			while(i <= to){
				result.push(i);
				i = i + by;
			}
			if (result !== by){
				console.log("to minus start was not divisible by by")
			}
			return result;
		}

    function endTrial() {

      display_element.innerHTML = '';

      var trial_data = {
        "bright_block_IDs": JSON.stringify(trial.bright_block_IDs),
				"trial_duration": JSON.stringify(trial.trial_duration)
      };

      jsPsych.finishTrial(trial_data);
    }

	}; // END OF TRIAL

	//Return the plugin object which contains the trial
	return plugin;
})();
