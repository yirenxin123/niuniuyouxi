'use strict';

var BasePop = require('BasePop');
var MessageFactory = require('MessageFactory');
var Cmd_Bullfight = require('Cmd_Bullfight');
var GamePlayer = require('GamePlayer');

cc.Class({
    extends: BasePop,

    properties: {

        ScrollActors: cc.ScrollView,
        //ScrollWatchers : cc.ScrollView,

        PlayerCell: cc.Prefab,
        TouristCell: cc.Prefab,
        WatcherTitle: cc.Node,
        ActorTitle: cc.Node,
        WatcherCount: cc.Label,
        RoundNum: cc.Label,
        timeLabel: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {
        var self = this;
        this._super();
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            cc.log("stop event");
            self.dismiss();
        }.bind(this));
        this.runIn();
        MessageFactory.createMessageReq(Cmd_Bullfight.US_REQ_PLAYER_LIST_CMD_ID).send();
    },

    /*********************Network***************************/

    onMessage: function onMessage(event) {
        cc.log("Bullfight_PlayerList.onMessage");
        //this._super(event);
        var msg = event.data;
        var cmd = msg.cmd;
        switch (cmd) {
            case Cmd_Bullfight.US_RESP_PLAYER_LIST_CMD_ID:
                this.onGetPlayersList(msg);
                break;
        }
    },

    onGetPlayersList: function onGetPlayersList(msg) {
        cc.log("Bullfight_PlayerList.onGetPlayersList");
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            this.setTableInfo(msg.remainTime, msg.roundNum);
            var height = 0;

            height = this.refreshActors(msg.actors);
            height = this.refreshWatchers(msg.watchers, height);

            if (height > this.ScrollActors.content.height) {
                this.ScrollActors.content.height = height;
            }
        }
    },

    /*
    * //参与者信息
     type ACTOR_T struct {
     Uid       uint32 `json:"uid"`
     Name      string `json:"name"`
     HeadUrl   string `json:"headurl"`
     TotalCoin int64  `json:"total"` //总带入金币
     WinCoin   int64  `json:"win"`   //输赢多少金币
     }
    * */
    refreshActors: function refreshActors(actors) {

        cc.log("Bullfight_PlayerList.refreshActors");
        var totalHeight = 100;

        this.ActorTitle.active = true;

        if (actors) {
            var actorsHeight = 0;
            for (var index = 0; actors && index < actors.length; index++) {
                var item = cc.instantiate(this.PlayerCell);
                actorsHeight = item.getContentSize().height;
                item.setPosition(cc.p(0, -index * item.getContentSize().height - item.getContentSize().height * 1.5));
                this.ScrollActors.content.addChild(item);

                var coin = actors[index].total + actors[index].win;
                item.getComponent("Bullfight_PlayerCell").updatePlayerScore(actors[index].name, actors[index].total, coin, actors[index].win);
            }

            totalHeight += (actors && actors.length > 0 ? this.ActorTitle.getContentSize(true).height : 0) + actors.length * actorsHeight;
        }

        return totalHeight;
    },

    /*
    *  //看客信息
     type WATCHER_T struct {
     Uid     uint32 `json:"uid"`
     Name    string `json:"name"`
     HeadUrl string `json:"headurl"`
     }
    * */
    refreshWatchers: function refreshWatchers(watchers, totalHeight) {
        cc.log("Bullfight_PlayerList.refreshWatchers,totalHeight = " + totalHeight);
        this.WatcherTitle.position = cc.p(this.WatcherTitle.position.x, this.WatcherTitle.position.y - totalHeight);
        this.WatcherTitle.active = true;
        this.WatcherCount.string = watchers.length;

        var watcherHeight = 0;
        for (var index = 0; watchers && index < watchers.length; index++) {
            var item = cc.instantiate(this.TouristCell);
            watcherHeight = item.getContentSize().height;

            item.setPosition(cc.p(item.getContentSize().width / 2 + index % 3 * item.getContentSize().width - this.ScrollActors.content.getContentSize(true).width / 2, -totalHeight - item.getContentSize().height * parseInt(index / 3) - item.getContentSize().height / 2 - (this.WatcherTitle.getContentSize().height + 5)));

            this.ScrollActors.content.addChild(item);
            item.getComponent("Bullfight_Tourist").updateInfo(watchers[index].headurl, watchers[index].name);
        }

        totalHeight += this.WatcherTitle.getContentSize().height;
        if (watchers) {
            totalHeight += (watchers.length + 1) * watcherHeight;
        }
        return totalHeight;
    },

    setTableInfo: function setTableInfo(time, roundNum) {

        this.RoundNum.string = "第" + roundNum + "手";
        this.timeLabel.string = this.getTime(time);
    },

    getTime: function getTime(vTime) {
        var time = Number(vTime);
        var hour = parseInt(time / 60 / 60);
        var min = parseInt((time - 3600 * hour) / 60);
        var second = time - 3600 * hour - 60 * min;

        cc.log("getTime hour=", hour, " min=", min, " second=", second);

        return this.getTimeData(hour) + ":" + this.getTimeData(min) + ":" + this.getTimeData(second);
    },

    getTimeData: function getTimeData(time) {
        return (Array(2).join(0) + time).slice(-2);
    },

    runIn: function runIn() {
        this.bg.runAction(cc.moveBy(0.4, cc.p(this.bg.getContentSize().width, 0)));
    }
});