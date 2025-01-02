"use strict";

/**
 * Created by shrimp on 17/3/3.
 */
var MessageResp = require("MessageResp");

function CarryCoinRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_CARRY_COIN_CMD_ID;
    this.carryuid = 0;
    this.coin = 0;
    this.carrycoin = 0;
    this.gold = 0;
    this.diamond = 0;
    this.ustatus = 0;
    this.tstatus = 0;

    //接收的数据
    this.onMessage = function (msg) {
        cc.log("CarryCoinRespPacket.onMesssage");
        //{"cmd":6553608,"seq":0,"uid":10006,"code":0,"desc":"执行成功","carryuid":10006,"carrycoin":100}
        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        this.carryuid = msg.carryuid;
        this.carrycoin = msg.carrycoin;
        this.ustatus = msg.ustatus;
        this.tstatus = msg.tstatus;
        this.coin = msg.coin;
        this.gold = msg.gold;
        this.diamond = msg.diamond;
    };
}

module.exports = CarryCoinRespPacket;