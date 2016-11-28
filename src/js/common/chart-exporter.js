define([
    'jquery',
    'loglevel',
    'underscore',
    'highcharts'
], function ($, log, _, Highcharts) {

    'use strict';

    function ChartExporter() {
        // Load Exporting Module after Highcharts loaded
        require('highcharts/modules/exporting')(Highcharts);

       return this;
    }

    ChartExporter.prototype.print = function (id) {
        var $chartCont =  $("div[data-item='"+id+"']");
        var chart = Highcharts.charts[$chartCont.data('highchartsChart')];

        chart.print();
    };

    ChartExporter.prototype.download = function (id, type, name) {
        var $chartCont =  $("div[data-item='"+id+"']");
        var chart = Highcharts.charts[$chartCont.data('highchartsChart')];

        chart.exportChart({
            type: type,
            filename: name
        });
    };

    return ChartExporter;
});