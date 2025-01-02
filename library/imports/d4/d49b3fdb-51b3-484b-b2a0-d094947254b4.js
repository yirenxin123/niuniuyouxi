'use strict';

var BasePop = require('BasePop');
var MessageFactory = require('MessageFactory');
var ToastView = require('ToastView');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require("GameSystem");

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
        AreaView: cc.Prefab,
        AreaString: cc.Label,
        ClubName: cc.EditBox
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._super();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    onSceneMsg: function onSceneMsg(event) {
        var msg = event.data;

        if (msg.popView == "ClubAreaView") {
            if (msg.btn == "ClubAreaCell") {
                this.AreaString.string = msg.area;
                //cc.director.loadScene("LoadingScene");
            }
        }
    },

    callBackBtn: function callBackBtn(event, CustomEventData) {
        var BtnName = event.target.getName();
        cc.log('ClubCreateView.callBackBtn,BtnName = ' + BtnName);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if (BtnName == "BtnCreate") {
            if (this.AreaString.string == "" || this.ClubName.string == "") {
                ToastView.show("俱乐部名字或地址不能为空");
                return;
            }
            var data = {
                name: this.ClubName.string,
                headurl: "",
                address: this.AreaString.string,
                level: 1,
                intro: ""
            };
            MessageFactory.createMessageReq(window.US_REQ_CREATE_CLUB_CMD_ID).send(data);
            this.dismiss();
        } else if (BtnName == "BtnClose") {
            this.dismiss();
        } else if (BtnName == "BtnPosition") {
            var AreaView = cc.instantiate(this.AreaView);
            this.node.addChild(AreaView);
            AreaView.setPosition(cc.p(0, 0));
        }
    }
});