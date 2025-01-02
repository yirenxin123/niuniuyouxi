'use strict';

/**
 * Created by shrimp on 17/4/15.
 */
var MessageReq = require("MessageReq");
var GamePlayer = require('GamePlayer');
var GameSystem = require('GameSystem');

function ClubOwnerModifyRoleReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.CLUB_REQ_OWNER_MODIFY_ROLE_CMD_ID;
    //准备发送的数据
    this.send = function (msg) {
        cc.log("ClubOwnerModifyRoleReqPacket.send");

        var param = {
            uid: msg.uid,
            role: msg.role
        };

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            clubid: msg.clubid,
            param: param

        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = ClubOwnerModifyRoleReqPacket;