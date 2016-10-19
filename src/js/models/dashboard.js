define([
    'loglevel',
    'jquery',
    'underscore'
], function (log, $, _) {

    'use strict';

    function DashboardModel() {
        this.state=0;
        this.observers=[]
        this.addObserver = function(observer) {

            // i, the model, have no idea what this observer is.
            this.observers.push(observer);
        }
        this.notifyObservers = function() {
            for (i = 0; i < this.observers.length; i++) {

                // i, the model, have no idea what this does in the observer.
                this.observers[i].modelChanged();
            }
        }
        this.doSomethingWithInternalState = function(observer){
            this.state+=1

            // i, the model will notify observers when my state changes.
            // They can decide on their own what to do then.
            this.notifyObservers();
        }

        return this;
    }

    return DashboardModel;

});















