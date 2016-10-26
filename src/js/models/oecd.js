define([
    'loglevel',
    'jquery',
    'underscore'
], function (log, $, _) {

    'use strict';

    function OecdModel() {
        this.state=0;
        this.props={};
        this.observers=[]
        this.addObserver = function(observer) {

            // i, the model, have no idea what this observer is.
            this.observers.push(observer);
        }
        this.notifyObservers = function() {

            for (var i = 0; i < this.observers.length; i++) {

                // i, the model, have no idea what this does in the observer.
                this.observers[i].modelChanged();
            }
        }
        this.doSomethingWithInternalState = function(key, value){
            this.state+=1

            this.set(key, value);
            // i, the model will notify observers when my state changes.
            // They can decide on their own what to do then.
            this.notifyObservers();
        }

       // this.doSomethingWithInternalState = function(observer){
         //   this.state+=1

            // i, the model will notify observers when my state changes.
            // They can decide on their own what to do then.
          //  this.notifyObservers();
       // }

        this.set = function(key, value){
            this.state+=1
            this.props[key] = value;
            this.notifyObservers();
        }

        this.get = function(key){
            return this.props[key];
        }

        this.getProperties  = function(){
            return this.props;
        }

        return this;
    }

    return OecdModel;

});















