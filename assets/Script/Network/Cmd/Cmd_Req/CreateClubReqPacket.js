/**
 * Created by shrimp on 17/3/31.
 */

var MessageReq = require("MessageReq");
var GameSystem = require('GameSystem');
/*
* type US_REQ_CREATE_CLUB_T struct {
 JsonHead
 Param PARAM_REQ_CREATE_CLUB_T `json:"param"`
 }
 type PARAM_REQ_CREATE_CLUB_T struct {
 Name    string `json:"name"`
 HeadUrl string `json:"headurl"`
 Address string `json:"address"`
 Level   int    `json:"level"`
 Intro   string `json:"intro"`
 }
* */

function CreateClubReqPacket() {
    MessageReq.apply(this, []);  //集成父类数据

    this.cmd = window.US_REQ_CREATE_CLUB_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("CarryCoinReqPacket.send");
        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            param : (msg),
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports =  CreateClubReqPacket;