'use strict';

/**
 * Created by shrimp on 17/3/2.
 */

/*
* type SBF_RESP_BET_COIN_T struct {
 JsonHead
 RespHead
 BetUid     uint32 `json:"betuid"`
 BetCoinMul int `json:"betcoinmul"`
 }
* */
var MessageResp = require('MessageResp');
var Cmd_Bullfight = require('Cmd_Bullfight');
function Bullfight_BetCoinRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = Cmd_Bullfight.SBF_RESP_BET_COIN_CMD_ID;
    this.betuid = 0;
    this.betcoinmul = 0;
    //{"cmd":6619146,"seq":0,"uid":10010,"code":0,"desc":"执行成功","betuid":10011,"betcoinmul":10}
    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.betuid = msg.betuid;
        this.betcoinmul = msg.betcoinmul;
        this.tstatus = msg.tstatus;
        this.ustatus = msg.ustatus;
        //GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = Bullfight_BetCoinRespPacket;