/*global define, amplify*/
define([
    'jquery',
    'loglevel',
    'underscore',
    'fenix-ui-filter-utils',
    'html/partner-profiles/partner-profiles.hbs',
    'nls/compare',
    'nls/browse-dashboard',
    'nls/filter',
    'nls/errors',
    'config/events',
    'config/config-base',
    'config/partner-profiles/config',
    'fenix-ui-filter',
    'fenix-ui-dashboard',
    'highcharts',
    'amplify-pubsub'
], function ($, log, _, FxUtils, template,
             i18nLabels, i18nDashboardLabels, i18nFilter, i18nErrors,
             E, GC, Config, Filter, Dashboard, Highcharts, amplify) {

    'use strict';

    var s = {
        FILTER: "#filter-partner-profiles",
        DASHBOARD: "#partner-profiles-dashboard-content",
        DOWNLOAD_BTN: "#download-btn"
    };

    function ProfilesView(o) {

        $.extend(true, this, o);

        this._parseInput(o);

        var valid = this._validateInput();

        if (valid === true) {

            this._dispose();

            this._attach();

            this._initVariables();

            this._initComponents();

            this._bindEventListeners();

            return this;

        } else {
            log.error("Impossible to create Compare By View");
            log.error(valid)
        }
    }

    ProfilesView.prototype._parseInput = function (params) {
        this.$el = $(this.el);
        this.lang = params.lang.toLowerCase() || GC.LANG.toLowerCase();
        this.environment = params.environment || GC.ENVIRONMENT;
        this.browse_type = params.browse_type;
    };

    ProfilesView.prototype._validateInput = function () {

        var valid = true,
            errors = [];

        //Check if $el exist
        if (this.$el.length === 0) {
            errors.push({code: E.MISSING_CONTAINER});
            log.warn("Impossible to find browse by container");
        }

        return errors.length > 0 ? errors : valid;
    };

    ProfilesView.prototype._attach = function () {

        this.template = template(i18nLabels[this.lang], i18nDashboardLabels[this.lang]);

        this.$el.append(this.template);
    };

    ProfilesView.prototype._initVariables = function () {
        this.$addBnt = this.$el.find(s.DOWNLOAD_BTN);
        this.readyComponents = 0;

    };

    ProfilesView.prototype._bindEventListeners = function () {

        this.filter.on("ready", _.bind(this._onFilterChange, this));

        this.filter.on("select", _.bind(this._onFilterChange, this));
    };

    ProfilesView.prototype._onComponentReady = function () {

       this.$addBnt.on("click", _.bind(this.onDownloadMenuClick, this));


        //this.readyComponents++;

        //if (this.readyComponents === 2) {
          //  this.$addBnt.prop('disabled', false);
        //}
    };

    ProfilesView.prototype._onFilterChange = function () {
        var dashboardConfig = $.extend(true, {}, Config.dashboard, {
            el: this.$el.find(s.DASHBOARD),
            environment: GC.ENVIRONMENT,
            cache: GC.cache
        });
        dashboardConfig.filter = this.filter.getValues();
        this.dashboard = new Dashboard(dashboardConfig);
        this.dashboard.on("ready", _.bind(this._onComponentReady, this));



    };

    ProfilesView.prototype.onDownloadMenuClick = function () {

        var models = ['top-sectors', 'tot-oda-fao'];

        for(var i in models){

            var $chartCont =  $("div[data-item='"+models[i]+"']");

            //console.log(models[i]);
            //console.log($chartCont);
           //console.log($chartCont.data('highchartsChart'));

            var chart = Highcharts.charts[$chartCont.data('highchartsChart')];

           // console.log(chart);


            chart.exportChart({
                type: 'image/png',
                filename: models[i]
            });

        }

    };

    ProfilesView.prototype._initComponents = function () {

        var self = this;

        var filterConfig = $.extend(true, {}, Config.filter, {
                el: this.$el.find(s.FILTER),
                selectors:Config.filter,
                environment: GC.ENVIRONMENT,
                cache: GC.cache
            });


        _.each(filterConfig.selectors, function (value, key) {
            if (!value.template) {
                value.template = {};
            }
            value.template.title = i18nFilter[self.lang]["filter_" + key];
            value.template.headerIconTooltip = i18nFilter[self.lang]["filter_tooltip_" + key];
        });

        this.filter = new Filter(filterConfig);

        //this.dashboard = new Dashboard(dashboardConfig);

    };

    ProfilesView.prototype._unbindEventListeners = function () {

        if (this.$addBnt) {
            this.$addBnt.off();
        }

    };

    ProfilesView.prototype._dispose = function () {

        this._unbindEventListeners();

        if (this.filter && $.isFunction(this.filter.dispose)) {
            this.filter.dispose();
        }

        if (this.dashboard && $.isFunction(this.dashboard.dispose)) {
            this.dashboard.dispose();
        }
    };

    return ProfilesView;
});
