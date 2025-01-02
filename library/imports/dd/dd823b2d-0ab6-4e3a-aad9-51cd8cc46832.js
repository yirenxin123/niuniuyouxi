"use strict";

/**
 * Created by shrimp on 17/3/1.
 */

/*
* type MAIL_MSG_OWNER_OVER_TABLE_T struct {
 GameSvcId uint32 `json:"gamesvcid"`
 TableId   int32  `json:"tableid"`
 PrivateId int    `json:"privateid"`
 TableName string `jons:"tablename"`
 RemainTime int   `json:"remaintime"` //秒
 }

 //通知桌主，本桌游戏结束
 type US_NOTIFY_OWNER_OVER_TABLE_T struct {
 JsonHead
 Param MAIL_MSG_OWNER_OVER_TABLE_T `json:"param"`
 }
* */
var MessageResp = require("MessageResp");

function NotifyOwnerOverPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_NOTFIY_OWNER_TABLEINFO_CMD_ID;
    this.gamesvcid = 0;
    this.tableid = 0;
    this.privateid = 0;
    this.tablename = "";
    this.remaintime = 0;
    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;

        this.gamesvcid = msg.gamesvcid;
        this.tableid = msg.tableid;
        this.privateid = msg.privateid;
        this.tablename = msg.tablename;
        this.remaintime = msg.remaintime;
    };
}

module.exports = NotifyOwnerOverPacket;