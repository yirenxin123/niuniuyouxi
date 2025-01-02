'use strict';

/**
 * Created by shrimp on 17/2/26.
 */
var MessageReq = require("MessageReq");
var GamePlayer = require('GamePlayer');
var GameSystem = require('GameSystem');

function EnterRoomReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_ENTER_GAME_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("EnterRoomReqPacket.send," + JSON.stringify(msg));

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            gamesvcid: GameSystem.getInstance().gamesvcid,
            tableid: GameSystem.getInstance().tableid

        };
        //cc.log("EnterRoomReqPacket," + JSON.stringify(this.data));
        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = EnterRoomReqPacket;