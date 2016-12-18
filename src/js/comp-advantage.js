define([
   'loglevel',
    'jquery',
    'underscore',
    'config/config-base',
    'utils/parser',
    'comp-advantage/comp-advantage-view'
], function (log, $, _, Config, Parser, ComparativeAdvantageView) {

    'use strict';

    var s = {
       CONTAINER: '#comp-advantage'
    };


    function ComparativeAdvantage() {
        console.clear();

        this._importThirdPartyCss();

        this.start();
    }


    ComparativeAdvantage.prototype.start = function () {

        // client parameters
        var lang = $("html").attr("lang") || Config.LANG;

        var pParams = {lang: lang, el: s.CONTAINER};

        this._createCompAdvantageView(pParams);
    };


    ComparativeAdvantage.prototype.getRequestParameters = function (url) {
        var parser = new Parser();
        return parser.parseURL(url);
    };

    ComparativeAdvantage.prototype._createCompAdvantageView = function (params) {

        var view = new ComparativeAdvantageView(
            $.extend(true, params, {
                environment: Config.ENVIRONMENT
            }));

        return view;
    };

    ComparativeAdvantage.prototype._importThirdPartyCss = function () {

        //SANDBOXED BOOTSTRAP
        require("css/sandboxed-bootstrap.css");

        //dropdown selector
         require("node_modules/selectize/dist/css/selectize.bootstrap3.css");

        // fenix-ui-filter
        require("node_modules/fenix-ui-filter/dist/fenix-ui-filter.min.css");

        // fenix-ui-table-creator
        require("node_modules/fenix-ui-table-creator/dist/fenix-ui-table-creator.min.css");

        // INDEX
        require("css/adam.css");

    };

    return new ComparativeAdvantage();

});