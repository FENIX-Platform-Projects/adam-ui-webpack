define([
    'jquery',
    'loglevel',
    'underscore',
    'config/config-base',
    'common/data-exporter',
    'common/chart-exporter'
], function ($, log, _, BaseConfig, DataExporter, ChartExporter) {

    'use strict';

    var s = {
         prefix : {
             DOWNLOAD_OPTIONS: '-download-options',
             EXPORT: '-export',
             TITLE_EXPORT: '-title-export',
             CONTAINER: '-container'
         }
    };

    function ChartsDownloader(params) {
        var self = this;
        this.lang = params.lang;
        this.environment =  params.environment;

        this.chartExporter = new ChartExporter();



        return this;
    }


    ChartsDownloader.prototype.onDownloadMenuClick = function (modelObj, modelId, type) {

        switch(type) {
            case BaseConfig.DOWNLOAD.EXCEL:
                this._downloadExcel(modelObj);
                break;
            default:
                this.chartExporter.download("div[data-item='"+modelId+"']", type, modelId);

        }
    };


    ChartsDownloader.prototype.onPrintMenuClick = function (model) {

        console.log(this.chartExporter);

        this.chartExporter.print("div[data-item='"+model+"']");

    };

    ChartsDownloader.prototype._downloadExcel = function (model) {

        var dataExporter = new DataExporter({
            lang: this.lang,
            environment:  this.environment
        });

        return dataExporter.downloadData(model);

    };


    return ChartsDownloader;
});