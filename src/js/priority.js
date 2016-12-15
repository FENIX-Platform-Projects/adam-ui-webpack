define([
   'loglevel',
    'jquery',
    'underscore',
    'config/config-base',
    'utils/parser',
    'priority/priority-view'
], function (log, $, _, Config, Parser, PriorityView) {

    'use strict';

    var s = {
       CONTAINER: '#priority'
    };


    function Priority() {
        console.clear();

        this._importThirdPartyCss();

        this.start();
    }


    Priority.prototype.start = function () {

        // client parameters
        var lang = $("html").attr("lang") || Config.LANG;

        var pParams = {lang: lang, el: s.CONTAINER};

        this._createPriorityView(pParams);
    };


    Priority.prototype.getRequestParameters = function (url) {
        var parser = new Parser();
        return parser.parseURL(url);
    };

    Priority.prototype._createPriorityView = function (params) {

        var view = new PriorityView(
            $.extend(true, params, {
                environment: Config.ENVIRONMENT
            }));

        return view;
    };

    Priority.prototype._importThirdPartyCss = function () {

        //SANDBOXED BOOTSTRAP
        require("css/sandboxed-bootstrap.css");

        //dropdown selector
         require("node_modules/selectize/dist/css/selectize.bootstrap3.css");

        // fenix-ui-filter
        require("node_modules/fenix-ui-filter/dist/fenix-ui-filter.min.css");

        // INDEX
        require("css/adam.css");

    };

    return new Priority();

});