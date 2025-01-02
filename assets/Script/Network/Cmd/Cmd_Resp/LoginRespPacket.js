/**
 * Created by shrimp on 17/2/22.
 */
var MessageResp = require("MessageResp");
var GameSystem  = require("GameSystem");
var GamePlayer  = require("GamePlayer");

function LoginRespPacket() {
    MessageResp.apply(this, []);  //集成父类数据


    //{"cmd":65540,"seq":15,"uid":11298,"code":0,"desc":"","nickname":"游客11298",
    // "headurl":"","sex":2,"gold":10000,"diamond":10000,"userkey":"b79195adee39be05d5189f7fc1149e08",
    // "clienturl":"","fileurl":"http://manage.aqddp.cn/","weixincs":"niuyouquan1,niuyouquan2",
    // "payurl":"http://baidu.com/","notice":{"title":"hello","doc":"欢迎大家来到牛友圈",
    // "writer":"xxx","time":1491476875,"popup":0,"ismaintain":0}}

    this.cmd = window.US_RESP_LOGIN_CMD_ID;
    this.nickname = "";
    this.headurl  = "";
    this.sex      = 0;
    this.gold     = 0;
    this.diamond  = 0;
    this.userkey  = "";
    this.notice = {
        title: "",
        doc:   "",
        writer: "",
        popup : 0,
        ismaintain: 0,
        time:0,
    };
    this.clienturl = "";
    this.fileurl   = "";
    this.weixincs  = "";
    this.payurl    = "";

    // 接收的数据
    // {"cmd":65540,"seq":15,"uid":11298,"code":0,"desc":"","nickname":"游客11298",
    // "headurl":"","sex":2,"gold":10000,"diamond":10000,"userkey":"b79195adee39be05d5189f7fc1149e08",
    // "clienturl":"","fileurl":"http://manage.aqddp.cn/","weixincs":"niuyouquan1,niuyouquan2",
    // "payurl":"http://baidu.com/","notice":{"title":"hello","doc":"欢迎大家来到牛友圈",
    // "writer":"xxx","time":1491476875,"popup":0,"ismaintain":0}}
    this.onMessage = function (msg) {
        this.seq  = msg.seq;
        this.uid  = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if(this.code < SocketRetCode.RET_SUCCESS)
            return;

        GamePlayer.getInstance().uid     = msg.uid;
        GamePlayer.getInstance().name    = msg.nickname;
        GamePlayer.getInstance().headurl = msg.headurl;
        GamePlayer.getInstance().sex     = msg.sex;
        GamePlayer.getInstance().gold    = msg.gold;
        GamePlayer.getInstance().diamond = msg.diamond;
        GamePlayer.getInstance().userkey = msg.userkey;
        GameSystem.getInstance().notice.title      = msg.notice.title;
        GameSystem.getInstance().notice.doc        = msg.notice.doc;
        GameSystem.getInstance().notice.writer     = msg.notice.writer;
        GameSystem.getInstance().notice.popup      = msg.notice.popup;
        GameSystem.getInstance().notice.ismaintain = msg.notice.ismaintain;
        GameSystem.getInstance().notice.time       = msg.notice.time;
        GameSystem.getInstance().clienturl         = msg.clienturl;
        GameSystem.getInstance().fileurl  = msg.fileurl;
        GameSystem.getInstance().weixincs = msg.weixincs;
        GameSystem.getInstance().payurl   = msg.payurl;
        GameSystem.getInstance().referralCode = msg.referralid;
        GameSystem.getInstance().ledlist = msg.ledlist;
        
        GameSystem.getInstance().aesKey   = AES.utils.utf8.toBytes(msg.userkey);
    };
}

module.exports =  LoginRespPacket;