"use strict";

/**
 * Created by shrimp on 17/2/19.
 */

var HttpPacket = {

    encryptData: function encryptData(data) {
        data.sig = "5da567e4566c9362f83f2730f75asdasddsae13a9";
    },

    // 支付方式
    buildGetGameSwitch: function buildGetGameSwitch(data, tag) {
        var param = {};
        param.method = tag;
        param.productid = window.PRODUCT_ID;
        data.param = param;
        this.encryptData(data);
    }
};

module.exports = HttpPacket;