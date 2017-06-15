/*global define*/

define(['highcharts', '../config-base'],function (Highcharts, Config) {

    'use strict';

    return {
        filter: {
            donorcode: {
                selector: {
                    id: "dropdown",
                    default: ["1"], // Austria
                    config: { //Selectize configuration
                        maxItems: 1
                    }
                },
                classNames: "col-xs-6",
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
                                marginTop: 60,
                                spacing: [10, 10, 27, 10], // was [10, 10, 15, 10]

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
                            title: {
                                text: 'Total ODA - Disbursements Constant Prices for 2014 (USD Mil)',
                                align: 'center'

                            },
                            subtitle: {
                                text: 'Source: OECD-CRS',
                                align: 'center'

                            },
                            legend: {
                                enabled: false
                            },
                            xAxis: {
                                type: 'datetime',
                                gridLineColor: 'transparent'
                            },
                            yAxis: {
                                gridLineColor: 'transparent',
                                labels: {
                                    format: '{value:,.0f}'
                                }
                            },
                            exporting: {
                                filename: 'tot_oda_chart',
                                chartOptions: {
                                    chart: {
                                        style: {
                                            fontFamily: 'Helvetica',
                                            fontWeight: 'bold'
                                        }
                                    },
                                    xAxis: {
                                        labels: {
                                            y: 15,
                                            style: {
                                                fontSize: '7px',
                                                fontWeight: 'bold'
                                            }
                                        }
                                    },
                                    yAxis: {
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
                                    },
                                    title: {
                                        style: {
                                            fontSize: '8px'
                                        }
                                    },
                                    subtitle: {
                                        style: {
                                            fontSize: '7px'
                                        },
                                        align: 'center'
                                    },
                                    legend: {
                                        title: {
                                            text: null
                                        },

                                        itemDistance: 50,
                                        itemMarginBottom: 5,

                                        labelFormatter: function(){
                                            // return '<span style="color:'+this.color+'">'+this.name+'</span>';
                                            return '<span>'+this.name+'</span>';
                                        },
                                        itemStyle: {
                                            fontSize: '8px',
                                            fontWeight: 'bold'
                                        },
                                        enabled: false//, only one series and all info in title and subtitle
                                    },
                                    plotOptions: {
                                        series: {
                                            lineWidth: 1
                                        }
                                    },
                                    series: {
                                        // marker : {
                                        //  radius: 2
                                        //},
                                        dataLabels: {
                                            enabled: false
                                            // style: {
                                            // fontSize: '6px',
                                            // color: this.series.color,
                                            // textShadow: 0
                                            // }
                                        }
                                    }

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
                                                    "usd_disbursement_defl"
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
                                                "to": 2014
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
                            chart: {
                                marginTop: 60,
                                //spacing: [10, 10, 27, 10], // better spacing when chart exports
                                spacing: [10, 10, 27, 10], // was [10, 10, 15, 10]

                                events: {
                                    load: function () {

                                        if (this.options.chart.forExport) {
                                            this.xAxis[0].update({
                                                categories: this.xAxis[0].categories,
                                                labels: {
                                                    style: {
                                                        width: '50px',
                                                        fontSize: '6px',
                                                        fontWeight: 'normal'
                                                    },
                                                    step: 1
                                                }
                                            }, false);



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
                                                                radius: 10
                                                            }
                                                        })
                                                    }
                                                }
                                            });


                                            this.redraw();
                                        }

                                    },
                                    beforePrint: function (event) {
                                        var $chart = $(this.renderTo);
                                        var parent = $(this.renderTo).parent().prev();

                                        var title = parent.find("p").text();

                                        //Set chart title and set subtitle to empty string
                                        this.setTitle(
                                            {text: title, style: {
                                                fontSize: '12px'
                                            }}, {text: ""});

                                        //Only show in the legend the series that are visible
                                        $.each(this.series, function (i, serie) {
                                            if(!serie.visible){
                                                serie.update({
                                                    showInLegend: false
                                                })
                                            }
                                        });


                                        if(this.options.chart.type === 'pie') {
                                            // Configure printing of pie charts
                                            /**   this.options.exporting = {
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
                        }**/
                                        }

                                        //Hide buttons and legend title
                                        $chart.find('.highcharts-button').hide();
                                        $chart.find('.highcharts-legend-title').hide();
                                    },
                                    afterPrint: function (event) {
                                        var $chart = $(this.renderTo);

                                        //Reset series availability in legend, if it was hidden
                                        $.each(this.series, function (i, serie) {
                                            if(!serie.visible){
                                                serie.update({
                                                    showInLegend: true
                                                })
                                            }
                                        });

                                        //Reset title and subtitle
                                        this.setTitle(
                                            {text: ""}, {text: ""});


                                        // this.setTitle(
                                        //  {text: ""}, {text: "<b>Hover for values and click and drag to zoom</b>"});

                                        //Re-show buttons and legend title
                                        $chart.find('.highcharts-button').show();
                                        $chart.find('.highcharts-legend-title').show();
                                    }

                                }

                            },

                            title: {
                                text: 'Top Recipients - Total ODA / Commitment Current Prices (USD Mil) / '+Config.YEARSTART+'-'+Config.YEARFINISH
                            },
                            subtitle: {
                                text: 'Source: OECD-CRS'
                            },
                            colors: ['#5DA58D'],
                            legend: {
                                enabled:false
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
                            exporting: {
                                filename: 'top_recipients_chart',
                                chartOptions: {
                                    chart: {
                                        style: {
                                            fontFamily: 'Helvetica',
                                            fontWeight: 'bold'
                                        }
                                    },
                                    xAxis: {
                                        labels: {
                                            y: 15,
                                            style: {
                                                fontSize: '7px',
                                                fontWeight: 'bold'
                                            }
                                        }
                                    },
                                    yAxis: {
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
                                    },
                                    title: {
                                        style: {
                                            fontSize: '8px'
                                        }
                                    },
                                    subtitle: {
                                        style: {
                                            fontSize: '7px'
                                        },
                                        align: 'center'
                                    },
                                    legend: {
                                        title: {
                                            text: null
                                        },

                                        itemDistance: 50,
                                        itemMarginBottom: 5,

                                        labelFormatter: function(){
                                            // return '<span style="color:'+this.color+'">'+this.name+'</span>';
                                            return '<span>'+this.name+'</span>';
                                        },
                                        itemStyle: {
                                            fontSize: '8px',
                                            fontWeight: 'bold'
                                        },
                                        enabled: false//, only one series and all info in title and subtitle
                                    },
                                    plotOptions: {
                                        series: {
                                            lineWidth: 1
                                        }
                                    },
                                    series: {
                                        // marker : {
                                        //  radius: 2
                                        //},
                                        dataLabels: {
                                            enabled: false
                                            // style: {
                                            // fontSize: '6px',
                                            // color: this.series.color,
                                            // textShadow: 0
                                            // }
                                        }
                                    }

                                }
                            },
                            xAxis: {
                                gridLineColor: 'transparent'
                            },
                            yAxis: {
                                gridLineColor: 'transparent',
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
                        "filter_recipients": ['donorcode', 'year', 'oda']
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
                            chart: {
                                marginTop: 60,
                                //spacing: [10, 10, 27, 10], // better spacing when chart exports
                                spacing: [10, 10, 27, 10], // was [10, 10, 15, 10]

                                events: {
                                    load: function () {

                                        if (this.options.chart.forExport) {
                                            this.xAxis[0].update({
                                                categories: this.xAxis[0].categories,
                                                labels: {
                                                    style: {
                                                        width: '100px',
                                                        fontSize: '6px',
                                                        fontWeight: 'normal'
                                                    },
                                                    step: 1
                                                }
                                            }, false);



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
                                                                radius: 10
                                                            }
                                                        })
                                                    }
                                                }
                                            });


                                            this.redraw();
                                        }

                                    },
                                    beforePrint: function (event) {
                                        var $chart = $(this.renderTo);
                                        var parent = $(this.renderTo).parent().prev();

                                        var title = parent.find("p").text();

                                        //Set chart title and set subtitle to empty string
                                        this.setTitle(
                                            {text: title, style: {
                                                fontSize: '12px'
                                            }}, {text: ""});

                                        //Only show in the legend the series that are visible
                                        $.each(this.series, function (i, serie) {
                                            if(!serie.visible){
                                                serie.update({
                                                    showInLegend: false
                                                })
                                            }
                                        });


                                        if(this.options.chart.type === 'pie') {
                                            // Configure printing of pie charts
                                            /**   this.options.exporting = {
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
                        }**/
                                        }

                                        //Hide buttons and legend title
                                        $chart.find('.highcharts-button').hide();
                                        $chart.find('.highcharts-legend-title').hide();
                                    },
                                    afterPrint: function (event) {
                                        var $chart = $(this.renderTo);

                                        //Reset series availability in legend, if it was hidden
                                        $.each(this.series, function (i, serie) {
                                            if(!serie.visible){
                                                serie.update({
                                                    showInLegend: true
                                                })
                                            }
                                        });

                                        //Reset title and subtitle
                                        this.setTitle(
                                            {text: ""}, {text: ""});


                                        // this.setTitle(
                                        //  {text: ""}, {text: "<b>Hover for values and click and drag to zoom</b>"});

                                        //Re-show buttons and legend title
                                        $chart.find('.highcharts-button').show();
                                        $chart.find('.highcharts-legend-title').show();
                                    }

                                }

                            },

                            title: {
                                text: 'Top Sectors - Total ODA / Commitment Current Prices (USD Mil) / '+Config.YEARSTART+'-'+Config.YEARFINISH
                            },
                            subtitle: {
                                text: 'Source: OECD-CRS'
                            },
                            legend: {
                                enabled: false
                            },
                            colors: ['#008080'],
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
                            exporting: {
                                filename: 'top_sectors_chart',

                                chartOptions: {
                                    chart: {
                                        style: {
                                            fontFamily: 'Helvetica',
                                            fontWeight: 'bold'
                                        }
                                    },
                                    xAxis: {
                                        labels: {
                                            y: 15,
                                            style: {
                                                fontSize: '7px',
                                                fontWeight: 'bold'
                                            }
                                        }
                                    },
                                    yAxis: {
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
                                    },
                                    title: {
                                        style: {
                                            fontSize: '8px'
                                        }
                                    },
                                    subtitle: {
                                        style: {
                                            fontSize: '7px'
                                        },
                                        align: 'center'
                                    },
                                    legend: {
                                        title: {
                                            text: null
                                        },

                                        itemDistance: 50,
                                        itemMarginBottom: 5,

                                        labelFormatter: function(){
                                            // return '<span style="color:'+this.color+'">'+this.name+'</span>';
                                            return '<span>'+this.name+'</span>';
                                        },
                                        itemStyle: {
                                            fontSize: '8px',
                                            fontWeight: 'bold'
                                        },
                                        enabled: false//, only one series and all info in title and subtitle
                                    },
                                    plotOptions: {
                                        series: {
                                            lineWidth: 1
                                        }
                                    },
                                    series: {
                                        // marker : {
                                        //  radius: 2
                                        //},
                                        dataLabels: {
                                            enabled: false
                                            // style: {
                                            // fontSize: '6px',
                                            // color: this.series.color,
                                            // textShadow: 0
                                            // }
                                        }
                                    }

                                }
                            },
                            xAxis: {
                                gridLineColor: 'transparent'
                            },
                            yAxis: {
                                gridLineColor: 'transparent',
                                labels: {
                                    format: '{value:,.0f}'
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
                    id: "tot-oda-fao", //ref [data-item=':id']
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
                            title: {
                                text: 'Total ODA in FAO-Related Sectors - Commitment Current Prices (USD Mil)'
                            },
                            subtitle: {
                                text: 'Source: OECD-CRS'
                            },
                            legend: {
                                enabled: false
                            },
                            xAxis: {
                                type: 'datetime',
                                gridLineColor: 'transparent'
                            },
                            yAxis: {
                                gridLineColor: 'transparent',
                                labels: {
                                    format: '{value:,.0f}'
                                }
                            },
                            exporting: {
                                filename: 'tot_oda_fao_chart',

                                chartOptions: {
                                    chart: {
                                        style: {
                                            fontFamily: 'Helvetica',
                                            fontWeight: 'bold'
                                        }
                                    },
                                    xAxis: {
                                        labels: {
                                            y: 15,
                                            style: {
                                                fontSize: '7px',
                                                fontWeight: 'bold'
                                            }
                                        }
                                    },
                                    yAxis: {
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
                                    },
                                    title: {
                                        style: {
                                            fontSize: '8px'
                                        }
                                    },
                                    subtitle: {
                                        style: {
                                            fontSize: '7px'
                                        },
                                        align: 'center'
                                    },
                                    legend: {
                                        title: {
                                            text: null
                                        },

                                        itemDistance: 50,
                                        itemMarginBottom: 5,

                                        labelFormatter: function(){
                                            // return '<span style="color:'+this.color+'">'+this.name+'</span>';
                                            return '<span>'+this.name+'</span>';
                                        },
                                        itemStyle: {
                                            fontSize: '8px',
                                            fontWeight: 'bold'
                                        },
                                        enabled: false//, only one series and all info in title and subtitle
                                    },
                                    plotOptions: {
                                        series: {
                                            lineWidth: 1
                                        }
                                    },
                                    series: {
                                        // marker : {
                                        //  radius: 2
                                        //},
                                        dataLabels: {
                                            enabled: false
                                            // style: {
                                            // fontSize: '6px',
                                            // color: this.series.color,
                                            // textShadow: 0
                                            // }
                                        }
                                    }

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
                                    "fao_sector": {
                                        "enumeration": [
                                            "1"
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
                    id: 'top-fao-subsectors', // TOP SUB SECTORS
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
                               height: 500,
                               marginTop: 60,
                                    //spacing: [10, 10, 27, 10], // better spacing when chart exports
                                 spacing: [10, 10, 27, 10], // was [10, 10, 15, 10]
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
                            plotOptions: {
                                pie: {
                                    size: 200,
                                    allowPointSelect: true,
                                    cursor: 'pointer',
                                    dataLabels: {
                                        enabled: false
                                    },
                                    showInLegend: true // shows legend for pie
                                }
                            },
                            title: {
                                text: 'Top FAO-Related Sub-Sectors - Total ODA / Commitment Current Prices (USD Mil) / '+Config.YEARSTART+'-'+Config.YEARFINISH
                            },
                            subtitle: {
                                text: 'Source: OECD-CRS'
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
                                filename: 'top_fao_subsectors_chart',
                                buttons: {
                                    toggleDataLabelsButton: {
                                        enabled: false
                                    }
                                },
                                chartOptions: {

                                        chart: {
                                            style: {
                                                fontFamily: 'Helvetica',
                                                fontWeight: 'bold'
                                            }
                                        },
                                        xAxis: {
                                            labels: {
                                                y: 15,
                                                style: {
                                                    fontSize: '7px',
                                                    fontWeight: 'bold'
                                                }
                                            }
                                        },
                                        yAxis: {
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
                                        },
                                        title: {
                                            style: {
                                                fontSize: '8px'
                                            }
                                        },
                                        subtitle: {
                                            style: {
                                                fontSize: '7px'
                                            },
                                            align: 'center'
                                        },

                                        plotOptions: {
                                            series: {
                                                lineWidth: 1
                                            }
                                        },
                                        series: {
                                            // marker : {
                                            //  radius: 2
                                            //},
                                            dataLabels: {
                                                enabled: false
                                                // style: {
                                                // fontSize: '6px',
                                                // color: this.series.color,
                                                // textShadow: 0
                                                // }
                                            }
                                        },


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
                            "rid": {"uid": "filter_subsectors"}
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
                            "name": "addcolumn",
                            "parameters": {
                                "column": {
                                    "dataType": "number",
                                    "id": "percentage",
                                    "title": { "EN": "Percentage" }
                                },
                                "value": {
                                    "keys": [ "1=1" ],
                                    "values": [ "@@direct value" ]
                                }
                            }
                        },
                        {
                            "name" : "percentage",
                            "parameters" : {
                                "valueColumnId" : "percentage"
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
                            chart: {
                                marginTop: 60,
                                //spacing: [10, 10, 27, 10], // better spacing when chart exports
                                spacing: [10, 10, 27, 10], // was [10, 10, 15, 10]

                                events: {
                                    load: function () {

                                        if (this.options.chart.forExport) {
                                            this.xAxis[0].update({
                                                categories: this.xAxis[0].categories,
                                                labels: {
                                                    style: {
                                                        width: '50px',
                                                        fontSize: '6px',
                                                        fontWeight: 'normal'
                                                    },
                                                    step: 1
                                                }
                                            }, false);



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
                                                                radius: 10
                                                            }
                                                        })
                                                    }
                                                }
                                            });


                                            this.redraw();
                                        }

                                    },
                                    beforePrint: function (event) {
                                        var $chart = $(this.renderTo);
                                        var parent = $(this.renderTo).parent().prev();

                                        var title = parent.find("p").text();

                                        //Set chart title and set subtitle to empty string
                                        this.setTitle(
                                            {text: title, style: {
                                                fontSize: '12px'
                                            }}, {text: ""});

                                        //Only show in the legend the series that are visible
                                        $.each(this.series, function (i, serie) {
                                            if(!serie.visible){
                                                serie.update({
                                                    showInLegend: false
                                                })
                                            }
                                        });


                                        if(this.options.chart.type === 'pie') {
                                            // Configure printing of pie charts
                                            /**   this.options.exporting = {
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
                        }**/
                                        }

                                        //Hide buttons and legend title
                                        $chart.find('.highcharts-button').hide();
                                        $chart.find('.highcharts-legend-title').hide();
                                    },
                                    afterPrint: function (event) {
                                        var $chart = $(this.renderTo);

                                        //Reset series availability in legend, if it was hidden
                                        $.each(this.series, function (i, serie) {
                                            if(!serie.visible){
                                                serie.update({
                                                    showInLegend: true
                                                })
                                            }
                                        });

                                        //Reset title and subtitle
                                        this.setTitle(
                                            {text: ""}, {text: ""});


                                        // this.setTitle(
                                        //  {text: ""}, {text: "<b>Hover for values and click and drag to zoom</b>"});

                                        //Re-show buttons and legend title
                                        $chart.find('.highcharts-button').show();
                                        $chart.find('.highcharts-legend-title').show();
                                    }

                                }

                            },

                            title: {
                                text: 'Top Channels of Delivery - Total ODA / Commitment Current Prices (USD Mil) / '+Config.YEARSTART+'-'+Config.YEARFINISH
                            },
                            subtitle: {
                                text: 'Source: OECD-CRS'
                            },
                            legend: {
                                enabled:false
                            },
                            colors: ['#5DA58D'],
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
                            exporting: {
                                filename: 'top_channels_chart',

                                chartOptions: {
                                    chart: {
                                        style: {
                                            fontFamily: 'Helvetica',
                                            fontWeight: 'bold'
                                        }
                                    },
                                    xAxis: {
                                        labels: {
                                            y: 15,
                                            style: {
                                                fontSize: '7px',
                                                fontWeight: 'bold'
                                            }
                                        }
                                    },
                                    yAxis: {
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
                                    },
                                    title: {
                                        style: {
                                            fontSize: '8px'
                                        }
                                    },
                                    subtitle: {
                                        style: {
                                            fontSize: '7px'
                                        },
                                        align: 'center'
                                    },
                                    legend: {
                                        title: {
                                            text: null
                                        },

                                        itemDistance: 50,
                                        itemMarginBottom: 5,

                                        labelFormatter: function(){
                                            // return '<span style="color:'+this.color+'">'+this.name+'</span>';
                                            return '<span>'+this.name+'</span>';
                                        },
                                        itemStyle: {
                                            fontSize: '8px',
                                            fontWeight: 'bold'
                                        },
                                        enabled: false//, only one series and all info in title and subtitle
                                    },
                                    plotOptions: {
                                        series: {
                                            lineWidth: 1
                                        }
                                    },
                                    series: {
                                        // marker : {
                                        //  radius: 2
                                        //},
                                        dataLabels: {
                                            enabled: false
                                            // style: {
                                            // fontSize: '6px',
                                            // color: this.series.color,
                                            // textShadow: 0
                                            // }
                                        }
                                    }

                                }
                            },
                            xAxis: {
                                gridLineColor: 'transparent'
                            },
                            yAxis: {
                                gridLineColor: 'transparent',
                                labels: {
                                    format: '{value:,.0f}'
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
                }
            ]
        }
    }
});