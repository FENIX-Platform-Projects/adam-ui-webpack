/*global define, requirejs*/
define([
    'jquery',
    'handlebars',
    'underscore'
], function ($, Handlebars, _) {

    'use strict';


    function Utils() {
       return this;
    }

    Utils.prototype.getLabel = function (obj) {
       // return obj[requirejs.s.contexts._.config.i18n.locale.toUpperCase()];
    };

    Utils.prototype.getLocale = function () {
       // return requirejs.s.contexts._.config.i18n.locale.toUpperCase();
    };


    Utils.prototype.sortArray = function (prop, arr) {
        prop = prop.split('.');
        var len = prop.length;

        arr.sort(function (a, b) {
            var i = 0;
            while( i < len ) { a = a[prop[i]]; b = b[prop[i]]; i++; }
            if (a < b) {
                return -1;
            } else if (a > b) {
                return 1;
            } else {
                return 0;
            }
        });
        return arr;
    };


    Utils.prototype.setI18nToJsTreeConfig = function (config, labels) {

        var core = config.core || {},
            data = core.data || [];

        this.setI18nToArray(data, labels, "menu_");

        if (!config.core) {
            config.core = {};
        }

        config.core.data = data;

        return config;
    };

    Utils.prototype.setI18nToArray = function (array, labels, prefix) {

        _.each(array, _.bind(function (item) {

            item.text = this.getI18nLabel(item.id, labels, prefix);

            if (Array.isArray(item.children)) {
                this.setI18nToArray(item.children, labels, prefix);
            }

        }, this));

        return array;

    };

    Utils.prototype.getI18nLabel = function (id, labels, prefix) {
        return labels[prefix + id];
    };


    return Utils;
});
