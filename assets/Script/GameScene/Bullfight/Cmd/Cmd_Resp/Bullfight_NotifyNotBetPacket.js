/**
 * Created by shrimp on 17/3/16.
 */

var MessageResp = require('MessageResp');
var Cmd_Bullfight = require('Cmd_Bullfight');

/*
* type SBF_NOT_BET_COIN_T struct {
 Uid        uint32  `json:"uid"`
 SeatId     int     `json:"seatid"`
 BetCoinMul int     `json:"betcoinmul"`
 }

 type SBF_NOTIFY_NOT_BET_COIN_T struct {             //没有下注的玩家
 JsonHead
 RespHead
 TableId   int32                `json:"tableid"` //桌子id
 TStatus   int                  `json:"tstatus"` //桌子状态
 Seaters   []SBF_NOT_BET_COIN_T `json:"seaters"`
 }

 * */
function Bullfight_NotifyNotBetPacket() {
    MessageResp.apply(this, []);  //集成父类数据

    this.cmd = Cmd_Bullfight.SBF_NOTIFY_NOT_BET_COIN_CMD_ID;
    this.tableid = 0;
    this.tstatus = 0;
    this.seaters = [];
    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        // if(this.code < SocketRetCode.RET_SUCCESS)
        //     return;
        this.tableid = msg.tableid;
        this.tstatus = msg.tstatus;
        this.seaters = msg.seaters;
    };
}

module.exports =  Bullfight_NotifyNotBetPacket;