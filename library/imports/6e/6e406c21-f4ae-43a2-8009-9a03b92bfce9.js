'use strict';

/**
 * Created by shrimp on 17/3/7.
 */

/*
* // 通知玩家开始开牌
 type SBF_NOTIFY_OPEN_CARD_T struct {
 JsonHead
 RespHead
 TableId  int32    `json:"tableid"`
 TStatus  int      `json:"tstatus"`
 UStatus  int      `json:"ustatus"`
 OpenTime int      `json:"opentime"`
 Cards    []uint16 `json:"cards"`    //自己的5张牌
 }
* */

var MessageResp = require('MessageResp');
var Cmd_Bullfight = require('Cmd_Bullfight');
function Bullfight_NotifyOpenCardPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = Cmd_Bullfight.SBF_NOTIFY_OPEN_CARD_CMD_ID;
    //{"cmd":6619148,"seq":0,"uid":10010,"code":0,"desc":"","tableid":1,
    // "tstatus":4,"ustatus":5,"seatid":0,"opentime":20,"cards":[26,9,53,36,2]}

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.tableid = msg.tableid;
        this.tstatus = msg.tstatus;
        this.ustatus = msg.ustatus;
        this.opentime = msg.opentime;
        this.cards = msg.cards;

        //GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = Bullfight_NotifyOpenCardPacket;