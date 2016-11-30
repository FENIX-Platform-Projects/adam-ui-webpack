/*global define*/

define(function () {

    'use strict';

    return {

        "country": {

            uid: "adam_country_indicators",

            items: [
                {
                    id: 'recipient-indicators',
                    type: 'custom',

                    filter: { //FX-filter format
                        countrycode: ["625"] //Afghanistan
                    },
                    postProcess: [
                        {
                            "name": "filter",
                            "parameters": {
                                "columns": ["period", "value", "indicatorcode", "source", "note", "link", "itemcode", "unitcode", "countrycode"]

                            }
                        },{
                            "name": "order",
                            "parameters": {
                                "indicatorcode": "ASC"
                            }
                        }]
                }
                ]
        },
        "donor": {

            uid: "adam_country_indicators",

            items: [
                {
                    id: 'partner-indicators',
                    type: 'custom',

                    filter: { //FX-filter format
                        countrycode: ["1"] //Austria
                    },
                    postProcess: [
                        {
                            "name": "filter",
                            "parameters": {
                                "columns": ["period", "value", "indicatorcode", "source", "note", "link", "itemcode", "unitcode", "countrycode"]
                            }
                        },{
                            "name": "order",
                            "parameters": {
                                "indicatorcode": "ASC"
                            }
                        }]
                }
            ]

        }
    }


});