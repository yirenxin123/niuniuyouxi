"use strict";

/**
 * Created by shrimp on 17/3/30.
 */

var MessageResp = require("MessageResp");

/*
 * 
 * 
type US_RESP_BANNER_LIST_T struct {
   JsonHead
   RespHead
   List []BANNER_INFO_T `json:"list"`
}
type BANNER_INFO_T struct {
   Title   string `json:"title"`
   Pic     string `json:"pic"`
   JumpUrl string `json:"jumpurl"`
}

 */

function BannerListRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_BANNER_LIST_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.bannerlist = msg.list;
        //var json = JSON.parse(BASE64.decoder(msg.param));
    };
}

module.exports = BannerListRespPacket;