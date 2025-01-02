'use strict';

/**
 * Created by lixiaofei on 17/3/12.
 */
var GameCallOC = require('GameCallOC');
var LoadingView = require('LoadingView');
var HttpManager = require('HttpManager');
var Platform = require('Platform');
var GamePlayer = require('GamePlayer');
var SocketManager = require('SocketManager');

function wxApi() {}

wxApi.prototype.sendWeChatLogin = function () {
	cc.log("wxApi.prototype.sendTextContent ");
	if (cc.sys.platform == cc.sys.ANDROID) {
		SocialUtils.loginWeixin();
	} else {
		if (cc.sys.isNative && GameCallOC.getInstance().checkIsAble()) {
			var ret = jsb.reflection.callStaticMethod("LocalInfo", "sendWeChatLogin");
			cc.log("ret:%s", ret);
			return ret;
		}
	}
};

wxApi.prototype.sendTextContent = function (type, string, url) {
	cc.log("wxApi.prototype.sendTextContent ");
	if (cc.sys.isNative && GameCallOC.getInstance().checkIsAble()) {
		var ret = jsb.reflection.callStaticMethod("LocalInfo", "sendTextContent:desc:url:", type, string, url);
		cc.log("ret:%s", ret);
		return ret;
	}
};

wxApi.prototype.sendImageContent = function (type, string, url) {
	cc.log("wxApi.prototype.sendImageContent ");
	if (cc.sys.isNative && GameCallOC.getInstance().checkIsAble()) {
		var ret = jsb.reflection.callStaticMethod("LocalInfo", "sendImageContent:desc:url:", type, string, url);
		cc.log("ret:%s", ret);
		return ret;
	}
};

wxApi.prototype.sendLinkContent = function (type, string, url) {
	cc.log("wxApi.prototype.sendLinkContent " + type + "," + string + "," + url);
	if (cc.sys.isNative && GameCallOC.getInstance().checkIsAble()) {
		var ret = jsb.reflection.callStaticMethod("LocalInfo", "sendLinkContent:desc:url:", type, string, url);
		cc.log("ret:%s", ret);
		return ret;
	}
};

wxApi.prototype.sendAppContent = function (type, string, url) {
	cc.log("wxApi.prototype.sendAppContent " + type + "," + string + "," + url);
	if (cc.sys.isNative && GameCallOC.getInstance().checkIsAble()) {
		var ret = jsb.reflection.callStaticMethod("LocalInfo", "sendAppContent:desc:url:", type, string, url);
		cc.log("ret:%s", ret);
		return ret;
	}
};

wxApi.prototype.clearWeChatLogin = function () {
	cc.log("wxApi.prototype.clearWeChatLogin ");
	if (cc.sys.isNative && GameCallOC.getInstance().checkIsAble()) {
		var ret = jsb.reflection.callStaticMethod("LocalInfo", "clearWeChatLogin");
		cc.log("ret:%s", ret);
		return ret;
	}
};

wxApi.prototype.weChatPay = function (goodid, openid) {
	cc.log("wxApi.prototype.weChatPay, goodid=" + goodid + ", openid=" + openid);
	if (cc.sys.platform == cc.sys.ANDROID) {
		WeChatApi.getInstance().weChatPayForAndroid(goodid, openid);
	} else {
		if (cc.sys.isNative && GameCallOC.getInstance().checkIsAble()) {
			var ret = jsb.reflection.callStaticMethod("LocalInfo", "weChatPay:openid:", goodid, openid);
			cc.log("ret:%s", ret);
			return ret;
		}
	}
};

