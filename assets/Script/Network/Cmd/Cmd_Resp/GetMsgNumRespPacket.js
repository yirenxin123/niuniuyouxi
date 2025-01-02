/**
 * Created by shrimp on 17/4/13.
 */

/*
* type US_RESP_NEW_MSG_NUM_T struct {
 JsonHead
 RespHead
 Param PARAM_NEW_MSG_NUM_T `json:"param"`
 }

 type PARAM_NEW_MSG_NUM_T struct {
 SysNum  int `json:"sysnum"`
 ClubNum int `json:"clubnum"`
 MailNum int `json:"mailnum"`
 }
* */
var MessageResp = require("MessageResp");

function GetMsgNumRespPacket() {
    MessageResp.apply(this, []);  //集成父类数据

    this.cmd = window.US_RESP_NEW_MSG_NUM_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if(this.code < SocketRetCode.RET_SUCCESS)
            return;
        this.sysnum = msg.param.sysnum;
        this.clubnum = msg.param.clubnum;
        this.mailnum = msg.param.mailnum;
    };
}

module.exports =  GetMsgNumRespPacket;