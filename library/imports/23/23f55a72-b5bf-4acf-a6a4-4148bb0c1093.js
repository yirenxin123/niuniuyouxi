"use strict";

/**
 * Created by shrimp on 17/3/30.
 */

var MessageResp = require("MessageResp");

function BindReferralRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_BIND_REFERRAL_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {
        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        this.referralid = msg.referralid;
    };
}
module.exports = BindReferralRespPacket;