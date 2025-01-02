/**
 * Created by shrimp on 17/2/26.
 */
var MessageReq = require("MessageReq");
var GamePlayer = require('GamePlayer');
var GameSystem = require('GameSystem')

function FindRoomReqPacket() {
    MessageReq.apply(this, []);  //集成父类数据

    this.cmd = window.US_REQ_FIND_TABLE_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("FindRoomReqPacket.send");

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            privateid : msg.privateid,
        }

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports =  FindRoomReqPacket;