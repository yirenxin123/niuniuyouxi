/**
 * Created by shrimp on 17/3/30.
 */
var MessageReq = require("MessageReq");
/*
* type US_REQ_SCORE_DETAIL_T struct {
 JsonHead
 Param PARAM_REQ_SCORE_DETAIL_T `json:"param"`
 }
 type PARAM_REQ_SCORE_DETAIL_T struct {
 PrivateId  int   `json:"privateid"`
 CreateTime int64 `json:"createtime"`
 }
* */
function ScoreDetailReqPacket() {
    MessageReq.apply(this, []);  //集成父类数据

    this.cmd = window.US_REQ_SCORE_DETAIL_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            param : msg,
        }

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports =  ScoreDetailReqPacket;