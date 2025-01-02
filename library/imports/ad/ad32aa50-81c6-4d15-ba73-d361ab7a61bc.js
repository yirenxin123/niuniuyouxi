'use strict';

/**
 *
 * 　　　┏┓　　　┏┓
 * 　　┏┛┻━━━┛┻┓
 * 　　┃　　　　　　 ┃
 * 　　┃　　　━　　　┃
 * 　　┃　┳┛　┗┳　  ┃
 * 　　┃　　　　　　 ┃
 * 　　┃　　　┻　　　┃
 * 　　┃　　　　　　 ┃
 * 　　┗━┓　　　┏━┛Code is far away from bug with the animal protecting
 * 　　　　┃　　　┃    神兽保佑,代码无bug
 * 　　　　┃　　　┃
 * 　　　　┃　　　┗━━━┓
 * 　　　　┃　　　　　 ┣┓
 * 　　　　┃　　　　 ┏┛
 * 　　　　┗┓┓┏━┳┓┏┛
 * 　　　　　┃┫┫　┃┫┫
 * 　　　　　┗┻┛　┗┻┛
 *
 */
var BaseScene = require("BaseScene");
var HttpManager = require('HttpManager');
var SocketManager = require('SocketManager');
var GameSystem = require('GameSystem');
var GamePlayer = require('GamePlayer');
var UtilTool = require('UtilTool');
var AlertView = require('AlertView');
var ToastView = require('ToastView');
var LoadingView = require('LoadingView');
var Platform = require('Platform');
var WeChatApi = require('WeChatApi');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameCallOC = require('GameCallOC');

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);return null;
};

