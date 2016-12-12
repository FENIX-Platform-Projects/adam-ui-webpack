/*global define, amplify*/
define([
    'loglevel',
    'jquery',
    'jquery-ui',
    'underscore',
    'common/title-view',
    'priority/priority-filter-view',
    'priority/dashboard-charts-view',
    'priority/dashboard-table-venn-view',
    'models/dashboard',
    'models/table',
    'html/priority/priority.hbs',
    'config/config-base',
    'config/events',
    'config/errors',
    'config/config-base',
    'config/priority/events',
    'config/priority/config-table',
    'config/priority/config-charts',
    'config/priority/config-priority-analysis',
    'config/priority/config-filter',
    'utils/utils',
    'amplify-pubsub'
], function (log, $, $UI, _, TitleSubView, FilterSubView, DashboardChartsSubView, DashboardTableVennSubView, DashboardModel, TableModel, template, BaseConfig, Events, Errors, GeneralConfig, BasePriorityAnalysisEvents, TableConfig, ChartsConfig, BasePriorityAnalysisConfig, BaseFilterConfig, Utils, amplify) {

    'use strict';

    var s = {
        css_classes: {
            TITLE_BAR_ITEMS: "#priority-fx-title-items",
            FILTER_HOLDER: "#priority-filter-holder",
            DASHBOARD_CHARTS_HOLDER: "#priority-charts-content",
            DASHBOARD_TABLE_VENN_HOLDER: "#priority-table-venn-content"
        },
        dashboardModel: {
            LABEL: 'label'
        },
        values: {
            ALL: 'all'
        },
        paths: {
            VENN_CONFIG: 'config/priority/config-venn-'
        }
    };


    /**
     *
     * Creates a new Priority Analysis View
     * Resource Priority Analysis View comprises of a series of subviews: title view, filter view and 2 dashboard views (prioritiesDashboard and chartsDashboard)
     * @class PriorityAnalysisView
     * @extends View
     */

    function PriorityAnalysisView(o) {
        // log.info("PriorityAnalysisView");
        //  log.info(o);

        $.extend(true, this, o);

        this._parseInput(o);

        var valid = this._validateInput();

        if (valid === true) {

            this._unbindEventListeners();

            this._attach();

            this._bindEventListeners();

            this._init();

            this._render();

            return this;

        } else {
            log.error("Impossible to create Browse By View");
            log.error(valid)
        }
    }

    PriorityAnalysisView.prototype._parseInput = function (params) {
        this.$el = $(this.el);
        this.lang = params.lang.toLowerCase() || GeneralConfig.LANG.toLowerCase();
        this.environment = params.environment || GeneralConfig.ENVIRONMENT;
        this.topic = BasePriorityAnalysisConfig.dashboard.DEFAULT_TOPIC;
    };

    PriorityAnalysisView.prototype._validateInput = function () {

        var valid = true,
            errors = [];

        //Check if $el exist
        if (this.$el.length === 0) {
            errors.push({code: Errors.MISSING_CONTAINER});
            log.warn("Impossible to find browse by container");
        }

        return errors.length > 0 ? errors : valid;
    };

    PriorityAnalysisView.prototype._attach = function () {
        this.template = template;
        this.$el.append(this.template);
    };

    PriorityAnalysisView.prototype._init = function () {
        this.subviews = {};
    };

    PriorityAnalysisView.prototype._bindEventListeners = function () {
       amplify.subscribe(BasePriorityAnalysisEvents.FILTER_ON_READY, this, this._filtersLoaded);
        amplify.subscribe(BasePriorityAnalysisEvents.FILTER_ON_CHANGE, this, this._filtersChanged);
        amplify.subscribe(BasePriorityAnalysisEvents.VENN_ON_CHANGE, this, this._renderChartsDashboards);
       amplify.subscribe(BasePriorityAnalysisEvents.VENN_NO_VALUES, this, this._clearChartsDashboards);
    };

    PriorityAnalysisView.prototype._unbindEventListeners = function () {
        // Remove listeners
        amplify.unsubscribe(BasePriorityAnalysisEvents.FILTER_ON_READY, this._filtersLoaded);
        amplify.unsubscribe(BasePriorityAnalysisEvents.FILTER_ON_CHANGE, this._filtersChanged);
        amplify.unsubscribe(BasePriorityAnalysisEvents.VENN_ON_CHANGE, this._renderChartsDashboards);
        amplify.unsubscribe(BasePriorityAnalysisEvents.VENN_NO_VALUES, this._clearChartsDashboards);
    };


    PriorityAnalysisView.prototype._render = function () {
        this._loadConfigurations();
    };

    /**
    * Based on the topic, which is determined by the current filter selections (see filter-view)
    * the appropriate dashboard JS configuration files are loaded via requireJS
    * @private
    */
    PriorityAnalysisView.prototype._loadConfigurations = function () {
        var pth1 = s.paths.VENN_CONFIG + this.topic + '.js';

        require(['../../'+pth1], _.bind(this._initSubViews, this));
    };


    /**
    * Initializes all sub views: Title, Filter, Priorities Dashboard and Charts Dashboard
    * @param VennConfig Venn Item configuration
    * @private
    */

    PriorityAnalysisView.prototype._initSubViews = function (VennConfig) {

        // Filter Configuration
        if (!BaseFilterConfig || !BaseFilterConfig.filter) {
            alert("Impossible to find filter configuration for the topic: " + this.topic);
            return;
        }


        // Charts Dashboard Configuration
        if (!ChartsConfig || !ChartsConfig.dashboard) {
            alert("Impossible to find CHARTS dashboard/filter configuration for the topic: " + this.topic);
            return;
        }

        // Table Dashboard Configuration
        if (!TableConfig || !TableConfig.dashboard) {
            alert("Impossible to find TABLE dashboard configuration for the topic: " + this.topic);
            return;
        }

        // Venn Configuration
        if (!VennConfig || !VennConfig.dashboard) {
            alert("Impossible to find VENN dashboard configuration for the topic: " + this.topic);
            return;
        }

        this.prioritiesConfig = TableConfig;

        //Check if Venn item is in the config, if so remove it
        var venn  =  _.find(this.prioritiesConfig.dashboard.items, function(o){
            return o.id === BasePriorityAnalysisConfig.items.VENN_DIAGRAM;
        });

        if(venn) {
            this.prioritiesConfig.dashboard.items.pop();
        }

        // Append Venn item to table Config
        this.prioritiesConfig.dashboard.items.push(VennConfig.dashboard.items[0]);


        // Set TITLE Sub View
        var titleSubView = new TitleSubView({
           // autoRender: true,
            el: this.$el.find(s.css_classes.TITLE_BAR_ITEMS)//,
            //title: i18nLabels[this.lang].selections
        });
        this.subviews['title'] = titleSubView;

        // Set FILTER Sub View
        var filtersSubView = new FilterSubView({
           // autoRender: true,
            el: this.$el.find(s.css_classes.FILTER_HOLDER),
            config: BaseFilterConfig.filter,
            lang:  this.lang,
            environment: this.environment
        });
        this.subviews['filters'] = filtersSubView;

        // Set DASHBOARD Model
        this.dashboardModel = new DashboardModel();

        // Set TABLE DASHBOARD Model
        this.tableModel = new TableModel();

        // Set DASHBOARD Table Sub View
        var dashboardTableVennSubView = new DashboardTableVennSubView({
          //  autoRender: false,
            el: this.$el.find(s.css_classes.DASHBOARD_TABLE_VENN_HOLDER),
            lang:  this.lang,
            topic: this.topic,
            model: this.tableModel,
            environment: this.environment
        });

        this.tableModel.addObserver(dashboardTableVennSubView);

        dashboardTableVennSubView.setDashboardConfig(this.prioritiesConfig.dashboard);
        this.subviews['tableVennDashboard'] = dashboardTableVennSubView;

    };

    /**
    * When the filters have all loaded the TitleView is built using the currently selected filter values
    * and the dashboards are rendered
    * @param payload Selected Filter Items
    * @private
    */
    PriorityAnalysisView.prototype._filtersLoaded = function (payload) {

        var selectedFilterItems = payload.labels;

        // Set topic and set Dashboard Properties
        if (payload['props']) {

            var selectedTopicObj = _.find(payload['props'], function(obj){
                if(obj['selected_topic'])
                    return obj;
            });

            if (selectedTopicObj) {
                this.topic = selectedTopicObj["selected_topic"];
            }

        }


        // Build Title View
        this.subviews['title'].setLabels(selectedFilterItems);
        this.subviews['title'].build();


        //this._updatePrioritiesDashboardModelValues();
        this._setTableDashboardModelValues();

        // Render each Dashboard
       this.subviews['tableVennDashboard'].renderDashboard();

    };


    /**
    * When a filter selection changes the view is updated
    * @param changedFilter The filter which has changed
    * @private
    */
    PriorityAnalysisView.prototype._filtersChanged = function (changedFilter) {

        if(this.subviews['chartsDashboard']) {
            this.subviews['chartsDashboard'] = null;
        }

        var allFilterValues = this.subviews['filters'].getFilterValues();

        this._updateView(changedFilter, allFilterValues);

    };


    PriorityAnalysisView.prototype._clearChartsDashboards = function () {
        if(this.subviews['chartsDashboard']) {
            this.subviews['chartsDashboard'] = null;
        }
    };


    PriorityAnalysisView.prototype._renderChartsDashboards = function (newValues) {

        //console.log("================= _renderChartsDashboards =============== ");

        var filterValues =  this.subviews['filters'].getFilterValues(), filterDerivedTopic;


        var extendedFilterValues = $.extend(true, filterValues, newValues);

        // console.log("======================================= filterValues ");
        // console.log(filterValues);
        // console.log("======================================= extendedFilterValues");
        //console.log(extendedFilterValues);


        // Set CHARTS DASHBOARD Sub View
        this.chartsConfig.dashboard.filter = extendedFilterValues;


        var dashboardChartsSubView = new DashboardChartsSubView({
            autoRender: false,
            container: this.$el.find(s.css_classes.DASHBOARD_CHARTS_HOLDER),
            topic: this.topic,
            model: this.dashboardModel
        });

        this.dashboardModel.addObserver(dashboardChartsSubView);

        dashboardChartsSubView.setDashboardConfig(this.chartsConfig.dashboard);
        this.subviews['chartsDashboard'] = dashboardChartsSubView;

        this._setDashboardModelValues();
        this.subviews['chartsDashboard'].renderDashboard();


        // this.subview('chartsDashboard').setDashboardConfig(this.chartsConfig.dashboard);
        //this.subview('chartsDashboard').renderDashboard(this.topic);


        //console.log("================= selectedfilter =============== ");
        // console.log(selectedfilter);


    };

    /**
    * Get the appropriate Dashboard JS configuration file via requireJS, if the topic has changed
    * @param topic
    * @param filterValues
    * @private
    */
    PriorityAnalysisView.prototype._getDashboardConfiguration = function (topic, filterValues, props) {
        var self = this;
        // console.log("================= _getDashboardConfiguration Start =============== ");
        //console.log(filtervalues);

        // If the topic has changed, rebuild dashboards with new configuration
        if (topic !== this.topic) {
            // Re set the current topic
            this.topic = topic;

            //Load new configuration files
            require([s.paths.VENN_CONFIG + topic], function (TopicVennConfig) {

                self.chartsConfig = ChartsConfig;

                var venn  =  _.find(self.prioritiesConfig.dashboard.items, function(o){
                    //console.log(o.id);
                    return o.id === BasePriorityAnalysisConfig.items.VENN_DIAGRAM;
                });

                if(venn) {
                    self.prioritiesConfig.dashboard.items.pop();
                }

                self.prioritiesConfig.dashboard.items.push(TopicVennConfig.dashboard.items[0]);


                // Rebuild dashboards with new configurations
                self._rebuildDashboards(filterValues, self.prioritiesConfig.dashboard, props);
            });
        }
        else {
            // Rebuild dashboards with existing configurations
            self._rebuildDashboards(filterValues, self.subviews['tableVennDashboard'].getDashboardConfig(), props);
        }
    };

    /**
    * Rebuild the dashboards
    * @param filterValues
    * @param prioritiesDashboardConfig
    * @private
    */

    PriorityAnalysisView.prototype._rebuildDashboards = function (filterValues, prioritiesDashboardConfig, props) {

        //console.log("================= _rebuildDashboards 1 =============== ");
        //console.log(dashboardConfig);

        // Set Dashboard Configuration
        // this.subview('chartsDashboard').setDashboardConfig(chartsDashboardConfig);
        this.subviews['tableVennDashboard'].setDashboardConfig(prioritiesDashboardConfig);

        // Update Dashboard Models (with labels - see _updateChartsDashboardModelValues)
        // this._updateChartsDashboardModelValues();
        //this._updatePrioritiesDashboardModelValues();


        this._setDashboardModelValues();
        this._setTableDashboardModelValues();


        //console.log("================= _rebuildDashboard 3 =============== ");
        // console.log(ovalues);

        // Rebuild Dashboards
        // this.subview('chartsDashboard').rebuildDashboard(filterValues, this.topic);
        this.subviews['tableVennDashboard'].rebuildDashboard(filterValues, this.topic, props);
    };


    /**
    * Create the Title Item (from the filterItem's id and label)
    * @param filterItem
    * @private
    */

    PriorityAnalysisView.prototype._createTitleItem = function (filterItem) {

        var titleItem = {}, labels = filterItem.values.labels;

        titleItem.id = filterItem.id;

        var key = Object.keys(labels)[0];
        titleItem.label = labels[key];

        return titleItem;
    };

    PriorityAnalysisView.prototype._setTableDashboardModelValues = function () {
        this.tableModel.set(s.dashboardModel.LABEL, this.subviews['title'].getItemText(BaseConfig.SELECTORS.RECIPIENT_COUNTRY));
    };

    PriorityAnalysisView.prototype._setDashboardModelValues = function () {
        this.dashboardModel.set(s.dashboardModel.LABEL,  this.subviews['title'].getItemText(BaseConfig.SELECTORS.YEAR));
    };


    /* var PriorityAnalysisView = View.extend({

         // Automatically render after initialize
         autoRender: true,

         className: 'analyse-priority-analysis',

         // Save the template string in a prototype property.
         // This is overwritten with the compiled template function.
         // In the end you might want to used precompiled templates.
         template: template,


         initialize: function (params) {
             this.analyse_type = params.filter;
             this.topic = BasePriorityAnalysisConfig.dashboard.DEFAULT_TOPIC;
             this.page = params.page;
             this.datasetType = GeneralConfig.DEFAULT_UID;

             View.prototype.initialize.call(this, arguments);
         },

         getTemplateData: function () {
             return i18nLabels;
         },

         attach: function () {

             View.prototype.attach.call(this, arguments);

             this.$el = $(this.el);

             //update State
             amplify.publish(Events.STATE_CHANGE, {menu: 'analyse', breadcrumb: this._createMenuBreadcrumbItem()});

             this._bindEventListeners();

         },

         render: function () {
             View.prototype.render.apply(this, arguments);

             this._loadConfigurations();
         },

         /!**
          * Based on the topic, which is determined by the current filter selections (see filter-view)
          * the appropriate dashboard JS configuration files are loaded via requireJS
          * @private
          *!/
         _loadConfigurations: function () {
            // require([s.paths.CHARTS_CONFIG + this.topic, s.paths.TABLE_CONFIG + this.topic], _.bind(this._initSubViews, this));
             require([s.paths.VENN_CONFIG + this.topic], _.bind(this._initSubViews, this));
         },

         /!**
          * Initializes all sub views: Title, Filter, Priorities Dashboard and Charts Dashboard
          * @param VennConfig Venn Item configuration
          * @private
          *!/

         _initSubViews: function (VennConfig) {

             View.prototype.render.apply(this, arguments);

             // Filter Configuration
             if (!BaseFilterConfig || !BaseFilterConfig.filter) {
                 alert("Impossible to find filter configuration for the topic: " + this.topic);
                 return;
             }


             // Charts Dashboard Configuration
             if (!ChartsConfig || !ChartsConfig.dashboard) {
                 alert("Impossible to find CHARTS dashboard/filter configuration for the topic: " + this.topic);
                 return;
             }

             // Table Dashboard Configuration
             if (!TableConfig || !TableConfig.dashboard) {
                 alert("Impossible to find TABLE dashboard configuration for the topic: " + this.topic);
                 return;
             }

             // Venn Configuration
             if (!VennConfig || !VennConfig.dashboard) {
                 alert("Impossible to find VENN dashboard configuration for the topic: " + this.topic);
                 return;
             }


             this.chartsConfig = ChartsConfig;
             this.prioritiesConfig = TableConfig;

             //Check if Venn item is in the config, if so remove it
             var venn  =  _.find(this.prioritiesConfig.dashboard.items, function(o){
                 return o.id === BasePriorityAnalysisConfig.items.VENN_DIAGRAM;
             });

             if(venn) {
                 this.prioritiesConfig.dashboard.items.pop();
             }

             // Append Venn item to table Config
             this.prioritiesConfig.dashboard.items.push(VennConfig.dashboard.items[0]);

             //this.prioritiesConfig = TableConfig;

             //console.log("======================== INIT ");
             //console.log(this.prioritiesConfig.dashboard.items);

             // Set TITLE Sub View
             var titleSubView = new TitleSubView({
                 autoRender: true,
                 container: this.$el.find(s.css_classes.TITLE_BAR_ITEMS),
                 title: i18nLabels.selections
             });
             this.subview('title', titleSubView);

             // Set FILTER Sub View
             var filtersSubView = new FilterSubView({
                 autoRender: true,
                 container: this.$el.find(s.css_classes.FILTER_HOLDER),
                 config: BaseFilterConfig.filter
             });
             this.subview('filters', filtersSubView);

             // Set CHARTS DASHBOARD Model
             this.chartsDashboardModel = new DashboardModel();

            /!* // Set CHARTS DASHBOARD Sub View
             var dashboardChartsSubView = new DashboardChartsSubView({
                 autoRender: false,
                 container: this.$el.find(s.css_classes.DASHBOARD_CHARTS_HOLDER),
                 topic: this.topic,
                 model: this.chartsDashboardModel
             });
             dashboardChartsSubView.setDashboardConfig(this.chartsConfig.dashboard);
             this.subview('chartsDashboard', dashboardChartsSubView);*!/

             // Set TABLE DASHBOARD Model
             this.prioritiesDashboardModel = new TableModel();

             // Set DASHBOARD Table Sub View
             var dashboardPrioritiesSubView = new DashboardPrioritiesSubView({
                 autoRender: false,
                 container: this.$el.find(s.css_classes.DASHBOARD_PRIORITIES_HOLDER),
                 topic: this.topic,
                 model: this.prioritiesDashboardModel
             });
             dashboardPrioritiesSubView.setDashboardConfig(this.prioritiesConfig.dashboard);
             this.subview('prioritiesDashboard', dashboardPrioritiesSubView);

         },

         /!**
          * Create the Menu breadcrumb item for the page
          * @private
          *!/
         _createMenuBreadcrumbItem: function () {
             var label = "";
             var self = this;

             if (typeof self.analyse_type !== 'undefined') {
                 label = i18nLabels[self.analyse_type];
             }

             return Utils.createMenuBreadcrumbItem(label, self.analyse_type, self.page);
         },


         _bindEventListeners: function () {
             amplify.subscribe(BasePriorityAnalysisEvents.FILTER_ON_READY, this, this._filtersLoaded);
             amplify.subscribe(BasePriorityAnalysisEvents.FILTER_ON_CHANGE, this, this._filtersChanged);
             amplify.subscribe(BasePriorityAnalysisEvents.VENN_ON_CHANGE, this, this._renderChartsDashboards);
             amplify.subscribe(BasePriorityAnalysisEvents.VENN_NO_VALUES, this, this._clearChartsDashboards);
         },

         /!**
          * When the filters have all loaded the TitleView is built using the currently selected filter values
          * and the dashboards are rendered
          * @param payload Selected Filter Items
          * @private
          *!/
         _filtersLoaded: function (payload) {

             var selectedFilterItems = payload.labels;

             // Set topic and set Dashboard Properties
             if (payload['props']) {

                 var selectedTopicObj = _.find(payload['props'], function(obj){
                     if(obj['selected_topic'])
                         return obj;
                 });

                 if (selectedTopicObj) {
                     this.topic = selectedTopicObj["selected_topic"];
                 }

                 this.subview('prioritiesDashboard').setProperties(payload["props"]);
             }


             // Build Title View
             this.subview('title').setLabels(selectedFilterItems);
             this.subview('title').build();

             // Update Dashboard Models (with labels - see _updateChartsDashboardModelValues)
             //this._updateChartsDashboardModelValues();
             this._updatePrioritiesDashboardModelValues();

             // Render each Dashboard
            // this.subview('chartsDashboard').renderDashboard();
             this.subview('prioritiesDashboard').renderDashboard();

         },


         /!**
          * When a filter selection changes the view is updated
          * @param changedFilter The filter which has changed
          * @private
          *!/
         _filtersChanged: function (changedFilter) {

             if(this.subview('chartsDashboard')) {
                 this.subview('chartsDashboard').clear();
             }

             var allFilterValues = this.subview('filters').getFilterValues();

             this._updateView(changedFilter, allFilterValues);

         },


         _clearChartsDashboards: function () {
             if(this.subview('chartsDashboard')) {
                 this.subview('chartsDashboard').clear();
             }
         },


         /!**
          * Each Dashboard and Title Sub View is rebuilt/refreshed
          * @param changedFilter The filter which has changed
          * @param allFilterValues All (selected) filter values
          * @private
          *!/

         _updateView: function (changedFilter, allFilterValues) {

             var filterValues = allFilterValues;

             // console.log("================= filter values =============== ");
             // console.log(filterValues);

             //console.log("================= selectedfilter =============== ");
             //console.log(changedFilter);

             if (changedFilter) {

                 var topic = this.topic, selections;

                 // If the changed filter has a value
                 if (changedFilter.values.values.length > 0) {

                     // Get topic
                     if (changedFilter['props']) {

                         var selectedTopicObj = _.find(changedFilter['props'], function(obj){
                              if(obj['selected_topic'])
                                 return obj;
                         });

                         if (selectedTopicObj) {
                             topic = selectedTopicObj["selected_topic"];
                         }

                     }

                     // All is selected
                     if (changedFilter.values.values[0] === s.values.ALL) {

                         // Update the TitleView (Remove Item)
                         amplify.publish(Events.TITLE_REMOVE_ITEM, changedFilter.id);

                     } else {
                         // Update the TitleView (Add Item)
                         amplify.publish(Events.TITLE_ADD_ITEM, this._createTitleItem(changedFilter));
                     }

                     this._getDashboardConfiguration(topic, filterValues, changedFilter['props']);
                 }

             }

         },


         _renderChartsDashboards: function (newValues) {

             //console.log("================= _renderChartsDashboards =============== ");

             var filterValues = this.subview('filters').getFilterValues(), filterDerivedTopic;


             var extendedFilterValues = $.extend(true, filterValues, newValues);

            // console.log("======================================= filterValues ");
            // console.log(filterValues);
            // console.log("======================================= extendedFilterValues");
             //console.log(extendedFilterValues);


             // Set CHARTS DASHBOARD Sub View
             this.chartsConfig.dashboard.filter = extendedFilterValues;


             var dashboardChartsSubView = new DashboardChartsSubView({
                 autoRender: false,
                 container: this.$el.find(s.css_classes.DASHBOARD_CHARTS_HOLDER),
                 topic: this.topic,
                 model: this.chartsDashboardModel
             });
             dashboardChartsSubView.setDashboardConfig(this.chartsConfig.dashboard);
             this.subview('chartsDashboard', dashboardChartsSubView);

             this._updateChartsDashboardModelValues();
             this.subview('chartsDashboard').renderDashboard();


            // this.subview('chartsDashboard').setDashboardConfig(this.chartsConfig.dashboard);
             //this.subview('chartsDashboard').renderDashboard(this.topic);


             //console.log("================= selectedfilter =============== ");
             // console.log(selectedfilter);


         },

         /!**
          * Get the appropriate Dashboard JS configuration file via requireJS, if the topic has changed
          * @param topic
          * @param filterValues
          * @private
          *!/
         _getDashboardConfiguration: function (topic, filterValues, props) {
             var self = this;
             // console.log("================= _getDashboardConfiguration Start =============== ");
             //console.log(filtervalues);

             // If the topic has changed, rebuild dashboards with new configuration
             if (topic !== this.topic) {
                 // Re set the current topic
                 this.topic = topic;

                 //Load new configuration files
                 require([s.paths.VENN_CONFIG + topic], function (TopicVennConfig) {

                     self.chartsConfig = ChartsConfig;

                     var venn  =  _.find(self.prioritiesConfig.dashboard.items, function(o){
                         //console.log(o.id);
                         return o.id === BasePriorityAnalysisConfig.items.VENN_DIAGRAM;
                     });

                     if(venn) {
                         self.prioritiesConfig.dashboard.items.pop();
                     }

                     self.prioritiesConfig.dashboard.items.push(TopicVennConfig.dashboard.items[0]);


                     // Rebuild dashboards with new configurations
                     self._rebuildDashboards(filterValues, self.prioritiesConfig.dashboard, props);
                 });
             }
             else {
                 // Rebuild dashboards with existing configurations
                 self._rebuildDashboards(filterValues, self.subview('prioritiesDashboard').getDashboardConfig(), props);
             }
         },

         /!**
          * Rebuild the dashboards
          * @param filterValues
          * @param prioritiesDashboardConfig
          * @private
          *!/

         _rebuildDashboards: function (filterValues, prioritiesDashboardConfig, props) {

             //console.log("================= _rebuildDashboards 1 =============== ");
             //console.log(dashboardConfig);

             // Set Dashboard Configuration
            // this.subview('chartsDashboard').setDashboardConfig(chartsDashboardConfig);
             this.subview('prioritiesDashboard').setDashboardConfig(prioritiesDashboardConfig);

             // Update Dashboard Models (with labels - see _updateChartsDashboardModelValues)
            // this._updateChartsDashboardModelValues();
             this._updatePrioritiesDashboardModelValues();


             //console.log("================= _rebuildDashboard 3 =============== ");
             // console.log(ovalues);

             // Rebuild Dashboards
            // this.subview('chartsDashboard').rebuildDashboard(filterValues, this.topic);
             this.subview('prioritiesDashboard').rebuildDashboard(filterValues, this.topic, props);
         },


         /!**
          * Create the Title Item (from the filterItem's id and label)
          * @param filterItem
          * @private
          *!/

         _createTitleItem: function (filterItem) {

             var titleItem = {}, labels = filterItem.values.labels;

             titleItem.id = filterItem.id;

             var key = Object.keys(labels)[0];
             titleItem.label = labels[key];

             return titleItem;
         },

         _unbindEventListeners: function () {
             // Remove listeners
             amplify.unsubscribe(BasePriorityAnalysisEvents.FILTER_ON_READY, this._filtersLoaded);
             amplify.unsubscribe(BasePriorityAnalysisEvents.FILTER_ON_CHANGE, this._filtersChanged);
             amplify.unsubscribe(BasePriorityAnalysisEvents.FILTER_ON_CHANGE, this._renderChartsDashboards);

         },


         _updateChartsDashboardModelValues: function () {
             this.chartsDashboardModel.set(s.dashboardModel.LABEL, this.subview('title').getItemText("year"));
         },

         _updatePrioritiesDashboardModelValues: function () {
             //console.log(this.subview('title').getTitleAsArray());

             this.prioritiesDashboardModel.set(s.dashboardModel.LABEL, this.subview('title').getItemText("recipientcode"));
         },


         dispose: function () {

             this._unbindEventListeners();

             View.prototype.dispose.call(this, arguments);
         }

     });*/

    return PriorityAnalysisView;
});
