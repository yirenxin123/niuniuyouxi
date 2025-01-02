/**
 * Created by shrimp on 17/4/9.
 */
var MessageReq = require("MessageReq");
var GamePlayer = require('GamePlayer');
var GameSystem = require('GameSystem')
/*
* type CLUB_REQ_OWNER_RM_MEMBER_T struct {
 ClubHead
 Param PARAM_REQ_OWNER_RM_MEMBER_T `json:"param"`
 }
 type PARAM_REQ_OWNER_RM_MEMBER_T struct {
 Uid uint32 `json:"uid"`
 }*/
function ClubDelMemberReqPacket() {
    MessageReq.apply(this, []);  //集成父类数据

    this.cmd = window.CLUB_REQ_OWNER_RM_MEMBER_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("ClubDelMemberReqPacket.send");

        var data = {
            uid : msg.uid,
        };

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            clubid : msg.clubid,
            param : data,
        }

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports =  ClubDelMemberReqPacket;