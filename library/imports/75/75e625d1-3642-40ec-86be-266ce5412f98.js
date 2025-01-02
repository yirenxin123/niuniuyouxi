'use strict';

/**
 * Created by shrimp on 17/3/7.
 */
//这个获取的数据 都转发出去

var MessageFactory = require('MessageFactory');
var GameSystem = require('GameSystem');
var LoadingView = require('LoadingView');

function JSCallOC() {}

//检查是否可用
JSCallOC.prototype.checkIsAble = function () {
    var state = cc.sys.platform == cc.sys.IPHONE || cc.sys.platform == cc.sys.IPAD || cc.sys.platform == cc.sys.MOBILE_BROWSER || cc.sys.platform == cc.sys.DESKTOP_BROWSER;
    return state;
};

JSCallOC.prototype.checkAndroid = function () {
    return cc.sys.platform == cc.sys.ANDROID;
};

JSCallOC.prototype.getDeviceName = function () {
    if (cc.sys.isNative && this.checkIsAble()) {
        var name = jsb.reflection.callStaticMethod("LocalInfo", "getDeviceName");
        cc.log("getDeviceName:%s", name);
        return name;
    } else if (this.checkAndroid()) {
        return "web";
    } else {
        return "web";
    }
};

JSCallOC.prototype.getAppVersionCode = function () {
    if (cc.sys.isNative && this.checkIsAble()) {
        var appVersion = jsb.reflection.callStaticMethod("LocalInfo", "getAppVersionCode");
        cc.log("getAppVersionCode:%s", appVersion);
        return Number(appVersion);
    } else if (this.checkAndroid()) {
        // var appVersion = jsb.reflection.callStaticMethod("com/bigbeargame/szny/JniHelper", "getAppVersionCode", "()I");
        // return appVersion;
        return 1015;
    } else {
        return 1015;
    }
};

JSCallOC.prototype.getAppVersion = function () {
    if (cc.sys.isNative && this.checkIsAble()) {
        var appVersion = jsb.reflection.callStaticMethod("LocalInfo", "getAppVersion");
        cc.log("getAppVersion:%s", appVersion);
        return appVersion;
    } else if (this.checkAndroid()) {
        // var appVersion = jsb.reflection.callStaticMethod("com/bigbeargame/szny/JniHelper", "getAppVersionName", "()Ljava/lang/String;");
        // return appVersion;
        return "1.0.15";
    } else {
        return "1.0.15";
    }
};

JSCallOC.prototype.getOSVersion = function () {
    if (cc.sys.isNative && this.checkIsAble()) {
        var OSVersion = jsb.reflection.callStaticMethod("LocalInfo", "getOSVersion");
        cc.log("getOSVersion:%s", OSVersion);
        return OSVersion;
    } else if (this.checkAndroid()) {
        return "web1.0";
    } else {
        return "web1.0";
    }
};

JSCallOC.prototype.getAdapterType = function () {
    if (cc.sys.isNative && this.checkIsAble()) {
        var adapterType = jsb.reflection.callStaticMethod("LocalInfo", "getAdapterType");
        cc.log("getAdapterType:%d", adapterType);
        return adapterType;
    } else {
        return 5;
    }
};

JSCallOC.prototype.getIOSVendor = function () {
    if (cc.sys.isNative && this.checkIsAble()) {
        var IOSVendor = jsb.reflection.callStaticMethod("LocalInfo", "getIOSVendor");
        cc.log("getIOSVendor:%s", IOSVendor);
        return IOSVendor;
    } else {
        return window.TestAccount;
    }
};

JSCallOC.prototype.getIOSAdvertising = function () {
    if (cc.sys.isNative && (cc.sys.platform == cc.sys.IPHONE || cc.sys.platform == cc.sys.IPAD)) {
        var IOSAdvertising = jsb.reflection.callStaticMethod("LocalInfo", "getIOSAdvertising");
        cc.log("getIOSAdvertising:%s", IOSAdvertising);
        return IOSAdvertising;
    } else {
        return window.TestAccount;
    }
};

JSCallOC.prototype.getIOSMacAddress = function () {
    if (cc.sys.isNative && this.checkIsAble()) {
        var IOSMacAddress = jsb.reflection.callStaticMethod("LocalInfo", "getIOSMacAddress");
        cc.log("getIOSMacAddress:%s", IOSMacAddress);
        return IOSMacAddress;
    } else {
        return window.TestAccount;
    }
};

JSCallOC.prototype.getIOSOpenUdid = function () {
    if (cc.sys.isNative && this.checkIsAble()) {
        var IOSOpenUdid = jsb.reflection.callStaticMethod("LocalInfo", "getIOSOpenUdid");
        cc.log("getIOSOpenUdid:%s", IOSOpenUdid);
        return IOSOpenUdid;
    } else {
        return window.TestAccount;
    }
};

JSCallOC.prototype.getUUID = function () {
    if (cc.sys.isNative && this.checkIsAble()) {
        var UUID = jsb.reflection.callStaticMethod("LocalInfo", "getUUID");
        cc.log("getUUID:%s", UUID);
        return UUID;
    } else if (this.checkAndroid()) {
        return "11111111";
    } else {
        return window.TestAccount;
    }
};

JSCallOC.prototype.getAppName = function () {
    if (cc.sys.isNative && this.checkIsAble()) {
        var appName = jsb.reflection.callStaticMethod("LocalInfo", "getAppName");
        cc.log("getAppName:%s", appName);
        return appName;
    } else if (this.checkAndroid()) {} else {
        return "牛友圈";
    }
};

//充值相关
JSCallOC.prototype.postPaySucess = function () {
    cc.log("JSCallOC send update money");
    var msg = MessageFactory.createCommonMessage(window.UPDATE_PLAYER_MONEY);
    if (msg) {
        msg.send(1);
    }
};