cc.Class({
    extends: BaseScene,

    properties: {
        LabelVersion: cc.Label,
        GameNotice: cc.Label,
        LogoSprite: cc.Sprite,
        weChatButton: cc.Button,
        localButton: cc.Button,
        HotUpdateTips: cc.Label,
        HotUpdateProgress: cc.ProgressBar,
        _StoragePath: "",
        _ManifestUrl: "res/project.manifest",
        _failCount: 0,
        _maxFailCount: 2 },

    // use this for initialization
    onLoad: function onLoad() {
        this._super();
        cc.log("LoadingScene.onLoad,versions = " + GameSystem.getInstance().version);
        GameSystem.getInstance().version = GameCallOC.getInstance().getAppVersionCode();
        cc.log("LoadingScene.onLoadNew,versions = " + GameSystem.getInstance().version);

        SocketManager.getInstance().disconnect();
        this.onGameBack = true;
        GameSystem.getInstance().bLogin = false;

        this.sendGetRouter();
        cc.game.addPersistRootNode(this.GameNotice.node);
        this.webDeviceID = this.getLocalInfoByWebUrl();
        window.TestAccount = this.webDeviceID;
        GameSystem.getInstance().gameNotice = null;
        UtilTool.getNowFormatDate();
        MusicMgr.initAudio();
        this.loadingRes();
        this._failCount = 0;
        this.LabelVersion.string = "Version:" + GameCallOC.getInstance().getAppVersion();
    },

    onCheckStatus: function onCheckStatus() {
        if (GameSystem.getInstance().bClientHotUpdate || !cc.sys.isNative || GameSystem.getInstance().VerStatus == GameSystem.getInstance().VerStatusType.VERSION_TYPE_AUDIT) {
            cc.log("onHotUpdate bClientHotUpdate = ", GameSystem.getInstance().bClientHotUpdate);
            this.gotoGame();
        } else {
            //this.onHotUpdate();
            this.gotoGame();
        }
    },

    gotoGame: function gotoGame() {
        GameSystem.getInstance().bClientHotUpdate = true;
        this.HotUpdateProgress.node.active = false;
        this.updateLoginBtn();
        //this.sendGetRouter();
    },

    onHotUpdate: function onHotUpdate() {
        if (!cc.sys.isNative) {
            this.gotoGame();
            return;
        }

        this.HotUpdateProgress.node.active = true;
        this._StoragePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + "temp";
        cc.log("Storage path for remote asset :", this._StoragePath);

        // Setup your own version compare handler, versionA and B is versions in string
        // if the return value greater than 0, versionA is greater than B,
        // if the return value equals 0, versionA equals to B,
        // if the return value smaller than 0, versionA is smaller than B.
        var versionCompareHandle = function versionCompareHandle(versionA, versionB) {
            cc.log("Js Custom Version Compare: versionA is " + versionA, " versionB is" + versionB);
            var vA = versionA.split('.');
            var vB = versionB.split('.');
            for (var i = 0; i < vA.length; ++i) {
                var a = parseInt(vA[i]);
                var b = parseInt(vB[i]);
                if (a == b) {
                    continue;
                } else {
                    return a - b;
                }
            }
            if (vB.length > vA.length) {
                return -1;
            } else {
                return 0;
            }
        };

        this._am = new jsb.AssetsManager(this._ManifestUrl, this._StoragePath, versionCompareHandle);
        this._am.retain();
        if (!this._am.getLocalManifest().isLoaded()) {
            this.sendLog("加载本地文件失败");
            cc.log("未找到本地manifest文件");
            this.gotoGame();
            return;
        }

        var self = this;
        this._am.setVerifyCallback(function (path, asset) {
            var compressed = asset.compressed;
            var expectedMd5 = asset.md5;
            var relativePath = asset.path;
            var size = asset.size;
            //self.sendLog("Verification passed:" + relativePath);
            return true;
        });

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            this._am.setMaxConcurrentTask(2);
        }

        this.HotUpdateProgress.progress = 0;

        var resVersion = this._am.getLocalManifest().getVersion();
        var packageUrl = this._am.getLocalManifest().getPackageUrl();
        this.sendLog("提示: 版本:" + resVersion + ", 路径:" + packageUrl);

        this._updateListener = new jsb.EventListenerAssetsManager(this._am, function (event) {
            cc.log("hotUpdateCallback code: " + event.getEventCode());

            switch (event.getEventCode()) {
                case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                    cc.log("ERROR_NO_LOCAL_MANIFEST.");
                    self.sendLog("错误: 未找到本地manifest文件, 跳过更新");
                    self.gotoGame();
                    break;

                case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
                    cc.log("ERROR_DOWNLOAD_MANIFEST.");
                    self.sendLog("错误: 下载manifest文件失败, 跳过更新");
                    self.gotoGame();
                    break;

                case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                    cc.log("ERROR_PARSE_MANIFEST.");
                    self.sendLog("错误: 解析manifest文件失败, 跳过更新");
                    self.gotoGame();
                    break;

                case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                    cc.log("ALREADY_UP_TO_DATE.");
                    self.sendLog("提示：已经是最新版本.");
                    self.gotoGame();
                    break;

                case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                    cc.log("NEW_VERSION_FOUND.");
                    self.sendLog("提示：发现新版本.");
                    self.HotUpdateProgress.progress = 0;
                    break;

                case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                    cc.log("getPercent=" + event.getPercent());
                    var num = parseFloat(parseInt(event.getPercent()) / 100.0);
                    cc.log("num=" + num);
                    self.HotUpdateTips.string = "更新进度：" + event.getPercent().toFixed(2) + "%";
                    self.HotUpdateProgress.progress = num;
                    cc.log("progress=", self.HotUpdateProgress.progress);

                    var msg = event.getMessage();
                    if (msg) {
                        cc.log("更新文件: ", msg);
                        self.sendLog("更新文件: " + msg);
                    }
                    break;

                case jsb.EventAssetsManager.UPDATE_FINISHED:
                    {
                        cc.log("UPDATE_FINISHED.");
                        self.sendLog("提示：更新完成.");

                        if (GameCallOC.getInstance.getAppVersionCode() > 1100) {
                            var alert = AlertView.create();
                            alert.setPositiveButton(function () {
                                GameCallOC.getInstance().exitApp();
                            }, "确定");
                            alert.show("更新完成,请重启APP！", AlertViewBtnType.E_BTN_CLOSE);
                            return;
                        }

                        // Prepend the manifest's search path
                        // var searchPaths = jsb.fileUtils.getSearchPaths();
                        // var newPaths = self._am.getLocalManifest().getSearchPaths();
                        // console.log(JSON.stringify(newPaths));
                        // Array.prototype.unshift(searchPaths, newPaths);
                        // // This value will be retrieved and appended to the default search path during game startup,
                        // // please refer to samples/js-tests/main.js for detailed usage.
                        // // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
                        // cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
                        // jsb.fileUtils.setSearchPaths(searchPaths);
                        self.gotoGame();
                        //self.gotoHall();
                    }
                    break;

                case jsb.EventAssetsManager.UPDATE_FAILED:
                    cc.log("UPDATE_FAILED: " + event.getMessage());
                    self.sendLog("错误:" + event.getMessage() + ", failCount=" + this._failCount);
                    self._failCount++;
                    if (self._failCount < self._maxFailCount) {
                        self.sendLog("err, downloadFailedAssets");
                        self._am.downloadFailedAssets();
                    } else {
                        cc.log("err, Reach maximum fail count, exit update process");
                        self.sendLog("错误: 更新失败超过2次，跳过更新");
                        self._failCount = 0;
                        self.gotoGame();
                    }
                    break;

                case jsb.EventAssetsManager.ERROR_UPDATING:
                    cc.log("ERROR_UPDATING: " + event.getAssetId() + ", " + event.getMessage());
                    self.sendLog("错误, 升级出错: " + event.getAssetId() + ", " + event.getMessage());
                    break;

                case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                    cc.log("ERROR_DECOMPRESS: " + event.getMessage());
                    self.sendLog("错误, 解压失败: " + event.getMessage());
                    break;

                default:
                    break;
            }
        });

        cc.eventManager.addListener(this._updateListener, 1);
        this._am.update();
    },

    sendLog: function sendLog(text) {
        cc.log(text);
        this.HotUpdateTips.string = text;
    },

    loadingRes: function loadingRes() {
        cc.loader.loadResDir("prefabs/LoadingView/LoadingView");
        cc.loader.loadResDir("prefabs/alertView");
        cc.loader.loadResDir("prefabs/toastView");
    },

    callbackBtnLogin: function callbackBtnLogin(event, CustomEventData) {
        cc.log("LoadingView.callbackBtnLogin");
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        GameSystem.getInstance().CustomLoginType = Number(CustomEventData);
        if (CustomEventData == 2) {
            //GameCallOC.getInstance().StartRecord(6000);
            LoadingView.show("正在登陆...");
            cc.log("LoadingView.callbackBtnLogin weixin");
            WeChatApi.getInstance().sendWeChatLogin();
        } else {
            //GameCallOC.getInstance().StopRecording();
            //this.sendLogin(Number(CustomEventData));
            LoadingView.show("正在登陆...");
            SocketManager.getInstance().startSocket();
        }
    },

    onHttpResponse: function onHttpResponse(event) {
        cc.log('LoadingView.onHttpResponse');
        this._super(event);
        if (event == undefined) {
            cc.error("LoadingView.onHttpResponse,event = undefined");
            return;
        }

        if (event.isSucceed) {
            var tag = event.tag;
            var data = event.data;

            if (tag == HttpTag.HTTP_TAG_GET_ROUTER) {
                //{"access":"/GetRouter","code":0,"desc":"执行成功","pid":1,"ver":1000,
                // "logintype":3,"area":1,"url":"http://120.26.81.151:8080","status":1,
                // "backurl":"http://120.26.81.151:8080"}
                if (data.code == 0) {
                    GameSystem.getInstance().logintype = Number(data.logintype);

                    GameSystem.getInstance().VerStatus = data.status;
                    GameSystem.getInstance().webSocketUrl = data.url + "/game";
                    GameSystem.getInstance().backWebSocketUrl = data.backurl + "/game";
                    cc.log("LoadingView.onHttpResponse, logintype= ", GameSystem.getInstance().logintype, " webSocketUrl=", GameSystem.getInstance().webSocketUrl, " backWebSocketUrl=", GameSystem.getInstance().backWebSocketUrl);
                    this.onCheckStatus();
                }
            }
        } else {
            if (event.data == null) {
                var self = this;
                var alert = AlertView.create();
                alert.setPositiveButton(function () {
                    self.sendGetRouter();
                }, "重试");

                alert.setNegativeButton(function () {}, "取消");

                var show = "网络链接错误，请检查您的网络!";
                alert.show(show, AlertViewBtnType.E_BTN_CANCLE);
            }
        }
    },

    updateLoginBtn: function updateLoginBtn() {
        if (GameSystem.getInstance().logintype == 1) {
            this.localButton.node.active = true;
        } else if (GameSystem.getInstance().logintype == 2) {
            this.weChatButton.node.active = true;
        } else if (GameSystem.getInstance().logintype == 3) {
            this.weChatButton.node.active = true;
            this.localButton.node.active = true;
        }
    },

    onMessage: function onMessage(event) {
        cc.log("LoadingScene.onMessage");
        var msg = event.data;
        var cmd = msg.cmd;
        switch (cmd) {
            case window.US_RESP_LOGIN_CMD_ID:
                this.onLoginMsg(msg);
                break;

            case window.US_NOTIFY_IN_GAME_CMD_ID:
                cc.log("LoadingScene notifyInGame, msg" + msg.gamesvcid + ",tableid" + msg.tableid);
                if (msg.code > 0) {
                    GameSystem.getInstance().roomLevel = msg.gamelevel;
                    GameSystem.getInstance().gamesvcid = msg.gamesvcid;
                    GameSystem.getInstance().tableid = msg.tableid;
                    GameSystem.getInstance().bReloadInGame = true;
                }
                break;
        }
    },

    onLoginMsg: function onLoginMsg(msg) {
        cc.log("LoadingScene.onLoginMsg,msg = " + JSON.stringify(msg));
        LoadingView.dismiss();
        if (msg.code === SocketRetCode.RET_SUCCESS) {
            GameSystem.getInstance().bReloadInGame = false;
            GameSystem.getInstance().gamesvcid = 0;
            GameSystem.getInstance().tableid = 0;
            this.gotoHall();
        } else {
            var alertExit = AlertView.create();
            alertExit.showOne(msg.desc, AlertViewBtnType.E_BTN_CLOSE);
        }
    },

    getDeviceId: function getDeviceId() {
        cc.log("LoadingScene.getDeviceId,webDeviceID = " + this.webDeviceID);
        if (this.webDeviceID == "" || this.webDeviceID == undefined) {
            return Platform.getInstance().generateUUID();
        }
        return this.webDeviceID;
    },

    sendGetRouter: function sendGetRouter() {

        var data = {
            pid: GameSystem.getInstance().productid,
            ver: GameSystem.getInstance().version
        };

        HttpManager.getInstance().sendCommonRequest(HttpTag.HTTP_TAG_GET_ROUTER, data, GameSystem.getInstance().routerUrl);
    },

    gotoHall: function gotoHall() {
        cc.log("LoadingScene.gotoHall");
        cc.director.loadScene('HallScene', this.popUpNotice);
        GameCallOC.getInstance().SetAppInfo("Bullfight_" + GamePlayer.getInstance().uid);
    },

    popUpNotice: function popUpNotice() {
        cc.log("LoadingScene.popUpNotice");
    },

    getLocalInfoByWebUrl: function getLocalInfoByWebUrl() {
        //浏览器
        if (!cc.sys.isNative) {
            var deviceid = GetQueryString("uid");
            cc.log("LoadingScene.getLocalInfoByWebUrl,deviceid = " + deviceid);
            if (deviceid != null && deviceid.toString().length > 0) {
                return deviceid;
            }
            return "";
        }
    },
    getLocalPos: function getLocalPos() {
        $.getScript('http://int.dpool.sina.com.cn/iplookup/iplookup.php?format=js', function () {
            alert(remote_ip_info.country); //国家
            alert(remote_ip_info.province); //省份
            alert(remote_ip_info.city); //城市
        });
    },

    onDestroy: function onDestroy() {
        if (this._updateListener) {
            cc.eventManager.removeListener(this._updateListener);
            this._updateListener = null;
        }
        if (this._am && !cc.sys.ENABLE_GC_FOR_NATIVE_OBJECTS) {
            this._am.release();
        }
        this._super();
    }

});