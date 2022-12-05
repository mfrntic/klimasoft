const round = function (num, places) {
    const multiplier = Number("1" + "0".repeat(places));
    if (places > 0) {
        return Math.round(num * multiplier + Number.EPSILON) / multiplier;
    }
    else {
        return Math.round(num);
    }
}

const sum = function (nums) {
    if (Array.isArray(nums)) {
        return nums.reduce((a, b) => a + b, 0);
    }
    return nums;
}

const average = function (nums) {
    if (Array.isArray(nums)) {
        return sum(nums) / nums.length;
    }
    return nums;
}

const max = function (nums) {
    if (Array.isArray(nums)) {

        return nums.filter(a => !isNaN(a)).reduce((a, b) => Math.max(a, b), -Infinity);
    }
    return nums;
}

const min = function (nums) {
    if (Array.isArray(nums)) {

        return nums.filter(a => !isNaN(a)).reduce((a, b) => {
            return Math.min(a, b)
        }, Infinity);
    }
    return nums;
}

const stdev = function (nums) {
    let mean = average(nums);

    // Assigning (value - mean) ^ 2 to every array item
    nums = nums.map((k) => {
        return (k - mean) ** 2
    })

    // Calculating the sum of updated array
    let s = sum(nums);

    // Returning the Standered deviation
    return Math.sqrt(s / nums.length)
}

const variance = function (nums) {
    let mean = average(nums);

    // Assigning (value - mean) ^ 2 to every array item
    nums = nums.map((k) => {
        return (k - mean) ** 2
    })

    // Calculating the sum of updated array
    let s = sum(nums);

    // Calculating the variance
    let variance = s / nums.length
    return variance;
}

const calculate = function (month_matrix, calc_month = 0, calc_type = "sum", round_digits = 2) {

    if (!Array.isArray(month_matrix)) return null;

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
            return round(average(resarr), round_digits);
        case "minimum":
        case "min":
            return round(min(resarr), round_digits);
        case "maximum":
        case "max":
            return round(max(resarr), round_digits);
        case "count":
        case "cnt":
            return resarr.length;
        case "stdev":
            return round(stdev(resarr), round_digits);
        case "variance":
            return round(variance(resarr), round_digits);
        default:
            //sum
            return round(sum(resarr), round_digits);
    }
}

const describe = function (month_matrix, calc_type = "all", full_row = true) {
    let calcTypes = ["count", "sum", "avg", "min", "max", "variance", "stdev"];
    const calcTypesFiltered = calcTypes.filter(a => a === calc_type);
    if (calcTypesFiltered.length > 0) {
        calcTypes = calcTypesFiltered;
    }
    const res = [];

    for (const ctype of calcTypes) {
        const row = [];
        if (full_row) {
            row.push(ctype);
        }
        for (let m = 1; m <= 12; m++) {
            row.push(calculate(month_matrix, m, ctype));
        }
        if (full_row) {
            row.push(calculate(month_matrix, 0, ctype)); //cijela godina na kraju
        }
        res.push(row);
    }

    return res;
}

export {round, sum, average, max, min, stdev, variance, calculate, describe};