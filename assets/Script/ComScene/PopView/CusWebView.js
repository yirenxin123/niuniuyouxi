var BasePop = require('BasePop');
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
        WebView : cc.WebView,
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        this.LeftInTo(this.node);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    
    calllbackBtn : function (event,CustonEventData) {
        var BtnName = event.target.getName();
        if(BtnName == "BtnClose")
        {
            this.dismiss();
        }
    },
    
    setWebViewUrl  :function (url) {
        this.WebView.url = url;
    }
});