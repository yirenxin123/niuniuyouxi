/**
 * Created by shrimp on 17/3/2.
 */

var MessageReq = require("MessageReq");
var Cmd_Bullfight = require('Cmd_Bullfight');
var GameSystem = require('GameSystem');

/*
* //看牌
 type SBF_REQ_OPEN_CARD_T struct {
 GameHead
 HasBull int      `json:"hasbull"`
 Cards   []uint16 `json:"cards"`
 }
* */

function Bullfight_OpenCardReqPacket() {
    MessageReq.apply(this, []);  //集成父类数据

    this.cmd = Cmd_Bullfight.SBF_REQ_OPEN_CARD_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            gamesvcid : GameSystem.getInstance().gamesvcid,
            tableid : GameSystem.getInstance().tableid,
        }

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports =  Bullfight_OpenCardReqPacket;