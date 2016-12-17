/*global define*/

define(function () {

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
                            "groupedRow":false,
                            "aggregationFn":{"value":"sum"},
                            "formatter":"localstring",
                            "decimals":2,
                            "pageSize": "150",
                            "showRowHeaders":true,
                            "columns":["indicator"],
                            "rows":["recipientcode_EN", "donorcode_EN"],
                            "aggregations":[],
                            "values":["value"],
                            inputFormat : "fenixtool",

                            config: {
                                pageSize: 150,
                                autoSelectFirstRow: false,
                                columns: [
                                    {id: "recipientcode_EN", width: 200},
                                    {id: "donorcode_EN", width: 150},
                                    {id: "indicator", width: 150, getSortValue : function(value , record){
                                        return Number(value);
                                    }},
                                    {id: "indicator", width: 200, getSortValue : function(value , record){
                                        return Number(value);
                                    }},
                                    {id: "indicator", width: 200, getSortValue : function(value , record){
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
                                "name": "union",
                                "sid": [
                                    {
                                        "uid": "total_oda"
                                    },
                                    {
                                        "uid": "related_oda"
                                    },
                                    {
                                        "uid":"percentage_oda"
                                    }

                                ],
                                "parameters": {
                                },
                                "rid":{"uid":"union_process"}

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
                                                    "from": 2000,
                                                    "to": 2014
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
                                "rid":{"uid":"filter_all_subsectors"}
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
                                                    "from": 2000,
                                                    "to": 2014
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
                                "rid":{"uid":"filter_faosubsectors"}
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
                                            "rule": "first"
                                        }
                                    ]
                                }},
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
                                    "values": [
                                    ]
                                },
                                "rid":{"uid":"join_process"}
                            },
                            {
                                "name": "addcolumn",
                                "sid":[{"uid":"join_process"}],
                                "parameters": {
                                    "column": {
                                        "dataType": "number",
                                        "id": "value",
                                        "title": {
                                            "EN": "FAO Sector (%)"
                                        },
                                        "subject": null
                                    },
                                    "value": {
                                        "keys":  ["1 = 1"],
                                        "values":[" ( related_oda_value / total_oda_value )*100"]

                                    }
                                }
                            },
                            {
                                "name": "addcolumn",
                                "parameters": {
                                    "column": {
                                        "id": "unitcode",
                                        "title": {
                                            "EN": "Measurement Unit"
                                        },
                                        "domain": {
                                            "codes": [{
                                                "idCodeList": "crs_units",
                                                "version": "2016",
                                                "level": 1
                                            }]
                                        },
                                        "dataType": "code",
                                        "subject": null
                                    },
                                    "value": "percentage"
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
                                    "value": "FAO Sectors (%)"
                                }

                            },

                            {
                                "name": "filter",
                                "parameters": {
                                    "columns": [
                                        "recipientcode",
                                        "donorcode",
                                        "value",
                                        "unitcode",
                                        "indicator"
                                    ],
                                    "rows": {
                                    }
                                },
                                "rid": {
                                    "uid": "percentage_oda"
                                }
                            }
                        ]
                    }
                ]
            }
       }


});