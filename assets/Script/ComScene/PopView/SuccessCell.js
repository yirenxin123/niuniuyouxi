var UtilTool = require('UtilTool');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require("GameSystem");
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
        dayLabel : cc.Label,
        monthLabel : cc.Label,
        timeLabel : cc.Label,
        RoomName : cc.Label,
        UserName : cc.Label,
        CarryCoin : cc.Label,
        RoomTime : cc.Label,
        WinScore : cc.Label,
        Head : cc.Sprite,
    },

    // use this for initialization
    onLoad: function () {
        this.msg = null;
    },

    setCellInfo : function (msg) {

        this.msg = msg;
        var newDate = new Date();
        newDate.setTime(msg.createtime * 1000);

        this.dayLabel.string   = newDate.getDate() + "日";
        this.monthLabel.string = (newDate.getMonth() + 1) + "月";
        this.timeLabel.string  = UtilTool.getTimeData(newDate.getHours()) + ":" + UtilTool.getTimeData(newDate.getMinutes())
        this.RoomName.string   = msg.privateid + " (" + msg.tablename + ")";
        this.RoomName.fontSize = 40;
        this.UserName.string = msg.ownername;
        this.CarryCoin.string = "带入" + msg.carrycoin;
        if(msg.livetime < 1800)
        {
            this.RoomTime.string = (msg.livetime/60) + "分钟局";
        }
        else
        {
            this.RoomTime.string = (msg.livetime/3600) + "小时局";
        }
        UpdateWXHeadIcon(msg.headurl,this.Head);
        if(msg.wincoin > 0)
        {
            this.WinScore.string = "+" + msg.wincoin;
        }
        else if (msg.wincoin == 0) {
            this.WinScore.string = msg.wincoin;
            this.WinScore.node.color = new cc.Color(204, 160, 41, 255);
        }
        else
        {
            this.WinScore.string = msg.wincoin;
            this.WinScore.node.color = cc.Color.GREEN;//"#00FF00";
        }

    },
    
    callBackBtn : function (event,CustomEventData) {
    	MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
    },
    
});
