module.exports = function (v1, v2, options) {

    var arry = v2.split(',');

    if ($.inArray( v1, arry) === -1){
        return options.fn(this);
    }

    return options.inverse(this);
};