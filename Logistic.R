# 1. Simple hardcoded dataset (4 hours or more passes)
df <- data.frame(
  hours = c(1, 2, 3, 5, 6),
  pass  = c(0, 0, 0, 1, 1) # 0 = Fail, 1 = Pass
)

# 2. Fit simple logistic regression model
model <- glm(pass ~ hours, data = df, family = binomial)

# 3. Predict outcome for a student who studied 4 hours
new_data <- data.frame(hours = 4)
prob <- predict(model, newdata = new_data, type = "response")

cat("Pass Probability:", round(prob, 2), "\n")
cat("Result:", ifelse(prob >= 0.5, "Pass", "Fail"), "\n")