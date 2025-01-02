/**
 * Created by shrimp on 17/4/13.
 */

var MessageReq = require("MessageReq");

function GetMsgNumReqPacket() {
    MessageReq.apply(this, []);  //集成父类数据

    this.cmd = window.US_REQ_NEW_MSG_NUM_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("GetMsgNumReqPacket.send");

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
        }

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports =  GetMsgNumReqPacket;