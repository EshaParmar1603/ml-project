let energyChart = null;


/* =========================================
   MAIN CALCULATION
========================================= */

function calculateEnergy() {

    /* -------------------------------------
       HOUSEHOLD INFORMATION
    ------------------------------------- */

    const people =
        Number(document.getElementById("people").value);

    const temperature =
        Number(document.getElementById("temperature").value);

    const rate =
        Number(document.getElementById("rate").value);


    /* -------------------------------------
       APPLIANCE CONSUMPTION
       
       Energy = Power × Quantity × Hours
       Convert Wh → kWh by /1000
    ------------------------------------- */

    const appliances =
        document.querySelectorAll(".appliance-card");


    let applianceEnergy = 0;


    appliances.forEach(card => {

        const checkbox =
            card.querySelector(".appliance-check");

        if (!checkbox.checked) {
            return;
        }


        const power =
            Number(checkbox.dataset.power);


        const quantity =
            Number(
                card.querySelector(".quantity").value
            );


        const hours =
            Number(
                card.querySelector(".hours").value
            );


        const energy =
            (power * quantity * hours) / 1000;


        applianceEnergy += energy;

    });


    /* -------------------------------------
       SIMPLE LINEAR REGRESSION STYLE
       ADJUSTMENT

       This represents the ML portion
       for demonstration.

       Later this can be replaced with
       your trained Python/R model.
    ------------------------------------- */

    const peopleEffect =
        people * 0.15;


    const temperatureEffect =
        Math.max(0, temperature - 25) * 0.08;


    let predictedConsumption =
        applianceEnergy +
        peopleEffect +
        temperatureEffect;


    predictedConsumption =
        Number(
            predictedConsumption.toFixed(2)
        );


    /* -------------------------------------
       SOLAR
    ------------------------------------- */

    const solarAvailable =
        document.getElementById(
            "solarAvailable"
        ).checked;


    let solarGeneration = 0;


    if (solarAvailable) {

        const solarCapacity =
            Number(
                document.getElementById(
                    "solarCapacity"
                ).value
            );


        const sunHours =
            Number(
                document.getElementById(
                    "sunHours"
                ).value
            );


        /*
           Educational estimate.

           Real solar output depends on:
           panel efficiency,
           temperature,
           orientation,
           shading,
           inverter losses, etc.
        */

        const solarEfficiency = 0.80;


        solarGeneration =
            solarCapacity *
            sunHours *
            solarEfficiency;

    }


    solarGeneration =
        Number(
            solarGeneration.toFixed(2)
        );


    /* -------------------------------------
       LOCAL WIND
    ------------------------------------- */

    const windAvailable =
        document.getElementById(
            "windAvailable"
        ).checked;


    let windGeneration = 0;


    if (windAvailable) {

        const windCapacity =
            Number(
                document.getElementById(
                    "windCapacity"
                ).value
            );


        const turbines =
            Number(
                document.getElementById(
                    "windTurbines"
                ).value
            );


        const windSpeed =
            Number(
                document.getElementById(
                    "windSpeed"
                ).value
            );


        /*
           Educational wind estimate.

           This is NOT actual turbine
           power-curve modelling.

           Capacity factor approximation.
        */

        let capacityFactor = 0;


        if (windSpeed < 3) {

            capacityFactor = 0;

        }

        else if (windSpeed < 5) {

            capacityFactor = 0.10;

        }

        else if (windSpeed < 7) {

            capacityFactor = 0.25;

        }

        else if (windSpeed < 9) {

            capacityFactor = 0.40;

        }

        else {

            capacityFactor = 0.50;

        }


        /*
           kW × 24 hours × capacity factor
           = estimated daily kWh
        */

        windGeneration =
            windCapacity *
            turbines *
            24 *
            capacityFactor;

    }


    windGeneration =
        Number(
            windGeneration.toFixed(2)
        );


    /* -------------------------------------
       TOTAL RENEWABLE
    ------------------------------------- */

    const totalRenewable =
        Number(
            (
                solarGeneration +
                windGeneration
            ).toFixed(2)
        );


    /* -------------------------------------
       GRID AND SURPLUS
    ------------------------------------- */

    let gridRequired = 0;

    let surplus = 0;


    if (
        totalRenewable <
        predictedConsumption
    ) {

        gridRequired =
            predictedConsumption -
            totalRenewable;

    }

    else {

        surplus =
            totalRenewable -
            predictedConsumption;

    }


    gridRequired =
        Number(
            gridRequired.toFixed(2)
        );


    surplus =
        Number(
            surplus.toFixed(2)
        );


    /* -------------------------------------
       COST
    ------------------------------------- */

    const beforeCost =
        predictedConsumption * rate;


    const afterCost =
        gridRequired * rate;


    const dailySaving =
        Math.max(
            0,
            beforeCost - afterCost
        );


    const monthlySaving =
        dailySaving * 30;


    /* -------------------------------------
       RENEWABLE PERCENTAGE
    ------------------------------------- */

    let renewablePercentage = 0;


    if (predictedConsumption > 0) {

        renewablePercentage =
            (
                totalRenewable /
                predictedConsumption
            ) * 100;

    }


    renewablePercentage =
        Math.min(
            renewablePercentage,
            100
        );


    renewablePercentage =
        renewablePercentage.toFixed(1);


    /* -------------------------------------
       UPDATE DASHBOARD
    ------------------------------------- */

    document.getElementById(
        "solarResult"
    ).innerText =
        solarGeneration + " kWh";


    document.getElementById(
        "windResult"
    ).innerText =
        windGeneration + " kWh";


    document.getElementById(
        "consumptionResult"
    ).innerText =
        predictedConsumption + " kWh";


    document.getElementById(
        "renewableResult"
    ).innerText =
        totalRenewable + " kWh";


    document.getElementById(
        "renewablePercent"
    ).innerText =
        renewablePercentage +
        "% of consumption";


    document.getElementById(
        "gridResult"
    ).innerText =
        gridRequired + " kWh";


    document.getElementById(
        "surplusResult"
    ).innerText =
        surplus + " kWh";


    /* -------------------------------------
       BEFORE / AFTER
    ------------------------------------- */

    document.getElementById(
        "beforeConsumption"
    ).innerText =
        predictedConsumption +
        " kWh";


    document.getElementById(
        "beforeGrid"
    ).innerText =
        predictedConsumption +
        " kWh";


    document.getElementById(
        "beforeCost"
    ).innerText =
        "₹" +
        beforeCost.toFixed(2);


    document.getElementById(
        "afterConsumption"
    ).innerText =
        predictedConsumption +
        " kWh";


    document.getElementById(
        "afterSolar"
    ).innerText =
        solarGeneration +
        " kWh";


    document.getElementById(
        "afterWind"
    ).innerText =
        windGeneration +
        " kWh";


    document.getElementById(
        "afterGrid"
    ).innerText =
        gridRequired +
        " kWh";


    document.getElementById(
        "afterCost"
    ).innerText =
        "₹" +
        afterCost.toFixed(2);


    document.getElementById(
        "savingResult"
    ).innerText =
        "₹" +
        monthlySaving.toFixed(2) +
        " / month";


    /* -------------------------------------
       CHART
    ------------------------------------- */

    createChart(
        predictedConsumption,
        solarGeneration,
        windGeneration,
        gridRequired,
        surplus
    );


    /* -------------------------------------
       SCROLL TO RESULT
    ------------------------------------- */

    document
        .getElementById("dashboard")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* =========================================
   CHART
========================================= */

function createChart(
    consumption,
    solar,
    wind,
    grid,
    surplus
) {

    const canvas =
        document.getElementById(
            "energyChart"
        );


    const ctx =
        canvas.getContext("2d");


    if (energyChart) {

        energyChart.destroy();

    }


    energyChart =
        new Chart(
            ctx,
            {

                type: "bar",

                data: {

                    labels: [
                        "Consumption",
                        "Solar",
                        "Wind",
                        "Grid",
                        "Surplus"
                    ],

                    datasets: [

                        {

                            label:
                                "Energy (kWh/day)",

                            data: [
                                consumption,
                                solar,
                                wind,
                                grid,
                                surplus
                            ],

                            borderWidth: 1

                        }

                    ]

                },

                options: {

                    responsive: true,

                    plugins: {

                        legend: {

                            display: true

                        }

                    },

                    scales: {

                        y: {

                            beginAtZero: true,

                            title: {

                                display: true,

                                text:
                                    "kWh per day"

                            }

                        }

                    }

                }

            }
        );

}


/* =========================================
   INITIAL RESULT
========================================= */

window.addEventListener(
    "load",
    calculateEnergy
);