document.addEventListener("DOMContentLoaded", function () {

    const calculateBtn = document.getElementById("calculateBtn");

    if (!calculateBtn) {
        console.error("Calculate button not found!");
        return;
    }

    calculateBtn.addEventListener("click", calculateBill);

    function getNumber(id) {
        const element = document.getElementById(id);

        if (!element) {
            return 0;
        }

        const value = parseFloat(element.value);
        return isNaN(value) ? 0 : value;
    }

    function calculateBill() {

        // =========================
        // 1. ELECTRICITY CONSUMPTION
        // =========================

        let totalDailyConsumption = 0;

        const appliances = document.querySelectorAll(".appliance-card");

        appliances.forEach(function (appliance) {

            const checkbox = appliance.querySelector(".appliance-check");

            if (!checkbox || !checkbox.checked) {
                return;
            }

            const power = parseFloat(checkbox.dataset.power) || 0;

            const quantityInput = appliance.querySelector(".quantity");
            const hoursInput = appliance.querySelector(".hours");

            const quantity = parseFloat(quantityInput?.value) || 0;
            const hours = parseFloat(hoursInput?.value) || 0;

            // Watts × Quantity × Hours / 1000
            const dailyEnergy =
                (power * quantity * hours) / 1000;

            totalDailyConsumption += dailyEnergy;
        });


        // Monthly consumption
        const monthlyConsumption =
            totalDailyConsumption * 30;


        // =========================
        // 2. ELECTRICITY RATE
        // =========================

        const rate = getNumber("rate");


        // =========================
        // 3. SOLAR CALCULATION
        // =========================

        let solarGeneration = 0;

        const solarAvailable =
            document.getElementById("solarAvailable");

        if (
            solarAvailable &&
            solarAvailable.value.toLowerCase() === "yes"
        ) {

            const solarCapacity =
                getNumber("solarCapacity");

            const sunlightHours =
                getNumber("sunlightHours");

            // 80% efficiency factor
            solarGeneration =
                solarCapacity *
                sunlightHours *
                0.80;
        }


        // =========================
        // 4. WIND CALCULATION
        // =========================

        let windGeneration = 0;

        const windAvailable =
            document.getElementById("windAvailable");

        if (
            windAvailable &&
            windAvailable.value.toLowerCase() === "yes"
        ) {

            const windCapacity =
                getNumber("windCapacity");

            const numberOfTurbines =
                getNumber("numberOfTurbines");

            const windSpeed =
                getNumber("windSpeed");

            const windShare =
                getNumber("windShare");


            // Simple educational capacity factor
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


            const totalWindGeneration =
                windCapacity *
                numberOfTurbines *
                24 *
                capacityFactor;


            windGeneration =
                totalWindGeneration *
                (windShare / 100);
        }


        // =========================
        // 5. RENEWABLE ENERGY
        // =========================

        const totalRenewable =
            solarGeneration +
            windGeneration;


        // =========================
        // 6. GRID ELECTRICITY
        // =========================

        const gridRequired =
            Math.max(
                totalDailyConsumption - totalRenewable,
                0
            );


        // =========================
        // 7. SURPLUS ENERGY
        // =========================

        const surplus =
            Math.max(
                totalRenewable - totalDailyConsumption,
                0
            );


        // =========================
        // 8. RENEWABLE %
        // =========================

        let renewablePercentage = 0;

        if (totalDailyConsumption > 0) {

            renewablePercentage =
                (totalRenewable /
                totalDailyConsumption) * 100;

            renewablePercentage =
                Math.min(renewablePercentage, 100);
        }


        // =========================
        // 9. BILL CALCULATION
        // =========================

        // BEFORE SOLAR/WIND

        const dailyBillBefore =
            totalDailyConsumption * rate;

        const monthlyBillBefore =
            monthlyConsumption * rate;


        // AFTER SOLAR/WIND

        const dailyBillAfter =
            gridRequired * rate;

        const monthlyGrid =
            gridRequired * 30;

        const monthlyBillAfter =
            monthlyGrid * rate;


        // SAVING

        const monthlySaving =
            Math.max(
                monthlyBillBefore - monthlyBillAfter,
                0
            );


        // =========================
        // 10. UPDATE DASHBOARD
        // =========================

        setText(
            "consumptionResult",
            totalDailyConsumption.toFixed(2) +
            " kWh/day"
        );

        setText(
            "monthlyConsumptionResult",
            monthlyConsumption.toFixed(2) +
            " kWh/month"
        );

        setText(
            "solarResult",
            solarGeneration.toFixed(2) +
            " kWh/day"
        );

        setText(
            "windResult",
            windGeneration.toFixed(2) +
            " kWh/day"
        );

        setText(
            "renewableResult",
            totalRenewable.toFixed(2) +
            " kWh/day"
        );

        setText(
            "gridResult",
            gridRequired.toFixed(2) +
            " kWh/day"
        );

        setText(
            "percentageResult",
            renewablePercentage.toFixed(1) +
            "%"
        );

        setText(
            "dailyBillBefore",
            "₹" + dailyBillBefore.toFixed(2)
        );

        setText(
            "monthlyBillBefore",
            "₹" + monthlyBillBefore.toFixed(2)
        );

        setText(
            "dailyBillAfter",
            "₹" + dailyBillAfter.toFixed(2)
        );

        setText(
            "monthlyBillAfter",
            "₹" + monthlyBillAfter.toFixed(2)
        );

        setText(
            "monthlySaving",
            "₹" + monthlySaving.toFixed(2)
        );

        setText(
            "surplusResult",
            surplus.toFixed(2) +
            " kWh/day"
        );


        // =========================
        // 11. BILL SUMMARY
        // =========================

        setText(
            "billConsumption",
            monthlyConsumption.toFixed(2) +
            " kWh/month"
        );

        setText(
            "billRate",
            "₹" + rate.toFixed(2) +
            " / kWh"
        );

        setText(
            "billBefore",
            "₹" + monthlyBillBefore.toFixed(2)
        );

        setText(
            "billRenewable",
            totalRenewable.toFixed(2) +
            " kWh/day"
        );

        setText(
            "billGrid",
            gridRequired.toFixed(2) +
            " kWh/day"
        );

        setText(
            "billAfter",
            "₹" + monthlyBillAfter.toFixed(2)
        );

        setText(
            "billMonthly",
            "₹" + monthlyBillAfter.toFixed(2)
        );

        setText(
            "billSaving",
            "₹" + monthlySaving.toFixed(2)
        );


        // =========================
        // 12. CALCULATION DETAILS
        // =========================

        const calculationDetails =
            document.getElementById(
                "calculationDetails"
            );

        if (calculationDetails) {

            calculationDetails.innerHTML = `

                <div class="calculation-line">
                    <strong>Daily Consumption</strong>
                    <span>
                        ${totalDailyConsumption.toFixed(2)} kWh/day
                    </span>
                </div>

                <div class="calculation-line">
                    <strong>Monthly Consumption</strong>
                    <span>
                        ${totalDailyConsumption.toFixed(2)}
                        × 30 =
                        ${monthlyConsumption.toFixed(2)} kWh/month
                    </span>
                </div>

                <div class="calculation-line">
                    <strong>Solar Generation</strong>
                    <span>
                        ${solarGeneration.toFixed(2)} kWh/day
                    </span>
                </div>

                <div class="calculation-line">
                    <strong>Wind Generation</strong>
                    <span>
                        ${windGeneration.toFixed(2)} kWh/day
                    </span>
                </div>

                <div class="calculation-line">
                    <strong>Total Renewable Energy</strong>
                    <span>
                        ${totalRenewable.toFixed(2)} kWh/day
                    </span>
                </div>

                <div class="calculation-line">
                    <strong>Grid Electricity Required</strong>
                    <span>
                        ${gridRequired.toFixed(2)} kWh/day
                    </span>
                </div>

                <div class="calculation-line">
                    <strong>Monthly Bill Before Renewable</strong>
                    <span>
                        ${monthlyConsumption.toFixed(2)}
                        × ₹${rate.toFixed(2)}
                        =
                        ₹${monthlyBillBefore.toFixed(2)}
                    </span>
                </div>

                <div class="calculation-line">
                    <strong>Monthly Bill After Renewable</strong>
                    <span>
                        ${monthlyGrid.toFixed(2)}
                        × ₹${rate.toFixed(2)}
                        =
                        ₹${monthlyBillAfter.toFixed(2)}
                    </span>
                </div>

                <div class="calculation-line">
                    <strong>Monthly Saving</strong>
                    <span>
                        ₹${monthlyBillBefore.toFixed(2)}
                        −
                        ₹${monthlyBillAfter.toFixed(2)}
                        =
                        ₹${monthlySaving.toFixed(2)}
                    </span>
                </div>
            `;
        }


        // =========================
        // 13. SHOW DASHBOARD
        // =========================

        const dashboard =
            document.getElementById("dashboard");

        if (dashboard) {
            dashboard.style.display = "block";

            dashboard.scrollIntoView({
                behavior: "smooth"
            });
        }


        console.log("Calculation completed successfully!");
        console.log("Monthly Bill Before:", monthlyBillBefore);
        console.log("Monthly Bill After:", monthlyBillAfter);
        console.log("Monthly Saving:", monthlySaving);
    }


    // =========================
    // HELPER FUNCTION
    // =========================

    function setText(id, value) {

        const element =
            document.getElementById(id);

        if (element) {
            element.textContent = value;
        }
        else {
            console.warn(
                "Element not found:",
                id
            );
        }
    }

});