# ============================================================
# ELECTRICITY CONSUMPTION PREDICTION MODEL
# ============================================================


# Create training dataset

data <- data.frame(

    Temperature = c(
        25,28,30,32,35,
        27,29,31,34,36,
        26,28,33,35,30,
        24,29,32,37,27,
        31,34,36,25,30,
        33,38,26,29,35
    ),

    People = c(
        2,3,4,4,5,
        2,3,4,5,5,
        2,3,4,5,4,
        2,4,5,5,3,
        4,4,6,3,3,
        5,6,2,3,5
    ),

    ApplianceHours = c(
        4,5,6,7,9,
        4,5,7,8,10,
        4,6,7,9,6,
        3,6,8,10,5,
        7,8,10,4,6,
        8,11,5,6,9
    ),

    HouseSize = c(
        800,900,1000,1100,1300,
        750,950,1050,1250,1400,
        850,1000,1150,1350,1050,
        700,1100,1200,1450,850,
        1150,1300,1500,900,950,
        1250,1550,800,1000,1400
    ),

    Consumption = c(
        8.2,10.1,12.4,14.0,18.2,
        7.9,10.8,13.5,17.0,20.1,
        8.8,11.2,14.8,18.5,12.9,
        7.1,12.8,16.2,21.3,9.7,
        14.1,16.9,22.5,9.0,11.7,
        16.8,24.1,8.9,11.9,19.7
    )
)


# Train Multiple Linear Regression Model

model <- lm(
    Consumption ~
        Temperature +
        People +
        ApplianceHours +
        HouseSize,
    data = data
)


# Read command-line arguments

args <- commandArgs(trailingOnly = TRUE)


if (length(args) < 4) {

    cat("Error: Please provide 4 values.\n")

    quit(
        status = 1
    )
}


# Convert inputs to numbers

temperature <- as.numeric(args[1])

people <- as.numeric(args[2])

applianceHours <- as.numeric(args[3])

houseSize <- as.numeric(args[4])


# Create new data

new_house <- data.frame(

    Temperature = temperature,

    People = people,

    ApplianceHours = applianceHours,

    HouseSize = houseSize

)


# Predict

prediction <- predict(
    model,
    newdata = new_house
)


# Print only prediction

cat(
    round(prediction, 2)
)