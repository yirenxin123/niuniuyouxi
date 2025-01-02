"use strict";

/**
 * Created by shrimp on 17/2/22.
 */
var Message = require('Message');

function MessageResp() {
    Message.apply(this, []); //集成父类数据

    this.code = 0;
    this.desc = "";

    this.onMessage = function (msg) {};
}

module.exports = MessageResp;