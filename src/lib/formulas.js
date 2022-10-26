exports.round = function (num, places) {
    const multiplier = Number("1" + "0".repeat(places));
    if (places > 0) {
        return Math.round(num * multiplier + Number.EPSILON) / multiplier;
    }
    else {
        return Math.round(num);
    }
}

exports.aridityIndexDeMartonne = function (annual_perc, annual_mean_temp) {

    //ako nije array pretvori u array sa jednim članom (dakle radi se već o prosjecima)
    if (!Array.isArray(annual_perc)) {
        annual_perc = [annual_perc];
    }
    if (!Array.isArray(annual_mean_temp)) {
        annual_mean_temp = [annual_mean_temp];
    }

    //izračunaj prosjek
    const annualPerc = annual_perc.reduce((a, b) => a + b, 0);
    const meanTemp = annual_mean_temp.reduce((a, b) => a + b, 0) / annual_mean_temp.length;

    // console.log(annualPerc, meanTemp);
    //result
    const res = {
        value: null,
        result: "",
        formulaDescription: "The De Martonne (1926) aridity index (Am): Am = P / (T + 10), where P (cm) is the annual precipitation and T (°C) the annual mean temperature."
    }

    //result description
    res.value = Math.abs(exports.round(annualPerc / (meanTemp + 10), 2));
    if (res.value <= 20) {
        res.result = "aridno";
    }
    else {
        res.result = "humidno";
    }

    return res;
}

exports.aridityIndexGracanin = function (perc, temp) {

    //ako nije array pretvori u array sa jednim članom (dakle radi se već o prosjecima)
    if (!Array.isArray(perc)) {
        perc = [perc];
    }
    if (!Array.isArray(temp)) {
        temp = [temp];
    }

    //izračunaj prosjek
    const annualPerc = perc.reduce((a, b) => a + b, 0);
    const meanTemp = temp.reduce((a, b) => a + b, 0) / temp.length;

    // console.log(annualPerc, meanTemp);
    //result
    const res = {
        value: null,
        result: "",
        formulaDescription: "Indeks mjesečne aridnosti prema Gračaninu (Pm - srednja mjesečna količina oborina, Tm - srenja mjesečna temperatura)"
    }

    //result description
    res.value = Math.abs(exports.round(annualPerc / meanTemp, 1));
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

