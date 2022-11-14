const assert = require('assert');
const { aridityIndexDeMartonne, aridityIndexGracanin, ellenbergEQ,
    embergerPluviotermicQuotient, continentalityIndexConrad,
    koppenClimateFormula, langsRainfallFactor, thermicCharacterGracanin,
    thornthwaitePET,
    thornthwaiteWaterBalance,
    thornthwaitePercipitationEfficiency,
    continentalityIndex,
    ombroEvapotranspirationIndex,
    ombrothermicIndex } = require("../src/lib/klimatskeformule");
const { sum, average, round } = require("../src/lib/mathUtils");

//puntjarka
const temps = [5.5, 5.7, 8.6, 12.2, 17.2, 20.9, 23.9, 23.7, 19.5, 15.2, 10.1, 7.1];

const percs = [59.1, 53.3, 57.9, 56.2, 54.9, 61.6, 37.3, 56.1, 68.3, 103.2, 96.8, 73.4];

describe("Formulas", () => {
    //CORE TESTS ERC721
    it("Prosječna temperatura (T)", () => {
        assert.equal(round(average(temps), 2), 14.13);
    });

    it("Ukupno oborine (P)", () => {
        assert.equal(sum(percs), 778.1);
    });

    it("Indeks aridnost De Martonne 1926.", () => {
        const idx = aridityIndexDeMartonne.calculate(percs, temps);
        // console.log(idx);
        assert.equal(idx.value, 32.24)
        assert.equal(idx.result, "slightly-arid");
        // //nije niz
        // const idx1 = aridityIndexDeMartonne.calculate(sum(percs), average(temps));
        // assert.equal(idx1.value, 77.14)
        // assert.equal(idx1.result, "excessively-humid");

    });

    // it("Indeks mjesečne aridnosti prema Gračaninu", () => {
    //     const arrTest = [];
    //     const arrSample = [{ value: 24.2, result: "perhumidno" }, { value: 34.8, result: "perhumidno" }, { value: 82.7, result: "perhumidno" },
    //     { value: 19.1, result: "perhumidno" }, { value: 11, result: "humidno" }, { value: 10.5, result: "humidno" }, { value: 7.9, result: "humidno" },
    //     { value: 8.1, result: "humidno" }, { value: 9.1, result: "humidno" }, { value: 13.2, result: "humidno" }, { value: 54.1, result: "perhumidno" },
    //     { value: 58.7, result: "perhumidno" }];

    //     for (let i = 0; i < temps.length; i++) {
    //         const idx_grac = aridityIndexGracanin.calculate(percs[i], temps[i]);
    //         arrTest.push({ value: idx_grac.value, result: idx_grac.result });

    //     }
    //     assert.deepEqual(arrTest, arrSample);
    // });

    it("Ellenbergov klimatski kvocjent (EQ)", () => {
        const res = ellenbergEQ.calculate(percs, temps);
        assert.equal(res.value, 30.72);
    });

    it("Embergerov pluviotermički kvocjent", () => {
        const res = embergerPluviotermicQuotient.calculate(percs, temps);
        assert.equal(res.value, 100.55);
    });

    // it("Indeks kontinentalnosti Conrad", () => {
    //     const res = continentalityIndexConrad.calculate(45.9036, 18.3);
    //     assert.equal(res.value, 23.57);
    //     assert.equal(res.result, "maritime transition zone");
    // });

    it("Indeks kontinentalnosti (CONTINETY)", () => {
        const res = continentalityIndex.calculate(temps);
        assert.equal(res.value, 18.4);
        assert.equal(res.result, "maritime transition zone");
    });

    // it("Klimatska formula po Köppenu", () => {
    //     const res = koppenClimateFormula.calculate(percs, temps, 45.9036, 15.9693);
    //     assert.equal(res.value, "Dfb");
    //     assert.equal(res.result, "Df - Snow climate, fully humid; b - Warm summer");
    // });

    it("Langov kišni faktor", () => {
        const res = langsRainfallFactor.calculate(percs, temps);
        assert.equal(res.value, 55.05);
        assert.equal(res.result, "semiaridno");
    });

    // it("Toplinski karakter klime po Gračaninu", () => {
    //     assert.equal(thermicCharacterGracanin.calculate(1.1).result, "hladno");
    //     assert.equal(thermicCharacterGracanin.calculate(15.2).result, "toplo");
    //     assert.equal(thermicCharacterGracanin.calculate(-1.6).result, "nivalno");
    // });

    it("Thornthwaite equation (1948) for potential evaporation (PE or PET)", () => {
        const res = thornthwaitePET.calculate(temps, 45.86, 13.85);
        assert.equal(res.value, 806.4); //787.25);
    });

    it("Ombrothermic Index [Io]", () => {
        const res = ombrothermicIndex.calculate(temps, percs);
        assert.equal(res.value, 3.82);
    });

    it("Ombro-evapotranspiration index [Ioe] P/PET", () => {
        const ppet = ombroEvapotranspirationIndex.calculate(temps, percs, 45.86, 13.85);
        assert.equal(ppet.value, 22.77);
    });

    // it("Vodna bilanca (vodni suficit/deficit)", () => {
    //     const pet = thornthwaitePET.calculate(temps, 45.9036, 15.9693);
    //     const vodna_bilanca = thornthwaiteWaterBalance.calculate(percs, pet.result);
    //     // console.log("vodna_bilanca", vodna_bilanca);
    //     assert.equal(vodna_bilanca.value, 713.94);
    // });


    // it("Indeks djelotvornosti oborina po Thorntwaitu", () => {
    //     const res = thornthwaitePercipitationEfficiency.calculate(percs, temps);
    //     assert.equal(res.value, 150.07);
    //     assert.equal(res.result, "perhumidno");
    // });

});