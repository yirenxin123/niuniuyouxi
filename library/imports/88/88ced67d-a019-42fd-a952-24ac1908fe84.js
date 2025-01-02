'use strict';

/**
 * Created by shrimp on 17/3/5.
 */

/*
* type SBF_RESP_READY_T struct {
 JsonHead
 RespHead
 SeatId  int    `json:"seatid"`
 Uid     uint32 `json:"uid"`
 UStatus int    `json:"ustatus"`
 TableId int    `json:"tableid"`
 TStatus int    `json:"tstatus"`
 }
* */
var MessageResp = require('MessageResp');
var Cmd_Bullfight = require('Cmd_Bullfight');
function Bullfight_ReadyRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = Cmd_Bullfight.SBF_RESP_READY_CMD_ID;
    this.seatid = -1;
    this.readyuid = 0;
    this.ustatus = 0;
    this.tableid = 0;
    this.tstatus = 0;
    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.seatid = msg.seatid;
        this.readyuid = msg.readyuid;
        this.ustatus = msg.ustatus;
        this.tableid = msg.tableid;
        this.tstatus = msg.tstatus;
        //GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = Bullfight_ReadyRespPacket;