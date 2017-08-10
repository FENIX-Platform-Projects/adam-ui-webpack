define([
   'loglevel',
    'jquery',
    'underscore',
    'config/config-base',
    'utils/parser',
    'projects/projects-view'
], function (log, $, _, Config, Parser, ProjectsView) {

    'use strict';

    var s = {
       CONTAINER: '#projects'
    };


    function ProjectAnalysis() {
        console.clear();

        this._importThirdPartyCss();

        this.start();
    }


    ProjectAnalysis.prototype.start = function () {

        // client parameters
        var lang = $("html").attr("lang") || Config.LANG;

        var pParams = {lang: lang, el: s.CONTAINER};

        this._createProjectsView(pParams);
    };


    ProjectAnalysis.prototype.getRequestParameters = function (url) {
        var parser = new Parser();
        return parser.parseURL(url);
    };

    ProjectAnalysis.prototype._createProjectsView = function (params) {

        var view = new ProjectsView(
            $.extend(true, params, {
                environment: Config.ENVIRONMENT
            }));

        return view;
    };

    ProjectAnalysis.prototype._importThirdPartyCss = function () {

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

    return new ProjectAnalysis();

});