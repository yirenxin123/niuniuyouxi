var BasePop = require('BasePop');
var UtilTool = require('UtilTool');
var MessageFactory = require('MessageFactory');
var LoadingView = require('LoadingView');
var ToastView = require('ToastView');
var GamePlayer = require('GamePlayer');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameCallOC = require('GameCallOC');
var AlertView = require("AlertView");
var GameSystem = require("GameSystem");

cc.Class({
    extends: BasePop,

    properties: {
        ClubTitle      : cc.Label,      //俱乐部Title
        ClubName       : cc.Label,      //俱乐部名称
        ClubPersons    : cc.Label,
        ClubHead       : cc.Sprite,
        ClubAdress     : cc.Label,
        ClubOwner      : cc.Label,
        ClubMemberHead : [cc.Sprite],
        ClubMemHeadBg  : [cc.Sprite],
        ClubOwnerHead  : cc.Sprite,
        ClubId         : cc.Label,
        ClubTime       : cc.Label,
        ClubIntroDoc   : cc.RichText,
        ClubMember     : cc.Prefab,
        ClubSetView    : cc.Prefab,
        ShareView      : cc.Prefab,
        ClubLevel      : cc.Label,
        ClubLevelView  : cc.Prefab,
        ccccc : cc.Label,
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        // for (var i = 0; i < 4; i++) {
        //     this.ClubMemHeadBg[i].node.active = false;
        // }
    },

    /*********************Network***************************/
    onMessage : function (event) {
        cc.log("ClubInfoView.onMessage");
        //this._super(event);
        var msg = event.data;
        var cmd = msg.cmd;
        switch (cmd) {
            case window.CLUB_RESP_DISMISS_CLUB_CMD_ID:
                this.onDismissClubMsg(msg);
                break;

            case CLUB_RESP_GET_MEMBER_LIST_CMD_ID:
                this.onGetClubMember(msg);
                break;

            case window.CLUB_RESP_OWNER_RM_MEMBER_CMD_ID:
                this.onDelMemberMsg(msg);
                break;

        }
    },

    onGetClubMember : function (msg) {
        if (msg.code == SocketRetCode.RET_SUCCESS)
        {
            GamePlayer.getInstance().CurClubMemList = msg.list;
            this.setHeadUrlList();
        }
    },

    onDelMemberMsg : function (msg) {
        cc.log("ClubInfoView.onDelMemberMsg msg=", msg);
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            if (msg.param.uid == GamePlayer.getInstance().uid) { //如果是我自己
                this.dismiss();
                cc.log("ClubInfoView.onDismissClubMsg notify ClubRoomView");
                var message = {
                    popView : "ClubInfoView",
                    btn     : "onDismissClubMsg",
                };

                GlobalEventManager.getInstance().emitEvent(window.SocketMessage,
                    {tag:window.MessageType.SCENE_MSG, data:message});
            } else {
                this.sendGetMemberList();
            }
        }
    },

    onDismissClubMsg : function (msg)
    {
        cc.log("ClubInfoView.onDismissClubMsg msg=", msg);
        if(msg.code == SocketRetCode.RET_SUCCESS)
        {
            if (msg.param.role == window.ClubRole.E_CLUB_OWNER_ROLE) {

                ToastView.show("群主" + msg.param.name + "解散了" + msg.param.clubname) + "俱乐部";

                LoadingView.dismiss();

                this.dismiss();

                cc.log("ClubInfoView.onDismissClubMsg notify ClubRoomView");
                var message = {
                    popView : "ClubInfoView",
                    btn     : "onDismissClubMsg",
                };

                GlobalEventManager.getInstance().emitEvent(window.SocketMessage,
                                        {tag:window.MessageType.SCENE_MSG, data:message});

            } else if (msg.param.uid == GamePlayer.getInstance().uid) { //如果是我自己

                ToastView.show("您退出俱乐部" + msg.param.clubname + "成功");

                LoadingView.dismiss();

                this.dismiss();

                cc.log("ClubInfoView.onDismissClubMsg notify ClubRoomView");
                var message = {
                    popView : "ClubInfoView",
                    btn     : "onDismissClubMsg",
                };

                GlobalEventManager.getInstance().emitEvent(window.SocketMessage,
                                        {tag:window.MessageType.SCENE_MSG, data:message});

            } else { //如果是其他玩家,重新刷新一下用户头像
                ToastView.show(msg.param.name + "退出俱乐部" + msg.param.clubname);
                this.sendGetMemberList();
            }
        }
    },

    ///////////////////////Scene/////////////////////////
    onSceneMsg : function (event) {
        var msg = event.data;
        if (msg.popView == "ClubSetView" || msg.popView == "ClubMemberView") {
            if (msg.btn == "BtnClose") {
                this.setTextInfo();
                this.setHeadUrlList();
            }
        }
    },

    //[{"clubid":10000019,"role":1,"owneruid":10688,"level":1, "name":"as",
    // "headurl":"","address":"广西 百色市","intro":"","endtime":1494324197,"status":1,
    // "members":1, "maxmember":10}]
    setTextInfo : function () {
        cc.log("ClubInfoView.setTextInfo info=", GamePlayer.getInstance().CurClubInfo);

        this.ClubTitle.string      = GamePlayer.getInstance().CurClubInfo.name;
        this.ClubName.string       = GamePlayer.getInstance().CurClubInfo.name;
        this.ClubPersons.string    = GamePlayer.getInstance().CurClubInfo.members + "/" +
            GamePlayer.getInstance().CurClubInfo.maxmember;
        this.ClubAdress.string     = GamePlayer.getInstance().CurClubInfo.address;
        this.ClubOwner.string      = GamePlayer.getInstance().CurClubInfo.ownername;
        this.ClubId.string         = GamePlayer.getInstance().CurClubInfo.clubid;
        this.ClubIntroDoc.string   = GamePlayer.getInstance().CurClubInfo.intro;
        // this.ClubMemberHead.length = GamePlayer.getInstance().CurClubInfo.members;
        this.ClubTime.string = /*"创建于" + UtilTool.getFormatData(GamePlayer.getInstance().CurClubInfo.createtime) + "  "
                                +*/ UtilTool.getFormatData(GamePlayer.getInstance().CurClubInfo.endtime) + "到期";
        this.ClubLevel.string = this.getClubLevelName(GamePlayer.getInstance().CurClubInfo.level);
    },

    setHeadUrlList : function () {
        var list = GamePlayer.getInstance().CurClubMemList;
        if (list == null || list.length == 0) {
            return;
        }

        var i = 0;
        for (; i < list.length; i++) {
            this.ClubMemHeadBg[i].node.active = true;
            UpdateWXHeadIcon(list[i].headurl, this.ClubMemberHead[i])
            if (i >= 3) {
                break;
            }
        }

        for (i= 0; i < list.length; i++) {
            if (list[i].role == window.ClubRole.E_CLUB_OWNER_ROLE) {
                UpdateWXHeadIcon(list[i].headurl, this.ClubOwnerHead);
                return;
            }
        }
    },

    setClubInfo : function () {
        this.setTextInfo();
        this.sendGetMemberList();
    },

    sendGetMemberList : function () {
        cc.log("ClubInfoView.sendGetMemberList clubid=", GamePlayer.getInstance().CurClubInfo.clubid);
        var data = {
            clubid: GamePlayer.getInstance().CurClubInfo.clubid,
        };
        MessageFactory.createMessageReq(window.CLUB_REQ_GET_MEMBER_LIST_CMD_ID).send(data);
    },

    callBackBtn : function (event , CustomEventData) {
        var BtnName = event.target.getName();
        cc.log('ClubInfoView.callBackBtn,BtnName = ' + BtnName);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);

        if (BtnName == "BtnChangeInfo")
        {
            var ClubSetView = cc.instantiate(this.ClubSetView);
            this.node.addChild(ClubSetView);
            ClubSetView.setPosition(cc.p(0,0));
        }
        else if (BtnName == "BtnClose")
        {
            this.dismiss();

            var message = {
                popView : "ClubInfoView",
                btn     : "BtnClose",
            };
            GlobalEventManager.getInstance().emitEvent(window.SocketMessage,
                {tag:window.MessageType.SCENE_MSG, data:message});
        }
        else if(BtnName == "BtnMember")
        {
            var ClubMember = cc.instantiate(this.ClubMember);
            this.node.addChild(ClubMember);
            ClubMember.setPosition(cc.p(0,0));
        }
        else if(BtnName == "BtnDelClub")
        {
            var alert = AlertView.create();
            alert.setPositiveButton(function () {
                var data = {
                    clubid : GamePlayer.getInstance().CurClubInfo.clubid,
                };
                MessageFactory.createMessageReq(CLUB_REQ_DISMISS_CLUB_CMD_ID).send(data);
            },"删除并退出");
            alert.show("您确定是否删除并推出俱乐部？",AlertViewBtnType.E_BTN_CANCLE);
        }
        else if(BtnName == "BtnShareBusiness")
        {
            var shareView = cc.instantiate(this.ShareView);
            this.node.addChild(shareView);
            shareView.setPosition(cc.p(0,0));
            var string = "我正在玩游戏［" + GameCallOC.getInstance().getAppName() +"］,俱乐部(" +
                            GamePlayer.getInstance().CurClubInfo.clubid+ ")欢迎您的加入！！！";
            shareView.getComponent("ShareView").setShareTyep(ShareType.E_SHARETYPE_LINK, string, GameSystem.getInstance().clienturl);
        }
        else if(BtnName == "BtnClubLevel")
        {
            if(GamePlayer.getInstance().CurClubInfo.owneruid == GamePlayer.getInstance().uid)
            {
                var levelView = cc.instantiate(this.ClubLevelView);
                this.node.addChild(levelView);
                levelView.setPosition(cc.p(0,0));
            }

        }
    },

    getClubLevelName : function (level) {
        switch (level)
        {
            case 1:
                return "一星俱乐部";
            case 2:
                return "二星俱乐部";
            case 3:
                return "三星俱乐部";
            case 4:
                return "四星俱乐部";
            case 5:
                return "五星俱乐部";
            case 6:
                return "六星俱乐部";
            case 7:
                return "七星俱乐部";
            case 8:
                return "八星俱乐部";
            case 9:
                return "九星俱乐部";
            case 10:
                return "十星俱乐部";
        }
    },
});
