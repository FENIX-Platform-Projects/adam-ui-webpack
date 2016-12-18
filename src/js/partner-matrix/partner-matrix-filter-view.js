define(
    [
        'loglevel',
        'jquery',
        'underscore',
        'html/partner-matrix/filters.hbs',
        'fenix-ui-filter',
        'common/filter-validator',
        'utils/filter-utils',
        'config/config-base',
        'config/errors',
        'config/partner-matrix/config-partner-matrix',
        'config/partner-matrix/events',
        'amplify-pubsub'
    ], function (log, $, _, template, Filter, FilterValidator, FilterUtils, BaseConfig, Errors, PartnerMatrixConfig, BaseEvents, amplify) {

        'use strict';

        var s = {
            css_classes: {
                FILTER_ANALYSE_PARTNER_MATRIX: "#filter-partner-matrix",
                FILTER_ERRORS_HOLDER: "#filter-partner-matrix-errors-holder"
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
         * @class PartnerMatrixFilterView
         * @extends View
         */

        function PartnerMatrixFilterView(o) {
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

        PartnerMatrixFilterView.prototype._parseInput = function (params) {
            this.$el = $(this.el);
            this.lang = params.lang || BaseConfig.LANG.toLowerCase();
            this.environment = params.environment  || BaseConfig.ENVIRONMENT;
            this.config = params.config;

        };

        PartnerMatrixFilterView.prototype._validateInput = function () {

            var valid = true,
                errors = [];

            //Check if $el exist
            if (this.$el.length === 0) {
                errors.push({code: Errors.MISSING_CONTAINER});
                log.warn("Impossible to find filter container");
            }

            return errors.length > 0 ? errors : valid;
        };

        PartnerMatrixFilterView.prototype._attach = function () {
            this.$el.append(template);
        };

        PartnerMatrixFilterView.prototype._init = function () {
            this.filterUtils = new FilterUtils();

            this.$titleItemsList = this.$el.find(s.css_classes.TITLE_ITEMS_LIST);
        };

        /**
         * Updates filter configuration and renders the filter.
         * @private
         */
        PartnerMatrixFilterView.prototype._buildFilters = function () {
            var self = this;

            var filterConfig = this.filterUtils.getUpdatedFilterConfig(this.config, this.lang);

            if (!_.isEmpty(filterConfig)) {
                this.$el.find(s.css_classes.FILTER_ANALYSE_PARTNER_MATRIX).show();
                this._renderFilter(filterConfig);
            } else {
                this.$el.find(s.css_classes.FILTER_ANALYSE_PARTNER_MATRIX).hide();
            }
        };

        /**
         *
         * Instantiates the FENIX Filter Sub Module with the configuration and sets the Filter Event Handlers
         * @param config
         * @private
         */
        PartnerMatrixFilterView.prototype._renderFilter = function (config) {
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
                el: this.$el.find(s.css_classes.FILTER_ANALYSE_PARTNER_MATRIX),
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

                // For the Recipient Country, set the topic as RECIPIENT_COUNTRY_SELECTED
                if (this._getSelectorValues(BaseConfig.SELECTORS.RECIPIENT_COUNTRY) || this._getSelectorValues(BaseConfig.SELECTORS.RESOURCE_PARTNER)) {

                     var partnerValues = this._getFirstSelectorValue(BaseConfig.SELECTORS.RESOURCE_PARTNER);
                     var recipientValues = this._getFirstSelectorValue(BaseConfig.SELECTORS.RECIPIENT_COUNTRY);

                     var topic;

                    //FROM FILTER: All Resource Partners selected
                    if (partnerValues === s.exclusions.ALL) {
                        // FROM FILTER: All recipients are selected
                        // --> All Recipients + All Partners
                        if (recipientValues === s.exclusions.ALL) {
                            topic = PartnerMatrixConfig.topic.RECIPIENT_COUNTRY_SELECTED;
                        }
                        // FROM PAYLOAD: 1 recipients selected
                        // --> 1 Recipient + All Partners
                        else {
                            topic = PartnerMatrixConfig.topic.RECIPIENT_COUNTRY_SELECTED;
                        }
                    }
                    //FROM FILTER: 1 Resource Partners selected
                    else {
                        // FROM PAYLOAD: All recipients are selected
                        // --> All Recipients + 1 Partner
                        if (recipientValues === s.exclusions.ALL) {
                            topic = PartnerMatrixConfig.topic.RESOURCE_PARTNER_SELECTED;
                        }
                        // FROM PAYLOAD: 1 recipients selected
                        // --> 1 Recipients + 1 Partner
                        else {
                            topic = PartnerMatrixConfig.topic.RECIPIENT_AND_PARTNER_SELECTED;
                        }
                    }

                    var additionalProperties = this.filterUtils.getPropertiesObject(PartnerMatrixConfig.topic.SELECTED_TOPIC, topic);


                    amplify.publish(BaseEvents.FILTER_ON_READY, $.extend(this._getFormattedFilterValues(), {"props": additionalProperties}));

                }

                // For ODA set its value to the props object
                else if (this._getSelectorValues(BaseConfig.SELECTORS.ODA)) {

                    //self._getFilterValues().values[BaseConfig.SELECTORS.ODA].enumeration[0]
                    var additionalProperties = this.filterUtils.getPropertiesObject(BaseConfig.SELECTORS.ODA, this._getFirstSelectorValue(BaseConfig.SELECTORS.ODA) );

                    amplify.publish(BaseEvents.FILTER_ON_READY, $.extend(this._getFormattedFilterValues(), {"props": additionalProperties}));
                }
                else {
                    amplify.publish(BaseEvents.FILTER_ON_READY, this._getFormattedFilterValues());
                }

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
                    else if (payloadId === BaseConfig.SELECTORS.ODA) {
                        var additionalProperties = this.filterUtils.getPropertiesObject(BaseConfig.SELECTORS.ODA, payload.values[0]);

                        amplify.publish(BaseEvents.FILTER_ON_CHANGE, $.extend(payload, {"props": additionalProperties}));
                    }
                    else if (payloadId === BaseConfig.SELECTORS.RECIPIENT_COUNTRY) {

                        if(payload.values.length > 0) {

                            var recipientPayloadValue = payload.values[0];
                            var partnerValues = this._getFirstSelectorValue(BaseConfig.SELECTORS.RESOURCE_PARTNER);

                            var topic;
                            //FROM FILTER: All Resource Partners selected
                            if (partnerValues === s.exclusions.ALL) {
                                // FROM PAYLOAD: All recipients are selected
                                // --> All Recipients + All Partners
                                if (recipientPayloadValue === s.exclusions.ALL) {
                                    topic = PartnerMatrixConfig.topic.RECIPIENT_COUNTRY_SELECTED;
                                }
                                // FROM PAYLOAD: 1 recipients selected
                                // --> 1 Recipient + All Partners
                                else {
                                    topic = PartnerMatrixConfig.topic.RECIPIENT_COUNTRY_SELECTED;
                                }
                            }
                            //FROM FILTER: 1 Resource Partners selected
                            else {
                                // FROM PAYLOAD: All recipients are selected
                                // --> All Recipients + 1 Partner
                                if (recipientPayloadValue === s.exclusions.ALL) {
                                    topic = PartnerMatrixConfig.topic.RESOURCE_PARTNER_SELECTED;
                                }
                                // FROM PAYLOAD: 1 recipients selected
                                // --> 1 Recipients + 1 Partner
                                else {
                                    topic = PartnerMatrixConfig.topic.RECIPIENT_AND_PARTNER_SELECTED;
                                }
                            }

                            var additionalProperties = this.filterUtils.getPropertiesObject(PartnerMatrixConfig.topic.SELECTED_TOPIC, topic);

                            //console.log("========================= FilterView: ON CHANGE COUNTRY ============== " + topic);
                            amplify.publish(BaseEvents.FILTER_ON_CHANGE, $.extend(payload, {"props": additionalProperties}));
                        }

                    }
                    else if (payloadId === BaseConfig.SELECTORS.RESOURCE_PARTNER) {

                        if(payload.values.length > 0) {

                            var partnerPayloadValue = payload.values[0];
                            var recipientValues = this._getFirstSelectorValue(BaseConfig.SELECTORS.RECIPIENT_COUNTRY);

                            var selectedTopic;

                            //FROM FILTER: All Recipients selected
                            if (recipientValues === s.exclusions.ALL) {
                                // FROM PAYLOAD: All partners are selected
                                // --> All Partners + All Recipients
                                if (partnerPayloadValue === s.exclusions.ALL) {
                                    selectedTopic = PartnerMatrixConfig.topic.RECIPIENT_COUNTRY_SELECTED;
                                }
                                // FROM PAYLOAD: 1 partner selected
                                // --> 1 Partner + All Recipients
                                else {
                                    selectedTopic = PartnerMatrixConfig.topic.RESOURCE_PARTNER_SELECTED;
                                }
                            }
                            //FROM FILTER: 1 Recipient selected
                            else {
                                // FROM PAYLOAD: All partners are selected
                                // --> All Partners + 1 Recipient
                                if (partnerPayloadValue === s.exclusions.ALL) {
                                    selectedTopic = PartnerMatrixConfig.topic.RECIPIENT_COUNTRY_SELECTED;
                                }
                                // FROM PAYLOAD: 1 partner selected
                                // --> 1 Partner + 1 Recipient
                                else {
                                    selectedTopic = PartnerMatrixConfig.topic.RECIPIENT_AND_PARTNER_SELECTED;
                                }
                            }

                            var additionalProperties = this.filterUtils.getPropertiesObject(PartnerMatrixConfig.topic.SELECTED_TOPIC, selectedTopic);

                            amplify.publish(BaseEvents.FILTER_ON_CHANGE, $.extend(payload, {"props": additionalProperties}));

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

        PartnerMatrixFilterView.prototype._getSelectedValues = function () {
            return this._getFormattedFilterValues().values;
        };


        /**
         *  Get the selected filter labels
         * @returns {Object} labels
         * @private
         */
        PartnerMatrixFilterView.prototype._getSelectedLabels = function () {
            return this._getFormattedFilterValues().labels;
        };

        /**
         *  Get the selected filter labels
         * @returns {Object} labels
         * @private
         */
        PartnerMatrixFilterView.prototype._getSelectedLabels = function () {
            return this._getFormattedFilterValues().labels;
        };

        PartnerMatrixFilterView.prototype._getLabel = function (id, code) {
            return this._getFormattedFilterValues().labels[id][code];
        };

        PartnerMatrixFilterView.prototype._getSelectorValues = function (id) {
            return  this._getFormattedFilterValues().values[id];
        };

        PartnerMatrixFilterView.prototype._getFirstSelectorValue = function (id) {
            if(this._getSelectorValues(id)){
                return this._getFormattedFilterValues().values[id][0]
            }
        };



        /**
         *  Get the full filter values object (consists of labels and values)
         * @returns {Object} filterValues
         */
        PartnerMatrixFilterView.prototype.getFilterValues = function () {
            var filteredValues = this._resetSelections();

            return filteredValues;
        };


        PartnerMatrixFilterView.prototype._resetSelections = function () {

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


        PartnerMatrixFilterView.prototype._getFormattedFilterValues = function () {
            var filterValues = this.filter.getValues();
            return this._formatFilterValues(filterValues);
        };


        /**
         * Format the time range and ODA values
         * @returns {Object}
         * @private
         */


        PartnerMatrixFilterView.prototype._formatFilterValues = function (filterValues) {
            var timerange = {
                values: {year: [{value: '', parent: s.range.FROM}, {value: '', parent: s.range.TO}]},
                labels: {year: {range: ''}}
            };

            var updatedValuesWithYear = {}, updatedValuesWithODA = {}, extendedValues = $.extend(true, {}, filterValues, timerange);

            updatedValuesWithYear = this.filterUtils.processTimeRange(extendedValues);

            updatedValuesWithODA = this.filterUtils.removeODAPrefix(updatedValuesWithYear);

            return updatedValuesWithODA;

        };


        PartnerMatrixFilterView.prototype._getPayloadValues = function (payload) {
            return  payload.values;
        };

        PartnerMatrixFilterView.prototype._getFirstPayloadValue = function (payload) {
            return  this._getPayloadValues(payload)[0];
        };

      /*  var FilterView = View.extend({

            /!**
             *
             * Instantiates the FENIX Filter Sub Module with the configuration and sets the Filter Event Handlers
             * @param config
             * @private
             *!/
            _renderFilter: function (config) {


                // Set filter event handlers
                // Filter on Ready: Set some additional properties based on the current selections then publish Filter Ready Event
                // SELECTED_TOPIC Property -  based on the Recipient Country and Resource Partner selections
                // ODA Property - based on the ODA selection, then publish Filter Ready Event
                this.filter.on('ready', function (payload) {


                    // For the Recipient Country, set the topic as RECIPIENT_COUNTRY_SELECTED
                    if (self._getFilterValues().values[BaseConfig.SELECTORS.RECIPIENT_COUNTRY] || self._getFilterValues().values[BaseConfig.SELECTORS.RESOURCE_PARTNER]) {

                        var partnerValues = self._getFilterValues().values[BaseConfig.SELECTORS.RESOURCE_PARTNER][0];
                        var recipientValues = self._getFilterValues().values[BaseConfig.SELECTORS.RECIPIENT_COUNTRY][0];

                        var topic;

                        //FROM FILTER: All Resource Partners selected
                        if (partnerValues === 'all') {
                            // FROM FILTER: All recipients are selected
                            // --> All Recipients + All Partners
                            if (recipientValues === 'all') {
                                topic = PartnerMatrixConfig.topic.RECIPIENT_COUNTRY_SELECTED;
                            }
                            // FROM PAYLOAD: 1 recipients selected
                            // --> 1 Recipient + All Partners
                            else {
                                topic = PartnerMatrixConfig.topic.RECIPIENT_COUNTRY_SELECTED;
                            }
                        }
                        //FROM FILTER: 1 Resource Partners selected
                        else {
                            // FROM PAYLOAD: All recipients are selected
                            // --> All Recipients + 1 Partner
                            if (recipientValues === 'all') {
                                topic = PartnerMatrixConfig.topic.RESOURCE_PARTNER_SELECTED;
                            }
                            // FROM PAYLOAD: 1 recipients selected
                            // --> 1 Recipients + 1 Partner
                            else {
                                topic = PartnerMatrixConfig.topic.RECIPIENT_AND_PARTNER_SELECTED;
                            }
                        }

                        var additionalProperties = self.filterUtils.getPropertiesObject(PartnerMatrixConfig.topic.SELECTED_TOPIC, topic);


                        amplify.publish(BaseEvents.FILTER_ON_READY, $.extend(self._getFilterValues(), {"props": additionalProperties}));

                    }

                    // For ODA set its value to the props object
                    else if (self._getFilterValues().values[BaseConfig.SELECTORS.ODA]) {
                        var additionalProperties = self.filterUtils.getPropertiesObject(BaseConfig.SELECTORS.ODA, self._getFilterValues().values[BaseConfig.SELECTORS.ODA].enumeration[0]);

                        amplify.publish(BaseEvents.FILTER_ON_READY, $.extend(self._getFilterValues(), {"props": additionalProperties}));
                    }
                    else {
                       amplify.publish(BaseEvents.FILTER_ON_READY, self._getFilterValues());
                    }

                });


                this.filter.on('click', function (payload) {

                   // self.filterUtils.clearSelectize(self.$el, payload.id);

                });


                // Filter on Change: Set some base properties for Recipient and the ODA, then publish Filter On Change Event
                this.filter.on('change', function (payload) {

                   // console.log("FILTER ALL ==========");
                  //  console.log(payload.values.values);

                    // validate filter
                    var valid = self.filterValidator.validateValues(self._getSelectedValues());

                    if (valid === true) {
                        self.filterValidator.hideErrorSection();

                        var fc = self.filterUtils.getFilterConfigById(self.config, payload.id);

                        var dependencies = [];
                        if (fc && fc.dependencies) {
                            for (var id in fc.dependencies) {
                                dependencies.push(id);
                            }

                            payload["dependencies"] = dependencies;
                        }

                        if (payload.id === BaseConfig.SELECTORS.YEAR_TO || payload.id === BaseConfig.SELECTORS.YEAR_FROM) {

                            // Check only for the To payload.
                            //--------------------------------
                            // When From is selected, the To is automatically re-populated and this in turn triggers its own 'on Change'.
                            // The result is that the 'BaseEvents.FILTER_ON_CHANGE' is published twice (1 for the From and then automatically again for the To).
                            // To avoid the double publish, only the last 'on Change' trigger is evaluated i.e. when payload = 'To'

                            if ( payload.id === BaseConfig.SELECTORS.YEAR_TO) {

                                var newRange = self.filterUtils.getObject(BaseConfig.SELECTORS.YEAR, self._getSelectedLabels());

                                if (newRange) {
                                    payload.id = BaseConfig.SELECTORS.YEAR;
                                    payload.values.labels = self.filterUtils.getObject(BaseConfig.SELECTORS.YEAR, self._getSelectedLabels());
                                    payload.values.values = self.filterUtils.getObject(BaseConfig.SELECTORS.YEAR, self._getSelectedValues());
                                }

                                amplify.publish(BaseEvents.FILTER_ON_CHANGE, payload);
                            }

                        }
                        else if (payload.id === BaseConfig.SELECTORS.ODA) {
                            var additionalProperties = self.filterUtils.getPropertiesObject(BaseConfig.SELECTORS.ODA, payload.values.values[0]);

                            amplify.publish(BaseEvents.FILTER_ON_CHANGE, $.extend(payload, {"props": additionalProperties}));
                        }
                        else if (payload.id === BaseConfig.SELECTORS.RECIPIENT_COUNTRY) {

                            if(payload.values.values.length > 0) {

                                var recipientPayloadValue = payload.values.values[0];
                                var partnerValues = self._getFilterValues().values[BaseConfig.SELECTORS.RESOURCE_PARTNER][0];
                                var topic;
                                //FROM FILTER: All Resource Partners selected
                                if (partnerValues === 'all') {
                                    // FROM PAYLOAD: All recipients are selected
                                    // --> All Recipients + All Partners
                                    if (recipientPayloadValue === 'all') {
                                        topic = PartnerMatrixConfig.topic.RECIPIENT_COUNTRY_SELECTED;
                                    }
                                    // FROM PAYLOAD: 1 recipients selected
                                    // --> 1 Recipient + All Partners
                                    else {
                                        topic = PartnerMatrixConfig.topic.RECIPIENT_COUNTRY_SELECTED;
                                    }
                                }
                                //FROM FILTER: 1 Resource Partners selected
                                else {
                                    // FROM PAYLOAD: All recipients are selected
                                    // --> All Recipients + 1 Partner
                                    if (recipientPayloadValue === 'all') {
                                        topic = PartnerMatrixConfig.topic.RESOURCE_PARTNER_SELECTED;
                                    }
                                    // FROM PAYLOAD: 1 recipients selected
                                    // --> 1 Recipients + 1 Partner
                                    else {
                                        topic = PartnerMatrixConfig.topic.RECIPIENT_AND_PARTNER_SELECTED;
                                    }
                                }

                                var additionalProperties = self.filterUtils.getPropertiesObject(PartnerMatrixConfig.topic.SELECTED_TOPIC, topic);

                                //console.log("========================= FilterView: ON CHANGE COUNTRY ============== " + topic);
                                amplify.publish(BaseEvents.FILTER_ON_CHANGE, $.extend(payload, {"props": additionalProperties}));
                            }

                        }
                        else if (payload.id === BaseConfig.SELECTORS.RESOURCE_PARTNER) {

                            if(payload.values.values.length > 0) {

                                var partnerPayloadValue = payload.values.values[0];
                                var recipientValues = self._getFilterValues().values[BaseConfig.SELECTORS.RECIPIENT_COUNTRY][0];
                                var selectedTopic;

                                //FROM FILTER: All Recipients selected
                                if (recipientValues === 'all') {
                                    // FROM PAYLOAD: All partners are selected
                                    // --> All Partners + All Recipients
                                    if (partnerPayloadValue === 'all') {
                                        selectedTopic = PartnerMatrixConfig.topic.RECIPIENT_COUNTRY_SELECTED;
                                    }
                                    // FROM PAYLOAD: 1 partner selected
                                    // --> 1 Partner + All Recipients
                                    else {
                                        selectedTopic = PartnerMatrixConfig.topic.RESOURCE_PARTNER_SELECTED;
                                    }
                                }
                                //FROM FILTER: 1 Recipient selected
                                else {
                                    // FROM PAYLOAD: All partners are selected
                                    // --> All Partners + 1 Recipient
                                    if (partnerPayloadValue === 'all') {
                                        selectedTopic = PartnerMatrixConfig.topic.RECIPIENT_COUNTRY_SELECTED;
                                    }
                                    // FROM PAYLOAD: 1 partner selected
                                    // --> 1 Partner + 1 Recipient
                                    else {
                                        selectedTopic = PartnerMatrixConfig.topic.RECIPIENT_AND_PARTNER_SELECTED;
                                    }
                                }

                                var additionalProperties = self.filterUtils.getPropertiesObject(PartnerMatrixConfig.topic.SELECTED_TOPIC, selectedTopic);

                                amplify.publish(BaseEvents.FILTER_ON_CHANGE, $.extend(payload, {"props": additionalProperties}));

                            }

                        }
                        else {
                            amplify.publish(BaseEvents.FILTER_ON_CHANGE, payload);
                        }
                    } else {
                        self.filterValidator.displayErrorSection(valid);
                    }
                });


            },

            /!**
             * Format the time range and ODA values
             * @returns {Object}
             * @private
             *!/


            _getFilterValues: function () {

                var timerange = {
                    values: {year: [{value: '', parent: s.range.FROM}, {value: '', parent: s.range.TO}]},
                    labels: {year: {range: ''}}
                };

                var updatedValuesWithYear = {}, updatedValuesWithODA = {}, extendedValues = $.extend(true, {}, this.filter.getValues(), timerange);

                updatedValuesWithYear = this.filterUtils.processTimeRange(extendedValues);

                updatedValuesWithODA = this.filterUtils.removeODAPrefix(updatedValuesWithYear);

                return updatedValuesWithODA;

            },


            /!**
             *  Get the full filter values object (consists of labels and values)
             * @returns {Object} filterValues
             *!/
            getFilterValues: function () {

                var values = this._getFilterValues();


                //clear uid values
                values.values["uid"] = [];

                values.values[BaseConfig.SELECTORS.YEAR_FROM] = [];
                values.values[BaseConfig.SELECTORS.YEAR_TO] = [];


                // if all values selected clear
                if(values.values[BaseConfig.SELECTORS.RECIPIENT_COUNTRY][0] === s.exclusions.ALL) {
                    values.values[BaseConfig.SELECTORS.RECIPIENT_COUNTRY] = [];
                }

                // if all values selected clear
                if(values.values[BaseConfig.SELECTORS.RESOURCE_PARTNER][0] === s.exclusions.ALL) {
                    values.values[BaseConfig.SELECTORS.RESOURCE_PARTNER] = [];
                }

                //console.log("FINAL getFilterValues ============ END");
                //console.log(values);
                return values;
            },


            /!**
             * Get the selected filter values
             * @returns {Object} values
             * @private
             *!/

            _getSelectedValues: function () {
                return this._getFilterValues().values;
            },

            /!**
             *  Get the selected filter labels
             * @returns {Object} labels
             * @private
             *!/
            _getSelectedLabels: function () {
                return this._getFilterValues().labels;
            },


            _unbindEventListeners: function () {
            },

            dispose: function () {
                this._unbindEventListeners();
                View.prototype.dispose.call(this, arguments);
            }

        });*/

        return PartnerMatrixFilterView;
    });
