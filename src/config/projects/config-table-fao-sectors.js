/*global define*/

define(['../config-base'], function(Config) {

    'use strict';

    return {
        id: 'OTHER_SECTORS',

        dashboard: {
            //default dataset id
            uid: "adam_project_analysis",

            maxSize: 2000,

            items: [
                {
                    id: "projects",
                    type: 'table',
                    config: {
                        "groupedRow":false,
                        "aggregationFn":{"commitment_value":"sum"},
                        "formatter":"localstring",
                        "decimals":2,
                        "pageSize": "150",
                        "showRowHeaders":true,
                        "rows":["recipientcode_EN", "donorcode_EN", "projecttitle", "year", "parentsector_code_EN", "purposecode_EN", 'commitment_value', "disbursement_value" ],
                        "aggregations":[],
                        //"values":["value"],

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
                                {id: "commitment_value", width: 100, align: 'center', sortOrder: 'desc'},
                                {id: "disbursement_value", width: 100, align: 'center'}
                            ]
                        }
                    },


                    filterFor: {
                        "filter_projects": ['recipientcode', 'donorcode', 'purposecode', 'year', 'fao_region', 'oda_grp']
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
                                    "donorcode",
                                    "projecttitle",
                                    "year",
                                    "parentsector_code",
                                    "purposecode",
                                    "commitment_value",
                                    "disbursement_value",
                                    "unitcode"
                                ],
                                "rows": {
                                    "oda_grp": {
                                        "codes": [{
                                            "uid": "oda_grp",
                                            "version": "2016",
                                            "codes": ["deflated"]
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
                            "name" : "select",
                            "parameters" : {
                                "values" : {
                                    "recipientcode" : null,
                                    "donorcode" : null,
                                    "projecttitle" : null,
                                    "year" : null,
                                    "parentsector_code" : null,
                                    "purposecode" : null,
                                    "commitment_value" : "round(commitment_value::numeric,2)",
                                    "disbursement_value" : "round(disbursement_value::numeric,2)",
                                    "unitcode" : null
                                }
                            }
                        },
                        {
                            "name": "order",
                            "parameters": {
                                "commitment_value": "DESC"
                            }
                        }
                    ]
                }
            ]
        }
    }


});