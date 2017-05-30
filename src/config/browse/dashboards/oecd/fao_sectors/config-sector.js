/*global define*/

define(['highcharts','../../../../config-base'],function (Highcharts, Config) {

    'use strict';

    return {
        id: 'FAO_SECTOR',
        type: 'FAO',
        filter: {
            parentsector_code: {
                selector: {
                    id: "dropdown",
                    default: ["9999"],
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
                    "levels": 3,
                    "codes": [
                        "12240",
                        "14030",
                        "14031",
                        "15170",
                        "16062",
                        "23070",
                        "31110",
                        "31120",
                        "31130",
                        "31140",
                        "31150",
                        "31161",
                        "31162",
                        "31163",
                        "31164",
                        "31165",
                        "31166",
                        "31181",
                        "31182",
                        "31191",
                        "31192",
                        "31193",
                        "31194",
                        "31195",
                        "31210",
                        "31220",
                        "31261",
                        "31281",
                        "31282",
                        "31291",
                        "31310",
                        "31320",
                        "31381",
                        "31382",
                        "31391",
                        "32161",
                        "32162",
                        "32163",
                        "32165",
                        "32267",
                        "41010",
                        "41020",
                        "41030",
                        "41040",
                        "41050",
                        "41081",
                        "41082",
                        "43040",
                        "43050",
                        "52010",
                        "72040",
                        "74010"
                    ]
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
                    to: 2015,
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
                    to: 2015,
                    default: [2015],
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
            uid: "adam_browse_sector_oda",
            items: [
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
                                            if(serie.name == '% Sector/Total ODA'){
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
                        "filter_total_sector_oda": ['year', 'oda'],
                        "filter_total_oda": ['year', 'oda']
                    },

                    postProcess: [
                        {
                            "name": "union",
                            "sid": [
                                {
                                    "uid": "total_sector_oda" // RESULT OF PART 1: TOTAL ODA for the selected Sector
                                },
                                {
                                    "uid": "total_oda" // RESULT OF PART 2: TOTAL ODA for ALL Sectors
                                },
                                {
                                    "uid": "percentage_ODA" // RESULT OF PART 3: PERCENTAGE CALCULATION (TOTAL ODA SECTOR / TOTAL ODA for ALL Sectors x 100)
                                }
                            ],
                            "parameters": {},
                            "rid": {
                                "uid": "union_process"
                            }
                        }, // PART 4: UNION is the FINAL PART IN THE PROCESS
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
                                    "fao_sector": {
                                        "enumeration": [
                                            "1"
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
                            rid: {uid: "filter_total_sector_oda"}
                        }, // PART 1: TOTAL ODA FOR SECTOR: (1i) Filter
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
                        }, // (1ii): TOTAL ODA FOR SECTOR: Group by
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
                                "value": "ODA Sector" // PART 1 FINAL INDICATOR NAME
                            },
                            "rid": {
                                "uid": "total_sector_oda"
                            }
                        }, // (1iii): TOTAL ODA FOR SECTOR: Add Column
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
                                    "!dac_member": {
                                        "enumeration": [
                                            "t"
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
                                                    "NA"
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
                                                    "NA"
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
                                    }
                                }
                            },
                            "rid": {
                                "uid": "filter_total_oda"
                            }

                        }, //PART 2:  TOTAL ODA for ALL Sectors: (2i) Filter
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
                        }, //(2ii):  TOTAL ODA for ALL Sectors: Group by
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
                                "value": "Total ODA" // PART 2 FINAL INDICATOR NAME
                            },
                            "rid": {
                                "uid": "total_oda"
                            }
                        }, //(2iii):  TOTAL ODA for ALL Sectors: Add Column
                        {
                            "name": "join",
                            "sid": [
                                {
                                    "uid": "total_sector_oda"
                                },
                                {
                                    "uid": "total_oda"
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
                                "values": []
                            },
                            "rid": {
                                "uid": "join_process"
                            }
                        }, // PART 3 PERCENTAGE CALCULATION: (3i) Join
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
                                    "id": "value",
                                    "title": {
                                        "EN": "Value"
                                    },
                                    "subject": null
                                },
                                "value": {
                                    "keys": ["1=1"],
                                    "values": ["@@direct (total_sector_oda_value/total_oda_value)*100"]
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
                                        "codes": [
                                            {
                                                "idCodeList": "crs_units",
                                                "version": "2016",
                                                "level": 1
                                            }
                                        ]
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
                                "value": "% Sector/Total ODA"  // PART 3 FINAL INDICATOR NAME
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

                                        $.each(this.series, function (i, serie) {
                                            if(serie.name == 'Total ODA'){
                                                serie.update({
                                                    visible: false
                                                })
                                            }
                                        });

                                        var isVisible = $.each(_that.series, function (i, serie) {
                                            if(serie.name == '% Sub Sector/Sector'){
                                                serie.update({
                                                    yAxis: 'sector-axis',
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
                                id: 'sector-axis',
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
                        "filter_total_sector_oda": ['year', 'oda'],
                        "filter_total_subsector_oda": ['purposecode', 'year', 'oda'],
                        "filter_total_oda": ['year', 'oda']
                    },

                    postProcess:[
                        {
                            "name": "union",
                            "sid": [
                                {
                                    "uid": "total_sector_oda"
                                    // RESULT OF PART 1: TOTAL ODA for the selected Sector
                                },
                                {
                                    "uid": "total_subsector_oda"
                                    // RESULT OF PART 2: TOTAL ODA for the selected Sub Sector
                                },
                                {
                                    "uid": "total_oda"
                                    // RESULT OF PART 3: TOTAL ODA for ALL Sectors
                                },
                                {
                                    "uid": "percentage_ODA"
                                    // RESULT OF PART 4: PERCENTAGE CALCULATION (TOTAL ODA SUB SECTOR / TOTAL ODA for SECTOR x 100)
                                }
                            ],
                            "parameters": {},
                            "rid": {
                                "uid": "union_process"
                            }
                        },
                        // PART 5: UNION is the FINAL PART IN THE PROCESS
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
                                    "fao_sector": {
                                        "enumeration": [
                                            "1"
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
                            rid: {
                                uid: "filter_total_sector_oda"
                            }
                        },
                        // PART 1: TOTAL ODA FOR SECTOR: (1i) Filter
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
                        },
                        // (1ii): TOTAL ODA FOR SECTOR: Group by
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
                                "value": "ODA Sector"
                                // PART 1 FINAL INDICATOR NAME
                            },
                            "rid": {
                                "uid": "total_sector_oda"
                            }
                        },
                        // (1iii): TOTAL ODA FOR SECTOR: Add Column

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
                                    "fao_sector": {
                                        "enumeration": [
                                            "1"
                                        ]
                                    },
                                    "purposecode": {
                                        "codes": [
                                            {
                                                "uid": "crs_purposes",
                                                "version": "2016",
                                                "codes": [
                                                    "74010"
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
                            rid: {
                                uid: "filter_total_subsector_oda"
                            }
                        },
                        // PART 2: TOTAL ODA FOR SUB SECTOR: (1i) Filter
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
                        },
                        // (1ii): TOTAL ODA FOR SUB SECTOR: Group by
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
                                "value": "ODA Sub Sector"
                                // PART 2 FINAL INDICATOR NAME
                            },
                            "rid": {
                                "uid": "total_subsector_oda"
                            }
                        },
                        // (2iii): TOTAL ODA FOR SUB SECTOR: Add Column

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
                                    "parentsector_code": {
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
                                    "purposecode": {
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
                                    "donorcode": {
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
                                "uid": "filter_total_oda"
                            }
                        },
                        //PART 3:  TOTAL ODA for ALL Sectors: (2i) Filter
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
                        },
                        //(3ii):  TOTAL ODA for ALL Sectors: Group by
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
                                "value": "Total ODA"
                                // PART 3 FINAL INDICATOR NAME
                            },
                            "rid": {
                                "uid": "total_oda"
                            }
                        },
                        //(3iii):  TOTAL ODA for ALL Sectors: Add Column
                        {
                            "name": "join",
                            "sid": [
                                {
                                    "uid": "total_sector_oda"
                                },
                                {
                                    "uid": "total_subsector_oda"
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
                                "values": []
                            },
                            "rid": {
                                "uid": "join_process"
                            }
                        },
                        // PART 4 PERCENTAGE CALCULATION: (3i) Join
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
                                    "id": "value",
                                    "title": {
                                        "EN": "Value"
                                    },
                                    "subject": null
                                },
                                "value": {
                                    "keys": [
                                        "1=1"
                                    ],
                                    "values": [
                                        "@@direct (total_subsector_oda_value/total_sector_oda_value)*100"
                                    ]
                                }
                            },
                            "rid": {
                                "uid": "percentage_Value"
                            }
                        },
                        // (4ii) PERCENTAGE CALCULATION: Add Column
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
                        },
                        // (4iii) PERCENTAGE CALCULATION: filter (filter out what is not needed)
                        {
                            "name": "addcolumn",
                            "parameters": {
                                "column": {
                                    "id": "unitcode",
                                    "title": {
                                        "EN": "Measurement Unit"
                                    },
                                    "domain": {
                                        "codes": [
                                            {
                                                "idCodeList": "crs_units",
                                                "version": "2016",
                                                "level": 1
                                            }
                                        ]
                                    },
                                    "dataType": "code",
                                    "subject": "um"
                                },
                                "value": "percentage"
                            }
                        },
                        // (4iv) PERCENTAGE CALCULATION: Add Column (Measurement Unit Code)
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
                                "value": "% Sub Sector/Sector"
                                // PART 4 FINAL INDICATOR NAME
                            },
                            "rid": {
                                "uid": "percentage_ODA"
                            }
                        }
                        // (4vi) PERCENTAGE CALCULATION: Add Column
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
                        "filter_donors": ['year', 'oda', 'purposecode']
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
                                "rows": {
                                    "fao_sector": {
                                        "enumeration": [
                                            "1"
                                        ]
                                    },
                                    "value": {
                                        "number": [
                                            {
                                                "from": 0.00001
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
                            "rid":{"uid":"filter_donors"}
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
                    id: 'top-partners-others', // TOP RESOURCE PARTNERS Vs OTHER RESOURCE PARTNERS
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
                        "filter_top_10_donors_sum": ['purposecode', 'year', 'oda']
                    },

                    postProcess: [
                        {
                            "name": "union",
                            "sid": [
                                {
                                    "uid": "top_10_donors_sum"
                                    // RESULT OF PART 1: TOTAL ODA for TOP 10 PARTNERS
                                },
                                {
                                    "uid": "others"
                                    // RESULT OF PART 3: TOTAL ODA OTHERS CALCULATION (TOTAL ODA ALL PARTNERS (PART 2) - TOTAL ODA FOR TOP 10 Partners)
                                }
                            ],
                            "parameters": {},
                            "rid": {
                                "uid": "union_process"
                            }
                        },
                        // PART 4: UNION is the FINAL PART IN THE PROCESS

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
                                    "fao_sector": {
                                        "enumeration": [
                                            "1"
                                        ]
                                    },
                                    "value": {
                                        "number": [
                                            {
                                                "from": 0.00001
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
                        // PART 1: TOTAL ODA for TOP 10 PARTNERS: (1i) Filter
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
                        // (1ii): TOTAL ODA for TOP 10 PARTNERS: Group by
                        {
                            "name": "order",
                            "parameters": {
                                "value": "DESC"
                            },
                            "rid":{"uid":"filtered_dataset"}
                        },
                        // (1iii): TOTAL ODA for TOP 10 PARTNERS: Order by
                        {
                            "name": "page",
                            "parameters": {
                                "perPage": 10,
                                "page": 1
                            }
                        },
                        // (1iv): TOTAL ODA for TOP 10 PARTNERS: Limit
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
                        // (1vi): TOTAL ODA for TOP 10 PARTNERS: Group by
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
                                // PART 1 FINAL INDICATOR NAME
                            },
                            "rid": {
                                "uid": "top_10_donors_sum"
                            }
                        },
                        // (1vii): TOTAL ODA for TOP 10 PARTNERS: Add Column
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
                        // (2ii): TOTAL ODA for ALL PARTNERS: Group by
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
                                // PART 2 FINAL INDICATOR NAME
                            },
                            "rid": {
                                "uid": "top_all_donors_sum"
                            }
                        },
                        // (2iii): TOTAL ODA for ALL PARTNERS : Add Column
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
                        // PART 3: TOTAL ODA OTHERS CALCULATION: (3i) Join
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
                                        "@@direct top_all_donors_sum_value - top_10_donors_sum_value"
                                    ]
                                }
                            }
                        },
                        // (3ii): TOTAL ODA OTHERS CALCULATION: Add Column
                        {
                            "name": "filter",
                            "parameters": {
                                "columns": [
                                    "value",
                                    "unitcode"
                                ]
                            }
                        },
                        // (3iii): TOTAL ODA OTHERS CALCULATION: Filter (filter out what is not needed)
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
                                // PART 3 FINAL INDICATOR NAME
                            },
                            "rid": {
                                "uid": "others"
                            }
                        }
                        // (3iv): TOTAL ODA OTHERS CALCULATION: Add Column
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
                            colors: ['#5DA58D'],
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
                        "filter_recipients": ['year', 'oda', 'purposecode']
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
                                    "fao_sector": {
                                        "enumeration": [
                                            "1"
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
                            "rid":{"uid":"filter_recipients"}
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
                            colors: ['#5DA58D'],
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
                        "filter_top_10_recipients_sum": ['purposecode', 'year', 'oda']
                    },

                    postProcess: [
                        {
                            "name": "union",
                            "sid": [
                                {
                                    "uid": "top_10_recipients_sum"
                                },
                                {
                                    "uid":"others"
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
                                    "uid": "adam_browse_sector_recipient"
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
                                    "fao_sector": {
                                        "enumeration": [
                                            "1"
                                        ]
                                    },
                                    "value": {
                                        "number": [
                                            {
                                                "from": 0.00001
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
                                "value": "Top Recipient Countries"
                            },
                            "rid": {
                                "uid": "top_10_recipients_sum"
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
                                "values": [
                                ]
                            },
                            "rid":{"uid":"join_process_total_recipients"}
                        },
                        {
                            "name": "addcolumn",
                            "sid":[{"uid":"join_process_total_recipients"}],
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
                                    "values":["@@direct top_all_recipients_sum_value - top_10_recipients_sum_value"]
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
                                "value": "Other Recipients"
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
                            colors: ['#5DA58D'],
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
                        "filter_channels": ['year', 'oda', 'purposecode']
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
                                "rows": {
                                    "fao_sector": {
                                        "enumeration": [
                                            "1"
                                        ]
                                    },
                                    "value": {
                                        "number": [
                                            {
                                                "from": 0.00001
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
                            "rid":{"uid":"filter_channels"}
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
                            colors: ['#5DA58D'],
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
                        "filter_top_10_channels_sum": ['purposecode', 'year', 'oda']
                    },

                    postProcess: [
                        {
                            "name": "union",
                            "sid": [
                                {
                                    "uid": "top_10_channels_sum"
                                },
                                {
                                    "uid":"others"
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
                                    "uid": "adam_browse_sector_subcategory"
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
                                    "fao_sector": {
                                        "enumeration": [
                                            "1"
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
                                "value": "Top Channels of Delivery"
                            },
                            "rid": {
                                "uid": "top_10_channels_sum"
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
                                "values": [
                                ]
                            },
                            "rid":{"uid":"join_process_total_channels"}
                        },
                        {
                            "name": "addcolumn",
                            "sid":[{"uid":"join_process_total_channels"}],
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
                                    "values":["@@direct top_all_channels_sum_value - top_10_channels_sum_value"]
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
                    id: 'top-subsectors', // TOP SUB SECTORS
                    type: 'chart',
                    config: {
                        type: "pieold",
                        x: ["indicator_label"], //x axis and series
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
                        "filter_subsectors": ['year', 'oda']
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
                                "rows": {
                                    "fao_sector": {
                                        "enumeration": [
                                            "1"
                                        ]
                                    },
                                    "value": {
                                        "number": [
                                            {
                                                "from": 0.00001
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
                            "rid":{"uid":"filter_subsectors"}
                        },
                        {
                            "name":"group",
                            "parameters":{
                                "by":[
                                    "purposecode","flowcategory"
                                ],
                                "aggregations":[
                                    {
                                        "columns":[
                                            "value"
                                        ],
                                        "rule":"SUM"
                                    },
                                    {
                                        "columns":[
                                            "unitcode"
                                        ],
                                        "rule":"max"
                                    }

                                ]
                            }
                        },
                        {
                            "name":"order",
                            "parameters":{
                                "value":"DESC"
                            }
                        },
                        {
                            "name":"page",
                            "parameters":{
                                "perPage":10,
                                "page":1
                            },
                            "rid": {"uid":"top10Subs"}
                        },
                        {
                            "name": "addcolumn",
                            "parameters": {
                                "column": {
                                    "dataType": "text",
                                    "id": "indicator_label",
                                    "title": {
                                        "EN": "Purposecode"
                                    }
                                },
                                "value": {
                                    "keys": [
                                        "1=1"
                                    ],
                                    "values": [
                                        "@@direct purposecode_EN"
                                    ]
                                }
                            }
                        },
                        {
                            "name":"filter",
                            "parameters":{
                                "rows":{},
                                "columns":[
                                    "indicator_label",
                                    "value",
                                    "unitcode",
                                    "flowcategory"
                                ]
                            },
                            "rid":{
                                "uid":"filter_top10_subsectors"
                            }
                        },



                        {
                            "name":"filter",
                            "sid":[
                                {"uid": "filter_subsectors"},
                                {
                                    "uid":"top10Subs"
                                }
                            ],
                            "parameters":{
                                "rows":{
                                    "!purposecode" : {
                                        "tables":[
                                            {
                                                "uid":"top10Subs",
                                                "column":"purposecode"
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        {
                            "name":"group",
                            "parameters":{
                                "by":[
                                    "unitcode", "flowcategory"
                                ],
                                "aggregations":[
                                    {
                                        "columns":[
                                            "value"
                                        ],
                                        "rule":"SUM"
                                    },
                                    {
                                        "columns":[
                                            "unitcode"
                                        ],
                                        "rule":"max"
                                    }

                                ]
                            }
                        },
                        {
                            "name": "addcolumn",
                            "parameters": {
                                "column": {
                                    "dataType": "text",
                                    "id": "indicator_label",
                                    "title": {
                                        "EN": "Purposecode"
                                    }
                                },
                                "value": {
                                    "keys": [
                                        "1=1"
                                    ],
                                    "values": [
                                        "Others"
                                    ]
                                }
                            }
                        },
                        {
                            "name":"filter",
                            "parameters":{
                                "rows":{},
                                "columns":[
                                    "indicator_label",
                                    "value",
                                    "unitcode",
                                    "flowcategory"
                                ]
                            },
                            "rid":{
                                "uid":"filter_others_subsectors"
                            }
                        },
                        {
                            "name": "union",
                            "sid": [
                                {
                                    "uid": "filter_top10_subsectors"
                                },
                                {
                                    "uid": "filter_others_subsectors"
                                }
                            ],
                            "parameters": {},
                            "rid":{
                                "uid":"union_proc"
                            }

                        },
                        {
                            "name": "addcolumn",
                            "sid":[{
                                "uid":"union_proc"
                            }],
                            "parameters": {
                                "column": {
                                    "dataType": "number",
                                    "id": "percent",
                                    "title": {
                                        "EN": "Percentage"
                                    }
                                },
                                "value": {
                                    "keys": [
                                        "1=1"
                                    ],
                                    "values": [
                                        "@@direct value"
                                    ]
                                }
                            }
                        },

                        {
                            "name":"group",
                            "parameters":{
                                "by":[
                                    "indicator_label",
                                    "percent",
                                    "flowcategory"

                                ],
                                "aggregations":[
                                    {
                                        "columns":[
                                            "value"
                                        ],
                                        "rule":"SUM"
                                    },
                                    {
                                        "columns":[
                                            "unitcode"
                                        ],
                                        "rule":"max"
                                    }

                                ]
                            }
                        },


                        {
                            "name": "percentage",

                            "parameters": {
                                "valueColumnId": "percent"
                            }
                        },
                        {
                            "name":"order",
                            "parameters":{
                                "value":"DESC"
                            }
                        }

                    ]

                },
                {
                    id: 'oda-regional', // REGIONAL DISTRIBUTION
                    type: 'chart',
                    config: {
                        type: "column",
                        x: ["indicator"], //x axis
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
                        "filter_regions": ['year', 'oda', 'purposecode']
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
                                                    "NA","ZZZZZ"
                                                ]
                                            }
                                        ]
                                    },
                                    "fao_sector": {
                                        "enumeration": [
                                            "1"
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
                            "name": "addcolumn",
                            "parameters": {
                                "column": {
                                    "dataType": "code",
                                    "id": "indicator",
                                    "title": {
                                        "EN": "Indicator"
                                    },
                                    "domain": {
                                        "codes": [
                                            {
                                                "idCodeList": "crs_dac",
                                                "version": "2016"
                                            }
                                        ]
                                    },
                                    "subject": null
                                },
                                "value": "9999" // PART 1 FINAL INDICATOR NAME
                            }
                        },
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "indicator", "fao_region"
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

                    filterFor: { "filter_map": ['parentsector_code', 'purposecode', 'year', 'oda']},

                    postProcess: [
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_browse_sector_recipient"
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
                                    "fao_sector": {
                                        "enumeration": [
                                            "1"
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