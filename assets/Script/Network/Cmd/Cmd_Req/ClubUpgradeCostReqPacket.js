/**
 * Created by zhouxueshi on 2017/5/6.
 */

var MessageReq = require("MessageReq");
var GamePlayer = require('GamePlayer');
var GameSystem = require('GameSystem');

function ClubUpgradeCostReqPacket() {
    MessageReq.apply(this, []);  //集成父类数据

    this.cmd = window.US_REQ_CLUB_UPGRADE_COST_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("ClubUpgradeCostReqPacket.send");

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
        }

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = ClubUpgradeCostReqPacket;