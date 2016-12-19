define([
        "./en/table",
        "./fr/table",
        "./es/table"
    ],
    function (i18nEn, i18nFr, i18nEs) {

        'use strict';

        return {
            en: i18nEn,
            fr: i18nFr,
            es: i18nEs
        }
    });