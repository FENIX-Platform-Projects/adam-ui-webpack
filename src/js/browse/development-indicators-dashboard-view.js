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
    'nls/common',
    'browse/development-indicators-item',
    'common/data-exporter',
    'common/exporter',
    'amplify-pubsub',
    'handlebars'
], function (log, $, _, template, BaseBrowseConfig, BaseConfig, Errors, Dashboard, i18nLabels, i18nCommonLabels, IndicatorsItem, DataExporter, Exporter, amplify, Handlebars) {

        'use strict';

    var s = {
        css_classes: {
            INDICATORS_DASHBOARD_BROWSE_CONTAINER: '#dashboard-indicators-container'
        },
        id_prefixes: {
            DOWNLOAD_OPTIONS: '-download-options',
            INDICATORS_SECTION: '-indicators-section'
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
        this.template = template;
        this.models = {};
        this.setDashboardConfig();

    };

    DashboardDevelopmentIndicatorsView.prototype._bindEventListeners = function () {

        var self = this;

        // initialize Download buttons
        $.each(this.config.items, function( index, item ) {
            var identifier = '#'+item.id;

            for (var key in BaseConfig.DOWNLOAD) {
                $(identifier+"-"+BaseConfig.DOWNLOAD[key]).click(_.bind(self.onDownloadMenuClick, self));
            }

           $(identifier+"-"+BaseConfig.PRINT).on('click', _.bind(self.onPrintMenuClick, self));

        });


    };

    DashboardDevelopmentIndicatorsView.prototype._unbindEventListeners = function () {
        var self = this;

        // initialize Download buttons
        $.each(this.config.items, function( index, item ) {
            var identifier = '#'+item.id;

            for (var key in BaseConfig.DOWNLOAD) {
                $(identifier+"-"+BaseConfig.DOWNLOAD[key]).unbind('click', _.bind(self.onDownloadMenuClick, self));
            }

            $(identifier+"-"+BaseConfig.PRINT).off('click', _.bind(self.onPrintMenuClick, self));

        });

    };

    DashboardDevelopmentIndicatorsView.prototype.onPrintMenuClick = function (event) {

        var model = $(event.target).attr('data-model-id');

        var container = $("#"+model+ s.id_prefixes.DOWNLOAD_OPTIONS);
        var sectionId = "#"+this.topic+ s.id_prefixes.INDICATORS_SECTION;

        $(container).hide();
        Exporter.print(sectionId);
        $(container).show();
    };

    DashboardDevelopmentIndicatorsView.prototype.onDownloadMenuClick = function (event) {
        event.preventDefault();// prevent the default anchor functionality

        var model = $(event.target).attr('data-model-id');
        var type = $(event.target).attr('data-type');
        var type_id = type.split("/").pop();

        var container = $("#"+model+ s.id_prefixes.DOWNLOAD_OPTIONS);

        switch(type_id) {
            case BaseConfig.DOWNLOAD.EXCEL:
                this._downloadData(model);
                break;
            default:
                this._downloadImage(container, type, type_id, model);
        }

    };

    DashboardDevelopmentIndicatorsView.prototype._downloadData = function (modelId) {
        var modelItem = this.models[modelId];

        var dataExporter = new DataExporter({
            lang: this.lang,
            environment:  this.environment,
        });

        return dataExporter.downloadData(modelItem);
    };

    DashboardDevelopmentIndicatorsView.prototype._downloadImage = function (container, type, type_id, model) {
        var sectionId = "#"+this.topic+ s.id_prefixes.INDICATORS_SECTION;

        $(container).hide();
        Exporter.download(sectionId, type, type_id, model);
        $(container).show();
    };

    DashboardDevelopmentIndicatorsView.prototype._updateTemplate = function () {
        var model = this.model.getProperties();
        var data = $.extend(true, model, i18nLabels[this.lang], i18nCommonLabels[this.lang]);

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
        var self = this;

        // the path to the custom item is registered
        this.config.itemsRegistry = {
            custom: {
                item: IndicatorsItem,
                path: 'browse/development-indicators-item'
            }
        };

        this.dashboard = new Dashboard(this.config);

        this.dashboard.on('indicators_ready', function (item) {

            self._bindEventListeners();

            var id =  self.config.items[0].id;

            if (item.data.size > 0) {
                self.models[id] = {};
                self.models[id].data = item.model.data;
                self.models[id].metadata = {};
                self.models[id].metadata.rid = item.model.metadata.rid;
                self.models[id].metadata.uid = item.model.metadata.uid;
                self.models[id].metadata.dsd = item.model.metadata.dsd;

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
