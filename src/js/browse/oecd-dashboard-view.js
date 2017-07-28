/*global define, amplify*/
define([
    'loglevel',
    'jquery',
    'underscore',
    'html/browse/oecd-dashboard.hbs',
    'config/browse/config-browse',
    'config/config-base',
    'config/errors',
    'fenix-ui-dashboard',
    'nls/browse',
    'nls/common',
    'nls/browse-dashboard',
    'nls/chart',
    'config/nodemodules/fenix-ui-chart-creator/highcharts_template',
    'common/progress-bar',
    'common/data-exporter',
    'common/chart-exporter',
    'common/exporter',
    'amplify-pubsub',
    'handlebars'
], function (log, $, _, template, BaseBrowseConfig, BaseConfig, Errors, Dashboard, i18nLabels, i18nCommonLabels, i18nDashboardLabels, i18nChartLabels, HighchartsTemplate, ProgressBar, DataExporter, ChartExporter, Exporter, amplify, Handlebars) {

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
        },
        fields: {
            fao_region : 'fao_region'
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
        this.environment = params.environment || BaseConfig.ENVIRONMENT;
        this.topic = params.topic;
        this.model = params.model;

    };


    DashboardView.prototype.modelChanged = function() {
     //   console.log("============= MODEL CHANGED ========");
       //  this.render();
        this.modelUpdated = true;
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

        this.template = template;
        this.modelUpdated = false;
        this.models = {};
        this.titles = [];
        this.subtitles = [];


        this.chartExporter = new ChartExporter();

     //Initialize Progress Bar
        this.progressBar = new ProgressBar({
           container: defaultOptions.PROGRESS_BAR_CONTAINER,
           lang: this.lang
        });

    };


    DashboardView.prototype._downloadExcel = function (modelId) {
         var model = this.models[modelId];
         var title = this.titles[modelId];
         var subtitle = this.subtitles[modelId];

         var dataExporter = new DataExporter({
            lang: this.lang,
            environment:  this.environment
         });

         return dataExporter.downloadData(model,title,subtitle);

    };

    DashboardView.prototype.onDownloadMenuClick = function (event) {
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

    DashboardView.prototype.onPrintMenuClick = function (event) {
        var model = $(event.target).attr('data-model-id');
        var type = $(event.target).attr('data-type');

        if(type) {
            this.chartExporter.print("div[data-item='"+model+"']");
        }else {
            Exporter.print("div[data-item='"+model+"']");
        }



    };

    DashboardView.prototype._updateTemplate = function () {

        var model = this.model.getProperties();

        var data = $.extend(true, model, i18nLabels[this.lang], i18nCommonLabels[this.lang], i18nDashboardLabels[this.lang], i18nChartLabels[this.lang]);

        return this.template(data);

       /* this.$el.html(template);

       this.compiledTemplate = Handlebars.compile(this.source.prop('outerHTML'));

        var model = this.model.getProperties();

        var data = $.extend(true, model);

        return this.compiledTemplate(data);*/

    };

    /*DashboardView.prototype._getTemplateFunction1 = function () {

        var model = this.model.getProperties();

        var data = $.extend(true, model, i18nLabels[this.lang], i18nDashboardLabels[this.lang], i18nChartLabels[this.lang]);

        this.source = $(this.template(data)).find("[data-topic='" + this.topic + "']");

        return this.source;
    };
*/
    DashboardView.prototype._bindEventListeners = function () {

        var self = this;
       // console.log(" =============BIND ===================== ", this.$el);

        // initialize Download buttons
        $.each(this.config.items, function( index, item ) {
            /* var $download = self.$el.find('#'+item.id+'-download');
             $download.on('click', _.bind(self._onDownloadClick, self));

             var $downloadPdf = self.$el.find('#'+item.id+'-pdf');
             $downloadPdf.on('click', _.bind(self._onDownloadChartClick, self));
             */
            var identifier = '#'+item.id;

           // console.log(" ================= IDENTIFIER ", identifier);
           // console.log(" ================= IDENTIFIER this.$el: ", self.$el);




           // console.log(" ================= IDENTIFIER item print  ", $(identifier+"-"+BaseConfig.PRINT));

            for (var key in BaseConfig.DOWNLOAD) {
              //  console.log(" ================= IDENTIFIER item download ", $(identifier+"-"+BaseConfig.DOWNLOAD[key]));

                $(identifier+"-"+BaseConfig.DOWNLOAD[key]).click(_.bind(self.onDownloadMenuClick, self));
            }

            $(identifier+"-"+BaseConfig.PRINT).on('click', _.bind(self.onPrintMenuClick, self));

        });


    };

    DashboardView.prototype._unbindEventListeners = function () {
        var self = this;
      //  console.log(" =====================UNBIND ===================== ", this.config.items);

        // initialize Download buttons
        $.each(this.config.items, function( index, item ) {

            var identifier = '#'+item.id;

            for (var key in BaseConfig.DOWNLOAD) {
                $(identifier+"-"+BaseConfig.DOWNLOAD[key]).unbind('click', _.bind(self.onDownloadMenuClick, self));
            }

            $(identifier+"-"+BaseConfig.PRINT).off('click', _.bind(self.onPrintMenuClick, self));

        });

    };

    DashboardView.prototype.render = function () {
        var self = this;
        this.modelUpdated = false; // reset the model to false

        this._unbindEventListeners();


        // Update the language related labels in the item configurations (charts)
        for (var it in this.config.items) {
            var item = this.config.items[it];
           // console.log(item.id, i18nDashboardLabels[this.lang][item.id])
            this._updateChartExportTitles(this.config.items[it], i18nDashboardLabels[this.lang][item.id], this.model.get('label'));
            this.titles[item.id] = i18nDashboardLabels[this.lang][item.id];
            this.subtitles[item.id] = this.model.get('label');
        }

        var updatedTemplate = this._updateTemplate();
        this.source = $(updatedTemplate).find("[data-topic='" + this.topic + "']");


        // Hide/Show Dashboard Items
        if(this.displayConfigForSelectedFilter)
         this.updateDashboardTemplate(this.displayConfigForSelectedFilter);



       // $(this.source).find('#tot-oda-sector-container').removeClass(defaultOptions.css.COLLAPSE);

        //this.$el.html(updatedTemplate);

        //this.source = $(this.template(data)).find("[data-topic='" + this.topic + "']");

       // return this.source;


        this.$el.html(this.source);

        //console.log(" ============== before BIND ===========");
        this._bindEventListeners();

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
        //console.log('setDash', config.filter);
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

            if (props["recipientcode"] && props["recipientcode"].length > 0)
                this.recipientcode = props["recipientcode"][0];
            else
                this.recipientcode = null;

           // if (props["oda"])
              //  this.config.uid = props["oda"];


        } else {
            this.regioncode = null;
            this.gaulcode = null;
        }
    };

    DashboardView.prototype.updateDashboardTemplate = function (filterdisplayconfig) {

        //console.log("======================= updateDashboardTemplate: filterdisplayconfig ================ ", filterdisplayconfig);

        if (filterdisplayconfig) {

            var hide = filterdisplayconfig.hide;
            var show = filterdisplayconfig.show;

          //  console.log("HIDE: ", hide);
          //  console.log("SHOW: ", show);

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


        //console.log(itemContainerId);
        //console.log(this.source);

        $(this.source).find(itemContainerId).addClass(defaultOptions.css.COLLAPSE);

    };

    DashboardView.prototype._expandDashboardItem = function (itemId) {
        // Show Item container
        var itemContainerId = '#' + itemId + defaultOptions.item_container_id;


      //  console.log(itemContainerId);
      //  console.log($(this.source).find(itemContainerId).hasClass(defaultOptions.css.COLLAPSE));

        $(this.source).find(itemContainerId).removeClass(defaultOptions.css.COLLAPSE);
    };

    DashboardView.prototype.updateItemsConfig = function () {
        this._updateDashboardRegionalMapConfiguration();

        if(this.topic === BaseBrowseConfig.topic.BY_COUNTRY || this.topic === BaseBrowseConfig.topic.BY_COUNTRY_RESOURCE_PARTNER)
            this._updateAddColumnValues();
    };

    DashboardView.prototype._updateDashboardRegionalMapConfiguration = function () {

        var map = _.filter(this.config.items, {id: 'regional-map'})[0];
        var regioncode = this.regioncode;
        var gaulcode = this.gaulcode;
        var regionField = defaultOptions.fields.fao_region;


        // region, is no added to the filter values
        if (map) {
            // Commented out for now as an issue when when no country selected i.e. Country = All, the zoom remains
            if (map.config && map.config.fenix_ui_map) {
                if (gaulcode) {
                    map.config.fenix_ui_map.zoomToCountry = [];
                    map.config.fenix_ui_map.zoomToCountry.push(gaulcode);
                } else {
                    map.config.fenix_ui_map.zoomToCountry = [];
                }
            }
        }

    };

    DashboardView.prototype._updateAddColumnValues = function () {

        //var context = this.displayConfigForSelectedFilter.context, lang = this.lang;

        var lang = this.lang, context = BaseConfig.SELECTORS.RECIPIENT_COUNTRY;

        if(this.recipientcode === 'all' || !this.recipientcode){
            context = BaseConfig.SELECTORS.REGION;
        }

       // console.log(" =========================== this.regioncode ", this.regioncode, this.gaulcode, this.recipientcode, context);

        _.filter(this.config.items, function (a) {
            if (a.type === BaseConfig.DASHBOARD_ITEMS.CHART) {
                _.filter(a.postProcess, function (b) {
                    if(b.name === 'addcolumn' && b.rid){
                        var uid = b.rid.uid;
                        var new_value = i18nLabels[lang][uid+"_"+context];
                          //Update labels
                        if(new_value) {
                            b.parameters.value = new_value;
                        }
                    }
                });
             }
          });

    };

    DashboardView.prototype.rebuildDashboard = function (filter, displayConfigForSelectedFilter) {
        var self = this;

        // Re-render the template
        if (displayConfigForSelectedFilter || this.modelUpdated) {
            if(displayConfigForSelectedFilter){

                this.displayConfigForSelectedFilter =  displayConfigForSelectedFilter;
            }


            this.render();
        }
        //console.log("============ REBUILD =======");
        // Update Dashboard Items Configuration
        this.updateItemsConfig();

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


/*
            // Programmatically-defined buttons
            $(".chart-export").each(function() {
                console.log("HERE ================");
                var jThis = $(this);
                console.log("HERE 2 ============== jThis ", jThis[0]);
                var    chartSelector = jThis.data("chartSelector");

                console.log("HERE 3 ============== chartSelector ", chartSelector);
                 var   chart = $(chartSelector).highcharts();



                console.log("HERE 3 ============== chart ", chart);

                $('#button-pdf').click(function() {
                    alert("HERE ", chart);
                    chart.exportChart({
                        type: 'application/pdf',
                        filename: 'my-pdf'
                    });

                    //chart.exportChartLocal({ type: type });
                });







            /!*    jThis['data-type'].(function() {

                    console.log("data type ============== chart ", this);

                  /!*  var jThis = $(this),
                        type = jThis.data("type");
                    if(Highcharts.exporting.supports(type)) {
                        jThis.click(function() {
                            chart.exportChartLocal({ type: type });
                        });
                    }
                    else {
                        jThis.attr("disabled", "disabled");
                    }*!/
                });*!/
            });*/
        });


        this.dashboard.on('ready.item', function (item) {

            self.models[item.id] = {};
            self.models[item.id].data = {};
            self.models[item.id].data = item.model.data;
            self.models[item.id].metadata = {};
            self.models[item.id].metadata.rid = item.model.metadata.rid;
            self.models[item.id].metadata.uid = item.model.metadata.uid;
            self.models[item.id].metadata.dsd = item.model.metadata.dsd;




            /* $('#button-pdf').click(function() {
                 alert("HERE ");

                 var chart = $('#tot-oda-sector').highcharts();

                 console.log(chart);

                 // chart.exportChart({
                 //   type: 'application/pdf',
                 // filename: 'my-pdf'
                 // });

                 //chart.exportChartLocal({ type: type });
             });*/

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
