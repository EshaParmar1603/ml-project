/* =====================================================
   SMART ENERGY CALCULATOR
   Complete Electricity + Solar + Wind + Bill Calculation
===================================================== */

let energyChart = null;


/* =====================================================
   BUTTON
===================================================== */

const calculateBtn = document.getElementById("calculateBtn");

calculateBtn.addEventListener("click", calculateEnergy);


/* =====================================================
   HELPER FUNCTION
===================================================== */

function getNumber(id) {

    const element = document.getElementById(id);

    if (!element) {
        return 0;
    }

    const value = Number(element.value);

    if (!Number.isFinite(value)) {
        return 0;
    }

    return Math.max(value, 0);
}


/* =====================================================
   MAIN CALCULATION
===================================================== */

function calculateEnergy() {

    /* =================================================
       1. HOUSEHOLD INFORMATION
    ================================================= */

    const people = Math.max(
        getNumber("people"),
        1
    );

    const rate = getNumber("rate");

    const temperature = getNumber("temperature");


    /* =================================================
       2. APPLIANCE CALCULATION
    ================================================= */

    let totalConsumption = 0;

    let applianceDetails = "";

    let selectedAppliances = 0;


    const applianceCards =
        document.querySelectorAll(".appliance-card");


    applianceCards.forEach(function (card) {

        const checkbox =
            card.querySelector(".appliance-check");


        /* Only selected appliances */

        if (!checkbox.checked) {
            return;
        }


        selectedAppliances++;


        const applianceName =
            checkbox.dataset.name;


        const power =
            Number(checkbox.dataset.power) || 0;


        const quantity =
            Math.max(
                Number(
                    card.querySelector(".quantity").value
                ) || 0,
                0
            );


        const hours =
            Math.min(
                Math.max(
                    Number(
                        card.querySelector(".hours").value
                    ) || 0,
                    0
                ),
                24
            );


        /* ---------------------------------------------
           Appliance Formula

           Energy =
           Power × Quantity × Hours / 1000
        --------------------------------------------- */

        const dailyEnergy =
            (power * quantity * hours) / 1000;


        const monthlyEnergy =
            dailyEnergy * 30;


        totalConsumption += dailyEnergy;


        applianceDetails += `

            <div class="calculation-line">

                <b>🔌 ${applianceName}</b>

                <br><br>

                Power:
                <b>${power} W</b>

                <br>

                Quantity:
                <b>${quantity}</b>

                <br>

                Usage:
                <b>${hours} hours/day</b>

                <br><br>

                Daily Energy:

                ${power} × ${quantity} × ${hours} ÷ 1000

                =

                <b>${dailyEnergy.toFixed(2)} kWh/day</b>

                <br>

                Monthly Energy:

                ${dailyEnergy.toFixed(2)} × 30

                =

                <b>${monthlyEnergy.toFixed(2)} kWh/month</b>

            </div>

        `;
    });


    /* =================================================
       IF NO APPLIANCE SELECTED
    ================================================= */

    if (selectedAppliances === 0) {

        applianceDetails = `

            <div class="calculation-line">

                ⚠️ No appliance selected.

                Please select at least one appliance.

            </div>

        `;

    }


    /* =================================================
       3. SOLAR CALCULATION
    ================================================= */

    const solarAvailable =
        document.getElementById(
            "solarAvailable"
        ).checked;


    const solarCapacity =
        getNumber("solarCapacity");


    const sunlightHours =
        getNumber("sunlightHours");


    let solarGeneration = 0;


    /*
        Solar efficiency assumption = 80%

        Solar Energy =
        Capacity × Sunlight Hours × Efficiency
    */


    if (solarAvailable) {

        solarGeneration =
            solarCapacity *
            sunlightHours *
            0.80;

    }


    const monthlySolar =
        solarGeneration * 30;


    /* =================================================
       4. WIND CALCULATION
    ================================================= */

    const windAvailable =
        document.getElementById(
            "windAvailable"
        ).checked;


    const windCapacity =
        getNumber("windCapacity");


    const numberOfTurbines =
        getNumber("numberOfTurbines");


    const windSpeed =
        getNumber("windSpeed");


    const windShare =
        Math.min(
            getNumber("windShare"),
            100
        );


    let capacityFactor = 0;


    /*
        Approximate capacity factor
        based on average wind speed.
    */

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


    let rawWindGeneration = 0;

    let windGeneration = 0;


    if (windAvailable) {

        /*
            Raw Wind Energy

            = Capacity × Turbines × 24 × CF
        */

        rawWindGeneration =
            windCapacity *
            numberOfTurbines *
            24 *
            capacityFactor;


        /*
            Energy available to household
        */

        windGeneration =
            rawWindGeneration *
            (windShare / 100);

    }


    const monthlyWind =
        windGeneration * 30;


    /* =================================================
       5. TOTAL RENEWABLE ENERGY
    ================================================= */

    const totalRenewable =
        solarGeneration +
        windGeneration;


    const monthlyRenewable =
        totalRenewable * 30;


    /* =================================================
       6. GRID ELECTRICITY
    ================================================= */

    const gridRequired =
        Math.max(
            totalConsumption -
            totalRenewable,
            0
        );


    const monthlyGrid =
        gridRequired * 30;


    /* =================================================
       7. SURPLUS ENERGY
    ================================================= */

    const surplus =
        Math.max(
            totalRenewable -
            totalConsumption,
            0
        );


    const monthlySurplus =
        surplus * 30;


    /* =================================================
       8. RENEWABLE PERCENTAGE
    ================================================= */

    let renewablePercentage = 0;


    if (totalConsumption > 0) {

        renewablePercentage =
            (
                totalRenewable /
                totalConsumption
            ) * 100;

    }


    renewablePercentage =
        Math.min(
            renewablePercentage,
            100
        );


    /* =================================================
       9. ELECTRICITY BILL BEFORE RENEWABLE
    ================================================= */

    const dailyBillBefore =
        totalConsumption * rate;


    const monthlyBillBefore =
        dailyBillBefore * 30;


    /* =================================================
       10. ELECTRICITY BILL AFTER RENEWABLE
    ================================================= */

    const dailyBillAfter =
        gridRequired * rate;


    const monthlyBillAfter =
        dailyBillAfter * 30;


    /* =================================================
       11. SAVINGS
    ================================================= */

    const dailySaving =
        Math.max(
            dailyBillBefore -
            dailyBillAfter,
            0
        );


    const monthlySaving =
        dailySaving * 30;


    /* =================================================
       12. DISPLAY DASHBOARD
    ================================================= */

    document.getElementById(
        "consumptionResult"
    ).textContent =
        totalConsumption.toFixed(2);


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
        "dailyBillBefore"
    ).textContent =
        "₹" + dailyBillBefore.toFixed(2);


    document.getElementById(
        "monthlyBillBefore"
    ).textContent =
        "₹" + monthlyBillBefore.toFixed(2);


    document.getElementById(
        "dailyBillAfter"
    ).textContent =
        "₹" + dailyBillAfter.toFixed(2);


    document.getElementById(
        "monthlyBillAfter"
    ).textContent =
        "₹" + monthlyBillAfter.toFixed(2);


    document.getElementById(
        "monthlySaving"
    ).textContent =
        "₹" + monthlySaving.toFixed(2);


    document.getElementById(
        "surplusResult"
    ).textContent =
        surplus.toFixed(2);


    /* =================================================
       13. BILL SUMMARY
    ================================================= */

    document.getElementById(
        "billConsumption"
    ).textContent =
        totalConsumption.toFixed(2)
        + " kWh";


    document.getElementById(
        "billRate"
    ).textContent =
        "₹"
        + rate.toFixed(2)
        + " / kWh";


    document.getElementById(
        "billBefore"
    ).textContent =
        "₹"
        + dailyBillBefore.toFixed(2);


    document.getElementById(
        "billRenewable"
    ).textContent =
        totalRenewable.toFixed(2)
        + " kWh";


    document.getElementById(
        "billGrid"
    ).textContent =
        gridRequired.toFixed(2)
        + " kWh";


    document.getElementById(
        "billAfter"
    ).textContent =
        "₹"
        + dailyBillAfter.toFixed(2);


    document.getElementById(
        "billMonthly"
    ).textContent =
        "₹"
        + monthlyBillAfter.toFixed(2);


    document.getElementById(
        "billSaving"
    ).textContent =
        "₹"
        + monthlySaving.toFixed(2);


    /* =================================================
       14. DETAILED BILL
    ================================================= */

    const detailedCalculation = `

        <div class="calculation-line">

            <h3>🏠 Household Information</h3>

            <br>

            People:
            <b>${people}</b>

            <br>

            Temperature:
            <b>${temperature} °C</b>

            <br>

            Electricity Rate:
            <b>₹${rate.toFixed(2)} / kWh</b>

        </div>


        <div class="calculation-line">

            <h3>🔌 Appliance Calculation</h3>

            <br>

            ${applianceDetails}

            <br>

            <b>
                Total Household Consumption:
            </b>

            ${totalConsumption.toFixed(2)}
            kWh/day

            <br>

            Monthly Consumption:

            ${totalConsumption.toFixed(2)}
            × 30

            =

            <b>
                ${(totalConsumption * 30).toFixed(2)}
                kWh/month
            </b>

        </div>


        <div class="calculation-line">

            <h3>☀️ Solar Calculation</h3>

            <br>

            Solar Available:
            <b>${solarAvailable ? "Yes" : "No"}</b>

            <br>

            Solar Capacity:
            <b>${solarCapacity} kW</b>

            <br>

            Sunlight:
            <b>${sunlightHours} hours/day</b>

            <br><br>

            Solar Generation:

            ${solarCapacity}
            ×
            ${sunlightHours}
            ×
            0.80

            =

            <b>
                ${solarGeneration.toFixed(2)}
                kWh/day
            </b>

            <br>

            Monthly Solar:

            <b>
                ${monthlySolar.toFixed(2)}
                kWh/month
            </b>

        </div>


        <div class="calculation-line">

            <h3>💨 Wind Calculation</h3>

            <br>

            Wind Available:
            <b>${windAvailable ? "Yes" : "No"}</b>

            <br>

            Turbine Capacity:
            <b>${windCapacity} kW</b>

            <br>

            Number of Turbines:
            <b>${numberOfTurbines}</b>

            <br>

            Wind Speed:
            <b>${windSpeed} m/s</b>

            <br>

            Capacity Factor:
            <b>${(capacityFactor * 100).toFixed(0)}%</b>

            <br><br>

            Raw Wind Generation:

            ${windCapacity}
            ×
            ${numberOfTurbines}
            ×
            24
            ×
            ${capacityFactor.toFixed(2)}

            =

            <b>
                ${rawWindGeneration.toFixed(2)}
                kWh/day
            </b>

            <br>

            Household Share:
            <b>${windShare}%</b>

            <br>

            Wind supplied to household:

            <b>
                ${windGeneration.toFixed(2)}
                kWh/day
            </b>

            <br>

            Monthly Wind:

            <b>
                ${monthlyWind.toFixed(2)}
                kWh/month
            </b>

        </div>


        <div class="calculation-line">

            <h3>🌱 Renewable Energy</h3>

            <br>

            Solar:

            ${solarGeneration.toFixed(2)}
            kWh/day

            <br>

            Wind:

            ${windGeneration.toFixed(2)}
            kWh/day

            <br><br>

            Total Renewable:

            ${solarGeneration.toFixed(2)}
            +
            ${windGeneration.toFixed(2)}

            =

            <b>
                ${totalRenewable.toFixed(2)}
                kWh/day
            </b>

            <br>

            Monthly Renewable:

            <b>
                ${monthlyRenewable.toFixed(2)}
                kWh/month
            </b>

        </div>


        <div class="calculation-line">

            <h3>🔌 Grid Calculation</h3>

            <br>

            Consumption:

            ${totalConsumption.toFixed(2)}
            kWh/day

            <br>

            Renewable:

            ${totalRenewable.toFixed(2)}
            kWh/day

            <br><br>

            Grid Required:

            max(
            ${totalConsumption.toFixed(2)}
            -
            ${totalRenewable.toFixed(2)},
            0
            )

            =

            <b>
                ${gridRequired.toFixed(2)}
                kWh/day
            </b>

            <br>

            Monthly Grid:

            <b>
                ${monthlyGrid.toFixed(2)}
                kWh/month
            </b>

        </div>


        <div class="calculation-line">

            <h3>🔋 Surplus Energy</h3>

            <br>

            Renewable:

            ${totalRenewable.toFixed(2)}

            -

            Consumption:

            ${totalConsumption.toFixed(2)}

            <br><br>

            Surplus:

            <b>
                ${surplus.toFixed(2)}
                kWh/day
            </b>

            <br>

            Monthly Surplus:

            <b>
                ${monthlySurplus.toFixed(2)}
                kWh/month
            </b>

        </div>


        <div class="calculation-line">

            <h3>🧾 Electricity Bill</h3>

            <br>

            <b>BEFORE RENEWABLE ENERGY</b>

            <br><br>

            Daily Consumption:

            ${totalConsumption.toFixed(2)}
            kWh

            <br>

            Rate:

            ₹${rate.toFixed(2)} / kWh

            <br>

            Daily Bill:

            ${totalConsumption.toFixed(2)}
            ×
            ₹${rate.toFixed(2)}

            =

            <b>
                ₹${dailyBillBefore.toFixed(2)}
            </b>

            <br>

            Monthly Bill:

            ₹${dailyBillBefore.toFixed(2)}
            × 30

            =

            <b>
                ₹${monthlyBillBefore.toFixed(2)}
            </b>

        </div>


        <div class="calculation-line">

            <h3>🌱 BILL AFTER RENEWABLE ENERGY</h3>

            <br>

            Grid Electricity:

            ${gridRequired.toFixed(2)}
            kWh/day

            <br>

            Rate:

            ₹${rate.toFixed(2)} / kWh

            <br>

            Daily Bill:

            ${gridRequired.toFixed(2)}
            ×
            ₹${rate.toFixed(2)}

            =

            <b>
                ₹${dailyBillAfter.toFixed(2)}
            </b>

            <br>

            Monthly Bill:

            ₹${dailyBillAfter.toFixed(2)}
            × 30

            =

            <b>
                ₹${monthlyBillAfter.toFixed(2)}
            </b>

        </div>


        <div class="calculation-line">

            <h3>💰 SAVINGS</h3>

            <br>

            Daily Saving:

            ₹${dailyBillBefore.toFixed(2)}

            -

            ₹${dailyBillAfter.toFixed(2)}

            =

            <b>
                ₹${dailySaving.toFixed(2)}
            </b>

            <br><br>

            Monthly Saving:

            ₹${monthlyBillBefore.toFixed(2)}

            -

            ₹${monthlyBillAfter.toFixed(2)}

            =

            <b>
                ₹${monthlySaving.toFixed(2)}
            </b>

        </div>


        <div class="calculation-line">

            <h3>📊 Renewable Contribution</h3>

            <br>

            Renewable Energy:

            ${totalRenewable.toFixed(2)}
            kWh/day

            <br>

            Total Consumption:

            ${totalConsumption.toFixed(2)}
            kWh/day

            <br><br>

            Renewable Percentage:

            (${totalRenewable.toFixed(2)}
            ÷
            ${totalConsumption.toFixed(2)})
            × 100

            =

            <b>
                ${renewablePercentage.toFixed(2)}%
            </b>

        </div>

    `;


    document.getElementById(
        "calculationDetails"
    ).innerHTML =
        detailedCalculation;


    /* =================================================
       15. CHART
    ================================================= */

    createChart(
        totalConsumption,
        solarGeneration,
        windGeneration,
        gridRequired
    );


    /* =================================================
       16. GO TO DASHBOARD
    ================================================= */

    document
        .getElementById("dashboard")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* =====================================================
   CHART
===================================================== */

function createChart(
    consumption,
    solar,
    wind,
    grid
) {

    const canvas =
        document.getElementById(
            "energyChart"
        );


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

                            label:
                                "Energy (kWh/day)",

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

                    maintainAspectRatio: false,


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
                                    "Energy (kWh/day)"

                            }

                        }

                    }

                }

            }
        );

}