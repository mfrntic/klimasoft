const assert = require('assert');
const { aridityIndexDeMartonne, aridityIndexGracanin, ellenbergCQ, embergerPluviotermicQuotient } = require("../src/lib/formulas");
const { sum, average } = require("../src/lib/mathUtils");

//puntjarka
const temps = [-3.1, -2.1, 1.1, 5.5, 10.2, 13.2, 15.2, 14.7, 11.7, 7.3, 2.2, -1.6];
const temps_avg_max = [-0.4, 1.1, 4.9, 9.8, 14.8, 17.5, 19.8, 19.2, 15.9, 11, 5, 1];

const percs = [75, 73, 91, 105, 112, 139, 120, 119, 106, 96, 119, 94];

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
});