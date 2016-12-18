define(
    [
        'loglevel',
        'jquery',
        'underscore',
        'html/comp-advantage/filters.hbs',
        'fenix-ui-filter',
        'common/filter-validator',
        'utils/filter-utils',
        'config/config-base',
        'config/errors',
        'config/comp-advantage/config-comp-advantage',
        'config/comp-advantage/events',
        'amplify-pubsub'
    ], function (log, $, _, template, Filter, FilterValidator, FilterUtils, BaseConfig, Errors, PartnerMatrixConfig, BaseEvents, amplify) {

        'use strict';

        var s = {
            css_classes: {
                FILTER_ANALYSE_COMP_ADVANTAGE: "#filter-comp-advantage",
                FILTER_ERRORS_HOLDER: "#filter-comp-advantage-matrix-errors-holder"
            },
            exclusions: {
                ALL: 'all'
            },
            range: {
                FROM: 'from',
                TO: 'to'
            }
        };

        /**
         * Creates a new Filter View.
         * Instantiates the FENIX filter submodule and responsible for all filter related functionality.
         * @class ComparativeAdvantageFilterView
         * @extends View
         */

        function ComparativeAdvantageFilterView(o) {
            //  log.info("FilterView");
            // log.info(o);

            $.extend(true, this, o);


            this._parseInput(o);

            var valid = this._validateInput();

            if (valid === true) {

                this._attach();

                this._init();

                this._buildFilters();

                return this;

            } else {
                log.error("Impossible to create Filter View");
                log.error(valid)
            }
        }

        ComparativeAdvantageFilterView.prototype._parseInput = function (params) {
            this.$el = $(this.el);
            this.lang = params.lang || BaseConfig.LANG.toLowerCase();
            this.environment = params.environment  || BaseConfig.ENVIRONMENT;
            this.config = params.config;

        };

        ComparativeAdvantageFilterView.prototype._validateInput = function () {

            var valid = true,
                errors = [];

            //Check if $el exist
            if (this.$el.length === 0) {
                errors.push({code: Errors.MISSING_CONTAINER});
                log.warn("Impossible to find filter container");
            }

            return errors.length > 0 ? errors : valid;
        };

        ComparativeAdvantageFilterView.prototype._attach = function () {
            this.$el.append(template);
        };

        ComparativeAdvantageFilterView.prototype._init = function () {
            this.filterUtils = new FilterUtils();

            this.$titleItemsList = this.$el.find(s.css_classes.TITLE_ITEMS_LIST);
        };

        /**
         * Updates filter configuration and renders the filter.
         * @private
         */
        ComparativeAdvantageFilterView.prototype._buildFilters = function () {
            var self = this;

            var filterConfig = this.filterUtils.getUpdatedFilterConfig(this.config, this.lang);

            if (!_.isEmpty(filterConfig)) {
                this.$el.find(s.css_classes.FILTER_ANALYSE_COMP_ADVANTAGE).show();
                this._renderFilter(filterConfig);
            } else {
                this.$el.find(s.css_classes.FILTER_ANALYSE_COMP_ADVANTAGE).hide();
            }
        };

        /**
         *
         * Instantiates the FENIX Filter Sub Module with the configuration and sets the Filter Event Handlers
         * @param config
         * @private
         */
        ComparativeAdvantageFilterView.prototype._renderFilter = function (config) {
            var self = this;


            // dispose of filter
            if (this.filter && $.isFunction(this.filter.dispose)) {
                this.filter.dispose();
            }


            // instantiate new filter validator
            this.filterValidator = new FilterValidator({
                el: this.$el.find(s.css_classes.FILTER_ERRORS_HOLDER),
                lang: this.lang
            });

            // instantiate new filter
            this.filter = new Filter({
                el: this.$el.find(s.css_classes.FILTER_ANALYSE_COMP_ADVANTAGE),
                environment: this.environment,
                selectors: config,
                common: {
                    template: {
                        hideSwitch: true,
                        hideRemoveButton: true
                    }
                }
            });

            // Set filter event handlers
            // Filter on Ready: Set some base properties for Recipient and the ODA, then publish Filter Ready Event
            this.filter.on('ready', function (payload) {
                amplify.publish(BaseEvents.FILTER_ON_READY, this._getFormattedFilterValues());
            }, this);


            // Filter on Change: Set some base properties for Recipient and the ODA, then publish Filter On Change Event
            this.filter.on('select', function (payload) {

                // validate filter
                var valid = this.filterValidator.validateValues(this._getSelectedValues(), this.lang);


                if (valid === true && this._getFirstPayloadValue(payload)) {
                    this.filterValidator.hideErrorSection();

                    var fc = this.filterUtils.getFilterConfigById(this.config, payload.id),
                        payloadId = payload.id,
                        dependencies = [];


                    if (fc && fc.dependencies) {
                        for (var id in fc.dependencies) {
                            dependencies.push(id);
                        }

                        payload["dependencies"] = dependencies;
                    }

                    if (payloadId === BaseConfig.SELECTORS.YEAR_TO || payloadId === BaseConfig.SELECTORS.YEAR_FROM) {

                        // Check only for the To payload.
                        //--------------------------------
                        // When From is selected, the To is automatically re-populated and this in turn triggers its own 'on Change'.
                        // The result is that the 'BaseEvents.FILTER_ON_CHANGE' is published twice (1 for the From and then automatically again for the To).
                        // To avoid the double publish, only the last 'on Change' trigger is evaluated i.e. when payload = 'To'

                        if ( payloadId === BaseConfig.SELECTORS.YEAR_TO) {

                            var newRange = this.filterUtils.getObject(BaseConfig.SELECTORS.YEAR, this._getSelectedLabels());

                            if (newRange) {
                                payload.id = BaseConfig.SELECTORS.YEAR;
                                payload.labels = this.filterUtils.getObject(BaseConfig.SELECTORS.YEAR, this._getSelectedLabels());
                                payload.values = this.filterUtils.getObject(BaseConfig.SELECTORS.YEAR, this._getSelectedValues());
                            }

                            amplify.publish(BaseEvents.FILTER_ON_CHANGE, payload);
                        }

                    }
                    else {
                        amplify.publish(BaseEvents.FILTER_ON_CHANGE, payload);
                    }
                } else {
                    this.filterValidator.displayErrorSection(valid);
                }

            }, this);

        };


        /**
         * Get the selected filter values
         * @returns {Object} values
         * @private
         */

        ComparativeAdvantageFilterView.prototype._getSelectedValues = function () {
            return this._getFormattedFilterValues().values;
        };


        /**
         *  Get the selected filter labels
         * @returns {Object} labels
         * @private
         */
        ComparativeAdvantageFilterView.prototype._getSelectedLabels = function () {
            return this._getFormattedFilterValues().labels;
        };

        /**
         *  Get the selected filter labels
         * @returns {Object} labels
         * @private
         */
        ComparativeAdvantageFilterView.prototype._getSelectedLabels = function () {
            return this._getFormattedFilterValues().labels;
        };

        ComparativeAdvantageFilterView.prototype._getLabel = function (id, code) {
            return this._getFormattedFilterValues().labels[id][code];
        };

        ComparativeAdvantageFilterView.prototype._getSelectorValues = function (id) {
            return  this._getFormattedFilterValues().values[id];
        };

        ComparativeAdvantageFilterView.prototype._getFirstSelectorValue = function (id) {
            if(this._getSelectorValues(id)){
                return this._getFormattedFilterValues().values[id][0]
            }
        };



        /**
         *  Get the full filter values object (consists of labels and values)
         * @returns {Object} filterValues
         */
        ComparativeAdvantageFilterView.prototype.getFilterValues = function () {
            var filteredValues = this._resetSelections();

            return filteredValues;
        };


        ComparativeAdvantageFilterView.prototype._resetSelections = function () {

            var filteredValues = this._getFormattedFilterValues();

            var values = filteredValues.values;

            //clear uid values
            values["uid"] = [];

            values[BaseConfig.SELECTORS.YEAR_FROM] = [];
            values[BaseConfig.SELECTORS.YEAR_TO] = [];

            // if all values selected clear
            // if(this._getFirstSelectorValue(BaseConfig.SELECTORS.REGION) && this._getFirstSelectorValue(BaseConfig.SELECTORS.REGION) === s.exclusions.ALL) {
            //    values[BaseConfig.SELECTORS.REGION] = [];
            //}

            // if all values selected clear
           // if(this._getFirstSelectorValue(BaseConfig.SELECTORS.RECIPIENT_COUNTRY) && this._getFirstSelectorValue(BaseConfig.SELECTORS.RECIPIENT_COUNTRY) === s.exclusions.ALL) {
               // values[BaseConfig.SELECTORS.RECIPIENT_COUNTRY] = [];
           // }

            // if all values selected clear
            //if(this._getFirstSelectorValue(BaseConfig.SELECTORS.RESOURCE_PARTNER) && this._getFirstSelectorValue(BaseConfig.SELECTORS.RESOURCE_PARTNER) === s.exclusions.ALL) {
              //  values[BaseConfig.SELECTORS.RESOURCE_PARTNER] = [];
           // }



            return filteredValues;
        };


        ComparativeAdvantageFilterView.prototype._getFormattedFilterValues = function () {
            var filterValues = this.filter.getValues();
            return this._formatFilterValues(filterValues);
        };


        /**
         * Format the time range and ODA values
         * @returns {Object}
         * @private
         */


        ComparativeAdvantageFilterView.prototype._formatFilterValues = function (filterValues) {
            var timerange = {
                values: {year: [{value: '', parent: s.range.FROM}, {value: '', parent: s.range.TO}]},
                labels: {year: {range: ''}}
            };

            var updatedValuesWithYear = {}, updatedValuesWithODA = {}, extendedValues = $.extend(true, {}, filterValues, timerange);

            updatedValuesWithYear = this.filterUtils.processTimeRange(extendedValues);

            return updatedValuesWithYear;

        };


        ComparativeAdvantageFilterView.prototype._getPayloadValues = function (payload) {
            return  payload.values;
        };

        ComparativeAdvantageFilterView.prototype._getFirstPayloadValue = function (payload) {
            return  this._getPayloadValues(payload)[0];
        };


        return ComparativeAdvantageFilterView;
    });
