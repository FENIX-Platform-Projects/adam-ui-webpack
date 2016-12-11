/*global define*/

define(function () {

    'use strict';

    return {

        dashboard: {
            //default dataset id
            uid: "adam_priority_analysis",

            context: "BY_PARTNER",

            items: [
            {
                    id: "top-partners", // TOP 10 RECIPIENTS
                    type: 'chart',
                    config: {
                        type: "column",
                        x: ["donorcode_EN"], //x axis
                        series: ["indicator"], // series
                        y: ["value"],//Y dimension
                        aggregationFn: {"value": "sum"},
                        useDimensionLabelsIfExist: false,// || default raw else fenixtool

                        config: {
                            chart: {
                                marginTop: 50
                            },
                            subtitle: {
                                text: ''
                            }
                        }

                    },

                    filterFor: {
                        //  "filter_top_10": ['year', 'purposecode', 'recipientcode']
                        "filter_top_10": ['year', 'purposecode']
                    },

                    postProcess: [
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_priority_analysis"
                                }
                            ],
                            "parameters": {
                                "columns": [
                                    "donorcode",
                                    "value",
                                    "unitcode"
                                ],
                                "rows": {
                                    "purposecode": {
                                        "codes": [
                                            {
                                                "uid": "crs_purposes",
                                                "version": "2016",
                                                "codes": [
                                                    "99820"
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
                                    }
                                }
                            },
                            "rid": {"uid": "filter_top_10"}
                        },
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
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
                            }
                        },
                        {
                            "name": "order",
                            "parameters": {
                                "value": "DESC"
                            }
                        },
                        {
                            "name": "page",
                            "parameters": {
                                "perPage": 10,
                                "page": 1
                            },
                            "rid": {"uid": "top_10"}
                        },
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
                                "value": "ODA" // PART 1 FINAL INDICATOR NAME
                            },
                            "rid": {
                                "uid": "oda"
                            }
                        }

                    ]
                }, // TOP 10 PARTNERS
                {
                    id: "top-recipients", // TOP 10 RECIPIENTS
                    type: 'chart',
                    config: {
                        type: "column",
                        x: ["recipientcode_EN"], //x axis
                        series: ["indicator"], // series
                        y: ["value"],//Y dimension
                        aggregationFn: {"value": "sum"},
                        useDimensionLabelsIfExist: false,// || default raw else fenixtool

                        config: {
                            chart: {
                                marginTop: 50
                            },
                            subtitle: {
                                text: ''
                            }
                        }

                    },

                    filterFor: {
                        "filter_top_10_recipients": ['year', 'purposecode']
                    },

                    postProcess: [
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_priority_analysis"
                                }
                            ],
                            "parameters": {
                                "columns": [
                                    "recipientcode",
                                    "value",
                                    "unitcode"
                                ],
                                "rows": {
                                    "purposecode": {
                                        "codes": [
                                            {
                                                "uid": "crs_purposes",
                                                "version": "2016",
                                                "codes": [
                                                    "99820"
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
                                    }
                                }
                            },
                            "rid": {"uid": "filter_top_10_recipients"}
                        },
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "recipientcode"
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
                            }
                        },
                        {
                            "name": "order",
                            "parameters": {
                                "value": "DESC"
                            }
                        },
                        {
                            "name": "page",
                            "parameters": {
                                "perPage": 10,
                                "page": 1
                            },
                            "rid": {"uid": "top_10"}
                        },
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
                                "value": "ODA" // PART 1 FINAL INDICATOR NAME
                            },
                            "rid": {
                                "uid": "oda"
                            }
                        }

                    ]
                }, // TOP 10 RECIPIENTS

                {
                    id: "financing-priorities-partners",
                    type: 'chart',
                    config: {
                        type: "column",
                        x: ["purposecode_EN"], //x axis
                        series: ["filter_top_10_purposes_donors_donorcode_EN"], // series
                        y: ["value"],//Y dimension
                        aggregationFn: {"value": "sum"},
                        useDimensionLabelsIfExist: false,// || default raw else fenixtool

                        config: {
                            chart: {
                                marginTop: 50
                            },
                            subtitle: {
                                text: ''
                            },
                            plotOptions: {
                                column: {
                                    stacking: 'normal'
                                }
                            },
                            tooltip: {
                                formatter: function () {
                                    var unit = 'USD Mil';

                                    return '<b>' +
                                        this.series.name + '</b><br/>' +
                                        Highcharts.numberFormat(this.y, 2, '.', ',') + ' ' + unit;
                                }
                            },
                            exporting: {
                                buttons: {
                                    toggleDataLabelsButton: {
                                        enabled: false
                                    }
                                }
                            }
                        }
                    },

                    filterFor: {
                        "filter_top_10": ['year', 'purposecode'],
                        "filter_top_10_purposes": ['year']
                    },

                    postProcess: [
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_priority_analysis"
                                }
                            ],
                            "parameters": {
                                "columns": [
                                    "purposecode",
                                    "value"
                                ],
                                "rows": {
                                    "year": {
                                        "time": [
                                            {
                                                "from": "2000",
                                                "to": "2014"
                                            }
                                        ]
                                    },
                                    "purposecode": {
                                        "codes": [
                                            {
                                                "uid": "crs_purposes",
                                                "version": "2016",
                                                "codes": [
                                                    "31120",
                                                    "31130",
                                                    "41010",
                                                    "52010"
                                                ]
                                            }
                                        ]
                                    }
                                }
                            },
                            "rid": {
                                "uid": "filter_top_10"
                            }
                        },
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "purposecode"
                                ],
                                "aggregations": [
                                    {
                                        "columns": [
                                            "value"
                                        ],
                                        "rule": "SUM"
                                    }
                                ]
                            }
                        },
                        {
                            "name": "order",
                            "parameters": {
                                "value": "DESC"
                            }
                        },
                        {
                            "name": "page",
                            "parameters": {
                                "perPage": 10,
                                "page": 1
                            },
                            "rid": {
                                "uid": "top_10_purposes"
                            }
                        },
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_priority_analysis"
                                },
                                {
                                    "uid": "top_10_purposes"
                                }
                            ],
                            "parameters": {
                                "columns": [
                                    "purposecode",
                                    "donorcode",
                                    "value",
                                    "unitcode"
                                ],
                                "rows": {
                                    "purposecode": {
                                        "tables": [
                                            {
                                                "uid": "top_10_purposes",
                                                "column": "purposecode"
                                            }
                                        ]
                                    },
                                    "year": {
                                        "time": [
                                            {
                                                "from": "2000",
                                                "to": "2014"
                                            }
                                        ]
                                    }
                                }
                            },
                            "rid": {
                                "uid": "filter_top_10_purposes"
                            }
                        },
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "purposecode",
                                    "donorcode"
                                ],
                                "aggregations": [
                                    {
                                        "columns": [
                                            "value"
                                        ],
                                        "rule": "SUM"
                                    }
                                ]
                            }
                        },
                        {
                            "name": "addcolumn",
                            "parameters": {
                                "column": {
                                    "dataType": "number",
                                    "id": "rank",
                                    "title": {
                                        "EN": "Rank"
                                    },
                                    "subject": null
                                },
                                "value": "rank() over (partition by purposecode order by value DESC)"
                            }
                        },


                        {
                            "name": "filter",
                            "parameters": {
                                "columns": [
                                    "purposecode",
                                    "donorcode",
                                    "value",
                                    "rank",
                                    "unitcode"
                                ],
                                "rows": {
                                    "rank": {
                                        "number": [
                                            {
                                                "from": 1,
                                                "to": 10
                                            }
                                        ]
                                    }
                                }
                            },
                            "rid": {
                                "uid": "filter_top_10_purposes_donors"
                            }
                        },
                        {
                            "name": "group",
                            "sid":[{"uid":"filter_top_10_purposes_donors"}],
                            "parameters": {
                                "by": [
                                    "purposecode"

                                ],
                                "aggregations": [
                                    {
                                        "columns": [
                                            "value"
                                        ],
                                        "rule": "SUM"
                                    }
                                ]
                            },
                            "rid": {
                                "uid": "filter_aggregated_top10"
                            }
                        },
                        {
                            "name": "join",
                            "sid": [
                                {
                                    "uid": "filter_top_10_purposes_donors"
                                },
                                {
                                    "uid": "filter_aggregated_top10"
                                }
                            ],
                            "parameters": {
                                "joins": [
                                    [
                                        {
                                            "type": "id",
                                            "value": "purposecode"
                                        }

                                    ],
                                    [
                                        {
                                            "type": "id",
                                            "value": "purposecode"
                                        }

                                    ]
                                ],
                                "values": [
                                ]
                            }
                        },


                        {
                            "name": "addcolumn",
                            "parameters": {
                                "column": {
                                    "dataType": "number",
                                    "id": "value",
                                    "title": {
                                        "EN": "Value"
                                    },
                                    "subject":"value"


                                },
                                "value": "filter_top_10_purposes_donors_value"
                            }
                        },

                        {
                            "name": "order",
                            "parameters": {
                                "filter_aggregated_top10_value":"DESC",
                                "purposecode":"DESC",
                                "value": "DESC"
                            }
                        },
                        {
                            "name": "filter",
                            "parameters": {
                                "columns": [
                                    "purposecode",
                                    "filter_top_10_purposes_donors_donorcode",
                                    "value",
                                    "unitcode"
                                ],
                                "rows": {
                                }
                            }
                        }

                    ]
                }, // BY TOP 10 RESOURCE PARTNERS
                {
                    id: "financing-priorities-recipients",
                    type: 'chart',
                    config: {
                        type: "column",
                        x: ["purposecode_EN"], //x axis
                        series: ["filter_top_10_purposes_recipients_recipientcode_EN"], // series
                        y: ["value"],//Y dimension
                        aggregationFn: {"value": "sum"},
                        useDimensionLabelsIfExist: false,// || default raw else fenixtool

                        config: {
                            chart: {
                                marginTop: 50
                            },
                            subtitle: {
                                text: ''
                            },
                            plotOptions: {
                                column: {
                                    stacking: 'normal'
                                }
                            },
                            tooltip: {
                                formatter: function () {
                                    var unit = 'USD Mil';

                                    return '<b>' +
                                        this.series.name + '</b><br/>' +
                                        Highcharts.numberFormat(this.y, 2, '.', ',') + ' ' + unit;
                                }
                            },
                            exporting: {
                                buttons: {
                                    toggleDataLabelsButton: {
                                        enabled: false
                                    }
                                }
                            }
                        }
                    },

                    filterFor: {
                        "filter_top_10": ['year', 'purposecode'],
                        "filter_top_10_purposes": ['year']
                    },

                    postProcess: [
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_priority_analysis"
                                }
                            ],
                            "parameters": {
                                "columns": [
                                    "purposecode",
                                    "value"
                                ],
                                "rows": {
                                    "year": {
                                        "time": [
                                            {
                                                "from": "2000",
                                                "to": "2014"
                                            }
                                        ]
                                    },
                                    "purposecode": {
                                        "codes": [
                                            {
                                                "uid": "crs_purposes",
                                                "version": "2016",
                                                "codes": [
                                                    "31120",
                                                    "31130",
                                                    "41010",
                                                    "52010"
                                                ]
                                            }
                                        ]
                                    }
                                }
                            },
                            "rid": {
                                "uid": "filter_top_10"
                            }
                        },
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "purposecode"
                                ],
                                "aggregations": [
                                    {
                                        "columns": [
                                            "value"
                                        ],
                                        "rule": "SUM"
                                    }
                                ]
                            }
                        },
                        {
                            "name": "order",
                            "parameters": {
                                "value": "DESC"
                            }
                        },
                        {
                            "name": "page",
                            "parameters": {
                                "perPage": 10,
                                "page": 1
                            },
                            "rid": {
                                "uid": "top_10_purposes"
                            }
                        },
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_priority_analysis"
                                },
                                {
                                    "uid": "top_10_purposes"
                                }
                            ],
                            "parameters": {
                                "columns": [
                                    "purposecode",
                                    "recipientcode",
                                    "value",
                                    "unitcode"
                                ],
                                "rows": {
                                    "purposecode": {
                                        "tables": [
                                            {
                                                "uid": "top_10_purposes",
                                                "column": "purposecode"
                                            }
                                        ]
                                    },
                                    "year": {
                                        "time": [
                                            {
                                                "from": "2000",
                                                "to": "2014"
                                            }
                                        ]
                                    }
                                }
                            },
                            "rid": {
                                "uid": "filter_top_10_purposes"
                            }
                        },
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "purposecode",
                                    "recipientcode"
                                ],
                                "aggregations": [
                                    {
                                        "columns": [
                                            "value"
                                        ],
                                        "rule": "SUM"
                                    }
                                ]
                            }
                        },
                        {
                            "name": "addcolumn",
                            "parameters": {
                                "column": {
                                    "dataType": "number",
                                    "id": "rank",
                                    "title": {
                                        "EN": "Rank"
                                    },
                                    "subject": null
                                },
                                "value": "rank() over (partition by purposecode order by value DESC)"
                            }
                        },


                        {
                            "name": "filter",
                            "parameters": {
                                "columns": [
                                    "purposecode",
                                    "recipientcode",
                                    "value",
                                    "rank",
                                    "unitcode"
                                ],
                                "rows": {
                                    "rank": {
                                        "number": [
                                            {
                                                "from": 1,
                                                "to": 10
                                            }
                                        ]
                                    }
                                }
                            },
                            "rid": {
                                "uid": "filter_top_10_purposes_recipients"
                            }
                        },
                        {
                            "name": "group",
                            "sid":[{"uid":"filter_top_10_purposes_recipients"}],
                            "parameters": {
                                "by": [
                                    "purposecode"

                                ],
                                "aggregations": [
                                    {
                                        "columns": [
                                            "value"
                                        ],
                                        "rule": "SUM"
                                    }
                                ]
                            },
                            "rid": {
                                "uid": "filter_aggregated_top10"
                            }
                        },
                        {
                            "name": "join",
                            "sid": [
                                {
                                    "uid": "filter_top_10_purposes_recipients"
                                },
                                {
                                    "uid": "filter_aggregated_top10"
                                }
                            ],
                            "parameters": {
                                "joins": [
                                    [
                                        {
                                            "type": "id",
                                            "value": "purposecode"
                                        }

                                    ],
                                    [
                                        {
                                            "type": "id",
                                            "value": "purposecode"
                                        }

                                    ]
                                ],
                                "values": [
                                ]
                            }
                        },


                        {
                            "name": "addcolumn",
                            "parameters": {
                                "column": {
                                    "dataType": "number",
                                    "id": "value",
                                    "title": {
                                        "EN": "Value"
                                    },
                                    "subject":"value"


                                },
                                "value": "filter_top_10_purposes_recipients_value"
                            }
                        },

                        {
                            "name": "order",
                            "parameters": {
                                "filter_aggregated_top10_value":"DESC",
                                "purposecode":"DESC",
                                "value": "DESC"
                            }
                        },
                        {
                            "name": "filter",
                            "parameters": {
                                "columns": [
                                    "purposecode",
                                    "filter_top_10_purposes_recipients_recipientcode",
                                    "value",
                                    "unitcode"
                                ],
                                "rows": {
                                }
                            }
                        }

                    ]
                }
            ]
        }
    }


});