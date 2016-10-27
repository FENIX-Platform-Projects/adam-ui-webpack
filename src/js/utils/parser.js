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

        var topic = arry[arry.length - 2];
        var lang = arry[arry.length - 1];


        var parsedParams = {
            context: parser.pathname,
            lang: lang,
            browse_type: topic
        };

        return parsedParams;
    }

    return Parser;

});


