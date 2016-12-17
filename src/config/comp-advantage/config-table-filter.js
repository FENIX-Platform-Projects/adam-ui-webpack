/*global define*/

define(function () {

    'use strict';

    return {

        groupedRow : {

            selector : {
                id : "input",
                type : "checkbox",
                source : [
                    { value : "groupedRow", label : "Group row"}

                ],
                default: ["groupedRow"]
            },

            template : {
                title : "groupedRow"
            }
        }

        }



});