'use strict';

/**
 * Created by shrimp on 17/3/5.
 */

/*
* //准备游戏 (SBF_REQ_READY_CMD_ID)
 type SBF_REQ_READY_T struct {
 GameHead
 }
 */

var MessageReq = require("MessageReq");
var Cmd_Bullfight = require('Cmd_Bullfight');
var GameSystem = require('GameSystem');
function Bullfight_ReadyReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = Cmd_Bullfight.SBF_REQ_READY_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            gamesvcid: GameSystem.getInstance().gamesvcid,
            tableid: GameSystem.getInstance().tableid

        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = Bullfight_ReadyReqPacket;