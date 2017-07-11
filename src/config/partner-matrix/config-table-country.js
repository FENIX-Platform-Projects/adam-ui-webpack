/*global define*/

define(['../config-base'], function(Config) {

    'use strict';

    return {
        dashboard: {
            //default dataset id
            uid: "adam_resource_matrix_oda",

            items: [
                {
                    id: "partner-matrix",
                    type: 'custom',
                    config: {
                        "groupedRow": false,
                        "formatter": "localstring",
                        "aggregationFn":{"value":"sum"},
                        "showRowHeaders": true,
                        //"columns": ["total_oda_value", "fao_sector_val", "percentage_val"],
                        // "rows": ["recipientcode_EN", "donorcode_EN"],
                        "rows": ["recipientcode_EN", "donorcode_EN", "total_oda_value", "ODA", "SHARE"],
                        //"values": ["total_oda_value", "ODA to FAO-related sectors ($)", "Share (%)"],//["value"],
                        "aggregations": [],
                        //inputFormat: "fenixtool",

                        // 878 total width
                        config: {
                            pageSize: 150,
                            autoSelectFirstRow: false,
                            // customRowAttribute : function(record,rn,grid){
                            //     grid.autoSelectFirstRow = false;
                            //
                            //
                            //     if (record[4] >0){
                            //         return 'style="background-color:#A4C368"'; // green
                            //     }
                            //
                            // },
                            // customColsAttribute : function(record,rn,grid){
                            //     grid.autoSelectFirstRow = false;
                            //
                            //     alert("Enter")
                            //     return 'style="background-color:#A4C368"'; // green
                            //     // if (record[4] >0){
                            //     //     return 'style="background-color:#A4C368"'; // green
                            //     // }
                            //
                            // },
                            columns: [
                                    {id: "recipientcode_EN", width: 150},
                                    {id: "donorcode_EN", width: 150},
                                    {id: "total_oda_value", width: 150, title: "tftasdvasud",getSortValue : function(value , record){
                                        return Number(value);
                                    }},
                                    {id: "ODA", width: 150, getSortValue : function(value , record){
                                        return Number(value);
                                    }},
                                    {id: "SHARE", width: 150, getSortValue : function(value , record){
                                        return Number(value);
                                    }}
                            ]
                        }
                    },

                      filterFor: {
                            "filter_all_subsectors": ['year', 'oda', 'recipientcode'],
                            "filter_faosubsectors": ['year', 'oda', 'recipientcode']
                        },

                        postProcess: [
                            {
                                "name": "filter",
                                "sid": [
                                    {
                                        "uid": "adam_resource_matrix_oda"
                                    }
                                ],
                                "parameters": {
                                    "columns": [
                                        "recipientcode",
                                        "donorcode",
                                        "value",
                                        "unitcode"
                                    ],
                                    "rows": {
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
                                        "year": {
                                            "time": [
                                                {
                                                    "from": Config.YEARSTART,
                                                    "to": Config.YEARFINISH
                                                }
                                            ]
                                        },
                                        "oda": {
                                            "enumeration": [
                                                "usd_commitment"
                                            ]
                                        }
                                    }
                                },
                                "rid": {
                                    "uid": "filter_all_subsectors"
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "recipientcode",
                                        "donorcode"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": [
                                                "value"
                                            ],
                                            "rule": "SUM"
                                        },
                                        {
                                            "columns": [
                                                "unitcode"
                                            ],
                                            "rule": "max"
                                        }
                                    ]
                                },
                                "rid": {
                                    "uid": "all_subsectors_sum"
                                }
                            },
                            {
                                "name": "addcolumn",
                                "parameters": {
                                    "column": {
                                        "dataType": "text",
                                        "id": "indicator",
                                        "key": true,
                                        "title": {
                                            "EN": "Indicator"
                                        },
                                        "domain": {
                                            "codes": [
                                                {
                                                    "extendedName": {
                                                        "EN": "Adam Processes"
                                                    },
                                                    "idCodeList": "adam_processes"
                                                }
                                            ]
                                        },
                                        "subject": null
                                    },
                                    "value": "Total ODA (mil $)"
                                },
                                "rid": {
                                    "uid": "total_oda"
                                }
                            },
                            {
                                "name": "filter",
                                "sid": [
                                    {
                                        "uid": "adam_resource_matrix_oda"
                                    }
                                ],
                                "parameters": {
                                    "columns": [
                                        "recipientcode",
                                        "donorcode",
                                        "value",
                                        "unitcode"
                                    ],
                                    "rows": {
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
                                        "year": {
                                            "time": [
                                                {
                                                    "from": Config.YEARSTART,
                                                    "to": Config.YEARFINISH
                                                }
                                            ]
                                        },
                                        "oda": {
                                            "enumeration": [
                                                "usd_commitment"
                                            ]
                                        },
                                        "fao_sector": {
                                            "enumeration": [
                                                "1"
                                            ]
                                        }
                                    }
                                },
                                "rid": {
                                    "uid": "filter_faosubsectors"
                                }
                            },
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "recipientcode",
                                        "donorcode"
                                    ],
                                    "aggregations": [
                                        {
                                            "columns": [
                                                "value"
                                            ],
                                            "rule": "SUM"
                                        },
                                        {
                                            "columns": [
                                                "unitcode"
                                            ],
                                            "rule": "max"
                                        }
                                    ]
                                }
                            },
                            {
                                "name": "addcolumn",
                                "parameters": {
                                    "column": {
                                        "dataType": "text",
                                        "id": "indicator",
                                        "key": true,
                                        "title": {
                                            "EN": "Indicator"
                                        },
                                        "domain": {
                                            "codes": [
                                                {
                                                    "extendedName": {
                                                        "EN": "Adam Processes"
                                                    },
                                                    "idCodeList": "adam_processes"
                                                }
                                            ]
                                        },
                                        "subject": null
                                    },
                                    "value": "ODA in FAO sectors (mil $)"
                                },
                                "rid": {
                                    "uid": "related_oda"
                                }
                            },
                            {
                                "name": "join",
                                "sid": [
                                    {
                                        "uid": "total_oda"
                                    },
                                    {
                                        "uid": "related_oda"
                                    }
                                ],
                                "parameters": {
                                    "joins": [
                                        [
                                            {
                                                "type": "id",
                                                "value": "recipientcode"
                                            },
                                            {
                                                "type": "id",
                                                "value": "donorcode"
                                            }
                                        ],
                                        [
                                            {
                                                "type": "id",
                                                "value": "recipientcode"
                                            },
                                            {
                                                "type": "id",
                                                "value": "donorcode"
                                            }
                                        ]
                                    ],
                                    "values": []
                                },
                                "rid": {
                                    "uid": "join_process"
                                }
                            },
                            {
                                "name": "addcolumn",
                                "parameters": {
                                    "column": {
                                        "dataType": "number",
                                        "id": "ODA",
                                        "key": true,
                                        "title": {
                                            "EN": "ODA to FAO-related sectors ($)"
                                        },
                                        "subject": null
                                    },
                                    "value": "@@direct related_oda_value"
                                }
                            },
                            {
                                "name": "addcolumn",
                                "parameters": {
                                    "column": {
                                        "dataType": "number",
                                        "id": "SHARE",
                                        "key": true,
                                        "title": {
                                            "EN": "Share (%)"
                                        },
                                        "subject": null
                                    },
                                    "value": "@@direct ( related_oda_value / total_oda_value )*100"
                                }
                            },
                            {
                                "name": "filter",
                                "parameters": {
                                    "columns": [
                                        "recipientcode",
                                        "donorcode",
                                        "total_oda_value",
                                        "ODA",
                                        "SHARE"
                                    ],
                                    "rows": {}
                                }
                            },
                            {
                                "name" : "select",
                                "parameters" : {
                                    "values" : {
                                        "recipientcode" : null,
                                        "donorcode" : null,
                                        "total_oda_value" : "round(total_oda_value::numeric,2)",
                                        "ODA" : "round(ODA::numeric,2)",
                                        "SHARE" : "round(SHARE::numeric,2)"
                                    }
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "donorcode_EN": "ASC"
                                }
                            }
                        ]
                    }
                ]
            }
       }


});