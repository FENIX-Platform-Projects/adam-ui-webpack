define([
   'loglevel',
    'jquery',
    'underscore',
    'config/config-base',
    'utils/parser',
    'partner-matrix/partner-matrix-view'
], function (log, $, _, Config, Parser, PartnerMatrix) {

    'use strict';

    var s = {
       CONTAINER: '#partner-matrix'
    };


    function PartnerMatrixView() {
        console.clear();

        this._importThirdPartyCss();

        this.start();
    }


    PartnerMatrixView.prototype.start = function () {

        // client parameters
        var lang = $("html").attr("lang") || Config.LANG;

        var pParams = {lang: lang, el: s.CONTAINER};

        this._createPartnerMatrixView(pParams);
    };


    PartnerMatrixView.prototype.getRequestParameters = function (url) {
        var parser = new Parser();
        return parser.parseURL(url);
    };

    PartnerMatrixView.prototype._createPartnerMatrixView = function (params) {

        var view = new PartnerMatrix(
            $.extend(true, params, {
                environment: Config.ENVIRONMENT
            }));

        return view;
    };

    PartnerMatrixView.prototype._importThirdPartyCss = function () {

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

    return new PartnerMatrixView();

});