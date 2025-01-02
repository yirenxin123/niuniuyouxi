'use strict';

/**
 * Created by shrimp on 17/4/8.
 */
var MessageReq = require("MessageReq");
var GamePlayer = require('GamePlayer');
var GameSystem = require('GameSystem');

function SearchClubReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_SEARCH_CLUB_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("FindRoomReqPacket.send");

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            key: msg.key
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = SearchClubReqPacket;