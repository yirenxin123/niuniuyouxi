/**
 * Created by shrimp on 17/4/8.
 */

var MessageReq = require("MessageReq");
var GamePlayer = require('GamePlayer');
var GameSystem = require('GameSystem')

function GetClubTableReqPacket() {
    MessageReq.apply(this, []);  //集成父类数据

    this.cmd = window.US_REQ_CLUB_TABLE_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("GetClubTableReqPacket.send");

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            clubid : msg.clubid,
        }

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports =  GetClubTableReqPacket;