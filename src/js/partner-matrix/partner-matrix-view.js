/*global define, amplify*/
define([
    'loglevel',
    'jquery',
    'jquery-ui',
    'underscore',
    'common/title-view',
    'partner-matrix/partner-matrix-filter-view',
    'partner-matrix/dashboard-charts-view',
    'partner-matrix/dashboard-table-view',
    'models/dashboard',
    'models/table',
    'html/partner-matrix/partner-matrix.hbs',
    'config/errors',
    'config/events',
    'config/config-base',
    'config/partner-matrix/events',
    'config/partner-matrix/config-partner-matrix',
    'config/partner-matrix/config-filter',
    'amplify-pubsub'
], function (log, $, $UI, _, TitleSubView, FilterSubView, DashboardChartsSubView, DashboardTableSubView, DashboardModel, TableModel, template, Errors, Events, GeneralConfig, BaseMatrixEvents, BasePartnerMatrixConfig, BaseFilterConfig, amplify) {

    'use strict';

    var s = {
        css_classes: {
            TITLE_BAR_ITEMS: "#partner-matrix-fx-title-items",
            FILTER_HOLDER: "#partner-matrix-filter-holder",
            DASHBOARD_CHARTS_HOLDER: "#partner-matrix-charts-content",
            DASHBOARD_TABLE_HOLDER: "#partner-matrix-table-content"
        },
        dashboardModel: {
            LABEL: 'label'
        },
        values: {
            ALL: 'all'
        },
        paths: {
            CHARTS_CONFIG: 'config/partner-matrix/config-charts-',
            TABLE_CONFIG: 'config/partner-matrix/config-table-'
        }
    };


    /**
     *
     * Creates a new Resource Partner Matrix View
     * Resource Partner Matrix View comprises of a series of subviews: title view, filter view and 2 dashboard views (charts dashboard and table dashboard)
     * @class ResourcePartnerMatrixView
     * @extends View
     */

    function ResourcePartnerMatrixView(o) {
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
            log.error("Impossible to create Resource Partner Matrix View");
            log.error(valid)
        }
    }

    ResourcePartnerMatrixView.prototype._parseInput = function (params) {
        this.$el = $(this.el);
        this.lang = params.lang.toLowerCase() || GeneralConfig.LANG.toLowerCase();
        this.environment = params.environment || GeneralConfig.ENVIRONMENT;
        this.topic = BasePartnerMatrixConfig.dashboard.DEFAULT_TOPIC;
    };

    ResourcePartnerMatrixView.prototype._validateInput = function () {

        var valid = true,
            errors = [];

        //Check if $el exist
        if (this.$el.length === 0) {
            errors.push({code: Errors.MISSING_CONTAINER});
            log.warn("Impossible to find browse by container");
        }

        return errors.length > 0 ? errors : valid;
    };

    ResourcePartnerMatrixView.prototype._attach = function () {
        this.template = template;
        this.$el.append(this.template);
    };

    ResourcePartnerMatrixView.prototype._init = function () {
        this.subviews = {};
    };

    ResourcePartnerMatrixView.prototype._render = function () {
        this._loadConfigurations();
    };


    ResourcePartnerMatrixView.prototype._bindEventListeners = function () {
        amplify.subscribe(BaseMatrixEvents.FILTER_ON_READY, this, this._filtersLoaded);
        amplify.subscribe(BaseMatrixEvents.FILTER_ON_CHANGE, this, this._filtersChanged);
    };

    ResourcePartnerMatrixView.prototype._unbindEventListeners = function () {
        // Remove listeners
        amplify.unsubscribe(BaseMatrixEvents.FILTER_ON_READY, this._filtersLoaded);
        amplify.unsubscribe(BaseMatrixEvents.FILTER_ON_CHANGE, this._filtersChanged);
    };





    /**
     * Based on the topic, which is determined by the current filter selections (see filter-view)
     * the appropriate dashboard JS configuration files are loaded via requireJS
     * @private
     */
    ResourcePartnerMatrixView.prototype._loadConfigurations = function () {
        var pth1 = s.paths.CHARTS_CONFIG + this.topic + '.js';
        var pth2 = s.paths.TABLE_CONFIG + this.topic + '.js';

        require(['../../'+pth1, '../../'+pth2], _.bind(this._initSubViews, this));
    };

    ResourcePartnerMatrixView.prototype._initSubViews = function (ChartsConfig, TableConfig) {

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

        this.chartsConfig = ChartsConfig;
        this.tableConfig = TableConfig;

        // Set TITLE Sub View
        var titleSubView = new TitleSubView({
            el: this.$el.find(s.css_classes.TITLE_BAR_ITEMS)
        });
        this.subviews['title'] = titleSubView;

        // Set FILTER Sub View
        var filtersSubView = new FilterSubView({
            el: this.$el.find(s.css_classes.FILTER_HOLDER),
            config: BaseFilterConfig.filter,
            lang:  this.lang,
            environment: this.environment
        });
        this.subviews['filters'] = filtersSubView;

        // Set CHARTS DASHBOARD Model
        this.chartsModel = new DashboardModel();

        // Set DASHBOARD Table Sub View
        var dashboardChartsSubView = new DashboardChartsSubView({
            //  autoRender: false,
            el: this.$el.find(s.css_classes.DASHBOARD_CHARTS_HOLDER),
            lang:  this.lang,
            topic: this.topic,
            model: this.chartsModel,
            environment: this.environment,
            config: this.chartsConfig.dashboard
        });

        this.chartsModel.addObserver(dashboardChartsSubView);
        this.subviews['chartsDashboard'] = dashboardChartsSubView;

        // Set TABLE DASHBOARD Model
        this.tableModel = new TableModel();
        this.tableTitle = "Resource Partner Matrix / By Recipient Country";
        this.tableSubtitle = this.subviews['title'];

        // Set DASHBOARD Table Sub View
        var dashboardTableSubView = new DashboardTableSubView({
            el: this.$el.find(s.css_classes.DASHBOARD_TABLE_HOLDER),
            lang:  this.lang,
            topic: this.topic,
            model: this.tableModel,
            title: this.tableTitle,
            subtitle: this.tableSubtitle,
            environment: this.environment,
            config: this.tableConfig.dashboard
        });

        this.tableModel.addObserver(dashboardTableSubView);
        this.subviews['tableDashboard'] = dashboardTableSubView;
    };

    /**
     * When the filters have all loaded the TitleView is built using the currently selected filter values
     * and the dashboards are rendered
     * @param payload Selected Filter Items
     * @private
     */
    ResourcePartnerMatrixView.prototype._filtersLoaded = function (payload) {

        var selectedFilterItems = payload.labels;


        // Build Title View
        this.subviews['title'].setLabels(selectedFilterItems);
        this.subviews['title'].build();

        // Update Dashboard Models (with labels - see _updateChartsDashboardModelValues)
        this._updateChartsDashboardModelValues();
        this._updateTableDashboardModelValues();

      

    };

    /**
     * When a filter selection changes the view is updated
     * @param changedFilter The filter which has changed
     * @private
     */
    ResourcePartnerMatrixView.prototype._filtersChanged = function (changedFilter) {

        var allFilterValues = this.subviews['filters'].getFilterValues();

        this._updateView(changedFilter, allFilterValues);
     };


    /**
     * Each Dashboard and Title Sub View is rebuilt/refreshed
     * @param changedFilter The filter which has changed
     * @param allFilterValues All (selected) filter values
     * @private
     */

    ResourcePartnerMatrixView.prototype._updateView = function (changedFilter, allFilterValues) {

        var filterValues = allFilterValues;

        if (changedFilter) {

            var topic = this.topic;

            // If the changed filter has a value
            if (changedFilter.values.length > 0) {

                // Get topic
                if (changedFilter['props']) {
                    if (changedFilter['props']['selected_topic']) {
                        topic = changedFilter['props']['selected_topic'];
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

                this._getDashboardConfiguration(topic, filterValues);
            }

        }

    };


    /**
     * Get the appropriate Dashboard JS configuration file via requireJS, if the topic has changed
     * @param topic
     * @param filterValues
     * @private
     */
    ResourcePartnerMatrixView.prototype._getDashboardConfiguration = function (topic, filterValues, props) {
        var self = this;

        // If the topic has changed, rebuild dashboards with new configuration
        if (topic !== this.topic) {
            // Re set the current topic
            this.topic = topic;
            var pthC = s.paths.CHARTS_CONFIG + topic + '.js';
            var pthT = s.paths.TABLE_CONFIG + topic + '.js';
            //Load new configuration files
            require(['../../'+pthC, '../../'+pthT], function (TopicChartsConfig, TopicTableConfig) {
                // Rebuild dashboards with new configurations
                self._rebuildDashboards(filterValues, TopicChartsConfig.dashboard, TopicTableConfig.dashboard);
            });
        }
        else {
            // Rebuild dashboards with existing configurations
            self._rebuildDashboards(filterValues, self.subviews['chartsDashboard'].getDashboardConfig(), self.subviews['tableDashboard'].getDashboardConfig());
        }
    };


    /**
     * Rebuild the dashboards
     * @param filterValues
     * @param chartsDashboardConfig
     * @param tableDashboardConfig
     * @private
     */

    ResourcePartnerMatrixView.prototype._rebuildDashboards = function (filterValues, chartsDashboardConfig, tableDashboardConfig) {

        // Set Dashboard Configuration
        this.subviews['chartsDashboard'].setDashboardConfig(chartsDashboardConfig);
        this.subviews['tableDashboard'].setDashboardConfig(tableDashboardConfig);

        // Update Dashboard Models (with labels - see _updateChartsDashboardModelValues)
        this._updateChartsDashboardModelValues();
        this._updateTableDashboardModelValues();


        //console.log("================= _rebuildDashboard 3 =============== ");
        // console.log(ovalues);

        // Rebuild Dashboards
        this.subviews['chartsDashboard'].rebuildDashboard(filterValues, this.topic);
        this.subviews['tableDashboard'].rebuildDashboard(filterValues, this.topic);
    };

    /**
     * Create the Title Item (from the filterItem's id and label)
     * @param filterItem
     * @private
     */

    ResourcePartnerMatrixView.prototype._createTitleItem = function (filterItem) {

        var titleItem = {}, labels = filterItem.labels;

        titleItem.id = filterItem.id;

        var key = Object.keys(labels)[0];
        titleItem.label = labels[key];

        return titleItem;
    };

    ResourcePartnerMatrixView.prototype._updateChartsDashboardModelValues = function () {
        this.chartsModel.set(s.dashboardModel.LABEL, this.subviews['title'].getTitleAsLabel());
    };

    ResourcePartnerMatrixView.prototype._updateTableDashboardModelValues = function () {
        this.tableModel.set(s.dashboardModel.LABEL,  this.subviews['title'].getTitleAsLabel());
    };

    return ResourcePartnerMatrixView;
});
