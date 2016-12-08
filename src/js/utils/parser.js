/*global define, requirejs*/
define(['underscore'
], function (_) {

    'use strict';

    function Parser() {
        return this;
    }

    Parser.prototype.parseURL = function (url) {

        var parser = document.createElement('a');

        parser.href = url;

        var name = parser.pathname;
        var pArry = name.split('/');
        var arry = _.filter(pArry, Boolean); /// remove the empty strings

        var domain = arry[arry.length - 2];

        var parsedParams = {
            context: parser.pathname,
            domain: domain
        };

        return parsedParams;
    }

    return Parser;

});


