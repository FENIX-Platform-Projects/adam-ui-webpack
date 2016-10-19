/*global define, requirejs*/
define([
    'jquery',
    'underscore'
], function ($, _) {

    'use strict';


    function LangUtils() {
       return this;
    }


    LangUtils.prototype.getLabel = function (obj) {
       // return obj[requirejs.s.contexts._.config.i18n.locale.toUpperCase()];
    };

    LangUtils.prototype.getLocale = function () {
       // return requirejs.s.contexts._.config.i18n.locale.toUpperCase();
    };


    LangUtils.prototype.setI18nToArray = function (array, labels, prefix) {

        _.each(array, _.bind(function (item) {

            item.text = this.getI18nLabel(item.id, labels, prefix);

            if (Array.isArray(item.children)) {
                this.setI18nToArray(item.children, labels, prefix);
            }

        }, this));

        return array;

    };

    LangUtils.prototype.getI18nLabel = function (id, labels, prefix) {
        return labels[prefix + id];
    };


    return LangUtils;
});
