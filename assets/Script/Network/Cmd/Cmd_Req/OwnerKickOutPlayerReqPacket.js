/**
 * Created by shrimp on 17/3/1.
 */
var MessageReq = require("MessageReq");

function OwnerKickOutPlayerReqPacket() {
    MessageReq.apply(this, []);  //集成父类数据

    this.cmd = window.US_REQ_OWNER_KICKOUT_PLAYERCMD_ID;

    //准备发送的数据
    this.send = function (msg) {

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
        }

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports =  OwnerKickOutPlayerReqPacket;