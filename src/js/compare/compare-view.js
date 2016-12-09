/*global define, amplify*/
define([
    'jquery',
    'loglevel',
    'underscore',
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
], function ($, log, _, FxUtils, template, errorTemplate, i18nLabels, i18nErrors, i18nFilter, E, GC, AC, Filter, Analysis, amplify) {

    'use strict';

    var s = {
        FILTER: "#compare-filter",
        FILTER_SUMMARY: "#compare-filter-summary",
        ANALYSIS: "#compare-analysis",
        ADD_BTN: "#add-btn"
    };

    function CompareView(o) {

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

    CompareView.prototype._parseInput = function (params) {
        this.$el = $(this.el);
        this.lang = params.lang.toLowerCase() || GC.LANG.toLowerCase();
        this.environment = params.environment || GC.ENVIRONMENT;
        this.browse_type = params.browse_type;
    };

    CompareView.prototype._validateInput = function () {

        var valid = true,
            errors = [];

        //Check if $el exist
        if (this.$el.length === 0) {
            errors.push({code: E.MISSING_CONTAINER});
            log.warn("Impossible to find browse by container");
        }

        return errors.length > 0 ? errors : valid;
    };

    CompareView.prototype._attach = function () {
        this.template = template(i18nLabels[this.lang]);
        this.$el.append(this.template);
    };

    CompareView.prototype._initVariables = function () {
        this.$addBnt = this.$el.find(s.ADD_BTN);
        this.readyComponents = 0;

    };

    CompareView.prototype._bindEventListeners = function () {

        this.$addBnt.on("click", _.bind(this._onAddBtnClick, this));

        this.analysis.on("ready", _.bind(this._onComponentReady, this));

        this.filter.on("ready", _.bind(this._onComponentReady, this));
    };

    CompareView.prototype._onComponentReady = function () {

        this.readyComponents++;

        if (this.readyComponents === 2) {
            this.$addBnt.prop('disabled', false);
        }
    };


    CompareView.prototype._onAddBtnClick = function () {
        var config = this._getBoxModelFromFilter();

        log.info(config);

        this.analysis.add(config);
    };

    CompareView.prototype._getBoxModelFromFilter = function () {

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
    };

    CompareView.prototype._initComponents = function () {

        var self = this;

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

        _.each(filterConfig.selectors, function (value, key) {
            if (!value.template) {
                value.template = {};
            }
            value.template.title = i18nFilter[self.lang]["filter_" + key];
            value.template.headerIconTooltip = i18nFilter[self.lang]["filter_tooltip_" + key];
        });

        this.filter = new Filter(filterConfig);

        this.analysis = new Analysis(analysisConfig);

    };

    CompareView.prototype._unbindEventListeners = function () {

        if (this.$addBnt) {
            this.$addBnt.off();
        }

    };

    CompareView.prototype._dispose = function () {

        this._unbindEventListeners();

        if (this.filter && $.isFunction(this.filter.dispose)) {
            this.filter.dispose();
        }

        if (this.analysis && $.isFunction(this.analysis.dispose)) {
            this.analysis.dispose();
        }
    };

    return CompareView;
});
