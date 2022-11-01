const assert = require('assert');
const { aridityIndexDeMartonne, aridityIndexGracanin, ellenbergCQ,
    embergerPluviotermicQuotient, indexOfContinentality,
    koppenClimateFormula, langsRainfallFactor, thermicCharacterGracanin,
    thornthwaitePET,
    thornthwaiteWaterBalance,
    thornthwaitePercipitationEfficiency } = require("../src/lib/klimatskeformule");
const { sum, average } = require("../src/lib/mathUtils");

//puntjarka
const temps = [-3.1, -2.1, 1.1, 5.5, 10.2, 13.2, 15.2, 14.7, 11.7, 7.3, 2.2, -1.6];
const temps_avg_max = [-0.4, 1.1, 4.9, 9.8, 14.8, 17.5, 19.8, 19.2, 15.9, 11, 5, 1];

const percs = [75, 73, 91, 105, 112, 139, 120, 119, 106, 96, 119, 94];

const MoonSunCalc = require("../src/lib/moonsuncalc");

describe("Formulas", () => {
    //CORE TESTS ERC721
    it("Indeks aridnost De Martonne 1926.", () => {
        const idx = aridityIndexDeMartonne(percs, temps);
        // console.log(idx);
        assert.equal(idx.value, 77.14)
        assert.equal(idx.result, "humidno");
        //nije niz
        const idx1 = aridityIndexDeMartonne(sum(percs), average(temps));
        assert.equal(idx1.value, 77.14)
        assert.equal(idx1.result, "humidno");
    });

    it("Indeks mjesečne aridnosti prema Gračaninu", () => {
        const arrTest = [];
        const arrSample = [{ value: 24.2, result: "perhumidno" }, { value: 34.8, result: "perhumidno" }, { value: 82.7, result: "perhumidno" },
        { value: 19.1, result: "perhumidno" }, { value: 11, result: "humidno" }, { value: 10.5, result: "humidno" }, { value: 7.9, result: "humidno" },
        { value: 8.1, result: "humidno" }, { value: 9.1, result: "humidno" }, { value: 13.2, result: "humidno" }, { value: 54.1, result: "perhumidno" },
        { value: 58.7, result: "perhumidno" }];

        for (let i = 0; i < temps.length; i++) {
            const idx_grac = aridityIndexGracanin(percs[i], temps[i]);
            arrTest.push({ value: idx_grac.value, result: idx_grac.result });

        }
        assert.deepEqual(arrTest, arrSample);
    });

    it("Ellenbergov klimatski kvocjent (EQ)", () => {
        const res = ellenbergCQ(percs, temps);
        assert.equal(res.value, 12.17);
    });

    it("Embergerov pluviotermički kvocjent", () => {
        const res = embergerPluviotermicQuotient(percs, [-5.5, 19.8]);
        assert.equal(res.value, 345.23);
    });

    it("Indeks kontinentalnosti", () => {
        const res = indexOfContinentality(45.9036, 18.3);
        assert.equal(res.value, 23.57);
        assert.equal(res.result, "prijelazna maritimna klima");

    });

    it("Klimatska formula po Köppenu", () => {
        const res = koppenClimateFormula(percs, temps, 45.9036, 15.9693);
        assert.equal(res.value, "Dfb");
        assert.equal(res.result, "Df - Snow climate, fully humid; b - Warm summer");
    });

    it("Langov kišni faktor", () => {
        const res = langsRainfallFactor(percs, temps);
        assert.equal(res.value, 201.72);
        assert.equal(res.result, "perhumidno");
    });

    it("Toplinski karakter klime po Gračaninu", () => {
        assert.equal(thermicCharacterGracanin(1.1).result, "hladno");
        assert.equal(thermicCharacterGracanin(15.2).result, "toplo");
        assert.equal(thermicCharacterGracanin(-1.6).result, "nivalno");
    });

    it("Thornthwaite equation (1948) for potential evaporation (PE or PET)", () => {

        const res = thornthwaitePET(temps, 45.9036, 15.9693);
        assert.equal(res.value, 535.06);
    });

    it("Vodna bilanca (vodni suficit/deficit)", () => {
        const pet = thornthwaitePET(temps, 45.9036, 15.9693);
        const vodna_bilanca = thornthwaiteWaterBalance(percs, pet.result);
        // console.log("vodna_bilanca", vodna_bilanca);
        assert.equal(vodna_bilanca.value, 713.94);
    });
});

it("Indeks djelotvornosti oborina po Thorntwaitu", () => {
    const res = thornthwaitePercipitationEfficiency(percs, temps);
    assert.equal(res.value, 150.07);
    assert.equal(res.result, "perhumidna ili izrazito vlažna klima");
})