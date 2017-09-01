/*global define*/

define(['../config-base'], function(Config) {

    'use strict';

    return {
        id: 'OTHER_SECTORS',

        dashboard: {
            //default dataset id
            uid: "adam_project_analysis",

            items: [
                {
                    id: "projects",
                    type: 'table',
                    //type: 'custom',

                    config: {
                        type: 'bootstrap-table',
                        config: {
                            showMultiSort : false,
                            sortName: 'value',
                            sortOrder: "desc"
                        }

                    },


                    filterFor: {
                        "filter_projects": ['recipientcode', 'donorcode', 'purposecode', 'year', 'fao_region', 'oda']
                    },

                    postProcess: [
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_project_analysis"
                                }
                            ],
                            "parameters": {
                                "columns": [
                                    "recipientcode",
                                    "oda",
                                    "donorcode",
                                    "projecttitle",
                                    "year",
                                    "parentsector_code",
                                    "purposecode",
                                    "value",
                                    "unitcode"
                                ],
                                "rows": {
                                    "oda": {
                                        "codes": [{
                                            "uid": "oda_crs",
                                            "version": "2016",
                                            "codes": ["usd_commitment"]
                                        }]
                                    },
                                    "year": {
                                        "time": [
                                            {
                                                "from": Config.YEARSTART,
                                                "to": Config.YEARFINISH
                                            }
                                        ]
                                    },
                                    "fao_region": {
                                        "codes": [
                                            {
                                                "uid": "crs_fao_regions",
                                                "version": "2016",
                                                "codes": [
                                                    "RAP"
                                                ]
                                            }
                                        ]
                                    },
                                    "recipientcode": {
                                        "codes": [
                                            {
                                                "uid": "crs_recipients",
                                                "version": "2016",
                                                "codes": [
                                                    "625"
                                                ]
                                            }
                                        ]
                                    },
                                    "donorcode": {
                                        "codes": [
                                            {
                                                "uid": "crs_donors",
                                                "version": "2016",
                                                "codes": [
                                                    "1"
                                                ]
                                            }
                                        ]
                                    },
                                    "fao_sector":{
                                        "enumeration":[
                                            "1"
                                        ]
                                    }
                                }
                            },
                            "rid": {
                                "uid": "filter_projects"
                            }
                        },
                        {
                            "name" : "select",
                            "parameters" : {
                                "values" : {
                                    "recipientcode" : null,
                                    "donorcode" : null,
                                    "projecttitle" : null,
                                    "year" : null,
                                    "parentsector_code" : null,
                                    "purposecode" : null,
                                    "value" : "round(value::numeric,2)",
                                    "unitcode" : null
                                }
                            }
                        },
                        {
                            "name": "order",
                            "parameters": {
                                "year": "DESC",
                                "value":"DESC"
                            }
                        },
                        {
                            "name": "page",
                            "parameters": {
                                "perPage": 500,
                                "page": 1
                            }
                        }
                    ]
                }
            ]
        }
    }


});