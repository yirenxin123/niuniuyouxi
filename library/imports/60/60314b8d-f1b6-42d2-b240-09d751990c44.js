"use strict";

/**
 * Created by shrimp on 17/2/26.
 */
var MessageResp = require("MessageResp");
var GameSystem = require('GameSystem');

function FindRoomRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_FIND_TABLE_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        //{"cmd":196618,"seq":2,"uid":10038,"code":0,"desc":"执行成功","privateid":247522,"gamesvcid":5,"tableid":1}
        this.privateid = msg.privateid;
        this.gamesvcid = msg.gamesvcid;
        this.tableid = msg.tableid;
        GameSystem.getInstance().privateid = this.privateid;
        GameSystem.getInstance().gamesvcid = this.gamesvcid;
        GameSystem.getInstance().tableid = this.tableid;
    };
}

module.exports = FindRoomRespPacket;