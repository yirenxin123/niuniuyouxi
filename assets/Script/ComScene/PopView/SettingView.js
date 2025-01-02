var BasePop = require("BasePop");
var MusicMgr = require("MusicMgr");
var Audio_Common = require("Audio_Common");
var WeChatApi = require('WeChatApi');
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
        MusicSwitch : cc.Toggle,
        EffectSwitch : cc.Toggle,
    },
    
    // use this for initialization
    onLoad: function () {
        cc.log('SettingView : onLoad');
        // this.node.on(cc.Node.EventType.TOUCH_START, function(event){
        //     cc.log("stop event");
        //     event.stopPropagation();
        // }.bind(this));
        
        //this.scaleTo(this.bg);

        this.MusicSwitch.isChecked = (MusicMgr.getMusicVolume() == 1);
        this.EffectSwitch.isChecked = (MusicMgr.getEffectVolume() == 1);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    
    callBackBtnMusic : function (toggle,CustomEventData) {
        var btnName = toggle.target.getName();
        cc.log("SettingView.callBackBtnMusic,btnName = " + btnName);
        var isCheck = toggle.isChecked;
        cc.log("SettingView.callBackBtnMusic,isCheck = " + isCheck);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if(CustomEventData == 1)
        {
            if(isCheck)
            {
                MusicMgr.setEffectsVolume(1);
            }
            else
            {
                MusicMgr.setEffectsVolume(0);
            }
        }
        else if(CustomEventData == 2)
        {
            if(isCheck)
            {
                MusicMgr.setMusicVolume(1);
            }
            else
            {
                MusicMgr.setMusicVolume(0);
            }
        }
        else if(CustomEventData == 3)
        {

        }
    },
    
    callbackBtnClose  : function()
    {
        cc.log('SettingView:callbackBtnClose') ;
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        this.dismiss();
    },

    callbackBtnAbout : function()
    {
        cc.log('SettingView:callbackBtnAbout') ;
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        //this.dismiss();
    },
    
    callbackBtnExitAccout : function()
    {
        cc.log('SettingView:callbackBtnExitAccout');
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        //cc.director.loadScene('HallScene');
        var message = {
            popView : "SettingView",
            btn : "BtnExitLogin",
        };
        GlobalEventManager.getInstance().emitEvent(window.SocketMessage,
            {tag:window.MessageType.SCENE_MSG, data:message}) ;
        WeChatApi.getInstance().clearWeChatLogin();
        this.dismiss();
    },
});
