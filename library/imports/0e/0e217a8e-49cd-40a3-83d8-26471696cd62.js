'use strict';

/**
 * Created by shrimp on 17/4/8.
 */

/*
* type CLUB_REQ_MODIFY_INFO_T struct {
 ClubHead
 Param PARAM_REQ_MODIFY_INFO_T `json:"param"`
 }
 type PARAM_REQ_MODIFY_INFO_T struct {
 HeadUrl string `json:"headurl"`
 Address string `json:"address"`
 Intro   string `json:"intro"`
 Level   int    `json:"level"`
 Renew   int    `json:"renew"` //续费, 如果不续费就是0
 }
* */
var MessageReq = require("MessageReq");
var GamePlayer = require('GamePlayer');
var GameSystem = require('GameSystem');

function ModifyClubInfoReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.CLUB_REQ_MODIFY_INFO_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("ModifyClubInfoReqPacket.send");

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            clubid: msg.clubid,
            param: {
                headurl: msg.headurl,
                address: msg.address,
                name: msg.name,
                intro: msg.intro,
                level: msg.level
            }
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = ModifyClubInfoReqPacket;