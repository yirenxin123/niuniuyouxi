'use strict';

/**
 * Created by shrimp on 17/3/1.
 */

window.BULLFIGHT_MAX_PLAYER = 6;

var Poker = require("Poker");
var Bullfight_CostomCardType = require('Bullfight_CostomCardType');
var GameScene = require('Bullfight_GameScene');

cc.Class({
    extends: cc.Component,

    properties: {
        CardNode: cc.Node,
        CardTypeNode: cc.Node,
        CardTypeBg: cc.Sprite,
        CardTypeBgFrame: [cc.SpriteFrame],
        CardTypeFlag: cc.Sprite,
        CardTypeFlagFrame: [cc.SpriteFrame],
        AllCard: [Poker],
        BetCountBg: cc.Sprite,
        BetCount: cc.Label,
        CustomCardType: Bullfight_CostomCardType
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.CardPos = new Array();
        for (var index = 0; index < this.AllCard.length; index++) {
            this.CardPos[index] = this.AllCard[index].node.position;
        }
    },

    sendCardAnimation: function sendCardAnimation(cardlist) {
        cc.log("Bullfight_CardLayout.sendCardAnimation,cardlist = " + cardlist);
        this.node.active = true;
        this.CardNode.active = true;

        for (var cardcount = 0; cardcount < 5 && !cc.game.isPaused(); cardcount++) {
            this.AllCard[cardcount].node.stopAllActions();
            this.AllCard[cardcount].position = this.CardPos[cardcount];
            this.AllCard[cardcount].initCard(cardlist[cardcount]);
            var winSize = cc.director.getWinSize();
            var endPos = this.CardPos[cardcount];
            var startPos = new cc.p(endPos.x - (endPos.x + this.CardNode.position.x + this.node.position.x), endPos.y - (endPos.y + this.CardNode.position.y + this.node.position.y));
            cc.log("startPos = " + startPos + ",endPos = " + endPos);
            this.AllCard[cardcount].node.runAction(cc.sequence(cc.moveTo(0, startPos), cc.delayTime(0.05 * cardcount), cc.moveTo(0.5, endPos)));
        }
    },

    openCardAnimation: function openCardAnimation(cardlist, index1, index2) {
        cc.log("Bullfight_CardLayout.openCardAnimation,cardlist = " + cardlist, " index1=", index1, " index2=", index2);
        this.node.active = true;
        this.CardNode.active = true;
        for (var cardcount = 0; cardcount < 5; cardcount++) {
            this.AllCard[cardcount].initCard(cardlist[cardcount]);
            this.AllCard[cardcount].runCardSelect(0);
            if (index1 != -1 && index2 != -1) {
                if (cardcount == index1 || cardcount == index2) {
                    cc.log("Bullfight_CardLayout.openCardAnimation, cardcount=", cardcount);
                    this.AllCard[cardcount].runCardSelect(1);
                }
            }
        }
    },

    setCardType: function setCardType(cardType) {
        cc.log("Bullfight_CardLayout.setCardType,cardType = " + cardType);
        this.node.active = true;
        this.CardTypeNode.active = true;
        // if (cardType == Bullfight_CardType.E_BULL_ZERO)
        // {
        //     this.CardTypeBg.spriteFrame = this.CardTypeBgFrame[0];
        // }
        // else
        // {
        //     this.CardTypeBg.spriteFrame = this.CardTypeBgFrame[1];
        // }
        this.CardTypeFlag.spriteFrame = this.CardTypeFlagFrame[cardType];
        this.CardTypeBg.spriteFrame = this.CardTypeBgFrame[1];
    },

    clearCardItem: function clearCardItem() {
        this.CardNode.active = false;
        this.CardTypeNode.active = false;
        this.node.active = false;
        this.BetCountBg.node.active = false;
        for (var cardcount = 0; cardcount < 5; cardcount++) {
            this.AllCard[cardcount].runCardSelect(false);
        }
        if (this.CustomCardType != null) {
            this.CustomCardType.clearCustomCardType();
        }
    },

    setPlayerBetCount: function setPlayerBetCount(count) {
        this.node.active = true;
        this.BetCountBg.node.active = true;
        this.BetCount.string = count;
    },

    setCustomCardType: function setCustomCardType(active) {
        this.CustomCardType.node.active = active;
        if (active) {
            this.CustomCardType.initData();
        } else {
            this.CustomCardType.clearCustomCardType();
            // for(var cardcount = 0;cardcount < 5;cardcount++)
            // {
            //     this.AllCard[cardcount].runCardSelect(false);
            // }
        }
    }
});