/*global define*/

define(['../../../../config-base'],function (Config) {

    'use strict';

    return {
        id: 'OTHER_SECTORS',
        type: 'OTHER',
        filter: {
            fao_region: {
                selector: {
                    id: "dropdown",
                    default: ["RAP"],
                    emptyOption : {
                        enabled: true,
                        text: "All",
                        value: "all"
                    },
                    config: { //Selectize configuration
                        maxItems: 1
                        // openOnFocus: false
                    }
                },
                classNames: "col-xs-5",
                cl: {
                    uid: "crs_fao_regions",
                    version: "2016",
                    level: 1,
                    levels: 1
                },
                template: {
                    hideSwitch: true,
                    hideRemoveButton: true
                }
            },
            recipientcode: {
                selector: {
                    id: "dropdown",
                    default: ["625"],
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
                    "uid": "crs_fao_regions",
                    "version": "2016",
                    level: 2,
                    levels: 2,
                    "codes": [
                        "625",
                        "666",
                        "630",
                        "728",
                        "730",
                        "831",
                        "740",
                        "832",
                        "645",
                        "738",
                        "836",
                        "745",
                        "751",
                        "655",
                        "859",
                        "860",
                        "753",
                        "635",
                        "845",
                        "660",
                        "856",
                        "665",
                        "861",
                        "862",
                        "755",
                        "880",
                        "866",
                        "640",
                        "764",
                        "765",
                        "868",
                        "870",
                        "872",
                        "854",
                        "769",
                        "876"
                    ]
                },
                template: {
                    hideSwitch: true,
                    hideRemoveButton: true
                },
                dependencies: {
                    "fao_region": {id: "parent", event: "select", args: {
                        body: {
                            levels: 2
                        },
                        exclude: ["all"]
                    }}
                }
            },
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
                classNames: "col-xs-4",
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
                classNames: "col-xs-5",
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
            uid: "adam_browse_recipient_oda",

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
                        "filter_total_ODA": ['fao_region', 'recipientcode', 'year', 'oda']
                    },

                    postProcess: [
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_browse_recipient_oda"
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
                    id: "tot-oda-sector", //ref [data-item=':id']
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
                                        var hasSubSector = false;

                                        var isVisible = $.each(_that.series, function (i, serie) {
                                            if(serie.name == '% Sector/Total'){
                                                serie.update({
                                                    yAxis: 'subsector-axis',
                                                    dashStyle: 'shortdot',
                                                    marker: {
                                                        radius: 3
                                                    }
                                                });

                                                return true;
                                            }
                                        });

                                        if(!isVisible){
                                            this.options.yAxis[1].title.text = '';
                                            this.yAxis[1].visible = false;
                                            this.yAxis[1].isDirty = true;
                                            this.redraw();
                                        } else {
                                            this.options.yAxis[1].title.text= '%';
                                            this.yAxis[1].visible = true;
                                            this.yAxis[1].isDirty = true;
                                            this.redraw();
                                        }

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
                            },
                            yAxis: [{ //Primary Axis in default template
                            }, { // Secondary Axis
                                id: 'subsector-axis',
                                gridLineWidth: 0,
                                title: {
                                    text: '%'
                                },
                                opposite: true
                            }],
                            exporting: {
                                chartOptions: {
                                    legend: {
                                        enabled: true
                                    }

                                }
                            }

                        }
                    },

                    filterFor: {
                        "filter_total_country_ODA": ['fao_region', 'recipientcode', 'year', 'oda'],
                        "filter_total_sector_country_oda": ['fao_region', 'recipientcode', 'parentsector_code', 'year', 'oda']
                    },

                    postProcess: [
                        {
                            "name": "union",
                            "sid": [
                                {
                                    "uid": "total_country_oda" // RESULT OF PART 1: TOTAL ODA FOR THE COUNTRY
                                },
                                {
                                    "uid": "total_sector_country_oda" // RESULT OF PART 2: TOTAL ODA FOR SECTOR IN COUNTRY
                                },
                                {
                                    "uid":"percentage_ODA" // RESULT OF PART 3: PERCENTAGE CALCULATION (TOTAL ODA FOR SECTOR IN COUNTRY / TOTAL ODA FOR COUNTRY  x 100)
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
                                    "uid": "adam_browse_recipient_oda"
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
                                    }
                                }
                            },
                            "rid":{"uid":"filter_total_country_ODA"}
                        }, // PART 1: TOTAL ODA FOR THE COUNTRY: (1i) Filter
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
                            "rid":{"uid":"total_ODA"}

                        }, // (1ii): TOTAL ODA FOR THE COUNTRY: Group by
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
                                "value": "Total ODA in the Country" // PART 1 FINAL INDICATOR NAME
                            },
                            "rid": {
                                "uid": "total_country_oda"
                            }
                        }, // (1iii): TOTAL ODA FOR THE COUNTRY: Add Column
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_browse_recipient_oda"
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
                                    "parentsector_code": {
                                        "codes": [
                                            {
                                                "uid": "crs_dac",
                                                "version": "2016",
                                                "codes": [
                                                    "600"
                                                ]
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
                            "rid":{"uid":"filter_total_sector_country_oda"}

                        }, // PART 2: TOTAL ODA for SECTOR in COUNTRY: (2i) Filter
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
                            }

                        }, // (2ii): TOTAL ODA for SECTOR in COUNTRY: Group by
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
                                "value": "ODA in the Sector for the Country" // PART 2 FINAL INDICATOR NAME
                            },
                            "rid":{"uid":"total_sector_country_oda"}
                        }, // (2iii): TOTAL ODA for SECTOR in COUNTRY: Add Column
                        {
                            "name": "join",
                            "sid": [
                                {
                                    "uid": "total_country_oda"
                                },
                                {
                                    "uid": "total_sector_country_oda"
                                }
                            ],
                            "parameters": {
                                "joins": [
                                    [

                                        {
                                            "type": "id",
                                            "value": "year"
                                        }
                                    ],
                                    [
                                        {
                                            "type": "id",
                                            "value": "year"
                                        }

                                    ]
                                ],
                                "values": [
                                ]
                            },
                            "rid":{"uid":"join_process"}
                        }, // PART 3 PERCENTAGE CALCULATION: (3i) Join
                        {
                            "name": "addcolumn",
                            "sid":[{"uid":"join_process"}],
                            "parameters": {
                                "column": {
                                    "dataType": "number",
                                    "id": "value",
                                    "title": {
                                        "EN": "Value"
                                    },
                                    "subject": null
                                },
                                "value": {
                                    "keys":  ["1 = 1"],
                                    "values":[" ( total_sector_country_oda_value / total_country_oda_value )*100"]

                                }
                            },
                            "rid": {
                                "uid": "percentage_Value"
                            }
                        }, // (3ii) PERCENTAGE CALCULATION: Add Column
                        {
                            "name": "filter",
                            "parameters": {
                                "columns": [
                                    "year",
                                    "value"
                                ],
                                "rows": {}
                            },
                            "rid": {
                                "uid": "percentage_with_two_values"
                            }
                        }, // (3iii) PERCENTAGE CALCULATION: filter (filter out what is not needed)
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
                                    "subject": "um"
                                },
                                "value": "percentage"
                            }
                        }, // (3iv) PERCENTAGE CALCULATION: Add Column (Measurement Unit Code)
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
                                "value": "% Sector/Total" // PART 3 FINAL INDICATOR NAME
                            },
                            "rid": {
                                "uid": "percentage_ODA"
                            }
                        } // (3vi) PERCENTAGE CALCULATION: Add Column
                    ]
                },
                {
                    id: "tot-oda-subsector", //ref [data-item=':id']
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
                                        var hasSubSector = false;

                                        var isVisible = $.each(_that.series, function (i, serie) {
                                            if(serie.name == '% Sub Sector/Sector'){
                                                serie.update({
                                                    yAxis: 'subsector-axis',
                                                    dashStyle: 'shortdot',
                                                    marker: {
                                                        radius: 3
                                                    }
                                                });

                                                return true;
                                            }
                                        });

                                        if(!isVisible){
                                            this.options.yAxis[1].title.text = '';
                                            this.yAxis[1].visible = false;
                                            this.yAxis[1].isDirty = true;
                                            this.redraw();
                                        } else {
                                            this.options.yAxis[1].title.text= '%';
                                            this.yAxis[1].visible = true;
                                            this.yAxis[1].isDirty = true;
                                            this.redraw();
                                        }


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
                            },
                            yAxis: [{ //Primary Axis in default template
                            }, { // Secondary Axis
                                id: 'subsector-axis',
                                gridLineWidth: 0,
                                title: {
                                    text: '%'
                                },
                                opposite: true
                            }],
                            exporting: {
                                chartOptions: {
                                    legend: {
                                        enabled: true
                                    }

                                }
                            }

                        }
                    },

                    filterFor: {
                        "filter_total_country_sector_oda": ['fao_region', 'recipientcode', 'parentsector_code', 'year', 'oda'],
                        "filter_total_country_subsector_oda": ['fao_region', 'recipientcode', 'parentsector_code', 'purposecode', 'year', 'oda']
                    },
                    postProcess:[
                        {
                            "name": "union",
                            "sid": [
                                {
                                    "uid": "total_country_sector_oda" // RESULT OF PART 1: TOTAL ODA FOR SECTOR IN COUNTRY
                                },
                                {
                                    "uid": "total_country_subsector_oda" // RESULT OF PART 2: TOTAL ODA FOR SUB SECTOR IN COUNTRY
                                },
                                {
                                    "uid":"percentage_ODA" // RESULT OF PART 3: PERCENTAGE CALCULATION (TOTAL ODA FOR SECTOR IN COUNTRY / TOTAL ODA FOR COUNTRY  x 100)
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
                                    "uid": "adam_browse_recipient_oda"
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
                                    "parentsector_code": {
                                        "codes": [
                                            {
                                                "uid": "crs_dac",
                                                "version": "2016",
                                                "codes": [
                                                    "600"
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
                            "rid":
                            {"uid":"filter_total_country_sector_oda"}
                        }, // PART 1: TOTAL ODA FOR THE SECTOR IN COUNTRY: (1i) Filter
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
                            }
                        }, // (1ii): TOTAL ODA FOR THE SECTOR IN COUNTRY: Group by
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
                                "value": "ODA in the Sector for the Country" // PART 1 FINAL INDICATOR NAME
                            },
                            "rid": {
                                "uid": "total_country_sector_oda"
                            }
                        }, // (1iii): TOTAL ODA FOR THE SECTOR IN COUNTRY: Add Column
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_browse_recipient_oda"
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
                                    "parentsector_code": {
                                        "codes": [
                                            {
                                                "uid": "crs_dac",
                                                "version": "2016",
                                                "codes": [
                                                    "600"
                                                ]
                                            }
                                        ]
                                    },
                                    "purposecode": {
                                        "codes": [
                                            {
                                                "uid": "crs_purposes",
                                                "version": "2016",
                                                "codes": [
                                                    "60020"
                                                ]
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
                            "rid":{"uid":"filter_total_country_subsector_oda"}

                        }, // PART 2: TOTAL ODA for SUBSECTOR in COUNTRY: (2i) Filter
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
                            }

                        }, // (2ii): TOTAL ODA for SUBSECTOR in COUNTRY: Group by
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
                                "value": "ODA in the Sub Sector for the Country" // PART 2 FINAL INDICATOR NAME
                            },
                            "rid":{"uid":"total_country_subsector_oda"}
                        }, // (2iii): TOTAL ODA for SUB SECTOR in COUNTRY: Add Column
                        {
                            "name": "join",
                            "sid": [
                                {
                                    "uid": "total_country_sector_oda"
                                },
                                {
                                    "uid": "total_country_subsector_oda"
                                }
                            ],
                            "parameters": {
                                "joins": [
                                    [

                                        {
                                            "type": "id",
                                            "value": "year"
                                        }
                                    ],
                                    [
                                        {
                                            "type": "id",
                                            "value": "year"
                                        }

                                    ]
                                ],
                                "values": [
                                ]
                            },
                            "rid":{"uid":"join_process"}
                        }, // PART 3 PERCENTAGE CALCULATION: (3i) Join
                        {
                            "name": "addcolumn",
                            "sid":[{"uid":"join_process"}],
                            "parameters": {
                                "column": {
                                    "dataType": "number",
                                    "id": "value",
                                    "title": {
                                        "EN": "Value"
                                    },
                                    "subject": null
                                },
                                "value": {
                                    "keys":  ["1 = 1"],
                                    "values":[" ( total_country_subsector_oda_value / total_country_sector_oda_value )*100"]

                                }
                            },
                            "rid": {
                                "uid": "percentage_Value"
                            }
                        }, // (3ii) PERCENTAGE CALCULATION: Add Column
                        {
                            "name": "filter",
                            "parameters": {
                                "columns": [
                                    "year",
                                    "value"
                                ],
                                "rows": {}
                            },
                            "rid": {
                                "uid": "percentage_with_two_values"
                            }
                        }, // (3iii) PERCENTAGE CALCULATION: filter (filter out what is not needed)
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
                                    "subject": "um"
                                },
                                "value": "percentage"
                            }
                        }, // (3iv) PERCENTAGE CALCULATION: Add Column (Measurement Unit Code)
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
                                "value": "% Sub Sector/Sector" // PART 3 FINAL INDICATOR NAME
                            },
                            "rid": {
                                "uid": "percentage_ODA"
                            }
                        } // (3vi) PERCENTAGE CALCULATION: Add Column
                    ]
                },
                {
                    id: 'top-partners', // TOP DONORS
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
                        "filter_donor": ['fao_region', 'recipientcode', 'parentsector_code', 'purposecode', 'year', 'oda']
                    },
                    postProcess: [
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_browse_recipient_donor"
                                }
                            ],
                            "parameters": {
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
                            "rid":{"uid":"filter_donor"}
                        },
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "donorcode",  "flowcategory"
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
                            }
                        },
                        {
                            "name": "page",
                            "parameters": {
                                "perPage": 10,
                                "page": 1
                            }
                        }

                    ]
                },
                {
                    id: 'top-partners-others', // TOP DONORS Vs OTHER DONORS
                    type: 'chart',
                    config: {
                        type: "pieold",
                        x: ["indicator"], //x axis and series
                        series: ["unitname"], // series
                        y: ["value"],//Y dimension
                        aggregationFn: {"value": "sum"},
                        useDimensionLabelsIfExist: false,// || default raw else fenixtool

                        config: {
                            colors: ['#008080'],
                            legend: {
                                title: {
                                    text: null
                                }
                            },
                            plotOptions: {
                                pie: {
                                    showInLegend: true
                                },
                                series: {
                                    point: {
                                        events: {
                                            legendItemClick: function () {
                                                return false; // <== returning false will cancel the default action
                                            }
                                        }
                                    }
                                }
                            },
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
                        "filter_top_10_donors_sum": ['fao_region', 'recipientcode', 'parentsector_code', 'purposecode', 'year', 'oda'],
                        "filter_top_all_donors_sum": ['fao_region', 'recipientcode', 'parentsector_code', 'purposecode', 'year', 'oda']
                    },

                    postProcess: [
                        {
                            "name": "union",
                            "sid": [
                                {
                                    "uid": "top_10_donors_sum"
                                },
                                {
                                    "uid": "others"
                                }
                            ],
                            "parameters": {},
                            "rid": {
                                "uid": "union_process"
                            }
                        },
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_browse_recipient_donor"
                                }
                            ],
                            "parameters": {
                                "columns": [
                                    "donorcode",
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
                                    "parentsector_code": {
                                        "codes": [
                                            {
                                                "uid": "crs_dac",
                                                "version": "2016",
                                                "codes": [
                                                    "600"
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
                            "rid": {
                                "uid": "filter_top_10_donors_sum"
                            }
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
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "unitcode"
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
                                "value": "Top Resource Partners"
                            },
                            "rid": {
                                "uid": "top_10_donors_sum"
                            }
                        },
                        {
                            "name": "group",
                            "sid":[{"uid":"filtered_dataset"}],
                            "parameters": {
                                "by": [
                                    "unitcode"
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
                                "value": "sum of all donors"
                            },
                            "rid": {
                                "uid": "top_all_donors_sum"
                            }
                        },
                        {
                            "name": "join",
                            "sid": [
                                {
                                    "uid": "top_all_donors_sum"
                                },
                                {
                                    "uid": "top_10_donors_sum"
                                }
                            ],
                            "parameters": {
                                "joins": [
                                    [
                                        {
                                            "type": "id",
                                            "value": "unitcode"
                                        }
                                    ],
                                    [
                                        {
                                            "type": "id",
                                            "value": "unitcode"
                                        }
                                    ]
                                ],
                                "values": []
                            },
                            "rid": {
                                "uid": "join_process_total_donors"
                            }
                        },
                        {
                            "name": "addcolumn",
                            "sid": [
                                {
                                    "uid": "join_process_total_donors"
                                }
                            ],
                            "parameters": {
                                "column": {
                                    "dataType": "number",
                                    "id": "value",
                                    "title": {
                                        "EN": "Value"
                                    },
                                    "subject": null
                                },
                                "value": {
                                    "keys": [
                                        "1 = 1"
                                    ],
                                    "values": [
                                        "top_all_donors_sum_value - top_10_donors_sum_value"
                                    ]
                                }
                            }
                        },
                        {
                            "name": "filter",
                            "parameters": {
                                "columns": [
                                    "value",
                                    "unitcode"
                                ]
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
                                "value": "Other Resource Partners"
                            },
                            "rid": {
                                "uid": "others"
                            }
                        }
                    ]
                },
                {
                    id: 'top-recipients', // TOP RECIPIENTS
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
                        "filter_recipient": ['fao_region', 'parentsector_code', 'purposecode', 'year', 'oda']
                    },
                    postProcess: [
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_browse_recipient_oda"
                                }
                            ],
                            "parameters": {
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
                                    "parentsector_code": {
                                        "codes": [
                                            {
                                                "uid": "crs_dac",
                                                "version": "2016",
                                                "codes": [
                                                    "600"
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
                            "rid":{"uid":"filter_recipient"}
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
                            }
                        },
                        {
                            "name": "page",
                            "parameters": {
                                "perPage": 10,
                                "page": 1
                            }
                        }

                    ]
                },
                {
                    id: 'top-recipients-others', // TOP RECIPIENTS Vs OTHER RECIPIENTS
                    type: 'chart',
                    config: {
                        type: "pieold",
                        x: ["indicator"], //x axis and series
                        series: ["unitname"], // series
                        y: ["value"],//Y dimension
                        aggregationFn: {"value": "sum"},
                        useDimensionLabelsIfExist: false,// || default raw else fenixtool

                        config: {
                            colors: ['#008080'],
                            legend: {
                                title: {
                                    text: null
                                }
                            },
                            plotOptions: {
                                pie: {
                                    showInLegend: true
                                },
                                series: {
                                    point: {
                                        events: {
                                            legendItemClick: function () {
                                                return false; // <== returning false will cancel the default action
                                            }
                                        }
                                    }
                                }
                            },
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
                        "filter_top_10_recipients_sum": ['fao_region', 'parentsector_code', 'purposecode', 'year', 'oda'],
                        "filter_top_all_recipients_sum": ['fao_region','parentsector_code', 'purposecode', 'year', 'oda']
                    },

                    postProcess: [
                        {
                            "name": "union",
                            "sid": [
                                {
                                    "uid": "top_10_recipients_sum"
                                },
                                {
                                    "uid": "others"
                                }
                            ],
                            "parameters": {},
                            "rid": {
                                "uid": "union_process"
                            }
                        },
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_browse_recipient_oda"
                                }
                            ],
                            "parameters": {
                                "columns": [
                                    "recipientcode",
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
                                    },
                                    "parentsector_code": {
                                        "codes": [
                                            {
                                                "uid": "crs_dac",
                                                "version": "2016",
                                                "codes": [
                                                    "600"
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
                            "rid": {
                                "uid": "filter_top_10_recipients_sum"
                            }
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
                            "rid": {"uid": "filtered_dataset"}
                        },
                        {
                            "name": "page",
                            "parameters": {
                                "perPage": 10,
                                "page": 1
                            }
                        },
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "unitcode"
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
                                "value": "Top Recipient Countries"
                            },
                            "rid": {
                                "uid": "top_10_recipients_sum"
                            }
                        },
                        {
                            "name": "group",
                            "sid": [{"uid": "filtered_dataset"}],
                            "parameters": {
                                "by": [
                                    "unitcode"
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
                                "value": "sum of all recipients"
                            },
                            "rid": {
                                "uid": "top_all_recipients_sum"
                            }
                        },
                        {
                            "name": "join",
                            "sid": [
                                {
                                    "uid": "top_all_recipients_sum"
                                },
                                {
                                    "uid": "top_10_recipients_sum"
                                }
                            ],
                            "parameters": {
                                "joins": [
                                    [
                                        {
                                            "type": "id",
                                            "value": "unitcode"
                                        }
                                    ],
                                    [
                                        {
                                            "type": "id",
                                            "value": "unitcode"
                                        }
                                    ]
                                ],
                                "values": []
                            },
                            "rid": {
                                "uid": "join_process_total_recipients"
                            }
                        },
                        {
                            "name": "addcolumn",
                            "sid": [
                                {
                                    "uid": "join_process_total_recipients"
                                }
                            ],
                            "parameters": {
                                "column": {
                                    "dataType": "number",
                                    "id": "value",
                                    "title": {
                                        "EN": "Value"
                                    },
                                    "subject": null
                                },
                                "value": {
                                    "keys": [
                                        "1 = 1"
                                    ],
                                    "values": [
                                        "top_all_recipients_sum_value - top_10_recipients_sum_value"
                                    ]
                                }
                            }
                        },
                        {
                            "name": "filter",
                            "parameters": {
                                "columns": [
                                    "value",
                                    "unitcode"
                                ]
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
                                "value": "Other Recipient Countries"
                            },
                            "rid": {
                                "uid": "others"
                            }
                        }
                    ]
                },
                {
                    id: 'top-channels', // TOP CHANNELS
                    type: 'chart',
                    config: {
                        type: "column",
                        x: ["channelsubcategory_code"], //x axis
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
                        "filter_channel": ['fao_region', 'recipientcode', 'parentsector_code', 'purposecode', 'year', 'oda']
                    },
                    postProcess: [
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_browse_recipient_subcategory"
                                }
                            ],
                            "parameters": {
                                "rows": {
                                    "parentsector_code": {
                                        "codes": [
                                            {
                                                "uid": "crs_dac",
                                                "version": "2016",
                                                "codes": [
                                                    "600"
                                                ]
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
                            "rid":{"uid":"filter_channel"}
                        },
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "channelsubcategory_code", "flowcategory"
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
                            }
                        },
                        {
                            "name": "page",
                            "parameters": {
                                "perPage": 10,
                                "page": 1
                            }
                        }

                    ]
                },
                {
                    id: 'top-channels-others', // TOP CHANNELS Vs OTHER CHANNELS
                    type: 'chart',
                    config: {
                        type: "pieold",
                        x: ["indicator"], //x axis and series
                        series: ["unitname"], // series
                        y: ["value"],//Y dimension
                        aggregationFn: {"value": "sum"},
                        useDimensionLabelsIfExist: false,// || default raw else fenixtool

                        config: {
                            colors: ['#008080'],
                            legend: {
                                title: {
                                    text: null
                                }
                            },
                            plotOptions: {
                                pie: {
                                    showInLegend: true
                                },
                                series: {
                                    point: {
                                        events: {
                                            legendItemClick: function () {
                                                return false; // <== returning false will cancel the default action
                                            }
                                        }
                                    }
                                }
                            },
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
                        "filter_top_10_channels_sum": ['fao_region', 'recipientcode', 'parentsector_code', 'purposecode', 'year', 'oda'],
                        "filter_top_all_channels_sum": ['fao_region', 'recipientcode', 'parentsector_code', 'purposecode', 'year', 'oda']
                    },

                    postProcess: [
                        {
                            "name": "union",
                            "sid": [
                                {
                                    "uid": "top_10_channels_sum"
                                },
                                {
                                    "uid": "others"
                                }
                            ],
                            "parameters": {},
                            "rid": {
                                "uid": "union_process"
                            }
                        },
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_browse_recipient_subcategory"
                                }
                            ],
                            "parameters": {
                                "columns": [
                                    "channelsubcategory_code",
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
                                    "parentsector_code": {
                                        "codes": [
                                            {
                                                "uid": "crs_dac",
                                                "version": "2016",
                                                "codes": [
                                                    "600"
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
                            "rid": {
                                "uid": "filter_top_10_channels_sum"
                            }
                        },
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "channelsubcategory_code"
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
                            "rid": {"uid": "filtered_dataset"}
                        },
                        {
                            "name": "page",
                            "parameters": {
                                "perPage": 10,
                                "page": 1
                            }
                        },
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "unitcode"
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
                                "value": "Top Channels of Delivery"
                            },
                            "rid": {
                                "uid": "top_10_channels_sum"
                            }
                        },
                        {
                            "name": "group",
                            "sid": [{"uid": "filtered_dataset"}],
                            "parameters": {
                                "by": [
                                    "unitcode"
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
                                "value": "sum of all channels"
                            },
                            "rid": {
                                "uid": "top_all_channels_sum"
                            }
                        },
                        {
                            "name": "join",
                            "sid": [
                                {
                                    "uid": "top_all_channels_sum"
                                },
                                {
                                    "uid": "top_10_channels_sum"
                                }
                            ],
                            "parameters": {
                                "joins": [
                                    [
                                        {
                                            "type": "id",
                                            "value": "unitcode"
                                        }
                                    ],
                                    [
                                        {
                                            "type": "id",
                                            "value": "unitcode"
                                        }
                                    ]
                                ],
                                "values": []
                            },
                            "rid": {
                                "uid": "join_process_total_channels"
                            }
                        },
                        {
                            "name": "addcolumn",
                            "sid": [
                                {
                                    "uid": "join_process_total_channels"
                                }
                            ],
                            "parameters": {
                                "column": {
                                    "dataType": "number",
                                    "id": "value",
                                    "title": {
                                        "EN": "Value"
                                    },
                                    "subject": null
                                },
                                "value": {
                                    "keys": [
                                        "1 = 1"
                                    ],
                                    "values": [
                                        "top_all_channels_sum_value - top_10_channels_sum_value"
                                    ]
                                }
                            }
                        },
                        {
                            "name": "filter",
                            "parameters": {
                                "columns": [
                                    "value",
                                    "unitcode"
                                ]
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
                                "value": "Other Channels of Delivery"
                            },
                            "rid": {
                                "uid": "others"
                            }
                        }
                    ]
                },
                {
                    id: 'top-sectors', // TOP SECTORS
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
                         "filter_sectors": ['fao_region', 'recipientcode', 'year', 'oda']
                    },

                    postProcess: [
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_browse_recipient_oda"
                                }
                            ],
                            "parameters": {
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
                            "rid":{"uid":"filter_sectors"}
                        },
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "parentsector_code",  "flowcategory"
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
                            }
                        },
                        {
                            "name": "page",
                            "parameters": {
                                "perPage": 10,
                                "page": 1
                            }
                        }
                    ]
                },
                {
                    id: 'top-sectors-others', // TOP SECTORS Vs OTHER SECTORS
                    type: 'chart',
                    config: {
                        type: "pieold",
                        x: ["indicator"], //x axis and series
                        series: ["unitname"], // series
                        y: ["value"],//Y dimension
                        aggregationFn: {"value": "sum"},
                        useDimensionLabelsIfExist: false,// || default raw else fenixtool

                        config: {
                            colors: ['#008080'],
                            legend: {
                                title: {
                                    text: null
                                }
                            },
                            plotOptions: {
                                pie: {
                                    showInLegend: true
                                },
                                series: {
                                    point: {
                                        events: {
                                            legendItemClick: function () {
                                                return false; // <== returning false will cancel the default action
                                            }
                                        }
                                    }
                                }
                            },
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
                        "filter_top_10_sectors_sum": ['fao_region', 'recipientcode', 'year', 'oda'],
                        "filter_top_all_sectors_sum": ['fao_region', 'recipientcode', 'year', 'oda']
                    },

                    postProcess: [
                        {
                            "name": "union",
                            "sid": [
                                {
                                    "uid": "top_10_sectors_sum"
                                },
                                {
                                    "uid": "others"
                                }
                            ],
                            "parameters": {},
                            "rid": {
                                "uid": "union_process"
                            }
                        },
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_browse_recipient_oda"
                                }
                            ],
                            "parameters": {
                                "columns": [
                                    "parentsector_code",
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
                                    }
                                }
                            },
                            "rid": {
                                "uid": "filter_top_10_sectors_sum"
                            }
                        },
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "parentsector_code"
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
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "unitcode"
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
                                "value": "Top Sectors"
                            },
                            "rid": {
                                "uid": "top_10_sectors_sum"
                            }
                        },
                        {
                            "name": "group",
                            "sid":[{"uid":"filtered_dataset"}],
                            "parameters": {
                                "by": [
                                    "unitcode"
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
                                "value": "sum of all sectors"
                            },
                            "rid": {
                                "uid": "top_all_sectors_sum"
                            }
                        },
                        {
                            "name": "join",
                            "sid": [
                                {
                                    "uid": "top_all_sectors_sum"
                                },
                                {
                                    "uid": "top_10_sectors_sum"
                                }
                            ],
                            "parameters": {
                                "joins": [
                                    [
                                        {
                                            "type": "id",
                                            "value": "unitcode"
                                        }
                                    ],
                                    [
                                        {
                                            "type": "id",
                                            "value": "unitcode"
                                        }
                                    ]
                                ],
                                "values": []
                            },
                            "rid": {
                                "uid": "join_process_total_sectors"
                            }
                        },
                        {
                            "name": "addcolumn",
                            "sid": [
                                {
                                    "uid": "join_process_total_sectors"
                                }
                            ],
                            "parameters": {
                                "column": {
                                    "dataType": "number",
                                    "id": "value",
                                    "title": {
                                        "EN": "Value"
                                    },
                                    "subject": null
                                },
                                "value": {
                                    "keys": [
                                        "1 = 1"
                                    ],
                                    "values": [
                                        "top_all_sectors_sum_value - top_10_sectors_sum_value"
                                    ]
                                }
                            }
                        },
                        {
                            "name": "filter",
                            "parameters": {
                                "columns": [
                                    "value",
                                    "unitcode"
                                ]
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
                                "value": "Other Sectors"
                            },
                            "rid": {
                                "uid": "others"
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
                        "filter_top_10_subsectors": ['fao_region', 'recipientcode', 'parentsector_code', 'year', 'oda']
                    },

                    postProcess: [
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_browse_recipient_oda"
                                }
                            ],
                            "parameters": {
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
                                    "parentsector_code": {
                                        "codes": [
                                            {
                                                "uid": "crs_dac",
                                                "version": "2016",
                                                "codes": [
                                                    "600"
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
                            "rid":{"uid":"filter_top_10_subsectors"}
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
                            }
                        },
                        {
                            "name": "page",
                            "parameters": {
                                "perPage": 10,
                                "page": 1
                            }
                        }
                    ]
                },
                {
                    id: 'regional-map',
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
                            boundaries: true//,

                           // zoomToCountry: [1] // Issue when no country selected

                            //highlight service NOT WORK FOR NOW
                            //highlightCountry : [1], // GAUL Afghanistan
                        }
                    },

                    filterFor: { "filter_region": ['fao_region', 'parentsector_code', 'purposecode', 'year', 'oda']},

                    postProcess: [
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_browse_recipient_oda"
                                }
                            ],
                            "parameters": {
                                "columns": [ "gaul0", "value", "unitcode"],
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
                                                "uid": "oda_crs",
                                                "version": "2016",
                                                "codes": [
                                                    "usd_commitment"
                                                ]
                                            }
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
                            "rid":{"uid":"filter_region"}
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