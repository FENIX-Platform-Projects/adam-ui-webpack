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

    Handlebars.registerHelper('isI18n', function (lang, keyword) {

        if (typeof keyword === 'object') {
            return keyword[lang.toUpperCase()];
        }
        else {
            return keyword;
        }
    });

    Handlebars.registerHelper('grouped_each', function(every, context, options) {
        var out = "", subcontext = [], i;
        if (context && context.length > 0) {
            for (i = 0; i < context.length; i++) {
                if (i > 0 && i % every === 0) {
                    out += options.fn(subcontext);
                    subcontext = [];
                }
                subcontext.push(context[i]);
            }
            out += options.fn(subcontext);
        }
        return out;
    });

    Handlebars.registerHelper('ifIn', function(value, property, list, options) {

        var subcontext = [], result = list.filter(function( obj ) {
            //console.log(obj[property] + ' - ' + value);
            return obj[property] == value;
        });

        if(result.length > 0)
         subcontext.push(result[0]);

        return options.fn(subcontext);

    });


    Handlebars.registerHelper('divideBy12', function(size) {
        var modulus = 12 % size;

       if(modulus == 0){
           return 12 / size;
        }
       else {
            return Math.floor(12 / size); // round down
        }
    });

    Handlebars.registerHelper('i18n', function (lang, keyword) {

        return keyword[lang.toUpperCase()];
    });

    Handlebars.registerHelper('decimal', function(number) {
        return number.toFixed(2);
    });

    Handlebars.registerHelper('commaSeparator', function(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    });

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
