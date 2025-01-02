'use strict';

/**
 * Created by shrimp on 17/3/2.
 */

var MessageReq = require("MessageReq");
var Cmd_Bullfight = require('Cmd_Bullfight');
var GameSystem = require('GameSystem');

/*
* // 下注
 type SBF_REQ_BET_COIN_T struct {
 GameHead
 BetCoinMul int `json:"betcoinmul"`
 }
* */

function Bullfight_BetCoinReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = Cmd_Bullfight.SBF_REQ_BET_COIN_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            gamesvcid: GameSystem.getInstance().gamesvcid,
            tableid: GameSystem.getInstance().tableid,
            betcoinmul: msg.betcoinmul
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = Bullfight_BetCoinReqPacket;