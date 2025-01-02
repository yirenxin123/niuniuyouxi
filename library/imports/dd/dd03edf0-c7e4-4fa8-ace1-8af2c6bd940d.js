"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        InfoLabel: [cc.Label]
    },

    // use this for initialization
    onLoad: function onLoad() {},

    updatePlayerScore: function updatePlayerScore(text0, text1, text2, text3, size) {
        this.InfoLabel[0].string = text0;
        this.InfoLabel[1].string = text1;
        this.InfoLabel[2].string = text2;

        var winCoin = Number(text3);
        if (winCoin > 0) {
            this.InfoLabel[3].string = "+" + winCoin;
            this.InfoLabel[3].node.color = cc.Color.RED;
        } else if (winCoin == 0) {
            this.InfoLabel[3].string = winCoin;
            this.InfoLabel[3].node.color = new cc.Color(204, 160, 41, 255);
        } else {
            this.InfoLabel[3].string = winCoin;
            this.InfoLabel[3].node.color = cc.Color.GREEN;
        }
    },

    updatePlayerScoreCell: function updatePlayerScoreCell(text1, text2, text3, size) {
        this.InfoLabel[0].string = text1;
        this.InfoLabel[1].string = text2;

        var winCoin = Number(text3);
        if (winCoin > 0) {
            this.InfoLabel[2].string = "+" + winCoin;
            this.InfoLabel[2].node.color = cc.Color.RED;
        } else if (winCoin == 0) {
            this.InfoLabel[2].string = winCoin;
            this.InfoLabel[2].node.color = new cc.Color(204, 160, 41, 255);
        } else {
            this.InfoLabel[2].string = winCoin;
            this.InfoLabel[2].node.color = cc.Color.GREEN;
        }

        this.InfoLabel[3].string = Number(text2) + Number(text3);

        for (var i = 0; i <= this.InfoLabel.length; i++) {
            this.InfoLabel[i].fontSize = size;
        }
    }
});