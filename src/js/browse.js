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
        url: 'http://www-test.fao.org/adam/browse-data/donor/en',
        CONTAINER: '#browse'
    };


    function Browse() {
        console.clear();

        this._importThirdPartyCss();

        this.start();
    }


    Browse.prototype.start = function () {

       var url = window.location.href;
       //var url = s.url;

        // client parameters
        var params = this.getRequestParameters(url),
            lang = $("html").attr("lang") || Config.LANG,
            browse_type = Config.DEFAULT_BROWSE_SECTION;


        if(params && params.domain) {
            browse_type = $.inArray(params.domain, Config.BROWSE_SECTIONS) > -1 ? params.domain : Config.DEFAULT_BROWSE_SECTION;
        }

        var browseParams = {lang: lang, browse_type: browse_type, el: s.CONTAINER};

        this._createBrowseByView(browseParams);
    };


    Browse.prototype.getRequestParameters = function (url) {
        var parser = new Parser();
        return parser.parseURL(url);
    };

    Browse.prototype._createBrowseByView = function (params) {

        var view = new BrowseByView(
            $.extend(true, params, {
                environment: Config.ENVIRONMENT
            }));

        return view;
    };

    Browse.prototype._importThirdPartyCss = function () {

        //SANDBOXED BOOTSTRAP
        require("css/sandboxed-bootstrap.css");


        //dropdown selector
         require("node_modules/selectize/dist/css/selectize.bootstrap3.css");


        // fenix-ui-filter
        require("node_modules/fenix-ui-filter/dist/fenix-ui-filter.min.css");

        // map
        require("node_modules/fenix-ui-map/dist/fenix-ui-map.min.css");
        require("node_modules/leaflet/dist/leaflet.css");

        // INDEX
        require("css/adam.css");

    };

    return new Browse();

});