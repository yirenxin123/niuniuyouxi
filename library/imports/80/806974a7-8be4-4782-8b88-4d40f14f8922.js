"use strict";

/**
 * Created by shrimp on 17/3/31.
 */
/*
* type US_RESP_CREATE_CLUB_T struct {
 JsonHead
 RespHead
 Param PARAM_RESP_CREATE_CLUB_T `json:"param"`
 }
 type PARAM_RESP_CREATE_CLUB_T struct {
 ClubId   int    `json:"clubid"`
 OwnerUid uint32 `json:"owneruid"`
 EndTime  int64  `json:"endtime"`
 }*/
var MessageResp = require("MessageResp");

function CreateClubRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_CREATE_CLUB_CMD_ID;
    //接收的数据
    this.onMessage = function (msg) {
        cc.log("CreateClubRespPacket.onMesssage");
        //{"cmd":6553608,"seq":0,"uid":10006,"code":0,"desc":"执行成功","carryuid":10006,"carrycoin":100}
        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.param = msg.param;
        this.clubid = msg.param.clubid;
        this.owneruid = msg.param.owneruid;
        this.endtime = msg.param.endtime;
    };
}

module.exports = CreateClubRespPacket;