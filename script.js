let energyChart = null;

const calculateBtn = document.getElementById("calculateBtn");

calculateBtn.addEventListener("click", calculateEnergy);

function getValue(id) {
    const element = document.getElementById(id);

    if (!element) {
        return 0;
    }

    return Number(element.value) || 0;
}


function calculateEnergy() {

    console.log("Calculate button clicked!");

    // =====================================
    // HOUSEHOLD
    // =====================================

    const people = Math.max(getValue("people"), 1);
    const rate = Math.max(getValue("rate"), 0);
    const temperature = getValue("temperature");


    // =====================================
    // APPLIANCE CALCULATION
    // =====================================

    let applianceConsumption = 0;

    let calculationHTML = "";

    const applianceCards =
        document.querySelectorAll(".appliance-card");


    applianceCards.forEach(function (card) {

        const checkbox =
            card.querySelector(".appliance-check");

        if (!checkbox || !checkbox.checked) {
            return;
        }


        const power =
            Number(checkbox.dataset.power) || 0;

        const name =
            checkbox.dataset.name || "Appliance";


        const quantity =
            Number(
                card.querySelector(".quantity").value
            ) || 0;


        const hours =
            Number(
                card.querySelector(".hours").value
            ) || 0;


        const energy =
            (power * quantity * hours) / 1000;


        applianceConsumption += energy;


        calculationHTML += `
            <div class="calculation-line">

                <b>${name}</b>

                <br>

                ${power} W ×
                ${quantity} ×
                ${hours} hours ÷ 1000

                =

                <b>${energy.toFixed(2)} kWh/day</b>

            </div>
        `;
    });


    // =====================================
    // HOUSEHOLD ADJUSTMENT
    // =====================================

    const peopleAdjustment =
        people * 0.15;


    const temperatureAdjustment =
        Math.max(0, temperature - 25) * 0.08;


    const totalAdjustment =
        peopleAdjustment +
        temperatureAdjustment;


    const predictedConsumption =
        applianceConsumption +
        totalAdjustment;


    calculationHTML += `
        <div class="calculation-line">

            <b>Household Adjustment</b>

            <br>

            People:

            ${people} × 0.15

            =

            ${peopleAdjustment.toFixed(2)} kWh

            <br>

            Temperature:

            max(0, ${temperature} - 25) × 0.08

            =

            ${temperatureAdjustment.toFixed(2)} kWh

        </div>


        <div class="calculation-line">

            <b>Total Predicted Consumption</b>

            <br>

            ${applianceConsumption.toFixed(2)}
            +
            ${totalAdjustment.toFixed(2)}

            =

            <b>${predictedConsumption.toFixed(2)} kWh/day</b>

        </div>
    `;


    // =====================================
    // SOLAR
    // =====================================

    const solarAvailable =
        document.getElementById("solarAvailable").checked;


    const solarCapacity =
        getValue("solarCapacity");


    const sunlightHours =
        getValue("sunlightHours");


    let solarGeneration = 0;


    if (solarAvailable) {

        solarGeneration =
            solarCapacity *
            sunlightHours *
            0.80;

    }


    calculationHTML += `
        <div class="calculation-line">

            <b>☀️ Solar Generation</b>

            <br>

            ${solarCapacity} kW ×
            ${sunlightHours} hours ×
            0.80

            =

            <b>${solarGeneration.toFixed(2)} kWh/day</b>

        </div>
    `;


    // =====================================
    // WIND
    // =====================================

    const windAvailable =
        document.getElementById("windAvailable").checked;


    const windCapacity =
        getValue("windCapacity");


    const numberOfTurbines =
        getValue("numberOfTurbines");


    const windSpeed =
        getValue("windSpeed");


    const windShare =
        getValue("windShare");


    let capacityFactor = 0;


    if (windSpeed < 3) {

        capacityFactor = 0;

    } else if (windSpeed < 5) {

        capacityFactor = 0.10;

    } else if (windSpeed < 7) {

        capacityFactor = 0.25;

    } else if (windSpeed < 9) {

        capacityFactor = 0.40;

    } else {

        capacityFactor = 0.50;

    }


    let rawWindGeneration = 0;
    let windGeneration = 0;


    if (windAvailable) {

        rawWindGeneration =
            windCapacity *
            numberOfTurbines *
            24 *
            capacityFactor;


        windGeneration =
            rawWindGeneration *
            (windShare / 100);

    }


    calculationHTML += `
        <div class="calculation-line">

            <b>💨 Wind Generation</b>

            <br>

            Wind Capacity Factor:

            <b>${(capacityFactor * 100).toFixed(0)}%</b>

            <br><br>

            Raw Wind:

            ${windCapacity} ×
            ${numberOfTurbines} ×
            24 ×
            ${capacityFactor.toFixed(2)}

            =

            ${rawWindGeneration.toFixed(2)} kWh/day

            <br><br>

            Household Share:

            ${windShare}%

            <br>

            Wind Energy Supplied:

            <b>${windGeneration.toFixed(2)} kWh/day</b>

        </div>
    `;


    // =====================================
    // TOTAL RENEWABLE
    // =====================================

    const totalRenewable =
        solarGeneration +
        windGeneration;


    // =====================================
    // GRID
    // =====================================

    const gridRequired =
        Math.max(
            predictedConsumption -
            totalRenewable,
            0
        );


    // =====================================
    // SURPLUS
    // =====================================

    const surplusEnergy =
        Math.max(
            totalRenewable -
            predictedConsumption,
            0
        );


    // =====================================
    // RENEWABLE %
    // =====================================

    let renewablePercentage = 0;


    if (predictedConsumption > 0) {

        renewablePercentage =
            (totalRenewable /
            predictedConsumption) * 100;

    }


    renewablePercentage =
        Math.min(
            renewablePercentage,
            100
        );


    // =====================================
    // BILL
    // =====================================

    const beforeBill =
        predictedConsumption * rate;


    const afterBill =
        gridRequired * rate;


    const dailySaving =
        Math.max(
            beforeBill - afterBill,
            0
        );


    const monthlySaving =
        dailySaving * 30;


    // =====================================
    // DISPLAY
    // =====================================

    document.getElementById(
        "consumptionResult"
    ).textContent =
        predictedConsumption.toFixed(2);


    document.getElementById(
        "solarResult"
    ).textContent =
        solarGeneration.toFixed(2);


    document.getElementById(
        "windResult"
    ).textContent =
        windGeneration.toFixed(2);


    document.getElementById(
        "renewableResult"
    ).textContent =
        totalRenewable.toFixed(2);


    document.getElementById(
        "gridResult"
    ).textContent =
        gridRequired.toFixed(2);


    document.getElementById(
        "percentageResult"
    ).textContent =
        renewablePercentage.toFixed(2) + "%";


    document.getElementById(
        "dailySaving"
    ).textContent =
        "₹" + dailySaving.toFixed(2);


    document.getElementById(
        "monthlySaving"
    ).textContent =
        "₹" + monthlySaving.toFixed(2);


    document.getElementById(
        "surplusResult"
    ).textContent =
        surplusEnergy.toFixed(2);


    // =====================================
    // DETAILED CALCULATION
    // =====================================

    calculationHTML += `

        <div class="calculation-line">

            <b>🌱 Total Renewable Energy</b>

            <br>

            ${solarGeneration.toFixed(2)}
            +
            ${windGeneration.toFixed(2)}

            =

            <b>${totalRenewable.toFixed(2)} kWh/day</b>

        </div>


        <div class="calculation-line">

            <b>🔌 Grid Electricity</b>

            <br>

            max(
            ${predictedConsumption.toFixed(2)}
            -
            ${totalRenewable.toFixed(2)},
            0
            )

            =

            <b>${gridRequired.toFixed(2)} kWh/day</b>

        </div>


        <div class="calculation-line">

            <b>🔋 Surplus Energy</b>

            <br>

            max(
            ${totalRenewable.toFixed(2)}
            -
            ${predictedConsumption.toFixed(2)},
            0
            )

            =

            <b>${surplusEnergy.toFixed(2)} kWh/day</b>

        </div>


        <div class="calculation-line">

            <b>📊 Renewable Percentage</b>

            <br>

            (${totalRenewable.toFixed(2)}
            ÷
            ${predictedConsumption.toFixed(2)})
            × 100

            =

            <b>${renewablePercentage.toFixed(2)}%</b>

        </div>


        <div class="calculation-line">

            <b>💰 Bill Before Renewable</b>

            <br>

            ${predictedConsumption.toFixed(2)}
            × ₹${rate.toFixed(2)}

            =

            <b>₹${beforeBill.toFixed(2)} / day</b>

        </div>


        <div class="calculation-line">

            <b>💰 Bill After Renewable</b>

            <br>

            ${gridRequired.toFixed(2)}
            × ₹${rate.toFixed(2)}

            =

            <b>₹${afterBill.toFixed(2)} / day</b>

        </div>


        <div class="calculation-line">

            <b>💵 Monthly Saving</b>

            <br>

            (${beforeBill.toFixed(2)}
            -
            ${afterBill.toFixed(2)})
            × 30

            =

            <b>₹${monthlySaving.toFixed(2)}</b>

        </div>
    `;


    document.getElementById(
        "calculationDetails"
    ).innerHTML =
        calculationHTML;


    // =====================================
    // CHART
    // =====================================

    createChart(
        predictedConsumption,
        solarGeneration,
        windGeneration,
        gridRequired
    );


    // =====================================
    // SCROLL
    // =====================================

    document
        .getElementById("dashboard")
        .scrollIntoView({
            behavior: "smooth"
        });
}


/* ==========================================
   CHART
========================================== */

function createChart(
    consumption,
    solar,
    wind,
    grid
) {

    const canvas =
        document.getElementById("energyChart");


    if (!canvas) {
        return;
    }


    if (energyChart !== null) {

        energyChart.destroy();

    }


    energyChart =
        new Chart(
            canvas,
            {
                type: "bar",

                data: {

                    labels: [
                        "Consumption",
                        "Solar",
                        "Wind",
                        "Grid"
                    ],

                    datasets: [

                        {
                            label: "Energy (kWh/day)",

                            data: [
                                consumption,
                                solar,
                                wind,
                                grid
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
                                    "kWh / Day"

                            }

                        }

                    }

                }
            }
        );
}