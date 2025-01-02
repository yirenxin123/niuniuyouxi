"use strict";

/**
 * Created by shrimp on 17/3/1.
 */

var MessageReq = require("MessageReq");
var GameSystem = require("GameSystem");
/*
* const (
 E_CHAT_TEXT_MSG = 1 //是文本聊天
 E_CHAT_GIFT_MSG   = 2 //是表情
 )

 const (
 E_ROSE_GIFT     = 1 //玫瑰
 E_LOVE_GIFT     = 2 //爱心
 E_FOAM_GIFT     = 3 //泡沫
 E_BIG_ROSE_GIFT = 4 //大朵玫瑰
 E_KETCHUP_GIFT  = 5 //番茄酱
 )

 ToUid uint32 `json:"touid"`
 Kind  int    `json:"kind"`
 Type  int    `json:"type"` //具体某个礼物or某个表情(具体表情索引客户端自定义)
 Text  string `json:"text"` //文字or语音内容
* **/

window.ChatType = cc.Enum({
    E_CHAT_WORD_KIND: 1, //文字
    E_CHAT_GIFT_KIND: 2, //礼物
    E_CHAT_FACE_KIND: 3, //表情
    E_CHAT_VOICE_KIND: 4 });

window.GiftType = cc.Enum({
    E_ROSE_GIFT: 1, //玫瑰
    E_LOVE_GIFT: 2, //爱心
    E_FOAM_GIFT: 3, //泡沫
    E_BIG_ROSE_GIFT: 4, //大朵玫瑰
    E_KETCHUP_GIFT: 5 });

function ChatReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_GAME_CHAT_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("ChatReqPacket.send");
        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            gamesvcid: GameSystem.getInstance().gamesvcid,
            tableid: GameSystem.getInstance().tableid,
            touid: msg.touid,
            kind: msg.kind,
            type: msg.type,
            text: msg.text
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = ChatReqPacket;