define([
    'jquery',
    'loglevel',
    'underscore',
    'fenix-ui-reports',
    'config/config-base'
], function ($, log, _, Report, C) {

    'use strict';

    function DataExporter(o) {
        $.extend(true, this, {initial: o});

        this._parseInput();

        this._init();

        return this;
    }


    DataExporter.prototype._init = function () {
        this.report = new Report({
            environment: this.environment,
            cache: this.cache
        });

    };

    DataExporter.prototype._parseInput = function () {
        this.environment = this.initial.environment;
        this.cache = typeof this.initial.cache === "boolean" ? this.initial.cache : C.cache;
        this.lang = this.initial.lang;
        this.model = this.initial.model;

    };

    DataExporter.prototype.downloadData = function () {

        console.log(" ================== downloadData: model =================== ", this.model);

        var payload = {
            resource: this.model,
            input: {
                config: {}
            },
            output: {
                config: {
                    lang: this.lang.toUpperCase()
                }
            }
        };

        log.info("Configure FENIX export: table");

        log.info(payload);

        this.report.export({
            format: "table",
            config: payload
        });
    };

    return DataExporter;
});