/**
 * Created by shrimp on 17/3/2.
 */
var MessageResp = require('MessageResp');
var Cmd_Bullfight = require('Cmd_Bullfight');
function Bullfight_HelpRespPacket() {
    MessageResp.apply(this, []);  //集成父类数据

    this.cmd = Cmd_Bullfight.SBF_RESP_HELP_CMD_ID;

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

module.exports =  Bullfight_HelpRespPacket;