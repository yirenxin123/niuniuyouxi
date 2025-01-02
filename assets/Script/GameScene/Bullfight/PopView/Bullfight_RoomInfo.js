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
        RoomInfo : [cc.Label],
        RoomMult : [cc.Label],
        RootNode : cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        this.node.on(cc.Node.EventType.TOUCH_END, function(event){
            cc.log("stop event");
            self.dismiss();
            MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        }.bind(this));
        this.runIn();
    },
    
    runIn : function () {
        this.bg.runAction(cc.moveBy(0.4,cc.p(this.bg.getContentSize().width,0)));
    },

    setRoomInfo : function(tableRuleInfo)
    {
        if(tableRuleInfo.gametype == 1)
        {
            this.RoomInfo[1].string = "闭牌抢庄";
        }
        else
        {
            this.RoomInfo[1].string = "三张抢庄";
        }

        this.RoomInfo[2].string = tableRuleInfo.minante;
        if(tableRuleInfo.livetime < 1800)
        {
            this.RoomInfo[3].string = tableRuleInfo.livetime/60 + "分钟";
        }
        else
        {
            this.RoomInfo[3].string = tableRuleInfo.livetime/3600 + "小时";
        }

        this.RoomInfo[4].string = tableRuleInfo.seats;

        for(var index = 0;index < this.RoomMult.length;index++)
        {
            this.RoomMult[index].string = tableRuleInfo.bullmul[index];
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
