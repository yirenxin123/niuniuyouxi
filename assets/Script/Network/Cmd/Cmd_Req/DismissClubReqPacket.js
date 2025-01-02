/**
 * Created by shrimp on 17/4/15.
 */
var MessageReq = require("MessageReq");

function DismissClubReqPacket() {
    MessageReq.apply(this, []);  //集成父类数据

    this.cmd = window.CLUB_REQ_DISMISS_CLUB_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("DismissGameReqPacket.send");
        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            clubid : msg.clubid,
        }

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports =  DismissClubReqPacket;