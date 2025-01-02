'use strict';

var UtilTool = require('UtilTool');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require("GameSystem");

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
        Time: cc.Label,
        Content: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.msg = null;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    setMessageCellMsg: function setMessageCellMsg(msg) {
        this.msg = msg;
        this.Content.string = BASE64.decoder(msg.msg);
        this.Time.string = UtilTool.getFormatDataDetail(msg.time);
        cc.log('MessageCell.setMessageCellMsg,msg = ' + JSON.stringify(msg));
    },

    callbackBtn: function callbackBtn(event, CustomEventData) {
        cc.log("MessageCell.callbackBtn,CustomEventData = " + CustomEventData);
        var btnName = event.target.getName();
        cc.log("MessageCell.callbackBtn,btnName = " + btnName);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if (btnName == "Click") {
            this.dismiss();
        }
    }

});