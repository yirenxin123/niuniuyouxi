"use strict";

/**
 * Created by shrimp on 17/3/30.
 */
var MessageReq = require("MessageReq");
/*
 * type US_REQ_SCORE_LIST_T struct {
 JsonHead
 Param PARAM_REQ_SCORE_LIST_T `json:"param"`
 }
 type PARAM_REQ_SCORE_LIST_T struct {
 IsCreate int8 `json:"iscreate` //0：参与的牌局, 1: 创建的牌局
 Start    int  `json:"start"`   //从哪里开始
 Total    int  `json:"total"`   //多少个
 }
 }

 * */
var GameSystem = require("GameSystem");

function ScoreListReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_SCORE_LIST_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            param: msg
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = ScoreListReqPacket;