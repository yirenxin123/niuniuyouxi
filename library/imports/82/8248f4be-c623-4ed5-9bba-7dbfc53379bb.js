'use strict';

/**
 * Created by shrimp on 17/4/7.
 */

var MessageReq = require("MessageReq");
var GamePlayer = require('GamePlayer');
var GameSystem = require('GameSystem');

function GetClubListReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_CLUB_LIST_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("GetClubListReqPacket.send");

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid
        };
        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}
module.exports = GetClubListReqPacket;