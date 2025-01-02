var BasePop        = require('BasePop');
var ToastView      = require('ToastView');
var MessageFactory = require('MessageFactory');
var MusicMgr       = require('MusicMgr');
var Audio_Common     = require('Audio_Common');
var GamePlayer     = require('GamePlayer');
var GameSystem = require("GameSystem");

cc.Class({
    extends: BasePop,

    properties: {
        ClubAddView     : cc.Prefab,
        ClubCreateView  : cc.Prefab,
        initNode        : cc.Node,
        scrollView      : cc.ScrollView,
        ClubCell        : cc.Prefab,
        ClubJoinView    : cc.Prefab,
        ClubFindPopView : cc.Prefab,
        ClubRoomView    : cc.Prefab,
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        GamePlayer.getInstance().SelfClubId = 0;
        GamePlayer.getInstance().CurClubInfo = null;
        GamePlayer.getInstance().CurClubMemList = null;
        this.sendGetClubList();
    },
    
    sendGetClubList : function () {
        MessageFactory.createMessageReq(window.US_REQ_CLUB_LIST_CMD_ID).send();
    },

    callBackBtn : function (event , CustomEventData) {
        var BtnName = event.target.getName();
        cc.log("ClubView.callBackBtn,BtnName = " + BtnName);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if(BtnName == "BtnClose")
        {
            this.dismiss();
        }
        else if(BtnName == "BtnAdd")
        {
            this.createAddView();
        }
        else if(BtnName == "BtnNewClub")
        {
            this.createClubCreateView();
        }
        else if(BtnName == "BtnAddClub")
        {
            this.createSearchPop();
        }
    },

    createSearchPop : function () {
        var ClubFindPopView = cc.instantiate(this.ClubFindPopView);
        this.node.addChild(ClubFindPopView);
        ClubFindPopView.setPosition(cc.p(0,0));
    },

    createAddView : function () {

        var ClubAddView = cc.instantiate(this.ClubAddView);
        this.node.addChild(ClubAddView);
        var winSize = cc.director.getWinSize();
        ClubAddView.setPosition(cc.p(0,0));
    },
    
    createClubCreateView : function () {
        var ClubCreateView = cc.instantiate(this.ClubCreateView);
        this.node.addChild(ClubCreateView);
        var winSize = cc.director.getWinSize();
        ClubCreateView.setPosition(cc.p(0,0));
    },

    onMessage : function (event) {
        cc.log("ClubView.onMessage");
        //this._super(event);
        var msg = event.data;
        var cmd = msg.cmd;
        switch (cmd) {
            case US_RESP_CREATE_CLUB_CMD_ID:
                this.onCreateClubMsg(msg);
                break;

            case US_RESP_CLUB_LIST_CMD_ID:
                this.onClubListMsg(msg);
                break;

            case US_RESP_SEARCH_CLUB_CMD_ID:
                this.onSearchClubMsg(msg);
                break;

            // case CLUB_REQ_JOIN_CLUB_CMD_ID:
            //     this.onJoinClubMsg(msg);
            //     break;

            case window.US_RESP_FIND_TABLE_CMD_ID:
                this.onFindRoom(msg);
                break;

            case window.CLUB_RESP_DISMISS_CLUB_CMD_ID:
                this.onDismissClubMsg(msg);
                break;

        }
    },

    onFindRoom : function (msg) {
        if(msg.code == SocketRetCode.RET_SUCCESS)
        {
            this.dismiss();
        }
    },

    onDismissClubMsg : function (msg)
    {
        cc.log("ClubInfoView.onDismissClubMsg msg=", msg);
        if(msg.code == SocketRetCode.RET_SUCCESS) {
            if (msg.param.role == window.ClubRole.E_CLUB_OWNER_ROLE) {
                ToastView.show("群主" + msg.param.name + "解散了" + msg.param.clubname) + "俱乐部";
                this.sendGetClubList();
            } else if (msg.param.uid == GamePlayer.getInstance().uid) { //如果是我自己
                ToastView.show("您退出俱乐部" + msg.param.clubname + "成功");
                this.sendGetClubList();
            }
        }
    },

    onSearchClubMsg : function (msg) {
        if (msg.code  == SocketRetCode.RET_SUCCESS)
        {
            cc.log("ClubView.onSearchClubMsg");
            this.setInitNodeVisible(false);

            var iCount = this.scrollView.content.getChildrenCount() - (this.initNode == null ? 0 : 1);
            var ClubCell = cc.instantiate(this.ClubCell);
            this.scrollView.content.addChild(ClubCell);
            ClubCell.setPosition(cc.p(0,0 - ClubCell.getContentSize().height*(iCount + 0.5)));

            var self = this;
            ClubCell.on(cc.Node.EventType.TOUCH_END, function(event){
                cc.log("ClubView.onSearchClubMsg TOUCH_END.");

                GamePlayer.getInstance().CurClubInfo = event.target.getComponent("ClubCell").info;

                self.createClubOtherView(event.target.getComponent("ClubCell").info);
            }.bind(this));

            ClubCell.getComponent("ClubCell").setClubCellInfo(msg.param);
        }
    },
    
    setInitNodeVisible : function (bVisible) {
        if (this.initNode)
        {
            this.initNode.active = bVisible;
            cc.log("ClubView initNode=", bVisible);
        }
    },

    onCreateClubMsg : function (msg) {
        cc.log("ClubView.onCreateClubMsg");
        if(msg.code  == SocketRetCode.RET_SUCCESS)
        {
            ToastView.show("俱乐部创建成功");
            this.sendGetClubList();
        }
    },
    
    createClubRoomView : function () {
        cc.log("ClubView.createClubRoomView");
        var ClubRoomView = cc.instantiate(this.ClubRoomView);
        this.node.addChild(ClubRoomView);
        ClubRoomView.setPosition(cc.p(0,0));
    },
    
    createClubOtherView : function () {
        cc.log("ClubView.createClubOtherView");
        var ClubOtherView = cc.instantiate(this.ClubJoinView);
        this.node.addChild(ClubOtherView);
        ClubOtherView.setPosition(cc.p(0,0));
    },

    onClubListMsg : function (msg) {
        if (msg.code == SocketRetCode.RET_SUCCESS)
        {
            cc.log("ClubView.onClubListMsg length=", msg.list.length);
            if (msg.list.length == 0) {
                return;
            }

            this.setInitNodeVisible(false);
            this.scrollView.content.removeAllChildren(true);
            var height = 0;
            for(var index = 0; msg.list != null && index < msg.list.length; index++)
            {
                var ClubCell = cc.instantiate(this.ClubCell);
                this.scrollView.content.addChild(ClubCell);
                ClubCell.setPosition(cc.p(0,0 -
                    ClubCell.getContentSize().height*(index + 0.5)));
                var self = this;

                ClubCell.on(cc.Node.EventType.TOUCH_END, function(event){
                    GamePlayer.getInstance().CurClubInfo = event.target.getComponent("ClubCell").info;

                    self.createClubRoomView();
                }.bind(this));
                height = ClubCell.getContentSize().height;
                ClubCell.getComponent("ClubCell").setClubCellInfo(msg.list[index]);
            }
            if ( height * (msg.list.length) > this.scrollView.content.height)
            {
                this.scrollView.content.height = height * (msg.list.length);
            }
        }
    },

    onSceneMsg : function (event) {
        var msg = event.data;
        if (msg.popView == "ClubAddView") {
            if (msg.btn == "NewClub") {
                this.createClubCreateView();
            } else if(msg.btn == "AddClub") {
                this.createSearchPop();
            }
        } else if (msg.popView == "ClubRoomView") {
            if (msg.btn == "BtnClose") {
                cc.log("ClubView.onSceneMsg ClubRoomView BtnClose.");
                GamePlayer.getInstance().SelfClubId = 0;
                GamePlayer.getInstance().CurClubInfo = null;
                GamePlayer.getInstance().CurClubMemList = null;
                this.scrollView.content.removeAllChildren(true);
                this.scrollView.content.addChild(this.initNode);
                this.setInitNodeVisible(true);
                this.sendGetClubList();
            }
        } else if (msg.popView == "ClubJoinView") {
            if (msg.btn == "RespJoin") {
                cc.log("ClubView.onSceneMsg ClubJoinView RespJoin");
                GamePlayer.getInstance().SelfClubId = 0;
                GamePlayer.getInstance().CurClubInfo = null;
                GamePlayer.getInstance().CurClubMemList = null;
                this.scrollView.content.removeAllChildren(true);
                this.scrollView.content.addChild(this.initNode);
                this.setInitNodeVisible(true);
                this.sendGetClubList();
            }
        }
    },
});
