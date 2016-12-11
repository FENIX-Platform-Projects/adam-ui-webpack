/*global define*/
define(function ( ) {

    'use strict';

    return {
        dashboard: {
            DEFAULT_TOPIC : 'recipient' //recipient, partner or recipient-partner
        },
        topic: {
            SELECTED_TOPIC: 'selected_topic',
            RECIPIENT_COUNTRY_SELECTED: 'recipient',
            RESOURCE_PARTNER_SELECTED: 'partner',
            RECIPIENT_AND_PARTNER_SELECTED: 'recipient-partner'
        },
        items: {
            VENN_DIAGRAM: 'venn-diagram'
        }
    };
});