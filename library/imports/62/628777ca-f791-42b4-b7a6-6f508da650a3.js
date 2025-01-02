'use strict';

/**
 * Created by shrimp on 17/3/5.
 */

/*
* // 通知玩家游戏开始
 type GAME_START_SEATERS_T struct {
 Uid     uint32 `json:"uid"`
 UStatus int `json:"ustatus"`
 SeatId  int `json:"seatid"`
 }

 type SBF_NOTIFY_GAME_START_T struct {
 JsonHead
 UStatus  int                    `json:"ustatus"`  //自己的状态
 SeatId   int                    `json:"seatid"`
 TableId  int32                  `json:"tableid"`  //桌子ID
 TStatus  int                    `json:"tstatus"`  //桌子状态
 CallTime int                    `json:"calltime"` //抢庄时间
 Cards    []byte                 `json:"cards"`    //自己的5张牌
 Seaters  []GAME_START_SEATERS_T `json:"seaters"`
 }
 */
var MessageResp = require('MessageResp');
var Cmd_Bullfight = require('Cmd_Bullfight');
function Bullfight_NotifyGameStartPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = Cmd_Bullfight.SBF_NOTIFY_GAME_START_CMD_ID;
    this.ustatus = 0;
    this.seatid = -1;
    this.tableid = 0;
    this.tstatus = 0;
    this.calltime = 0;
    this.cards = [];
    this.seaters = [];
    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;

        this.ustatus = msg.ustatus;
        this.seatid = msg.seatid;
        this.tableid = msg.tableid;
        this.tstatus = msg.tstatus;
        this.calltime = msg.calltime;
        this.cards = msg.cards;
        this.seaters = msg.seaters;
        this.roundnum = msg.roundnum;
    };
}

module.exports = Bullfight_NotifyGameStartPacket;