'use strict';

var BasePop = require('BasePop');
var MessageFactory = require('MessageFactory');
var ToastView = require('ToastView');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require('GameSystem');

cc.Class({
    extends: BasePop,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {
        this._super();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    /*********************Network***************************/

    onMessage: function onMessage(event) {
        cc.log("Bullfight_GameScene.onMessage");
        this._super(event);
        var msg = event.data;
        var cmd = msg.cmd;
        switch (cmd) {
            case window.US_RESP_GAME_SWITCH_CMD_ID:
                this.onDismissGame(msg);
                break;
        }
    },

    onDismissGame: function onDismissGame(msg) {
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            if (msg.isstart == 1) {} else {
                ToastView.show("房间解散成功，本局结束后将解散");
            }
        }
    },

    callbackBtn: function callbackBtn(event, CustomEventData) {
        var BtnName = event.target.getName();
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        cc.log("Bullfight_OwnerView.callbackBtn,BtnName = " + BtnName);
        if (BtnName == "BtnClose") {
            this.dismiss();
        } else if (BtnName == "BtnDismiss") {
            var data = {
                isstart: 0
            };
            MessageFactory.createMessageReq(US_REQ_GAME_SWITCH_CMD_ID).send(data);
            this.dismiss();
        }
    }
});