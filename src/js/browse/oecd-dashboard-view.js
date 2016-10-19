/*global define, amplify*/
define([
    'loglevel',
    'jquery',
    'underscore',
    '../../html/browse/oecd-dashboard.hbs',
    '../../config/browse/config-browse',
    '../../config/config',
    '../../config/errors',
    'fenix-ui-dashboard',
    '../../config/config',
    '../../nls/browse',
    '../../nls/browse-dashboard',
    '../../nls/chart',
    '../../config/submodules/fx-chart/highcharts_template',
    '../common/progress-bar',
    'amplify-pubsub'
], function (log, $, _, template, BaseBrowseConfig, BaseConfig, Errors, Dashboard, GeneralConfig, i18nLabels, i18nDashboardLabels, i18nChartLabels, HighchartsTemplate, ProgressBar, amplify) {

    'use strict';

    var defaultOptions = {
        item_container_id: '-container',
        PROGRESS_BAR_CONTAINER: '#progress-bar-holder',
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
     * Creates a new ODA/OECD Dashboard View
     * Instantiates the FENIX dashboard submodule, ProgressBar and responsible for all oda/oecd dashboard related functionality.
     * Including updates to the Dashboard model.
     * @class DashboardView
     * @extends View
     */
    function DashboardView(o) {
        log.info("DashboardView");
        log.info(o);

        $.extend(true, this, o);


        this._parseInput(o);

        var valid = this._validateInput();

        if (valid === true) {

            this._unbindEventListeners();

            this._init();

            return this;

        } else {
            log.error("Impossible to create Dashboard View");
            log.error(valid)
        }
    }

    DashboardView.prototype._parseInput = function (params) {
        this.$el = $(this.el);
        this.lang = params.lang || BaseConfig.LANG.toLowerCase();
        this.topic = params.topic;
        this.model = params.model;

    };


    DashboardView.prototype.modelChanged = function() {
        alert('model changed');
    };

    DashboardView.prototype._validateInput = function () {

        var valid = true,
            errors = [];

        //Check if $el exist
        if (this.$el.length === 0) {
            errors.push({code: Errors.MISSING_CONTAINER});
            log.warn("Impossible to find dashboard container");
        }

        if (!this.topic) {
            errors.push({code: Errors.MISSING_CONTEXT});
            log.warn("Undefined topic");
        }

        return errors.length > 0 ? errors : valid;
    };

    DashboardView.prototype._init = function () {
        this._bindEventListeners();

        this.dashboards = [];

        //this.model.on(defaultOptions.events.CHANGE, this.render, this);

      //  this.template = template(i18nLabels[this.lang]);
        this.template = template(i18nLabels[this.lang]);

        this.source = $(this.template).find("[data-topic='" + this.topic + "']");

        //Initialize Progress Bar
        this.progressBar = new ProgressBar({
           container: defaultOptions.PROGRESS_BAR_CONTAINER
        });

    };

    DashboardView.prototype._attach = function () {
        this.$el.html(this._getTemplateFunction());
    };

    DashboardView.prototype._getTemplateFunction = function () {

        // Update the language related labels in the dashboard template

        // this.compiledTemplate = Handlebars.compile(this.source.prop('outerHTML'));

        var model = this.model.toJSON();

        var data = $.extend(true, model, i18nLabels[this.lang], i18nDashboardLabels[this.lang], i18nChartLabels[this.lang]);

        return this.template(data);

    };

    DashboardView.prototype._bindEventListeners = function () {

   };

    DashboardView.prototype._unbindEventListeners = function () {

    };

    DashboardView.prototype.render = function () {

        // Update the language related labels in the item configurations (charts)
        for (var it in this.config.items) {
            var item = this.config.items[it];
            this._updateChartExportTitles(this.config.items[it], i18nDashboardLabels[this.lang][item.id], this.model.get('label'));
        }

       this._attach();
    };


    DashboardView.prototype._updateChartExportTitles = function (chartItem, title, subtitle) {

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

    DashboardView.prototype.setDashboardConfig = function (config) {
        this.baseConfig = config;

        this.config = config;
        this.config_type = config.id;
        this.config.baseItems = config.items;
        this.config.environment = GeneralConfig.ENVIRONMENT;

        // Sets Highchart config for each chart
        _.each(this.config.items, _.bind(function (item) {
            if (!_.isEmpty(item)) {
                if (item.type == defaultOptions.itemTypes.CHART) {
                    if (item.config.config) {
                        item.config.config = $.extend(true, {}, HighchartsTemplate, item.config.config);
                    } else {
                        item.config.config = $.extend(true, {}, HighchartsTemplate);
                    }
                }
            }

        }, this));
    };

    DashboardView.prototype.setProperties = function (props) {
        if (props) {
            if (props["regioncode"])
                this.regioncode = props["regioncode"];
            else
                this.regioncode = null;

            if (props["gaulcode"])
                this.gaulcode = props["gaulcode"];
            else
                this.gaulcode = null;

            if (props["oda"])
                this.config.uid = props["oda"];


        } else {
            this.regioncode = null;
            this.gaulcode = null;
        }
    };

    DashboardView.prototype.updateDashboardTemplate = function (filterdisplayconfig) {

        if (filterdisplayconfig) {

            var hide = filterdisplayconfig.hide;
            var show = filterdisplayconfig.show;

            for (var idx in hide) {
                this._collapseDashboardItem(hide[idx]); // in the template
            }

            for (var idx in show) {
                this._expandDashboardItem(show[idx]); // in the template
            }

        }

    };

    DashboardView.prototype._collapseDashboardItem = function (itemId) {
        // Hide/collapse Item container
        var itemContainerId = '#' + itemId + defaultOptions.item_container_id;

        $(this.source).find(itemContainerId).addClass(defaultOptions.css.COLLAPSE);

    };

    DashboardView.prototype._expandDashboardItem = function (itemId) {
        // Show Item container
        var itemContainerId = '#' + itemId + defaultOptions.item_container_id;
        $(this.source).find(itemContainerId).removeClass(defaultOptions.css.COLLAPSE);
    };

    DashboardView.prototype.updateItemsConfig = function () {
        this._updateDashboardRegionalMapConfiguration();
    };

    DashboardView.prototype._updateDashboardRegionalMapConfiguration = function () {
        var map = _.filter(this.config.items, {id: 'regional-map'})[0];
        var regioncode = this.regioncode;
        var gaulcode = this.gaulcode;

        if (map && regioncode) {

            if (map.filter && map.filter.un_region_code) {
                map.filter.un_region_code = [];

                if (regioncode)
                    map.filter.un_region_code.push(regioncode)
            }

            if (map.config && map.config.fenix_ui_map) {
                if (gaulcode) {
                    map.config.fenix_ui_map.zoomToCountry = [];
                    map.config.fenix_ui_map.zoomToCountry.push(gaulcode);
                }
            }
        }

    };

    DashboardView.prototype.rebuildDashboard = function (filter, displayConfigForSelectedFilter) {
        var self = this;


        //   console.log("============ REBUILD =======", displayConfigForSelectedFilter);

        // Re-render the template
        if (displayConfigForSelectedFilter) {
            this.render();
        }

        this._disposeDashboards();

        this.config.filter = filter;

        // Build new dashboard
        this.dashboard = new Dashboard(
            this.config
        );

        // Load Progress bar
        this._loadProgressBar();

    };

    DashboardView.prototype._disposeDashboards = function () {
        if (this.dashboard && $.isFunction(this.dashboard.dispose)) {
            this.dashboard.dispose();
        }
    };


    DashboardView.prototype._loadProgressBar = function () {
        var self = this, increment = 0, percent = Math.round(100 / this.config.items.length);

        this.progressBar.reset();
        this.progressBar.show();


        this.dashboard.on('ready', function () {
            self.progressBar.finish();
        });


        this.dashboard.on('ready.item', function () {
            increment = increment + percent;
            self.progressBar.update(increment);
        });
    };

    /*var DashboardView = View.extend({

        // Automatically render after initialize
        autoRender: false,

        className: 'dashboard-browse',

        // Save the template string in a prototype property.
        // This is overwritten with the compiled template function.
        // In the end you might want to used precompiled templates.
        template: template,

        initialize: function (params) {
            this.topic = params.topic;
            this.model.on(defaultOptions.events.CHANGE, this.render, this);
            this.dashboards = [];

            this.source = $(this.template).find("[data-topic='" + this.topic + "']");

            //Initialize Progress Bar
            this.progressBar = new ProgressBar({
                container: defaultOptions.PROGRESS_BAR_CONTAINER
            });

            View.prototype.initialize.call(this, arguments);

        },

        getTemplateData: function () {
            return i18nLabels;
        },

        render: function () {
            this.setElement(this.container);
            this._unbindEventListeners();

            // Update the language related labels in the item configurations (charts)
            for (var it in this.config.items) {
                var item = this.config.items[it];
                this._updateChartExportTitles(this.config.items[it], i18nDashboardLabels[item.id], this.model.get('label'));
            }


            $(this.el).html(this.getTemplateFunction());
        },

        attach: function () {
            View.prototype.attach.call(this, arguments);

            this.configUtils = new ConfigUtils();
        },


        getTemplateFunction: function () {

            // Update the language related labels in the dashboard template

            this.compiledTemplate = Handlebars.compile(this.source.prop('outerHTML'));

            var model = this.model.toJSON();

            var data = $.extend(true, model, i18nLabels, i18nDashboardLabels, i18nChartLabels);

            return this.compiledTemplate(data);

        },

        setDashboardConfig: function (config) {
            this.baseConfig = config;

            this.config = config;
            this.config_type = config.id;
            this.config.baseItems = config.items;
            this.config.environment = GeneralConfig.ENVIRONMENT;

            // Sets Highchart config for each chart
            _.each(this.config.items, _.bind(function (item) {
                if (!_.isEmpty(item)) {
                    if (item.type == defaultOptions.itemTypes.CHART) {
                        if (item.config.config) {
                            item.config.config = $.extend(true, {}, HighchartsTemplate, item.config.config);
                        } else {
                            item.config.config = $.extend(true, {}, HighchartsTemplate);
                        }
                    }
                }

            }, this));
        },

        renderDashboard: function () {
            var self = this;

            this.config.el = this.$el;
            this.dashboard = new Dashboard(this.config);

            this._loadProgressBar();
        },

        _disposeDashboards: function () {
            if (this.dashboard && $.isFunction(this.dashboard.dispose)) {
                this.dashboard.dispose();
            }
        },


        _collapseDashboardItem: function (itemId) {
            // Hide/collapse Item container
            var itemContainerId = '#' + itemId + defaultOptions.item_container_id;

            $(this.source).find(itemContainerId).addClass(defaultOptions.css.COLLAPSE);

        },

        _expandDashboardItem: function (itemId) {
            // Show Item container
            var itemContainerId = '#' + itemId + defaultOptions.item_container_id;
            $(this.source).find(itemContainerId).removeClass(defaultOptions.css.COLLAPSE);
        },


        _showDashboardItem: function (itemId) {
            // Show Item container
            var itemContainerId = '#' + itemId + defaultOptions.item_container_id;
            $(this.source).find(itemContainerId).show();
        },

        updateDashboardTemplate: function (filterdisplayconfig) {

            if (filterdisplayconfig) {

                var hide = filterdisplayconfig.hide;
                var show = filterdisplayconfig.show;

                for (var idx in hide) {
                    this._collapseDashboardItem(hide[idx]); // in the template
                }

                for (var idx in show) {
                    this._expandDashboardItem(show[idx]); // in the template
                }

            }

        },


        updateDashboardConfigUid: function (uid) {
            this.config.uid = uid;
        },

        showHiddenDashboardItems: function (showItems) {
            if (showItems) {
                for (var itemId in showItems) {
                    this._showDashboardItem(showItems[itemId]);
                }
            }

        },

        setProperties: function (props) {
            if (props) {
                if (props["regioncode"])
                    this.regioncode = props["regioncode"];
                else
                    this.regioncode = null;

                if (props["gaulcode"])
                    this.gaulcode = props["gaulcode"];
                else
                    this.gaulcode = null;

                if (props["oda"])
                    this.config.uid = props["oda"];


            } else {
                this.regioncode = null;
                this.gaulcode = null;
            }
        },

        updateItemsConfig: function () {
            this._updateDashboardRegionalMapConfiguration();
        },

        _updateDashboardRegionalMapConfiguration: function () {
            var map = _.filter(this.config.items, {id: 'regional-map'})[0];
            var regioncode = this.regioncode;
            var gaulcode = this.gaulcode;

            if (map && regioncode) {

                if (map.filter && map.filter.un_region_code) {
                    map.filter.un_region_code = [];

                    if (regioncode)
                        map.filter.un_region_code.push(regioncode)
                }

                if (map.config && map.config.fenix_ui_map) {
                    if (gaulcode) {
                        map.config.fenix_ui_map.zoomToCountry = [];
                        map.config.fenix_ui_map.zoomToCountry.push(gaulcode);
                    }
                }
            }

        },

        _updateChartExportTitles: function (chartItem, title, subtitle) {

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
        },

        rebuildDashboard: function (filter, displayConfigForSelectedFilter) {
            var self = this;


         //   console.log("============ REBUILD =======", displayConfigForSelectedFilter);

            // Re-render the template
            if (displayConfigForSelectedFilter) {
               this.render();
            }

            this._disposeDashboards();

            this.config.filter = filter;

            // Build new dashboard
            this.dashboard = new Dashboard(
                this.config
            );

            // Load Progress bar
            this._loadProgressBar();

        },


        _loadProgressBar: function () {
            var self = this, increment = 0, percent = Math.round(100 / this.config.items.length);

            this.progressBar.reset();
            this.progressBar.show();


            this.dashboard.on('ready', function () {
                self.progressBar.finish();
            });


            this.dashboard.on('ready.item', function () {
                increment = increment + percent;
                self.progressBar.update(increment);
            });
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

    return DashboardView;
});
