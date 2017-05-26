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
                    type: 'custom',
                    config: {
                        "groupedRow":false,
                        "aggregationFn":{"value":"sum"},
                        "formatter":"localstring",
                        "decimals":2,
                        "pageSize": "150",
                        "showRowHeaders":true,
                        "columns":["oda"],
                        "rows":["recipientcode_EN", "donorcode_EN", "projecttitle", "year", "parentsector_code_EN", "purposecode_EN" ],
                        "aggregations":[],
                        "values":["value"],

                        config: {
                            pageSize: 150,
                            height: 700,
                            autoSelectFirstRow: false,
                            columns: [
                                {id: "recipientcode_EN", width: 110},
                                {id: "donorcode_EN", width: 120},
                                {id: "projecttitle", width: 160},
                                {id: "year", width: 60,  align: 'center', sortOrder: 'desc'},
                                {id: "parentsector_code_EN", width: 100},
                                {id: "purposecode_EN", width: 100},
                                {id: "oda", width: 100, align: 'center', getSortValue : function(value , record){
                                    return Number(value);
                                }},
                                {id: "oda", width: 100, align: 'center', getSortValue : function(value , record){
                                    return Number(value);
                                }}
                            ]
                        }
                    },


                    filterFor: {
                        "filter_projects": ['recipientcode', 'donorcode', 'purposecode', 'year', 'fao_region']
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
                                    "!recipientcode": {
                                        "codes": [
                                            {
                                                "uid": "crs_recipients", // skipping regional recipient countries (e.g. "Africa, regional"; "North of Sahara, regional")
                                                "version": "2016",
                                                "codes": [
                                                    "298", "498", "798", "89", "589", "889", "189", "289","389", "380", "489", "789","689", "619", "679"
                                                ]
                                            }
                                        ]
                                    },
                                    "year": {
                                        "time": [
                                            {
                                                "from": Config.YEARSTART,
                                                "to": Config.YEARFINISH
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
                                    "fao_sector": {
                                        "enumeration": [
                                            "1"
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
                                    }
                                }
                            },
                            "rid":{"uid":"filter_projects"}
                        },
                        {
                            "name": "order",
                            "parameters": {
                                "year": "DESC",
                                "recipientcode": "DESC"
                            }
                        }
                    ]
                }
            ]
        }
    }


});