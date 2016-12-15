define(
    [
        'loglevel',
        'jquery',
        'underscore',
        'html/priority/filters.hbs',
        'nls/filter',
        'fenix-ui-filter',
        'common/filter-validator',
        'utils/filter-utils',
        'config/config-base',
        'config/errors',
        'config/priority/config-priority-analysis',
        'config/priority/events',
        'amplify-pubsub'
    ], function (log, $, _, template, i18nLabels, Filter, FilterValidator, FilterUtils, BaseConfig, Errors, PriorityAnalysisConfig, BaseEvents, amplify) {

        'use strict';

        var s = {
            css_classes: {
                FILTER_ANALYSE_PRIORITY_ANALYSIS: "#filter-priority",
                FILTER_ERRORS_HOLDER: "#filter-priority-errors-holder"
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
         * @class PriorityFilterView
         * @extends View
         */


        function PriorityFilterView(o) {
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

        PriorityFilterView.prototype._parseInput = function (params) {
            this.$el = $(this.el);
            this.lang = params.lang || BaseConfig.LANG.toLowerCase();
            this.environment = params.environment  || BaseConfig.ENVIRONMENT;
            this.config = params.config;

        };

        PriorityFilterView.prototype._validateInput = function () {

            var valid = true,
                errors = [];

            //Check if $el exist
            if (this.$el.length === 0) {
                errors.push({code: Errors.MISSING_CONTAINER});
                log.warn("Impossible to find filter container");
            }

            return errors.length > 0 ? errors : valid;
        };

        PriorityFilterView.prototype._attach = function () {
            this.$el.append(template);
        };

        PriorityFilterView.prototype._init = function () {
            this.filterUtils = new FilterUtils();

            this.$titleItemsList = this.$el.find(s.css_classes.TITLE_ITEMS_LIST);
        };

        /**
         * Updates filter configuration and renders the filter.
         * @private
         */
        PriorityFilterView.prototype._buildFilters = function () {
            var self = this;

            var filterConfig = this.filterUtils.getUpdatedFilterConfig(this.config, this.lang);

            if (!_.isEmpty(filterConfig)) {
                this.$el.find(s.css_classes.FILTER_ANALYSE_PRIORITY_ANALYSIS).show();
                this._renderFilter(filterConfig);
            } else {
                this.$el.find(s.css_classes.FILTER_ANALYSE_PRIORITY_ANALYSIS).hide();
            }
        };


        /*
         * Instantiates the FENIX Filter Sub Module with the configuration and sets the Filter Event Handlers
         * @param config
         * @private
         */
        PriorityFilterView.prototype._renderFilter = function (config) {
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
                el: this.$el.find(s.css_classes.FILTER_ANALYSE_PRIORITY_ANALYSIS),
                environment: this.environment,
                // items: config,
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

                  //==============================================================

                // For the Recipient Country or resource Partner set the topic and properties
                if (this._getSelectorValues(BaseConfig.SELECTORS.RECIPIENT_COUNTRY) || this._getSelectorValues(BaseConfig.SELECTORS.RESOURCE_PARTNER)) {

                    var recipientValue = this._getFirstSelectorValue(BaseConfig.SELECTORS.RECIPIENT_COUNTRY);
                    var partnerValue = this._getFirstSelectorValue(BaseConfig.SELECTORS.RESOURCE_PARTNER);

                    var selections = [], topic, topicProps, properties;

                    if (recipientValue === s.exclusions.ALL) {
                        selections = [];

                        // FROM FILTER: ALL resource partners selected
                        if (partnerValue === s.exclusions.ALL) {
                            // --> All partners + All recipients
                            selections = [];
                            topic = PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED;
                            selections.push(this.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED, s.exclusions.ALL));
                            selections.push(this.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED, s.exclusions.ALL));
                        }
                        // FROM FILTER: 1 resource partner selected
                        else {
                            // --> 1 partner + All recipients
                            topic = PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED;
                            selections.push(this.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED, this._getLabel(BaseConfig.SELECTORS.RESOURCE_PARTNER_SELECTED, partnerValue)));
                            selections.push(this.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED, s.exclusions.ALL));
                        }
                    }
                    // FROM FILTER: 1 Recipient Country selected
                    else {
                        selections = [];

                        // All resource partners selected
                        if (partnerValue === s.exclusions.ALL) {
                            // --> All partner + 1 recipient
                            topic = PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED;
                            selections.push(this.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED, s.exclusions.ALL));
                            selections.push(this.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED, this._getLabel(BaseConfig.SELECTORS.RECIPIENT_COUNTRY, recipientValue)));
                        }
                        // 1 resource partners selected
                        else {
                            // --> 1 partner + 1 recipient
                            topic = PriorityAnalysisConfig.topic.RECIPIENT_AND_PARTNER_SELECTED;
                            selections.push(this.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED, this._getLabel(BaseConfig.SELECTORS.RESOURCE_PARTNER, partnerValue)));
                            selections.push(this.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED, this._getLabel(BaseConfig.SELECTORS.RECIPIENT_COUNTRY, recipientValue)));
                        }
                    }

                    topicProps = this.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.SELECTED_TOPIC, topic);
                    properties = [topicProps, {selections: selections}];

                    amplify.publish(BaseEvents.FILTER_ON_READY, $.extend(this._getFormattedFilterValues(), {"props": properties}));
                }
            }, this);


            // Filter on Change: Set some base properties for Recipient and the ODA, then publish Filter On Change Event
            this.filter.on('select', function (payload) {

               // validate filter
                var valid = this.filterValidator.validateValues(this._getSelectedValues(), this.lang);


                if (valid === true && this._getFirstPayloadValue(payload)) {
                    this.filterValidator.hideErrorSection();

                    var topic,
                        selections = [],
                        dependencies = [],
                        payloadId = payload.id,
                        topicProps, properties;

                    var fc = this.filterUtils.getFilterConfigById(this.config, payload.id);

                    if (fc && fc.dependencies) {
                        for (var id in fc.dependencies) {
                            dependencies.push(id);
                        }

                        payload["dependencies"] = dependencies;
                    }

                    if (payloadId === BaseConfig.SELECTORS.RECIPIENT_COUNTRY) {
                        if(payload.values.length > 0) {

                            var partnerValue = this._getFirstSelectorValue(BaseConfig.SELECTORS.RESOURCE_PARTNER);
                            var payloadRecipientValue = this._getFirstPayloadValue(payload);

                            // FROM FILTER VALUES: ALL Resource Partners selected
                            if (partnerValue === s.exclusions.ALL) {
                                selections = [];

                                // FROM PAYLOAD: ALL recipients are selected
                                if (payloadRecipientValue === s.exclusions.ALL) {
                                    // --> All recipient + All partners
                                    topic = PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED;
                                    selections.push(this.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED, s.exclusions.ALL));
                                    selections.push(this.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED,  s.exclusions.ALL));

                                }
                                // FROM PAYLOAD: 1 recipients selected
                                else {
                                    // --> 1 recipient + All partners
                                    topic = PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED;
                                    selections.push(this.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED, this._getLabel(BaseConfig.SELECTORS.RECIPIENT_COUNTRY, payloadRecipientValue)));
                                    selections.push(this.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED,  s.exclusions.ALL));
                                }
                            }
                            // FROM FILTER VALUES: 1 Resource Partner selected
                            else {
                                selections = [];

                                // FROM PAYLOAD: All recipients are selected
                                if (payloadRecipientValue === s.exclusions.ALL) {
                                    // --> All recipient + 1 partner
                                    topic = PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED;
                                    selections.push(this.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED, s.exclusions.ALL));
                                    selections.push(this.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED,  this._getLabel(BaseConfig.SELECTORS.RESOURCE_PARTNER, partnerValue)));

                                }
                                // FROM PAYLOAD: 1 recipient selected
                                else {
                                    // --> 1 recipient + 1 partner
                                    topic = PriorityAnalysisConfig.topic.RECIPIENT_AND_PARTNER_SELECTED;
                                    selections.push(this.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED, this._getLabel(BaseConfig.SELECTORS.RECIPIENT_COUNTRY, payloadRecipientValue)));
                                    selections.push(this.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED,  this._getLabel(BaseConfig.SELECTORS.RESOURCE_PARTNER, partnerValue)));
                                }
                            }

                            topicProps = this.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.SELECTED_TOPIC, topic);
                            properties = [topicProps, {selections: selections}];

                            //console.log("========================= FilterView: ON CHANGE COUNTRY ============== " + topic);
                            amplify.publish(BaseEvents.FILTER_ON_CHANGE, $.extend(payload, {"props": properties}));
                        }

                    }
                    else if (payloadId === BaseConfig.SELECTORS.RESOURCE_PARTNER) {

                        if(payload.values.length > 0) {

                            var recipientValue = this._getFirstSelectorValue(BaseConfig.SELECTORS.RECIPIENT_COUNTRY);
                            var payloadPartnerValue = this._getFirstPayloadValue(payload);


                            // FROM FILTER: ALL Recipients selected
                            if (recipientValue === s.exclusions.ALL) {
                                selections = [];

                                // FROM PAYLOAD: ALL resource partners selected
                                if (payloadPartnerValue === s.exclusions.ALL) {
                                    // --> All partners + All recipients
                                    selections = [];
                                    topic = PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED;
                                    selections.push(this.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED,  s.exclusions.ALL));
                                    selections.push(this.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED, s.exclusions.ALL));
                                }
                                // FROM PAYLOAD: 1 resource partner selected
                                else {
                                    // --> 1 partner + All recipients
                                    topic = PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED;
                                    selections.push(this.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED, this._getLabel(BaseConfig.SELECTORS.RESOURCE_PARTNER, payloadPartnerValue)));
                                    selections.push(this.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED, s.exclusions.ALL));
                                }
                            }
                            // FROM FILTER: 1 Recipient Country selected
                            else {
                                selections = [];

                                // All resource partners selected
                                if (payloadPartnerValue === s.exclusions.ALL) {
                                    // --> All partner + 1 recipient
                                    topic = PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED;
                                    selections.push(this.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED,  s.exclusions.ALL));
                                    selections.push(this.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED, this._getLabel(BaseConfig.SELECTORS.RECIPIENT_COUNTRY, recipientValue)));
                                }
                                // 1 resource partners selected
                                else {
                                    // --> 1 partner + 1 recipient
                                    topic = PriorityAnalysisConfig.topic.RECIPIENT_AND_PARTNER_SELECTED;
                                    selections.push(this.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RESOURCE_PARTNER_SELECTED,  this._getLabel(BaseConfig.SELECTORS.RESOURCE_PARTNER, payloadPartnerValue)));
                                    selections.push(this.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.RECIPIENT_COUNTRY_SELECTED, this._getLabel(BaseConfig.SELECTORS.RECIPIENT_COUNTRY, recipientValue)));
                                }
                            }

                            topicProps = this.filterUtils.getPropertiesObject(PriorityAnalysisConfig.topic.SELECTED_TOPIC, topic);
                            properties = [topicProps, {selections: selections}];

                            //console.log("========================= FilterView: ON PARTNER ============== " + topic);
                            amplify.publish(BaseEvents.FILTER_ON_CHANGE, $.extend(payload, {"props": properties}));

                        }

                    }
                    else if (payloadId === BaseConfig.SELECTORS.YEAR_TO || payloadId === BaseConfig.SELECTORS.YEAR_FROM) {

                        // Check only for the To payload.
                        //--------------------------------
                        // When From is selected, the To is automatically re-populated and this in turn triggers its own 'on Change'.
                        // The result is that the 'BaseEvents.FILTER_ON_CHANGE' is published twice (1 for the From and then automatically again for the To).
                        // To avoid the double publish, only the last 'on Change' trigger is evaluated i.e. when payload = 'To'

                        if (payloadId === BaseConfig.SELECTORS.YEAR_TO) {

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
                        //console.log("========================= FilterView: ELSE ============== "+topic);
                        amplify.publish(BaseEvents.FILTER_ON_CHANGE, payload);
                    }
                } else {
                    self.filterValidator.displayErrorSection(valid);
                }

            }, this);

        };


        /**
         * Get the selected filter values
         * @returns {Object} values
         * @private
         */

        PriorityFilterView.prototype._getSelectedValues = function () {
            return this._getFormattedFilterValues().values;
        };


        /**
         *  Get the selected filter labels
         * @returns {Object} labels
         * @private
         */
        PriorityFilterView.prototype._getSelectedLabels = function () {
            return this._getFormattedFilterValues().labels;
        };

        /**
         *  Get the selected filter labels
         * @returns {Object} labels
         * @private
         */
        PriorityFilterView.prototype._getSelectedLabels = function () {
            return this._getFormattedFilterValues().labels;
        };

        PriorityFilterView.prototype._getLabel = function (id, code) {
            return this._getFormattedFilterValues().labels[id][code];
        };

        PriorityFilterView.prototype._getSelectorValues = function (id) {
            return  this._getFormattedFilterValues().values[id];
        };

        PriorityFilterView.prototype._getFirstSelectorValue = function (id) {
            if(this._getSelectorValues(id)){
                return this._getFormattedFilterValues().values[id][0]
            }
        };



        /**
         *  Get the full filter values object (consists of labels and values)
         * @returns {Object} filterValues
         */
        PriorityFilterView.prototype.getFilterValues = function () {
            var filteredValues = this._resetSelections();

            return filteredValues;
        };


        PriorityFilterView.prototype._resetSelections = function () {

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
            if(this._getFirstSelectorValue(BaseConfig.SELECTORS.RECIPIENT_COUNTRY) && this._getFirstSelectorValue(BaseConfig.SELECTORS.RECIPIENT_COUNTRY) === s.exclusions.ALL) {
                values[BaseConfig.SELECTORS.RECIPIENT_COUNTRY] = [];
            }

            // if all values selected clear
            if(this._getFirstSelectorValue(BaseConfig.SELECTORS.RESOURCE_PARTNER) && this._getFirstSelectorValue(BaseConfig.SELECTORS.RESOURCE_PARTNER) === s.exclusions.ALL) {
                values[BaseConfig.SELECTORS.RESOURCE_PARTNER] = [];
            }


            return filteredValues;
        };


        PriorityFilterView.prototype._getFormattedFilterValues = function () {
            var filterValues = this.filter.getValues();
            return this._formatFilterValues(filterValues);
        };


        /**
         * Format the time range and ODA values
         * @returns {Object}
         * @private
         */


        PriorityFilterView.prototype._formatFilterValues = function (filterValues) {
            var timerange = {
                values: {year: [{value: '', parent: s.range.FROM}, {value: '', parent: s.range.TO}]},
                labels: {year: {range: ''}}
            };

            var updatedValuesWithYear = {}, updatedValuesWithODA = {}, extendedValues = $.extend(true, {}, filterValues, timerange);

            updatedValuesWithYear = this.filterUtils.processTimeRange(extendedValues);

           // updatedValuesWithODA = this.filterUtils.removeODAPrefix(updatedValuesWithYear);

            return updatedValuesWithYear;//updatedValuesWithODA;

        };

        PriorityFilterView.prototype._getPayloadValues = function (payload) {
            return  payload.values;//payload.values.values;
        };

        PriorityFilterView.prototype._getFirstPayloadValue = function (payload) {
            return  this._getPayloadValues(payload)[0];
        };


        return PriorityFilterView;
    });
