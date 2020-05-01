library(dplyr)
library(ggplot2)
library(ggpubr)
#library(psych)

source("Analysis/helper_functions.R")

data = read.csv("Data/April_2020/cleaned_data.csv", header = T)

subject1 <- filter(data, random_participant_ID == "NNF1UQD36Z")
subject2 <- filter(data, random_participant_ID == "O2HUFSME9Q")

# subjects <- list(subject1, subject2)
# 
# for(i in 1:length(subjects)){
#   subjects[i]
# }

subject <- subject2

View(tail(filter(subject, trial_type=="instructions")))
last_instruction_before_staircasing <- tail(filter(subject, trial_type=="instructions"))[3,]$UniqueID #1350
#1351 where first staircase starts
#1471 #where staircasing stops. 1472 begins imagery condition
#1568 begins no-imagery condition
#1616 begins second staircase?
#1677 begins vviq
last_instruction <- tail(filter(subject, trial_type=="instructions"))[6,]$UniqueID #1694
last_staircasing_start <- last_instruction - 78

#############################################################################################
#No imagery condition

#there are 32 imagery trials. 3 rows per trial -> 96 rows between 1568 and 1472
#There seem to be 36 no-imagery trials. 1676 - 1568 = 108. 108/3 = 36. Why -- 20 more staircasing trials at the end!
start = 1072 #1568   #1072 = 1121- 1-16*3
num_trials_no_imagery = 16
rows_per_trial = 3

end <- start + num_trials_no_imagery*rows_per_trial #1616
subject_no_imagery <- filter(subject, UniqueID > start  & UniqueID < end + 1)

subject_no_imagery_stats <- sdt_stats(subject_no_imagery)


#############################################################################################
#Imagery condition

start <- 1121 #1471
num_trials_imagery <- 32
end <- start + num_trials_imagery * rows_per_trial

subject_imagery <- filter(subject, UniqueID > start  & UniqueID < end+1)
#Note: trials where no change occured are shared between imagery_matched and imagery_mismatched

#Getting the part of the dataframe for imagery_matched
rows_match <- which(subject_imagery$shape_in_text!="NULL" & (subject_imagery$shape_in_text == subject_imagery$bright_block_IDs | subject_imagery$bright_block_IDs=="[]"))
rows <- sort(c(rows_match, rows_match+1, rows_match+2))
subject_imagery_match <- subject_imagery[rows, ]

subject_imagery_match_stats = sdt_stats(subject_imagery_match) 

#Getting the part of the dataframe for imagery_mismatched
rows_mismatch <- which(subject_imagery$shape_in_text != "NULL" & subject_imagery$shape_in_text != subject_imagery$bright_block_IDs)
rows <- sort(c(rows_mismatch, rows_mismatch+1, rows_mismatch+2))
subject_imagery_mismatch <- subject_imagery[rows, ]

subject_imagery_mismatch_stats = sdt_stats(subject_imagery_mismatch)

#############################################################################################

#Plotting dPrime for different conditions

df <- data.frame(Condition = c("No imagery","Matched imagery", "Mismatched imagery"), 
                 dPrime=c(subject_no_imagery_stats$dPrime, subject_imagery_match_stats$dPrime, subject_imagery_mismatch_stats$dPrime))
print(df)

p <- ggplot(data = df, aes(x = Condition, y = dPrime)) +
  geom_bar(stat = "identity")
p

#Plotting meta_dPrime for different conditions

df <- data.frame(Condition = c("No imagery","Matched imagery", "Mismatched imagery"), 
                 meta_dPrime=c(subject_no_imagery_stats$meta_dPrime, subject_imagery_match_stats$meta_dPrime, subject_imagery_mismatch_stats$meta_dPrime))
print(df)

p <- ggplot(data = df, aes(x = Condition, y = meta_dPrime)) +
  geom_bar(stat = "identity")
p

#############################################################################################
#Comparing staircases

#staircase 1
start = last_instruction_before_staircasing + 1 #40 trials, 3 rows each -> 120 rows
#end = 1471

num_trials_first_staircase = 40
rows_per_trial = 3
end <- start + num_trials_first_staircase*rows_per_trial #1471
subject_first_staircase <- filter(subject, UniqueID > start - 1  & UniqueID < end)

subject_first_staircase_stats = sdt_stats(subject_first_staircase)

#staircase 2
start = last_staircasing_start #20 trials, 3 rows each

num_trials_second_staircase = 20
rows_per_trial = 3
end <- start + num_trials_second_staircase*rows_per_trial #1471
subject_second_staircase <- filter(subject, UniqueID > start - 1  & UniqueID < end + 1)

subject_second_staircase_stats = sdt_stats(subject_second_staircase)

#plot staircasing
ggplot(data=filter(subject, brightness_change!="NULL"), aes(x=UniqueID, y=brightness_change)) +
  geom_line() +
  coord_cartesian(ylim = c(0, 30))

#############################################################################################
#VVIQ
