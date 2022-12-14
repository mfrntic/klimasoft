// const { round, average, sum, max, min } = require("./mathUtils");
// const MoonSunCalc = require("./moonsuncalc");

import { round, average, sum, max, min, isNumber, describe } from "./mathUtils";
import MoonSunCalc from "./moonsuncalc";

export const aridityIndexDeMartonne = {
    calculate: function (oborine, temperatura) {

        //izračunaj prosjek
        const annualPerc = sum(oborine);
        const meanTemp = average(temperatura);

        // console.log(annualPerc, meanTemp);
        //result
        const res = {
            value: null,
            result: ""
        }

        //result description
        res.value = Math.abs(round(annualPerc / (meanTemp + 10), 2));
        if (res.value <= 15) {
            res.result = "arid";
        }
        else if (res.value <= 24) {
            res.result = "semi-arid";
        }
        else if (res.value <= 30) {
            res.result = "moderately-arid";
        }
        else if (res.value <= 35) {
            res.result = "slightly-arid";
        }
        else if (res.value <= 40) {
            res.result = "moderately-humid";
        }
        else if (res.value <= 50) {
            res.result = "humid";
        }
        else if (res.value <= 60) {
            res.result = "very-humid";
        }
        else {
            res.result = "excessively-humid";
        }

        return res;
    },
    name: "aridityIndexDeMartonne",
    title: "Aridity index [DMI], De Martonne (1926.)",
    group: "Vodni režim",
    type: "SingleValueDescription",
    description: "The De Martonne (1926.) aridity index: DMI = P / (T + 10), where P (cm) is the annual precipitation and T (°C) the annual mean temperature.",
}

export const aridityIndexGracanin = {
    calculate: function (oborine, temperatura) {

        const arr = [], arr1 = [];

        const getVal = (o, t) => {
            t = Math.abs(round(o / t, 1));
            const res = {
                value: t,
                result: ""
            };

            if (res.value < 3.3) {
                res.result = "aridno";
            }
            else if (res.value < 5) {
                res.result = "semiaridno";
            }
            else if (res.value < 6.6) {
                res.result = "semihumidno";
            }
            else if (res.value < 13.3) {
                res.result = "humidno";
            }
            else {
                res.result = "perhumidno";
            }
            return res;
        }

        for (let i = 0; i < oborine.length; i++) {
            arr.push(getVal(oborine[i], temperatura[i]).value);
            arr1.push(getVal(oborine[i], temperatura[i]).result);
        }

        console.log("arr", arr1)
        return {
            value: arr,
            result: arr1
        };

    },
    name: "aridityIndexGracanin",
    title: "Aridity index [Ag], Gračanin",
    group: "Vodni režim",
    type: "MultiValueDescription",
    description: "Indeks mjesečne aridnosti prema Gračaninu (Pm - srednja mjesečna količina oborina, Tm - srednja mjesečna temperatura)"

}

export const ellenbergEQ = {
    calculate: function (oborine, temperatura) {

        //izračunaj prosjek
        const annualPerc = sum(oborine);
        const temp = max(temperatura);

        //result
        const res = {
            value: null,
            result: ""
        }

        res.value = round(temp / annualPerc * 1000, 2);
        res.result = res.value.toString();

        return res;
    },
    name: "ellenbergEQ",
    title: "Ellenberg's climate quotient [EQ]",
    group: "Klimatski indeksi",
    type: "SingleValue",
    description: "Ellenberg's climate quotient (EQ = T_warmest_month / AnnualPercipitation * 1000)"
}

export const embergerPluviotermicQuotient = {
    calculate: function (oborine, temperatura) {
        //izračunaj prosjek
        const annualPerc = sum(oborine);
        const temp_max = max(temperatura);
        const temp_min = min(temperatura);

        //result
        const res = {
            value: null,
            result: ""
        }

        res.value = round(2000 * annualPerc / ((temp_max + temp_min + 546.24) * (temp_max - temp_min)), 2);
        res.result = res.value.toString();

        return res;
    },
    name: "embergerPluviotermicQuotient",
    title: "Emberger's pluviometric quotient [Q₂]",
    group: "Klimatski indeksi",
    type: "SingleValue",
    description: "Emberger's pluviometric quotient (Q₂ = 2000 P / [(M + m + 546.4) * (M - m)]. P = total annual precipitation, M = mean max temperature of the warmest month, m = mean min temperature of the coldest month)"
}

