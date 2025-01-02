/**
 * Created by shrimp on 17/3/30.
 */
var MessageReq = require("MessageReq");

// // 推荐人
// type US_REQ_BIND_REFERRAL_T struct {
//     JsonHead
//     ReferralId int `json:"referralid"`
// }

function BindReferralReqPacket() {
    MessageReq.apply(this, []);  //集成父类数据

    this.cmd = window.US_REQ_BIND_REFERRAL_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("BindReferralReqPacket.send");
        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            referralid: msg.referralid,
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = BindReferralReqPacket;


