/*global define, amplify*/
define([
    'loglevel',
    'jquery',
    'underscore',
    'html/priority/table-venn-dashboard.hbs',
    'fenix-ui-dashboard',
    'utils/utils',
    'config/config-base',
    'config/errors',
    'nls/priority',
    'nls/common',
    'priority/table-item',
    'config/priority/events',
    'config/nodemodules/fenix-ui-chart-creator/jvenn_template',
    'config/priority/config-priority-analysis',
    'common/progress-bar',
    'common/data-exporter',
    'common/chart-exporter',
    'common/exporter',
    'handlebars',
    'amplify-pubsub'
], function (log, $, _, template, Dashboard, Utils, BaseConfig, Errors, i18nDashboardLabels, i18nCommonLabels, TableItem, BaseEvents,  JVennTemplate, BasePriorityAnalysisConfig, ProgressBar, DataExporter, ChartExporter, Exporter, Handlebars, amplify) {

    'use strict';

    var defaultOptions = {
        container: '-container',
        PROGRESS_BAR_CONTAINER: '#priority-tv-progress-bar-holder',
        paths: {
            TABLE_ITEM: 'priority/table-item'
        },
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
     * Creates a new PrioritiesView, which is composed of a custom Table and Venn Chart
     * Instantiates the FENIX dashboard submodule and responsible for the priorities dashboard related functionality.
     * @class TableVennDashboardView
     * @extends View
     */

    function TableVennDashboardView(o) {
        log.info("TableVennDashboardView");
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

    TableVennDashboardView.prototype._parseInput = function (params) {
        this.$el = $(this.el);
        this.lang = params.lang || BaseConfig.LANG.toLowerCase();
        this.environment = params.environment || BaseConfig.ENVIRONMENT;
        this.topic = params.topic;
        this.model = params.model;
        this.config =  params.config;

    };


    TableVennDashboardView.prototype.modelChanged = function() {
        //   console.log("============= MODEL CHANGED ========");
        //  this.render();
        //alert('model changed');
        this.modelUpdated = true;
    };

    TableVennDashboardView.prototype._validateInput = function () {

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

    TableVennDashboardView.prototype._init = function () {

        this.template = template;
        this.modelUpdated = false;

        this.config.el = this.$el;
        this.config.baseItems = this.config.items;
        this.config.environment = this.environment;
        this.config.items[0].topic = this.topic;
        this.config.items[0].lang = this.lang;

        this.models = {};


      //  this.chartExporter = new ChartExporter();

     //Initialize Progress Bar
        this.progressBar = new ProgressBar({
           container: defaultOptions.PROGRESS_BAR_CONTAINER,
           lang: this.lang
        });

    };

    TableVennDashboardView.prototype._downloadExcel = function (modelId) {
        console.log(" =========== _downloadExcel: MODELS ");
        console.log(this.models);

        var model = this.models[modelId];

        console.log(" =========== _downloadExcel: MODEL ", model, modelId);


        var dataExporter = new DataExporter({
            lang: this.lang,
            environment:  this.environment
        });

        return dataExporter.downloadData(model);

    };


    TableVennDashboardView.prototype.onDownloadMenuClick = function (event) {
        event.preventDefault();// prevent the default anchor functionality

        console.log(" ========= onDownloadMenuClick =========")
        var model = $(event.target).attr('data-model-id');
        var type = $(event.target).attr('data-type');

        console.log("============ model ID  ", model);
        console.log("============ model DATA-TYPE ", type);

        console.log("============ model DATA-TYPE ", type);


        switch(type) {
            case BaseConfig.DOWNLOAD.EXCEL:
                this._downloadExcel(model);
                break;
            //default:
            // this.chartExporter.download("div[data-item='"+model+"']", type, model);

        }

    };


    TableVennDashboardView.prototype.onPrintMenuClick = function (event) {
        console.log(" ==================== onPrintMenuClick =================");

        var model = $(event.target).attr('data-model-id');
        var type = $(event.target).attr('data-type');

        if(type) {
            this.chartExporter.print("div[data-item='"+model+"']");
        }else {
            Exporter.print("div[data-item='"+model+"']");
        }

    };
    TableVennDashboardView.prototype._bindEventListeners = function () {

        var self = this;
         console.log(" =============BIND ===================== ", this.config.items);

        // initialize Download buttons
        $.each(this.config.items, function( index, item ) {
            var identifier = '#'+item.id;

             console.log(" ================= IDENTIFIER ", identifier);
             console.log(" ================= IDENTIFIER this.$el: ", self.$el);


            for (var key in BaseConfig.DOWNLOAD) {
                $(identifier+"-"+BaseConfig.DOWNLOAD[key]).click(_.bind(self.onDownloadMenuClick, self));
            }

            $(identifier+"-"+BaseConfig.PRINT).on('click', _.bind(self.onPrintMenuClick, self));

        });


    };

    TableVennDashboardView.prototype._unbindEventListeners = function () {
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

    TableVennDashboardView.prototype._updateTemplate = function () {

        var model = this.model.getProperties();
        var data = $.extend(true, model, i18nDashboardLabels[this.lang], i18nCommonLabels[this.lang]);

        return this.template(data);

    };



    /* TableVennDashboardView.prototype._bindEventListeners = function () {

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

  TableVennDashboardView.prototype._unbindEventListeners = function () {
        var self = this;

        if(this.config){
            // initialize Download buttons
            $.each(this.config.items, function( index, item ) {

                var identifier = '#'+item.id;

                for (var key in BaseConfig.DOWNLOAD) {
                    $(identifier+"-"+BaseConfig.DOWNLOAD[key]).unbind('click', _.bind(self.onDownloadMenuClick, self));
                }

                $(identifier+"-"+BaseConfig.PRINT).off('click', _.bind(self.onPrintMenuClick, self));

            });
        }
    };*/

    TableVennDashboardView.prototype.render = function () {
        var self = this;
        this.modelUpdated = false; // reset the model to false

        this._unbindEventListeners();

        console.log(" ============== RENDER CALLED  =========== ", this.config.items);

        var updatedTemplate = this._updateTemplate();
        this.source = $(updatedTemplate).prop('outerHTML');

        // Hide/Show Dashboard Items
        //if(this.displayConfigForSelectedFilter)
            //this.updateDashboardTemplate(this.displayConfigForSelectedFilter);


        this.$el.html(this.source);

        console.log(" ============== before BIND ===========");
        this._bindEventListeners();

    };

    TableVennDashboardView.prototype.renderDashboard = function (filter, displayConfigForSelectedFilter) {
        var self = this;


        console.log("============ renderDashboard =======", displayConfigForSelectedFilter, this.modelUpdated);

        // Re-render the template
       //// if (displayConfigForSelectedFilter || this.modelUpdated) {
           // if(displayConfigForSelectedFilter){
//
               // this.displayConfigForSelectedFilter =  displayConfigForSelectedFilter;
         //   }


            this.render();
      //  }


        //  console.log("============ renderDashboard =======", this.config.items);


        this._disposeDashboards();

       // this.config.filter = filter;

        this.config.el = this.$el;
        this.config.items[0].topic = this.topic;
        this.config.items[0].lang = this.lang;
        this.config.environment = this.environment;
        this.config.baseItems = this.config.items;

        console.log("============== renderDashboard ==========");
         console.log(this.config.items);


       // http://fenix.fao.org/d3s_dev/msd/resources/metadata/uid/adam_cpf_undaf_priorities_table?dsd=true&full=true

        //if(this.config.items.length > 0)
            //this.config.items[0].config.topic = this.topic;


        // the path to the custom item is registered
        this.config.itemsRegistry = {
            custom: {
                item: TableItem,
                path: 'priority/table-item'
            }
        };

        //console.log("============== renderDashboard ========== this.config.itemsRegistry");
       // console.log( this.config.itemsRegistry);

        // Build new dashboard
        this.dashboard = new Dashboard(
            self.config
        );

        //console.log("============== renderDashboard  this.dashboard  ==========");
        //console.log( this.dashboard );

        this.dashboard.on('ready.item', function (item) {
            console.log(" ================== item READY 1 : =================== ", item.id,  item.model.data.length, item.model.metadata.dsd.columns.length, item.model.metadata.dsd.columns, item.model.metadata.dsd, item.model.metadata);

            self.models[item.id] = {};
            self.models[item.id].data = item.model.data;
            self.models[item.id].metadata = {};
            self.models[item.id].metadata.rid = item.model.metadata.rid;
            self.models[item.id].metadata.uid = item.model.metadata.uid;
            self.models[item.id].metadata.dsd = item.model.metadata.dsd;


          //  console.log(" ================ ", self.models);

           // increment = increment + percent;
           // self.progressBar.update(increment);
        });

       this.dashboard.on('table_ready', function (item) {


           console.log(" ==================== TABLE READY =========== ", item.model);

            var id =  self.config.items[0].id;

           //console.log(" ================= TABLE READY: id ", id);


            if (item.data.size > 0) {
                self.models[id] = {};
                self.models[id].data = {};
                self.models[id].data = item.model.data;
                self.models[id].metadata = {};
                self.models[id].metadata.rid = item.model.metadata.rid;
                self.models[id].metadata.uid = item.model.metadata.uid;
                self.models[id].metadata.dsd = item.model.metadata.dsd;

            }

           //console.log(" ==================== TABLE READY =========== ", self.models);

        });


        this.dashboard.on('click.item', function (values) {
            //  console.log(" ======================== click.item ", values);

            // reset others
            $("div[id^='resultC']").css('color', 'black');

            //set selected
            $(values.selected).css('color', 'red');

            var listnames = values.listnames;
            var list = values.list;
            var series = values.series;

            var title = "";
            if (listnames.length == 1) {
                title += i18nDashboardLabels[self.lang].prioritiesOnlyIn + " ";
            } else {
                title += i18nDashboardLabels[self.lang].commonPrioritiesIn + " ";
            }

            // get first list
            var firstList = listnames[0];

            // find associated series code/label list
            var seriesCodeLabels= _.find(series,function(rw){
                return rw.name == firstList;
            });

            // title
            var count = 0;
            for (var name in listnames) {
                title += listnames[name];

                if(count < listnames.length-2){
                    title += ", ";
                }

                if(count == listnames.length - 2){
                    title += " "+i18nDashboardLabels[self.lang].and + " ";
                }

                count++;
            }


            $('#'+values.id+'-title').html(title);

            // priorities list
            var value = "";
            var codes = [];
            var codeGroups = [];
            if (seriesCodeLabels) {
                for (var val in list) {
                    var label = list[val];
                    var id = seriesCodeLabels.codelist.find(function(o){
                        if (o.title=== label) {
                            return o;
                        }
                    }).id;


                    codes.push(id);

                    var codeGrp = id.substring(0, 2);

                    if($.inArray(codeGrp, codeGroups) === -1) {
                        codeGroups.push(codeGrp);
                        if(codeGroups.length > 1){
                            value += "\n";
                        }
                    }

                    //value += label + " - " + id+ "\n";
                    value += label + "\n";

                }
            }

            // No priorities
            if(value.length === 0){
                value = i18nDashboardLabels[self.lang].none;
            }


            $('#'+values.id+'-info').val(value);

            if(codes.length > 0) {
                amplify.publish(BaseEvents.VENN_ON_CHANGE,{values: {purposecode: codes}});
            } else {
                amplify.publish(BaseEvents.VENN_NO_VALUES);
            }

        });

        //this._bindEventListeners();
        this._loadProgressBar();


    };

    TableVennDashboardView.prototype._disposeDashboards = function () {
        if (this.dashboard && $.isFunction(this.dashboard.dispose)) {
            this.dashboard.dispose();
        }
    };

    TableVennDashboardView.prototype.getDashboardConfig = function () {
        return this.config;
    };

    TableVennDashboardView.prototype.rebuildDashboard = function (filter, topic, props) {
             var self = this;

            this._disposeDashboards();
            this.config.filter = filter;


       // this.config.el = this.$el;
       // this.config.items[0].topic = this.topic;
       // this.config.items[0].lang = this.lang;
      //  this.config.environment = this.environment;
      //  this.config.baseItems = this.config.items;


        console.log(" ====================== REBUILD DASHBOARD ================== ");


            if(props)
                this._updateItems(props);




            // Re-Render the source template
            if (topic) {
                this.topic = topic;
                this.config.items[0].topic = topic;
                this.source = $(this.template).prop('outerHTML');
                console.log(" ====================== REBUILD DASHBOARD: RENDER CALLED ==================");
                this.render();
            }



           // if(this.config.items.length > 0)
             //   this.config.items[0].config.topic = this.topic;



            // the path to the custom item is registered
            this.config.itemsRegistry = {
                custom: {
                    item: TableItem,
                    path: 'priority/table-item'
                }
            };


            // Build new dashboard
            this.dashboard = new Dashboard(this.config);



            // Bind the events
           // this._bindEventListeners();


            // Load Progress bar
            this._loadProgressBar();



    };



    TableVennDashboardView.prototype._updateItems = function(props){


        var selectionsObj = _.find(props, function(obj){
            if(obj['selections'])
                return obj;
        });

         if (selectionsObj) {
            var selections = selectionsObj['selections'];
            var keys;
            // find item
            for (var idx in selections) {
                var item = selections[idx];


                if(_.contains(Object.keys(item), BasePriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED)){
                    keys = item;
                }


                this._updateDashboardItem(BasePriorityAnalysisConfig.items.VENN_DIAGRAM, item);
            }

            if(keys) {
                var fao = {fao: keys[BasePriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED]};
                this._updateDashboardItem(BasePriorityAnalysisConfig.items.VENN_DIAGRAM, fao);

                // set recipient selection info on table config, to understand selection status
                this.config.items[0].config.selections = keys;
            }
        }
    };


    TableVennDashboardView.prototype._updateDashboardItem = function(itemid, props){

        for(var idx in props){
            var type = idx;
            var value = props[idx];



            // find item

            var item =  _.find(this.config.items, function(o){
                return o.id === itemid;
            });


            // update the process
            if(item) {
                var process = _.filter(item.postProcess, function(obj){
                    return obj.rid && obj.rid.uid === type;
                });

                // update the indicator value
                if(process && process.length === 1)
                    var label = value;
                if(i18nDashboardLabels[this.lang][value])
                    label = i18nDashboardLabels[this.lang][value];


                process[0].parameters.value = i18nDashboardLabels[this.lang][type] + ' ('+ label +')';
            }

        }
    };

    TableVennDashboardView.prototype._loadProgressBar = function () {
        var self = this, increment = 0, percent = Math.round(100 / this.config.items.length);

        this.progressBar.reset();
        this.progressBar.show();


        this.dashboard.on('ready', function () {
            console.log(" ======================= DASHBOARD READY =============");

            self.progressBar.finish();

        });

/*

        this.dashboard.on('ready', function () {
            console.log(" ======================= DASHBOARD READY =============");

            self.progressBar.finish();

        });


        this.dashboard.on('ready.item', function (item) {
               console.log(" ================== item READY 2: =================== ", item.id,  item.model.data.length, item.model.metadata.dsd.columns.length, item.model.metadata.dsd.columns, item.model.metadata.dsd, item.model.metadata);

            self.models[item.id] = {};
            self.models[item.id].data = {};
            self.models[item.id].data = item.model.data;
            self.models[item.id].metadata = {};
            self.models[item.id].metadata.rid = item.model.metadata.rid;
            self.models[item.id].metadata.uid = item.model.metadata.uid;
            self.models[item.id].metadata.dsd = item.model.metadata.dsd;


           // console.log(" ================ ", self.models);

            increment = increment + percent;
            self.progressBar.update(increment);
        });


        this.dashboard.on('click.item', function (values) {

          //  console.log(" ======================== click.item ", values);

            // reset others
            $("div[id^='resultC']").css('color', 'black');

            //set selected
            $(values.selected).css('color', 'red');

            var listnames = values.listnames;
            var list = values.list;
            var series = values.series;

            var title = "";
            if (listnames.length == 1) {
                title += i18nDashboardLabels[self.lang].prioritiesOnlyIn + " ";
            } else {
                title += i18nDashboardLabels[self.lang].commonPrioritiesIn + " ";
            }

            // get first list
            var firstList = listnames[0];

            // find associated series code/label list
            var seriesCodeLabels= _.find(series,function(rw){
                return rw.name == firstList;
            });

            // title
            var count = 0;
            for (var name in listnames) {
                title += listnames[name];

                if(count < listnames.length-2){
                    title += ", ";
                }

                if(count == listnames.length - 2){
                    title += " "+i18nDashboardLabels[self.lang].and + " ";
                }

                count++;
            }


            $('#'+values.id+'-title').html(title);

            // priorities list
            var value = "";
            var codes = [];
            var codeGroups = [];
            if (seriesCodeLabels) {
                for (var val in list) {
                    var label = list[val];
                    var id = seriesCodeLabels.codelist.find(function(o){
                        if (o.title=== label) {
                            return o;
                        }
                    }).id;


                    codes.push(id);

                    var codeGrp = id.substring(0, 2);

                    if($.inArray(codeGrp, codeGroups) === -1) {
                        codeGroups.push(codeGrp);
                        if(codeGroups.length > 1){
                            value += "\n";
                        }
                    }

                    //value += label + " - " + id+ "\n";
                    value += label + "\n";

                }
            }

            // No priorities
            if(value.length === 0){
                value = i18nDashboardLabels[self.lang].none;
            }


            $('#'+values.id+'-info').val(value);

            if(codes.length > 0) {
                amplify.publish(BaseEvents.VENN_ON_CHANGE,{values: {purposecode: codes}});
            } else {
                amplify.publish(BaseEvents.VENN_NO_VALUES);
            }

        });
*/

    };

    TableVennDashboardView.prototype.setDashboardConfig = function (config) {

        this.config = config;
        this.config.baseItems = config.items;
        this.config.environment = this.ENVIRONMENT;

        var baseTemplate =  JVennTemplate;

        // Sets JVenn config for each chart
        _.each(this.config.items, _.bind(function (item) {
            if (!_.isEmpty(item)) {
                if (item.type == defaultOptions.itemTypes.CHART) {
                    if (item.config.config) {
                        item.config.config = $.extend(true, {}, baseTemplate, item.config.config);
                    } else {
                        item.config.config = $.extend(true, {}, baseTemplate);
                    }
                }
            }

        }, this));


    };

    TableVennDashboardView.prototype.updateDashboardItemConfiguration = function (itemid, property, values) {
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

    /*  var PrioritiesView = View.extend({

          // Automatically render after initialize
          autoRender: false,

          className: 'dashboard-priorities',

          // Save the template string in a prototype property.
          // This is overwritten with the compiled template function.
          // In the end you might want to used precompiled templates.
          template: template,

          initialize: function (params) {
              this.topic = params.topic;

              this.model.on(defaultOptions.events.CHANGE, this.render, this);
              this.dashboards = [];

              this.source = $(this.template).prop('outerHTML');

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

                //  this._updateChartExportTitles(this.config.items[it], i18nDashboardLabels[item.id], this.model.get('label'));
              }

              $(this.el).html(this.getTemplateFunction());
          },

          attach: function () {
              View.prototype.attach.call(this, arguments);

              this.$el = $(this.el);

              this.configUtils = new ConfigUtils();
          },


          getTemplateFunction: function () {

              // Update the language related labels in the dashboard template

              this.compiledTemplate = Handlebars.compile(this.source);

              var model = this.model.toJSON();

              var data = $.extend(true, model, i18nLabels, i18nDashboardLabels);

              return this.compiledTemplate(data);

          },

          setDashboardConfig: function (config) {
              this.baseConfig = config;

              this.config = config;
              this.config_type = config.id;
              this.config.baseItems = config.items;
              this.config.environment = GeneralConfig.ENVIRONMENT;

              var baseTemplate =  JVennTemplate;

              // Sets Highchart config for each chart
              _.each(this.config.items, _.bind(function (item) {
                  if (!_.isEmpty(item)) {
                      if (item.type == defaultOptions.itemTypes.CHART) {
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
                      if (values[0] === 'false' || values[0] === 'true')
                          item.config[property] = $.parseJSON(values[0]); // returns a Boolean
                      else
                          item.config[property] = values[0];

                  }
              }
          },

          renderDashboard: function () {
              var self = this;

              this.config.el = this.$el;

              //console.log("============== renderDashboard ==========");
             // console.log(this.config.items);


              if(this.config.items.length > 0)
                  this.config.items[0].config.topic = this.topic;


              // the path to the custom item is registered
              this.config.itemsRegistry = {
                  custom: {
                      path: 'views/analyse/priority_analysis/table-item'
                  }
              };

              this.dashboard = new Dashboard(this.config);

              this._bindEventListeners();

              this._loadProgressBar();

          },

          _disposeDashboards: function () {
              if (this.dashboard && $.isFunction(this.dashboard.dispose)) {
                  this.dashboard.dispose();
              }
          },


          _collapseDashboardItem: function (itemId) {
              // Hide/collapse Item container
              var itemContainerId = '#' + itemId + defaultOptions.container;

              $(this.source).find(itemContainerId).addClass(defaultOptions.css.COLLAPSE);

          },

          _expandDashboardItem: function (itemId) {
              // Show Item container
              var itemContainerId = '#' + itemId + defaultOptions.container;
              $(this.source).find(itemContainerId).removeClass(defaultOptions.css.COLLAPSE);
          },


          _showDashboardItem: function (itemId) {
              // Show Item container
              var itemContainerId = '#' + itemId + defaultOptions.container;
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

                  this._updateItems(props);

                  if (props["oda"])
                      this.config.uid = props["oda"];

              }
          },

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

          rebuildDashboard: function (filter, topic, props) {
              var self = this;

              this._disposeDashboards();
              this.config.filter = filter;


              if(props)
                this._updateItems(props);

            /!*  if(selections) {

                  var keys;
                  // find item
                  for (var idx in selections) {
                      var item = selections[idx];

                      if(_.contains(Object.keys(item), BasePriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED)){
                          keys = item;
                      }

                      this._updateDashboardItem(BasePriorityAnalysisConfig.items.VENN_DIAGRAM, item);
                  }

                  if(keys) {
                      var fao = {fao: keys[BasePriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED]};
                      this._updateDashboardItem(BasePriorityAnalysisConfig.items.VENN_DIAGRAM, fao);

                      // set recipient selection info on table config, to understand selection status
                      this.config.items[0].config.selections = keys;
                  }

              }*!/

              // Re-Render the source template
              if (topic) {
                  this.topic = topic;
                  this.source = $(this.template).prop('outerHTML');
                  this.render();
              }


              if(this.config.items.length > 0)
                  this.config.items[0].config.topic = this.topic;


              // the path to the custom item is registered
              this.config.itemsRegistry = {
                  custom: {
                      path: defaultOptions.paths.TABLE_ITEM
                  }
              };

              // Build new dashboard
              this.dashboard = new Dashboard(this.config);


              // Bind the events
              this._bindEventListeners();

              // Load Progress bar
              this._loadProgressBar();

          },


          _updateItems: function(props){

              var selectionsObj = _.find(props, function(obj){
                  if(obj['selections'])
                      return obj;
              });

              if (selectionsObj) {
                  var selections = selectionsObj['selections'];
                  var keys;
                  // find item
                  for (var idx in selections) {
                      var item = selections[idx];

                      if(_.contains(Object.keys(item), BasePriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED)){
                          keys = item;
                      }

                      this._updateDashboardItem(BasePriorityAnalysisConfig.items.VENN_DIAGRAM, item);
                  }

                  if(keys) {
                      var fao = {fao: keys[BasePriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED]};
                      this._updateDashboardItem(BasePriorityAnalysisConfig.items.VENN_DIAGRAM, fao);

                      // set recipient selection info on table config, to understand selection status
                      this.config.items[0].config.selections = keys;
                  }
              }
          },

          getDashboardConfig: function () {
              return this.config;
          },


          _updateDashboardItem: function(itemid, props){

              for(var idx in props){
                  var type = idx;
                  var value = props[idx];

                  // find item
                  var item =  _.find(this.config.items, function(o){
                      return o.id === itemid;
                  });

                  // update the process
                  if(item) {
                      var process = _.filter(item.postProcess, function(obj){
                          return obj.rid && obj.rid.uid === type;
                      });

                      // update the indicator value
                      if(process && process.length === 1)
                          var label = value;
                          if(i18nDashboardLabels[value])
                              label = i18nDashboardLabels[value];

                          process[0].parameters.value = i18nDashboardLabels[type] + ' ('+ label +')';
                  }

              }
          },


          _loadProgressBar: function () {

              this.progressBar.reset();
              this.progressBar.show();

          },


          _bindEventListeners: function () {

              var self = this, increment = 0, percent = Math.round(100 / this.config.items.length);


              this.dashboard.on('ready', function () {
                  self.progressBar.finish();
              });

              this.dashboard.on('ready.item', function () {
                  increment = increment + percent;
                  self.progressBar.update(increment);
              });

              this.dashboard.on('click.item', function (values) {

                  // reset others
                  $("div[id^='resultC']").css('color', 'black');

                  //set selected
                  $(values.selected).css('color', 'red');

                  var listnames = values.listnames;
                  var list = values.list;
                  var series = values.series;

                  var title = "";
                  if (listnames.length == 1) {
                      title += i18nDashboardLabels.prioritiesOnlyIn + " ";
                  } else {
                      title += i18nDashboardLabels.commonPrioritiesIn + " ";
                  }

                  // get first list
                  var firstList = listnames[0];

                  // find associated series code/label list
                  var seriesCodeLabels= _.find(series,function(rw){
                      return rw.name == firstList;
                  });

                  // title
                  var count = 0;
                  for (var name in listnames) {
                      title += listnames[name];

                      if(count < listnames.length-2){
                          title += ", ";
                      }

                      if(count == listnames.length - 2){
                          title += " "+i18nDashboardLabels.and + " ";
                      }

                      count++;
                  }

                  $('#'+values.id+'-title').html(title);

                  // priorities list
                  var value = "";
                  var codes = [];
                  var codeGroups = [];
                  if (seriesCodeLabels) {
                      for (var val in list) {
                          var label = list[val];
                          var id = seriesCodeLabels.codelist.find(function(o){
                              if (o.title=== label) {
                                  return o;
                              }
                          }).id;


                          codes.push(id);

                          var codeGrp = id.substring(0, 2);

                          if($.inArray(codeGrp, codeGroups) === -1) {
                              codeGroups.push(codeGrp);
                              if(codeGroups.length > 1){
                                  value += "\n";
                              }
                          }

                          //value += label + " - " + id+ "\n";
                          value += label + "\n";

                      }
                  }

                  // No priorities
                  if(value.length === 0){
                     value = i18nDashboardLabels.none;
                  }


                  $('#'+values.id+'-info').val(value);

                  if(codes.length > 0) {
                    amplify.publish(BaseEvents.VENN_ON_CHANGE,{values: {purposecode: codes}});
                  } else {
                    amplify.publish(BaseEvents.VENN_NO_VALUES);
                  }

              });
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

    return TableVennDashboardView;
});