export const continentalityIndexConrad = {
    calculate: function (temperatura, lat) {
        const res = {
            value: null,
            result: ""
        }

        const ampl = round(max(temperatura) - min(temperatura), 2);

        res.value = round(1.7 * ampl / Math.sin((lat + 10) * Math.PI / 180) - 14, 2);
        if (res.value <= 33) {
            res.result = "maritime transition zone";
        }
        else if (res.value < 67) {
            res.result = "continental";
        }
        else {
            res.result = "extremely continental"
        }

        return res;
    },
    name: "continentalityIndexConrad",
    title: "Continentality index (Conrad)",
    group: "Klimatski indeksi",
    type: "SingleValueDescription",
    description: "An index of continentality, or coefficient of continentality, k, has been formulated by V. Conrad as follows: k = 1.7 * Temp_Amplitude / sin(Latitude + 10) - 14"
}

export const koppenClimateFormula = {
    calculate: function (oborine, temperatura, lat) {
        const res = {
            value: null,
            result: ""
        }
        lat = Number(lat);

        const coolest = min(temperatura);
        const warmest = max(temperatura);
        const driest = min(oborine);
        const wettest = max(oborine);
        let driestSummer, wettestSummer, driestWinter, wettestWinter;
        let oborineummer = 0, percWinter = 0, oborineummerPosto = 0, percWinterPosto = 0;
        let hspoy = []; //high-sun of the year, depends on latitude
        if (lat < 0) {
            //southern hemisphere
            hspoy = [4, 5, 6, 7, 8, 9]; //winter months
        }
        else {
            hspoy = [1, 2, 3, 10, 11, 12];
        }

        // driestSummer = min(hspoy.map(m => perc[m - 1]));
        // wettestSummer = max(hspoy.map(m => perc[m - 1]));
        // oborineummer = sum(hspoy.map(m => perc[m - 1]));

        for (let m = 1; m <= 12; m++) {
            if (!hspoy.includes(m)) {
                //high sun part of the year - summer
                driestSummer = Math.min(driestSummer, oborine[m - 1]);
                wettestSummer = Math.max(wettestSummer, oborine[m - 1]);
                oborineummer += oborine[m - 1];
            }
            else {
                //low sun part of the year - winter
                driestWinter = Math.min(driestWinter, oborine[m - 1]);
                wettestWinter = Math.max(wettestWinter, oborine[m - 1]);
                percWinter += oborine[m - 1];
            }
        }
        oborineummerPosto = oborineummer / sum(oborine) * 100;
        percWinterPosto = percWinter / sum(oborine) * 100;


        //Izračun formule
        if ((oborineummerPosto >= 70.0 && average(oborine) < 2 * average(temperatura) + 28) ||
            (percWinterPosto >= 70.0 && average(oborine) < 2 * average(temperatura)) ||
            (average(oborine) < 2 * average(temperatura) + 14)) {
            res.value = "B";
            if ((oborineummerPosto >= 70.0 && ((2 * average(temperatura)) / 2) < average(oborine) && 2 * average(temperatura) > average(oborine)) ||
                (percWinterPosto >= 70.0 && (2 * average(temperatura) / 2 < average(oborine) && 2 * average(temperatura) > average(oborine))) ||
                ((2 * average(temperatura) + 14) / 2 < average(oborine) && 2 * average(temperatura) + 14 > average(oborine))) {
                res.value += "S";
                res.result = "BS - Steppe climate";
            }
            else if ((oborineummerPosto >= 70.0 && ((2 * average(temperatura) + 28) / 2) < average(oborine)) ||
                (percWinterPosto >= 28.0 && (2 * average(temperatura) + 14) / 2 > average(oborine))) {
                res.value += "W";
                res.result = "BW - Desert climate";
            }

            if (average(temperatura) >= 18) {
                res.value += "h"; //Tann ≥ +18 ◦C
                res.result += "; h - Hot steppe / desert";
            }
            else {
                res.value += "k"; //Tann < +18 ◦C
                res.result += "; k - Cold steppe /desert";
            }
        }
        else if (coolest > 18) {
            res.value = "A";
            if (driest >= 60) {
                res.value += "f";
                res.result = "Af - Equatorial rainforest, fully humid";
            }
            else if (driest < 60 && percWinterPosto < 30) {
                res.value += "w";
                res.result = "Aw - Equatorial savannah with dry winter";
            }
            else if (driest < 60 && oborineummerPosto < 30) {
                res.value += "s";
                res.result = "As - Equatorial savannah with dry summer";
            }
            else if (driest < 60) {
                res.value += "m";
                res.result = "Am - Equatorial monsoon";
            }
        }
        else if (coolest >= -3 && coolest <= 18 && warmest > 10) {
            res.value = "C";
            if (driestSummer < driestWinter) {
                res.value += "s";
                res.result = "Cs - Warm temperate climate with dry summer";
            }
            else if (driestWinter < driestSummer && wettestSummer > 10 * driestWinter) {
                res.value += "w";
                res.result = "Cw -  Warm temperate climate with dry winter";
            }
            else {
                res.value += "f";
                res.result = "Cf - Warm temperate climate, fully humid";
            }


            if (warmest >= 22) {
                res.value += "a"; //Hot summer Tmax ≥ +22 ◦C
                res.result += "; a - Hot summer";
            }
            else if (temperatura.filter(m => m >= 10).length >= 4) {
                res.value += "b"; // Warm summer not (a) and at least 4 Tmon ≥ +10 ◦C
                res.result += "; b - Warm summer";
            }
            else if (temperatura.filter(m => m < 10).length <= 3) {
                if (min(temperatura) > -38) {
                    res.value += "c"; //Cool summer and cold winter not (b) and Tmin > −38 ◦C
                    res.result += "; c - Cool summer and cold winter";
                }
                else {
                    res.value += "d"; //extremely continental like (c) but Tmin ≤ −38 ◦C
                    res.result += "; d - Extremely continental";
                }
            }
        }
        else if (coolest < -3 && warmest > 10) {
            res.value = "D";
            if (driest * 3 < wettest && driest < 40) {
                res.value += "s";
                res.result = "Ds - Snow climate with dry summer";
            }
            else if (wettest >= 10 * driest) {
                res.value += "w";
                res.result = "Dw - Snow climate with dry winter";
            }
            else {
                res.value += "f";
                res.result = "Df - Snow climate, fully humid";
            }

            if (warmest >= 22) {
                res.value += "a"; //Hot summer Tmax ≥ +22 ◦C
                res.result += "; a - Hot summer";
            }
            else if (temperatura.filter(m => m >= 10).length >= 4) {
                res.value += "b"; // Warm summer not (a) and at least 4 Tmon ≥ +10 ◦C
                res.result += "; b - Warm summer";
            }
            else if (temperatura.filter(m => m < 10).length <= 3) {
                if (min(temperatura) > -38) {
                    res.value += "c"; //Cool summer and cold winter not (b) and Tmin > −38 ◦C
                    res.result += "; c - Cool summer and cold winter";
                }
                else {
                    res.value += "d"; //extremely continental like (c) but Tmin ≤ −38 ◦C
                    res.result += "; d - Extremely continental";
                }
            }
        }
        else if (warmest < 10) {
            res.value = "E";
            if (warmest >= 0) {
                res.value += "T";
                res.result = "ET - Tundra climate";
            }
            else {
                res.value += "F";
                res.result = "EF - Frost climate";
            }
        }

        return res;
    },
    name: "koppenClimateFormula",
    description: "Köppen’s classification is based on a subdivision of terrestrial climates into five major types, which are represented by the capital letters A, B, C, D, and E. Each of these climate types except for B is defined by temperature criteria. Type B designates climates in which the controlling factor on vegetation is dryness (rather than coldness). Aridity is not a matter of precipitation alone but is defined by the relationship between the precipitation input to the soil in which the plants grow and the evaporative losses. Since evaporation is difficult to evaluate and is not a conventional measurement at meteorological stations, Köppen was forced to substitute a formula that identifies aridity in terms of a temperature-precipitation index (that is, evaporation is assumed to be controlled by temperature). Dry climates are divided into arid (BW) and semiarid (BS) subtypes, and each may be differentiated further by adding a third code, h for warm and k for cold.",
    group: "Klimatski indeksi",
    type: "SingleValueDescription",
    title: "Köppen’s climate classification formula"
}

