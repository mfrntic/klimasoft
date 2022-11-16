const { default: reactSelect } = require("react-select");
const { round, average, sum, max, min } = require("./mathUtils");
const MoonSunCalc = require("./moonsuncalc");

exports.aridityIndexDeMartonne = {
    calculate: function (perc, mean_temp) {

        //izračunaj prosjek
        const annualPerc = sum(perc);
        const meanTemp = average(mean_temp);

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
    title: "Aridity index [DMI], De Martonne (1926.)",
    description: "The De Martonne (1926.) aridity index: DMI = P / (T + 10), where P (cm) is the annual precipitation and T (°C) the annual mean temperature."
}

exports.aridityIndexGracanin = {
    calculate: function (perc, mean_temp) {

        //izračunaj prosjek
        const annualPerc = sum(perc);
        const meanTemp = average(mean_temp);

        // console.log(annualPerc, meanTemp);
        //result
        const res = {
            value: null,
            result: ""
        }

        //result description
        res.value = Math.abs(round(annualPerc / meanTemp, 1));
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
    },
    title: "Aridity index [Ag], Gračanin",
    description: "Indeks mjesečne aridnosti prema Gračaninu (Pm - srednja mjesečna količina oborina, Tm - srenja mjesečna temperatura)"

}

exports.ellenbergEQ = {
    calculate: function (perc, mean_temp) {

        //izračunaj prosjek
        const annualPerc = sum(perc);
        const temp = max(mean_temp);

        //result
        const res = {
            value: null,
            result: ""
        }

        res.value = round(temp / annualPerc * 1000, 2);
        res.result = res.value.toString();

        return res;
    },
    title: "Ellenberg's climate quotient [EQ]",
    description: "Ellenberg's climate quotient (EQ = T_warmest_month / AnnualPercipitation * 1000)"
}
exports.embergerPluviotermicQuotient = {
    calculate: function (perc, mean_temp) {
        //izračunaj prosjek
        const annualPerc = sum(perc);
        const temp_max = max(mean_temp);
        const temp_min = min(mean_temp);

        //result
        const res = {
            value: null,
            result: ""
        }

        res.value = round(2000 * annualPerc / ((temp_max + temp_min + 546.24) * (temp_max - temp_min)), 2);
        res.result = res.value.toString();

        return res;
    },
    title: "Emberger's pluviometric quotient [Q₂]",
    description: "Emberger's pluviometric quotient (Q₂ = 2000 P / [(M + m + 546.4) * (M - m)]. P = total annual precipitation, M = mean max temperature of the warmest month, m = mean min temperature of the coldest month)"
}

exports.continentalityIndexConrad = {
    calculate: function (lat, ampl) {
        const res = {
            value: null,
            result: ""
        }
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
    title: "Continentality index (Conrad)",
    description: "An index of continentality, or coefficient of continentality, k, has been formulated by V. Conrad as follows: k = 1.7 * Temp_Amplitude / sin(Latitude + 10) - 14"
}

exports.koppenClimateFormula = {
    calculate: function (perc, mean_temp, lat) {
        const res = {
            value: null,
            result: ""
        }

        const coolest = min(mean_temp);
        const warmest = max(mean_temp);
        const driest = min(perc);
        const wettest = max(perc);
        let driestSummer, wettestSummer, driestWinter, wettestWinter;
        let percSummer = 0, percWinter = 0, percSummerPosto = 0, percWinterPosto = 0;
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
        // percSummer = sum(hspoy.map(m => perc[m - 1]));

        for (let m = 1; m <= 12; m++) {
            if (!hspoy.includes(m)) {
                //high sun part of the year - summer
                driestSummer = Math.min(driestSummer, perc[m - 1]);
                wettestSummer = Math.max(wettestSummer, perc[m - 1]);
                percSummer += perc[m - 1];
            }
            else {
                //low sun part of the year - winter
                driestWinter = Math.min(driestWinter, perc[m - 1]);
                wettestWinter = Math.max(wettestWinter, perc[m - 1]);
                percWinter += perc[m - 1];
            }
        }
        percSummerPosto = percSummer / sum(perc) * 100;
        percWinterPosto = percWinter / sum(perc) * 100;


        //Izračun formule
        if ((percSummerPosto >= 70.0 && average(perc) < 2 * average(mean_temp) + 28) ||
            (percWinterPosto >= 70.0 && average(perc) < 2 * average(mean_temp)) ||
            (average(perc) < 2 * average(mean_temp) + 14)) {
            res.value = "B";
            if ((percSummerPosto >= 70.0 && ((2 * average(mean_temp)) / 2) < average(perc) && 2 * average(mean_temp) > average(perc)) ||
                (percWinterPosto >= 70.0 && (2 * average(mean_temp) / 2 < average(perc) && 2 * average(mean_temp) > average(perc))) ||
                ((2 * average(mean_temp) + 14) / 2 < average(perc) && 2 * average(mean_temp) + 14 > average(perc))) {
                res.value += "S";
                res.result = "BS - Steppe climate";
            }
            else if ((percSummerPosto >= 70.0 && ((2 * average(mean_temp) + 28) / 2) < average(perc)) ||
                (percWinterPosto >= 28.0 && (2 * average(mean_temp) + 14) / 2 > average(perc))) {
                res.value += "W";
                res.result = "BW - Desert climate";
            }

            if (average(mean_temp) >= 18) {
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
            else if (driest < 60 && percSummerPosto < 30) {
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
            else if (mean_temp.filter(m => m >= 10).length >= 4) {
                res.value += "b"; // Warm summer not (a) and at least 4 Tmon ≥ +10 ◦C
                res.result += "; b - Warm summer";
            }
            else if (mean_temp.filter(m => m < 10).length <= 3) {
                if (min(mean_temp) > -38) {
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
            else if (mean_temp.filter(m => m >= 10).length >= 4) {
                res.value += "b"; // Warm summer not (a) and at least 4 Tmon ≥ +10 ◦C
                res.result += "; b - Warm summer";
            }
            else if (mean_temp.filter(m => m < 10).length <= 3) {
                if (min(mean_temp) > -38) {
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
    description: "Köppen’s classification is based on a subdivision of terrestrial climates into five major types, which are represented by the capital letters A, B, C, D, and E. Each of these climate types except for B is defined by temperature criteria. Type B designates climates in which the controlling factor on vegetation is dryness (rather than coldness). Aridity is not a matter of precipitation alone but is defined by the relationship between the precipitation input to the soil in which the plants grow and the evaporative losses. Since evaporation is difficult to evaluate and is not a conventional measurement at meteorological stations, Köppen was forced to substitute a formula that identifies aridity in terms of a temperature-precipitation index (that is, evaporation is assumed to be controlled by temperature). Dry climates are divided into arid (BW) and semiarid (BS) subtypes, and each may be differentiated further by adding a third code, h for warm and k for cold.",
    title: "Köppen’s climate classification formula"
}

exports.langsRainfallFactor = {
    calculate: function (perc, mean_temp) {
        //izračunaj prosjek
        const annualPerc = sum(perc);
        const meanTemp = average(mean_temp);

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
    title: "Lang’s rainfall factor [LRF]",
    description: "Lang’s rainfall factor expresses natural irrigation conditions of landscape by the relationship between rainfalls and air temperature (Equation 2) (Sobisek 1993): f = R / t  -> where  f = Lang’s rainfall factor, R = average annual rainfall sum in mm, and t = average annual air temperature in °C"
}

exports.thermicCharacterGracanin = {
    calculate: function (temp_value) {
        const res = {
            value: null,
            result: ""
        }

        if (temp_value < 0.5) {
            res.value = "n";
            res.result = "nivalno";
        }
        else if (temp_value < 4) {
            res.value = "h";
            res.result = "hladno";
        }
        else if (temp_value < 8) {
            res.value = "uhl";
            res.result = "umjereno hladno";
        }
        else if (temp_value < 12) {
            res.value = "ut";
            res.result = "umjereno toplo";
        }
        else if (temp_value < 20) {
            res.value = "t";
            res.result = "toplo";
        }
        else {
            res.value = "v";
            res.result = "vruće";
        }

        return res;
    },
    title: "Toplinski karakter klime po Gračaninu",
    description: "Toplinski karakter klime po Gračaninu"
}

exports.thornthwaitePET = {
    calculate: function (mean_temps, lat, lon, year_from = 0, year_to = 0) {
        if (year_from === 0) year_from = new Date().getFullYear();
        if (year_to === 0) year_to = new Date().getFullYear();
        let I = 0;
        for (let m = 1; m <= 12; m++) {
            if (mean_temps[m - 1] > 0) {
                I += Math.pow(mean_temps[m - 1] / 5, 1.514);
            }
        }
        const a = 0.000000675 * Math.pow(I, 3) - 0.0000771 * Math.pow(I, 2) + 0.01792 * I + 0.49239;
        const pe_monthly = [];
        for (let m = 1; m <= 12; m++) {
            let pe = 0;
            if (mean_temps[m - 1] > 0) {
                const korektFakt = (MoonSunCalc.getAverageDaylight(m, year_from, year_to, lat, lon) / 12) * (new Date(2000, m - 1, 0).getDate() / 30);
                pe = (16 * Math.pow(10 * mean_temps[m - 1] / I, a)) * korektFakt;
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
    title: "Thornthwaite potential evapotranspiration [PET]",
    description: "Thornthwaite equation (1948). Potential evaporation (PE) or potential evapotranspiration (PET) is defined as the amount of evaporation that would occure if a sufficient water source were available"
}

exports.thornthwaiteWaterBalance = {
    calculate: function (percs, thornthwaite_pet_monthly) {
        const vodna_bilanca = [];
        for (let m = 0; m < percs.length; m++) {
            vodna_bilanca.push(round(percs[m] - thornthwaite_pet_monthly[m], 2));
        }
        return {
            value: round(sum(vodna_bilanca), 2),
            result: vodna_bilanca,
        }
    },
    title: "Thornthwaite water balance",
    formulaDescription: "Vodna bilanca (vodni suficit/deficit) s obzirom na potencijalnu evapotranspiraciju"
}

exports.thornthwaitePercipitationEfficiency = {
    calculate: function (percs, mean_temps) {
        let d = 0;
        for (let m = 1; m <= 12; m++) {
            d += 1.65 * Math.pow(percs[m - 1] / (mean_temps[m - 1] + 12.2), 10.0 / 9.0);
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
    title: "Thornthwaite percipitation efficiency",
    description: "Indeks djelotvornosti oborina po Thorntwaitu"
}

exports.continentalityIndex = {
    calculate: function (mean_temps) {
        const tmin = min(mean_temps);
        const tmax = max(mean_temps);
        const res = tmax - tmin;
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
    title: "Continentality index [CONTINENTY]",
    description: "Continentality index [CONTINENTY]: Tmax - Tmin (Tmax - mean air temperature of the hottest month [°C], Tmin - mean air temperature of the coldest month [°C])"
}

// template
// exports. = {
//     calculate: function(){

//     },
//     title: "",
//     description: ""
// }

exports.ombrothermicIndex = {
    calculate: function (mean_temps, percs) {
        const t = [], p = [];
        for (let i = 0; i < mean_temps.length; i++) {
            if (mean_temps[i] > 0) {
                t.push(mean_temps[i]);
                p.push(percs[i]);
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
    title: "Ombrothermic Index [Io]",
    description: "Rivas-Martinez et al. 2011."
}

exports.ombrothermicIndexSummerQuarter = {
    calculate: function (mean_temps, percs) {
        const t = [], p = [];
        for (let i = 0; i < mean_temps.length; i++) {
            if (i >= 5 && i <= 7) { //lip, srp, kol
                t.push(mean_temps[i]);
                p.push(percs[i]);
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
    title: "Ombrothermic index of the summer quarter [Iosq]",
    description: "Rasztovits et al. 2012."
}

exports.thermicityIndex = {
    calculate: function (mean_temp) {
        const T = average(mean_temp);
        const m = min(mean_temp);
        const M = max(mean_temp);
        const res = round((T + m + M) * 10);

        return {
            value: res,
            result: res.toFixed()
        }
    },
    title: "Thermicity Index [It]",
    description: "Rasztovits et al. 2012."
}

exports.ombroEvapotranspirationIndex = {
    calculate: function (mean_temps, percs, lat, lon, year_from = 0, year_to = 0) {
        const pet = exports.thornthwaitePET.calculate(mean_temps, lat, lon, year_from, year_to).value;
        const annualPerc = sum(percs);
        const res = round(annualPerc / pet, 2);

        return {
            value: res,
            result: res.toFixed(2)
        }
    },
    title: "Ombro-evapotranspiration index [Ioe]",
    description: "Rivas-Martinez et al. 2011."
}

exports.drySeasonWaterDeficit = {
    calculate: function (mean_temps, percs, lat, lon, year_from = 0, year_to = 0) {
        const resArr = [];
        for (let i = 0; i < percs.length; i++) {
            if (mean_temps[i] > 0) {
                const pet = exports.thornthwaitePET.calculate(mean_temps, lat, lon, year_from, year_to);
                resArr.push(round(percs[i] - pet.result[i], 2));
            }
            else {
                resArr.push(0);
            }
        }
        return {
            value: resArr,
            result: JSON.stringify(resArr)
        }
    },
    title: "Dry season water deficit [DSWD]",
    description: "Dufour-Dror and Ertas 2004."
}

exports.drySeasonDuration = {
    calculate: function (mean_temps, percs) {
        let res = 0;
        const resArr = [];
        for (let i = 0; i < 12; i++) {
            const t = mean_temps[i];
            const p = percs[i];
            resArr.push(round(p - 2 * t, 2));
            if (p <= 2 * t) {
                res++;
            }
        }
        return {
            value: res,
            result: resArr
        }
    },
    title: "Duration of the dry season [LDS]",
    description: "Gausen 1954., UNESCO 1963"
}

exports.rainfallAnomalyIndex = {
    calculate: function (percs) {
        let low = [...percs];
        low.sort((a, b) => a - b);
        low = low.slice(0, 10);
        let high = [...percs]
        high.sort((a, b) => b - a);
        high = high.slice(0, 10);
 
        const p_avg = round(average(percs), 2);
        const high_avg = round(average(high), 2);
        const low_avg = round(average(low), 2);
        console.log(p_avg, high_avg, low_avg);

        const res = [];
        for (const p of percs) {
            const anom = p - p_avg;
            let ind;
            if (anom < 0) {
                ind = -3 * (anom / (low_avg - p_avg));
                //ind = -3 * anom / (high_avg - p_avg);
            }
            else {
                ind = 3 * anom / (high_avg - p_avg);
            }
            res.push(round(ind, 2));
        }

        return {
            value: round(average(res), 2),
            result: res
        }

    },
    title: "Rainfall Anomaly Index [RAI]",
    description: "RAI (Rainfall Anomaly Index) is an incorporation of ranking procedure to assign magnitudes to positive and negative precipitation anomalies"
}