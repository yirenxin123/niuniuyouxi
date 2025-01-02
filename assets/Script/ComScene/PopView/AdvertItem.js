var CusWebView = require('CusWebView');

cc.Class({
    extends: cc.Component,

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
        AdvertSprite : cc.Sprite,
        Url : '',
        webViewPrefab : cc.Prefab,
    },

    // use this for initialization
    onLoad: function () {

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    updateAdverItem : function (info) {
        this.Url = info.jumpurl;
        //this.getSpriteFrame2(info.pic)

        UpdateWXHeadIcon(info.pic,this.AdvertSprite);
        //UpdateWXHeadIcon("http://wx.qlogo.cn/mmopen/Po9mkm3Z42tolYpxUVpY6mvCmqalibOpcJ2jG3Qza5qgtibO1NLFNUF7icwCibxPicbGmkoiciaqKEIdvvveIBfEQqal8vkiavHIeqFT/0.png",this.AdvertSprite);
    },
    
    callBackBtn : function () {

        var message = {
            popView: "FindView",
            btn: "CallBackBtn",
            url : this.Url,
        };
        GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.SCENE_MSG, data: message });
        return;

        var WebView = cc.instantiate(this.webViewPrefab);
        cc.director.getScene().addChild(WebView);
        var winSize = cc.director.getWinSize();
        WebView.setPosition(cc.p(winSize.width/2,winSize.height/2));
        WebView.getComponent('CusWebView').setWebViewUrl(this.Url );
    },

    getSpriteFrame2:function (url,successCb,failureCb,target,otherSender) {
        //url = this.kyHelper + url;



        //cc.log(page1);

        var xhr = new XMLHttpRequest();

        var self = this;

        xhr.onreadystatechange = function () {
            if( xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                var response = xhr.responseText;

                var img = BASE64.decoder(response);


                //cc.log("img=", img);

                var text = new Uint8Array(response, 0, response.length);
                cc.log("text = " + text);

                var img = new Image();
                img.src = BASE64.decoder(response);
                cc.log("img.src = " + img.src);

                var texture = new cc.Texture2D();
                texture.initWithImage(img); //cc.Texture2D.SRC_ALPHA, 1, 1, cc.size(1080, 300));
                texture.handleLoadedTexture();

                var newframe = new cc.SpriteFrame(texture);
                self.AdvertSprite.spriteFrame = newframe;


                // if (successCb != null) {
                //     successCb.apply(target, [newframe, otherSender]);
                // }
            }
            else
            {
                // if(failureCb != null)
                // {
                //     failureCb.apply(target);
                // }
            }
        };

        xhr.timeout = 5000;
        xhr.open("GET", url,true);
        xhr.send();
    },
});
