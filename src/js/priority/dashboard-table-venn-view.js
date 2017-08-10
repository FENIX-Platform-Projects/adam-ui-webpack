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
    'priority/table-venn-downloader',
    'amplify-pubsub'
], function (log, $, _, template, Dashboard, Utils, BaseConfig, Errors, i18nDashboardLabels, i18nCommonLabels, TableItem, BaseEvents,  JVennTemplate, BasePriorityAnalysisConfig, ProgressBar, Downloader, amplify) {

    'use strict';

    var s = {
        PROGRESS_BAR_CONTAINER: '#priority-tv-progress-bar-holder',
        paths: {
            TABLE_ITEM: 'priority/table-item'
        },
        itemTypes: {
            CHART: 'chart'
        },
        events: {
            BOOTSTRAP_TABLE_READY : "bootstrap_table_ready"
        },
        increment: 0
    };

    /**
     *
     * Creates a new TableVennDashboardView, which is composed of a custom Table and Venn Chart
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

            this._attach();

            return this;

        } else {
            log.error("Impossible to create TableVennDashboard View");
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


    TableVennDashboardView.prototype._init = function () {
        this.template = template;
        this.modelUpdated = false;
        this.models = {};
        this.titles = [];
        this.venntitle = "";

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

    TableVennDashboardView.prototype._attach = function () {
        var updatedTemplate = this._updateTemplate();
        this.source = $(updatedTemplate).prop('outerHTML');
        this.$el.html(this.source);
    };


    TableVennDashboardView.prototype._bindDownloadEventListeners = function () {
        var self = this;

        // initialize Download buttons
        $.each(this.config.items, function( index, item ) {
            var identifier = '#'+item.id;

            for (var key in BaseConfig.DOWNLOAD) {
                $(identifier+"-"+BaseConfig.DOWNLOAD[key]).click( _.bind(self.onDownloadMenuClick, self));
            }

            $(identifier+"-"+BaseConfig.PRINT).on('click', _.bind(self.onPrintMenuClick, self));

        });
    };

    TableVennDashboardView.prototype._unbindDownloadEventListeners = function () {
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

    TableVennDashboardView.prototype.onDownloadMenuClick = function (event) {
        event.preventDefault();// prevent the default functionality

        var modelId = $(event.target).attr('data-model-id');
        var type = $(event.target).attr('data-type');
        var title = i18nDashboardLabels[this.lang][modelId];
        title=title.replace(/,/g, "")
        var subtitle = "";

        this.downloader.onDownloadMenuClick(this.models[modelId], modelId, type, title, subtitle);

    };

    TableVennDashboardView.prototype.onPrintMenuClick = function (event) {
        event.preventDefault();// prevent the default functionality

        var model = $(event.target).attr('data-model-id');

        this.downloader.onPrintMenuClick(model);

    };

    TableVennDashboardView.prototype.modelChanged = function() {
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

    TableVennDashboardView.prototype._updateTemplate = function () {

        var model = this.model.getProperties();
        var data = $.extend(true, model, i18nDashboardLabels[this.lang], i18nCommonLabels[this.lang]);

        return this.template(data);

    };

    TableVennDashboardView.prototype._renderDashboard = function (filter) {

        var vennDiagramTitle = i18nDashboardLabels[this.lang]["venn-diagram-firstPart"];

        if((filter!=null)&&(typeof filter!='undefined')&&(filter.labels!=null)&&(typeof filter.labels!='undefined')){
            var recipientCodeLabel = i18nDashboardLabels[this.lang]["venn-diagram-oneCountry"];
            var donorCodeLabel = i18nDashboardLabels[this.lang]["venn-diagram-onePartner"];

            if((filter.labels.donorcode!=null)&&(typeof filter.labels.donorcode!='undefined')&&(filter.labels.donorcode.hasOwnProperty('all'))){
                donorCodeLabel = i18nDashboardLabels[this.lang]["venn-diagram-allPartners"];
            }

            if((filter.labels.recipientcode!=null)&&(typeof filter.labels.recipientcode!='undefined')&&(filter.labels.recipientcode.hasOwnProperty('all'))){
                recipientCodeLabel = i18nDashboardLabels[this.lang]["venn-diagram-allCountries"];
            }
        }

        $('#vennDiagramTitle').html(vennDiagramTitle + recipientCodeLabel + donorCodeLabel);

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
        this.config.uid = "adam_combined_priorities_table";
        this.dashboard = new Dashboard(
            this.config
        );

    };

    TableVennDashboardView.prototype._disposeDashboards = function () {
        if (this.dashboard && $.isFunction(this.dashboard.dispose)) {
            this.dashboard.dispose();
        }
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
                // var item =  _.find(this.config.items, function(o){
                //     return o.id === BasePriorityAnalysisConfig.items.VENN_DIAGRAM;
                // });
                // var process = _.filter(item.postProcess, function(obj){
                //     return obj.rid && obj.rid.uid === type;
                // });
                //process[7].parameters.rows.donorcode.codes.codes = [];
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

    TableVennDashboardView.prototype._bindDashboardListeners = function () {
        var percent = Math.round(100 / this.config.items.length);
        s.percent = percent;
        var self = this,  increment = 0;
        s.increment = increment;

        amplify.subscribe(s.events.BOOTSTRAP_TABLE_READY, this, this._modelStore);

        this.dashboard.on('ready.item', function (item) {
            self.models[item.id] = {};
            self.models[item.id].data ={};
            self.models[item.id].data = item.model.data;
            self.models[item.id].metadata = {};
            self.models[item.id].metadata.rid = item.model.metadata.rid;
            self.models[item.id].metadata.uid = item.model.metadata.uid;
            self.models[item.id].metadata.dsd = item.model.metadata.dsd;
            self.titles[item.id] = "";

            increment = s.increment + s.percent;
            s.increment = increment;
            self.progressBar.update(increment);
        });

        this.dashboard.on('table_ready', function (item) {

            var id =  self.config.items[0].id;
            if (item.data.size > 0) {
                self.models[id] = {};
                self.models[id].data = {};
                self.models[id].data = item.model.data;
                self.models[id].metadata = {};
                self.models[id].metadata.rid = item.model.metadata.rid;
                self.models[id].metadata.uid = item.model.metadata.uid;
                self.models[id].metadata.dsd = item.model.metadata.dsd;

                self.titles[item.id] = i18nDashboardLabels[self.lang]["priorities-table"];

            }
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

            $('#venn-diagram-title').html(title);

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




            $('#venn-diagram-info').val(value);

            if(codes.length > 0) {
                amplify.publish(BaseEvents.VENN_ON_CHANGE,{values: {purposecode: codes}});
            } else {
                amplify.publish(BaseEvents.VENN_NO_VALUES);
            }

        });
    };

    TableVennDashboardView.prototype._modelStore = function (item) {

        this.models[item.id] = {};
        this.models[item.id].data ={};
        this.models[item.id].data = item.model.data;
        this.models[item.id].metadata = {};
        this.models[item.id].metadata.rid = item.model.metadata.rid;
        this.models[item.id].metadata.uid = item.model.metadata.uid;
        this.models[item.id].metadata.dsd = item.model.metadata.dsd;

        this.titles[item.id] = i18nDashboardLabels[this.lang]["priorities-table"];

        var increment = s.increment + s.percent;
        s.increment = increment;
        this.progressBar.update(increment);
        if(increment==s.percent){
            this.progressBar.finish();
        }

    };

    TableVennDashboardView.prototype._loadProgressBar = function () {
        var self = this;

        this.progressBar.reset();
        this.progressBar.show();

        this.dashboard.on('ready', function () {
            self.progressBar.finish();
        });

    };

    TableVennDashboardView.prototype.rebuildDashboard = function (filter, topic, props) {

        this.models = {};

        this._disposeDashboards();

        this._unbindDownloadEventListeners();

        if(props)
            this._updateItems(props);

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

    TableVennDashboardView.prototype.getDashboardConfig = function () {
        return this.config;
    };

    TableVennDashboardView.prototype.setDashboardConfig = function (config) {



        this.config = config;

        var baseTemplate =  JVennTemplate;

        // Sets JVenn config for each chart
        _.each(this.config.items, _.bind(function (item) {
            if (!_.isEmpty(item)) {
                if (item.type == s.itemTypes.CHART) {
                    if (item.config.config) {
                        item.config.config = $.extend(true, {}, baseTemplate, item.config.config);
                    } else {
                        item.config.config = $.extend(true, {}, baseTemplate);
                    }
                }
            }

        }, this));

    };

    return TableVennDashboardView;
});
