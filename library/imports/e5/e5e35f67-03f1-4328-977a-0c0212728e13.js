'use strict';

/**
 * Created by shrimp on 17/3/17.
 */

var MessageResp = require('MessageResp');
var Cmd_Bullfight = require('Cmd_Bullfight');
/*
* type US_RESP_PLAYER_LIST_T struct {
 JsonHead
 RespHead
 Actors   []ACTOR_T `json:"actors"`
 Watchers []WATCHER_T `json:"watchers"`
 }

 //参与者信息
 type ACTOR_T struct {
 Uid       uint32 `json:"uid"`
 Name      string `json:"name"`
 HeadUrl   string `json:"headurl"`
 TotalCoin int64  `json:"total"` //总带入金币
 WinCoin   int64  `json:"win"`   //输赢多少金币
 }

 //看客信息
 type WATCHER_T struct {
 Uid     uint32 `json:"uid"`
 Name    string `json:"name"`
 HeadUrl string `json:"headurl"`
 }
* */
function Bullfight_GetPlayersListRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = Cmd_Bullfight.US_RESP_PLAYER_LIST_CMD_ID;

    this.remainTime = 0;
    this.roundNum = 0;
    this.actors = [];
    this.watchers = [];
    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;

        this.remainTime = msg.remaintime;
        this.roundNum = msg.roundnum;
        this.actors = msg.actors;
        this.watchers = msg.watchers;
    };
}

module.exports = Bullfight_GetPlayersListRespPacket;