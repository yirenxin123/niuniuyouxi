var BasePop = require('BasePop');
var UtilTool = require('UtilTool');
var MessageFactory = require('MessageFactory');
var LoadingView = require('LoadingView');
var ToastView = require('ToastView');
var GamePlayer = require('GamePlayer');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require("GameSystem");

cc.Class({
    extends: BasePop,

    properties: {
        ClubTitle   : cc.Label,      //俱乐部Title
        ClubName    : cc.Label,        //俱乐部名称
        ClubPersons : cc.Label,
        ClubHead    : cc.Sprite,
        ClubAddress : cc.Label,
        ClubOwner   : cc.Label,
        ClubOwnerHead : cc.Sprite,
        ClubId      : cc.Label,
        ClubIntroDoc: cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        this.setTextInfo();
        this.setHeadUrl();
    },

    /*********************Network***************************/
    onMessage : function (event) {
        cc.log("ClubJoinView.onMessage");
        var msg = event.data;
        var cmd = msg.cmd;
        switch (cmd) {
            case window.CLUB_RESP_JOIN_CLUB_CMD_ID:
                this.onJoinClubMsg(msg);
                break;

        }
    },

    onJoinClubMsg : function (msg) {
        if(msg.code == SocketRetCode.RET_SUCCESS) {
            if (msg.param.uid == GamePlayer.getInstance().uid)
            {
                if(msg.param.isallow == 1) {
                    ToastView.show("群主同意您加入他的俱乐部");
                    MessageFactory.createMessageReq(US_REQ_CLUB_LIST_CMD_ID).send();
                } else {
                    ToastView.show("群主拒绝您加入他的俱乐部");
                }
                this.dismiss();
                var message = {
                    popView : "ClubJoinView",
                    btn     : "RespJoin",
                };
                GlobalEventManager.getInstance().emitEvent(window.SocketMessage,
                    {tag:window.MessageType.SCENE_MSG, data:message});
            }
        }
    },

    //[{"clubid":10000019,"role":1,"owneruid":10688,"level":1, "name":"as",
    // "headurl":"","address":"广西 百色市","intro":"","endtime":1494324197,"status":1,
    // "members":1, "maxmember":10}]
    setTextInfo : function () {
        this.ClubTitle.string    = GamePlayer.getInstance().CurClubInfo.name;
        this.ClubName.string     = GamePlayer.getInstance().CurClubInfo.name;
        this.ClubPersons.string  = GamePlayer.getInstance().CurClubInfo.members + "/" +
            GamePlayer.getInstance().CurClubInfo.maxmember;
        this.ClubAddress.string  = GamePlayer.getInstance().CurClubInfo.address;
        this.ClubOwner.string    = GamePlayer.getInstance().CurClubInfo.ownername;
        this.ClubId.string       = GamePlayer.getInstance().CurClubInfo.clubid;
        this.ClubIntroDoc.string = GamePlayer.getInstance().CurClubInfo.intro;
    },

    setHeadUrl : function () {
        //this.ClubOwnerHead
    },

    callBackBtn : function (event , CustomEventData) {
        var BtnName = event.target.getName();
        cc.log('ClubJoinView.callBackBtn,BtnName = ' + BtnName);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if (BtnName == "BtnClose") {
            this.dismiss();
        } else if(BtnName == "BtnJoinClub") {
            var data = {
                uid     : GamePlayer.getInstance().uid,
                name    : GamePlayer.getInstance().name,
                headurl : GamePlayer.getInstance().headurl,
                sex     : GamePlayer.getInstance().sex,
            };
            MessageFactory.createMessageReq(CLUB_REQ_JOIN_CLUB_CMD_ID).send(GamePlayer.getInstance().CurClubInfo.clubid, data);
        }
    }
});
