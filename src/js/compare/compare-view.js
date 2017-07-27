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
], function ($, log, _, FxUtils, template, errorTemplate, 
    i18nLabels, i18nErrors, i18nFilter,
    E, GC, AC, Filter, Analysis, amplify) {

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
        this.currentBoxItem = -1;

    };

    CompareView.prototype._bindEventListeners = function () {

        this.$addBnt.on("click", _.bind(this._onAddBtnClick, this));

        this.analysis.on("ready", _.bind(this._onComponentReady, this));

        //It's triggered when the Visualization Box is added
        this.analysis.on("add", _.bind(this._onComponentAdd, this));

        this.analysis.on("noelem", _.bind(this._onComponentNoElement, this));

        this.filter.on("ready", _.bind(this._onComponentReady, this));
    };

    CompareView.prototype._onComponentReady = function () {

        this.readyComponents++;

        if (this.readyComponents === 2) {
            $("div.fx-box button.btn-fx-toolbar").css("border", "3px solid red");
            $("button.btn-fx-toolbar").css("content", "ebgfwrcd");
            this.$addBnt.prop('disabled', false);
        }
    };

    CompareView.prototype._onComponentAdd = function () {

        this.currentBoxItem++;
        window.setTimeout(_.bind(function () {

            $('button[data-action="toolbar"]').prop('disabled', true);
            //$('button[data-role="filter-btn"]').remove('in');
            $('button[data-role="filter-btn"]').addClass('in-adam');
            $('[data-role="toolbar"]').addClass('in-adam-toolbar');
        }, this), 3000);
    };

    CompareView.prototype._onComponentNoElement = function (param) {

        param.instance.gridItems['fx-box-'+this.currentBoxItem].el.find('button[data-action="toolbar"]').hide();
        param.instance.gridItems['fx-box-'+this.currentBoxItem].el.find('div[data-role="toolbar"]').hide();
        param.instance.gridItems['fx-box-'+this.currentBoxItem].el.find('button[data-role="filter-btn"]').hide();
    };

    CompareView.prototype._onAddBtnClick = function () {
        var config = this._getBoxModelFromFilter();

        log.info(config);

        config.loadResourceServiceQueryParams = {
             perPage: 2001,
             maxSize: 2000
        };
        this.analysis.boxConfig.filterSelection = {};
        this.analysis.boxConfig.filterSelection.notes = this.$el.find(s.FILTER_SUMMARY).text();
        this.analysis.boxConfig.filterSelection.notes = this.analysis.boxConfig.filterSelection.notes.trim();
        this.analysis.add(config);
    };

    CompareView.prototype._getBoxModelFromFilter = function () {

        var config = {},
            values = this.filter.getValues();
        var    from = FxUtils.getNestedProperty("values.year-from", values)[0];
        var    to = FxUtils.getNestedProperty("values.year-to", values)[0];
        var    faoSectorSelected = _.contains(FxUtils.getNestedProperty("values.parentsector_code", values), "9999");
        var    process = this.filter.getValues("fenix", ["recipientcode", "donorcode", "parentsector_code", "purposecode", "oda"]);
        //var    process = this.filter.getValues("plain", ["recipientcode", "donorcode", "parentsector_code", "purposecode", "oda"]);
        var    columns = ["year", "value", "unitcode"];
        var    groupBy = ["year"];
        addToProcess(values, "donorcode");
        addToProcess(values, "recipientcode");
        addToProcess(values, "parentsector_code");
        addToProcess(values, "purposecode");
        //parse oda selection
        var v = process.oda.enumeration[0]; //.substring(5);
        process.oda.enumeration = [v];


        // Filter process value > 0
        process.value = {
            "number": [ { "from": 0.00001 } ]
        };

        //parse parent sector code
        if (faoSectorSelected) {
            var codes =  process.parentsector_code.codes[0].codes;
            process.parentsector_code.codes[0].codes = _.without(codes, "9999");
        }
        //config.uid = "adam_usd_aggregation_table";
        //config.uid = "adam_usd_aggregated_table";
        config.uid = 'adam_compare_analysis';

        config.title = createTitle(values, this.lang);
        process["year"] = {
            time: [{
                from: from,
                to: to
            }]
        };

        config.process = [
            {
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
            }
        ];
        //(1: filter with fao_sector without parentsector_code)
        if( faoSectorSelected &&
            config.process[0].parameters.rows.parentsector_code &&
            config.process[0].parameters.rows.parentsector_code.codes.length > 0 &&
            config.process[0].parameters.rows.parentsector_code.codes[0].codes &&
            config.process[0].parameters.rows.parentsector_code.codes[0].codes.length==0)
        {
            delete config.process[0].parameters.rows.parentsector_code;

            if(_.indexOf(config.process[1].parameters.by,"parentsector_code"))
                config.process[1].parameters.by = _.without(config.process[1].parameters.by,"parentsector_code");
        }

        if (config.process[0].parameters.rows.recipientcode &&
            config.process[0].parameters.rows.recipientcode.codes.length > 0 &&
            config.process[0].parameters.rows.recipientcode.codes[0].codes &&
            config.process[0].parameters.rows.recipientcode.codes[0].codes.length>0) {

                config.process[0].parameters.rows.recipientcode.codes[0].uid = 'crs_recipients'

        }
        return config;

        function addToProcess(values, dimension) {
            var includeIt = !!FxUtils.getNestedProperty("values." + dimension, values)[0];

            if (includeIt) {
                columns.push(dimension);
                groupBy.push(dimension)

            }
        }

        function createTitle(values, lang) {

            var labels = [];

            if(!values) return;

            if(values.labels['donorcode'] && values.values['donorcode'].length)
                labels.push(i18nFilter[lang]["filter_donorcode"]);

            if(values.labels['recipientcode'] && values.values['recipientcode'].length)
                labels.push(i18nFilter[lang]["filter_recipientcode"]);

            if(values.labels['parentsector_code'] && values.values['parentsector_code'].length)
                labels.push(i18nFilter[lang]["filter_parentsector_code"]);

            if(values.labels['purposecode'] && values.values['purposecode'].length)
                labels.push(i18nFilter[lang]["filter_purposecode"]);

            var tit = i18nFilter[lang]['filter_compared_by'].toUpperCase()+ ': ';

            tit += labels.join(" / ");

            return tit;
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

        self.AC = AC({lang: self.lang });

        var fxLang = (self.lang==='en'||self.lang==='fr') ? self.lang : 'en';

        var filterConfig = $.extend(true, {}, self.AC.filter, {
                el: this.$el.find(s.FILTER),
               /// lang: fxLang,
                lang: self.lang,
                summaryEl: this.$el.find(s.FILTER_SUMMARY),
                environment: GC.ENVIRONMENT,
                cache: GC.cache
            }),
            analysisConfig = $.extend(true, {}, self.AC.analysis, {
                el: this.$el.find(s.ANALYSIS),
               // lang: fxLang,
                environment: GC.ENVIRONMENT,
                catalog: false,
                cache: GC.cache
            });

        var filterSelectionNotes = '';
        _.each(filterConfig.selectors, function (value, key) {
            if (!value.template) {
                value.template = {};
            }
            value.template.title = i18nFilter[self.lang]["filter_" + key];
            value.template.headerIconTooltip = i18nFilter[self.lang]["filter_tooltip_" + key];
        });

        this.filter = new Filter(filterConfig);

        this.analysis = new Analysis(analysisConfig);
        $('[data-action = "toolbar"]').attr('disabled','disabled');

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
