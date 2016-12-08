/*global define, amplify*/
define([
    'jquery',
    'loglevel',
    'underscore',
    /*'lib/utils',*/
    'fenix-ui-filter-utils',
    'html/compare/compare.hbs',
    'html/compare/error.hbs',
    'nls/compare',
    'nls/errors',
    'nls/filter',
    'config/events',
    'config/config-base',
    'config/compare/config',
    'fenix-ui-filter',
    'fenix-ui-analysis',
    'amplify-pubsub'
], function ($, log, _, /*Utils,*/ FxUtils, template, errorTemplate, i18nLabels, i18nErrors, i18nFilter, E, GC, AC, Filter, Analysis, amplify) {

    'use strict';

    var s = {
        FILTER: "#compare-filter",
        FILTER_SUMMARY: "#compare-filter-summary",
        ANALYSIS: "#compare-analysis",
        ADD_BTN: "#add-btn"
    };

    function CompareView(o) {

        $.extend(true, this, o);

        console.log("Compare ================ ");

  /*      this._parseInput(o);

        var valid = this._validateInput();

        if (valid === true) {

            this._unbindEventListeners();

            this._attach();

            this._init();

            this._render();

            return this;

        } else {
            log.error("Impossible to create Compare By View");
            log.error(valid)
        }*/
    }


    /*  var CompareView = View.extend({

          // Automatically render after initialize
          autoRender: true,

          className: 'analysis-compare',

          template: template,

          getTemplateData: function () {
              return i18nLabels;
          },

          initialize: function (params) {
              this.analyse_type = params.filter;
              this.page = params.page;

              View.prototype.initialize.call(this, arguments);
          },

          _initMenuBreadcrumbItem: function () {
              var label = "";
              var self = this;

              if (typeof self.analyse_type !== 'undefined') {
                  label = i18nLabels[self.analyse_type];
              }

              return Utils.createMenuBreadcrumbItem(label, self.analyse_type, self.page);
          },

          _initVariables: function () {

              this.$addBnt = this.$el.find(s.ADD_BTN);

              this.readyComponents = 0;
          },

          _bindEventListeners: function () {

              this.$addBnt.on("click", _.bind(this._onAddBtnClick, this));

              this.analysis.on("ready", _.bind(this._onComponentReady, this));

              this.filter.on("ready", _.bind(this._onComponentReady, this));
          },

          _onComponentReady: function () {

              this.readyComponents++;

              if (this.readyComponents === 2) {
                  this.$addBnt.prop('disabled', false);
              }
          },

          _onAddBtnClick: function () {
              var config = this._getBoxModelFromFilter();

              log.info(config);

              this.analysis.add(config);
          },

          _getBoxModelFromFilter: function () {

              var config = {},
                  values = this.filter.getValues(),
                  from = FxUtils.getNestedProperty("values.year-from", values)[0],
                  to = FxUtils.getNestedProperty("values.year-to", values)[0],
                  faoSectorSelected = _.contains(FxUtils.getNestedProperty("values.parentsector_code", values), "9999"),
                  process = this.filter.getValues("fenix", ["recipientcode", "donorcode", "parentsector_code", "purposecode", "oda"]),
                  columns = ["year", "value", "unitcode"],
                  groupBy = ["year"];

              addToProcess(values, "donorcode");
              addToProcess(values, "recipientcode");
              addToProcess(values, "parentsector_code");
              addToProcess(values, "purposecode");

              //parse oda selection
              var v = process.oda.enumeration[0].substring(5);
              process.oda.enumeration = [v];

              //parse parent sector code
              if (faoSectorSelected) {
                  var codes =  process.parentsector_code.codes[0].codes;
                  process.parentsector_code.codes[0].codes = _.without(codes, "9999");
              }

              config.uid = "adam_usd_aggregation_table";

              config.title = createTitle(values);

              process["year"] = {
                  time: [{
                      from: from,
                      to: to
                  }]
              };

              config.process = [{
                  name: "filter",
                  parameters: {
                      rows: $.extend(faoSectorSelected ? {
                              "fao_sector": {
                                  "enumeration": [
                                      "1"
                                  ]
                              }
                          } : null, process
                      ),
                      columns: columns
                  }
              },
                  {
                      "name": "group",
                      "parameters": {
                          "by": groupBy,
                          "aggregations": [
                              {
                                  "columns": [
                                      "value"
                                  ],
                                  "rule": "SUM"
                              },
                              {
                                  "columns": [
                                      "unitcode"
                                  ],
                                  "rule": "MAX"
                              }
                          ]
                      }
                  }];

              return config;

              function addToProcess(values, dimension) {

                  var includeIt = !!FxUtils.getNestedProperty("values." + dimension, values)[0];

                  if (includeIt) {
                      columns.push(dimension);
                      groupBy.push(dimension)

                  }
              }

              function createTitle(values) {

                  var labels = [];
                  labels.push(getLabels("recipientcode", values));
                  labels.push(getLabels("donorcode", values));
                  labels.push(getLabels("parentsector_code", values));
                  labels.push(getLabels("purposecode", values));
                  labels.push(getLabels("year-from", values));
                  labels.push(getLabels("year-to", values));

                  labels = cleanArray(labels);

                  return labels.join(" / ");

              }

              function getLabels(field, values) {

                  var labels = [],
                      obj = FxUtils.getNestedProperty("labels." + field, values),
                      keys = Object.keys(obj);

                  for (var i = 0; i < keys.length; i++) {
                      labels.push(obj[keys[i]]);
                  }

                  return labels.length > 0 ? labels.join(", ") : null;
              }

              function cleanArray(actual) {
                  var newArray = [];
                  for (var i = 0; i < actual.length; i++) {
                      if (actual[i]) {
                          newArray.push(actual[i]);
                      }
                  }
                  return newArray;
              }
          },

          _initComponents: function () {

              var filterConfig = $.extend(true, {}, AC.filter, {
                      el: this.$el.find(s.FILTER),
                      summaryEl: this.$el.find(s.FILTER_SUMMARY),
                      environment: GC.ENVIRONMENT,
                      cache: GC.cache
                  }),
                  analysisConfig = $.extend(true, {}, AC.analysis, {
                      el: this.$el.find(s.ANALYSIS),
                      environment: GC.ENVIRONMENT,
                      catalog: false,
                      cache: GC.cache
                  });

              _.each(filterConfig.items, function (value, key) {
                  if (!value.template) {
                      value.template = {};
                  }
                  value.template.title = i18nFilter["filter_" + key];
                  value.template.headerIconTooltip = i18nFilter["filter_tooltip_" + key];
              });

              this.filter = new Filter(filterConfig);

              this.analysis = new Analysis(analysisConfig);

          },

          attach: function () {

              View.prototype.attach.call(this, arguments);

              //update State
              amplify.publish(E.STATE_CHANGE, {menu: 'analyse', breadcrumb: this._initMenuBreadcrumbItem()});

              this._initVariables();

              this._initComponents();

              this._bindEventListeners();

              log.info("Page attached successfully");
          },

          _unbindEventListeners: function () {

              this.$addBnt.off();
          },

          dispose: function () {

              this._unbindEventListeners();

              this.filter.dispose();

              this.analysis.dispose();

              View.prototype.dispose.call(this, arguments);
          }

      });*/

    return CompareView;
});
