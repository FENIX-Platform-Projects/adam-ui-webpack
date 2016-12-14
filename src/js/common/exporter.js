define([
    'jquery',
    'loglevel',
    'underscore',
    'config/config-base',
    'html2canvas',
    'jQuery.print'
], function ($, log, _, BaseConfig, html2canvas) {

    'use strict';

    function Exporter() {

        return this;
    }

    Exporter.prototype.print = function (id) {
        var divId =  $(id);

        $.print(divId)
    };

    Exporter.prototype.download = function (id, type, typeId, name) {
        var self = this;
        var element = $(id);

        html2canvas(element, {
            onrendered: function (canvas) {
                var img = canvas.toDataURL(type);
                self.downloadURI("data:" + img, name+"."+typeId);
            },  background: '#fff'
        });
    };


    //Creating dynamic link that automatically click
    Exporter.prototype.downloadURI = function(uri, name) {
        var link = document.createElement("a");
        link.id = 'temp-download-link-'+name;
        link.download = name;
        link.href = uri;
        link.click();
        //after creating link delete dynamic link
        $('#'+link.id).remove();

    };

    return new Exporter;
});