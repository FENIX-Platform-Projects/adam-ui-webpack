/*global define, Promise, amplify */

define([
    'jquery',
    'loglevel',
    'underscore',
    'config/errors',
    'config/events',
    'html/partner-matrix/table-item.hbs',
    'fenix-ui-table-creator',
    'fenix-ui-filter',
    'utils/filter-utils',
    'utils/utils',
    'nls/table',
    'nls/filter',
    'fenix-ui-filter-utils',
    'amplify-pubsub'
], function ($, log, _, ERR, EVT,/* C,*/ Template, OlapCreator, Filter, /*FenixTool,*/ FilterUtils, Utils, i18nTableLabels, i18nLabels, FxUtils, amplify) {

    'use strict';

    var Model;

    var s = {
        TABLE_INFO: "#table-info",
        TABLE_FILTER: "#table-filter",
        TABLE: "#table",
        TABLE_SIZE: "#table-size"
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

        var data = $.extend(true, {data:  this.model}, i18nTableLabels[this.lang]);
        var html = this.indicatortemplate(data);

        $(this.el).html(html);
    };

    TableItem.prototype._initVariables = function () {

       // this.fenixTool = new FenixTool();
        this.filterUtils = new FilterUtils();

        //Init status
        this.status = {};

        // pub/sub
        this.channels = {};

        //TODO
    };

    TableItem.prototype._render = function () {


       // this.controller._trigger('table_ready', {model: this.model, data: {size: this.model.size}});

        if (this.model.size > 0) {
            var metadata = this.model.metadata.dsd.columns;
            this._processPayload();

        } else {
            $(this.el).find(s.TABLE_SIZE).html(0);
        }

    };


    TableItem.prototype._processPayload = function () {

        this.config.model = this.model;
        this.config.el = s.TABLE;


        for (var d in this.config.derived) {
            this.config.aggregations.push(d);
        }

        this.olap = new OlapCreator(this.config);
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