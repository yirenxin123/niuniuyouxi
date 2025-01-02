'use strict';

var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
cc.Class({
    extends: cc.Component,

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
        AreaName: cc.Label,
        BtnFlag: cc.Sprite
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.name = "";
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    callBackBtn: function callBackBtn(event, CustomEventData) {
        var BtnName = event.target.getName();
        cc.log("ClubAreaCell.callBackBtn,BtnName = " + BtnName);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if (BtnName == "BtnClose") {
            this.dismiss();
        } else if (BtnName == "ClubAreaCell") {}
    },

    setAreaCellInfo: function setAreaCellInfo(name, iCount) {
        this.name = name;
        this.AreaName.string = name;
        if (iCount <= 0) {
            this.BtnFlag.node.active = false;
        }
    }
});