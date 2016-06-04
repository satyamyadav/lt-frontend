var range = module.exports = function (start, end) {
    var range = []
    for (var i=start; i<=end; i++) {
        range.push(i);
    }

    return range;
};