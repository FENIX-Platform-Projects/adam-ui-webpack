define([
   'loglevel',
    'jquery',
    'underscore',
    'config/config-base',
    'utils/parser',
    'partner-profiles/profiles-view'
], function (log, $, _, Config, Parser, ProfilesView) {

    'use strict';

    var s = {
       CONTAINER: '#partner-profiles'
    };


    function Profiles() {
        console.clear();

        this._importThirdPartyCss();

        this.start();
    }


    Profiles.prototype.start = function () {

        // client parameters
        var lang = $("html").attr("lang") || Config.LANG;

        var pParams = {lang: lang, el: s.CONTAINER};

        this._createProfilesView(pParams);
    };


    Profiles.prototype.getRequestParameters = function (url) {
        var parser = new Parser();
        return parser.parseURL(url);
    };

    Profiles.prototype._createProfilesView = function (params) {

        var view = new ProfilesView(
            $.extend(true, params, {
                environment: Config.ENVIRONMENT
            }));

        return view;
    };

    Profiles.prototype._importThirdPartyCss = function () {

        //SANDBOXED BOOTSTRAP
        require("css/sandboxed-bootstrap.css");


        //dropdown selector
        require("node_modules/selectize/dist/css/selectize.bootstrap3.css");

        // fenix-ui-filter
        require("node_modules/fenix-ui-filter/dist/fenix-ui-filter.min.css");

        // INDEX
        require("css/adam.css");

    };

    return new Profiles();

});