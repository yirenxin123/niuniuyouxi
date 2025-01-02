'use strict';

/**
 * Created by shrimp on 17/3/5.
 */
/*
* type US_NOTIFY_GAME_SWITCH_T struct {
 JsonHead
 RespHead
 IsStart   int `json:"isstart"`
 ReadyTime int `json:"readytime"`
 }
* */

var MessageResp = require('MessageResp');

function NotifyGameStartPacket() {
    MessageResp.apply(this, []); //集成父类数据
    // {"cmd":6553618,"seq":0,"uid":10010,"code":0,"desc":"执行成功","isstart":1,"readytime":7}
    this.cmd = window.US_NOTIFY_GAME_SWITCH_CMD_ID;
    this.isStart = 0;
    this.readyTime = 0;
    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;

        this.isStart = msg.isstart;
        this.readyTime = msg.readytime;
        this.tstatus = msg.tstatus;
        this.ustatus = msg.ustatus;
    };
}

module.exports = NotifyGameStartPacket;