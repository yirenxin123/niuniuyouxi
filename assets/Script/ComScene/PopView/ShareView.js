var BasePop = require('BasePop');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var WeChatApi = require("WeChatApi");
var GameSystem = require("GameSystem");

window.ShareType = cc.Enum({
    E_SHARETYPE_STRING : 1,
    E_SHARETYPE_IMAGE : 2,
    E_SHARETYPE_LINK : 3,
    E_SHARETYPE_APP : 4
});

cc.Class({
    extends: BasePop,

    properties: {
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        this.initBaseData();
    },
    
    initBaseData : function () {
        this.ShareString = "";
        this.ImagePath = "";
        this.Url = "";
        this.ShareType = ShareType.E_SHARETYPE_STRING;
    },

    callbackBtn : function(event,CustomEventData)
    {
        cc.log("ShareView.callbackBtn,CustomEventData = " + CustomEventData);
        var btnName = event.target.getName();
        cc.log("ShareView.callbackBtn,btnName = " + btnName);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if(btnName == "BtnClose") {
            this.dismiss();
        }
        else if(btnName == "BtnFriends") {
            this.ShareCallBack(1);
            this.dismiss();
        }
        else if(btnName == "BtnWechat") {
            this.ShareCallBack(0);
            this.dismiss();
        }
    },
    
    setShareTyep : function (type,str,url) {
        this.ShareType = type;
        this.ShareString = str;
        this.ImagePath = str;
        this.Url = url;
    },

    
    ShareCallBack : function (type) {

	    cc.log("ShareCallBack, type=" + type + ', ShareString=' + this.ShareString + ", url=" + this.Url + ", ShareType=" + this.ShareType);

        if(this.ShareType == ShareType.E_SHARETYPE_STRING)
        {
	        if(cc.sys.platform == cc.sys.ANDROID){
				SocialUtils.shareToWeixin(0, "51牛友会", this.ShareString, this.Url);
	        }else{
		        WeChatApi.getInstance().sendTextContent(type,this.ShareString, this.Url);
	        }
        }
        else if(this.ShareType == ShareType.E_SHARETYPE_IMAGE)
        {
	        if(cc.sys.platform == cc.sys.ANDROID){
		        SocialUtils.shareToWeixin(2, "51牛友会", this.ShareString, this.Url);
	        }else {
		        WeChatApi.getInstance().sendImageContent(type, this.ImagePath, this.Url);
	        }
        }
        else if(this.ShareType == ShareType.E_SHARETYPE_LINK)
        {
	        if(cc.sys.platform == cc.sys.ANDROID){
		        SocialUtils.shareToWeixin(0, "51牛友会", this.ShareString, this.Url);
	        }else {
		        WeChatApi.getInstance().sendLinkContent(type, this.ShareString, this.Url);
	        }
        }
        else if(this.ShareType == ShareType.E_SHARETYPE_APP)
        {
	        if(cc.sys.platform == cc.sys.ANDROID){
		        SocialUtils.shareToWeixin(type, "51牛友会", this.ShareString, this.Url);
	        }else {
		        WeChatApi.getInstance().sendAppContent(type, this.ShareString, this.Url);
	        }
        }
    }
    
});
