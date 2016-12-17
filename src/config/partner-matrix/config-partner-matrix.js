/*global define*/
define(function ( ) {

    'use strict';

    return {
        dashboard: {
            DEFAULT_TOPIC : 'country' //country, donor or country-donor
        },
        topic: {
            SELECTED_TOPIC: 'selected_topic',
            RECIPIENT_COUNTRY_SELECTED: 'country',
            RESOURCE_PARTNER_SELECTED: 'donor',
            RECIPIENT_AND_PARTNER_SELECTED: 'country-donor'
        }
    };
});