define([
   'loglevel',
    'jquery',
    'underscore',
    'config/config-base',
    'utils/parser',
    'partner-matrix/partner-matrix-view'
], function (log, $, _, Config, Parser, PartnerMatrixView) {

    'use strict';

    var s = {
       CONTAINER: '#partner-matrix'
    };


    function PartnerMatrix() {
        console.clear();

        this._importThirdPartyCss();

        this.start();
    }


    PartnerMatrix.prototype.start = function () {

        // client parameters
        var lang = $("html").attr("lang") || Config.LANG;

        var pParams = {lang: lang, el: s.CONTAINER};

        this._createPartnerMatrixView(pParams);
    };


    PartnerMatrix.prototype.getRequestParameters = function (url) {
        var parser = new Parser();
        return parser.parseURL(url);
    };

    PartnerMatrix.prototype._createPartnerMatrixView = function (params) {

        var view = new PartnerMatrixView(
            $.extend(true, params, {
                environment: Config.ENVIRONMENT
            }));

        return view;
    };

    PartnerMatrix.prototype._importThirdPartyCss = function () {

        //SANDBOXED BOOTSTRAP
        require("css/sandboxed-bootstrap.css");

        //dropdown selector
         require("node_modules/selectize/dist/css/selectize.bootstrap3.css");

        // bootstrap-table
        require("node_modules/bootstrap-table/dist/bootstrap-table.css");

        // fenix-ui-filter
        require("node_modules/fenix-ui-filter/dist/fenix-ui-filter.min.css");

        // fenix-ui-table-creator
        require("node_modules/fenix-ui-table-creator/dist/fenix-ui-table-creator.min.css");

        // INDEX
        require("css/adam.css");

    };

    return new PartnerMatrix();

});