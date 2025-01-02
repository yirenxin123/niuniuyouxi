/**
 * Created by zhouxueshi on 2017/5/14.
 */

var MessageResp = require("MessageResp");

function NotifyInGameRespPacket() {
    MessageResp.apply(this, []);  //集成父类数据

    this.cmd = window.US_NOTIFY_IN_GAME_CMD_ID;
    this.gamesvcid = 0;
    this.tableid   = 0;
    this.gameid    = 0;
    this.gamelevel = 0;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        this.gamesvcid = msg.gamesvcid;
        this.tableid   = msg.tableid;
        this.gameid    = msg.gameid;
        this.gamelevel = msg.gamelevel;
    };
}

module.exports = NotifyInGameRespPacket;