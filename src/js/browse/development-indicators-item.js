/*global define, Promise, amplify */

define([
    'jquery',
    'loglevel',
    'underscore',
    'config/config-base',
    'config/errors',
    'config/events',
    'html/browse/indicators-country.hbs',
    'html/browse/indicators-donor.hbs',
    'nls/browse',
    'handlebars',
    'amplify-pubsub'
], function ($, log, _, ERR, EVT, C, indicatorsCountryTemplate, indicatorsDonorTemplate, i18nLabels, Handlebars, amplify) {

    'use strict';

    var defaultOptions = {
        indicatorsOrder: ['INCOME.LEVEL', 'POP.TOT', 'NET.ODA.REC', 'SI.POV.GINI', 'NY.GNP.ATLS.CD', 'RUR.POP.PERC', 'NET.ODA.REC.PC', 'ODA.GNI', 'NY.GNP.PCAP.CD', 'NODA', 'AGRI.LAND.PERC', 'DT.ODA.ODAT.GN.ZS'],
        indicatorProperties: {
            CODE: 'code',
            GINI_CODE: 'SI.POV.GINI'
        },
        context: {
            DONOR: 'donor',
            COUNTRY: 'country'
        }
    };

    /**
     *
     * Returns a customised item for the Development Indicators Dashboard View
     * Formats the payload and renders the development indicators template
     * @class DevelopmentIndicatorsItem
     */

    function DevelopmentIndicatorsItem(o) {

        var self = this;

        $.extend(true, this, defaultOptions, o);
        this.$el = $(this.el);

        console.log("-------------------------------- this.model ----------------");
        console.log(this);
        console.log("LANG: ", this.lang);
        console.log("MODEL: ",  this.model);

        this._renderTemplate();

        this._initVariables();

        this._render();

        this._bindEventListeners();

        //force async execution
        window.setTimeout(function () {
            self.status.ready = true;
           // amplify.publish(self._getEventName(EVT.SELECTOR_READY), self);
            self._trigger("ready");
        }, 0);

        return this;
    }

    /**
     * Disposition method
     * Mandatory method
     */
    DevelopmentIndicatorsItem.prototype.dispose = function () {

        this._dispose();

        log.info("Selector disposed successfully");

    };

    /**
     * refresh method
     * Mandatory method
     */
    DevelopmentIndicatorsItem.prototype.refresh = function () {

        log.info("Item refresh successfully");

    };

    /**
     * pub/sub
     * @return {Object} component instance
     */
    DevelopmentIndicatorsItem.prototype.on = function (channel, fn, context) {
        var _context = context || this;
        if (!this.channels[channel]) {
            this.channels[channel] = [];
        }
        this.channels[channel].push({context: _context, callback: fn});

        return this;
    };

    DevelopmentIndicatorsItem.prototype._trigger = function (channel) {

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

    DevelopmentIndicatorsItem.prototype._getStatus = function () {
        return this.status;
    };

    DevelopmentIndicatorsItem.prototype._renderTemplate = function () {

      //  var indicatorsPartial = Handlebars.compile(indicatorPartialTemplate);
       // Handlebars.registerPartial('indicatorPartial', indicatorPartialTemplate);

      //  var indicatorsFooterPartial = Handlebars.compile(footerPartialTemplate);
       // Handlebars.registerPartial('indicatorsFooterPartial', footerPartialTemplate);

        this.indicatortemplate = indicatorsCountryTemplate;

        if (this.topic == this.context.DONOR) {
            this.indicatortemplate = indicatorsDonorTemplate;
        }

        console.log(this.indicatortemplate);

    };

    DevelopmentIndicatorsItem.prototype._initVariables = function () {

        //Init status
        this.status = {};

        // pub/sub
        this.channels = {};

        //TODO
    };

    DevelopmentIndicatorsItem.prototype._render = function () {


        this.controller._trigger('indicators_ready', {data: {size: this.model.size}});

        if (this.model.size > 0) {
            var metadata = this.model.metadata.dsd.columns;
            var data = this._processPayload(this.model.data, metadata);
            data = $.extend(true, data, i18nLabels[this.lang]);


            var html = this.indicatortemplate({data: data});
           // var html = this.indicatortemplate(data);

            $(this.el).html(html);

            $(this.el).find('.anchor').click(function(e) {
                e.preventDefault();
                e.stopPropagation();

                var nameLink = e.currentTarget.name;

                $('html, body').animate({
                    scrollTop: $('#' + nameLink).offset().top
                }, 1000);

            });
        }

    };


    DevelopmentIndicatorsItem.prototype._processPayload = function (data, metadata) {

        var valueIndex = this._findWithAttr(metadata, "id", "value"),
            sourceIndex = this._findWithAttr(metadata, "id", "source"),
            noteIndex = this._findWithAttr(metadata, "id", "note"),
            periodIndex = this._findWithAttr(metadata, "id", "period"),
            linkIndex = this._findWithAttr(metadata, "id", "link"),
            indicatorcodeIndex = this._findWithAttr(metadata, "id", "indicatorcode"),
            itemnameIndex = this._findWithAttr(metadata, "id", "itemcode_" + this.lang.toUpperCase()),
            indicatornameIndex = this._findWithAttr(metadata, "id", "indicatorcode_" + this.lang.toUpperCase()),
            unitnameIndex = this._findWithAttr(metadata, "id", "unitcode_" + this.lang.toUpperCase());

        var newdata = {};
        var indicators = [],
            footnote = [],
            linkArray = [],
            sourceArray = [];

        var results = [], results2 = [], count = 1;
        var hasGINI = false;

        // Create Array of Indicator Objects
        for (var i = 0, len = data.length; i < len; ++i) {
            var indicatorObj = {};

            indicatorObj.name = data[i][indicatornameIndex];
            indicatorObj.css = data[i][indicatorcodeIndex];
            indicatorObj.code = data[i][indicatorcodeIndex];
            indicatorObj.item = data[i][itemnameIndex];
            indicatorObj.value = data[i][valueIndex];
            indicatorObj.period = data[i][periodIndex];
            indicatorObj.source = data[i][sourceIndex];
            indicatorObj.note = data[i][noteIndex];
            indicatorObj.link = data[i][linkIndex];
            indicatorObj.unit = data[i][unitnameIndex];

            // Track the presence of the
            if (indicatorObj.code === this.indicatorProperties.GINI_CODE) {
                hasGINI = true;
            }

            if (indicatorObj.unit === null) {
                indicatorObj.unit = "";
            }

            if (indicatorObj.value === null && indicatorObj.item) {
                indicatorObj.value = indicatorObj.item;
            }

            if (indicatorObj.source === null) {
                indicatorObj.source = "";
            }

            if (indicatorObj.css)
                indicatorObj.css = indicatorObj.css.replace(/\./g, "_");

            indicators.push(indicatorObj);

        }


        // Reorder the Indicators Array, based on the 'code' order in the indicators order Array
        indicators = this._reorderArrayByProperty(this.indicatorsOrder, indicators, this.indicatorProperties.CODE);

        // Add the Footnote details to the reordered indicators

        for (var j = 0, len = indicators.length; j < len; ++j) {
            var indicatorObj = indicators[j];

            if ($.inArray(indicatorObj.source + indicatorObj.note, results) < 0) {

                var sourceObj = {};
                indicatorObj.footnote = count;
                sourceObj.sourceid = indicatorObj.source + indicatorObj.note;

                if (indicatorObj.source.split(";").length > 0) {
                    sourceObj.sourceArray = indicatorObj.source.split(";")
                } else if (indicatorObj.source) {
                    sourceObj.sourceArray = sourceArray.push(indicatorObj.source);
                }

                if (indicatorObj.link.split(";").length > 0) {
                    sourceObj.linkArray = indicatorObj.link.split(";")
                } else if (indicatorObj.link) {
                    sourceObj.linkArray = linkArray.push(indicatorObj.link);
                }

                sourceObj.link = indicatorObj.link;
                sourceObj.note = indicatorObj.note;

                if (indicatorObj.source.length === 0)
                    sourceObj.source = indicatorObj.note;
                else
                    sourceObj.source = indicatorObj.source + ": " + indicatorObj.note;

                sourceObj.footnote = count;

                results.push(indicatorObj.source + indicatorObj.note);
                footnote.push(sourceObj);
                count++;
            } else {
                var result = _.findWhere(footnote, {sourceid: indicatorObj.source + indicatorObj.note});

                indicatorObj.footnote = result.footnote;
            }
        }

        newdata.indicators = indicators;

        if (hasGINI)
            newdata.colIdx = 3;
        else
            newdata.colIdx = 4;

        newdata.footnotes = footnote;

        // console.log(newdata);
          console.log(newdata.indicators);
        // console.log(newdata.footnotes);

        return newdata;
    };


    DevelopmentIndicatorsItem.prototype._findWithAttr = function (array, attr, value) {
        for (var i = 0; i < array.length; i += 1) {
            if (array[i][attr] === value) {
                return i;
            }
        }
    };


    DevelopmentIndicatorsItem.prototype._reorderArrayByProperty = function (array_with_order, array_to_order, orderByProperty) {
        var reordered_array = [],
            len = array_to_order.length,
            index, current;

        for (; len--;) {
            current = array_to_order[len];
            index = array_with_order.indexOf(current[orderByProperty]);
            reordered_array[index] = current;
        }

        // filters out any undefined items in the reordered array
        reordered_array = reordered_array.filter(function (e) {
            return e
        });

        return reordered_array;

    };

    DevelopmentIndicatorsItem.prototype._destroyCustomItem = function () {

        //TODO

        log.info("Destroyed Custom: " + this.id);
    };

    DevelopmentIndicatorsItem.prototype._bindEventListeners = function () {
        // amplify.subscribe(s.events.CUSTOM_ITEM_COUNTRY_RESPONSE, this, this._showCountryIndicators);
    };

    DevelopmentIndicatorsItem.prototype._unbindEventListeners = function () {
        //TODO
    };

    DevelopmentIndicatorsItem.prototype._dispose = function () {

        this._unbindEventListeners();

        this._destroyCustomItem();

    };

    DevelopmentIndicatorsItem.prototype._getEventName = function (evt) {

        return this.controller.id + evt;
    };

    return DevelopmentIndicatorsItem;

});