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

        return nums.reduce((a, b) => Math.max(a, b), -Infinity);
    }
    return nums;
}


exports.min = function (nums) {
    if (Array.isArray(nums)) {
        return nums.reduce((a, b) => Math.min(a, b), Infinity);
    }
    return nums;
}