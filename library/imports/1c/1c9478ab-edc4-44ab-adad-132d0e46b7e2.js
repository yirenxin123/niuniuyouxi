'use strict';

var BasePop = require('BasePop');
var MessageFactory = require('MessageFactory');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GamePlayer = require('GamePlayer');
var GameSystem = require("GameSystem");

cc.Class({
    extends: BasePop,

    properties: {
        OpManage: cc.Label
    },

    // use this for initialization
    // `json:"uid"`
    // `json:"name"`
    // `json:"headurl"`
    // `json:"sex"`
    // `json:"role"`
    // `json:"lasttime"`
    onLoad: function onLoad() {
        this._super();
        this.info = null;
    },

    setData: function setData(info) {
        this.info = info;
        if (info.role == window.ClubRole.E_CLUB_MANAGER_ROLE) {
            this.OpManage.string = "取消管理员";
        } else if (info.role == window.ClubRole.E_CLUB_NORMAL_ROLE) {
            this.OpManage.string = "设置管理员";
        }
    },

    callBackBtn: function callBackBtn(event, CustomEventData) {
        var BtnName = event.target.getName();
        cc.log('ClubMemberPermissionView.callBackBtn, BtnName = ' + BtnName);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);

        if (BtnName == "GrayLayer") {} else if (BtnName == "PermissionOpBg") {
            var data = {
                clubid: GamePlayer.getInstance().CurClubInfo.clubid,
                uid: this.info.uid,
                role: window.ClubRole.E_CLUB_MANAGER_ROLE
            };

            if (this.info.role == window.ClubRole.E_CLUB_MANAGER_ROLE) {
                data.role = window.ClubRole.E_CLUB_NORMAL_ROLE;
            }
            cc.log("ClubMemberPermissionView Send Modify Role, data=", data);

            MessageFactory.createMessageReq(CLUB_REQ_OWNER_MODIFY_ROLE_CMD_ID).send(data);
        } else if (BtnName == "PermissionDelBg") {
            var data = {
                clubid: GamePlayer.getInstance().CurClubInfo.clubid,
                uid: this.info.uid
            };
            MessageFactory.createMessageReq(CLUB_REQ_OWNER_RM_MEMBER_CMD_ID).send(data);
        }
        this.dismiss();
    }
});