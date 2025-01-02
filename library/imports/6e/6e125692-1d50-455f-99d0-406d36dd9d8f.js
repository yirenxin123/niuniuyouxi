"use strict";

/**
 * Created by shrimp on 17/3/30.
 */

var MessageResp = require("MessageResp");

/*
 * type US_RESP_SHOP_CONF_T struct {
 JsonHead
 RespHead
 Param PARAM_SHOP_CONF_T `json:"param"`
 }
 type PARAM_SHOP_CONF_T struct {
 GoldList    []SHOP_CONF_T `json:"goldlist"`
 DiamondList []SHOP_CONF_T `json:"diamondlist"`
 }
 type SHOP_CONF_T struct {
 Type uint8  `json:"type"`
 Prop uint32 `json:"prop"` //商品,如购买福袋,获得620金币
 Cost uint32 `json:"cost"` //消耗,如购买福袋,消耗钻石;购买钻石,消耗money
 Name string `json:"name"` //商品名称
 Desc string `json:"desc"` //描述,用于道具
 }

 //金币道具
 const (
 E_GOLD_TYPE_1 = 1 //福袋
 E_GOLD_TYPE_2 = 2 //聚宝盆
 E_GOLD_TYPE_3 = 3 //财神爷
 )

 //钻石道具
 const (
 E_DIAMOND_TYPE_1 = 1
 E_DIAMOND_TYPE_2=2
 E_DIAMOND_TYPE_3=3
 E_DIAMOND_TYPE_4=4
 E_DIAMOND_TYPE_5=5
 E_DIAMOND_TYPE_6=6
 )
 */

function ShopConfRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_SHOP_CONF_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.param = msg.param;
        this.goldlist = this.param.goldlist;
        this.diamondlist = this.param.diamondlist;
    };
}

module.exports = ShopConfRespPacket;