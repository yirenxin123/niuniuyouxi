"use strict";

/**
 *
 *
 * 滚动消息  拖入场景 后 自己管理自己
 *
 *
 * 当前版本1.3.2 richtext 有bug  等待官方解决
 */

var BasePop = require('BasePop');

//var ServerSpeakPacket = require('ServerSpeakPacket');
function RollMsgT() {
    this.strMsg = "";
    this.iType = 0;
}

cc.Class({
    extends: BasePop,

    properties: {
        speaker: cc.Sprite,
        speakerTxtHtml: cc.RichText,
        speakerHolder: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._super();

        this.queueSpeakerMsg = new Array();
        this.isShowRollFinish = true;

        this.speaker.node.active = false;

        this.baseX = this.speakerTxtHtml.node.x;

        this.remaindWidth = 960 + this.speakerTxtHtml.node.x;
    },

    onDestroy: function onDestroy() {
        GlobalEventManager.getInstance().removeListener(this.socketMessageListenerID);
    },

    onSceneMsg: function onSceneMsg(event) {
        var msg = event.data;
        if (msg.popView == "HallScene") {
            if (msg.btn == "RollMsg") {
                var ledInfo = msg.data;

                this.addSpeakerMsg(ledInfo.text, 0);
            }
        }
    },

    onMessage: function onMessage(event) {
        var msg = event.data;
        var cmd = msg.cmd;
        switch (cmd) {
            case window.SERVER_SPEAK_NEW_CMD:

                this.addSpeakerMsg(msg.trumpetMsg, msg.trumpetType);
                break;

        }
    },

    addSpeakerMsg: function addSpeakerMsg(content, contenttype) {
        if (content === undefined || content == "") {
            return;
        }
        // <color = 0xFFFFFFFF> 洪福齐天,玩家</color><color = 0x00b8c8FF>元大炮</color><color = 0xFFFFFFFF>在炸金花1元场赢取</color><color = 0x00d236FF>5000金币</color><color = 0xFFFFFFFF>,富甲一方</color>


        var ss = String(content);
        var re = /0x/g;
        var newContent = ss.replace(re, "#");
        var re2 = /FF>/g;
        newContent = newContent.replace(re2, ">");

        var msg = new RollMsgT();
        msg.iType = contenttype;
        msg.strMsg = newContent;

        this.queueSpeakerMsg.push(msg);
    },

    showSpeaker: function showSpeaker(content, contenttype) {
        if (content == "") {
            return;
        }
        this.speakerTxtHtml.node.active = true;
        this.speakerTxtHtml.node.x = this.baseX;
        this.speakerTxtHtml.node.y = this.speakerHolder.height * 2;
        this.speakerTxtHtml.string = content;

        var size = cc.size(this.speakerHolder.width, this.speakerHolder.height);

        var moveTo = cc.moveTo(1.0, cc.p(this.speakerTxtHtml.node.x, 0));
        var delay = cc.delayTime(2.0);
        var actionCallBack = cc.callFunc(this.moveDownCallback, this);
        var actionall = cc.sequence(moveTo, delay, actionCallBack);
        this.speakerTxtHtml.node.runAction(actionall);
    },

    moveDownCallback: function moveDownCallback() {
        var winSize = cc.director.getWinSize();
        var contentSize = cc.size(this.speakerTxtHtml._linesWidth[0], this.speakerTxtHtml.node.height);

        var moveX = 0;
        if (this.remaindWidth < contentSize.width - winSize.width || this.speakerHolder.width < contentSize.width) {
            moveX = contentSize.width + this.remaindWidth;
        }

        if (moveX <= 0) {
            this.moveLeftCallback();
        } else {
            var moveBy = cc.moveBy(moveX / 300, cc.p(moveX > 0 ? -moveX : 0, 0));
            var delay = cc.delayTime(0.8);
            var actionCallBack = cc.callFunc(this.moveLeftCallback, this);
            var actionall = cc.sequence(moveBy, delay, actionCallBack);
            this.speakerTxtHtml.node.runAction(actionall);
        }
    },
    moveLeftCallback: function moveLeftCallback() {
        this.isShowRollFinish = true;
        if (this.speakerTxtHtml) {
            // speakerTxtHtml.removeFromParentAndCleanup(true);
            this.speakerTxtHtml.node.active = false;
        }

        if (this.queueSpeakerMsg.length == 0 && this.speaker && this.speaker.node.activeInHierarchy) ;
        {
            this.speaker.node.active = false;
        }
    },

    update: function update(dt) {
        var self = this;
        if (self.queueSpeakerMsg.length > 0 && self.isShowRollFinish) {
            if (self.speaker && !self.speaker.node.active) {
                self.speaker.node.active = true;
            }

            this.isShowRollFinish = false;
            var msg = self.queueSpeakerMsg.pop();
            self.showSpeaker(msg.strMsg, msg.iType);
        }
    }

});