/*global define*/
define(function () {

    'use strict';

    var SERVER = 'http://fenix.fao.org/',
        CODELIST_PREFIX = SERVER+ 'msd/resources/',
        CODELIST_HIERARCHY_PREFIX = SERVER+ 'msd/codes/hierarchy/',
        ADAM_FILE_RESOURCES_PATH = 'http://www.fao.org/fileadmin/user_upload/adam/';


    return {


        YEARSTART : 2000,
        YEARFINISH: 2015,

        LANG: 'en',
        
        BROWSE_SECTIONS: ['country', 'country-donor', 'donor', 'sector'],
        DEFAULT_BROWSE_SECTION: 'country',
        DASHBOARD_ITEMS: {
            MAP: 'map',
            CHART: 'chart'
        },
        SELECTORS: {
            REGION: 'fao_region',
            RECIPIENT_COUNTRY: 'recipientcode',
            RESOURCE_PARTNER: 'donorcode',
            SECTOR: 'parentsector_code',
            SUB_SECTOR: 'purposecode',
            CHANNELS_SUBCATEGORY: 'channelsubcategory_code',
            CHANNEL: 'channelcode',
            ODA: 'oda',
            YEAR: 'year',
            YEAR_FROM: 'year-from',
            YEAR_TO: 'year-to',
            COUNTRY: 'countrycode'
        },
        DOWNLOAD: {
            PDF: 'pdf',
            EXCEL: 'excel',
            SVG: 'svg',
            PNG: 'png',
            JPEG: 'jpeg',
            MSEXCEL: 'msexcel',
            CSV: 'csv'
        },

        PRINT: 'print',

        // ENVIRONMENT : 'develop',
        ENVIRONMENT : 'demo',
        CACHE: false,
        DEFAULT_UID: 'adam_usd_aggregated_table', //'adam_usd_commitment',
        SERVER: SERVER,
        CODES_POSTFIX : '/codes/filter',
        HIERARCHY_CODES_POSTFIX : '/codes/hierarchy',
        //D3P_POSTFIX : "d3s_dev/processes/",
        D3P_POSTFIX : "d3s/processes/",

        //ADAM DOCs
        ADAM_RESOURCES_DOCS_PATH : ADAM_FILE_RESOURCES_PATH + 'docs/',
        ADAM_RESOURCES_CPF_UNDAF_PATH : ADAM_FILE_RESOURCES_PATH + 'cpf-undaf/',

        //Chaplin JS configuration
        CHAPLINJS_CONTROLLER_SUFFIX: '-controller',
        CHAPLINJS_PROJECT_ROOT: '/fenix/',
        CHAPLINJS_PUSH_STATE: false,
        CHAPLINJS_SCROLL_TO: false,
        CHAPLINJS_APPLICATION_TITLE: "FENIX Web App",

        //Top Menu configuration
        TOP_MENU_CONFIG: 'config/submodules/fx-menu/top_menu.json',
        TOP_MENU_TEMPLATE: 'fx-menu/html/blank-fluid.html',
        TOP_MENU_SHOW_BREADCRUMB: true,
        TOP_MENU_SHOW_BREADCRUMB_HOME: false,
        TOP_MENU_SHOW_FOOTER: false,
        TOP_MENU_AUTH_MODE_HIDDEN_ITEMS: ['login'],
        TOP_MENU_PUBLIC_MODE_HIDDEN_ITEMS: ['profiles', 'logout'],

        SECURITY_NOT_AUTHORIZED_REDIRECTION_LINK: "login",

        // COUNTRIES_CODE_LIST : CODELIST_PREFIX + "UNECA_ISO3",
        COUNTRIES_CODE_LIST: CODELIST_PREFIX + "/crs_donors/2015",
        CODELIST_URL: CODELIST_PREFIX,
        MD_EXPORT_URL: SERVER,
        DATA_ENVIROMENT_URL: 'http://fenixservices.fao.org',

        SOCIAL_LINK_FACEBOOK: "https://facebook.com",
        SOCIAL_LINK_TWITTER: "https://twitter.com",
        SOCIAL_LINK_YOUTUBE: "https://youtube.com",

        DOWNLOAD_FILE_SYSTEM_ROOT: 'http://fenixrepo.fao.org/cdn/data/adam/download/',

        //D3S_CODELIST_URL:( C.SERVICE_BASE_ADDRESS || DC.SERVICE_BASE_ADDRESS) + "/resources/",

        CODELIST_POSTFIX: "/resources/",

        //CODELIST_SERVICE: "d3s_dev/msd"
        CODELIST_SERVICE: "d3s/msd"


    };
});
