/**
 * Created by shrimp on 17/3/16.
 */

var MessageResp = require('MessageResp');
var Cmd_Bullfight = require('Cmd_Bullfight');

/*
 //通知放弃操作的玩家
 type NOT_CALL_SEATER_T struct {
 Uid       uint32 `json:"uid"`
 SeatId    int    `json:"seatid"`
 }

 type SBF_NOTIFY_NOT_CALL_BANKER_T struct{
 JsonHead
 RespHead
 TableId  int32  `json:"tableid"`      //桌子id
 TStatus  int    `json:"tstatus"`      //桌子状态
 Seaters  []NOT_CALL_SEATER_T `json:"seaters"`
 }
* */
function Bullfight_NotifyNotCallBankerPacket() {
    MessageResp.apply(this, []);  //集成父类数据

    this.cmd = Cmd_Bullfight.SBF_NOTIFY_NOT_CALL_BANKER_CMD_ID;
    this.tableid = 0;
    this.tstatus = 0;
    this.Seaters = [];
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
        this.Seaters = msg.Seaters;
    };
}

module.exports =  Bullfight_NotifyNotCallBankerPacket;