'use strict';

/**
 * Created by shrimp on 17/2/22.
 */

var MessageReq = require("MessageReq");
var GamePlayer = require('GamePlayer');
var GameSystem = require('GameSystem');
var Platform = require('Platform');

function LoginReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_LOGIN_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            logintype: GameSystem.getInstance().CustomLoginType,
            unionid: GamePlayer.getInstance().unionid,
            openid: GamePlayer.getInstance().openid,
            nickname: GamePlayer.getInstance().name,
            headurl: GamePlayer.getInstance().headurl,
            sex: GamePlayer.getInstance().sex,
            // deviceid:   "927A79F7-2CEA-4711-B3A8-56D52CB9387F",
            deviceid: Platform.getInstance().generateUUID(),
            productid: GameSystem.getInstance().productid,
            platform: Platform.getInstance().getPlatformType()
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = LoginReqPacket;