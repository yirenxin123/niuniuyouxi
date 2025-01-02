"use strict";

/**
 * Created by shrimp on 17/4/13.
 */
/*
* E_SYSTEM_MSG_T = 1
 type US_RESP_SYS_MSG_LIST_T struct {
 JsonHead
 RespHead
 Param PARAM_SYS_MSG_T `json:"param"`
 }
 type PARAM_SYS_MSG_T struct {
 Type int              `json:"type"`
 List []SYS_MSG_NODE_T `json:"list"`
 }
 type SYS_MSG_NODE_T struct {
 Msg  string `json:"msg"`			//base64
 Time int64  `json:"time"`
 }

 E_CLUB_MSG_T   = 2
 type US_RESP_CLUB_MSG_LIST_T struct {
 JsonHead
 RespHead
 Param PARAM_CLUB_MSG_T `json:"param"`
 }
 type PARAM_CLUB_MSG_T struct {
 Type int               `json:"type"`
 List []CLUB_MSG_NODE_T `json:"list"`
 }
 type CLUB_MSG_NODE_T struct {
 Id      int    `json:"id"`
 ClubId  int    `json:"clubid"`
 Name    string `json:"name"`
 HeadUrl string `json:"headurl"`
 IsRead  int    `json:"isread"`
 Type    int    `json:"type"`
 Msg     string `json:"msg"`		//base64
 Time    int    `json:"time"`
 }

 E_MAIL_MSG_T   = 3
 type US_RESP_MAIL_MSG_LIST_T struct {
 JsonHead
 RespHead
 Param PARAM_MAIL_MSG_T `json:"param"`
 }
 type PARAM_MAIL_MSG_T struct {
 Type int               `json:"type"`
 List []MAIL_MSG_NODE_T `json:"list"`
 }
 type MAIL_MSG_NODE_T struct {
 Id     int    `json:"id"`
 IsRead int    `json:"isread"`
 Type   int    `json:"type"`
 Msg    string `json:"msg"`		//base64
 Time   int    `json:"time"`
 }
*
* */
var MessageResp = require("MessageResp");

function GetMsgListRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_MSG_LIST_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.type = msg.param.type;
        this.list = msg.param.list;
    };
}

module.exports = GetMsgListRespPacket;