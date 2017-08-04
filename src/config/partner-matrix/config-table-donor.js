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
                           //  "groupedRow":false,
                           //  //"aggregationFn":{"value":"sum"},
                           //  "formatter":"localstring",
                           // // "decimals":2,
                           // // "pageSize": "150",
                           //  "showRowHeaders":true,
                           //  "columns":["indicator"],
                           //  "rows":["donorcode", "recipientcode"],
                           //  "aggregations":[],
                           //  "values":["value"],

                            "groupedRow": false,
                            "formatter": "localstring",
                            "aggregationFn":{"value":"sum"},
                            "showRowHeaders": true,
                            "rows": ["recipientcode_EN", "donorcode_EN", "tot_val", "ODA", "SHARE"],
                            "aggregations": [],

                            inputFormat : "fenixtool",

                            config: {
                                pageSize: 150,
                                autoSelectFirstRow: false,
                                columns: [
                                    {id: "donorcode", width: 150},
                                    {id: "recipientcode", width: 150},
                                    {id: "tot_val", width: 150, getSortValue : function(value , record){
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
                            "filter_all_subsectors": ['year', 'oda', 'donorcode'],
                            "filter_faosubsectors": ['year', 'oda', 'donorcode']
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
                                "sid": [
                                    {
                                        "uid": "join_process"
                                    }
                                ],
                                "parameters": {
                                    "column": {
                                        "dataType": "number",
                                        "id": "SHARE",
                                        "title": {
                                            "EN": "FAO Sector (%)"
                                        },
                                        "subject": null
                                    },
                                    "value": {
                                        "keys": [
                                            "1 = 1"
                                        ],
                                        "values": [
                                            "@@direct ( related_oda_value / total_oda_value )*100"
                                        ]
                                    }
                                }
                            },
                            {
                                "name": "addcolumn",
                                "parameters": {
                                    "column": {
                                        "dataType": "number",
                                        "id": "ODA",
                                        "title": {
                                            "EN": "ODA in FAO sector (MIL $)"
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
                                        "id": "tot_val",
                                        "subject":"value",
                                        "title": {
                                            "EN": "Total ODA (mil $)"
                                        }
                                    },
                                    "value": "@@direct total_oda_value"
                                }
                            },



                            {
                                "name": "filter",
                                "parameters": {
                                    "columns": [
                                        "recipientcode",
                                        "donorcode",
                                        "tot_val",
                                        "ODA",
                                        "SHARE"
                                    ],
                                    "rows": {}
                                },
                                "rid": {
                                    "uid": "percentage_oda"
                                }
                            },
                            {
                                "name" : "select",
                                "parameters" : {
                                    "values" : {
                                        "recipientcode" : null,
                                        "donorcode" : null,
                                        "tot_val" : "round(tot_val::numeric,2)",
                                        "ODA" : "round(ODA::numeric,2)",
                                        "SHARE" : "round(SHARE::numeric,2)"
                                    }
                                }
                            },
                            {
                                "name": "order",
                                "parameters": {
                                    "recipientcode_EN": "ASC"
                                }
                            }
                        ]
                    }
                ]
            }
       }


});