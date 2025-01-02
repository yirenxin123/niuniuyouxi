"use strict";

/**
 * Created by shrimp on 17/3/1.
 */

var MessageReq = require("MessageReq");
var GameSystem = require('GameSystem');
function OwnerConfirmReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_OWNER_CONFIRM_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            gamesvcid: msg.gamesvcid,
            tableid: msg.tableid,
            playeruid: msg.playeruid,
            privateid: msg.privateid,
            result: msg.result };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = OwnerConfirmReqPacket;