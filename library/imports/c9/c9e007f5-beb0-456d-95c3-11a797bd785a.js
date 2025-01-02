"use strict";

/**
 * Created by shrimp on 17/4/13.
 */
var MessageReq = require("MessageReq");
/*
* const (
 E_SYSTEM_MSG_T = 1
 E_CLUB_MSG_T   = 2
 E_MAIL_MSG_T   = 3
 )
 type US_REQ_MSG_LIST_T struct {
 JsonHead
 Param PARAM_REQ_MSG_LIST_T `json:"param"`
 }
 type PARAM_REQ_MSG_LIST_T struct {
 Type  int `json:"type"`
 Start int `json:"start"`
 Total int `json:"total"`
 }
* */
function GetMsgListReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_MSG_LIST_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("GetMsgNumReqPacket.send");

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            param: msg
        };
        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = GetMsgListReqPacket;