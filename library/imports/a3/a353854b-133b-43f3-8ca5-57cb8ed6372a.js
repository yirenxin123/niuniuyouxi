'use strict';

/**
 * Created by shrimp on 17/3/2.
 */

/*
* / 抢庄SBF_REQ_CALL_BANKER_CMD_ID
 const (
 E_UNSEND_CALL_BANKER = 0    //未操作
 E_NOT_CALL_BANKER    = 1    //不抢
 E_NORMAL_CALL_BANKER = 2    //抢庄
 E_SUPER_CALL_BANKER  = 3    //超级抢庄
 )

 type SBF_REQ_CALL_BANKER_T struct {
 GameHead
 CallType int `json:"calltype"`
 }
* */

var MessageReq = require("MessageReq");
var Cmd_Bullfight = require('Cmd_Bullfight');
var GameSystem = require('GameSystem');

function Bullfight_CallBankerReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = Cmd_Bullfight.SBF_REQ_CALL_BANKER_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            gamesvcid: GameSystem.getInstance().gamesvcid,
            tableid: GameSystem.getInstance().tableid,
            calltype: msg.calltype
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = Bullfight_CallBankerReqPacket;