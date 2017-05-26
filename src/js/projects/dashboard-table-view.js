/*global define, amplify*/
define([
    'loglevel',
    'jquery',
    'underscore',
    'html/projects/table-dashboard.hbs',
    'fenix-ui-dashboard',
    'utils/utils',
    'config/config-base',
    'config/errors',
    'nls/projects',
    'nls/common',
    'projects/table-item',
    'config/projects/events',
    'projects/table-downloader',
    'common/progress-bar'
], function (log, $, _, template, Dashboard, Utils, BaseConfig, Errors, i18nDashboardLabels, i18nCommonLabels, TableItem, BaseEvents, Downloader, ProgressBar) {

    'use strict';

    var s = {
        item_container_id: '-container',
        PROGRESS_BAR_CONTAINER: '#progress-bar-holder',
        paths: {
            TABLE_ITEM: 'comp-advantage/table-item'
        },
        events: {
            CHANGE: 'change'
        },
        itemTypes: {
            CHART: 'chart'
        },
        css: {
            COLLAPSE: 'collapse'
        }
    };

    /**
     *
     * Creates a new Table View, which is composed of a custom Table and associated filter item
     * Instantiates the FENIX dashboard submodule and responsible for the table dashboard related functionality.
     * @class ProjectsTableView
     * @extends View
     */

    function ProjectsTableView(o) {
        log.info("ComparativeAdvantageTableView");
        log.info(o);

        $.extend(true, this, o);

        this._parseInput(o);

        var valid = this._validateInput();

        if (valid === true) {

            this._init();

            this._attach();

            return this;

        } else {
            log.error("Impossible to create Table View");
            log.error(valid)
        }
    }

    ProjectsTableView.prototype._parseInput = function (params) {
        this.$el = $(this.el);
        this.lang = params.lang || BaseConfig.LANG.toLowerCase();
        this.environment = params.environment || BaseConfig.ENVIRONMENT;
        this.model = params.model;
        this.config =  params.config;
    };


    ProjectsTableView.prototype._init = function () {
        this.template = template;
        this.modelUpdated = false;
        this.models = {};

        //Initialize Progress Bar
        this.progressBar = new ProgressBar({
            container: s.PROGRESS_BAR_CONTAINER,
            lang: this.lang
        });

        this.downloader = new Downloader({
            lang : this.lang,
            environment :  this.environment
        });

    };

    ProjectsTableView.prototype._attach = function () {
        var updatedTemplate = this._updateTemplate();
        this.source = $(updatedTemplate).prop('outerHTML');
        this.$el.html(this.source);
    };


    ProjectsTableView.prototype._bindDownloadEventListeners = function () {
        var self = this;


        // initialize Download buttons
        $.each(this.config.items, function( index, item ) {
            var identifier = '#'+item.id;

            for (var key in BaseConfig.DOWNLOAD) {
                $(identifier+"-"+BaseConfig.DOWNLOAD[key]).click( _.bind(self.onDownloadMenuClick, self));
            }

        });
    };

    ProjectsTableView.prototype._unbindDownloadEventListeners = function () {
        var self = this;

        // initialize Download buttons
        $.each(this.config.items, function( index, item ) {

            var identifier = '#'+item.id;

            for (var key in BaseConfig.DOWNLOAD) {
                $(identifier+"-"+BaseConfig.DOWNLOAD[key]).unbind('click', _.bind(self.onDownloadMenuClick, self));
            }

        });

    };

    ProjectsTableView.prototype.onDownloadMenuClick = function (event) {
        event.preventDefault();// prevent the default functionality

        var modelId = $(event.target).attr('data-model-id');
        var dash = this.getDashboardConfig();

        this.downloader.onDownloadMenuClick(this.models[modelId], "", "", dash.filter.values);

    };

    ProjectsTableView.prototype.modelChanged = function() {
        this.modelUpdated = true;
    };

    ProjectsTableView.prototype._validateInput = function () {

        var valid = true,
            errors = [];

        //Check if $el exist
        if (this.$el.length === 0) {
            errors.push({code: Errors.MISSING_CONTAINER});
            log.warn("Impossible to find dashboard container");
        }

        if (!this.config) {
            errors.push({code: Errors.MISSING_CONFIGURATION});
            log.warn("Impossible to find dashboard config");
        }

        return errors.length > 0 ? errors : valid;
    };

    ProjectsTableView.prototype._updateTemplate = function () {

        var model = this.model.getProperties();
        var data = $.extend(true, model, i18nDashboardLabels[this.lang], i18nCommonLabels[this.lang]);

        return this.template(data);

    };

    ProjectsTableView.prototype._renderDashboard = function (filter) {

        this.config.filter = filter;

        this.config.el = this.$el;
        this.config.items[0].lang = this.lang;
        this.config.environment = this.environment;
        this.config.baseItems = this.config.items;

        // the path to the custom item is registered
        this.config.itemsRegistry = {
            custom: {
                item: TableItem,
                path: s.TABLE_ITEM
            }
        };

        // Build new dashboard
        this.dashboard = new Dashboard(
            this.config
        );

    };

    ProjectsTableView.prototype._disposeDashboards = function () {
        if (this.dashboard && $.isFunction(this.dashboard.dispose)) {
            this.dashboard.dispose();
        }
    };

    //updateDashboardItemConfiguration
    ProjectsTableView.prototype._updateItems = function(itemid, property, values){
        var item = _.filter(this.config.items, {id: itemid})[0];

        if (item) {
            if (item.config && item.config[property]) {
                if (values[0] === 'false' || values[0] === 'true')
                    item.config[property] = $.parseJSON(values[0]); // returns a Boolean
                else
                    item.config[property] = values[0];

            }
        }
    };

    ProjectsTableView.prototype._loadProgressBar = function () {
        var self = this;

        this.progressBar.reset();
        this.progressBar.show();

        this.dashboard.on('ready', function () {
            self.progressBar.finish();
        });

    };

    ProjectsTableView.prototype.rebuildDashboard = function (filter) {

        this.models = {};

        this._disposeDashboards();

        this._unbindDownloadEventListeners();

        // Re-Render the source template
       // if (topic) {
          //  this.topic = topic;
           // this.modelUpdated = false;
            //this._attach();
       // }

        this.modelUpdated = false;
        this._attach();


        this._renderDashboard(filter);

        this._bindDownloadEventListeners();

        this._bindDashboardListeners();

        this._loadProgressBar();

    };

    ProjectsTableView.prototype._bindDashboardListeners = function () {
        var self = this,  increment = 0, percent = Math.round(100 / this.config.items.length);

        this.dashboard.on('ready.item', function (item) {
            self.models[item.id] = {};
            self.models[item.id].data ={};
            self.models[item.id].data = item.model.data;
            self.models[item.id].metadata = {};
            self.models[item.id].metadata.rid = item.model.metadata.rid;
            self.models[item.id].metadata.uid = item.model.metadata.uid;
            self.models[item.id].metadata.dsd = item.model.metadata.dsd;

            increment = increment + percent;
            self.progressBar.update(increment);
        });

        /*this.dashboard.on('table_ready', function (item) {

            var id =  self.config.items[0].id;

            if (item.data.size > 0) {
                self.models[id] = {};
                self.models[id].data = {};
                self.models[id].data = item.model.data;
                self.models[id].metadata = {};
                self.models[id].metadata.rid = item.model.metadata.rid;
                self.models[id].metadata.uid = item.model.metadata.uid;
                self.models[id].metadata.dsd = item.model.metadata.dsd;

            }
        });*/

    };

    ProjectsTableView.prototype.getDashboardConfig = function () {
        return this.config;
    };


    ProjectsTableView.prototype.setDashboardConfig = function (config) {

        this.config = config;
    };

    return ProjectsTableView;
});
