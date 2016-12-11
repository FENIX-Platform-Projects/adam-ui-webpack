/*global define, amplify*/
define([
    'loglevel',
    'jquery',
    'underscore',
    'html/browse/browse.hbs',
    'nls/browse',
    'config/events',
    'config/config-base',
    'config/errors',
    'config/browse/events',
    'config/browse/dashboards/indicators/config-development-indicators',
    'config/browse/display/config-by-filter-selections',
    'config/browse/config-browse',
    'common/title-view',
    'browse/browse-filter-view',
    'browse/oecd-dashboard-view',
    'browse/development-indicators-dashboard-view',
    'models/oecd',
    'models/indicators',
    'amplify-pubsub',
    'bootstrap'
], function (log, $, _, template, i18nLabels, Events, GeneralConfig, Errors, BaseBrowseEvents, BrowseIndicatorsConfig, DisplayConfigByFilterSelections, BaseBrowseConfig,
             TitleSubView, FilterSubView, OECDDashboardSubView, DashboardIndicatorsSubView, OecdModel, IndicatorsModel, amplify, bootstrap) {

    'use strict';

    var s = {
        css_classes: {
            TITLE_BAR_ITEMS: "#fx-title-items",
            BACK_TO_TOP_FIXED: "#browse-top-link-fixed",
            FILTER_HOLDER: "#browse-filter-holder",
            DASHBOARD_OECD_HOLDER: "#browse-oecd-content",
            DASHBOARD_INDICATORS_HOLDER: "#browse-indicator-content",
            PRINT_PAGE: "#print-page-button"
        },
        dashboardModel: {
            COUNTRY: 'selected_country',
            TOPIC: 'topic',
            LABEL: 'label'
        },
        values: {
            ALL: 'all'
        },
        paths: {
            OECD_DASHBOARD_FAO_SECTORS_CONFIG: 'config/browse/dashboards/oecd/fao_sectors/config-',
            OECD_DASHBOARD_OTHER_SECTORS_CONFIG: 'config/browse/dashboards/oecd/other_sectors/config-',
            OECD_DASHBOARD: 'config/browse/dashboards/oecd/'
        }
    };


    /**
     *
     * Creates a new Browse By View
     * Browse By View comprises of a series of subviews: title view, filter view and 2 dashboard views (development indicators and oecd)
     * @class BrowseByView
     * @extends View
     */

    function BrowseByView(o) {
       // log.info("BrowseByView");
      //  log.info(o);

        $.extend(true, this, o);

        this._parseInput(o);

        var valid = this._validateInput();

        if (valid === true) {

            this._unbindEventListeners();

            this._attach();

            this._init();

            this._render();

            return this;

        } else {
            log.error("Impossible to create Browse By View");
            log.error(valid)
        }
    }

       BrowseByView.prototype._parseInput = function (params) {
        this.$el = $(this.el);
        this.lang = params.lang.toLowerCase() || GeneralConfig.LANG.toLowerCase();
        this.environment = params.environment || GeneralConfig.ENVIRONMENT;
        this.browse_type = params.browse_type;
    };

    BrowseByView.prototype._validateInput = function () {

        var valid = true,
            errors = [];

        //Check if $el exist
        if (this.$el.length === 0) {
            errors.push({code: Errors.MISSING_CONTAINER});
            log.warn("Impossible to find browse by container");
        }

        //check for browse_type
        if (!this.browse_type) {
            errors.push({code: Errors.MISSING_CONTEXT});
            log.warn("No browse by type: " + this.browse_type);
        }

        return errors.length > 0 ? errors : valid;
    };

    BrowseByView.prototype._attach = function () {
        this.template = template(i18nLabels[this.lang]);
        this.$el.append(this.template);
    };

    BrowseByView.prototype._init = function () {
        this._bindEventListeners();
        this.subviews = {};

        // Display can be configured based on the current Browse Type filter selections: i.e. Hide/Show dashboard items based on the current Browse type and/or selected filter values
        this.filterSelectionsTypeDisplayConfig = $.extend( true, {}, DisplayConfigByFilterSelections[this.browse_type]);

    };

    BrowseByView.prototype._bindEventListeners = function () {
        amplify.subscribe(BaseBrowseEvents.FILTER_ON_READY, this, this._filtersLoaded);
        amplify.subscribe(BaseBrowseEvents.FILTER_ON_CHANGE, this, this._filtersChanged);
    };

    BrowseByView.prototype._unbindEventListeners = function () {
        // Remove listeners
        amplify.unsubscribe(BaseBrowseEvents.FILTER_ON_READY, this._filtersLoaded);
        amplify.unsubscribe(BaseBrowseEvents.FILTER_ON_CHANGE, this._filtersChanged);
    };


    BrowseByView.prototype._render = function () {
        this._loadDashboardConfigurations();
    };


    /**
    * Based on the browse type, which is determined by the selected browse by section
    * the appropriate dashboard JS configuration files are loaded via requireJS
    * @private
    */
    BrowseByView.prototype._loadDashboardConfigurations = function () {
        var pth1 = s.paths.OECD_DASHBOARD_OTHER_SECTORS_CONFIG+ this.browse_type + '.js';
        var pth2 = s.paths.OECD_DASHBOARD_FAO_SECTORS_CONFIG+ this.browse_type + '.js';

       require(['../../'+pth1, '../../'+pth2], _.bind(this._initSubViews, this));
    };



    /**
    * Initializes all sub views: Title, Filter, oecd/oda Dashboard and Indicators Dashboard
    * @param ConfigOtherSectors Other Sectors configuration
    * @param ConfigFAOSectors FAO sectors configuration
    * @private
    */

    BrowseByView.prototype._initSubViews = function (ConfigOtherSectors, ConfigFAOSectors) {

        if (!ConfigOtherSectors || !ConfigOtherSectors.dashboard || !ConfigOtherSectors.filter) {
            alert("Impossible to find default ODA dashboard/filter configuration for the topic: " + this.browse_type);
            return;
        }

        if (!ConfigFAOSectors || !ConfigFAOSectors.dashboard || !ConfigFAOSectors.filter) {
            alert("Impossible to find default FAO dashboard/filter configuration for the topic: " + this.browse_type);
            return;
        }

        this.otherSectorsDashboardConfig = ConfigOtherSectors.dashboard;
        this.faoSectorDashboardConfig = ConfigFAOSectors.dashboard;


        //Set default dashboard configuration
        if (ConfigOtherSectors.id === BaseBrowseConfig.dashboard.DEFAULT_CONFIG) {
            this.defaultDashboardConfig = ConfigOtherSectors;
        } else if (ConfigFAOSectors.id === BaseBrowseConfig.dashboard.DEFAULT_CONFIG) {
            this.defaultDashboardConfig = ConfigFAOSectors;
        }


        // Print page
        //$(s.PRINT_PAGE).on('click', _.bind(this.onPrintClick, this));

        // Set TITLE Sub View
        var titleSubView = new TitleSubView({
            el: this.$el.find(s.css_classes.TITLE_BAR_ITEMS),
            title: i18nLabels[this.lang].selections
        });
        this.subviews['title'] = titleSubView;

        // Set FILTER Sub View
        var filtersSubView = new FilterSubView({
            el: this.$el.find(s.css_classes.FILTER_HOLDER),
            config: this.defaultDashboardConfig.filter,
            lang:  this.lang,
            environment: this.environment
        });
        this.subviews['filters'] = filtersSubView;
        //this.subview('filters', filtersSubView);


        // Set ODA DASHBOARD Model
        this.odaDashboardModel = new OecdModel();
        // Set DASHBOARD 1 Sub View: ODA
        var dashboardOecdSubView = new OECDDashboardSubView({
            el: this.$el.find(s.css_classes.DASHBOARD_OECD_HOLDER),
            lang:  this.lang,
            topic: this.browse_type,
            model: this.odaDashboardModel,
            environment: this.environment
        });
        dashboardOecdSubView.setDashboardConfig(this.defaultDashboardConfig.dashboard);

        this.odaDashboardModel.addObserver(dashboardOecdSubView);

        this.subviews['oecdDashboard'] = dashboardOecdSubView;


        // Set DASHBOARD 2 Sub View: Development Indicators
        if (this.browse_type === BaseBrowseConfig.topic.BY_COUNTRY || this.browse_type === BaseBrowseConfig.topic.BY_RESOURCE_PARTNER) {

            var configIndicators = BrowseIndicatorsConfig[this.browse_type];

            if (!configIndicators || !configIndicators.items) {
                alert("Impossible to find configuration for Development Indicators: ");
                return;
            }

            this.indicatorsDashboardConfig = configIndicators;
            // Set ODA DASHBOARD Model
            this.indicatorsDashboardModel = new IndicatorsModel();

            var dashboardIndicatorsSubView = new DashboardIndicatorsSubView({
                el: this.$el.find(s.css_classes.DASHBOARD_INDICATORS_HOLDER),
                lang:  this.lang,
                topic: this.browse_type,
                model: this.indicatorsDashboardModel,
                config: this.indicatorsDashboardConfig,
                environment: this.environment
            });

            this.indicatorsDashboardModel.addObserver(dashboardIndicatorsSubView);

            this.subviews['indicatorsDashboard'] = dashboardIndicatorsSubView;
        }

    };


    BrowseByView.prototype._setOdaDashboardModelValues = function () {
        this.odaDashboardModel.set(s.dashboardModel.LABEL, this.subviews['title'].getTitleAsLabel());
    };

    BrowseByView.prototype._setIndicatorDashboardModelValues = function () {
        var country = this.subviews['title'].getItemText(BaseBrowseConfig.filter.RECIPIENT_COUNTRY);
        var donor = this.subviews['title'].getItemText(BaseBrowseConfig.filter.RESOURCE_PARTNER);

        if (donor.length > 0)
            country = donor;

        this.indicatorsDashboardModel.set(s.dashboardModel.COUNTRY, country);
    };


    /**
    * When the filters have all loaded the TitleView is built using the currently selected filter values
    * and the dashboards are rendered
    * @param payload Selected Filter Items
    * @private
    */
    BrowseByView.prototype._filtersLoaded = function (payload) {

         var selectedFilterItems = payload.labels, displayConfigForFilter, dashboardConfPath;

        // Set Dashboard 1 (ODA) Properties
        if (payload["props"]) {
            this.subviews['oecdDashboard'].setProperties(payload["props"]);
        }

        // Build Title View
        this.subviews['title'].setLabels(selectedFilterItems);
        this.subviews['title'].build();

        var allFilterValues =  this.subviews['filters'].getFilterValues();

        for (var idx in allFilterValues.values){

            displayConfigForFilter = this.filterSelectionsTypeDisplayConfig[idx];

            if(displayConfigForFilter) {
                var filterValue = allFilterValues.values[idx][0];
                var item = this._checkConfigForValue(displayConfigForFilter, filterValue);

                if (item) {
                    displayConfigForFilter = item;

                    if(item.config) {
                        dashboardConfPath = item.config.path;
                        break;
                    }

                }
            }
        }

        this._getDashboardConfiguration(dashboardConfPath, allFilterValues, displayConfigForFilter);

       // Render Dashboard : Development Indicators (if appropriate)
        if (this.browse_type === BaseBrowseConfig.topic.BY_COUNTRY || this.browse_type === BaseBrowseConfig.topic.BY_RESOURCE_PARTNER) {
            this._setIndicatorDashboardModelValues();
            this.subviews['indicatorsDashboard'].renderDashboard();
        }

    };


    /**
    * When a filter selection changes the view is updated
    * @param changedFilter The filter which has changed
    * @private
    */
    BrowseByView.prototype._filtersChanged = function (changedFilter) {
      
        //Reset the display configuration
        this.filterSelectionsTypeDisplayConfig = $.extend( true, {}, DisplayConfigByFilterSelections[this.browse_type]);

       // console.log(" ============ FILTERS CHANGED =========== ");
       // console.log(this.filterSelectionsTypeDisplayConfig );

      
        var allFilterValues = this.subviews['filters'].getFilterValues();

        this._updateView(changedFilter, allFilterValues);

    };

    /**
    * Each Dashboard and Title Sub View is rebuilt/refreshed
    * @param changedFilter The filter which has changed
    * @param allFilterValues All (selected) filter values
    * @private
    */

    BrowseByView.prototype._updateView = function (changedFilterItems, allFilterValues) {

          var filterValues = allFilterValues;

        if (changedFilterItems) {

            if($.isArray(changedFilterItems)){

                this._setItemTitle(changedFilterItems, filterValues.labels);


                for(var idx in changedFilterItems){
                    var changedFilter = changedFilterItems[idx];

                    if (changedFilter.values.length > 0) {
                         if (changedFilter.primary) {
                            this._processSelection(changedFilter, filterValues);
                        }
                    }
                }
            }
        }
    };

    BrowseByView.prototype._setItemTitle = function (changedFilterItems, labels){
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

    /**
    * Create the Title Item (from the filterItem's id and label)
    * @param filterItem
    * @private
    */

    BrowseByView.prototype._createTitleItem = function (filterItemId, filterItemLabel) {

        var titleItem = {};
        titleItem.id = filterItemId;
        titleItem.label = filterItemLabel;

        return titleItem;
    };

    BrowseByView.prototype._processSelection = function (changedFilter, filterValues){
        //console.log("================== _processSelection  =========== 1 ");

        var dashboardConfPath, displayConfigBasedOnFilter, displayConfig = this.filterSelectionsTypeDisplayConfig[changedFilter.id];


        // Update filter with region code
        if(changedFilter.props){

            if(changedFilter.props.regioncode && filterValues.values[GeneralConfig.SELECTORS.REGION]) {
                filterValues.values[GeneralConfig.SELECTORS.REGION] = [];
                filterValues.values[GeneralConfig.SELECTORS.REGION].push(changedFilter.props.regioncode)
            }
        }

        // Get dashboard display configuration, based on filter selections
        if(displayConfig) {
            displayConfigBasedOnFilter = this._getDashboardDisplayConfiguration(displayConfig, changedFilter, filterValues);
            if(displayConfigBasedOnFilter.config){
                dashboardConfPath = displayConfigBasedOnFilter.config.path;
            }
        }

        // Update dashboard properties
        if (changedFilter['props']) {
            this.subviews['oecdDashboard'].setProperties(changedFilter['props']);
        }

        this._getDashboardConfiguration(dashboardConfPath, filterValues, displayConfigBasedOnFilter);

    };

    BrowseByView.prototype._getDashboardDisplayConfiguration = function (displayConfig, changedFilter, filterValues){

        var displayConfigForFilter = displayConfig;

        // Re-configure display (if appropriate)
        if (this.filterSelectionsTypeDisplayConfig) {

            // All is selected
            if (changedFilter.values[0] === s.values.ALL) {

                if(changedFilter.dependencies) {
                    // get the display configuration for the dependency
                    // e.g. When All Sub sectors selected, the view rebuilt with Sector (i.e. dependency) display
                    displayConfigForFilter = this.filterSelectionsTypeDisplayConfig[changedFilter.dependencies[0]];
                }

            }

            if(displayConfig) {
                var item = this._checkConfigForValue(displayConfig, changedFilter.values[0]);

                if (item) {
                    displayConfigForFilter = item;
                } else{
                    var defaultItem = this._getDefaultLayout(displayConfig);
                    if(defaultItem)
                        displayConfigForFilter = defaultItem;
                }

                if(changedFilter.isRecipientRelated){
                    // merge in Sector related

                    if(this.filterSelectionsTypeDisplayConfig[GeneralConfig.SELECTORS.SUB_SECTOR] && this.filterSelectionsTypeDisplayConfig[GeneralConfig.SELECTORS.SECTOR]){

                        var mergeConfig = this._getMergeConfig(filterValues, GeneralConfig.SELECTORS.SECTOR, GeneralConfig.SELECTORS.SUB_SECTOR);
                        displayConfigForFilter = this._mergeDisplayConfigs(displayConfigForFilter, mergeConfig);

                    }
                }

                if(changedFilter.isSectorRelated){
                    // merge in RECIPIENT Related
                    if(this.filterSelectionsTypeDisplayConfig[GeneralConfig.SELECTORS.RECIPIENT_COUNTRY] && this.filterSelectionsTypeDisplayConfig[GeneralConfig.SELECTORS.REGION]){

                        var mergeConfig = this._getMergeConfig(filterValues, GeneralConfig.SELECTORS.REGION, GeneralConfig.SELECTORS.RECIPIENT_COUNTRY);
                        displayConfigForFilter = this._mergeDisplayConfigs(displayConfigForFilter, mergeConfig);

                    }
                }

            }

        }

        return displayConfigForFilter;
    };


    BrowseByView.prototype._checkConfigForValue = function (config, filterValue){
        return _.find(config, function (item) {

            if(item.value){
                return item.value === filterValue;
            }
        });
    };


    /**
    * Load the appropriate JS configuration file via require, if appropriate
    * @param dashboardConfPath
    * @param filterValues
    * @param displayConfigForSelectedFilter
    * @private
    */
    BrowseByView.prototype._getDashboardConfiguration = function (dashboardConfPath, filterValues, displayConfigForSelectedFilter) {
        var self = this;
        // console.log("================= _setDashboardConfiguration Start =============== ", filterValues);
       //  console.log(dashboardConfPath);

        if (dashboardConfPath) {

           var pth1 = s.paths.OECD_DASHBOARD+ dashboardConfPath + '.js';

            require(['../../'+pth1], function (NewDashboardConfig) {
               self._rebuildDashboard(filterValues, displayConfigForSelectedFilter, NewDashboardConfig.dashboard);
            });
        } else {
            self._rebuildDashboard(filterValues, displayConfigForSelectedFilter, this.otherSectorsDashboardConfig);
        }
    };


    /**
    * Rebuild the dashboard
    * @param ovalues
    * @param displayConfigForSelectedFilter
    * @param dashboardConfig
    * @private
    */

    BrowseByView.prototype._rebuildDashboard = function (ovalues, displayConfigForSelectedFilter, dashboardConfig) {

      //  console.log("============= _rebuildDashboard START  ======== IS FAO SELECTED ", this.subviews['filters'].isFAOSectorsSelected());


        // Set Sector Related Dashboard Configuration
        switch (this.subviews['filters'].isFAOSectorsSelected()) {
            case true:
                //  console.log(this.faoSectorDashboardConfig);
                this.subviews['filters'].clearFilterValue(BaseBrowseConfig.filter.SECTOR, ovalues);
                this.subviews['oecdDashboard'].setDashboardConfig(this.faoSectorDashboardConfig);
                break;
            case false:
                this.subviews['oecdDashboard'].setDashboardConfig(dashboardConfig);
                break;
        }


        // Update Dashboard Model
        this._setOdaDashboardModelValues();

        // Rebuild OECD Dashboard
        this.subviews['oecdDashboard'].rebuildDashboard(ovalues, displayConfigForSelectedFilter);

        // REINSTATE ... Rebuild Development Indicators Dashboard
        if (this.browse_type === BaseBrowseConfig.topic.BY_COUNTRY || this.browse_type === BaseBrowseConfig.topic.BY_RESOURCE_PARTNER) {
            this._setIndicatorDashboardModelValues();
            var ivalues = this.subviews['filters'].getIndicatorsValues();
            this.subviews['indicatorsDashboard'].rebuildDashboard(ivalues);
        }

    };



    BrowseByView.prototype._getDefaultLayout = function (config){
        return _.find(config, function (item) {
            if(item.layout){
                return item.layout === "default";
            }
        });
    };

    BrowseByView.prototype._mergeDisplayConfigs = function (config, merge){

        this._mergePropArray(config, merge, 'hide');
        this._mergePropArray(config, merge, 'show');

        return config;

    };

    BrowseByView.prototype._getMergeConfig = function (filterValues, parentId, childId) {
         var mergeConfig = this._getDefaultLayout(this.filterSelectionsTypeDisplayConfig[childId]);

        if (filterValues.values[childId].length === 0) {
            mergeConfig = this._getDefaultLayout(this.filterSelectionsTypeDisplayConfig[parentId]);

            if (filterValues.values[parentId].length > 0) {
                var parentConfig = this._checkConfigForValue(this.filterSelectionsTypeDisplayConfig[parentId],
                    filterValues.values[parentId][0]);

                if (parentConfig) {
                    mergeConfig = parentConfig;
                }
            }

        }


        return mergeConfig;
    };

    BrowseByView.prototype._mergePropArray = function (config, merge, prop){

        var mergeValues = merge[prop];

        if(mergeValues){
            if(config[prop]){
                config[prop].push.apply(config[prop], mergeValues);
                config[prop] = _.uniq(config[prop]); // clean up duplications

            } else {
                config[prop] = mergeValues;
            }
        }

    };

    return BrowseByView;
});
