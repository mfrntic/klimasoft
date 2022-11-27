exports.round = function (num, places) {
    const multiplier = Number("1" + "0".repeat(places));
    if (places > 0) {
        return Math.round(num * multiplier + Number.EPSILON) / multiplier;
    }
    else {
        return Math.round(num);
    }
}

exports.sum = function (nums) {
    if (Array.isArray(nums)) {
        return nums.reduce((a, b) => a + b, 0);
    }
    return nums;
}

exports.average = function (nums) {
    if (Array.isArray(nums)) {
        return exports.sum(nums) / nums.length;
    }
    return nums;
}

exports.max = function (nums) {
    if (Array.isArray(nums)) {

        return nums.filter(a=>!isNaN(a)).reduce((a, b) => Math.max(a, b), -Infinity);
    }
    return nums;
}

exports.min = function (nums) {
    if (Array.isArray(nums)) {

        return nums.filter(a=>!isNaN(a)).reduce((a, b) => {
            return Math.min(a, b)
        }, Infinity);
    }
    return nums;
}

exports.stdev = function (nums) {
    let mean = exports.average(nums);

    // Assigning (value - mean) ^ 2 to every array item
    nums = nums.map((k) => {
        return (k - mean) ** 2
    })

    // Calculating the sum of updated array
    let sum = exports.sum(nums);

    // Returning the Standered deviation
    return Math.sqrt(sum / nums.length)
}

exports.variance = function (nums) {
    let mean = exports.average(nums);

    // Assigning (value - mean) ^ 2 to every array item
    nums = nums.map((k) => {
        return (k - mean) ** 2
    })

    // Calculating the sum of updated array
    let sum = exports.sum(nums);

    // Calculating the variance
    let variance = sum / nums.length
    return variance;
}

exports.calculate = function (month_matrix, calc_month = 0, calc_type = "sum", round_digits = 2) {
    calc_type = calc_type.toLowerCase().trim();
    //transform month_matrix to something more suitable for calculatinos on columns or rows
    const data = [];
    for (const row of month_matrix) {
        row.forEach((cell, i) => {
            if (i > 0 && !!cell) {
                data.push({
                    label: row[0],
                    month: i,
                    value: cell
                })
            }
        });
    }

    //calc
    let resarr = [];
    if (calc_month) {
        //za određeni mjesec
        resarr = data.filter(a => a.month === calc_month).map(a => a.value);
    }
    else {
        //ukupno
        resarr = data.map(a => a.value);
    }
    if (resarr.length === 0) {
        return 0;
    }

    switch (calc_type) {
        case "average":
        case "avg":
            return exports.round(exports.average(resarr), round_digits);
        case "minimum":
        case "min":
            return exports.round(exports.min(resarr), round_digits);
        case "maximum":
        case "max":
            return exports.round(exports.max(resarr), round_digits);
        case "count":
        case "cnt":
            return resarr.length;
        case "stdev":
            return exports.round(exports.stdev(resarr), round_digits);
        case "variance":
            return exports.round(exports.variance(resarr), round_digits);
        default:
            //sum
            return exports.round(exports.sum(resarr), round_digits);
    }
}

exports.describe = function (month_matrix) {
    const calcTypes = ["count", "sum", "avg", "min", "max", "variance", "stdev"];
    const res = [];

    for (const ctype of calcTypes) {
        const row = [ctype];
        for (let m = 1; m <= 12; m++) {
            row.push(exports.calculate(month_matrix, m, ctype));
        }
        row.push(exports.calculate(month_matrix, 0, ctype)); //cijela godina na kraju
        res.push(row);
    }

    return res;
}