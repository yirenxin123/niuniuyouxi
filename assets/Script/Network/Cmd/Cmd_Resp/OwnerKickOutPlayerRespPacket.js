/**
 * Created by shrimp on 17/3/1.
 */
var MessageResp = require("MessageResp");

function OwnerKickOutPlayerRespPacket() {
    MessageResp.apply(this, []);  //集成父类数据

    this.cmd = window.US_RESP_OWNER_KICKOUT_PLAYERCMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if(this.code < SocketRetCode.RET_SUCCESS)
            return;

        //GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports =  OwnerKickOutPlayerRespPacket;