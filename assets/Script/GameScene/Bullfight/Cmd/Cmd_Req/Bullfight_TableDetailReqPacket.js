/**
 * Created by shrimp on 17/3/2.
 */

var MessageReq = require("MessageReq");
var Cmd_Bullfight = require('Cmd_Bullfight');
var GameSystem = require('GameSystem');

function Bullfight_TableDetailReqPacket() {
    MessageReq.apply(this, []);  //集成父类数据

    this.cmd = Cmd_Bullfight.US_REQ_TABLE_DETAIL_CMD_ID;

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

module.exports =  Bullfight_TableDetailReqPacket;