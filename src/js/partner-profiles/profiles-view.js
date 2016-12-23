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

    };

    ProfilesView.prototype._bindEventListeners = function () {

        this.filter.on("ready", _.bind(this._onFilterChange, this));

        this.filter.on("select", _.bind(this._onFilterChange, this));
    };



    ProfilesView.prototype._onFilterChange = function () {

        var dashboardConfig = $.extend(true, {}, Config.dashboard, {
            el: this.$el.find(s.DASHBOARD),
            environment: GC.ENVIRONMENT,
            cache: GC.cache
        });

        var donorCode = this.filter.getValues().values.donorcode[0];
        var donorLabel = this.filter.getValues().labels.donorcode[donorCode];
        var fLabel = donorLabel.split(' ').join('').toLowerCase();
        var res = fLabel.substring(0, 7);

        //Update chart export filenames
        $.each(dashboardConfig.items, function( index, item ) {
           item.config.config.exporting.filename = res+"_"+item.config.config.exporting.filename;
        });

        dashboardConfig.filter = this.filter.getValues();
        this.dashboard = new Dashboard(dashboardConfig);

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
