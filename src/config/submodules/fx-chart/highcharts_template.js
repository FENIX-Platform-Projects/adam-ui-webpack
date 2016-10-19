/*global define*/
define(function () {

    'use strict';

    return {

        chart: {
            marginTop: 60,
            //spacing: [10, 10, 27, 10], // better spacing when chart exports
            spacing: [10, 10, 27, 10], // was [10, 10, 15, 10]
            events: {
                load: function (event) {

                    Highcharts.setOptions({
                        lang: {
                            toggleDataLabels: 'Display/hide values on the chart',
                            printDownload: 'Print and Download chart options'
                        }
                    });

                   // if(this.series.length < 2){
                       // $.each(this.series, function (i, serie) {
                             //  serie.update({
                               //     showInLegend: false
                               // })
                       // });
                        //this.redraw();
                   // }

                    if (this.options.chart.forExport) {
                        this.xAxis[0].update({
                            categories: this.xAxis[0].categories,
                            labels: {
                                style: {
                                    width: '50px',
                                    fontSize: '6px'
                                },
                                step: 1
                            }
                        }, false);

                        Highcharts.each(this.yAxis, function (y) {
                            y.update({
                                title: {
                                    style: {
                                        fontSize: '6px'
                                    }
                                },
                                labels: {
                                    style: {
                                        fontSize: '6px'
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
                                            fontSize: '6px'
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


                      /**  Highcharts.each(this.series, function (series) {
                            series.update({
                                marker : {
                                    radius: 2
                                },
                                dataLabels: {
                                    enabled: true,
                                    style: {
                                        fontSize: '6px',
                                        color: series.color,
                                        textShadow: 0
                                    }
                                }
                            }, false);

                        });**/
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

        credits: {
            enabled: true,
            position: {
                align: 'left',
                x: 5
            },
            text: 'Source: OECD-CRS',
            href: ''
        },

        exporting: {
            sourceWidth: 700,
            buttons: {
                contextButton: {

                    text: "Print/Download",
                    _titleKey: "printDownload",
                    symbol: null

                    //, menuItems: [{
                    //    textKey: 'downloadPNG',
                    //    onclick: function () {
                    //        this.exportChart();
                    //    }
                    // }, {
                    //   textKey: 'downloadJPEG',
                    //  onclick: function () {
                    //      this.exportChart({
                    //         type: 'image/jpeg'
                    //    });
                    // }
                    // }]
                },
                toggleDataLabelsButton: {
                    text: "Display Values",
                    _titleKey: "toggleDataLabels",
                    onclick: function (){

                        var button = this.exportSVGElements[2],
                            $button = $(button.element.lastChild),
                        text = $button.text() == "Display Values" ? "Hide Values" : "Display Values";

                        button.attr({
                          text: text
                        });

                        for(var idx = 0; idx < this.series.length; idx++){
                            var opt = this.series[idx].options;
                            var isShown = !opt.dataLabels.enabled;
                            this.series[idx].update({dataLabels: {enabled: isShown,  style: {
                               // fontSize: '7px',
                                color: this.series[idx].color,
                                textShadow: 0
                            }}});
                        }

                    }
                }//,
               // customPrintButton: {
                 //    text: "Print",
                    // symbol: "url(/demo/gfx/sun.png)",
                   // _titleKey: "toggleDataLabels",
                  //  onclick: function (){
                    //    var $chart = $(this.renderTo);
                     //   var highchartObj = $chart.highcharts();

                      //  highchartObj.print();

                   // }
               // }
            },


            chartOptions: {

                xAxis: {
                    labels: {
                        y: 15,
                        style: {
                            fontSize: '6px'
                        }
                    }
                },
                yAxis: {
                    title: {
                        style: {
                            fontSize: '7px'
                        }
                    },
                    labels: {
                        style: {
                            fontSize: '6px'
                        }
                    }
                },
                title: {
                    style: {
                        fontSize: '8px',
                        fontWeight: 'bold'
                    }
                },
                subtitle: {
                    style: {
                        fontSize: '8px'
                    },
                    align: 'center'
                },
                credits: {
                    style: {
                        fontSize: '6px',
                        margin: '30px'
                    }

                },
                legend: {
                    title: {
                        text: null
                    },

                    itemDistance: 50,
                    itemMarginBottom: 5,

                    labelFormatter: function(){
                        return '<span style="color:'+this.color+'">'+this.name+'</span>';
                    },
                    itemStyle: {
                        fontSize: '6px',
                        fontWeight: 'normal'
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

        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: false
                },
                showInLegend: true // shows legend for pie
            },
            series: {
                stickyTracking: false // ensures tooltip displays only when point is hovered on
            }
        },
        legend: {
            title: {
                text: 'Click to hide/show'
            },
            align: 'center',
            padding: 0,
            itemDistance: 40,
            itemStyle: {
               fontSize: '12px'
            },
            itemHiddenStyle: {
                color: '#CCC',  //Default
                fontWeight: 'bold'  //Makes it a little darker, more visible
            }
        },

        subtitle: {
            text: ''
        },
       // subtitle: {
           // text: '<b>Hover for values and click and drag to zoom</b>',
           // align: 'left',
           // x: 10
       // },

        yAxis: [{ //Primary Axis
            title: {
               enabled: true,
               text: 'USD Millions'
             }
        }],

        xAxis: {crosshair: false}, // removes 'blue' highlight when hovering over points


        tooltip: {
            formatter: function () {
               if(!this.series.options.dataLabels.enabled) { // hide tooltip if data labels enabled
                    var unit = 'USD Mil';

                    if (this.series.name.indexOf('%') >= 0)
                        unit = '%'

                    return '<b>' + this.x + ': ' +
                        this.series.name + '</b><br/>' +
                        Highcharts.numberFormat(this.y, 2, '.', ',') + ' ' + unit;
                } else {
                   return false;
                }

            }

        }

    };
});