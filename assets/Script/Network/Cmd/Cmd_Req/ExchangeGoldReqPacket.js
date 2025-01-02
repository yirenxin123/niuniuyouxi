/**
 * Created by shrimp on 17/5/6.
 */
var MessageReq = require("MessageReq");
var GamePlayer = require('GamePlayer');
var GameSystem = require('GameSystem')
/*
* type US_REQ_EXCHANGE_GOLD_T struct {
 JsonHead
 Param PARAM_REQ_EXCHANGE_GOLD_T `json:"param"`
 }
 type PARAM_REQ_EXCHANGE_GOLD_T struct {
 Type int `json:"type"` //传递的是获取商城配置的goldlist中的type
 }
* */
function ExchangeGoldReqPacket() {
    MessageReq.apply(this, []);  //集成父类数据

    this.cmd = window.US_REQ_EXCHANGE_GOLD_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("ExchangeGoldReqPacket.send");

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            param : msg,
        }

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports =  ExchangeGoldReqPacket;