export const langsRainfallFactor = {
    calculate: function (oborine, temperatura) {
        //izračunaj prosjek
        const annualPerc = sum(oborine);
        const meanTemp = average(temperatura);

        // console.log(annualPerc, meanTemp);
        //result
        const res = {
            value: null,
            result: ""
        }

        res.value = Math.abs(round(annualPerc / meanTemp, 2));
        if (res.value < 40) {
            res.result = "aridno";
        }
        else if (res.value < 60) {
            res.result = "semiaridno";
        }
        else if (res.value < 100) {
            res.result = "semihumidno";
        }
        else if (res.value < 160) {
            res.result = "humidno";
        }
        else {
            res.result = "perhumidno";
        }
        return res;
    },
    name: "langsRainfallFactor",
    title: "Lang’s rainfall factor [LRF]",
    group: "Vodni režim",
    type: "SingleValueDescription",
    description: "Lang’s rainfall factor expresses natural irrigation conditions of landscape by the relationship between rainfalls and air temperature (Equation 2) (Sobisek 1993): f = R / t  -> where  f = Lang’s rainfall factor, R = average annual rainfall sum in mm, and t = average annual air temperature in °C"
}

export const thermicCharacterGracanin = {
    calculate: function (temperatura) {

        const arr = [], arr1 = [];

        const getVal = (t) => {
            t = Number(t);
            const res = {
                value: null,
                result: ""
            };

            if (t < 0.5) {
                res.value = "n";
                res.result = "nivalno";
            }
            else if (t < 4) {
                res.value = "h";
                res.result = "hladno";
            }
            else if (t < 8) {
                res.value = "uhl";
                res.result = "umjereno hladno";
            }
            else if (t < 12) {
                res.value = "ut";
                res.result = "umjereno toplo";
            }
            else if (t < 20) {
                res.value = "t";
                res.result = "toplo";
            }
            else {
                res.value = "v";
                res.result = "vruće";
            }
            return res;
        }

        for (let i = 0; i < temperatura.length; i++) {
            arr.push(getVal(temperatura[i]).value);
            arr1.push(getVal(temperatura[i]).result);
        }


        return {
            value: arr,
            result: arr1
        };
    },
    name: "thermicCharacterGracanin",
    title: "Toplinski karakter klime po Gračaninu",
    group: "Klimatski indeksi",
    type: "MultiValueDescription",
    description: "Toplinski karakter klime po Gračaninu"
}

