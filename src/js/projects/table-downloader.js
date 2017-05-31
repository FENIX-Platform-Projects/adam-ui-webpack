define([
    'jquery',
    'loglevel',
    'underscore',
    'config/config-base',
    'common/exporter',
    'common/data-exporter'
], function ($, log, _, BaseConfig, Exporter, DataExporter) {

    'use strict';

    var s = {
         prefix : {
             DOWNLOAD_OPTIONS: '-download-options',
             EXPORT: '-export',
             TITLE_EXPORT: '-title-export',
             CONTAINER: '-container'
         }
    };

    function TableDownloader(params) {
        this.lang = params.lang;
        this.environment =  params.environment;

        return this;
    }

    TableDownloader.prototype.onDownloadMenuClick = function (modelObj, title, subtitle, params) {

        this._downloadExcel(modelObj, title, subtitle);

        /*

        var count = 0;

        if (params.fao_region.length < 1) count++;
        if (params.recipientcode.length < 1) count++;
        if (params.donorcode.length < 1) count++;
        if (params.parentsector_code.length < 1) count++;
        if (params.purposecode.length < 1) count++;

        if (count > 3) console.log(params);

        if ((params.fao_region.length < 1) &&
            (params.recipientcode.length < 1) &&
            (params.donorcode.length < 1) &&
            (params.parentsector_code.length < 1) &&
            (params.purposecode.length < 1) ) {
                window.open('http://fenixrepo.fao.org/cdn/data/adam/project_analysis/project_analysis.zip');
        } else {
                this._downloadExcel(modelObj, title, subtitle);
        }

        */
    };

    TableDownloader.prototype._downloadExcel = function (model, title, subtitle) {

        var dataExporter = new DataExporter({
            lang: this.lang,
            environment:  this.environment
        });

        return dataExporter.downloadData(model, title, subtitle);

    };


    return TableDownloader;
});