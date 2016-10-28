/*global define, amplify*/
define([
    'loglevel',
    'jquery',
    'underscore',
    'html/browse/indicators-dashboard.hbs',
    'config/browse/config-browse',
    'config/config-base',
    'config/errors',
    'fenix-ui-dashboard',
    'nls/browse',
    'browse/development-indicators-item',
    'amplify-pubsub',
    'handlebars'
], function (log, $, _, template, BaseBrowseConfig, BaseConfig, Errors, Dashboard, i18nLabels, IndicatorsItem, amplify, Handlebars) {

        'use strict';

    var s = {
        css_classes: {
            INDICATORS_DASHBOARD_BROWSE_CONTAINER: '#dashboard-indicators-container'
        }
    };

    /**
     *
     * Creates a new Development Indicators Dashboard View, which is composed of a custom item
     * Instantiates the FENIX dashboard submodule and responsible for all development indicators dashboard related functionality.
     * @class DashboardDevelopmentIndicatorsView
     * @extends View
     */

    function DashboardDevelopmentIndicatorsView(o) {
        log.info("Indicators Dashboard View");
        log.info(o);

        $.extend(true, this, o);


        this._parseInput(o);

        var valid = this._validateInput();

        if (valid === true) {

            this._unbindEventListeners();

            this._init();

            return this;

        } else {
            log.error("Impossible to create Indicators Dashboard View");
            log.error(valid)
        }
    }

    DashboardDevelopmentIndicatorsView.prototype.modelChanged = function() {
         this.render();
        //alert('model changed');
    };

    DashboardDevelopmentIndicatorsView.prototype._parseInput = function (params) {
        this.$el = $(this.el);
        this.lang = params.lang || BaseConfig.LANG.toLowerCase();
        this.topic = params.topic;
        this.model = params.model;
        this.config = params.config;
        this.environment = params.environment ||  BaseConfig.ENVIRONMENT;
    };

    DashboardDevelopmentIndicatorsView.prototype.setDashboardConfig = function (config) {
        if(config)
            this.config = config;

        this.config.baseItems = this.config.items;
        this.config.environment = this.environment;
    };

    DashboardDevelopmentIndicatorsView.prototype._validateInput = function () {

        var valid = true,
            errors = [];

        //Check if $el exist
        if (this.$el.length === 0) {
            errors.push({code: Errors.MISSING_CONTAINER});
            log.warn("Impossible to find indicators dashboard container");
        }

        if (!this.topic) {
            errors.push({code: Errors.MISSING_CONTEXT});
            log.warn("Undefined topic");
        }

        return errors.length > 0 ? errors : valid;
    };

    DashboardDevelopmentIndicatorsView.prototype._init = function () {
        this._bindEventListeners();
        this.template = template;
        this.setDashboardConfig();
    };

    DashboardDevelopmentIndicatorsView.prototype._bindEventListeners = function () {

    };

    DashboardDevelopmentIndicatorsView.prototype._unbindEventListeners = function () {

    };

    DashboardDevelopmentIndicatorsView.prototype._updateTemplate = function () {
        var model = this.model.getProperties();
        var data = $.extend(true, model, i18nLabels[this.lang]);

        return this.template(data);
    };

    DashboardDevelopmentIndicatorsView.prototype.render = function () {
        var updatedTemplate = this._updateTemplate();
        this.source = $(updatedTemplate).find("[data-topic='" + this.topic + "']");

        this.$el.hide();

        this.$el.html(this.source);
    };



    DashboardDevelopmentIndicatorsView.prototype.renderDashboard = function () {

        this.config.el = this.$el;
        this.config.items[0].topic = this.topic;
        this.config.items[0].lang = this.lang;

        // the path to the custom item is registered
        this.config.itemsRegistry = {
            custom: {
                item: IndicatorsItem,
                path: 'browse/development-indicators-item'
            }
        };

        this.dashboard = new Dashboard(this.config);

        this.dashboard.on('indicators_ready', function (payload) {

            if (payload.data.size > 0) {
                $(this.el).show();
            }

        });

    };

    DashboardDevelopmentIndicatorsView.prototype.rebuildDashboard = function (filter) {

        //console.log("============================= REBUILD DASHBOARD =================");
        // console.log(filter);
        if (this.dashboard && $.isFunction(this.dashboard.refresh)) {
            //console.log("REFRESH");
            this.dashboard.refresh(filter);
        }
    };

    DashboardDevelopmentIndicatorsView.prototype._disposeDashboards = function () {
        if (this.dashboard && $.isFunction(this.dashboard.dispose)) {
            this.dashboard.dispose();
        }
    };



    /* var DashboardDevelopmentIndicatorsView = View.extend({

         // Automatically render after initialize
         autoRender: false,

         className: 'dashboard-indicators',

         // Save the template string in a prototype property.
         // This is overwritten with the compiled template function.
         // In the end you might want to used precompiled templates.
         template: template,

         events: {
             'click .anchor': 'anchor'
         },

         initialize: function (params) {
             this.topic = params.topic;
             this.model.on("change", this.render, this);

             this.source = $(this.template).find("[data-topic='" + this.topic + "']").prop('outerHTML');
             View.prototype.initialize.call(this, arguments);

         },

         getTemplateData: function () {
             return i18nLabels;
         },

         anchor: function (e) {
             e.preventDefault();
             e.stopPropagation();

             var nameLink = e.currentTarget.name;

             $('html, body').animate({
                 scrollTop: $('#' + nameLink).offset().top
             }, 1000);

         },

         render: function () {
             this.setElement(this.container);

             $(this.el).hide();

             $(this.el).html(this.getTemplateFunction());
         },

         attach: function () {
             View.prototype.attach.call(this, arguments);

             this.configUtils = new ConfigUtils();
         },

         getTemplateFunction: function () {
             this.compiledTemplate = Handlebars.compile(this.source);

             var model = this.model.toJSON();
             var data = $.extend(true, model, i18nLabels);


             return this.compiledTemplate(data);
         },

         setDashboardConfig: function (config) {
             this.config = config;
             this.config.baseItems = config.items;
             this.config.environment = GeneralConfig.ENVIRONMENT;
         },


         renderDashboard: function () {

             this.config.el = this.$el;
             this.config.items[0].topic = this.topic;

             // the path to the custom item is registered
             this.config.itemsRegistry = {
                 custom: {
                     path: 'views/browse/development-indicators-item'
                 }
             };

             this.dashboard = new Dashboard(this.config);

             this.dashboard.on('indicators_ready', function (payload) {

                 if (payload.data.size > 0) {
                     $(this.el).show();
                 }

             });

         },

         rebuildDashboard: function (filter) {

             //console.log("============================= REBUILD DASHBOARD =================");
             // console.log(filter);
             if (this.dashboard && $.isFunction(this.dashboard.refresh)) {
                 //console.log("REFRESH");
                 this.dashboard.refresh(filter);
             }
         },

         _disposeDashboards: function () {
             if (this.dashboard && $.isFunction(this.dashboard.dispose)) {
                 this.dashboard.dispose();
             }
         },

         dispose: function () {

             this._disposeDashboards();

             View.prototype.dispose.call(this, arguments);
         }

     });*/

    return DashboardDevelopmentIndicatorsView;
});