export const thornthwaitePET = {
    calculate: function (temperatura, lat, lon) {
        let year_from = 0, year_to = 0;
        if (year_from === 0) year_from = new Date().getFullYear();
        if (year_to === 0) year_to = new Date().getFullYear();
        let I = 0;
        for (let m = 1; m <= 12; m++) {
            if (temperatura[m - 1] > 0) {
                I += Math.pow(temperatura[m - 1] / 5, 1.514);
            }
        }
        const a = 0.000000675 * Math.pow(I, 3) - 0.0000771 * Math.pow(I, 2) + 0.01792 * I + 0.49239;
        const pe_monthly = [];
        for (let m = 1; m <= 12; m++) {
            let pe = 0;
            if (temperatura[m - 1] > 0) {
                const korektFakt = (MoonSunCalc.getAverageDaylight(m, year_from, year_to, lat, lon) / 12) * (new Date(2000, m - 1, 0).getDate() / 30);
                pe = (16 * Math.pow(10 * temperatura[m - 1] / I, a)) * korektFakt;
            }
            pe_monthly.push(round(pe, 2));
        }
        // console.log("pe_monthly", pe_monthly);
        // const result = `PET: ${month === 0 ? sum(pe_monthly) : pe_monthly[month - 1]} | ${month === 0 ? "total" : `month (${month})`}`;

        return {
            value: sum(pe_monthly),
            result: pe_monthly
        }
    },
    name: "thornthwaitePET",
    title: "Thornthwaite potential evapotranspiration [PET]",
    group: "Vodni režim",
    type: "MultiValueTotal",
    description: "Thornthwaite equation (1948). Potential evaporation (PE) or potential evapotranspiration (PET) is defined as the amount of evaporation that would occure if a sufficient water source were available",

}

