let energyChart;


/* ==============================
   ENERGY PREDICTION
================================ */

function predictEnergy() {

    // Get inputs

    const people =
        Number(document.getElementById("people").value);

    const temperature =
        Number(document.getElementById("temperature").value);

    const appliances =
        Number(document.getElementById("appliances").value);

    const solarCapacity =
        Number(document.getElementById("solarCapacity").value);

    const sunHours =
        Number(document.getElementById("sunHours").value);

    const windCapacity =
        Number(document.getElementById("windCapacity").value);

    const windSpeed =
        Number(document.getElementById("windSpeed").value);

    const rate =
        Number(document.getElementById("rate").value);


    /* ==============================
       LINEAR REGRESSION STYLE MODEL

       Consumption =
       base
       + people
       + temperature
       + appliances
    ============================== */

    const baseConsumption = 2;

    const peopleEffect = people * 1.2;

    const temperatureEffect =
        Math.max(0, temperature - 25) * 0.25;

    const applianceEffect =
        appliances * 0.75;


    let consumption =
        baseConsumption +
        peopleEffect +
        temperatureEffect +
        applianceEffect;


    consumption =
        Number(consumption.toFixed(2));


    /* ==============================
       SOLAR GENERATION

       Solar Energy =
       Capacity × Sunlight Hours × Efficiency
    ============================== */

    const solarEfficiency = 0.80;

    let solarGeneration =
        solarCapacity *
        sunHours *
        solarEfficiency;


    solarGeneration =
        Number(solarGeneration.toFixed(2));


    /* ==============================
       WIND GENERATION

       Simple educational model
    ============================== */

    let windEfficiency = 0;

    if (windSpeed < 3) {

        windEfficiency = 0;

    }

    else if (windSpeed < 6) {

        windEfficiency = 0.25;

    }

    else if (windSpeed < 9) {

        windEfficiency = 0.45;

    }

    else {

        windEfficiency = 0.60;

    }


    let windGeneration =
        windCapacity *
        windSpeed *
        windEfficiency;


    windGeneration =
        Number(windGeneration.toFixed(2));


    /* ==============================
       TOTAL RENEWABLE
    ============================== */

    const renewable =
        Number(
            (solarGeneration + windGeneration)
            .toFixed(2)
        );


    /* ==============================
       GRID / SURPLUS
    ============================== */

    let gridRequired = 0;

    let surplusEnergy = 0;


    if (renewable < consumption) {

        gridRequired =
            consumption - renewable;

    }

    else {

        surplusEnergy =
            renewable - consumption;

    }


    gridRequired =
        Number(gridRequired.toFixed(2));

    surplusEnergy =
        Number(surplusEnergy.toFixed(2));


    /* ==============================
       COST CALCULATION
    ============================== */

    const beforeCost =
        consumption * rate;


    const afterCost =
        gridRequired * rate;


    const dailySaving =
        Math.max(
            0,
            beforeCost - afterCost
        );


    const monthlySaving =
        dailySaving * 30;


    /* ==============================
       UPDATE DASHBOARD
    ============================== */

    document.getElementById("solarResult")
        .innerText =
        solarGeneration + " kWh";


    document.getElementById("windResult")
        .innerText =
        windGeneration + " kWh";


    document.getElementById("consumptionResult")
        .innerText =
        consumption + " kWh";


    document.getElementById("renewableResult")
        .innerText =
        renewable + " kWh";


    document.getElementById("gridResult")
        .innerText =
        gridRequired + " kWh";


    document.getElementById("surplusResult")
        .innerText =
        surplusEnergy + " kWh";


    /* ==============================
       BEFORE / AFTER
    ============================== */

    document.getElementById("beforeConsumption")
        .innerText =
        consumption + " kWh";


    document.getElementById("beforeGrid")
        .innerText =
        consumption + " kWh";


    document.getElementById("beforeCost")
        .innerText =
        "₹" +
        beforeCost.toFixed(2);


    document.getElementById("afterConsumption")
        .innerText =
        consumption + " kWh";


    document.getElementById("afterRenewable")
        .innerText =
        renewable + " kWh";


    document.getElementById("afterGrid")
        .innerText =
        gridRequired + " kWh";


    document.getElementById("afterCost")
        .innerText =
        "₹" +
        afterCost.toFixed(2);


    document.getElementById("savingResult")
        .innerText =
        "₹" +
        monthlySaving.toFixed(2);


    /* ==============================
       CHART
    ============================== */

    createChart(
        consumption,
        solarGeneration,
        windGeneration,
        gridRequired,
        surplusEnergy
    );

}


/* ==============================
   CREATE CHART
================================ */

function createChart(
    consumption,
    solar,
    wind,
    grid,
    surplus
) {

    const ctx =
        document
            .getElementById("energyChart")
            .getContext("2d");


    if (energyChart) {

        energyChart.destroy();

    }


    energyChart =
        new Chart(ctx, {

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
                                "Energy (kWh)"

                        }

                    }

                }

            }

        });

}


/* ==============================
   INITIAL PREDICTION
================================ */

window.addEventListener(
    "load",
    predictEnergy
);