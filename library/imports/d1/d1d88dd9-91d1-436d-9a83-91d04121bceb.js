'use strict';

var BasePop = require('BasePop');
var GamePlayer = require('GamePlayer');
var AlertView = require('AlertView');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require('GameSystem');
var GameCallOC = require('GameCallOC');
var ToastView = require('ToastView');
cc.Class({
    extends: BasePop,

    properties: {
        // ...
        UserNick: cc.Label,
        UserHead: cc.Sprite,
        UserSex: cc.Sprite,
        SexSpriteFrame: [cc.SpriteFrame],
        UidLable: cc.Label,
        Diamond: cc.Label,
        Gold: cc.Label,
        MessageView: cc.Prefab,
        RedTips: cc.Sprite,
        ClubView: cc.Prefab,
        SuccessView: cc.Prefab,
        ShareView: cc.Prefab,
        SettingView: cc.Prefab,
        NoticeView: cc.Prefab,
        ShopView: cc.Prefab,
        BtnShare: cc.Node,
        ReferralCodeView: cc.Prefab,
        BtnNode: [cc.Node],
        RoomCardCount: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.initBaseData();
        this.RedTips.node.active = GameSystem.getInstance().NewMsgNum;
    },

    initBaseData: function initBaseData() {
        this.UserNick.string = GamePlayer.getInstance().name;
        this.UidLable.string = GamePlayer.getInstance().uid;
        this.Diamond.string = GamePlayer.getInstance().diamond;
        this.Gold.string = GamePlayer.getInstance().gold;
        this.RoomCardCount.strng = GamePlayer.getInstance().roomcard;
        UpdateWXHeadIcon(GamePlayer.getInstance().headurl, this.UserHead);
        this.UserSex.spriteFrame = this.UserSex[GamePlayer.getInstance().sex];

        if (GameSystem.getInstance().VerStatus == GameSystem.getInstance().VerStatusType.VERSION_TYPE_AUDIT && GameCallOC.getInstance().checkIsAble()) {
            this.BtnNode[0].active = false;
            this.BtnNode[1].active = true;
        } else {
            this.BtnNode[1].active = false;
            this.BtnNode[0].active = true;
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    callbackBtn: function callbackBtn(event, CustomEventData) {
        cc.log("MineView.callbackBtn,CustomEventData = " + CustomEventData);
        var btnName = event.target.getName();
        cc.log("MineView.callbackBtn,btnName = " + btnName);
        var winSize = cc.director.getWinSize();
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if (btnName == "BtnMessage") {
            var messageView = cc.instantiate(this.MessageView);
            cc.director.getScene().addChild(messageView);
            messageView.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
        } else if (btnName == "BtnClue") {
            var clubView = cc.instantiate(this.ClubView);
            cc.director.getScene().addChild(clubView);
            clubView.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
        } else if (btnName == "BtnSuccess") {
            var successView = cc.instantiate(this.SuccessView);
            cc.director.getScene().addChild(successView);
            successView.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
        } else if (btnName == "BtnShare") {
            if (GameSystem.getInstance().VerStatus == GameSystem.getInstance().VerStatusType.VERSION_TYPE_AUDIT) {
                ToastView.show("功能暂未开放");
                return;
            }

            var shareView = cc.instantiate(this.ShareView);
            cc.director.getScene().addChild(shareView);
            shareView.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
            var string = "我正在玩游戏［" + GameCallOC.getInstance().getAppName() + "］,快点一起来玩吧！！！";
            shareView.getComponent("ShareView").setShareTyep(ShareType.E_SHARETYPE_LINK, string, GameSystem.getInstance().clienturl);
        } else if (btnName == "BtnService") {
            var alertExit = AlertView.create();
            alertExit.showOne(GameSystem.getInstance().weixincs, AlertViewBtnType.E_BTN_CLOSE);
            // var serviceView = cc.instantiate(this.ServiceView);
            // cc.director.getScene().addChild(serviceView);
            // serviceView.setPosition(cc.p(winSize.width/2,winSize.height/2));
        } else if (btnName == "BtnNotice") {
            var noticeView = cc.instantiate(this.NoticeView);
            cc.director.getScene().addChild(noticeView);
            noticeView.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
            noticeView.getComponent('NoticeView').setContent();
        } else if (btnName == "BtnSetting") {
            var settingView = cc.instantiate(this.SettingView);
            cc.director.getScene().addChild(settingView);
            settingView.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
            this.dismiss();
        } else if (btnName == "BtnMineInfo") {
            var shopView = cc.instantiate(this.ShopView);
            cc.director.getScene().addChild(shopView);
            shopView.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
        } else if (btnName == "BtnCode") {
            if (GameSystem.getInstance().referralCode != 0) {

                var self = this;
                var alert = AlertView.create();
                alert.setPositiveButton(function () {
                    // self.createReferralCodeView();
                }, "确定");

                var str = "您已经绑定了推广码:" + GameSystem.getInstance().referralCode;
                alert.show(str, AlertViewBtnType.E_BTN_CLOSE);
                return;
            }
            var referralCodeView = cc.instantiate(this.ReferralCodeView);
            cc.director.getScene().addChild(referralCodeView);
            referralCodeView.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
        }
    }

});