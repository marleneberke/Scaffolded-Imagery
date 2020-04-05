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
	    name: "grid",
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
		      default: 5000,
		      description: "The length of stimulus presentation"
		    },
				frame_duration: {
		      type: jsPsych.plugins.parameterType.INT,
		      pretty_name: "Frame duration",
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
		      default: 3000,
		      description: "How long the animation takes. Must be less than duration of trial"
		    },
		    text_above: {
		      type: jsPsych.plugins.parameterType.STRING,
		      pretty_name: "Text above",
		      default: "",
		      description: "Text to place above grid"
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
	    }
	 }


	//BEGINNING OF TRIAL
	plugin.trial = function(display_element, trial) {

		//--------------------------------------
		//---------SET PARAMETERS BEGIN---------
		//--------------------------------------

		//Convert the parameter variables to those that the code below can use
		var trial_duration = trial.trial_duration; //The duration of the trial
		var frame_duration = trial.frame_duration; //The time each frame in the animation lasts
		var bright_block_IDs = trial.bright_block_IDs; //The ID numbers of the blocks that get brighter
		var starting_brightness = trial.starting_brightness; //The brightness that the blocks start at
		var brightness_change = trial.brightness_change; //The amount by which the brightness of the blocks specified in bright_block_IDs change
		var animation_duration = trial.animation_duration; //Time for fade-in
		var text_above = trial.text_above; //The text displayed above the grid
		var shape_in_text = trial.shape_in_text; // The shape to draw near the text. Is something like [0,1,2,4,7] for a T, for instance
		var text_below = trial.text_below; //The text displayed above the grid

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

		//Add the text above
		ctx.textAlign = "center";
	  ctx.font = "30px Arial";
		ctx.fillText(text_above, canvasWidth/2, canvasHeight/4);

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


		//--------Set up Canvas end-------

		//--------Set up animation start


		//parameters for the grid
		var dim = 3 //3x3 grid of squares
		var grid_side_length = canvasHeight/4
		var square_side_length = grid_side_length/dim
		var x = canvasWidth/2 - grid_side_length/2 //upper left corner of grid
		var y = canvasHeight/2 - grid_side_length/2 //upper left corner of grid

		var onset_of_animation = trial_duration - animation_duration

		//as it's currently set up, the grid is displayed plain for onset_of_animaption + frame_duration amont of time
		var frame_times = make_array(start = onset_of_animation, to = trial_duration-frame_duration, by = frame_duration)
		var brightnesses = make_array(start = starting_brightness+brightness_change/(frame_times.length), to = starting_brightness+brightness_change, by = brightness_change/(frame_times.length));

		//force brightnesses to have the same length as frame_times
		if (brightnesses.length !== frame_times.length){
			console.log("frame_times", frame_times);
			console.log("brightnesses", brightnesses);
			console.log("frame_times.length", frame_times.length);
			console.log("brightnesses.length", brightnesses.length);
			while (brightnesses.length < frame_times.length){
				brightnesses.push(starting_brightness+brightness_change);
			}
			while (brightnesses.length > frame_times.length){
				brightnesses.pop();
			}
			console.log("frame_times", frame_times);
			console.log("brightnesses", brightnesses);
		}

		//make sure they have the same length
		console.assert(frame_times.length == brightnesses.length, "frame_times and brightnesses have different lengths!")

		display_grid(starting_brightness);

		for (index = 0; index < frame_times.length; index++) {
			index_dynamic = 0;//need an index that changes dynamically as we go through
			//timeouts
			jsPsych.pluginAPI.setTimeout(function() {
				show_next_frame(brightnesses[index_dynamic], bright_block_IDs, starting_brightness);
				index_dynamic++
			}, frame_times[index]);
		};

		// end the trial after trial_duration
		jsPsych.pluginAPI.setTimeout(function() {
      endTrial();
    }, trial_duration);

		//makes a 3-by-3 grid of squares
		function display_grid(starting_brightness) {
			//draw the 9 squares
			for (j = 0; j < dim; j++){
				for (i = 0; i < dim; i++){
					draw_square(x + i*square_side_length, y + j*square_side_length, square_side_length, starting_brightness);
				};
			};
		};

		//(x,y) is the location of the upper left corner of the square. side_length
		//is the length of the square's sides. color is a float between 0 and 255
		function draw_square(x, y, side_length, color){
			ctx.lineWidth = 1 //just making sure
			bs = color.toString();
			string = 'rgb(' + bs + ',' + bs + ',' + bs + ')'
			ctx.beginPath();
			ctx.fillStyle = string;
			ctx.fillRect(x, y, side_length, side_length);
			ctx.strokeRect(x, y, side_length, side_length);
		};

		function show_next_frame(brightness, bright_block_IDs, starting_brightness) {
			var id = 0; //id will go from 0 to 8 for the 9 squares

			//clear whatever was within a pixel of the full grid before there before
			ctx.clearRect(x-1, y-1, 3*square_side_length+2, 3*square_side_length+2);

			for (j = 0; j < dim; j++){
				for (i = 0; i < dim; i++){
					if (bright_block_IDs.includes(id)){
						draw_square(x + i*square_side_length, y + j*square_side_length, square_side_length, brightness);
					} else {
						draw_square(x + i*square_side_length, y + j*square_side_length, square_side_length, starting_brightness);
					};
					id++;
				};
			};
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
			if (result[result.length] !== to){
				console.log("to minus start was not divisible by by")
			}
			return result;
		}

    function endTrial() {

      display_element.innerHTML = '';

      var trial_data = {
				"trial_duration": JSON.stringify(trial.trial_duration),
				"frame_duration": JSON.stringify(trial.frame_duration),
        "bright_block_IDs": JSON.stringify(trial.bright_block_IDs),
				"starting_brightness": JSON.stringify(trial.starting_brightness),
				"brightness_change": JSON.stringify(trial.brightness_change),
				"animation_duration": JSON.stringify(trial.animation_duration),
				"text_above": JSON.stringify(trial.text_above),
				"shape_in_text": JSON.stringify(trial.shape_in_text),
				"text_below": JSON.stringify(trial.text_below)
      };

      jsPsych.finishTrial(trial_data);
    }

	}; // END OF TRIAL

	//Return the plugin object which contains the trial
	return plugin;
})();
