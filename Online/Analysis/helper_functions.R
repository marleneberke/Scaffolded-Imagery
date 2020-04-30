#File with helper functions.

smooth <- function(num, N){
  if(num==0){
    num <- 1/2
  } else if(num==N){
    num <- N-1/2
  }
  return(num)
}

#Returns FA_rate, Hit_rate, dPrime, and criterion bias c when "," is yes and "." is no
sdt_stats <- function(data){
  #current coding: "," is yes, "." is no
  #false alarms are when you answer yes incorrectly
  FAs = nrow(filter(data, response=="," & correct_response=="."))
  NF = nrow(filter(data, correct_response=="."))
  FA_rate <- smooth(FAs, NF)/NF
  Hits = nrow(filter(data, response=="," & correct_response==","))
  NH <- nrow(filter(data, correct_response==","))
  Hit_rate = smooth(Hits, NH)/NH
  correct_rate = nrow(filter(data, correct==1))/(NF+NH)
  dPrime = qnorm(Hit_rate) - qnorm(FA_rate)
  c = -0.5*(qnorm(Hit_rate) + qnorm(FA_rate))
  
  #confidence/meta sdt stuff. R1 is right and 1 on conf. R2 is right and 2 on conf. W1 is wrong and 1. W2 is wrong and 2.
  
  #Get R1. Like hits
  rows <- which(data$correct==1)
  n_correct <- length(rows)
  R1 <- length(which(data[rows+1,]$response==1))
  R1_rate <- smooth(R1, n_correct)/n_correct
  
  #Get W1. Like false alarms.
  #wrong
  rows <- which(data$descriptive_trial_type=="q_change" & is.na(data$correct))
  n_wrong <- length(rows)
  W1 <- length(which(data[rows+1,]$response==1))
  W1_rate <- smooth(W1, n_wrong)/n_wrong
  
  meta_dPrime = qnorm(R1_rate) - qnorm(W1_rate)
  meta_c = -0.5*(qnorm(R1_rate) + qnorm(W1_rate))
  
  return(list("Hit_rate" = Hit_rate, "FA_rate" = FA_rate, "correct_rate"= correct_rate, "dPrime" = dPrime, "c" = c, "meta_dPrime" = meta_dPrime, "meta_c" = meta_c))
}