export const thornthwaiteWaterBalance = {
    calculate: function (oborine, temperatura, lat, lon) {

        const ob = describe(oborine, "avg", false)[0];
        const temp = describe(temperatura, "avg", false)[0];

        console.log(ob, temp, lat, lon);

        const thornthwaite_pet_monthly = thornthwaitePET.calculate(temp, lat, lon).result;
        const visak = ["VIŠAK"], manjak = ["MANJAK"], zaliha = ["ZALIHA"], set = ["SET"];
        let zaliha_kumulativ = 100;

        console.log(thornthwaite_pet_monthly);

        for (let m = 0; m < oborine.length; m++) {
            const o = ob[m];
            const pet = thornthwaite_pet_monthly[m]
            const razlika_o_pet = round(o - pet, 2);
            // vodna_bilanca.push(razlika_o_pet);


            zaliha_kumulativ = round(zaliha_kumulativ + razlika_o_pet, 2);

            if (zaliha_kumulativ < 0) {
                set.push(round(pet + razlika_o_pet, 2));
                // zaliha_kumulativ = 0;
            }
            else if (zaliha_kumulativ > 100) {

                // zaliha_kumulativ = 100;

            }
            else {
                set.push(pet);
            }

            if (razlika_o_pet < 0) {
                //deficit vode
                visak.push("");
                if (zaliha_kumulativ < 0) {
                    manjak.push(-razlika_o_pet);
                }
                else {
                    manjak.push("");
                }


            } else {
                if (zaliha_kumulativ > pet) {
                    visak.push(razlika_o_pet);
                }
                else {
                    visak.push("");
                }
                manjak.push("");
                // set.push(pet);
            }

            zaliha.push(zaliha_kumulativ > 100 ? 100 : (zaliha_kumulativ < 0 ? 0 : zaliha_kumulativ));
        }

        return {
            value: 0,//round(sum(vodna_bilanca), 2),
            result: [["PET", ...thornthwaite_pet_monthly], ["P", ...ob], zaliha, set, visak, manjak],
        }
    },
    name: "thornthwaiteWaterBalance",
    title: "Thornthwaite water balance",
    group: "Vodni režim",
    type: "MultiValue",
    formulaDescription: "Vodna bilanca (vodni suficit/deficit) s obzirom na potencijalnu evapotranspiraciju"
}

export const thornthwaitePercipitationEfficiency = {
    calculate: function (oborine, temperatura) {
        let d = 0;
        for (let m = 1; m <= 12; m++) {
            d += 1.65 * Math.pow(oborine[m - 1] / (temperatura[m - 1] + 12.2), 10.0 / 9.0);
        }

        let result = "";
        if (d > 128)
            result = "perhumidno";
        else if (d > 64)
            result = "humidno";
        else if (d > 32)
            result = "subhumidno";
        else if (d > 16)
            result = "semiaridno";
        else
            result = "aridno";

        return {
            value: round(d, 2),
            result: result,
        }
    },
    name: "thornthwaitePercipitationEfficiency",
    title: "Thornthwaite percipitation efficiency",
    group: "Vodni režim",
    type: "SingleValueDescription",
    description: "Indeks djelotvornosti oborina po Thorntwaitu"
}

export const continentalityIndex = {
    calculate: function (temperatura) {
        const tmin = min(temperatura);
        const tmax = max(temperatura);
        const res = round(tmax - tmin, 2);
        let result = "";
        if (res < 2.5) {
            result = "equatorial";
        }
        else if (res < 10) {
            result = "oceanic";
        }
        else if (res < 25) {
            result = "maritime transition zone";
        }
        else if (res < 40) {
            result = "continental";
        }
        else {
            result = "extremely continental";
        }

        return {
            value: res,
            result: result
        }
    },
    name: "continentalityIndex",
    title: "Continentality index [CONTINENTY]",
    group: "Klimatski indeksi",
    type: "SingleValueDescription",
    description: "Continentality index [CONTINENTY]: Tmax - Tmin (Tmax - mean air temperature of the hottest month [°C], Tmin - mean air temperature of the coldest month [°C])"
}

