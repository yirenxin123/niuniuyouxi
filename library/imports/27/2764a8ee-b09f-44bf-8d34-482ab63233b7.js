'use strict';

/**
 * Created by shrimp on 17/3/2.
 */
var MessageResp = require('MessageResp');
var Cmd_Bullfight = require('Cmd_Bullfight');

/*
* type SBF_NOTIFY_LAST_GAME_RESULT_T struct {
 JsonHead
 RespHead
 TableId int32                `json:"tableid"`
 Scores  []SBF_PLAYER_SCORE_T `json:"scores"`
 }

 type SBF_PLAYER_SCORE_T struct {
 Uid        int32 `json:"uid"`
 Coin       int64 `json:"coin"`
 PlayNum    int   `json:"playnum"`
 MaxWin     int   `json:"maxwin"`
 TotalCarry int64 `json:"totalcarry"`
 }
* */
function Bullfight_NotifyGameOverTotalPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = Cmd_Bullfight.SBF_NOTIFY_TOTAL_GAME_RESULT_CMD_ID;

    this.privateid = 0;
    this.TableId = 0;
    this.Scores = [];
    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;

        this.privateid = msg.privateid;
        this.TableId = msg.tableid;
        this.Scores = msg.scores;
    };
}

module.exports = Bullfight_NotifyGameOverTotalPacket;