"use strict";

var BasePop = require("BasePop");
var MusicMgr = require("MusicMgr");
var Audio_Common = require("Audio_Common");
var GameSystem = require("GameSystem");

cc.Class({
    extends: BasePop,

    properties: {
        CommitLayout: {
            default: null,
            type: cc.Layout
        },
        HistoryLayout: {
            default: null,
            type: cc.Layout
        },
        ServiceOnlineLayout: {
            default: null,
            type: cc.Layout
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        cc.log('ServiceView : onLoad');
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            cc.log("stop event");
            event.stopPropagation();
        }.bind(this));

        this.scaleTo(this.bg);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    callbackBtnClose: function callbackBtnClose() {
        cc.log("ServiceView : callbackBtnClose");
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        this.dismiss();
    },

    callbackBtnLabel: function callbackBtnLabel(toggle, customEventData) {
        cc.log("ServiceView : callbackBtnLabel,customEventData = " + customEventData);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        this.switchLayout(customEventData);
    },

    switchLayout: function switchLayout(type) {
        if (type === 1) {
            this.CommitLayout.node.setVisible(true);
            //this.CommitLayout.node.opacity = 255;
            this.HistoryLayout.node.opacity = 0;
            this.ServiceOnlineLayout.node.opacity = 0;
        } else if (type === 2) {
            this.CommitLayout.node.setVisible(false);
            //this.CommitLayout.node.opacity = 0;
            this.HistoryLayout.node.opacity = 255;
            this.ServiceOnlineLayout.node.opacity = 0;
        } else {
            this.CommitLayout.node.opacity = 0;
            this.HistoryLayout.node.opacity = 0;
            this.ServiceOnlineLayout.node.opacity = 255;
        }
    }
});