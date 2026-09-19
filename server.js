const express = require("express");

const cors = require("cors");

const { execFile } = require("child_process");

const path = require("path");


const app = express();

const PORT = 3000;


app.use(cors());

app.use(express.json());


app.post("/predict", (req, res) => {

    const {
        temperature,
        people,
        applianceHours,
        houseSize
    } = req.body;


    // Validation

    if (
        !Number.isFinite(Number(temperature)) ||
        !Number.isFinite(Number(people)) ||
        !Number.isFinite(Number(applianceHours)) ||
        !Number.isFinite(Number(houseSize))
    ) {

        return res.status(400).json({

            error: "Invalid input values."

        });

    }


    const rFile = path.join(
        __dirname,
        "electricity_prediction.R"
    );


    const rArguments = [

        String(temperature),

        String(people),

        String(applianceHours),

        String(houseSize)

    ];


    execFile(
        "Rscript",
        [rFile, ...rArguments],
        (error, stdout, stderr) => {

            if (error) {

                console.error(stderr);

                return res.status(500).json({

                    error:
                        "R prediction failed. Make sure R and Rscript are installed."

                });

            }


            const prediction =
                Number(stdout.trim());


            if (!Number.isFinite(prediction)) {

                return res.status(500).json({

                    error:
                        "Invalid prediction returned by R."

                });

            }


            res.json({

                prediction: prediction

            });

        }
    );

});


app.get("/", (req, res) => {

    res.send(
        "Electricity Prediction API is running ⚡"
    );

});


app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});