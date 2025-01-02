var BasePop = require('BasePop');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GamePlayer = require('GamePlayer');
var ToastView = require('ToastView');
var GameSystem = require("GameSystem");

cc.Class({
    extends: BasePop,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        var self = this;
        this.node.on(cc.Node.EventType.TOUCH_END, function(event){
            cc.log("ClubAddView.onLoad : stop event");
            self.dismiss();
        }.bind(this));
    },

    callBackBtn : function (event , CustomEventData) {
        var BtnName = event.target.getName();
        cc.log("ClubAddView.callBackBtn,BtnName = " + BtnName);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if(BtnName == "NewClub")
        {
            if (GamePlayer.getInstance().SelfClubId > 0) {
                ToastView.show("您已经建立了一个俱乐部,目前不支持多个");
                this.dismiss();
                return;
            }

            var message = {
                popView: "ClubAddView",
                btn: "NewClub"
            };
            GlobalEventManager.getInstance().emitEvent(window.SocketMessage,
                    { tag: window.MessageType.SCENE_MSG, data: message });

        }
        else if(BtnName == "AddClub")
        {
            var message = {
                popView: "ClubAddView",
                btn: "AddClub"
            };
            GlobalEventManager.getInstance().emitEvent(window.SocketMessage,
                { tag: window.MessageType.SCENE_MSG, data: message });

        }
        this.dismiss();
    },



});
