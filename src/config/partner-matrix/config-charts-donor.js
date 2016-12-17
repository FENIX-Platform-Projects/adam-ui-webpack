/*global define*/

define(function () {

    'use strict';

    return {

        dashboard: {

            //default dataset id
            uid: "adam_resource_matrix_oda",

            items: [
                {
                    id: "top-recipients-fao-oda",
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
                                marginTop: 50,
                                events: {
                                    load: function(event) {
                                        var _that = this;
                                        var hasSubSector = false;

                                        var isVisible = $.each(_that.series, function (i, serie) {
                                            if(serie.name == '% FAO Sectors/Total'){
                                                serie.update({
                                                    yAxis: 'fao-axis',
                                                    type: 'spline',
                                                    dashStyle: 'shortdot',
                                                    tooltip: {
                                                        valueSuffix: ' %'
                                                    },
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
                          //  xAxis: {
                           //     type: 'datetime'
                          //  },
                            yAxis: [{ //Primary Axis in default template
                            }, { // Secondary Axis
                                id: 'fao-axis',
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
                       "filter_top_10": ['year', 'oda', 'donorcode'],
                       "filter_fao_sector": ['year', 'oda'],
                       "filter_total_oda": ['year', 'oda']
                   },

                  postProcess: [
                      {
                          "name": "union",
                          "sid": [
                              {
                                  "uid": "fao_sector"
                              },
                              {
                                  "uid":"total_oda"
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
                          "name": "order",
                          "parameters": {
                              "indicator": "DESC",
                              "value": "DESC"
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
                                  "value"
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
                                  "oda": {
                                      "enumeration": [
                                          "usd_commitment"
                                      ]
                                  }
                              }
                          },
                          "rid":{"uid":"filter_top_10"}
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
                          "rid":{"uid":"top_10"}
                      },

                      {
                          "name": "filter",
                          "sid": [
                              {
                                  "uid": "adam_resource_matrix_oda"
                              },
                              {
                                  "uid": "top_10"
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
                                      "enumeration": [
                                          "usd_commitment"
                                      ]
                                  },
                                  "recipientcode": {
                                      "tables":[
                                          {
                                              "uid":"top_10",
                                              "column":"recipientcode"
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
                          "rid":{"uid":"filter_fao_sector"}
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
                                      "rule": "MAX"
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
                              "value": "ODA in FAO sectors"
                          },
                          "rid":{"uid":"fao_sector"}

                      },


                      {
                          "name": "filter",
                          "sid": [
                              {
                                  "uid": "adam_resource_matrix_oda"
                              },
                              {
                                  "uid": "top_10"
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
                                      "enumeration": [
                                          "usd_commitment"
                                      ]
                                  },
                                  "recipientcode": {
                                      "tables":[
                                          {
                                              "uid":"top_10",
                                              "column":"recipientcode"
                                          }
                                      ]
                                  }
                              }
                          },
                          "rid":{"uid":"filter_total_oda"}
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
                                      "rule": "MAX"
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
                              "value": "Total ODA"
                          },
                          "rid":{"uid":"total_oda"}
                      },

                      {
                          "name": "join",
                          "sid": [
                              {
                                  "uid": "total_oda"
                              },
                              {
                                  "uid": "fao_sector"
                              }
                          ],
                          "parameters": {
                              "joins": [
                                  [
                                      {
                                          "type": "id",
                                          "value": "recipientcode"
                                      }
                                  ],
                                  [
                                      {
                                          "type": "id",
                                          "value": "recipientcode"
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
                                  "values":[" ( fao_sector_value / total_oda_value )*100"]

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
                              "value": "% FAO Sectors/Total"
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
                }, // FAO SECTORS and TOTAL ODA by TOP 10 RESOURCE PARTNERS
            /*    {
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
                }, // TOP CHANNELS*/
                {
                    id: "top-recipients", //ref [data-item=':id']
                    type: "chart", //chart || map || olap,
                    config: {
                        type: "line",
                        x: ["year"], //x axis
                        series: ["recipientcode_EN"], // series
                        y: ["value"],//Y dimension
                        aggregationFn: {"value": "sum"},
                        useDimensionLabelsIfExist: false,// || default raw else fenixtool

                        config: {
                            xAxis: {
                                type: 'datetime'
                            },
                            chart: {
                                marginTop: 50
                            },
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

                    filterFor: { //FX-filter format
                        filter_top_5: ["year", "oda", "donorcode"],
                        filter_2: ["year", "oda", "donorcode"]
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
                                    "value"
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
                            "rid":{"uid":"filter_top_5"}
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
                                "perPage": 5,
                                "page": 1
                            },
                            "rid":{"uid":"top_5"}
                        },
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_resource_matrix_oda"
                                },
                                {
                                    "uid": "top_5"
                                }
                            ],
                            "parameters": {
                                "columns": [
                                    "recipientcode",
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
                                    "recipientcode":{
                                        "tables":[
                                            {
                                                "uid":"top_5",
                                                "column":"recipientcode"
                                            }
                                        ]
                                    }

                                }
                            },
                            "rid":{"uid":"filter_2"}
                        }
                    ]
                }, // TOTAL ODA from TOP 5 RESOURCE PARTNERS

                {
                    id: "top-fao-recipients", //ref [data-item=':id']
                    type: "chart", //chart || map || olap,
                    config: {
                        type: "line",
                        x: ["year"], //x axis
                        series: ["recipientcode_EN"], // series
                        y: ["value"],//Y dimension
                        aggregationFn: {"value": "sum"},
                        useDimensionLabelsIfExist: false,// || default raw else fenixtool

                        config: {
                            xAxis: {
                                type: 'datetime'
                            },

                            chart: {
                                marginTop: 50
                            },
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

                    filterFor: { //FX-filter format
                        filter_top_5: ["year", "oda", "donorcode"],
                        filter_2: ["year", "oda", "donorcode"]
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
                                    "value"
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
                            "rid":{"uid":"filter_top_5"}
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
                                "perPage": 5,
                                "page": 1
                            },
                            "rid":{"uid":"top_5"}
                        },
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_resource_matrix_oda"
                                },
                                {
                                    "uid": "top_5"
                                }
                            ],
                            "parameters": {
                                "columns": [
                                    "recipientcode",
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
                                    "recipientcode":{
                                        "tables":[
                                            {
                                                "uid":"top_5",
                                                "column":"recipientcode"
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
                            "rid":{"uid":"filter_2"}
                        }
                    ]}
            ]
        }
    }
});