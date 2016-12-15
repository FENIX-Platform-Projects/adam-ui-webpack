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

        console.log("PriorityAnalysisView =================");
        console.log(o);

        $.extend(true, this, o);

        this._parseInput(o);

        var valid = this._validateInput();

        if (valid === true) {

            this._unbindEventListeners();

            console.log("PriorityAnalysisView ================= 1");

            this._attach();

            console.log("PriorityAnalysisView ================= 2");

            this._bindEventListeners();


            console.log("PriorityAnalysisView ================= 3");

            this._init();

            console.log("PriorityAnalysisView ================= 4");

            this._render();

            console.log("PriorityAnalysisView ================= 5");

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
       amplify.subscribe(BasePriorityAnalysisEvents.VENN_NO_VALUES, this, this._clearChartsDashboard);
    };

    PriorityAnalysisView.prototype._unbindEventListeners = function () {
        // Remove listeners
        amplify.unsubscribe(BasePriorityAnalysisEvents.FILTER_ON_READY, this._filtersLoaded);
        amplify.unsubscribe(BasePriorityAnalysisEvents.FILTER_ON_CHANGE, this._filtersChanged);
        amplify.unsubscribe(BasePriorityAnalysisEvents.VENN_ON_CHANGE, this._renderChartsDashboards);
        amplify.unsubscribe(BasePriorityAnalysisEvents.VENN_NO_VALUES, this._clearChartsDashboard);
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

        this.chartsConfig = ChartsConfig;
        this.prioritiesConfig = {};
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
            environment: this.environment,
            config: this.prioritiesConfig.dashboard
        });

        this.tableModel.addObserver(dashboardTableVennSubView);

       // dashboardTableVennSubView.setDashboardConfig(this.prioritiesConfig.dashboard);
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
      //this.subviews['tableVennDashboard'].renderDashboard();

    };


    /**
    * When a filter selection changes the view is updated
    * @param changedFilter The filter which has changed
    * @private
    */
    PriorityAnalysisView.prototype._filtersChanged = function (changedFilter) {

        this._clearChartsDashboard();

        var allFilterValues = this.subviews['filters'].getFilterValues();

        this._updateView(changedFilter, allFilterValues);

    };


    /**
    * Each Dashboard and Title Sub View is rebuilt/refreshed
    * @param changedFilter The filter which has changed
    * @param allFilterValues All (selected) filter values
    * @private
    */

    PriorityAnalysisView.prototype._updateView = function (changedFilter, allFilterValues) {

        var filterValues = allFilterValues;

        // console.log("================= filter values =============== ");
        // console.log(filterValues);

        //console.log("================= selectedfilter =============== ");
        //console.log(changedFilter);

        if (changedFilter) {

            var topic = this.topic, selections;

            // If the changed filter has a value
            if (changedFilter.values.length > 0) {

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
                if (changedFilter.values[0] === s.values.ALL) {

                    // Update the TitleView (Remove Item)
                    amplify.publish(Events.TITLE_REMOVE_ITEM, changedFilter.id);

                } else {
                    // Update the TitleView (Add Item)
                    amplify.publish(Events.TITLE_ADD_ITEM, this._createTitleItem(changedFilter));
                }

                this._getDashboardConfiguration(topic, filterValues, changedFilter['props']);
            }

        }

    };


    PriorityAnalysisView.prototype._clearChartsDashboard = function () {

        if(this.subviews['chartsDashboard']) {
            this.subviews['chartsDashboard'].clear();
        }
    };


    PriorityAnalysisView.prototype._renderChartsDashboards = function (newValues) {

        //console.log("================= _renderChartsDashboards =============== ");

        var filterValues =  this.subviews['filters'].getFilterValues(), filterDerivedTopic;
        var extendedFilterValues = $.extend(true, filterValues, newValues);


        // Set DASHBOARD Charts Sub View
        var dashboardChartsSubView = new DashboardChartsSubView({
            el: this.$el.find(s.css_classes.DASHBOARD_CHARTS_HOLDER),
            lang:  this.lang,
            topic: this.topic,
            model: this.dashboardModel,
            environment: this.environment,
            config: this.chartsConfig.dashboard
        });

        this.dashboardModel.addObserver(dashboardChartsSubView);
        this.subviews['chartsDashboard'] = dashboardChartsSubView;

        this._setDashboardModelValues();
        this.subviews['chartsDashboard'].render(extendedFilterValues);


    };

    /**
    * Get the appropriate Dashboard JS configuration file via requireJS, if the topic has changed
    * @param topic
    * @param filterValues
    * @private
    */
    PriorityAnalysisView.prototype._getDashboardConfiguration = function (topic, filterValues, props) {
        var self = this;

        // If the topic has changed, rebuild dashboards with new configuration
        if (topic !== this.topic) {
            // Re set the current topic
            this.topic = topic;
            var pthVC = s.paths.VENN_CONFIG + topic + '.js';

            //Load new configuration files
            require(['../../'+pthVC], function (TopicVennConfig) {

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

        var titleItem = {}, labels = filterItem.labels;

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


    return PriorityAnalysisView;
});