// template
// exports. = {
//     calculate: function(){

//     },
//     title: "",
//     description: ""
// }

export const ombrothermicIndex = {
    calculate: function (temperatura, oborine) {
        const t = [], p = [];
        for (let i = 0; i < temperatura.length; i++) {
            if (temperatura[i] > 0) {
                t.push(temperatura[i]);
                p.push(oborine[i]);
            }
        }

        const res = round((average(p) / sum(t)) * 10, 2);
        let result = "";
        if (res < 0.3) {
            result = "hyperarid";
        }
        else if (res < 0.9) {
            result = "arid";
        }
        else if (res < 2) {
            result = "semiarid";
        }
        else if (res < 3) {
            result = "dry";
        }
        else if (res < 5.5) {
            result = "subhumid";
        }
        else {
            result = "humid";
        }

        return {
            value: res,
            result: result
        }
    },
    name: "ombrothermicIndex",
    title: "Ombrothermic Index [Io]",
    group: "Vodni režim",
    type: "SingleValueDescription",
    description: "Rivas-Martinez et al. 2011."
}

export const ombrothermicIndexSummerQuarter = {
    calculate: function (temperatura, oborine) {
        const t = [], p = [];
        for (let i = 0; i < temperatura.length; i++) {
            if (i >= 5 && i <= 7) { //lip, srp, kol
                t.push(temperatura[i]);
                p.push(oborine[i]);
            }
        }

        const res = round((average(p) / sum(t)) * 10, 2);
        let result = "";
        if (res < 0.3) {
            result = "hyperarid";
        }
        else if (res < 0.9) {
            result = "arid";
        }
        else if (res < 2) {
            result = "semiarid";
        }
        else if (res < 3) {
            result = "dry";
        }
        else if (res < 5.5) {
            result = "subhumid";
        }
        else {
            result = "humid";
        }

        return {
            value: res,
            result: result
        }
    },
    name: "ombrothermicIndexSummerQuarter",
    title: "Ombrothermic index of the summer quarter [Iosq]",
    group: "Vodni režim",
    type: "SingleValueDescription",
    description: "Rasztovits et al. 2012."
}

export const thermicityIndex = {
    calculate: function (temperatura) {
        const T = average(temperatura);
        const m = min(temperatura);
        const M = max(temperatura);
        const res = round((T + m + M) * 10);

        return {
            value: res,
            result: res.toFixed()
        }
    },
    name: "thermicityIndex",
    title: "Thermicity Index [It]",
    group: "Klimatski indeksi",
    type: "SingleValue",
    description: "Rasztovits et al. 2012."
}

export const ombroEvapotranspirationIndex = {
    calculate: function (temperatura, oborine, lat, lon) {
        const pet = thornthwaitePET.calculate(temperatura, lat, lon).value;
        const annualPerc = sum(oborine);
        const res = round(annualPerc / pet, 2);

        return {
            value: res,
            result: res.toFixed(2)
        }
    },
    name: "ombroEvapotranspirationIndex",
    title: "Ombro-evapotranspiration index [Ioe]",
    group: "Vodni režim",
    type: "SingleValue",
    description: "Rivas-Martinez et al. 2011."
}

