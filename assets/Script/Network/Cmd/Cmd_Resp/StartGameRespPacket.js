/**
 * Created by shrimp on 17/3/1.
 */
var MessageResp = require("MessageResp");

/*
* type US_RESP_GAME_SWITCH_T struct {
 JsonHead
 RespHead
 }
 */

function StartGameRespPacket() {
    MessageResp.apply(this, []);  //集成父类数据

    this.cmd = window.US_RESP_GAME_SWITCH_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq     = msg.seq;
        this.uid     = msg.uid;
        this.code    = msg.code;
        this.desc    = msg.desc;
        this.isstart = msg.isstart;
    };
}

module.exports =  StartGameRespPacket;