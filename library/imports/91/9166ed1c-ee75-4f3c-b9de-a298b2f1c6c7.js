'use strict';

var BasePop = require('BasePop');
var MessageFactory = require('MessageFactory');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require("GameSystem");

cc.Class({
    extends: BasePop,

    properties: {
        EditBox: cc.EditBox
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._super();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    callBackBtn: function callBackBtn(event, CustomEventData) {

        var BtnName = event.target.getName();
        cc.log('ClubCreateView.callBackBtn,BtnName = ' + BtnName);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if (BtnName == "BtnClose") {
            this.dismiss();
        } else if (BtnName == "BtnFind") {
            var data = {
                key: this.EditBox.string
            };
            MessageFactory.createMessageReq(US_REQ_SEARCH_CLUB_CMD_ID).send(data);
            this.dismiss();
        }
    }
});