define([
    'loglevel',
    'jquery',
    'underscore',
    'config/config-base',
    'utils/parser',
    'browse/index'
], function (log, $, _, Config, Parser, BrowseByView) {

    'use strict';

    var s = {
        url: 'http://www-test.fao.org/adam/browse-data/country/en'
    };


    function Browse() {
        console.clear();

        this._importThirdPartyCss();

       // log.setLevel('trace');

        this.start();
    }

    Browse.prototype.start = function () {

      //  log.trace("Start");

        // client parameters
        var params =  this.getRequestParameters();
        var lang = Config.LANG,  browse_type =  Config.DEFAULT_BROWSE_SECTION;

      //  log.info("Request Params ", params);
        // validate parameters
        if(params) {
            lang = params.lang || lang;
            browse_type = $.inArray(params.browse_type, Config.BROWSE_SECTIONS) > -1 ? params.browse_type : browse_type;
        }
        var params = {lang: lang, browse_type: browse_type};
       // log.info("Validated Request Params ", params);

        var browseByView = this._createBrowseByView(params);
    };


    Browse.prototype.getRequestParameters = function () {
        var parser = new Parser();
        //var url = window.location.href;
         return parser.parseURL(s.url);
    };

    Browse.prototype._createBrowseByView = function (params) {

        var view = new BrowseByView(
            $.extend(true, params, {
                environment: Config.ENVIRONMENT,
                el : '#browse'
            }));

        return view;
    };

    Browse.prototype._importThirdPartyCss = function () {
        //Bootstrap
        // require("bootstrap-loader");

        //dropdown selector
         require("node_modules/selectize/dist/css/selectize.bootstrap3.css");

        //bootstrap
        require("node_modules/bootstrap/dist/css/bootstrap.min.css");

        // fenix-ui-filter
        require("node_modules/fenix-ui-filter/dist/fenix-ui-filter.min.css");

        // map
        require("node_modules/fenix-ui-map/dist/fenix-ui-map.min.css");
        require("node_modules/leaflet/dist/leaflet.css");

        // INDEX
        //require("dist/css/index.css");
        require("css/index.css");

    };

    return new Browse();

});