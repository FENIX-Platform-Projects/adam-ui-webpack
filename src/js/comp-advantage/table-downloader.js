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

    TableDownloader.prototype.onDownloadMenuClick = function (modelObj, title, subtitle) {
        this._downloadExcel(modelObj, title, subtitle);
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