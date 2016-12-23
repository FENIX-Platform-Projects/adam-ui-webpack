/*global define*/

define([
    'jquery',
    'fenix-ui-filter-utils',
    'config/nodemodules/fenix-ui-chart-creator/highcharts_template',
    'nls/compare'
],
function ($, Utils, highchartsTemplate, i18nLabels) {

    'use strict';

    return function(opts) {

        i18nLabels = i18nLabels[ opts.lang || 'en' ];

        return {
            analysis: {
                box: {
                    tab: "chart",
                    hideFlipButton: false,
                    faces: ["front","back"],
                    hideMinimizeButton: true,
                    hideMetadataButton: true,
                    nls: {
                        tooltip_toolbar_button: i18nLabels['sel_heading_compare_by'],
                    },
                    menu: [
                        //Download
                        {
                            label: "Download",
                            url: "",
                            parent_id: "root",
                            id: "download",
                            a_attrs: {
                                "data-id": "download",
                                "class": "hidden"
                            }
                        },
                        {
                            label: "Data",
                            url: "",
                            parent_id: "download",
                            id: "download-data",
                            a_attrs: {
                                "data-action": "download",
                                "data-id": "download",
                                "data-target": "data"
                            }
                        },
                        //Visualize as
                        {
                            label: "Visualize as",
                            url: "",
                            parent_id: "root",
                            id: "visualize_as"
                        },
                        //Chart
                        {
                            label: "Chart",
                            url: "",
                            parent_id: "visualize_as",
                            id: "visualize_as_chart",
                            a_attrs: {
                                "data-action": "tab",
                                "data-tab": "chart",
                                "data-id": "chart",
                                "class": "hidden"
                            }
                        },
                        {
                            label: "Line",
                            url: "",
                            parent_id: "visualize_as_chart",
                            id: "chart_line",
                            a_attrs: {
                                "data-action": "tab",
                                "data-tab": "chart",
                                "data-id": "chart",
                                "data-type": "line"
                            }
                        },
                        //Map
                        {
                            label: "Map",
                            url: "",
                            parent_id: "visualize_as",
                            id: "visualize_as_map",
                            a_attrs: {
                                "data-action": "tab",
                                "data-tab": "map",
                                "data-id": "map",
                                "class": "hidden"
                            }
                        },
                        //Table
                        {
                            label: "Table",
                            url: "",
                            parent_id: "visualize_as",
                            id: "visualize_as_table",
                            a_attrs: {
                                "data-action": "tab",
                                "data-tab": "table",
                                "data-id": "table",
                                "class": "hidden"
                            }
                        },
                        //Layout
                        {
                            label: "Set size",
                            url: "",
                            parent_id: "root",
                            id: "size"
                        },
                        {
                            label: "Full",
                            url: "",
                            parent_id: "size",
                            id: "full",
                            a_attrs: {
                                "data-action": "resize",
                                "data-size": "full"
                            }
                        },
                        {
                            label: "Half",
                            url: "",
                            parent_id: "size",
                            id: "half",
                            a_attrs: {
                                "data-action": "resize",
                                "data-size": "half"
                            }
                        },
                    ],
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

                                        if (forbiddenId.indexOf(col.id) < 0 && !Utils._endsWith(col.id, "_EN")) {
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
                                                //default: source.length > 0 ? source[0].value : "",
                                                default: ["donorcode"],
                                                config: {
                                                    maxItems: 1
                                                }
                                            },
                                            template: {
                                                title: i18nLabels['sel_heading_compare_by']
                                            }
                                        }
                                    }
                                }
                            },
                            config: function (model, filterSelection) {

                                var tab = this,
                                    order = model.metadata.dsd.columns
                                        .filter(function (c) {
                                            return !Utils._endsWith(c.id, "_EN") && c.subject !== "value" && c.id !== 'year' && c.id !== 'unitcode'
                                        })
                                        .map(function (c) {
                                            return c.id;
                                        });

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

                                        var compareBy = filterSelection.values.compare[0],
                                            index = order.indexOf(compareBy),
                                            colors = ["#F44336", "#00BCD4", "#4CAF50", "#E91E63", "#3F51B", "#2196F3", "#009688", "#CDDC39", "#FFC107", "#FF9800", "#E91E63"],
                                            used = {},
                                            result;

                                        tab._trigger("title.change", createTitle(compareBy, filterSelection));

                                        for (var ii in model.cols) {

                                            if (model.cols.hasOwnProperty(ii)) {
                                                i = model.cols[ii];
                                                config.xAxis.categories.push(i.title[this.lang]);
                                            }
                                        }

                                        for (var i in model.rows) {

                                            var row = model.rows[i],
                                                compareByValue = row[index];

                                            var s = {
                                                name: row.join(" / "),
                                                data: model.data[i]
                                            };

                                            var color = used[compareByValue];

                                            if (!color) {

                                                used[compareByValue] = colors.shift();
                                                color = used[compareByValue];
                                            }

                                            s.color = color;

                                            config.series.push(s);

                                        }

                                        result = $.extend(true, {}, config, highchartsTemplate);
                                        result.subtitle = {
                                            text: '<b>'+i18nLabels['subtitle_chart_compare']+'</b>',
                                            align: 'left',
                                            x: 10
                                        };

                                        //result.exporting.enabled = true;
                                        //result.exporting.buttons.contextButton.enabled =true;

                                        //console.log('inside chart config',result)
                                        return result;

                                        function createTitle(c, v) {

                                            var label = v.labels.compare[c];

                                            return i18nLabels['sel_heading_compare_by'] + label;

                                        }
                                    }
                                };

                                //console.log('chart config',config)
                                //config.exporting = highchartsTemplate.exporting;
                                //config.exporting.enabled =true;
                                return config;
                            }
                        }
                    }
                },
                nls: {
                    courtesy_intro: "",
                    courtesy_intro_title: "",


                }
            },

            filter: {
                selectors: {
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
                            to: 2014,
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
                            to: 2014,
                            default: [2014],
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
                            default: ['adam_usd_commitment'],
                            config: { //Selectize configuration
                                maxItems: 1
                            }
                        },
                        classNames: "col-xs-4",
                        cl: {
                            uid: "crs_flow_amounts",
                            version: "2016"
                        },
                        template: {
                            hideHeaderIcon: false,
                            headerIconClassName: 'glyphicon glyphicon-info-sign',
                            hideSwitch: true,
                            hideRemoveButton: true
                        },
                        format: {
                            output: "enumeration"
                        }
                    }
                }
            }
        };
    };
});