'use strict';

/**
 * Created by shrimp on 17/3/2.
 */

/*
* //通知玩家，一局游戏结束
 type GAME_OVER_SEATERS_T struct {
 Uid       uint32 `json:"uid"`
 FinalCoin int64  `json:"finalcoin"`
 Coin      int64    `json:"coin"`
 }

 type SBF_NOTIFY_ONE_GAME_RESULT_T struct {
 JsonHead
 RespHead
 TableId  int32    `json:"tableid"`
 TStatus  int      `json:"tstatus"`
 Seaters	 []GAME_OVER_SEATERS_T  `json:"seaters"`
 }
* */

var MessageResp = require('MessageResp');
var Cmd_Bullfight = require('Cmd_Bullfight');

function Bullfight_NotifyGameOverOncePacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = Cmd_Bullfight.SBF_NOTIFY_ONE_GAME_RESULT_CMD_ID;

    this.tableid = 0;
    this.tstatus = 0;
    this.overtime = 5;
    this.seaters = [];

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.tableid = msg.tableid;
        this.tstatus = msg.tstatus;
        this.seaters = msg.seaters;
        this.ustatus = msg.ustatus;
        this.overtime = msg.overtime;
    };
}

module.exports = Bullfight_NotifyGameOverOncePacket;