export const drySeasonWaterDeficit = {
    calculate: function (temperatura, oborine, lat, lon) {
        const resArr = [];

        for (let k = 0; k < temperatura.length; k++) {
            const temp = temperatura[k].slice(1, 13).filter(a => isNumber(a));
            let ob = oborine.find(a => a[0] == temperatura[k][0]);
            ob = ob.slice(1, 13);
            // console.log("DSWD", temp, ob);

            let res = [temperatura[k][0]];
            if (Array.isArray(ob) && ob.length === 12) {
                const pet = thornthwaitePET.calculate(temp, lat, lon);
                // resArr.push(round(oborine[i] - pet.result[i], 2));
                for (let i = 0; i < 12; i++) {
                    res.push(round(ob[i] - pet.result[i], 2));
                }
                resArr.push(res);
                // console.log("resArr", resArr);
            }
            // else {
            //     resArr.push([temp[0], "", ""]);
            // }
        }

        // for (let i = 0; i < oborine.length; i++) {
        //     if (temperatura[i] > 0) {
        //         const pet = thornthwaitePET.calculate(temperatura, lat, lon);
        //         resArr.push(round(oborine[i] - pet.result[i], 2));
        //     }
        //     else {
        //         resArr.push(0);
        //     }
        // }

        return {
            value: sum(resArr),
            result: resArr
        }
    },
    name: "drySeasonWaterDeficit",
    title: "Dry season water deficit [DSWD]",
    group: "Vodni režim",
    type: "MultiValue",
    description: "Dufour-Dror and Ertas 2004."
}

export const drySeasonDuration = {
    calculate: function (temperatura, oborine) {

        //console.log("LDS", temperatura, oborine);

        const resArr = [];
        for (let k = 0; k < temperatura.length; k++) {

            const temp = temperatura[k];
            const ob = oborine.find(a => a[0] == temp[0]);
            let res = 0;
            let months = [];
            if (ob) {
                let skip = false;
                for (let i = 1; i < 13; i++) {
                    const t = temp[i];
                    const p = ob[i];
                    if (!!t || !!p) {
                        skip = false;
                        // console.log("LDS-" + temp[0] + "-" + i, p, t, t * 2);
                        if (p <= 2 * t) {
                            res++;
                            months.push(i);
                        }
                    }
                    else {
                        skip = true;
                    }

                }
                if (!skip) {
                    resArr.push([temp[0], months.join(", "), res]);
                }
            }
            else {
                resArr.push([temp[0], "", ""]);
            }

        }
        return {
            value: round(average(resArr[1]), 2),
            result: resArr
        }
    },
    name: "drySeasonDuration",
    title: "Duration of the dry season [LDS]",
    group: "Vodni režim",
    type: "MultiValue",
    description: "Gausen 1954., UNESCO 1963"
}

export const rainfallAnomalyIndex = {
    calculate: function (oborine) {
        // console.log("rai-ulaz-oborine", oborine);

        const oborine_agg = oborine.map(a => {
            const godina = a[0];
            const value = round(average(a.slice(1, 13).filter(a => Number(a) > 0)), 2);
            return { godina, value }
        });

        let low = [...oborine_agg];
        low.sort((a, b) => a.value - b.value);
        low = low.slice(0, 10).map(a => a.value);
        let high = [...oborine_agg]
        high.sort((a, b) => b.value - a.value);
        high = high.slice(0, 10).map(a => a.value);

        const p_avg = round(average(oborine_agg.filter(a => !isNaN(a.value)).map(a => a.value)), 2);
        const high_avg = round(average(high), 2);
        const low_avg = round(average(low), 2);
        // console.log(high, low);
        // console.log("pavg, high_avg, low_avg", p_avg, high_avg, low_avg);

        const res = [];
        for (const p of oborine_agg) {

            const anom = round(p.value - p_avg, 1);
            // console.log("anomaly", anom);

            let ind;
            if (anom < 0) {
                ind = -3 * (anom / (low_avg - p.value));
                //ind = -3 * anom / (high_avg - p_avg);
            }
            else {
                ind = 3 * anom / (high_avg - p.value);
            }

            // console.log("p/anomaly/rai", p, anom, round(ind, 2));
            if (!isNaN(p.value)) {
                res.push([p.godina, p.value, anom, round(ind, 2)]);
            }
            else {
                res.push([p.godina, "", "", ""]);
            }
        }

        // console.log("rai-res", res);
        return {
            value: round(average(res[3]), 2),
            result: res
        }
    },
    name: "rainfallAnomalyIndex",
    title: "Rainfall Anomaly Index [RAI]",
    group: "Vodni režim",
    type: "MultiValueAverage",
    description: "RAI (Rainfall Anomaly Index) is an incorporation of ranking procedure to assign magnitudes to positive and negative precipitation anomalies"
}

