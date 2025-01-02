"use strict";

/**
 * Created by shrimp on 17/3/1.
 */
var MessageResp = require("MessageResp");
/*
* type US_RESP_GAME_CHAT_T struct {
 JsonHead
 RespHead
 romUid    uint32 `json:"fromuid"`
 FromSeatId int    `json:"fromseatid"` //如果不是在桌位上
 ToUid      uint32 `json:"touid"`
 ToSeatId   int    `json:"toseatid"`
 Kind       int    `json:"kind"`
 Type       int    `json:"type"` //具体某个礼物or某个表情
 Text       string `json:"text"` //文字or语音内容
 }
* */
function ChatRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_GAME_CHAT_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.fromuid = msg.fromuid;
        this.fromseatid = msg.fromseatid;
        this.touid = msg.touid;
        this.toseatid = msg.toseatid;
        this.kind = msg.kind;
        this.type = msg.type;
        this.text = msg.text;
        //GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = ChatRespPacket;