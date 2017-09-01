/*global define, amplify*/
define([
    'loglevel',
    'jquery',
    'jquery-ui',
    'underscore',
    'common/title-view',
    'projects/projects-filter-view',
    'projects/dashboard-table-view',
    'models/table',
    'html/projects/projects.hbs',
    'config/errors',
    'config/events',
    'config/config-base',
    'config/projects/events',
    'config/projects/config-projects',
    'config/projects/config-filter',
    'config/projects/config-table-other-sectors',
    'config/projects/config-table-fao-sectors',
    'amplify-pubsub'
], function (log, $, $UI, _, TitleSubView, FilterSubView, DashboardTableSubView, TableModel, template, Errors, Events, GeneralConfig, BaseProjectsEvents, BaseProjectsConfig, BaseFilterConfig, TableConfigOtherSectors, TableConfigFAOSectors, amplify) {

    'use strict';

    var s = {
        css_classes: {
            TITLE_BAR_ITEMS: "#projects-fx-title-items",
            FILTER_HOLDER: "#projects-filter-holder",
            DASHBOARD_TABLE_HOLDER: "#projects-table-content"
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
        amplify.subscribe(BaseProjectsEvents.FILTER_ON_READY, this, this._filtersLoaded);
        amplify.subscribe(BaseProjectsEvents.FILTER_ON_CHANGE, this, this._filtersChanged);
    };

    ProjectsView.prototype._unbindEventListeners = function () {
        // Remove listeners
        amplify.unsubscribe(BaseProjectsEvents.FILTER_ON_READY, this._filtersLoaded);
        amplify.unsubscribe(BaseProjectsEvents.FILTER_ON_CHANGE, this._filtersChanged);
    };


    ProjectsView.prototype._initSubViews = function () {

        // Filter Configuration
        if (!BaseFilterConfig || !BaseFilterConfig.filter) {
            alert("Impossible to find filter configuration ");
            return;
        }

        // Table Dashboard Configuration for Other Sectors
        if (!TableConfigOtherSectors || !TableConfigOtherSectors.dashboard) {
            alert("Impossible to find Other Sectors TABLE dashboard configuration" );
            return;
        }

        // Table Dashboard Configuration for FAO Sectors
        if (!TableConfigFAOSectors || !TableConfigFAOSectors.dashboard) {
            alert("Impossible to find FAO Sectors TABLE dashboard configuration" );
            return;
        }


        //Set default dashboard configuration
        if (TableConfigOtherSectors.id === BaseProjectsConfig.dashboard.DEFAULT_CONFIG) {
            this.tableConfig = TableConfigOtherSectors;
        } else if (TableConfigFAOSectors.id === BaseProjectsConfig.dashboard.DEFAULT_CONFIG) {
            this.tableConfig = TableConfigFAOSectors;
        }


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
            config: this.tableConfig.dashboard,
            subtitle: this.subviews['title']
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

        this.subviews['tableDashboard'].filterLoaded = true;
        this.subviews['tableDashboard'].itemsToWait = 4;
        // Render each Dashboard
        this.subviews['tableDashboard'].rebuildDashboard();

    };

    /**
     * When a filter selection changes the view is updated
     * @param changedFilter The filter which has changed
     * @private
     */
    ProjectsView.prototype._filtersChanged = function (changedFilter) {

        if (this.subviews['tableDashboard'].filterLoaded === undefined) return ;

        var allFilterValues = this.subviews['filters'].getFilterValues();

        if((changedFilter!=null)&&(typeof changedFilter!='undefined')&&(changedFilter[0]!=null)&&(typeof changedFilter[0]!='undefined')){
            if((changedFilter[0].id!=null)&&(typeof changedFilter[0].id!='undefined')&&(changedFilter[0].id== 'fao_region')){
                this.subviews['tableDashboard'].itemsToWait = 4;
            }
        }
        this._updateView(changedFilter, allFilterValues);
     };


    /**
     * Each Dashboard and Title Sub View is rebuilt/refreshed
     * @param changedFilter The filter which has changed
     * @param allFilterValues All (selected) filter values
     * @private
     */

    ProjectsView.prototype._updateView = function (changedFilterItems, allFilterValues) {

        var filterValues = allFilterValues;

        if (changedFilterItems) {

            if($.isArray(changedFilterItems)){

                this._setItemTitle(changedFilterItems, filterValues.labels);


                var dashboardConfig = this.subviews['tableDashboard'].getDashboardConfig();
                var config = this.tableConfig;

                // check filter values contains 9999
                for(var idx in changedFilterItems){
                    var changedFilter = changedFilterItems[idx];
                    if (changedFilter.values.length > 0) {
                        if (changedFilter.id === GeneralConfig.SELECTORS.SECTOR) {
                            if(changedFilter.values[0] === '9999'){
                                //console.log("============== FAO ", config);
                                config = TableConfigFAOSectors;
                                dashboardConfig = TableConfigFAOSectors.dashboard;
                            } else {
                                //console.log("============== OTHER ", config);
                                config = TableConfigOtherSectors;
                                dashboardConfig = TableConfigOtherSectors.dashboard;
                            }
                            break;
                        }
                    }
                }


                console.log("============== CONFIG ", dashboardConfig.items[0]);

                //console.log('%c _updateView ', 'color: green');
                //console.log(changedFilterItems);

                this._getDashboardConfiguration(filterValues, dashboardConfig);
            }
        }

    };


    /**
     * Get the appropriate Dashboard JS configuration file via requireJS, if the topic has changed
     * @param topic
     * @param filterValues
     * @private
     */
    ProjectsView.prototype._getDashboardConfiguration = function (filterValues, tableConfig) {

        this._rebuildDashboards(filterValues, tableConfig);
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
        this.subviews['tableDashboard'].rebuildDashboard(filterValues, this.subviews['tableDashboard'].itemsToWait);
    };

    /**
     * Create the Title Item (from the filterItem's id and label)
     * @param filterItem
     * @private
     */

    ProjectsView.prototype._createTitleItem = function (filterItemId, filterItemLabel) {

        var titleItem = {};
        titleItem.id = filterItemId;
        titleItem.label = filterItemLabel;

        return titleItem;
    };


    ProjectsView.prototype._updateTableDashboardModelValues = function () {

        this.tableModel.set(s.dashboardModel.LABEL,  this.subviews['title'].getTitleAsLabel());
    };


    ProjectsView.prototype._setItemTitle = function (changedFilterItems, labels){
        for(var idx in changedFilterItems){
            var changedFilter = changedFilterItems[idx];

            if (changedFilter.values.length > 0) {
                // All is selected

                var val = changedFilter.values[0],
                    label = labels[changedFilter.id][val];

                if(changedFilter.id === GeneralConfig.SELECTORS.YEAR){
                    label = labels[changedFilter.id]["range"];
                }


                if (val === s.values.ALL) {
                    // Update the TitleView (Remove Item)
                    amplify.publish(Events.TITLE_REMOVE_ITEM, changedFilter.id);
                } else {
                    // Update the TitleView (Add Item)
                    //  console.log("::::: _updateView:::: =============== _setItemTitle ============ "+changedFilter.id, labels);
                    amplify.publish(Events.TITLE_ADD_ITEM, this._createTitleItem(changedFilter.id, label));
                }
            }
        }
    };

    return ProjectsView;
});
