/*global define*/

define(function () {

    'use strict';

    return {
        "sector": {
            purposecode: [
                {
                    layout: "default",
                    hide: ['tot-oda', 'top-sectors', 'top-subsectors', 'tot-oda-sector', 'top-recipients-all-sectors', 'top-partners-all-sectors'],
                    show: ['tot-oda-subsector', 'top-recipients', 'top-partners', 'top-partners-others', 'top-recipients-others']
                },
                {
                    value: "all",
                    hide: ['tot-oda', 'top-sectors', 'tot-oda-subsector', 'top-recipients-all-sectors', 'top-partners-all-sectors'],
                    show: ['top-subsectors', 'tot-oda-sector', 'top-partners-others', 'top-recipients-others', 'top-recipients', 'top-partners']
                }
            ],
            parentsector_code: [
                {
                    layout: "default",
                    hide: ['top-sectors', 'top-sectors-others', 'tot-oda-subsector', 'tot-oda', 'top-recipients-all-sectors', 'top-partners-all-sectors'],
                    show: ['top-subsectors', 'tot-oda-sector', 'top-partners-others', 'top-recipients-others', 'top-recipients', 'top-partners']
                },
                {
                    value: "all",
                    config: { path: "config-all-sectors"},
                    hide: ['tot-oda-sector', 'top-partners-others', 'top-recipients-others', 'top-recipients', 'top-partners'],
                    show: ['tot-oda', 'top-sectors', 'top-recipients-all-sectors', 'top-partners-all-sectors']
                },
                {
                    value: "9999",
                    config: { path: "fao_sectors/config-sector"},
                    hide: ['top-sectors', 'top-sectors-others', 'tot-oda-subsector', 'tot-oda', 'top-recipients-all-sectors', 'top-partners-all-sectors'],
                    show: ['top-subsectors', 'tot-oda-sector', 'top-partners-others', 'top-recipients-others', 'top-recipients', 'top-partners']

                }
            ]
        },
        "country": {
            purposecode: [
                {
                    layout: "default",
                    hide: ['top-sectors', 'top-sectors-others', 'top-subsectors', 'tot-oda-sector', 'tot-oda'],
                    show: ['tot-oda-subsector']
                },
                {
                    value: "all",
                    hide: ['tot-oda-subsector', 'tot-oda'],
                    show: ['top-sectors', 'top-sectors-others', 'top-subsectors', 'tot-oda-sector']
                }
            ],
            parentsector_code: [
                {
                    layout: "default",
                    hide: ['top-sectors', 'top-sectors-others', 'tot-oda-subsector', 'tot-oda'],
                    show: ['top-subsectors', 'tot-oda-sector']
                },
                {
                    value: "all",
                    hide: ['tot-oda-sector', 'tot-oda-subsector', 'top-subsectors'],
                    show: ['tot-oda', 'top-sectors', 'top-sectors-others']
                },
                {
                    value: "9999",
                    config: { path: "fao_sectors/config-country"},
                    hide: ['top-sectors', 'top-sectors-others', 'tot-oda-subsector', 'tot-oda'],
                    show: ['top-subsectors', 'tot-oda-sector']
                }
            ]
        },
        "donor": {
            purposecode: [
                {
                    layout: "default",
                    hide: ['top-sectors', 'top-sectors-others', 'top-subsectors', 'tot-oda-sector', 'tot-oda'],
                    show: ['tot-oda-subsector']
                },
                {
                    value: "all",
                    hide: ['tot-oda-subsector', 'tot-oda'],
                    show: ['top-sectors', 'top-sectors-others', 'top-subsectors', 'tot-oda-sector']
                }
            ],
            parentsector_code: [
                {
                    layout: "default",
                    hide: ['top-sectors', 'top-sectors-others', 'tot-oda-subsector', 'tot-oda'],
                    show: ['top-subsectors', 'tot-oda-sector']
                },
                {
                    value: "all",
                    hide: ['tot-oda-sector', 'tot-oda-subsector', 'top-subsectors'],
                    show: ['tot-oda', 'top-sectors', 'top-sectors-others']
                },
                {
                    value: "9999",
                    config: { path: "fao_sectors/config-donor"},
                    hide: ['top-sectors', 'top-sectors-others', 'tot-oda-subsector', 'tot-oda'],
                    show: ['top-subsectors', 'tot-oda-sector']
                }
            ]

        },
        "country_donor": {
            purposecode: [
                {
                    layout: "default",
                    hide: ['top-sectors', 'top-sectors-others', 'top-subsectors', 'tot-oda-sector', 'tot-oda'],
                    show: ['tot-oda-subsector']
                },
                {
                    value: "all",
                    hide: ['tot-oda-subsector'],
                    show: ['top-sectors', 'top-sectors-others', 'top-subsectors', 'tot-oda-sector', 'tot-oda']
                }
            ],
            parentsector_code: [
                {
                    layout: "default",
                    hide: ['top-sectors', 'top-sectors-others', 'tot-oda-subsector', 'tot-oda'],
                    show: ['top-subsectors', 'tot-oda-sector']
                },
                {
                    value: "all",
                    hide: ['tot-oda-sector', 'tot-oda-subsector', 'top-subsectors'],
                    show: ['tot-oda', 'top-sectors', 'top-sectors-others']
                },
                {
                    value: "9999",
                    config: { path: "fao_sectors/config-country_donor"},
                    hide: ['top-sectors', 'top-sectors-others', 'tot-oda-subsector', 'tot-oda'],
                    show: ['top-subsectors', 'tot-oda-sector']
                }
            ]
        }
    }
});