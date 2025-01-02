"use strict";

/**
 * Created by shrimp on 17/5/6.
 */
var MessageResp = require("MessageResp");
var GameSystem = require('GameSystem');
/*
*
* type US_RESP_EXCHANGE_GOLD_T struct {
 JsonHead
 RespHead
 Param PARAM_RESP_EXCHANGE_GOLD_T `json:"param"`
 }
 type PARAM_RESP_EXCHANGE_GOLD_T struct {
 Type    int `json:"type"`
 Gold    int `json:"gold"`
 Diamond int `json:"diamond"`
 }
* */
function ExchangeGoldRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_EXCHANGE_GOLD_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.type = msg.param.type;
        this.gold = msg.param.gold;
        this.diamond = msg.param.diamond;
        this.tips = msg.param.tips;
    };
}

module.exports = ExchangeGoldRespPacket;