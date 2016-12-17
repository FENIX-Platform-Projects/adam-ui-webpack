/*global define*/

define(function () {

    'use strict';

    return {

        dashboard: {
            //default dataset id
            uid: "adam_resource_matrix_oda",

            items: [
                {
                    id: "tot-fao-oda",
                    type: 'chart',
                    config: {
                        type: "line",
                        x: ["year"], //x axis
                        series: ["indicator"], // series
                        y: ["value"],//Y dimension
                        aggregationFn: {"value": "sum"},
                        useDimensionLabelsIfExist: false,// || default raw else fenixtool

                        config: {
                            chart: {
                                marginTop: 50,
                                events: {
                                    load: function(event) {
                                        var _that = this;
                                        var hasSubSector = false;

                                        var isVisible = $.each(_that.series, function (i, serie) {
                                            if(serie.name == '% FAO Sectors/Total ODA'){
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
                            },
                            subtitle: {
                                text: ''
                            }

                        }

                    },
                    filterFor: {
                        "filter_all_subsectors_sum": ['year', 'oda', 'recipientcode', 'donorcode'],
                        "filter_related_oda": ['year', 'oda', 'recipientcode', 'donorcode']
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
                            "rid": {
                                "uid": "filter_all_subsectors_sum"
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
                                "uid": "all_subsectors_sum"
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
                                "value": "Total ODA"
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
                            "rid": {
                                "uid": "filter_related_oda"
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
                            }},
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
                                "value": "ODA in FAO Sectors"
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
                                "value": "% FAO Sectors/Total ODA"
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
                                ],
                                "rows": {
                                }
                            },
                            "rid": {
                                "uid": "percentage_oda"
                            }
                        }


                    ]
                }, // FAO SECTORS and TOTAL ODA by TOP 10 RESOURCE PARTNERS
          /*   {
                    id: 'top-channel-categories',
                    type: 'chart',
                    config: {
                        type: "pieold",
                        x: ["channelsubcategory_name"], //x axis and series
                        series: ["flowcategory_name"], // series
                        y: ["value"],//Y dimension
                        aggregationFn: {"value": "sum"},
                        useDimensionLabelsIfExist: false,// || default raw else fenixtool
                        config: {
                            chart: {
                                events: {
                                    load: function (event) {
                                        if (this.options.chart.forExport) {
                                            Highcharts.each(this.series, function (series) {
                                                series.update({
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
                            },
                            subtitle: {
                                text: ''
                            }
                        }

                    },
                    filter: { //FX-filter format
                        recipientcode: ["625"],
                        donorcode: ["1"],
                        year: [{value: "2000", parent: 'from'}, {value: "2014", parent: 'to'}]
                    },
                    postProcess: [
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "channelsubcategory_name"
                                ],
                                "aggregations": [
                                    {
                                        "columns": ["value"],
                                        "rule": "SUM"
                                    },
                                    {
                                        "columns": ["unitcode"],
                                        "rule": "first"
                                    },
                                    {
                                        "columns": ["flowcategory_name"],
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
                                "perPage": 10,  //top 10
                                "page": 1
                            }
                        }]
                } // TOP CHANNELS*/
            ]
        }
    }
});