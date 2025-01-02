'use strict';

var BasePop = require('BasePop');
var MessageFactory = require('MessageFactory');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GamePlayer = require('GamePlayer');
var ToastView = require('ToastView');
var GameSystem = require("GameSystem");

window.ClubRole = {
    E_CLUB_OWNER_ROLE: 1, //群主
    E_CLUB_MANAGER_ROLE: 2, //管理员
    E_CLUB_NORMAL_ROLE: 3 };

cc.Class({
    extends: BasePop,

    properties: {
        TitleLabel: cc.Label,
        UpgradeLabel: cc.Label,
        EditName: cc.EditBox,
        ClubPersonsCell: cc.Prefab,
        ScrollView: cc.ScrollView,
        ClubUpgradView: cc.Prefab,
        ClubMemberPermissionView: cc.Prefab
    },

    onLoad: function onLoad() {
        this._super();
        this.showTitle();
        this.showMemberList();
    },

    showTitle: function showTitle() {
        this.TitleLabel.string = "会员管理(" + GamePlayer.getInstance().CurClubInfo.members + "/" + GamePlayer.getInstance().CurClubInfo.maxmember + ")";
        if (GamePlayer.getInstance().uid != GamePlayer.getInstance().CurClubInfo.owneruid) {
            this.UpgradeLabel.node.active = false;
        }
    },

    showMemberList: function showMemberList() {
        var list = GamePlayer.getInstance().CurClubMemList;
        this.ScrollView.content.removeAllChildren(true);
        var height = 0;
        for (var index = 0; list != null && index < list.length; index++) {
            height = this.createClubPersonCell(list, index);
        }

        if (height * list.length > this.ScrollView.content.height) {
            this.ScrollView.content.height = height * list.length;
        }
    },

    searchOneMember: function searchOneMember(name) {
        var list = GamePlayer.getInstance().CurClubMemList;

        for (var index = 0; list != null && index < list.length; index++) {
            if (list[index].name != name) {
                cc.log("searchOneMember : not found list.name=", list[index].name);
                continue;
            }
            cc.log("searchOneMember : success found name=", name);
            this.ScrollView.content.removeAllChildren();
            this.createClubPersonCell(list, index);
            return;
        }

        ToastView.show("未搜索到会员: " + name);
    },

    createClubPersonCell: function createClubPersonCell(list, index) {
        var ClubPersonsCell = cc.instantiate(this.ClubPersonsCell);

        this.ScrollView.content.addChild(ClubPersonsCell);
        var height = ClubPersonsCell.getContentSize().height;
        ClubPersonsCell.setPosition(cc.p(0, 0 - height * (index + 0.5)));

        ClubPersonsCell.getComponent("ClubPersonsCell").setPersonInfo(list[index]);

        //不是这个俱乐部的群主没有权限修改会员
        if (GamePlayer.getInstance().CurClubInfo.owneruid != GamePlayer.getInstance().uid) {
            cc.log("ClubMemberView.createClubPersonCell not Owner");
            return height;
        }

        if (list[index].role == window.ClubRole.E_CLUB_OWNER_ROLE) {
            cc.log("ClubMemberView.createClubPersonCell owner role=", list[index].role);
            return height;
        }
        ClubPersonsCell.getComponent("ClubPersonsCell").BtnSet.node.active = true;
        ClubPersonsCell.getComponent("ClubPersonsCell").BtnSet.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            var self = this;
            var cell = event.target.getParent().getComponent('ClubPersonsCell');
            var ClubMemberPermissionView = cc.instantiate(this.ClubMemberPermissionView);
            self.node.addChild(ClubMemberPermissionView);
            ClubMemberPermissionView.setPosition(cc.p(0, 0));
            ClubMemberPermissionView.getComponent('ClubMemberPermissionView').setData(cell.info);
        }.bind(this));
        cc.log("createClubPersonCell.height = " + height);
        return height;
    },

    ////////////////////////////////////////////////////////////////////
    onMessage: function onMessage(event) {
        cc.log("ClubMemberView.onMessage");
        var msg = event.data;
        var cmd = msg.cmd;
        switch (cmd) {
            case window.CLUB_RESP_OWNER_RM_MEMBER_CMD_ID:
                this.onDelMemberMsg(msg);
                break;

            case window.CLUB_RESP_GET_MEMBER_LIST_CMD_ID:
                this.onGetClubMember(msg);
                break;

            case window.CLUB_RESP_OWNER_MODIFY_ROLE_CMD_ID:
                this.onModifyMemberRole(msg);
                break;
        }
    },

    onClubRmMem: function onClubRmMem(msg) {
        //param
        // ClubId   int    `json:"clubid"`
        // ClubName string `json:"clubname"`
        // Uid      uint32 `json:"uid"`
        // Name     string `json:"name"`
        if (msg.param.uid == GamePlayer.getInstance().uid) {
            ToastView.show("您被移除俱乐部" + msg.param.clubname + "(" + msg.param.clubid + ")");
        } else {
            ToastView.show(msg.param.name + "被移除俱乐部" + msg.param.clubname + "(" + msg.param.clubid + ")");
        }
    },

    // type CLUB_RESP_OWNER_MODIFY_ROLE_T struct {
    //     JsonHead
    //     RespHead
    //     Param PARAM_RESP_OWNER_MODIFY_ROLE_T `json:"param"`
    // }
    //
    // type PARAM_RESP_OWNER_MODIFY_ROLE_T struct {
    //     ClubId int    `json:"clubid"`
    //     Uid    uint32 `json:"uid"`
    //     Role   uint8  `json:"role"`
    // }
    onModifyMemberRole: function onModifyMemberRole(msg) {
        //param : { clubid, uid, role
        //        }
        if (msg.param.clubid != GamePlayer.getInstance().CurClubInfo.clubid) {
            cc.log("ClubMemberView.onModifyMemberRole recv clubid=", msg.param.clubid, " != curClubid=", GamePlayer.getInstance().CurClubInfo.clubid);
            return;
        }

        var list = GamePlayer.getInstance().CurClubMemList;
        for (var index = 0; list != null && index < list.length; index++) {
            if (list[index].uid == msg.param.uid) {
                GamePlayer.getInstance().CurClubMemList[index].role = msg.param.role;
            }
        }
        this.showMemberList();
    },

    onDelMemberMsg: function onDelMemberMsg(msg) {
        cc.log("ClubMemberView.onDelMemberMsg");
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            var data = {
                clubid: GamePlayer.getInstance().CurClubInfo.clubid
            };
            MessageFactory.createMessageReq(window.CLUB_REQ_GET_MEMBER_LIST_CMD_ID).send(data);
        }
    },

    onGetClubMember: function onGetClubMember(msg) {
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            GamePlayer.getInstance().CurClubMemList = msg.list;
            this.showMemberList();
        }
    },

    callBackBtn: function callBackBtn(event, CustomEventData) {
        var BtnName = event.target.getName();

        cc.log('ClubMemberView.callBackBtn, BtnName=' + BtnName);

        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);

        if (BtnName == "BtnClose") {
            this.dismiss();
            this.dismiss();
            var message = {
                popView: "ClubMemberView",
                btn: "BtnClose"
            };

            GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.SCENE_MSG, data: message });
        } else if (BtnName == "BtnUpgrade") {
            var ClubUpgradView = cc.instantiate(this.ClubUpgradView);
            this.node.addChild(ClubUpgradView);
            ClubUpgradView.setPosition(cc.p(0, 0));
        } else if (BtnName == "BtnSearch") {
            var name = this.EditName.string;
            cc.log("ClubMemberView.callBackBtn, name=", name);
            this.searchOneMember(name);
        }
    },

    callBackEditNameBegin: function callBackEditNameBegin(event, CustomEventData) {
        cc.log("ClubMemberView.callBackEditNameBegin");
        this.EditName.string = "";
    },

    callBackEditNameEnd: function callBackEditNameEnd(event, CustomEventData) {
        var name = this.EditName.string;
        cc.log("ClubMemberView.callBackEditNameEnd, name=", name);
        this.searchOneMember(name);
    },

    onSceneMsg: function onSceneMsg(event) {
        var msg = event.data;
        if (msg.popView == "ClubUpdradeView") {
            if (msg.btn == "BtnClose") {
                this.showTitle();
                this.showMemberList();
            }
        }
    }

});