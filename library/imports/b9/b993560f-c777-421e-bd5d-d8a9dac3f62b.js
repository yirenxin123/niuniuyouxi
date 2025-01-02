'use strict';

var BasePop = require("BasePop");
var MessageFactory = require('MessageFactory');
var GamePlayer = require('GamePlayer');
var Bullfight_GameScene = require('Bullfight_GameScene');
var LoadingView = require('LoadingView');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require('GameSystem');

cc.Class({
    extends: BasePop,

    properties: {
        RuleView: cc.Prefab,
        OwnerView: cc.Prefab,
        OwnerIcon: cc.Sprite,
        OwnerText: cc.Label,
        BtnShare: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {

        this._super();
        var self = this;
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            cc.log("stop event");
            self.runOut();
        }.bind(this));
        this.initBaseData();

        cc.log("Bullfigth_Menu.onLoad bowner=" + GamePlayer.getInstance().bowner);
        if (GamePlayer.getInstance().bowner == 1 || GameSystem.getInstance().roomLevel == 2) {
            this.OwnerIcon.node.active = true;
            this.OwnerText.node.active = true;
        } else {
            this.OwnerIcon.node.active = false;
            this.OwnerText.node.active = false;
        }
        if (GameSystem.getInstance().VerStatus == GameSystem.getInstance().VerStatusType.VERSION_TYPE_AUDIT) {
            this.BtnShare.active = false;
            return;
        }
    },

    initBaseData: function initBaseData() {
        this.callBackCarry = null;
        this.tableRuleInfo = "";
    },

    setRuleInfo: function setRuleInfo(ruleInfo) {
        this.tableRuleInfo = ruleInfo;
    },

    callBackBtn: function callBackBtn(event, CustomEventData) {

        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);

        var btnName = event.target.getName();
        cc.log("Bullfight_Menu.callBackBtn,btnName = " + btnName);
        if (btnName == "BtnExit") {
            MessageFactory.createMessageReq(window.US_REQ_LEAVE_GAME_CMD_ID).send();
        } else if (btnName == "BtnStandUp") {
            LoadingView.show("正在站起...");
            var data = {
                status: 2,
                seatid: GamePlayer.getInstance().seatId
            };
            MessageFactory.createMessageReq(window.US_REQ_SIT_DOWN_CMD_ID).send(data);
        } else if (btnName == "BtnSupplement") {
            this.onCallBackCarry();
        } else if (btnName == "BtnOwner") {
            var OwnerView = cc.instantiate(this.OwnerView);
            cc.director.getScene().addChild(OwnerView);
            OwnerView.setPosition(cc.p(cc.director.getVisibleSize().width / 2, cc.director.getVisibleSize().height / 2));
        } else if (btnName == "BtnRule") {
            var ruleView = cc.instantiate(this.RuleView);
            cc.director.getScene().addChild(ruleView);
            ruleView.setPosition(cc.p(cc.director.getVisibleSize().width / 2, cc.director.getVisibleSize().height / 2));
        } else if (btnName == "BtnShare") {
            cc.log("Bullfight_Menu : BtnShare");
            var message = {
                popView: "Bullfight_Menu",
                btn: "BtnShare"
            };
            GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.SCENE_MSG, data: message });
        } else if (btnName == "BtnKickGame") {
            MessageFactory.createMessageReq(window.US_REQ_DISMISS_TABLE_CMD_ID).send();
        }
        this.dismiss();
    },

    setCallBackCarry: function setCallBackCarry(callback) {
        this.callBackCarry = callback;
    },

    onCallBackCarry: function onCallBackCarry() {

        if (this.callBackCarry) {
            this.callBackCarry();
            return;
        }
    },

    runOut: function runOut() {
        var callFunc = cc.callFunc(this.dismiss, this);
        this.node.runAction(cc.sequence(cc.moveBy(0.2, cc.p(0, 697)), callFunc));
    }
});