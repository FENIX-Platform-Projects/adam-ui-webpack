/*global define*/

define(function () {

    'use strict';

    return {
            dashboard: {
                //default dataset id
                uid: "adam_combined_priorities_table",

                items: [
                {
                        id: 'venn-diagram',
                        type: 'chart',
                        config: {
                            type: "venn",
                            renderer: "jvenn",
                            x: ["purposecode"], //x axis and series
                            series: ["indicator"], // series
                            y: ["purposecode_EN"],//Y dimension
                            aggregationFn: {"value": "sum"},
                            useDimensionLabelsIfExist: false// || default raw else fenixtool

                        },

                        filterFor: {
                            "filter_partner": ['donorcode']
                        },
                        postProcess: [
                            {
                                "name": "union",
                                "sid": [
                                    {
                                        "uid": "recipient" // RESULT OF PART 1: ALL UNDAF PRIORITIES
                                    },
                                    {
                                        "uid": "fao" // RESULT OF PART 2: ALL FAO PRIORITIES
                                    },
                                    {
                                        "uid":"partner" // RESULT OF PART 3: SELECTED RESOURCE PARTNER PRIORITIES
                                    }

                                ],
                                "parameters": {
                                },
                                "rid":{"uid":"union_process"}

                            },  // PART 4: UNION is the FINAL PART IN THE PROCESS
                            {
                                "name": "filter",
                                "sid": [
                                    {
                                        "uid": "adam_combined_priorities_table"
                                    }
                                ],
                                "parameters": {
                                    "columns": [
                                        "typecode",
                                        "purposecode"
                                    ],
                                    "rows": {
                                        "typecode": {
                                            "enumeration": [
                                                "recipient"
                                            ]
                                        }
                                    }
                                },
                                "rid":{"uid":"filter_recipient"}
                            }, // PART 1: ALL UNDAF PRIORITIES: (2i) Filter
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "typecode",
                                        "purposecode"
                                    ],
                                    "aggregations": [
                                    ]
                                },
                                "rid":{"uid":"total_ODA"}

                            }, // (1ii): ALL UNDAF PRIORITIES: Group by
                            {
                                "name": "addcolumn",
                                "parameters": {
                                    "column": {
                                        "dataType": "text",
                                        "id": "indicator",
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
                                    "value": "Countries (All)" // PART 1 FINAL INDICATOR NAME
                                },
                                "rid": {
                                    "uid": "recipient"
                                }
                            }, // (1iii): ALL UNDAF PRIORITIES: Add Column
                            {
                                "name": "filter",
                                "sid": [
                                    {
                                        "uid": "adam_combined_priorities_table"
                                    }
                                ],
                                "parameters": {
                                    "columns": [
                                        "typecode",
                                        "purposecode"
                                    ],
                                    "rows": {
                                        "typecode": {
                                            "enumeration": [
                                                "fao"
                                            ]
                                        }
                                    }
                                },
                                "rid":{"uid":"filter_fao"}

                            }, // PART 2: ALL FAO PRIORITIES: (2i) Filter
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "typecode",
                                        "purposecode"
                                    ],
                                    "aggregations": [
                                    ]
                                }

                            }, // (2ii): ALL FAO PRIORITIES: Group by
                            {
                                "name": "addcolumn",
                                "parameters": {
                                    "column": {
                                        "dataType": "text",
                                        "id": "indicator",
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
                                    "value": "FAO (All)" // PART 2 FINAL INDICATOR NAME
                                },
                                "rid":{"uid":"fao"}
                            }, // (2iii): ALL FAO PRIORITIES: Add Column
                            {
                                "name": "filter",
                                "sid": [
                                    {
                                        "uid": "adam_combined_priorities_table"
                                    }
                                ],
                                "parameters": {
                                    "columns": [
                                        "typecode",
                                        "purposecode"
                                    ],
                                    "rows": {
                                        "typecode": {
                                            "enumeration": [
                                                "partner"
                                            ]
                                        },
                                        "donorcode": {
                                            "codes": [
                                                {
                                                    "uid": "crs_donors",
                                                    "version": "2016",
                                                    "codes": [
                                                        "1" // Donor
                                                    ]
                                                }
                                            ]
                                        }
                                    }
                                },
                                "rid":{"uid":"filter_partner"}

                            }, // PART 3: SELECTED RESOURCE PARTNER PRIORITIES: (2i) Filter
                            {
                                "name": "group",
                                "parameters": {
                                    "by": [
                                        "typecode",
                                        "purposecode"
                                    ],
                                    "aggregations": [
                                    ]
                                }

                            }, // (3ii): SELECTED RESOURCE PARTNER PRIORITIES: Group by
                            {
                                "name": "addcolumn",
                                "parameters": {
                                    "column": {
                                        "dataType": "text",
                                        "id": "indicator",
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
                                    "value": "Partners (Austria)" // PART 3 FINAL INDICATOR NAME
                                },
                                "rid":{"uid":"partner"}
                            }// (3iii): ALL RESOURCE PARTNER PRIORITIES: Add Column
                        ]
                    }
                ]
            }
       }


});