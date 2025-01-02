/**
 * Created by shrimp on 17/2/22.
 */
var MessageResp = require("MessageResp");

function HeartRespPacket() {
    MessageResp.apply(this, []);  //集成父类数据

    this.cmd = window.US_RESP_HEARTBEAT_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if(this.code < SocketRetCode.RET_SUCCESS)
            return;
       // GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports =  HeartRespPacket;