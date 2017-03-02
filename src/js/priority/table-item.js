/*global define, Promise, amplify */

define([
    'jquery',
    'loglevel',
    'underscore',
    'config/config-base',
    'config/errors',
    'config/events',
    'html/priority/table-item.hbs',
    'fenix-ui-table-creator',
    'fenix-ui-filter',
    'utils/filter-utils',
    'utils/utils',
    'nls/table',
    'nls/filter',
    'fenix-ui-filter-utils',
    'amplify-pubsub'
], function ($, log, _, ConfigBase, ERR, EVT,/* C,*/ Template, OlapCreator, Filter, /*FenixTool,*/ FilterUtils, Utils, i18nTableLabels, i18nLabels, FxUtils, amplify) {

    'use strict';

    var Model;

    var s = {
        ids: {
            TABLE: "#table",
            TABLE_INFO: "#table-info",
            TABLE_SIZE: "#table-size",
            TABLE_SOURCE: "#table-source",
            CPF: "#cpf",
            UNDAF: "#undaf"
        },
        LINKS_BASE_URL: ConfigBase.ADAM_RESOURCES_CPF_UNDAF_PATH, //  "http://fenix.fao.org/demo/adam-docs/cpf-undaf/",
        CPF: "CPF",
        UNDAF: "UNDAF"
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
        this.indicatortemplate = Template;//Handlebars.compile(Template);

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

       // this.controller._trigger('table_ready', {data: {size: this.model.size}});

        this.controller._trigger('table_ready', {model: this.model, data: {size: this.model.size}});

       // console.log(" ================= RENDER ============== ", this.model);

        if (this.model.size > 0) {
            $(this.el).find(s.TABLE_INFO).addClass("collapse");
            var metadata = this.model.metadata.dsd.columns;

            this._processPayload();

            if(this.config.selections) {
                  if(this.config.selections.recipient !== 'all'){
                    this._processSource();
                }
            }
            else {
                this._processSource();
            }

        } else {
            $(this.el).find(s.TABLE_INFO).removeClass("collapse");
            $(this.el).find(ids.TABLE_SIZE).html(0);
        }

    };


    TableItem.prototype._processPayload = function () {


        this.config.model = this.model;
        this.config.el = s.ids.TABLE;

        var self = this;

        for (var d in this.config.derived) {
            this.config.aggregations.push(d);
        }

        this.olap = new OlapCreator(this.config);

        this.olap.on('ready', function () {
            var rowSize = self.olap.model.rows.length;
            $(self.el).find(s.ids.TABLE_SIZE).html(rowSize);
        });

        //console.log("============ ROWS =============");
        //console.log(this.olap);

        //for(var key in this.olap){
          //  console.log(key);
       // }

    };

    TableItem.prototype._processSource = function () {

        this.config.model = this.model;


        var colIdxCpf;
        var colIdxUndaf;
        var colIdxRecipient;

        for(var col in this.config.model.metadata.dsd.columns){
            var id = this.config.model.metadata.dsd.columns[col].id;

            if(id === 'cpf_period'){
                colIdxCpf = col;
            }

            if(id === 'undaf_period'){
                colIdxUndaf = col;
            }

            if(id === 'recipientcode_'+this.lang.toUpperCase()){
                colIdxRecipient = col;
            }
        }


       var cpfPeriod = _.chain(this.config.model.data).filter(function (x) { return x[colIdxCpf]!== 'NA' }).first().value();
       var undafPeriod = _.chain(this.config.model.data).filter(function (x) { return x[colIdxUndaf]!== 'NA'}).first().value();
       var recipient = _.chain(this.config.model.data).filter(function (x) { return x[colIdxRecipient]!== 'NA' }).first().value();


        if(cpfPeriod && cpfPeriod[colIdxCpf]) {
            cpfPeriod = cpfPeriod[colIdxCpf];
        } else {
            cpfPeriod = ""
        }

        if(undafPeriod && undafPeriod[colIdxUndaf]) {
            undafPeriod =undafPeriod[colIdxUndaf];
        } else {
            undafPeriod = ""
        }

        if(recipient && recipient[colIdxRecipient]) {
            recipient = recipient[colIdxRecipient];
        } else {
            recipient = ""
        }

        //this._createLink(recipient, cpfPeriod, s.CPF);
        this._createLink(recipient, undafPeriod, s.UNDAF);

    };


    TableItem.prototype._createLink = function (recipient, period, type) {

        var self = this;

        $.ajaxPrefilter(function(options){
            if(options.crossDomain && $.support.cors) {
                var http = (window.location.protocol === 'http:' ? 'http:' : 'https:');
                if(options.type.toUpperCase() === "HEAD")
                    options.url = http + '//cors-anywhere.herokuapp.com/'+options.url;
            }
        });

            var text = recipient + ' '+ s[type]+' ' + period ;
            var filename = recipient + '_'+ s[type]+'_'+period+".pdf";
            var link = s.LINKS_BASE_URL+filename;

            $.ajax({
                url: link,
                type: 'HEAD',
                error: function(){
                    $(self.el).find(s.ids.TABLE_SOURCE).find(s.ids[type]).html(text);
                },
                success: function(){
                    $(self.el).find(s.ids.TABLE_SOURCE).find(s.ids[type]).html("<a href='"+link+"' target='_blank'>"+text+"</a>");
                }
            });

    };

    TableItem.prototype._getUpdatedFilterConfig = function (items) {
        var conf = $.extend(true, {}, items),
            values = {},
            updatedConf = FxUtils.mergeConfigurations(conf, values);

        var filterConfig = this.filterUtils.getUpdatedFilterConfig(updatedConf, this.lang, "filter_" + this.topic + "_");

            /* _.each(updatedConf, _.bind(function (obj, key) {

                 if (!obj.template) {
                     obj.template = {};
                 }
                 //Add i18n label
                 obj.template.title = Utils.getI18nLabel(key, i18nLabels, "filter_" + this.topic + "_");

             }, this));

             return updatedConf;*/

        return filterConfig;

    };

    TableItem.prototype._getOlapConfigFromFilter = function () {
        var values = this.filter.getValues();
        var groupedRow = false;

        if (values.values.groupedRow.length > 0) {
            groupedRow = true;
        }

        this.config.groupedRow = groupedRow;

        return this.config;

    };


    TableItem.prototype._destroyCustomItem = function () {
        //TODO
        log.info("Destroyed Custom: " + this.id);
    };

    TableItem.prototype._bindEventListeners = function () {
        var self = this;

       this.olap.on('ready', function () {
          // console.log(" ============= THIS OLAP READY 1 ==========");
            var rowSize = this.olap.model.rows.length;
            $(self.el).find(s.ids.TABLE_SIZE).html(rowSize);
       });
    };

    TableItem.prototype._unbindEventListeners = function () {
        //TODO
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