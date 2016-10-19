/*global define*/
define(function ( ) {

    'use strict';

    return {
       dashboard: {
            DEFAULT_CONFIG : 'FAO_SECTOR' //OTHER_SECTORS || FAO_SECTOR
        },
        filter: {
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
        topic: {
            BY_COUNTRY: 'country',
            BY_SECTOR: 'sector',
            BY_RESOURCE_PARTNER: 'donor',
            BY_COUNTRY_RESOURCE_PARTNER: 'country_donor'
        }
    };
});