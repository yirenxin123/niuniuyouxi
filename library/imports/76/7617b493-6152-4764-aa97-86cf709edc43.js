"use strict";

/**
 * Created by shrimp on 17/4/15.
 */
var MessageResp = require("MessageResp");

// ClubId   int    `json:"clubid"`
// ClubName string `json:"clubname"`
// Role     uint8  `json:"role"`
// Uid      uint32 `json:"uid"`
// Name     string `json:"name"`

function DismissClubRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.CLUB_RESP_DISMISS_CLUB_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.param = msg.param;
        cc.log("DismissClubRespPacket param=", this.param);
    };
}

module.exports = DismissClubRespPacket;