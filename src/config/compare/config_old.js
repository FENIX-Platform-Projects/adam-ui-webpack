/*global define*/

define([
        'jquery',
        'config/nodemodules/fenix-ui-chart-creator/highcharts_template'
    ],
    function ($, highchartsTemplate) {

        'use strict';

        return {

            analysis: {
                box: {
                    tab: "chart",
                    hideFlipButton: true,
                    faces: ["front"],
                    hideMetadataButton: true,
                    tabConfig: {
                        chart: {
                            toolbar: {
                                template: "<div data-selector='compare'></div>",
                                config: function (model) {

                                    var forbiddenId = ["value", "year", "unitcode"],
                                        metadata = model.metadata || {},
                                        dsd = metadata.dsd || {},
                                        columns = dsd.columns || [],
                                        source = [];

                                    for (var i = 0; i < columns.length; i++) {

                                        var col = columns[i] || {};

                                        if (forbiddenId.indexOf(col.id) < 0 && !col.id.endsWith("_EN")) {
                                            var title = col.title["EN"];
                                            source.push({
                                                value: col.id,
                                                label: title
                                            })
                                        }
                                    }

                                    return {
                                        compare: {
                                            selector: {
                                                id: "dropdown",
                                                source: source,
                                                default: ["donorcode"],
                                                config: {
                                                    maxItems: 1
                                                }
                                            },
                                            template: {
                                                title: "Compare by"
                                            }
                                        }
                                    }
                                }
                            },
                            config: function (model, values) {

                                var order = ["donorcode", "parentsector_code", "recipientcode", "purposecode"];

                                var config = {
                                    aggregationFn: {"value": "sum", "Value": "sum", "VALUE": "sum"},
                                    formatter: "value",
                                    decimals: 2,
                                    hidden: [],
                                    series: order,
                                    useDimensionLabelsIfExist: true,
                                    x: ["year"],
                                    aggregations: [],
                                    y: ["value"],
                                    type: "line",
                                    createConfiguration: function (model, config) {

                                        var compare = values.values.compare[0],
                                            index = order.indexOf(compare),
                                            colors = ["#F44336", "#00BCD4", "#4CAF50", "#E91E63", "#3F51B", "#2196F3", "#009688", "#CDDC39", "#FFC107", "#FF9800", "#E91E63"],
                                            //colors = ["#4CAF50", "#E91E63", "#3F51B", "#2196F3", "#009688", "#CDDC39", "#FFC107", "#FF9800", "#E91E63"],
                                            used = {};

                                        for (var ii in model.cols) {

                                            if (model.cols.hasOwnProperty(ii)) {
                                                i = model.cols[ii];
                                                config.xAxis.categories.push(i.title[this.lang]);
                                            }
                                        }

                                        for (var i in model.rows) {

                                            var name = model.rows[i],
                                                compareByValue = name[index];

                                            var s = {
                                                name: name.join(" / "),
                                                data: model.data[i]
                                            };

                                            var color = used[compareByValue];

                                            if (!color) {
                                                used[compareByValue] = colors.shift();
                                                color = used[compareByValue]
                                            }

                                            s.color = color;

                                            config.series.push(s);

                                        }

                                        return $.extend(true, {}, config, highchartsTemplate);
                                    }
                                };

                                return config;
                            }
                        }
                    }
                }
            },

            filter: {
                items: {
                    recipientcode: {
                        selector: {
                            id: "tree",
                            hideSummary: true, //Hide selection summary,
                        },
                        cl: {
                            uid: "crs_recipients",
                            version: "2016",
                            level: 1,
                            levels: 1
                        },
                        template: {
                            hideSwitch: true,
                            hideRemoveButton: true
                        }
                    },
                    donorcode: {
                        selector: {
                            id: "tree",
                            default: ["2", "7"], // Belgium, Netherlands
                            hideSummary: true, //Hide selection summary,
                        },
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
                            id: "tree",
                            default: ["311", "600"],
                            hideSummary: true, //Hide selection summary,
                        },
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
                            id: "tree",
                            hideSummary: true, //Hide selection summary,
                        },
                        cl: {
                            // codes: ["60010", "60020", "60030", "60040", "60061", "60062", "60063"],
                            "uid": "crs_dac",
                            "version": "2016",
                            "level": 2,
                            "levels": 2
                        },
                        template: {
                            hideSwitch: true,
                            hideRemoveButton: true
                        },
                        format: {
                            uid: "crs_purposes"
                        },
                        dependencies: {
                            "parentsector_code": {id: "parent", event: "select"} //obj or array of obj
                        }
                    },
                    "year-from": {
                        selector: {
                            id: "dropdown",
                            from: 2000,
                            to: 2015,
                            default: [2000],
                            config: { //Selectize configuration
                                maxItems: 1
                            },
                            hideSummary: true, //Hide selection summary,
                        },
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
                            to: 2015,
                            default: [2015],
                            hideSummary: true, //Hide selection summary,
                            config: {
                                maxItems: 1
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
                            source: [
                                {value: "usd_commitment", label: "USD Commitment"},
                                {value: "usd_commitment_defl", label: "USD Commitment Deflated"},
                                {value: "usd_disbursement", label: "USD Disbursement"},
                                {value: "usd_disbursement_defl", label: "USD Disbursement Deflated"}
                            ],
                            default: ['usd_commitment'],
                            config: {
                                maxItems: 1
                            },
                            hideSummary: true
                        },

                        format: {
                            output: "enumeration"
                        },

                        template: {
                            hideHeaderIcon: false,
                            hideSwitch: true,
                            hideRemoveButton: true
                        }
                    }
                }
            }
        }

    });