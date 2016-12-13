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
    'priority/table-item',
    'config/priority/events',
    'config/nodemodules/fenix-ui-chart-creator/jvenn_template',
    'config/priority/config-priority-analysis',
    'common/progress-bar',
    'handlebars',
    'amplify-pubsub'
], function (log, $, _, template, Dashboard, Utils, BaseConfig, Errors, i18nDashboardLabels, TableItem, BaseEvents,  JVennTemplate, BasePriorityAnalysisConfig, ProgressBar, Handlebars, amplify) {

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

            this._unbindEventListeners();
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

        if (!this.topic) {
            errors.push({code: Errors.MISSING_CONTEXT});
            log.warn("Undefined topic");
        }

        return errors.length > 0 ? errors : valid;
    };

    TableVennDashboardView.prototype._init = function () {

        this.template = template;
        this.modelUpdated = false;
        this.models = {};


      //  this.chartExporter = new ChartExporter();

     //Initialize Progress Bar
        this.progressBar = new ProgressBar({
           container: defaultOptions.PROGRESS_BAR_CONTAINER,
           lang: this.lang
        });

    };

    TableVennDashboardView.prototype._updateTemplate = function () {

        var model = this.model.getProperties();
        var data = $.extend(true, model, i18nDashboardLabels[this.lang]);

        return this.template(data);


    };

    TableVennDashboardView.prototype._bindEventListeners = function () {

        var self = this;
        // console.log(" =============BIND ===================== ", this.$el);

        // initialize Download buttons
        $.each(this.config.items, function( index, item ) {
            var identifier = '#'+item.id;
            for (var key in BaseConfig.DOWNLOAD) {
              //  $(identifier+"-"+BaseConfig.DOWNLOAD[key]).click(_.bind(self.onDownloadMenuClick, self));
            }

           // $(identifier+"-"+BaseConfig.PRINT).on('click', _.bind(self.onPrintMenuClick, self));

        });




    };

    TableVennDashboardView.prototype._unbindEventListeners = function () {
        var self = this;

        if(this.config){
            // initialize Download buttons
            $.each(this.config.items, function( index, item ) {

                var identifier = '#'+item.id;

                for (var key in BaseConfig.DOWNLOAD) {
                   // $(identifier+"-"+BaseConfig.DOWNLOAD[key]).unbind('click', _.bind(self.onDownloadMenuClick, self));
                }

               // $(identifier+"-"+BaseConfig.PRINT).off('click', _.bind(self.onPrintMenuClick, self));

            });
        }
    };

    TableVennDashboardView.prototype.render = function () {
        var self = this;
        this.modelUpdated = false; // reset the model to false

        this._unbindEventListeners();

        console.log(" ============== before BIND ===========");

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

        console.log("============== renderDashboard ========== this.config.itemsRegistry");
        console.log( this.config.itemsRegistry);

        // Build new dashboard
        this.dashboard = new Dashboard(
            this.config
        );

        console.log("============== renderDashboard  this.dashboard  ==========");
        console.log( this.dashboard );

       /* this.dashboard.on('indicators_ready', function (item) {

            self._bindEventListeners();

            var id =  self.config.items[0].id;

            if (item.data.size > 0) {
                self.models[id] = {};
                self.models[id].data = item.model.data;
                self.models[id].metadata = {};
                self.models[id].metadata.rid = item.model.metadata.rid;
                self.models[id].metadata.uid = item.model.metadata.uid;
                self.models[id].metadata.dsd = item.model.metadata.dsd;

                $(this.el).show();
            }

        });*/

        this._bindEventListeners();
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

        this.config.el = this.$el;
        this.config.items[0].topic = this.topic;
        this.config.items[0].lang = this.lang;
        this.config.environment = this.environment;
        this.config.baseItems = this.config.items;


             console.log("REBUILD 1 =========", props);


            if(props)
                this._updateItems(props);



            console.log("REBUILD 2 =========", topic);


            // Re-Render the source template
            if (topic) {
                this.topic = topic;
                this.source = $(this.template).prop('outerHTML');
                this.render();
            }


        console.log("REBUILD 3 =========");

            if(this.config.items.length > 0)
                this.config.items[0].config.topic = this.topic;


        console.log("REBUILD 4 =========");

            // the path to the custom item is registered
            this.config.itemsRegistry = {
                custom: {
                    item: TableItem,
                    path: 'priority/table-item'
                }
            };

        console.log("REBUILD 5 =========");

            // Build new dashboard
            this.dashboard = new Dashboard(this.config);

        console.log("REBUILD 6 =========");


            // Bind the events
            this._bindEventListeners();

        console.log("REBUILD 7 =========");

            // Load Progress bar
            this._loadProgressBar();

        console.log("REBUILD 8 =========");


    };



    TableVennDashboardView.prototype._updateItems = function(props){

        console.log("_updateItems ============ props ", props);

        var selectionsObj = _.find(props, function(obj){
            if(obj['selections'])
                return obj;
        });

        console.log("_updateItems ============ selectionsObj ", selectionsObj);
        if (selectionsObj) {
            var selections = selectionsObj['selections'];
            var keys;
            // find item
            for (var idx in selections) {
                var item = selections[idx];

                console.log("ITEM ", item);

                if(_.contains(Object.keys(item), BasePriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED)){
                    keys = item;
                }

                console.log("KEYS ", keys);

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

            console.log(" props[idx] ", props[idx]);


            // find item

            var item =  _.find(this.config.items, function(o){
                return o.id === itemid;
            });

            console.log(" ================== _updateDashboardItem: item ", item);

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

                console.log(" label ", label);

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


        this.dashboard.on('ready.item', function (item) {
            //   console.log(" ================== item READY: =================== ", item.id,  item.model.data.length, item.model.metadata.dsd.columns.length, item.model.metadata.dsd.columns, item.model.metadata.dsd, item.model.metadata);

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


        this.dashboard.on('click.item', function (values) {

            console.log(" ======================== click.item ", values);

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

            console.log(" =================== title ", title);

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

    };

    TableVennDashboardView.prototype.setDashboardConfig = function (config) {
        console.log(" ================================== setDashboardConfig ", config);

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
