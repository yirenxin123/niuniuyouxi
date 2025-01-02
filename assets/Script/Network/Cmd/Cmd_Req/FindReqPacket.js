/**
 * Created by shrimp on 17/3/30.
 */
/*
 * type US_REQ_FOUND_TABLE_T struct {
 JsonHead
 Param PARAM_REQ_FOUND_TABLE_T `json:"param"`
 }
 type PARAM_REQ_FOUND_TABLE_T struct {
 Start int `json:"start"`
 Total int `json:"total"`
 }

 * */

var MessageReq = require("MessageReq");
var GamePlayer = require('GamePlayer');
var GameSystem = require('GameSystem')

function FindReqPacket() {
    MessageReq.apply(this, []);  //集成父类数据

    this.cmd = window.US_REQ_FOUND_TABLE_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("FindRoomReqPacket.send");

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            start : msg.start,
            total : msg.total,
        }

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports =  FindReqPacket;
