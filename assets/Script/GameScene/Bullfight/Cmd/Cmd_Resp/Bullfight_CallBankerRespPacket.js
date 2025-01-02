/**
 * Created by shrimp on 17/3/2.
 */

/*
* type SBF_RESP_CALL_BANKER_T struct {
 JsonHead
 RespHead
 TableId  int `json:"tableid"`   //桌子id
 TStatus  int `json:"tstatus"`   //桌子状态
 CallUid  uint32 `json:"calluid"`   //哪一个玩家
 SeatId   int `json:"seatid"`    //哪一个座位
 CallType int `json:"calltype"`  //抢庄类型
 IsLast   int `json:"islast"`    //是否是最后一个, 1:是, 0:不是
 }
* **/

var MessageResp = require('MessageResp');
var Cmd_Bullfight = require('Cmd_Bullfight');
function Bullfight_CallBankerRespPacket() {
    MessageResp.apply(this, []);  //集成父类数据

    this.cmd = Cmd_Bullfight.SBF_RESP_CALL_BANKER_CMD_ID;
    this.tableid = 0;
    this.tstatus = 0;
    this.calluid = 0;
    this.seatid = 0;
    this.calltype = 0;
    this.islast = 0;
    //{"cmd":6619142,"seq":0,"uid":10010,"code":0,"desc":"","tableid":0,
    // "tstatus":0,"calluid":10011,"seatid":1,"calltype":3,"islast":1}

    //接收的数据
    this.onMessage = function (msg) {

        this.seq  = msg.seq;
        this.uid  = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if(this.code < SocketRetCode.RET_SUCCESS)
            return;
        this.tableid  = msg.tableid;
        this.tstatus  = msg.tstatus;
        this.calluid  = msg.calluid;
        this.seatid   = msg.seatid;
        this.calltype = msg.calltype;
        this.islast   = msg.islast;
    };
}

module.exports =  Bullfight_CallBankerRespPacket;