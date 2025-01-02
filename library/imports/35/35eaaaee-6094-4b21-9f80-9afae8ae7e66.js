"use strict";

/**
 * Created by shrimp on 17/3/1.
 */

/*
 type US_RESP_SIT_DOWN_T struct {
 JsonHead
 RespHead
 Switch    int    `json:"switch"` //1. 坐下，2：站起
 Status    int    `json:"status"` //玩家状态
 SeatId    int    `json:"seatid"`
 SeatUid   uint32 `json:"seatuid"`
 Name      string `json:"name"`
 HeadUrl   string `json:"headurl"`
 Sex       int    `json:"sex"`
 CarryTime int    `json:"carrytime"` //选择携带金币时间
 MinCarry  int    `json:"mincarry"`  //是否需要携带
 IsCarry   int8   `json:"iscarry"`   //是否需要携带金币，1：第一次坐下，需要携带，0：之前参与过，还有金币
 Coin      int    `json:"coin"`      //如果iscarry==0, coin是玩家金币
 }
* */
var MessageResp = require("MessageResp");

function SitDownRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_SIT_DOWN_CMD_ID;
    //this.status    = 0;
    //this.seatid    = 0;
    //this.seatuid   = 0;
    //this.name      = "";
    // this.headurl   = "";
    //this.sex       = 0;
    // this.gold      = 0;
    // this.diamond   = 0;
    //this.coin      = 0;
    //this.carrytime = 0;
    //this.mincarry  = 0;
    //this.iscarry   = 0;
    //this.switch    = 0;
    // this.totalround = 0;
    // this.totaltable = 0;
    //this.tstatus    = 0;
    // this.win        = 0;
    // this.total      = 0;

    //接收的数据
    this.onMessage = function (msg) {
        cc.log("SitDownRespPacket.onMessage, msg.totalround=", msg.totalround, " totaltable=", msg.totaltable);
        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;

        this.switch = msg.switch;
        this.status = msg.status;
        this.seatid = msg.seatid;
        this.seatuid = msg.seatuid;
        this.name = msg.name;
        this.headurl = msg.headurl;
        this.sex = msg.sex;
        this.coin = msg.coin;
        this.carrytime = msg.carrytime;
        this.iscarry = msg.iscarry;
        this.tstatus = msg.tstatus;
        this.totalround = msg.totalround;
        this.totaltable = msg.totaltable;
        this.win = msg.win;
        this.total = msg.total;
        this.gold = msg.gold;
        this.diamond = msg.diamond;
    };
}

module.exports = SitDownRespPacket;