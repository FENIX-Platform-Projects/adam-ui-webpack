/*global define, amplify*/
define([
    'loglevel',
    'jquery',
    'underscore',
    'html/partner-matrix/table-dashboard.hbs',
    'fenix-ui-dashboard',
    'utils/utils',
    'config/config-base',
    'config/errors',
    'nls/partner-matrix',
    'nls/common',
    'partner-matrix/table-item',
    'config/partner-matrix/events',
    'partner-matrix/table-downloader',
    'common/progress-bar'
], function (log, $, _, template, Dashboard, Utils, BaseConfig, Errors, i18nDashboardLabels, i18nCommonLabels, TableItem, BaseEvents, Downloader, ProgressBar) {

    'use strict';

    var s = {
        item_container_id: '-container',
        PROGRESS_BAR_CONTAINER: '#progress-bar-holder',
        paths: {
            TABLE_ITEM: 'partner-matrix/table-item'
        },
        events: {
            CHANGE: 'change'
        },
        itemTypes: {
            CHART: 'chart'
        },
        css: {
            COLLAPSE: 'collapse'
        }
    };

    /**
     *
     * Creates a new Table View, which is composed of a custom Table and associated filter item
     * Instantiates the FENIX dashboard submodule and responsible for the table dashboard related functionality.
     * @class TableView
     * @extends View
     */

    function TableView(o) {
        log.info("TableView");
        log.info(o);

        $.extend(true, this, o);

        this._parseInput(o);

        var valid = this._validateInput();

        if (valid === true) {

            this._init();

            this._attach();

            return this;

        } else {
            log.error("Impossible to create Table View");
            log.error(valid)
        }
    }

    TableView.prototype._parseInput = function (params) {
        this.$el = $(this.el);
        this.lang = params.lang || BaseConfig.LANG.toLowerCase();
        this.environment = params.environment || BaseConfig.ENVIRONMENT;
        this.topic = params.topic;
        this.model = params.model;
        this.config =  params.config;
    };


    TableView.prototype._init = function () {
        this.template = template;
        this.modelUpdated = false;
        this.models = {};

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

    TableView.prototype._attach = function () {
        var updatedTemplate = this._updateTemplate();
        this.source = $(updatedTemplate).find("[data-topic='" + this.topic + "']").prop('outerHTML');
        this.$el.html(this.source);
    };


    TableView.prototype._bindDownloadEventListeners = function () {
        var self = this;


        // initialize Download buttons
        $.each(this.config.items, function( index, item ) {
            var identifier = '#'+item.id;

            for (var key in BaseConfig.DOWNLOAD) {
                $(identifier+"-"+BaseConfig.DOWNLOAD[key]).click( _.bind(self.onDownloadMenuClick, self));
            }

        });
    };

    TableView.prototype._unbindDownloadEventListeners = function () {
        var self = this;

        // initialize Download buttons
        $.each(this.config.items, function( index, item ) {

            var identifier = '#'+item.id;

            for (var key in BaseConfig.DOWNLOAD) {
                $(identifier+"-"+BaseConfig.DOWNLOAD[key]).unbind('click', _.bind(self.onDownloadMenuClick, self));
            }

        });

    };

    TableView.prototype.onDownloadMenuClick = function (event) {
        event.preventDefault();// prevent the default functionality

        var modelId = $(event.target).attr('data-model-id');

        this.downloader.onDownloadMenuClick(this.models[modelId]);

    };

    TableView.prototype.modelChanged = function() {
        this.modelUpdated = true;
    };

    TableView.prototype._validateInput = function () {

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

    TableView.prototype._updateTemplate = function () {

        var model = this.model.getProperties();
        var data = $.extend(true, model, i18nDashboardLabels[this.lang], i18nCommonLabels[this.lang]);

        return this.template(data);

    };

    TableView.prototype._renderDashboard = function (filter) {

        this.config.filter = filter;

        this.config.el = this.$el;
        this.config.items[0].topic = this.topic;
        this.config.items[0].lang = this.lang;
        this.config.environment = this.environment;
        this.config.baseItems = this.config.items;

        // the path to the custom item is registered
        this.config.itemsRegistry = {
            custom: {
                item: TableItem,
                path: s.TABLE_ITEM
            }
        };

        // Build new dashboard
        this.dashboard = new Dashboard(
            this.config
        );

    };

    TableView.prototype._disposeDashboards = function () {
        if (this.dashboard && $.isFunction(this.dashboard.dispose)) {
            this.dashboard.dispose();
        }
    };

    //updateDashboardItemConfiguration
    TableView.prototype._updateItems = function(itemid, property, values){
        var item = _.filter(this.config.items, {id: itemid})[0];

        if (item) {
            if (item.config && item.config[property]) {
                if (values[0] === 'false' || values[0] === 'true')
                    item.config[property] = $.parseJSON(values[0]); // returns a Boolean
                else
                    item.config[property] = values[0];

            }
        }
    };

    TableView.prototype._loadProgressBar = function () {
        var self = this;

        this.progressBar.reset();
        this.progressBar.show();

        this.dashboard.on('ready', function () {
            self.progressBar.finish();
        });

    };

    TableView.prototype.rebuildDashboard = function (filter, topic) {

        this.models = {};

        this._disposeDashboards();

        this._unbindDownloadEventListeners();

        // Re-Render the source template
        if (topic) {
            this.topic = topic;
            this.modelUpdated = false;
            this._attach();
        }


        this._renderDashboard(filter);

        this._bindDownloadEventListeners();

        this._bindDashboardListeners();

        this._loadProgressBar();

    };

    TableView.prototype._bindDashboardListeners = function () {
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

        /*this.dashboard.on('table_ready', function (item) {

            var id =  self.config.items[0].id;

            if (item.data.size > 0) {
                self.models[id] = {};
                self.models[id].data = {};
                self.models[id].data = item.model.data;
                self.models[id].metadata = {};
                self.models[id].metadata.rid = item.model.metadata.rid;
                self.models[id].metadata.uid = item.model.metadata.uid;
                self.models[id].metadata.dsd = item.model.metadata.dsd;

            }
        });*/

    };

    TableView.prototype.getDashboardConfig = function () {
        return this.config;
    };


    TableView.prototype.setDashboardConfig = function (config) {

        this.config = config;
    };

    /*    var TableView = View.extend({


            /!*_updateChartExportTitles: function (chartItem, title, subtitle) {

               if (chartItem.config.config ) {
                    var chartItemTitle = chartItem.config.config.exporting.chartOptions.title,
                        chartItemSubTitle = chartItem.config.config.exporting.chartOptions.subtitle;

                    if (!chartItemTitle || !chartItemSubTitle) {
                        chartItemTitle = chartItem.config.config.exporting.chartOptions.title = {};
                        chartItemSubTitle = chartItem.config.config.exporting.chartOptions.subtitle = {};
                    }

                    chartItemTitle.text = title;
                    chartItemSubTitle.text = subtitle;
                }
            },*!/

            rebuildDashboard: function (filter, topic) {
                var self = this;

                this._disposeDashboards();
                this.config.filter = filter;


                // Re-Render the source template
                if (topic) {
                    this.topic = topic;
                    this.source = $(this.template).find("[data-topic='" + this.topic + "']").prop('outerHTML');
                    this.render();
                }


                this.config.items[0].topic = this.topic;


                // the path to the custom item is registered
                this.config.itemsRegistry = {
                    custom: {
                        path: defaultOptions.paths.TABLE_ITEM //'views/analyse/partner_matrix/table-item'
                    }
                };

                // Build new dashboard
                this.dashboard = new Dashboard(this.config);


            },


            getDashboardConfig: function () {
                return this.config;
            },


            _bindEventListeners: function () {

            },


            _unbindEventListeners: function () {
                // Remove listeners

            },

            dispose: function () {

                this._disposeDashboards();

                this._unbindEventListeners();

                View.prototype.dispose.call(this, arguments);
            }


        });*/

    return TableView;
});
