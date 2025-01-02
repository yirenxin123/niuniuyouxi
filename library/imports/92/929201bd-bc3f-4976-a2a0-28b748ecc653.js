"use strict";

/**
 * Created by shrimp on 17/3/3.
 */
var MessageResp = require('MessageResp');

function NotifyOwnerSitPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_NOTIFY_OWNER_CONFIRM_SIT_CMD_ID;

    this.tablename = "";
    this.sitUid = 0;
    this.name = "";
    this.headurl = "";
    this.gamesvcid = 0;
    this.tableid = 0;
    this.privateid = 0;
    this.seatid = -1;
    this.coin = 0;
    this.param = "";

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;

        this.param = msg.param;
        // TableName  string `json:"tablename"`
        // SitUid     uint32 `json:"situid"`
        // Name       string `json:"name"`
        // HeadUrl    string `json:"headurl"`
        // GameSvcId  uint32 `json:"gamesvcid"`
        // TableId    int32  `json:"tableid"`
        // PrivateId  int    `json:"privateid"`
        // CreateTime int64  `json:"createtime"`
        // SeatId     int    `json:"seatid"`
        // Coin       int    `json:"coin"`
        // Time       int64  `json:"time"`
        cc.log("NotifyOwnerSitPacket param=" + msg.param);
        var json = msg.param;
        this.tablename = json.tablename;
        this.sitUid = json.situid;
        this.name = json.name;
        this.headurl = json.headurl;
        this.gamesvcid = json.gamesvcid;
        this.tableid = json.tableid;
        this.privateid = json.privateid;
        this.seatid = json.seatid;
        this.coin = json.coin;
    };
}

module.exports = NotifyOwnerSitPacket;