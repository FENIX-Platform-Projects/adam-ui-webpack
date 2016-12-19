define([
        "./en/projects",
        "./fr/projects",
        "./es/projects"
    ],
    function (i18nEn, i18nFr, i18nEs) {

        'use strict';

        return {
            en: i18nEn,
            fr: i18nFr,
            es: i18nEs
        }
    });