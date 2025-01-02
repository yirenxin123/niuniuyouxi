/**
 * Created by shrimp on 17/4/9.
 */

var MessageReq = require("MessageReq");
var GamePlayer = require('GamePlayer');
var GameSystem = require('GameSystem')
/*
*
* type CLUB_REQ_JOIN_CLUB_T struct {
 ClubHead
 Param PARAM_REQ_JOIN_T `json:"param"`
 }
 type PARAM_REQ_JOIN_T struct {
 Uid     uint32 `json:"uid"`
 Name    string `json:"name"`
 HeadUrl string `json:"headurl"`
 Sex     int    `json:"sex"`
 }*/
function JoinClubReqPacket() {
    MessageReq.apply(this, []);  //集成父类数据

    this.cmd = window.CLUB_REQ_JOIN_CLUB_CMD_ID;

    //准备发送的数据
    this.send = function (clubid,msg) {
        cc.log("JoinClubReqPacket.send");

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

module.exports =  JoinClubReqPacket;