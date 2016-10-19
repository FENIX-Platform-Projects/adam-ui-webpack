/*global define*/
define(function () {

    'use strict';

    return {
       displayMode: 'classic',  //default = 'classic' or 'edwards'
       displayStat: 'true', // default = true
       xAxis: {
           categories: []
       },
       series: [],
       exporting: false,
       width: '600',
       colors: ["rgb(86,145,195)","rgb(118,190,166)","rgb(86,99,195)"]//,

       //template: {
         // id: "label2",
         //  css: [{left: '400px'}]
      // }
       //searchInput: false
    };
});