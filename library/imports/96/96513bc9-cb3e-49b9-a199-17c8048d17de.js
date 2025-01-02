'use strict';

/**
 * Created by shrimp on 17/3/1.
 */

/*E_DOWN_TYPE = 1 //坐下
E_RISE_TYPE = 2 //站起
*/

/*
 SeatId int `json:"seatid"`
 Status int `json:"status"` //1. 坐下，2：站起
*/

var MessageReq = require('MessageReq');
var GameSystem = require('GameSystem');

function SitDownReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_SIT_DOWN_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            gamesvcid: GameSystem.getInstance().gamesvcid,
            tableid: GameSystem.getInstance().tableid,
            seatid: msg.seatid,
            switch: msg.status
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = SitDownReqPacket;