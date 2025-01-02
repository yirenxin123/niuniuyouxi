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
        Time : cc.Label,
        VoiceValue : cc.Sprite,
        VoiceValueFrame : [cc.SpriteFrame],
    },

    // use this for initialization
    onLoad: function () {
        this.time = 0;
        this.setTime(0);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    
    setTime : function (time) {
        this.time = time;
        this.schedule(this.updateTime,1);
    },

    updateTime : function () {
        this.time++;
        if(this.time < 0)
        {
            this.unschedule(this.updateTime);
            this.dismiss();
        }
        this.Time.string = this.time + '"';
        this.updateVoiceValue();


        if (this.time > 30)
        {
            this.dismiss();
        }
    },
    
    updateVoiceValue : function () {
        this.VoiceValue.spriteFrame = this.VoiceValueFrame[this.time%3];
    },
    
    dismiss : function () {
        var message = {
            popView : "VoicePlayView",
            btn : "dismiss"
        };
        GlobalEventManager.getInstance().emitEvent(window.SocketMessage,
            {tag:window.MessageType.SCENE_MSG,data:message}) ;
        this.unschedule(this.updateTime);
        this.node.removeFromParent(true);
    },
});
