'use strict';

var BasePop = require('BasePop');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var MessageFactory = require('MessageFactory');
var GamePlayer = require('GamePlayer');
var ToastView = require('ToastView');
var GameSystem = require("GameSystem");

cc.Class({
    extends: BasePop,

    properties: {
        GrayLayer: cc.Sprite
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._super();
        var self = this;
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            cc.log("onLoad : stop event");
            self.dismiss();
        }.bind(this));
    },

    callBackBtn: function callBackBtn(event, CustomEventData) {
        var BtnName = event.target.getName();
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);

        cc.log("Bullfight_ExpressionView.callBackBtn,BtnName = " + BtnName);
        if (GamePlayer.getInstance().seatid == -1) {
            ToastView.show("您没有坐下不能发送表情");
            return;
        }

        if (BtnName.indexOf("Btn") >= 0) {

            var data = {
                touid: GamePlayer.getInstance().uid,
                kind: ChatType.E_CHAT_FACE_KIND,
                type: Number(CustomEventData),
                text: ""
            };
            MessageFactory.createMessageReq(US_REQ_GAME_CHAT_CMD_ID).send(data);
        }
        this.dismiss();
    }

});