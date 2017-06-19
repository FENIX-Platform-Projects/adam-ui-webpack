/*global define*/

define(function () {

    'use strict';

    return {
        dashboard: {
            //default dataset id
            uid: "adam_cpf_undaf_priorities_table",
            //uid: "adam_combined_priorities_table",//Venn Diagram Dataset

            items: [
               {
                    id: "priorities-table",
                    type: 'custom',
                    config: {
                        "groupedRow": false,
                        "formatter": "localstring",
                        "showRowHeaders": true,
                        "rows": ["recipientcode", "purposecode", "undaf_stated_priority", "cpf_stated_priority"],
                        "aggregations": [],
                        inputFormat: "fenixtool",

                        // 878 total width
                        config: {
                            pageSize: 150,
                            autoSelectFirstRow: false,
                            columns: [
                                {id: "recipientcode", fieldIndex: "0", width: 150},
                                {id: "purposecode", fieldIndex: "1", width: 200},
                                {id: "undaf_stated_priority", fieldIndex: "2", width: 220},
                                {id: "cpf_stated_priority",fieldIndex: "3",  width: 220}
                            ]
                        }
                    },

                    filterFor: {
                        "filter_priorities": ['recipientcode']
                    },

                    postProcess: [
                        {
                            "name": "filter",
                            "sid": [
                                {
                                    "uid": "adam_cpf_undaf_priorities_table"
                                    //uid: "adam_combined_priorities_table" //Venn Diagram Dataset
                                }
                            ],
                            "parameters": {
                                "columns": [
                                    "purposecode",
                                    "undaf_stated_priority",
                                    "cpf_stated_priority",
                                    "undaf_period",
                                    "cpf_period",
                                    "recipientcode"
                                ],
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
                                    }
                                }
                            },
                            "rid": {"uid": "filter_priorities"}
                        },
                        {
                            "name": "group",
                            "parameters": {
                                "by": [
                                    "purposecode", "undaf_stated_priority", "cpf_stated_priority", "undaf_period", "cpf_period", "recipientcode"
                                ],
                                "aggregations": []
                            }
                        }
                    ]
                }
            ]
        }
    }


});