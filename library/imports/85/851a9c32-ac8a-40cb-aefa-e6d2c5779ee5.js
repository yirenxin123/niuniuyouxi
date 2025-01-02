"use strict";

var BasePop = require("BasePop");
cc.Class({
    extends: BasePop,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        ScrollView: cc.ScrollView
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._super();
    },

    callbackBtn: function callbackBtn(event, CustomEventData) {}
});