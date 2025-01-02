/**
 * Created by shrimp on 17/4/13.
 */
/*
* type US_RESP_SET_MSG_READ_T struct {
 JsonHead
 RespHead
 Param PARAM_SET_MSG_READ_T `json:"param"`
 }
 type PARAM_SET_MSG_READ_T struct {
 Type  int `json:"type"`
 MsgId int `json:"msgid"`
 }
* */
var MessageResp = require("MessageResp");

function MsgReadRespPacket() {
    MessageResp.apply(this, []);  //集成父类数据

    this.cmd = window.US_RESP_SET_MSG_READ_CMD_ID;

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

module.exports =  MsgReadRespPacket;