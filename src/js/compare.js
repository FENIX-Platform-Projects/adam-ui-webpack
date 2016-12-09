define([
   'loglevel',
    'jquery',
    'underscore',
    'config/config-base',
    'utils/parser',
    'compare/compare-view'
], function (log, $, _, Config, Parser, CompareView) {

    'use strict';

    var s = {
        url: 'http://www-test.fao.org/adam/analyse/compare/en',
        CONTAINER: '#compare'
    };


    function Compare() {
        console.clear();

        this._importThirdPartyCss();

        this.start();
    }


    Compare.prototype.start = function () {

       //var url = window.location.href;
       var url = s.url;

        // client parameters
        var params = this.getRequestParameters(url),
            lang = $("html").attr("lang") || Config.LANG,
            browse_type = Config.DEFAULT_BROWSE_SECTION;


        if(params && params.domain) {
            browse_type = $.inArray(params.domain, Config.BROWSE_SECTIONS) > -1 ? params.domain : Config.DEFAULT_BROWSE_SECTION;
        }

        var browseParams = {lang: lang, browse_type: browse_type, el: s.CONTAINER};

        this._createCompareView(browseParams);
    };


    Compare.prototype.getRequestParameters = function (url) {
        var parser = new Parser();
        return parser.parseURL(url);
    };

    Compare.prototype._createCompareView = function (params) {

        var view = new CompareView(
            $.extend(true, params, {
                environment: Config.ENVIRONMENT
            }));

        return view;
    };

    Compare.prototype._importThirdPartyCss = function () {

        //SANDBOXED BOOTSTRAP
        require("css/sandboxed-bootstrap.css");

        //dropdown selector
         require("node_modules/selectize/dist/css/selectize.bootstrap3.css");

        // fenix-ui-filter
        require("node_modules/fenix-ui-filter/dist/fenix-ui-filter.min.css");

        // fenix-ui-analysis
        require("node_modules/fenix-ui-analysis/dist/fenix-ui-analysis.min.css");

        //tree selector
        require("node_modules/jstree/dist/themes/default/style.min.css");

        // fenix-ui-visualization-box
        require("node_modules/fenix-ui-visualization-box/dist/fenix-ui-visualization-box.min.css");

        // fenix-ui-table-creator
        require("node_modules/fenix-ui-table-creator/dist/fenix-ui-table-creator.min.css");

        // jquery-grid for fenix-ui-metadata-viewer
        require("node_modules/jquery-treegrid-webpack/css/jquery.treegrid.css");

        // iDangerous swiper
        require("node_modules/swiper/dist/css/swiper.min.css");

        // INDEX
        require("css/adam.css");

    };

    return new Compare();

});