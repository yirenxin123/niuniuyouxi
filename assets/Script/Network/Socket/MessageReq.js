/**
 * Created by shrimp on 17/2/22.
 */

var Message = require('Message');

function MessageReq()
{
    Message.apply(this,[]);  //集成父类数据

    this.seq = SocketSeq++;

    this.send = function()
    {
    };

    this.sendHead = function () {
        this.data.cmd = this.cmd;
        this.data.qeq = this.seq;
        this.data.uid = this.uid;

    };
}


module.exports = MessageReq;