define(['../config-base'], function(Config) {

    'use strict';

    return {

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
                        maxItems: 1
                    }
                },
                classNames: "col-xs-5",
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
                        maxItems: 1
                    }
                },
                classNames: "col-xs-3",
                cl: {
                    "uid": "crs_fao_regions",
                    "version": "2016",
                    level: 2,
                    levels: 2,
                    "codes": [
                        "625",
                        "666",
                        "630",
                        "728",
                        "730",
                        "831",
                        "740",
                        "832",
                        "645",
                        "738",
                        "836",
                        "745",
                        "751",
                        "655",
                        "859",
                        "860",
                        "753",
                        "635",
                        "845",
                        "660",
                        "856",
                        "665",
                        "861",
                        "862",
                        "755",
                        "880",
                        "866",
                        "640",
                        "764",
                        "765",
                        "868",
                        "870",
                        "872",
                        "854",
                        "769",
                        "876"
                    ]
                },
                template: {
                    hideSwitch: true,
                    hideRemoveButton: true
                },
                dependencies: {
                    "fao_region": {id: "parent", event: "select", args: {
                        body: {
                            levels: 2
                        },
                        exclude: ["all"]
                    }}
                }
            },
            donorcode: {
                selector: {
                    id: "dropdown",
                    default: ["1"], // Austria,
                    emptyOption : {
                        enabled: true,
                        text: "All",
                        value: "all"
                    },
                    config: { //Selectize configuration
                        maxItems: 1,
                        // placeholder: "All",
                        // plugins: ['remove_button'],
                        // mode: 'multi'
                    }
                },
                classNames: "col-xs-4",
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
                    emptyOption : {
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
                    "parentsector_code": {id: "parent", event: "select", args: {
                        body: {
                            levels: 3
                        },
                        exclude: ["all"]
                    }}
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
            }
            /*
            recipientcode: {
                selector: {
                    id: "dropdown",
                    default: ["625"], // afghanistan,
                    emptyOption : {
                        enabled: true,
                        text: "All",
                        value: "all"
                    },
                    config: { //Selectize configuration
                        maxItems: 1,
                        // placeholder: "All",
                        // plugins: ['remove_button'],
                        // mode: 'multi'
                    }
                },
                classNames: "col-xs-4",
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
                    id: "dropdown",
                    default: ["1"], // Austria,
                    emptyOption : {
                        enabled: true,
                        text: "All",
                        value: "all"
                    },
                    config: { //Selectize configuration
                        maxItems: 1,
                        // placeholder: "All",
                        // plugins: ['remove_button'],
                        // mode: 'multi'
                    }
                },
                classNames: "col-xs-4",
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
                    default: ["all"], // All,
                    emptyOption : {
                        enabled: true,
                        text: "All",
                        value: "all"
                    },
                    config: { //Selectize configuration
                        maxItems: 1,
                        // placeholder: "All",
                        // plugins: ['remove_button'],
                        // mode: 'multi'
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
                    emptyOption : {
                        enabled: true,
                        text: "All",
                        value: "all"
                    },
                    config: { //Selectize configuration
                        maxItems: 1,
                        // placeholder: "All",
                        // plugins: ['remove_button'],
                        // mode: 'multi'
                    }
                },
                classNames: "col-xs-4",
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
                    "level": 2,
                    "levels": 2
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
            }
            */
        }
    }
});