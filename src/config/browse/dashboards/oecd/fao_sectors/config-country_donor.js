/*global define*/

define(function () {

    'use strict';

    return {
        id: 'FAO_SECTOR',
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
                        maxItems: 1,
                       // openOnFocus: false
                    }
                },
                className: "col-sm-5",
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
                        maxItems: 1,
                       // openOnFocus: false
                    }
                },
                className: "col-sm-3",
                cl: {
                    "uid": "crs_fao_regions",
                    "version": "2016",
                    level: 3,
                    levels: 3,
                    "codes": [
                        "831",
                        "832",
                        "836",
                        "859",
                        "860",
                        "845",
                        "856",
                        "861",
                        "862",
                        "880",
                        "866",
                        "870",
                        "872",
                        "854",
                        "625",
                        "666",
                        "630",
                        "728",
                        "730",
                        "740",
                        "645",
                        "738",
                        "745",
                        "751",
                        "655",
                        "753",
                        "635",
                        "660",
                        "665",
                        "755",
                        "640",
                        "764"
                    ],
                },
                template: {
                    hideSwitch: true,
                    hideRemoveButton: true
                },
                dependencies: {
                    "fao_region": {id: "parent", event: "select"}
                }
            },
            donorcode: {
                selector: {
                    id: "dropdown",
                    default: ["1"], // Austria
                    config: { //Selectize configuration
                        maxItems: 1
                    }
                },
                className: "col-sm-3",
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
                    emptyOption : {
                        enabled: true,
                        text: "All",
                        value: "all"
                    },
                    config: { //Selectize configuration
                        maxItems: 1
                        // placeholder: "All",
                        // plugins: ['remove_button'],
                        // mode: 'multi'
                    }
                },
                className: "col-sm-3",
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
                        // placeholder: "All",
                        // plugins: ['remove_button'],
                        // mode: 'multi'
                    }
                },
                className: "col-sm-4",
                cl: {
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
                    ],
                    "uid": "crs_dac",
                    "version": "2016",
                    "levels": 3
                },
                template: {
                    hideSwitch: true,
                    hideRemoveButton: true
                },
                dependencies: {
                    "parentsector_code": {id: "parent", event: "select"}
                }
            },
            "year-from": {
                selector: {
                    id: "dropdown",
                    from: 2000,
                    to: 2014,
                    default: [2000],
                    config: { //Selectize configuration
                        maxItems: 1,
                      //  openOnFocus: false
                    }
                },
                className: "col-sm-2",
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
                    from: 2000,
                    to: 2014,
                    default: [2014],
                    config: {
                        maxItems: 1,
                      //  openOnFocus: false
                    }
                },
                className: "col-sm-2",
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
                className: "col-sm-4",
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
            uid: "adam_usd_aggregated_table",

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
                        "filter_total_ODA": ['fao_region', 'donorcode', 'recipientcode', 'year', 'oda']
                    },

                    postProcess: [
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_usd_aggregated_table"
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
                                                "uid": "crs_oda",
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
                                        "rule": "first"
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
                                "value": "Total ODA from Resource Partner"
                            },
                            "rid": {
                                "uid": "total_donor_oda"
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
                                            if(serie.name == '% Sector/ODA'){
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
                        "filter_total_donor_recipient_oda": ['donorcode', 'fao_region', 'recipientcode', 'year', 'oda'],
                        "filter_total_donor_recipient_sector_oda": ['donorcode', 'fao_region', 'recipientcode', 'year', 'oda'],

                        "filter_total_oda_dac_members_by_year": ['year', 'oda'],
                        "filter_dac_members_by_donor_year": ['fao_region', 'recipientcode', 'year', 'oda']
                    },

                    postProcess: [

                        {
                            "name": "union",
                            "sid": [
                                {
                                    "uid": "total_donor_recipient_oda" // RESULT OF PART 1: TOTAL ODA FROM DONOR TO RECIPIENT
                                },
                                {
                                    "uid": "total_donor_recipient_sector_oda" // RESULT OF PART 2: TOTAL ODA FOR DONOR (ALL RECIPIENTS)
                                },
                                {
                                    "uid":"percentage_ODA" // RESULT OF PART 3: PERCENTAGE CALCULATION (ODA FROM DONOR TO RECIPIENT / TOTAL ODA FROM DONOR x 100)
                                },
                                {
                                    "uid":"OECD_AVG" // RESULT OF PART 4: OECD DONORS (DAC MEMBERS) AVERAGE ODA IN SELECTED SECTOR
                                }
                            ],
                            "parameters": {
                            },
                            "rid":{"uid":"union_process"}

                        }, // PART 5: UNION is the FINAL PART IN THE PROCESS
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_usd_aggregated_table"
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
                                                "uid": "crs_oda",
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
                                    }
                                }
                            },
                            "rid": {
                                "uid": "filter_total_donor_recipient_oda"
                            }
                        }, // PART 1: TOTAL ODA FROM DONOR TO RECIPIENT: (1i) Filter
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
                                        "rule": "first"
                                    }
                                ]
                            },
                            "rid": {
                                "uid": "tt"
                            }
                        }, // (1ii): TOTAL ODA FROM DONOR TO RECIPIENT: Group by
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
                                "value": "Total ODA from Resource Partner to Recipient Country" // PART 1 FINAL INDICATOR NAME
                            },
                            "rid": {
                                "uid": "total_donor_recipient_oda"
                            }
                        }, // (1iii): TOTAL ODA FROM DONOR TO RECIPIENT: Add Column

                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_usd_aggregated_table"
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
                                                "uid": "crs_oda",
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
                                    "fao_sector": {
                                        "enumeration": [
                                            "1"
                                        ]
                                    }
                                }
                            },
                            "rid": {
                                "uid": "filter_total_donor_recipient_sector_oda"
                            }
                        },  // PART 2: TOTAL ODA FROM DONOR TO RECIPIENT FOR SECTOR : (2i) Filter
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
                                        "rule": "first"
                                    }
                                ]
                            },
                            "rid":{"uid":"total_ODA"}
                        }, // (2ii): TOTAL ODA FROM DONOR TO RECIPIENT FOR SECTOR : Group by
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
                                "value": "Total ODA of Sector from Resource Partner in that Recipient Country" // PART 2 FINAL INDICATOR NAME
                            },
                            "rid": {
                                "uid": "total_donor_recipient_sector_oda"
                            }
                        }, // (2iii): TOTAL ODA FROM DONOR TO RECIPIENT FOR SECTOR : Add Column

                        {
                            "name": "join",
                            "sid": [
                                {
                                    "uid": "total_donor_recipient_oda"
                                },
                                {
                                    "uid": "total_donor_recipient_sector_oda"
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
                                    "values":[" ( total_donor_recipient_sector_oda_value / total_donor_recipient_oda_value )*100"]

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
                                "value": "% Sector/ODA" // PART 3 FINAL INDICATOR NAME
                            },
                            "rid": {
                                "uid": "percentage_ODA"
                            }
                        }, // (3vi) PERCENTAGE CALCULATION: Add Column

                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_usd_aggregated_table"
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
                                                "uid": "crs_oda",
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
                                    "fao_sector": {
                                        "enumeration": [
                                            "1"
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
                            "rid": {
                                "uid": "filter_total_oda_dac_members_by_year"
                            }
                        }, // PART 4 OECD DONORS (DAC MEMBERS) AVERAGE ODA: (4i) Filter
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "donorcode",
                                    "year"


                                ],
                                "aggregations": [
                                ]
                            },
                            "rid": {
                                "uid": "sd"
                            }
                        }, // (4ii): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Group by
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
                                            "value_count"
                                        ],
                                        "rule": "SUM"
                                    }
                                ]
                            },
                            "rid": {
                                "uid": "count_dac_members"
                            }
                        },


                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_usd_aggregated_table"
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
                                                "uid": "crs_oda",
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
                                    "fao_sector": {
                                        "enumeration": [
                                            "1"
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
                                                "from": 2000,
                                                "to": 2014
                                            }
                                        ]
                                    }
                                }
                            },
                            "rid":{"uid":"filter_dac_members_by_donor_year"}

                        }, // (4iii): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Filter
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
                                        "rule": "first"
                                    }
                                ]
                            },
                            "rid":{"uid":"aggregated_oecd"}
                        }, // (4v): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Add Column

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
                                "values": [
                                ]
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
                                    "keys":  ["1 = 1"],
                                    "values":[" ( aggregated_oecd_value / count_dac_members_value_count )"]
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
                                "rows": {
                                }
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
                                "value": "OECD Average of ODA in that Sector in that Recipient Country" // PART 4 FINAL INDICATOR NAME
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
                                    load: function(event) {
                                        var _that = this;
                                        var hasSubSector = false;

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
                        "filter_total_donor_recipient_subsector_oda": ['donorcode', 'fao_region', 'recipientcode', 'purposecode', 'year', 'oda'],
                        "filter_total_donor_recipient_sector_oda": ['donorcode', 'fao_region', 'recipientcode', 'year', 'oda'],

                        "filter_total_oda_dac_members_by_year": ['year', 'oda'],
                        "filter_dac_members_by_donor_year": ['fao_region', 'recipientcode', 'purposecode', 'year', 'oda']
                    },

                    postProcess: [

                        {
                            "name": "union",
                            "sid": [
                                {
                                    "uid": "subsector_donor_oda"
                                },
                                {
                                    "uid": "sector_donor_oda"
                                },
                                {
                                    "uid": "percentage_ODA"
                                },
                                {
                                    "uid": "OECD_AVG"

                                }
                            ],
                            "parameters": {
                            }

                        }, // PART 5: UNION is the FINAL PART IN THE PROCESS
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_usd_aggregated_table"
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
                                                "uid": "crs_oda",
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
                                    }

                                }
                            },
                            "rid": {
                                "uid": "filter_total_donor_recipient_subsector_oda"
                            }
                        }, // PART 1: TOTAL ODA FROM DONOR TO RECIPIENT FOR SUB SECTOR: (1i) Filter
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
                                        "rule": "first"
                                    }
                                ]
                            }
                        }, // (1ii): TOTAL ODA FROM DONOR TO RECIPIENT FOR SUB SECTOR: Group by
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
                                "value": "ODA of Sub Sector from Resource Partner in that Country"
                            },
                            "rid": {
                                "uid": "subsector_donor_oda"
                            }
                        }, // (1iii): TOTAL ODA FROM DONOR TO RECIPIENT FOR SUB SECTOR: Add Column

                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_usd_aggregated_table"
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
                                                "uid": "crs_oda",
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
                                    }
                                }
                            },
                            "rid": {
                                "uid": "filter_total_donor_recipient_sector_oda"
                            }
                        },  // PART 2: TOTAL ODA FROM DONOR TO RECIPIENT FOR SECTOR : (2i) Filter
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
                                        "rule": "first"
                                    }
                                ]
                            },
                            "rid":{"uid":"sector_ODA"}
                        }, // (2ii): TOTAL ODA FROM DONOR TO RECIPIENT FOR SECTOR : Group by
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
                                "value": "ODA of Sector from Resource Partner in that Country"
                            },
                            "rid": {
                                "uid": "sector_donor_oda"
                            }
                        }, // (2iii): TOTAL ODA FROM DONOR TO RECIPIENT FOR SECTOR : Add Column

                        {
                            "name": "join",
                            "sid": [
                                {
                                    "uid": "subsector_donor_oda"
                                },
                                {
                                    "uid": "sector_donor_oda"
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
                                    "values":[" ( subsector_donor_oda_value  / sector_donor_oda_value )*100"]

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
                                    "uid": "adam_usd_aggregated_table"
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
                                                "uid": "crs_oda",
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
                                    "fao_sector": {
                                        "enumeration": [
                                            "1"
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
                            "rid": {
                                "uid": "filter_total_oda_dac_members_by_year"
                            }
                        }, // PART 4 OECD DONORS (DAC MEMBERS) AVERAGE ODA: (4i) Filter
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "donorcode",
                                    "year"


                                ],
                                "aggregations": [
                                ]
                            },
                            "rid": {
                                "uid": "sd"
                            }
                        }, // (4ii): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Group by
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
                                            "value_count"
                                        ],
                                        "rule": "SUM"
                                    }
                                ]
                            },
                            "rid": {
                                "uid": "count_dac_members"
                            }
                        },


                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_usd_aggregated_table"
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
                                                "uid": "crs_oda",
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
                                    }
                                }
                            },
                            "rid":{"uid":"filter_dac_members_by_donor_year"}

                        }, // (4iii): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Filter
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
                                        "rule": "first"
                                    }
                                ]
                            },
                            "rid":{"uid":"aggregated_oecd"}
                        }, // (4v): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Add Column

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
                                "values": [
                                ]
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
                                    "keys":  ["1 = 1"],
                                    "values":[" ( aggregated_oecd_value / count_dac_members_value_count )"]
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
                                "rows": {
                                }
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
                                "value": "OECD Average of ODA in that Sub Sector in that Country"
                            },
                            "rid": {
                                "uid": "OECD_AVG"
                            }
                        } // (4x): OECD DONORS (DAC MEMBERS) AVERAGE ODA: Add Column
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
                        "filter_channel": ['donorcode', 'fao_region', 'recipientcode', 'purposecode', 'year', 'oda']
                    },
                    postProcess: [
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_usd_aggregated_table"
                                }
                            ],
                            "parameters": {
                                "rows": {
                                    "fao_sector": {
                                        "enumeration": [
                                            "1"
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
                                    "year": {
                                        "time": [
                                            {
                                                "from": "2000",
                                                "to": "2014"
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
                                    }
                                }
                            },
                            "rid":{"uid":"filter_channel"}
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
                                        "rule": "first"
                                    },
                                    {
                                        "columns": [
                                            "flowcategory"
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
                        "filter_top_10_channels_sum": ['donorcode', 'fao_region', 'recipientcode', 'purposecode', 'year', 'oda'],
                        "filter_top_all_channels_sum": ['donorcode', 'fao_region', 'recipientcode', 'purposecode', 'year', 'oda']
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
                                    "uid": "adam_usd_aggregated_table"
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
                                                "uid": "crs_oda",
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
                                    "fao_sector": {
                                        "enumeration": [
                                            "1"
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
                                        "rule": "first"
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
                        "filter_top_10_sectors": ['fao_region', 'recipientcode', 'donorcode', 'year', 'oda']
                    },

                    postProcess : [
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_usd_aggregated_table"
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
                                                "from": "2000",
                                                "to": "2014"
                                            }
                                        ]
                                    }
                                }
                            },
                            "rid": {
                                "uid": "filter_top_10_sectors"
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
                                        "rule": "first"
                                    },
                                    {
                                        "columns": [
                                            "flowcategory"
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
                        "filter_top_10_sectors_sum": ['fao_region', 'recipientcode', 'donorcode', 'year', 'oda'],
                        "filter_all_sectors_sum": ['fao_region', 'recipientcode', 'donorcode', 'year', 'oda']
                    },

                    postProcess: [
                        {
                            "name": "union",
                            "sid": [
                                {
                                    "uid": "top_10_sectors_sum"
                                    // RESULT OF PART 1: TOTAL ODA for TOP 10 SECTORS
                                },
                                {
                                    "uid": "others"
                                    // RESULT OF PART 3: TOTAL ODA OTHERS CALCULATION (TOTAL ODA ALL SECTORS (PART 2) - TOTAL ODA FOR TOP 10 Sectors)
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
                                    "uid": "adam_usd_aggregated_table"
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
                                                "uid": "crs_oda",
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
                                                "from": 2000,
                                                "to": 2014
                                            }
                                        ]
                                    }
                                }
                            },
                            "rid": {
                                "uid": "filter_top_10_sectors_sum"
                            }
                        },
                        // PART 1: TOTAL ODA for TOP 10 SECTORS: (1i) Filter
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
                                        "rule": "first"
                                    }
                                ]
                            }
                        },
                        // (1ii): TOTAL ODA for TOP 10 SECTORS: Group by
                        {
                            "name": "order",
                            "parameters": {
                                "value": "DESC"
                            },
                            "rid":{"uid":"filtered_dataset"}
                        },
                        // (1iii): TOTAL ODA for TOP 10 SECTORS: Order by
                        {
                            "name": "page",
                            "parameters": {
                                "perPage": 10,
                                "page": 1
                            }
                        },
                        // (1iv): TOTAL ODA for TOP 10 SECTORS: Limit
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
                        // (1vi): TOTAL ODA for TOP 10 SECTORS: Group by
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
                                // PART 1 FINAL INDICATOR NAME
                            },
                            "rid": {
                                "uid": "top_10_sectors_sum"
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
                        // PART 2i: TOTAL ODA for ALL SECTORS: Group by
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
                                // PART 2 FINAL INDICATOR NAME
                            },
                            "rid": {
                                "uid": "top_all_sectors_sum"
                            }
                        },
                        // (2ii): TOTAL ODA for ALL SECTORS : Add Column
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
                        // PART 3: TOTAL ODA OTHERS CALCULATION: (3i) Join
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
                                "value": "Other Sectors"
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
                         "filter_top_subsectors": ['fao_region', 'recipientcode', 'donorcode', 'year', 'oda']
                    },

                    postProcess: [
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_usd_aggregated_table"
                                }
                            ],
                            "parameters": {
                                "rows": {
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
                                "uid": "filter_top_subsectors"
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
                                    },
                                    {
                                        "columns": [
                                            "unitcode"
                                        ],
                                        "rule": "first"
                                    },
                                    {
                                        "columns": [
                                            "flowcategory"
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
                        "filter_recipient": ['donorcode', 'fao_region', 'purposecode', 'year', 'oda']
                    },
                    postProcess: [
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_usd_aggregated_table"
                                }
                            ],
                            "parameters": {
                                "rows": {
                                    "fao_sector": {
                                        "enumeration": [
                                            "1"
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
                                                "from": "2000",
                                                "to": "2014"
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
                                                "uid": "crs_oda",
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
                                    },
                                    {
                                        "columns": [
                                            "flowcategory"
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
                        "filter_top_10_recipients_sum": ['donorcode', 'fao_region', 'purposecode', 'year', 'oda'],
                        "filter_top_all_recipients_sum": ['donorcode', 'fao_region','purposecode', 'year', 'oda']
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
                                    "uid": "adam_usd_aggregated_table"
                                }
                            ],
                            "parameters": {
                                "columns": [
                                    "recipientcode",
                                    "value",
                                    "unitcode"
                                ],
                                "rows": {
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
                                    "fao_sector": {
                                        "enumeration": [
                                            "1"
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
                                        "rule": "first"
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
                }
            ]
        }
    }
});