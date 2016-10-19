 /*global define*/
define(function ( ) {

    'use strict';

    return {

        NOT_AUTHORIZED : "fx.fenix.security.not_authorized",

        STATE_CHANGE : 'fx.fenix.state.change',
        MENU_UPDATE : 'fx.fenix.menu.change',
        MENU_ADD_BREADCRUMB:  'fx.fenix.menu.addbreadcrumb',

        SELECTORS_READY: "fx.analyze.selectors.ready",
        SELECTORS_ITEM_SELECT : "fx.analyze.selectors.select",
        TREE_READY : "fx.analyze.tree.ready",
        RELOAD_RESULT : "fx.analyze.results.reload",
        CHANGE_MODE: "fx.analyze.mode.change",

        MENU_RESET_BREADCRUMB: 'fx.fenix.menu.resetbreadcrumb',

        TITLE_ADD_ITEM: 'fx.title.item.add',
        TITLE_REMOVE_ITEM: 'fx.title.item.remove'

    };
});
