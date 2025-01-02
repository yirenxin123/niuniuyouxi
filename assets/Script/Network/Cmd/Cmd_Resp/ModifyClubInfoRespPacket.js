/**
 * Created by shrimp on 17/4/8.
 */
/*
* type CLUB_RESP_MODIFY_INFO_T struct {
 JsonHead
 RespHead
 Param PARAM_RESP_MODIFY_INFO_T `json:"param"`
 }
 type PARAM_RESP_MODIFY_INFO_T struct {
 ClubId  int    `json:"clubid"`
 Status  int    `json:"status"`
 Name    string `json:"name"`
 HeadUrl string `json:"headurl"`
 Address string `json:"address"`
 Intro   string `json:"intro"`
 Level   int    `json:"level"`
 EndTime int64  `json:"endtime"`
 }
* */

var MessageResp = require("MessageResp");

function ModifyClubInfoRespPacket() {
    MessageResp.apply(this, []);  //集成父类数据

    this.cmd = window.CLUB_RESP_MODIFY_INFO_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {
        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS)
            return;
        this.param = msg.param;

        cc.log("ModifyClubInfoRespPacket cmd=", this.cmd);
    };
}

module.exports =  ModifyClubInfoRespPacket;