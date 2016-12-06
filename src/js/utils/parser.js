/*global define, requirejs*/
define([
], function () {

    'use strict';

    function Parser() {
        return this;
    }

    Parser.prototype.parseURL = function (url) {

        var parser = document.createElement('a');

        parser.href = url;

        var name = parser.pathname;
        var arry = name.split('/');

        var domain = arry[arry.length - 2];

        var parsedParams = {
            context: parser.pathname,
            domain: domain
        };

        return parsedParams;
    }

    return Parser;

});


