/**
 * Created by shrimp on 17/4/9.
 */
/*
 type CLUB_REQ_GET_MEMBER_LIST_T struct {
 ClubHead
 }

* */
var MessageReq = require("MessageReq");

function GetMemberListReqPacket() {
    MessageReq.apply(this, []);  //集成父类数据

    this.cmd = window.CLUB_REQ_GET_MEMBER_LIST_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("GetMemberListReqPacket.send");

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            clubid:msg.clubid,
        }

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports =  GetMemberListReqPacket;