var MessageReq = require("MessageReq");

function CreateTableCostReqPacket() {
    MessageReq.apply(this, []);  //集成父类数据

    this.cmd = window.US_REQ_CREATE_COST_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("CreateTableCostReqPacket.send");
        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
        }
        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports =  CreateTableCostReqPacket;
