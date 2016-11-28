/*global define, amplify*/
define([
    'loglevel',
    'jquery',
    'html/common/title.hbs',
    'config/events',
    'config/errors',
    'config/config-base',
    'amplify-pubsub'
], function (log, $, template, Events, Errors, GeneralConfig, amplify) {

    'use strict';

    var defaults= {
        title: ''
    };
    var s = {
        css_classes: {
            TITLE_ITEMS_LIST: "#fx-title-items-list"
        },
        exclusions: ['all']
    };

    function TitleView(o) {
       // log.info("TitleView");
       // log.info(o);

        this.options = $.extend({}, defaults, o);

        this._parseInput(o);

        var valid = this._validateInput();

        if (valid === true) {

            this._attach();

            this._unbindEventListeners();

            this._init();

            return this;

        } else {
            log.error("Impossible to create Title View");
            log.error(valid)
        }
    }

    TitleView.prototype._parseInput = function (params) {
        this.$el = $(this.options.el);
        this.lang = this.options.lang || GeneralConfig.LANG;
    };

    TitleView.prototype._validateInput = function () {

        var valid = true,
            errors = [];

        //Check if $el exist
        if (this.$el.length === 0) {
            errors.push({code: Errors.MISSING_CONTAINER});
            log.warn("Impossible to find title container");
        }

        return errors.length > 0 ? errors : valid;
    };

    TitleView.prototype._attach = function () {
        this.$el.html(template);
    };

    TitleView.prototype._init = function () {
        this._bindEventListeners();
        this.$titleItemsList = this.$el.find(s.css_classes.TITLE_ITEMS_LIST);
    };

    TitleView.prototype._bindEventListeners = function () {
        amplify.subscribe(Events.TITLE_ADD_ITEM, this, this._onAdd);
        amplify.subscribe(Events.TITLE_REMOVE_ITEM, this, this._onRemove);
    };

    TitleView.prototype._unbindEventListeners = function () {
        // Remove listeners
        amplify.unsubscribe(Events.TITLE_REMOVE_ITEM, this._onAdd);
        amplify.unsubscribe(Events.TITLE_ADD_ITEM, this._onRemove);
    };


    TitleView.prototype.build = function () {
        var self = this, range = '', containsExclusion;

        var optionLabels = this.options.labels;

        $.each( optionLabels, function( id, item ) {
            for(var exclusion in s.exclusions){
                var exclude = s.exclusions[exclusion];
                if(item[exclude]) {
                    optionLabels[id] = [];
                }
            }
        });

        $.each(optionLabels, function( id, item ) {

            if(!$.isEmptyObject(item)){
                //console.log(id);
                //console.log(item);

                item.id = id;

                var key = Object.keys(item)[0];
                item.label = item[key];

                self._addItem(item);
            }
        });
    };

    TitleView.prototype.setLabels = function (labels) {
        this.options.labels = labels;
    };

    TitleView.prototype._onAdd = function (e) {
        this._addItem(e);
    };

    TitleView.prototype._addItem = function (item) {
       this._updateList(item);
    };

    TitleView.prototype._onRemove = function (id) {
        this._removeItem(id);
    };

    TitleView.prototype._removeItem = function (name) {
         this._findListItem(name).remove();
    };

    TitleView.prototype._findListItem = function(name) {
        return  this.$titleItemsList.find('[data-module="' + name + '" ]');
    };

    TitleView.prototype._updateList = function (item) {

        var hiddenItem = this._findHiddenItem(item.id);

        if(hiddenItem) {
            this._replaceListItem(hiddenItem, item);
        }
        else
            this._addToList(item)

    };

    TitleView.prototype._findHiddenItem = function(name) {
        var hiddenItems = this.$titleItemsList.find('[data-module="' + name + '" ]').filter(':hidden');

        if(hiddenItems.length > 0) {
            return hiddenItems;
        }
    };

    TitleView.prototype._replaceListItem = function (find, item) {
        this._replaceListItemText(find, item);
    };

    TitleView.prototype._replaceListItemText = function(item, replace) {
        item.text(replace.label)
    };

    TitleView.prototype._addToList = function (item) {
        this.$titleItemsList.append(this._createListItem(item));
    };


    TitleView.prototype._createListItem = function (item) {
        return $('<li data-module="' + item.id + '" style="display:none">'+ this._formatText(item.label) +'</li>');
    };

    TitleView.prototype._formatText = function(text){
        if(text === text.toUpperCase())
            return  (text.toLowerCase()).charAt(0).toUpperCase() + text.slice(1).toLowerCase();
        else
            return text;
    };

    TitleView.prototype.getTitleAsLabel = function (){
        this._cleanUpDuplications();

        var arr = this.$titleItemsList.find('li').map(function(i, el) {
            return $(el).text();
        }).get();

        return arr.join(' / ');
    };

    TitleView.prototype.getItemText = function (modulename) {
        return this._findListItem(modulename).text();
    };

    TitleView.prototype._cleanUpDuplications = function(){
        // Check if there is more than 1 list item that has the same data-module
        // If the check is true, then there will only be 2 items - 1 visible and 1 hidden item
        // If true: the first hidden item's text should be stored and then the hidden item removed
        // The stored text value is used to replace the text of the remaining item in the array

        this.$titleItemsList.find('[data-module]').each(function() {
            var matchingItemsArr = $('[data-module=' + $(this).attr('data-module') + ']');

            if (matchingItemsArr.length > 1) {
                var replacementText = "";

                for (var i = 0; i < matchingItemsArr.length; i++) {
                    if ( $(matchingItemsArr[i]).is(':hidden')) {
                        replacementText = $(matchingItemsArr[i]).text(); // store hidden item's text value
                        matchingItemsArr[i].remove(); // remove hidden item
                        break;
                    }
                }

                // Get the first item and set the replacement text
                $(matchingItemsArr[0]).text(replacementText);

            }
        });
    };

/*
    var TitleView = View.extend({

        // Automatically render after initialize
        autoRender: true,

        className: 'title-bar',

        // Save the template string in a prototype property.
        // This is overwritten with the compiled template function.
        // In the end you might want to used precompiled templates.
        template: template,

        initialize: function (config) {
            View.prototype.initialize.call(this, arguments);
            this.options = $.extend({}, defaults, config);

            this.render();
        },

        attach: function () {

            View.prototype.attach.call(this, arguments);

            this._initVariables();

            this._bindEventListeners();

        },

        getTemplateFunction: function() {
            var source = $(this.template).prop('outerHTML');
            var template = Handlebars.compile(source);
            return template({header:  this.options.header});
        },

        render: function () {
            this.setElement(this.container);

            $(this.container).html(this.getTemplateFunction());
        },


        build : function(){
            var self = this, range = '', containsExclusion;

            var optionLabels = self.options.labels;


            $.each( optionLabels, function( id, item ) {
                for(var exclusion in s.exclusions){
                    var exclude = s.exclusions[exclusion];
                   if(item[exclude]) {
                        optionLabels[id] = [];
                    }
                }
            });

            $.each(optionLabels, function( id, item ) {

                if(!$.isEmptyObject(item)){
                    //console.log(id);
                    //console.log(item);

                    item.id = id;

                    var key = Object.keys(item)[0];
                    item.label = item[key];

                    self._addItem(item);
                }
            });

            /!**$.each( this.options.labels, function( id, item ) {

                if(!$.isEmptyObject(item)){

                    item.id = id;

                    var key = Object.keys(item)[0];
                    item.label = item[key];
                    console.log(item.id,  item.label);


                    if(id === 'year-from' || id === 'year-to' ) {

                        if(range.length > 0){
                            range += ' - ' + item.label;
                        } else
                            range =  item.label

                        item.id = 'year';
                        item.label =  range;
                    }



                    self._addItem(item);
                }
            });**!/


        },

        setLabels : function(labels){
            this.options.labels = labels;

        },

        show : function(){
           this._cleanUpDuplications();

            this.$titleItemsList.find('li').each(function(){
                $(this).show();
                $(this).addClass('current-sel-element');
            });

        },

        getItemText: function (modulename) {
            return this._findListItem(modulename).text();
        },

        _cleanUpDuplications: function(){
        // Check if there is more than 1 list item that has the same data-module
        // If the check is true, then there will only be 2 items - 1 visible and 1 hidden item
        // If true: the first hidden item's text should be stored and then the hidden item removed
        // The stored text value is used to replace the text of the remaining item in the array

            this.$titleItemsList.find('[data-module]').each(function() {
            var matchingItemsArr = $('[data-module=' + $(this).attr('data-module') + ']');

            if (matchingItemsArr.length > 1) {
                var replacementText = "";

                for (var i = 0; i < matchingItemsArr.length; i++) {
                    if ( $(matchingItemsArr[i]).is(':hidden')) {
                        replacementText = $(matchingItemsArr[i]).text(); // store hidden item's text value
                        matchingItemsArr[i].remove(); // remove hidden item
                        break;
                    }
                }

                // Get the first item and set the replacement text
                $(matchingItemsArr[0]).text(replacementText);

            }
        });
    },

     cloneTitle: function (){
         var clonedTitle = this.$titleItemsList.clone().prop('id', 'clone');
         clonedTitle.find('li').removeAttr('data-module');
         clonedTitle.removeClass('list-inline fx-title-resume');
         clonedTitle.find('li').removeClass('current-sel-element');

      return clonedTitle; //$('ul[class*="fx-title-items"]').clone().appendTo('#title-bar-block');
     },

     getTitleAsLabel: function (){
            this._cleanUpDuplications();

            var arr = this.$titleItemsList.find('li').map(function(i, el) {
                return $(el).text();
            }).get();

            return arr.join(' / ');
     },

        getTitleAsArray: function (){
            this._cleanUpDuplications();

            var arr = this.$titleItemsList.find('li').map(function(i, el) {
                return $(el).text();
            }).get();

            return arr;
        },

    _initVariables: function () {
           this.$titleItemsList = this.container.find(s.css_classes.TITLE_ITEMS_LIST);
        },

        _bindEventListeners: function () {
            //amplify.subscribe(s.events.ADD_ITEM, this, this._onAdd);
            //amplify.subscribe(s.events.REMOVE_ITEM, this, this._onRemove);

            amplify.subscribe(Events.TITLE_ADD_ITEM, this, this._onAdd);
            amplify.subscribe(Events.TITLE_REMOVE_ITEM, this, this._onRemove);

        },

        _onAdd: function (e) {
           // console.log("============== ");
           // console.log(e);

           /!* $.each( optionLabels, function( id, item ) {
                for(var exclusion in s.exclusions){
                    var exclude = s.exclusions[exclusion];
                    if(item[exclude]) {
                        optionLabels[id] = [];
                    }
                }
            });*!/


            this._addItem(e);
        },

        _onRemove: function (id) {
            this.removeItem(id);
        },

        _addItem: function (item) {
           this._updateList(item);
        },

        removeItem: function (name) {
            this._findListItem(name).remove();
        },

        hideItem: function (name) {
            this._findListItem(name).hide();
        },

        _addToList: function (item) {
            this.$titleItemsList.append(this._createListItem(item));
        },

        _findListItem: function(name) {
            return  this.$titleItemsList.find('[data-module="' + name + '" ]');
        },

        _findHiddenItem: function(name) {
            var hiddenItems = this.$titleItemsList.find('[data-module="' + name + '" ]').filter(':hidden');

            if(hiddenItems.length > 0) {
              return hiddenItems;
            }
        },

        _replaceListItemText: function(item, replace) {
             item.text(replace.label)
        },

        _updateList: function (item) {

            var hiddenItem = this._findHiddenItem(item.id);

            if(hiddenItem) {
                this._replaceListItem(hiddenItem, item);
            }
            else
                this._addToList(item)

        },

        _createListItem: function (item) {
          return $('<li data-module="' + item.id + '" style="display:none">'+ this._formatText(item.label) +'</li>');
        },

        _formatText: function(text){
            if(text === text.toUpperCase())
              return  (text.toLowerCase()).charAt(0).toUpperCase() + text.slice(1).toLowerCase();
            else
              return text;
        },

        _replaceListItem: function (find, item) {
          this._replaceListItemText(find, item);
        },

        _unbindEventListeners: function () {
            // Remove listeners
           // amplify.unsubscribe(s.events.ADD_ITEM, this._onAdd);
           // amplify.unsubscribe(s.events.REMOVE_ITEM, this._onRemove);

            amplify.unsubscribe(Events.TITLE_REMOVE_ITEM, this._onAdd);
            amplify.unsubscribe(Events.TITLE_ADD_ITEM, this._onRemove);
        },

        dispose: function () {
            this._unbindEventListeners();
            View.prototype.dispose.call(this, arguments);
        }

    });*/

    return TitleView;
});
