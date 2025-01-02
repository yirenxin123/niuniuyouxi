"use strict";

/**
 * Created by shrimp on 17/4/9.
 */
/*
* type CLUB_RESP_GET_MEMBER_LIST_T struct {
 JsonHead
 RespHead
 Param PARAM_RESP_GET_MEMBER_LIST_T `json:"param"`
 }
 type PARAM_RESP_GET_MEMBER_LIST_T struct {
 ClubId int                  `json:"clubid"`
 List   []CLUB_MEMBER_INFO_T `json:"list"`
 }
 type CLUB_MEMBER_INFO_T struct {
 Uid     uint32 `json:"uid"`
 Name    string `json:"name"`
 HeadUrl string `json:"headurl"`
 Sex     int  `json:"sex"`
 Role    uint8  `json:"role"`
 }
* */
var MessageResp = require("MessageResp");

function GetMemberListRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.CLUB_RESP_GET_MEMBER_LIST_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.clubid = msg.param.clubid;
        this.list = msg.param.list;
        //GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = GetMemberListRespPacket;