'use strict';

/**
 * Created by shrimp on 17/2/26.
 */
var MessageReq = require("MessageReq");
var GamePlayer = require('GamePlayer');
var GameSystem = require('GameSystem');

function LeaveGameReqPacket() {
  MessageReq.apply(this, []); //集成父类数据

  this.cmd = window.US_REQ_LEAVE_GAME_CMD_ID;

  //准备发送的数据
  this.send = function (msg) {
    cc.log("LeaveGameReqPacket.send");
    this.data = {
      cmd: this.cmd,
      seq: this.seq,
      uid: this.uid,
      gamesvcid: GameSystem.getInstance().gamesvcid,
      tableid: GameSystem.getInstance().tableid
    };

    GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
  };
}

module.exports = LeaveGameReqPacket;

/*
 //离开游戏
 type US_REQ_LEVEL_GAME_T struct {
 GameHead
 }

 type US_RESP_LEVEL_GAME_T struct {
 JsonHead
 RespHead
 Param string `json:"param"`
 }

 //请求坐下
 const (
 E_DOWN_TYPE = 1 //坐下
 E_RISE_TYPE = 2 //站起
 )

 type US_REQ_SIT_DOWN_T struct {
 GameHead
 SeatId int `json:"seatid"`
 Status int `json:"status"` //1. 坐下，2：站起
 }

 type US_RESP_SIT_DOWN_T struct {
 JsonHead
 RespHead
 Param string `json:"param"`
 }

 //请求携带金币
 type US_REQ_CARRY_COIN_T struct {
 GameHead
 Coin int64 `json:"coin"`
 }

 //如果uid == carryuid, 是自己
 type US_RESP_CARRY_COIN_T struct {
 JsonHead
 RespHead         //同意坐着，拒绝站起
 CarryUid  uint32 `json:"carryuid"`
 CarryCoin int64  `json:"carrycoin"`
 }
 周学士 C++  20:35:01

 //桌主确定玩家是否入坐
 const (
 E_ALLOW_TO_SIT  = 1
 E_REJECT_TO_SIT = 2
 )

 type US_REQ_OWNER_CONFIRM_T struct {
 GameHead
 PlayerUid uint32 `json:"playeruid"`
 Result    int    `json:"result"`
 }

 type US_RESP_OWNER_CONFIRM_T struct {
 JsonHead
 RespHead
 }
*
* */