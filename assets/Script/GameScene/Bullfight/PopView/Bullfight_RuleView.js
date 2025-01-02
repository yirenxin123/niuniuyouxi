var BasePop = require('BasePop');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem   = require('GameSystem');

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
    },

    onLoad: function () {
        var self = this;
        this.node.on(cc.Node.EventType.TOUCH_END, function(event){
            cc.log("stop event");
            MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
            self.dismiss();
        }.bind(this));
        this.runIn();
    },
    
    callBackBtn : function () {
        this.dismiss();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    runIn : function () {
        cc.log(this.bg.getContentSize().width);
        this.bg.runAction(cc.moveBy(0.4,cc.p(this.bg.getContentSize().width,0)));
    },
});