//打开支付宝
//apilyId跳转用的唯一ID
JSCallOC.prototype.sendPayBySingleAlipay = function (payData, apilyId) {
    if (cc.sys.isNative && this.checkIsAble()) {
        jsb.reflection.callStaticMethod("LocalInfo", "sendPayBySingleAlipay:apilyId:", payData, apilyId);
    }
};

//打开网页
JSCallOC.prototype.sendPayByWebView = function (payUrl, payData, showWeb) {
    if (cc.sys.isNative && this.checkIsAble()) {
        jsb.reflection.callStaticMethod("LocalInfo", "sendPayByWebView:payData:showWeb:", payUrl, payData, showWeb);
    }
};

//内购充值
JSCallOC.prototype.sendIosPay = function (orderIdentifier, creatOrderUrl, mid, productid, mtkey, versions, gid, sid, money) {
    if (cc.sys.isNative && this.checkIsAble()) {
        jsb.reflection.callStaticMethod("LocalInfo", "payIosProduct:creatOrderUrl:mid:productid:mtkey:versions:gid:sid:money:", orderIdentifier, creatOrderUrl, mid, productid, mtkey, versions, gid, sid, money);
    }
};

//调用内嵌网页
JSCallOC.prototype.openURLInGame = function (urlStr) {
    cc.log("JSCallOC.prototype.openURLInGame,urlStr = " + urlStr);
    if (cc.sys.isNative && this.checkIsAble()) {
        jsb.reflection.callStaticMethod("LocalInfo", "openURLInGame:", urlStr);
    }
};

//调用内嵌网页
JSCallOC.prototype.currentPowerPercent = function (urlStr) {
    if (cc.sys.isNative && this.checkIsAble()) {
        jsb.reflection.callStaticMethod("LocalInfo", "currentPowerPercent");
    }
};

JSCallOC.prototype.Poll = function () {
    if (cc.sys.platform == cc.sys.ANDROID) {
        SocialUtils.Poll();
    } else {
        if (cc.sys.isNative && this.checkIsAble()) {
            jsb.reflection.callStaticMethod("LocalInfo", "Poll");
        }
    }
};

JSCallOC.prototype.SetAppInfo = function (openId) {
    cc.log("JSCallOC.prototype.SetAppInfo,msTime = %s", openId);
    if (cc.sys.platform == cc.sys.ANDROID) {
        SocialUtils.SetAppInfo(openId);
    } else {
        if (cc.sys.isNative && this.checkIsAble()) {
            jsb.reflection.callStaticMethod("LocalInfo", "SetAppInfo:", openId);
        }
    }
};

JSCallOC.prototype.StartRecord = function (msTime) {
    cc.log("JSCallOC.prototype.StartRecord,msTime = %d", msTime);
    if (cc.sys.platform == cc.sys.ANDROID) {
        SocialUtils.StartRecord(msTime);
    } else {
        if (cc.sys.isNative && this.checkIsAble()) {
            jsb.reflection.callStaticMethod("LocalInfo", "StartRecord:", msTime);
        }
    }
};

JSCallOC.prototype.StopRecording = function () {
    if (cc.sys.platform == cc.sys.ANDROID) {
        SocialUtils.StopRecording();
    } else {
        if (cc.sys.isNative && this.checkIsAble()) {
            jsb.reflection.callStaticMethod("LocalInfo", "StopRecording");
        }
    }
};

JSCallOC.prototype.DownloadRecordedFile = function (fileID, downloadFilePath) {
    if (cc.sys.platform == cc.sys.ANDROID) {
        SocialUtils.DownloadRecordedFile(fileID, downloadFilePath);
    } else {
        if (cc.sys.isNative && this.checkIsAble()) {
            jsb.reflection.callStaticMethod("LocalInfo", "DownloadRecordedFile:downloadFilePath:", fileID, downloadFilePath);
        }
    }
};

JSCallOC.prototype.PlayRecordedFile = function (downloadFilePath) {
    if (cc.sys.platform == cc.sys.ANDROID) {
        SocialUtils.PlayRecordedFile(downloadFilePath);
    } else {
        if (cc.sys.isNative && this.checkIsAble()) {
            jsb.reflection.callStaticMethod("LocalInfo", "PlayRecordedFile:", downloadFilePath);
        }
    }
};

JSCallOC.prototype.screenShotAction = function () {
    if (cc.sys.isNative && this.checkIsAble()) {
        var path = jsb.reflection.callStaticMethod("LocalInfo", "screenShotAction");
        cc.log("screenShotAction:%s", path);
        return path;
    }
};
JSCallOC.prototype.payAppstore = function (goodid, openid) {
    if (cc.sys.isNative && this.checkIsAble()) {
        var path = jsb.reflection.callStaticMethod("paymentMCPP", "jumpToAppstorePay:openid:", goodid, openid);
        cc.log("screenShotAction:%s", path);
        return path;
    }
};

JSCallOC.prototype.exitApp = function () {

    cc.director.end();
    if (cc.sys.isNative && this.checkIsAble()) {
        jsb.reflection.callStaticMethod("LocalInfo", "exitApp");
    } else if (this.checkAndroid()) {} else {}
};

JSCallOC.prototype.showLoadingView = function (str) {
    LoadingView.show(str);
};

JSCallOC.prototype.dismissLoadingView = function () {
    LoadingView.dismiss();
};

var GameCallOC = function () {
    var instance;

    function getInstance() {
        if (instance === undefined) {
            instance = new JSCallOC();
        }
        return instance;
    }

    return {
        getInstance: getInstance
    };
}();

module.exports = GameCallOC;