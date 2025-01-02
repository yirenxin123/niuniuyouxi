'use strict';

/**
 * Created by shrimp on 17/3/11.
 */

/*
* type SBF_NOTIFY_KICKOUT_T struct {
 JsonHead
 RespHead
 TableId int32   `json:"tableid"`
 SeatUid uint32  `json:"seatuid"`
 SeatId  int     `json:"seatid"`
 }

 触发场景： 1.  带入金币超时
 2. 玩家携带金币不足*/
var MessageResp = require('MessageResp');
var Cmd_Bullfight = require('Cmd_Bullfight');

function Bullfight_NotifyKickOutPacket() {
  MessageResp.apply(this, []); //集成父类数据

  this.cmd = Cmd_Bullfight.SBF_NOTIFY_KICKOUT_CMD_ID;
  this.tableid = 0;
  this.seatuid = 0;
  this.seatid = -1;
  //接收的数据
  this.onMessage = function (msg) {

    this.seq = msg.seq;
    this.uid = msg.uid;
    this.code = msg.code;
    this.desc = msg.desc;
    this.tableid = msg.tableid;
    this.seatuid = msg.seatuid;
    this.seatid = msg.seatid;
    this.status = msg.status;
  };
}

module.exports = Bullfight_NotifyKickOutPacket;