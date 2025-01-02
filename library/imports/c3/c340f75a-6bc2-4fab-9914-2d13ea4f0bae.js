"use strict";

/**
 * Created by shrimp on 17/4/30.
 */

/*
 //通知玩家充值成功
 type CS_NOTIFY_PAY_OPERATE_T struct {
 GameHead
 Param REQ_PAY_OPERATE_T `json:"param"`
 }
 type REQ_PAY_OPERATE_T struct {
 OpUid     uint32 `json:"opuid"`
 OpType    int    `json:"optype"` //操作类型
 OpGold    int    `json:"opgold"`
 OpDiamond int    `json:"opdiamond"`
 OrderNum  string `json:"ordernum"` //订单号
 OpTime    int64  `json:"optime"`
 }
* */
var MessageResp = require("MessageResp");

function NotifyPayOperatePacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_NOTIFY_PAY_OPERATE_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.param = msg.param;
    };
}

module.exports = NotifyPayOperatePacket;