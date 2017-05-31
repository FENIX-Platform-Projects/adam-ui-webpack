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
                                {id: "year", width: 60,  align: 'center'},
                                {id: "parentsector_code_EN", width: 100},
                                {id: "purposecode_EN", width: 100},
                                {id: "oda", width: 100, align: 'center',sortOrder: 'desc'},
                                {id: "oda", width: 100, align: 'center'}
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
                                "oda": "ASC",
                                "value": "DESC",
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