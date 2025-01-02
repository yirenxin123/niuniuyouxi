'use strict';

var BasePop = require("BasePop");
var MessageFactory = require('MessageFactory');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require("GameSystem");
cc.Class({
    extends: BasePop,

    properties: {
        Content: cc.Label,
        Time: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {},

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    callBackBtn: function callBackBtn(event, CustomEventData) {
        cc.log("MessageCellDetailView.callbackBtn,CustomEventData = " + CustomEventData);
        var btnName = event.target.getName();
        cc.log("MessageCellDetailView.callbackBtn,btnName = " + btnName);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if (btnName == "BtnClose") {
            this.dismiss();
        }
    },

    setContent: function setContent(msg) {
        this.Content.string = BASE64.decoder(msg.msg);
        if (msg.type == 1) return;
        var data = {
            type: msg.type,
            msgid: msg.msgid
        };
        MessageFactory.createMessageReq(US_REQ_SET_MSG_READ_CMD_ID).send(data);
    }
});