wxApi.prototype.weChatPayForAndroid = function (goodid, uid) {
	cc.log("weChatPayForAndroid, gooid=" + goodid + ', uid=' + uid);
	var url = "http://manage.aqddp.cn/wxpay/example/pay.php?good_id=" + goodid + "&openid=" + uid;
	var xhr = cc.loader.getXMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status <= 207) {
			var data = JSON.parse(xhr.responseText);
			if (data["code"] == 0) {
				var order_num = data['order']['order_num'];
				var appid = data['order']['appid'];
				var partnerId = data['order']['orderinfo']['partnerId'];
				var prepayId = data['order']['orderinfo']['prepayId'];
				var nonceStr = data['order']['orderinfo']['nonceStr'];
				var timeStamp = data['order']['orderinfo']['timeStamp'];
				var sign = data['order']['orderinfo']['sign'];
				//var packageName = data['order']['orderinfo']['package'];

				cc.log("appid=" + appid);
				cc.log("partnerId=" + partnerId);
				cc.log("prepayId=" + prepayId);
				cc.log("nonceStr=" + nonceStr);
				cc.log("timeStamp=" + timeStamp);
				cc.log("sign=" + sign);

				SocialUtils.payWeixin(partnerId, prepayId, nonceStr, timeStamp, sign);
			} else {
				cc.error("error code=" + data["code"]);
			}
		} else {
			console.log("error readyState=" + xhr.readyState);
		}
	}.bind(this);
	xhr.ontimeout = function (e) {
		console.log("timeout");
	};
	xhr.onerror = function () {
		console.log("error");
	};
	xhr.send();
};

wxApi.prototype.wxLoginSuccess = function (openid, unionid, name, headimgurl, sex) {
	GamePlayer.getInstance().unionid = unionid;
	GamePlayer.getInstance().openid = openid;
	GamePlayer.getInstance().name = name;
	GamePlayer.getInstance().headurl = headimgurl + ".png";
	GamePlayer.getInstance().sex = Number(sex);
	//GameCallOC.getInstance().SetAppInfo(unionid);
	SocketManager.getInstance().startSocket();
};

wxApi.prototype.wxGetCode = function (success, code) {
	cc.log("onGetCode, success=" + success + ", code=" + code);
	var url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxd0d94b9ff6c2894d&secret=6a3b706a62833ae8c46158c01e2ee0db&code=" + code + "&grant_type=authorization_code";
	var xhr = cc.loader.getXMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status <= 207) {
			console.log("xhr.responseText=" + xhr.responseText);

			var data = JSON.parse(xhr.responseText);

			var access_token = data['access_token'];
			var openid = data['openid'];
			var unionid = data['unionid'];

			cc.log("access_token=" + access_token);
			cc.log("openid=" + openid);
			cc.log("unionid=" + unionid);

			var info_url = "https://api.weixin.qq.com/sns/userinfo?access_token=" + access_token + "&openid=" + openid;
			var xhr2 = cc.loader.getXMLHttpRequest();
			xhr2.open("GET", info_url, true);
			xhr2.onreadystatechange = function () {
				if (xhr2.readyState == 4 && xhr2.status >= 200 && xhr2.status <= 207) {
					cc.log("xhr2.responseText=" + xhr2.responseText);
					var data2 = JSON.parse(xhr2.responseText);
					//todo. 做提示
					if (data2["nickname"] == undefined || data2['headimgurl'] == undefined) {
						cc.error("error");
						return;
					}
					WeChatApi.getInstance().wxLoginSuccess(openid, unionid, data2['nickname'], data2['headimgurl'], data2['sex']);
				} else {}
			}.bind(this);
			xhr2.ontimeout = function (e) {
				console.log("timeout");
			};
			xhr2.onerror = function () {
				console.log("error");
			};
			xhr2.send();
		} else {
			console.log("error readyState=" + xhr.readyState);
		}
	}.bind(this);
	xhr.ontimeout = function (e) {
		console.log("timeout");
	};
	xhr.onerror = function () {
		console.log("error");
	};
	xhr.send();
};

//开始进行微信支付
wxApi.prototype.onWXPay = function () {
	cc.log("onWXPay");
};

//微信支付回调
wxApi.prototype.onWXPayResponse = function (code) {
	cc.log("onWXPayResponse, code=" + code);
};

var WeChatApi = function () {
	var instance;

	function getInstance() {
		if (instance === undefined) {
			instance = new wxApi();
		}
		return instance;
	};

	return {
		getInstance: getInstance
	};
}();

module.exports = WeChatApi;