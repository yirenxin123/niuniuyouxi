"use strict";

var MessageResp = require("MessageResp");

function UserDetailRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_USER_DETAIL_CMD_ID;
    this.gold = 0;
    this.diamond = 0;
    this.playcount = 0;
    this.wincount = 0;
    this.losecount = 0;
    this.tablecount = 0;

    this.onMessage = function (msg) {
        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;

        this.gold = msg.gold;
        this.diamond = msg.diamond;
        this.playcount = msg.playcount;
        this.wincount = msg.wincount;
        this.losecount = msg.losecount;
        this.tablecount = msg.tablecount;
    };
}

module.exports = UserDetailRespPacket;