'use strict';

/**
 * Created by shrimp on 17/4/9.
 */
/*
* type CLUB_RESP_OWNER_CONFIRM_T struct {
 JsonHead
 RespHead
 Param PARAM_RESP_OWNER_CONFIRM_T `json:"param"`
 }
 type PARAM_RESP_OWNER_CONFIRM_T struct {
 ClubId int `json:"clubid"`
 }*/

var MessageResp = require('MessageResp');

function ClubOwnerConfirmRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.CLUB_RESP_OWNER_CONFIRM_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
    };
}

module.exports = ClubOwnerConfirmRespPacket;