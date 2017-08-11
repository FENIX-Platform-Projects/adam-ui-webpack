/*global define, Promise, amplify */

define([
    'jquery',
    'loglevel',
    'underscore',
    'config//comp-advantage/config-comp-advantage',
    'config/config-base',
    'config/errors',
    'config/events',
    'html/comp-advantage/table-item.hbs',
    'fenix-ui-table-creator',
    'fenix-ui-filter',
    'utils/filter-utils',
    'utils/utils',
    'nls/table',
    'nls/comp-advantage',
    'fenix-ui-filter-utils',
    'amplify-pubsub',
    'bootstrap-table',
    'bootstrap-table-multiple-sort'
], function ($, log, _, CompAdvantageConfig, BaseConfig, ERR, EVT, Template, OlapCreator, Filter,  FilterUtils, Utils, i18nTableLabels, i18nCompAdvantageLabels, FxUtils, amplify) {

    'use strict';

    var Model;

    var s = {
        TABLE_INFO: "#table-info",
        TABLE_FILTER: "#table-filter",
        TABLE: "#table",
        TABLE_SIZE: "#table-size",
        BOOTSTRAP_TABLE_READY : "bootstrap_table_ready"
    };

    var defaultOptions = {};

    /**
     *
     * Returns a customised item for the Table Dashboard View
     * Formats the payload and renders the table template
     * @class TableItem
     */

    function TableItem(o) {

        var self = this;
        this.model = {};

        $.extend(true, this, defaultOptions, o);
        this.$el = $(this.el);

        this._renderTemplate();

        this._initVariables();

        this._render();

        this._bindEventListeners();

        //force async execution
        window.setTimeout(function () {
            self.status.ready = true;
            amplify.publish(self._getEventName(EVT.SELECTOR_READY), self);
            self._trigger("ready");
        }, 0);

        return this;
    }

    /**
     * Disposition method
     * Mandatory method
     */
    TableItem.prototype.dispose = function () {

        this._dispose();

        log.info("Selector disposed successfully");

    };

    /**
     * refresh method
     * Mandatory method
     */
    TableItem.prototype.refresh = function () {

        log.info("Item refresh successfully");

    };

    /**
     * pub/sub
     * @return {Object} component instance
     */
    TableItem.prototype.on = function (channel, fn, context) {
        var _context = context || this;
        if (!this.channels[channel]) {
            this.channels[channel] = [];
        }
        this.channels[channel].push({context: _context, callback: fn});

        return this;
    };

    TableItem.prototype._trigger = function (channel) {

        if (!this.channels[channel]) {
            return false;
        }
        var args = Array.prototype.slice.call(arguments, 1);
        for (var i = 0, l = this.channels[channel].length; i < l; i++) {
            var subscription = this.channels[channel][i];
            subscription.callback.apply(subscription.context, args);
        }

        return this;
    };

    TableItem.prototype._getStatus = function () {
        return this.status;
    };

    TableItem.prototype._renderTemplate = function () {
        this.indicatortemplate = Template;

        var path = BaseConfig.ADAM_RESOURCES_DOCS_PATH + CompAdvantageConfig.COMPARATIVE_ADVANTAGE_DESC_FILE;
        var data = $.extend(true, {data:  this.model, path: path}, i18nTableLabels[this.lang], i18nCompAdvantageLabels[this.lang]);
        var html = this.indicatortemplate(data);

        $(this.el).html(html);
    };

    TableItem.prototype._initVariables = function () {

       // this.fenixTool = new FenixTool();
       // this.filterUtils = new FilterUtils();

        //Init status
        this.status = {};

        // pub/sub
        this.channels = {};

        //TODO
    };

    TableItem.prototype._render = function () {


       // this.controller._trigger('table_ready', {model: this.model, data: {size: this.model.size}});

        if (this.model.size > 0) {
            $(this.el).find(s.TABLE_INFO).addClass("collapse");
            var metadata = this.model.metadata.dsd.columns;
            this._processPayload();

        } else {
            $(this.el).find(s.TABLE_INFO).removeClass("collapse");
            $(this.el).find(s.TABLE_SIZE).html(0);
        }

    };


    TableItem.prototype._processPayload = function () {

        this.config.model = this.model;
        this.config.el = s.TABLE;
        this.config.id = this.id;
        this.config.lang = this.lang;


       // for (var d in this.config.derived) {
         //   this.config.aggregations.push(d);
        //}

        this.olap = new OlapCreator(this.config);
    };

    TableItem.prototype._processPayload = function () {

        this.config.model = this.model;
        this.config.el = s.TABLE;
        this.config.id = this.id;
        this.config.lang = this.lang;

        var configData = this.config.model.data;
        amplify.publish( s.BOOTSTRAP_TABLE_READY, this.config );

        var col1 = this.config.rows[0];
        var col2 = this.config.rows[1];
        var col3 = this.config.rows[2];
        var col4 = this.config.rows[3];
        var col5 = this.config.rows[4];
        var col6 = this.config.rows[5];
        var col7 = this.config.rows[6];

        var table = $(this.el).find(s.TABLE);
        table.data("row-style", function (row, index) {
            if(row['ratio']== "YES"){
                return {
                    css: {"background-color": "rgba(0, 128, 0, 0.40)"}
                };
            }
            else {
                return {
                        css: {"background-color": "white"}
                };
            }
        })
        $(table).find("#col1").data('field', col1);
        $(table).find("#col2").data('field', col2);
        $(table).find("#col3").data('field', col3);
        $(table).find("#col4").data('field', col4);
        $(table).find("#col5").data('field', col5);
        $(table).find("#col6").data('field', col6);
        $(table).find("#col7").data('field', col7);

        var columns = this.config.model.metadata.dsd.columns;
        var columnsIndex = {};
        for(var i = 0; i<this.config.model.metadata.dsd.columns.length; i++){
            var columnId = this.config.model.metadata.dsd.columns[i].id;
            var columnTitle = this.config.model.metadata.dsd.columns[i].title[this.config.lang.toUpperCase()];

            switch(columnId){
                case col1:
                    $(table).find("#col1").html(columnTitle);
                    columnsIndex["col1"] = i;
                    break;
                case col2:
                    $(table).find("#col2").html(columnTitle);
                    columnsIndex["col2"] = i;
                    break;
                case col3:
                    $(table).find("#col3").html(columnTitle);
                    columnsIndex["col3"] = i;
                    break;
                case col4:
                    $(table).find("#col4").html(columnTitle);
                    columnsIndex["col4"] = i;
                    break;
                case col5:
                    $(table).find("#col5").html(columnTitle);
                    columnsIndex["col5"] = i;
                    break;
                case col6:
                    $(table).find("#col6").html(columnTitle);
                    columnsIndex["col6"] = i;
                    break;
                case col7:
                    $(table).find("#col7").html(columnTitle);
                    columnsIndex["col7"] = i;
                    break;
            }
        }

        var data = [];
        //this.config.rows
        for(var i = 0; i<this.config.model.data.length; i++)
        {
            var elem = this.config.model.data[i];
            var obj = {};
            obj[col1] = elem[columnsIndex["col1"]];//5
            obj[col2] = elem[columnsIndex["col2"]];//6
            obj[col3] = elem[columnsIndex["col3"]];//2
            obj[col4] = elem[columnsIndex["col4"]];//3
            obj[col5] = elem[columnsIndex["col5"]];//4
            obj[col6] = elem[columnsIndex["col6"]];//4
            obj[col7] = elem[columnsIndex["col7"]];//4
            data.push(obj);
        }

        $(s.TABLE).bootstrapTable({
            data: data,
            sortName: 'ratio',
            sortOrder: "desc"
        });
    };

    TableItem.prototype._destroyCustomItem = function () {
        //TODO
        log.info("Destroyed Custom: " + this.id);
    };

    TableItem.prototype._bindEventListeners = function () {
        var self = this;

       this.olap.on('ready', function () {
            var rowSize = this.olap.model.rows.length;
            $(self.el).find(s.TABLE_SIZE).html(rowSize);
       });
    };

    TableItem.prototype._unbindEventListeners = function () {
       //this.olap.off('ready');
       //this.filter.off('ready');
    };

    TableItem.prototype._dispose = function () {

        this._unbindEventListeners();

        this._destroyCustomItem();

    };

    TableItem.prototype._getEventName = function (evt) {

        return this.controller.id + evt;
    };

    return TableItem;

});