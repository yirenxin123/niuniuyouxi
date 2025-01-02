"use strict";

/**
 * Created by shrimp on 17/3/3.
 */
var MessageReq = require("MessageReq");
var GameSystem = require('GameSystem');

function CarryCoinReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_CARRY_COIN_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("CarryCoinReqPacket.send");
        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            gamesvcid: GameSystem.getInstance().gamesvcid,
            tableid: GameSystem.getInstance().tableid,
            coin: msg.coin
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = CarryCoinReqPacket;