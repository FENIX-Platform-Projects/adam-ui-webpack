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
            //datasets: {
             //   USD_COMMITMENT: 'adam_usd_commitment'
           // },
            codeLists: {
                SUB_SECTORS: {uid: 'crs_purposes', version: '2016'},
                RECIPIENT_DONORS: {uid: 'crs_recipientdonors', version: '2016'},
                REGIONS: {uid: 'crs_un_regions_recipients', version: '2016', level: "2", direction: "up"},
                FAO_REGIONS: {uid: 'crs_fao_regions', version: '2016', level: "2", direction: "up"},
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

        FilterView.prototype._parseInput = function (params) {
            this.$el = $(this.el);
            this.lang = params.lang || BaseConfig.LANG.toLowerCase();
            this.environment = params.environment  || BaseConfig.ENVIRONMENT;
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
            this.filterUtils = new FilterUtils();

            this.$titleItemsList = this.$el.find(s.css_classes.TITLE_ITEMS_LIST);
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

                 //console.log("================== FILTERS READY =========== ");
                // console.log(this._getFormattedFilterValues());

                // For the Recipient Country, get and set the GAUL Code and Region Code as attributes to the props object
                if (this._getSelectorValues(BaseConfig.SELECTORS.RECIPIENT_COUNTRY)) {
                    var additionalProperties = this.filterUtils.getPropertiesObject(BaseConfig.SELECTORS.RECIPIENT_COUNTRY, this._getSelectorValues(BaseConfig.SELECTORS.RECIPIENT_COUNTRY));

                    Q.all([
                        self._onRecipientChangeGetGaulCode(self._getSelectorValues(BaseConfig.SELECTORS.RECIPIENT_COUNTRY))
                    ]).then(function (result) {
                        if (result) {
                            var gaul = result[0], region = self._getSelectorValues(BaseConfig.SELECTORS.REGION);
                            self._setRecipientProperties(region, gaul, additionalProperties);
                        }
                    }).catch(function (error) {
                        console.log(error);
                        self._processRegionCodeError(error, additionalProperties)
                    }).done(function () {
                        amplify.publish(BaseEvents.FILTER_ON_READY, $.extend(self._getFormattedFilterValues(), {"props": additionalProperties}));
                    });

                }
                // For ODA set its value to the props object
                else if (this._getSelectorValues(BaseConfig.SELECTORS.ODA)) {
                    var additionalProperties = this.filterUtils.getPropertiesObject(BaseConfig.SELECTORS.ODA, this._getFirstSelectorValue(BaseConfig.SELECTORS.ODA));
                    amplify.publish(BaseEvents.FILTER_ON_READY, $.extend(this._getFormattedFilterValues(), {"props": additionalProperties}));
                }
                else {
                    amplify.publish(BaseEvents.FILTER_ON_READY, this._getFormattedFilterValues());
                }

            }, this);


            // Filter on Change: Set some base properties for Recipient and the ODA, then publish Filter On Change Event
            this.filter.on('click', function (payload) {

              // console.log("================== FILTERS CLICK 1: =========== ", payload.id);
               // console.log(this._getSelectedValues());

                // validate filter
                var valid = this.filterValidator.validateValues(this._getSelectedValues(), this.lang);

               // console.log("================== FILTERS CHANGE 2 SELECTED VALUES =========== VALID ", valid, payload.id);
                //console.log(this._getFirstPayloadValue(payload));


               // console.log("================== FILTERS CHANGE 3 SELECTED VALUES =========== ", this._getFirstPayloadValue(payload));

                if (valid === true && this._getFirstPayloadValue(payload)) {


                    //Initialize Variables
                    var payloads = [],
                        dependencies = [],
                        payloadId = payload.id,
                        payloadLabels = payload.values.labels,
                        payloadValues = payload.values.values;

                    // Set Primary Payload
                    payload.primary = true;

                    // Hide any Validator Error Messages
                    this.filterValidator.hideErrorSection();

                    // Get Filter configuration for payloada and evaluated if payload has a dependency
                    var fc = this.filterUtils.getFilterConfigById(this.config, payloadId);

                    if (fc && fc.dependencies) {
                        for (var id in fc.dependencies) {
                            dependencies.push(id);
                        }

                        payload["dependencies"] = dependencies;
                    }

                    // Process Payload
                    // ============= REGION AND RECIPIENT
                    if (payloadId === BaseConfig.SELECTORS.REGION || payloadId === BaseConfig.SELECTORS.RECIPIENT_COUNTRY) {

                        if (payloadId === BaseConfig.SELECTORS.REGION) {
                            // Hide all Item from Recipient Country
                            this.filterUtils.removeAllOption(this.$el, BaseConfig.SELECTORS.RECIPIENT_COUNTRY);
                        }

                        if (payloadId === BaseConfig.SELECTORS.RECIPIENT_COUNTRY) {

                            var additionalProperties = this.filterUtils.getPropertiesObject(BaseConfig.SELECTORS.RECIPIENT_COUNTRY, this._getPayloadValues(payload));

                            //Get Selected Values
                            var payloadRecipientValue = this._getFirstPayloadValue(payload);
                            var regionValue = this._getFirstSelectorValue(BaseConfig.SELECTORS.REGION);


                            // ALL regions selected
                            if (regionValue === s.exclusions.ALL) {

                                if (payloadRecipientValue === s.exclusions.ALL) {
                                    // Hide all Item
                                    this.filterUtils.removeAllOption(this.$el, payloadId);

                                    // Set the Default Value, will activate onchange and will go into the else
                                    var defaultValue = this._getSelectorDefaultValue(payloadId);

                                    if (defaultValue)
                                        this.filterUtils.setDefaultValue(this.$el, payloadId, defaultValue);

                                } else {

                                    this._publishRegionGaulProperties(payload, additionalProperties, payloads);

                                   // $.extend(payload, {"props": additionalProperties});
                                   // var payloadsUpdated = self._processRegionRecipientPayload(payloads, payload);


                                   // console.log(" =================== payloadsUpdated =====  ", payloadsUpdated);


                                  //  amplify.publish(BaseEvents.FILTER_ON_CHANGE, payloadsUpdated);


                                   /* Q.all([
                                        self._onRecipientChangeGetRegionCode(self._getPayloadValues(payload)),
                                        self._onRecipientChangeGetGaulCode(self._getPayloadValues(payload))
                                    ]).then(function (result) {
                                        if (result) {
                                            var regionResult, region = result[0], gaul = result[1];

                                            if (region) {
                                                regionResult = region.parents[0].parents[0].code;
                                            }
                                            self._setRecipientProperties(regionResult, gaul, additionalProperties);
                                            //self._setRecipientProperties(region, gaul, additionalProperties);
                                        }
                                    }).catch(function (error) {
                                        //console.log("==================== ELSE: payloadRecipientValue OTHER: ERROR ======== ", additionalProperties);
                                        self._processRegionCodeError(error, additionalProperties)
                                    }).done(function () {
                                        $.extend(payload, {"props": additionalProperties});
                                        var payloadsUpdated = self._processRegionRecipientPayload(payloads, payload);

                                        console.log("====================== TEXT  ======", payload);
                                        amplify.publish(BaseEvents.FILTER_ON_CHANGE, payloadsUpdated);
                                    });*/

                                }

                                /*  console.log("==================== IF: 2i RECIPIENT COUNTRY POST ============== "+ payloadId + " - " +payload.values[0]);

                                 $("[data-selector='recipientcode']").addClass("all-item-hidden");
                                 var filterItem = this.$el.find("[data-selector='"+payload.id+"']")[0];
                                 var selectize = $(filterItem).find("[data-role=dropdown]")[0].selectize;
                                 selectize.removeOption("all");
                                 selectize.setValue('625'); // activate onchange and will go in the else

                                 console.log("==================== IF: 2ii RECIPIENT COUNTRY POST ============== "+ payloadId + " - " +payload.values[0]);
                                 */

                            } else {
                                 //     console.log("==================== ELSE REGION OTHER  1============== " + payloadId + " - " + additionalProperties);
                              //  console.log("==================== ELSE REGION OTHER  1i payloadRecipientValue ============== " + payloadRecipientValue);

                                // Add all Item
                                this.filterUtils.addAllOption(this.$el, payload.id);

                                if (payloadRecipientValue === s.exclusions.ALL) {
                                    var region = self._getSelectorValues(BaseConfig.SELECTORS.REGION);
                                    self._setRecipientProperties(region, null, additionalProperties);

                                  //  console.log("==================== ELSE REGION OTHER 2 ============== " + payloadId + " - " + additionalProperties);


                                    $.extend(payload, {"props": additionalProperties});
                                    var payloadsUpdated = this._processRegionRecipientPayload(payloads, payload);

                                 //   console.log("==================== ELSE REGION OTHER  3============== " + payloadId + " - " + additionalProperties);

                                    console.log(" ===============  ###### FILTER_ON_CHANGE PUBLISH REGION NOT ALL: RECIPIENT == ALL == VALUE ======================");

                                    amplify.publish(BaseEvents.FILTER_ON_CHANGE, payloadsUpdated);

                                } else {

                                    this.getGAUL(this._getPayloadValues(payload), _.bind(this._processRecipient, this, additionalProperties));
                                    this._publishGaulProperties(payload, additionalProperties, payloads);


                                    //console.log(" ===============  ###### FILTER_ON_CHANGE PUBLISH REGION NOT ALL: RECIPIENT == HAS == VALUE ======================");

                                    /* Q.all([
                                         // self._onRecipientChangeGetRegionCode(payload.values.values),
                                         self._onRecipientChangeGetGaulCode(self._getPayloadValues(payload))
                                     ]).then(function (result) {
                                         if (result) {
                                             var gaul = result[0], region = self._getSelectorValues(BaseConfig.SELECTORS.REGION);
                                             // var region = result[0], gaul = result[1];
                                             // self._setRecipientProperties(region, gaul, additionalProperties);
                                             self._setRecipientProperties(region, gaul, additionalProperties);

                                         }
                                     }).catch(function (error) {
                                         // console.log("====================  ELSE REGION OTHER: ERROR ======== ", additionalProperties);
                                         self._processRegionCodeError(error, additionalProperties)
                                     }).done(function () {
                                         $.extend(payload, {"props": additionalProperties});
                                         var payloadsUpdated = self._processRegionRecipientPayload(payloads, payload);

                                         console.log("====================== TEXT  2 ======", payload);

                                         amplify.publish(BaseEvents.FILTER_ON_CHANGE, payloadsUpdated);
                                     });
 */
                                }

                            }
                        }

                    }
                    else if (payloadId === BaseConfig.SELECTORS.SECTOR || payloadId === BaseConfig.SELECTORS.SUB_SECTOR) {

                        // Check only for the Sub Sector payload but add the sector details to the payload.
                        //-------------------------------------------------------------------------------
                        // When Sector is selected, the Sub Sector is automatically re-populated and this in turn triggers its own 'on Change'.
                        // The result is that the 'BaseEvents.FILTER_ON_CHANGE' is published twice (1 for the sector and then automatically again for the Sub Sector).
                        // To avoid the double publish, only the last 'on Change' trigger is evaluated i.e. when payload = 'Sub Sector'

                        //  console.log("FILTER VIEW: ON CHANGE id: ", payload.id, " value: ", payload.values[0]);


                        if (payloadId === BaseConfig.SELECTORS.SUB_SECTOR) {
                            // Payload contains subsector and sector information
                            var payloadsUpdated = this._processSectorSubSectorPayload(payloads, payload);
                            console.log("================== FILTERS CHANGE 5 payloadsUpdated =========== ", payloadsUpdated, " payload.id ", payload.id);

                            amplify.publish(BaseEvents.FILTER_ON_CHANGE, payloadsUpdated);
                        }

                    }
                    else if (payloadId === BaseConfig.SELECTORS.YEAR_TO || payloadId === BaseConfig.SELECTORS.YEAR_FROM) {


                        var values = this._getSelectedValues();
                        // var yearTo = values[BaseConfig.SELECTORS.YEAR_TO][0];
                        // var yearFrom = values[BaseConfig.SELECTORS.YEAR_FROM][0];

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

                            payloads.push(payload);

                            amplify.publish(BaseEvents.FILTER_ON_CHANGE, payloads);
                        }

                        //amplify.publish(BaseEvents.FILTER_ON_CHANGE, payload);
                    }
                    else if (payloadId === BaseConfig.SELECTORS.ODA) {
                        var additionalProperties = this.filterUtils.getPropertiesObject(BaseConfig.SELECTORS.ODA, this._getFirstPayloadValue(payload));
                        $.extend(payload, {"props": additionalProperties});
                        payloads.push(payload);

                        amplify.publish(BaseEvents.FILTER_ON_CHANGE, payloads);
                    }
                    else {
                        console.log(" ===============  ###### DEFAULT PUBLISH ======================");
                        payloads.push(payload);
                        amplify.publish(BaseEvents.FILTER_ON_CHANGE, payloads);
                    }
                } else {
                    this.filterValidator.displayErrorSection(valid);
                }
            }, this);
         };

            /**
             * Format the time range and ODA values
             * @returns {Object}
             * @private
             */


           /* FilterView.prototype._getFilterValues = function () {

                var timerange = {
                    values: {year: [{value: '', parent: s.range.FROM}, {value: '', parent: s.range.TO}]},
                    labels: {year: {range: ''}}
                };

                var updatedValuesWithYear = {}, updatedValuesWithODA = {}, extendedValues = $.extend(true, {}, this.filter.getValues(), timerange);

                updatedValuesWithYear = this.filterUtils.processTimeRange(extendedValues);

                updatedValuesWithODA = this.filterUtils.removeODAPrefix(updatedValuesWithYear);

                return updatedValuesWithODA;

            };*/


            /**
             * Get Formatted Filter Values
             * @returns {Object}
             * @private
             */


            FilterView.prototype._getFormattedFilterValues = function () {
                var filterValues = this.filter.getValues();
                return this._formatFilterValues(filterValues);
            };




            FilterView.prototype._getSelectorValues = function (id) {
                return  this._getFormattedFilterValues().values[id];
            };

            FilterView.prototype._getFirstSelectorValue = function (id) {
                if(this._getSelectorValues(id)){
                    return this._getFormattedFilterValues().values[id][0]
                }
            };


        FilterView.prototype._processRecipient = function (data, additionalProperties) {

            console.log(" ============ _processRecipient ", data, additionalProperties);

            if (data) {

                var gaul = data[0], region;

                if(this._getSelectorValues(BaseConfig.SELECTORS.REGION)){
                    region = this._getSelectorValues(BaseConfig.SELECTORS.REGION);
                }

               this._setRecipientProperties(region, gaul, additionalProperties);

              //  $.extend(payload, {"props": additionalProperties});


               // return self._processRegionRecipientPayload(payloads, payload)

            }
        };


        /**
         * Get the selected filter values
         * @returns {Object} values
         * @private
         */

        FilterView.prototype._getSelectedValues = function () {
             console.log(" ================ FILTERVIEW:::: _getSelectedValues ", this._getFormattedFilterValues());
            return this._getFormattedFilterValues().values;
        };


        /**
         *  Get the selected filter labels
         * @returns {Object} labels
         * @private
         */
        FilterView.prototype._getSelectedLabels = function () {
            return this._getFormattedFilterValues().labels;
        };


            /**
             * Format the time range and ODA values
             * @returns {Object}
             * @private
             */


            FilterView.prototype._formatFilterValues = function (filterValues) {
                var timerange = {
                    values: {year: [{value: '', parent: s.range.FROM}, {value: '', parent: s.range.TO}]},
                    labels: {year: {range: ''}}
                };

                var updatedValuesWithYear = {}, updatedValuesWithODA = {}, extendedValues = $.extend(true, {}, filterValues, timerange);

                updatedValuesWithYear = this.filterUtils.processTimeRange(extendedValues);

                updatedValuesWithODA = this.filterUtils.removeODAPrefix(updatedValuesWithYear);

                return updatedValuesWithODA;

            };



        FilterView.prototype._getPayloadValues = function (payload) {
            return  payload.values;//payload.values.values;
        };

        FilterView.prototype._getFirstPayloadValue = function (payload) {
            return  this._getPayloadValues(payload)[0];
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
            var odaProps = this.filterUtils.getPropertiesObject(BaseConfig.SELECTORS.ODA, self._getSelectorValues(BaseConfig.SELECTORS.ODA));
            //var filterConfig = this.filterUtils.getFilterConfigById(BaseConfig.SELECTORS.RECIPIENT_COUNTRY);

            if (recipientCodes.length > 0) {
                return Q.all([
                    self._createGaulPromiseData(BaseConfig.DEFAULT_UID, this.lang.toUpperCase(), s.codeLists.RECIPIENTS.uid, s.codeLists.RECIPIENTS.version, recipientCodes)
                ]).then(function (c) {
                    console.log("_onRecipientChangeGetGaulCode", c)
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

            if(region) {
                var regionCodeResult = region[0];

                console.log(" =================== _setRecipientProperties: regionCodeResult: ", regionCodeResult);
                self._setRegionCode(props, regionCodeResult);
                //self._setRegionCode(props, regionCodeResult.parents[0].parents[0].code);
            }

            if(gaul){
                var gaulCodeResult = gaul[0];

                console.log(" ===================== _setRecipientProperties: gaulCodeResult: ", gaulCodeResult);

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
         * Add the region to payloads array and set primary payload
         * @param payloads array
         * @returns Array filters
         */
        FilterView.prototype._processRegionRecipientPayload = function (payloads, recipientpayload) {
            var values = this._getSelectedValues();
            var labels = this._getSelectedLabels();

            var region = {};
            region.id = BaseConfig.SELECTORS.REGION;
            region.labels =  labels[BaseConfig.SELECTORS.REGION];
            region.values =  values[BaseConfig.SELECTORS.REGION];
            region.props = recipientpayload.props;


            // primary indicates the selection type which takes precedence
            if(this._getFirstPayloadValue(recipientpayload) === 'all'){
                region.primary = true;
                region.isRecipientRelated = true;
                recipientpayload.primary = false;
            } else {
                region.primary = false;
                recipientpayload.primary = true;
                recipientpayload.isRecipientRelated = true;
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
            sector.labels =  labels[BaseConfig.SELECTORS.SECTOR];
            sector.values =  values[BaseConfig.SELECTORS.SECTOR];


            // primary indicates the selection type which takes precedence
            if(this._getFirstPayloadValue(subsectorpayload) === 'all'){
                sector.primary = true;
                sector.isSectorRelated = true;
                subsectorpayload.primary = false;

            } else {
                sector.primary = false;
                subsectorpayload.primary = true;
                subsectorpayload.isSectorRelated = true;
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

           // baseUrl = "http://fenix.fao.org/d3s_dev/msd/codes/hierarchy/crs_fao_regions/2016/625?depth=2&direction=up";

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
            var filteredValues = this._resetSelections();

            return filteredValues;
        };


        FilterView.prototype._resetSelections = function () {

            var filteredValues = this._getFormattedFilterValues();

            var values = filteredValues.values;

            //clear uid values
            values["uid"] = [];

            values[BaseConfig.SELECTORS.YEAR_FROM] = [];
            values[BaseConfig.SELECTORS.YEAR_TO] = [];

            // if all values selected clear
            if(this._getFirstSelectorValue(BaseConfig.SELECTORS.REGION) && this._getFirstSelectorValue(BaseConfig.SELECTORS.REGION) === s.exclusions.ALL) {
                values[BaseConfig.SELECTORS.REGION] = [];
            }

            // if all values selected clear
            if(this._getFirstSelectorValue(BaseConfig.SELECTORS.RECIPIENT_COUNTRY) && this._getFirstSelectorValue(BaseConfig.SELECTORS.RECIPIENT_COUNTRY) === s.exclusions.ALL) {
                values[BaseConfig.SELECTORS.RECIPIENT_COUNTRY] = [];
            }

            // if all values selected clear
            if(this._getFirstSelectorValue(BaseConfig.SELECTORS.RESOURCE_PARTNER) && this._getFirstSelectorValue(BaseConfig.SELECTORS.RESOURCE_PARTNER) === s.exclusions.ALL) {
                values[BaseConfig.SELECTORS.RESOURCE_PARTNER] = [];
            }

            // if all values selected clear
            if(this._getFirstSelectorValue(BaseConfig.SELECTORS.SECTOR) && this._getFirstSelectorValue(BaseConfig.SELECTORS.SECTOR) === s.exclusions.ALL) {
                values[BaseConfig.SELECTORS.SECTOR] = [];
            }

            // if all values selected clear
            if(this._getFirstSelectorValue(BaseConfig.SELECTORS.SUB_SECTOR) && this._getFirstSelectorValue(BaseConfig.SELECTORS.SUB_SECTOR) === s.exclusions.ALL) {
                values[BaseConfig.SELECTORS.SUB_SECTOR] = [];
            }

            return filteredValues;
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


        FilterView.prototype._getSelectorDefaultValue = function (selectorId) {
            return this.filter.items[selectorId].selector.default[0];
        };


        FilterView.prototype._publishRegionGaulProperties = function (payload, additionalProperties, payloads) {
            var self = this;

            Q.all([
                self._onRecipientChangeGetRegionCode(self._getPayloadValues(payload)),
                self._onRecipientChangeGetGaulCode(self._getPayloadValues(payload))
            ]).then(function (result) {
                if (result) {
                    var regionArray = [], region = result[0], gaul = result[1];

                    if (region) {
                        regionArray.push(region[0].parents[0].code);
                    }

                    self._setRecipientProperties(regionArray, gaul, additionalProperties);
                }
            }).catch(function (error) {
                self._processRegionCodeError(error, additionalProperties)
            }).done(function () {
                $.extend(payload, {"props": additionalProperties});

                var payloadsUpdated = self._processRegionRecipientPayload(payloads, payload);

               //  console.log("================= XXXXXXXXXXXXXXXXXXXX ================", additionalProperties);
             //  console.log("================= XXXXXXXXXXXXXXXXXXXX ================", payload.id);


                if(additionalProperties.regioncode){

                    var getFilterValues
                    //var regionValue = self._getFirstSelectorValue(BaseConfig.SELECTORS.REGION);


                   // self.config[BaseConfig.SELECTORS.RECIPIENT_COUNTRY].selector.default = [additionalProperties.recipientcode];
                    // Set Value
                    //self.filterUtils.setValue(self.$el, BaseConfig.SELECTORS.REGION, additionalProperties.regioncode);
                    //self.filterUtils.setValue(self.$el, BaseConfig.SELECTORS.REGION, additionalProperties.recipientcode);
                }
                //console.log(additionalProperties);



                amplify.publish(BaseEvents.FILTER_ON_CHANGE, payloadsUpdated);
            });
        };

        FilterView.prototype.getGAUL = function (codes, callback) {

            console.log(" =========================== getGAUL ===================== ");

            var dataset = BaseConfig.DEFAULT_UID,
                lang = this.lang.toUpperCase(),
                codelist = s.codeLists.RECIPIENTS.uid,
                version = s.codeLists.RECIPIENTS.version;

            var obj = {};

            obj.url = BaseConfig.SERVER + BaseConfig.D3P_POSTFIX + dataset + "?dsd=true&full=true&language=" + lang;
            obj.body = [{
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


            var promise = this._createPromise(obj, callback);

            return promise;

        };


        FilterView.prototype._createPromise = function (obj, callback) {

            var self = this;

            return this._getPromise(obj, callback)
                .then(function (result) {

                    var data = result;

                    return data;

                }, function (r) {
                    log.error(r);
                });
        };


        FilterView.prototype._getPromise = function (obj, callback) {

            var promise = this.getCodes(obj, callback);

            return promise;

        };

        FilterView.prototype.getCodes = function (obj, callback) {
            var body = obj.body;
            var url = obj.url;

            return Q($.ajax({
                url:url,
                type: "POST",
                dataType: 'json',
                contentType: "application/json",
                data: JSON.stringify(body)
            })).then(function (data) {

                return Q.promise(function (resolve, reject, notify) {
                     callback(data);
                    return data;
                });

            }, function (error) {

                return Q.promise(function (resolve, reject, notify) {
                    return reject(error);
                });

            });

        };

        FilterView.prototype._publishGaulProperties = function (payload, additionalProperties, payloads) {
            var self = this;

            console.log(" =================== BEFFORE 3: _publishGaulProperties ");

            Q.all([
                self._onRecipientChangeGetGaulCode(self._getPayloadValues(payload))
            ]).then(function (result) {
                if (result) {
                    var gaul = result[0], region = self._getSelectorValues(BaseConfig.SELECTORS.REGION);
                    // var region = result[0], gaul = result[1];
                    // self._setRecipientProperties(region, gaul, additionalProperties);
                    self._setRecipientProperties(region, gaul, additionalProperties);

                }
            }).catch(function (error) {
                // console.log("====================  ELSE REGION OTHER: ERROR ======== ", additionalProperties);
                self._processRegionCodeError(error, additionalProperties)
            }).done(function () {
                $.extend(payload, {"props": additionalProperties});
                var payloadsUpdated = self._processRegionRecipientPayload(payloads, payload);

                console.log(" XXXXXX =================== PUBLISH : _publishGaulProperties ");

                amplify.publish(BaseEvents.FILTER_ON_CHANGE, payloadsUpdated);
            });

        };



        /**
         *  Process and get the filter values relevant to the Indicators Dashboard
         * @returns {Object} values
         */

        FilterView.prototype.getIndicatorsValues = function () {


            var filterValues = this._getFormattedFilterValues();
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



        return FilterView;
    });
