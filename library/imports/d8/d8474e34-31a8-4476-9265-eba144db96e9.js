"use strict";

/**
 * Created by shrimp on 17/4/7.
 */
var MessageResp = require("MessageResp");
var GameSystem = require('GameSystem');
/*
* type US_RESP_CLUB_LIST_T struct {
 JsonHead
 RespHead
 List []CLUB_INFO_T `json:"list"`
 }
 type CLUB_INFO_T struct {
 ClubId    int    `json:"clubid"`
 Role      int8   `json:"role"`
 OwnerUid  uint32 `json:"owneruid"`
 Level     int    `json:"level"`
 Name      string `json:"name"`
 HeadUrl   string `json:"headurl"`
 Address   string `json:"address"`
 Intro     string `json:"intro"`
 EndTime   int64  `json:"endtime"` //s
 Status    int    `json:"status"`
 Members   int    `json:"members"`   //成员人数
 MaxMember int    `json:"maxmember"` //最多多少人
 }
* */
function GetClubListRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_CLUB_LIST_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        //{"cmd":196618,"seq":2,"uid":10038,"code":0,"desc":"执行成功","privateid":247522,"gamesvcid":5,"tableid":1}
        this.list = msg.list;
    };
}

module.exports = GetClubListRespPacket;