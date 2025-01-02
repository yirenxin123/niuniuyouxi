"use strict";

/**
 * Created by shrimp on 17/3/30.
 */

var MessageResp = require("MessageResp");

/*
 * type US_RESP_SCORE_LIST_T struct {
 JsonHead
 RespHead
 Param PARAM_RESP_SCORE_LIST_T `json:"param"`
 }
 type PARAM_RESP_SCORE_LIST_T struct {
 IsCreate int8           `json:"iscreate"` //0：参与的牌局, 1: 创建的牌局
 List     []USER_SCORE_T `json:"list"`
 }
 type USER_SCORE_T struct {
 PrivateId  int    `json:"privateid"`
 CreateTime int64  `json:"createtime"`
 LiveTime   int64  `json:"livetime"`
 TableName  string `json:"tablename"`
 OwnerName  string `json:"ownername"`
 HeadUrl    string `json:"headurl"`
 CarryCoin  int    `json:"carrycoin"` //携带
 WinCoin    int    `json:"wincoin"`   //输赢
 }

 */

function ScoreListRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_SCORE_LIST_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.param = msg.param;
        //var json = JSON.parse(BASE64.decoder(msg.param));
        this.iscreate = this.param.iscreate;
        this.list = this.param.list;
    };
}

module.exports = ScoreListRespPacket;