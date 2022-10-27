const { round, average, sum, max, min } = require("./mathUtils");

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