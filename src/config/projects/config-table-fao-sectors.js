/*global define*/

define(function () {

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
                                {id: "recipientcode_EN", width: 150},
                                 {id: "donorcode_EN", width: 150},
                                {id: "projecttitle", width: 200},
                                {id: "year", width: 70,  align: 'center', sortOrder: 'desc'},
                                {id: "parentsector_code_EN", width: 150},
                                {id: "purposecode_EN", width: 150},
                                {id: "oda", width: 110, align: 'center', getSortValue : function(value , record){
                                    return Number(value);
                                }},
                                {id: "oda", width: 110, align: 'center', getSortValue : function(value , record){
                                    return Number(value);
                                }}
                            ]
                        }
                    },


                    filterFor: {
                        "filter_projects": ['recipientcode', 'donorcode', 'purposecode', 'year']
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
                                                "from": 2000,
                                                "to": 2014
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
                                    }
                                }
                            },
                            "rid":{"uid":"filter_projects"}
                        },
                        {
                            "name": "order",
                            "parameters": {
                                "year": "DESC"
                            }
                        }
                    ]
                }
            ]
        }
    }


});