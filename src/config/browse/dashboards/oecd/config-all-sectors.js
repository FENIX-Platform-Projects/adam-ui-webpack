/*global define*/

define(['highcharts','../../../config-base'],function (Highcharts, Config) {

    'use strict';
    return {
        id: 'OTHER_SECTORS',
        type: 'ALL',
        filter: {
            parentsector_code: {
                selector: {
                    id: "dropdown",
                    default: ["all"],
                    emptyOption : {
                        enabled: true,
                        text: "All",
                        value: "all"
                    },
                    config: { //Selectize configuration
                        maxItems: 1
                    }
                },
                classNames: "col-xs-3",
                cl: {
                    uid: "crs_dac",
                    version: "2016",
                    level: 1,
                    levels: 1
                },
                template: {
                    hideSwitch: true,
                    hideRemoveButton: true
                }
            },
            purposecode: {
                selector: {
                    id: "dropdown",
                    default: ["all"],
                    emptyOption : {
                        enabled: true,
                        text: "All",
                        value: "all"
                    },
                    config: { //Selectize configuration
                        maxItems: 1
                    }
                },
                classNames: "col-xs-5",
                cl: {
                    "uid": "crs_dac",
                    "version": "2016",
                    "levels": 3
                },
                template: {
                    hideSwitch: true,
                    hideRemoveButton: true
                },
                dependencies: {
                    "parentsector_code": {id: "parent", event: "select", args: {
                        body: {
                            levels: 3
                        },
                        exclude: ["all"]
                    }}
                }
            },
            "year-from": {
                selector: {
                    id: "dropdown",
                    from: Config.YEARSTART,
                    to: Config.YEARFINISH,
                    default: [Config.YEARSTART],
                    config: { //Selectize configuration
                        maxItems: 1
                    }
                },
                classNames: "col-xs-2",
                format: {
                    type: "static",
                    output: "time"
                },
                template: {
                    hideSwitch: true,
                    hideRemoveButton: true
                }
            },
            "year-to": {
                selector: {
                    id: "dropdown",
                    from: Config.YEARSTART,
                    to: Config.YEARFINISH,
                    default: [Config.YEARFINISH],
                    config: {
                        maxItems: 1
                    }
                },
                classNames: "col-xs-2",
                format: {
                    type: "static",
                    output: "time"
                },
                dependencies: {
                    "year-from": {id: "min", event: "select"}
                },
                template: {
                    hideSwitch: true,
                    hideRemoveButton: true
                }
            },
            oda: {
                selector: {
                    id: "dropdown",
                    default: ['usd_commitment'],
                    config: { //Selectize configuration
                        maxItems: 1
                    }
                },
                classNames: "col-xs-4",
                cl: {
                    uid: "oda_crs",
                    version: "2016"
                },
                template: {
                    hideHeaderIcon: false,
                    headerIconClassName: 'glyphicon glyphicon-info-sign',
                    hideSwitch: true,
                    hideRemoveButton: true
                }
            }
        },
        dashboard: {
            //default dataset id
            uid: "adam_browse_sector_oda",
            items: [
                {
                    id: "tot-oda", //ref [data-item=':id']
                    type: "chart", //chart || map || olap,
                    config: {
                        type: "line",
                        x: ["year"], //x axis
                        series: ["indicator"], // series
                        y: ["value"],//Y dimension
                        aggregationFn: {"value": "sum"},
                        useDimensionLabelsIfExist: false,// || default raw else fenixtool

                        config: {
                            chart: {
                                events: {
                                    load: function(event) {
                                        var _that = this;

                                        if (this.options.chart.forExport) {
                                            this.xAxis[0].update({
                                                categories: this.xAxis[0].categories,
                                                labels: {
                                                    style: {
                                                        width: '50px',
                                                        fontSize: '7px'
                                                    },
                                                    step: 1
                                                }
                                            }, false);


                                            $.each(this.yAxis, function (i, y) {
                                                y.update({
                                                    title: {
                                                        style: {
                                                            fontSize: '8px'
                                                        }
                                                    },
                                                    labels: {
                                                        style: {
                                                            fontSize: '7px'
                                                        }
                                                    }
                                                }, false);
                                            });

                                            $.each(this.series, function (i, serie) {
                                                if(!serie.visible){
                                                    serie.update({
                                                        showInLegend: false
                                                    })
                                                } else {
                                                    if(serie.options.dataLabels.enabled){
                                                        serie.update({
                                                            marker : {
                                                                radius: 2
                                                            },
                                                            dataLabels: {
                                                                enabled: true,
                                                                style: {
                                                                    fontSize: '7px'
                                                                }
                                                            }
                                                        })
                                                    } else {
                                                        serie.update({
                                                            marker: {
                                                                radius: 2
                                                            }
                                                        })
                                                    }
                                                }
                                            });

                                            this.redraw();
                                        }
                                    }
                                }
                            },
                            xAxis: {
                                type: 'datetime'
                            }
                        }
                    },

                    filterFor: {
                        "filter_total_ODA": ['year', 'oda']
                    },

                    postProcess: [
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_browse_sector_oda"
                                }
                            ],
                            "parameters": {
                                "columns": [
                                    "year",
                                    "value",
                                    "unitcode"
                                ],
                                "rows": {
                                    "oda": {
                                        "codes": [
                                            {
                                                "uid": "oda_crs",
                                                "version": "2016",
                                                "codes": [
                                                    "usd_commitment"
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
                                    }
                                }
                            },
                            "rid":{"uid":"filter_total_ODA"}
                        },
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "year"
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
                                "uid": "total_oda"
                            }
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
                                "value": "ODA"
                            }
                        }
                    ]
                },
                {
                    id: "top-recipients-all-sectors", //ref [data-item=':id']
                    type: 'chart',
                    config: {
                        type: "column",
                        x: ["recipientcode"], //x axis
                        series: ["flowcategory"], // series
                        y: ["value"],//Y dimension
                        aggregationFn: {"value": "sum"},
                        useDimensionLabelsIfExist: true,// || default raw else fenixtool

                        config: {
                            colors: ['#008080'],
                            legend: {
                                title: {
                                    text: null
                                }
                            },
                            plotOptions: {
                                column: {
                                    events: {
                                        legendItemClick: function () {
                                            return false;
                                        }
                                    }
                                },
                                allowPointSelect: false
                            }
                        }

                    },

                    filterFor: {
                        "filter_top_10_recipients_sum": ['year', 'oda']
                    },

                    postProcess: [
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_browse_sector_recipient"
                                }
                            ],
                            "parameters": {
                                "columns": [
                                    "recipientcode",
                                    "value",
                                    "flowcategory"
                                ],
                                "rows": {
                                    "!recipientcode": {
                                        "codes": [
                                            {
                                                "uid": "crs_recipients", // skipping regional recipient countries (e.g. "Africa, regional"; "North of Sahara, regional")
                                                "version": "2016",
                                                "codes": [
                                                    "298", "498", "798", "89", "589", "889", "189", "289","389", "380", "489", "789","689", "619", "679",
                                                    "NA"
                                                ]
                                            }
                                        ]
                                    },
                                    "oda": {
                                        "codes": [
                                            {
                                                "uid": "oda_crs",
                                                "version": "2016",
                                                "codes": [
                                                    "usd_commitment"
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
                                    }
                                }
                            },
                            "rid":{"uid":"filter_top_10_recipients_sum"}
                        },
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "recipientcode", "flowcategory"
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
                                            "flowcategory"
                                        ],
                                        "rule": "max"
                                    }
                                ]
                            }
                        },
                        {
                            "name": "order",
                            "parameters": {
                                "value": "DESC"
                            },
                            "rid":{"uid":"filtered_dataset"}
                        },
                        {
                            "name": "page",
                            "parameters": {
                                "perPage": 10,
                                "page": 1
                            }
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
                                "value": "ODA"
                            }
                        }
                    ]
                },
                {
                    id: "top-partners-all-sectors", //ref [data-item=':id']
                    type: 'chart',
                    config: {
                        type: "column",
                        x: ["donorcode"], //x axis
                        series: ["flowcategory"], // series
                        y: ["value"],//Y dimension
                        aggregationFn: {"value": "sum"},
                        useDimensionLabelsIfExist: true,// || default raw else fenixtool

                        config: {
                            colors: ['#008080'],
                            legend: {
                                title: {
                                    text: null
                                }
                            },
                            plotOptions: {
                                column: {
                                    events: {
                                        legendItemClick: function () {
                                            return false;
                                        }
                                    }
                                },
                                allowPointSelect: false
                            }
                        }

                    },

                    filterFor: {
                        "filter_top_10_partners_sum": ['year', 'oda']
                    },

                    postProcess: [
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_browse_sector_oda"
                                }
                            ],
                            "parameters": {
                                "columns": [
                                    "donorcode",
                                    "value",
                                    "flowcategory"
                                ],
                                "rows": {
                                    "!donorcode": {
                                        "codes": [
                                            {
                                                "uid": "crs_donors",
                                                "version": "2016",
                                                "codes": [
                                                    "NA"
                                                ]
                                            }
                                        ]
                                    },
                                    "oda": {
                                        "codes": [
                                            {
                                                "uid": "oda_crs",
                                                "version": "2016",
                                                "codes": [
                                                    "usd_commitment"
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
                                    }
                                }
                            },
                            "rid":{"uid":"filter_top_10_partners_sum"}
                        },
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "donorcode", "flowcategory"
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
                                    },
                                    {
                                        "columns": [
                                            "flowcategory"
                                        ],
                                        "rule": "max"
                                    }
                                ]
                            }
                        },
                        {
                            "name": "order",
                            "parameters": {
                                "value": "DESC"
                            },
                            "rid":{"uid":"filtered_dataset"}
                        },
                        {
                            "name": "page",
                            "parameters": {
                                "perPage": 10,
                                "page": 1
                            }
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
                                "value": "ODA"
                            }
                        }
                    ]
                },
                {
                    id: 'top-channels-all-sectors', // TOP CHANNEL OF DELIVERY CATEGORIES
                    type: 'chart',
                    config: {
                        type: "column",
                        x: ["channelsubcategory_code"], //x axis
                        series: ["flowcategory"], // series
                        y: ["value"],//Y dimension
                        aggregationFn: {"value": "sum"},
                        useDimensionLabelsIfExist: true,// || default raw else fenixtool

                        config: {
                            colors: ['#56adc3'],
                            legend: {
                                title: {
                                    text: null
                                }
                            },
                            plotOptions: {
                                column: {
                                    events: {
                                        legendItemClick: function () {
                                            return false;
                                        }
                                    }
                                },
                                allowPointSelect: false
                            }
                        }

                    },

                    filterFor: {
                        "filter_top_10_channels_sum": ['year', 'oda']
                    },

                    postProcess: [
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_browse_sector_subcategory"
                                }
                            ],
                            "parameters": {
                                "columns": [
                                    "channelsubcategory_code",
                                    "value",
                                    "flowcategory"
                                ],
                                "rows": {
                                    "!flowcategory": {
                                        "codes": [
                                            {
                                                "uid": "crs_flow_types",
                                                "version": "2016",
                                                "codes": [
                                                    "NA"
                                                ]
                                            }
                                        ]
                                    },
                                    "oda": {
                                        "codes": [
                                            {
                                                "uid": "oda_crs",
                                                "version": "2016",
                                                "codes": [
                                                    "usd_commitment"
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
                                    }
                                }
                            },
                            "rid":{"uid":"filter_top_10_channels_sum"}
                        },
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "channelsubcategory_code","flowcategory"
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
                            "name": "order",
                            "parameters": {
                                "value": "DESC"
                            },
                            "rid":{"uid":"filtered_dataset"}
                        },
                        {
                            "name": "page",
                            "parameters": {
                                "perPage": 10,
                                "page": 1
                            }
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
                                "value": "ODA"
                            }
                        }
                    ]
                },
                {
                    id: "top-sectors", //ref [data-item=':id']
                    type: 'chart',
                    config: {
                        type: "column",
                        x: ["parentsector_code"], //x axis
                        series: ["flowcategory"], // series
                        y: ["value"],//Y dimension
                        aggregationFn: {"value": "sum"},
                        useDimensionLabelsIfExist: true,// || default raw else fenixtool

                        config: {
                            colors: ['#008080'],
                            legend: {
                                title: {
                                    text: null
                                }
                            },
                            plotOptions: {
                                column: {
                                    events: {
                                        legendItemClick: function () {
                                            return false;
                                        }
                                    }
                                },
                                allowPointSelect: false
                            }
                        }

                    },

                    filterFor: {
                        "filter_top_10_sectors_sum": ['year', 'oda']
                    },

                    postProcess: [
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_browse_sector_oda"
                                }
                            ],
                            "parameters": {
                                "columns": [
                                    "parentsector_code",
                                    "value",
                                    "flowcategory"
                                ],
                                "rows": {
                                    "!parentsector_code": {
                                        "codes": [
                                            {
                                                "uid": "crs_dac",
                                                "version": "2016",
                                                "codes": [
                                                    "NA"
                                                ]
                                            }
                                        ]
                                    },
                                    "oda": {
                                        "codes": [
                                            {
                                                "uid": "oda_crs",
                                                "version": "2016",
                                                "codes": [
                                                    "usd_commitment"
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
                                    }
                                }
                            },
                            "rid":{"uid":"filter_top_10_sectors_sum"}
                        },
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "parentsector_code", "flowcategory"
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
                                    },
                                    {
                                        "columns": [
                                            "flowcategory"
                                        ],
                                        "rule": "max"
                                    }
                                ]
                            }
                        },
                        {
                            "name": "order",
                            "parameters": {
                                "value": "DESC"
                            },
                            "rid":{"uid":"filtered_dataset"}
                        },
                        {
                            "name": "page",
                            "parameters": {
                                "perPage": 10,
                                "page": 1
                            }
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
                                "value": "ODA"
                            }
                        }
                    ]
                },
                {
                    id: 'top-subsectors', // TOP SUB SECTORS
                    type: 'chart',
                    config: {
                        type: "pieold",
                        x: ["purposecode"], //x axis and series
                        series: ["flowcategory"], // series
                        y: ["value"],//Y dimension
                        aggregationFn: {"value": "sum"},
                        useDimensionLabelsIfExist: true,// || default raw else fenixtool

                        config: {
                            chart: {
                                events: {
                                    load: function (event) {
                                        if (this.options.chart.forExport) {
                                            $.each(this.series, function (i, serie) {
                                                serie.update({
                                                    dataLabels: {
                                                        enabled: false
                                                    }
                                                }, false);
                                            });
                                            this.redraw();
                                        }
                                    }
                                }

                            },
                            tooltip: {
                                style: {width: '200px', whiteSpace: 'normal'},
                                formatter: function () {
                                    var val = this.y;
                                    if (val.toFixed(0) < 1) {
                                        val = (val * 1000).toFixed(2) + ' K'
                                    } else {
                                        val = val.toFixed(2) + ' USD Mil'
                                    }

                                    return '<b>' + this.percentage.toFixed(2) + '% (' + val + ')</b>';
                                }
                            },
                            exporting: {
                                buttons: {
                                    toggleDataLabelsButton: {
                                        enabled: false
                                    }
                                },
                                chartOptions: {
                                    legend: {
                                        title: '',
                                        enabled: true,
                                        align: 'center',
                                        layout: 'vertical',
                                        useHTML: true,
                                        labelFormatter: function () {
                                            var val = this.y;
                                            if (val.toFixed(0) < 1) {
                                                val = (val * 1000).toFixed(2) + ' K'
                                            } else {
                                                val = val.toFixed(2) + ' USD Mil'
                                            }

                                            return '<div style="width:200px"><span style="float:left;  font-size:9px">' + this.name.trim() + ': ' + this.percentage.toFixed(2) + '% (' + val + ')</span></div>';
                                        }
                                    }
                                }
                            }
                        }

                    },
                    filterFor: {
                        "filter_top_10_subsectors_sum": ['year', 'oda']
                    },

                    postProcess: [
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_browse_sector_oda"
                                }
                            ],
                            "parameters": {
                                "columns": [
                                    "purposecode",
                                    "value",
                                    "flowcategory"
                                ],
                                "rows": {
                                    "!purposecode": {
                                        "codes": [
                                            {
                                                "uid": "crs_purposes",
                                                "version": "2016",
                                                "codes": [
                                                    "NA"
                                                ]
                                            }
                                        ]
                                    },
                                    "oda": {
                                        "codes": [
                                            {
                                                "uid": "oda_crs",
                                                "version": "2016",
                                                "codes": [
                                                    "usd_commitment"
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
                                    }
                                }
                            },
                            "rid":{"uid":"filter_top_10_subsectors_sum"}
                        },
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "purposecode", "flowcategory"
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
                                            "flowcategory"
                                        ],
                                        "rule": "max"
                                    }
                                ]
                            }
                        },
                        {
                            "name": "order",
                            "parameters": {
                                "value": "DESC"
                            },
                            "rid":{"uid":"filtered_dataset"}
                        },
                        {
                            "name": "page",
                            "parameters": {
                                "perPage": 10,
                                "page": 1
                            }
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
                                "value": "ODA"
                            }
                        }
                    ]
                },
                {
                    id: 'oda-regional', // REGIONAL DISTRIBUTION
                    type: 'chart',
                    config: {
                        type: "column",
                        x: ["unitcode"], //x axis
                        series: ["fao_region"], // series
                        y: ["value"],//Y dimension
                        aggregationFn: {"value": "sum"},
                        useDimensionLabelsIfExist: true,// || default raw else fenixtool

                        config: {
                            chart: {
                                inverted: true
                            },
                            plotOptions: {
                                series: {
                                    stacking: 'percent',
                                    dataLabels: {
                                        enabled: true,
                                        color: 'white',
                                        style: {
                                            fontWeight: 'normal',
                                            textShadow: '0'
                                        },
                                        formatter: function () {
                                            var percent = Math.round(this.point.percentage);
                                            if (percent > 0)
                                                return Math.round(this.point.percentage) + '%';
                                            else
                                                return this.point.percentage.toFixed(2) + '%';
                                        }
                                    }
                                },
                                column: {
                                    minPointLength: 5
                                }
                            },
                            exporting: {
                                buttons: {
                                    toggleDataLabelsButton: {
                                        enabled: false
                                    }
                                },
                                chartOptions: {
                                    legend: {
                                        title: '',
                                        enabled: true,
                                        useHTML: true,
                                        labelFormatter: function () {
                                            return '<div><span>' + this.name + ' (' + this.yData + ' USD Mil)</span></div>';
                                        }
                                    }
                                }
                            },
                            yAxis: {
                                min: 0,
                                title: {
                                    text: '%',
                                    align: 'high'
                                }
                            },
                            xAxis: {
                                labels: {
                                    enabled: false
                                }
                            },
                            tooltip: {
                                formatter: function () {
                                    var percent = Math.round(this.point.percentage);

                                    if (percent < 1)
                                        percent = this.point.percentage.toFixed(2);

                                    return '<b>' + this.series.name + ':' + '</b><br/>' + ' <b>' + percent + '% </b>' +
                                        ' (' + Highcharts.numberFormat(this.y, 2, '.', ',') + ' USD Mil)'
                                }
                            }
                        }
                    },

                    filterFor: {
                        "filter_regions": ['year', 'oda']
                    },

                    postProcess: [
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_browse_sector_recipient"
                                }
                            ],
                            "parameters": {
                                "rows": {
                                    "!fao_region": {
                                        "codes": [
                                            {
                                                "uid": "crs_fao_regions",
                                                "version": "2016",
                                                "codes": [
                                                    "NA"
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
                                        "codes": [
                                            {
                                                "uid": "oda_crs",
                                                "version": "2016",
                                                "codes": [
                                                    "usd_commitment"
                                                ]
                                            }
                                        ]
                                    }
                                }
                            },
                            "rid":{"uid":"filter_regions"}
                        },
                        {
                            "name": "select",
                            "parameters": {
                                "query": "WHERE fao_region IS NOT NULL",
                                "queryParameters": []
                            }
                        },
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "unitcode", "fao_region"
                                ],
                                "aggregations": [
                                    {
                                        "columns": ["value"],
                                        "rule": "SUM"
                                    },
                                    {
                                        "columns": ["unitcode"],
                                        "rule": "max"
                                    }
                                ]
                            }
                        },

                        {
                            "name": "order",
                            "parameters": {
                                "value": "DESC"
                            }
                        }
                    ]
                },
                {
                    id: 'country-map',
                    type: 'map',
                    config: {
                        geoSubject: 'gaul0',
                        colorRamp: 'GnBu',  //Blues, Greens,
                        //colorRamp values: http://fenixrepo.fao.org/cdn/fenix/fenix-ui-map-datasets/colorramp.png

                        legendtitle: 'ODA',

                        fenix_ui_map: {

                            plugins: {
                                fullscreen: false,
                                disclaimerfao: false
                            },
                            guiController: {
                                overlay: false,
                                baselayer: false,
                                wmsLoader: false
                            },

                            baselayers: {
                                "cartodb": {
                                    title_en: "Baselayer",
                                    url: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
                                    subdomains: 'abcd',
                                    maxZoom: 19
                                }
                            },
                            labels: true,
                            boundaries: true
                        }
                    },


                    filterFor: { "filter_map": ['year', 'oda']},


                    postProcess: [
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_browse_sector_recipient"
                                }
                            ],
                            "parameters": {
                                "columns": [ "gaul0", "value", "unitcode", "gaul0_EN", "unitcode_EN"],
                                "rows": {
                                    "!gaul0": {
                                        "codes": [
                                            {
                                                "uid": "GAUL0",
                                                "version": "2014",
                                                "codes": [
                                                    "NA",
                                                    "ZZZZZ"
                                                ]
                                            }
                                        ]
                                    },
                                    "oda": {
                                        "codes": [
                                            {
                                                "uid": "crs_oda",
                                                "version": "2016",
                                                "codes": [
                                                    "usd_commitment"
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
                                    }
                                }
                            },
                            "rid":{"uid":"filter_map"}
                        },
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "gaul0"
                                ],
                                "aggregations": [
                                    {
                                        "columns": ["value"],
                                        "rule": "SUM"
                                    },
                                    {
                                        "columns": ["unitcode"],
                                        "rule": "max"
                                    }
                                ]
                            }
                        }
                    ]

                }
            ]
        }
    }
});