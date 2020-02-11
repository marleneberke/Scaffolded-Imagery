# from psychopy import gui
from psychopy import visual, core, event, data
import csv
import os
import random
import numpy as np


# Joan Danielle K. Ongchoco
# Observers will imagine on a grid and detect changes.

class Runtrial:
    def __init__(self):
        self.with_practice = 0
        self.with_debrief = 0
        self.automate = 0
        self.test_subject = ""

        self.windowSize = [1440, 900]
        self.windowUnits = "deg"
        self.fullScreen = False

        self.font_name = "Monaco"
        self.font_size = 0.4
        self.font_color = "black"
        self.border_color = "black"
        self.fill_color = "grey"

        self.fontName = "Monaco"
        self.fontSize = 0.5
        self.fontColor = "black"

        self.conditions = [["original", "H", "change", "easyDark"], ["original", "L", "change", "easyDark"],
                           ["original", "T", "change", "easyDark"], ["scrambled", "H", "change", "easyDark"],
                           ["scrambled", "L", "change", "easyDark"], ["scrambled", "T", "change", "easyDark"],
                           ["original", "H", "change", "hardDark"], ["original", "L", "change", "hardDark"],
                           ["original", "T", "change", "hardDark"], ["scrambled", "H", "change", "hardDark"],
                           ["scrambled", "L", "change", "hardDark"], ["scrambled", "T", "change", "hardDark"],
                           ["original", "H", "change", "easyBright"], ["original", "L", "change", "easyBright"],
                           ["original", "T", "change", "easyBright"], ["scrambled", "H", "change", "easyBright"],
                           ["scrambled", "L", "change", "easyBright"], ["scrambled", "T", "change", "easyBright"],
                           ["original", "H", "change", "hardBright"], ["original", "L", "change", "hardBright"],
                           ["original", "T", "change", "hardBright"], ["scrambled", "H", "change", "hardBright"],
                           ["scrambled", "L", "change", "hardBright"], ["scrambled", "T", "change", "hardBright"],
                           ["original", "H", "no change", "easyDark"], ["original", "L", "no change", "easyDark"],
                           ["original", "T", "no change", "easyDark"], ["scrambled", "H", "no change", "easyDark"],
                           ["scrambled", "L", "no change", "easyDark"], ["scrambled", "T", "no change", "easyDark"],
                           ["original", "H", "no change", "hardDark"], ["original", "L", "no change", "hardDark"],
                           ["original", "T", "no change", "hardDark"], ["scrambled", "H", "no change", "hardDark"],
                           ["scrambled", "L", "no change", "hardDark"], ["scrambled", "T", "no change", "hardDark"],
                           ["original", "H", "no change", "easyBright"], ["original", "L", "no change", "easyBright"],
                           ["original", "T", "no change", "easyBright"], ["scrambled", "H", "no change", "easyBright"],
                           ["scrambled", "L", "no change", "easyBright"], ["scrambled", "T", "no change", "easyBright"],
                           ["original", "H", "no change", "hardBright"], ["original", "L", "no change", "hardBright"],
                           ["original", "T", "no change", "hardBright"], ["scrambled", "H", "no change", "hardBright"],
                           ["scrambled", "L", "no change", "hardBright"], ["scrambled", "T", "no change", "hardBright"]
                           ]
        self.num_trials = len(self.conditions)
        self.num_blocks = 2

        self.fieldnames = ["exp_name", "date", "participant", "block_num", "trial_num", "which_tiles",
                           "is_change", "direction", "letter", "response_key", "response_time",
                           "1 Age", "2 Gender",
                           "3 In 1-2 sentences, what do you think the experiment was testing?",
                           "4 How well do you think you did (out of a 100%)?",
                           "5 In 1-2 sentences, please describe any strategies you used in the task.",
                           "6 Did you notice anything else about the task as you were doing it?"]

        # Record experiment info
        exp_name = "ScaffAttnxVividness"
        self.exp_info = {"participant": self.test_subject,
                         "exp_name": exp_name,
                         "date": data.getDateStr()}

        if self.exp_info["participant"] != "":
            # Set up files for saving results
            source_dir = os.path.dirname(os.path.realpath(__file__))
            data_dir = os.path.join(source_dir, "data")
            self.filename = os.path.join(data_dir, "%s_%s_%s" % (self.exp_info["exp_name"],
                                                                 self.exp_info["participant"],
                                                                 self.exp_info["date"]))
            self.csv_filename = self.filename + ".csv"

            # Create the data directory if it does not exist
            if not os.path.isdir(data_dir):
                os.makedirs(data_dir)

            # Set up CSV writer
            self.__csv_file = open(self.csv_filename, "wb")
            self.csv_writer = csv.DictWriter(self.__csv_file, fieldnames=self.fieldnames)
            self.csv_writer.writeheader()

        # Setup expt background
        self.expt_clock = core.Clock()
        self.trial_clock = core.Clock()
        self.response_clock = core.Clock()
        self.win = visual.Window(self.windowSize, color="white",
                                 monitor="testMonitor", units=self.windowUnits, fullscr=self.fullScreen)
        self.win.setMouseVisible(False)

    def __setup_stim(self):
        self.grid_size = 3
        self.square_size = 6
        self.border_W = 0.5
        self.grid_range = np.arange(-3, 4, self.square_size / 2)
        self.standard_opacity = 0.30
        fr = 1 / float(60)
        one_s = fr * 60
        self.countdown = [one_s, one_s * 2, one_s * 3, one_s * 4, one_s * 5]
        self.countdown_time = one_s * 5
        self.interval_time = fr * 30

        self.samples = visual.ImageStim(self.win, image="SampleLetters.png", size=(14, 3.5), pos=(0, 0))
        self.fixation = visual.Rect(self.win, size=0.5, lineWidth=self.border_W,
                                    lineColor="black", fillColor="black", pos=(0, 0))
        self.instruct = visual.TextStim(self.win, font=self.font_name, height=self.font_size,
                                        color=self.font_color, pos=(0, 0))
        self.timer = visual.TextStim(self.win, font=self.font_name, height=self.font_size,
                                     color=self.font_color, pos=(0, 5))
        self.grid = range(self.grid_size * self.grid_size)
        i = 0
        for y in np.arange(-3, 4, self.square_size / 2):
            for x in np.arange(-3, 4, self.square_size / 2):
                self.grid[i] = visual.Rect(self.win, size=self.square_size, lineWidth=self.border_W,
                                           lineColor=self.border_color, fillColor=self.fill_color, pos=(x, y),
                                           opacity=self.standard_opacity)
                i += 1
        self.letterL = [[self.grid_range[0], self.grid_range[2]],
                        [self.grid_range[0], self.grid_range[1]],
                        [self.grid_range[0], self.grid_range[0]],
                        [self.grid_range[1], self.grid_range[0]],
                        [self.grid_range[2], self.grid_range[0]]]
        self.letterT = [[self.grid_range[0], self.grid_range[2]],
                        [self.grid_range[1], self.grid_range[2]],
                        [self.grid_range[2], self.grid_range[2]],
                        [self.grid_range[1], self.grid_range[1]],
                        [self.grid_range[1], self.grid_range[0]]]
        self.letterH = [[self.grid_range[0], self.grid_range[2]],
                        [self.grid_range[0], self.grid_range[1]],
                        [self.grid_range[0], self.grid_range[0]],
                        [self.grid_range[1], self.grid_range[1]],
                        [self.grid_range[2], self.grid_range[2]],
                        [self.grid_range[2], self.grid_range[1]],
                        [self.grid_range[2], self.grid_range[0]]]
        self.fullGrid = [[self.grid_range[0], self.grid_range[0]],
                         [self.grid_range[0], self.grid_range[1]],
                         [self.grid_range[0], self.grid_range[2]],
                         [self.grid_range[1], self.grid_range[0]],
                         [self.grid_range[1], self.grid_range[1]],
                         [self.grid_range[1], self.grid_range[2]],
                         [self.grid_range[2], self.grid_range[0]],
                         [self.grid_range[2], self.grid_range[1]],
                         [self.grid_range[2], self.grid_range[2]]]

    def draw(self):
        for i in range(self.grid_size * self.grid_size):
            self.grid[i].draw()

    def __run_trials(self, block_num, num_trials):

        random.shuffle(self.conditions)

        for trial_num in range(num_trials):
            self.condition = self.conditions[trial_num]
            which_tiles = self.condition[0]
            which_letter = self.condition[1]
            is_change = self.condition[2]
            which_change = self.condition[3]

            print (self.condition)

            for i in range(self.grid_size * self.grid_size):
                self.grid[i].opacity = self.standard_opacity
            if which_tiles == "original":
                if which_letter == "L":
                    shade_letter = self.letterL
                elif which_letter == "H":
                    shade_letter = self.letterH
                elif which_letter == "T":
                    shade_letter = self.letterT
            elif which_tiles == "scrambled":
                shade_letter = random.sample(self.fullGrid, 5)

            # Begins the actual trial
            increment = 0.001
            final_opacity = 0.30
            self.counter1 = 0  # This counter is for the countdown timing
            self.time = 5
            self.timer.text = self.time
            self.instruct.text = "Imagine the letter %s." % which_letter
            self.instruct.pos = (0, 6.5)
            self.trial_clock.reset()
            while True:
                if self.trial_clock.getTime() > self.countdown[self.counter1]:
                    self.counter1 += 1
                    self.time -= 1
                    self.timer.text = self.time
                if self.trial_clock.getTime() > self.countdown_time:
                    break
                escape()
                self.instruct.draw()
                self.timer.draw()

                if self.trial_clock.getTime() > 3:
                    if is_change == "change":
                        if which_change == "easyBright":
                            limit = 0.22
                        elif which_change == "hardBright":
                            limit = 0.27
                        elif which_change == "easyDark":
                            limit = 0.4
                        elif which_change == "hardDark":
                            limit = 0.35
                        for i in range(self.grid_size * self.grid_size):
                            if np.all(np.array(self.grid[i].pos).tolist() in shade_letter):
                                if which_change in ["easyDark", "hardDark"]:
                                    if self.grid[i].opacity < limit:
                                        self.grid[i].opacity += increment
                                        final_opacity = self.grid[i].opacity
                                elif which_change in ["easyBright", "hardBright"]:
                                    if self.grid[i].opacity > limit:
                                        self.grid[i].opacity -= increment
                                        final_opacity = self.grid[i].opacity

                self.draw()
                self.win.flip()

            # After the imagination phase, collect response
            event.clearEvents()
            response_key = None
            response_time = None
            self.instruct.text = "j = Change\nk = No change"
            self.instruct.pos = (0, 2)
            self.trial_clock.reset()
            while True:
                escape()
                self.instruct.draw()
                self.win.flip()
                if self.automate == 1:
                    if self.trial_clock.getTime() > 1:
                        response_key = None
                        response_time = self.trial_clock.getTime()
                        break
                else:
                    key = event.waitKeys(keyList=["j", "k"])
                    if len(key) > 0:
                        response_key = key[0]
                        response_time = self.trial_clock.getTime()
                        break

            if self.exp_info["participant"] != "":
                # Collect responses to csv
                trial_data = self.exp_info
                trial_data["block_num"] = block_num
                trial_data["trial_num"] = trial_num
                trial_data["which_tiles"] = which_tiles
                trial_data["letter"] = which_letter
                trial_data["is_change"] = is_change
                trial_data["direction"] = which_change
                trial_data["final_opacity"] = final_opacity
                trial_data["response_key"] = response_key
                trial_data["response_time"] = response_time
                self.csv_writer.writerow(trial_data)
                self.__csv_file.flush()
                os.fsync(self.__csv_file.fileno())

    def __run_practice(self):
        self.instruct.text = """This task is designed to be difficult!  Sometimes, you might have a pretty clear intuition of how many notes played.  Much more often, you won"t be confident at all.  

This is okay.  Just let the notes wash over you and give your best guess of the total number of musical notes that played, regardless of how confident you are.

Throughout this section, you might find that your attention may start to wander.  Please try your hardest to stay focused, to not get distracted.  Your data will only be useful to me if you do so.

The entire experiment will consist of XX sections. The experiment will take a total of approximately XX minutes to complete. A few times during the experiment, you will come to a screen prompting you to take a break. You can use this time to adjust your seat, stretch, etc. (And if you have any urgent questions during the breaks, you may come out and ask the experimenter.)

Press the spacebar to begin."""
        while True:
            self.instruct.draw()
            self.win.flip()
            key = event.waitKeys(keyList=["space"])
            if len(key) > 0:
                break

    def run(self):
        self.__setup_stim()

        if self.with_practice == 1:
            self.__run_practice()

        for block_num in range(self.num_blocks):
            if block_num == 0:
                self.instruct.text = """You are now about to begin the experiment.

Please take a moment to get comfortable, and press the spacebar when you are ready to begin the experiment."""
                self.instruct.draw()
                self.win.flip()
                event.clearEvents()
                keys = event.waitKeys(maxWait=float("inf"), keyList=["space"])
                if keys[0] == "space":
                    self.expt_clock.reset()
                    self.__run_trials(block_num, self.num_trials)
                    print("Number of Trials:", self.num_trials)
                    print("Total Time:", self.expt_clock.getTime())
            else:
                self.instruct.text = """You"ve finished %s/%s of the sections.

You can now take a break. You can use this time to adjust your seat, stretch, etc.

When you are ready, press the spacebar twice to begin.""" % (block_num, self.num_blocks)
                self.instruct.draw()
                self.win.flip()
                event.clearEvents()
                key1 = event.waitKeys(maxWait=float("inf"), keyList=["space"])
                if key1[0] == "space":
                    key2 = event.waitKeys(maxWait=float("inf"), keyList=["space"])
                    if key2[0] == "space":
                        self.__run_trials(block_num, self.num_trials)
                        print("Total Time:", self.expt_clock.getTime())

        # END OF THE EXPERIMENT###
        self.instruct.pos = (0, 0)
        self.instruct.height = self.fontSize
        while True:
            self.instruct.text = """When you press the spacebar, the screen will exit.  Please wait for a couple moments.  

Several questions will then appear. Press TAB to move to the next question, and press enter ONLY when you are done with all the questions.

Press the spacebar to continue."""
            self.instruct.draw()
            self.win.flip()
            keys = event.waitKeys(maxWait=float("inf"), keyList=["space"])
            if keys[0] == "space":
                break

        self.win.fullscr = False
        self.win.winHandle.minimize()
        self.win.flip()

        core.wait(1)
        self.win.winHandle.activate()
        self.win.flip()

        if self.with_debrief == 1:
            self.basic_qs = {"1 Age": "", "2 Gender": "",
                             "3 In 1-2 sentences, what do you think the experiment was testing?": "",
                             "4 How well do you think you did (out of a 100%)?": "",
                             "5 In 1-2 sentences, please describe any strategies you used in the task.": "",
                             "6 Did you notice anything else about the task as you were doing it?": ""}
            self.ask_basic_qs = gui.DlgFromDict(dictionary=self.basic_qs,
                                                title="Please answer the questions below. Press TAB to move the next question, and enter to submit.")

            if self.exp_info["participant"] != "":
                trial_data = self.basic_qs
                self.csv_writer.writerow(trial_data)
                self.__csv_file.flush()
                os.fsync(self.__csv_file.fileno())

        self.win.winHandle.maximize()
        self.win.winHandle.activate()
        self.win.fullscr = True
        self.win.flip()
        while True:
            self.instruct.text = """Please see the experimenter."""
            self.instruct.draw()
            self.win.flip()
            keys = event.waitKeys(maxWait=float("inf"), keyList=["space"])
            if keys[0] == "space":
                core.quit()


def escape():
    keys = event.getKeys(["escape"], True)
    if len(keys) > 0:
        core.quit()


if __name__ == "__main__":
    expt = Runtrial()
    expt.run()
