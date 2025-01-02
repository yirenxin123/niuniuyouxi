'use strict';

var BasePop = require('BasePop');
var ToastView = require('ToastView');
var LoadingView = require('LoadingView');
var MessageFactory = require('MessageFactory');
var GameSystem = require('GameSystem');

cc.Class({
    extends: BasePop,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        ReferralCode: cc.EditBox
    },

    // use this for initialization
    onLoad: function onLoad() {},

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    callBackBtn: function callBackBtn(event, CustomEventData) {
        var BtnName = event.target.getName();
        cc.log("ReferralCodeView.callBackBtn,BtnName = " + BtnName);
        if (BtnName == "BtnClose") {
            this.dismiss();
        } else if (BtnName == "BtnSure") {
            cc.log('ReferralCodeView.callBackBtn,ReferralCode = ' + this.ReferralCode.string);
            if (this.ReferralCode.string == "") {
                ToastView.show('推荐码不能为空！');
                return;
            }

            var data = {
                referralid: Number(this.ReferralCode.string)
            };

            MessageFactory.createMessageReq(US_REQ_BIND_REFERRAL_CMD_ID).send(data);

            this.dismiss();
        }
    }
});