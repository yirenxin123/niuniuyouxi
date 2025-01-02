/**
 * Created by shrimp on 17/4/9.
 */
/*
* type CLUB_REQ_OWNER_CONFIRM_T struct {
 ClubHead
 Param PARAM_REQ_OWNER_CONFIRM_T `json:"param"`
 }
 type PARAM_REQ_OWNER_CONFIRM_T struct {
 IsAllow int    `json:"isallow"` //1: allow, 0: reject.
 Uid     uint32 `json:"uid"`
 }
 */
var MessageReq = require("MessageReq");
var GamePlayer = require('GamePlayer');
var GameSystem = require('GameSystem')

function ClubOwnerConfirmReqPacket() {
    MessageReq.apply(this, []);  //集成父类数据

    this.cmd = window.CLUB_REQ_OWNER_CONFIRM_CMD_ID;

    //准备发送的数据
    this.send = function (msg, clubid) {
        cc.log("ClubOwnerConfirmReqPacket.send");

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            clubid : clubid,
            param : msg,
        }

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports =  ClubOwnerConfirmReqPacket;