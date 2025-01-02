var BasePop = require('BasePop');
var MessageFactory = require('MessageFactory');
var ToastView = require('ToastView');
var GameSystem = require('GameSystem');
var LoadingView = require('LoadingView');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GamePlayer = require('GamePlayer');

cc.Class({
    extends: BasePop,

    properties: {
        ClubName  : cc.Label,
        ClubInfo  : cc.Prefab,
        TableNum  : cc.Label,
        CreateRoom: cc.Sprite,
        Bullfight_CreateRoom : cc.Prefab,
        scrollview : cc.ScrollView,
        TableCell  : cc.Prefab,
    },

    onLoad: function () {
        this._super();
        this.setClubInfo();
    },

    onMessage : function (event) {
        cc.log("ClubRoomView.onMessage");
        //this._super(event);
        var msg = event.data;
        var cmd = msg.cmd;
        switch (cmd) {
            case window.US_RESP_CLUB_TABLE_CMD_ID:
                this.onGetClubTableMsg(msg);
                break;

            case window.US_RESP_ENTER_GAME_CMD_ID:
                this.onEnterRoom(msg);
                break;

            case window.CLUB_RESP_OWNER_RM_MEMBER_CMD_ID:
                this.onDelMemberMsg(msg);
                break;
        }
    },

    onDelMemberMsg : function (msg) {
        cc.log("ClubInfoView.onDelMemberMsg");
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            if (msg.param.uid == GamePlayer.getInstance().uid) { //如果是我自己
                this.dismiss();
                var message = {
                    popView : "ClubRoomView",
                    btn     : "BtnClose",
                };
                GlobalEventManager.getInstance().emitEvent(window.SocketMessage,
                    {tag:window.MessageType.SCENE_MSG, data:message});
            }
        }
    },

    onSceneMsg : function (event) {
        cc.log("ClubRoomView.onSceneMsg");
        var msg = event.data;
        if (msg.popView == "ClubInfoView") {
            if (msg.btn == "BtnClose") {
                this.setClubInfo();

            } else if (msg.btn == "onDismissClubMsg") {
                cc.log("ClubRoomView.onSceneMsg ClubInfoView onDismissClubMsg.");
                this.dismiss();
                var message = {
                    popView : "ClubRoomView",
                    btn     : "BtnClose",
                };
                GlobalEventManager.getInstance().emitEvent(window.SocketMessage,
                    {tag:window.MessageType.SCENE_MSG, data:message});
            }
        }
    },

    onEnterRoom : function(msg)
    {
        cc.log("HallScene.onEnterRoom,tableid = " + msg.name);
        if(msg.code == SocketRetCode.RET_SUCCESS)
        {

        }
    },

    onGetClubTableMsg : function (msg) {
        if(msg.code == SocketRetCode.RET_SUCCESS)
        {
            if(msg.list == null ||  msg.list.length == 0)
            {
                ToastView.show("暂未发现俱乐部房间");
                return ;
            }

            this.TableNum.string = "牌局(" + msg.list.length + ")";

            let height = 0;
            for (var index = 0;msg.list != null && index < msg.list.length ;index++)
            {
                var TableCell = cc.instantiate(this.TableCell);
                this.scrollview.content.addChild(TableCell);
                height = TableCell.getContentSize().height;
                TableCell.setPosition(cc.p(0,-TableCell.getContentSize().height/2 - TableCell.getContentSize().height*index));
                TableCell.getComponent("GamblingHouseCell").updateRoomInfo(msg.list[index]);
            }

            if(TableCell.getContentSize().height*msg.list.length > this.scrollview.content.height)
            {
                this.scrollview.content.height = height *msg.list.length
            }

        }
    },

    callBackBtn : function (event , CustomEventData) {
        var BtnName = event.target.getName();
        cc.log("ClubRoomView.callBackBtn,BtnName = " + BtnName);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if(BtnName == "BtnClose")
        {
            this.dismiss();
            var message = {
                popView : "ClubRoomView",
                btn     : "BtnClose",
            };
            GlobalEventManager.getInstance().emitEvent(window.SocketMessage,
                {tag:window.MessageType.SCENE_MSG, data:message});
        }
        else if(BtnName == "BtnClubInfo")
        {
            var ClubInfo = cc.instantiate(this.ClubInfo);
            this.node.addChild(ClubInfo);
            ClubInfo.setPosition(cc.p(0,0));

            ClubInfo.getComponent("ClubInfoView").setClubInfo();
        }
        else if(BtnName == "CreateRoom")
        {
            var createRoom = cc.instantiate(this.Bullfight_CreateRoom);
            this.node.addChild(createRoom);
            createRoom.setPosition(cc.p(0,0));
            createRoom.getComponent("Bullfight_CreateRoom").setClubId(
                                    GamePlayer.getInstance().CurClubInfo.clubid,
                                    GamePlayer.getInstance().CurClubInfo.level);
        }
    },

    //{"clubid":10000019,"role":1,"owneruid":10688,"level":1,"name":"as",
    // "headurl":"","address":"广西 百色市","intro":"","endtime":1494324197,"status":1,
    // "members":1,"maxmember":10}

    setClubInfo : function () {

        var info = GamePlayer.getInstance().CurClubInfo;

        cc.log("ClubRoomView.setClubInfo Clubid=", info.clubid, " role=", info.role, " name=", info.name);

        this.ClubName.string = info.name;

        if (info.role == window.ClubRole.E_CLUB_NORMAL_ROLE) {
            this.CreateRoom.node.active = false;
        }

        var data = {
            clubid : info.clubid,
        };
        MessageFactory.createMessageReq(window.US_REQ_CLUB_TABLE_CMD_ID).send(data);
    },
});
