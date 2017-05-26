/*global define, amplify*/
define([
    'loglevel',
    'jquery',
    'underscore',
    'html/partner-matrix/charts-dashboard.hbs',
    'fenix-ui-dashboard',
    'utils/utils',
    'config/config-base',
    'config/errors',
    'nls/partner-matrix',
    'nls/chart',
    'nls/common',
    'config/partner-matrix/events',
    'handlebars',
    'config/nodemodules/fenix-ui-chart-creator/highcharts_template',
    'common/progress-bar',
    'partner-matrix/chart-downloader'
], function (log, $, _, template, Dashboard, Utils, BaseConfig, Errors, i18nDashboardLabels, i18nChartLabels, i18nCommonLabels, BaseEvents, Handlebars, HighchartsTemplate, ProgressBar, Downloader) {

    'use strict';

    var s = {
        PROGRESS_BAR_CONTAINER: '#partner-matrix-progress-bar-holder',
        itemTypes: {
            CHART: 'chart'
        }
    };

    /**
     *
     * Creates a new Charts Dashboard View
     * Instantiates the FENIX dashboard submodule, ProgressBar and responsible for all charts dashboard related functionality.
     * Including updates to the Dashboard model.
     * @class ChartsDashboardView
     * @extends View
     */

    function PriorityMatrixChartsDashboardView(o) {
        // log.info("PriorityMatrixChartsDashboardView");
        //  log.info(o);

        $.extend(true, this, o);

        this._parseInput(o);

        var valid = this._validateInput();

        if (valid === true) {

            this._init();

            return this;

        } else {
            log.error("Impossible to create PriorityMatrixChartsDashboard View");
            log.error(valid)
        }
    }

    PriorityMatrixChartsDashboardView.prototype._parseInput = function (params) {
        this.$el = $(this.el);
        this.lang = params.lang || BaseConfig.LANG.toLowerCase();
        this.environment = params.environment || BaseConfig.ENVIRONMENT;
        this.topic = params.topic;
        this.model = params.model;
        this.config =  params.config;
    };

    PriorityMatrixChartsDashboardView.prototype._init = function () {
        this.template = template;
        this.modelUpdated = false;
        this.models = {};
        this.titles = [];
        this.subtitles = [];

        //Initialize Progress Bar
        this.progressBar = new ProgressBar({
            container: s.PROGRESS_BAR_CONTAINER,
            lang: this.lang
        });

        this.downloader = new Downloader({
            lang : this.lang,
            environment :  this.environment
        });


    };

    PriorityMatrixChartsDashboardView.prototype._attach = function () {
        var updatedTemplate = this._updateTemplate();
        this.source = $(updatedTemplate).find("[data-topic='" + this.topic + "']").prop('outerHTML');
        this.$el.html(this.source);
    };


    PriorityMatrixChartsDashboardView.prototype._bindDownloadEventListeners = function () {
        var self = this;


        // initialize Download buttons
        $.each(this.config.items, function( index, item ) {
            var identifier = '#'+item.id;

            for (var key in BaseConfig.DOWNLOAD) {
                $(identifier+"-"+BaseConfig.DOWNLOAD[key]).click( _.bind(self.onDownloadMenuClick, self));
            }

            $(identifier+"-"+BaseConfig.PRINT).on('click',  _.bind(self.onPrintMenuClick, self));

        });
    };

    PriorityMatrixChartsDashboardView.prototype._unbindDownloadEventListeners = function () {
        var self = this;

        // initialize Download buttons
        $.each(this.config.items, function( index, item ) {

            var identifier = '#'+item.id;

            for (var key in BaseConfig.DOWNLOAD) {
                $(identifier+"-"+BaseConfig.DOWNLOAD[key]).unbind('click', _.bind(self.onDownloadMenuClick, self));
            }

            if($(identifier+"-"+BaseConfig.PRINT))
                $(identifier+"-"+BaseConfig.PRINT).off('click', _.bind(self.onPrintMenuClick, self));

        });

    };

    PriorityMatrixChartsDashboardView.prototype.onDownloadMenuClick = function (event) {
        event.preventDefault();// prevent the default functionality

        var modelId = $(event.target).attr('data-model-id');
        var type = $(event.target).attr('data-type');

        this.downloader.onDownloadMenuClick(this.models[modelId], modelId, type, this.titles[modelId], this.subtitles[modelId]);

    };



    PriorityMatrixChartsDashboardView.prototype.onPrintMenuClick = function (event) {
        event.preventDefault();// prevent the default functionality
        var model = $(event.target).attr('data-model-id');

        this.downloader.onPrintMenuClick(model);

    };


    PriorityMatrixChartsDashboardView.prototype.modelChanged = function() {
        this.modelUpdated = true;
    };

    PriorityMatrixChartsDashboardView.prototype._validateInput = function () {
        var valid = true,
            errors = [];

        //Check if $el exist
        if (this.$el.length === 0) {
            errors.push({code: Errors.MISSING_CONTAINER});
            log.warn("Impossible to find dashboard container");
        }

        if (!this.config) {
            errors.push({code: Errors.MISSING_CONFIGURATION});
            log.warn("Impossible to find dashboard config");
        }

        if (!this.topic) {
            errors.push({code: Errors.MISSING_CONTEXT});
            log.warn("Undefined topic");
        }

        return errors.length > 0 ? errors : valid;
    };

    PriorityMatrixChartsDashboardView.prototype._updateTemplate = function () {

        var model = this.model.getProperties();
        var data = $.extend(true, model, i18nDashboardLabels[this.lang], i18nCommonLabels[this.lang], i18nChartLabels[this.lang]);

        return this.template(data);

    };

    PriorityMatrixChartsDashboardView.prototype._renderDashboard = function (filter) {

        this.config.filter = filter;

        this.config.el = this.$el;
        this.config.environment = this.environment;
        this.config.baseItems = this.config.items;

        this.dashboard = new Dashboard(this.config);

    };



    PriorityMatrixChartsDashboardView.prototype._disposeDashboards = function () {
        if (this.dashboard && $.isFunction(this.dashboard.dispose)) {
            this.dashboard.dispose();
        }
    };


    PriorityMatrixChartsDashboardView.prototype._updateItems = function(props){

        // Sets Highchart config for each chart
        _.each(this.config.items, _.bind(function (item) {
            if (!_.isEmpty(item)) {
                if (item.type == s.itemTypes.CHART) {
                    if (item.config.config) {
                        item.config.config = $.extend(true, {}, HighchartsTemplate, item.config.config);

                    } else {
                        item.config.config = $.extend(true, {}, HighchartsTemplate);
                    }
                }
            }

        }, this));

        // Update the language related labels in the item configurations (charts)
        for (var it in this.config.items) {
            var item = this.config.items[it];
            // console.log(item.id, i18nDashboardLabels[this.lang][item.id])
            this._updateChartExportTitles(this.config.items[it], i18nDashboardLabels[this.lang][item.id], this.model.get('label'));
            this.titles[item.id] = i18nDashboardLabels[this.lang][item.id];
            this.subtitles[item.id] = this.model.get('label');
        }

    };

    PriorityMatrixChartsDashboardView.prototype._updateChartExportTitles = function (chartItem, title, subtitle) {

        if (chartItem.config.config) {
            var chartItemTitle = chartItem.config.config.exporting.chartOptions.title,
                chartItemSubTitle = chartItem.config.config.exporting.chartOptions.subtitle;

            if (!chartItemTitle || !chartItemSubTitle) {
                chartItemTitle = chartItem.config.config.exporting.chartOptions.title = {};
                chartItemSubTitle = chartItem.config.config.exporting.chartOptions.subtitle = {};
            }

            chartItemTitle.text = title;
            chartItemSubTitle.text = subtitle;
        }
    };

    PriorityMatrixChartsDashboardView.prototype._bindDashboardListeners = function () {
        var self = this,  increment = 0, percent = Math.round(100 / this.config.items.length);

        this.dashboard.on('ready.item', function (item) {
            self.models[item.id] = {};
            self.models[item.id].data ={};
            self.models[item.id].data = item.model.data;
            self.models[item.id].metadata = {};
            self.models[item.id].metadata.rid = item.model.metadata.rid;
            self.models[item.id].metadata.uid = item.model.metadata.uid;
            self.models[item.id].metadata.dsd = item.model.metadata.dsd;

            increment = increment + percent;
            self.progressBar.update(increment);
        });

    };

    PriorityMatrixChartsDashboardView.prototype._loadProgressBar = function () {
        var self = this;

        this.progressBar.reset();
        this.progressBar.show();

        this.dashboard.on('ready', function () {

            self._bindDownloadEventListeners();

            self.progressBar.finish();
        });

    };

    PriorityMatrixChartsDashboardView.prototype.rebuildDashboard = function (filter, topic) {

        this.models = {};
        this.titles = [];
        this.subtitles = [];
        this.topic = topic;

        this._disposeDashboards();

        this._unbindDownloadEventListeners();

        this._updateItems();

        this.modelUpdated = false;
        this._attach();

        this._renderDashboard(filter);

      //  this._bindDownloadEventListeners();

        this._bindDashboardListeners();

        this._loadProgressBar();

    };

    PriorityMatrixChartsDashboardView.prototype.getDashboardConfig = function () {
        return this.config;
    };

    PriorityMatrixChartsDashboardView.prototype.setDashboardConfig = function (config) {

        this.config = config;

        // Sets Highchart config for each chart
        _.each(this.config.items, _.bind(function (item) {
            if (!_.isEmpty(item)) {
                if (item.type == s.itemTypes.CHART) {
                    if (item.config.config) {
                        item.config.config = $.extend(true, {}, HighchartsTemplate, item.config.config);

                    } else {
                        item.config.config = $.extend(true, {}, HighchartsTemplate);
                    }
                }
            }

        }, this));

    };

    PriorityMatrixChartsDashboardView.updateDashboardItemConfiguration = function (itemid, property, values) {
        var item = _.filter(this.config.items, {id: itemid})[0];

        if (item) {
            if (item.config && item.config[property]) {
                if(values[0] === 'false' || values[0] === 'true')
                    item.config[property] = $.parseJSON(values[0]); // returns a Boolean
                else
                    item.config[property] = values[0];

            }
        }
    };

    PriorityMatrixChartsDashboardView.prototype.clear = function () {
        this.$el.empty();
    };


    return PriorityMatrixChartsDashboardView;

});
