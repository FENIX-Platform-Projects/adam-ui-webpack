module.exports = function (value, property, list, options) {

    var subcontext = [], result = list.filter(function( obj ) {
        return obj[property] === value;
    });

    if(result.length > 0)
        subcontext.push(result[0]);

    return options.fn(subcontext);
};
