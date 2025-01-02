"use strict";

/**
 * Created by shrimp on 17/4/9.
 */
var MessageResp = require("MessageResp");
/*
* type CLUB_RESP_JOIN_CLUB_T struct {
 JsonHead
 RespHead
 Param PARAM_RESP_JOIN_T `json:"param"`
 }
 type PARAM_RESP_JOIN_T struct {
 ClubId  int    `json:"clubid"`
 Uid     uint32 `json:"uid"`
 isallow
 Name    string `json:"name"`
 HeadUrl string `json:"headurl"`
 Sex     int    `json:"sex"`
 Role    uint8  `json:"role"`
 }
* */
function JoinClubRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.CLUB_RESP_JOIN_CLUB_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.param = msg.param;
    };
}

module.exports = JoinClubRespPacket;