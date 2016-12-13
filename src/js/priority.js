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
        url: 'http://www-test.fao.org/adam/analyse/priority/en',
        CONTAINER: '#priority'
    };


    function Priority() {
        console.clear();

        this._importThirdPartyCss();

        this.start();
    }


    Priority.prototype.start = function () {

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

        this._createPriorityView(browseParams);
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

        // fenix-ui-analysis
        //require("node_modules/fenix-ui-analysis/dist/fenix-ui-analysis.min.css");

        //tree selector
        //require("node_modules/jstree/dist/themes/default/style.min.css");

        // fenix-ui-visualization-box
        //require("node_modules/fenix-ui-visualization-box/dist/fenix-ui-visualization-box.min.css");

        // fenix-ui-table-creator
        //require("node_modules/fenix-ui-table-creator/dist/fenix-ui-table-creator.min.css");

        // fenix-ui-chart-creator
       // require("node_modules/fenix-ui-chart-creator/dist/fenix-ui-chart-creator.min.css");

        // jquery-grid for fenix-ui-metadata-viewer
        //require("node_modules/jquery-treegrid-webpack/css/jquery.treegrid.css");


        // INDEX
        require("css/adam.css");

    };

    return new Priority();

});