/*global define, requirejs*/
define([
    'jquery',
    'underscore',
    'utils/lang-utils',
    'config/config-base',
    'nls/filter'
], function ($, _, LangUtils, BaseConfig, i18nLabels) {

    'use strict';

    var s = {
        values: {
            ALL: 'all'
        }
    };

    function FilterUtils() {
        this.langUtils = new LangUtils();
        return this;
    }


    /**
     * Updates the filter configuration including setting the language related labels in the filter template
     * Returns: Updated Configuration
     * @returns {Object} updatedConf
     * @private
     */
    FilterUtils.prototype.getUpdatedFilterConfig = function (config, lang) {

        var conf = $.extend(true, {}, config),
            values = {},
            updatedConf = this._mergeConfigurations(conf, values);

        _.each(updatedConf, _.bind(function (obj, key) {

            if (!obj.template) {
                obj.template = {};
            }
            //Add i18n label
            obj.template.title = this.langUtils.getI18nLabel(key, i18nLabels[lang], "filter_");
            obj.template.headerIconTooltip = this.langUtils.getI18nLabel(key, i18nLabels[lang], "filter_tooltip_");

        }, this));

        return updatedConf;
    };


    FilterUtils.prototype._mergeConfigurations = function (config, s) {

        var sync = s.toolbar ? s.toolbar : s;

        if (sync) {

            var values = sync.values;

            _.each(values, _.bind(function (obj, key) {

                if (config.hasOwnProperty(key)) {
                    config[key].selector.default = values[key];
                }

            }, this));
        }

        return config;

    };


    /**
     *  Process the time range so that it complies with the expected D3S format
     * @param filter
     * @returns {Object} filter
     */
    FilterUtils.prototype.processTimeRange = function (filter) {

        var year_from = filter.values[BaseConfig.SELECTORS.YEAR_FROM], year_to = filter.values[BaseConfig.SELECTORS.YEAR_TO];

        //reformat to and from years
        filter.values.year[0].value = year_from[0];
        filter.values.year[1].value = year_to[0];

        filter.labels.year.range = year_from[0] + '-' + year_to[0];
        filter.labels[BaseConfig.SELECTORS.YEAR_FROM] = [];
        filter.labels[BaseConfig.SELECTORS.YEAR_TO] = [];

        return filter;
    };


    /**
     *  Process the ODA so that it complies with the expected D3S format
     * @param filter
     * @returns {Object} filter
     */
    FilterUtils.prototype.processODA = function (filter) {

        var enumeration = [], oda = filter.values[BaseConfig.SELECTORS.ODA][0];
        enumeration.push(oda);

        filter.values[BaseConfig.SELECTORS.ODA] = {};
        filter.values[BaseConfig.SELECTORS.ODA].enumeration = enumeration;


        return filter;
    };


    /**
     *  Process the ODA so that it complies with the expected format
     * @param filter
     * @returns {Object} filter
     */
    FilterUtils.prototype.removeODAPrefix = function (filter) {

        var oda = filter.values[BaseConfig.SELECTORS.ODA];

       // var prefix = 'adam_';
        //oda.forEach(function(v,i){ oda[i] = v.slice(prefix.length); });

        return filter;
    };


    FilterUtils.prototype.getPropertiesObject = function (id, value) {
        var additionalProperties = {};
        additionalProperties[id] = value;

        return additionalProperties;
    };

    FilterUtils.prototype._getSelectize = function ($el, id) {
        var filterItem = $el.find("[data-selector="+id+"]")[0];
        var selectize = $(filterItem).find("[data-role=dropdown]")[0].selectize;

        return selectize;
    };

    FilterUtils.prototype.removeAllOption = function (el, id) {
        var selectize = this._getSelectize(el, id);

        // Hide the 'all' item
        $("[data-selector='" +id + "']").addClass("all-item-hidden");

        // Delete 'all' option
        selectize.removeOption(s.values.ALL);

    };

    FilterUtils.prototype.setValue = function (el, id, value) {
        var selectize = this._getSelectize(el, id);

       // selectize.setValue(selectize.search(value).items[0].id);

        selectize.setValue(value);

    };


    FilterUtils.prototype.addAllOption = function (el, id) {
        var selectize = this._getSelectize(el, id);

        $("[data-selector='" + id+ "']").removeClass("all-item-hidden");

        // Add 'all' option
        selectize.addOption(s.values.ALL);

    };


    FilterUtils.prototype.setDefaultValue = function (el, id, defaultValue) {
        var filterItem = el.find("[data-selector="+id+"]")[0];
        var selectize = $(filterItem).find("[data-role=dropdown]")[0].selectize;

        selectize.setValue(defaultValue);

    };

    FilterUtils.prototype.clearSelectize = function (el, id) {
        var filterItem = el.find("[data-selector="+id+"]")[0];
        var selectize = $(filterItem).find("[data-role=dropdown]")[0].selectize;
        selectize.clear(true);
    };






    /**
     *  Get the filter configuration associated to the ID
     * @param id
     * @returns {Object} values
     * @private
     */

    FilterUtils.prototype.getFilterConfigById = function (config, id) {
        var filter;
        $.each(config, function (key, obj) {
            if (key === id) {
                return filter = obj;
            }
        });

        return filter;
    };



    /**
     * Get the Object from the data based on the id (key)
     * @param id
     * @param data
     * @returns {*}
     * @private
     */
    FilterUtils.prototype.getObject = function (id, data) {
        if (_.has(data, id)) {
            if (data[id].length > 0 || !_.isEmpty(data[id])) {
                return data[id];
            }
        }
    };


    return FilterUtils;
});
