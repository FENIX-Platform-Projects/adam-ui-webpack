define([
    'loglevel',
    'jquery',
    'underscore',
    'config/config-base',
    'browse/index'
], function (log, $, _, Config, BrowseByView) {

    'use strict';


    function Browse() {
        console.clear();

        this._importThirdPartyCss();

        log.setLevel('trace');

        this.start();
    }

    Browse.prototype.start = function () {

        log.trace("Start");

        // client parameters
        var params = {browse_type : 'country', el : '#browse', lang: 'en'};

        var browseByView = this._createBrowseByView(params);

    };

    Browse.prototype._createBrowseByView = function (params) {

        var view = new BrowseByView(
            $.extend(true, params, {
                environment: Config.ENVIRONMENT
            }));

        return view;
    };

    Browse.prototype._importThirdPartyCss = function () {
        //Bootstrap
        require("bootstrap-loader");



        //dropdown selector
        require("node_modules/selectize/dist/css/selectize.bootstrap3.css");
        // fenix-ui-filter
        require("node_modules/fenix-ui-filter/dist/fenix-ui-filter.min.css");

        // INDEX
        require("dist/css/index.css");

    };

    return new Browse();

});