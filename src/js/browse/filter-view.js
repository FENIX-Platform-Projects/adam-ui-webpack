define(
    [
        'loglevel',
        'jquery',
        'underscore',
        'html/browse/filters.hbs',
        'nls/filter',
        'fenix-ui-filter',
        'common/filter-validator',
        'utils/filter-utils',
        'config/config-base',
        'config/errors',
        'config/browse/config-browse',
        'config/browse/events',
        'q',
        'amplify-pubsub'
    ], function (log, $, _, template, i18nLabels, Filter, FilterValidator, FilterUtils, BaseConfig, Errors, BrowseConfig, BaseEvents, Q, amplify) {

        'use strict';

        var s = {
            css_classes: {
                FILTER_BROWSE: "#filter-browse",
                FILTER_ERRORS_HOLDER: "#filter-browse-errors-holder"
            },
            datasets: {
                USD_COMMITMENT: 'adam_usd_commitment'
            },
            codeLists: {
                SUB_SECTORS: {uid: 'crs_purposes', version: '2016'},
                RECIPIENT_DONORS: {uid: 'crs_recipientdonors', version: '2016'},
                REGIONS: {uid: 'crs_un_regions_recipients', version: '2016', level: "2", direction: "up"},
                FAO_REGIONS: {uid: 'crs_fao_regions', version: '2016', level: "3", direction: "up"},
                RECIPIENTS: {uid: 'crs_recipients', version: '2016'}
            },
            range: {
                FROM: 'from',
                TO: 'to'
            },
            values: {
                FAO_SECTORS: '9999'
            },
            exclusions: {
                ALL: 'all'
            }
        };


        /**
         * Creates a new Filter View.
         * Instantiates the FENIX filter submodule and responsible for all filter related functionality.
         * @class FilterView
         * @extends View
         */


        function FilterView(o) {
            log.info("FilterView");
            log.info(o);

            $.extend(true, this, o);


            this._parseInput(o);

            var valid = this._validateInput();

            if (valid === true) {

                this._attach();

                this._unbindEventListeners();

                this._init();

                this._buildFilters();

                return this;

            } else {
                log.error("Impossible to create Filter View");
                log.error(valid)
            }
        }

        FilterView.prototype._parseInput = function (params) {
            this.$el = $(this.el);
            this.lang = params.lang || BaseConfig.LANG.toLowerCase();
            this.environment = params.environment  || BaseConfig.ENVIRONMENT
            this.config = params.config;

        };

        FilterView.prototype._validateInput = function () {

            var valid = true,
                errors = [];

            //Check if $el exist
            if (this.$el.length === 0) {
                errors.push({code: Errors.MISSING_CONTAINER});
                log.warn("Impossible to find filter container");
            }

            return errors.length > 0 ? errors : valid;
        };

        FilterView.prototype._attach = function () {
            this.$el.append(template);
        };

        FilterView.prototype._init = function () {
            this._bindEventListeners();
            this.filterUtils = new FilterUtils();

            this.$titleItemsList = this.$el.find(s.css_classes.TITLE_ITEMS_LIST);
        };

        FilterView.prototype._bindEventListeners = function () {
            //  amplify.subscribe(Events.TITLE_ADD_ITEM, this, this._onAdd);
            /// amplify.subscribe(Events.TITLE_REMOVE_ITEM, this, this._onRemove);
        };

        FilterView.prototype._unbindEventListeners = function () {
            // Remove listeners
            // amplify.unsubscribe(Events.TITLE_REMOVE_ITEM, this._onAdd);
            //amplify.unsubscribe(Events.TITLE_ADD_ITEM, this._onRemove);
        };

        /**
         * Updates filter configuration and renders the filter.
         * @private
         */
        FilterView.prototype._buildFilters = function () {
            var self = this;

            var filterConfig = this.filterUtils.getUpdatedFilterConfig(this.config, this.lang);

            if (!_.isEmpty(filterConfig)) {
                this.$el.find(s.css_classes.FILTER_BROWSE).show();
                this._renderFilter(filterConfig);
            } else {
                this.$el.find(s.css_classes.FILTER_BROWSE).hide();
            }
        };




        /*
         * Instantiates the FENIX Filter Sub Module with the configuration and sets the Filter Event Handlers
         * @param config
         * @private
         */
        FilterView.prototype._renderFilter = function (config) {
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
                el: this.$el.find(s.css_classes.FILTER_BROWSE),
                environment:  this.environment,
                // selectors: config,
                items: config,
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

                // console.log("================== FILTERS READY =========== ");
                // console.log(this._getFilterValues());

                // For the Recipient Country, get and set the GAUL Code and Region Code as attributes to the props object
                if (this._getFilterValues().values[BaseConfig.SELECTORS.RECIPIENT_COUNTRY]) {

                    // Hide all Item
                  //  this.filterUtils.removeAllOption(this.$el, BaseConfig.SELECTORS.RECIPIENT_COUNTRY);

                    var additionalProperties = this.filterUtils.getPropertiesObject(BaseConfig.SELECTORS.RECIPIENT_COUNTRY, this._getFilterValues().values[BaseConfig.SELECTORS.RECIPIENT_COUNTRY]);


                    Q.all([
                        self._onRecipientChangeGetRegionCode(this._getFilterValues().values[BaseConfig.SELECTORS.RECIPIENT_COUNTRY]),
                        self._onRecipientChangeGetGaulCode(this._getFilterValues().values[BaseConfig.SELECTORS.RECIPIENT_COUNTRY])
                    ]).then(function (result) {
                        if (result) {
                            var region = result[0], gaul = result[1];
                            self._setRecipientProperties(region, gaul, additionalProperties);
                        }
                    }).catch(function (error) {
                        self._processRegionCodeError(error, additionalProperties)
                    }).done(function () {
                        amplify.publish(BaseEvents.FILTER_ON_READY, $.extend(self._getFilterValues(), {"props": additionalProperties}));
                    });

                }
                // For ODA set its value to the props object
                else if (this._getFilterValues().values[BaseConfig.SELECTORS.ODA]) {
                    var additionalProperties = this.filterUtils.getPropertiesObject(BaseConfig.SELECTORS.ODA, this._getFilterValues().values[BaseConfig.SELECTORS.ODA].enumeration[0]);

                    amplify.publish(BaseEvents.FILTER_ON_READY, $.extend(this._getFilterValues(), {"props": additionalProperties}));
                }
                else {

                    amplify.publish(BaseEvents.FILTER_ON_READY, this._getFilterValues());
                }

            }, this);


            /* this.filter.on('click', function (payload) {
             self.filterUtils.clearSelectize(self.$el, payload.id);
             });*/

            // Filter on Change: Set some base properties for Recipient and the ODA, then publish Filter On Change Event
            this.filter.on('change', function (payload) {

                // validate filter
                var valid = this.filterValidator.validateValues(this._getSelectedValues(), this.lang);


                if (valid === true && payload.values.values[0]) {

                    // set primary Payload
                    var payloads = [];
                    payload.primary = true;

                    this.filterValidator.hideErrorSection();

                    var fc = this.filterUtils.getFilterConfigById(this.config, payload.id);
                    var dependencies = [];
                    if (fc && fc.dependencies) {
                        for (var id in fc.dependencies) {
                            dependencies.push(id);
                        }

                        payload["dependencies"] = dependencies;
                    }

                    if (payload.id === BaseConfig.SELECTORS.REGION || payload.id === BaseConfig.SELECTORS.RECIPIENT_COUNTRY) {

                        console.log("============= 1 ");

                        if ( payload.id === BaseConfig.SELECTORS.RECIPIENT_COUNTRY) {

                            var additionalProperties = this.filterUtils.getPropertiesObject(BaseConfig.SELECTORS.RECIPIENT_COUNTRY, payload.values.values);
                            var payloadRecipientValue = payload.values.values[0];

                            var regionValue = this._getSelectedValues()[BaseConfig.SELECTORS.REGION][0];

                            // All regions selected
                            if (regionValue === s.exclusions.ALL) {
                                if (payloadRecipientValue === s.exclusions.ALL) {

                                    // Hide all Item
                                    this.filterUtils.removeAllOption(this.$el, payload.id);

                                    // Set the Default Value, will activate onchange and will go in the else
                                    if (this.filter.items[payload.id].selector.default[0])
                                        this.filterUtils.setDefaultValue(this.$el, payload.id, this.filter.items[payload.id].selector.default[0]);

                                } else {

                                    Q.all([
                                        self._onRecipientChangeGetRegionCode(payload.values.values),
                                        self._onRecipientChangeGetGaulCode(payload.values.values)
                                    ]).then(function (result) {
                                        if (result) {
                                            var region = result[0], gaul = result[1];
                                            self._setRecipientProperties(region, gaul, additionalProperties);
                                        }
                                    }).catch(function (error) {
                                        //console.log("==================== ELSE: payloadRecipientValue OTHER: ERROR ======== ", additionalProperties);
                                        self._processRegionCodeError(error, additionalProperties)
                                    }).done(function () {
                                        $.extend(payload, {"props": additionalProperties});
                                        var payloadsUpdated = self._processRegionRecipientPayload(payloads, payload);

                                        amplify.publish(BaseEvents.FILTER_ON_CHANGE, payloadsUpdated);
                                    });

                                }

                                /*  console.log("==================== IF: 2i RECIPIENT COUNTRY POST ============== "+ payload.id + " - " +payload.values[0]);

                                 $("[data-selector='recipientcode']").addClass("all-item-hidden");
                                 var filterItem = this.$el.find("[data-selector='"+payload.id+"']")[0];
                                 var selectize = $(filterItem).find("[data-role=dropdown]")[0].selectize;
                                 selectize.removeOption("all");
                                 selectize.setValue('625'); // activate onchange and will go in the else

                                 console.log("==================== IF: 2ii RECIPIENT COUNTRY POST ============== "+ payload.id + " - " +payload.values[0]);
                                 */

                            } else {
                             //         console.log("==================== ELSE REGION OTHER  ============== " + payload.id + " - " + additionalProperties);

                                // Add all Item
                                this.filterUtils.addAllOption(this.$el, payload.id);

                                if (payloadRecipientValue === s.exclusions.ALL) {
                                    $.extend(payload, {"props": additionalProperties});
                                    var payloadsUpdated = this._processRegionRecipientPayload(payloads, payload);

                                    amplify.publish(BaseEvents.FILTER_ON_CHANGE, payloadsUpdated);
                                } else {
                                    Q.all([
                                        self._onRecipientChangeGetRegionCode(payload.values.values),
                                        self._onRecipientChangeGetGaulCode(payload.values.values)
                                    ]).then(function (result) {
                                        if (result) {
                                            var region = result[0], gaul = result[1];
                                            self._setRecipientProperties(region, gaul, additionalProperties);
                                        }
                                    }).catch(function (error) {
                                        // console.log("====================  ELSE REGION OTHER: ERROR ======== ", additionalProperties);
                                        self._processRegionCodeError(error, additionalProperties)
                                    }).done(function () {
                                        $.extend(payload, {"props": additionalProperties});
                                        var payloadsUpdated = self._processRegionRecipientPayload(payloads, payload);
                                        amplify.publish(BaseEvents.FILTER_ON_CHANGE, payloadsUpdated);
                                    });

                                }

                            }
                        }

                    }
                    else if (payload.id === BaseConfig.SELECTORS.SECTOR || payload.id === BaseConfig.SELECTORS.SUB_SECTOR) {

                        // Check only for the Sub Sector payload but add the sector details to the payload.
                        //-------------------------------------------------------------------------------
                        // When Sector is selected, the Sub Sector is automatically re-populated and this in turn triggers its own 'on Change'.
                        // The result is that the 'BaseEvents.FILTER_ON_CHANGE' is published twice (1 for the sector and then automatically again for the Sub Sector).
                        // To avoid the double publish, only the last 'on Change' trigger is evaluated i.e. when payload = 'Sub Sector'

                        //  console.log("FILTER VIEW: ON CHANGE id: ", payload.id, " value: ", payload.values[0]);

                        if ( payload.id === BaseConfig.SELECTORS.SUB_SECTOR) {
                            // Payload contains subsector and sector information
                            var payloadsUpdated = this._processSectorSubSectorPayload(payloads, payload);
                            amplify.publish(BaseEvents.FILTER_ON_CHANGE, payloadsUpdated);
                        }

                    }
                    else if (payload.id === BaseConfig.SELECTORS.YEAR_TO || payload.id === BaseConfig.SELECTORS.YEAR_FROM) {


                        var values = this._getSelectedValues();
                        // var yearTo = values[BaseConfig.SELECTORS.YEAR_TO][0];
                        // var yearFrom = values[BaseConfig.SELECTORS.YEAR_FROM][0];


                        // Check only for the To payload.
                        //--------------------------------
                        // When From is selected, the To is automatically re-populated and this in turn triggers its own 'on Change'.
                        // The result is that the 'BaseEvents.FILTER_ON_CHANGE' is published twice (1 for the From and then automatically again for the To).
                        // To avoid the double publish, only the last 'on Change' trigger is evaluated i.e. when payload = 'To'

                        if ( payload.id === BaseConfig.SELECTORS.YEAR_TO) {

                            var newRange = this.filterUtils.getObject(BaseConfig.SELECTORS.YEAR, this._getSelectedLabels());

                            if (newRange) {
                                payload.id = BaseConfig.SELECTORS.YEAR;
                                payload.values.labels = this.filterUtils.getObject(BaseConfig.SELECTORS.YEAR, this._getSelectedLabels());
                                payload.values.values = this.filterUtils.getObject(BaseConfig.SELECTORS.YEAR, this._getSelectedValues());
                            }

                            payloads.push(payload);

                            amplify.publish(BaseEvents.FILTER_ON_CHANGE, payloads);
                        }

                        //amplify.publish(BaseEvents.FILTER_ON_CHANGE, payload);
                    }
                    else if (payload.id === BaseConfig.SELECTORS.ODA) {
                        var additionalProperties = this.filterUtils.getPropertiesObject(BaseConfig.SELECTORS.ODA, payload.values.values[0]);
                        $.extend(payload, {"props": additionalProperties});
                        payloads.push(payload);

                        amplify.publish(BaseEvents.FILTER_ON_CHANGE, payloads);
                    }
                    else {
                        payloads.push(payload);
                        amplify.publish(BaseEvents.FILTER_ON_CHANGE, payloads);
                    }
                } else {
                    this.filterValidator.displayErrorSection(valid);
                }
            }, this);

            /**
             * Format the time range and ODA values
             * @returns {Object}
             * @private
             */


            FilterView.prototype._getFilterValues = function () {

                var timerange = {
                    values: {year: [{value: '', parent: s.range.FROM}, {value: '', parent: s.range.TO}]},
                    labels: {year: {range: ''}}
                };

                var updatedValuesWithYear = {}, updatedValuesWithODA = {}, extendedValues = $.extend(true, {}, this.filter.getValues(), timerange);

                updatedValuesWithYear = this.filterUtils.processTimeRange(extendedValues);

                updatedValuesWithODA = this.filterUtils.removeODAPrefix(updatedValuesWithYear);

                return updatedValuesWithODA;

            };
        };


        /**
         * Get the Region Code associated with the Recipient code
         * @param recipientCodes
         * @private
         */
        FilterView.prototype._onRecipientChangeGetRegionCode = function (recipientCodes) {
            var self = this;

            if (recipientCodes.length > 0) {
               // console.log("IS RECIPIENT value")
                return Q.all([
                    self._createRegionPromiseData(s.codeLists.FAO_REGIONS.uid, s.codeLists.FAO_REGIONS.version, s.codeLists.FAO_REGIONS.level, s.codeLists.FAO_REGIONS.direction, recipientCodes[0])
                ]).then(function (c) {
                    return c;
                }, function (r) {
                    console.error(r);
                });
            }

        };


        /**
         * Get the Gaul Code associated with the Recipient code
         * @param recipientCodes
         * @private
         */
        FilterView.prototype._onRecipientChangeGetGaulCode = function (recipientCodes) {
            var self = this;
            var odaProps = this.filterUtils.getPropertiesObject(BaseConfig.SELECTORS.ODA, self._getFilterValues().values[BaseConfig.SELECTORS.ODA]);
            //var filterConfig = this.filterUtils.getFilterConfigById(BaseConfig.SELECTORS.RECIPIENT_COUNTRY);

            if (recipientCodes.length > 0) {
                return Q.all([
                    self._createGaulPromiseData(s.datasets.USD_COMMITMENT, this.lang.toUpperCase(), s.codeLists.RECIPIENTS.uid, s.codeLists.RECIPIENTS.version, recipientCodes)
                ]).then(function (c) {
                    console.log(c)
                    return c;
                }, function (r) {
                    console.error(r);
                });
            }

        };


        /**
         * Set Recipient properties
         * @param item
         * @param result
         * @private
         */
        FilterView.prototype._setRecipientProperties = function (region, gaul, props) {
            var self = this;

            if(region && gaul) {
                var gaulCodeResult = gaul[0];
                var regionCodeResult = region[0];

                self._setRegionCode(props, regionCodeResult.parents[0].parents[0].code);
                self._setGaulCode(props, gaulCodeResult.data[0][0]);
            }
        };

        /**
         * Set Recipient properties
         * @param item
         * @param result
         * @private
         */
        FilterView.prototype._setRecipientPropertiesOrig = function (result, props, region) {
            var self = this;

            var region = result[0], gaul = result[1];

            if(result[0]) {
                if(region){
                    var gaulCodeResult = result[0][0];
                    self._setRegionCode(props, region);
                    self._setGaulCode(props, gaulCodeResult.data[0][0]);
                }
                else{
                    var regionCodeResult = result[0][0];
                    var gaulCodeResult = result[1][0];
                    self._setRegionCode(props, regionCodeResult.parents[0].parents[0].code);
                    self._setGaulCode(props, gaulCodeResult.data[0][0]);

                }
            }
        };

        /**
         * Set Recipient Region Code
         * @param item
         * @param result
         * @private
         */
        FilterView.prototype._setRegionCode = function (item, result) {
            item.regioncode = result;
        };

        /**
         * Set Recipient Gaul Code
         * @param item
         * @param result
         * @private
         */

        FilterView.prototype._setGaulCode = function (item, result) {
            item.gaulcode = parseInt(result);
        };


        /**
         * Region Code Error Handler
         * @param error
         * @param item
         * @private
         */
        FilterView.prototype._processRegionCodeError = function (error, item) {
            if (item.regioncode) {
                delete item['regioncode']
            }
        };


        /**
         * Get the selected filter values
         * @returns {Object} values
         * @private
         */

        FilterView.prototype._getSelectedValues = function () {
            return this._getFilterValues().values;
        };


        /**
         *  Get the selected filter labels
         * @returns {Object} labels
         * @private
         */
        FilterView.prototype._getSelectedLabels = function () {
            return this._getFilterValues().labels;
        };


        /**
         * Add the region to payloads array and set primary payload
         * @param payloads array
         * @returns Array filters
         */
        FilterView.prototype._processRegionRecipientPayload = function (payloads, recipientpayload) {
            var values = this._getSelectedValues();
            var labels = this._getSelectedLabels();

            var region = {};
            region.id = BaseConfig.SELECTORS.REGION;
            region.values = {};
            region.values.labels =  labels[BaseConfig.SELECTORS.REGION];
            region.values.values =  values[BaseConfig.SELECTORS.REGION];


            // primary indicates the selection type which takes precedence
            if(recipientpayload.values.values[0] === 'all'){
                region.primary = true;
                recipientpayload.primary = false;
            } else {
                region.primary = false;
                recipientpayload.primary = true;
            }

            payloads.push(region);
            payloads.push(recipientpayload);

            return payloads;
        };


        /**
         * Add the sector to payloads array and set primary payload
         * @param payloads array
         * @returns Array filters
         */
        FilterView.prototype._processSectorSubSectorPayload = function (payloads, subsectorpayload) {
            var values = this._getSelectedValues();
            var labels = this._getSelectedLabels();

            var sector = {};
            sector.id = BaseConfig.SELECTORS.SECTOR;
            sector.values = {};
            sector.values.labels =  labels[BaseConfig.SELECTORS.SECTOR];
            sector.values.values =  values[BaseConfig.SELECTORS.SECTOR];


            // primary indicates the selection type which takes precedence
            if(subsectorpayload.values.values[0] === 'all'){
                sector.primary = true;
                subsectorpayload.primary = false;
            } else {
                sector.primary = false;
                subsectorpayload.primary = true;
            }

            payloads.push(sector);
            payloads.push(subsectorpayload);

            return payloads;
        };


        /**
         * Create GET Promise to get Region code
         * @param codelist
         * @param version
         * @param depth
         * @param direction
         * @param findcode
         * @returns {*}
         * @private
         */
        FilterView.prototype._createRegionPromiseData = function(codelist, version, depth, direction, findcode) {

            var baseUrl = BaseConfig.SERVER + BaseConfig.CODELIST_SERVICE + BaseConfig.HIERARCHY_CODES_POSTFIX;
            baseUrl += "/" + codelist + "/" + version + "/" + findcode + "?depth=" + depth + "&direction=" + direction;


            return Q($.ajax({
                url: baseUrl,
                type: "GET",
                dataType: 'json'
            })).then(function (c) {

                return c;
            }, function (r) {
                console.error(r);
            });
        };

        /**
         * Create POST Promise to get Gaul code
         * @param dataset
         * @param lang
         * @param codelist
         * @param version
         * @param codes
         * @returns {*}
         * @private
         */

        FilterView.prototype._createGaulPromiseData = function (dataset, lang, codelist, version, codes) {

            var baseUrl = BaseConfig.SERVER + BaseConfig.D3P_POSTFIX + dataset + "?dsd=true&full=true&language=" + lang;
            var data = [{
                "name": "filter",
                "parameters": {
                    "rows": {
                        "recipientcode": {
                            "codes": [{
                                "uid": codelist,
                                "version": version,
                                "codes": codes
                            }]
                        }
                    },
                    "columns": ["gaul0"]

                }
            }, {//{"name": "filter", "parameters": {"columns": ["gaul0"]}}, {
                "name": "page",
                "parameters": {"perPage": 1, "page": 1}
            }];


            return Q($.ajax({
                url: baseUrl,
                type: "POST",
                data: JSON.stringify(data),
                contentType: "application/json",
                dataType: 'json'
            })).then(function (c) {
                if(c)
                    return c;
            }, function (r) {
                console.error(r);
            });
        };

        /**
         *  Get the full filter values object (consists of labels and values)
         * @returns {Object} filterValues
         */
        FilterView.prototype.getFilterValues = function () {

            // console.log("FINAL getFilterValues ============ 1");
            var values = this._getFilterValues();

            //clear uid values
            values.values["uid"] = [];

            values.values[BaseConfig.SELECTORS.YEAR_FROM] = [];
            values.values[BaseConfig.SELECTORS.YEAR_TO] = [];


            // if all values selected clear
            if(values.values[BaseConfig.SELECTORS.RECIPIENT_COUNTRY] && values.values[BaseConfig.SELECTORS.RECIPIENT_COUNTRY][0] === s.exclusions.ALL) {
                values.values[BaseConfig.SELECTORS.RECIPIENT_COUNTRY] = [];
            }

            // if all values selected clear
            if(values.values[BaseConfig.SELECTORS.RESOURCE_PARTNER] && values.values[BaseConfig.SELECTORS.RESOURCE_PARTNER][0] === s.exclusions.ALL) {
                values.values[BaseConfig.SELECTORS.RESOURCE_PARTNER] = [];
            }

            // if all values selected clear
            if(values.values[BaseConfig.SELECTORS.SECTOR] && values.values[BaseConfig.SELECTORS.SECTOR][0] === s.exclusions.ALL) {
                values.values[BaseConfig.SELECTORS.SECTOR] = [];
            }

            // if all values selected clear
            if(values.values[BaseConfig.SELECTORS.SUB_SECTOR] && values.values[BaseConfig.SELECTORS.SUB_SECTOR][0] === s.exclusions.ALL) {
                values.values[BaseConfig.SELECTORS.SUB_SECTOR] = [];
            }

            // console.log(values);
            return values;
        };


        /**
         * Check if 'FAO Related Sectors' has been selected
         * @returns {*|boolean}
         */
        FilterView.prototype.isFAOSectorsSelected = function () {
            var values = this.getSelectedValues(BaseConfig.SELECTORS.SECTOR);

            //console.log(values);
            for (var i = 0; i < values.length; i++) {
                if (values[i] === s.values.FAO_SECTORS) {
                    return true;
                }
            }

            return false;
        };

        /**
         *  Get the values for the filter id
         * @returns {Object} values
         */
        FilterView.prototype.getSelectedValues = function (filterId) {
            var values = this._getSelectedValues();

            var selectedValues = {};
            var itemSelected = this._hasSelections(filterId, values);

            if (itemSelected) {
                selectedValues = values[filterId];
                //var filterObj = this._getObject(filterId, values);
                //selectedValues = this._getSelected(filterObj);
            }

            return selectedValues;
        };

        /**
         * Check if filter id has selections
         * @param id
         * @param data
         * @returns {boolean}
         * @private
         */
        FilterView.prototype._hasSelections = function (id, data) {
            //console.log(id);
            if (_.has(data, id)) {
                if (data[id].length > 0) {
                    // if (_.has(data[id], 'codes')) {
                    return true;
                }
            }
        };

        /**
         *  Clear Values for the filter id
         * @param filterid
         * @param values
         * @returns {Object} values
         */

        FilterView.prototype.clearFilterValue = function (filterid, values) {

            if (values.values[filterid]) {
                values.values[filterid] = [];
            }

            return values;
        };


        /**
         *  Process and get the filter values relevant to the Indicators Dashboard
         * @returns {Object} values
         */

        FilterView.prototype.getIndicatorsValues = function () {

            var filterValues = this._getFilterValues();
            var values = filterValues.values;
            var labels = filterValues.labels;

            var cloneObj, cloneLabelObj;

            // console.log("============================= VALUES =================== ");
            // console.log(values);

            var donorSelected = this._hasSelections(BaseConfig.SELECTORS.RESOURCE_PARTNER, values);
            var recipientSelected = this._hasSelections(BaseConfig.SELECTORS.RECIPIENT_COUNTRY, values);


            if (donorSelected) {
                cloneObj = this.filterUtils.getObject(BaseConfig.SELECTORS.RESOURCE_PARTNER, values);
                cloneLabelObj = this.filterUtils.getObject(BaseConfig.SELECTORS.RESOURCE_PARTNER, labels);
            }
            if (recipientSelected) {
                cloneObj = this.filterUtils.getObject(BaseConfig.SELECTORS.RECIPIENT_COUNTRY, values);
                cloneLabelObj = this.filterUtils.getObject(BaseConfig.SELECTORS.RECIPIENT_COUNTRY, labels);
            }


            if (cloneObj) {
                //======= UPDATE VALUES CONFIG
                values[BaseConfig.SELECTORS.COUNTRY] = cloneObj;
                labels[BaseConfig.SELECTORS.COUNTRY] = cloneLabelObj;

                //======= Set everything in the values to be removed except the country
                for (var filter in values) {
                    if (filter !== BaseConfig.SELECTORS.COUNTRY) {
                        values[filter] = [];
                        labels[filter] = {};
                    }
                }
            } else {
                // reset all filter values to empty
                for (var filter in values) {
                    values[filter] = [];
                    labels[filter] = {};
                }

            }

            return filterValues;
        };

        /*   var FilterView = View.extend({
         /!**  @lends FilterView *!/

         // Automatically render after initialize
         autoRender: true,

         className: 'filter-browse',

         // Save the template string in a prototype property.
         // This is overwritten with the compiled template function.
         // In the end you might want to used precompiled templates.
         template: template,


         initialize: function (params) {
         this.config = params.config;


         View.prototype.initialize.call(this, arguments);
         },


         attach: function () {

         View.prototype.attach.call(this, arguments);

         this.$el = $(this.el);

         this._buildFilters();
         },


         /!**
         * Updates filter configuration and renders the filter.
         * @private
         *!/
         _buildFilters: function () {
         var self = this;

         var filterConfig = this._getUpdatedFilterConfig();

         if (!_.isEmpty(filterConfig)) {
         this.$el.find(s.css_classes.FILTER_BROWSE).show();
         this._renderFilter(filterConfig);
         } else {
         this.$el.find(s.css_classes.FILTER_BROWSE).hide();
         }
         },

         /!**
         *
         * Instantiates the FENIX Filter Sub Module with the configuration and sets the Filter Event Handlers
         * @param config
         * @private
         *!/
         _renderFilter: function (config) {
         var self = this;

         // dispose of filter
         if (this.filter && $.isFunction(this.filter.dispose)) {
         this.filter.dispose();
         }

         // instantiate new filter validator
         this.filterValidator = new FilterValidator({
         el: this.$el.find(s.css_classes.FILTER_ERRORS_HOLDER)
         });

         // instantiate new filter
         this.filter = new Filter({
         el: this.$el.find(s.css_classes.FILTER_BROWSE),
         environment: BaseConfig.ENVIRONMENT,
         items: config,
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

         // For the Recipient Country, get and set the GAUL Code and Region Code as attributes to the props object
         if (self._getFilterValues().values[BaseConfig.SELECTORS.RECIPIENT_COUNTRY]) {

         var filterItem = self.$el.find("[data-selector='" + BaseConfig.SELECTORS.RECIPIENT_COUNTRY + "']")[0];
         var selectize = $(filterItem).find("[data-role=dropdown]")[0].selectize;

         // Hide the 'all' item
         $("[data-selector='" + BaseConfig.SELECTORS.RECIPIENT_COUNTRY + "']").addClass("all-item-hidden");

         // Delete 'all' option
         selectize.removeOption(s.exclusions.ALL);

         var additionalProperties = self._getPropertiesObject(BaseConfig.SELECTORS.RECIPIENT_COUNTRY, self._getFilterValues().values[BaseConfig.SELECTORS.RECIPIENT_COUNTRY]);

         Q.all([
         self._onRecipientChangeGetRegionCode(self._getFilterValues().values[BaseConfig.SELECTORS.RECIPIENT_COUNTRY]),
         self._onRecipientChangeGetGaulCode(self._getFilterValues().values[BaseConfig.SELECTORS.RECIPIENT_COUNTRY])
         ]).then(function (result) {
         if (result) {
         self._setRecipientProperties(result, additionalProperties);
         }
         }).catch(function (error) {
         self._regioncodeerror(error, additionalProperties)
         }).done(function () {
         // console.log("ONREADY: RECIPIENT PROPS UPDATE DONE ============ ", additionalProperties);

         amplify.publish(BaseEvents.FILTER_ON_READY, $.extend(self._getFilterValues(), {"props": additionalProperties}));
         });

         }
         // For ODA set its value to the props object
         else if (self._getFilterValues().values[BaseConfig.SELECTORS.ODA]) {
         var additionalProperties = self._getPropertiesObject(BaseConfig.SELECTORS.ODA, self._getFilterValues().values[BaseConfig.SELECTORS.ODA].enumeration[0]);

         amplify.publish(BaseEvents.FILTER_ON_READY, $.extend(self._getFilterValues(), {"props": additionalProperties}));
         }
         else {
         amplify.publish(BaseEvents.FILTER_ON_READY, self._getFilterValues());
         }

         });


         this.filter.on('click', function (payload) {

         var filterItem = self.$el.find("[data-selector=" + payload.id + "]")[0];
         var selectize = $(filterItem).find("[data-role=dropdown]")[0].selectize;

         // REMOVED THE CLEAR
         //selectize.$control.off('mousedown');
         //selectize.clear(true);

         });

         // Filter on Change: Set some base properties for Recipient and the ODA, then publish Filter On Change Event
         this.filter.on('change', function (payload) {

         // validate filter
         var valid = self.filterValidator.validateValues(self._getSelectedValues());


         // console.log(valid, payload, payload.id);

         if (valid === true && payload.values.values[0]) {

         // set primary Payload
         var payloads = [];
         payload.primary = true;

         self.filterValidator.hideErrorSection();

         var fc = self._getFilterConfigById(payload.id);
         var dependencies = [];
         if (fc && fc.dependencies) {
         for (var id in fc.dependencies) {
         dependencies.push(id);
         }

         payload["dependencies"] = dependencies;
         }

         if (payload.id === BaseConfig.SELECTORS.REGION || payload.id === BaseConfig.SELECTORS.RECIPIENT_COUNTRY) {

         //console.log("==================== RECIPIENT/REGION START ============== VALUES ", payload.values.values ," - "+ payload.id);

         if ( payload.id === BaseConfig.SELECTORS.RECIPIENT_COUNTRY) {
         var filterItem = self.$el.find("[data-selector='" + payload.id + "']")[0];
         var selectize = $(filterItem).find("[data-role=dropdown]")[0].selectize;

         var additionalProperties = self._getPropertiesObject(BaseConfig.SELECTORS.RECIPIENT_COUNTRY, payload.values.values);

         // console.log("==================== RECIPIENT/REGION START 2 ============== VALUES ", additionalProperties);

         var payloadRecipientValue = payload.values.values[0];
         var regionValue = self._getSelectedValues()[BaseConfig.SELECTORS.REGION][0];


         // All regions selected
         if (regionValue === s.exclusions.ALL) {
         // console.log("==================== IF REGION ALL  ============== " + payload.id + " - " + payload.values.values[0]);
         if (payloadRecipientValue === s.exclusions.ALL) {
         // console.log("==================== IF: payloadRecipientValue ALL ============== " + payload.id + " - " + payload.values.values[0]);

         // Hide the 'all' item
         $("[data-selector='" + payload.id + "']").addClass("all-item-hidden");

         // var filterItem = self.$el.find("[data-selector='" + payload.id + "']")[0];
         //var selectize = $(filterItem).find("[data-role=dropdown]")[0].selectize;

         // Delete 'all' option
         selectize.removeOption(s.exclusions.ALL);

         // Set the Default Value
         if (self.filter.items[payload.id].selector.default[0])
         selectize.setValue(self.filter.items[payload.id].selector.default[0]); // will activate onchange and will go in the else

         } else {
         // console.log("==================== ELSE: payloadRecipientValue OTHER ============== " + payload.id + " - " + payload.values.values[0]);


         Q.all([
         self._onRecipientChangeGetFAORegionCode(payload.values.values),
         self._onRecipientChangeGetGaulCode(payload.values.values)
         ]).then(function (result) {
         if (result) {
         self._setFAORecipientProperties(result, additionalProperties);
         }
         }).catch(function (error) {
         //console.log("==================== ELSE: payloadRecipientValue OTHER: ERROR ======== ", additionalProperties);
         self._regioncodeerror(error, additionalProperties)
         }).done(function () {

         $.extend(payload, {"props": additionalProperties});
         var payloadsUpdated = self._processRegionRecipientPayload(payloads, payload);

         //payloads.push(payload);

         amplify.publish(BaseEvents.FILTER_ON_CHANGE, payloadsUpdated);
         });

         }


         /!*  console.log("==================== IF: 2i RECIPIENT COUNTRY POST ============== "+ payload.id + " - " +payload.values.values[0]);

         $("[data-selector='recipientcode']").addClass("all-item-hidden");
         var filterItem = self.$el.find("[data-selector='"+payload.id+"']")[0];
         var selectize = $(filterItem).find("[data-role=dropdown]")[0].selectize;
         selectize.removeOption("all");
         selectize.setValue('625'); // activate onchange and will go in the else

         console.log("==================== IF: 2ii RECIPIENT COUNTRY POST ============== "+ payload.id + " - " +payload.values.values[0]);
         *!/

         } else {
         console.log("==================== ELSE REGION OTHER  ============== " + payload.id + " - " + additionalProperties);

         $("[data-selector='" + payload.id + "']").removeClass("all-item-hidden");

         //var filterItem = self.$el.find("[data-selector='" + payload.id + "']")[0];
         // var selectize = $(filterItem).find("[data-role=dropdown]")[0].selectize;

         // Delete 'all' option
         selectize.addOption(s.exclusions.ALL);

         if (payloadRecipientValue === s.exclusions.ALL) {
         $.extend(payload, {"props": additionalProperties});
         var payloadsUpdated = self._processRegionRecipientPayload(payloads, payload);

         amplify.publish(BaseEvents.FILTER_ON_CHANGE, payloadsUpdated);
         } else {
         Q.all([
         self._onRecipientChangeGetGaulCode(payload.values.values)
         ]).then(function (result) {
         if (result) {
         self._setFAORecipientProperties(result, additionalProperties, regionValue);
         }
         }).catch(function (error) {
         // console.log("====================  ELSE REGION OTHER: ERROR ======== ", additionalProperties);
         self._regioncodeerror(error, additionalProperties)
         }).done(function () {
         $.extend(payload, {"props": additionalProperties});
         var payloadsUpdated = self._processRegionRecipientPayload(payloads, payload);
         amplify.publish(BaseEvents.FILTER_ON_CHANGE, payloadsUpdated);
         });

         }

         // we will active the publish

         }
         }
         /!* } else {

         console.log("==================== ELSE 2: RECIPIENT COUNTRY  ============== "+ payload.id + " - "+ payload.values.values[0]);


         $("[data-selector='recipientcode']").removeClass("all-item-hidden");
         var additionalProperties = self._getPropertiesObject(BaseConfig.SELECTORS.RECIPIENT_COUNTRY, payload.values.values);


         // self.filter.items[payload.id].selector.emptyOption = true;
         //  self.filter.add(self.filter.items[payload.id]);
         //$("[data-selector='recipientcode']").removeClass("all-item-hidden");
         }*!/

         /!*
         Q.all([
         // self._onRecipientChangeGetRegionCode(payload.values.values),
         self._onRecipientChangeGetGaulCode(payload.values.values)
         ]).then(function (result) {
         if (result) {
         self._setRecipientProperties(result, additionalProperties);
         }
         }).catch(function (error) {
         self._regioncodeerror(error, additionalProperties)
         }).done(function () {
         //  console.log("ONCHANGE: RECIPIENT PROPS UPDATE DONE ============ ", additionalProperties);

         $.extend(payload, {"props": additionalProperties});

         payloads.push(payload);
         //amplify.publish(BaseEvents.FILTER_ON_CHANGE, payloads);
         });*!/



         }
         else if (payload.id === BaseConfig.SELECTORS.SECTOR || payload.id === BaseConfig.SELECTORS.SUB_SECTOR) {

         // Check only for the Sub Sector payload but add the sector details to the payload.
         //-------------------------------------------------------------------------------
         // When Sector is selected, the Sub Sector is automatically re-populated and this in turn triggers its own 'on Change'.
         // The result is that the 'BaseEvents.FILTER_ON_CHANGE' is published twice (1 for the sector and then automatically again for the Sub Sector).
         // To avoid the double publish, only the last 'on Change' trigger is evaluated i.e. when payload = 'Sub Sector'

         //  console.log("FILTER VIEW: ON CHANGE id: ", payload.id, " value: ", payload.values.values[0]);

         if ( payload.id === BaseConfig.SELECTORS.SUB_SECTOR) {
         // Payload contains subsector and sector information
         var payloadsUpdated = self._processSectorSubSectorPayload(payloads, payload);
         amplify.publish(BaseEvents.FILTER_ON_CHANGE, payloadsUpdated);
         }

         }
         else if (payload.id === BaseConfig.SELECTORS.YEAR_TO || payload.id === BaseConfig.SELECTORS.YEAR_FROM) {


         var values = self._getSelectedValues();
         // var yearTo = values[BaseConfig.SELECTORS.YEAR_TO][0];
         // var yearFrom = values[BaseConfig.SELECTORS.YEAR_FROM][0];


         // Check only for the To payload.
         //--------------------------------
         // When From is selected, the To is automatically re-populated and this in turn triggers its own 'on Change'.
         // The result is that the 'BaseEvents.FILTER_ON_CHANGE' is published twice (1 for the From and then automatically again for the To).
         // To avoid the double publish, only the last 'on Change' trigger is evaluated i.e. when payload = 'To'

         if ( payload.id === BaseConfig.SELECTORS.YEAR_TO) {

         var newRange = self._getObject(BaseConfig.SELECTORS.YEAR, self._getSelectedLabels());

         if (newRange) {
         payload.id = BaseConfig.SELECTORS.YEAR;
         payload.values.labels = self._getObject(BaseConfig.SELECTORS.YEAR, self._getSelectedLabels());
         payload.values.values = self._getObject(BaseConfig.SELECTORS.YEAR, self._getSelectedValues());
         }

         payloads.push(payload);

         amplify.publish(BaseEvents.FILTER_ON_CHANGE, payloads);
         }

         //amplify.publish(BaseEvents.FILTER_ON_CHANGE, payload);
         }
         else if (payload.id === BaseConfig.SELECTORS.ODA) {
         var additionalProperties = self._getPropertiesObject(BaseConfig.SELECTORS.ODA, payload.values.values[0]);
         $.extend(payload, {"props": additionalProperties});
         payloads.push(payload);

         amplify.publish(BaseEvents.FILTER_ON_CHANGE, payloads);
         }
         /!* else if (payload.id === BaseConfig.SELECTORS.RECIPIENT_COUNTRY) {
         var additionalProperties = self._getPropertiesObject(BaseConfig.SELECTORS.RECIPIENT_COUNTRY, payload.values.values);

         Q.all([
         self._onRecipientChangeGetRegionCode(payload.values.values),
         self._onRecipientChangeGetGaulCode(payload.values.values)
         ]).then(function (result) {
         if (result) {
         self._setRecipientProperties(result, additionalProperties);
         }
         }).catch(function (error) {
         self._regioncodeerror(error, additionalProperties)
         }).done(function () {
         //  console.log("ONCHANGE: RECIPIENT PROPS UPDATE DONE ============ ", additionalProperties);

         $.extend(payload, {"props": additionalProperties});

         payloads.push(payload);
         amplify.publish(BaseEvents.FILTER_ON_CHANGE, payloads);
         });
         }*!/
         else {
         payloads.push(payload);
         amplify.publish(BaseEvents.FILTER_ON_CHANGE, payloads);
         }
         } else {
         self.filterValidator.displayErrorSection(valid);
         }
         });

         },

         /!**
         * Updates the filter configuration including setting the language related labels in the filter template
         * Returns: Updated Configuration
         * @returns {Object} updatedConf
         * @private
         *!/
         _getUpdatedFilterConfig: function () {

         var conf = $.extend(true, {}, this.config),
         values = {},
         updatedConf = Utils.mergeConfigurations(conf, values);

         _.each(updatedConf, _.bind(function (obj, key) {

         if (!obj.template) {
         obj.template = {};
         }
         //Add i18n label
         obj.template.title = Utils.getI18nLabel(key, i18nLabels, "filter_");
         obj.template.headerIconTooltip = Utils.getI18nLabel(key, i18nLabels, "filter_tooltip_");

         }, this));

         return updatedConf;
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

         updatedValuesWithYear = this._processTimeRange(extendedValues);

         updatedValuesWithODA = this._processODA(updatedValuesWithYear);

         return updatedValuesWithODA;

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


         /!**
         *  Get the filter configuration associated to the ID
         * @param id
         * @returns {Object} values
         * @private
         *!/

         _getFilterConfigById: function (id) {
         var filter;

         $.each(this.config, function (key, obj) {
         if (key === id) {
         return filter = obj;
         }
         });

         return filter;
         },

         /!**
         *  Get the full filter values object (consists of labels and values)
         * @returns {Object} filterValues
         *!/
         getFilterValues: function () {

         // console.log("FINAL getFilterValues ============ 1");
         var values = this._getFilterValues();

         //clear uid values
         values.values["uid"] = [];

         values.values[BaseConfig.SELECTORS.YEAR_FROM] = [];
         values.values[BaseConfig.SELECTORS.YEAR_TO] = [];


         // if all values selected clear
         if(values.values[BaseConfig.SELECTORS.RECIPIENT_COUNTRY] && values.values[BaseConfig.SELECTORS.RECIPIENT_COUNTRY][0] === s.exclusions.ALL) {
         values.values[BaseConfig.SELECTORS.RECIPIENT_COUNTRY] = [];
         }

         // if all values selected clear
         if(values.values[BaseConfig.SELECTORS.RESOURCE_PARTNER] && values.values[BaseConfig.SELECTORS.RESOURCE_PARTNER][0] === s.exclusions.ALL) {
         values.values[BaseConfig.SELECTORS.RESOURCE_PARTNER] = [];
         }

         // if all values selected clear
         if(values.values[BaseConfig.SELECTORS.SECTOR] && values.values[BaseConfig.SELECTORS.SECTOR][0] === s.exclusions.ALL) {
         values.values[BaseConfig.SELECTORS.SECTOR] = [];
         }

         // if all values selected clear
         if(values.values[BaseConfig.SELECTORS.SUB_SECTOR] && values.values[BaseConfig.SELECTORS.SUB_SECTOR][0] === s.exclusions.ALL) {
         values.values[BaseConfig.SELECTORS.SUB_SECTOR] = [];
         }

         // console.log(values);
         return values;
         },

         /!**
         *  Clear Values for the filter id
         * @param filterid
         * @param values
         * @returns {Object} values
         *!/

         clearFilterValue: function (filterid, values) {

         if (values.values[filterid]) {
         values.values[filterid] = [];
         }

         return values;
         },

         /!**
         * Add the region to payloads array and set primary payload
         * @param payloads array
         * @returns Array filters
         *!/
         _processRegionRecipientPayload: function (payloads, recipientpayload) {
         var values = this._getSelectedValues();
         var labels = this._getSelectedLabels();

         var region = {};
         region.id = BaseConfig.SELECTORS.REGION;
         region.values = {};
         region.values.labels =  labels[BaseConfig.SELECTORS.REGION];
         region.values.values =  values[BaseConfig.SELECTORS.REGION];


         // primary indicates the selection type which takes precedence
         if(recipientpayload.values.values[0] === 'all'){
         region.primary = true;
         recipientpayload.primary = false;
         } else {
         region.primary = false;
         recipientpayload.primary = true;
         }

         payloads.push(region);
         payloads.push(recipientpayload);

         return payloads;
         },

         /!**
         * Add the sector to payloads array and set primary payload
         * @param payloads array
         * @returns Array filters
         *!/
         _processSectorSubSectorPayload: function (payloads, subsectorpayload) {
         var values = this._getSelectedValues();
         var labels = this._getSelectedLabels();

         var sector = {};
         sector.id = BaseConfig.SELECTORS.SECTOR;
         sector.values = {};
         sector.values.labels =  labels[BaseConfig.SELECTORS.SECTOR];
         sector.values.values =  values[BaseConfig.SELECTORS.SECTOR];


         // primary indicates the selection type which takes precedence
         if(subsectorpayload.values.values[0] === 'all'){
         sector.primary = true;
         subsectorpayload.primary = false;
         } else {
         sector.primary = false;
         subsectorpayload.primary = true;
         }

         payloads.push(sector);
         payloads.push(subsectorpayload);

         return payloads;
         },


         /!**
         *  Process the time range so that it complies with the expected D3S format
         * @param filter
         * @returns {Object} filter
         *!/
         _processTimeRange: function (filter) {

         var year_from = filter.values[BaseConfig.SELECTORS.YEAR_FROM], year_to = filter.values[BaseConfig.SELECTORS.YEAR_TO];

         if(year_from && year_to){
         //reformat to and from years
         filter.values.year[0].value = year_from[0];
         filter.values.year[1].value = year_to[0];


         filter.labels.year.range = year_from[0] + '-' + year_to[0];
         filter.labels[BaseConfig.SELECTORS.YEAR_FROM] = [];
         filter.labels[BaseConfig.SELECTORS.YEAR_TO] = [];
         }

         return filter;
         },


         /!**
         *  Process the ODA so that it complies with the expected D3S format
         * @param filter
         * @returns {Object} filter
         *!/
         _processODA: function (filter) {

         var enumeration = [], oda = filter.values[BaseConfig.SELECTORS.ODA][0];
         enumeration.push(oda);

         filter.values[BaseConfig.SELECTORS.ODA] = {};
         filter.values[BaseConfig.SELECTORS.ODA].enumeration = enumeration;


         return filter;
         },


         /!**
         *  Process and get the filter values relevant to the OECD/ODA Dashboard
         * @returns {Object} values
         *!/

         getOECDValues: function () {

         var filterValues = this._getSelectedValues(),
         values = filterValues.values,
         labels = filterValues.labels,
         cloneObj, cloneLabelObj;

         console.log("getOECDValues ================");
         console.log(filterValues);
         //var sectorSelected = this._hasSelections(BaseConfig.SELECTORS.SECTORS, values);
         var subSectorSelected = this._hasSelections(BaseConfig.SELECTORS.SUB_SECTOR, values);
         var recipientSelected = this._hasSelections(BaseConfig.SELECTORS.RECIPIENT_COUNTRY, values);

         //if (recipientSelected) {
         //    cloneObj = this._getObject(BaseConfig.SELECTORS.RECIPIENT_COUNTRY, values);
         //     cloneLabelObj = this._getObject(BaseConfig.SELECTORS.RECIPIENT_COUNTRY, labels);
         // }


         // if (cloneObj) {
         //======= UPDATE VALUES CONFIG
         //values[BaseConfig.SELECTORS.COUNTRY] = cloneObj;
         // labels[BaseConfig.SELECTORS.COUNTRY] = cloneLabelObj;

         //======= Set everything in the values to be removed except the country
         // for (var filter in values) {
         // if (filter !== BaseConfig.SELECTORS.COUNTRY) {
         //   values[filter] = [];
         //   labels[filter] = {};
         // }
         // }
         // } else {
         // reset all filter values to empty
         // for (var filter in values) {
         //  values[filter] = [];
         // labels[filter] = {};
         // }

         // }






         // var channelsSelected = this._hasSelections(BaseConfig.SELECTORS.CHANNELS, values);

         // Set the sector and sub sector code lists references
         // Updated to match the references as declared in the dataset metadata for the parentsector_code and purposecode fields
         //if (sectorSelected) {
         //   values['parentsector_code'].codes[0].uid = s.codeLists.SECTORS.uid;
         // }

         // Set Subsectors to crs_purposes
         if (subSectorSelected) {
         //TEST  values['purposecode'].codes[0].uid = s.codeLists.SUB_SECTORS.uid;
         }

         // Set Channels to crs_channel
         //if (channelsSelected) {
         //   values['channelcode'].codes[0].uid = s.codeLists.CHANNELS.uid;
         //}

         //console.log(values);


         return this._updateValues(filterValues, subSectorSelected);
         },


         /!**
         *  Check if values exist for the filter id
         *  @param filterid
         * @returns {boolean}
         *!/

         hasValues: function (filterid) {
         var values = this._getSelectedValues();
         return this._hasSelections(filterid, values);
         },


         /!**
         *  Get the values for the filter id
         * @returns {Object} values
         *!/
         getSelectedValues: function (filterId) {
         var values = this._getSelectedValues();

         var selectedValues = {};
         var itemSelected = this._hasSelections(filterId, values);

         if (itemSelected) {
         selectedValues = values[filterId];
         //var filterObj = this._getObject(filterId, values);
         //selectedValues = this._getSelected(filterObj);
         }

         return selectedValues;
         },


         /!**
         *  Process and get the filter values relevant to the Indicators Dashboard
         * @returns {Object} values
         *!/

         getIndicatorsValues: function () {

         var filterValues = this._getFilterValues();
         var values = filterValues.values;
         var labels = filterValues.labels;

         var cloneObj, cloneLabelObj;

         // console.log("============================= VALUES =================== ");
         // console.log(values);

         var donorSelected = this._hasSelections(BaseConfig.SELECTORS.RESOURCE_PARTNER, values);
         var recipientSelected = this._hasSelections(BaseConfig.SELECTORS.RECIPIENT_COUNTRY, values);


         if (donorSelected) {
         cloneObj = this._getObject(BaseConfig.SELECTORS.RESOURCE_PARTNER, values);
         cloneLabelObj = this._getObject(BaseConfig.SELECTORS.RESOURCE_PARTNER, labels);
         }
         if (recipientSelected) {
         cloneObj = this._getObject(BaseConfig.SELECTORS.RECIPIENT_COUNTRY, values);
         cloneLabelObj = this._getObject(BaseConfig.SELECTORS.RECIPIENT_COUNTRY, labels);
         }


         if (cloneObj) {
         //======= UPDATE VALUES CONFIG
         values[BaseConfig.SELECTORS.COUNTRY] = cloneObj;
         labels[BaseConfig.SELECTORS.COUNTRY] = cloneLabelObj;

         //======= Set everything in the values to be removed except the country
         for (var filter in values) {
         if (filter !== BaseConfig.SELECTORS.COUNTRY) {
         values[filter] = [];
         labels[filter] = {};
         }
         }
         } else {
         // reset all filter values to empty
         for (var filter in values) {
         values[filter] = [];
         labels[filter] = {};
         }

         }

         return filterValues;
         },

         /!**
         * Check if a filter has selections
         * @param id
         * @returns {*|boolean}
         *!/
         isFilterSelected: function (id) {
         var values = this._getSelectedValues();


         return this._hasSelections(id, values);
         },


         /!**
         * Check if 'FAO Related Sectors' has been selected
         * @returns {*|boolean}
         *!/
         isFAOSectorsSelected: function () {
         var values = this.getSelectedValues(BaseConfig.SELECTORS.SECTOR);

         //console.log(values);
         for (var i = 0; i < values.length; i++) {
         if (values[i] === s.values.FAO_SECTORS) {
         return true;
         }
         }

         return false;
         },


         /!**
         *
         * @param values
         * @param subSectorSelected
         * @returns {*}
         * @private
         *!/
         _updateValues: function (values, subSectorSelected) {
         switch (this.isFAOSectorsSelected()) {
         case true:
         values = this._updateValuesWithSubSectors(values, this._getObject(BaseConfig.SELECTORS.SECTOR, values), subSectorSelected);
         break;
         case false:
         values = values;
         break;
         }

         return values;
         },
         /!**
         *
         * @param values
         * @param sectorvaluesobj
         * @param subSectorSelected
         * @returns {*}
         * @private
         *!/
         _updateValuesWithSubSectors: function (values, sectorvaluesobj, subSectorSelected) {
         // console.log("_updateValuesWithSubSectors");
         // If no purposecodes have been selected
         if (!subSectorSelected) {
         // Get the purposecode filter component, which will contain all
         // the purposecodes (sub-sectors) associated with the selected 'FAO-related Sectors'
         var purposeCodeComponent = this.filter.getDomain(BaseConfig.SELECTORS.SUB_SECTOR);

         if (purposeCodeComponent) {
         var codes = [];

         //======= UPDATE VALUES CONFIG
         // Add purposecode to values
         values[BaseConfig.SELECTORS.SUB_SECTOR] = {};
         values[BaseConfig.SELECTORS.SUB_SECTOR].codes = [];
         values[BaseConfig.SELECTORS.SUB_SECTOR].codes[0] = $.extend(true, {}, sectorvaluesobj); // clone the codes configuration of sectorvaluesobj

         // Get the source of the purposecode component
         // and populate the codes array with the IDs of the source items
         $.each(purposeCodeComponent.options.source, function (index, sourceItem) {
         // console.log(sourceItem);
         codes.push(sourceItem.id);
         });

         values[BaseConfig.SELECTORS.SUB_SECTOR].codes[0].codes = codes;
         values[BaseConfig.SELECTORS.SUB_SECTOR].codes[0].uid = s.codeLists.SUB_SECTORS.uid;
         values[BaseConfig.SELECTORS.SUB_SECTOR].codes[0].version = s.codeLists.SUB_SECTORS.version;

         }
         }

         // Set Values parentsector_code to be removed
         values[BaseConfig.SELECTORS.SECTOR] = {};
         values[BaseConfig.SELECTORS.SECTOR].removeFilter = true;

         return values;
         },


         /!**
         * Set Recipient Region Code
         * @param item
         * @param result
         * @private
         *!/
         _setRegionCode: function (item, result) {
         item.regioncode = result;
         },

         /!**
         * Set Recipient Gaul Code
         * @param item
         * @param result
         * @private
         *!/

         _setGaulCode: function (item, result) {
         item.gaulcode = parseInt(result);
         },

         /!**
         * Region Code Error Handler
         * @param error
         * @param item
         * @private
         *!/
         _regioncodeerror: function (error, item) {
         console.log(error, item);
         if (item.regioncode) {
         delete item['regioncode']
         }
         },
         /!**
         * General Error Handler
         * @param error
         * @private
         *!/
         _error: function (error) {
         console.log("error", error);
         },



         /!**
         * Get the FAO Region Code associated with the Recipient code
         * @param recipientCodes
         * @private
         *!/
         _onRecipientChangeGetFAORegionCode: function (recipientCodes) {
         var self = this;
         //  console.log("IS RECIPIENT")
         if (recipientCodes.length > 0) {
         //  console.log("IS RECIPIENT value")
         return Q.all([
         self._createRegionPromiseData(s.codeLists.FAO_REGIONS.uid, s.codeLists.FAO_REGIONS.version, s.codeLists.FAO_REGIONS.level, s.codeLists.FAO_REGIONS.direction, recipientCodes[0])
         ]).then(function (c) {
         return c;
         }, function (r) {
         console.error(r);
         });
         }

         },


         /!**
         * Get the Region Code associated with the Recipient code
         * @param recipientCodes
         * @private
         *!/
         _onRecipientChangeGetRegionCode: function (recipientCodes) {
         var self = this;
         //  console.log("IS RECIPIENT")
         if (recipientCodes.length > 0) {
         //  console.log("IS RECIPIENT value")
         return Q.all([
         self._createRegionPromiseData(s.codeLists.REGIONS.uid, s.codeLists.REGIONS.version, s.codeLists.REGIONS.level, s.codeLists.REGIONS.direction, recipientCodes[0])
         ]).then(function (c) {
         return c;
         }, function (r) {
         console.error(r);
         });
         }

         },


         /!**
         * Get the Gaul Code associated with the Recipient code
         * @param recipientCodes
         * @private
         *!/
         _onRecipientChangeGetGaulCode: function (recipientCodes) {
         var self = this;
         var odaProps = self._getPropertiesObject(BaseConfig.SELECTORS.ODA, self._getFilterValues().values[BaseConfig.SELECTORS.ODA]);
         var filterConfig = self._getFilterConfigById(BaseConfig.SELECTORS.RECIPIENT_COUNTRY);

         if (recipientCodes.length > 0) {
         //  console.log("IS RECIPIENT value")
         return Q.all([
         self._createGaulPromiseData(odaProps[BaseConfig.SELECTORS.ODA].enumeration[0], Utils.getLocale(), s.codeLists.RECIPIENTS.uid, s.codeLists.RECIPIENTS.version, recipientCodes)
         ]).then(function (c) {
         return c;
         }, function (r) {
         console.error(r);
         });
         }

         },

         /!**
         * Set Recipient properties
         * @param item
         * @param result
         * @private
         *!/
         _setFAORecipientProperties: function (result, props, region) {
         var self = this;

         if(result) {
         if(region){
         var gaulCodeResult = result[0][0];
         self._setRegionCode(props, region);
         self._setGaulCode(props, gaulCodeResult.data[0][0]);
         }
         else{
         var regionCodeResult = result[0][0];
         var gaulCodeResult = result[1][0];
         self._setRegionCode(props, regionCodeResult.parents[0].parents[0].code);
         self._setGaulCode(props, gaulCodeResult.data[0][0]);

         }
         }
         },


         /!**
         * Set Recipient properties
         * @param item
         * @param result
         * @private
         *!/
         _setRecipientProperties: function (result, props) {
         var self = this;

         if (result) {
         var regionCodeResult = result[0][0];
         var gaulCodeResult = result[1][0];
         self._setRegionCode(props, regionCodeResult.parents[0].code);
         self._setGaulCode(props, gaulCodeResult.data[0][0]);
         }
         },



         /!**
         * Create GET Promise to get Region code
         * @param codelist
         * @param version
         * @param depth
         * @param direction
         * @param findcode
         * @returns {*}
         * @private
         *!/
         _createRegionPromiseData: function (codelist, version, depth, direction, findcode) {

         var baseUrl = BaseConfig.SERVER + BaseConfig.CODELIST_SERVICE + BaseConfig.HIERARCHY_CODES_POSTFIX;
         baseUrl += "/" + codelist + "/" + version + "/" + findcode + "?depth=" + depth + "&direction=" + direction;


         return Q($.ajax({
         url: baseUrl,
         type: "GET",
         dataType: 'json'
         })).then(function (c) {
         return c;
         }, function (r) {
         console.error(r);
         });
         },

         /!**
         * Create POST Promise to get Gaul code
         * @param dataset
         * @param lang
         * @param codelist
         * @param version
         * @param codes
         * @returns {*}
         * @private
         *!/

         _createGaulPromiseData: function (dataset, lang, codelist, version, codes) {

         var baseUrl = BaseConfig.SERVER + BaseConfig.D3P_POSTFIX + dataset + "?dsd=true&full=true&language=" + lang;
         var data = [{
         "name": "filter",
         "parameters": {
         "rows": {
         "recipientcode": {
         "codes": [{
         "uid": codelist,
         "version": version,
         "codes": codes
         }]
         }
         }
         }
         }, {"name": "filter", "parameters": {"columns": ["gaul0"]}}, {
         "name": "page",
         "parameters": {"perPage": 1, "page": 1}
         }];


         return Q($.ajax({
         url: baseUrl,
         type: "POST",
         data: JSON.stringify(data),
         contentType: "application/json",
         dataType: 'json'
         })).then(function (c) {

         return c;
         }, function (r) {
         console.error(r);
         });
         },


         /!**
         * Check if filter id has selections
         * @param id
         * @param data
         * @returns {boolean}
         * @private
         *!/
         _hasSelections: function (id, data) {
         //console.log(id);
         if (_.has(data, id)) {
         if (data[id].length > 0) {
         // if (_.has(data[id], 'codes')) {
         return true;
         }
         }
         },
         /!**
         * Get the Object from the data based on the id (key)
         * @param id
         * @param data
         * @returns {*}
         * @private
         *!/
         _getObject: function (id, data) {
         if (_.has(data, id)) {
         if (data[id].length > 0 || !_.isEmpty(data[id])) {
         // if (_.has(data[id], 'codes')) {
         return data[id];
         }
         }
         },


         _getFilterConfig: function (id) {
         //console.log(this.config);

         var filter = _.find(this.config, function (obj, key) {

         return key === id;
         // return obj.components[0].id === id;
         });


         return filter;
         },

         _hasProp: function (filter, prop) {
         var hasProp = _.find(filter, function (obj) {
         if (filter[prop]) {
         return true;
         }
         });
         return hasProp;
         },

         getConfigPropValue: function (id, prop) {

         // console.log("===============getConfigPropValue "+id + ' | '+prop);
         var filterValue;
         var filterItem = this._getFilterConfig(id);

         // console.log(filterItem);

         if (this._hasProp(filterItem, prop))
         filterValue = filterItem[prop];

         // console.log(filterValue);
         return filterValue;
         },

         _getPropertiesObject: function (id, value) {
         var additionalProperties = {};
         additionalProperties[id] = value;

         return additionalProperties;
         },

         _unbindEventListeners: function () {

         },

         dispose: function () {
         this._unbindEventListeners();
         View.prototype.dispose.call(this, arguments);
         }

         });*/

        return FilterView;
    });
