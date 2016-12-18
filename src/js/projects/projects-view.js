/*global define, amplify*/
define([
    'loglevel',
    'jquery',
    'jquery-ui',
    'underscore',
    'common/title-view',
    'comp-advantage/comp-advantage-filter-view',
    'comp-advantage/dashboard-table-view',
    'models/table',
    'html/comp-advantage/comp-advantage.hbs',
    'config/errors',
    'config/events',
    'config/config-base',
    'config/comp-advantage/events',
    'config/comp-advantage/config-comp-advantage',
    'config/comp-advantage/config-filter',
    'config/comp-advantage/config-table',
    'amplify-pubsub'
], function (log, $, $UI, _, TitleSubView, FilterSubView, DashboardTableSubView, TableModel, template, Errors, Events, GeneralConfig, BaseMatrixEvents, BasePartnerMatrixConfig, BaseFilterConfig, TableConfig, amplify) {

    'use strict';

    var s = {
        css_classes: {
            TITLE_BAR_ITEMS: "#comp-advantage-fx-title-items",
            FILTER_HOLDER: "#comp-advantage-filter-holder",
            DASHBOARD_CHARTS_HOLDER: "#comp-advantage-charts-content",
            DASHBOARD_TABLE_HOLDER: "#comp-advantage-table-content"
        },
        dashboardModel: {
            LABEL: 'label'
        },
        values: {
            ALL: 'all'
        }
    };


    /**
     *
     * Creates a new Comparative Advantage View
     * Comparative Advantage View omprises of a series of subviews: title view, filter view and 1 dashboard views (table dashboard)
     * @class ProjectsView
     * @extends View
     */

    function ProjectsView(o) {
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
            log.error("Impossible to create Projects View");
            log.error(valid)
        }
    }

    ProjectsView.prototype._parseInput = function (params) {
        this.$el = $(this.el);
        this.lang = params.lang.toLowerCase() || GeneralConfig.LANG.toLowerCase();
        this.environment = params.environment || GeneralConfig.ENVIRONMENT;
    };

    ProjectsView.prototype._validateInput = function () {

        var valid = true,
            errors = [];

        //Check if $el exist
        if (this.$el.length === 0) {
            errors.push({code: Errors.MISSING_CONTAINER});
            log.warn("Impossible to find browse by container");
        }

        return errors.length > 0 ? errors : valid;
    };

    ProjectsView.prototype._attach = function () {
        this.template = template;
        this.$el.append(this.template);
    };

    ProjectsView.prototype._init = function () {
        this.subviews = {};
    };

    ProjectsView.prototype._render = function () {
        this._initSubViews();
    };


    ProjectsView.prototype._bindEventListeners = function () {
        amplify.subscribe(BaseMatrixEvents.FILTER_ON_READY, this, this._filtersLoaded);
        amplify.subscribe(BaseMatrixEvents.FILTER_ON_CHANGE, this, this._filtersChanged);
    };

    ProjectsView.prototype._unbindEventListeners = function () {
        // Remove listeners
        amplify.unsubscribe(BaseMatrixEvents.FILTER_ON_READY, this._filtersLoaded);
        amplify.unsubscribe(BaseMatrixEvents.FILTER_ON_CHANGE, this._filtersChanged);
    };


    ProjectsView.prototype._initSubViews = function () {

        // Filter Configuration
        if (!BaseFilterConfig || !BaseFilterConfig.filter) {
            alert("Impossible to find filter configuration ");
            return;
        }

        // Table Dashboard Configuration
        if (!TableConfig || !TableConfig.dashboard) {
            alert("Impossible to find TABLE dashboard configuration " );
            return;
        }

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

        // Set TABLE DASHBOARD Model
        this.tableModel = new TableModel();

        // Set DASHBOARD Table Sub View
        var dashboardTableSubView = new DashboardTableSubView({
            el: this.$el.find(s.css_classes.DASHBOARD_TABLE_HOLDER),
            lang:  this.lang,
            model: this.tableModel,
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
    ProjectsView.prototype._filtersLoaded = function (payload) {

        var selectedFilterItems = payload.labels;


        // Set Dashboard Properties
        if (payload["props"]) {
            this.subviews['tableDashboard'].setProperties(payload["props"]);
        }

        // Build Title View
        this.subviews['title'].setLabels(selectedFilterItems);
        this.subviews['title'].build();

        // Update Dashboard Models (with labels - see _updateChartsDashboardModelValues)
        this._updateTableDashboardModelValues();

        // Render each Dashboard
        this.subviews['tableDashboard'].rebuildDashboard();

    };

    /**
     * When a filter selection changes the view is updated
     * @param changedFilter The filter which has changed
     * @private
     */
    ProjectsView.prototype._filtersChanged = function (changedFilter) {

        var allFilterValues = this.subviews['filters'].getFilterValues();

        this._updateView(changedFilter, allFilterValues);
     };


    /**
     * Each Dashboard and Title Sub View is rebuilt/refreshed
     * @param changedFilter The filter which has changed
     * @param allFilterValues All (selected) filter values
     * @private
     */

    ProjectsView.prototype._updateView = function (changedFilter, allFilterValues) {

        var filterValues = allFilterValues;

        if (changedFilter) {

            // If the changed filter has a value
            if (changedFilter.values.length > 0) {

                // All is selected
                if (changedFilter.values[0] === s.values.ALL) {

                    // Update the TitleView (Remove Item)
                    amplify.publish(Events.TITLE_REMOVE_ITEM, changedFilter.id);

                } else {
                    // Update the TitleView (Add Item)
                    amplify.publish(Events.TITLE_ADD_ITEM, this._createTitleItem(changedFilter));
                }

                this._getDashboardConfiguration(filterValues);
            }

        }

    };


    /**
     * Get the appropriate Dashboard JS configuration file via requireJS, if the topic has changed
     * @param topic
     * @param filterValues
     * @private
     */
    ProjectsView.prototype._getDashboardConfiguration = function (topic, filterValues, props) {
        this._rebuildDashboards(filterValues, this.subviews['tableDashboard'].getDashboardConfig());
    };


    /**
     * Rebuild the dashboards
     * @param filterValues
     * @param tableDashboardConfig
     * @private
     */

    ProjectsView.prototype._rebuildDashboards = function (filterValues, tableDashboardConfig) {

        // Set Dashboard Configuration
        this.subviews['tableDashboard'].setDashboardConfig(tableDashboardConfig);

        // Update Dashboard Models (with labels - see _updateChartsDashboardModelValues)
         this._updateTableDashboardModelValues();


        //console.log("================= _rebuildDashboard 3 =============== ");
        // console.log(ovalues);

        // Rebuild Dashboards
        this.subviews['tableDashboard'].rebuildDashboard(filterValues);
    };

    /**
     * Create the Title Item (from the filterItem's id and label)
     * @param filterItem
     * @private
     */

    ProjectsView.prototype._createTitleItem = function (filterItem) {

        var titleItem = {}, labels = filterItem.labels;

        titleItem.id = filterItem.id;

        var key = Object.keys(labels)[0];
        titleItem.label = labels[key];

        return titleItem;
    };

    ProjectsView.prototype._updateTableDashboardModelValues = function () {

        this.tableModel.set(s.dashboardModel.LABEL,  this.subviews['title'].getTitleAsLabel());
    };

    return ProjectsView;
});