export const percentOfNormalPercipitation = {
    calculate: function (oborine) {

        const oborine_agg = oborine.map(a => {
            const godina = a[0];
            const value = round(average(a.slice(1, 13).filter(a => Number(a) > 0)), 2);
            return { godina, value }
        });

        // console.log("oborine_agg", oborine_agg);
        const meanP = round(average(oborine_agg.filter(a => !isNaN(a.value)).map(a => a.value)), 2);

        const resArr = [];
        for (const p of oborine_agg) {
            if (!isNaN(p.value)) {
                resArr.push([p.godina, p.value, round(p.value / meanP * 100, 2)]);
            }
            else {
                resArr.push([p.godina, "", ""]);
            }
        }

        return {
            value: round(average(resArr), 2),
            result: resArr
        }
    },
    name: "percentOfNormalPercipitation",
    title: "Percent of Normal Percipitation [PN]",
    group: "Vodni režim",
    type: "MultiValueAverage",
    description: "Postotak od normalne oborine (engl. Percent of Normal, PN) ili anomalija oborina zasniva se na odnosu mjesečnih oborina i prosječne mjesečne oborine promatranog razdoblja."
}

export const hydrothermicIndexSeljaninov = {
    calculate: function (temperatura, oborine, vegetation_temp_treshold) {
        const t = [], p = [];
        for (let i = 0; i < temperatura.length; i++) {
            if (temperatura[i] > vegetation_temp_treshold) {
                t.push(temperatura[i]);
                p.push(oborine[i]);
            }
        }

        const res = round((sum(p) / sum(t)) * 10, 2);
        let result = "";
        if (res < 0.5) {
            result = "zona navodnjavanja, pustinje i polupustinje";
        }
        else if (res < 0.7) {
            result = "zona suhog ratarenja";
        }
        else if (res < 1) {
            result = "sušna zona sa jako izraženim nedostatkom vlage;";
        }
        else if (res < 1.3) {
            result = "zona dovoljne vlažnosti";
        }
        else {
            result = "zona suvišne vlažnosti";
        }

        return {
            value: res,
            result: result
        }
    },
    name: "hydrothermicIndexSeljaninov",
    title: "Seljaninov's hydrothermic index [HTC]",
    group: "Vodni režim",
    type: "SingleValueDescription",
    description: "Seljaninov's hydrothermal coefficient (HTC) indicates a lack of moisture in the vegetation period.",
    defaultParamValues: {
        vegetation_temp_treshold: 6
    },
}

export const walterClimateDiagram = {
    calculate: function (show_aridness, show_months, show_vegetation_period) { },
    name: "walterClimateDiagram",
    title: "Walter Climate Diagram [WCD]",
    group: "Dijagrami",
    type: "Klimadijagram",
    description: "Graphic representation of climatic conditions at a particular place, which shows seasonal variations and extremes as well as mean values and therefore provides a succinct and easily accessible summary of a local climate.",
    defaultParamValues: {
        show_aridness: true,
        show_months: true,
        show_vegetation_period: false
    },
}

export const walterKlimatogram = {
    calculate: (show_aridness, show_months, years_in_row) => { },
    name: "walterKlimatogram",
    title: "Walter Climatogram [WCG]",
    group: "Dijagrami",
    type: "Klimatogram",
    description: "Walter climate diagram, but for each year of input data.",
    defaultParamValues: {
        show_aridness: true,
        show_months: false,
        years_in_row: 7
    },
}

export const projectInfo = {
    calculate: function () { },
    name: "projectInfo",
    title: "Osnovne informacije",
    group: "Deskriptiva",
    type: "ProjectInfo",
    description: "Information about the selected project, period and location / meteorological station"
}

export const descriptiveTemperature = {
    calculate: function () { },
    name: "descriptiveTemperature",
    title: "Deskriptiva temperature",
    group: "Deskriptiva",
    type: "DescriptiveTemperature",
    description: "Statistically processed temperature data"
}

export const descriptivePercipitation = {
    calculate: function () { },
    name: "descriptivePercipitation",
    title: "Deskriptiva oborine",
    group: "Deskriptiva",
    type: "DescriptivePercipitation",
    description: "Statistically processed percipitation data"
}
