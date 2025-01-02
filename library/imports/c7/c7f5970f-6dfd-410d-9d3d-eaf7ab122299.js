"use strict";

/**
 * Created by shrimp on 17/3/1.
 */
var MessageReq = require("MessageReq");
/*
* //游戏开关
 const (
 E_STOP_GAME  = 0
 E_START_GAME = 1
 )

 type US_REQ_GAME_SWITCH_T struct {
 GameHead
 IsStart int `json:"isstart"` //1: start 0: stop
 }

* */
var GameSystem = require("GameSystem");

function StartGameReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_GAME_SWITCH_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            gamesvcid: GameSystem.getInstance().gamesvcid,
            tableid: GameSystem.getInstance().tableid,
            isstart: msg.isstart
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = StartGameReqPacket;