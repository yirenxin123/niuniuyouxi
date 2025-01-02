/**
 * Created by zhouxueshi on 2017/5/6.
 */
var MessageResp = require("MessageResp");

// type US_RESP_CLUB_UPGRADE_COST_T struct {
//     JsonHead
//     RespHead
//     List []CLUB_COST_T `json:"list"`
// }
//
// type CLUB_COST_T struct {
//     Level     int `json:"level"`
//     LiveTime  int `json:"livetime"`
//     Diamond   int `json:"diamond"`
//     MaxPeople int `json:"maxpeople"`
//     MaxTable  int `json:"maxtable"`
// }

function ClubUpgradeCostRespPacket() {
    MessageResp.apply(this, []);  //集成父类数据

    this.cmd = window.US_RESP_CLUB_UPGRADE_COST_CMD_ID;

    this.onMessage = function (msg) {
        this.seq  = msg.seq;
        this.uid  = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        this.list = msg.list;
    };
}

module.exports = ClubUpgradeCostRespPacket;