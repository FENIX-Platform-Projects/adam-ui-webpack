/*global define*/

define(['highcharts','../../../config-base'],function (Highcharts, Config) {

    'use strict';
    return {
        id: 'OTHER_SECTORS',
        type: 'ALL',
        filter: {
            donorcode: {
                selector: {
                    id: "dropdown",
                    default: ["1"], // Austria
                    config: { //Selectize configuration
                        maxItems: 1
                    }
                },
                classNames: "col-xs-3",
                cl: {
                    uid: "crs_donors",
                    version: "2016",
                    level: 1,
                    levels: 1
                },
                template: {
                    hideSwitch: true,
                    hideRemoveButton: true
                }
            },
            parentsector_code: {
                selector: {
                    id: "dropdown",
                    default: ["9999"],
                    emptyOption: {
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
                    emptyOption: {
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
                    "parentsector_code": {
                        id: "parent", event: "select", args: {
                            body: {
                                levels: 3
                            },
                            exclude: ["all"]
                        }
                    }
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
                                    load: function (event) {
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
                                                if (!serie.visible) {
                                                    serie.update({
                                                        showInLegend: false
                                                    })
                                                } else {
                                                    if (serie.options.dataLabels.enabled) {
                                                        serie.update({
                                                            marker: {
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
                            //d2ccbf
                            colors: ["#56adc3", "#5691c3", "#5663c3", "#0F52BA", "#DF3328", "#F1E300", "#F7AE3C"],
                            xAxis: {
                                type: 'datetime'
                            },
                            yAxis: {
                                labels: {
                                    format: '{value:,.0f}'
                                }
                            }
                        }
                    },

                    filterFor: {
                        "filter_total_ODA": ['donorcode', 'year', 'oda']
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
                                    }
                                }
                            },
                            "rid": {"uid": "filter_total_ODA"}
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
                                    load: function (event) {
                                        var _that = this;
                                        var hasSubSector = false;

                                        var isVisible = $.each(_that.series, function (i, serie) {
                                            if (serie.name == '% Sector/Total') {
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

                                        if (!isVisible) {
                                            this.options.yAxis[1].title.text = '';
                                            this.yAxis[1].visible = false;
                                            this.yAxis[1].isDirty = true;
                                            this.redraw();
                                        } else {
                                            this.options.yAxis[1].title.text = '%';
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
                                                if (!serie.visible) {
                                                    serie.update({
                                                        showInLegend: false
                                                    })
                                                } else {
                                                    if (serie.options.dataLabels.enabled) {
                                                        serie.update({
                                                            marker: {
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
                            //d2ccbf
                            colors: ["#56adc3", "#5691c3", "#5663c3", "#0F52BA", "#DF3328", "#F1E300", "#F7AE3C"],
                            xAxis: {
                                type: 'datetime'
                            },
                            yAxis: [{
                                //Primary Axis in default template
                                labels: {
                                    format: '{value:,.0f}'
                                }
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
                        "filter_donor_sector_oda": ['donorcode', 'year', 'oda'],
                        "filter_total_donor_oda": ['donorcode', 'year', 'oda'],

                        "filter_total_oda_dac_members_by_year": ['year', 'oda'],
                        "filter_dac_members_by_donor_year": ['year', 'oda']
                    },

                    postProcess: [

                        {
                            "name": "union",
                            "sid": [
                                {
                                    "uid": "donor_sector_oda" // RESULT OF PART 1: TOTAL ODA FROM DONOR IN SECTOR
                                },
                                {
                                    "uid": "total_donor_oda" // RESULT OF PART 2: TOTAL ODA FOR DONOR (ALL SECTORS)
                                },
                                {
                                    "uid": "percentage_ODA" // RESULT OF PART 3: PERCENTAGE CALCULATION (ODA FROM DONOR IN SECTOR / TOTAL ODA FROM DONOR x 100)
                                },
                                {
                                    "uid": "OECD_AVG" // RESULT OF PART 4: OECD DONORS (DAC MEMBERS) AVERAGE ODA IN SELECTED SECTOR
                                }
                            ],
                            "parameters": {},
                            "rid": {"uid": "union_process"}

                        }, // PART 5: UNION is the FINAL PART IN THE PROCESS
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
                                    }
                                }
                            },
                            "rid": {
                                "uid": "filter_donor_sector_oda"
                            }
                        }, // PART 1: TOTAL ODA FROM DONOR IN SECTOR: (1i) Filter
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
                                "uid": "tt"
                            }
                        }, // (1ii): TOTAL ODA FROM DONOR IN SECTOR: Group by
                        {
                            "name": "addcolumn",
                            "sid": [
                                {
                                    "uid": "tt"
                                }
                            ],
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
                                "value": "ODA from Resource Partner in Sector" // PART 1 FINAL INDICATOR NAME
                            },
                            "rid": {
                                "uid": "donor_sector_oda"
                            }
                        }, // (1iii): TOTAL ODA FROM DONOR IN SECTOR: Add Column

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
                                    }
                                }
                            },
                            "rid": {
                                "uid": "filter_total_donor_oda"
                            }
                        },  // PART 2: TOTAL ODA FOR DONOR: (2i) Filter
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
                            "rid": {"uid": "total_ODA"}

                        }, // (2ii): TOTAL ODA FOR DONOR: Group by
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
                                "value": "Total ODA from Resource Partner" // PART 2 FINAL INDICATOR NAME
                            },
                            "rid": {
                                "uid": "total_donor_oda"
                            }
                        }, // (2iii): TOTAL ODA FOR DONOR: Add Column

                        {
                            "name": "join",
                            "sid": [
                                {
                                    "uid": "donor_sector_oda"
                                },
                                {
                                    "uid": "total_donor_oda"
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
                            "rid": {"uid": "join_process"}
                        }, // PART 3 PERCENTAGE CALCULATION: (3i) Join
                        {
                            "name": "addcolumn",
                            "sid": [{"uid": "join_process"}],
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
                                    "keys": ["1 = 1"],
                                    "values": ["@@direct ( donor_sector_oda_value / total_donor_oda_value )*100"]

                                }
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
                        }, // (3vi) PERCENTAGE CALCULATION: Add Column

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
                                    "dac_member": {
                                        "enumeration": [
                                            "t"
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
                                "uid": "filter_total_oda_dac_members_by_year"
                            }
                        }, // PART 4 OECD DONORS (DAC MEMBERS) AVERAGE ODA: (4i) Filter
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
                            "rid": {"uid": "aggregated_oecd"}
                        }, // (4ii): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Group by

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
                                    "donorcode"
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
                                    "dac_member": {
                                        "enumeration": [
                                            "t"
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
                            "rid": {"uid": "filter_dac_members_by_donor_year"}

                        }, // (4iii): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Filter
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "donorcode",
                                    "year"
                                ],
                                "aggregations": []
                            },
                            "rid": {
                                "uid": "sd"
                            }
                        }, // (4iv): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Group by
                        {
                            "name": "addcolumn",
                            "parameters": {
                                "column": {
                                    "dataType": "number",
                                    "id": "value_count",
                                    "title": {
                                        "EN": "Value"
                                    },
                                    "subject": null
                                },
                                "value": 1
                            },
                            "rid": {
                                "uid": "percentage_Value"
                            }
                        }, // (4v): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Add Column
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "year"
                                ],
                                "aggregations": [
                                    {
                                        "columns": [
                                            "value_count"
                                        ],
                                        "rule": "SUM"
                                    }
                                ]
                            },
                            "rid": {
                                "uid": "count_dac_members"
                            }
                        }, // (4vi): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Group by

                        {
                            "name": "join",
                            "sid": [
                                {
                                    "uid": "count_dac_members"
                                },
                                {
                                    "uid": "aggregated_oecd"
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
                            }
                        }, // (4vii): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Join
                        {
                            "name": "addcolumn",
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
                                    "keys": ["1 = 1"],
                                    "values": ["@@direct ( aggregated_oecd_value / count_dac_members_value_count )"]
                                }
                            },
                            "rid": {
                                "uid": "avg_value"
                            }
                        }, // (4viii): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Add Column
                        {
                            "name": "filter",
                            "parameters": {
                                "columns": [
                                    "year",
                                    "value",
                                    "aggregated_oecd_unitcode"
                                ],
                                "rows": {}
                            }
                        }, // (4ix): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Filter
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
                                "value": "OECD Average of ODA in Sector" // PART 4 FINAL INDICATOR NAME
                            },
                            "rid": {
                                "uid": "OECD_AVG"
                            }
                        } // (4x): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Add Column
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
                                    load: function (event) {
                                        var _that = this;
                                        var hasSubSector = false;

                                        var isVisible = $.each(_that.series, function (i, serie) {
                                            if (serie.name == '% Sub Sector/Sector') {
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

                                        if (!isVisible) {
                                            this.options.yAxis[1].title.text = '';
                                            this.yAxis[1].visible = false;
                                            this.yAxis[1].isDirty = true;
                                            this.redraw();
                                        } else {
                                            this.options.yAxis[1].title.text = '%';
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
                                                if (!serie.visible) {
                                                    serie.update({
                                                        showInLegend: false
                                                    })
                                                } else {
                                                    if (serie.options.dataLabels.enabled) {
                                                        serie.update({
                                                            marker: {
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
                            //d2ccbf
                            colors: ["#56adc3", "#5691c3", "#5663c3", "#0F52BA", "#DF3328", "#F1E300", "#F7AE3C"],
                            yAxis: [{
                                //Primary Axis in default template
                                labels: {
                                    format: '{value:,.0f}'
                                }
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
                        "filter_donor_sector_oda": ['donorcode', 'year', 'oda'],
                        "filter_donor_subsector_oda": ['donorcode', 'purposecode', 'year', 'oda'],
                        "filter_total_oda_dac_members_by_year": ['purposecode', 'year', 'oda'],
                        "filter_dac_members_by_donor_year": ['year', 'oda']
                    },

                    postProcess: [

                        {
                            "name": "union",
                            "sid": [
                                {
                                    "uid": "donor_sector_oda" // RESULT OF PART 1: TOTAL ODA FROM DONOR IN SECTOR
                                },
                                {
                                    "uid": "donor_subsector_oda" // RESULT OF PART 2: TOTAL ODA FOR DONOR (ALL SECTORS)
                                },
                                {
                                    "uid": "percentage_ODA" // RESULT OF PART 3: PERCENTAGE CALCULATION (ODA FROM DONOR IN SECTOR / TOTAL ODA FROM DONOR x 100)
                                },
                                {
                                    "uid": "OECD_AVG" // RESULT OF PART 4: OECD DONORS (DAC MEMBERS) AVERAGE ODA IN SELECTED SECTOR
                                }
                            ],
                            "parameters": {},
                            "rid": {"uid": "union_process"}

                        }, // PART 5: UNION is the FINAL PART IN THE PROCESS
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
                                    }
                                }
                            },
                            "rid": {
                                "uid": "filter_donor_sector_oda"
                            }
                        }, // PART 1: TOTAL ODA FROM DONOR IN SECTOR: (1i) Filter
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
                        }, // (1ii): TOTAL ODA FROM DONOR IN SECTOR: Group by
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
                                "value": "ODA from Resource Partner in Sector" // PART 1 FINAL INDICATOR NAME
                            },
                            "rid": {
                                "uid": "donor_sector_oda"
                            }
                        }, // (1iii): TOTAL ODA FROM DONOR IN SECTOR: Add Column

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
                                    }
                                }
                            },
                            "rid": {
                                "uid": "filter_donor_subsector_oda"
                            }
                        },  // PART 2: TOTAL ODA FOR DONOR: (2i) Filter
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
                            "rid": {"uid": "total_ODA"}

                        }, // (2ii): TOTAL ODA FOR DONOR: Group by
                        {
                            "name": "addcolumn",
                            "sid": [
                                {
                                    "uid": "total_ODA"
                                }
                            ],
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
                                "value": "Total ODA from Resource Partner in Sub Sector" // PART 2 FINAL INDICATOR NAME
                            },
                            "rid": {
                                "uid": "donor_subsector_oda"
                            }
                        }, // (2iii): TOTAL ODA FOR DONOR: Add Column

                        {
                            "name": "join",
                            "sid": [
                                {
                                    "uid": "donor_sector_oda"
                                },
                                {
                                    "uid": "donor_subsector_oda"
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
                            "rid": {"uid": "join_process"}
                        }, // PART 3 PERCENTAGE CALCULATION: (3i) Join
                        {
                            "name": "addcolumn",
                            "sid": [{"uid": "join_process"}],
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
                                    "keys": ["1 = 1"],
                                    "values": ["@@direct ( donor_subsector_oda_value / donor_sector_oda_value )*100"]

                                }
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
                        }, // (3vi) PERCENTAGE CALCULATION: Add Column

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
                                    "dac_member": {
                                        "enumeration": [
                                            "t"
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
                                "uid": "filter_total_oda_dac_members_by_year"
                            }
                        }, // PART 4 OECD DONORS (DAC MEMBERS) AVERAGE ODA: (4i) Filter
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
                            "rid": {"uid": "aggregated_oecd"}
                        }, // (4ii): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Group by

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
                                    "donorcode"
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
                                    "dac_member": {
                                        "enumeration": [
                                            "t"
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
                            "rid": {"uid": "filter_dac_members_by_donor_year"}

                        }, // (4iii): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Filter
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "donorcode",
                                    "year"
                                ],
                                "aggregations": []
                            },
                            "rid": {
                                "uid": "sd"
                            }
                        }, // (4iv): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Group by
                        {
                            "name": "addcolumn",
                            "parameters": {
                                "column": {
                                    "dataType": "number",
                                    "id": "value_count",
                                    "title": {
                                        "EN": "Value"
                                    },
                                    "subject": null
                                },
                                "value": 1
                            },
                            "rid": {
                                "uid": "percentage_Value"
                            }
                        }, // (4v): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Add Column
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "year"
                                ],
                                "aggregations": [
                                    {
                                        "columns": [
                                            "value_count"
                                        ],
                                        "rule": "SUM"
                                    }
                                ]
                            },
                            "rid": {
                                "uid": "count_dac_members"
                            }
                        }, // (4vi): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Group by

                        {
                            "name": "join",
                            "sid": [
                                {
                                    "uid": "count_dac_members"
                                },
                                {
                                    "uid": "aggregated_oecd"
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
                            }
                        }, // (4vii): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Join
                        {
                            "name": "addcolumn",
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
                                    "keys": ["1 = 1"],
                                    "values": ["@@direct ( aggregated_oecd_value / count_dac_members_value_count )"]
                                }
                            },
                            "rid": {
                                "uid": "avg_value"
                            }
                        }, // (4viii): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Add Column
                        {
                            "name": "filter",
                            "parameters": {
                                "columns": [
                                    "year",
                                    "value",
                                    "aggregated_oecd_unitcode"
                                ],
                                "rows": {}
                            }
                        }, // (4ix): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Filter
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
                                "value": "OECD Average of ODA in that Sub Sector" // PART 4 FINAL INDICATOR NAME
                            },
                            "rid": {
                                "uid": "OECD_AVG"
                            }
                        } // (4x): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Add Column
                    ]
                },
                {
                    id: "tot-oda-gni", //ref [data-item=':id']
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
                                    load: function (event) {
                                        var _that = this;
                                        var hasSubSector = false;

                                        var colors = ["#56adc3", "#5691c3", "#5663c3", "#0F52BA", "#DF3328", "#F1E300", "#F7AE3C"]

                                        var isVisible = $.each(_that.series, function (i, serie) {
                                            if (serie.name == '% ODA/GNI') {
                                                serie.update({
                                                    yAxis: 'percent-axis',
                                                    dashStyle: 'shortdot',
                                                    marker: {
                                                        radius: 3
                                                    }
                                                });

                                                return true;
                                            }
                                        });


                                        var isVisible2 = $.each(_that.series, function (i, serie) {
                                            if (serie.name == '% OECD Average of ODA/GNI') {
                                                serie.update({
                                                    yAxis: 'percent-axis',
                                                    dashStyle: 'shortdot',
                                                    marker: {
                                                        radius: 3
                                                    }
                                                });

                                                return true;
                                            }
                                        });


                                        if (!isVisible && !isVisible2) {
                                            this.options.yAxis[1].title.text = '';
                                            this.yAxis[1].visible = false;
                                            this.yAxis[1].isDirty = true;
                                            this.redraw();
                                        }
                                        else {
                                            if (isVisible || isVisible2) {
                                                this.options.yAxis[1].title.text = '%';
                                                this.yAxis[1].visible = true;
                                                this.yAxis[1].isDirty = true;
                                                this.redraw();
                                            }
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
                                                if (!serie.visible) {
                                                    serie.update({
                                                        showInLegend: false
                                                    })
                                                } else {
                                                    if (serie.options.dataLabels.enabled) {
                                                        serie.update({
                                                            marker: {
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
                            //d2ccbf
                            colors: ["#56adc3", "#5691c3", "#5663c3", "#0F52BA", "#DF3328", "#F1E300", "#F7AE3C"],
                            xAxis: {
                                type: 'datetime'
                            },
                            yAxis: [{
                                //Primary Axis in default template
                                labels: {
                                    format: '{value:,.0f}'
                                }
                            }, { // Secondary Axis
                                id: 'percent-axis',
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
                        "filter_total_ODA": ['donorcode', 'year', 'oda'],
                        "filter_gni_donor_oda": ['donorcode', 'year'],

                        "all_subsectors_sum": ['year', 'oda'],
                        "filter_GNI_sum": ['year']
                    },

                    postProcess: [

                        {
                            "name": "union",
                            "sid": [
                                {
                                    "uid": "total_donor_oda"
                                },
                                {
                                    "uid": "gni_donor_oda"
                                },
                                {
                                    "uid": "ODA_on_GNI"
                                },
                                {
                                    "uid": "oecd_oda_gni"
                                }
                            ],
                            "parameters": {},
                            "rid": {"uid": "union_process"}
                        },

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
                                    }
                                }
                            },
                            "rid": {"uid": "filter_total_ODA"}
                        }, // PART 1: TOTAL ODA FOR DONOR (ALL SECTORS): (1i) Filter
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
                            "rid": {"uid": "total_ODA"}
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
                                "value": "Total ODA from Resource Partner"
                            },
                            "rid": {
                                "uid": "total_donor_oda"
                            }
                        },


                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_donors_gni"
                                }
                            ],
                            "parameters": {
                                "columns": [
                                    "year",
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
                                    }
                                }
                            },
                            "rid": {
                                "uid": "filter_gni_donor_oda"
                            }
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
                                "value": "Resource Partner GNI"
                            },
                            "rid": {
                                "uid": "gni_donor_oda"
                            }
                        },


                        {
                            "name": "join",
                            "sid": [
                                {
                                    "uid": "gni_donor_oda"
                                },
                                {
                                    "uid": "total_donor_oda"
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
                            "rid": {"uid": "join_process_oda_gni"}
                        },
                        {
                            "name": "addcolumn",
                            "sid": [{"uid": "join_process_oda_gni"}],
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
                                    "keys": ["1 = 1"],
                                    "values": ["@@direct ( total_donor_oda_value / gni_donor_oda_value)*100"]
                                }
                            }
                        },
                        {
                            "name": "filter",
                            "parameters": {
                                "columns": [
                                    "year",
                                    "value"
                                ],
                                "rows": {}
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
                                    "subject": "um"
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
                                "value": "% ODA/GNI"
                            },
                            "rid": {
                                "uid": "ODA_on_GNI"
                            }
                        },

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
                                    "dac_member": {
                                        "enumeration": [
                                            "t"
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
                            "rid": {"uid": "all_subsectors_sum"}
                        },
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_donors_gni"
                                }
                            ],
                            "parameters": {
                                "columns": [
                                    "year",
                                    "value",
                                    "unitcode"
                                ],
                                "rows": {
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
                                "uid": "filter_GNI_sum"
                            }
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
                                "uid": "GNI_sum"
                            }
                        },
                        {
                            "name": "join",
                            "sid": [
                                {
                                    "uid": "GNI_sum"
                                },
                                {
                                    "uid": "all_subsectors_sum"
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
                                "uid": "join_oecd_avg"
                            }
                        },
                        {
                            "name": "addcolumn",
                            "sid": [
                                {
                                    "uid": "join_oecd_avg"
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
                                        "@@direct ( all_subsectors_sum_value / GNI_sum_value)*100"
                                    ]
                                }
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
                                "value": "% OECD Average of ODA/GNI"
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
                                    "dataType": "code"
                                },
                                "value": "percentage"
                            }
                        },
                        {
                            "name": "filter",
                            "parameters": {
                                "columns": [
                                    "year",
                                    "value",
                                    "unitcode",
                                    "indicator"
                                ]
                            },
                            "rid": {
                                "uid": "oecd_oda_gni"
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
                            },
                            yAxis: {
                                labels: {
                                    format: '{value:,.0f}'
                                },
                                title: {
                                    text: 'USD Millions',
                                    enabled: true
                                }
                            }
                        }

                    },


                    filterFor: {
                        "filter_recipients": ['donorcode','purposecode', 'year', 'oda']
                    },


                    postProcess: [
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_browse_donor_recipient"
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
                                                    "298", "498", "798", "89", "589", "889", "189", "289", "389", "380", "489", "789", "689", "619", "679"
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
                                    "purposecode": {
                                        "codes": [{
                                            "uid": "crs_purposes",
                                            "version": "2016",
                                            "codes": ["31195"]
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
                            "rid": {"uid": "filter_recipients"}
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
                        "filter_top_10_recipients_sum": ['donorcode', 'purposecode', 'year', 'oda'],
                        "filter_all_recipients_sum": ['donorcode', 'purposecode', 'year', 'oda']
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
                            "rid": {"uid": "union_process"}
                        },

                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_browse_donor_recipient"
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
                                                    "298", "498", "798", "89", "589", "889", "189", "289", "389", "380", "489", "789", "689", "619", "679"
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
                                    "purposecode": {
                                        "codes": [{
                                            "uid": "crs_purposes",
                                            "version": "2016",
                                            "codes": ["31195"]
                                        }]
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
                            "rid": {"uid": "filter_top_10_recipients_sum"}
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
                            "rid": {"uid": "join_process_total_recipients"}
                        },
                        {
                            "name": "addcolumn",
                            "sid": [{"uid": "join_process_total_recipients"}],
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
                                    "keys": ["1 = 1"],
                                    "values": ["@@direct top_all_recipients_sum_value - top_10_recipients_sum_value"]
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
                            },
                            yAxis: {
                                labels: {
                                    format: '{value:,.0f}'
                                },
                                title: {
                                    text: 'USD Millions',
                                    enabled: true
                                }
                            }
                        }

                    },

                    filterFor: {
                        "filter_sectors": ['donorcode', 'year', 'oda']
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
                            "rid": {"uid": "filter_sectors"}
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
                        "filter_top_10_sectors_sum": ['donorcode', 'year', 'oda'],
                        "filter_top_all_sectors_sum": ['donorcode', 'year', 'oda']
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
                                    "uid": "adam_browse_sector_oda"
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
                                "value": "Top Sectors"
                            },
                            "rid": {
                                "uid": "top_10_sectors_sum"
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
                                        "@@direct top_all_sectors_sum_value - top_10_sectors_sum_value"
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
                    id: 'top-channels', // TOP CHANNEL OF DELIVERY CATEGORIES
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
                            },
                            yAxis: {
                                labels: {
                                    format: '{value:,.0f}'
                                },
                                title: {
                                    text: 'USD Millions',
                                    enabled: true
                                }
                            }
                        }

                    },


                    filterFor: {
                        "filter_channels": ['donorcode', 'purposecode', 'year', 'oda']
                    },


                    postProcess: [
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_browse_donor_subcategory"
                                }
                            ],
                            "parameters": {
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
                            "rid": {"uid": "filter_channels"}
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
                        "filter_top_10_channels_sum": ['donorcode', 'purposecode', 'year', 'oda'],
                        "filter_all_channels_sum": ['donorcode', 'purposecode', 'year', 'oda']
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
                            "rid": {"uid": "union_process"}
                        },

                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_browse_donor_subcategory"
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
                                    }
                                }
                            },
                            "rid": {"uid": "filter_top_10_channels_sum"}
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
                            "rid": {"uid": "join_process_total_channels"}
                        },
                        {
                            "name": "addcolumn",
                            "sid": [{"uid": "join_process_total_channels"}],
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
                                    "keys": ["1 = 1"],
                                    "values": ["@@direct top_all_channels_sum_value - top_10_channels_sum_value"]
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
                        "filter_subsectors": ['donorcode', 'year', 'oda']
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
                            "rid": {
                                "uid": "filter_subsectors"
                            }
                        },
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "purposecode",
                                    "flowcategory"
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
                            }
                        },
                        {
                            "name": "page",
                            "parameters": {
                                "perPage": 10,
                                "page": 1
                            },
                            "rid": {
                                "uid": "top10Subs"
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
                                        "@@direct purposecode_EN"
                                    ]
                                }
                            }
                        },
                        {
                            "name": "filter",
                            "parameters": {
                                "rows": {},
                                "columns": [
                                    "indicator_label",
                                    "value",
                                    "unitcode",
                                    "flowcategory"
                                ]
                            },
                            "rid": {
                                "uid": "filter_top10_subsectors"
                            }
                        },
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "filter_subsectors"
                                },
                                {
                                    "uid": "top10Subs"
                                }
                            ],
                            "parameters": {
                                "rows": {
                                    "!purposecode": {
                                        "tables": [
                                            {
                                                "uid": "top10Subs",
                                                "column": "purposecode"
                                            }
                                        ]
                                    }
                                }
                            }
                        },
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "unitcode",
                                    "flowcategory"
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
                            "name": "filter",
                            "parameters": {
                                "rows": {},
                                "columns": [
                                    "indicator_label",
                                    "value",
                                    "unitcode",
                                    "flowcategory"
                                ]
                            },
                            "rid": {
                                "uid": "filter_others_subsectors"
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
                            "rid": {
                                "uid": "union_proc"
                            }
                        },
                        {
                            "name": "addcolumn",
                            "sid": [
                                {
                                    "uid": "union_proc"
                                }
                            ],
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
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "indicator_label",
                                    "percent",
                                    "flowcategory"
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
                            "name": "percentage",
                            "parameters": {
                                "valueColumnId": "percent"
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
                    id: 'oda-regional', // REGIONAL DISTRIBUTION
                    type: 'chart',
                    config: {
                        type: "column",
                        x: ["donorcode"], //x axis
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
                            },
                            colors: ["#56adc3", "#5691c3", "#5663c3", "#0F52BA", "#DF3328", "#F7AE3C"]
                        }
                    },

                    filterFor: {
                        "filter_fao_region": ['donorcode', 'year', 'purposecode', 'oda']
                    },

                    postProcess: [
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_browse_donor_faoregion"
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
                            "rid": {"uid": "filter_fao_region"}
                        },
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "donorcode", "fao_region"
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

                    filterFor: {"filter_map_region": ['donorcode', 'purposecode', 'year', 'oda']},
                    postProcess: [
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_browse_recipient_donor"
                                }
                            ],
                            "parameters": {
                                "columns": ["gaul0", "value", "unitcode"],
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
                                    }
                                }
                            },
                            "rid": {"uid": "filter_map_region"}
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