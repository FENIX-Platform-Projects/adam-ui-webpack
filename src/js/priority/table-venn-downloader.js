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

    function TableVennDownloader(params) {
        this.lang = params.lang;
        this.environment =  params.environment;

        return this;
    }

    TableVennDownloader.prototype.onDownloadMenuClick = function (modelObj, modelId, type) {

        var type_id = type.split("/").pop();
        var containerId =  "#"+modelId+ s.prefix.DOWNLOAD_OPTIONS;
        var $container = $(containerId);

        switch(type) {
            case BaseConfig.DOWNLOAD.EXCEL:
                this._downloadExcel(modelObj);
                break;
            default:
                this._downloadVennImage($container, type, type_id, modelId);

        }
    };

    TableVennDownloader.prototype._downloadVennImage = function (container, type, type_id, model) {

        var divId = "div[data-item='"+model+"']",
            containerId =  "#"+model+ s.prefix.CONTAINER,
            $container = $(containerId),
            exportVennCssClass = model+s.prefix.EXPORT,
            exportVennTitleCssClass = model+s.prefix.TITLE_EXPORT,
            title =  $container.find('.display-box-header b').html(),
            titleContainer = "<div class='"+exportVennTitleCssClass+"'>"+title+"</div>";

        //Retrieve Title of Venn
        var title =  $container.find('.display-box-header b').html();
        var oStyle = $(divId).attr("style");

        //Append title to DIV for export purposes
        $(divId).removeAttr("style");
        $(divId).addClass(exportVennCssClass);
        $(divId).prepend(titleContainer);

        $(container).hide();
        Exporter.download(divId, type, type_id, model);
        $(container).show();

        //Re-instate original set-up
        $(divId).attr("style", oStyle ); // add original style
        $(divId).removeClass(exportVennCssClass); // remove added css

        $("."+exportVennTitleCssClass).remove();// remove title div
    };

    TableVennDownloader.prototype.onPrintMenuClick = function (event) {

        var model = $(event.target).attr('data-model-id');

        var divId = "div[data-item='"+model+"']",
            containerId =  "#"+model+ s.prefix.CONTAINER,
            $container = $(containerId),
            exportVennCssClass = model+s.prefix.EXPORT,
            exportVennTitleCssClass = model+s.prefix.TITLE_EXPORT,
            title =  $container.find('.display-box-header b').html(),
            titleContainer = "<div class='"+exportVennTitleCssClass+"'>"+title+"</div>";

        //Retrieve Title of Venn
        var title =  $container.find('.display-box-header b').html();
        var oStyle = $(divId).attr("style");

        //Append title to DIV for export purposes
        $(divId).removeAttr("style");
        $(divId).addClass(exportVennCssClass);
        $(divId).prepend(titleContainer);

        Exporter.print(divId);

        //Re-instate original set-up
        $(divId).attr("style", oStyle ); // add original style
        $(divId).removeClass(exportVennCssClass); // remove added css

        $("."+exportVennTitleCssClass).remove();// remove title div

    };

    TableVennDownloader.prototype._downloadExcel = function (model) {

        var dataExporter = new DataExporter({
            lang: this.lang,
            environment:  this.environment
        });

        return dataExporter.downloadData(model);

    };


    return TableVennDownloader;
});