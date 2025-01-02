var BasePop = require('BasePop');
var MessageFactory = require('MessageFactory');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require("GameSystem");

cc.Class({
    extends: BasePop,

    properties: {
        SuccessCell  : cc.Prefab,
        scrollView   : cc.ScrollView,
        RoomInfoView : cc.Prefab,
    },

    // use this for initialization
    onLoad: function () {
        this._super();
        var data = {
            iscreate : 0,
            start : 0,
            total : 50,
        };
        MessageFactory.createMessageReq(window.US_REQ_SCORE_LIST_CMD_ID).send(data);
    },

    /*********************Network***************************/
    onMessage : function (event) {
        cc.log("SuccessView.onMessage");
        //this._super(event);
        var msg = event.data;
        var cmd = msg.cmd;
        switch (cmd) {
            case US_RESP_SCORE_LIST_CMD_ID:
                this.onScoreListMsg(msg);
                break;
        }
    },

    onScoreListMsg : function (msg) {
        if(msg.code == SocketRetCode.RET_SUCCESS)
        {
            let cellHeight = 0;
            for (var index = 0; msg.list != null && index < msg.list.length; index++)
            {
                var SuccessCell = cc.instantiate(this.SuccessCell);
                this.scrollView.content.addChild(SuccessCell);

                cellHeight = SuccessCell.getContentSize().height;

                SuccessCell.setPosition(cc.p(0,0 - SuccessCell.getContentSize().height*(index + 0.5)));
                SuccessCell.getComponent("SuccessCell").setCellInfo(msg.list[index]);

                var self = this;
                SuccessCell.on(cc.Node.EventType.TOUCH_END, function(event){
                    self.createSuccessCellView(event.target.getComponent("SuccessCell").msg);
                }.bind(this));
            }

            let childCount = this.scrollView.content.getChildrenCount() + 1;
            if (cellHeight * childCount > this.scrollView.content.height) {
                this.scrollView.content.height = cellHeight * childCount;
            }
        }
    },

    createSuccessCellView : function (msg) {
        var RoomInfoView = cc.instantiate(this.RoomInfoView);
        cc.director.getScene().addChild(RoomInfoView);
        var winSize = cc.director.getWinSize();
        RoomInfoView.setPosition(cc.p(winSize.width/2,winSize.height/2));
        RoomInfoView.getComponent('RoomInfoView').sendGetSuccessDetail(msg);
    },
    
    
    callbackBtn : function(event,CustomEventData)
    {
        var btnName = event.target.getName();
        cc.log("SuccessView.callbackBtn,btnName = " + btnName);
        var winSize = cc.director.getWinSize();
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if(btnName == "BtnClose")
        {
            this.dismiss();
        }
    },
    
    callbackToggle : function (toggle,CustomEventData) {
    	MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        this.scrollView.content.removeAllChildren(true);
        var data = {
            iscreate : Number(CustomEventData),
            start : 0,
            total : 20,
        };
        MessageFactory.createMessageReq(window.US_REQ_SCORE_LIST_CMD_ID).send(data);
    },
});
