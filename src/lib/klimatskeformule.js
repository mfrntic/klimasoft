const { round, average, sum, max, min } = require("./mathUtils");
const MoonSunCalc = require("./moonsuncalc");

exports.aridityIndexDeMartonne = function (perc, mean_temp) {

    //izračunaj prosjek
    const annualPerc = sum(perc);
    const meanTemp = average(mean_temp);

    // console.log(annualPerc, meanTemp);
    //result
    const res = {
        value: null,
        result: "",
        formulaDescription: "The De Martonne (1926) aridity index (Am): Am = P / (T + 10), where P (cm) is the annual precipitation and T (°C) the annual mean temperature."
    }

    //result description
    res.value = Math.abs(round(annualPerc / (meanTemp + 10), 2));
    if (res.value <= 20) {
        res.result = "aridno";
    }
    else {
        res.result = "humidno";
    }

    return res;
}

exports.aridityIndexGracanin = function (perc, mean_temp) {

    //izračunaj prosjek
    const annualPerc = sum(perc);
    const meanTemp = average(mean_temp);

    // console.log(annualPerc, meanTemp);
    //result
    const res = {
        value: null,
        result: "",
        formulaDescription: "Indeks mjesečne aridnosti prema Gračaninu (Pm - srednja mjesečna količina oborina, Tm - srenja mjesečna temperatura)"
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
}

exports.ellenbergCQ = function (perc, mean_temp) {

    //izračunaj prosjek
    const annualPerc = sum(perc);
    const temp = max(mean_temp);

    //result
    const res = {
        value: null,
        result: "",
        formulaDescription: "Računanje Ellenbergovog klimatskog kvocjenta (EQ = T_warmest_month / AnnualPercipitation * 1000)"
    }

    res.value = round(temp / annualPerc * 1000, 2);
    res.result = res.value.toString();

    return res;
}

exports.embergerPluviotermicQuotient = function (perc, mean_temp) {
    //izračunaj prosjek
    const annualPerc = sum(perc);
    const temp_max = max(mean_temp);
    const temp_min = min(mean_temp);

    //result
    const res = {
        value: null,
        result: "",
        formulaDescription: "Računanje Embergerovog pluviotermičkog kvocjenta (Pg = Srednja godišnja količina padalina, Mmax = srednja maksimalna temperatura najtoplijeg mjeseca, Mmin = srednja minimalna temp. najhladnijeg mjeseca)"
    }

    res.value = round(annualPerc / (Math.pow(temp_max, 2) - Math.pow(temp_min, 2)) * 100, 2);
    res.result = res.value.toString();

    return res;
}

exports.indexOfContinentality = function (lat, ampl) {
    const res = {
        value: null,
        result: "",
        formulaDescription: "An index of continentality, or coefficient of continentality, k, has been formulated by V. Conrad as follows: k = 1.7 * Temp_Amplitude / sin(Latitude + 10) - 14"
    }
    res.value = round(1.7 * ampl / Math.sin((lat + 10) * Math.PI / 180) - 14, 2);
    if (res.value <= 33) {
        res.result = "prijelazna maritimna klima";
    }
    else if (res.value < 67) {
        res.result = "kontinentalna klima";
    }
    else {
        res.result = "ekstremno kontinentalna klima"
    }

    return res;
}

exports.koppenClimateFormula = function (perc, mean_temp, lat, lon) {

    const res = {
        value: null,
        result: "",
        formulaDescription: "Köppen’s classification is based on a subdivision of terrestrial climates into five major types, which are represented by the capital letters A, B, C, D, and E. Each of these climate types except for B is defined by temperature criteria. Type B designates climates in which the controlling factor on vegetation is dryness (rather than coldness). Aridity is not a matter of precipitation alone but is defined by the relationship between the precipitation input to the soil in which the plants grow and the evaporative losses. Since evaporation is difficult to evaluate and is not a conventional measurement at meteorological stations, Köppen was forced to substitute a formula that identifies aridity in terms of a temperature-precipitation index (that is, evaporation is assumed to be controlled by temperature). Dry climates are divided into arid (BW) and semiarid (BS) subtypes, and each may be differentiated further by adding a third code, h for warm and k for cold."
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
}

exports.langsRainfallFactor = function (perc, mean_temp) {
    //izračunaj prosjek
    const annualPerc = sum(perc);
    const meanTemp = average(mean_temp);

    // console.log(annualPerc, meanTemp);
    //result
    const res = {
        value: null,
        result: "",
        formulaDescription: "Lang’s rainfall factor expresses natural irrigation conditions of landscape by the relationship between rainfalls and air temperature (Equation 2) (Sobisek 1993): f = R / t  -> where  f = Lang’s rainfall factor, R = average annual rainfall sum in mm, and t = average annual air temperature in °C"
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
}

exports.thermicCharacterGracanin = function (temp_value) {
    const res = {
        value: null,
        result: "",
        formulaDescription: "Toplinski karakter klime po Gračaninu"
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
}

exports.thornthwaitePET = function (mean_temps, lat, lon, year_from = 0, year_to = 0) {
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
        result: pe_monthly,
        formulaDescription: "Thornthwaite equation (1948). Potential evaporation (PE) or potential evapotranspiration (PET) is defined as the amount of evaporation that would occur if a sufficient water source were availablToplinski karakter klime po Gračaninu"
    }
}

exports.thornthwaiteWaterBalance = function (percs, thornthwaite_pet_monthly) {
    const vodna_bilanca = [];
    for (let m = 0; m < percs.length; m++) {
        vodna_bilanca.push(round(percs[m] - thornthwaite_pet_monthly[m], 2));
    }
    return {
        value: round(sum(vodna_bilanca), 2),
        result: vodna_bilanca,
        formulaDescription: "Vodna bilanca (vodni suficit/deficit) s obzirom na potencijalnu evapotranspiraciju"
    }
}

exports.thornthwaitePercipitationEfficiency = function (percs, mean_temps) {
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
        formulaDescription: "Indeks djelotvornosti oborina po Thorntwaitu"
    }
}