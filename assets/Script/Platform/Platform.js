/**
 * Created by shrimp on 17/2/19.
 */

window.Platform_Type = cc.Enum({
    E_PLATFORM_UNKONW  : 0,
    E_PLATFORM_ANDROID : 1,
    E_PLATFORM_IPHONE  : 2,
    E_PLATFORM_IPAD    : 3,
    E_PLATFORM_MAC     : 4,
    E_PLATFORM_WINDOWS : 5,
    E_PLATFORM_WEB     : 6,
});

var GameCallOC = require('GameCallOC');

function  PlatformManager()
{

}

PlatformManager.prototype.getPlatformCode = function () {
    cc.log("PlatformManager.prototype.getPlatformType platform = " + cc.sys.platform);
    return parseInt(cc.sys.platform);
}

PlatformManager.prototype.getOsType = function () {
    cc.log("PlatformManager.prototype.getPlatformType os = " + cc.sys);
    return cc.sys.os;
}

PlatformManager.prototype.getPlatformType = function () {
    this.getOsType();
    var platformCode = this.getPlatformCode();
    let platform = window.Platform_Type.E_PLATFORM_UNKONW;
    switch (platformCode)
    {
        case cc.sys.WIN32:
        case cc.sys.WINRT:
            platform = window.Platform_Type.E_PLATFORM_WINDOWS;
            break;
        case cc.sys.MACOS:
            platform = window.Platform_Type.E_PLATFORM_MAC;
            break;
        case cc.sys.ANDROID:
            platform = window.Platform_Type.E_PLATFORM_ANDROID;
            break;
        case cc.sys.IPHONE:
            platform = window.Platform_Type.E_PLATFORM_IPHONE;
            break;
        case cc.sys.IPAD:
            platform = window.Platform_Type.E_PLATFORM_IPAD;
            break;
        case cc.sys.MOBILE_BROWSER:
        case cc.sys.DESKTOP_BROWSER:
            platform = window.Platform_Type.E_PLATFORM_WEB;
            break;
        default:
            platform = window.Platform_Type.E_PLATFORM_UNKONW;
            break;
    }
    cc.log("platform = " + platform);
    return platform;
}


PlatformManager.prototype.getLanguage = function () {
    cc.log("PlatformManager.getLanguage, language = " + cc.sys.language);

    return cc.sys.language;
}

PlatformManager.prototype.getPackageName = function () {
    cc.log("PlatformManager.getPackageName");
    var packageName = "";
    var ojb = jsb.reflection.callStaticMethod("JSCallBackOC", "getPackageName");
    return packageName;
}

PlatformManager.prototype.getAppVersion = function () {
    var version = 1;

    cc.log("PlatformManager.getAppVersion,version = " + version);
    return version;
}

PlatformManager.prototype.getBattery = function () {

    //cc.log("PlatformManager.getBattery,data = " + JSON.stringify(navigator));

    let batteryLevel = 0;

    navigator.getBattery().then(function(battery) {

        batteryLevel = battery.level;
        function updateLevelInfo(){
            console.log("Battery level: "
                + battery.level * 100 + "%");
            batteryLevel = battery.level;
        }
        updateLevelInfo();

        battery.addEventListener('levelchange', function(){
            updateLevelInfo();
        });
    });

    cc.log("PlatformManager.getBattery, level = " + batteryLevel);

    return ;
}

PlatformManager.prototype.getSignalStrength = function () {
    cc.log("PlatformManager.getSignalStrength");
}

PlatformManager.prototype.generateUUID = function() {

    if(this.getPlatformType() == Platform_Type.E_PLATFORM_WEB
    || this.getPlatformType() == Platform_Type.E_PLATFORM_ANDROID)
    {
        //web平台上获取设备id的方法，暂时没有更好的，这个方案下的碰撞率不及1/2^^122,保存在本地数据 易被删除
        var uuid = cc.sys.localStorage.getItem('uuid');
        cc.log("PlatformManager.generateUUID111,uuid = " + uuid);
        if(uuid == 0 || uuid == null || uuid == undefined )
        {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x3|0x8)).toString(16);
            });
            cc.sys.localStorage.setItem("uuid", uuid);
        }
    }
    else if(this.getPlatformType() == Platform_Type.E_PLATFORM_IPHONE
       || this.getPlatformType() == Platform_Type.E_PLATFORM_IPAD
        || this.getPlatformType() == Platform_Type.E_PLATFORM_MAC)
    {
        return GameCallOC.getInstance().getUUID();
    }
    cc.log("PlatformManager.generateUUID,uuid = " + uuid);
    return uuid;
}


var Platform = (function(){
    var instance ;

    function getInstance(){
        if( instance === undefined ){
            instance = new PlatformManager();
        }
        return instance;
    };

    return {
        getInstance : getInstance,
    }
})();

module.exports = Platform;