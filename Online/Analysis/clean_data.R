library(dplyr)

data = read.csv("Scaffolded_Imagery.csv", header = T)

#clean the data
#things to make numberic
cols_numeric <- c("UniqueID", "brightness_change", "correct")
data[cols_numeric] <- sapply(data[cols_numeric], as.character)
data[cols_numeric] <- sapply(data[cols_numeric], as.numeric)

# #Looking for last row for each random_particpant_ID
# IDs <- unique(data$random_participant_ID)
# for(id in IDs){
#   View(tail(filter(data, random_participant_ID == id)))
# }

subject1 <- filter(data, random_participant_ID == "NNF1UQD36Z")
subject2 <- filter(data, random_participant_ID == "O2HUFSME9Q")

combined_data <- bind_rows(subject1, subject2)

write.csv(combined_data, file = 'cleaned_data.csv')