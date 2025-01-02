"use strict";

/**
 * Created by shrimp on 17/2/26.
 */

var MessageResp = require("MessageResp");

function LeaveGameRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_LEAVE_GAME_CMD_ID;

    this.param = "";
    this.tableid = 0;
    this.leaveuid = 0;
    //接收的数据
    this.onMessage = function (msg) {
        //{"cmd":6553604,"seq":4,"uid":10042,"code":0,"desc":"执行成功"}
        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
    };
}

module.exports = LeaveGameRespPacket;