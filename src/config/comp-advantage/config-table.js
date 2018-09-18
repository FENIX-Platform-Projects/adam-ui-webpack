/*global define*/

define(['../config-base'], function(Config) {

    'use strict';

    return {
            dashboard: {

                //default dataset id
                uid: "adam_comparative_advantage",

                items: [
                    {
                        id: "comp_advantage",
                        type: 'custom',
                        config: {
                            "groupedRow":false,
                            "aggregationFn":{"value":"sum"},
                            "formatter":"localstring",
                            "decimals":2,
                            "pageSize": "150",
                            "showRowHeaders":true,
                            "rows":["purposecode_EN", "year", "delivery",  "fao_delivery", "total_fao_delivery", "advantage_ratio", "ratio"], //"delivery",  "fao_delivery", "total_fao_delivery", "advantage_ratio", "ratio"
                            //"rows":["purposecode_EN", "recipientcode_EN", "year", "ratio"], //"delivery",  "fao_delivery", "total_fao_delivery", "advantage_ratio", "ratio"


                            "aggregations":[],
                           // "values":["delivery",  "fao_delivery", "total_fao_delivery", "advantage_ratio"],
                          //  inputFormat : "fenixtool",

                            config: {
                                pageSize: 150,
                                height: 700,
                                autoSelectFirstRow: false,
                                customRowAttribute : function(record,rn,grid){
                                    grid.autoSelectFirstRow = false;

                                    if (record[6] === 'YES'){
                                        return 'style="background-color:#A4C368"'; // green
                                    }

                                },
                                columns: [
                                    {id: "purposecode_EN", width: 200},
                                    {id: "year", width: 50, align: 'center'},
                                    {id: "delivery", width: 120, align: 'center', title: "FAO delivery in sub-sector & country &divide; Total FAO delivery in country",
                                        renderer: function (value, record, columnObj, grid, colNo, rowNo) {
                                            var val = value;

                                            if(val && val > 0 && val < 100 ){
                                                val = parseFloat(val).toFixed(2);
                                            }

                                        return  val;
                                    }},
                                    {id: "fao_delivery", width: 110,  align: 'center', title: "FAO delivery in sub-sector & country &divide; Total delivery by all ODA implementing agencies in sub-sector & country",
                                        renderer: function (value, record, columnObj, grid, colNo, rowNo) {
                                            var val = value;

                                            if(val && val > 0 && val < 100 ){
                                                val = parseFloat(val).toFixed(2);
                                            }
                                            return  val;
                                        }},
                                    {id: "total_fao_delivery",   width: 100, align: 'center', title: "Total FAO delivery in country &divide; Total agricultural delivery by all ODA implementing agencies in country",
                                        renderer: function (value, record, columnObj, grid, colNo, rowNo) {
                                            var val = value;

                                            if(val && val > 0 && val < 100 ){
                                                val = parseFloat(val).toFixed(2);
                                            }
                                            return  val;
                                        }},
                                    {id: "advantage_ratio",  width: 100, align: 'center', title: "FAO Delivery over Total Delivery &divide Total FAO Delivery over Total Agriculture",
                                        renderer: function (value, record, columnObj, grid, colNo, rowNo) {
                                            var val = value;
                                            if(val && val > 0){
                                                val = parseFloat(val).toFixed(4);
                                            }
                                            return  val;
                                        }},
                                    {
                                        id: 'ratio', width: 120,  sortOrder: 'desc', align: 'center', title: "Ratio > 1 = 'Yes' while Ratio < 1 = 'No'",
                                        renderer: function (value, record1, columnObj, grid, colNo, rowNo) {
                                            var lowCase = value.toLowerCase();
                                            return lowCase.charAt(0).toUpperCase() + lowCase.slice(1);
                                        }
                                    }]

                            }
                        },

                        filterFor: {
                            "filter_fca": ['year', 'recipientcode']
                        },

                        postProcess: [
                            {
                                "name": "filter",
                                "sid": [
                                    {
                                        "uid": "adam_comparative_advantage"
                                    }
                                ],
                                "parameters": {
                                    "columns": [
                                        "recipientcode",
                                        "sector",
                                        "purposecode",
                                        "year",
                                        "delivery",
                                        "fao_delivery",
                                        "total_fao_delivery",
                                        "advantage_ratio",
                                        "ratio"
                                    ],
                                    "rows": {
                                        "year": {
                                            "time": [
                                                {
                                                    "from": Config.YEARFINISH,
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
                                    "uid": "filter_fca"
                                }
                            }
                        ]
                    }
                ]
            }
       }


});