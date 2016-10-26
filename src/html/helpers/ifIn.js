module.exports = function (value, property, list, options) {
    console.log(value, property, list, options);

    var subcontext = [], result = list.filter(function( obj ) {
        console.log(obj[property] + ' - ' + value);
        return obj[property] === value;
    });

    console.log(result);

    if(result.length > 0)
        subcontext.push(result[0]);


    console.log(subcontext);


    //console.log(subcontext[0]);

    return options.fn(subcontext);
   // return subcontext[0];//options.fn(subcontext);
};
