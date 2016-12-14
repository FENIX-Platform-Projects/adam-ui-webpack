/*global define, amplify*/
define([
    'loglevel',
    'jquery',
    'underscore',
    'html/priority/charts-dashboard.hbs',
    'fenix-ui-dashboard',
    'utils/utils',
    'config/config-base',
    'config/errors',
    'nls/priority',
    'nls/chart',
    'config/priority/events',
    'handlebars',
    'config/nodemodules/fenix-ui-chart-creator/highcharts_template',
    'config/nodemodules/fenix-ui-chart-creator/jvenn_template',
    'common/progress-bar',
    'common/data-exporter',
    'common/chart-exporter',
    'common/exporter',
    'amplify-pubsub'
], function (log, $, _, template, Dashboard, Utils,  BaseConfig, Errors, i18nDashboardLabels, i18nChartLabels, BaseEvents, Handlebars,  HighchartsTemplate, JVennTemplate, ProgressBar, DataExporter, ChartExporter, Exporter, amplify) {

    'use strict';

    var defaultOptions = {
        item_container_id: '-container',
        PROGRESS_BAR_CONTAINER: '#priority-c-progress-bar-holder',
        events: {
            CHANGE: 'change'
        },
        itemTypes: {
            CHART: 'chart',
            VENN: 'venn'
        },
        css: {
            COLLAPSE: 'collapse'
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

    function ChartsDashboardView(o) {
        // log.info("BrowseByView");
        //  log.info(o);

        $.extend(true, this, o);

        this._parseInput(o);

        var valid = this._validateInput();

        if (valid === true) {

            this._init();

            return this;

        } else {
            log.error("Impossible to create Charts View");
            log.error(valid)
        }
    }

    ChartsDashboardView.prototype._parseInput = function (params) {
        this.$el = $(this.el);
        this.lang = params.lang || BaseConfig.LANG.toLowerCase();
        this.environment = params.environment || BaseConfig.ENVIRONMENT;
        this.topic = params.topic;
        this.model = params.model;
    };

    ChartsDashboardView.prototype.modelChanged = function() {
        //   console.log("============= MODEL CHANGED ========");
        //  this.render();
        //alert('model changed');
        this.modelUpdated = true;
    };


    ChartsDashboardView.prototype._validateInput = function () {
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

    ChartsDashboardView.prototype._init = function () {

        this.template = template;
        this.modelUpdated = false;
        this.models = {};

        this.chartExporter = new ChartExporter();

        //Initialize Progress Bar
        this.progressBar = new ProgressBar({
            container: defaultOptions.PROGRESS_BAR_CONTAINER,
            lang: this.lang
        });

    };

    ChartsDashboardView.prototype._downloadExcel = function (modelId) {
        var model = this.models[modelId];

        var dataExporter = new DataExporter({
            lang: this.lang,
            environment:  this.environment
        });

        return dataExporter.downloadData(model);

    };

    ChartsDashboardView.prototype.onDownloadMenuClick = function (event) {
        event.preventDefault();// prevent the default anchor functionality

        var model = $(event.target).attr('data-model-id');
        var type = $(event.target).attr('data-type');

        switch(type) {
            case BaseConfig.DOWNLOAD.EXCEL:
                this._downloadExcel(model);
                break;
            default:
                this.chartExporter.download("div[data-item='"+model+"']", type, model);

        }

    };

    ChartsDashboardView.prototype.onPrintMenuClick = function (event) {
        var model = $(event.target).attr('data-model-id');
        var type = $(event.target).attr('data-type');

        if(type) {
            this.chartExporter.print("div[data-item='"+model+"']");
        }else {
            Exporter.print("div[data-item='"+model+"']");
        }



    };
    ChartsDashboardView.prototype._updateTemplate = function () {

        var model = this.model.getProperties();
        var data = $.extend(true, model, i18nDashboardLabels[this.lang], i18nChartLabels[this.lang]);

        return template(data);


    };

   /* ChartsDashboardView.prototype._bindEventListeners = function () {

        var self = this;
        // console.log(" =============BIND ===================== ", this.$el);

        // initialize Download buttons
        $.each(this.config.items, function( index, item ) {
            var identifier = '#'+item.id;
            for (var key in BaseConfig.DOWNLOAD) {
                  $(identifier+"-"+BaseConfig.DOWNLOAD[key]).click(_.bind(self.onDownloadMenuClick, self));
            }

             $(identifier+"-"+BaseConfig.PRINT).on('click', _.bind(self.onPrintMenuClick, self));

        });


    };

    ChartsDashboardView.prototype._unbindEventListeners = function () {
        var self = this;

        // initialize Download buttons
        $.each(this.config.items, function( index, item ) {

            var identifier = '#'+item.id;

            for (var key in BaseConfig.DOWNLOAD) {
                 $(identifier+"-"+BaseConfig.DOWNLOAD[key]).unbind('click', _.bind(self.onDownloadMenuClick, self));
            }

             $(identifier+"-"+BaseConfig.PRINT).off('click', _.bind(self.onPrintMenuClick, self));

        });

    };*/

    ChartsDashboardView.prototype.render = function () {
        var self = this;
        this.modelUpdated = false; // reset the model to false

       // this._unbindEventListeners();


        // Update the language related labels in the item configurations (charts)
        for (var it in this.config.items) {
            var item = this.config.items[it];
            // console.log(item.id, i18nDashboardLabels[this.lang][item.id])
            this._updateChartExportTitles(this.config.items[it], i18nDashboardLabels[this.lang][item.id], this.model.get('label'));
        }

        var updatedTemplate = this._updateTemplate();
        this.source = $(updatedTemplate).prop('outerHTML');

        // Hide/Show Dashboard Items
        if(this.displayConfigForSelectedFilter)
            this.updateDashboardTemplate(this.displayConfigForSelectedFilter);


        this.$el.html(this.source);

        //console.log(" ============== before BIND ===========");
        //this._bindEventListeners();

    };

    ChartsDashboardView.prototype._updateChartExportTitles = function (chartItem, title, subtitle) {

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

    ChartsDashboardView.prototype.setDashboardConfig = function (config) {
        this.baseConfig = config;

        this.config = config;
        this.config_type = config.id;
        this.config.baseItems = config.items;
        this.config.environment = this.environment;

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

        //console.log("====================== setDAshboardConfig ");
        //console.log(this.config.items[0].config.config.chart.events.load);
    };



    ChartsDashboardView.updateDashboardItemConfiguration = function (itemid, property, values) {
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


    ChartsDashboardView.prototype._collapseDashboardItem = function (itemId) {
        // Hide/collapse Item container
        var itemContainerId = '#' + itemId + defaultOptions.item_container_id;


        //console.log(itemContainerId);
        //console.log(this.source);

        $(this.source).find(itemContainerId).addClass(defaultOptions.css.COLLAPSE);

    };

    ChartsDashboardView.prototype._expandDashboardItem = function (itemId) {
        // Show Item container
        var itemContainerId = '#' + itemId + defaultOptions.item_container_id;


        //  console.log(itemContainerId);
        //  console.log($(this.source).find(itemContainerId).hasClass(defaultOptions.css.COLLAPSE));

        $(this.source).find(itemContainerId).removeClass(defaultOptions.css.COLLAPSE);
    };

   /* ChartsDashboardView.prototype.rebuildDashboard = function (filter, displayConfigForSelectedFilter) {
        var self = this;


        console.log("============ REBUILD =======", displayConfigForSelectedFilter, this.modelUpdated);

        // Re-render the template
        if (displayConfigForSelectedFilter || this.modelUpdated) {
            if(displayConfigForSelectedFilter){

                this.displayConfigForSelectedFilter =  displayConfigForSelectedFilter;
            }


            this.render();
        }


        //  console.log("============ REBUILD =======", this.config.items);
        this._disposeDashboards();

        this.config.filter = filter;

        // Build new dashboard
        this.dashboard = new Dashboard(
            this.config
        );

        // Load Progress bar
        this._loadProgressBar();

    };
*/

    ChartsDashboardView.prototype.renderDashboard = function () {
        this.render();

        this.config.el = this.$el;
        this.dashboard = new Dashboard(this.config);

       // this._bindEventListeners();
        this._loadProgressBar();
    };


    ChartsDashboardView.prototype.clear = function () {
        this.$el.empty();
    };


    ChartsDashboardView.prototype._disposeDashboards = function () {
        if (this.dashboard && $.isFunction(this.dashboard.dispose)) {
            this.dashboard.dispose();
        }
    };


    ChartsDashboardView.prototype._loadProgressBar = function () {
        var self = this, increment = 0, percent = Math.round(100 / this.config.items.length);

        this.progressBar.reset();
        this.progressBar.show();


        this.dashboard.on('ready', function () {
            self.progressBar.finish();

        });


        this.dashboard.on('ready.item', function (item) {
               console.log(" ================== item READY: =================== ", item.id,  item.model.data.length, item.model.metadata.dsd.columns.length, item.model.metadata.dsd.columns, item.model.metadata.dsd, item.model.metadata);

            self.models[item.id] = {};
            self.models[item.id].data = item.model.data;
            self.models[item.id].metadata = {};
            self.models[item.id].metadata.rid = item.model.metadata.rid;
            self.models[item.id].metadata.uid = item.model.metadata.uid;
            self.models[item.id].metadata.dsd = item.model.metadata.dsd;


            console.log(" ================ ", self.models);

            increment = increment + percent;
            self.progressBar.update(increment);
        });
    };


    /* var ChartsDashboardView = View.extend({

         // DO NOT automatically render after initialize
         autoRender: false,

         className: 'analyse-priority-analysis-dashboard-charts',

         // Save the template string in a prototype property.
         // This is overwritten with the compiled template function.
         // In the end you might want to used precompiled templates.
         template: template,

         initialize: function (params) {
             this.topic = params.topic;
             //this.model = params.model;
             this.container = params.container;
             this.model.on(defaultOptions.events.CHANGE, this.render, this);
             this.dashboards = [];

             this.source = $(this.template).prop('outerHTML');

            // console.log("INITIALIZE FOR "+this.topic);
             //console.log(this.source)
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
            // this.el = this.container;
             this._unbindEventListeners();

             // Update the language related labels in the dashboard item configurations
             for (var it in this.config.items) {
                 var item = this.config.items[it];
                 this._updateChartExportTitles(this.config.items[it], i18nDashboardLabels[item.id], this.model.get('label'));
             }


             $(this.container).html(this.getTemplateFunction());
         },

         attach: function () {
             View.prototype.attach.call(this, arguments);

             this.configUtils = new ConfigUtils();
         },


         getTemplateFunction: function () {
             this.compiledTemplate = Handlebars.compile(this.source);
             var model = this.model.toJSON();

             // Update the language related labels in the dashboard template
             var data = $.extend(true, model, i18nLabels, i18nDashboardLabels, i18nChartLabels);

             return this.compiledTemplate(data);

         },

         setDashboardConfig: function (config) {
             this.baseConfig = config;

             this.config = config;
             this.config_type = config.id;
             this.config.baseItems = config.items;
             this.config.environment = GeneralConfig.ENVIRONMENT;

             var baseTemplate =  HighchartsTemplate;

             // Sets Highchart config for each chart
             _.each(this.config.items, _.bind(function (item) {
                 if (!_.isEmpty(item)) {
                     if (item.type == defaultOptions.itemTypes.CHART) {
                         if(item.config.type == defaultOptions.itemTypes.VENN){
                             baseTemplate =  JVennTemplate;
                         }

                         if (item.config.config) {
                             item.config.config = $.extend(true, {}, baseTemplate, item.config.config);
                         } else {
                             item.config.config = $.extend(true, {}, baseTemplate);
                         }
                     }
                 }

             }, this));


         },



         updateDashboardItemConfiguration: function (itemid, property, values) {
             var item = _.filter(this.config.items, {id: itemid})[0];

             if (item) {
                 if (item.config && item.config[property]) {
                     if(values[0] === 'false' || values[0] === 'true')
                         item.config[property] = $.parseJSON(values[0]); // returns a Boolean
                     else
                         item.config[property] = values[0];

                 }
             }
         },

         renderDashboard: function () {
             this.render();

             this.config.el = this.container;
             this.dashboard = new Dashboard(this.config);

             this._bindEventListeners();
             this._loadProgressBar();
         },


         clear: function () {
             this.container.empty();
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
                 if (props["oda"])
                     this.config.uid = props["oda"];

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



         getDashboardConfig: function () {
             return this.config;
         },




         _loadProgressBar: function () {
             var self = this, increment = 0, percent = Math.round(100 / this.config.items.length);

             this.progressBar.reset();
             this.progressBar.show();


             this.dashboard.on('ready', function () {
                 self.progressBar.finish();
                // amplify.publish(BaseEvents.DASHBOARD_ON_READY);
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

            // console.log("======================== DISPOSE ME CHARTS=================");
             this._disposeDashboards();

             this._unbindEventListeners();

             View.prototype.dispose.call(this, arguments);
         }


     });*/

    return ChartsDashboardView;
});
