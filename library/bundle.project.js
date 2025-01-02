require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"AdvertItem":[function(require,module,exports){
"use strict";
cc._RFpush(module, '13a7dle1ehOG75EMd3e7liz', 'AdvertItem');
// Script\ComScene\PopView\AdvertItem.js

'use strict';

var CusWebView = require('CusWebView');

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        AdvertSprite: cc.Sprite,
        Url: '',
        webViewPrefab: cc.Prefab
    },

    // use this for initialization
    onLoad: function onLoad() {},

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    updateAdverItem: function updateAdverItem(info) {
        this.Url = info.jumpurl;
        //this.getSpriteFrame2(info.pic)

        UpdateWXHeadIcon(info.pic, this.AdvertSprite);
        //UpdateWXHeadIcon("http://wx.qlogo.cn/mmopen/Po9mkm3Z42tolYpxUVpY6mvCmqalibOpcJ2jG3Qza5qgtibO1NLFNUF7icwCibxPicbGmkoiciaqKEIdvvveIBfEQqal8vkiavHIeqFT/0.png",this.AdvertSprite);
    },

    callBackBtn: function callBackBtn() {

        var message = {
            popView: "FindView",
            btn: "CallBackBtn",
            url: this.Url
        };
        GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.SCENE_MSG, data: message });
        return;

        var WebView = cc.instantiate(this.webViewPrefab);
        cc.director.getScene().addChild(WebView);
        var winSize = cc.director.getWinSize();
        WebView.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
        WebView.getComponent('CusWebView').setWebViewUrl(this.Url);
    },

    getSpriteFrame2: function getSpriteFrame2(url, successCb, failureCb, target, otherSender) {
        //url = this.kyHelper + url;


        //cc.log(page1);

        var xhr = new XMLHttpRequest();

        var self = this;

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
                var response = xhr.responseText;

                var img = BASE64.decoder(response);

                //cc.log("img=", img);

                var text = new Uint8Array(response, 0, response.length);
                cc.log("text = " + text);

                var img = new Image();
                img.src = BASE64.decoder(response);
                cc.log("img.src = " + img.src);

                var texture = new cc.Texture2D();
                texture.initWithImage(img); //cc.Texture2D.SRC_ALPHA, 1, 1, cc.size(1080, 300));
                texture.handleLoadedTexture();

                var newframe = new cc.SpriteFrame(texture);
                self.AdvertSprite.spriteFrame = newframe;

                // if (successCb != null) {
                //     successCb.apply(target, [newframe, otherSender]);
                // }
            } else {
                    // if(failureCb != null)
                    // {
                    //     failureCb.apply(target);
                    // }
                }
        };

        xhr.timeout = 5000;
        xhr.open("GET", url, true);
        xhr.send();
    }
});

cc._RFpop();
},{"CusWebView":"CusWebView"}],"AlertView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '9956eOLEABEHpZjZtGtXhv0', 'AlertView');
// Script\ComScene\PopView\AlertView.js

'use strict';

window.AlertViewBtnType = cc.Enum({
    E_BTN_CLOSE: 0, //关闭和确定按钮
    E_BTN_CANCLE: 1 });

var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require("GameSystem");

function AView() {

    this.rootNode = null;
    this.btnTypeFlag = AlertViewBtnType.E_BTN_CLOSE;
    this._positiveFlag = false;
    this._negativeFlag = false;
    this._callbackPositive = null;
    this._callbackNegative = null;
    this.positive = null;
    this.negative = null;
    this.positive_single = null;
    this.btnclose = null;
    this.positiveName = "";
    this.negativeName = "";

    this.positiveBtResNormal = null;

    this.reSet = function () {
        this.btnTypeFlag = AlertViewBtnType.E_BTN_CLOSE;
        this._positiveFlag = false;
        this._negativeFlag = false;
        this._callbackPositive = null;
        this._callbackNegative = null;
        this.positive = null;
        this.negative = null;
        this.positive_single = null;
        this.btnclose = null;
        this.positiveName = "";
        this.negativeName = "";
    };

    this.dismiss = function () {

        if (this.rootNode) {
            this.reSet();
            this.rootNode.removeFromParent(true);
            this.rootNode = null;
        }
    };

    this.show = function (tips, btnType, parent, tag) {
        this.dismiss();
        var self = this;

        window.loadPrefabs("prefabs/alertView", function (view) {

            self.rootNode = view;
            self.updateView(view, tips, btnType, parent);
            if (tag != undefined) {
                self.rootNode.tag = tag;
            }
        }, parent);
    };

    this.showOne = function (tips, btnType, parent) {
        if (parent) {
            parent.removeChildByTag(-100);
        } else {
            cc.director.getScene().removeChildByTag(-100);
        }
        this.show(tips, btnType, parent, -100);
    };

    this.updateView = function (node, tips, btnType, parent) {
        var self = this;
        node.on(cc.Node.EventType.TOUCH_START, function (event) {
            event.stopPropagation();
            return;
        });

        this.btnTypeFlag = btnType;

        if (tips == "" || tips === undefined) {
            tips = "未知错误";
        }

        var desTxt = cc.find("Bg/Content", node).getComponent(cc.Label);

        desTxt.string = tips;
        this.positive_single = cc.find("Bg/BtnSureSingle", node);
        this.negative = cc.find("Bg/BtnCancle", node);
        this.positive = cc.find("Bg/BtnSure", node);
        this.btnclose = cc.find("Bg/BtnClose", node);
        if (this.btnTypeFlag == AlertViewBtnType.E_BTN_CLOSE) {
            this.negative.active = false;
            this.positive.active = false;
            this.positive_single.active = true;
            this.btnclose.active = true;
        } else {
            this.negative.active = true;
            this.positive.active = true;
            this.positive_single.active = false;
            this.btnclose.active = false;
        }

        if (this.positiveName != "" && this.positiveName != undefined) {
            if (this.btnTypeFlag == AlertViewBtnType.E_BTN_CLOSE) {
                this.setPositiveSingleName(this.positiveName);
            } else {
                this.setPositiveButtonName(this.positiveName);
            }
        }

        if (this.negativeName != "" && this.negativeName != undefined) {
            this.setNegativeButtonName(this.negativeName);
        }

        this.addButtonListenner();

        // //var positiveText = cc.find("Image_10_0",this.positive);
        //
        // if(this.positiveBtResNormal){
        //     window.loadImg(this.positiveBtResNormal,function(spriteFrame){
        //         // var buttom = positiveText.getComponent(cc.Sprite) ;
        //         // buttom.spriteFrame = spriteFrame;
        //     });
        // }


        window.scaleTo(node);
    };

    this.addButtonListenner = function () {
        var self = this;
        if (this.negative.active) {
            this.negative.on(cc.Node.EventType.TOUCH_END, function () {
                cc.log("AlertView.addButtonListenner,negative");
                if (self.btnTypeFlag != AlertViewBtnType.E_BTN_CLOSE) {

                    MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);

                    if (self._callbackNegative) {
                        self._callbackNegative();
                    }
                    self.dismiss();
                }
            });
        }

        if (this.btnclose.active) {
            this.btnclose.on(cc.Node.EventType.TOUCH_END, function () {
                cc.log("AlertView.addButtonListenner,btnclose");
                if (self.btnTypeFlag == AlertViewBtnType.E_BTN_CLOSE) {
                    MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
                    if (self._callbackNegative) {
                        self._callbackNegative();
                    }
                    self.dismiss();
                }
            });
        }

        if (this.positive.active) {
            this.positive.on(cc.Node.EventType.TOUCH_END, function () {
                cc.log("AlertView.addButtonListenner,positive");
                if (self.btnTypeFlag != AlertViewBtnType.E_BTN_CLOSE) {
                    MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
                    if (self._callbackPositive) {
                        self._callbackPositive();
                    }
                    self.dismiss();
                }
            });
        }

        if (this.positive_single.active) {

            this.positive_single.on(cc.Node.EventType.TOUCH_END, function () {
                cc.log("AlertView.addButtonListenner,positive_single");
                if (self.btnTypeFlag == AlertViewBtnType.E_BTN_CLOSE) {
                    MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
                    if (self._callbackPositive) {
                        self._callbackPositive();
                    }
                    self.dismiss();
                }
            });
        } else {
            this.positive_single.removeFromParent();
            //this.positive_single.getComponent(cc.Button).interactable = false;
        }
    }, this.setPositiveButton = function (callback, name) {
        //this._positiveFlag = true;
        this._callbackPositive = callback;
        this.positiveName = name;
    };

    this.setNegativeButton = function (callback, name) {
        //this._negativeFlag = true;
        this._callbackNegative = callback;
        this.negativeName = name;
    };

    this.setPositiveButtonName = function (name) {
        var lable = cc.find("label", this.positive);
        lable.getComponent(cc.Label).string = name;
    };

    this.setPositiveSingleName = function (name) {
        var lable = cc.find("label", this.positive_single);
        lable.getComponent(cc.Label).string = name;
    };

    this.setNegativeButtonName = function (name) {
        var lable = cc.find("label", this.negative);
        lable.getComponent(cc.Label).string = name;
    };

    this.removeFromParent = function () {
        this.dismiss();
    };
};

var AlertView = {

    create: function create() {
        return new AView();
    }

};

module.exports = AlertView;

cc._RFpop();
},{"Audio_Common":"Audio_Common","GameSystem":"GameSystem","MusicMgr":"MusicMgr"}],"AssetsDownload":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd9b3fw2WYxJNpA/aNHohDhH', 'AssetsDownload');
// Script\Hotupdate\AssetsDownload.js

"use strict";

/** 
 * 队列加载资源
 * Author      : donggang
 * Create Time : 2016.12.15
 * 
 * 事件：
 * this.onProgress      更新进度
 * this.onNoNetwork     断网
 * this.onComplete      更新完成
 */

module.exports = cc.Class({
    /** 分析并获取需要更新的资源 */
    download: function download(storagePath, localManifest, remoteManifest) {
        this._storagePath = storagePath;
        this._localManifest = localManifest;
        this._remoteManifest = remoteManifest;

        this._nocache = new Date().getTime();

        this._downloadUnits = []; // 下载文件对象集合
        this._completeUnits = []; // 已下载完成对象集合
        this._failedUnits = []; // 下载失败文件对象集合
        this._deleteUnits = []; // 需要删除文件对象集合

        this._downloadComplete = 0; // 下载完成的文件数量
        this._downloadFailed = 0; // 下载失败的文件数量
        this._failCount = 0; // 下载失败的次数
        this._concurrentCurrent = 0; // 并发数量当前值

        this._analysisDownloadUnits();
        this._analysisDeleteUnits();

        // 当前总更新单位数量 = 更新完成文件数量 + 待更新文件数量
        this._totalUnits = this._downloadComplete + this._downloadUnits.length;

        cc.log("【更新】共有{0}个文件需要更新".format(this._downloadUnits.length));
        cc.log("【更新】共有{0}个文件需要删除".format(this._deleteUnits.length));

        this._items = this._downloadUnits.slice(0);

        if (this._items.length > 0) {
            this._downloadAsset();
        } else {
            cc.log("【更新】无更新文件，更新完成");
            if (this.onComplete) this.onComplete();
        }
    },

    /** 对比本地项目清单数据和服务器清单数据，找出本地缺少的以及和服务器不一样的资源 */
    _analysisDownloadUnits: function _analysisDownloadUnits() {
        for (var key in this._remoteManifest.assets) {
            if (this._localManifest.assets.hasOwnProperty(key)) {
                if (game.AssetConfig.debugRes || this._remoteManifest.assets[key].md5 != this._localManifest.assets[key].md5) {
                    // cc.log("【更新】准备下载更新的资源 {0}".format(key));
                    this._addDownloadUnits(key);
                }
            } else {
                // cc.log("【更新】准备下载本是不存在的资源 {0}".format(key));
                this._addDownloadUnits(key);
            }
        }
    },

    /** 对比本地项目清单数据和服务器清单数据，找出本地多出的资源 */
    _analysisDeleteUnits: function _analysisDeleteUnits() {
        for (var key in this._localManifest.assets) {
            if (this._remoteManifest.assets.hasOwnProperty(key) == false) {
                // cc.log("【更新】准备删除的资源{0}".format(key)); 
                this._deleteUnits.push(key);
            }
        }
    },

    /** 添加下载单位 */
    _addDownloadUnits: function _addDownloadUnits(key) {
        if (this._remoteManifest.assets[key].state != true) {
            this._downloadUnits.push(key); // 远程版本的文件 MD5 值和本地不同时文件需要下载
        } else {
            this._downloadComplete++; // 恢复状态时的下载完成数量
        }
    },

    /** 断网后恢复更新状态 */
    recovery: function recovery() {
        this._downloadAsset();
    },

    /** 下载资源 */
    _downloadAsset: function _downloadAsset() {
        if (game.config.textUpdate) this._remoteManifest.server = game.AssetConfig.testCdn;

        var relativePath = this._items.shift();
        var url = cc.path.join(this._remoteManifest.server, game.AssetConfig.line, relativePath);

        // 下载成功
        var complete = function (asset) {
            // 文件保存到本地
            this._saveAsset(relativePath, asset);

            // 记录更新完成的文件
            this._completeUnits.push(relativePath);

            // 下载完成的文件数量加 1
            this._downloadComplete++;

            if (game.AssetConfig.debugProgress) cc.log("【更新】进度 {0}/{1}，当前有 {2} 个资源并行下载".format(this._downloadComplete, this._totalUnits, this._concurrentCurrent));

            // 还原并发数量
            this._concurrentCurrent--;

            // 更新进度事件
            if (this.onProgress) {
                this.onProgress(relativePath, this._downloadComplete / this._totalUnits);
            }

            // 判断是否下载完成
            this._isUpdateCompleted();
        }.bind(this);

        // 下载失败
        var error = function (error) {
            this._failedUnits.push(relativePath);
            this._concurrentCurrent--;
            this._downloadFailed++;

            if (game.HttpEvent.NO_NETWORK) {
                // 触发断网事件
                if (this._concurrentCurrent == 0) {
                    if (this.onNoNetwork) this.onNoNetwork();
                }
            } else {
                cc.log("【更新】下载远程路径为 {0} 的文件失败，错误码为 {1}".format(url, error));
                cc.log("【更新】进度 {0}/{1}, 总处理文件数据为 {2}".format(this._downloadComplete, this._totalUnits, this._downloadComplete + this._downloadFailed));

                this._isUpdateCompleted();
            }
        }.bind(this);

        game.http.getByArraybuffer(this._noCache(url), complete, error);

        // 开启一个并行下载队列
        this._concurrentCurrent++;
        if (this._concurrentCurrent < game.AssetConfig.concurrent) {
            this._downloadAsset();
        }
    },

    /** 下载失败的资源 */
    _downloadFailedAssets: function _downloadFailedAssets() {
        // 下载失败的文件数量重置
        this._downloadFailed = 0;
        this._downloadUnits = this._failedUnits;
        this._failedUnits = [];
        this._items = this._downloadUnits.slice(0);

        if (this._items.length > 0) {
            this._downloadAsset();
        }
    },

    /** 判断是否全部更新完成 */
    _isUpdateCompleted: function _isUpdateCompleted() {
        var handleCount = this._downloadComplete + this._downloadFailed; // 处理完成数量

        if (this._totalUnits == this._downloadComplete) {
            // 全下载完成
            cc.log("【更新】更新完成");

            // 触发热更完成事件
            if (this.onComplete) this.onComplete();

            // 删除本地比服务器多出的文件
            this._deleteAssets();
        } else if (this._totalUnits == handleCount) {
            // 全处理完成，有下载失败的文件，需要重试
            cc.log("【更新】下载文件总数量　　：", this._totalUnits);
            cc.log("【更新】下载成功的文件数量：", this._downloadComplete);
            cc.log("【更新】下载失败的文件数量：", this._downloadFailed);

            // 更新失败的次数加 1
            this._failCount++;

            if (this._failCount < 3) {
                cc.log("【更新】更新重试第 {0} 次".format(this._failCount));

                this._downloadFailedAssets();
            } else {
                cc.log("【更新】更新失败");

                // 触发热更失败事件
                if (this.onFaild) this.onFaild();
            }
        } else if (this._items.length > 0 && this._concurrentCurrent < game.AssetConfig.concurrent) {
            // 队列下载
            this._downloadAsset();
        }
    },

    /** 删除本地比服务器多出的文件 */
    _deleteAssets: function _deleteAssets() {
        for (var i = 0; i < this._deleteUnits.length; i++) {
            var relativePath = this._deleteUnits[i];
            var filePath = cc.path.join(this._storagePath, relativePath);
            if (jsb.fileUtils.removeFile(filePath)) {
                cc.log("【更新】版本多余资源 {0} 删除成功".format(filePath));
            } else {
                cc.log("【更新】版本多余资源 {0} 删除失败".format(filePath));
            };
        }
    },

    /** 文件保存到本地 */
    _saveAsset: function _saveAsset(relativePath, asset) {
        if (cc.sys.isNative) {
            var storeDirectory = cc.path.join(this._storagePath, relativePath.substr(0, relativePath.lastIndexOf("/")));
            var storePath = cc.path.join(this._storagePath, relativePath);

            // 存储目录
            if (jsb.fileUtils.isDirectoryExist(storeDirectory) == false) {
                jsb.fileUtils.createDirectory(storeDirectory);
            }

            // 存储文件
            jsb.fileUtils.writeDataToFile(new Uint8Array(asset), storePath);
        }
    },

    /** 规避 HTTP 缓存问题 */
    _noCache: function _noCache(url) {
        return url + "?t=" + this._nocache;
    }
});

cc._RFpop();
},{}],"AssetsManager":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'ce2a5ImqPBDf4CPEBOQUoet', 'AssetsManager');
// Script\Hotupdate\AssetsManager.js

"use strict";

/** 
 * 资源管理
 * Author      : donggang
 * Create Time : 2016.11.26
 * 
 * 需求：
 * 1、版本配置文件对比，提示有新版本
 * 2、版本清单文件对比，分析需要更新的资源文件
 * 3、批量下载更新的资源文件保存到系统本地存储目录
 * 4、批量删除服务器清单文件中没有的资源文件
 * 5、更新失败或异常中断时，记录更新状态，下次触发更新时恢复更新进度，不下载已更新的文件
 * 6、智能队列更新资源文件，以游戏 fps 数据做为动态计算更新速度（手机性能不够，暂时没必要做）
 * 7、版本回退功能，通过查询目录的顺序，把版本版本的更新文件放到查询目录中（思考）
 * 8、版本文件摘要验证功能（思考）
 * 9、配置文件的数据内存是没有删除的（思考是否需要做处理）
 */

// 本地缓存关键字
var LOCAL_STORAGE_FOLDER = "game-remote-asset"; // 版本资源目录
var LOCAL_STORAGE_KEY_PROJECT = "update_project"; // 本地缓存清单数据
var LOCAL_STORAGE_KEY_UPDATE_STATE = "update_state"; // 本地缓存更新状态数据（每完成一个资源下载会记录完成数据队列)
var MODULE_PROJECT_MANIFEST_PATH = "version/{0}_project"; // 模块清单路径

window.game = window.game || {};

// 事件
game.AssetEvent = {};
game.AssetEvent.NEW_VERSION = "asset_new_version"; // 已是最新版本
game.AssetEvent.NEW_VERSION_FOUND = "asset_new_version_found"; // 找到新版本
game.AssetEvent.SUCCESS = "asset_success"; // 更新成功
game.AssetEvent.FAILD = "asset_failed"; // 更新失败
game.AssetEvent.PROGRESS = "asset_progress"; // 更新进度
game.AssetEvent.LOCAL_PROJECT_MANIFEST_LOAD_FAIL = "asset_local_project_manifest_load_fail"; // 获取游戏中路安装包中资源清单文件失败
game.AssetEvent.REMOTE_VERSION_MANIFEST_LOAD_FAILD = "asset_remote_version_manifest_load_faild"; // 获取远程版本配置文件失败
game.AssetEvent.REMOTE_PROJECT_MANIFEST_LOAD_FAILD = "asset_remote_project_manifest_load_faild"; // 获取远程更新单清文件失败
game.AssetEvent.NO_NETWORK = "asset_no_network"; // 断网

// 配置
game.AssetConfig = {};
game.AssetConfig.debugVersion = false; // 无视版本号测试
game.AssetConfig.debugRes = false; // 无视资源版本对比测试
game.AssetConfig.debugProgress = false; // 打印进度日志
game.AssetConfig.testIp = "172.18.254.56"; // 测试服务器地址
game.AssetConfig.testCdn = "http://" + game.AssetConfig.testIp + "/update/"; // 测试 CDN 服务器地址

game.AssetConfig.concurrent = 1; // 最大并发更新文件数量（有网络IO和文件IO并载数量在边玩游戏边下载时建议不超过2）
game.AssetConfig.line = "line1"; // 版本线路文件夹，用于更新时优先更新没有用的线路，测试成功后切换热更

var AssetsDownload = require("AssetsDownload");
var AssetsManager = cc.Class({
    extends: cc.EventTarget,

    /** 更新进度 */
    getProgress: function getProgress() {
        return this._progress;
    },

    /**
     * 对比服务器版本信息
     * @param appManifestPath(string)       本地清单文件路径
     */
    check: function check(moduleName) {
        if (this._isUpdate == true) {
            cc.log("【更新】模块{0}正在更新中".format(moduleName));
            return;
        }

        if (cc.sys.isNative) {
            this._storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + LOCAL_STORAGE_FOLDER;

            if (jsb.fileUtils.isDirectoryExist(this._storagePath) == false) {
                jsb.fileUtils.createDirectory(this._storagePath);
            }

            cc.log("【更新】版本本地存储路径 {0}".format(this._storagePath));
        } else {
            this._storagePath = "";
        }

        this._nocache = game.getLocalTime();
        this._ad = new AssetsDownload();

        this._moduleName = moduleName; // 模块名
        this._moduleManifest = LOCAL_STORAGE_KEY_PROJECT + "_" + moduleName;
        this._moduleState = LOCAL_STORAGE_KEY_UPDATE_STATE + "_" + moduleName;

        this._appManifest; // 安装里的清单数据（JSON)
        this._localManifest; // 本地存储里的清单数据（JSON)
        this._remoteManifest; // 远程更新服务器的清单数据（JSON)

        this._progress = 0; // 更新进度
        this._isUpdate = true; // 是否正在更新中

        this._loadLocalManifest(MODULE_PROJECT_MANIFEST_PATH.format(moduleName));
    },

    /** 开始更新版本 */
    update: function update() {
        // 获取本地存储更新状态数据，如果有则继续上次的更新，无则下载远程服务器版本清单数据
        var tempManifest = cc.sys.localStorage.getItem(this._moduleState);
        if (tempManifest == null) {
            var complete = function (content) {
                // 解析远程资源清单数据
                try {
                    this._remoteManifest = JSON.parse(content);
                } catch (e) {
                    cc.error("【更新】远程路版本清单数据解析错误");
                }

                // 分析并下载资源
                this._downloadAssets();
            }.bind(this);

            var error = function (error) {
                cc.log("【更新】获取远程路径为 {0} 的版本清单文件失败".format(this._remoteManifest.remoteManifest));

                this._isUpdate = false;

                this._dispatchEvent(game.AssetEvent.REMOTE_PROJECT_MANIFEST_LOAD_FAILD);
            }.bind(this);

            if (game.config.textUpdate) this._localManifest.server = game.AssetConfig.testCdn;

            var url = this._localManifest.server + game.AssetConfig.line + "/" + this._localManifest.remoteManifest;
            game.http.get(this._noCache(url), complete, error);
        } else {
            cc.log("【更新】获取上次没更新完的版本清单更新状态");

            this._remoteManifest = JSON.parse(tempManifest);

            // 分析并下载资源
            this._downloadAssets();
        }
    },

    /** 加载本地项目中资源清单数据 */
    _loadLocalManifest: function _loadLocalManifest(appManifestPath) {
        // 加载本地项目中资源清单数据
        cc.loader.loadRes(appManifestPath, function (error, content) {
            if (error) {
                cc.log("【更新】获取游戏中路安装包中路径为 {0} 的资源清单文件失败".format(appManifestPath));
                this._dispatchEvent(game.AssetEvent.LOCAL_PROJECT_MANIFEST_LOAD_FAIL);
                return;
            }

            // 安装包中版本清单数据解析
            try {
                this._appManifest = JSON.parse(content);
            } catch (e) {
                cc.error("【更新】安装包中的版本清单数据解析错误");
            }

            // 获取本地存储中版本清单数据（上次更新成功后的远程清单数据）
            var data = cc.sys.localStorage.getItem(this._moduleManifest);
            if (data) {
                try {
                    this._localManifest = JSON.parse(data);
                } catch (e) {
                    cc.error("【更新】本地版本清单数据解析错误");
                }

                // 安装包中的版本高于本地存储版本，则替换本地存储版本数据
                if (this._localManifest.version < this._appManifest.version) {
                    // 删除本地存储中的当前模块的旧的资源
                    for (var key in this._localManifest.assets) {
                        var filePath = cc.path.join(this._storagePath, key);
                        if (jsb.fileUtils.isFileExist(filePath)) {
                            jsb.fileUtils.removeFile(filePath);
                        }
                    }

                    cc.log("【更新】安装包的版本号为{0}，本地存储版本号为{1}，替换本地存储版本数据".format(this._appManifest.version, this._localManifest.version));
                    this._localManifest = this._appManifest;
                }
            } else {
                cc.log("【更新】第一次安装，获取安装版中的版本清单数据");
                this._localManifest = this._appManifest;
            }

            // 检查版本号
            this._checkVersion();
        }.bind(this));
    },

    /** 检查版本号 */
    _checkVersion: function _checkVersion() {
        var complete = function (content) {
            /** 远程版本数据解析 */
            try {
                var remoteVersion = JSON.parse(content);

                // 游戏中路资源版本小于远程版本时，提示有更新
                if (game.AssetConfig.debugVersion || this._localManifest.version < remoteVersion.version) {
                    cc.log("【更新】当前版本号为 {0}，服务器版本号为 {1}, 有新版本可更新".format(this._appManifest.version, remoteVersion.version));
                    this._dispatchEvent(game.AssetEvent.NEW_VERSION_FOUND); // 触发有新版本事件
                } else {
                    cc.log("【更新】当前为最新版本");
                    this._isUpdate = false;
                    this._dispatchEvent(game.AssetEvent.NEW_VERSION); // 触发已是最新版本事件
                }
            } catch (e) {
                cc.error("【更新】远程路版本数据解析错误");
            }
        }.bind(this);

        var error = function (error) {
            cc.log("【更新】获取远程路径为 {0} 的版本文件失败".format(this._localManifest.remoteVersion));
            this._isUpdate = false;
            this._dispatchEvent(game.AssetEvent.REMOTE_VERSION_MANIFEST_LOAD_FAILD);
        }.bind(this);

        if (game.config.textUpdate) this._localManifest.server = game.AssetConfig.testCdn;

        // 获取远程版本数据
        var url = this._localManifest.server + game.AssetConfig.line + "/" + this._localManifest.remoteVersion;
        game.http.get(this._noCache(url), complete, error);
    },

    /** 开始下载资源 */
    _downloadAssets: function _downloadAssets() {
        // 触发热更进度事件
        this._ad.onProgress = function (relativePath, percent) {
            this._progress = percent;

            // 记录当前更新状态，更新失败时做为恢复状态使用
            this._remoteManifest.assets[relativePath].state = true;
            cc.sys.localStorage.setItem(this._moduleState, JSON.stringify(this._remoteManifest));

            this._dispatchEvent(game.AssetEvent.PROGRESS);
        }.bind(this);

        // 触发热更完成事件
        this._ad.onComplete = function () {
            this._isUpdate = false;

            // 删除更新状态数据 
            cc.sys.localStorage.removeItem(this._moduleState);

            // 更新本地版本清单数据，用于下次更新时做版本对比
            for (var key in this._remoteManifest.assets) {
                var asset = this._remoteManifest.assets[key];
                if (asset.state) delete asset.state;
            }
            cc.sys.localStorage.setItem(this._moduleManifest, JSON.stringify(this._remoteManifest));

            // 触发热更完成事件
            this._dispatchEvent(game.AssetEvent.SUCCESS);
        }.bind(this);

        // 触发热更失败事件
        this._ad.onFaild = function () {
            this._isUpdate = false;
            this._dispatchEvent(game.AssetEvent.FAILD);
        }.bind(this);

        // 触发断网事件
        this._ad.onNoNetwork = function () {
            this._isUpdate = false;
            this._dispatchEvent(game.AssetEvent.NO_NETWORK);
        }.bind(this);

        this._ad.download(this._storagePath, this._localManifest, this._remoteManifest);
    },

    /** 断网后恢复状态 */
    recovery: function recovery() {
        this._ad.recovery();
    },

    /**
     * 触发事件
     * @param type(string)      事件类型
     * @param args(object)      事件参数
     */
    _dispatchEvent: function _dispatchEvent(type, args) {
        var event = new cc.Event.EventCustom();
        event.type = type;
        event.bubbles = false;
        event.target = this;
        event.currentTarget = this;
        this.dispatchEvent(event);
    },

    /** 规避 HTTP 缓存问题 */
    _noCache: function _noCache(url) {
        return url + "?t=" + this._nocache;
    }
});

/** 验证是否有覆盖安装，安装包中版本高于本地资源时，删除本地资源的模块资源 */
AssetsManager.check = function (remoteVersion) {
    var moduleTotal = 0;
    var moduleCurrent = 0;

    // 加载安装包中的版本清单文件
    var loadAppManifest = function loadAppManifest(moduleName, modules, versions, remoteVersion) {
        var appManifestPath = MODULE_PROJECT_MANIFEST_PATH.format(moduleName);
        cc.loader.loadRes(appManifestPath, function (error, content) {
            if (error) {
                cc.error("【更新】验证是否有覆盖安装时，获取游戏中路安装包中路径为 {0} 的资源清单文件失败".format(appManifestPath));
                return;
            }

            var storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + LOCAL_STORAGE_FOLDER;
            var appManifest = JSON.parse(content);
            var appVersion = appManifest.version;

            // 获取本地版本清单信息
            var moduleManifest = LOCAL_STORAGE_KEY_PROJECT + "_" + moduleName;
            var manifest = cc.sys.localStorage.getItem(moduleManifest);
            if (manifest) {
                var localManifest = JSON.parse(manifest);
                var localVersion = localManifest.version;

                // 安装包中的版本高于本地存储版本，则替换本地存储版本数据
                if (localVersion < appVersion) {
                    // 删除本地存储中的当前模块的旧的资源
                    for (var key in localManifest.assets) {
                        var filePath = cc.path.join(storagePath, key);
                        if (jsb.fileUtils.isFileExist(filePath)) {
                            jsb.fileUtils.removeFile(filePath);
                        }
                    }

                    versions[moduleName] = appVersion; // 有本地清单数据时，当前版本号为安装包版本号
                    modules[moduleName] = modules[moduleName] > appVersion; // 有本地清单数据时，安卓包版本号小于远程版本号
                } else {
                    versions[moduleName] = localVersion; // 有本地清单数据时，当前版本号为本地版本号
                    modules[moduleName] = modules[moduleName] > localVersion; // 有本地清单数据时，本地清单版本号小于远程版本号
                }
            } else {
                versions[moduleName] = appVersion; // 没有本地清单数据时，当前版本号为安装包版本号
                modules[moduleName] = modules[moduleName] > appVersion; // 没有本地清单数据时，安卓包版本号小于远程版本号
            }

            moduleCurrent++;

            if (moduleCurrent == moduleTotal) {
                if (remoteVersion) remoteVersion(modules, versions);
            }
        });
    };

    // 游戏所有模块的配置文件
    var url = "";

    if (game.config.useSSL) {
        url = "https://{0}:3001/constinfo/version?t={1}".format(game.config.gateSocketIp, game.getLocalTime());
    } else {
        url = "http://{0}:3001/constinfo/version?t={1}".format(game.config.gateSocketIp, game.getLocalTime());
    }

    if (game.config.textUpdate) url = "http://{0}:3001/constinfo/version.json?t={1}".format(game.AssetConfig.testIp, game.getLocalTime());

    // 加载游戏模块当前最前版本号数据
    game.http.get(url, function (version_json) {
        var json = JSON.parse(version_json);
        var modules = json.modules;
        var versions = {};
        game.AssetConfig.line = json.line;

        // 计算游戏共有多少个模块
        for (var moduleName in modules) {
            moduleTotal++;
        }

        // 载入游戏所有安装包中的模块版本数据
        for (var moduleName in modules) {
            loadAppManifest(moduleName, modules, versions, remoteVersion);
        }
    }.bind(this));
};

/** 
 * 删除模块 
 * @param moduleName(string)    模块名
 */
AssetsManager.delete = function (moduleName) {
    var storagePath = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + LOCAL_STORAGE_FOLDER;
    var data = cc.sys.localStorage.getItem(LOCAL_STORAGE_KEY_PROJECT + "_" + moduleName);
    if (data) {
        try {
            var localManifest = JSON.parse(data);

            for (var key in localManifest.assets) {
                var filePath = cc.path.join(storagePath, key);
                if (jsb.fileUtils.isFileExist(filePath)) {
                    jsb.fileUtils.removeFile(filePath);
                }
            }
        } catch (e) {
            cc.error("【更新】删除模块时,本地版本清单数据解析错误");
        }

        cc.sys.localStorage.removeItem(LOCAL_STORAGE_KEY_PROJECT + "_" + moduleName);
        cc.sys.localStorage.removeItem(LOCAL_STORAGE_KEY_UPDATE_STATE + "_" + moduleName);
    }
};

game.asset = module.exports = AssetsManager;

cc._RFpop();
},{"AssetsDownload":"AssetsDownload"}],"Audio_Common":[function(require,module,exports){
"use strict";
cc._RFpush(module, '3800flTmyRCkYWQLFp2fH8z', 'Audio_Common');
// Script\Comm\Audio_Common.js

"use strict";

/**
 * Created by shrimp on 17/2/19.
 */
module.exports = {
    AUDIO_BTN_CLICK: "resources/Texture/ComScene/Sound/btnclick.mp3",
    AUDIO_BTN_BET: "resources/Texture/ComScene/Sound/coinsfly.mp3",
    AUDIO_TIME: "resources/Texture/ComScene/Sound/daojishi.mp3",
    AUDIO_SIT: "resources/Texture/ComScene/Sound/sit.mp3"
};

cc._RFpop();
},{}],"BannerListReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '12645cLro9HIIkjrJWXYEvu', 'BannerListReqPacket');
// Script\Network\Cmd\Cmd_Req\BannerListReqPacket.js

"use strict";

/**
 * Created by shrimp on 17/3/30.
 */
var MessageReq = require("MessageReq");
/*
 * type US_REQ_SCORE_LIST_T struct {
 JsonHead
 Param PARAM_REQ_SCORE_LIST_T `json:"param"`
 }
 type PARAM_REQ_SCORE_LIST_T struct {
 IsCreate int8 `json:"iscreate` //0：参与的牌局, 1: 创建的牌局
 Start    int  `json:"start"`   //从哪里开始
 Total    int  `json:"total"`   //多少个
 }
 }

 * */

function BannerListReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_BANNER_LIST_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("BannerListReqPacket.send");
        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = BannerListReqPacket;

cc._RFpop();
},{"MessageReq":"MessageReq"}],"BannerListRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '04e70mKDuhNNIQZ7rfL/dwt', 'BannerListRespPacket');
// Script\Network\Cmd\Cmd_Resp\BannerListRespPacket.js

"use strict";

/**
 * Created by shrimp on 17/3/30.
 */

var MessageResp = require("MessageResp");

/*
 * 
 * 
type US_RESP_BANNER_LIST_T struct {
   JsonHead
   RespHead
   List []BANNER_INFO_T `json:"list"`
}
type BANNER_INFO_T struct {
   Title   string `json:"title"`
   Pic     string `json:"pic"`
   JumpUrl string `json:"jumpurl"`
}

 */

function BannerListRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_BANNER_LIST_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.bannerlist = msg.list;
        //var json = JSON.parse(BASE64.decoder(msg.param));
    };
}

module.exports = BannerListRespPacket;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"BasePop":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0b1c6oqQyFPI7nx8EtQF8o6', 'BasePop');
// Script\ComScene\PopView\BasePop.js

'use strict';

var BaseView = require("BaseView");
var SocketManager = require('SocketManager');
var MessageFactory = require('MessageFactory');

cc.Class({
    extends: cc.Component,

    properties: {
        bg: {
            default: null,
            type: cc.Node
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        cc.log("BasePop");
        this.localMessageListenerID = -1;
        this.httpMessageListenerID = -1;
        this.socketMessageListenerID = -1;

        // socket消息
        this.addSocketListener();

        // http消息
        this.addHttpListener();

        // 本地消息监听
        this.addLocalMessageListener();

        cc.log('BasePop:onLoad');

        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            cc.log("stop event");
            event.stopPropagation();
        }.bind(this));
    },

    onDestroy: function onDestroy() {
        cc.log('BasePop:onDestroy');

        cc.log("BasePop.socketMessageListenerID=", this.httpMessageListenerID);
        if (this.httpMessageListenerID != -1) {
            GlobalEventManager.getInstance().removeListener(this.httpMessageListenerID);
            this.httpMessageListenerID = -1;
        }

        cc.log("BasePop.localMessageListenerID=", this.localMessageListenerID);
        if (this.localMessageListenerID != -1) {
            GlobalEventManager.getInstance().removeListener(this.localMessageListenerID);
            this.localMessageListenerID = -1;
        }

        cc.log("BasePop.socketMessageListenerID=", this.socketMessageListenerID);
        if (this.socketMessageListenerID != -1) {
            GlobalEventManager.getInstance().removeListener(this.socketMessageListenerID);
            this.socketMessageListenerID = -1;
        }
    },

    //socket消息
    addSocketListener: function addSocketListener() {
        var self = this;
        this.socketMessageListenerID = GlobalEventManager.getInstance().addEventListener(window.SocketMessage, function (event) {
            if (event == undefined) {
                return;
            }
            var type = event.tag;
            //连接服务器成功
            if (type == window.MessageType.SOCKET_CONNECTED) {}
            //断开连接
            else if (type == window.MessageType.SOCKET_DISCONNECTED) {}
                //连接中
                else if (type == window.MessageType.SOCKET_CONNECTING) {}
                    //连接失败
                    else if (type == window.MessageType.MSG_NETWORK_FAILURE) {}
                        //收到消息
                        else if (type == window.MessageType.SOCKET_MESSAGE) {
                                self.onMessage(event);
                            } else if (type == window.MessageType.SCENE_MSG) {
                                self.onSceneMsg(event);
                            }
        }, this);
        cc.log("BasePop.socketMessageListenerID=", this.socketMessageListenerID);
    },

    //http消息监听
    addHttpListener: function addHttpListener() {
        var self = this;
        this.httpMessageListenerID = GlobalEventManager.getInstance().addEventListener(window.HttpMessage, function (event) {
            if (event == undefined) {
                return;
            }

            var tag = event.tag;

            if (tag == window.HttpMessageType.HTTP_NOTIFICATION) {
                self.onHttpResponse(event.msg);
            } else if (tag == window.HttpMessageType.NOTIFY_HTTP_RSP_ERROR) {}
        }, this);
        cc.log("BasePop.socketMessageListenerID=", this.httpMessageListenerID);
    },

    //本地消息监听
    addLocalMessageListener: function addLocalMessageListener() {
        var self = this;
        this.localMessageListenerID = GlobalEventManager.getInstance().addEventListener(window.LocalMessage, function (event) {
            self.onLocalMessage(event);
        }, this);
        cc.log("BasePop.localMessageListenerID=", this.localMessageListenerID);
    },

    onMessage: function onMessage(event) {},

    onLocalMessage: function onLocalMessage(event) {
        if (event == undefined) {
            return;
        }
        var tag = event.tag;

        if (tag == window.LocalMsgType.SENDMSG_TIMEOUT) {
            this.msgSendTimeOut();
        } else if (tag == window.LocalMsgType.UPDATE_USERINFO) {}
    },

    onHttpResponse: function onHttpResponse(event) {
        if (event == undefined) {
            return;
        }
        if (!event.isSucceed) {
            return;
        }
    },

    onSceneMsg: function onSceneMsg(event) {},

    scaleTo: function scaleTo(node, flag) {
        node.setScale(0);
        var scaleT0 = null;
        if (flag) {
            scaleT0 = cc.scaleTo(0.1, 1.0).easing(cc.easeBackOut());
        } else {
            scaleT0 = cc.scaleTo(0.1, 0.8).easing(cc.easeBackOut());
        }

        node.runAction(scaleT0);
    },

    getUserDetail: function getUserDetail() {
        cc.log("BaseScene.getUserDetail");
        var detail = MessageFactory.createMessageReq(window.US_REQ_USER_DETAIL_CMD_ID);
        if (detail) {
            detail.send();
        }
    },

    LeftInTo: function LeftInTo(node) {
        var winSize = cc.director.getWinSize();
        //node.position.x = node.position.x - winSize.width;
        //node.setPositionX(node.position.x - winSize.width);
        node.runAction(cc.moveTo(0.1, cc.p(node.position.x + winSize.width, node.position.y)));
    },

    dismiss: function dismiss() {
        cc.log('BasePop:dismiss');
        this.node.removeFromParent(true);
        this.destroy();
    }
});

cc._RFpop();
},{"BaseView":"BaseView","MessageFactory":"MessageFactory","SocketManager":"SocketManager"}],"BaseScene":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c4f9aydep5Aj6D+iI/Nl3xV', 'BaseScene');
// Script\ComScene\SceneView\BaseScene.js

'use strict';

var BaseView = require("BaseView");
var MessageFactory = require('MessageFactory');
var SocketManager = require('SocketManager');
var ToastView = require('ToastView');
var AlertView = require('AlertView');
var GameSystem = require('GameSystem');
var GamePlayer = require('GamePlayer');
var LoadingView = require('LoadingView');

cc.Class({
    extends: cc.Component,

    // properties:
    // {
    //     m_sendHeartBeat        : true ,
    // },

    initBaseInfo: function initBaseInfo() {
        this.pToastView = null;
        this.m_pNetAlert = null;
        this.changeHouTai = false;

        this.bBeginHeart = false;
        this.NowReconnect = false;
        this.isGaming = false;

        this.netReStartCnt = 0;
        this.netCount = 0;
        this.netTimeTotal = 0;
        this.disNetTime = 0;
        this.netStrength = 0;
        this.m_llSendTime = 0, this.localMessageListenerID = 0;
        this.httpMessageListenerID = 0;
        this.socketMessageListenerID = 0;
        this.GameInfoListenerID = 0;

        this.m_isNetConnecting = true;

        this.isOnLine = true;
        this.onGameBack = false;
    },

    // use this for initialization
    onLoad: function onLoad() {
        cc.log("BaseScene.onLoad");
        this.initBaseInfo();
        //socket消息
        this.addSocketListener();
        //http消息
        this.addHttpListener();
        //本地消息监听
        this.addLocalMessageListener();
        //引擎信息
        this.addGameInfoListener();

        //场景切换需要重新设置心跳
        if (SocketManager.getInstance().isConnected()) {
            this.startHeartBeat();
        }
    },

    onDestroy: function onDestroy() {
        cc.log("BaseScene.onDestroy");
        this.unschedule(this.sendHeartBeat);

        GlobalEventManager.getInstance().removeListener(this.httpMessageListenerID);
        GlobalEventManager.getInstance().removeListener(this.localMessageListenerID);
        GlobalEventManager.getInstance().removeListener(this.socketMessageListenerID);
        GlobalEventManager.getInstance().removeListener(this.GameInfoListenerID);
    },

    addGameInfoListener: function addGameInfoListener() {
        cc.log("BaseScene.addGameInfoListener");
        var self = this;
        this.GameInfoListenerID = window.GlobalEventManager.getInstance().addEventListener(window.GameEngineInfo, function (event) {
            if (event) {
                var tag = event.tag;
                if (tag == window.GameInfo.GameHide) {
                    self.onPause();
                } else if (tag == window.GameInfo.GameShow) {
                    self.onResume();
                } else if (tag == window.GameInfo.NetOnline) {
                    self.onNetOnline();
                } else if (tag == window.GameInfo.NetOffline) {
                    self.onNetOffline();
                }
            }
        }, this);
    },

    onPause: function onPause() {
        cc.warn("游戏暂停");
        this.onGameBack = true;
        cc.audioEngine.pauseAll();
        cc.game.pause();
        SocketManager.getInstance().disconnect();
    },

    onResume: function onResume() {
        cc.warn("游戏恢复");
        this.onGameBack = false;
        cc.audioEngine.resumeAll();
        cc.game.resume();
        if (GameSystem.getInstance().bLogin) {
            if (!SocketManager.getInstance().isConnected()) {
                this.changeHouTai = true;
                SocketManager.getInstance().reStartSocket();
            }
        }
    },

    onNetOffline: function onNetOffline() {

        cc.warn("网络断开");
        this.isOnLine = false;
        // SocketManager.getInstance().disconnect();
        // ToastView.show("网络连接中断，请检查网络!")
    },

    onNetOnline: function onNetOnline() {
        cc.warn("网络恢复");
        this.isOnLine = true;
        if (GameSystem.getInstance().bLogin) {
            if (!SocketManager.getInstance().isConnected()) {
                this.changeHouTai = true;
                SocketManager.getInstance().reStartSocket();
                // ToastView.show("网络恢复，重新连接服务器")
            }
            //ShopModel.getInstance().updateUserInfo();
        }
        // ToastView.show("网络恢复")
    },

    update: function update(dt) {},

    //socket消息
    addSocketListener: function addSocketListener() {
        cc.log("BaseScene.addSocketListener");
        var self = this;
        this.socketMessageListenerID = GlobalEventManager.getInstance().addEventListener(window.SocketMessage, function (event) {

            if (event == undefined) {
                return;
            }
            var type = event.tag;
            //连接服务器成功
            if (type == window.MessageType.SOCKET_CONNECTED) {
                self.onSocketConnected();
            }
            //断开连接
            else if (type == window.MessageType.SOCKET_DISCONNECTED) {
                    self.onSocketDisconnected();
                }
                //连接中
                else if (type == window.MessageType.SOCKET_CONNECTING) {
                        self.onSocketConnecting();
                    }
                    //连接失败
                    else if (type == window.MessageType.MSG_NETWORK_FAILURE) {}
                        //收到消息
                        else if (type == window.MessageType.SOCKET_MESSAGE) {
                                self.onMessage(event);
                            } else if (type == window.MessageType.SCENE_MSG) {
                                self.onSceneMsg(event);
                            }
        }, this);
    },

    //http消息监听
    addHttpListener: function addHttpListener() {
        cc.log("BaseScene.addHttpListener");
        var self = this;

        this.httpMessageListenerID = GlobalEventManager.getInstance().addEventListener(window.HttpMessage, function (event) {
            if (event == undefined) {
                return;
            }

            var tag = event.tag;

            if (tag == window.HttpMessageType.HTTP_NOTIFICATION) {
                self.onHttpResponse(event.msg);
            } else if (tag == window.HttpMessageType.NOTIFY_HTTP_RSP_ERROR) {}
        }, this);
    },

    //本地消息监听
    addLocalMessageListener: function addLocalMessageListener() {
        cc.log("BaseScene.addLocalMessageListener");
        var self = this;
        this.localMessageListenerID = GlobalEventManager.getInstance().addEventListener(window.LocalMessage, function (event) {
            if (event) {
                self.onLocalMessage(event);
            }
        }, this);
    },

    onSceneMsg: function onSceneMsg(event) {
        var msg = event.data;
    },

    onMessage: function onMessage(event) {
        var msg = event.data;
        var cmd = msg.cmd;
        //cc.log()
        switch (cmd) {
            case window.US_RESP_LOGIN_CMD_ID:
                //this.callUpdateMoney();
                break;

            case window.US_KICK_OUT_CMD_ID:
                this.createAlertView(msg.desc);
                break;

            case window.US_NOTIFY_OWNER_CONFIRM_SIT_CMD_ID:
                this.notifyOwnerConfirmSit(msg);
                break;

            case window.US_RESP_OWNER_CONFIRM_CMD_ID:
                this.OwnerConfirmSit(msg);
                break;

            case window.US_NOTFIY_OWNER_TABLEINFO_CMD_ID:
                this.onNotifyOwnerTableOver(msg);
                break;

            case window.US_RESP_FIND_TABLE_CMD_ID:
                this.onFindRoom(msg);
                break;

            case window.CLUB_NOTIFY_OWNER_CONFIRM_CMD_ID:
                this.onClubAddMsg(msg);
                break;

            case window.CLUB_RESP_OWNER_RM_MEMBER_CMD_ID:
                this.onClubRmMem(msg);
                break;

            case window.US_RESP_EXCHANGE_GOLD_CMD_ID:
                this.onExchangeGoldMsg(msg);
                break;

            case window.US_RESP_USER_DETAIL_CMD_ID:
                this.onUserDetail(msg);
                break;

            case US_NOTIFY_PAY_OPERATE_CMD_ID:
                this.onPayResult(msg);
                break;

            case window.US_NOTIFY_IN_GAME_CMD_ID:
                this.notifyInGame(msg);
                break;

            case window.US_RESP_CREATE_COST_CMD_ID:
                this.onCreateTableCost(msg);
                break;

            case window.US_RESP_CLUB_UPGRADE_COST_CMD_ID:
                this.onClubUpgradeCost(msg);
                break;

            case US_RESP_NEW_MSG_NUM_CMD_ID:
                this.onMimeMsgNum(msg);
                break;
            case US_RESP_BIND_REFERRAL_CMD_ID:
                this.onBingReferral(msg);
                break;
        }
        /*
        * RET_REPEAT_REGISTER         : -1000, //服务器重复注册(服务器内部消息)
         RET_NOT_CALL_BANKER         : -19,   //非抢庄状态
         RET_USER_OFFLINE            : -18,   //玩家离线
         RET_NOT_CLICK_AGAIN         : -17,   //请勿频繁点击
         RET_SEAT_HAVE_PLAYER        : -16,   //您选择的座位已经被占领,请从新选择
         RET_SEAT_NOT_EXIST          : -15,   //您选择的座位不存在
         RET_PLAYER_ACTIVE           : -14,   //您正在游戏中,不能离开
         RET_PLAYER_HAVE_LEAVE       : -13,   //您已经离开
         RET_PARAM_ERROR             : -12,   //参数错误
         RET_DESTROYED_PRIVATE_TBALE : -11,   //牌局已销毁
         RET_TABLE_FULL              : -10,   //私人房爆满
         RET_GAME_PLAYER_FULL        : -9,    //桌子里面的玩家已满
         RET_GAME_TABLE_FULL         : -8,    //游戏服务器桌子爆满
         RET_DB_ERROR                : -7,    //数据库错误
         RET_NOT_FIND_TABLE          : -6,    //桌子不存在
         RET_NOT_FIND_GAME_SERVER    : -5,    //未找到匹配服务器
         RET_SERVER_ABNORMAL         : -4,    //服务异常
         RET_USER_REPEAT_LOGIN       : -3,    //您的账号已经在其他地点登录
         RET_USERKEY_ERROR           : -2,    //用户验证失败,请重新登录
         RET_ILLEGAL_REQ             : -1,    //非法请求(如:如果头部uid,不是自己的socket链接的uid就直接返回,反漏洞)
        * */

        if (msg.code < SocketRetCode.RET_SUCCESS) {
            if (msg.code == SocketRetCode.RET_NOT_FIND_GAME_SERVER || msg.code == SocketRetCode.RET_NOT_FIND_TABLE || msg.code == SocketRetCode.RET_PARAM_ERROR) {
                cc.director.loadScene('HallScene');
            } else if (msg.code == SocketRetCode.RET_ILLEGAL_REQ || msg.code == SocketRetCode.RET_SERVER_ABNORMAL) {
                var alert = AlertView.create();
                alert.setPositiveButton(function () {
                    cc.director.loadScene('LoadingScene');
                }, "退出游戏");
                this.unschedule(this.sendHeartBeat);
                SocketManager.getInstance().disconnect();
                alert.show(msg.desc + ",请退出游戏重新进入！", AlertViewBtnType.E_BTN_CLOSE);
            } else if (msg.code == SocketRetCode.RET_USERKEY_ERROR || msg.code == SocketRetCode.RET_USER_REPEAT_LOGIN) {
                var alert = AlertView.create();
                alert.setPositiveButton(function () {
                    cc.director.loadScene('LoadingScene');
                }, "退出游戏");
                this.unschedule(this.sendHeartBeat);
                SocketManager.getInstance().disconnect();
                alert.show(msg.desc + ",请退出游戏重新进入！", AlertViewBtnType.E_BTN_CLOSE);
            } else {
                this.createAlertView(msg.desc);
            }
            LoadingView.dismiss();
        }
    },

    onBingReferral: function onBingReferral(msg) {

        if (msg.code < SocketRetCode.RET_SUCCESS) return;
        GameSystem.getInstance().referralCode = msg.referralid;
        ToastView.show("绑定成功");
    },

    onPayResult: function onPayResult(msg) {
        var alert = AlertView.create();
        // alert.show("您花费了¥" + msg.param.cost + "购买了" + msg.param.opdiamond + "个钻石，已成功到账", AlertViewBtnType.E_BTN_CLOSE);
        alert.show(msg.param.desc);
        this.getUserDetail();
    },

    onCreateTableCost: function onCreateTableCost(msg) {
        cc.log("HallScene.onCreateTableCost code=", msg.code);
        if (msg.code != SocketRetCode.RET_SUCCESS) return;
        GameSystem.getInstance().BullFightTableCost = msg.list;
    },

    onClubUpgradeCost: function onClubUpgradeCost(msg) {
        cc.log("HallScene.onClubUpgradeCost code=", msg.code);
        if (msg.code = SocketRetCode.RET_SUCCESS) return;

        GameSystem.getInstance().ClubUpgradeCost = msg.list;
        cc.log("HallScene.onClubUpgradeCost list=", msg.list);
    },

    onMimeMsgNum: function onMimeMsgNum(msg) {
        GameSystem.getInstance().NewMsgNum = false;
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            if (msg.sysnum > 0 || msg.clubnum > 0 || msg.mailnum > 0) {
                GameSystem.getInstance().NewMsgNum = true;
            }
        }
        cc.log("onMimeMsgNum sysnum=", msg.sysnum, " clubnum=", msg.clubnum, " mailnum=", msg.mailnum);
    },

    onUserDetail: function onUserDetail(msg) {
        cc.log("HallScene.onUserDetail");
        GamePlayer.getInstance().gold = msg.gold;
        GamePlayer.getInstance().diamond = msg.diamond;
    },

    onExchangeGoldMsg: function onExchangeGoldMsg(msg) {
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            var alert = AlertView.create();
            alert.show(msg.tips, AlertViewBtnType.E_BTN_CLOSE);
            this.getUserDetail();
        }
    },

    onClubAddMsg: function onClubAddMsg(msg) {
        var self = this;

        var uid = msg.param.uid;
        var name = msg.param.name;
        var clubname = msg.param.clubname;
        var alert = AlertView.create();
        alert.setPositiveButton(function () {
            self.sendClubOwnerConfirm(1, uid, msg.clubid);
        }, "同意");
        alert.setNegativeButton(function () {
            self.sendClubOwnerConfirm(0, uid, msg.clubid);
        }, "拒绝");

        alert.show(name + "(" + msg.param.uid + ")" + "申请加入您的'" + clubname + "'俱乐部，是否同意？", AlertViewBtnType.E_BTN_CANCLE);
    },

    onClubRmMem: function onClubRmMem(msg) {
        if (msg.param.uid == GamePlayer.getInstance().uid) {
            ToastView.show("您被移除俱乐部" + msg.param.clubname + "(" + msg.param.clubid + ")");
        } else {
            ToastView.show(msg.param.name + "被移除俱乐部" + msg.param.clubname + "(" + msg.param.clubid + ")");
        }
    },

    sendClubOwnerConfirm: function sendClubOwnerConfirm(result, uid, clubid) {
        var data = {
            uid: uid,
            isallow: result };
        cc.log("BaseScene.notifyOwnerConfirmSit.data = ", JSON.stringify(data));
        MessageFactory.createMessageReq(window.CLUB_REQ_OWNER_CONFIRM_CMD_ID).send(data, clubid);
    },

    notifyInGame: function notifyInGame(msg) {
        cc.log("BaseScene.notifyInGame, msg" + msg.gamesvcid + ",tableid" + msg.tableid);
        if (msg.code > 0) {
            GameSystem.getInstance().gamesvcid = msg.gamesvcid;
            GameSystem.getInstance().tableid = msg.tableid;
            cc.director.loadScene('Bullfight_GameScene');
        }
    },

    onFindRoom: function onFindRoom(msg) {
        cc.log("HallScene.onFindRoom,msg" + msg.gamesvcid + ",tableid" + msg.tableid);
        LoadingView.dismiss();
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            GameSystem.getInstance().gamesvcid = msg.gamesvcid;
            GameSystem.getInstance().tableid = msg.tableid;

            cc.director.loadScene('Bullfight_GameScene');
        }
    },

    onNotifyOwnerTableOver: function onNotifyOwnerTableOver(msg) {
        cc.log("BaseScene.onNotifyOwnerTableOver");

        if (msg.code == SocketRetCode.RET_SUCCESS) {
            var data = {
                gamesvcid: msg.gamesvcid,
                tableid: msg.tableid,
                privateid: msg.privateid
            };

            var alert = AlertView.create();
            alert.setPositiveButton(function () {
                self.sendFindTable(1, data);
            }, "进入游戏");
            alert.setNegativeButton(function () {}, "取消");

            alert.show("房间：" + msg.tableid + "(" + msg.tablename + "),剩余" + msg.remaintime + "秒就要结束了，是否立刻进入房间？", AlertViewBtnType.E_BTN_CANCLE);
        }
    },

    sendFindTable: function sendFindTable(data) {
        cc.log("BaseScene.sendFindTable,roomId = " + data.privateid);
        var createRoom = MessageFactory.createMessageReq(window.US_REQ_FIND_TABLE_CMD_ID);
        var data = {
            privateid: data.privateid
        };
        if (createRoom) {
            createRoom.send(data);
        }
    },

    notifyOwnerConfirmSit: function notifyOwnerConfirmSit(msg) {
        cc.log("BaseScene.notifyOwnerConfirmSit,msg = " + msg.gamesvcid);

        var self = this;

        var data = {
            gamesvcid: msg.gamesvcid,
            tableid: msg.tableid,
            playeruid: msg.sitUid,
            privateid: msg.privateid
        };

        var alert = AlertView.create();
        alert.setPositiveButton(function () {
            self.sendOwnerConfirm(1, data);
        }, "同意");
        alert.setNegativeButton(function () {
            self.sendOwnerConfirm(2, data);
        }, "拒绝");

        var show = msg.name + "(" + msg.sitUid + ")申请携带" + msg.coin + "牛友币进入您" + msg.privateid + "(" + msg.tablename + ")牌局,是否同意?";

        alert.show(show, AlertViewBtnType.E_BTN_CANCLE);
    },

    sendOwnerConfirm: function sendOwnerConfirm(result, data) {
        var data = {
            gamesvcid: data.gamesvcid,
            tableid: data.tableid,
            playeruid: data.playeruid,
            privateid: data.privateid,
            result: result };

        cc.log("BaseScene.sendOwnerConfirm.data = ", JSON.stringify(data));
        MessageFactory.createMessageReq(window.US_REQ_OWNER_CONFIRM_CMD_ID).send(data);
    },

    OwnerConfirmSit: function OwnerConfirmSit(msg) {
        cc.log("BaseScene.OwnerConfirmSit");
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            ToastView.show(msg.desc);
        }
    },

    createAlertView: function createAlertView(desc) {
        cc.log("BaseScene.createAlertView,desc = " + desc);
        ToastView.show(desc, 2);
    },

    onLocalMessage: function onLocalMessage(event) {
        cc.log("BaseScene.onLocalMessage");
        if (event == undefined) {
            return;
        }
        var tag = event.tag;

        if (tag == window.LocalMsgType.SENDMSG_TIMEOUT) {
            this.msgSendTimeOut();
        } else if (tag == window.LocalMsgType.UPDATE_USERINFO) {}
    },

    onHttpResponse: function onHttpResponse(event) {
        cc.log("BaseScene.onHttpResponse");
        if (!event.isSucceed) {
            return;
        }
    },

    reStartSocket: function reStartSocket() {
        cc.log("BaseScene.reStartSocket");
        this.m_llSendTime = -1;
        SocketManager.getInstance().reStartSocket();
    },

    startHeartBeat: function startHeartBeat() {
        cc.log("BaseScene.startHeartBeat");
        this.schedule(this.sendHeartBeat, window.HEART_BEAT_TIME);
    },

    sendHeartBeat: function sendHeartBeat() {
        cc.log("BaseScene.sendHeartBeat");
        if (SocketManager.getInstance().isConnected()) {
            var msg = MessageFactory.createMessageReq(window.US_REQ_HEARTBEAT_CMD_ID);
            if (msg) {
                this.m_llSendTime = new Date().getTime();;
                msg.send();
                this.bBeginHeart = true;
            } else {
                cc.log("BaseScene.sendHeartBeat,msg = null");
            }
        } else {
            cc.warn("BaseScene.sendHeartBeat,服务器尚未连接，心跳发送失败");
        }
    },

    onCheckNetReStart: function onCheckNetReStart() {
        cc.log("BaseScene.onCheckNetReStart");
        this.netReStartCnt++;
        if (this.netReStartCnt % 6 == 0) {
            this.reStartSocket();
        }

        if (this.netReStartCnt == 18) {
            this.netReStartCnt = 0;
            GlobalEventManager.getInstance().emitEvent(window.LocalMessage, { tag: window.LocalMsgType.SENDMSG_TIMEOUT });
            this.unschedule(this.onCheckNetReStart);
        }
    },

    msgSendTimeOut: function msgSendTimeOut() {
        cc.log("BaseScene.msgSendTimeOut");
        this.reconnect_times = 5;
        this.reStartSocket();

        this.unschedule(this.sendHeartBeat);

        this.NowReconnect = true;
        var text = "您的网络连接超时，正在疯狂尝试恢复" + 6;
        this.pToastView = ToastView.show(text, 6);

        this.disNetTime = 6;
        this._dNetCount = 0;
        this.schedule(this.reDisConTime, 1);
    },

    reDisConTime: function reDisConTime() {
        cc.log("BaseScene.reDisConTime");
        if (this.pToastView) {
            this.disNetTime -= 1;
            var text = "您的网络连接超时，正在疯狂尝试恢复 " + this.disNetTime;
            //this.pToastView.setTips(text);
            this._dNetCount++;

            if (this.disNetTime <= 0) {
                this.unschedule(this.reDisConTime);
                this.pToastView.removeFromParent(true);
                this.pToastView = null;
                this.reconnect_times = 5;

                this.m_pNetAlert = AlertView.create();

                this.m_pNetAlert.setPositiveButton(this.replyReConnectYes);
                this.m_pNetAlert.setNegativeButton(this.replyReConnectNo);
                this.m_pNetAlert.show("网络连接超时，您需要继续恢复游戏吗？", AlertViewBtnType.E_BTN_CANCLE, this);
            }
        }
    },

    replyReConnectYes: function replyReConnectYes() {
        cc.log("BaseScene.replyReConnectYes");
        this.m_pNetAlert = null;
        GlobalEventManager.getInstance().emitEvent(window.LocalMessage, { tag: window.LocalMsgType.SENDMSG_TIMEOUT });
    },

    replyReConnectNo: function replyReConnectNo() {
        cc.log("BaseScene.replyReConnectNo");
        cc.director.loadScene('hall');
    },

    sendLoginHall: function sendLoginHall() {
        cc.log("BaseScene.sendLoginHall");
        var login = MessageFactory.createMessageReq(window.US_REQ_LOGIN_CMD_ID);
        if (login) {
            login.send();
        }
    },

    getUserDetail: function getUserDetail() {
        cc.log("BaseScene.getUserDetail");
        var detail = MessageFactory.createMessageReq(window.US_REQ_USER_DETAIL_CMD_ID);
        if (detail) {
            detail.send();
        }
    },

    onSocketDisconnected: function onSocketDisconnected() {
        cc.log("BaseScene.onSocketDisconnected");
        this.unschedule(this.sendHeartBeat);

        if (!this.onGameBack) {
            this.scheduleOnce(this.callLoginServer, 1);
        }
    },

    onSocketConnecting: function onSocketConnecting() {
        cc.log("BaseScene.onSocketConnecting");
        this.unschedule(this.sendHeartBeat);
        ToastView.show("连接中..."); //
    },

    onSocketConnected: function onSocketConnected() {
        cc.log("BaseScene.onSocketConnected");
        this.unschedule(this.callLoginServer);
        this.reconnect_times = 5;
        this.NowReconnect = false;

        this.sendLoginHall();

        this.startHeartBeat();

        this.unschedule(this.waitReConnect);
        this.unschedule(this.reDisConTime);
        this.unschedule(this.onCheckNetReStart);
        this.unschedule(this.reAllDisConTime);

        if (this.pToastView) {
            this.pToastView.removeFromParent(true);
            this.pToastView = null;

            ToastView.show("连接成功，正在回到游戏");
        } else {
            if (this.changeHouTai) {
                this.changeHouTai = false;
                ToastView.show("连接成功");
            }
        }

        if (this.m_pNetAlert) {
            this.m_pNetAlert.removeFromParent(true);
            this.m_pNetAlert = null;
        }
    },

    waitReConnect: function waitReConnect() {},

    reAllDisConTime: function reAllDisConTime() {
        cc.log("BaseScene.reAllDisConTime");
        if (this.m_pNetAlert) {
            this.m_pNetAlert.removeFromParent(true);
            this.m_pNetAlert = null;
        }

        // var pAlert = AlertView.create();
        // pAlert.setPositiveButton(this.replyReConnectNo);
        // pAlert.show("您的游戏由于短线而中断，无法重新连接到游戏？", this);
        // this.scheduleOnce(this.gotoHallUpdate, 2);
    },

    gotoHallUpdate: function gotoHallUpdate() {
        cc.log("BaseScene.gotoHallUpdate");
        this.unschedule(this.gotoHallUpdate);
        this.NowReconnect = false;
        cc.director.loadScene("hall");
        this.bCheckConnect = true;
    },
    onUpdateUserInfo: function onUpdateUserInfo() {
        // var money = GamePlayer.getInstance().Money() ;
        // GamePlayer.getInstance().SetMoney(money);

    },

    UpdateDeviceStatus: function UpdateDeviceStatus() {},

    updatePlayerMoney: function updatePlayerMoney(msg) {
        // if (msg.ret.retCode >= window.RET_OK)
        // {
        //     if(msg.uid == GamePlayer.getInstance().uid)
        //     {
        //         if(msg.type == 1)
        //         {
        //             GamePlayer.getInstance().SetMoney(msg.money);
        //         }
        //         else if(msg.type == 2)
        //         {
        //             GamePlayer.getInstance().freezemoney = msg.money;
        //         }

        //         GlobalEventManager.getInstance().emitEvent(window.LocalMessage,{tag:window.LocalMsgType.UPDATE_USERINFO});
        //     }

        // }
    },
    updateHeartBeat: function updateHeartBeat(msg) {
        var netDelta = new Date().getTime - this.m_llSendTime;
        this.netTimeTotal += netDelta;
        this.netCount++;

        if (this.netCount > 5) {
            //  this.sendNetStrength(this.netTimeTotal);
            this.netTimeTotal = 0;
            this.netCount = 0;
        }

        this.bBeginHeart = false;
    },

    updateOfflineReult: function updateOfflineReult(msg) {
        // OfflineResultPacket* packet = (OfflineResultPacket*)msg;
        // if (msg.ret.retCode == window.RET_OK)
        // {
        //     if(0 != msg.isWin)
        //     {

        //         var strMsg = msg.strInfo.msg;

        //         var alert = AlertView.create();
        //         alert.setPositiveButton();
        //         alert.show(strMsg,"txz.png",false,null,true, packet.isWin);

        //     }
        // }
    },

    callUpdateMoney: function callUpdateMoney() {
        //update money
        // var msg = MessageFactory.createCommonMessage(window.UPDATE_PLAYER_MONEY);
        // if(msg){
        //     msg.send(1);
        // }
    },

    callLoginServer: function callLoginServer() {

        if (GameSystem.getInstance().bLogin) {
            if (!SocketManager.getInstance().isConnected()) {
                cc.log("LoadingView.callbackBtnLogin callLoginServer");
                SocketManager.getInstance().startSocket();
            }
        }
    }

});

cc._RFpop();
},{"AlertView":"AlertView","BaseView":"BaseView","GamePlayer":"GamePlayer","GameSystem":"GameSystem","LoadingView":"LoadingView","MessageFactory":"MessageFactory","SocketManager":"SocketManager","ToastView":"ToastView"}],"BaseView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '86c1a+Knj5JqoxwJvVsEgr2', 'BaseView');
// Script\ComScene\BaseView.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function onLoad() {}

});

cc._RFpop();
},{}],"BindReferralReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'dc0936vqG5Htqp/w4QcQ8zd', 'BindReferralReqPacket');
// Script\Network\Cmd\Cmd_Req\BindReferralReqPacket.js

"use strict";

/**
 * Created by shrimp on 17/3/30.
 */
var MessageReq = require("MessageReq");

// // 推荐人
// type US_REQ_BIND_REFERRAL_T struct {
//     JsonHead
//     ReferralId int `json:"referralid"`
// }

function BindReferralReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_BIND_REFERRAL_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("BindReferralReqPacket.send");
        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            referralid: msg.referralid
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = BindReferralReqPacket;

cc._RFpop();
},{"MessageReq":"MessageReq"}],"BindReferralRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '23f55pytb9Kz6akQUi7DBCT', 'BindReferralRespPacket');
// Script\Network\Cmd\Cmd_Resp\BindReferralRespPacket.js

"use strict";

/**
 * Created by shrimp on 17/3/30.
 */

var MessageResp = require("MessageResp");

function BindReferralRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_BIND_REFERRAL_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {
        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        this.referralid = msg.referralid;
    };
}
module.exports = BindReferralRespPacket;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"Bullfighgt_Menu":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'b9935YPx3dCHr1d2Knaw/Yr', 'Bullfighgt_Menu');
// Script\GameScene\Bullfight\PopView\Bullfighgt_Menu.js

'use strict';

var BasePop = require("BasePop");
var MessageFactory = require('MessageFactory');
var GamePlayer = require('GamePlayer');
var Bullfight_GameScene = require('Bullfight_GameScene');
var LoadingView = require('LoadingView');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require('GameSystem');

cc.Class({
    extends: BasePop,

    properties: {
        RuleView: cc.Prefab,
        OwnerView: cc.Prefab,
        OwnerIcon: cc.Sprite,
        OwnerText: cc.Label,
        BtnShare: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {

        this._super();
        var self = this;
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            cc.log("stop event");
            self.runOut();
        }.bind(this));
        this.initBaseData();

        cc.log("Bullfigth_Menu.onLoad bowner=" + GamePlayer.getInstance().bowner);
        if (GamePlayer.getInstance().bowner == 1 || GameSystem.getInstance().roomLevel == 2) {
            this.OwnerIcon.node.active = true;
            this.OwnerText.node.active = true;
        } else {
            this.OwnerIcon.node.active = false;
            this.OwnerText.node.active = false;
        }
        if (GameSystem.getInstance().VerStatus == GameSystem.getInstance().VerStatusType.VERSION_TYPE_AUDIT) {
            this.BtnShare.active = false;
            return;
        }
    },

    initBaseData: function initBaseData() {
        this.callBackCarry = null;
        this.tableRuleInfo = "";
    },

    setRuleInfo: function setRuleInfo(ruleInfo) {
        this.tableRuleInfo = ruleInfo;
    },

    callBackBtn: function callBackBtn(event, CustomEventData) {

        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);

        var btnName = event.target.getName();
        cc.log("Bullfight_Menu.callBackBtn,btnName = " + btnName);
        if (btnName == "BtnExit") {
            MessageFactory.createMessageReq(window.US_REQ_LEAVE_GAME_CMD_ID).send();
        } else if (btnName == "BtnStandUp") {
            LoadingView.show("正在站起...");
            var data = {
                status: 2,
                seatid: GamePlayer.getInstance().seatId
            };
            MessageFactory.createMessageReq(window.US_REQ_SIT_DOWN_CMD_ID).send(data);
        } else if (btnName == "BtnSupplement") {
            this.onCallBackCarry();
        } else if (btnName == "BtnOwner") {
            var OwnerView = cc.instantiate(this.OwnerView);
            cc.director.getScene().addChild(OwnerView);
            OwnerView.setPosition(cc.p(cc.director.getVisibleSize().width / 2, cc.director.getVisibleSize().height / 2));
        } else if (btnName == "BtnRule") {
            var ruleView = cc.instantiate(this.RuleView);
            cc.director.getScene().addChild(ruleView);
            ruleView.setPosition(cc.p(cc.director.getVisibleSize().width / 2, cc.director.getVisibleSize().height / 2));
        } else if (btnName == "BtnShare") {
            cc.log("Bullfight_Menu : BtnShare");
            var message = {
                popView: "Bullfight_Menu",
                btn: "BtnShare"
            };
            GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.SCENE_MSG, data: message });
        } else if (btnName == "BtnKickGame") {
            MessageFactory.createMessageReq(window.US_REQ_DISMISS_TABLE_CMD_ID).send();
        }
        this.dismiss();
    },

    setCallBackCarry: function setCallBackCarry(callback) {
        this.callBackCarry = callback;
    },

    onCallBackCarry: function onCallBackCarry() {

        if (this.callBackCarry) {
            this.callBackCarry();
            return;
        }
    },

    runOut: function runOut() {
        var callFunc = cc.callFunc(this.dismiss, this);
        this.node.runAction(cc.sequence(cc.moveBy(0.2, cc.p(0, 697)), callFunc));
    }
});

cc._RFpop();
},{"Audio_Common":"Audio_Common","BasePop":"BasePop","Bullfight_GameScene":"Bullfight_GameScene","GamePlayer":"GamePlayer","GameSystem":"GameSystem","LoadingView":"LoadingView","MessageFactory":"MessageFactory","MusicMgr":"MusicMgr"}],"Bullfight_AudioConfig":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'fd0d3wnwW5K3aVSTxfrPtzv', 'Bullfight_AudioConfig');
// Script\GameScene\Bullfight\Common\Bullfight_AudioConfig.js

"use strict";

/**
 * Created by shrimp on 17/2/19.
 */

module.exports = {
    AUDIO_SEND_CARD: "resources/Texture/GameSscene/Bullfight/Sound/SendCard.mp3",
    AUDIO_MAN_CALLBANKER: "resources/Texture/GameSscene/Bullfight/Sound/manCallbanker.mp3",
    AUDIO_MAN_NOCALLBANKER: "resources/Texture/GameSscene/Bullfight/Sound/manNoCallbanker.mp3",
    AUDIO_MAN_BOMB: "resources/Texture/GameSscene/Bullfight/Sound/man4bomb.mp3",
    AUDIO_MAN_5FLOWER: "resources/Texture/GameSscene/Bullfight/Sound/man5flowerbull.mp3",
    AUDIO_MAN_5LITTLEBULL: "resources/Texture/GameSscene/Bullfight/Sound/man5littlebull.mp3",
    AUDIO_MAN_3AND2: "resources/Texture/GameSscene/Bullfight/Sound/manThreeWithTwo.mp3",
    AUDIO_MAN_LINE: "resources/Texture/GameSscene/Bullfight/Sound/manStraight.mp3",
    AUDIO_MAN_BULL0: "resources/Texture/GameSscene/Bullfight/Sound/manbull0.mp3",
    AUDIO_MAN_BULL1: "resources/Texture/GameSscene/Bullfight/Sound/manbull1.mp3",
    AUDIO_MAN_BULL2: "resources/Texture/GameSscene/Bullfight/Sound/manbull2.mp3",
    AUDIO_MAN_BULL3: "resources/Texture/GameSscene/Bullfight/Sound/manbull3.mp3",
    AUDIO_MAN_BULL4: "resources/Texture/GameSscene/Bullfight/Sound/manbull4.mp3",
    AUDIO_MAN_BULL5: "resources/Texture/GameSscene/Bullfight/Sound/manbull5.mp3",
    AUDIO_MAN_BULL6: "resources/Texture/GameSscene/Bullfight/Sound/manbull6.mp3",
    AUDIO_MAN_BULL7: "resources/Texture/GameSscene/Bullfight/Sound/manbull7.mp3",
    AUDIO_MAN_BULL8: "resources/Texture/GameSscene/Bullfight/Sound/manbull8.mp3",
    AUDIO_MAN_BULL9: "resources/Texture/GameSscene/Bullfight/Sound/manbull9.mp3",
    AUDIO_MAN_BULL10: "resources/Texture/GameSscene/Bullfight/Sound/manbull10.mp3",

    AUDIO_WOMAN_CALLBANKER: "resources/Texture/GameSscene/Bullfight/Sound/womanCallbanker.mp3",
    AUDIO_WOMAN_NOCALLBANKER: "resources/Texture/GameSscene/Bullfight/Sound/womanNoCallbanker.mp3",
    AUDIO_WOMAN_BOMB: "resources/Texture/GameSscene/Bullfight/Sound/woman4bomb.mp3",
    AUDIO_WOMAN_5FLOWER: "resources/Texture/GameSscene/Bullfight/Sound/woman5flowerbull.mp3",
    AUDIO_WOMAN_5LITTLEBULL: "resources/Texture/GameSscene/Bullfight/Sound/woman5littlebull.mp3",
    AUDIO_WOMAN_3AND2: "resources/Texture/GameSscene/Bullfight/Sound/womanThreeWithTwo.mp3",
    AUDIO_WOMAN_LINE: "resources/Texture/GameSscene/Bullfight/Sound/womanStraight.mp3",
    AUDIO_WOMAN_BULL0: "resources/Texture/GameSscene/Bullfight/Sound/womanbull0.mp3",
    AUDIO_WOMAN_BULL1: "resources/Texture/GameSscene/Bullfight/Sound/womanbull1.mp3",
    AUDIO_WOMAN_BULL2: "resources/Texture/GameSscene/Bullfight/Sound/womanbull2.mp3",
    AUDIO_WOMAN_BULL3: "resources/Texture/GameSscene/Bullfight/Sound/womanbull3.mp3",
    AUDIO_WOMAN_BULL4: "resources/Texture/GameSscene/Bullfight/Sound/womanbull4.mp3",
    AUDIO_WOMAN_BULL5: "resources/Texture/GameSscene/Bullfight/Sound/womanbull5.mp3",
    AUDIO_WOMAN_BULL6: "resources/Texture/GameSscene/Bullfight/Sound/womanbull6.mp3",
    AUDIO_WOMAN_BULL7: "resources/Texture/GameSscene/Bullfight/Sound/womanbull7.mp3",
    AUDIO_WOMAN_BULL8: "resources/Texture/GameSscene/Bullfight/Sound/womanbull8.mp3",
    AUDIO_WOMAN_BULL9: "resources/Texture/GameSscene/Bullfight/Sound/womanbull9.mp3",
    AUDIO_WOMAN_BULL10: "resources/Texture/GameSscene/Bullfight/Sound/womanbull10.mp3",
    AUDIO_WIN: "resources/Texture/GameSscene/Bullfight/Sound/win.mp3",
    AUDIO_LOSE: "resources/Texture/GameSscene/Bullfight/Sound/lose.mp3",
    AUDIO_GROUND_MUSIC: "resources/Texture/GameSscene/Bullfight/Sound/GameGroundMusic.mp3"
};

cc._RFpop();
},{}],"Bullfight_BetCoinReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0489cDdUs5JkqoayQIeT34b', 'Bullfight_BetCoinReqPacket');
// Script\GameScene\Bullfight\Cmd\Cmd_Req\Bullfight_BetCoinReqPacket.js

'use strict';

/**
 * Created by shrimp on 17/3/2.
 */

var MessageReq = require("MessageReq");
var Cmd_Bullfight = require('Cmd_Bullfight');
var GameSystem = require('GameSystem');

/*
* // 下注
 type SBF_REQ_BET_COIN_T struct {
 GameHead
 BetCoinMul int `json:"betcoinmul"`
 }
* */

function Bullfight_BetCoinReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = Cmd_Bullfight.SBF_REQ_BET_COIN_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            gamesvcid: GameSystem.getInstance().gamesvcid,
            tableid: GameSystem.getInstance().tableid,
            betcoinmul: msg.betcoinmul
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = Bullfight_BetCoinReqPacket;

cc._RFpop();
},{"Cmd_Bullfight":"Cmd_Bullfight","GameSystem":"GameSystem","MessageReq":"MessageReq"}],"Bullfight_BetCoinRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '832c54cihhGf4h9RpvZh33y', 'Bullfight_BetCoinRespPacket');
// Script\GameScene\Bullfight\Cmd\Cmd_Resp\Bullfight_BetCoinRespPacket.js

'use strict';

/**
 * Created by shrimp on 17/3/2.
 */

/*
* type SBF_RESP_BET_COIN_T struct {
 JsonHead
 RespHead
 BetUid     uint32 `json:"betuid"`
 BetCoinMul int `json:"betcoinmul"`
 }
* */
var MessageResp = require('MessageResp');
var Cmd_Bullfight = require('Cmd_Bullfight');
function Bullfight_BetCoinRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = Cmd_Bullfight.SBF_RESP_BET_COIN_CMD_ID;
    this.betuid = 0;
    this.betcoinmul = 0;
    //{"cmd":6619146,"seq":0,"uid":10010,"code":0,"desc":"执行成功","betuid":10011,"betcoinmul":10}
    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.betuid = msg.betuid;
        this.betcoinmul = msg.betcoinmul;
        this.tstatus = msg.tstatus;
        this.ustatus = msg.ustatus;
        //GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = Bullfight_BetCoinRespPacket;

cc._RFpop();
},{"Cmd_Bullfight":"Cmd_Bullfight","MessageResp":"MessageResp"}],"Bullfight_CallBankerReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'a3538VLEztD84ylV8uO1jcq', 'Bullfight_CallBankerReqPacket');
// Script\GameScene\Bullfight\Cmd\Cmd_Req\Bullfight_CallBankerReqPacket.js

'use strict';

/**
 * Created by shrimp on 17/3/2.
 */

/*
* / 抢庄SBF_REQ_CALL_BANKER_CMD_ID
 const (
 E_UNSEND_CALL_BANKER = 0    //未操作
 E_NOT_CALL_BANKER    = 1    //不抢
 E_NORMAL_CALL_BANKER = 2    //抢庄
 E_SUPER_CALL_BANKER  = 3    //超级抢庄
 )

 type SBF_REQ_CALL_BANKER_T struct {
 GameHead
 CallType int `json:"calltype"`
 }
* */

var MessageReq = require("MessageReq");
var Cmd_Bullfight = require('Cmd_Bullfight');
var GameSystem = require('GameSystem');

function Bullfight_CallBankerReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = Cmd_Bullfight.SBF_REQ_CALL_BANKER_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            gamesvcid: GameSystem.getInstance().gamesvcid,
            tableid: GameSystem.getInstance().tableid,
            calltype: msg.calltype
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = Bullfight_CallBankerReqPacket;

cc._RFpop();
},{"Cmd_Bullfight":"Cmd_Bullfight","GameSystem":"GameSystem","MessageReq":"MessageReq"}],"Bullfight_CallBankerRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '10c0bFjIsZBzLAj9awyKnZv', 'Bullfight_CallBankerRespPacket');
// Script\GameScene\Bullfight\Cmd\Cmd_Resp\Bullfight_CallBankerRespPacket.js

'use strict';

/**
 * Created by shrimp on 17/3/2.
 */

/*
* type SBF_RESP_CALL_BANKER_T struct {
 JsonHead
 RespHead
 TableId  int `json:"tableid"`   //桌子id
 TStatus  int `json:"tstatus"`   //桌子状态
 CallUid  uint32 `json:"calluid"`   //哪一个玩家
 SeatId   int `json:"seatid"`    //哪一个座位
 CallType int `json:"calltype"`  //抢庄类型
 IsLast   int `json:"islast"`    //是否是最后一个, 1:是, 0:不是
 }
* **/

var MessageResp = require('MessageResp');
var Cmd_Bullfight = require('Cmd_Bullfight');
function Bullfight_CallBankerRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = Cmd_Bullfight.SBF_RESP_CALL_BANKER_CMD_ID;
    this.tableid = 0;
    this.tstatus = 0;
    this.calluid = 0;
    this.seatid = 0;
    this.calltype = 0;
    this.islast = 0;
    //{"cmd":6619142,"seq":0,"uid":10010,"code":0,"desc":"","tableid":0,
    // "tstatus":0,"calluid":10011,"seatid":1,"calltype":3,"islast":1}

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.tableid = msg.tableid;
        this.tstatus = msg.tstatus;
        this.calluid = msg.calluid;
        this.seatid = msg.seatid;
        this.calltype = msg.calltype;
        this.islast = msg.islast;
    };
}

module.exports = Bullfight_CallBankerRespPacket;

cc._RFpop();
},{"Cmd_Bullfight":"Cmd_Bullfight","MessageResp":"MessageResp"}],"Bullfight_CardItem":[function(require,module,exports){
"use strict";
cc._RFpush(module, '2caa2DahaBMnLmKjNuGOWa+', 'Bullfight_CardItem');
// Script\GameScene\Bullfight\SceneView\Bullfight_CardItem.js

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

cc._RFpop();
},{"Bullfight_CostomCardType":"Bullfight_CostomCardType","Bullfight_GameScene":"Bullfight_GameScene","Poker":"Poker"}],"Bullfight_CardLayout":[function(require,module,exports){
"use strict";
cc._RFpush(module, '5d2979YT+hGAIFy//Y4TNTm', 'Bullfight_CardLayout');
// Script\GameScene\Bullfight\SceneView\Bullfight_CardLayout.js

"use strict";

/**
 * Created by shrimp on 17/3/1.
 */

cc.Class({
    extends: cc.Component,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {},

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
    // },


    sendCardAnimation: function sendCardAnimation() {
        cc.log("Bullfight_CardLayout.sendCardAnimation");
    }

});

cc._RFpop();
},{}],"Bullfight_CardType":[function(require,module,exports){
"use strict";
cc._RFpush(module, '160f0hqmHdPqLbtjZH8kM2X', 'Bullfight_CardType');
// Script\GameScene\Bullfight\Common\Bullfight_CardType.js

"use strict";

/**
 * Created by shrimp on 17/2/19.
 */

window.Bullfight_CardType = cc.Enum({
    E_BULL_ZERO: 0, //没牛
    E_BULL_ONE: 1, //牛1
    E_BULL_TWO: 2,
    E_BULL_THREE: 3,
    E_BULL_FOUR: 4,
    E_BULL_FIVE: 5,
    E_BULL_SIX: 6,
    E_BULL_SEVEN: 7,
    E_BULL_EIGHT: 8,
    E_BULL_NINE: 9,
    E_BULL_PAIR: 10, //牛对子
    E_BULL_BULL: 11, //牛牛
    E_BULL_LINE: 12, //牛顺子
    E_BULL_THREE_TWO: 13, //三带二
    E_BULL_BOMB: 14, //炸弹
    E_BULL_FIVE_KING: 15, //五花牛
    E_BULL_SMALL_FIVE: 16, //五小牛
    E_BULL_MAX: 17

});

window.Bullfight_CardTypeName = ["没牛", "牛一", "牛二", "牛三", "牛四", "牛五", "牛六", "牛七", "牛八", "牛九", "牛对子", "牛牛", "牛顺子", "三带二", "炸弹", "五花牛", "五小牛"];

cc._RFpop();
},{}],"Bullfight_CarryView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '439618RH7tPA77a3KIRdgIa', 'Bullfight_CarryView');
// Script\GameScene\Bullfight\PopView\Bullfight_CarryView.js

'use strict';

var BasePop = require('BasePop');
var GamePlayer = require('GamePlayer');
var MessageFactory = require('MessageFactory');
var ToastView = require('ToastView');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require("GameSystem");

cc.Class({
    extends: BasePop,

    properties: {
        m_iMinCarry: 100,
        m_iMaxCarry: 1000,
        CurCoin: cc.Label, //已经带入
        MyGold: cc.Label, //身上金币
        CarryRange: cc.Label, //最高带入
        TotalCoin: cc.Label, //总带入上线
        curCarry: cc.EditBox,

        m_iTimeOut: 0,
        TimeLabel: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {},

    setMinAndMax: function setMinAndMax(min, max, total) {
        cc.log("Bullfight_CarryView.setMinAndMax,min = " + min + ",max = " + max, " total=", total);
        this.m_iMinGold = min;
        this.m_iMaxGold = max;
        this.TotalCoin.string = total;
        this.CurCoin.string = GamePlayer.getInstance().TotalCarry;
        this.MyGold.string = GamePlayer.getInstance().gold;
        this.CarryRange.string = "(" + min + "~" + max + ")";
    },

    callbackBtn: function callbackBtn(event, CustomEventData) {
        var btnName = event.target.getName();
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);

        cc.log("Bullfight_CarryView.callbackBtn,btnName = " + btnName);
        if (btnName == "BtnClose") {
            this.dismiss();
        } else if (btnName == "BtnSure") {
            var coin = parseInt(this.curCarry.string);
            if (coin < this.m_iMinGold) {
                ToastView.show("您携带的牛友币不能小于" + this.m_iMinGold);
                return;
            }
            if (coin > this.m_iMaxGold) {
                ToastView.show("您携带的牛友币不能大于" + this.m_iMaxGold);
                return;
            }
            if (coin > GamePlayer.getInstance().gold) {
                ToastView.show("您拥有的牛友币不足，请前往商城购买");
                return;
            }
            var data = {
                coin: parseInt(this.curCarry.string)
            };
            MessageFactory.createMessageReq(window.US_REQ_CARRY_COIN_CMD_ID).send(data);

            this.dismiss();
        }
    },

    setCarryTime: function setCarryTime(time) {
        this.m_iTimeOut = time;
        this.node.runAction(cc.sequence(cc.delayTime(time), cc.removeSelf()));
        this.schedule(this.updateTimeOut, 1.0);
    },

    updateTimeOut: function updateTimeOut() {

        this.m_iTimeOut--;
        if (this.m_iTimeOut < 0) {
            this.unschedule(this.updateTimeOut);
            this.dismiss();
        }
        this.TimeLabel.string = this.m_iTimeOut + "s";
    }
});

cc._RFpop();
},{"Audio_Common":"Audio_Common","BasePop":"BasePop","GamePlayer":"GamePlayer","GameSystem":"GameSystem","MessageFactory":"MessageFactory","MusicMgr":"MusicMgr","ToastView":"ToastView"}],"Bullfight_Clock":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0ffd6xdXF1Ck5DtvfgS7R75', 'Bullfight_Clock');
// Script\GameScene\Bullfight\SceneView\Bullfight_Clock.js

'use strict';

var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require('GameSystem');

cc.Class({

    extends: cc.Component,

    properties: {
        time: 0,
        timeLabel: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {},

    updateTimeLabel: function updateTimeLabel(label) {
        this.timeLabel.string = label;
        if (Number(label) <= 3 && this.node.active) {
            MusicMgr.playEffect(Audio_Common.AUDIO_TIME);
        }
    },

    setActive: function setActive(active) {
        this.node.active = active;
    }
});

cc._RFpop();
},{"Audio_Common":"Audio_Common","GameSystem":"GameSystem","MusicMgr":"MusicMgr"}],"Bullfight_CostomCardType":[function(require,module,exports){
"use strict";
cc._RFpush(module, '4b6b2GFBalCfIzYJrRlgUyL', 'Bullfight_CostomCardType');
// Script\GameScene\Bullfight\SceneView\Bullfight_CostomCardType.js

'use strict';

var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require('GameSystem');

cc.Class({
    extends: cc.Component,

    properties: {
        CardValue: [cc.Label]
    },

    onLoad: function onLoad() {
        cc.log("Bullfight_CustomCardType.OnLoad");
    },

    initData: function initData() {
        cc.log("Bullfight_CustomCardType.initData.");
        this.m_iCardValue = new Array();
    },

    callBackBtnCard: function callBackBtnCard(event, CustonEventData) {
        if (this.node.active == false) {
            cc.log("Bullfight_CustomCardType.callBackBtnCard this.node.active=", this.node.active);
            return;
        }

        var card = event.target.getComponent("Poker");
        if (this.m_iCardValue.length >= 3 && card.cardSelected == 0) {
            cc.log("Bullfight_CustomCardType.callBackBtnCard length=", this.m_iCardValue.length, " cardSelected=", card.cardSelected);
            return;
        }
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);

        card.setBtnCard();

        cc.log("Bullfight_CustomCardType.callBackBtnCard,value = " + card.cardValue);

        var value = card.cardValue > 10 ? 10 : card.cardValue;
        if (card.cardSelected == 1) {
            this.m_iCardValue.push(value);
        } else {
            this.removeByValue(value);
        }
        this.updataCustomCardType();
        this.logAllCardValue();
    },

    removeByValue: function removeByValue(value) {
        for (var index = 0; index < this.m_iCardValue.length; index++) {
            if (this.m_iCardValue[index] == value) {
                this.m_iCardValue.splice(index, 1);
                break;
            }
        }
    },

    clearCustomCardType: function clearCustomCardType() {
        this.CardValue[0].string = "";
        this.CardValue[1].string = "";
        this.CardValue[2].string = "";
        this.CardValue[3].string = "";
    },

    updataCustomCardType: function updataCustomCardType() {
        this.CardValue[0].string = "";
        this.CardValue[1].string = "";
        this.CardValue[2].string = "";
        this.CardValue[3].string = "";

        var value = 0;
        for (var index = 0; index < this.m_iCardValue.length && index < 3; index++) {
            value += this.m_iCardValue[index];
            if (index == 3) {
                this.CardValue[index].string = value;
            } else {
                this.CardValue[index].string = this.m_iCardValue[index];
            }
        }
        this.CardValue[3].string = value;
    },

    logAllCardValue: function logAllCardValue() {
        for (var index = 0; index < this.m_iCardValue.length; index++) {
            cc.log("logAllCardValue.value = " + this.m_iCardValue[index]);
        }
    }
});

cc._RFpop();
},{"Audio_Common":"Audio_Common","GameSystem":"GameSystem","MusicMgr":"MusicMgr"}],"Bullfight_CreateRoom":[function(require,module,exports){
"use strict";
cc._RFpush(module, '240e8HhsstAwa/KwzMRbnXj', 'Bullfight_CreateRoom');
// Script\GameScene\Bullfight\PopView\Bullfight_CreateRoom.js

'use strict';

var MessageFactory = require('MessageFactory');
var Bullfight_MultCell = require('Bullfight_MultCell');
var BasePop = require('BasePop');
var ToastView = require('ToastView');
var GamePlayer = require('GamePlayer');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require('GameSystem');
var ProgressSlider = require('ProgressSlider');

cc.Class({
    extends: BasePop,

    properties: {

        scrollViewRule: cc.ScrollView,
        scrollViewMult: cc.ScrollView,
        MultCell: [Bullfight_MultCell],
        TitleName: cc.Label,
        RoomName: cc.EditBox,
        BtnDiamondOn: cc.Sprite,
        BtnDiamondOff: cc.Sprite,
        BtnDiamondOnNum: cc.Label,
        BtnDiamondOffNum: cc.Label,
        CarryData: [ProgressSlider],
        minBetNode: cc.Node,
        timeNode: [cc.Node],
        ClubCreateNode: cc.Node,
        RoomCardSetting: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._super();
        this.initPopData();
    },

    initPopData: function initPopData() {
        this.gameMode = 101;
        this.ownerControl = 1;
        this.bankerMode = 1;
        this.minBet = 1;
        this.time = 10;
        this.persons = 6;
        this.CardTypeMult = [1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 0, 4, 0, 0, 0, 0, 0];
        this.scrollViewMult.node.active = false;
        this.RoomName.string = GamePlayer.getInstance().name;
        this.createType = 0; //默认私人创建  1: 俱乐部创建
        this.clubid = 0;
        this.clublevel = 0; //个人level=0
        this.RoomLevel = 1;

        this.gameround = 10;
        this.specCard = 0;
    },

    setRoomCardView: function setRoomCardView() {
        this.ClubCreateNode.active = false;
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            cc.log("stop event");
            event.stopPropagation();
        }.bind(this));
        this.RoomCardSetting.active = true;
        this.RoomLevel = 2;
    },

    switchBtnGoldDiamond: function switchBtnGoldDiamond() {
        var liveTime = 60 * Number(this.time);
        // var goldCost    = GameSystem.getInstance().calcGoldCost(liveTime, this.minBet);
        var goldDiamond = GameSystem.getInstance().calcDiamondCost(liveTime, Number(this.clublevel));

        if (goldDiamond <= GamePlayer.getInstance().diamond) {
            this.BtnDiamondOn.node.active = true;
            this.BtnDiamondOnNum.string = goldDiamond;
            this.BtnDiamondOff.node.active = false;
        } else {
            this.BtnDiamondOn.node.active = false;
            this.BtnDiamondOff.node.active = true;
            this.BtnDiamondOffNum.string = goldDiamond;
        }
    },

    setClubId: function setClubId(clubid, clublevel) {
        this.clubid = clubid;
        this.clublevel = clublevel;
        if (this.clubid > 0) {
            this.TitleName.string = "俱乐部开局";
            this.time = 30;
            this.CarryData[0].setMinAndMax(100, 1000);
            this.CarryData[1].setMinAndMax(200, 2000);
            if (clublevel == 0) {
                clublevel = 1;
            }
            this.CarryData[2].setMinAndMax(600, 2000 * 2 * clublevel);
        } else {
            this.CarryData[0].setMinAndMax(100, 300);
            this.CarryData[1].setMinAndMax(200, 600);
            this.CarryData[2].setMinAndMax(600, 1200);
        }

        for (var index = 0; index < this.MultCell.length; index++) {
            this.MultCell[index].setClubCreate(this.clubid != 0);
        }

        this.minBetNode.active = this.clubid != 0;
        this.timeNode[0].active = this.clubid == 0;
        this.timeNode[1].active = this.clubid != 0;

        this.switchBtnGoldDiamond();
    },

    callbackBtnLabel: function callbackBtnLabel(event, CustomEventData) {
        cc.log("Bullfight_CreateRoom.callbackBtnLabel,CustomEventData =" + CustomEventData);

        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if (CustomEventData == 1) {
            for (var index = 0; index < this.MultCell.length; index++) {
                this.CardTypeMult[index] = Number(this.MultCell[index].getCurMult());
            }
            this.scrollViewRule.node.active = true;
            this.scrollViewMult.node.active = false;
        } else {
            if (this.clubid == 0) ToastView.show("非俱乐部创建牌局无法修改倍率");
            this.scrollViewRule.node.active = false;
            this.scrollViewMult.node.active = true;
        }
    },

    callbackBtnMode: function callbackBtnMode(event, CustomEventData) {
        cc.log("Bullfight_CreateRoom.callbackBtnLabel,CustomEventData =" + CustomEventData);

        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if (CustomEventData == 1) {
            this.bankerMode = 1;
        } else if (CustomEventData == 2) {
            this.bankerMode = 2;
        } else {
            ToastView.show("敬请期待...");
        }
    },

    callbackGameRound: function callbackGameRound(event, CustomEventData) {
        // if (CustomEventData == 1) {
        //     this.gameround = 10;
        // } else if (CustomEventData == 2) {
        //     this.gameround = 20;
        // } else if (CustomEventData == 3) {
        //     this.gameround = 30;
        // }
        this.gameround = Number(CustomEventData);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        cc.log("callbackGameRound, CustomEventData=", CustomEventData, " gameround=", this.gameround);
    },

    callbackSpecCardType: function callbackSpecCardType(event, CustomEventData) {
        cc.log("Bullfight_CreateRoom.callbackSpecCardType, this.specCard =" + this.specCard);
        if (this.specCard == 0) {
            this.specCard = 0;
            this.CardTypeMult = [1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 0, 4, 0, 0, 0, 0, 0];
        } else {
            this.specCard = 1;
            this.CardTypeMult = [1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 0, 4, 5, 5, 5, 5, 5];
        }
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
    },

    callbackFlowerCard: function callbackFlowerCard(event, CustomEventData) {
        cc.log("Bullfight_CreateRoom.callbackFlowerCard, CustomEventData =" + CustomEventData);
        if (CustomEventData == 1) {
            this.FlowerCard = 1;
        } else if (CustomEventData == 2) {
            this.FlowerCard = 0;
        }
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
    },

    callbackOwnerControl: function callbackOwnerControl(event) {
        cc.log("Bullfight_CreateRoom.callbackGameMode");
        if (this.ownerControl == 1) {
            this.ownerControl = 0;
        } else {
            this.ownerControl = 1;
        }
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
    },

    callbackBankerMode: function callbackBankerMode(event, CustomEventData) {
        cc.log("Bullfight_CreateRoom.callbackBankerMode,CustomEventData =" + CustomEventData);
        this.bankerMode = CustomEventData;
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
    },

    callbackMinBet: function callbackMinBet(event, CustomEventData) {
        cc.log("Bullfight_CreateRoom.callbackMinBet,CustomEventData =" + CustomEventData);
        this.minBet = CustomEventData;
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
    },

    callbackTime: function callbackTime(event, CustomEventData) {
        cc.log("Bullfight_CreateRoom.callbackTime,CustomEventData =" + CustomEventData);
        this.time = CustomEventData;
        this.switchBtnGoldDiamond();
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
    },

    callbackPersons: function callbackPersons(event, CustomEventData) {
        cc.log("Bullfight_CreateRoom.callbackPersons,CustomEventData =" + CustomEventData);
        this.persons = CustomEventData;
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
    },

    callbackCreateRoom: function callbackCreateRoom(event, CustomEventData) {

        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);

        if (this.RoomLevel == 2) {
            MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);

            var data = {
                control: Number(this.ownerControl),
                paymode: 1, //付费模式 (默认房卡)
                gametype: Number(this.bankerMode), //闭牌抢庄,四张抢庄(二选一)
                name: GamePlayer.getInstance().name,
                mixante: 1, //最小下注
                gameround: this.gameround,
                flowercard: this.FlowerCard, //是否有花牌
                seats: 6, //座位数
                bullmul: this.CardTypeMult };

            cc.log("callbackCreateRoom : data=", data);

            var createRoom = MessageFactory.createMessageReq(window.US_REQ_CREATE_TABLE_CMD_ID);
            var type = {
                clubid: 0,
                clublevel: 0,
                gameid: Number(this.gameMode),
                gamelevel: 2
            };

            if (createRoom) {
                createRoom.send(data, type);
            }

            this.dismiss();
            return;
        }

        if (this.scrollViewMult.node.active) {
            for (var index = 0; index < this.MultCell.length; index++) {
                this.CardTypeMult[index] = Number(this.MultCell[index].getCurMult());
            }
        }
        if (this.RoomName.string == "") {
            ToastView.show("房间名不能为空！");
            return;
        }

        cc.log("callbackCreateRoom : CustomEventData=", CustomEventData);
        var eventData = Number(CustomEventData);
        if (eventData == 3) {
            ToastView.show("您的钻石不够,请去商城购买");
            return;
        } else if (eventData == 4) {
            ToastView.show("您的金币不够,请去商城购买");
            return;
        }

        var data = {
            control: Number(this.ownerControl),
            paymode: eventData, //付费模式 (默认钻石)
            gametype: Number(this.bankerMode), //闭牌抢庄,四张抢庄(二选一)
            mixante: Number(this.minBet), //最小下注
            livetime: 60 * Number(this.time), //桌子使用时间(秒)
            name: this.RoomName.string, //桌子名称
            seats: Number(this.persons), //座位数
            bullmul: this.CardTypeMult, //从无牛开始，传一个数组
            mincarry: this.CarryData[0].CurCarryNum,
            maxcarry: this.CarryData[1].CurCarryNum,
            totalcarry: this.CarryData[2].CurCarryNum
        };

        if (data.mincarry > data.maxcarry) {
            data.maxcarry = data.mincarry;
        }

        if (data.maxcarry > data.totalcarry) {
            data.totalcarry = data.maxcarry;
        }

        cc.log("callbackCreateRoom : seats=", data.seats);

        if (this.clubid === 0) {
            var createRoom = MessageFactory.createMessageReq(window.US_REQ_CREATE_TABLE_CMD_ID);
            var type = {
                clubid: this.clubid === 0 ? 0 : this.clubid,
                clublevel: this.clubid === 0 ? 0 : this.clublevel,
                gameid: Number(this.gameMode),
                gamelevel: 1
            };
            if (createRoom) {
                createRoom.send(data, type);
            }
        } else {
            var createRoom = MessageFactory.createMessageReq(window.CLUB_REQ_CREATE_TABLE_CMD_ID);
            var type = {
                clubid: this.clubid === 0 ? 0 : this.clubid,
                clublevel: this.clubid === 0 ? 0 : this.clublevel,
                gameid: Number(this.gameMode),
                gamelevel: 1
            };
            if (createRoom) {
                createRoom.send(data, type);
            }
        }
        this.dismiss();
    },
    callbackBtnClose: function callbackBtnClose(event, CustomEventData) {
        cc.log("Bullfight_CreateRoom.callbackBtnClose,CustomEventData =" + CustomEventData);
        this.dismiss();
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
    }
});

cc._RFpop();
},{"Audio_Common":"Audio_Common","BasePop":"BasePop","Bullfight_MultCell":"Bullfight_MultCell","GamePlayer":"GamePlayer","GameSystem":"GameSystem","MessageFactory":"MessageFactory","MusicMgr":"MusicMgr","ProgressSlider":"ProgressSlider","ToastView":"ToastView"}],"Bullfight_ExpressionView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '5c028k2O/hM4ZGfODgoVJzd', 'Bullfight_ExpressionView');
// Script\GameScene\Bullfight\PopView\Bullfight_ExpressionView.js

'use strict';

var BasePop = require('BasePop');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var MessageFactory = require('MessageFactory');
var GamePlayer = require('GamePlayer');
var ToastView = require('ToastView');
var GameSystem = require("GameSystem");

cc.Class({
    extends: BasePop,

    properties: {
        GrayLayer: cc.Sprite
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._super();
        var self = this;
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            cc.log("onLoad : stop event");
            self.dismiss();
        }.bind(this));
    },

    callBackBtn: function callBackBtn(event, CustomEventData) {
        var BtnName = event.target.getName();
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);

        cc.log("Bullfight_ExpressionView.callBackBtn,BtnName = " + BtnName);
        if (GamePlayer.getInstance().seatid == -1) {
            ToastView.show("您没有坐下不能发送表情");
            return;
        }

        if (BtnName.indexOf("Btn") >= 0) {

            var data = {
                touid: GamePlayer.getInstance().uid,
                kind: ChatType.E_CHAT_FACE_KIND,
                type: Number(CustomEventData),
                text: ""
            };
            MessageFactory.createMessageReq(US_REQ_GAME_CHAT_CMD_ID).send(data);
        }
        this.dismiss();
    }

});

cc._RFpop();
},{"Audio_Common":"Audio_Common","BasePop":"BasePop","GamePlayer":"GamePlayer","GameSystem":"GameSystem","MessageFactory":"MessageFactory","MusicMgr":"MusicMgr","ToastView":"ToastView"}],"Bullfight_GameScene":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'f3a0bateh9Bip/rprp/I3UV', 'Bullfight_GameScene');
// Script\GameScene\Bullfight\SceneView\Bullfight_GameScene.js

"use strict";

var BaseScene = require('BaseScene');
var GameSystem = require("GameSystem");
var MessageFactory = require("MessageFactory");
var GamePlayer = require('GamePlayer');
var Cmd_Bullfight = require('Cmd_Bullfight');
var ToastView = require('ToastView');
var LoadingView = require('LoadingView');
var AlertView = require('AlertView');
var Bullfight_Clock = require('Bullfight_Clock');
var Player = require("Player");
var Bullfight_PlayerItem = require("Bullfight_PlayerItem");
var Bullfight_CardItem = require("Bullfight_CardItem");
var Bullfight_GiftAnimation = require('Bullfight_GiftAnimation');
var MusicMgr = require('MusicMgr');
var Bullfight_AudioConfig = require('Bullfight_AudioConfig');
var Audio_Common = require('Audio_Common');
var GameCallOC = require('GameCallOC');
var UtilTool = require('UtilTool');

window.Bullfight_TableStatus = cc.Enum({
    E_TABLE_CLOSE_STATUS: -2, //桌子关闭
    E_TABLE_NOT_START_STATUS: 0, //桌子未开始
    E_TABLE_READY_STATUS: 1, //桌子准备
    E_TABLE_CALL_STATUS: 2, //叫庄
    E_TABLE_BET_STATUS: 3, //下注
    E_TABLE_OPEN_STATUS: 4, //开牌
    E_TABLE_OVER_STATUS: 5, //游戏结束
    E_TABLE_IDLE_STATUS: 6 });

window.Bullfight_PlayerStatus = cc.Enum({
    E_PLAYER_UNKONW_STATUS: -2,
    E_PLAYER_WATCH_STATUS: 0, //观察状态(可能是玩过的,也可能是没有玩过的)
    // E_PLAYER_APPLY_STATUS  : 1, //申请入座           //这2个状态废弃
    // E_PLAYER_COIN_STATUS   : 2, //向群主确认携带金币
    E_PLAYER_SIT_STATUS: 3, //已入座,等待状态
    E_PLAYER_READY_STATUS: 4, //玩家进入准备状态
    E_PLAYER_ACTIVE_STATUS: 5, //正在玩牌
    E_PLAYER_OVER_STATUS: 6 });

window.Bullfight_CallType = cc.Enum({
    E_QUIT_CALL_BANKER: 0, //未操作
    E_NOT_CALL_BANKER: 1, //不抢
    E_NORMAL_CALL_BANKER: 2, //抢庄
    E_SUPER_CALL_BANKER: 3 });

cc.Class({
    extends: BaseScene,

    properties: {
        Menu: cc.Prefab,
        MenuRoomCard: cc.Prefab,
        CarryView: cc.Prefab,
        PlayerItemPos: [Bullfight_PlayerItem],
        CardItem: [Bullfight_CardItem],
        m_iMaxPlayers: 0,
        BtnStart: cc.Button,
        BtnReady: cc.Button,
        BtnCallBankerNode: cc.Node,
        BetCoinNode: cc.Node,
        OpenCardNode: cc.Node,
        clock: Bullfight_Clock,
        RoomId: cc.Label,
        RoomName: cc.Label,
        RoundNum: cc.Label,
        PlayersList: cc.Prefab,
        CallBankerFlag: [cc.Sprite],
        CallBankerFlagFrame: [cc.SpriteFrame],
        GiftAnimation: Bullfight_GiftAnimation,
        GameTotalResult: cc.Prefab,
        ExpressionView: cc.Prefab,
        RoomInfoView: cc.Prefab,
        BetLabel: [cc.Label],
        BtnMusicOn: cc.Button,
        BtnMusicOff: cc.Button,
        VoiceView: cc.Prefab,
        VoicePlayView: cc.Prefab,
        BtnVoice: cc.Button,
        GameScene: cc.Canvas,
        ShareView: cc.Prefab,
        Tips: cc.Label,
        BtnControl: cc.Sprite,
        SuperCostLabel: cc.Label,
        PlayNode: cc.Node,
        DismissTableView: cc.Prefab,
        BtnRoomInfo: cc.Button,
        BtnSuccess: cc.Button,

        BtnBetNode: cc.Node,
        BtnBetRoomCardNode: cc.Node
    },

    statics: {
        Instance: null
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._super();

        GameSystem.getInstance().CurGameType = GameSystem.getInstance().GameType.GAME_TYPE_BULLFIGHT;
        if (GameSystem.getInstance().EnterRoom) {
            MessageFactory.createMessageReq(window.US_REQ_ENTER_GAME_CMD_ID).send();
        }
        this.initData();
        this.Instance = this;
        this.updateRoomViewByLevel();
    },

    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        GameCallOC.getInstance().Poll();
    },

    onDestroy: function onDestroy() {
        this._super();
        this.Instance = null;
        MusicMgr.stopBackgroundMusic();
    },

    updateRoomViewByLevel: function updateRoomViewByLevel() {
        if (GameSystem.getInstance().roomLevel == 2) {
            this.BtnRoomInfo.node.active = false;
            this.BtnSuccess.node.active = false;
        }
    },

    updateBet: function updateBet(minAnte) {
        this.BetLabel[0].string = 1 * minAnte;
        this.BetLabel[1].string = 2 * minAnte;
        this.BetLabel[2].string = 5 * minAnte;
        this.BetLabel[3].string = 10 * minAnte;
    },

    initData: function initData() {
        GamePlayer.getInstance().seatid = -1;
        this.tableStatus = Bullfight_TableStatus.E_TABLE_CLOSE_STATUS;
        this.sitPlayers = new Map();
        this.m_iMyBetCoin = 0;
        this.m_iMaxBet = 0;
        this.tableRuleInfo = null;
        this.bankerUid = 0;
        this.roundnum = 0;
        this.BetArray = [];
        this.RoomId.string = "ID:" + GameSystem.getInstance().privateid;
        this.VoiceViewNode = null;
        this.VoicePlayerViewNode = null;
        this.removeAllPlayerInTable();
        cc.log("Bullfight_GameScene.clearTable,privateid = " + GameSystem.getInstance().privateid);

        var self = this;
        this.BtnVoice.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            if (GamePlayer.getInstance().seatid == -1) {
                ToastView.show("您没有坐下不能发送语音");
                return;
            }
            //显示录音界面
            self.VoiceViewNode = cc.instantiate(self.VoiceView);
            self.node.addChild(self.VoiceViewNode);
            self.VoiceViewNode.setPosition(cc.p(0, 0));
        });
        this.BtnVoice.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            //取消录音界面
            if (self.VoiceViewNode) {
                self.VoiceViewNode.getComponent("VoiceView").dismiss();
                self.VoiceViewNode = null;
            }
            self.playVoiceContinue();
        });
        this.BtnVoice.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            //取消录音界面
            if (self.VoiceViewNode) {
                self.VoiceViewNode.getComponent("VoiceView").dismiss();
                self.VoiceViewNode = null;
            }
        });

        if (GameSystem.getInstance().VolumeState == 1) {
            this.BtnMusicOn.node.active = false;
            this.BtnMusicOff.node.active = true;
        }

        this.VoiceArray = new Array();
    },

    clearTable: function clearTable() {
        this.m_iMyBetCoin = 0;
        this.m_iMaxBet = 0;
        this.bankerUid = 0;
        this.BtnStart.node.active = false;
        this.BtnReady.node.active = false;
        this.clock.node.active = false;
        this.BtnCallBankerNode.active = false;
        //this.BetCoinNode.active = false;
        if (GameSystem.getInstance().roomLevel == 2) {
            this.BtnBetRoomCardNode.active = false;
        } else {
            this.BtnBetNode.active = false;
        }

        this.OpenCardNode.active = false;
        this.BetArray = [];
        this.clearCallBankerFlag();
    },

    /*********************Network***************************/
    callBackBtnShare: function callBackBtnShare() {

        var ShareImagePath = GameCallOC.getInstance().screenShotAction();
        var shareView = cc.instantiate(this.ShareView);
        this.node.addChild(shareView);
        shareView.setPosition(cc.p(0, 0));
        var string = "游戏结算分享";
        shareView.getComponent("ShareView").setShareTyep(ShareType.E_SHARETYPE_IMAGE, ShareImagePath, GameSystem.getInstance().clienturl);
    },

    playVoiceContinue: function playVoiceContinue() {
        if (this.VoicePlayerViewNode != null) {
            cc.log("this.VoicePlayerViewNode  removeFromParent");
            this.VoicePlayerViewNode.removeFromParent(true);
            this.VoicePlayerViewNode = null;
        }
        var msg = this.VoiceArray.pop();
        cc.log("onSceneMsg,msg = " + JSON.stringify(msg));
        if (msg) {
            var fromViewId = this.getPlayerViewIdBySeatId(this.findPlayer(msg.fromuid).seatid);
            if (this.VoicePlayerViewNode == null && this.VoiceViewNode == null) {
                cc.log("this.VoicePlayerViewNode  create1");
                this.VoicePlayerViewNode = cc.instantiate(this.VoicePlayView);
                this.GiftAnimation.node.addChild(this.VoicePlayerViewNode);
                this.VoicePlayerViewNode.setPosition(this.CallBankerFlag[fromViewId].node.position);
                var text = JSON.parse(BASE64.decoder(msg.text));
                GameCallOC.getInstance().DownloadRecordedFile(text.fileID, text.filePath);
            }
        }
    },

    onSceneMsg: function onSceneMsg(event) {
        var msg = event.data;
        cc.log("onSceneMsg,msg.popView = " + msg.popView);
        if (msg.popView == "GloudVoice") {
            if (msg.btn == "OnPlayRecordedFile") {
                this.playVoiceContinue();
            }
        } else if (msg.popView == "Bullfight_TotalResult") {
            if (msg.btn == "BtnShare") {
                this.callBackBtnShare();
            }
        } else if (msg.popView == "Bullfight_Menu") {
            if (msg.btn == "BtnShare") {
                this.showShareView();
                //this.callBackBtnShare();
            }
        } else if (msg.popView == "VoicePlayView") {
            if (msg.btn = "dismiss") {
                cc.log("this.VoicePlayerViewNode  null");
                this.VoicePlayerViewNode = null;
            }
        }
    },

    onMessage: function onMessage(event) {
        cc.log("Bullfight_GameScene.onMessage");
        this._super(event);
        var msg = event.data;
        var cmd = msg.cmd;
        switch (cmd) {
            case window.US_RESP_LOGIN_CMD_ID:
                this.onLoginMsg(msg);
                break;

            case window.US_RESP_ENTER_GAME_CMD_ID:
                this.onEnterRoom(msg);
                break;

            case window.US_RESP_SIT_DOWN_CMD_ID:
                this.onSitDown(msg);
                break;

            case window.US_RESP_LEAVE_GAME_CMD_ID:
                this.onLeaveGame(msg);
                break;

            case window.US_NOTIFY_GAME_SWITCH_CMD_ID:
                this.onNotifyGameSwitch(msg);
                break;

            case Cmd_Bullfight.SBF_RESP_READY_CMD_ID:
                this.onReady(msg);
                break;

            case Cmd_Bullfight.SBF_NOTIFY_GAME_START_CMD_ID:
                this.onNotifyGameStart(msg);
                break;

            case Cmd_Bullfight.SBF_RESP_CALL_BANKER_CMD_ID:
                this.onCallBanker(msg);
                break;

            case Cmd_Bullfight.SBF_NOTIFY_CONFIRM_BANKER_CMD_ID:
                this.onNotifySureBanker(msg);
                break;

            case window.US_RESP_GAME_SWITCH_CMD_ID:
                this.onGameSwitch(msg);
                break;

            case Cmd_Bullfight.SBF_RESP_BET_COIN_CMD_ID:
                this.onBetCoin(msg);
                break;

            case Cmd_Bullfight.SBF_NOTIFY_OPEN_CARD_CMD_ID:
                this.onNotifyOpenCard(msg);
                break;

            case Cmd_Bullfight.SBF_RESP_OPEN_CARD_CMD_ID:
                this.onOpenCard(msg);
                break;

            case Cmd_Bullfight.SBF_NOTIFY_ONE_GAME_RESULT_CMD_ID:
                this.onNotifyOneGameResult(msg);
                break;

            case window.US_RESP_CARRY_COIN_CMD_ID:
                this.onCarryCoin(msg);
                break;

            case Cmd_Bullfight.SBF_NOTIFY_KICKOUT_CMD_ID:
                this.doKickOut(msg);
                break;

            case Cmd_Bullfight.SBF_NOTIFY_NOT_CALL_BANKER_CMD_ID:
                this.onNotifyNotCallbanker(msg);
                break;

            case Cmd_Bullfight.SBF_NOTIFY_NOT_BET_COIN_CMD_ID:
                this.onNotifyNotBet(msg);
                break;

            case Cmd_Bullfight.SBF_NOTIFY_TOTAL_GAME_RESULT_CMD_ID:
                this.NotifyTotalGameResult(msg);
                break;

            case Cmd_Bullfight.US_RESP_TABLE_DETAIL_CMD_ID:
                this.onGetTableDetail(msg);
                break;

            case US_RESP_GAME_CHAT_CMD_ID:
                this.onChatMsg(msg);
                break;

            case window.US_RSP_DISMISS_TABLE_CMD_ID:
                this.onDismissTable(msg);
                break;
            case window.US_NOTIFY_DISMISS_TABLE_CMD_ID:
                this.onNotifyDismissTable(msg);
                break;
        };
    },

    onNotifyDismissTable: function onNotifyDismissTable(msg) {
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            cc.log("onNotifyDismissTable dismissuid=", msg.dismissuid, " name=", msg.name, " timeout=", msg.timeout);
            var DismissTable = cc.instantiate(this.DismissTableView);
            this.node.addChild(DismissTable);
            DismissTable.setPosition(cc.p(0, 0));
            DismissTable.getComponent("Bullfight_DismissTable").setSendInfo(msg.name, msg.dismissuid, msg.timeout);
        }
    },

    onDismissTable: function onDismissTable(msg) {
        if (msg.code != SocketRetCode.RET_SUCCESS) {
            ToastView.show(msg.desc);
        }
    },

    onChatMsg: function onChatMsg(msg) {
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            if (msg.kind == ChatType.E_CHAT_FACE_KIND) {
                var viewId = this.getPlayerViewIdBySeatId(this.findPlayer(msg.fromuid).seatid);
                var pos = this.CallBankerFlag[viewId].node.position;
                this.GiftAnimation.playFaceAnimation(msg.type, pos);
            } else if (msg.kind == ChatType.E_CHAT_GIFT_KIND) {
                var fromViewId = this.getPlayerViewIdBySeatId(this.findPlayer(msg.fromuid).seatid);
                var toViewId = this.getPlayerViewIdBySeatId(this.findPlayer(msg.touid).seatid);
                var start = this.PlayerItemPos[fromViewId].node.position;
                var end = this.PlayerItemPos[toViewId].node.position;
                this.GiftAnimation.playGiftAnimation(msg.type, start, end);
            } else if (msg.kind == ChatType.E_CHAT_VOICE_KIND) {
                var fromViewId = this.getPlayerViewIdBySeatId(this.findPlayer(msg.fromuid).seatid);
                if (this.VoicePlayerViewNode == null && this.VoiceViewNode == null) {
                    cc.log("this.VoicePlayerViewNode  create");
                    this.VoicePlayerViewNode = cc.instantiate(this.VoicePlayView);
                    this.GiftAnimation.node.addChild(this.VoicePlayerViewNode);
                    this.VoicePlayerViewNode.setPosition(this.CallBankerFlag[fromViewId].node.position);
                    var text = JSON.parse(BASE64.decoder(msg.text));
                    cc.log("Bullfight_GameScene.onChatMsg,fileID = " + text.fileID);
                    cc.log("Bullfight_GameScene.onChatMsg,downloadFilePath = " + text.filePath);
                    GameCallOC.getInstance().DownloadRecordedFile(text.fileID, text.filePath);
                } else {
                    //语音一次只能播放一个，如果当前有播放的先保存，等播放玩了继续播放
                    cc.log("onChatMsg,msg = " + JSON.stringify(msg));
                    this.VoiceArray.push(msg);
                    cc.log("onChatMsg,VoiceArray = " + this.VoiceArray.length);
                }
            } else if (msg.kind == ChatType.E_CHAT_WORD_KIND) {}
        } else {}
    },

    onLoginMsg: function onLoginMsg(msg) {
        cc.log("Bullfight_GameScene.onLoginMsg");
        if (msg.code >= SocketRetCode.RET_SUCCESS) {
            this.clearTable();
            this.delAllPlayer();
            MessageFactory.createMessageReq(Cmd_Bullfight.US_REQ_TABLE_DETAIL_CMD_ID).send();
        }
    },

    showShareView: function showShareView() {
        var shareView = cc.instantiate(this.ShareView);
        this.node.addChild(shareView);
        shareView.setPosition(cc.p(0, 0));
        var string = "我在游戏［" + GameCallOC.getInstance().getAppName() + "］里创建了房间(" + GameSystem.getInstance().privateid + "),快点一起来玩吧！！！";
        shareView.getComponent("ShareView").setShareTyep(ShareType.E_SHARETYPE_LINK, string, GameSystem.getInstance().clienturl);
    },

    onEnterRoom: function onEnterRoom(msg) {
        cc.log("Bullfight_GameScene.onEnterRoom");
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            this.tableRuleInfo = JSON.parse(BASE64.decoder(msg.param));
            this.tableStatus = msg.tstatus;
            this.m_iMaxPlayers = msg.seats;
            this.RoomName.string = msg.name;
            GamePlayer.getInstance().bowner = msg.bowner;
            GamePlayer.getInstance().status = msg.ustatus;
            GameSystem.getInstance().superCost = msg.supercost;
            GameSystem.getInstance().giftCost = msg.giftcosts;
            this.SuperCostLabel.string = GameSystem.getInstance().superCost;
            this.updateBet(this.tableRuleInfo.minante);

            // if (msg.bowner == 1) {
            //     this.BtnControl.node.active = true
            // } else {
            //     this.BtnControl.node.active = false
            // }

            cc.log("onEnterRoom: tstatus=", this.tableStatus, " status=", GamePlayer.getInstance().status);

            //本局游戏没有开始，并且自己是桌主
            if (this.tableStatus == Bullfight_TableStatus.E_TABLE_NOT_START_STATUS && GamePlayer.getInstance().bowner == 1) {
                cc.log("onEnterRoom: bowner=" + GamePlayer.getInstance().bowner);
                this.showTableStatusBtn(); //显示游戏开始按钮
                if (GameSystem.getInstance().VerStatus != GameSystem.getInstance().VerStatusType.VERSION_TYPE_AUDIT) {
                    this.showShareView();
                }
            } else if (this.tableStatus > Bullfight_TableStatus.E_TABLE_NOT_START_STATUS) {
                cc.log("Bullfight_GameScene.onEnterRoom, get table detail.");
                MessageFactory.createMessageReq(Cmd_Bullfight.US_REQ_TABLE_DETAIL_CMD_ID).send();

                switch (this.tableStatus) {
                    case Bullfight_TableStatus.E_TABLE_READY_STATUS:
                        this.Tips.string = "准备中";
                        break;

                    case Bullfight_TableStatus.E_TABLE_CALL_STATUS:
                        this.Tips.string = "抢庄中";
                        break;

                    case Bullfight_TableStatus.E_TABLE_BET_STATUS:
                        this.Tips.string = "下注中";
                        break;

                    case Bullfight_TableStatus.E_TABLE_OPEN_STATUS:
                        this.Tips.string = "开牌中";
                        break;

                    case Bullfight_TableStatus.E_TABLE_OPEN_STATUS:
                        this.Tips.string = "本局结束";
                        break;
                }
            } else {
                this.Tips.string = "游戏未开始";
            }

            //显示在自己之前进入的玩家
            for (var index = 0; msg.seaters != null && index < msg.seaters.length; index++) {
                var player = new Player();
                player.uid = msg.seaters[index].uid;
                player.name = msg.seaters[index].name;
                player.headurl = msg.seaters[index].headurl;
                player.sex = msg.seaters[index].sex;
                player.gold = msg.seaters[index].gold;
                player.diamond = msg.seaters[index].diamond;
                player.coin = msg.seaters[index].coin;
                player.seatid = msg.seaters[index].seatid;
                player.status = msg.seaters[index].status;
                player.winGold = msg.seaters[index].win;
                player.TotalCarry = msg.seaters[index].total;
                player.TotalRound = msg.seaters[index].totalround; //总手数
                player.TotalTable = msg.seaters[index].totaltable; //总局数
                this.addPlayer(player);
            }
            this.refreshAllPlayerOnTable(false);

            if (GamePlayer.getInstance().seatid == -1) {
                this.SitDown();
            }
        }
    },

    SitDown: function SitDown() {
        var data = {
            status: 1
        };
        MessageFactory.createMessageReq(window.US_REQ_SIT_DOWN_CMD_ID).send(data);
        MusicMgr.playEffect(Audio_Common.AUDIO_SIT);
    },

    onSitDown: function onSitDown(msg) {
        cc.log("Bullfight_GameScene.onSitDown");
        LoadingView.dismiss();
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            this.tableStatus = msg.tstatus;
            if (msg.switch == 1) {
                var player = new Player();
                cc.log("player.seatid = " + msg.seatid);
                player.uid = msg.seatuid;
                player.name = msg.name;
                player.headurl = msg.headurl;
                player.sex = msg.sex;
                player.gold = msg.gold;
                player.diamond = msg.diamond;
                player.coin = msg.coin;
                player.status = msg.status;
                player.seatid = msg.seatid;
                player.winGold = msg.win;
                player.TotalCarry = msg.total;
                player.TotalRound = msg.totalround; //总手数
                player.TotalTable = msg.totaltable; //总局数
                cc.log("onSitDown player.TotalRound=", player.TotalRound, " player.TotalTable=", player.TotalTable);
                this.addPlayer(player);

                if (player.uid == GamePlayer.getInstance().uid) {
                    this.refreshAllPlayerOnTable(true);
                } else {
                    this.showOnePlayerInTable(player);
                }

                if (msg.seatuid == GamePlayer.getInstance().uid) {
                    if (msg.iscarry > 0) {
                        //需要携带金币
                        this.createCarryView(msg.carrytime);
                    } else {
                        this.showTableStatusBtn();
                    }
                }
            } else {
                this.delPlayer(msg.seatuid);
                if (msg.seatuid == GamePlayer.getInstance().uid) {
                    //如果是自己，则需要清理按键
                    this.refreshAllPlayerOnTable(true);
                    this.showTableStatusBtn();
                }
            }
        } else if (msg.code > SocketRetCode.RET_SUCCESS) {
            ToastView.show(msg.desc);
        }
    },

    onCarryCoin: function onCarryCoin(msg) {
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            cc.log("[%d,%d]", msg.carryuid, GamePlayer.getInstance().uid);
            this.tableStatus = msg.tstatus;
            if (GamePlayer.getInstance().bowner != 1 && msg.carryuid == GamePlayer.getInstance().uid) {
                ToastView.show("桌主已同意您的请求");
            }

            var player = this.findPlayer(msg.carryuid);
            if (player) {
                cc.log("Bullfight_GameScene.onCarryCoin,carrycoin = " + msg.carrycoin, " coin=", msg.coin);
                player.status = msg.ustatus;
                player.TotalCarry = msg.carrycoin;
                player.coin = msg.coin;
                player.gold = msg.gold;
                player.diamond = msg.diamond;
                var viewid = this.getPlayerViewIdBySeatId(player.seatid);
                this.PlayerItemPos[viewid].setUserGold(player.coin);
            }

            if (msg.carryuid == GamePlayer.getInstance().uid) {
                GamePlayer.getInstance().status = msg.ustatus;
                this.showTableStatusBtn();
            }
        } else {
            ToastView.show(msg.desc);
        }
    },

    onLeaveGame: function onLeaveGame(msg) {
        cc.log("Bullfight_GameScene.onLeaveGame");
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            GameSystem.getInstance().gamesvcid = 0;
            GameSystem.getInstance().tableid = 0;
            cc.director.loadScene('HallScene');
        }
    },

    onNotifyGameSwitch: function onNotifyGameSwitch(msg) {
        cc.log("Bullfight_GameScene.onNotifyGameSwitch");
        if (msg.isStart == 1) {
            this.tableStatus = msg.tstatus;
            GamePlayer.getInstance().status = msg.ustatus;

            cc.log("Bullfight_GameScene.onNotifyGameSwitch,this.tableStatus = " + this.tableStatus);

            this.showTableStatusBtn();

            if (this.sitPlayers.size() > 0) {
                this.startClockTime(msg.readyTime);
                this.Tips.string = "准备中";
            } else {
                this.Tips.string = "请入座";
            }

            this.clearAllPlayerCardItem();
            this.clearCallBankerFlag();
            this.clearUserWinScore();
            this.clearUserHeadBanker();
        } else {
            //弹框提示玩家游戏解散
            ToastView.show(msg.desc);
        }
    },

    onNotifyGameStart: function onNotifyGameStart(msg) {
        cc.log("Bullfight_GameScene.onNotifyGameStart");

        this.clearReadyFlag();
        GamePlayer.getInstance().status = msg.ustatus;
        this.tableStatus = msg.tstatus;
        this.roundnum = msg.roundnum;
        this.RoundNum.string = "第" + this.roundnum + "局";
        this.Tips.string = "抢庄中";

        this.startClockTime(msg.calltime);

        //在座位上
        if (GamePlayer.getInstance().seatid >= 0) {
            if (GamePlayer.getInstance().status == Bullfight_PlayerStatus.E_PLAYER_ACTIVE_STATUS) {
                var viewId = this.getPlayerViewIdBySeatId(GamePlayer.getInstance().seatid);
                this.sendCardsToPlayer(viewId, msg.cards);
            }
        }

        this.showTableStatusBtn();

        //其他玩家
        // Uid     uint32 `json:"uid"`
        // UStatus int    `json:"ustatus"`
        // SeatId  int    `json:"seatid"`
        for (var index = 0; index < msg.seaters.length; index++) {
            var item = msg.seaters[index];

            var player = this.findPlayer(item.uid);
            player.status = item.ustatus;
            player.finalcoin = 0;
            player.bulltype = 0;
            player.cards = [];
            player.calltype = 0; //叫庄类型
            player.bBanker = 0; //是否是庄家
            player.betcoinmul = 0; //下注倍数
            player.bOpenCard = 0; //是否看牌

            if (item.ustatus == Bullfight_PlayerStatus.E_PLAYER_ACTIVE_STATUS) {
                var viewId = this.getPlayerViewIdBySeatId(item.seatid);
                var cards = [0, 0, 0, 0, 0];
                this.sendCardsToPlayer(viewId, cards);
            } else {
                //旁观
                this.refreshLookFlag(item.uid);
            }
        }
    },

    onReady: function onReady(msg) {
        cc.log("Bullfight_GameScene.onReady readuid=", msg.readyuid, " ustatus=", msg.ustatus);
        if (msg.code == SocketRetCode.RET_SUCCESS) {

            if (msg.readyuid == GamePlayer.getInstance().uid) {
                GamePlayer.getInstance().status = msg.ustatus;
                this.BtnReady.node.active = false;
                this.clearTable();
                this.Tips.string = "等待其他玩家准备";
            }

            this.updatePlayerStatus(msg.readyuid, msg.ustatus);

            this.refreshReadyFlag(msg.readyuid);
        }
    },

    onCallBanker: function onCallBanker(msg) {
        cc.log("Bullfight_GameScene.onCallBanker");
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            this.tableStatus = msg.tstatus;
            if (msg.calluid == GamePlayer.getInstance().uid) {
                this.BtnCallBankerNode.active = false;
                this.Tips.string = "等带其他玩家抢庄";
            }

            this.updatePlayerCallType(msg.calluid, msg.calltype);
            this.refreshCallBankerFlag(msg.calluid, true);
        } else {
            ToastView.show(msg.desc);
        }
    },

    onNotifySureBanker: function onNotifySureBanker(msg) {
        cc.log("Bullfight_GameScene.onNotifySureBanker");
        this.clearCallBankerFlag();
        this.startClockTime(msg.bettime);
        this.bankerUid = msg.bankeruid;
        this.m_iMaxBet = msg.maxbetmul;
        this.tableStatus = msg.tstatus;
        GamePlayer.getInstance().status = msg.ustatus;

        var player = this.findPlayer(msg.bankeruid);
        player.bBanker = 1;
        var viewId = this.getPlayerViewIdBySeatId(player.seatid);
        this.PlayerItemPos[viewId].setPlayerBanker();

        this.showTableStatusBtn();
        this.Tips.string = "下注中";
    },

    onGameSwitch: function onGameSwitch(msg) {
        cc.log("Bullfight_GameScene.onGameSwitch");
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            if (msg.isstart == 1) {
                this.BtnStart.node.active = false;
                this.Tips.string = "游戏开始";
            } else {
                ToastView.show("房间解散成功，本局结束后将解散");
            }
        } else if (msg.code == 14) {
            ToastView.show(msg.desc);
        }
    },

    onBetCoin: function onBetCoin(msg) {
        cc.log("Bullfight_GameScene.onBetCoin");
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            this.tableStatus = msg.tstatus;
            GamePlayer.getInstance().status = msg.ustatus;

            if (msg.betuid == GamePlayer.getInstance().uid && GamePlayer.getInstance().status == Bullfight_PlayerStatus.E_PLAYER_ACTIVE_STATUS) {
                //this.BetCoinNode.active = false;
                if (GameSystem.getInstance().roomLevel == 2) {
                    this.BtnBetRoomCardNode.active = false;
                } else {
                    this.BtnBetNode.active = false;
                }
                this.Tips.string = "等待其他玩家下注";
            }
            var player = this.sitPlayers.get(msg.betuid);
            player.betcoinmul = msg.betcoinmul;
            var viewId = this.getPlayerViewIdBySeatId(player.seatid);
            this.setPlayerBetCount(viewId, player.betcoinmul * this.tableRuleInfo.minante);
        }
    },

    onNotifyOpenCard: function onNotifyOpenCard(msg) {
        cc.log("onNotifyOpenCard...");
        GamePlayer.getInstance().status = msg.ustatus;
        this.tableStatus = msg.tstatus;
        this.startClockTime(msg.opentime);
        this.Tips.string = "看牌中";

        if (GamePlayer.getInstance().status != Bullfight_PlayerStatus.E_PLAYER_ACTIVE_STATUS) return;

        GamePlayer.getInstance().cards = msg.cards;
        var viewId = this.getPlayerViewIdBySeatId(GamePlayer.getInstance().seatid);
        cc.log("Bullfight_GameScene.onNotifyOpenCard,viewId = " + viewId);
        this.openplayerCards(viewId, msg.cards, -1, -1);
        this.showTableStatusBtn();
        this.setCustomCardType(true);
    },

    onOpenCard: function onOpenCard(msg) {
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            this.tableStatus = msg.tstatus;

            var player = this.findPlayer(msg.openuid);
            player.bulltype = msg.bulltype;
            player.cards = msg.cards;
            player.bOpenCard = 1;
            cc.log("Bullfight_GameScene.onOpenCard,player = " + player);
            var viewId = this.getPlayerViewIdBySeatId(msg.seatid);
            this.setCardType(viewId, player.bulltype, true);
            this.openplayerCards(viewId, player.cards, msg.index1, msg.index2);

            if (msg.openuid == GamePlayer.getInstance().uid) {
                this.setCustomCardType(false);
                this.OpenCardNode.active = false;
                this.Tips.string = "等待其他玩家看牌";
            }
        }
    },

    onNotifyOneGameResult: function onNotifyOneGameResult(msg) {
        this.tableStatus = msg.tstatus;
        GamePlayer.getInstance().status = msg.ustatus;

        cc.log("onNotifyOneGameResult msg.ustatus=", msg.ustatus, " status=", GamePlayer.getInstance().status);

        this.OpenCardNode.active = false;
        this.setCustomCardType(false);
        // this.clearAllPlayerCardItem();
        // this.showTableStatusBtn();
        // this.clearCallBankerFlag();
        this.startClockTime(msg.overtime);
        this.Tips.string = "本局结算";

        for (var index = 0; index < msg.seaters.length; index++) {
            if (msg.seaters[index].ustatus == Bullfight_PlayerStatus.E_PLAYER_OVER_STATUS) {
                var player = this.findPlayer(msg.seaters[index].uid);
                player.status = msg.seaters[index].ustatus;
                player.coin = msg.seaters[index].coin;

                var viewid = this.getPlayerViewIdBySeatId(msg.seaters[index].seatid);
                this.PlayerItemPos[viewid].setUserWinScore(msg.seaters[index].finalcoin);
                this.PlayerItemPos[viewid].setUserGold(msg.seaters[index].coin);

                if (msg.seaters[index].uid == GamePlayer.getInstance().uid) {
                    if (msg.seaters[index].finalcoin > 0) {
                        var pos = this.CallBankerFlag[viewid].node.position;
                        this.GiftAnimation.playWinAnimation(pos);

                        MusicMgr.playEffect(Bullfight_AudioConfig.AUDIO_WIN);
                    } else {
                        MusicMgr.playEffect(Bullfight_AudioConfig.AUDIO_LOSE);
                    }
                }
            }
        }
    },

    doKickOut: function doKickOut(msg) {
        if (msg.code != SocketRetCode.RET_SUCCESS) //选择携带金币超时
            {
                this.delPlayer(msg.seatuid);
                cc.log("Bullfight_GameScene.doKickOut,uid = " + GamePlayer.getInstance().uid);
                if (msg.seatuid == GamePlayer.getInstance().uid) {
                    cc.log("Bullfight_GameScene.doKickOut, my be kickout.");
                    GamePlayer.getInstance().status = 0;
                    GamePlayer.getInstance().seatid = -1;
                    this.refreshAllPlayerOnTable(true);
                    this.showTableStatusBtn();
                    if (msg.code != SocketRetCode.RET_SUCCESS) {
                        ToastView.show(msg.desc);
                    }
                }
            }
    },

    onNotifyNotCallbanker: function onNotifyNotCallbanker(msg) {},

    onNotifyNotBet: function onNotifyNotBet(msg) {},

    NotifyTotalGameResult: function NotifyTotalGameResult(msg) {
        this.createTotalGameResult(msg);
    },

    createTotalGameResult: function createTotalGameResult(msg) {
        var gameEnd = cc.instantiate(this.GameTotalResult);
        this.node.addChild(gameEnd);
        gameEnd.setPosition(cc.p(0, 0));
        gameEnd.getComponent("Bullfight_TotalResult").setGameData(msg, this.GameScene);
    },

    onGetTableDetail: function onGetTableDetail(msg) {
        if (msg.code < SocketRetCode.RET_SUCCESS) return;

        this.tableRuleInfo = {
            gametype: msg.gametype,
            minante: msg.minante,
            mincarry: msg.mincarry,
            maxcarry: msg.maxcarry,
            livetime: msg.livetime,
            seats: msg.seats,
            bullmul: msg.bullmul,
            totalcarry: msg.totalcarry
        };

        cc.log("onGetTableDetail mincarry=", msg.minmincarry, " maxcarry=", msg.maxcarry);

        this.roundnum = msg.roundnum;
        this.RoundNum.string = "第" + this.roundnum + "局";
        GameSystem.getInstance().privateid = msg.privateid;
        this.RoomId.string = "ID:" + GameSystem.getInstance().privateid;

        cc.log("onGetTableDetail roundnum=", this.roundnum, " privateid=", GameSystem.getInstance().privateid);

        GamePlayer.getInstance().TotalCarry = msg.carrycoin;
        GamePlayer.getInstance().bowner = msg.bowner;

        // if (msg.bowner == 1) {
        //     this.BtnControl.node.active = true
        // } else {
        //     this.BtnControl.node.active = false
        // }

        this.m_iMaxPlayers = msg.seats;
        this.tableStatus = msg.tstatus;
        this.bankerUid = msg.bankeruid;
        this.updateClockTime(msg.timeout);

        for (var index = 0; index < msg.seaters.length; index++) {
            var player = new Player();
            player.uid = msg.seaters[index].uid;
            player.name = msg.seaters[index].name;
            player.headurl = msg.seaters[index].headurl;
            player.sex = msg.seaters[index].sex;
            player.gold = msg.seaters[index].gold;
            player.diamond = msg.seaters[index].diamond;
            player.coin = msg.seaters[index].coin;
            player.status = msg.seaters[index].status;
            player.seatid = msg.seaters[index].seatid;
            player.TotalCarry = msg.seaters[index].total;
            player.winGold = msg.seaters[index].win;
            player.calltype = msg.seaters[index].calltype;
            player.betcoinmul = msg.seaters[index].betmul;
            player.cards = msg.seaters[index].cards;
            player.bulltype = msg.seaters[index].bulltype;
            player.finalcoin = msg.seaters[index].finalcoin;
            player.TotalRound = msg.seaters[index].totalround; //总手数
            player.TotalTable = msg.seaters[index].totaltable; //总局数
            player.bOpenCard = msg.seaters[index].bopencard; //

            if (player.uid == GamePlayer.getInstance().uid) {
                this.m_iMaxBet = msg.seaters[index].maxbetmul;
            }

            if (this.bankerUid == player.uid) {
                player.bBanker = 1;
            } else {
                player.bBanker = 0;
            }
            cc.log("onGetTableDetail uid=", player.uid, " isbanker=", player.bBanker);

            this.addPlayer(player);
        }
        this.refreshAllPlayerOnTable(true);
    },

    /***********send Message ********************/

    sendReady: function sendReady() {
        MessageFactory.createMessageReq(Cmd_Bullfight.SBF_REQ_READY_CMD_ID).send();
    },

    sendCallBanker: function sendCallBanker(callType) {
        var data = {
            calltype: callType
        };
        MessageFactory.createMessageReq(Cmd_Bullfight.SBF_REQ_CALL_BANKER_CMD_ID).send(data);
    },

    sendSwitchGame: function sendSwitchGame(isStart) {
        var data = {
            isstart: isStart
        };
        MessageFactory.createMessageReq(US_REQ_GAME_SWITCH_CMD_ID).send(data);
    },

    sendBetCoinReq: function sendBetCoinReq(betcoin) {
        var data = {
            betcoinmul: this.m_iMyBetCoin
        };
        MessageFactory.createMessageReq(Cmd_Bullfight.SBF_REQ_BET_COIN_CMD_ID).send(data);
    },

    sendOpenCard: function sendOpenCard() {
        MessageFactory.createMessageReq(Cmd_Bullfight.SBF_REQ_OPEN_CARD_CMD_ID).send();
    },

    /***********************BtnCallback*************************/

    callbackBtnMusic: function callbackBtnMusic(toggle, CustomEventData) {
        var isCheck = toggle.isChecked;
        if (isCheck) {
            MusicMgr.resumeBackgroundMusic();
        } else {
            MusicMgr.pauseBackgroundMusic();
        }
    },

    callBackBetBtnRoomCard: function callBackBetBtnRoomCard(event, CustomEventData) {
        var node = event.target;
        var btn = node.getName();

        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);

        cc.log("Bullfight_GameScene.callBackBetBtnRoomCard,btn = " + btn);

        if (btn == "BtnBet1") {
            this.m_iMyBetCoin = 1;
            cc.log("[BtnBet1] m_iMyBetCoin=", this.m_iMyBetCoin);
            this.updateMaxBet();
            this.sendBetCoinReq();
        } else if (btn == "BtnBet3") {
            this.m_iMyBetCoin = 3;
            cc.log("[BtnBet2] m_iMyBetCoin=", this.m_iMyBetCoin);
            this.updateMaxBet();
            this.sendBetCoinReq();
        } else if (btn == "BtnBet5") {
            this.m_iMyBetCoin = 5;
            this.BetArray.push(5);
            cc.log("[BtnBet5]  m_iMyBetCoin=", this.m_iMyBetCoin);
            this.updateMaxBet();
            this.sendBetCoinReq();
        }
    },

    callbackBtn: function callbackBtn(event, CustomEventData) {
        var node = event.target;
        var btn = node.getName();

        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);

        cc.log("Bullfight_GameScene.callbackBtn,btn = " + btn);

        if (btn == "BtnMenu") {
            this.createMenu();
        } else if (btn == "BtnSuccess") {
            var playerList = cc.instantiate(this.PlayersList);
            this.node.addChild(playerList);
            playerList.setPosition(cc.p(0, 0));
        } else if (btn == "BtnSpeech") {
            //this.createTotalGameResult();
            //this.GiftAnimation.playGiftAnimation(1);
        } else if (btn == "BtnMusicOn") {
            this.BtnMusicOff.node.active = true;
            this.BtnMusicOn.node.active = false;

            GameSystem.getInstance().VolumeState = 1;

            MusicMgr.pauseBackgroundMusic();
        } else if (btn == "BtnMusicOff") {
            this.BtnMusicOff.node.active = false;
            this.BtnMusicOn.node.active = true;

            GameSystem.getInstance().VolumeState = 0;

            MusicMgr.resumeBackgroundMusic();
        } else if (btn == "BtnStart") {
            this.sendSwitchGame(1);
        } else if (btn == "BtnReady") {
            this.sendReady();
        } else if (btn == "BtnNotCall") {
            this.sendCallBanker(1);
        } else if (btn == "BtnCall") {
            this.sendCallBanker(2);
        } else if (btn == "BtnSuperCall") {
            this.sendCallBanker(3);
        } else if (btn == "BtnBet1") {
            this.m_iMyBetCoin += 1;
            this.BetArray.push(1);
            cc.log("[BtnBet1] this.BetArray = ", this.BetArray, " m_iMyBetCoin=", this.m_iMyBetCoin);
            this.updateMaxBet();
        } else if (btn == "BtnBet2") {
            this.m_iMyBetCoin += 2;
            this.BetArray.push(2);
            cc.log("[BtnBet2] this.BetArray = ", this.BetArray, " m_iMyBetCoin=", this.m_iMyBetCoin);
            this.updateMaxBet();
        } else if (btn == "BtnBet5") {
            this.m_iMyBetCoin += 5;
            this.BetArray.push(5);
            cc.log("[BtnBet5] this.BetArray = ", this.BetArray, " m_iMyBetCoin=", this.m_iMyBetCoin);
            this.updateMaxBet();
        } else if (btn == "BtnBet10") {
            this.m_iMyBetCoin += 10;
            this.BetArray.push(10);
            cc.log("[BtnBet10] this.BetArray = ", this.BetArray, " m_iMyBetCoin=", this.m_iMyBetCoin);
            this.updateMaxBet();
        } else if (btn == "BtnBetSure") {
            this.sendBetCoinReq();
        } else if (btn == "BtnBetCancle") {
            if (this.BetArray.length > 0) {
                var bet = this.BetArray.pop();
                this.m_iMyBetCoin -= bet;
                cc.log("[BtnBetCancle] this.BetArray = ", this.BetArray, " m_iMyBetCoin=", this.m_iMyBetCoin, " bet=" + bet);
                if (this.m_iMyBetCoin <= 0) {
                    this.m_iMyBetCoin = 1;
                }
                this.updateMaxBet();
            } else {
                cc.warn("[BtnBetCancle] not this.BetArray = ", this.BetArray, " m_iMyBetCoin=", this.m_iMyBetCoin);
            }
        } else if (btn == "BtnNoBullfight") {
            this.sendOpenCard();
        } else if (btn == "BtnBullfight") {
            this.sendOpenCard();
        } else if (btn == "BtnExpression") {
            this.createExpression();
        } else if (btn == "BtnRoomInfo") {
            this.createRoomInfoView();
        }
    },

    createExpression: function createExpression() {
        var ExpressionView = cc.instantiate(this.ExpressionView);
        this.node.addChild(ExpressionView);
        ExpressionView.setPosition(cc.p(0, 0));
    },

    updateMaxBet: function updateMaxBet() {
        if (this.m_iMaxBet != 0 && this.m_iMyBetCoin > this.m_iMaxBet) {
            ToastView.show("本局最大下注为：" + this.m_iMaxBet * this.tableRuleInfo.minante);
            var bigBet = this.m_iMyBetCoin - this.m_iMaxBet;
            var lastPush = this.BetArray.pop();
            var diffBet = lastPush - bigBet;
            this.m_iMyBetCoin = this.m_iMaxBet;
            if (diffBet <= 0) {
                cc.warn("updateMaxBet ignore diffBet=", diffBet);
                return;
            }
            this.BetArray.push(diffBet);
            cc.log("updateMaxBet diffBet=", diffBet);
        }

        var viewId = this.getPlayerViewIdBySeatId(GamePlayer.getInstance().seatid);
        this.setPlayerBetCount(viewId, this.m_iMyBetCoin * this.tableRuleInfo.minante);

        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_BET);
    },

    createMenu: function createMenu() {
        cc.log("Bullfight_GameScene.createMenu");
        var self = this;
        var menuPop = null;
        if (GameSystem.getInstance().roomLevel == 2) {
            var menuPop = cc.instantiate(this.MenuRoomCard);
            this.node.addChild(menuPop);
            menuPop.setPosition(cc.p(0, 0));
            menuPop.getComponent("Bullfighgt_Menu").setCallBackCarry(function () {
                cc.log("Bullfight_GameScene, Bullfighgt_Menu");
                self.createCarryView(20);
            });
            menuPop.getComponent("Bullfighgt_Menu").setRuleInfo(this.tableRuleInfo);
        } else {
            var menuPop = cc.instantiate(this.Menu);
            this.node.addChild(menuPop);
            menuPop.setPosition(cc.p(0, 0));
            menuPop.getComponent("Bullfighgt_Menu").setCallBackCarry(function () {
                cc.log("Bullfight_GameScene, Bullfighgt_Menu");
                self.createCarryView(20);
            });
            menuPop.getComponent("Bullfighgt_Menu").setRuleInfo(this.tableRuleInfo);
        }
    },

    createRoomInfoView: function createRoomInfoView() {
        cc.log("Bullfight_GameScene.createMenu");
        var RoomInfoView = cc.instantiate(this.RoomInfoView);
        this.node.addChild(RoomInfoView);
        RoomInfoView.setPosition(cc.p(0, 0));
        RoomInfoView.getComponent("Bullfight_RoomInfo").setRoomInfo(this.tableRuleInfo);
    },

    createCarryView: function createCarryView(time) {
        var carryPop = cc.instantiate(this.CarryView);
        this.node.addChild(carryPop);
        carryPop.setPosition(cc.p(0, 0));
        carryPop.getComponent("Bullfight_CarryView").setCarryTime(time);
        cc.log("Bullfight_GameScene.createCarryView mincarry=", this.tableRuleInfo.mincarry, " maxcarry=", this.tableRuleInfo.maxcarry, " totalcarry=", this.tableRuleInfo.totalcarry);

        carryPop.getComponent("Bullfight_CarryView").setMinAndMax(this.tableRuleInfo.mincarry, this.tableRuleInfo.maxcarry, this.tableRuleInfo.totalcarry);
    },

    updatePlayerCallType: function updatePlayerCallType(uid, callType) {
        var player = this.sitPlayers.get(uid);
        player.calltype = callType;
    },

    refreshCallBankerFlag: function refreshCallBankerFlag(callUid, bMusic) {
        cc.log("refreshCallBankerFlag uid=", callUid);
        var player = this.findPlayer(callUid);
        var viewId = this.getPlayerViewIdBySeatId(player.seatid);
        this.CallBankerFlag[viewId].node.active = true;
        this.CallBankerFlag[viewId].spriteFrame = this.CallBankerFlagFrame[player.calltype - 1 < 0 ? 0 : player.calltype - 1];

        if (bMusic) {
            MusicMgr.playEffect(player.calltype - 1 == 0 ? Bullfight_AudioConfig.AUDIO_MAN_NOCALLBANKER : Bullfight_AudioConfig.AUDIO_MAN_CALLBANKER);
        }
    },

    refreshReadyFlag: function refreshReadyFlag(readyUid) {
        var player = this.findPlayer(readyUid);
        var viewId = this.getPlayerViewIdBySeatId(player.seatid);
        cc.log("refreshReadyFlag, uid=", readyUid, " seatid=", player.seatid, " viewid=", viewId);
        this.CallBankerFlag[viewId].node.active = true;
        this.CallBankerFlag[viewId].spriteFrame = this.CallBankerFlagFrame[3];
    },

    refreshLookFlag: function refreshLookFlag(uid) {
        var player = this.findPlayer(uid);
        var viewId = this.getPlayerViewIdBySeatId(player.seatid);
        cc.log("refreshLookFlag, uid=", uid, " seatid=", player.seatid, " viewid=", viewId);
        this.CallBankerFlag[viewId].node.active = true;
        this.CallBankerFlag[viewId].spriteFrame = this.CallBankerFlagFrame[4];
    },

    clearCallBankerFlag: function clearCallBankerFlag() {
        cc.log("clearCallBankerFlag");
        for (var index = 0; index < BULLFIGHT_MAX_PLAYER; index++) {
            this.CallBankerFlag[index].node.active = false;
        }
    },

    clearReadyFlag: function clearReadyFlag() {
        this.clearCallBankerFlag();
    },

    clearUserHeadBanker: function clearUserHeadBanker() {
        for (var index = 0; index < 6; index++) {
            this.PlayerItemPos[index].clearPlayerBanker();
        }
    },

    clearUserWinScore: function clearUserWinScore() {
        for (var index = 0; index < this.PlayerItemPos.length; index++) {
            this.PlayerItemPos[index].clearUserWinScore();
        }
    },

    /**************Clock********************/

    startClockTime: function startClockTime(time) {
        this.time = time;
        this.clock.node.active = true;
        this.clock.updateTimeLabel(this.time);
        this.schedule(this.updateClockTime, 1);
    },

    updateClockTime: function updateClockTime() {
        this.clock.updateTimeLabel(this.time);
        this.time--;
        if (this.time < 0) {
            this.clock.node.active = false;
            this.tableStatusTimeOut();
            this.unschedule(this.updateClockTime);
        }
    },

    tableStatusTimeOut: function tableStatusTimeOut() {
        switch (this.tableStatus) {
            case Bullfight_TableStatus.E_TABLE_CLOSE_STATUS:
                //-2, //桌子关闭
                break;
            case Bullfight_TableStatus.E_TABLE_NOT_START_STATUS:
                //0,  //桌子为NULL
                break;
            case Bullfight_TableStatus.E_TABLE_READY_STATUS:
                //1,  //桌子准备
                //this.sendReady();
                break;
            case Bullfight_TableStatus.E_TABLE_CALL_STATUS:
                //2,  //叫庄
                //this.sendCallBanker(1);
                break;
            case Bullfight_TableStatus.E_TABLE_BET_STATUS:
                //3,  //下注
                //this.sendBetCoinReq(this.m_iMyBetCoin);
                break;
            case Bullfight_TableStatus.E_TABLE_OPEN_STATUS:
                //4,  //开牌
                //this.sendOpenCard();
                break;
            case Bullfight_TableStatus.E_TABLE_OVER_STATUS:
                //5,  //游戏结束
                break;
        }
    },

    showTableStatusBtn: function showTableStatusBtn() {
        this.BtnStart.node.active = false;
        this.BtnReady.node.active = false;
        this.BtnCallBankerNode.active = false;
        //this.BetCoinNode.active  = false;
        if (GameSystem.getInstance().roomLevel == 2) {
            this.BtnBetRoomCardNode.active = false;
        } else {
            this.BtnBetNode.active = false;
        }
        this.OpenCardNode.active = false;
        this.clearCallBankerFlag();

        if (GamePlayer.getInstance().bowner == 1 && this.tableStatus == Bullfight_TableStatus.E_TABLE_NOT_START_STATUS) {
            cc.log("showTableStatusBtn bowner=", GamePlayer.getInstance().bowner);
            this.BtnStart.node.active = true;
            this.Tips.node.string = "";
        }

        if (GamePlayer.getInstance().seatid == -1) {
            cc.log("showTableStatusBtn seatid=", GamePlayer.getInstance().seatid);
            return;
        }

        cc.log("showTableStatusBtn, this.tableStatus  = " + this.tableStatus);
        cc.log("showTableStatusBtn, this.playerStatus = " + GamePlayer.getInstance().status);

        switch (this.tableStatus) {
            case Bullfight_TableStatus.E_TABLE_CLOSE_STATUS:
                //-2, //桌子关闭
                break;

            case Bullfight_TableStatus.E_TABLE_NOT_START_STATUS:
                //0,  //桌子为NULL
                if (GamePlayer.getInstance().bowner == 1) {
                    this.BtnStart.node.active = true;
                }
                break;

            case Bullfight_TableStatus.E_TABLE_READY_STATUS:
                //1,  //桌子准备
                //坐下or结束
                if (GamePlayer.getInstance().status == Bullfight_PlayerStatus.E_PLAYER_SIT_STATUS || GamePlayer.getInstance().status == Bullfight_PlayerStatus.E_PLAYER_OVER_STATUS) {
                    this.BtnReady.node.active = true;
                }
                break;

            case Bullfight_TableStatus.E_TABLE_CALL_STATUS:
                //2,  //叫庄
                // 在游戏
                if (GamePlayer.getInstance().status == Bullfight_PlayerStatus.E_PLAYER_ACTIVE_STATUS) {
                    this.BtnCallBankerNode.active = true;
                }
                break;

            case Bullfight_TableStatus.E_TABLE_BET_STATUS:
                //3,  //下注
                //不是庄,且在游戏
                if (this.bankerUid != GamePlayer.getInstance().uid && GamePlayer.getInstance().status == Bullfight_PlayerStatus.E_PLAYER_ACTIVE_STATUS) {
                    //this.BetCoinNode.active = true;
                    if (GameSystem.getInstance().roomLevel == 2) {
                        this.BtnBetRoomCardNode.active = true;
                    } else {
                        this.BtnBetNode.active = true;
                    }
                }
                break;

            case Bullfight_TableStatus.E_TABLE_OPEN_STATUS:
                //4,  //开牌
                if (GamePlayer.getInstance().status == Bullfight_PlayerStatus.E_PLAYER_ACTIVE_STATUS) {
                    this.OpenCardNode.active = true;
                }
                break;

            case Bullfight_TableStatus.E_TABLE_OVER_STATUS:
                //5,  //游戏结束
                break;

            case Bullfight_TableStatus.E_TABLE_IDLE_STATUS:
                break;
        }
    },

    /************   CardItem  ************************/

    sendCardsToPlayer: function sendCardsToPlayer(viewId, cardlist) {
        this.CardItem[viewId].sendCardAnimation(cardlist);
    },

    openplayerCards: function openplayerCards(viewId, cardlist, index1, index2) {
        this.CardItem[viewId].openCardAnimation(cardlist, index1, index2);
    },

    clearAllPlayerCardItem: function clearAllPlayerCardItem() {
        for (var index = 0; index < BULLFIGHT_MAX_PLAYER; index++) {
            this.CardItem[index].clearCardItem();
        }
    },

    setCardType: function setCardType(viewId, type, bMusic) {
        this.CardItem[viewId].setCardType(type);

        if (!bMusic) {
            return;
        }

        switch (type) {
            case Bullfight_CardType.E_BULL_ZERO:
                MusicMgr.playEffect(Bullfight_AudioConfig.AUDIO_MAN_BULL0);
                break;
            case Bullfight_CardType.E_BULL_ONE:
                MusicMgr.playEffect(Bullfight_AudioConfig.AUDIO_MAN_BULL1);
                break;
            case Bullfight_CardType.E_BULL_TWO:
                MusicMgr.playEffect(Bullfight_AudioConfig.AUDIO_MAN_BULL2);
                break;
            case Bullfight_CardType.E_BULL_THREE:
                MusicMgr.playEffect(Bullfight_AudioConfig.AUDIO_MAN_BULL3);
                break;
            case Bullfight_CardType.E_BULL_FOUR:
                MusicMgr.playEffect(Bullfight_AudioConfig.AUDIO_MAN_BULL4);
                break;
            case Bullfight_CardType.E_BULL_FIVE:
                MusicMgr.playEffect(Bullfight_AudioConfig.AUDIO_MAN_BULL5);
                break;
            case Bullfight_CardType.E_BULL_SIX:
                MusicMgr.playEffect(Bullfight_AudioConfig.AUDIO_MAN_BULL6);
                break;
            case Bullfight_CardType.E_BULL_SEVEN:
                MusicMgr.playEffect(Bullfight_AudioConfig.AUDIO_MAN_BULL7);
                break;
            case Bullfight_CardType.E_BULL_EIGHT:
                MusicMgr.playEffect(Bullfight_AudioConfig.AUDIO_MAN_BULL8);
                break;
            case Bullfight_CardType.E_BULL_NINE:
                MusicMgr.playEffect(Bullfight_AudioConfig.AUDIO_MAN_BULL9);
                break;
            case Bullfight_CardType.E_BULL_PAIR:
                // MusicMgr.playEffect(Bullfight_AudioConfig.AUDIO_MAN_BULL10);
                break;
            case Bullfight_CardType.E_BULL_BULL:
                MusicMgr.playEffect(Bullfight_AudioConfig.AUDIO_MAN_BULL10);
                break;
            case Bullfight_CardType.E_BULL_LINE:
                MusicMgr.playEffect(Bullfight_AudioConfig.AUDIO_MAN_LINE);
                break;
            case Bullfight_CardType.E_BULL_THREE_TWO:
                MusicMgr.playEffect(Bullfight_AudioConfig.AUDIO_MAN_3AND2);
                break;
            case Bullfight_CardType.E_BULL_BOMB:
                MusicMgr.playEffect(Bullfight_AudioConfig.AUDIO_MAN_BOMB);
                break;

            case Bullfight_CardType.E_BULL_FIVE_KING:
                MusicMgr.playEffect(Bullfight_AudioConfig.AUDIO_MAN_5FLOWER);
                break;

            case Bullfight_CardType.E_BULL_SMALL_FIVE:
                MusicMgr.playEffect(Bullfight_AudioConfig.AUDIO_MAN_5LITTLEBULL);
                break;
            case Bullfight_CardType.E_BULL_MAX:
                break;
        }
    },

    setPlayerBetCount: function setPlayerBetCount(viewId, count) {
        this.CardItem[viewId].setPlayerBetCount(count);
    },

    setCustomCardType: function setCustomCardType(active) {
        this.CardItem[5].setCustomCardType(active);
    },

    /********** PLayer   ***************/
    delPlayer: function delPlayer(uid) {
        var it = this.findPlayer(uid);
        cc.log("Bullfight_GameScene.delPlayer,uid = " + uid + " it = " + it);
        if (it != null) {
            this.removeOnePlayerInTable(it);
            if (this.sitPlayers.containsKey(uid)) {
                cc.log("Bullfight_GameScene.delPlayer, delete uid= " + uid + " by sitPlayers");
                this.sitPlayers.delete(uid);
                if (uid == GamePlayer.getInstance().uid) {
                    cc.log("Bullfight_GameScene.delPlayer, uid= " + uid + " seatid=-1");
                    GamePlayer.getInstance().seatid = -1;
                }
            }
        }
    },

    delAllPlayer: function delAllPlayer() {
        var self = this;

        this.sitPlayers.forEach(function (ud) {
            self.removeOnePlayerInTable(ud);
        });
        GamePlayer.getInstance().seatid = -1;

        this.sitPlayers.clear();
        this.sitPlayers = new Map();
    },

    addPlayer: function addPlayer(playerinfo) {
        this.delPlayer(playerinfo.uid);
        if (this.sitPlayers.size() < this.m_iMaxPlayers) {
            if (playerinfo.uid == GamePlayer.getInstance().uid) {
                GamePlayer.getInstance().Copy(playerinfo);
                this.sitPlayers.set(GamePlayer.getInstance().uid, GamePlayer.getInstance());
                // this.refreshAllPlayerOnTable();
            } else {
                this.sitPlayers.set(playerinfo.uid, playerinfo);
                // this.showOnePlayerInTable(playerinfo);
            }
        }
    },

    refreshAllPlayerOnTable: function refreshAllPlayerOnTable(bShowDetail) {
        this.clearAllPlayerCardItem();
        this.removeAllPlayerInTable();

        this.showTableStatusBtn();

        var action = cc.sequence(cc.fadeOut(0), cc.fadeIn(0.5)).speed(0.4);
        this.PlayNode.runAction(action);

        cc.log("Bullfight_GameScene.this.sitPlayers = " + this.sitPlayers.size());
        for (var index = 0; index < this.sitPlayers.size(); index++) {
            var player = this.sitPlayers.element(index).value;
            if (player == undefined) {
                cc.log("refreshAllPlayerOnTable player is undefined.");
                continue;
            }

            this.showOnePlayerInTable(player);

            if (!bShowDetail) continue;

            var viewId = this.getPlayerViewIdBySeatId(player.seatid);

            switch (this.tableStatus) {
                case Bullfight_TableStatus.E_TABLE_READY_STATUS:
                    cc.log("E_TABLE_READY_STATUS, uid=", player.uid, " player.status=", player.status);
                    if (player.status == Bullfight_PlayerStatus.E_PLAYER_READY_STATUS) {
                        this.refreshReadyFlag(player.uid);
                    }
                    break;

                case Bullfight_TableStatus.E_TABLE_CALL_STATUS:
                    cc.log("E_TABLE_CALL_STATUS, uid=", player.uid, " player.status=", player.status);
                    if (player.status == Bullfight_PlayerStatus.E_PLAYER_ACTIVE_STATUS) {
                        if (player.calltype > 0) {
                            this.refreshCallBankerFlag(player.uid, false);
                        }

                        if (player.uid == GamePlayer.getInstance().uid) {
                            this.sendCardsToPlayer(viewId, player.cards);
                        } else {
                            var cards = [0, 0, 0, 0, 0];
                            this.sendCardsToPlayer(viewId, cards);
                        }
                    }
                    break;

                case Bullfight_TableStatus.E_TABLE_BET_STATUS:
                    //3,  //下注
                    cc.log("E_TABLE_BET_STATUS, uid=", player.uid, " player.status=", player.status, " isbanker=", player.bBanker);
                    if (player.status == Bullfight_PlayerStatus.E_PLAYER_ACTIVE_STATUS) {
                        if (player.bBanker == 1) {
                            cc.log("E_TABLE_BET_STATUS, uid=", player.uid, " setbanker");
                            var viewId = this.getPlayerViewIdBySeatId(player.seatid);
                            this.PlayerItemPos[viewId].setPlayerBanker();
                        } else if (player.betcoinmul > 0) {
                            cc.log("E_TABLE_BET_STATUS, uid=", player.uid, " betcoinmul=", player.betcoinmul);
                            var viewId = this.getPlayerViewIdBySeatId(player.seatid);
                            this.setPlayerBetCount(viewId, player.betcoinmul * this.tableRuleInfo.minante);
                        }

                        if (player.uid == GamePlayer.getInstance().uid) {
                            this.sendCardsToPlayer(viewId, player.cards);
                            if (player.bBanker == 0) {
                                this.showTableStatusBtn();
                            }
                        } else {
                            var cards = [0, 0, 0, 0, 0];
                            this.sendCardsToPlayer(viewId, cards);
                        }
                    }
                    break;

                case Bullfight_TableStatus.E_TABLE_OPEN_STATUS:
                    //4,  //开牌
                    cc.log("E_TABLE_OPEN_STATUS, uid=", player.uid, " player.status=", player.status);

                    if (player.status == Bullfight_PlayerStatus.E_PLAYER_ACTIVE_STATUS) {
                        if (player.bBanker == 1) {
                            cc.log("E_TABLE_OPEN_STATUS, uid=", player.uid, " setbanker");
                            this.PlayerItemPos[viewId].setPlayerBanker();
                        } else if (player.betcoinmul > 0) {
                            cc.log("E_TABLE_OPEN_STATUS, uid=", player.uid, " betcoinmul=", player.betcoinmul);
                            this.setPlayerBetCount(viewId, player.betcoinmul * this.tableRuleInfo.minante);
                        }

                        if (player.uid == GamePlayer.getInstance().uid) {
                            if (player.bOpenCard == 1) {
                                this.setCardType(viewId, player.bulltype, false);
                                this.openplayerCards(viewId, player.cards, -1, -1);
                                this.setCustomCardType(false);
                                this.OpenCardNode.active = false;
                                this.Tips.string = "等待其他玩家看牌";
                            } else {
                                this.openplayerCards(viewId, player.cards, -1, -1);
                                this.showTableStatusBtn();
                                this.setCustomCardType(true);
                            }
                        } else {
                            if (player.bOpenCard == 1) {
                                this.setCardType(viewId, player.bulltype, false);
                                this.openplayerCards(viewId, player.cards, -1, -1);
                            } else {
                                var cards = [0, 0, 0, 0, 0];
                                this.sendCardsToPlayer(viewId, cards);
                            }
                        }
                    }
                    break;

                case Bullfight_TableStatus.E_TABLE_OVER_STATUS:
                    //5,  //游戏结束
                    cc.log("E_TABLE_OVER_STATUS, uid=", player.uid, " player.status=", player.status);
                    if (player.status == Bullfight_PlayerStatus.E_PLAYER_OVER_STATUS) {

                        this.PlayerItemPos[viewId].setUserWinScore(player.finalcoin);

                        if (player.uid == GamePlayer.getInstance().uid && msg.seaters[index].finalcoin > 0) {
                            var pos = this.CallBankerFlag[viewid].node.position;
                            this.GiftAnimation.playWinAnimation(pos);
                        }
                    }

                case Bullfight_TableStatus.E_TABLE_IDLE_STATUS:
                    break;
            }
        }
    },

    showOnePlayerInTable: function showOnePlayerInTable(player) {
        if (player == undefined) {
            cc.error("Bullfight_GameScene.showOnePlayerInTable , player == undefined");
            return;
        }
        var viewId = this.getPlayerViewIdBySeatId(player.seatid);
        cc.log("Bullfight_GameScene.showOnePlayerInTable, seatid = " + player.seatid, " viewId = " + viewId);
        this.PlayerItemPos[viewId].updatePlayerInfo(player);
    },

    playerStandUpOrDown: function playerStandUpOrDown(player, action) {},

    removeOnePlayerInTable: function removeOnePlayerInTable(player) {
        cc.log("Bullfight_GameScene.removeOnePlayerInTable,status = " + player.status);
        var viewId = this.getPlayerViewIdBySeatId(player.seatid);
        cc.log("Bullfight_GameScene.removeOnePlayerInTable, viewId = " + viewId + ",player.seatid = " + player.seatid);
        this.PlayerItemPos[viewId].clearPlayerInfo();
    },

    removeAllPlayerInTable: function removeAllPlayerInTable() {
        for (var index = 0; index < 6; index++) {
            this.PlayerItemPos[index].clearPlayerInfo();
        }
    },

    getPlayerViewIdBySeatId: function getPlayerViewIdBySeatId(seatId) {
        var selfViewId = window.BULLFIGHT_MAX_PLAYER - 1;
        var viewId = seatId;

        if (GamePlayer.getInstance().seatid >= 0) {
            viewId = (seatId - (GamePlayer.getInstance().seatid - selfViewId) + window.BULLFIGHT_MAX_PLAYER) % window.BULLFIGHT_MAX_PLAYER;
            cc.log("Bullfight_GameScene.getPlayerViewIdBySeatId, seatId = %d,viewId = %d", seatId, viewId, " myseatid=", GamePlayer.getInstance().seatid);
        } else {
            cc.log("Bullfight_GameScene.getPlayerViewIdBySeatId, seatId = %d,viewId = %d", seatId, viewId);
        }
        return viewId;
    },

    updatePlayerStatus: function updatePlayerStatus(uid, status) {
        var player = this.sitPlayers.get(uid);
        player.status = status;
    },

    findPlayer: function findPlayer(uid) {
        var player = this.sitPlayers.get(uid);
        return player;
    },

    findPlayerBySeatid: function findPlayerBySeatid(seatid) {
        var player = null;
        this.sitPlayers.forEach(function (value) {
            if (value.seatid == seatid) {
                player = value;
            }
        });
        return player;
    },

    onPause: function onPause() {
        this._super();
    },

    onResume: function onResume() {
        this._super();
    }

});

cc._RFpop();
},{"AlertView":"AlertView","Audio_Common":"Audio_Common","BaseScene":"BaseScene","Bullfight_AudioConfig":"Bullfight_AudioConfig","Bullfight_CardItem":"Bullfight_CardItem","Bullfight_Clock":"Bullfight_Clock","Bullfight_GiftAnimation":"Bullfight_GiftAnimation","Bullfight_PlayerItem":"Bullfight_PlayerItem","Cmd_Bullfight":"Cmd_Bullfight","GameCallOC":"GameCallOC","GamePlayer":"GamePlayer","GameSystem":"GameSystem","LoadingView":"LoadingView","MessageFactory":"MessageFactory","MusicMgr":"MusicMgr","Player":"Player","ToastView":"ToastView","UtilTool":"UtilTool"}],"Bullfight_GetPlayersListReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '2e6cclqN4tE6o/yi5AAccNS', 'Bullfight_GetPlayersListReqPacket');
// Script\GameScene\Bullfight\Cmd\Cmd_Req\Bullfight_GetPlayersListReqPacket.js

'use strict';

/**
 * Created by shrimp on 17/3/17.
 */
var MessageReq = require("MessageReq");
var Cmd_Bullfight = require('Cmd_Bullfight');
var GameSystem = require('GameSystem');
function Bullfight_GetPlayersListReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = Cmd_Bullfight.US_REQ_PLAYER_LIST_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            gamesvcid: GameSystem.getInstance().gamesvcid,
            tableid: GameSystem.getInstance().tableid
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = Bullfight_GetPlayersListReqPacket;

cc._RFpop();
},{"Cmd_Bullfight":"Cmd_Bullfight","GameSystem":"GameSystem","MessageReq":"MessageReq"}],"Bullfight_GetPlayersListRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e5e359nA/FDKJd6DAISco4T', 'Bullfight_GetPlayersListRespPacket');
// Script\GameScene\Bullfight\Cmd\Cmd_Resp\Bullfight_GetPlayersListRespPacket.js

'use strict';

/**
 * Created by shrimp on 17/3/17.
 */

var MessageResp = require('MessageResp');
var Cmd_Bullfight = require('Cmd_Bullfight');
/*
* type US_RESP_PLAYER_LIST_T struct {
 JsonHead
 RespHead
 Actors   []ACTOR_T `json:"actors"`
 Watchers []WATCHER_T `json:"watchers"`
 }

 //参与者信息
 type ACTOR_T struct {
 Uid       uint32 `json:"uid"`
 Name      string `json:"name"`
 HeadUrl   string `json:"headurl"`
 TotalCoin int64  `json:"total"` //总带入金币
 WinCoin   int64  `json:"win"`   //输赢多少金币
 }

 //看客信息
 type WATCHER_T struct {
 Uid     uint32 `json:"uid"`
 Name    string `json:"name"`
 HeadUrl string `json:"headurl"`
 }
* */
function Bullfight_GetPlayersListRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = Cmd_Bullfight.US_RESP_PLAYER_LIST_CMD_ID;

    this.remainTime = 0;
    this.roundNum = 0;
    this.actors = [];
    this.watchers = [];
    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;

        this.remainTime = msg.remaintime;
        this.roundNum = msg.roundnum;
        this.actors = msg.actors;
        this.watchers = msg.watchers;
    };
}

module.exports = Bullfight_GetPlayersListRespPacket;

cc._RFpop();
},{"Cmd_Bullfight":"Cmd_Bullfight","MessageResp":"MessageResp"}],"Bullfight_GiftAnimation":[function(require,module,exports){
"use strict";
cc._RFpush(module, '8e8d2YIHBZPLrdVn/DK/tZZ', 'Bullfight_GiftAnimation');
// Script\GameScene\Bullfight\SceneView\Bullfight_GiftAnimation.js

"use strict";

window.GiftType = cc.Enum({
    E_ROSE_GIFT: 1, //玫瑰
    E_LOVE_GIFT: 2, //爱心
    E_FOAM_GIFT: 3, //泡沫
    E_BIG_ROSE_GIFT: 4, //大朵玫瑰
    E_KETCHUP_GIFT: 5 });

cc.Class({
    extends: cc.Component,

    properties: {
        // ...
        GiftIcon: [cc.SpriteFrame],
        GiftFrame1: [cc.SpriteFrame],
        GiftFrame2: [cc.SpriteFrame],
        GiftFrame3: [cc.SpriteFrame],
        GiftFrame4: [cc.SpriteFrame],
        GiftFrame5: [cc.SpriteFrame],
        FaceFrame1: [cc.SpriteFrame],
        FaceFrame2: [cc.SpriteFrame],
        FaceFrame3: [cc.SpriteFrame],
        FaceFrame4: [cc.SpriteFrame],
        FaceFrame5: [cc.SpriteFrame],
        FaceFrame6: [cc.SpriteFrame],
        FaceFrame7: [cc.SpriteFrame],
        FaceFrame8: [cc.SpriteFrame],
        FaceFrame9: [cc.SpriteFrame],
        FaceFrame10: [cc.SpriteFrame],
        FaceFrame11: [cc.SpriteFrame],
        FaceFrame12: [cc.SpriteFrame],
        WinFrame: [cc.SpriteFrame]
    },

    // use this for initialization
    onLoad: function onLoad() {},

    playWinAnimation: function playWinAnimation(pos) {
        var node = new cc.Node();
        node.setPosition(pos);
        node.y += 200;
        var sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = this.WinFrame[0];
        //node.position = cc.p(540,960);
        this.node.addChild(node);
        var animation = node.addComponent(cc.Animation);
        var clip = cc.AnimationClip.createWithSpriteFrames(this.WinFrame, this.WinFrame.length);
        animation.playTimes = -1;
        animation.addClip(clip, "anim");
        animation.play("anim");

        node.runAction(cc.sequence(cc.delayTime(1.5), cc.removeSelf(true)).speed(0.4));
    },

    playFaceAnimation: function playFaceAnimation(type, pos) {
        var animationFrames = [];
        if (type == 1) {
            animationFrames = this.FaceFrame1;
        } else if (type == 2) {
            animationFrames = this.FaceFrame2;
        } else if (type == 3) {
            animationFrames = this.FaceFrame3;
        } else if (type == 4) {
            animationFrames = this.FaceFrame4;
        } else if (type == 5) {
            animationFrames = this.FaceFrame5;
        } else if (type == 6) {
            animationFrames = this.FaceFrame6;
        } else if (type == 7) {
            animationFrames = this.FaceFrame7;
        } else if (type == 8) {
            animationFrames = this.FaceFrame8;
        } else if (type == 9) {
            animationFrames = this.FaceFrame9;
        } else if (type == 10) {
            animationFrames = this.FaceFrame10;
        } else if (type == 11) {
            animationFrames = this.FaceFrame11;
        } else if (type == 12) {
            animationFrames = this.FaceFrame12;
        }
        this.playAnimationByType(animationFrames, pos);
    },

    playGiftAnimation: function playGiftAnimation(giftType, start, end) {
        var animationFrames = [];
        if (giftType == 1) {
            animationFrames = this.GiftFrame1;
        } else if (giftType == 2) {
            animationFrames = this.GiftFrame2;
        } else if (giftType == 3) {
            animationFrames = this.GiftFrame3;
        } else if (giftType == 4) {
            animationFrames = this.GiftFrame4;
        } else if (giftType == 5) {
            animationFrames = this.GiftFrame5;
        }
        this.playGiftAnimationByType(animationFrames, start, end);
    },

    playAnimationByType: function playAnimationByType(Frames, pos) {
        var node = new cc.Node();
        node.setPosition(pos);
        var sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = Frames[0];
        this.node.addChild(node);
        var animation = node.addComponent(cc.Animation);
        var clip = cc.AnimationClip.createWithSpriteFrames(Frames, Frames.length);
        animation.addClip(clip, "anim");
        animation.play("anim");

        node.runAction(cc.sequence(cc.delayTime(Frames.length * 0.2), cc.removeSelf(true)).speed(0.4));
    },

    playGiftAnimationByType: function playGiftAnimationByType(Frames, start, end) {
        var node = new cc.Node();
        node.setPosition(start);
        var sprite = node.addComponent(cc.Sprite);
        sprite.spriteFrame = Frames[0];
        this.node.addChild(node);

        var finished = cc.callFunc(function (node, Frames) {
            var animation = node.addComponent(cc.Animation);
            var clip = cc.AnimationClip.createWithSpriteFrames(Frames, Frames.length);
            animation.addClip(clip, "anim");
            animation.play("anim");
            node.runAction(cc.sequence(cc.delayTime(Frames.length * 0.4), cc.removeSelf(true)));
        }, node, Frames);

        node.runAction(cc.sequence(cc.moveTo(0.5, end), finished).speed(0.4));
    }
});

cc._RFpop();
},{}],"Bullfight_HelpReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '57983gMbEFBpprDmSIO1rnW', 'Bullfight_HelpReqPacket');
// Script\GameScene\Bullfight\Cmd\Cmd_Req\Bullfight_HelpReqPacket.js

'use strict';

/**
 * Created by shrimp on 17/3/2.
 */

var MessageReq = require("MessageReq");
var Cmd_Bullfight = require('Cmd_Bullfight');
var GameSystem = require('GameSystem');
function Bullfight_HelpReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = Cmd_Bullfight.SBF_REQ_HELP_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            gamesvcid: GameSystem.getInstance().gamesvcid,
            tableid: GameSystem.getInstance().tableid
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = Bullfight_HelpReqPacket;

cc._RFpop();
},{"Cmd_Bullfight":"Cmd_Bullfight","GameSystem":"GameSystem","MessageReq":"MessageReq"}],"Bullfight_HelpRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'edf89MECARN9JzrQdnu+/3r', 'Bullfight_HelpRespPacket');
// Script\GameScene\Bullfight\Cmd\Cmd_Resp\Bullfight_HelpRespPacket.js

'use strict';

/**
 * Created by shrimp on 17/3/2.
 */
var MessageResp = require('MessageResp');
var Cmd_Bullfight = require('Cmd_Bullfight');
function Bullfight_HelpRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = Cmd_Bullfight.SBF_RESP_HELP_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        //GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = Bullfight_HelpRespPacket;

cc._RFpop();
},{"Cmd_Bullfight":"Cmd_Bullfight","MessageResp":"MessageResp"}],"Bullfight_MultCell":[function(require,module,exports){
"use strict";
cc._RFpush(module, '4c82fhbEGZMGbAfEsK4SESM', 'Bullfight_MultCell');
// Script\GameScene\Bullfight\PopView\Bullfight_MultCell.js

'use strict';

/**
 * Created by shrimp on 17/3/2.
 */
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require('GameSystem');
cc.Class({
    extends: cc.Component,

    properties: {
        CardType: 0,
        CurMult: 1,
        CurPos: 0,
        FontName: cc.Label,
        Number: cc.Label,
        BtnAdd: cc.Button,
        BtnSub: cc.Button,
        BtnSpriteFrame: [cc.SpriteFrame], // 0 : 按钮用白色背景 ， 1: 按钮用黄色背景
        bClubCreate: false
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.initData();
    },

    // E_BULL_ZERO       = 0 //没牛
    // E_BULL_ONE        = 1 //牛1
    // E_BULL_TWO        = 2
    // E_BULL_THREE      = 3
    // E_BULL_FOUR       = 4
    // E_BULL_FIVE       = 5
    // E_BULL_SIX        = 6
    // E_BULL_SEVEN      = 7
    // E_BULL_EIGHT      = 8
    // E_BULL_NINE       = 9
    // E_BULL_PAIR       = 10 //牛对子
    // E_BULL_BULL       = 11 //牛牛
    // E_BULL_LINE       = 12 //牛顺子
    // E_BULL_THREE_TWO  = 13 //三带二
    // E_BULL_BOMB       = 14 //炸弹
    // E_BULL_SMALL_FIVE = 15 //五小牛
    // E_BULL_FIVE_KING  = 16 //五花牛
    // E_BULL_MAX        = 17
    initData: function initData() {
        this.CardTypeMult = [[1], [1], [1], [1], [1], [1], [1], //0~6
        [1, 2], //7
        [2, 3], //8
        [2, 3], //9
        [0], //牛对子
        [3, 4, 5], //牛牛
        [0, 4, 5, 6, 7, 8], //牛顺子
        [0, 4, 5, 6, 7, 8], //三带二
        [0, 4, 5, 6, 7, 8], //炸弹
        [0, 4, 5, 6, 7, 8], //五花牛
        [0, 4, 5, 6, 7, 8]];

        this.length = this.CardTypeMult[this.CardType].length;
        this.CurMult = this.CardTypeMult[this.CardType][0];
        this.setNumber(this.CurMult);
        this.setFontName(window.Bullfight_CardTypeName[this.CardType]);
        this.setBtnBgFrame();
    },

    getCurMult: function getCurMult() {
        return this.CurMult;
    },

    setCardType: function setCardType(cardtype) {
        this.CardType = cardtype;
        this.initData();
    },

    setFontName: function setFontName(name) {
        cc.log("Bullfight_MultCell.setFontName,name = " + name);
        this.FontName.string = name;
    },

    setNumber: function setNumber(number) {
        cc.log("Bullfight_MultCell.setNumber,number = " + number);
        this.Number.string = number;
        this.setBtnBgFrameByCurMult();
    },

    setClubCreate: function setClubCreate(bClubCreate) {
        this.bClubCreate = bClubCreate;
        cc.log("Bullfight_MultCell.setClubCreate,bClubCreate = " + bClubCreate);
        if (this.bClubCreate == false) {
            this.BtnSub.node.getComponent(cc.Sprite).spriteFrame = this.BtnSpriteFrame[0];
            this.BtnSub.interactable = false;
            this.BtnAdd.node.getComponent(cc.Sprite).spriteFrame = this.BtnSpriteFrame[0];
            this.BtnAdd.interactable = false;
        }
        // else
        // {
        //     this.setBtnBgFrameByCurMult();
        // }
    },

    setBtnBgFrame: function setBtnBgFrame() {
        if (this.CardType >= window.Bullfight_CardType.E_BULL_SEVEN) {
            this.BtnAdd.node.getComponent(cc.Sprite).spriteFrame = this.BtnSpriteFrame[1];
            this.BtnSub.node.getComponent(cc.Sprite).spriteFrame = this.BtnSpriteFrame[1];
        } else {
            this.BtnAdd.interactable = false;
            this.BtnSub.interactable = false;
        }

        this.setBtnBgFrameByCurMult();
    },

    setBtnBgFrameByCurMult: function setBtnBgFrameByCurMult() {
        cc.log("Bullfight_MultCell.setBtnBgFrameByCurMult,this.CurMult = " + this.CurMult);
        if (this.length <= 1) return;

        if (this.bClubCreate == false) {
            var mult = [1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 3, 4, 4, 5, 5, 5];
            this.CurMult = mult[this.CardType];
            this.Number.string = mult[this.CardType];
            this.setClubCreate(this.bClubCreate);
        } else if (this.CurMult > this.CardTypeMult[this.CardType][0] && this.CurMult < this.CardTypeMult[this.CardType][this.length - 1]) {
            this.BtnSub.node.getComponent(cc.Sprite).spriteFrame = this.BtnSpriteFrame[1];
            this.BtnSub.interactable = true;
            this.BtnAdd.node.getComponent(cc.Sprite).spriteFrame = this.BtnSpriteFrame[1];
            this.BtnAdd.interactable = true;
        } else if (this.CurMult <= this.CardTypeMult[this.CardType][0]) {
            this.BtnSub.node.getComponent(cc.Sprite).spriteFrame = this.BtnSpriteFrame[0];
            this.BtnSub.interactable = false;
            this.BtnAdd.node.getComponent(cc.Sprite).spriteFrame = this.BtnSpriteFrame[1];
            this.BtnAdd.interactable = true;
        } else {
            this.BtnSub.node.getComponent(cc.Sprite).spriteFrame = this.BtnSpriteFrame[1];
            this.BtnSub.interactable = true;
            this.BtnAdd.node.getComponent(cc.Sprite).spriteFrame = this.BtnSpriteFrame[0];
            this.BtnAdd.interactable = false;
        }
    },

    callBackBtn: function callBackBtn(event, CustomEventData) {
        var btnName = event.target.getName();
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);

        cc.log("Bullfight_Menu.callBackBtn,btnName = " + btnName);
        if (btnName == "Btn_Add") {
            this.CurPos++;
            if (this.CurPos >= this.length) {
                this.CurPos = this.length - 1;
            }
            this.CurMult = this.CardTypeMult[this.CardType][this.CurPos];
            this.setNumber(this.CurMult);
        } else if (btnName == "Btn_Sub") {
            this.CurPos--;
            if (this.CurPos < 0) {
                this.CurPos = 0;
            }
            this.CurMult = this.CardTypeMult[this.CardType][this.CurPos];
            this.setNumber(this.CurMult);
        }
    }
});

cc._RFpop();
},{"Audio_Common":"Audio_Common","GameSystem":"GameSystem","MusicMgr":"MusicMgr"}],"Bullfight_NotifyGameOverOncePacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '76c1aORj9dBaZUT68d+nAx0', 'Bullfight_NotifyGameOverOncePacket');
// Script\GameScene\Bullfight\Cmd\Cmd_Resp\Bullfight_NotifyGameOverOncePacket.js

'use strict';

/**
 * Created by shrimp on 17/3/2.
 */

/*
* //通知玩家，一局游戏结束
 type GAME_OVER_SEATERS_T struct {
 Uid       uint32 `json:"uid"`
 FinalCoin int64  `json:"finalcoin"`
 Coin      int64    `json:"coin"`
 }

 type SBF_NOTIFY_ONE_GAME_RESULT_T struct {
 JsonHead
 RespHead
 TableId  int32    `json:"tableid"`
 TStatus  int      `json:"tstatus"`
 Seaters	 []GAME_OVER_SEATERS_T  `json:"seaters"`
 }
* */

var MessageResp = require('MessageResp');
var Cmd_Bullfight = require('Cmd_Bullfight');

function Bullfight_NotifyGameOverOncePacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = Cmd_Bullfight.SBF_NOTIFY_ONE_GAME_RESULT_CMD_ID;

    this.tableid = 0;
    this.tstatus = 0;
    this.overtime = 5;
    this.seaters = [];

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.tableid = msg.tableid;
        this.tstatus = msg.tstatus;
        this.seaters = msg.seaters;
        this.ustatus = msg.ustatus;
        this.overtime = msg.overtime;
    };
}

module.exports = Bullfight_NotifyGameOverOncePacket;

cc._RFpop();
},{"Cmd_Bullfight":"Cmd_Bullfight","MessageResp":"MessageResp"}],"Bullfight_NotifyGameOverTotalPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '2764ajusJ9Ev400SCq2MjO3', 'Bullfight_NotifyGameOverTotalPacket');
// Script\GameScene\Bullfight\Cmd\Cmd_Resp\Bullfight_NotifyGameOverTotalPacket.js

'use strict';

/**
 * Created by shrimp on 17/3/2.
 */
var MessageResp = require('MessageResp');
var Cmd_Bullfight = require('Cmd_Bullfight');

/*
* type SBF_NOTIFY_LAST_GAME_RESULT_T struct {
 JsonHead
 RespHead
 TableId int32                `json:"tableid"`
 Scores  []SBF_PLAYER_SCORE_T `json:"scores"`
 }

 type SBF_PLAYER_SCORE_T struct {
 Uid        int32 `json:"uid"`
 Coin       int64 `json:"coin"`
 PlayNum    int   `json:"playnum"`
 MaxWin     int   `json:"maxwin"`
 TotalCarry int64 `json:"totalcarry"`
 }
* */
function Bullfight_NotifyGameOverTotalPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = Cmd_Bullfight.SBF_NOTIFY_TOTAL_GAME_RESULT_CMD_ID;

    this.privateid = 0;
    this.TableId = 0;
    this.Scores = [];
    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;

        this.privateid = msg.privateid;
        this.TableId = msg.tableid;
        this.Scores = msg.scores;
    };
}

module.exports = Bullfight_NotifyGameOverTotalPacket;

cc._RFpop();
},{"Cmd_Bullfight":"Cmd_Bullfight","MessageResp":"MessageResp"}],"Bullfight_NotifyGameStartPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '62877fK95FCtLemb1CNplCj', 'Bullfight_NotifyGameStartPacket');
// Script\GameScene\Bullfight\Cmd\Cmd_Resp\Bullfight_NotifyGameStartPacket.js

'use strict';

/**
 * Created by shrimp on 17/3/5.
 */

/*
* // 通知玩家游戏开始
 type GAME_START_SEATERS_T struct {
 Uid     uint32 `json:"uid"`
 UStatus int `json:"ustatus"`
 SeatId  int `json:"seatid"`
 }

 type SBF_NOTIFY_GAME_START_T struct {
 JsonHead
 UStatus  int                    `json:"ustatus"`  //自己的状态
 SeatId   int                    `json:"seatid"`
 TableId  int32                  `json:"tableid"`  //桌子ID
 TStatus  int                    `json:"tstatus"`  //桌子状态
 CallTime int                    `json:"calltime"` //抢庄时间
 Cards    []byte                 `json:"cards"`    //自己的5张牌
 Seaters  []GAME_START_SEATERS_T `json:"seaters"`
 }
 */
var MessageResp = require('MessageResp');
var Cmd_Bullfight = require('Cmd_Bullfight');
function Bullfight_NotifyGameStartPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = Cmd_Bullfight.SBF_NOTIFY_GAME_START_CMD_ID;
    this.ustatus = 0;
    this.seatid = -1;
    this.tableid = 0;
    this.tstatus = 0;
    this.calltime = 0;
    this.cards = [];
    this.seaters = [];
    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;

        this.ustatus = msg.ustatus;
        this.seatid = msg.seatid;
        this.tableid = msg.tableid;
        this.tstatus = msg.tstatus;
        this.calltime = msg.calltime;
        this.cards = msg.cards;
        this.seaters = msg.seaters;
        this.roundnum = msg.roundnum;
    };
}

module.exports = Bullfight_NotifyGameStartPacket;

cc._RFpop();
},{"Cmd_Bullfight":"Cmd_Bullfight","MessageResp":"MessageResp"}],"Bullfight_NotifyKickOutPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'b86ffAq4jxGpKbf6Vepu+S9', 'Bullfight_NotifyKickOutPacket');
// Script\GameScene\Bullfight\Cmd\Cmd_Resp\Bullfight_NotifyKickOutPacket.js

'use strict';

/**
 * Created by shrimp on 17/3/11.
 */

/*
* type SBF_NOTIFY_KICKOUT_T struct {
 JsonHead
 RespHead
 TableId int32   `json:"tableid"`
 SeatUid uint32  `json:"seatuid"`
 SeatId  int     `json:"seatid"`
 }

 触发场景： 1.  带入金币超时
 2. 玩家携带金币不足*/
var MessageResp = require('MessageResp');
var Cmd_Bullfight = require('Cmd_Bullfight');

function Bullfight_NotifyKickOutPacket() {
  MessageResp.apply(this, []); //集成父类数据

  this.cmd = Cmd_Bullfight.SBF_NOTIFY_KICKOUT_CMD_ID;
  this.tableid = 0;
  this.seatuid = 0;
  this.seatid = -1;
  //接收的数据
  this.onMessage = function (msg) {

    this.seq = msg.seq;
    this.uid = msg.uid;
    this.code = msg.code;
    this.desc = msg.desc;
    this.tableid = msg.tableid;
    this.seatuid = msg.seatuid;
    this.seatid = msg.seatid;
    this.status = msg.status;
  };
}

module.exports = Bullfight_NotifyKickOutPacket;

cc._RFpop();
},{"Cmd_Bullfight":"Cmd_Bullfight","MessageResp":"MessageResp"}],"Bullfight_NotifyNotBetPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '77ec7Y23EJG7oKc0j1GA50b', 'Bullfight_NotifyNotBetPacket');
// Script\GameScene\Bullfight\Cmd\Cmd_Resp\Bullfight_NotifyNotBetPacket.js

'use strict';

/**
 * Created by shrimp on 17/3/16.
 */

var MessageResp = require('MessageResp');
var Cmd_Bullfight = require('Cmd_Bullfight');

/*
* type SBF_NOT_BET_COIN_T struct {
 Uid        uint32  `json:"uid"`
 SeatId     int     `json:"seatid"`
 BetCoinMul int     `json:"betcoinmul"`
 }

 type SBF_NOTIFY_NOT_BET_COIN_T struct {             //没有下注的玩家
 JsonHead
 RespHead
 TableId   int32                `json:"tableid"` //桌子id
 TStatus   int                  `json:"tstatus"` //桌子状态
 Seaters   []SBF_NOT_BET_COIN_T `json:"seaters"`
 }

 * */
function Bullfight_NotifyNotBetPacket() {
  MessageResp.apply(this, []); //集成父类数据

  this.cmd = Cmd_Bullfight.SBF_NOTIFY_NOT_BET_COIN_CMD_ID;
  this.tableid = 0;
  this.tstatus = 0;
  this.seaters = [];
  //接收的数据
  this.onMessage = function (msg) {

    this.seq = msg.seq;
    this.uid = msg.uid;
    this.code = msg.code;
    this.desc = msg.desc;
    // if(this.code < SocketRetCode.RET_SUCCESS)
    //     return;
    this.tableid = msg.tableid;
    this.tstatus = msg.tstatus;
    this.seaters = msg.seaters;
  };
}

module.exports = Bullfight_NotifyNotBetPacket;

cc._RFpop();
},{"Cmd_Bullfight":"Cmd_Bullfight","MessageResp":"MessageResp"}],"Bullfight_NotifyNotCallBankerPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'b3f9cLcOARMJKX0hdXALPzi', 'Bullfight_NotifyNotCallBankerPacket');
// Script\GameScene\Bullfight\Cmd\Cmd_Resp\Bullfight_NotifyNotCallBankerPacket.js

'use strict';

/**
 * Created by shrimp on 17/3/16.
 */

var MessageResp = require('MessageResp');
var Cmd_Bullfight = require('Cmd_Bullfight');

/*
 //通知放弃操作的玩家
 type NOT_CALL_SEATER_T struct {
 Uid       uint32 `json:"uid"`
 SeatId    int    `json:"seatid"`
 }

 type SBF_NOTIFY_NOT_CALL_BANKER_T struct{
 JsonHead
 RespHead
 TableId  int32  `json:"tableid"`      //桌子id
 TStatus  int    `json:"tstatus"`      //桌子状态
 Seaters  []NOT_CALL_SEATER_T `json:"seaters"`
 }
* */
function Bullfight_NotifyNotCallBankerPacket() {
  MessageResp.apply(this, []); //集成父类数据

  this.cmd = Cmd_Bullfight.SBF_NOTIFY_NOT_CALL_BANKER_CMD_ID;
  this.tableid = 0;
  this.tstatus = 0;
  this.Seaters = [];
  //接收的数据
  this.onMessage = function (msg) {

    this.seq = msg.seq;
    this.uid = msg.uid;
    this.code = msg.code;
    this.desc = msg.desc;
    // if(this.code < SocketRetCode.RET_SUCCESS)
    //     return;
    this.tableid = msg.tableid;
    this.tstatus = msg.tstatus;
    this.Seaters = msg.Seaters;
  };
}

module.exports = Bullfight_NotifyNotCallBankerPacket;

cc._RFpop();
},{"Cmd_Bullfight":"Cmd_Bullfight","MessageResp":"MessageResp"}],"Bullfight_NotifyOpenCardPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '6e406wh9K5DooAJmgO5K/zp', 'Bullfight_NotifyOpenCardPacket');
// Script\GameScene\Bullfight\Cmd\Cmd_Resp\Bullfight_NotifyOpenCardPacket.js

'use strict';

/**
 * Created by shrimp on 17/3/7.
 */

/*
* // 通知玩家开始开牌
 type SBF_NOTIFY_OPEN_CARD_T struct {
 JsonHead
 RespHead
 TableId  int32    `json:"tableid"`
 TStatus  int      `json:"tstatus"`
 UStatus  int      `json:"ustatus"`
 OpenTime int      `json:"opentime"`
 Cards    []uint16 `json:"cards"`    //自己的5张牌
 }
* */

var MessageResp = require('MessageResp');
var Cmd_Bullfight = require('Cmd_Bullfight');
function Bullfight_NotifyOpenCardPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = Cmd_Bullfight.SBF_NOTIFY_OPEN_CARD_CMD_ID;
    //{"cmd":6619148,"seq":0,"uid":10010,"code":0,"desc":"","tableid":1,
    // "tstatus":4,"ustatus":5,"seatid":0,"opentime":20,"cards":[26,9,53,36,2]}

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.tableid = msg.tableid;
        this.tstatus = msg.tstatus;
        this.ustatus = msg.ustatus;
        this.opentime = msg.opentime;
        this.cards = msg.cards;

        //GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = Bullfight_NotifyOpenCardPacket;

cc._RFpop();
},{"Cmd_Bullfight":"Cmd_Bullfight","MessageResp":"MessageResp"}],"Bullfight_NotifySureBankerPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '99624HjF+pLdb8cNBnK46Fx', 'Bullfight_NotifySureBankerPacket');
// Script\GameScene\Bullfight\Cmd\Cmd_Resp\Bullfight_NotifySureBankerPacket.js

'use strict';

/**
 * Created by shrimp on 17/3/5.
 */
/*
 type SBF_NOTIFY_CONFIRM_BANKER_T struct {
 JsonHead
 RespHead
 TableId  int32 `json:"tableid"`   //桌子id
 TStatus  int `json:"tstatus"`   //桌子状态
 BankerSeatId int `json:"bankerseatid"` //庄家座位id
 UStatus      int `json:"ustatus"`      //玩家自己的状态
 MaxBetMul    int `json:"maxbetmul"`    //玩家最大下注倍数
 BetTime      int `json:"bettime"`      //下注时间
 }
* */

var MessageResp = require('MessageResp');
var Cmd_Bullfight = require('Cmd_Bullfight');
function Bullfight_NotifySureBankerPacket() {
    MessageResp.apply(this, []); //集成父类数据
    //{"cmd":6619144,"seq":0,"uid":10010,"code":0,"desc":"","tableid":2,"tstatus":3,
    // "bankerseatid":1,"bankeruid":10011,"ustatus":5,"maxbetmul":25,"bettime":10}

    this.cmd = Cmd_Bullfight.SBF_NOTIFY_CONFIRM_BANKER_CMD_ID;
    this.tableid = 0;
    this.tstatus = 0;
    this.bankeruid = 0;
    this.bankerseatid = -1;
    this.ustatus = 0;
    this.maxbetmul = 0;
    this.bettime = 0;
    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;

        this.tableid = msg.tableid;
        this.tstatus = msg.tstatus;
        this.bankeruid = msg.bankeruid;
        this.bankerseatid = msg.bankerseatid;
        this.ustatus = msg.ustatus;
        this.maxbetmul = msg.maxbetmul;
        this.bettime = msg.bettime;

        //GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = Bullfight_NotifySureBankerPacket;

cc._RFpop();
},{"Cmd_Bullfight":"Cmd_Bullfight","MessageResp":"MessageResp"}],"Bullfight_OpenCardReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c107cSTQWpCZ4GXpTy0rHxs', 'Bullfight_OpenCardReqPacket');
// Script\GameScene\Bullfight\Cmd\Cmd_Req\Bullfight_OpenCardReqPacket.js

'use strict';

/**
 * Created by shrimp on 17/3/2.
 */

var MessageReq = require("MessageReq");
var Cmd_Bullfight = require('Cmd_Bullfight');
var GameSystem = require('GameSystem');

/*
* //看牌
 type SBF_REQ_OPEN_CARD_T struct {
 GameHead
 HasBull int      `json:"hasbull"`
 Cards   []uint16 `json:"cards"`
 }
* */

function Bullfight_OpenCardReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = Cmd_Bullfight.SBF_REQ_OPEN_CARD_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            gamesvcid: GameSystem.getInstance().gamesvcid,
            tableid: GameSystem.getInstance().tableid
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = Bullfight_OpenCardReqPacket;

cc._RFpop();
},{"Cmd_Bullfight":"Cmd_Bullfight","GameSystem":"GameSystem","MessageReq":"MessageReq"}],"Bullfight_OpenCardRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '526a43jKadKgIiIVVTlVA94', 'Bullfight_OpenCardRespPacket');
// Script\GameScene\Bullfight\Cmd\Cmd_Resp\Bullfight_OpenCardRespPacket.js

'use strict';

/**
 * Created by shrimp on 17/3/2.
 */

/*
*
* type SBF_RESP_OPEN_CARD_T struct {
 JsonHead
 RespHead
 OpenUid  int      `json:"openuid"`
 BullType int      `json:"bulltype"`
 Cards    []uint16 `json:"cards"`
 }
* */
var MessageResp = require('MessageResp');
var Cmd_Bullfight = require('Cmd_Bullfight');
function Bullfight_OpenCardRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = Cmd_Bullfight.SBF_RESP_OPEN_CARD_CMD_ID;
    //{"cmd":6619150,"seq":10,"uid":10010,"code":0,"desc":"",
    // "openuid":10010,"bulltype":0,"cards":[12,36,19,50,33]}
    this.openuid = 0;
    this.bulltype = 0;
    this.seatid = -1;
    this.cards = [];
    this.index1 = -1;
    this.index2 = -1;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.openuid = msg.openuid;
        this.bulltype = msg.bulltype;
        this.cards = msg.cards;
        this.seatid = msg.seatid;
        this.tstatus = msg.tstatus;
        this.index1 = msg.index1;
        this.index2 = msg.index2;

        //GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = Bullfight_OpenCardRespPacket;

cc._RFpop();
},{"Cmd_Bullfight":"Cmd_Bullfight","MessageResp":"MessageResp"}],"Bullfight_OwnerView":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'a5a0c1q0NNI8JWZHFoyMRe+', 'Bullfight_OwnerView');
// Script\GameScene\Bullfight\PopView\Bullfight_OwnerView.js

'use strict';

var BasePop = require('BasePop');
var MessageFactory = require('MessageFactory');
var ToastView = require('ToastView');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require('GameSystem');

cc.Class({
    extends: BasePop,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {
        this._super();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    /*********************Network***************************/

    onMessage: function onMessage(event) {
        cc.log("Bullfight_GameScene.onMessage");
        this._super(event);
        var msg = event.data;
        var cmd = msg.cmd;
        switch (cmd) {
            case window.US_RESP_GAME_SWITCH_CMD_ID:
                this.onDismissGame(msg);
                break;
        }
    },

    onDismissGame: function onDismissGame(msg) {
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            if (msg.isstart == 1) {} else {
                ToastView.show("房间解散成功，本局结束后将解散");
            }
        }
    },

    callbackBtn: function callbackBtn(event, CustomEventData) {
        var BtnName = event.target.getName();
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        cc.log("Bullfight_OwnerView.callbackBtn,BtnName = " + BtnName);
        if (BtnName == "BtnClose") {
            this.dismiss();
        } else if (BtnName == "BtnDismiss") {
            var data = {
                isstart: 0
            };
            MessageFactory.createMessageReq(US_REQ_GAME_SWITCH_CMD_ID).send(data);
            this.dismiss();
        }
    }
});

cc._RFpop();
},{"Audio_Common":"Audio_Common","BasePop":"BasePop","GameSystem":"GameSystem","MessageFactory":"MessageFactory","MusicMgr":"MusicMgr","ToastView":"ToastView"}],"Bullfight_PlayerCell":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'dd03e3wx+RPqKzhivLGvZQN', 'Bullfight_PlayerCell');
// Script\GameScene\Bullfight\PopView\Bullfight_PlayerCell.js

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

cc._RFpop();
},{}],"Bullfight_PlayerItem":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'bbb92wxt6VKepRUVDer6qKI', 'Bullfight_PlayerItem');
// Script\GameScene\Bullfight\SceneView\Bullfight_PlayerItem.js

'use strict';

var MessageFactory = require("MessageFactory");
var MusicMgr = require('MusicMgr');
var Audio_Comm = require('Audio_Common');
var GamePlayer = require('GamePlayer');
var GameSystem = require("GameSystem");
var Bullfight_AudioConfig = require('Bullfight_AudioConfig');

cc.Class({
    extends: cc.Component,

    properties: {
        seatFlag: 0, //0:没有玩家坐下，1:已经有玩家坐下
        seatId: 0,
        userHead: cc.Sprite,
        userNick: cc.Label,
        userGold: cc.Label,
        winScoreBg: cc.Sprite,
        winScore: cc.Label,
        bankerFlag: cc.Sprite,
        bankerLight: cc.Sprite,
        TimeBar: cc.ProgressBar,
        win_animation: cc.Sprite,
        UserInfoView: cc.Prefab,
        YouWin: cc.Sprite,
        DefaultHead: cc.SpriteFrame
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.initBaseData();
    },

    initBaseData: function initBaseData() {
        this.BankerFlagPos = this.bankerFlag.node.getPosition();
        this.winScoreBgPos = this.bankerFlag.node.getPosition();
        //this.player = null;
    },

    setUserHead: function setUserHead(Spriteframe) {
        //cc.log('Bullfight_PlayerItem.setUserHead')
        this.userHead.spriteFrame = Spriteframe;
    },

    setUserNick: function setUserNick(nick) {
        //cc.log('Bullfight_PlayerItem.setUserHead, nick = ' + nick);
        this.userNick.string = nick;
    },

    setUserGold: function setUserGold(gold) {
        //cc.log('Bullfight_PlayerItem.setUserGold, gold = ' + gold);
        this.userGold.string = gold;
        this.userGold.node.color = cc.Color.WHITE;
    },

    setUserWaitCarry: function setUserWaitCarry() {
        this.userGold.string = "携带中..";
        this.userGold.node.color = new cc.Color(204, 160, 41, 255);
    },

    setUserWinScore: function setUserWinScore(score) {
        this.winScore.string = score;
        this.winScoreBg.node.active = true;
        this.winScoreBg.getComponent(cc.Animation).play("WinScoreAni");
    },

    clearUserWinScore: function clearUserWinScore() {
        //cc.log("Bullfight_PlayerItem.clearUserWinScore");
        this.winScoreBg.node.active = false;
    },

    getSeatIdByViewId: function getSeatIdByViewId(viewId) {
        var selfViewId = window.BULLFIGHT_MAX_PLAYER - 1;
        var seatId = viewId;

        if (GamePlayer.getInstance().seatid >= 0) {
            seatId = (viewId - selfViewId + GamePlayer.getInstance().seatid + window.BULLFIGHT_MAX_PLAYER) % window.BULLFIGHT_MAX_PLAYER;
        }
        cc.log("********getSeatIdByViewId viewId=", viewId, " seatId=", seatId);
        return seatId;
    },

    callbackBtn: function callbackBtn(event, CustomEventData) {
        var btnName = event.target.getName();
        cc.log("Bullfight_PlayerItem.callbackBtn,btnName = " + btnName);

        MusicMgr.playEffect(Audio_Comm.AUDIO_BTN_CLICK);

        if (btnName = "Bg") {
            if (this.seatFlag == 0) {
                var seatid = this.getSeatIdByViewId(this.seatId);
                cc.log("Bullfight_PlayerItem.callbackBtn,this.seatId = " + seatid);
                var data = {
                    status: 1,
                    seatid: seatid
                };
                MessageFactory.createMessageReq(window.US_REQ_SIT_DOWN_CMD_ID).send(data);
                MusicMgr.playEffect(Audio_Comm.AUDIO_SIT);
            } else {
                //显示玩家信息
                var UserInfoView = cc.instantiate(this.UserInfoView);
                cc.director.getScene().addChild(UserInfoView);
                UserInfoView.setPosition(cc.p(cc.director.getVisibleSize().width / 2, cc.director.getVisibleSize().height / 2));
                UserInfoView.getComponent("Bullfight_UserInfo").setPlayerInfo(this.player);
            }
        }
    },

    setPlayerBanker: function setPlayerBanker() {
        this.bankerFlag.node.active = true;
        this.bankerLight.node.active = true;
    },

    clearPlayerBanker: function clearPlayerBanker() {
        this.bankerFlag.node.active = false;
        this.bankerLight.node.active = false;
    },

    clearPlayerInfo: function clearPlayerInfo() {
        //cc.log("Bullfight_GameScene.clearPlayerInfo, seatId= " + this.seatId);
        this.setUserNick("");
        this.setUserGold(0);
        this.clearUserWinScore();
        this.userHead.node.active = false;
        this.seatFlag = 0;
        this.bankerFlag.node.active = false;
        this.userHead.spriteFrame = this.DefaultHead;
    },

    updatePlayerInfo: function updatePlayerInfo(player) {

        this.player = player;

        this.userHead.node.active = true;

        this.setUserNick(player.name);

        if (player.coin > 0) {
            this.setUserGold(player.coin);
        } else {
            this.setUserWaitCarry();
        }

        UpdateWXHeadIcon(player.headurl, this.userHead);

        this.seatFlag = 1;
    },

    getPointByAngle: function getPointByAngle(startpoint, angle, radius) {

        if (angle <= 90 && angle >= 0) {
            return cc.p(startpoint.x + Math.sin(angle) * radius, startpoint.y - (radius - Math.cos(angle) * radius));
        } else if (angle > 90 && angle <= 180) {
            cc.p(startpoint.x + Math.sin(180 - angle) * radius, startpoint.y - (radius - Math.cos(180 - angle) * radius - radius));
        } else if (angle > 180 && angle <= 270) {
            cc.p(startpoint.x - Math.sin(270 - angle) * radius, startpoint.y - (radius - Math.cos(270 - angle) * radius - radius));
        } else if (angle > 270 && angle < 360) {
            return cc.p(startpoint.x - Math.sin(360 - angle) * radius, startpoint.y - (radius - Math.cos(360 - angle) * radius));
        }
    }
});

cc._RFpop();
},{"Audio_Common":"Audio_Common","Bullfight_AudioConfig":"Bullfight_AudioConfig","GamePlayer":"GamePlayer","GameSystem":"GameSystem","MessageFactory":"MessageFactory","MusicMgr":"MusicMgr"}],"Bullfight_Playerlist":[function(require,module,exports){
"use strict";
cc._RFpush(module, '3e36eFRKRdBILdZUXMidzMX', 'Bullfight_Playerlist');
// Script\GameScene\Bullfight\PopView\Bullfight_Playerlist.js

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

cc._RFpop();
},{"BasePop":"BasePop","Cmd_Bullfight":"Cmd_Bullfight","GamePlayer":"GamePlayer","MessageFactory":"MessageFactory"}],"Bullfight_ReadyReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '238b3wQJyROQr67m4gxG72J', 'Bullfight_ReadyReqPacket');
// Script\GameScene\Bullfight\Cmd\Cmd_Req\Bullfight_ReadyReqPacket.js

'use strict';

/**
 * Created by shrimp on 17/3/5.
 */

/*
* //准备游戏 (SBF_REQ_READY_CMD_ID)
 type SBF_REQ_READY_T struct {
 GameHead
 }
 */

var MessageReq = require("MessageReq");
var Cmd_Bullfight = require('Cmd_Bullfight');
var GameSystem = require('GameSystem');
function Bullfight_ReadyReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = Cmd_Bullfight.SBF_REQ_READY_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            gamesvcid: GameSystem.getInstance().gamesvcid,
            tableid: GameSystem.getInstance().tableid

        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = Bullfight_ReadyReqPacket;

cc._RFpop();
},{"Cmd_Bullfight":"Cmd_Bullfight","GameSystem":"GameSystem","MessageReq":"MessageReq"}],"Bullfight_ReadyRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '88cedZ9oBlC/alSJKwZCP6E', 'Bullfight_ReadyRespPacket');
// Script\GameScene\Bullfight\Cmd\Cmd_Resp\Bullfight_ReadyRespPacket.js

'use strict';

/**
 * Created by shrimp on 17/3/5.
 */

/*
* type SBF_RESP_READY_T struct {
 JsonHead
 RespHead
 SeatId  int    `json:"seatid"`
 Uid     uint32 `json:"uid"`
 UStatus int    `json:"ustatus"`
 TableId int    `json:"tableid"`
 TStatus int    `json:"tstatus"`
 }
* */
var MessageResp = require('MessageResp');
var Cmd_Bullfight = require('Cmd_Bullfight');
function Bullfight_ReadyRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = Cmd_Bullfight.SBF_RESP_READY_CMD_ID;
    this.seatid = -1;
    this.readyuid = 0;
    this.ustatus = 0;
    this.tableid = 0;
    this.tstatus = 0;
    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.seatid = msg.seatid;
        this.readyuid = msg.readyuid;
        this.ustatus = msg.ustatus;
        this.tableid = msg.tableid;
        this.tstatus = msg.tstatus;
        //GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = Bullfight_ReadyRespPacket;

cc._RFpop();
},{"Cmd_Bullfight":"Cmd_Bullfight","MessageResp":"MessageResp"}],"Bullfight_RoomInfo":[function(require,module,exports){
"use strict";
cc._RFpush(module, '097ccsalOFAfa4idcXcTS0e', 'Bullfight_RoomInfo');
// Script\GameScene\Bullfight\PopView\Bullfight_RoomInfo.js

'use strict';

var BasePop = require('BasePop');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require('GameSystem');

cc.Class({
    extends: BasePop,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        RoomInfo: [cc.Label],
        RoomMult: [cc.Label],
        RootNode: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        var self = this;
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            cc.log("stop event");
            self.dismiss();
            MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        }.bind(this));
        this.runIn();
    },

    runIn: function runIn() {
        this.bg.runAction(cc.moveBy(0.4, cc.p(this.bg.getContentSize().width, 0)));
    },

    setRoomInfo: function setRoomInfo(tableRuleInfo) {
        if (tableRuleInfo.gametype == 1) {
            this.RoomInfo[1].string = "闭牌抢庄";
        } else {
            this.RoomInfo[1].string = "三张抢庄";
        }

        this.RoomInfo[2].string = tableRuleInfo.minante;
        if (tableRuleInfo.livetime < 1800) {
            this.RoomInfo[3].string = tableRuleInfo.livetime / 60 + "分钟";
        } else {
            this.RoomInfo[3].string = tableRuleInfo.livetime / 3600 + "小时";
        }

        this.RoomInfo[4].string = tableRuleInfo.seats;

        for (var index = 0; index < this.RoomMult.length; index++) {
            this.RoomMult[index].string = tableRuleInfo.bullmul[index];
        }
    }

});

cc._RFpop();
},{"Audio_Common":"Audio_Common","BasePop":"BasePop","GameSystem":"GameSystem","MusicMgr":"MusicMgr"}],"Bullfight_RuleView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0150cRmGrpKpabvcGdsi+vY', 'Bullfight_RuleView');
// Script\GameScene\Bullfight\PopView\Bullfight_RuleView.js

'use strict';

var BasePop = require('BasePop');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require('GameSystem');

cc.Class({
    extends: BasePop,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    onLoad: function onLoad() {
        var self = this;
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            cc.log("stop event");
            MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
            self.dismiss();
        }.bind(this));
        this.runIn();
    },

    callBackBtn: function callBackBtn() {
        this.dismiss();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    runIn: function runIn() {
        cc.log(this.bg.getContentSize().width);
        this.bg.runAction(cc.moveBy(0.4, cc.p(this.bg.getContentSize().width, 0)));
    }
});

cc._RFpop();
},{"Audio_Common":"Audio_Common","BasePop":"BasePop","GameSystem":"GameSystem","MusicMgr":"MusicMgr"}],"Bullfight_TableDetailReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '4dad3d6295KMqyi02ugo2UJ', 'Bullfight_TableDetailReqPacket');
// Script\GameScene\Bullfight\Cmd\Cmd_Req\Bullfight_TableDetailReqPacket.js

'use strict';

/**
 * Created by shrimp on 17/3/2.
 */

var MessageReq = require("MessageReq");
var Cmd_Bullfight = require('Cmd_Bullfight');
var GameSystem = require('GameSystem');

function Bullfight_TableDetailReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = Cmd_Bullfight.US_REQ_TABLE_DETAIL_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            gamesvcid: GameSystem.getInstance().gamesvcid,
            tableid: GameSystem.getInstance().tableid
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = Bullfight_TableDetailReqPacket;

cc._RFpop();
},{"Cmd_Bullfight":"Cmd_Bullfight","GameSystem":"GameSystem","MessageReq":"MessageReq"}],"Bullfight_TableDetailRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e085cRy+i1KKZBRTGgGrk/H', 'Bullfight_TableDetailRespPacket');
// Script\GameScene\Bullfight\Cmd\Cmd_Resp\Bullfight_TableDetailRespPacket.js

'use strict';

/**
 * Created by shrimp on 17/3/2.
 */

/*
*
* /桌子详情
 type US_RESP_TABLE_DETAIL_T struct {
 JsonHead
 RespHead
 Param string `json:"param"` //base64
 }
 type DETAIL_SEATER_T struct {
 Uid            uint32   `json:"uid"`
 Name           string   `json:"name"`
 HeadUrl        string   `json:"headurl"`
 Sex            int      `json:"sex"`
 Gold           int      `json:"gold"`
 Diamond        int      `json:"diamond"`
 Coin           int      `json:"coin"`      //现在身上带入的金币
 TotalCarryCoin int      `json:"total"`     //总带入金币
 WinCoin        int      `json:"win"`       //输赢多少金币
 SeatId         int8     `json:"seatid"`    //座位id
 Status         int      `json:"status"`    //桌上玩家状态
 CallType       int8     `json:"calltype"`  //抢庄类型
 MaxBetMul      int      `json:"maxbetmul"` //最大下注倍数
 BetMul         int      `json:"betmul"`    //下注倍数
 BhaveCard      bool     `json:"bhavecard"` //是否有牌
 BopenCard      bool     `json:"bopencard"` //是否开牌
 Cards          []uint16 `json:"cards"`     //牌数据
 BullType       int      `json::bulltype:`  //牛牛类型
 FinalCoin      int      `json:"finalcoin"` //这一局输赢结果
 }

 //进入桌子返回
 type SBF_DETAIL_TABLE_T struct {
 TableId    int32             `json:"tableid"`    //桌子ID
 TableName  string            `json:"name"`       //桌子名称
 GameType   int32             `json:"gametype"`   //桌子类型(闭牌抢庄,四张抢庄)
 MinAnte    int               `json:"minante"`    //最小下注
 MinCarry   int               `json:"mincarry"`   //最小带入
 LiveTime   int64             `json:"livetime"`   //桌子总时间
 RemainTime int64             `json:"remaintime"` //剩余时间
 Bstart     int8              `json:"bstart"`     //桌子是否开始
 Seats      int               `json:"seats"`      //座位数
 BullMul    []int32           `json:"bullmul"`    //倍率
 Bowner     int8              `json:"bowner"`     //是否是桌主
 Bsitdown   int8              `json:"bsitdown"`   //是否入座
 Tstatus    int               `json:"tstatus"`    //桌子状态
 Timeout    int               `json:"timeout"`    //桌子处于某个状态下的剩余时间
 RoundNum   int               `json:"roundnum"`   //当前第几手牌
 BankerUid  uint32            `json:"bankeruid"`  //庄家UID
 Seaters    []DETAIL_SEATER_T `json:"seaters"`    //桌位上的玩家信息
 }
* */

var MessageResp = require('MessageResp');
var Cmd_Bullfight = require('Cmd_Bullfight');
function Bullfight_TableDetailRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = Cmd_Bullfight.US_RESP_TABLE_DETAIL_CMD_ID;
    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        cc.log("Bullfight_TableDetailRespPacket,param = " + BASE64.decoder(msg.param));
        var json = JSON.parse(BASE64.decoder(msg.param));
        this.privateid = json.privateid;
        this.tableid = json.tableid;
        this.name = json.name;
        this.gametype = json.gametype;
        this.carrycoin = json.carrycoin;
        this.minante = json.minante;
        this.mincarry = json.mincarry;
        this.maxcarry = json.maxcarry;
        this.livetime = json.livetime;
        this.remaintime = json.remaintime;
        this.bstart = json.bstart;
        this.seats = json.seats;
        this.bullmul = json.bullmul;
        this.bowner = json.bowner;
        this.bsitdown = json.bsitdown;
        this.tstatus = json.tstatus;
        this.timeout = json.timeout;
        this.roundnum = json.roundnum;
        this.bankeruid = json.bankeruid;
        this.seaters = json.seaters;
        this.totalcarry = json.totalcarry;
    };
}

module.exports = Bullfight_TableDetailRespPacket;

cc._RFpop();
},{"Cmd_Bullfight":"Cmd_Bullfight","MessageResp":"MessageResp"}],"Bullfight_TotalResultCell":[function(require,module,exports){
"use strict";
cc._RFpush(module, '6e7d1457/tJRLcthclLXM/5', 'Bullfight_TotalResultCell');
// Script\GameScene\Bullfight\PopView\Bullfight_TotalResultCell.js

"use strict";

/**
 * Created by lixiaofei on 17/6/4.
 */
cc.Class({
    extends: cc.Component,

    properties: {
        InfoLabel: [cc.Label]
    },

    // use this for initialization
    onLoad: function onLoad() {},

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

        for (var i = 0; i <= 3; i++) {
            this.InfoLabel[i].fontSize = size;
        }
    }
});

cc._RFpop();
},{}],"Bullfight_TotalResult":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'b5eaciE36xFN5RbJEMVUiIc', 'Bullfight_TotalResult');
// Script\GameScene\Bullfight\PopView\Bullfight_TotalResult.js

'use strict';

var Bullfight_PlayerCell = require('Bullfight_PlayerCell');
var BasePop = require('BasePop');
var GamePlayer = require('GamePlayer');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var UtilTool = require('UtilTool');
var GameSystem = require('GameSystem');

cc.Class({
    extends: BasePop,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        LabelTitle: cc.Label,
        LabelCoin: cc.Label,
        LabelRoundnum: cc.Label,
        LabelwinMax: cc.Label,
        LabelallCarry: cc.Label,
        scrollView: cc.ScrollView,
        PlayerCell: cc.Prefab,
        Head: cc.Sprite,
        BtnShare: cc.Node

    },

    // use this for initialization
    onLoad: function onLoad() {
        this.initBaseData();
        //this.setGameData();
        if (GameSystem.getInstance().VerStatus == GameSystem.getInstance().VerStatusType.VERSION_TYPE_AUDIT) {
            this.BtnShare.active = false;
        }
    },

    initBaseData: function initBaseData() {
        this.coin = 0;
        this.roundnum = 0;
        this.winMax = 0;
        this.allCarry = 0;
        this.roomId = 0;
        this.ShareImagePath = "";
        this.Canvas = null;
    },

    callBackBtnClose: function callBackBtnClose() {
        this.dismiss();
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        cc.director.loadScene('HallScene');
    },

    callBackBtnShare: function callBackBtnShare() {
        var message = {
            popView: "Bullfight_TotalResult",
            btn: "BtnShare"
        };
        GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.SCENE_MSG, data: message });

        // var self = this;
        // this.ShareImagePath = UtilTool.captureScreen("TotalResult.png",this.Canvas,function(filePath){
        //     var shareView = cc.instantiate(self.ShareView);
        //     self.node.addChild(shareView);
        //     shareView.setPosition(cc.p(0,0));
        //     var string = "游戏结算分享";
        //     shareView.getComponent("ShareView").setShareTyep(ShareType.E_SHARETYPE_IMAGE,filePath,"www.baidu.com");
        // });
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    /**
     *  Uid        int32 `json:"uid"`
     Coin       int64 `json:"coin"`
     PlayNum    int   `json:"playnum"`
     MaxWin     int   `json:"maxwin"`
     TotalCarry int64 `json:"totalcarry"`
     * */
    setGameData: function setGameData(msg, canvas) {
        this.Canvas = canvas;

        this.LabelTitle.string = "总结算(" + msg.privateid + ")";
        var scores = msg.Scores;
        var cellheight = 0;
        for (var index = 0; index < scores.length; index++) {
            var item = cc.instantiate(this.PlayerCell);
            item.setPosition(cc.p(0, -index * item.getContentSize().height - item.getContentSize().height / 2));
            this.scrollView.content.addChild(item);

            if (scores[index].uid == GamePlayer.getInstance().uid) {
                this.coin = scores[index].wincoin;
                this.roundnum = scores[index].playnum;
                this.winMax = scores[index].maxwin;
                this.allCarry = scores[index].totalcarry;
            }

            cellheight = item.getContentSize().height;
            item.getComponent("Bullfight_TotalResultCell").updatePlayerScoreCell(scores[index].name, scores[index].totalcarry, scores[index].wincoin, 50);
        }

        if (scores.length * cellheight > this.scrollView.content.height) {
            this.scrollView.content.height = scores.length * cellheight;
        }
        this.updateMySelfInfo();

        //this.node.runAction(cc.sequence(cc.delayTime(1.0),cc.callFunc(this.ShootScreen,this)));
    },

    updateMySelfInfo: function updateMySelfInfo() {
        var winCoin = Number(this.coin);
        if (winCoin > 0) {
            this.LabelCoin.string = "+" + winCoin;
            this.LabelCoin.node.color = cc.Color.RED;
        } else if (winCoin == 0) {
            this.LabelCoin.string = winCoin;
            this.LabelCoin.node.color = new cc.Color(204, 160, 41, 255);
        } else {
            this.LabelCoin.string = winCoin;
            this.LabelCoin.node.color = cc.Color.GREEN;
        }
        this.LabelRoundnum.string = this.roundnum;
        this.LabelwinMax.string = this.winMax;
        this.LabelallCarry.string = this.allCarry;
        UpdateWXHeadIcon(GamePlayer.getInstance().headurl, this.Head);
    }
});

cc._RFpop();
},{"Audio_Common":"Audio_Common","BasePop":"BasePop","Bullfight_PlayerCell":"Bullfight_PlayerCell","GamePlayer":"GamePlayer","GameSystem":"GameSystem","MusicMgr":"MusicMgr","UtilTool":"UtilTool"}],"Bullfight_Tourist":[function(require,module,exports){
"use strict";
cc._RFpush(module, '05f54XRBfFHJY01Unx8J+r3', 'Bullfight_Tourist');
// Script\GameScene\Bullfight\PopView\Bullfight_Tourist.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        Head: cc.Sprite,
        Name: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {},

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    updateInfo: function updateInfo(url, name) {
        if (url != "") UpdateWXHeadIcon(url, this.Head);
        this.Name.string = name;
        this.Name.fontsize = 40;
    }
});

cc._RFpop();
},{}],"Bullfight_UserInfo":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'a9271QR8HRIJ6ewxtQtPy/r', 'Bullfight_UserInfo');
// Script\GameScene\Bullfight\PopView\Bullfight_UserInfo.js

'use strict';

var BasePop = require('BasePop');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var MessageFactory = require('MessageFactory');
var GamePlayer = require('GamePlayer');
var GameSystem = require('GameSystem');
var ToastView = require('ToastView');

cc.Class({
    extends: BasePop,

    properties: {
        NickName: cc.Label,
        PlayerUid: cc.Label,
        Gold: cc.Label,
        Diamond: cc.Label,
        TableCount: cc.Label,
        RoundCount: cc.Label,
        GiftCost: [cc.Label],
        SexSprite: cc.Sprite,
        Head: cc.Sprite,
        SexFrame: [cc.SpriteFrame]
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._super();
        this.player = null;
    },

    setPlayerInfo: function setPlayerInfo(player) {
        this.player = player;
        this.NickName.string = player.name;
        this.PlayerUid.string = player.uid;
        this.Gold.string = player.gold;
        this.Diamond.string = player.diamond;
        this.RoundCount.string = player.TotalRound; //总手数
        this.TableCount.string = player.TotalTable; //总局数
        UpdateWXHeadIcon(player.headurl, this.Head);

        cc.log("onSitDown player.TotalRound=", player.TotalRound, " player.TotalTable=", player.TotalTable);

        for (var i = 0; i < this.GiftCost.length; i++) {
            this.GiftCost[i].string = GameSystem.getInstance().giftCost[i].Gold;
        }
        var sex = player.sex - 1 > 0 ? player.sex - 1 : 0;
        this.SexSprite.spriteFrame = this.SexFrame[sex];
    },

    callBackBtn: function callBackBtn(event, CustomEventData) {
        var BtnName = event.target.getName();
        if (BtnName == "BtnClose") {
            this.dismiss();
        } else {
            if (GamePlayer.getInstance().seatid == -1) {
                ToastView.show("您没有坐下不能发送礼物");
                return;
            }

            MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
            var data = {
                touid: this.player.uid,
                kind: ChatType.E_CHAT_GIFT_KIND,
                type: Number(CustomEventData),
                text: ""
            };
            MessageFactory.createMessageReq(US_REQ_GAME_CHAT_CMD_ID).send(data);
            this.dismiss();
        }
    }
});

cc._RFpop();
},{"Audio_Common":"Audio_Common","BasePop":"BasePop","GamePlayer":"GamePlayer","GameSystem":"GameSystem","MessageFactory":"MessageFactory","MusicMgr":"MusicMgr","ToastView":"ToastView"}],"ButtonScaler":[function(require,module,exports){
"use strict";
cc._RFpush(module, '00d670MeVBBGazy/lKbleRQ', 'ButtonScaler');
// Script\Comm\ButtonScaler.js

'use strict';

//var AudioManager = require('AudioManager');
var GameSystem = require('GameSystem');

cc.Class({
    extends: cc.Component,

    properties: {
        pressedScale: 0.9,
        transDuration: 0.05,

        playColseEffect: false
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.m_tmLastClicked = 0;
        this.m_DelayInteractable = false; //延时不可点击
        this.countTime = 0;

        this.pressedScale = 0.9;
        this.transDuration = 0.03;
        var self = this;

        self.initScale = this.node.scale;
        self.button = self.getComponent(cc.Button);
        self.scaleDownAction = cc.scaleTo(self.transDuration, self.pressedScale);
        self.scaleUpAction = cc.scaleTo(self.transDuration, self.initScale);
        function onTouchDown(event) {
            if (!self.button.interactable || self.m_DelayInteractable) {
                return;
            }
            this.stopAllActions();
            this.runAction(self.scaleDownAction);

            if (self.playColseEffect) {
                //AudioManager.playEffect("resources/common/music/click_close.mp3") ;
            } else {
                    //AudioManager.playEffect("resources/common/music/click.mp3") ;
                }

            if (self.isDelayHandleEvent()) {
                cc.log("----------------isDelayHandleEvent-------");
                self.button.interactable = false;
                self.m_DelayInteractable = true;
            }
        }
        function onTouchUp(event) {
            if (!self.button.interactable) {
                return;
            }
            this.stopAllActions();
            this.runAction(self.scaleUpAction);
        }
        this.node.on('touchstart', onTouchDown, this.node);
        this.node.on('touchend', onTouchUp, this.node);
        this.node.on('touchcancel', onTouchUp, this.node);
    },

    update: function update(dt) {
        if (this.m_DelayInteractable) {
            this.countTime += dt;
            // cc.log("-----------m_DelayInteractable------------" + this.countTime);
            if (this.countTime > 0.5) {
                this.countTime = 0;
                this.button.interactable = true;
                this.m_DelayInteractable = false;
            }
        }
    },

    //延时处理
    isDelayHandleEvent: function isDelayHandleEvent(iDelaySeconds) {
        //1秒钟只能点击一次
        if (iDelaySeconds == undefined) {
            iDelaySeconds = 600;
        }
        var tmNow = GameSystem.getInstance().getCurrentSystemTime();
        if (tmNow - this.m_tmLastClicked <= iDelaySeconds) {
            return true;
        }
        this.m_tmLastClicked = tmNow;
        return false;
    }
});

cc._RFpop();
},{"GameSystem":"GameSystem"}],"CarryCoinReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd1572mlCjtCj6Gq8w3e0cqT', 'CarryCoinReqPacket');
// Script\Network\Cmd\Cmd_Req\CarryCoinReqPacket.js

"use strict";

/**
 * Created by shrimp on 17/3/3.
 */
var MessageReq = require("MessageReq");
var GameSystem = require('GameSystem');

function CarryCoinReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_CARRY_COIN_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("CarryCoinReqPacket.send");
        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            gamesvcid: GameSystem.getInstance().gamesvcid,
            tableid: GameSystem.getInstance().tableid,
            coin: msg.coin
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = CarryCoinReqPacket;

cc._RFpop();
},{"GameSystem":"GameSystem","MessageReq":"MessageReq"}],"CarryCoinRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'b0e342Ob85Ei6pRrJIJ/G1Q', 'CarryCoinRespPacket');
// Script\Network\Cmd\Cmd_Resp\CarryCoinRespPacket.js

"use strict";

/**
 * Created by shrimp on 17/3/3.
 */
var MessageResp = require("MessageResp");

function CarryCoinRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_CARRY_COIN_CMD_ID;
    this.carryuid = 0;
    this.coin = 0;
    this.carrycoin = 0;
    this.gold = 0;
    this.diamond = 0;
    this.ustatus = 0;
    this.tstatus = 0;

    //接收的数据
    this.onMessage = function (msg) {
        cc.log("CarryCoinRespPacket.onMesssage");
        //{"cmd":6553608,"seq":0,"uid":10006,"code":0,"desc":"执行成功","carryuid":10006,"carrycoin":100}
        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        this.carryuid = msg.carryuid;
        this.carrycoin = msg.carrycoin;
        this.ustatus = msg.ustatus;
        this.tstatus = msg.tstatus;
        this.coin = msg.coin;
        this.gold = msg.gold;
        this.diamond = msg.diamond;
    };
}

module.exports = CarryCoinRespPacket;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"ChatReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'f045ap6/epEyITg5+Z3DAGy', 'ChatReqPacket');
// Script\Network\Cmd\Cmd_Req\ChatReqPacket.js

"use strict";

/**
 * Created by shrimp on 17/3/1.
 */

var MessageReq = require("MessageReq");
var GameSystem = require("GameSystem");
/*
* const (
 E_CHAT_TEXT_MSG = 1 //是文本聊天
 E_CHAT_GIFT_MSG   = 2 //是表情
 )

 const (
 E_ROSE_GIFT     = 1 //玫瑰
 E_LOVE_GIFT     = 2 //爱心
 E_FOAM_GIFT     = 3 //泡沫
 E_BIG_ROSE_GIFT = 4 //大朵玫瑰
 E_KETCHUP_GIFT  = 5 //番茄酱
 )

 ToUid uint32 `json:"touid"`
 Kind  int    `json:"kind"`
 Type  int    `json:"type"` //具体某个礼物or某个表情(具体表情索引客户端自定义)
 Text  string `json:"text"` //文字or语音内容
* **/

window.ChatType = cc.Enum({
    E_CHAT_WORD_KIND: 1, //文字
    E_CHAT_GIFT_KIND: 2, //礼物
    E_CHAT_FACE_KIND: 3, //表情
    E_CHAT_VOICE_KIND: 4 });

window.GiftType = cc.Enum({
    E_ROSE_GIFT: 1, //玫瑰
    E_LOVE_GIFT: 2, //爱心
    E_FOAM_GIFT: 3, //泡沫
    E_BIG_ROSE_GIFT: 4, //大朵玫瑰
    E_KETCHUP_GIFT: 5 });

function ChatReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_GAME_CHAT_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("ChatReqPacket.send");
        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            gamesvcid: GameSystem.getInstance().gamesvcid,
            tableid: GameSystem.getInstance().tableid,
            touid: msg.touid,
            kind: msg.kind,
            type: msg.type,
            text: msg.text
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = ChatReqPacket;

cc._RFpop();
},{"GameSystem":"GameSystem","MessageReq":"MessageReq"}],"ChatRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '470a0D1DjFD4o81Pp2qjEpO', 'ChatRespPacket');
// Script\Network\Cmd\Cmd_Resp\ChatRespPacket.js

"use strict";

/**
 * Created by shrimp on 17/3/1.
 */
var MessageResp = require("MessageResp");
/*
* type US_RESP_GAME_CHAT_T struct {
 JsonHead
 RespHead
 romUid    uint32 `json:"fromuid"`
 FromSeatId int    `json:"fromseatid"` //如果不是在桌位上
 ToUid      uint32 `json:"touid"`
 ToSeatId   int    `json:"toseatid"`
 Kind       int    `json:"kind"`
 Type       int    `json:"type"` //具体某个礼物or某个表情
 Text       string `json:"text"` //文字or语音内容
 }
* */
function ChatRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_GAME_CHAT_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.fromuid = msg.fromuid;
        this.fromseatid = msg.fromseatid;
        this.touid = msg.touid;
        this.toseatid = msg.toseatid;
        this.kind = msg.kind;
        this.type = msg.type;
        this.text = msg.text;
        //GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = ChatRespPacket;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"ChineseCity":[function(require,module,exports){
"use strict";
cc._RFpush(module, '7170amKuPBEv5sEPX7mXbBt', 'ChineseCity');
// Script\ComScene\PopView\ChineseCity.js

'use strict';

/**
 * Created by shrimp on 17/4/1.
 */
var pc = new Object();
pc['北京市'] = new Array('朝阳区', '海淀区', '通州区', '房山区', '丰台区', '昌平区', '大兴区', '顺义区', '西城区', '延庆县', '石景山区', '宣武区', '怀柔区', '崇文区', '密云县', '东城区', '平谷区', '门头沟区');
pc['广东省'] = new Array('东莞市', '广州市', '中山市', '深圳市', '惠州市', '江门市', '珠海市', '汕头市', '佛山市', '湛江市', '河源市', '肇庆市', '清远市', '潮州市', '韶关市', '揭阳市', '阳江市', '梅州市', '云浮市', '茂名市', '汕尾市');
pc['山东省'] = new Array('济南市', '青岛市', '临沂市', '济宁市', '菏泽市', '烟台市', '淄博市', '泰安市', '潍坊市', '日照市', '威海市', '滨州市', '东营市', '聊城市', '德州市', '莱芜市', '枣庄市');
pc['江苏省'] = new Array('苏州市', '徐州市', '盐城市', '无锡市', '南京市', '南通市', '连云港市', '常州市', '镇江市', '扬州市', '淮安市', '泰州市', '宿迁市');
pc['河南省'] = new Array('郑州市', '南阳市', '新乡市', '安阳市', '洛阳市', '信阳市', '平顶山市', '周口市', '商丘市', '开封市', '焦作市', '驻马店市', '濮阳市', '三门峡市', '漯河市', '许昌市', '鹤壁市', '济源市');
pc['上海市'] = new Array('松江区', '宝山区', '金山区', '嘉定区', '南汇区', '青浦区', '浦东新区', '奉贤区', '徐汇区', '静安区', '闵行区', '黄浦区', '杨浦区', '虹口区', '普陀区', '闸北区', '长宁区', '崇明县', '卢湾区');
pc['河北省'] = new Array('石家庄市', '唐山市', '保定市', '邯郸市', '邢台市', '河北区', '沧州市', '秦皇岛市', '张家口市', '衡水市', '廊坊市', '承德市');
pc['浙江省'] = new Array('温州市', '宁波市', '杭州市', '台州市', '嘉兴市', '金华市', '湖州市', '绍兴市', '舟山市', '丽水市', '衢州市');
pc['香港特别行政区'] = new Array('香港');
pc['陕西省'] = new Array('西安市', '咸阳市', '宝鸡市', '汉中市', '渭南市', '安康市', '榆林市', '商洛市', '延安市', '铜川市');
pc['湖南省'] = new Array('长沙市', '邵阳市', '常德市', '衡阳市', '株洲市', '湘潭市', '永州市', '岳阳市', '怀化市', '郴州市', '娄底市', '益阳市', '张家界市', '湘西州');
pc['重庆市'] = new Array('江北区', '渝北区', '沙坪坝区', '九龙坡区', '万州区', '永川市', '南岸区', '酉阳县', '北碚区', '涪陵区', '秀山县', '巴南区', '渝中区', '石柱县', '忠县', '合川市', '大渡口区', '开县', '长寿区', '荣昌县', '云阳县', '梁平县', '潼南县', '江津市', '彭水县', '綦江县', '璧山县', '黔江区', '大足县', '巫山县', '巫溪县', '垫江县', '丰都县', '武隆县', '万盛区', '铜梁县', '南川市', '奉节县', '双桥区', '城口县');
pc['福建省'] = new Array('漳州市', '厦门市', '泉州市', '福州市', '莆田市', '宁德市', '三明市', '南平市', '龙岩市');
pc['天津市'] = new Array('和平区', '北辰区', '河北区', '河西区', '西青区', '津南区', '东丽区', '武清区', '宝坻区', '红桥区', '大港区', '汉沽区', '静海县', '塘沽区', '宁河县', '蓟县', '南开区', '河东区');
pc['云南省'] = new Array('昆明市', '红河州', '大理州', '文山州', '德宏州', '曲靖市', '昭通市', '楚雄州', '保山市', '玉溪市', '丽江地区', '临沧地区', '思茅地区', '西双版纳州', '怒江州', '迪庆州');
pc['四川省'] = new Array('成都市', '绵阳市', '广元市', '达州市', '南充市', '德阳市', '广安市', '阿坝州', '巴中市', '遂宁市', '内江市', '凉山州', '攀枝花市', '乐山市', '自贡市', '泸州市', '雅安市', '宜宾市', '资阳市', '眉山市', '甘孜州');
pc['广西壮族自治区'] = new Array('贵港市', '玉林市', '北海市', '南宁市', '柳州市', '桂林市', '梧州市', '钦州市', '来宾市', '河池市', '百色市', '贺州市', '崇左市', '防城港市');
pc['安徽省'] = new Array('芜湖市', '合肥市', '六安市', '宿州市', '阜阳市', '安庆市', '马鞍山市', '蚌埠市', '淮北市', '淮南市', '宣城市', '黄山市', '铜陵市', '亳州市', '池州市', '巢湖市', '滁州市');
pc['海南省'] = new Array('三亚市', '海口市', '琼海市', '文昌市', '东方市', '昌江县', '陵水县', '乐东县', '保亭县', '五指山市', '澄迈县', '万宁市', '儋州市', '临高县', '白沙县', '定安县', '琼中县', '屯昌县');
pc['江西省'] = new Array('南昌市', '赣州市', '上饶市', '吉安市', '九江市', '新余市', '抚州市', '宜春市', '景德镇市', '萍乡市', '鹰潭市');
pc['湖北省'] = new Array('武汉市', '宜昌市', '襄樊市', '荆州市', '恩施州', '黄冈市', '孝感市', '十堰市', '咸宁市', '黄石市', '仙桃市', '天门市', '随州市', '荆门市', '潜江市', '鄂州市', '神农架林区');
pc['山西省'] = new Array('太原市', '大同市', '运城市', '长治市', '晋城市', '忻州市', '临汾市', '吕梁市', '晋中市', '阳泉市', '朔州市');
pc['辽宁省'] = new Array('大连市', '沈阳市', '丹东市', '辽阳市', '葫芦岛市', '锦州市', '朝阳市', '营口市', '鞍山市', '抚顺市', '阜新市', '盘锦市', '本溪市', '铁岭市');
pc['台湾省'] = new Array('台北市', '高雄市', '台中市', '新竹市', '基隆市', '台南市', '嘉义市');
pc['黑龙江'] = new Array('齐齐哈尔市', '哈尔滨市', '大庆市', '佳木斯市', '双鸭山市', '牡丹江市', '鸡西市', '黑河市', '绥化市', '鹤岗市', '伊春市', '大兴安岭地区', '七台河市');
pc['内蒙古自治区'] = new Array('赤峰市', '包头市', '通辽市', '呼和浩特市', '鄂尔多斯市', '乌海市', '呼伦贝尔市', '兴安盟', '巴彦淖尔盟', '乌兰察布盟', '锡林郭勒盟', '阿拉善盟');
pc['澳门特别行政区'] = new Array('澳门');
pc['贵州省'] = new Array('贵阳市', '黔东南州', '黔南州', '遵义市', '黔西南州', '毕节地区', '铜仁地区', '安顺市', '六盘水市');
pc['甘肃省'] = new Array('兰州市', '天水市', '庆阳市', '武威市', '酒泉市', '张掖市', '陇南地区', '白银市', '定西地区', '平凉市', '嘉峪关市', '临夏回族自治州', '金昌市', '甘南州');
pc['青海省'] = new Array('西宁市', '海西州', '海东地区', '海北州', '果洛州', '玉树州', '黄南藏族自治州');
pc['新疆维吾尔自治区'] = new Array('乌鲁木齐市', '伊犁州', '昌吉州', '石河子市', '哈密地区', '阿克苏地区', '巴音郭楞州', '喀什地区', '塔城地区', '克拉玛依市', '和田地区', '阿勒泰州', '吐鲁番地区', '阿拉尔市', '博尔塔拉州', '五家渠市', '克孜勒苏州', '图木舒克市');
pc['西藏区'] = new Array('拉萨市', '山南地区', '林芝地区', '日喀则地区', '阿里地区', '昌都地区', '那曲地区');
pc['吉林省'] = new Array('吉林市', '长春市', '白山市', '延边州', '白城市', '松原市', '辽源市', '通化市', '四平市');
pc['宁夏回族自治区'] = new Array('银川市', '吴忠市', '中卫市', '石嘴山市', '固原市');

cc._RFpop();
},{}],"ClubAddView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '85ef8GbgKJEpJ+DgpWRslnH', 'ClubAddView');
// Script\ComScene\PopView\ClubAddView.js

'use strict';

var BasePop = require('BasePop');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GamePlayer = require('GamePlayer');
var ToastView = require('ToastView');
var GameSystem = require("GameSystem");

cc.Class({
    extends: BasePop,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {
        this._super();
        var self = this;
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            cc.log("ClubAddView.onLoad : stop event");
            self.dismiss();
        }.bind(this));
    },

    callBackBtn: function callBackBtn(event, CustomEventData) {
        var BtnName = event.target.getName();
        cc.log("ClubAddView.callBackBtn,BtnName = " + BtnName);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if (BtnName == "NewClub") {
            if (GamePlayer.getInstance().SelfClubId > 0) {
                ToastView.show("您已经建立了一个俱乐部,目前不支持多个");
                this.dismiss();
                return;
            }

            var message = {
                popView: "ClubAddView",
                btn: "NewClub"
            };
            GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.SCENE_MSG, data: message });
        } else if (BtnName == "AddClub") {
            var message = {
                popView: "ClubAddView",
                btn: "AddClub"
            };
            GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.SCENE_MSG, data: message });
        }
        this.dismiss();
    }

});

cc._RFpop();
},{"Audio_Common":"Audio_Common","BasePop":"BasePop","GamePlayer":"GamePlayer","GameSystem":"GameSystem","MusicMgr":"MusicMgr","ToastView":"ToastView"}],"ClubAreaCell":[function(require,module,exports){
"use strict";
cc._RFpush(module, '2615aj9aCBAJLbUiktdYxqZ', 'ClubAreaCell');
// Script\ComScene\PopView\ClubAreaCell.js

'use strict';

var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        AreaName: cc.Label,
        BtnFlag: cc.Sprite
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.name = "";
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    callBackBtn: function callBackBtn(event, CustomEventData) {
        var BtnName = event.target.getName();
        cc.log("ClubAreaCell.callBackBtn,BtnName = " + BtnName);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if (BtnName == "BtnClose") {
            this.dismiss();
        } else if (BtnName == "ClubAreaCell") {}
    },

    setAreaCellInfo: function setAreaCellInfo(name, iCount) {
        this.name = name;
        this.AreaName.string = name;
        if (iCount <= 0) {
            this.BtnFlag.node.active = false;
        }
    }
});

cc._RFpop();
},{"Audio_Common":"Audio_Common","MusicMgr":"MusicMgr"}],"ClubAreaView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '3b1e63VP9pLoLG+Jp2o+s/R', 'ClubAreaView');
// Script\ComScene\PopView\ClubAreaView.js

'use strict';

var BasePop = require('BasePop');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require("GameSystem");

var pc = new Object();
pc['北京市'] = new Array('朝阳区', '海淀区', '通州区', '房山区', '丰台区', '昌平区', '大兴区', '顺义区', '西城区', '延庆县', '石景山区', '宣武区', '怀柔区', '崇文区', '密云县', '东城区', '平谷区', '门头沟区');
pc['广东省'] = new Array('东莞市', '广州市', '中山市', '深圳市', '惠州市', '江门市', '珠海市', '汕头市', '佛山市', '湛江市', '河源市', '肇庆市', '清远市', '潮州市', '韶关市', '揭阳市', '阳江市', '梅州市', '云浮市', '茂名市', '汕尾市');
pc['山东省'] = new Array('济南市', '青岛市', '临沂市', '济宁市', '菏泽市', '烟台市', '淄博市', '泰安市', '潍坊市', '日照市', '威海市', '滨州市', '东营市', '聊城市', '德州市', '莱芜市', '枣庄市');
pc['江苏省'] = new Array('苏州市', '徐州市', '盐城市', '无锡市', '南京市', '南通市', '连云港市', '常州市', '镇江市', '扬州市', '淮安市', '泰州市', '宿迁市');
pc['河南省'] = new Array('郑州市', '南阳市', '新乡市', '安阳市', '洛阳市', '信阳市', '平顶山市', '周口市', '商丘市', '开封市', '焦作市', '驻马店市', '濮阳市', '三门峡市', '漯河市', '许昌市', '鹤壁市', '济源市');
pc['上海市'] = new Array('松江区', '宝山区', '金山区', '嘉定区', '南汇区', '青浦区', '浦东新区', '奉贤区', '徐汇区', '静安区', '闵行区', '黄浦区', '杨浦区', '虹口区', '普陀区', '闸北区', '长宁区', '崇明县', '卢湾区');
pc['河北省'] = new Array('石家庄市', '唐山市', '保定市', '邯郸市', '邢台市', '河北区', '沧州市', '秦皇岛市', '张家口市', '衡水市', '廊坊市', '承德市');
pc['浙江省'] = new Array('温州市', '宁波市', '杭州市', '台州市', '嘉兴市', '金华市', '湖州市', '绍兴市', '舟山市', '丽水市', '衢州市');
pc['香港'] = new Array('香港');
pc['陕西省'] = new Array('西安市', '咸阳市', '宝鸡市', '汉中市', '渭南市', '安康市', '榆林市', '商洛市', '延安市', '铜川市');
pc['湖南省'] = new Array('长沙市', '邵阳市', '常德市', '衡阳市', '株洲市', '湘潭市', '永州市', '岳阳市', '怀化市', '郴州市', '娄底市', '益阳市', '张家界市', '湘西州');
pc['重庆市'] = new Array('江北区', '渝北区', '沙坪坝区', '九龙坡区', '万州区', '永川市', '南岸区', '酉阳县', '北碚区', '涪陵区', '秀山县', '巴南区', '渝中区', '石柱县', '忠县', '合川市', '大渡口区', '开县', '长寿区', '荣昌县', '云阳县', '梁平县', '潼南县', '江津市', '彭水县', '綦江县', '璧山县', '黔江区', '大足县', '巫山县', '巫溪县', '垫江县', '丰都县', '武隆县', '万盛区', '铜梁县', '南川市', '奉节县', '双桥区', '城口县');
pc['福建省'] = new Array('漳州市', '厦门市', '泉州市', '福州市', '莆田市', '宁德市', '三明市', '南平市', '龙岩市');
pc['天津市'] = new Array('和平区', '北辰区', '河北区', '河西区', '西青区', '津南区', '东丽区', '武清区', '宝坻区', '红桥区', '大港区', '汉沽区', '静海县', '塘沽区', '宁河县', '蓟县', '南开区', '河东区');
pc['云南省'] = new Array('昆明市', '红河州', '大理州', '文山州', '德宏州', '曲靖市', '昭通市', '楚雄州', '保山市', '玉溪市', '丽江地区', '临沧地区', '思茅地区', '西双版纳州', '怒江州', '迪庆州');
pc['四川省'] = new Array('成都市', '绵阳市', '广元市', '达州市', '南充市', '德阳市', '广安市', '阿坝州', '巴中市', '遂宁市', '内江市', '凉山州', '攀枝花市', '乐山市', '自贡市', '泸州市', '雅安市', '宜宾市', '资阳市', '眉山市', '甘孜州');
pc['广西'] = new Array('贵港市', '玉林市', '北海市', '南宁市', '柳州市', '桂林市', '梧州市', '钦州市', '来宾市', '河池市', '百色市', '贺州市', '崇左市', '防城港市');
pc['安徽省'] = new Array('芜湖市', '合肥市', '六安市', '宿州市', '阜阳市', '安庆市', '马鞍山市', '蚌埠市', '淮北市', '淮南市', '宣城市', '黄山市', '铜陵市', '亳州市', '池州市', '巢湖市', '滁州市');
pc['海南省'] = new Array('三亚市', '海口市', '琼海市', '文昌市', '东方市', '昌江县', '陵水县', '乐东县', '保亭县', '五指山市', '澄迈县', '万宁市', '儋州市', '临高县', '白沙县', '定安县', '琼中县', '屯昌县');
pc['江西省'] = new Array('南昌市', '赣州市', '上饶市', '吉安市', '九江市', '新余市', '抚州市', '宜春市', '景德镇市', '萍乡市', '鹰潭市');
pc['湖北省'] = new Array('武汉市', '宜昌市', '襄樊市', '荆州市', '恩施州', '黄冈市', '孝感市', '十堰市', '咸宁市', '黄石市', '仙桃市', '天门市', '随州市', '荆门市', '潜江市', '鄂州市', '神农架林区');
pc['山西省'] = new Array('太原市', '大同市', '运城市', '长治市', '晋城市', '忻州市', '临汾市', '吕梁市', '晋中市', '阳泉市', '朔州市');
pc['辽宁省'] = new Array('大连市', '沈阳市', '丹东市', '辽阳市', '葫芦岛市', '锦州市', '朝阳市', '营口市', '鞍山市', '抚顺市', '阜新市', '盘锦市', '本溪市', '铁岭市');
pc['台湾省'] = new Array('台北市', '高雄市', '台中市', '新竹市', '基隆市', '台南市', '嘉义市');
pc['黑龙江'] = new Array('齐齐哈尔市', '哈尔滨市', '大庆市', '佳木斯市', '双鸭山市', '牡丹江市', '鸡西市', '黑河市', '绥化市', '鹤岗市', '伊春市', '大兴安岭地区', '七台河市');
pc['内蒙古'] = new Array('赤峰市', '包头市', '通辽市', '呼和浩特市', '鄂尔多斯市', '乌海市', '呼伦贝尔市', '兴安盟', '巴彦淖尔盟', '乌兰察布盟', '锡林郭勒盟', '阿拉善盟');
pc['澳门'] = new Array('澳门');
pc['贵州省'] = new Array('贵阳市', '黔东南州', '黔南州', '遵义市', '黔西南州', '毕节地区', '铜仁地区', '安顺市', '六盘水市');
pc['甘肃省'] = new Array('兰州市', '天水市', '庆阳市', '武威市', '酒泉市', '张掖市', '陇南地区', '白银市', '定西地区', '平凉市', '嘉峪关市', '临夏回族自治州', '金昌市', '甘南州');
pc['青海省'] = new Array('西宁市', '海西州', '海东地区', '海北州', '果洛州', '玉树州', '黄南藏族自治州');
pc['新疆'] = new Array('乌鲁木齐市', '伊犁州', '昌吉州', '石河子市', '哈密地区', '阿克苏地区', '巴音郭楞州', '喀什地区', '塔城地区', '克拉玛依市', '和田地区', '阿勒泰州', '吐鲁番地区', '阿拉尔市', '博尔塔拉州', '五家渠市', '克孜勒苏州', '图木舒克市');
pc['西藏区'] = new Array('拉萨市', '山南地区', '林芝地区', '日喀则地区', '阿里地区', '昌都地区', '那曲地区');
pc['吉林省'] = new Array('吉林市', '长春市', '白山市', '延边州', '白城市', '松原市', '辽源市', '通化市', '四平市');
pc['宁夏'] = new Array('银川市', '吴忠市', '中卫市', '石嘴山市', '固原市');

cc.Class({
    extends: BasePop,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...

        scrollview: cc.ScrollView,
        AreaCell: cc.Prefab
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._super();
        this.updateProvinceArea();
        this.ProvinceName = "";
        this.CityName = "";
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    callBackBtn: function callBackBtn(event, CustomEventData) {
        var BtnName = event.target.getName();
        cc.log("ClubAreaView.callBackBtn,BtnName = " + BtnName);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if (BtnName == "BtnClose") {
            this.dismiss();
        } else if (BtnName == "") {}
    },

    updateCityArea: function updateCityArea() {
        this.scrollview.content.removeAllChildren(true);
        var index = 0;
        var cellHeight = 0;
        for (var index = 0; index < pc[this.ProvinceName].length; index++) {
            var AreaCell = cc.instantiate(this.AreaCell);
            this.scrollview.content.addChild(AreaCell);
            cellHeight = AreaCell.getContentSize().height;
            AreaCell.setPosition(cc.p(0, 0 - cellHeight * (index + 0.5)));
            AreaCell.getComponent("ClubAreaCell").setAreaCellInfo(pc[this.ProvinceName][index], 0);
            AreaCell.on(cc.Node.EventType.TOUCH_END, function (event) {
                cc.log("stop event" + event.target.getComponent("ClubAreaCell").name);

                var message = {
                    popView: "ClubAreaView",
                    btn: "ClubAreaCell",
                    area: this.ProvinceName + " " + event.target.getComponent("ClubAreaCell").name
                };
                GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.SCENE_MSG, data: message });
                this.dismiss();
            }.bind(this));
        }
    },

    updateProvinceArea: function updateProvinceArea() {
        this.scrollview.content.removeAllChildren(true);
        var index = 0;
        var cellHeight = 0;
        for (var name in pc) {
            cc.log("ClubAreaView.updateProvinceArea,name = " + name);
            var AreaCell = cc.instantiate(this.AreaCell);
            this.scrollview.content.addChild(AreaCell);
            cellHeight = AreaCell.getContentSize().height;
            AreaCell.setPosition(cc.p(0, 0 - cellHeight * (index + 0.5)));
            AreaCell.getComponent("ClubAreaCell").setAreaCellInfo(name, pc[name].length);
            index++;
            AreaCell.on(cc.Node.EventType.TOUCH_END, function (event) {
                cc.log("stop event" + event.target.getComponent("ClubAreaCell").name);
                this.ProvinceName = event.target.getComponent("ClubAreaCell").name;
                this.updateCityArea();
            }.bind(this));
        }

        if (this.scrollview.content.height < cellHeight * index) {
            this.scrollview.content.height = cellHeight * index;
        }
    }
});

cc._RFpop();
},{"Audio_Common":"Audio_Common","BasePop":"BasePop","GameSystem":"GameSystem","MusicMgr":"MusicMgr"}],"ClubCell":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'a2f3dsnImtOUq6HP2gz7Z22', 'ClubCell');
// Script\ComScene\PopView\ClubCell.js

"use strict";

var GamePlayer = require('GamePlayer');

cc.Class({
    extends: cc.Component,

    properties: {
        ClubAddress: cc.Label,
        ClubIcon: cc.Sprite,
        ClubName: cc.Label,
        ClubPresons: cc.Label,
        ClubAddress2: cc.Label,
        ClubIntro: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.info = null;
    },

    setClubCellInfo: function setClubCellInfo(info) {
        //{"clubid":10000019,"role":1,"owneruid":10688,"level":1,"name":"as",
        // "headurl":"","address":"广西 百色市","intro":"","endtime":1494324197,"status":1,
        // "members":1,"maxmember":10}
        if (GamePlayer.getInstance().uid == info.owneruid) {
            GamePlayer.getInstance().SelfClubId = info.clubid;
        }

        cc.log("ClubCell.setClubCellInfo clubid=", info.clubid, " owneruid=", info.owneruid);

        this.info = info;
        this.ClubAddress.string = info.address;
        this.ClubAddress2.string = info.address;
        this.ClubName.string = info.name;
        this.ClubPresons.string = info.members + "/" + info.maxmember;
    },

    callBackBtn: function callBackBtn(event, CustomEventData) {
        cc.log("ClubCell.callBackBtn");
    }
});

cc._RFpop();
},{"GamePlayer":"GamePlayer"}],"ClubCreateRoomReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '4f3a7irWINGDoVRNPGXSUBI', 'ClubCreateRoomReqPacket');
// Script\Network\Cmd\Cmd_Req\ClubCreateRoomReqPacket.js

'use strict';

/**
 * Created by shrimp on 17/2/23.
 */
var MessageReq = require("MessageReq");
var GamePlayer = require('GamePlayer');
var GameSystem = require('GameSystem');
/*
* type US_REQ_CREATE_TABLE_T struct {
 JsonHead
 ClubId        int    `json:"clubid"`                     //俱乐部id, 如果玩家创建，=0
 ClubLevel int    `json:"clublevel"`             //俱乐部level, 如果玩家创建，=0
 GameId      uint16 `json:"gameid"`             //服务器id (六人桌抢庄=101)
 GameLevel uint16 `json:"gamelevel"`     //游戏等级,暂时无
 Param          string `json:"param"`		      //base64之后的参数
 }
 //六人牛牛私人桌参数
 type SBF_PRIVATE_TABLE_PARAM_T struct {
 PayMode   int     `json:"paymode"`  //付费模式 (默认钻石)
 GameType  int32   `json:"gametype"` //闭牌抢庄,三张抢庄(二选一)
 MinAnte   int     `json:"mixante"`  //最小下注
 LiveTime  int64   `json:"livetime"` //桌子使用时间(秒)
 Seats     int8    `json:"seats"`    //座位数
 TableName string  `json:"name"`     //桌子名称
 BullMul   []int32 `json:"bullmul"`  //从无牛开始，传一个数组
 }
* */

function ClubCreateRoomReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.CLUB_REQ_CREATE_TABLE_CMD_ID;

    //准备发送的数据
    this.send = function (msg, type) {
        cc.log("CreateRoomReqPacket.send");

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            clubid: type.clubid,
            clublevel: type.clublevel,
            gameid: type.gameid,
            gamelevel: type.gamelevel,
            param: BASE64.encoder(JSON.stringify(msg))
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = ClubCreateRoomReqPacket;

cc._RFpop();
},{"GamePlayer":"GamePlayer","GameSystem":"GameSystem","MessageReq":"MessageReq"}],"ClubCreateRoomRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '1051eB1YdJOAo1gdaSvnSNC', 'ClubCreateRoomRespPacket');
// Script\Network\Cmd\Cmd_Resp\ClubCreateRoomRespPacket.js

"use strict";

/**
 * Created by shrimp on 17/2/23.
 */

var MessageResp = require("MessageResp");
/*
*
* type US_RESP_CREATE_TABLE_T struct {
 JsonHead
 RespHead
 ClubId     int    `json:"clubid"`           //如果是普通玩家，=0
 ClubLevel  int    `json:"clublevel"`  //俱乐部等级
 PrivateIds []int  `json:"privateids"` //如果ret_success, privateIds[0]是新生成的6位数值，
 //如果RET_FULL_PRIVATE_TABLE = -48 代表您创建的私人桌已经达到上线,
 //	privateids是所以创建过的6位数, 界面提示玩家已经创建了哪些私人桌
 GameId     uint16 `json:"gameid"`
 GameLevel  uint16 `json:"gamelevel"`
 GameSvcId  uint32 `json:"gamesvcid"` //游戏服务器ID
 TableId    int32  `json:"tableid"`   //游戏中某张桌子ID
 }*/
function ClubCreateRoomRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.CLUB_RESP_CREATE_TABLE_CMD_ID;
    this.privateid = 0; //六位数的桌子ID(房间)
    this.gamesvcid = 0; //游戏服务器ID
    this.tableid = 0; //游戏中某张桌子ID
    this.gamelevel = 1;
    this.gameid = 0;
    //接收的数据
    this.onMessage = function (msg) {
        //{"cmd":196616,"seq":1,"uid":10042,"code":0,"desc":"执行成功","privateid":354967,"gamesvcid":5,"tableid":0}
        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.gameid = msg.gameid;
        this.clubid = msg.clubid;
        this.clublevel = msg.clublevel;
        this.privateid = msg.privateids;
        this.gamesvcid = msg.gamesvcid;
        this.tableid = msg.tableid;
        this.gamelevel = msg.gamelevel;
        this.gameid = msg.gameid;

        //GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = ClubCreateRoomRespPacket;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"ClubCreateView":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd49b3/bUbNIS7Kg0JSUclS0', 'ClubCreateView');
// Script\ComScene\PopView\ClubCreateView.js

'use strict';

var BasePop = require('BasePop');
var MessageFactory = require('MessageFactory');
var ToastView = require('ToastView');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require("GameSystem");

cc.Class({
    extends: BasePop,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        AreaView: cc.Prefab,
        AreaString: cc.Label,
        ClubName: cc.EditBox
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._super();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    onSceneMsg: function onSceneMsg(event) {
        var msg = event.data;

        if (msg.popView == "ClubAreaView") {
            if (msg.btn == "ClubAreaCell") {
                this.AreaString.string = msg.area;
                //cc.director.loadScene("LoadingScene");
            }
        }
    },

    callBackBtn: function callBackBtn(event, CustomEventData) {
        var BtnName = event.target.getName();
        cc.log('ClubCreateView.callBackBtn,BtnName = ' + BtnName);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if (BtnName == "BtnCreate") {
            if (this.AreaString.string == "" || this.ClubName.string == "") {
                ToastView.show("俱乐部名字或地址不能为空");
                return;
            }
            var data = {
                name: this.ClubName.string,
                headurl: "",
                address: this.AreaString.string,
                level: 1,
                intro: ""
            };
            MessageFactory.createMessageReq(window.US_REQ_CREATE_CLUB_CMD_ID).send(data);
            this.dismiss();
        } else if (BtnName == "BtnClose") {
            this.dismiss();
        } else if (BtnName == "BtnPosition") {
            var AreaView = cc.instantiate(this.AreaView);
            this.node.addChild(AreaView);
            AreaView.setPosition(cc.p(0, 0));
        }
    }
});

cc._RFpop();
},{"Audio_Common":"Audio_Common","BasePop":"BasePop","GameSystem":"GameSystem","MessageFactory":"MessageFactory","MusicMgr":"MusicMgr","ToastView":"ToastView"}],"ClubDelMemberReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '3f2546jijJEsJ3DZ3BSXxQF', 'ClubDelMemberReqPacket');
// Script\Network\Cmd\Cmd_Req\ClubDelMemberReqPacket.js

'use strict';

/**
 * Created by shrimp on 17/4/9.
 */
var MessageReq = require("MessageReq");
var GamePlayer = require('GamePlayer');
var GameSystem = require('GameSystem');
/*
* type CLUB_REQ_OWNER_RM_MEMBER_T struct {
 ClubHead
 Param PARAM_REQ_OWNER_RM_MEMBER_T `json:"param"`
 }
 type PARAM_REQ_OWNER_RM_MEMBER_T struct {
 Uid uint32 `json:"uid"`
 }*/
function ClubDelMemberReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.CLUB_REQ_OWNER_RM_MEMBER_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("ClubDelMemberReqPacket.send");

        var data = {
            uid: msg.uid
        };

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            clubid: msg.clubid,
            param: data
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = ClubDelMemberReqPacket;

cc._RFpop();
},{"GamePlayer":"GamePlayer","GameSystem":"GameSystem","MessageReq":"MessageReq"}],"ClubDelMemberRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '146d8HVN+1FxI+CsOfPqVAw', 'ClubDelMemberRespPacket');
// Script\Network\Cmd\Cmd_Resp\ClubDelMemberRespPacket.js

'use strict';

/**
 * Created by shrimp on 17/4/9.
 */
/*
*
   type CLUB_RESP_OWNER_RM_MEMBER_T struct {
        JsonHead
        RespHead
        Param PARAM_RESP_OWNER_RM_MEMBER_T `json:"param"`
    }

    type PARAM_RESP_OWNER_RM_MEMBER_T struct {
        ClubId   int    `json:"clubid"`
        ClubName string `json:"clubname"`
        Uid      uint32 `json:"uid"`
        Name     string `json:"name"`
    }
 */
var MessageResp = require('MessageResp');
function ClubDelMemberRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.CLUB_RESP_OWNER_RM_MEMBER_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;

        this.param = msg.param;
    };
}

module.exports = ClubDelMemberRespPacket;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"ClubFindPopView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '9166e0c7nVPPLneopiy8cbH', 'ClubFindPopView');
// Script\ComScene\PopView\ClubFindPopView.js

'use strict';

var BasePop = require('BasePop');
var MessageFactory = require('MessageFactory');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require("GameSystem");

cc.Class({
    extends: BasePop,

    properties: {
        EditBox: cc.EditBox
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._super();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    callBackBtn: function callBackBtn(event, CustomEventData) {

        var BtnName = event.target.getName();
        cc.log('ClubCreateView.callBackBtn,BtnName = ' + BtnName);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if (BtnName == "BtnClose") {
            this.dismiss();
        } else if (BtnName == "BtnFind") {
            var data = {
                key: this.EditBox.string
            };
            MessageFactory.createMessageReq(US_REQ_SEARCH_CLUB_CMD_ID).send(data);
            this.dismiss();
        }
    }
});

cc._RFpop();
},{"Audio_Common":"Audio_Common","BasePop":"BasePop","GameSystem":"GameSystem","MessageFactory":"MessageFactory","MusicMgr":"MusicMgr"}],"ClubInfoView":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'ee0eb2F2w1J+L1sHWYXRLzv', 'ClubInfoView');
// Script\ComScene\PopView\ClubInfoView.js

'use strict';

var BasePop = require('BasePop');
var UtilTool = require('UtilTool');
var MessageFactory = require('MessageFactory');
var LoadingView = require('LoadingView');
var ToastView = require('ToastView');
var GamePlayer = require('GamePlayer');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameCallOC = require('GameCallOC');
var AlertView = require("AlertView");
var GameSystem = require("GameSystem");

cc.Class({
    extends: BasePop,

    properties: {
        ClubTitle: cc.Label, //俱乐部Title
        ClubName: cc.Label, //俱乐部名称
        ClubPersons: cc.Label,
        ClubHead: cc.Sprite,
        ClubAdress: cc.Label,
        ClubOwner: cc.Label,
        ClubMemberHead: [cc.Sprite],
        ClubMemHeadBg: [cc.Sprite],
        ClubOwnerHead: cc.Sprite,
        ClubId: cc.Label,
        ClubTime: cc.Label,
        ClubIntroDoc: cc.RichText,
        ClubMember: cc.Prefab,
        ClubSetView: cc.Prefab,
        ShareView: cc.Prefab,
        ClubLevel: cc.Label,
        ClubLevelView: cc.Prefab,
        ccccc: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._super();
        // for (var i = 0; i < 4; i++) {
        //     this.ClubMemHeadBg[i].node.active = false;
        // }
    },

    /*********************Network***************************/
    onMessage: function onMessage(event) {
        cc.log("ClubInfoView.onMessage");
        //this._super(event);
        var msg = event.data;
        var cmd = msg.cmd;
        switch (cmd) {
            case window.CLUB_RESP_DISMISS_CLUB_CMD_ID:
                this.onDismissClubMsg(msg);
                break;

            case CLUB_RESP_GET_MEMBER_LIST_CMD_ID:
                this.onGetClubMember(msg);
                break;

            case window.CLUB_RESP_OWNER_RM_MEMBER_CMD_ID:
                this.onDelMemberMsg(msg);
                break;

        }
    },

    onGetClubMember: function onGetClubMember(msg) {
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            GamePlayer.getInstance().CurClubMemList = msg.list;
            this.setHeadUrlList();
        }
    },

    onDelMemberMsg: function onDelMemberMsg(msg) {
        cc.log("ClubInfoView.onDelMemberMsg msg=", msg);
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            if (msg.param.uid == GamePlayer.getInstance().uid) {
                //如果是我自己
                this.dismiss();
                cc.log("ClubInfoView.onDismissClubMsg notify ClubRoomView");
                var message = {
                    popView: "ClubInfoView",
                    btn: "onDismissClubMsg"
                };

                GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.SCENE_MSG, data: message });
            } else {
                this.sendGetMemberList();
            }
        }
    },

    onDismissClubMsg: function onDismissClubMsg(msg) {
        cc.log("ClubInfoView.onDismissClubMsg msg=", msg);
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            if (msg.param.role == window.ClubRole.E_CLUB_OWNER_ROLE) {

                ToastView.show("群主" + msg.param.name + "解散了" + msg.param.clubname) + "俱乐部";

                LoadingView.dismiss();

                this.dismiss();

                cc.log("ClubInfoView.onDismissClubMsg notify ClubRoomView");
                var message = {
                    popView: "ClubInfoView",
                    btn: "onDismissClubMsg"
                };

                GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.SCENE_MSG, data: message });
            } else if (msg.param.uid == GamePlayer.getInstance().uid) {
                //如果是我自己

                ToastView.show("您退出俱乐部" + msg.param.clubname + "成功");

                LoadingView.dismiss();

                this.dismiss();

                cc.log("ClubInfoView.onDismissClubMsg notify ClubRoomView");
                var message = {
                    popView: "ClubInfoView",
                    btn: "onDismissClubMsg"
                };

                GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.SCENE_MSG, data: message });
            } else {
                //如果是其他玩家,重新刷新一下用户头像
                ToastView.show(msg.param.name + "退出俱乐部" + msg.param.clubname);
                this.sendGetMemberList();
            }
        }
    },

    ///////////////////////Scene/////////////////////////
    onSceneMsg: function onSceneMsg(event) {
        var msg = event.data;
        if (msg.popView == "ClubSetView" || msg.popView == "ClubMemberView") {
            if (msg.btn == "BtnClose") {
                this.setTextInfo();
                this.setHeadUrlList();
            }
        }
    },

    //[{"clubid":10000019,"role":1,"owneruid":10688,"level":1, "name":"as",
    // "headurl":"","address":"广西 百色市","intro":"","endtime":1494324197,"status":1,
    // "members":1, "maxmember":10}]
    setTextInfo: function setTextInfo() {
        cc.log("ClubInfoView.setTextInfo info=", GamePlayer.getInstance().CurClubInfo);

        this.ClubTitle.string = GamePlayer.getInstance().CurClubInfo.name;
        this.ClubName.string = GamePlayer.getInstance().CurClubInfo.name;
        this.ClubPersons.string = GamePlayer.getInstance().CurClubInfo.members + "/" + GamePlayer.getInstance().CurClubInfo.maxmember;
        this.ClubAdress.string = GamePlayer.getInstance().CurClubInfo.address;
        this.ClubOwner.string = GamePlayer.getInstance().CurClubInfo.ownername;
        this.ClubId.string = GamePlayer.getInstance().CurClubInfo.clubid;
        this.ClubIntroDoc.string = GamePlayer.getInstance().CurClubInfo.intro;
        // this.ClubMemberHead.length = GamePlayer.getInstance().CurClubInfo.members;
        this.ClubTime.string = /*"创建于" + UtilTool.getFormatData(GamePlayer.getInstance().CurClubInfo.createtime) + "  "
                                +*/UtilTool.getFormatData(GamePlayer.getInstance().CurClubInfo.endtime) + "到期";
        this.ClubLevel.string = this.getClubLevelName(GamePlayer.getInstance().CurClubInfo.level);
    },

    setHeadUrlList: function setHeadUrlList() {
        var list = GamePlayer.getInstance().CurClubMemList;
        if (list == null || list.length == 0) {
            return;
        }

        var i = 0;
        for (; i < list.length; i++) {
            this.ClubMemHeadBg[i].node.active = true;
            UpdateWXHeadIcon(list[i].headurl, this.ClubMemberHead[i]);
            if (i >= 3) {
                break;
            }
        }

        for (i = 0; i < list.length; i++) {
            if (list[i].role == window.ClubRole.E_CLUB_OWNER_ROLE) {
                UpdateWXHeadIcon(list[i].headurl, this.ClubOwnerHead);
                return;
            }
        }
    },

    setClubInfo: function setClubInfo() {
        this.setTextInfo();
        this.sendGetMemberList();
    },

    sendGetMemberList: function sendGetMemberList() {
        cc.log("ClubInfoView.sendGetMemberList clubid=", GamePlayer.getInstance().CurClubInfo.clubid);
        var data = {
            clubid: GamePlayer.getInstance().CurClubInfo.clubid
        };
        MessageFactory.createMessageReq(window.CLUB_REQ_GET_MEMBER_LIST_CMD_ID).send(data);
    },

    callBackBtn: function callBackBtn(event, CustomEventData) {
        var BtnName = event.target.getName();
        cc.log('ClubInfoView.callBackBtn,BtnName = ' + BtnName);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);

        if (BtnName == "BtnChangeInfo") {
            var ClubSetView = cc.instantiate(this.ClubSetView);
            this.node.addChild(ClubSetView);
            ClubSetView.setPosition(cc.p(0, 0));
        } else if (BtnName == "BtnClose") {
            this.dismiss();

            var message = {
                popView: "ClubInfoView",
                btn: "BtnClose"
            };
            GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.SCENE_MSG, data: message });
        } else if (BtnName == "BtnMember") {
            var ClubMember = cc.instantiate(this.ClubMember);
            this.node.addChild(ClubMember);
            ClubMember.setPosition(cc.p(0, 0));
        } else if (BtnName == "BtnDelClub") {
            var alert = AlertView.create();
            alert.setPositiveButton(function () {
                var data = {
                    clubid: GamePlayer.getInstance().CurClubInfo.clubid
                };
                MessageFactory.createMessageReq(CLUB_REQ_DISMISS_CLUB_CMD_ID).send(data);
            }, "删除并退出");
            alert.show("您确定是否删除并推出俱乐部？", AlertViewBtnType.E_BTN_CANCLE);
        } else if (BtnName == "BtnShareBusiness") {
            var shareView = cc.instantiate(this.ShareView);
            this.node.addChild(shareView);
            shareView.setPosition(cc.p(0, 0));
            var string = "我正在玩游戏［" + GameCallOC.getInstance().getAppName() + "］,俱乐部(" + GamePlayer.getInstance().CurClubInfo.clubid + ")欢迎您的加入！！！";
            shareView.getComponent("ShareView").setShareTyep(ShareType.E_SHARETYPE_LINK, string, GameSystem.getInstance().clienturl);
        } else if (BtnName == "BtnClubLevel") {
            if (GamePlayer.getInstance().CurClubInfo.owneruid == GamePlayer.getInstance().uid) {
                var levelView = cc.instantiate(this.ClubLevelView);
                this.node.addChild(levelView);
                levelView.setPosition(cc.p(0, 0));
            }
        }
    },

    getClubLevelName: function getClubLevelName(level) {
        switch (level) {
            case 1:
                return "一星俱乐部";
            case 2:
                return "二星俱乐部";
            case 3:
                return "三星俱乐部";
            case 4:
                return "四星俱乐部";
            case 5:
                return "五星俱乐部";
            case 6:
                return "六星俱乐部";
            case 7:
                return "七星俱乐部";
            case 8:
                return "八星俱乐部";
            case 9:
                return "九星俱乐部";
            case 10:
                return "十星俱乐部";
        }
    }
});

cc._RFpop();
},{"AlertView":"AlertView","Audio_Common":"Audio_Common","BasePop":"BasePop","GameCallOC":"GameCallOC","GamePlayer":"GamePlayer","GameSystem":"GameSystem","LoadingView":"LoadingView","MessageFactory":"MessageFactory","MusicMgr":"MusicMgr","ToastView":"ToastView","UtilTool":"UtilTool"}],"ClubJoinView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '73334mXVPdNtIwkuAI4skgn', 'ClubJoinView');
// Script\ComScene\PopView\ClubJoinView.js

'use strict';

var BasePop = require('BasePop');
var UtilTool = require('UtilTool');
var MessageFactory = require('MessageFactory');
var LoadingView = require('LoadingView');
var ToastView = require('ToastView');
var GamePlayer = require('GamePlayer');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require("GameSystem");

cc.Class({
    extends: BasePop,

    properties: {
        ClubTitle: cc.Label, //俱乐部Title
        ClubName: cc.Label, //俱乐部名称
        ClubPersons: cc.Label,
        ClubHead: cc.Sprite,
        ClubAddress: cc.Label,
        ClubOwner: cc.Label,
        ClubOwnerHead: cc.Sprite,
        ClubId: cc.Label,
        ClubIntroDoc: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._super();
        this.setTextInfo();
        this.setHeadUrl();
    },

    /*********************Network***************************/
    onMessage: function onMessage(event) {
        cc.log("ClubJoinView.onMessage");
        var msg = event.data;
        var cmd = msg.cmd;
        switch (cmd) {
            case window.CLUB_RESP_JOIN_CLUB_CMD_ID:
                this.onJoinClubMsg(msg);
                break;

        }
    },

    onJoinClubMsg: function onJoinClubMsg(msg) {
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            if (msg.param.uid == GamePlayer.getInstance().uid) {
                if (msg.param.isallow == 1) {
                    ToastView.show("群主同意您加入他的俱乐部");
                    MessageFactory.createMessageReq(US_REQ_CLUB_LIST_CMD_ID).send();
                } else {
                    ToastView.show("群主拒绝您加入他的俱乐部");
                }
                this.dismiss();
                var message = {
                    popView: "ClubJoinView",
                    btn: "RespJoin"
                };
                GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.SCENE_MSG, data: message });
            }
        }
    },

    //[{"clubid":10000019,"role":1,"owneruid":10688,"level":1, "name":"as",
    // "headurl":"","address":"广西 百色市","intro":"","endtime":1494324197,"status":1,
    // "members":1, "maxmember":10}]
    setTextInfo: function setTextInfo() {
        this.ClubTitle.string = GamePlayer.getInstance().CurClubInfo.name;
        this.ClubName.string = GamePlayer.getInstance().CurClubInfo.name;
        this.ClubPersons.string = GamePlayer.getInstance().CurClubInfo.members + "/" + GamePlayer.getInstance().CurClubInfo.maxmember;
        this.ClubAddress.string = GamePlayer.getInstance().CurClubInfo.address;
        this.ClubOwner.string = GamePlayer.getInstance().CurClubInfo.ownername;
        this.ClubId.string = GamePlayer.getInstance().CurClubInfo.clubid;
        this.ClubIntroDoc.string = GamePlayer.getInstance().CurClubInfo.intro;
    },

    setHeadUrl: function setHeadUrl() {
        //this.ClubOwnerHead
    },

    callBackBtn: function callBackBtn(event, CustomEventData) {
        var BtnName = event.target.getName();
        cc.log('ClubJoinView.callBackBtn,BtnName = ' + BtnName);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if (BtnName == "BtnClose") {
            this.dismiss();
        } else if (BtnName == "BtnJoinClub") {
            var data = {
                uid: GamePlayer.getInstance().uid,
                name: GamePlayer.getInstance().name,
                headurl: GamePlayer.getInstance().headurl,
                sex: GamePlayer.getInstance().sex
            };
            MessageFactory.createMessageReq(CLUB_REQ_JOIN_CLUB_CMD_ID).send(GamePlayer.getInstance().CurClubInfo.clubid, data);
        }
    }
});

cc._RFpop();
},{"Audio_Common":"Audio_Common","BasePop":"BasePop","GamePlayer":"GamePlayer","GameSystem":"GameSystem","LoadingView":"LoadingView","MessageFactory":"MessageFactory","MusicMgr":"MusicMgr","ToastView":"ToastView","UtilTool":"UtilTool"}],"ClubLevelCell":[function(require,module,exports){
"use strict";
cc._RFpush(module, '966b2ozM3pNJq6SkDvbg3bW', 'ClubLevelCell');
// Script\ComScene\PopView\ClubLevelCell.js

'use strict';

var UtilTool = require('UtilTool');
var GamePlayer = require('GamePlayer');
var ToastView = require('ToastView');
var AlertView = require('AlertView');
var MessageFactory = require('MessageFactory');
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        ClubLevelFlag: cc.Sprite,
        FontLevel: cc.Label,
        FontLvInfo: cc.Label,
        FontNeedDia: cc.Label,
        LevelFlagFrame: [cc.SpriteFrame],
        LevelNum: 0,
        LevelCost: 0
    },

    // use this for initialization
    onLoad: function onLoad() {},

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    //{"level":1,"livetime":30,"diamond":0,    "maxpeople":10, "maxtable":2},
    setCellInfo: function setCellInfo(msg) {
        this.setClubLevel(msg.level);
        this.FontNeedDia.string = "" + msg.diamond;
        this.LevelCost = msg.diamond;
        this.FontLvInfo.string = "提高人数上限至" + msg.maxpeople + "人，可设管理员" + msg.level + "人。持续" + msg.livetime + "天";
    },

    setClubLevel: function setClubLevel(level) {
        this.LevelNum = level;
        this.FontLevel.string = UtilTool.getClubLevelName(level);
        this.ClubLevelFlag.spriteFrame = this.LevelFlagFrame[level - 1];
    },

    CallBackBtn: function CallBackBtn() {
        if (GamePlayer.getInstance().CurClubInfo.level < this.LevelNum) {
            if (GamePlayer.getInstance().diamond < this.LevelCost) {
                ToastView.show("您的钻石不足" + ",无法购买" + UtilTool.getClubLevelName(this.LevelNum) + "，请前往商城购买钻石");
            } else {
                var self = this;
                var alert = AlertView.create();
                alert.setPositiveButton(function () {
                    self.sendUpClubPacket();
                }, "确认");
                alert.show("您是否确认花费" + this.LevelCost + "个钻石购买" + UtilTool.getClubLevelName(this.LevelNum), AlertViewBtnType.E_BTN_CLOSE);
            }
        } else {
            ToastView.show("您已购买" + UtilTool.getClubLevelName(this.LevelNum) + ",无法降级购买");
        }
    },

    sendUpClubPacket: function sendUpClubPacket() {
        var info = GamePlayer.getInstance().CurClubInfo;
        var data = {
            clubid: info.clubid,
            headurl: "",
            intro: "",
            address: "",
            level: this.LevelNum
        };
        MessageFactory.createMessageReq(window.CLUB_REQ_MODIFY_INFO_CMD_ID).send(data);
    }

});

cc._RFpop();
},{"AlertView":"AlertView","GamePlayer":"GamePlayer","MessageFactory":"MessageFactory","ToastView":"ToastView","UtilTool":"UtilTool"}],"ClubLevelView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '3ded59G/WZAqJScyRtfW3bL', 'ClubLevelView');
// Script\ComScene\PopView\ClubLevelView.js

'use strict';

var BasePop = require('BasePop');
var ClubLevelCell = require('ClubLevelCell');
var GamePlayer = require('GamePlayer');
var UtilTool = require('UtilTool');
var GameSystem = require('GameSystem');
var ToastView = require('ToastView');

cc.Class({
    extends: BasePop,

    properties: {
        ClubLvFlag: cc.Sprite,
        ClubLvFlagFrame: [cc.SpriteFrame],
        FontCurLevel: cc.Label,
        TimeLabel: cc.Label,
        CurDiamond: cc.Label,

        clubLevelCell: cc.Prefab,
        Content: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._super();
        //this.initBaseData();
    },

    start: function start() {
        this.initBaseData();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },


    // {"level":1,"livetime":30,"diamond":0,    "maxpeople":10, "maxtable":2},
    // {"level":2,"livetime":30,"diamond":1000, "maxpeople":50, "maxtable":3},
    // {"level":3,"livetime":30,"diamond":4000, "maxpeople":100,"maxtable":4},
    // {"level":4,"livetime":30,"diamond":10000,"maxpeople":200,"maxtable":9}
    initBaseData: function initBaseData() {

        this.initCurClubInfo();
        var height = 0;
        for (var index = 0; index < GameSystem.getInstance().ClubUpgradeCost.length; index++) {
            var levelItem = cc.instantiate(this.clubLevelCell);
            height = levelItem.getContentSize().height;
            levelItem.setPosition(cc.p(0, 0 - 620 - height * index));
            this.Content.addChild(levelItem);
            levelItem.getComponent('ClubLevelCell').setCellInfo(GameSystem.getInstance().ClubUpgradeCost[index]);
        }
    },

    initCurClubInfo: function initCurClubInfo() {
        this.FontCurLevel.string = UtilTool.getClubLevelName(GamePlayer.getInstance().CurClubInfo.level);
        this.ClubLvFlag.spriteFrame = this.ClubLvFlagFrame[GamePlayer.getInstance().CurClubInfo.level - 1];
        this.TimeLabel.string = UtilTool.getFormatData(GamePlayer.getInstance().CurClubInfo.endtime);
        this.CurDiamond.string = GamePlayer.getInstance().diamond;
    },

    onMessage: function onMessage(event) {
        var msg = event.data;
        var cmd = msg.cmd;
        cc.log("ClubLevelCell.onMessage cmd=", msg.cmd, " window.CLUB_RESP_MODIFY_INFO_CMD_ID=", window.CLUB_RESP_MODIFY_INFO_CMD_ID);
        switch (cmd) {
            case window.CLUB_RESP_MODIFY_INFO_CMD_ID:
                this.onModifyInfoMsg(msg);
                break;

            case window.US_RESP_USER_DETAIL_CMD_ID:
                this.updateUserDiamond(msg);
                break;
        }
    },

    updateUserDiamond: function updateUserDiamond(msg) {
        cc.log("ClubLevelCell.updateUserDiamond");
        GamePlayer.getInstance().gold = msg.gold;
        GamePlayer.getInstance().diamond = msg.diamond;
        this.initCurClubInfo();
    },

    // ClubId  int    `json:"clubid"`
    // Status  int    `json:"status"`
    // Name    string `json:"name"`
    // HeadUrl string `json:"headurl"`
    // Address string `json:"address"`
    // Intro   string `json:"intro"`
    // Level   int    `json:"level"`
    // EndTime int64  `json:"endtime"`
    onModifyInfoMsg: function onModifyInfoMsg(msg) {
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            cc.log("ClubLevelCell.onModifyInfoMsg code=", msg.code, " endtime=", msg.param.endtime);
            GamePlayer.getInstance().CurClubInfo.level = Number(msg.param.level);
            GamePlayer.getInstance().CurClubInfo.endtime = msg.param.endtime;
            var info = this.getCurLevelInfo(msg.param.level);
            cc.log("ClubLevelCell.onModifyInfoMsg  info=", info);

            GamePlayer.getInstance().CurClubInfo.maxmember = info.maxpeople;

            ToastView.show("升级成功: " + UtilTool.getFormatDataDetail(GamePlayer.getInstance().CurClubInfo.endtime) + "到期", 2);
            this.getUserDetail();
            this.initCurClubInfo();
        } else {
            ToastView.show(msg.desc);
        }
    },

    getCurLevelInfo: function getCurLevelInfo(level) {
        var list = GameSystem.getInstance().ClubUpgradeCost;
        for (var i = 0; i < list.length; i++) {
            if (level == list[i].level) {
                return list[i];
            }
        }
        return list[0];
    }

});

cc._RFpop();
},{"BasePop":"BasePop","ClubLevelCell":"ClubLevelCell","GamePlayer":"GamePlayer","GameSystem":"GameSystem","ToastView":"ToastView","UtilTool":"UtilTool"}],"ClubMemberPermissionView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '1c947ir7cREq62tEy0ORrfi', 'ClubMemberPermissionView');
// Script\ComScene\PopView\ClubMemberPermissionView.js

'use strict';

var BasePop = require('BasePop');
var MessageFactory = require('MessageFactory');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GamePlayer = require('GamePlayer');
var GameSystem = require("GameSystem");

cc.Class({
    extends: BasePop,

    properties: {
        OpManage: cc.Label
    },

    // use this for initialization
    // `json:"uid"`
    // `json:"name"`
    // `json:"headurl"`
    // `json:"sex"`
    // `json:"role"`
    // `json:"lasttime"`
    onLoad: function onLoad() {
        this._super();
        this.info = null;
    },

    setData: function setData(info) {
        this.info = info;
        if (info.role == window.ClubRole.E_CLUB_MANAGER_ROLE) {
            this.OpManage.string = "取消管理员";
        } else if (info.role == window.ClubRole.E_CLUB_NORMAL_ROLE) {
            this.OpManage.string = "设置管理员";
        }
    },

    callBackBtn: function callBackBtn(event, CustomEventData) {
        var BtnName = event.target.getName();
        cc.log('ClubMemberPermissionView.callBackBtn, BtnName = ' + BtnName);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);

        if (BtnName == "GrayLayer") {} else if (BtnName == "PermissionOpBg") {
            var data = {
                clubid: GamePlayer.getInstance().CurClubInfo.clubid,
                uid: this.info.uid,
                role: window.ClubRole.E_CLUB_MANAGER_ROLE
            };

            if (this.info.role == window.ClubRole.E_CLUB_MANAGER_ROLE) {
                data.role = window.ClubRole.E_CLUB_NORMAL_ROLE;
            }
            cc.log("ClubMemberPermissionView Send Modify Role, data=", data);

            MessageFactory.createMessageReq(CLUB_REQ_OWNER_MODIFY_ROLE_CMD_ID).send(data);
        } else if (BtnName == "PermissionDelBg") {
            var data = {
                clubid: GamePlayer.getInstance().CurClubInfo.clubid,
                uid: this.info.uid
            };
            MessageFactory.createMessageReq(CLUB_REQ_OWNER_RM_MEMBER_CMD_ID).send(data);
        }
        this.dismiss();
    }
});

cc._RFpop();
},{"Audio_Common":"Audio_Common","BasePop":"BasePop","GamePlayer":"GamePlayer","GameSystem":"GameSystem","MessageFactory":"MessageFactory","MusicMgr":"MusicMgr"}],"ClubMemberView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '11fb0Law1tM57o3bDWFfnlI', 'ClubMemberView');
// Script\ComScene\PopView\ClubMemberView.js

'use strict';

var BasePop = require('BasePop');
var MessageFactory = require('MessageFactory');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GamePlayer = require('GamePlayer');
var ToastView = require('ToastView');
var GameSystem = require("GameSystem");

window.ClubRole = {
    E_CLUB_OWNER_ROLE: 1, //群主
    E_CLUB_MANAGER_ROLE: 2, //管理员
    E_CLUB_NORMAL_ROLE: 3 };

cc.Class({
    extends: BasePop,

    properties: {
        TitleLabel: cc.Label,
        UpgradeLabel: cc.Label,
        EditName: cc.EditBox,
        ClubPersonsCell: cc.Prefab,
        ScrollView: cc.ScrollView,
        ClubUpgradView: cc.Prefab,
        ClubMemberPermissionView: cc.Prefab
    },

    onLoad: function onLoad() {
        this._super();
        this.showTitle();
        this.showMemberList();
    },

    showTitle: function showTitle() {
        this.TitleLabel.string = "会员管理(" + GamePlayer.getInstance().CurClubInfo.members + "/" + GamePlayer.getInstance().CurClubInfo.maxmember + ")";
        if (GamePlayer.getInstance().uid != GamePlayer.getInstance().CurClubInfo.owneruid) {
            this.UpgradeLabel.node.active = false;
        }
    },

    showMemberList: function showMemberList() {
        var list = GamePlayer.getInstance().CurClubMemList;
        this.ScrollView.content.removeAllChildren(true);
        var height = 0;
        for (var index = 0; list != null && index < list.length; index++) {
            height = this.createClubPersonCell(list, index);
        }

        if (height * list.length > this.ScrollView.content.height) {
            this.ScrollView.content.height = height * list.length;
        }
    },

    searchOneMember: function searchOneMember(name) {
        var list = GamePlayer.getInstance().CurClubMemList;

        for (var index = 0; list != null && index < list.length; index++) {
            if (list[index].name != name) {
                cc.log("searchOneMember : not found list.name=", list[index].name);
                continue;
            }
            cc.log("searchOneMember : success found name=", name);
            this.ScrollView.content.removeAllChildren();
            this.createClubPersonCell(list, index);
            return;
        }

        ToastView.show("未搜索到会员: " + name);
    },

    createClubPersonCell: function createClubPersonCell(list, index) {
        var ClubPersonsCell = cc.instantiate(this.ClubPersonsCell);

        this.ScrollView.content.addChild(ClubPersonsCell);
        var height = ClubPersonsCell.getContentSize().height;
        ClubPersonsCell.setPosition(cc.p(0, 0 - height * (index + 0.5)));

        ClubPersonsCell.getComponent("ClubPersonsCell").setPersonInfo(list[index]);

        //不是这个俱乐部的群主没有权限修改会员
        if (GamePlayer.getInstance().CurClubInfo.owneruid != GamePlayer.getInstance().uid) {
            cc.log("ClubMemberView.createClubPersonCell not Owner");
            return height;
        }

        if (list[index].role == window.ClubRole.E_CLUB_OWNER_ROLE) {
            cc.log("ClubMemberView.createClubPersonCell owner role=", list[index].role);
            return height;
        }
        ClubPersonsCell.getComponent("ClubPersonsCell").BtnSet.node.active = true;
        ClubPersonsCell.getComponent("ClubPersonsCell").BtnSet.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            var self = this;
            var cell = event.target.getParent().getComponent('ClubPersonsCell');
            var ClubMemberPermissionView = cc.instantiate(this.ClubMemberPermissionView);
            self.node.addChild(ClubMemberPermissionView);
            ClubMemberPermissionView.setPosition(cc.p(0, 0));
            ClubMemberPermissionView.getComponent('ClubMemberPermissionView').setData(cell.info);
        }.bind(this));
        cc.log("createClubPersonCell.height = " + height);
        return height;
    },

    ////////////////////////////////////////////////////////////////////
    onMessage: function onMessage(event) {
        cc.log("ClubMemberView.onMessage");
        var msg = event.data;
        var cmd = msg.cmd;
        switch (cmd) {
            case window.CLUB_RESP_OWNER_RM_MEMBER_CMD_ID:
                this.onDelMemberMsg(msg);
                break;

            case window.CLUB_RESP_GET_MEMBER_LIST_CMD_ID:
                this.onGetClubMember(msg);
                break;

            case window.CLUB_RESP_OWNER_MODIFY_ROLE_CMD_ID:
                this.onModifyMemberRole(msg);
                break;
        }
    },

    onClubRmMem: function onClubRmMem(msg) {
        //param
        // ClubId   int    `json:"clubid"`
        // ClubName string `json:"clubname"`
        // Uid      uint32 `json:"uid"`
        // Name     string `json:"name"`
        if (msg.param.uid == GamePlayer.getInstance().uid) {
            ToastView.show("您被移除俱乐部" + msg.param.clubname + "(" + msg.param.clubid + ")");
        } else {
            ToastView.show(msg.param.name + "被移除俱乐部" + msg.param.clubname + "(" + msg.param.clubid + ")");
        }
    },

    // type CLUB_RESP_OWNER_MODIFY_ROLE_T struct {
    //     JsonHead
    //     RespHead
    //     Param PARAM_RESP_OWNER_MODIFY_ROLE_T `json:"param"`
    // }
    //
    // type PARAM_RESP_OWNER_MODIFY_ROLE_T struct {
    //     ClubId int    `json:"clubid"`
    //     Uid    uint32 `json:"uid"`
    //     Role   uint8  `json:"role"`
    // }
    onModifyMemberRole: function onModifyMemberRole(msg) {
        //param : { clubid, uid, role
        //        }
        if (msg.param.clubid != GamePlayer.getInstance().CurClubInfo.clubid) {
            cc.log("ClubMemberView.onModifyMemberRole recv clubid=", msg.param.clubid, " != curClubid=", GamePlayer.getInstance().CurClubInfo.clubid);
            return;
        }

        var list = GamePlayer.getInstance().CurClubMemList;
        for (var index = 0; list != null && index < list.length; index++) {
            if (list[index].uid == msg.param.uid) {
                GamePlayer.getInstance().CurClubMemList[index].role = msg.param.role;
            }
        }
        this.showMemberList();
    },

    onDelMemberMsg: function onDelMemberMsg(msg) {
        cc.log("ClubMemberView.onDelMemberMsg");
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            var data = {
                clubid: GamePlayer.getInstance().CurClubInfo.clubid
            };
            MessageFactory.createMessageReq(window.CLUB_REQ_GET_MEMBER_LIST_CMD_ID).send(data);
        }
    },

    onGetClubMember: function onGetClubMember(msg) {
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            GamePlayer.getInstance().CurClubMemList = msg.list;
            this.showMemberList();
        }
    },

    callBackBtn: function callBackBtn(event, CustomEventData) {
        var BtnName = event.target.getName();

        cc.log('ClubMemberView.callBackBtn, BtnName=' + BtnName);

        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);

        if (BtnName == "BtnClose") {
            this.dismiss();
            this.dismiss();
            var message = {
                popView: "ClubMemberView",
                btn: "BtnClose"
            };

            GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.SCENE_MSG, data: message });
        } else if (BtnName == "BtnUpgrade") {
            var ClubUpgradView = cc.instantiate(this.ClubUpgradView);
            this.node.addChild(ClubUpgradView);
            ClubUpgradView.setPosition(cc.p(0, 0));
        } else if (BtnName == "BtnSearch") {
            var name = this.EditName.string;
            cc.log("ClubMemberView.callBackBtn, name=", name);
            this.searchOneMember(name);
        }
    },

    callBackEditNameBegin: function callBackEditNameBegin(event, CustomEventData) {
        cc.log("ClubMemberView.callBackEditNameBegin");
        this.EditName.string = "";
    },

    callBackEditNameEnd: function callBackEditNameEnd(event, CustomEventData) {
        var name = this.EditName.string;
        cc.log("ClubMemberView.callBackEditNameEnd, name=", name);
        this.searchOneMember(name);
    },

    onSceneMsg: function onSceneMsg(event) {
        var msg = event.data;
        if (msg.popView == "ClubUpdradeView") {
            if (msg.btn == "BtnClose") {
                this.showTitle();
                this.showMemberList();
            }
        }
    }

});

cc._RFpop();
},{"Audio_Common":"Audio_Common","BasePop":"BasePop","GamePlayer":"GamePlayer","GameSystem":"GameSystem","MessageFactory":"MessageFactory","MusicMgr":"MusicMgr","ToastView":"ToastView"}],"ClubOwnerConfirmReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '6160fJzCppDz6tvkcDbEKij', 'ClubOwnerConfirmReqPacket');
// Script\Network\Cmd\Cmd_Req\ClubOwnerConfirmReqPacket.js

'use strict';

/**
 * Created by shrimp on 17/4/9.
 */
/*
* type CLUB_REQ_OWNER_CONFIRM_T struct {
 ClubHead
 Param PARAM_REQ_OWNER_CONFIRM_T `json:"param"`
 }
 type PARAM_REQ_OWNER_CONFIRM_T struct {
 IsAllow int    `json:"isallow"` //1: allow, 0: reject.
 Uid     uint32 `json:"uid"`
 }
 */
var MessageReq = require("MessageReq");
var GamePlayer = require('GamePlayer');
var GameSystem = require('GameSystem');

function ClubOwnerConfirmReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.CLUB_REQ_OWNER_CONFIRM_CMD_ID;

    //准备发送的数据
    this.send = function (msg, clubid) {
        cc.log("ClubOwnerConfirmReqPacket.send");

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            clubid: clubid,
            param: msg
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = ClubOwnerConfirmReqPacket;

cc._RFpop();
},{"GamePlayer":"GamePlayer","GameSystem":"GameSystem","MessageReq":"MessageReq"}],"ClubOwnerConfirmRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '5756dIwm+lD94z8OSXnqdfO', 'ClubOwnerConfirmRespPacket');
// Script\Network\Cmd\Cmd_Resp\ClubOwnerConfirmRespPacket.js

'use strict';

/**
 * Created by shrimp on 17/4/9.
 */
/*
* type CLUB_RESP_OWNER_CONFIRM_T struct {
 JsonHead
 RespHead
 Param PARAM_RESP_OWNER_CONFIRM_T `json:"param"`
 }
 type PARAM_RESP_OWNER_CONFIRM_T struct {
 ClubId int `json:"clubid"`
 }*/

var MessageResp = require('MessageResp');

function ClubOwnerConfirmRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.CLUB_RESP_OWNER_CONFIRM_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
    };
}

module.exports = ClubOwnerConfirmRespPacket;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"ClubOwnerModifyRoleReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '6a772oQiE9Eiav1MBYoI9VD', 'ClubOwnerModifyRoleReqPacket');
// Script\Network\Cmd\Cmd_Req\ClubOwnerModifyRoleReqPacket.js

'use strict';

/**
 * Created by shrimp on 17/4/15.
 */
var MessageReq = require("MessageReq");
var GamePlayer = require('GamePlayer');
var GameSystem = require('GameSystem');

function ClubOwnerModifyRoleReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.CLUB_REQ_OWNER_MODIFY_ROLE_CMD_ID;
    //准备发送的数据
    this.send = function (msg) {
        cc.log("ClubOwnerModifyRoleReqPacket.send");

        var param = {
            uid: msg.uid,
            role: msg.role
        };

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            clubid: msg.clubid,
            param: param

        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = ClubOwnerModifyRoleReqPacket;

cc._RFpop();
},{"GamePlayer":"GamePlayer","GameSystem":"GameSystem","MessageReq":"MessageReq"}],"ClubOwnerModifyRoleRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '71674scYjdD/I2n+iqa6uYz', 'ClubOwnerModifyRoleRespPacket');
// Script\Network\Cmd\Cmd_Resp\ClubOwnerModifyRoleRespPacket.js

'use strict';

/**
 * Created by shrimp on 17/4/15.
 */
var MessageResp = require('MessageResp');

function ClubOwnerModifyRoleRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.CLUB_RESP_OWNER_MODIFY_ROLE_CMD_ID;

    // type CLUB_RESP_OWNER_MODIFY_ROLE_T struct {
    //     JsonHead
    //     RespHead
    //     Param PARAM_RESP_OWNER_MODIFY_ROLE_T `json:"param"`
    // }
    //
    // type PARAM_RESP_OWNER_MODIFY_ROLE_T struct {
    //     ClubId int    `json:"clubid"`
    //     Uid    uint32 `json:"uid"`
    //     Role   uint8  `json:"role"`
    // }

    //接收的数据
    this.onMessage = function (msg) {
        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.param = msg.param;
    };
}

module.exports = ClubOwnerModifyRoleRespPacket;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"ClubPersonsCell":[function(require,module,exports){
"use strict";
cc._RFpush(module, '115a1vqfGhId6oWAChB+9b8', 'ClubPersonsCell');
// Script\ComScene\PopView\ClubPersonsCell.js

"use strict";

var UtilTool = require('UtilTool');

cc.Class({
    extends: cc.Component,

    properties: {
        Head: cc.Sprite,
        Name: cc.Label,
        RoleSprite: cc.Sprite,
        RoleFrame: [cc.SpriteFrame],
        Time: cc.Label,
        BtnSet: cc.Button
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.info = null;
    },

    // Uid      uint32 `json:"uid"`
    // Name     string `json:"name"`
    // HeadUrl  string `json:"headurl"`
    // Sex      int    `json:"sex"`
    // Role     uint8  `json:"role"`
    // LastTime int64  `json:"lasttime"`

    setPersonInfo: function setPersonInfo(info) {
        cc.log("ClubPersonCell name=", info.name, " headurl=", info.headurl, " role=", info.role, " time=", info.lasttime);
        this.info = info;
        this.Name.string = info.name;
        this.Time.string = UtilTool.getFormatData(info.lasttime);
        UpdateWXHeadIcon(info.headurl, this.Head);

        if (info.role == window.ClubRole.E_CLUB_OWNER_ROLE) {
            this.RoleSprite.spriteFrame = this.RoleFrame[0];
        } else if (info.role == window.ClubRole.E_CLUB_MANAGER_ROLE) {
            this.RoleSprite.spriteFrame = this.RoleFrame[1];
        } else {
            cc.log("ClubPersonCell.setPersonInfo role = normal");
            this.RoleSprite.node.active = false;
        }
    }

});

cc._RFpop();
},{"UtilTool":"UtilTool"}],"ClubPersonsView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '851a9wyrIpAy6765tLFd57l', 'ClubPersonsView');
// Script\ComScene\PopView\ClubPersonsView.js

"use strict";

var BasePop = require("BasePop");
cc.Class({
    extends: BasePop,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        ScrollView: cc.ScrollView
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._super();
    },

    callbackBtn: function callbackBtn(event, CustomEventData) {}
});

cc._RFpop();
},{"BasePop":"BasePop"}],"ClubRoomView":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd5fbaSs+PlHh6GrGhfundeD', 'ClubRoomView');
// Script\ComScene\PopView\ClubRoomView.js

'use strict';

var BasePop = require('BasePop');
var MessageFactory = require('MessageFactory');
var ToastView = require('ToastView');
var GameSystem = require('GameSystem');
var LoadingView = require('LoadingView');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GamePlayer = require('GamePlayer');

cc.Class({
    extends: BasePop,

    properties: {
        ClubName: cc.Label,
        ClubInfo: cc.Prefab,
        TableNum: cc.Label,
        CreateRoom: cc.Sprite,
        Bullfight_CreateRoom: cc.Prefab,
        scrollview: cc.ScrollView,
        TableCell: cc.Prefab
    },

    onLoad: function onLoad() {
        this._super();
        this.setClubInfo();
    },

    onMessage: function onMessage(event) {
        cc.log("ClubRoomView.onMessage");
        //this._super(event);
        var msg = event.data;
        var cmd = msg.cmd;
        switch (cmd) {
            case window.US_RESP_CLUB_TABLE_CMD_ID:
                this.onGetClubTableMsg(msg);
                break;

            case window.US_RESP_ENTER_GAME_CMD_ID:
                this.onEnterRoom(msg);
                break;

            case window.CLUB_RESP_OWNER_RM_MEMBER_CMD_ID:
                this.onDelMemberMsg(msg);
                break;
        }
    },

    onDelMemberMsg: function onDelMemberMsg(msg) {
        cc.log("ClubInfoView.onDelMemberMsg");
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            if (msg.param.uid == GamePlayer.getInstance().uid) {
                //如果是我自己
                this.dismiss();
                var message = {
                    popView: "ClubRoomView",
                    btn: "BtnClose"
                };
                GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.SCENE_MSG, data: message });
            }
        }
    },

    onSceneMsg: function onSceneMsg(event) {
        cc.log("ClubRoomView.onSceneMsg");
        var msg = event.data;
        if (msg.popView == "ClubInfoView") {
            if (msg.btn == "BtnClose") {
                this.setClubInfo();
            } else if (msg.btn == "onDismissClubMsg") {
                cc.log("ClubRoomView.onSceneMsg ClubInfoView onDismissClubMsg.");
                this.dismiss();
                var message = {
                    popView: "ClubRoomView",
                    btn: "BtnClose"
                };
                GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.SCENE_MSG, data: message });
            }
        }
    },

    onEnterRoom: function onEnterRoom(msg) {
        cc.log("HallScene.onEnterRoom,tableid = " + msg.name);
        if (msg.code == SocketRetCode.RET_SUCCESS) {}
    },

    onGetClubTableMsg: function onGetClubTableMsg(msg) {
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            if (msg.list == null || msg.list.length == 0) {
                ToastView.show("暂未发现俱乐部房间");
                return;
            }

            this.TableNum.string = "牌局(" + msg.list.length + ")";

            var height = 0;
            for (var index = 0; msg.list != null && index < msg.list.length; index++) {
                var TableCell = cc.instantiate(this.TableCell);
                this.scrollview.content.addChild(TableCell);
                height = TableCell.getContentSize().height;
                TableCell.setPosition(cc.p(0, -TableCell.getContentSize().height / 2 - TableCell.getContentSize().height * index));
                TableCell.getComponent("GamblingHouseCell").updateRoomInfo(msg.list[index]);
            }

            if (TableCell.getContentSize().height * msg.list.length > this.scrollview.content.height) {
                this.scrollview.content.height = height * msg.list.length;
            }
        }
    },

    callBackBtn: function callBackBtn(event, CustomEventData) {
        var BtnName = event.target.getName();
        cc.log("ClubRoomView.callBackBtn,BtnName = " + BtnName);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if (BtnName == "BtnClose") {
            this.dismiss();
            var message = {
                popView: "ClubRoomView",
                btn: "BtnClose"
            };
            GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.SCENE_MSG, data: message });
        } else if (BtnName == "BtnClubInfo") {
            var ClubInfo = cc.instantiate(this.ClubInfo);
            this.node.addChild(ClubInfo);
            ClubInfo.setPosition(cc.p(0, 0));

            ClubInfo.getComponent("ClubInfoView").setClubInfo();
        } else if (BtnName == "CreateRoom") {
            var createRoom = cc.instantiate(this.Bullfight_CreateRoom);
            this.node.addChild(createRoom);
            createRoom.setPosition(cc.p(0, 0));
            createRoom.getComponent("Bullfight_CreateRoom").setClubId(GamePlayer.getInstance().CurClubInfo.clubid, GamePlayer.getInstance().CurClubInfo.level);
        }
    },

    //{"clubid":10000019,"role":1,"owneruid":10688,"level":1,"name":"as",
    // "headurl":"","address":"广西 百色市","intro":"","endtime":1494324197,"status":1,
    // "members":1,"maxmember":10}

    setClubInfo: function setClubInfo() {

        var info = GamePlayer.getInstance().CurClubInfo;

        cc.log("ClubRoomView.setClubInfo Clubid=", info.clubid, " role=", info.role, " name=", info.name);

        this.ClubName.string = info.name;

        if (info.role == window.ClubRole.E_CLUB_NORMAL_ROLE) {
            this.CreateRoom.node.active = false;
        }

        var data = {
            clubid: info.clubid
        };
        MessageFactory.createMessageReq(window.US_REQ_CLUB_TABLE_CMD_ID).send(data);
    }
});

cc._RFpop();
},{"Audio_Common":"Audio_Common","BasePop":"BasePop","GamePlayer":"GamePlayer","GameSystem":"GameSystem","LoadingView":"LoadingView","MessageFactory":"MessageFactory","MusicMgr":"MusicMgr","ToastView":"ToastView"}],"ClubSetView":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'f3857lbvvdN8YdCSMgx0KXf', 'ClubSetView');
// Script\ComScene\PopView\ClubSetView.js

'use strict';

var BasePop = require('BasePop');
var ToastView = require('ToastView');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var MessageFactory = require('MessageFactory');
var GamePlayer = require('GamePlayer');
var GameSystem = require("GameSystem");

cc.Class({
    extends: BasePop,

    properties: {
        Name: cc.EditBox,
        Intro: cc.EditBox
    },

    onLoad: function onLoad() {
        this._super();

        this.setClubInfo();
    },

    setClubInfo: function setClubInfo() {
        cc.log("ClubSetView.setClubInfo");
        this.Name.string = GamePlayer.getInstance().CurClubInfo.name;
        this.Intro.string = GamePlayer.getInstance().CurClubInfo.intro;
        //info.headurl;
    },

    callBackBtn: function callBackBtn(event, CustomEventData) {
        var BtnName = event.target.getName();
        cc.log("ClubSetView.callBackBtn, BtnName = " + BtnName);

        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);

        if (BtnName == "BtnClose") {
            this.dismiss();
            var message = {
                popView: "ClubSetView",
                btn: "BtnClose"
            };
            GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.SCENE_MSG, data: message });
        } else if (BtnName == "BtnSave") {
            var info = GamePlayer.getInstance().CurClubInfo;
            var data = {
                clubid: info.clubid,
                headurl: "",
                name: this.Name.string,
                intro: this.Intro.string
            };

            if (data.name == GamePlayer.getInstance().CurClubInfo.name) {
                data.name = "";
            }
            cc.log("ClubSetView.callBackBtn headurl=", data.headurl, " name=", data.name, " intro=", data.intro);
            MessageFactory.createMessageReq(window.CLUB_REQ_MODIFY_INFO_CMD_ID).send(data);
        }
    },

    onMessage: function onMessage(event) {
        cc.log("ClubSetView.onMessage");
        var msg = event.data;
        var cmd = msg.cmd;
        switch (cmd) {
            case window.CLUB_RESP_MODIFY_INFO_CMD_ID:
                this.onModifyInfoMsg(msg);
                break;
        }
    },

    // ClubId  int    `json:"clubid"`
    // Status  int    `json:"status"`
    // Name    string `json:"name"`
    // HeadUrl string `json:"headurl"`
    // Address string `json:"address"`
    // Intro   string `json:"intro"`
    // Level   int    `json:"level"`
    // EndTime int64  `json:"endtime"`
    onModifyInfoMsg: function onModifyInfoMsg(msg) {
        cc.log("ClubSetView.onModifyInfoMsg code=", msg.code);
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            GamePlayer.getInstance().CurClubInfo.name = this.Name.string;
            GamePlayer.getInstance().CurClubInfo.intro = this.Intro.string;
            ToastView.show("修改成功！！！");
        } else {
            ToastView.show(msg.desc);
        }
    }
});

cc._RFpop();
},{"Audio_Common":"Audio_Common","BasePop":"BasePop","GamePlayer":"GamePlayer","GameSystem":"GameSystem","MessageFactory":"MessageFactory","MusicMgr":"MusicMgr","ToastView":"ToastView"}],"ClubUpgradView":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'be1a0ktS/xHPoe6f/u4Y0LY', 'ClubUpgradView');
// Script\ComScene\PopView\ClubUpgradView.js

'use strict';

var BasePop = require('BasePop');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require('GameSystem');
var GamePlayer = require('GamePlayer');
var MessageFactory = require('MessageFactory');
var ToastView = require('ToastView');
var UtilTool = require('UtilTool');

cc.Class({
    extends: BasePop,

    properties: {
        TipsLabel: cc.Label, //提示
        LevelNum: cc.Label, //等级
        PersonCurCount: cc.Label, //当前等级人数
        PersonTargetCount: cc.Label, //目标等级人数
        TableCurCount: cc.Label, //当前桌子人数
        TableTargetCount: cc.Label, //目标桌子人数
        DiamondCost: cc.Label,
        CurDiamond: cc.Label,
        BtnAdd: cc.Button,
        BtnSub: cc.Button,

        BtnSpriteFrame: [cc.SpriteFrame]
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._super();

        this.showMaxClubInfo();
        this.showCurClubInfo();
        this.showCurDiamond();
        this.showBtnSprite(GamePlayer.getInstance().CurClubInfo.level);
    },

    // {"level":1,"livetime":30,"diamond":0,    "maxpeople":10, "maxtable":2},
    // {"level":2,"livetime":30,"diamond":1000, "maxpeople":50, "maxtable":3},
    // {"level":3,"livetime":30,"diamond":4000, "maxpeople":100,"maxtable":4},
    // {"level":4,"livetime":30,"diamond":10000,"maxpeople":200,"maxtable":9}
    getMaxLevelConf: function getMaxLevelConf() {
        var list = GameSystem.getInstance().ClubUpgradeCost;
        var level = 1;
        var index = 0;
        for (var i = 0; i < list.length; i++) {
            if (level < list[i].level) {
                level = list[i].level;
                index = i;
            }
        }
        return list[index];
    },

    getCurLevelInfo: function getCurLevelInfo(level) {
        var list = GameSystem.getInstance().ClubUpgradeCost;
        for (var i = 0; i < list.length; i++) {
            if (level == list[i].level) {
                return list[i];
            }
        }
        return list[0];
    },

    showMaxClubInfo: function showMaxClubInfo() {
        var info = this.getMaxLevelConf();
        this.TipsLabel.string = "俱乐部上限等级3级，有效期为15天，最高上限为" + info.maxpeople + "人，同时创建" + info.maxtable + "张牌桌";
        this.PersonTargetCount.string = info.maxpeople;
        this.TableTargetCount.string = info.maxtable;
    },

    showCurClubInfo: function showCurClubInfo() {
        var curClub = GamePlayer.getInstance().CurClubInfo;
        var curInfo = this.getCurLevelInfo(curClub.level);
        this.LevelNum.string = curInfo.level;
        this.PersonCurCount.string = curInfo.maxpeople;
        this.TableCurCount.string = curInfo.maxtable;
        this.DiamondCost.string = curInfo.diamond;
    },

    showBtnSprite: function showBtnSprite(level) {
        if (level == 1) {
            this.BtnSub.interactable = false;
        } else {
            this.BtnSub.interactable = true;
            this.BtnSub.node.getComponent(cc.Sprite).spriteFrame = this.BtnSpriteFrame[1];
        }

        if (level == 4) {
            this.BtnAdd.interactable = false;
        } else {
            this.BtnAdd.interactable = true;
            this.BtnAdd.node.getComponent(cc.Sprite).spriteFrame = this.BtnSpriteFrame[1];
        }
    },

    showCurDiamond: function showCurDiamond() {
        this.CurDiamond.string = "拥有钻石: " + GamePlayer.getInstance().diamond;
    },

    onMessage: function onMessage(event) {
        var msg = event.data;
        var cmd = msg.cmd;
        cc.log("ClubUpgradeView.onMessage cmd=", msg.cmd, " window.CLUB_RESP_MODIFY_INFO_CMD_ID=", window.CLUB_RESP_MODIFY_INFO_CMD_ID);
        switch (cmd) {
            case window.CLUB_RESP_MODIFY_INFO_CMD_ID:
                this.onModifyInfoMsg(msg);
                break;

            case window.US_RESP_USER_DETAIL_CMD_ID:
                this.updateUserDiamond(msg);
                break;
        }
    },

    updateUserDiamond: function updateUserDiamond(msg) {
        cc.log("ClubUpgradeView.updateUserDiamond");
        GamePlayer.getInstance().gold = msg.gold;
        GamePlayer.getInstance().diamond = msg.diamond;
        this.showCurDiamond();
    },

    // ClubId  int    `json:"clubid"`
    // Status  int    `json:"status"`
    // Name    string `json:"name"`
    // HeadUrl string `json:"headurl"`
    // Address string `json:"address"`
    // Intro   string `json:"intro"`
    // Level   int    `json:"level"`
    // EndTime int64  `json:"endtime"`
    onModifyInfoMsg: function onModifyInfoMsg(msg) {
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            cc.log("ClubUpgradeView.onModifyInfoMsg code=", msg.code, " endtime=", msg.param.endtime);
            GamePlayer.getInstance().CurClubInfo.level = Number(msg.param.level);
            GamePlayer.getInstance().CurClubInfo.endtime = msg.param.endtime;
            var info = this.getCurLevelInfo(msg.param.level);
            cc.log("ClubUpgradeView.onModifyInfoMsg  info=", info);

            GamePlayer.getInstance().CurClubInfo.maxmember = info.maxpeople;

            ToastView.show("升级成功: " + UtilTool.getFormatDataDetail(GamePlayer.getInstance().CurClubInfo.endtime) + "到期", 2);
            this.getUserDetail();
        } else {
            ToastView.show(msg.desc);
        }
    },

    callBackBtn: function callBackBtn(event, CustomEventData) {
        var BtnName = event.target.getName();
        cc.log("ClubUpgradeView.callBackBtn,BtnName = " + BtnName);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if (BtnName == "BtnClose") {
            this.dismiss();
            var message = {
                popView: "ClubUpdradeView",
                btn: "BtnClose"
            };
            GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.SCENE_MSG, data: message });
        } else if (BtnName == "BtnUpgrade") {
            var level = Number(this.LevelNum.string);
            cc.log("callBackBtn BtnUpgrade level=", level);

            var info = this.getCurLevelInfo(level);
            if (info.diamond > GamePlayer.getInstance().diamond) {
                ToastView.show("您钻石不足,请去商城购买");
                return;
            }

            cc.log("ClubSetView.callBackBtn endtime=", GamePlayer.getInstance().CurClubInfo.endtime);

            var info = GamePlayer.getInstance().CurClubInfo;
            var data = {
                clubid: info.clubid,
                headurl: "",
                intro: "",
                address: "",
                level: level
            };
            MessageFactory.createMessageReq(window.CLUB_REQ_MODIFY_INFO_CMD_ID).send(data);
        } else if (BtnName == "BtnSub") {

            var level = Number(this.LevelNum.string);
            cc.log("callBackBtn BtnSub level=", level);

            if (level == 1) {
                return;
            }

            level = level - 1;

            var info = this.getCurLevelInfo(level);
            this.LevelNum.string = level;
            this.PersonTargetCount.string = info.maxpeople;
            this.TableTargetCount.string = info.maxtable;
            this.DiamondCost.string = info.diamond;
            this.showBtnSprite(level);
        } else if (BtnName == "BtnAdd") {

            var level = Number(this.LevelNum.string);
            cc.log("callBackBtn BtnAdd level=", level);

            if (level == 4) {
                return;
            }

            level = level + 1;

            var info = this.getCurLevelInfo(level);
            this.LevelNum.string = level;
            this.PersonTargetCount.string = info.maxpeople;
            this.TableTargetCount.string = info.maxtable;
            this.DiamondCost.string = info.diamond;
            this.showBtnSprite(level);
        }
    }
});

cc._RFpop();
},{"Audio_Common":"Audio_Common","BasePop":"BasePop","GamePlayer":"GamePlayer","GameSystem":"GameSystem","MessageFactory":"MessageFactory","MusicMgr":"MusicMgr","ToastView":"ToastView","UtilTool":"UtilTool"}],"ClubUpgradeCostReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '84a12FHM2pETJp6WOI1jct2', 'ClubUpgradeCostReqPacket');
// Script\Network\Cmd\Cmd_Req\ClubUpgradeCostReqPacket.js

'use strict';

/**
 * Created by zhouxueshi on 2017/5/6.
 */

var MessageReq = require("MessageReq");
var GamePlayer = require('GamePlayer');
var GameSystem = require('GameSystem');

function ClubUpgradeCostReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_CLUB_UPGRADE_COST_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("ClubUpgradeCostReqPacket.send");

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = ClubUpgradeCostReqPacket;

cc._RFpop();
},{"GamePlayer":"GamePlayer","GameSystem":"GameSystem","MessageReq":"MessageReq"}],"ClubUpgradeCostRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd3cf40owQZJWa2xZMFJ+cLa', 'ClubUpgradeCostRespPacket');
// Script\Network\Cmd\Cmd_Resp\ClubUpgradeCostRespPacket.js

"use strict";

/**
 * Created by zhouxueshi on 2017/5/6.
 */
var MessageResp = require("MessageResp");

// type US_RESP_CLUB_UPGRADE_COST_T struct {
//     JsonHead
//     RespHead
//     List []CLUB_COST_T `json:"list"`
// }
//
// type CLUB_COST_T struct {
//     Level     int `json:"level"`
//     LiveTime  int `json:"livetime"`
//     Diamond   int `json:"diamond"`
//     MaxPeople int `json:"maxpeople"`
//     MaxTable  int `json:"maxtable"`
// }

function ClubUpgradeCostRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_CLUB_UPGRADE_COST_CMD_ID;

    this.onMessage = function (msg) {
        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        this.list = msg.list;
    };
}

module.exports = ClubUpgradeCostRespPacket;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"ClubView":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'fa758RC/tpMH5/A9qkBWv20', 'ClubView');
// Script\ComScene\PopView\ClubView.js

'use strict';

var BasePop = require('BasePop');
var ToastView = require('ToastView');
var MessageFactory = require('MessageFactory');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GamePlayer = require('GamePlayer');
var GameSystem = require("GameSystem");

cc.Class({
    extends: BasePop,

    properties: {
        ClubAddView: cc.Prefab,
        ClubCreateView: cc.Prefab,
        initNode: cc.Node,
        scrollView: cc.ScrollView,
        ClubCell: cc.Prefab,
        ClubJoinView: cc.Prefab,
        ClubFindPopView: cc.Prefab,
        ClubRoomView: cc.Prefab
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._super();
        GamePlayer.getInstance().SelfClubId = 0;
        GamePlayer.getInstance().CurClubInfo = null;
        GamePlayer.getInstance().CurClubMemList = null;
        this.sendGetClubList();
    },

    sendGetClubList: function sendGetClubList() {
        MessageFactory.createMessageReq(window.US_REQ_CLUB_LIST_CMD_ID).send();
    },

    callBackBtn: function callBackBtn(event, CustomEventData) {
        var BtnName = event.target.getName();
        cc.log("ClubView.callBackBtn,BtnName = " + BtnName);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if (BtnName == "BtnClose") {
            this.dismiss();
        } else if (BtnName == "BtnAdd") {
            this.createAddView();
        } else if (BtnName == "BtnNewClub") {
            this.createClubCreateView();
        } else if (BtnName == "BtnAddClub") {
            this.createSearchPop();
        }
    },

    createSearchPop: function createSearchPop() {
        var ClubFindPopView = cc.instantiate(this.ClubFindPopView);
        this.node.addChild(ClubFindPopView);
        ClubFindPopView.setPosition(cc.p(0, 0));
    },

    createAddView: function createAddView() {

        var ClubAddView = cc.instantiate(this.ClubAddView);
        this.node.addChild(ClubAddView);
        var winSize = cc.director.getWinSize();
        ClubAddView.setPosition(cc.p(0, 0));
    },

    createClubCreateView: function createClubCreateView() {
        var ClubCreateView = cc.instantiate(this.ClubCreateView);
        this.node.addChild(ClubCreateView);
        var winSize = cc.director.getWinSize();
        ClubCreateView.setPosition(cc.p(0, 0));
    },

    onMessage: function onMessage(event) {
        cc.log("ClubView.onMessage");
        //this._super(event);
        var msg = event.data;
        var cmd = msg.cmd;
        switch (cmd) {
            case US_RESP_CREATE_CLUB_CMD_ID:
                this.onCreateClubMsg(msg);
                break;

            case US_RESP_CLUB_LIST_CMD_ID:
                this.onClubListMsg(msg);
                break;

            case US_RESP_SEARCH_CLUB_CMD_ID:
                this.onSearchClubMsg(msg);
                break;

            // case CLUB_REQ_JOIN_CLUB_CMD_ID:
            //     this.onJoinClubMsg(msg);
            //     break;

            case window.US_RESP_FIND_TABLE_CMD_ID:
                this.onFindRoom(msg);
                break;

            case window.CLUB_RESP_DISMISS_CLUB_CMD_ID:
                this.onDismissClubMsg(msg);
                break;

        }
    },

    onFindRoom: function onFindRoom(msg) {
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            this.dismiss();
        }
    },

    onDismissClubMsg: function onDismissClubMsg(msg) {
        cc.log("ClubInfoView.onDismissClubMsg msg=", msg);
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            if (msg.param.role == window.ClubRole.E_CLUB_OWNER_ROLE) {
                ToastView.show("群主" + msg.param.name + "解散了" + msg.param.clubname) + "俱乐部";
                this.sendGetClubList();
            } else if (msg.param.uid == GamePlayer.getInstance().uid) {
                //如果是我自己
                ToastView.show("您退出俱乐部" + msg.param.clubname + "成功");
                this.sendGetClubList();
            }
        }
    },

    onSearchClubMsg: function onSearchClubMsg(msg) {
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            cc.log("ClubView.onSearchClubMsg");
            this.setInitNodeVisible(false);

            var iCount = this.scrollView.content.getChildrenCount() - (this.initNode == null ? 0 : 1);
            var ClubCell = cc.instantiate(this.ClubCell);
            this.scrollView.content.addChild(ClubCell);
            ClubCell.setPosition(cc.p(0, 0 - ClubCell.getContentSize().height * (iCount + 0.5)));

            var self = this;
            ClubCell.on(cc.Node.EventType.TOUCH_END, function (event) {
                cc.log("ClubView.onSearchClubMsg TOUCH_END.");

                GamePlayer.getInstance().CurClubInfo = event.target.getComponent("ClubCell").info;

                self.createClubOtherView(event.target.getComponent("ClubCell").info);
            }.bind(this));

            ClubCell.getComponent("ClubCell").setClubCellInfo(msg.param);
        }
    },

    setInitNodeVisible: function setInitNodeVisible(bVisible) {
        if (this.initNode) {
            this.initNode.active = bVisible;
            cc.log("ClubView initNode=", bVisible);
        }
    },

    onCreateClubMsg: function onCreateClubMsg(msg) {
        cc.log("ClubView.onCreateClubMsg");
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            ToastView.show("俱乐部创建成功");
            this.sendGetClubList();
        }
    },

    createClubRoomView: function createClubRoomView() {
        cc.log("ClubView.createClubRoomView");
        var ClubRoomView = cc.instantiate(this.ClubRoomView);
        this.node.addChild(ClubRoomView);
        ClubRoomView.setPosition(cc.p(0, 0));
    },

    createClubOtherView: function createClubOtherView() {
        cc.log("ClubView.createClubOtherView");
        var ClubOtherView = cc.instantiate(this.ClubJoinView);
        this.node.addChild(ClubOtherView);
        ClubOtherView.setPosition(cc.p(0, 0));
    },

    onClubListMsg: function onClubListMsg(msg) {
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            cc.log("ClubView.onClubListMsg length=", msg.list.length);
            if (msg.list.length == 0) {
                return;
            }

            this.setInitNodeVisible(false);
            this.scrollView.content.removeAllChildren(true);
            var height = 0;
            for (var index = 0; msg.list != null && index < msg.list.length; index++) {
                var ClubCell = cc.instantiate(this.ClubCell);
                this.scrollView.content.addChild(ClubCell);
                ClubCell.setPosition(cc.p(0, 0 - ClubCell.getContentSize().height * (index + 0.5)));
                var self = this;

                ClubCell.on(cc.Node.EventType.TOUCH_END, function (event) {
                    GamePlayer.getInstance().CurClubInfo = event.target.getComponent("ClubCell").info;

                    self.createClubRoomView();
                }.bind(this));
                height = ClubCell.getContentSize().height;
                ClubCell.getComponent("ClubCell").setClubCellInfo(msg.list[index]);
            }
            if (height * msg.list.length > this.scrollView.content.height) {
                this.scrollView.content.height = height * msg.list.length;
            }
        }
    },

    onSceneMsg: function onSceneMsg(event) {
        var msg = event.data;
        if (msg.popView == "ClubAddView") {
            if (msg.btn == "NewClub") {
                this.createClubCreateView();
            } else if (msg.btn == "AddClub") {
                this.createSearchPop();
            }
        } else if (msg.popView == "ClubRoomView") {
            if (msg.btn == "BtnClose") {
                cc.log("ClubView.onSceneMsg ClubRoomView BtnClose.");
                GamePlayer.getInstance().SelfClubId = 0;
                GamePlayer.getInstance().CurClubInfo = null;
                GamePlayer.getInstance().CurClubMemList = null;
                this.scrollView.content.removeAllChildren(true);
                this.scrollView.content.addChild(this.initNode);
                this.setInitNodeVisible(true);
                this.sendGetClubList();
            }
        } else if (msg.popView == "ClubJoinView") {
            if (msg.btn == "RespJoin") {
                cc.log("ClubView.onSceneMsg ClubJoinView RespJoin");
                GamePlayer.getInstance().SelfClubId = 0;
                GamePlayer.getInstance().CurClubInfo = null;
                GamePlayer.getInstance().CurClubMemList = null;
                this.scrollView.content.removeAllChildren(true);
                this.scrollView.content.addChild(this.initNode);
                this.setInitNodeVisible(true);
                this.sendGetClubList();
            }
        }
    }
});

cc._RFpop();
},{"Audio_Common":"Audio_Common","BasePop":"BasePop","GamePlayer":"GamePlayer","GameSystem":"GameSystem","MessageFactory":"MessageFactory","MusicMgr":"MusicMgr","ToastView":"ToastView"}],"Cmd_Bullfight":[function(require,module,exports){
"use strict";
cc._RFpush(module, '64b8bSQ5q5EKb/NUEkr4lpo', 'Cmd_Bullfight');
// Script\GameScene\Bullfight\Cmd\MessageFactory\Cmd_Bullfight.js

'use strict';

/**
 * Created by shrimp on 17/3/1.
 */
var Cmd_Common = require('Cmd_Common');

module.exports = {

    SBF_REQ_READY_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0x1, //准备
    SBF_RESP_READY_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0x2,
    SBF_NOTIFY_GAME_START_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0x4, //通知玩家,游戏开始,发三张牌

    SBF_REQ_CALL_BANKER_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0x5, //抢庄 (不抢，普通，超级)
    SBF_RESP_CALL_BANKER_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0x6, //返回

    SBF_NOTIFY_CONFIRM_BANKER_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0x8, //通知玩家,确定庄家

    SBF_REQ_BET_COIN_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0x9, //下注（不点下注，默认最小）
    SBF_RESP_BET_COIN_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0xa,

    SBF_NOTIFY_OPEN_CARD_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0xc, //通知看牌

    SBF_REQ_OPEN_CARD_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0xd, //开牌
    SBF_RESP_OPEN_CARD_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0xe, //

    SBF_NOTIFY_ONE_GAME_RESULT_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0x10, //通知一局结束结果

    SBF_NOTIFY_NOT_CALL_BANKER_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0x16, //通知未选择抢庄的玩家为不抢
    SBF_NOTIFY_NOT_BET_COIN_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0x18, //未下注的玩家

    SBF_NOTIFY_TOTAL_GAME_RESULT_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0x12, //通知总结果

    //请求桌子详情
    US_REQ_TABLE_DETAIL_CMD_ID: window.ServerType.E_COMMON_GAME_TYPE << 16 | 0x15,
    US_RESP_TABLE_DETAIL_CMD_ID: window.ServerType.E_COMMON_GAME_TYPE << 16 | 0x16,
    //帮助,提示是否有牛
    SBF_REQ_HELP_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0x5,
    SBF_RESP_HELP_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0x6,

    US_REQ_PLAYER_LIST_CMD_ID: window.ServerType.E_COMMON_GAME_TYPE << 16 | 0x17, //获取玩家列表
    US_RESP_PLAYER_LIST_CMD_ID: window.ServerType.E_COMMON_GAME_TYPE << 16 | 0x18, //获取玩家列表


    //托管
    SBF_REQ_AI_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0x7,
    SBF_RESP_AI_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0x8,
    //通知踢人（群主主动踢，身上没钱踢）
    SBF_NOTIFY_KICKOUT_CMD_ID: window.ServerType.E_SIX_BULLFIGHT_TYPE << 16 | 0x14 //通知踢人

};

cc._RFpop();
},{"Cmd_Common":"Cmd_Common"}],"Cmd_Common":[function(require,module,exports){
"use strict";
cc._RFpush(module, '87944iIOzdOjYJOINFnK4Oh', 'Cmd_Common');
// Script\Network\Cmd\MessageFactory\Cmd_Common.js

"use strict";

/**
 * Created by shrimp on 17/2/19.
 */

window.ServerType = cc.Enum({
    //E_USER_SERVER_TYPE          : 1,
    //E_CENTER_SERVER_TYPE        : 3,
    //E_COMMON_GAME_TYPE          :100,
    //E_SIX_BULLFIGHT_TYPE        : 101,       //六人模式
    //E_BULLFIGHT_HUNDRED_TYPE    : 102,       //百人
    E_UNKNOWN_SERVER_TYPE: 0,
    E_USER_SERVER_TYPE: 1, //接入服务器
    E_DB_SERVER_TYPE: 2, //数据服务器
    E_CENTER_SERVER_TYPE: 3, //中心服务器,要保存数据一致性,如私人房ID,
    E_STATUS_SERVER_TYPE: 4, //状态服务器
    E_CLUB_SERVER_TYPE: 5, //俱乐部服务器

    E_COMMON_GAME_TYPE: 100, //游戏服类型
    E_SIX_BULLFIGHT_TYPE: 101, //六人模式
    E_BULLFIGHT_HUNDRED_TYPE: 102 });

//心跳
window.US_REQ_HEARTBEAT_CMD_ID = ServerType.E_USER_SERVER_TYPE << 16 | 0x1; //*
window.US_RESP_HEARTBEAT_CMD_ID = ServerType.E_USER_SERVER_TYPE << 16 | 0x2; //*
//用户登录认证
window.US_REQ_LOGIN_CMD_ID = ServerType.E_USER_SERVER_TYPE << 16 | 0x3; //*
window.US_RESP_LOGIN_CMD_ID = ServerType.E_USER_SERVER_TYPE << 16 | 0x4; //*
//服务器主动踢人
window.US_KICK_OUT_CMD_ID = ServerType.E_USER_SERVER_TYPE << 16 | 0x6;
//通知玩家之前在某个游戏中
window.US_NOTIFY_IN_GAME_CMD_ID = ServerType.E_USER_SERVER_TYPE << 16 | 0x8;

//通知桌主结束提示
window.US_NOTFIY_OWNER_TABLEINFO_CMD_ID = ServerType.E_CENTER_SERVER_TYPE << 16 | 0x2;
//通知桌主确认玩家是否入座
window.US_NOTIFY_OWNER_CONFIRM_SIT_CMD_ID = ServerType.E_CENTER_SERVER_TYPE << 16 | 0x4;
//创建私人桌
window.US_REQ_CREATE_TABLE_CMD_ID = ServerType.E_CENTER_SERVER_TYPE << 16 | 0x7; //*
window.US_RESP_CREATE_TABLE_CMD_ID = ServerType.E_CENTER_SERVER_TYPE << 16 | 0x8; //返回结果//*
//查找私人房
window.US_REQ_FIND_TABLE_CMD_ID = ServerType.E_CENTER_SERVER_TYPE << 16 | 0x9;
window.US_RESP_FIND_TABLE_CMD_ID = ServerType.E_CENTER_SERVER_TYPE << 16 | 0xa;

//进入游戏
window.US_REQ_ENTER_GAME_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x1;
window.US_RESP_ENTER_GAME_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x2;
//离开游戏
window.US_REQ_LEAVE_GAME_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x3;
window.US_RESP_LEAVE_GAME_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x4;

//请求坐下or站起
window.US_REQ_SIT_DOWN_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x5;
window.US_RESP_SIT_DOWN_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x6;

window.US_REQ_CARRY_COIN_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x7; //带入金币
window.US_RESP_CARRY_COIN_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x8; //

//桌主确认
window.US_REQ_OWNER_CONFIRM_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x9;
window.US_RESP_OWNER_CONFIRM_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0xa;

//群主主动踢人
window.US_REQ_OWNER_KICKOUT_PLAYERCMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0xb;
window.US_RESP_OWNER_KICKOUT_PLAYERCMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0xc;

window.US_NOTIFY_OWNER_KICKOUT_PLAYER_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0xe;

//开始牌局/解散
window.US_REQ_GAME_SWITCH_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0xf;
window.US_RESP_GAME_SWITCH_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x10;

window.US_NOTIFY_GAME_SWITCH_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x12;

//聊天
window.US_REQ_GAME_CHAT_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x13;
window.US_RESP_GAME_CHAT_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x14;

window.US_REQ_FOUND_TABLE_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x85; //发现
window.US_RESP_FOUND_TABLE_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x86;

window.US_REQ_SCORE_LIST_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x8b; //请求战绩列表
// 返回战绩列表
window.US_RESP_SCORE_LIST_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x8c; //

window.US_REQ_SCORE_DETAIL_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x8d; //获取战绩详情
window.US_RESP_SCORE_DETAIL_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x8e; //

window.US_REQ_SHOP_CONF_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x89; //获取商场配置
window.US_RESP_SHOP_CONF_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x8a;

window.US_REQ_CREATE_CLUB_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x81; //创建俱乐部
window.US_RESP_CREATE_CLUB_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x82; //

window.US_REQ_CLUB_LIST_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x83; //获取俱乐部列表
window.US_RESP_CLUB_LIST_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x84; //

window.US_REQ_CLUB_TABLE_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x87; //获取俱乐部桌子列表
window.US_RESP_CLUB_TABLE_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x88;

window.US_REQ_SEARCH_CLUB_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x99; //搜索俱乐部
window.US_RESP_SEARCH_CLUB_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x9A;

window.US_REQ_CLUB_UPGRADE_COST_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x9F; //获取俱乐部升级开销
window.US_RESP_CLUB_UPGRADE_COST_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0xA0;

window.CLUB_REQ_MODIFY_INFO_CMD_ID = ServerType.E_CLUB_SERVER_TYPE << 16 | 0x1; //修改俱乐部
window.CLUB_RESP_MODIFY_INFO_CMD_ID = ServerType.E_CLUB_SERVER_TYPE << 16 | 0x2;

window.CLUB_REQ_GET_MEMBER_LIST_CMD_ID = ServerType.E_CLUB_SERVER_TYPE << 16 | 0x3; //请求俱乐部成员列表
window.CLUB_RESP_GET_MEMBER_LIST_CMD_ID = ServerType.E_CLUB_SERVER_TYPE << 16 | 0x4;

window.CLUB_REQ_JOIN_CLUB_CMD_ID = ServerType.E_CLUB_SERVER_TYPE << 16 | 0x5; //请求加入俱乐部
window.CLUB_RESP_JOIN_CLUB_CMD_ID = ServerType.E_CLUB_SERVER_TYPE << 16 | 0x6;

window.CLUB_NOTIFY_OWNER_CONFIRM_CMD_ID = ServerType.E_CLUB_SERVER_TYPE << 16 | 0x7; //通知群主确认是否允许加入

window.CLUB_REQ_OWNER_CONFIRM_CMD_ID = ServerType.E_CLUB_SERVER_TYPE << 16 | 0x9; //群主确认
window.CLUB_RESP_OWNER_CONFIRM_CMD_ID = ServerType.E_CLUB_SERVER_TYPE << 16 | 0xa;

window.CLUB_REQ_OWNER_RM_MEMBER_CMD_ID = ServerType.E_CLUB_SERVER_TYPE << 16 | 0xb; //删除成员
window.CLUB_RESP_OWNER_RM_MEMBER_CMD_ID = ServerType.E_CLUB_SERVER_TYPE << 16 | 0xc; //

window.CLUB_REQ_OWNER_MODIFY_ROLE_CMD_ID = ServerType.E_CLUB_SERVER_TYPE << 16 | 0xd; //修改玩家权限
window.CLUB_RESP_OWNER_MODIFY_ROLE_CMD_ID = ServerType.E_CLUB_SERVER_TYPE << 16 | 0xe; //

window.US_REQ_NEW_MSG_NUM_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x91; //获取新消息数量
window.US_RESP_NEW_MSG_NUM_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x92;

window.US_REQ_MSG_LIST_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x93; //获取消息列表
window.US_RESP_MSG_LIST_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x94; //不同的消息类型返回的结果不一样

window.US_REQ_SET_MSG_READ_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x95; //设置消息已读
window.US_RESP_SET_MSG_READ_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x96;

window.US_REQ_USER_DETAIL_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x9B; //获取用户详情
window.US_RESP_USER_DETAIL_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x9C; //

window.US_REQ_CREATE_COST_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x9D; //获取创建桌子开销
window.US_RESP_CREATE_COST_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x9E; //

window.CLUB_REQ_DISMISS_CLUB_CMD_ID = ServerType.E_CLUB_SERVER_TYPE << 16 | 0xf; //解散俱乐部
window.CLUB_RESP_DISMISS_CLUB_CMD_ID = ServerType.E_CLUB_SERVER_TYPE << 16 | 0x10;

window.CLUB_REQ_CREATE_TABLE_CMD_ID = ServerType.E_CLUB_SERVER_TYPE << 16 | 0x11; //创建私人桌
window.CLUB_RESP_CREATE_TABLE_CMD_ID = ServerType.E_CLUB_SERVER_TYPE << 16 | 0x12; //如果创建成功，回广播给所有在线的俱乐部玩家

window.US_NOTIFY_PAY_OPERATE_CMD_ID = ServerType.E_CENTER_SERVER_TYPE << 16 | 0xc; //通知玩家支付结果

//金币兑换
window.US_REQ_EXCHANGE_GOLD_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x8f; //金币兑换协议(给客户端使用)
window.US_RESP_EXCHANGE_GOLD_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x90;

// 解散牌局
// window.US_REQ_DISMISS_GAME_CMD_ID      = ServerType.E_COMMON_GAME_TYPE<<16 | 0x15;
// window.US_RESP_DISMISS_GAME_CMD_ID     = ServerType.E_COMMON_GAME_TYPE<<16 | 0x16;

//解散
window.US_REQ_DISMISS_TABLE_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x21; //请求解散牌桌
window.US_RSP_DISMISS_TABLE_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x22; //
window.US_NOTIFY_DISMISS_TABLE_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x23; //通知

window.US_REQ_CONFIRM_DISMISS_TABLE_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x24; //处理解散请求
window.US_RSP_CONFIRM_DISMISS_TABLE_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x25; //
window.US_NOTIFY_CONFIRM_DISMISS_TABLE_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x26; //通知

// 通知解散牌局
window.US_NOTIFY_DISMISS_GAME_CMD_ID = ServerType.E_USER_SERVER_TYPE << 16 | 0x12;

window.US_REQ_OWNER_CONFIRM_SWITCH_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x15; //是否开启入座
window.US_RESP_OWNER_CONFIRM_SWITCH_CMD_ID = ServerType.E_COMMON_GAME_TYPE << 16 | 0x16;

// //通知桌主
// window.US_NOTIFY_OWNER_CONFIRM_SIT_CMD_ID   = ServerType.E_USER_SERVER_TYPE<<16 | 0xe;
//通知解散牌局
window.US_NOTIFY_DISMISS_GAME_CMD_ID = ServerType.E_USER_SERVER_TYPE << 16 | 0x17;

// 请求广告
window.US_REQ_BANNER_LIST_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x97;
// 广告返回列表
window.US_RESP_BANNER_LIST_CMD_ID = ServerType.E_DB_SERVER_TYPE << 16 | 0x98;

// 绑定推广人
window.US_REQ_BIND_REFERRAL_CMD_ID = ServerType.E_CENTER_SERVER_TYPE << 16 | 0xD; //绑定推荐入

window.US_RESP_BIND_REFERRAL_CMD_ID = ServerType.E_CENTER_SERVER_TYPE << 16 | 0xE;

cc._RFpop();
},{}],"CreateClubReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '1e502MCn9VDPoAA10Kq+lSA', 'CreateClubReqPacket');
// Script\Network\Cmd\Cmd_Req\CreateClubReqPacket.js

"use strict";

/**
 * Created by shrimp on 17/3/31.
 */

var MessageReq = require("MessageReq");
var GameSystem = require('GameSystem');
/*
* type US_REQ_CREATE_CLUB_T struct {
 JsonHead
 Param PARAM_REQ_CREATE_CLUB_T `json:"param"`
 }
 type PARAM_REQ_CREATE_CLUB_T struct {
 Name    string `json:"name"`
 HeadUrl string `json:"headurl"`
 Address string `json:"address"`
 Level   int    `json:"level"`
 Intro   string `json:"intro"`
 }
* */

function CreateClubReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_CREATE_CLUB_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("CarryCoinReqPacket.send");
        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            param: msg
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = CreateClubReqPacket;

cc._RFpop();
},{"GameSystem":"GameSystem","MessageReq":"MessageReq"}],"CreateClubRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '80697Sni+RHgouITUDxT4ki', 'CreateClubRespPacket');
// Script\Network\Cmd\Cmd_Resp\CreateClubRespPacket.js

"use strict";

/**
 * Created by shrimp on 17/3/31.
 */
/*
* type US_RESP_CREATE_CLUB_T struct {
 JsonHead
 RespHead
 Param PARAM_RESP_CREATE_CLUB_T `json:"param"`
 }
 type PARAM_RESP_CREATE_CLUB_T struct {
 ClubId   int    `json:"clubid"`
 OwnerUid uint32 `json:"owneruid"`
 EndTime  int64  `json:"endtime"`
 }*/
var MessageResp = require("MessageResp");

function CreateClubRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_CREATE_CLUB_CMD_ID;
    //接收的数据
    this.onMessage = function (msg) {
        cc.log("CreateClubRespPacket.onMesssage");
        //{"cmd":6553608,"seq":0,"uid":10006,"code":0,"desc":"执行成功","carryuid":10006,"carrycoin":100}
        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.param = msg.param;
        this.clubid = msg.param.clubid;
        this.owneruid = msg.param.owneruid;
        this.endtime = msg.param.endtime;
    };
}

module.exports = CreateClubRespPacket;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"CreateRoomReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'a2a0354PgNPLqf6ENbW45Mr', 'CreateRoomReqPacket');
// Script\Network\Cmd\Cmd_Req\CreateRoomReqPacket.js

'use strict';

/**
 * Created by shrimp on 17/2/23.
 */
var MessageReq = require("MessageReq");
var GamePlayer = require('GamePlayer');
var GameSystem = require('GameSystem');
/*
* type US_REQ_CREATE_TABLE_T struct {
 JsonHead
 ClubId        int    `json:"clubid"`                     //俱乐部id, 如果玩家创建，=0
 ClubLevel int    `json:"clublevel"`             //俱乐部level, 如果玩家创建，=0
 GameId      uint16 `json:"gameid"`             //服务器id (六人桌抢庄=101)
 GameLevel uint16 `json:"gamelevel"`     //游戏等级,暂时无
 Param          string `json:"param"`		      //base64之后的参数
 }
 //六人牛牛私人桌参数
 type SBF_PRIVATE_TABLE_PARAM_T struct {
 PayMode   int     `json:"paymode"`  //付费模式 (默认钻石)
 GameType  int32   `json:"gametype"` //闭牌抢庄,三张抢庄(二选一)
 MinAnte   int     `json:"mixante"`  //最小下注
 LiveTime  int64   `json:"livetime"` //桌子使用时间(秒)
 Seats     int8    `json:"seats"`    //座位数
 TableName string  `json:"name"`     //桌子名称
 BullMul   []int32 `json:"bullmul"`  //从无牛开始，传一个数组
 }
* */

function CreateRoomReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_CREATE_TABLE_CMD_ID;

    //准备发送的数据
    this.send = function (msg, type) {
        cc.log("CreateRoomReqPacket.send");
        cc.log(type);

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            clubid: type.clubid,
            clublevel: type.clublevel,
            gameid: type.gameid,
            gamelevel: type.gamelevel,
            param: BASE64.encoder(JSON.stringify(msg))
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = CreateRoomReqPacket;

cc._RFpop();
},{"GamePlayer":"GamePlayer","GameSystem":"GameSystem","MessageReq":"MessageReq"}],"CreateRoomRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '8f748x1krVM66+F8dQOIUmA', 'CreateRoomRespPacket');
// Script\Network\Cmd\Cmd_Resp\CreateRoomRespPacket.js

"use strict";

/**
 * Created by shrimp on 17/2/23.
 */

var MessageResp = require("MessageResp");
/*
*
* type US_RESP_CREATE_TABLE_T struct {
 JsonHead
 RespHead
 ClubId     int    `json:"clubid"`           //如果是普通玩家，=0
 ClubLevel  int    `json:"clublevel"`  //俱乐部等级
 PrivateIds []int  `json:"privateids"` //如果ret_success, privateIds[0]是新生成的6位数值，
 //如果RET_FULL_PRIVATE_TABLE = -48 代表您创建的私人桌已经达到上线,
 //	privateids是所以创建过的6位数, 界面提示玩家已经创建了哪些私人桌
 GameId     uint16 `json:"gameid"`
 GameLevel  uint16 `json:"gamelevel"`
 GameSvcId  uint32 `json:"gamesvcid"` //游戏服务器ID
 TableId    int32  `json:"tableid"`   //游戏中某张桌子ID
 }*/
function CreateRoomRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_CREATE_TABLE_CMD_ID;
    this.privateid = 0; //六位数的桌子ID(房间)
    this.gamesvcid = 0; //游戏服务器ID
    this.tableid = 0; //游戏中某张桌子ID
    this.gamelevel = 1;
    this.gameid = 0;
    //接收的数据
    this.onMessage = function (msg) {
        //{"cmd":196616,"seq":4,"uid":11407,"code":0,"desc":"执行成功",
        // "clubid":0,"clublevel":0,"privateids":[917473],"gameid":101,
        // "gamelevel":2,"gamesvcid":7,"tableid":917473}
        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.gameid = msg.gameid;
        this.clubid = msg.clubid;
        this.clublevel = msg.clublevel;
        this.privateid = msg.privateids;
        this.gamesvcid = msg.gamesvcid;
        this.tableid = msg.tableid;
        this.gamelevel = msg.gamelevel;
        this.gameid = msg.gameid;
        //GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = CreateRoomRespPacket;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"CreateTableCostReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '1da505Vlx5BzJ5Dkukfu2PY', 'CreateTableCostReqPacket');
// Script\Network\Cmd\Cmd_Req\CreateTableCostReqPacket.js

"use strict";

var MessageReq = require("MessageReq");

function CreateTableCostReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_CREATE_COST_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("CreateTableCostReqPacket.send");
        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid
        };
        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = CreateTableCostReqPacket;

cc._RFpop();
},{"MessageReq":"MessageReq"}],"CreateTableCostRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c1a62dQYjBL3LhoAnESSeeF', 'CreateTableCostRespPacket');
// Script\Network\Cmd\Cmd_Resp\CreateTableCostRespPacket.js

"use strict";

/*

 type US_RESP_CREATE_COST_T struct {
     JsonHead
     RespHead
     List []PRIVATE_TABLE_COST_T `json:"list"`
 }

 type PRIVATE_TABLE_COST_T struct {
     Type    int `json:"type"`    //1: live time 2: min ante
     Value   int `json:"value"`   //second or ante
     Diamond int `json:"diamond"` //消耗钻石
     Gold    int `json:"gold"`    //消耗金币
 }

*/

var MessageResp = require("MessageResp");

function CreateTableCostRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_CREATE_COST_CMD_ID;
    this.list = [];

    //接收的数据
    this.onMessage = function (msg) {
        cc.log("CreateTableCostRespPacket.onMessage");
        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;

        this.list = msg.list;
    };
}

module.exports = CreateTableCostRespPacket;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"CusWebView":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'b4660wMOK5LALQPkUWiuyqc', 'CusWebView');
// Script\ComScene\PopView\CusWebView.js

"use strict";

var BasePop = require('BasePop');
cc.Class({
    extends: BasePop,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        WebView: cc.WebView
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._super();
        this.LeftInTo(this.node);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    calllbackBtn: function calllbackBtn(event, CustonEventData) {
        var BtnName = event.target.getName();
        if (BtnName == "BtnClose") {
            this.dismiss();
        }
    },

    setWebViewUrl: function setWebViewUrl(url) {
        this.WebView.url = url;
    }
});

cc._RFpop();
},{"BasePop":"BasePop"}],"DismissClubReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'a40d8vf6d9OAoes1p6MxNCH', 'DismissClubReqPacket');
// Script\Network\Cmd\Cmd_Req\DismissClubReqPacket.js

"use strict";

/**
 * Created by shrimp on 17/4/15.
 */
var MessageReq = require("MessageReq");

function DismissClubReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.CLUB_REQ_DISMISS_CLUB_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("DismissGameReqPacket.send");
        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            clubid: msg.clubid
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = DismissClubReqPacket;

cc._RFpop();
},{"MessageReq":"MessageReq"}],"DismissClubRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '7617bSTYVJHZKqXhs9wntxD', 'DismissClubRespPacket');
// Script\Network\Cmd\Cmd_Resp\DismissClubRespPacket.js

"use strict";

/**
 * Created by shrimp on 17/4/15.
 */
var MessageResp = require("MessageResp");

// ClubId   int    `json:"clubid"`
// ClubName string `json:"clubname"`
// Role     uint8  `json:"role"`
// Uid      uint32 `json:"uid"`
// Name     string `json:"name"`

function DismissClubRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.CLUB_RESP_DISMISS_CLUB_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.param = msg.param;
        cc.log("DismissClubRespPacket param=", this.param);
    };
}

module.exports = DismissClubRespPacket;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"DismissGameReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '891adOTLJRJqo2ZsdIklhcV', 'DismissGameReqPacket');
// Script\Network\Cmd\Cmd_Req\DismissGameReqPacket.js

"use strict";

/**
 * Created by shrimp on 17/3/1.
 */
var MessageReq = require("MessageReq");

function DismissGameReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_DISMISS_GAME_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("DismissGameReqPacket.send");
        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = DismissGameReqPacket;

cc._RFpop();
},{"MessageReq":"MessageReq"}],"DismissGameRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'efcbfdlQlJMgIREAMjfQc3c', 'DismissGameRespPacket');
// Script\Network\Cmd\Cmd_Resp\DismissGameRespPacket.js

"use strict";

/**
 * Created by shrimp on 17/3/1.
 */
var MessageResp = require("MessageResp");

function DismissGameRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_DISMISS_GAME_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        //GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = DismissGameRespPacket;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"EnterRoomReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '1fd68M1xgJMo5TiX3DAh93S', 'EnterRoomReqPacket');
// Script\Network\Cmd\Cmd_Req\EnterRoomReqPacket.js

'use strict';

/**
 * Created by shrimp on 17/2/26.
 */
var MessageReq = require("MessageReq");
var GamePlayer = require('GamePlayer');
var GameSystem = require('GameSystem');

function EnterRoomReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_ENTER_GAME_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("EnterRoomReqPacket.send," + JSON.stringify(msg));

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            gamesvcid: GameSystem.getInstance().gamesvcid,
            tableid: GameSystem.getInstance().tableid

        };
        //cc.log("EnterRoomReqPacket," + JSON.stringify(this.data));
        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = EnterRoomReqPacket;

cc._RFpop();
},{"GamePlayer":"GamePlayer","GameSystem":"GameSystem","MessageReq":"MessageReq"}],"EnterRoomRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e3e58IgCJdJv7mLMjNKd0L/', 'EnterRoomRespPacket');
// Script\Network\Cmd\Cmd_Resp\EnterRoomRespPacket.js

"use strict";

/**
 * Created by shrimp on 17/2/26.
 */
var MessageResp = require("MessageResp");

function EnterRoomRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_ENTER_GAME_CMD_ID;
    this.tableid = 0;
    this.name = "";
    this.gametype = 0;
    this.mixante = 0;
    this.livetime = 0;
    this.remaintime = 0;
    this.bstart = 0;
    this.seats = 0;
    this.bullmul = [];
    this.bowner = 0;
    this.supercost = 0;
    this.giftcosts = [];
    this.seaters = "";
    //接收的数据
    this.onMessage = function (msg) {

        //{"cmd":6553602,"seq":18,"uid":10006,"code":0,"desc":"",
        // {"tableid":0,"name":"qweq","tstatus":0,"gametype":1,"minante":1,"mincarry":50,
        // "livetime":1800,"remaintime":1800,"bstart":0,"seats":6,"bullmul":[1,1,1,1,1,1,1,1,2,3,0,4,0,0,0,0],
        // "bowner":1,"bsitdown":0,"ustatus":0,"gold":10000,"diamond":9992,"seaters":[]}
        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;

        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.param = msg.param;

        if (this.param != "" && this.param != undefined) {
            cc.log("EnterRoomRespPacket" + BASE64.decoder(msg.param));
            var json = JSON.parse(BASE64.decoder(msg.param));
            this.tableid = json.tableid;
            this.name = json.name;
            this.gametype = json.gametype;
            this.mixante = json.mixante;
            this.livetime = json.livetime;
            this.remaintime = json.remaintime;
            this.bstart = json.bstart;
            this.seats = json.seats;
            this.bullmul = json.bullmul;
            this.bowner = json.bowner;
            this.seaters = json.seaters;
            this.ustatus = json.ustatus;
            this.tstatus = json.tstatus;
            this.supercost = json.supercost;
            this.giftcosts = json.giftcosts;
            this.mincarry = json.mincarry;
            this.maxcarry = json.maxcarry;
            this.totalcarry = json.totalcarry;
        }

        /*
        * TableId    int32      `json:"tableid"`    //桌子ID
         TableName  string     `json:"name"`       //桌子名称
         GameType   int32      `json:"gametype"`   //桌子类型(闭牌抢庄,四张抢庄)
         MixAnte    int        `json:"mixante"`    //最小下注
         LiveTime   int        `json:"livetime"`   //桌子总时间
         RemainTime int        `json:"remaintime"` //剩余时间
         Bstart     int8       `json:"bstart"`     //桌子是否开始
         Seats      int8      `json:"seats"`       //座位数
         BullMul    []int32    `json:"bullmul"`    //倍率
         Bowner     int8       `json:"bowner"`     //是否是桌主
         Seaters    []SEATER_T `json:"seaters"`    //桌位上的玩家信息
        * */
    };
}

module.exports = EnterRoomRespPacket;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"ExchangeGoldReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'a8688NjKFhPv4wjlqe7j723', 'ExchangeGoldReqPacket');
// Script\Network\Cmd\Cmd_Req\ExchangeGoldReqPacket.js

'use strict';

/**
 * Created by shrimp on 17/5/6.
 */
var MessageReq = require("MessageReq");
var GamePlayer = require('GamePlayer');
var GameSystem = require('GameSystem');
/*
* type US_REQ_EXCHANGE_GOLD_T struct {
 JsonHead
 Param PARAM_REQ_EXCHANGE_GOLD_T `json:"param"`
 }
 type PARAM_REQ_EXCHANGE_GOLD_T struct {
 Type int `json:"type"` //传递的是获取商城配置的goldlist中的type
 }
* */
function ExchangeGoldReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_EXCHANGE_GOLD_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("ExchangeGoldReqPacket.send");

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            param: msg
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = ExchangeGoldReqPacket;

cc._RFpop();
},{"GamePlayer":"GamePlayer","GameSystem":"GameSystem","MessageReq":"MessageReq"}],"ExchangeGoldRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c045f17bmZDtr70TurFpTU2', 'ExchangeGoldRespPacket');
// Script\Network\Cmd\Cmd_Resp\ExchangeGoldRespPacket.js

"use strict";

/**
 * Created by shrimp on 17/5/6.
 */
var MessageResp = require("MessageResp");
var GameSystem = require('GameSystem');
/*
*
* type US_RESP_EXCHANGE_GOLD_T struct {
 JsonHead
 RespHead
 Param PARAM_RESP_EXCHANGE_GOLD_T `json:"param"`
 }
 type PARAM_RESP_EXCHANGE_GOLD_T struct {
 Type    int `json:"type"`
 Gold    int `json:"gold"`
 Diamond int `json:"diamond"`
 }
* */
function ExchangeGoldRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_EXCHANGE_GOLD_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.type = msg.param.type;
        this.gold = msg.param.gold;
        this.diamond = msg.param.diamond;
        this.tips = msg.param.tips;
    };
}

module.exports = ExchangeGoldRespPacket;

cc._RFpop();
},{"GameSystem":"GameSystem","MessageResp":"MessageResp"}],"FindReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'cbd465V4c5I36cGyR65YqKT', 'FindReqPacket');
// Script\Network\Cmd\Cmd_Req\FindReqPacket.js

'use strict';

/**
 * Created by shrimp on 17/3/30.
 */
/*
 * type US_REQ_FOUND_TABLE_T struct {
 JsonHead
 Param PARAM_REQ_FOUND_TABLE_T `json:"param"`
 }
 type PARAM_REQ_FOUND_TABLE_T struct {
 Start int `json:"start"`
 Total int `json:"total"`
 }

 * */

var MessageReq = require("MessageReq");
var GamePlayer = require('GamePlayer');
var GameSystem = require('GameSystem');

function FindReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_FOUND_TABLE_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("FindRoomReqPacket.send");

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            start: msg.start,
            total: msg.total
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = FindReqPacket;

cc._RFpop();
},{"GamePlayer":"GamePlayer","GameSystem":"GameSystem","MessageReq":"MessageReq"}],"FindRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '6e195GEGGxGv5dVwovV04Ej', 'FindRespPacket');
// Script\Network\Cmd\Cmd_Resp\FindRespPacket.js

"use strict";

/**
 * Created by shrimp on 17/3/30.
 */
/*
* type US_RESP_FOUND_TABLE_T struct {
 JsonHead
 RespHead
 List []PRIVATE_TABLE_DETAIL_T `json:"list"`
 }
 type PRIVATE_TABLE_DETAIL_T struct {
 OwnerName  string `json:"ownername"`
 TableName  string `json:"tablename"`
 HeadUrl    string `json:"headurl"`
 MinAnte    int    `json:"minante"`
 RemainTime int    `json:"remaintime"`
 GameType   int    `json:"gametype"`
 GameId     int    `json:"gameid"`
 GameSvcId  int    `json:"gamesvcid"`
 TableId    int    `json:"tableid"`
 }

 * */
var MessageResp = require("MessageResp");
var GameSystem = require('GameSystem');

function FindRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_FOUND_TABLE_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        //{"cmd":196618,"seq":2,"uid":10038,"code":0,"desc":"执行成功","privateid":247522,"gamesvcid":5,"tableid":1}
        this.list = msg.list;
    };
}

module.exports = FindRespPacket;

cc._RFpop();
},{"GameSystem":"GameSystem","MessageResp":"MessageResp"}],"FindRoomReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e73b6s2+PFJNo/jHMXJnDkp', 'FindRoomReqPacket');
// Script\Network\Cmd\Cmd_Req\FindRoomReqPacket.js

'use strict';

/**
 * Created by shrimp on 17/2/26.
 */
var MessageReq = require("MessageReq");
var GamePlayer = require('GamePlayer');
var GameSystem = require('GameSystem');

function FindRoomReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_FIND_TABLE_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("FindRoomReqPacket.send");

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            privateid: msg.privateid
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = FindRoomReqPacket;

cc._RFpop();
},{"GamePlayer":"GamePlayer","GameSystem":"GameSystem","MessageReq":"MessageReq"}],"FindRoomRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '60314uN8bZC0rJACddRmQxE', 'FindRoomRespPacket');
// Script\Network\Cmd\Cmd_Resp\FindRoomRespPacket.js

"use strict";

/**
 * Created by shrimp on 17/2/26.
 */
var MessageResp = require("MessageResp");
var GameSystem = require('GameSystem');

function FindRoomRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_FIND_TABLE_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        //{"cmd":196618,"seq":2,"uid":10038,"code":0,"desc":"执行成功","privateid":247522,"gamesvcid":5,"tableid":1}
        this.privateid = msg.privateid;
        this.gamesvcid = msg.gamesvcid;
        this.tableid = msg.tableid;
        GameSystem.getInstance().privateid = this.privateid;
        GameSystem.getInstance().gamesvcid = this.gamesvcid;
        GameSystem.getInstance().tableid = this.tableid;
    };
}

module.exports = FindRoomRespPacket;

cc._RFpop();
},{"GameSystem":"GameSystem","MessageResp":"MessageResp"}],"FindView":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'f1588kaTdNGf6lWRIW6AtQQ', 'FindView');
// Script\ComScene\PopView\FindView.js

'use strict';

var BasePop = require('BasePop');
var MessageFactory = require('MessageFactory');
var ToastView = require('ToastView');
var GamblingHouseCell = require('GamblingHouseCell');
var AdvertItem = require('AdvertItem');
cc.Class({
    extends: BasePop,

    properties: {
        TableCell: cc.Prefab,
        ScrollView: cc.ScrollView,
        initNode: cc.Node,
        ShareView: cc.Prefab,

        Page1: cc.Sprite,
        Page2: cc.Sprite,
        Page3: cc.Sprite,

        advertItem: cc.Prefab,
        pageView: cc.PageView,
        pageViewContent: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        cc.log("FindView.OnLoad2");

        this._super();
        this.onSendReqFoundTable(0, 50);

        //cc.log(window.US_REQ_BANNER_LIST_CMD_ID);
        //MessageFactory.createMessageReq(window.US_REQ_BANNER_LIST_CMD_ID).send();
    },

    onSendReqFoundTable: function onSendReqFoundTable(nStart, nTotal) {
        var data = {
            start: nStart,
            total: nTotal
        };
        MessageFactory.createMessageReq(window.US_REQ_FOUND_TABLE_CMD_ID).send(data);
    },

    onSceneMsg: function onSceneMsg(event) {
        var msg = event.data;

        if (msg.popView == "GamblingHouseCell") {
            if (msg.btn == "enterRoom") {
                this.dismiss();
            } else if (msg.btn == "winxinShared") {

                cc.log("FindView.onSceneMsg but=" + msg.btn);

                var shareView = cc.instantiate(this.ShareView);
                cc.director.getScene().addChild(shareView);
                var winSize = cc.director.getWinSize();
                shareView.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
            }
        }
    },

    /*********************Network***************************/
    onMessage: function onMessage(event) {
        cc.log("FindView.onMessage");
        //this._super(event);
        var msg = event.data;
        var cmd = msg.cmd;

        switch (cmd) {
            case US_RESP_FOUND_TABLE_CMD_ID:
                this.onFoundTableMsg(msg);
                break;

            case US_RESP_BANNER_LIST_CMD_ID:
                this.onShopListMsg(msg);
                break;
        }
    },

    onShopListMsg: function onShopListMsg(msg) {

        cc.log("onShopListMsg2");

        /*
           if(msg.code == SocketRetCode.RET_SUCCESS)
           {
               //cc.log(msg.bannerlist);
                 //this.updateBannerList(msg.bannerlist);
           }
           */
    },

    addAdvertItem: function addAdvertItem(info, index) {
        //jumpurl pic
        var winSize = cc.director.getWinSize();
        var advertItem = cc.instantiate(this.advertItem);
        this.pageView.addPage(advertItem);
        var winSize = cc.director.getWinSize();
        advertItem.setPosition(cc.p(winSize.width / 2 + winSize.width * index, 0));
        advertItem.getComponent('AdvertItem').updateAdverItem(info);
    },

    updateBannerList: function updateBannerList(bannerlist) {
        this.pageView.removeAllPages();

        for (var index = 0; index < bannerlist.length; index++) {
            this.addAdvertItem(bannerlist[index], index);
        }

        //this.getSpriteFrame2("http://manage.aqddp.cn/getpic.php?url=http://manage.aqddp.cn/files/banner1.jpg");
    },

    getSpriteFrame2: function getSpriteFrame2(url, successCb, failureCb, target, otherSender) {
        //url = this.kyHelper + url;


        //cc.log(page1);

        var xhr = new XMLHttpRequest();

        var self = this;

        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
                var response = xhr.responseText;

                var img = BASE64.decoder(response);

                //cc.log("img=", img);

                var text = new Uint8Array(response, 0, response.length);

                var img = new Image();
                img.src = BASE64.decoder(response);

                var texture = new cc.Texture2D();
                texture.initWithImage(img); //cc.Texture2D.SRC_ALPHA, 1, 1, cc.size(1080, 300));
                texture.handleLoadedTexture();

                var newframe = new cc.SpriteFrame(texture);
                self.Page1.spriteFrame = newframe;

                // if (successCb != null) {
                //     successCb.apply(target, [newframe, otherSender]);
                // }
            } else {
                    // if(failureCb != null)
                    // {
                    //     failureCb.apply(target);
                    // }
                }
        };

        xhr.timeout = 5000;
        xhr.open("GET", url, true);
        xhr.send();
    },

    onFoundTableMsg: function onFoundTableMsg(msg) {
        if (msg.list.length === 0) {
            ToastView.show("暂未发现房间");
            return;
        }

        if (this.initNode != null && this.initNode != undefined) this.initNode.active = false;

        var height = 0;
        for (var index = 0; index < msg.list.length; index++) {
            var TableCell = cc.instantiate(this.TableCell);
            this.ScrollView.content.addChild(TableCell);
            height = TableCell.getContentSize().height;
            TableCell.setPosition(cc.p(0, -TableCell.getContentSize().height / 2 - TableCell.getContentSize().height * index));
            TableCell.getComponent("GamblingHouseCell").updateRoomInfo(msg.list[index]);
        }

        if (height * (msg.list.length + 1) > this.ScrollView.content.height) {
            this.ScrollView.content.height = height * (msg.list.length + 1);
        }
    },

    callbackScrollView: function callbackScrollView(scrollview, eventType, customEventData) {
        cc.log("FindView ," + eventType + "," + customEventData);
        if (eventType === cc.ScrollView.EventType.SCROLL_TO_TOP) {} else if (eventType === cc.ScrollView.EventType.SCROLL_TO_BOTTOM) {}
    }
});

cc._RFpop();
},{"AdvertItem":"AdvertItem","BasePop":"BasePop","GamblingHouseCell":"GamblingHouseCell","MessageFactory":"MessageFactory","ToastView":"ToastView"}],"GVoiceJsb":[function(require,module,exports){
"use strict";
cc._RFpush(module, '2231d3ce61JoYOTkOwpexQo', 'GVoiceJsb');
// Script\Platform\GVoiceJsb.js

'use strict';

/**
 * Created by shrimp on 17/4/26.
 */

var SocketManager = require('SocketManager');
var MessageFactory = require('MessageFactory');
var GamePlayer = require('GamePlayer');

function GloudVoice() {}

GloudVoice.prototype.onStartRecord = function (progress) {
    cc.log("GloudVoice.prototype.onStartRecord,progress = " + progress);
    //显示开始录音
    //SocketManager.getInstance().startSocket();
};

GloudVoice.prototype.onStopRecording = function (progress) {
    cc.log("GloudVoice.prototype.onStopRecording,progress = " + progress);
    //停止录音
    //SocketManager.getInstance().startSocket();
};

GloudVoice.prototype.OnUploadFile = function (code, filePath, fileID) {
    cc.log("GloudVoice.prototype.OnUploadFile,code = " + code);
    cc.log("GloudVoice.prototype.OnUploadFile,filePath = " + filePath);
    cc.log("GloudVoice.prototype.OnUploadFile,fileID = " + fileID);
    if (code == 11) {
        //上传服务器转发


        //var filePath = filePath + "@" + 1.0;
        var voiceData = {
            filePath: filePath,
            fileID: fileID
        };
        //Net.sendAudio(Table.getInstance().room_id, fileId, filePath);
        var data = {
            touid: GamePlayer.getInstance().uid,
            kind: ChatType.E_CHAT_VOICE_KIND,
            type: 0,
            text: BASE64.encoder(JSON.stringify(voiceData))
        };
        MessageFactory.createMessageReq(US_REQ_GAME_CHAT_CMD_ID).send(data);
    }

    //显示上传通知
};

GloudVoice.prototype.OnDownloadFile = function (code, filePath, fileID) {
    cc.log("GloudVoice.prototype.OnDownloadFile,code = " + code);
    cc.log("GloudVoice.prototype.OnDownloadFile,filePath = " + filePath);
    cc.log("GloudVoice.prototype.OnDownloadFile,fileID = " + fileID);
    if (code == 13 || code == 11) {} else {
        //取消播放;
        //取消声音播放界面
        var message = {
            popView: "GloudVoice",
            btn: "OnPlayRecordedFile"
        };
        GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.SCENE_MSG, data: message });
    }
};

GloudVoice.prototype.OnPlayRecordedFile = function (code, filePath) {
    cc.log("GloudVoice.prototype.OnPlayRecordedFile,code = " + code);
    cc.log("GloudVoice.prototype.OnPlayRecordedFile,filePath = " + filePath);
    if (code == 18) {
        //取消声音播放界面
        var message = {
            popView: "GloudVoice",
            btn: "OnPlayRecordedFile"
        };
        GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.SCENE_MSG, data: message });
    } else {
        //取消声音播放界面
        var message = {
            popView: "GloudVoice",
            btn: "OnPlayRecordedFile"
        };
        GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.SCENE_MSG, data: message });
    }
};

var GVoiceJsb = function () {
    var instance;

    function getInstance() {
        if (instance === undefined) {
            instance = new GloudVoice();
        }
        return instance;
    };

    return {
        getInstance: getInstance
    };
}();

module.exports = GVoiceJsb;

cc._RFpop();
},{"GamePlayer":"GamePlayer","MessageFactory":"MessageFactory","SocketManager":"SocketManager"}],"GamblingHouseCell":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c0807iHBp1GWqeHpsjljBcb', 'GamblingHouseCell');
// Script\ComScene\PopView\GamblingHouseCell.js

'use strict';

var UtilTool = require('UtilTool');
var ToastView = require('ToastView');
var AlertView = require('AlertView');
var LoadingView = require('LoadingView');
var MessageFactory = require('MessageFactory');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require("GameSystem");

cc.Class({
    extends: cc.Component,

    properties: {
        Head: cc.Sprite,
        RoomName: cc.Label,
        PrivateCode: cc.Label,
        CreatorName: cc.Label,
        MinBet: cc.Label,
        timeLabel: cc.Label,
        bankerMode: cc.Label,
        ClubFlag: cc.Sprite
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.initBaseData();
    },

    initBaseData: function initBaseData() {
        this.roomInfo = null;
        this.time = 0;
    },

    //"list":[
    // {"ownername":"游客10688","tablename":"游客10688","headurl":"",
    // "minante":1,"remaintime":1800,"gametype":1,"gameid":101,"gamesvcid":5,"tableid":0},
    // {"ownername":"游客10688","tablename":"游客10688","headurl":"","minante":1,"remaintime":1800,
    // "gametype":1,"gameid":101,"gamesvcid":5,"tableid":0}]}

    //called every frame, uncomment this function to activate update callback
    updateTime: function updateTime() {
        this.time--;
        this.timeLabel.string = UtilTool.getTime(this.time);
        if (this.time < 0) {
            this.timeLabel.string = "已结束";
            this.unschedule(this.updateTime);
        }
    },

    strLength: function strLength(str) {
        var l = str.length;
        var blen = 0;
        for (var i = 0; i < l; i++) {
            if ((str.charCodeAt(i) & 0xff00) != 0) {
                blen++;
            }
            blen++;
        }
        return blen;
    },

    subName: function subName(name) {
        var len = this.strLength(name);
        if (len > 8) {
            name = name.substr(0, 8);
            name += "..";
        }
        return name;
    },

    updateRoomInfo: function updateRoomInfo(cellMsg) {
        this.roomInfo = cellMsg;

        cc.log("GamblingHouseCell.updateRoomInfo,cellMsg = " + cellMsg);
        this.RoomName.string = this.subName(cellMsg.tablename);
        cc.log("GamblingHouseCell.updateRoomInfo name=", this.subName(cellMsg.tablename));

        this.CreatorName.string = cellMsg.ownername;
        this.PrivateCode.string = cellMsg.privateid;
        this.MinBet.string = cellMsg.minante;
        this.time = cellMsg.remaintime;
        this.timeLabel.string = UtilTool.getTime(cellMsg.remaintime);

        if (cellMsg.starttime > 0) {
            this.schedule(this.updateTime, 1);
        }
        this.MinBet.string = cellMsg.minante;
        this.time = cellMsg.remaintime;
        this.timeLabel.string = UtilTool.getTime(cellMsg.remaintime);
        UpdateWXHeadIcon(cellMsg.headurl, this.Head);

        if (cellMsg.gametype == 1) {
            this.bankerMode.string = "闭牌抢庄";
        } else {
            this.bankerMode.string = "三张抢庄";
        }

        if (Number(cellMsg.clubid) > 0) {
            this.ClubFlag.node.active = true;
        } else {
            this.ClubFlag.node.active = false;
        }
    },

    callBackBtn: function callBackBtn(event, CustomEventData) {
        cc.log("GamblingHouseCell.callbackBtn,CustomEventData = " + CustomEventData);
        var btnName = event.target.getName();
        cc.log("GamblingHouseCell.callbackBtn,btnName = " + btnName);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if (btnName == "GamblingHouseCell") {
            //{"ownername":"游客10688","tablename":"游客10688","headurl":"","minante":1,"remaintime":144,
            // "gametype":1,"gameid":101,"gamesvcid":5,"tableid":0}]

            if (this.time < 0) {
                ToastView.show("游戏已结束");
            } else {
                var self = this;
                var alertExit = AlertView.create();
                alertExit.setPositiveButton(function () {
                    self.enterRoom();
                });
                alertExit.showOne("是否进入游戏？", AlertViewBtnType.E_BTN_CLOSE);
            }
        }
    },

    callBackGameMode: function callBackGameMode(event, CustomEventData) {
        cc.log("GamblingHouseCell.callBackGameMode, btnName = " + event.target.getName());
        cc.log("GamblingHouseCell.callBackGameMode, CustomEventData = " + CustomEventData);
        if (Number(CustomEventData) == 1) {
            var message = {
                popView: "GamblingHouseCell",
                btn: "winxinShared"
            };
            GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.SCENE_MSG, data: message });
        }
    },

    enterRoom: function enterRoom() {
        var message = {
            popView: "GamblingHouseCell",
            btn: "enterRoom"
        };
        GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.SCENE_MSG, data: message });

        LoadingView.show("正在进入...");

        var findRoomReq = MessageFactory.createMessageReq(window.US_REQ_FIND_TABLE_CMD_ID);
        var data = {
            privateid: this.roomInfo.privateid
        };

        if (findRoomReq) {
            findRoomReq.send(data);
        }
    }
});

cc._RFpop();
},{"AlertView":"AlertView","Audio_Common":"Audio_Common","GameSystem":"GameSystem","LoadingView":"LoadingView","MessageFactory":"MessageFactory","MusicMgr":"MusicMgr","ToastView":"ToastView","UtilTool":"UtilTool"}],"GameCallOC":[function(require,module,exports){
"use strict";
cc._RFpush(module, '75e62XRNkJA7Ia+JmzlQS+Y', 'GameCallOC');
// Script\Platform\GameCallOC.js

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

cc._RFpop();
},{"GameSystem":"GameSystem","LoadingView":"LoadingView","MessageFactory":"MessageFactory"}],"GameConfig":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'b18467aV/JG+oT2twpS7MoA', 'GameConfig');
// Script\Hotupdate\GameConfig.js

"use strict";

/**
 * 全局环境设置
 * Author      : donggang
 * Create Time : 2016.7.26
 */
/** 外网测试服 */
var debug_extranet = {
    gateSocketIp: "192.168.1.1", // 网关地址
    gateSocketPort: 3101, // 网关端口

    useSSL: false, // 是否使用https
    textUpdate: true };

window.game = window.game || {};
game.config = module.exports = debug_extranet;

require("HttpRequest");

cc._RFpop();
},{"HttpRequest":"HttpRequest"}],"GamePlayer":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd0945yz5JpANZwyr60Y5B9u', 'GamePlayer');
// Script\Moudle\GamePlayer.js

"use strict";

/**
 * Created by shrimp on 17/2/22.
 */
var Player = require('Player');

function GamePlayData() {
    Player.apply([], this);

    this.clubid = 0; //我的俱乐部ID
    this.unionid = "";
    this.openid = "";
    this.superCost = 0;
    this.giftCost = [];
    this.SelfClubId = 0; //我的俱乐部ID
    this.CurClubInfo = null;
    this.CurClubMemList = null;

    this.Copy = function (player) {
        this.uid = player.uid;
        this.name = player.name;
        this.headurl = player.headurl;
        this.sex = player.sex;
        this.gold = player.gold; //身上金币
        this.diamond = player.diamond; //身上钻石
        this.coin = player.coin; //携带金币
        this.seatid = player.seatid;
        this.status = player.status;
        this.winGold = player.winGold;
        this.TotalCarry = player.TotalCarry;
        this.TotalRound = player.TotalRound;
        this.TotalTable = player.TotalTable;
        this.calltype = player.calltype;
        this.bBanker = player.bBanker; //是否是庄家
        this.betcoinmul = player.betcoinmul; //下注倍数
        this.bulltype = player.bulltype;
        this.cards = player.cards;
        this.finalcoin = player.finalcoin;
        this.bOpenCard = player.bOpenCard;
        this.roomcard = player.roomcard;
    };
}

var GamePlayer = function () {
    var instance;

    function getInstance() {
        if (instance === undefined) {
            instance = new GamePlayData();
        }
        return instance;
    };

    return {
        getInstance: getInstance
    };
}();

module.exports = GamePlayer;

cc._RFpop();
},{"Player":"Player"}],"GameSystem":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'df5b7N1suVOB59ky+su8hYo', 'GameSystem');
// Script\Comm\GameSystem.js

"use strict";

/**
 * Created by shrimp on 17/2/22.
 */

function GameSystemManager() {
    this.bClientHotUpdate = false;
    this.defaultKey = "xa`129-w2310u!@#$^&*(!hzsx&*32#@";
    this.bLogin = true;
    this.bFirstInHall = true; //是否第一次进入大厅
    this.webSocketUrl = "";
    this.backWebSocketUrl = "";
    this.userkey = "";
    this.aesKey = new Uint8Array();
    this.iv = [100, 22, 245, 214, 157, 96, 77, 82, 1, 37, 121, 90, 47, 65, 54, 63];
    this.productid = 3;
    this.version = 1015;
    // add by jackyu
    this.VolumeState = 0;

    this.referralCode = 0;
    this.ledlist = null;

    this.VerStatusType = cc.Enum({
        VERSION_TYPE_TEST: 1, //测试
        VERSION_TYPE_AUDIT: 2, //审核
        VERSION_TYPE_OPERATION: 3 });
    this.VerStatus = this.VerStatusType.VERSION_TYPE_TEST;

    this.clienturl = ""; //客户端升级地址

    this.fileurl = ""; //文件地址

    this.weixincs = ""; //微信客服账号

    this.payurl = ""; //支付地址

    this.notice = {
        title: "",
        doc: "",
        writer: "",
        popup: 0,
        ismaintain: 0,
        time: 0
    };

    //this.routerUrl = "http://niuyouquan.bigbeargame.com:19191/";
    //this.routerUrl = "http://121.41.26.8:19191/";
    this.routerUrl = "http://120.26.81.151:19191/";

    this.logintype = 3;

    this.CustomLoginType = 0; //玩家选择登录类型

    this.bReloadInGame = false;

    this.gamesvcid = 0;

    this.tableid = 0;

    this.privateid = 0;

    this.EnterRoom = true;

    this.GameType = cc.Enum({
        GAME_TYPE_HALL: 0,
        GAME_TYPE_BULLFIGHT: 1
    });

    this.CurGameType = this.GameType.GAME_TYPE_HALL;

    this.BullFightTableCost = []; //开房间消耗

    this.superCost = 0; //超级抢庄消耗

    this.giftCost = []; //礼物消耗

    this.ClubUpgradeCost = []; //俱乐部升级

    this.NewMsgNum = false;

    this.roomLevel = 1;
}

//[{"type":1,"value":1800,"diamond":1,"gold":100},
// {"type":1,"value":3600,"diamond":2,"gold":200},
// {"type":1,"value":5400,"diamond":3,"gold":300},
// {"type":1,"value":7200,"diamond":4,"gold":400},
// {"type":1,"value":9000,"diamond":5,"gold":500},
// {"type":1,"value":10800,"diamond":6,"gold":600},
// {"type":2,"value":1,"diamond":1,"gold":100},
// {"type":2,"value":5,"diamond":2,"gold":200},
// {"type":2,"value":10,"diamond":3,"gold":300},
// {"type":2,"value":20,"diamond":4,"gold":400},
// {"type":2,"value":50,"diamond":5,"gold":500}]

GameSystemManager.prototype.calcGoldCost = function (liveTime, minAnte) {
    var costInfo;
    var timeCost = 1;
    var anteCost = 1;
    var count = 0;

    cc.log("calcGoldCost liveTime=", liveTime, " minAnte=", minAnte);

    for (var i = 0; i < this.BullFightTableCost.length; i++) {

        costInfo = this.BullFightTableCost[i];

        if (costInfo.type == 1 && costInfo.value == liveTime) {
            timeCost = costInfo.gold;
            count++;
            cc.log("calcGoldCost timeCost=", timeCost);
        } else if (costInfo.type == 2 && costInfo.value == minAnte) {
            anteCost = costInfo.gold;
            count++;
            cc.log("calcGoldCost anteCost=", anteCost);
        }

        if (count == 2) {
            break;
        }
    }
    cc.log("calcGoldCost totalCost=", timeCost + anteCost);
    return timeCost + anteCost;
};

// Time    int `json:"time"`    //单位秒
// Diamond int `json:"diamond"` //消耗钻石
// Level   int `json:"level`    //等级(level=0是)
GameSystemManager.prototype.calcDiamondCost = function (liveTime, clubLevel) {
    var costInfo;

    for (var i = 0; i < this.BullFightTableCost.length; i++) {
        costInfo = this.BullFightTableCost[i];
        if (costInfo.time == liveTime && costInfo.level == clubLevel) {
            cc.log("calcDiamondCost liveTime=", liveTime, " clubLevel=", clubLevel, " diamond=", costInfo.diamond);
            return costInfo.diamond;
        }
    }
    cc.log("calcDiamondCost liveTime=", liveTime, " clubLevel=", clubLevel, " diamond=0");
    return 0;
};

GameSystemManager.prototype.getCurrentSystemTime = function () {
    return new Date().getTime();
};

var GameSystem = function () {
    var instance;

    function getInstance() {
        if (instance === undefined) {
            instance = new GameSystemManager();
        }
        return instance;
    };

    return {
        getInstance: getInstance
    };
}();

module.exports = GameSystem;

cc._RFpop();
},{}],"GetClubListReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '8248fS+xiNO1Zu6fb/FM3m7', 'GetClubListReqPacket');
// Script\Network\Cmd\Cmd_Req\GetClubListReqPacket.js

'use strict';

/**
 * Created by shrimp on 17/4/7.
 */

var MessageReq = require("MessageReq");
var GamePlayer = require('GamePlayer');
var GameSystem = require('GameSystem');

function GetClubListReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_CLUB_LIST_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("GetClubListReqPacket.send");

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid
        };
        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}
module.exports = GetClubListReqPacket;

cc._RFpop();
},{"GamePlayer":"GamePlayer","GameSystem":"GameSystem","MessageReq":"MessageReq"}],"GetClubListRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd847440MahEdpJl66FE25bp', 'GetClubListRespPacket');
// Script\Network\Cmd\Cmd_Resp\GetClubListRespPacket.js

"use strict";

/**
 * Created by shrimp on 17/4/7.
 */
var MessageResp = require("MessageResp");
var GameSystem = require('GameSystem');
/*
* type US_RESP_CLUB_LIST_T struct {
 JsonHead
 RespHead
 List []CLUB_INFO_T `json:"list"`
 }
 type CLUB_INFO_T struct {
 ClubId    int    `json:"clubid"`
 Role      int8   `json:"role"`
 OwnerUid  uint32 `json:"owneruid"`
 Level     int    `json:"level"`
 Name      string `json:"name"`
 HeadUrl   string `json:"headurl"`
 Address   string `json:"address"`
 Intro     string `json:"intro"`
 EndTime   int64  `json:"endtime"` //s
 Status    int    `json:"status"`
 Members   int    `json:"members"`   //成员人数
 MaxMember int    `json:"maxmember"` //最多多少人
 }
* */
function GetClubListRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_CLUB_LIST_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        //{"cmd":196618,"seq":2,"uid":10038,"code":0,"desc":"执行成功","privateid":247522,"gamesvcid":5,"tableid":1}
        this.list = msg.list;
    };
}

module.exports = GetClubListRespPacket;

cc._RFpop();
},{"GameSystem":"GameSystem","MessageResp":"MessageResp"}],"GetClubTableReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '491a9CHOXZEtZyS2Lbp9Vrl', 'GetClubTableReqPacket');
// Script\Network\Cmd\Cmd_Req\GetClubTableReqPacket.js

'use strict';

/**
 * Created by shrimp on 17/4/8.
 */

var MessageReq = require("MessageReq");
var GamePlayer = require('GamePlayer');
var GameSystem = require('GameSystem');

function GetClubTableReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_CLUB_TABLE_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("GetClubTableReqPacket.send");

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            clubid: msg.clubid
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = GetClubTableReqPacket;

cc._RFpop();
},{"GamePlayer":"GamePlayer","GameSystem":"GameSystem","MessageReq":"MessageReq"}],"GetClubTableRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '6eacbtpWUBLcrayHGgFuxJo', 'GetClubTableRespPacket');
// Script\Network\Cmd\Cmd_Resp\GetClubTableRespPacket.js

"use strict";

/**
 * Created by shrimp on 17/4/8.
 */
var MessageResp = require("MessageResp");
/*
* type US_RESP_CLUB_TABLE_T struct {
 JsonHead
 RespHead
 Param PARAM_RESP_CLUB_TABLE_T `json:"param"`
 }
 type PARAM_RESP_CLUB_TABLE_T struct {
 ClubId int `json:"clubid"`
 List []PRIVATE_TABLE_DETAIL_T `json:"list"`
 }

 type PRIVATE_TABLE_DETAIL_T struct {
 OwnerName  string `json:"ownername"`
 TableName  string `json:"tablename"`
 HeadUrl    string `json:"headurl"`
 MinAnte    int    `json:"minante"`
 RemainTime int    `json:"remaintime"`
 GameType   int    `json:"gametype"`
 GameId     int    `json:"gameid"`
 GameSvcId  int    `json:"gamesvcid"`
 TableId    int    `json:"tableid"`
 }
* */
function GetClubTableRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_CLUB_TABLE_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;

        this.param = msg.param;
        this.clubid = this.param.clubid;
        this.list = this.param.list;
    };
}

module.exports = GetClubTableRespPacket;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"GetMemberListReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '1ce9a5c75RGlIxg/QwNXwEk', 'GetMemberListReqPacket');
// Script\Network\Cmd\Cmd_Req\GetMemberListReqPacket.js

"use strict";

/**
 * Created by shrimp on 17/4/9.
 */
/*
 type CLUB_REQ_GET_MEMBER_LIST_T struct {
 ClubHead
 }

* */
var MessageReq = require("MessageReq");

function GetMemberListReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.CLUB_REQ_GET_MEMBER_LIST_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("GetMemberListReqPacket.send");

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            clubid: msg.clubid
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = GetMemberListReqPacket;

cc._RFpop();
},{"MessageReq":"MessageReq"}],"GetMemberListRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '676efmGfS5LiIqFFgF+56lb', 'GetMemberListRespPacket');
// Script\Network\Cmd\Cmd_Resp\GetMemberListRespPacket.js

"use strict";

/**
 * Created by shrimp on 17/4/9.
 */
/*
* type CLUB_RESP_GET_MEMBER_LIST_T struct {
 JsonHead
 RespHead
 Param PARAM_RESP_GET_MEMBER_LIST_T `json:"param"`
 }
 type PARAM_RESP_GET_MEMBER_LIST_T struct {
 ClubId int                  `json:"clubid"`
 List   []CLUB_MEMBER_INFO_T `json:"list"`
 }
 type CLUB_MEMBER_INFO_T struct {
 Uid     uint32 `json:"uid"`
 Name    string `json:"name"`
 HeadUrl string `json:"headurl"`
 Sex     int  `json:"sex"`
 Role    uint8  `json:"role"`
 }
* */
var MessageResp = require("MessageResp");

function GetMemberListRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.CLUB_RESP_GET_MEMBER_LIST_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.clubid = msg.param.clubid;
        this.list = msg.param.list;
        //GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = GetMemberListRespPacket;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"GetMsgListReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c9e00f1vrBFbZXDEaeXvXha', 'GetMsgListReqPacket');
// Script\Network\Cmd\Cmd_Req\GetMsgListReqPacket.js

"use strict";

/**
 * Created by shrimp on 17/4/13.
 */
var MessageReq = require("MessageReq");
/*
* const (
 E_SYSTEM_MSG_T = 1
 E_CLUB_MSG_T   = 2
 E_MAIL_MSG_T   = 3
 )
 type US_REQ_MSG_LIST_T struct {
 JsonHead
 Param PARAM_REQ_MSG_LIST_T `json:"param"`
 }
 type PARAM_REQ_MSG_LIST_T struct {
 Type  int `json:"type"`
 Start int `json:"start"`
 Total int `json:"total"`
 }
* */
function GetMsgListReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_MSG_LIST_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("GetMsgNumReqPacket.send");

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            param: msg
        };
        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = GetMsgListReqPacket;

cc._RFpop();
},{"MessageReq":"MessageReq"}],"GetMsgListRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '29174A7Q/VB4oKJ4i+YuMJm', 'GetMsgListRespPacket');
// Script\Network\Cmd\Cmd_Resp\GetMsgListRespPacket.js

"use strict";

/**
 * Created by shrimp on 17/4/13.
 */
/*
* E_SYSTEM_MSG_T = 1
 type US_RESP_SYS_MSG_LIST_T struct {
 JsonHead
 RespHead
 Param PARAM_SYS_MSG_T `json:"param"`
 }
 type PARAM_SYS_MSG_T struct {
 Type int              `json:"type"`
 List []SYS_MSG_NODE_T `json:"list"`
 }
 type SYS_MSG_NODE_T struct {
 Msg  string `json:"msg"`			//base64
 Time int64  `json:"time"`
 }

 E_CLUB_MSG_T   = 2
 type US_RESP_CLUB_MSG_LIST_T struct {
 JsonHead
 RespHead
 Param PARAM_CLUB_MSG_T `json:"param"`
 }
 type PARAM_CLUB_MSG_T struct {
 Type int               `json:"type"`
 List []CLUB_MSG_NODE_T `json:"list"`
 }
 type CLUB_MSG_NODE_T struct {
 Id      int    `json:"id"`
 ClubId  int    `json:"clubid"`
 Name    string `json:"name"`
 HeadUrl string `json:"headurl"`
 IsRead  int    `json:"isread"`
 Type    int    `json:"type"`
 Msg     string `json:"msg"`		//base64
 Time    int    `json:"time"`
 }

 E_MAIL_MSG_T   = 3
 type US_RESP_MAIL_MSG_LIST_T struct {
 JsonHead
 RespHead
 Param PARAM_MAIL_MSG_T `json:"param"`
 }
 type PARAM_MAIL_MSG_T struct {
 Type int               `json:"type"`
 List []MAIL_MSG_NODE_T `json:"list"`
 }
 type MAIL_MSG_NODE_T struct {
 Id     int    `json:"id"`
 IsRead int    `json:"isread"`
 Type   int    `json:"type"`
 Msg    string `json:"msg"`		//base64
 Time   int    `json:"time"`
 }
*
* */
var MessageResp = require("MessageResp");

function GetMsgListRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_MSG_LIST_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.type = msg.param.type;
        this.list = msg.param.list;
    };
}

module.exports = GetMsgListRespPacket;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"GetMsgNumReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'a7bb5YDWPNNPK9OQuGhBG4U', 'GetMsgNumReqPacket');
// Script\Network\Cmd\Cmd_Req\GetMsgNumReqPacket.js

"use strict";

/**
 * Created by shrimp on 17/4/13.
 */

var MessageReq = require("MessageReq");

function GetMsgNumReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_NEW_MSG_NUM_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("GetMsgNumReqPacket.send");

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = GetMsgNumReqPacket;

cc._RFpop();
},{"MessageReq":"MessageReq"}],"GetMsgNumRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '83fa3uwflJBd54DDVeKRy/3', 'GetMsgNumRespPacket');
// Script\Network\Cmd\Cmd_Resp\GetMsgNumRespPacket.js

"use strict";

/**
 * Created by shrimp on 17/4/13.
 */

/*
* type US_RESP_NEW_MSG_NUM_T struct {
 JsonHead
 RespHead
 Param PARAM_NEW_MSG_NUM_T `json:"param"`
 }

 type PARAM_NEW_MSG_NUM_T struct {
 SysNum  int `json:"sysnum"`
 ClubNum int `json:"clubnum"`
 MailNum int `json:"mailnum"`
 }
* */
var MessageResp = require("MessageResp");

function GetMsgNumRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_NEW_MSG_NUM_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.sysnum = msg.param.sysnum;
        this.clubnum = msg.param.clubnum;
        this.mailnum = msg.param.mailnum;
    };
}

module.exports = GetMsgNumRespPacket;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"GlobalEventManager":[function(require,module,exports){
"use strict";
cc._RFpush(module, '6cae2lyteVOg6F0fGwqwrX/', 'GlobalEventManager');
// Script\Moudle\GlobalEventManager.js

"use strict";

/**
 * Created by shrimp on 17/2/19.
 */

/**
 * 自定义消息的封装
 * @param eventType
 * @param callBack
 * @param node
 * @constructor
 */

function GlobalEvent(eventType, callBack, node) {
    this.eventType = eventType;
    this.callBack = callBack;
    this.node = node;
}

function EventManager() {

    this.listenerMap = new Map();
    this.eventID = 0;

    /**
     * 添加监听
     * @param eventType
     * @param callBack
     * @param node
     * @returns {number}
     */
    this.addEventListener = function (eventType, callBack, node) {
        var event = new GlobalEvent(eventType, callBack, node);

        this.listenerMap.forEach(function (event) {
            if (event.eventType == eventType && node == event.node) {
                cc.log("GlobalEventManage same addEventListener=", eventType);
                return;
            }
        });

        this.eventID++;
        this.listenerMap.set(this.eventID, event);

        cc.log("GlobalEventManage addEventListener=", eventType, " eventid=", this.eventID);
        return this.eventID;
    };

    /**
     * 删除监听
     * @param eventid
     */
    this.removeListener = function (eventid) {
        cc.log("GlobalEventManager.removeListener eventid=", eventid);
        if (this.listenerMap.containsKey(eventid)) {
            this.listenerMap.delete(eventid);
        }
    };

    /**
     * 转发事件
     * @param eventType
     * @param data
     */
    this.emitEvent = function (eventType, data) {
        this.listenerMap.forEachKey(function (id, event) {
            if (event.eventType == eventType) {
                event.callBack(data);
                return;
            }
        });
    };
}

var GlobalEventManager = function () {
    var instance;

    function getInstance() {
        if (instance === undefined) {
            instance = new EventManager();
        }
        return instance;
    };

    return {
        getInstance: getInstance
    };
}();

window.GlobalEventManager = GlobalEventManager;

cc._RFpop();
},{}],"HallScene":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'dde5dz2rFRKTKw4uMTvRGhZ', 'HallScene');
// Script\ComScene\SceneView\HallScene.js

'use strict';

var BaseScene = require("BaseScene");
var MusicMgr = require('MusicMgr');
var HttpManager = require('HttpManager');
var Platform = require('Platform');
var MessageFactory = require('MessageFactory');
var GameSystem = require('GameSystem');
var SocketManager = require('SocketManager');
var ToastView = require('ToastView');
var LoadingView = require('LoadingView');
var Audio_Common = require('Audio_Common');
var GamePlayer = require('GamePlayer');
var GameCallOC = require('GameCallOC');
var AlertView = require('AlertView');

cc.Class({
    extends: BaseScene,

    properties: {
        topBg: {
            default: null,
            type: cc.Sprite
        },
        bottomBg: {
            default: null,
            type: cc.Sprite
        },
        HallBg: {
            default: null,
            type: cc.Sprite
        },

        Bullfight_CreateRoom: cc.Prefab,
        RoomIdEditBox: cc.EditBox,
        PopNode: cc.Node,
        ShopView: cc.Prefab,
        FindView: cc.Prefab,
        SuccessView: cc.Prefab,
        MineView: cc.Prefab,
        ClubView: cc.Prefab,
        NoticeView: cc.Prefab,
        ShopToggle: cc.Toggle,
        ShareView: cc.Prefab,
        WebView: cc.Prefab,
        RedTips: cc.Sprite,
        HallTitle: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._super();
        cc.log("HallScene.onLoad");
        GameSystem.getInstance().bLogin = true;

        GameSystem.getInstance().CurGameType = GameSystem.getInstance().GameType.GAME_TYPE_HALL;
        this.popUpNotice();
        if (!GameSystem.getInstance().bFirstInHall) {
            this.getUserDetail(); //从游戏中退出到大厅，需要刷新玩家信息
        }
        GameSystem.getInstance().bFirstInHall = false;

        this.sendCreateTableCost();
        this.sendClubUpgradeCost();
        this.sendMsgNum();

        if (GameSystem.getInstance().bReloadInGame) {
            GameSystem.getInstance().bReloadInGame = false;
            cc.log("loadScene Bullfight_GameScene");
            cc.director.loadScene('Bullfight_GameScene');
        }
    },

    start: function start() {
        this.pushRollMsg();
        if (GameSystem.getInstance().ledlist != null && GameSystem.getInstance().ledlist != undefined && GameSystem.getInstance().ledlist.length > 0) {
            this.schedule(this.pushRollMsg, GameSystem.getInstance().ledlist.length * 10 + 10);
        }
    },

    stopRollMsg: function stopRollMsg() {
        if (GameSystem.getInstance().ledlist != null && GameSystem.getInstance().ledlist != undefined && GameSystem.getInstance().ledlist.length > 0) {
            this.unschedule(this.pushRollMsg);
        }
    },

    pushRollMsg: function pushRollMsg() {
        // if (this.HallTitle.string != "大熊牛友圈") {
        //     return;
        // }
        if (GameSystem.getInstance().ledlist != null && GameSystem.getInstance().ledlist != undefined) {
            for (var index = 0; index < GameSystem.getInstance().ledlist.length; index++) {
                var message = {
                    popView: "HallScene",
                    btn: "RollMsg",
                    data: GameSystem.getInstance().ledlist[index]
                };
                GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.SCENE_MSG, data: message });
            }
        }
    },

    onDestroy: function onDestroy() {
        this._super();
    },

    callBackBtnShare: function callBackBtnShare() {
        var ShareImagePath = GameCallOC.getInstance().screenShotAction();
        var shareView = cc.instantiate(this.ShareView);
        cc.director.getScene().addChild(shareView);
        var winSize = cc.director.getWinSize();
        shareView.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
        shareView.getComponent("ShareView").setShareTyep(ShareType.E_SHARETYPE_IMAGE, ShareImagePath, GameSystem.getInstance().clienturl);
    },

    onSceneMsg: function onSceneMsg(event) {
        var msg = event.data;
        if (msg.popView == "SettingView") {
            if (msg.btn == "BtnExitLogin") {
                SocketManager.getInstance().disconnect();
                cc.director.loadScene("LoadingScene");
            }
        } else if (msg.popView == "ProduceCell") {
            if (msg.btn == "callBtnBuy") {
                var WebView = cc.instantiate(this.WebView);
                this.node.addChild(WebView);
                var winSize = cc.director.getWinSize();
                WebView.setPosition(cc.p(-winSize.width, 0));
                WebView.getComponent('CusWebView').setWebViewUrl(msg.url);
            }
        } else if (msg.popView == "FindView") {
            if (msg.btn == "CallBackBtn") {
                var WebView = cc.instantiate(this.WebView);
                this.node.addChild(WebView);
                var winSize = cc.director.getWinSize();
                WebView.setPosition(cc.p(-winSize.width, 0));
                WebView.getComponent('CusWebView').setWebViewUrl(msg.url);
            }
        } else if (msg.popView == "RoomInfoView") {
            if (msg.btn == "BtnShare") {
                this.callBackBtnShare();
            }
        }
    },

    onMessage: function onMessage(event) {
        cc.log("HallScene.onMessage");
        this._super(event);

        var msg = event.data;
        var cmd = msg.cmd;

        switch (cmd) {
            case window.US_RESP_LOGIN_CMD_ID:
                this.onLoginMsg(msg);
                break;

            case window.US_RESP_CREATE_TABLE_CMD_ID:
            case window.CLUB_RESP_CREATE_TABLE_CMD_ID:
                this.onCreateRoomMsg(msg);
                break;

            case window.US_RESP_ENTER_GAME_CMD_ID:
                this.onEnterRoom(msg);
                break;

            case US_RESP_NEW_MSG_NUM_CMD_ID:
                this.showMsgTips();
                break;
        }

        if (msg.code < SocketRetCode.RET_SUCCESS) {
            LoadingView.dismiss();
        }
    },

    showMsgTips: function showMsgTips(msg) {
        this.RedTips.node.active = GameSystem.getInstance().NewMsgNum;
    },

    sendCreateTableCost: function sendCreateTableCost() {
        var msg = MessageFactory.createMessageReq(window.US_REQ_CREATE_COST_CMD_ID);
        if (msg) {
            cc.log("HallScene.sendCreateTableCost");
            msg.send();
        } else {
            cc.log("HallScene.sendCreateTableCost not found US_REQ_CREATE_COST_CMD_ID");
        }
    },

    sendClubUpgradeCost: function sendClubUpgradeCost() {
        var msg = MessageFactory.createMessageReq(window.US_REQ_CLUB_UPGRADE_COST_CMD_ID);
        if (msg) {
            cc.log("HallScene.sendClubUpgradeCost");
            msg.send();
        } else {
            cc.warn("HallScene.sendClubUpgradeCost not found US_REQ_CLUB_UPGRADE_COST_CMD_ID");
        }
    },

    sendMsgNum: function sendMsgNum() {
        MessageFactory.createMessageReq(US_REQ_NEW_MSG_NUM_CMD_ID).send();
    },

    onUserDetail: function onUserDetail(msg) {
        cc.log("HallScene.onUserDetail");
        GamePlayer.getInstance().gold = msg.gold;
        GamePlayer.getInstance().diamond = msg.diamond;
    },

    onLoginMsg: function onLoginMsg(msg) {
        cc.log("HallScene.onLoginMsg");
        if (msg.code == SocketRetCode.RET_SUCCESS) {}
    },

    onCreateRoomMsg: function onCreateRoomMsg(msg) {
        cc.log("HallScene.onCreateRoomMsg");
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            if (msg.privateid.length > 1) {
                return;
            }
            GameSystem.getInstance().roomLevel = msg.gamelevel;
            GameSystem.getInstance().privateid = msg.privateid[0];
            GameSystem.getInstance().gamesvcid = msg.gamesvcid;
            GameSystem.getInstance().tableid = msg.tableid;

            cc.log("onCreateRoomMsg");
            LoadingView.show("正在进入...");
            var createRoom = MessageFactory.createMessageReq(window.US_REQ_FIND_TABLE_CMD_ID);
            var data = {
                privateid: GameSystem.getInstance().privateid
            };
            if (createRoom) {
                createRoom.send(data);
            }

            return;

            var self = this;
            var alert = AlertView.create();
            alert.setPositiveButton(function () {
                LoadingView.show("正在进入...");
                var createRoom = MessageFactory.createMessageReq(window.US_REQ_FIND_TABLE_CMD_ID);
                var data = {
                    privateid: GameSystem.getInstance().privateid
                };
                if (createRoom) {
                    createRoom.send(data);
                }
            }, "进入游戏");
            alert.setNegativeButton(function () {
                var shareView = cc.instantiate(self.ShareView);
                self.node.addChild(shareView);
                shareView.setPosition(cc.p(0, 0));
                var string = "我在玩游戏［" + GameCallOC.getInstance().getAppName() + "］里创建了房间(" + GameSystem.getInstance().privateid + "),快点一起来玩吧！！！";
                shareView.getComponent("ShareView").setShareTyep(ShareType.E_SHARETYPE_LINK, string, GameSystem.getInstance().clienturl);
            }, "分享游戏");

            var string = "房间(" + GameSystem.getInstance().privateid + ")创建成功，快点分享给好友开始游戏吧";
            alert.show(string, AlertViewBtnType.E_BTN_CANCLE);
        }
    },

    onEnterRoom: function onEnterRoom(msg) {
        cc.log("HallScene.onEnterRoom,tableid = " + msg.name);
        if (msg.code == SocketRetCode.RET_SUCCESS) {}
    },

    popUpNotice: function popUpNotice() {
        if (GameSystem.getInstance().notice.doc != "") {
            var NoticeView = cc.instantiate(this.NoticeView);
            this.node.addChild(NoticeView);
            NoticeView.setPosition(cc.p(0, 0));
            NoticeView.getComponent('NoticeView').setContent();
        } else {
            cc.log("HallScene.popUpNotice,undefined");
        }
    },

    /*************************************BtnCallback***************************/
    callbackBtn: function callbackBtn(event, CustomEventData) {
        cc.log("HallScene.callbackBtn,CustomEventData = " + CustomEventData);
        var btnName = event.target.getName();
        cc.log("HallScene.callbackBtn,btnName = " + btnName);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if (btnName == "BtnCreateRoom") {
            this.doBtnCreateRoom();
        } else if (btnName == "BtnEnterRoom") {
            this.doBtnEnterRoom();
        } else if (btnName == "Club") {
            this.doBtnClub();
        }
    },

    doBtnShop: function doBtnShop() {
        cc.log("HallScene.doBtnShop");
        this.destroyChildNode();
        this.HallTitle.string = "游戏商城";
        this.PopNode.removeAllChildren(true);
        var shopView = cc.instantiate(this.ShopView);
        this.PopNode.addChild(shopView);
        shopView.setPosition(cc.p(0, 0));

        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
    },

    doBtnActivity: function doBtnActivity() {
        cc.log("HallScene.doBtnActivity");
    },

    destroyChildNode: function destroyChildNode() {
        var children = this.PopNode.children;
        for (var i = 0; i < children.length; ++i) {
            children[i].destroy();
        }
        this.stopRollMsg();
    },

    doBtnFind: function doBtnFind() {
        cc.log("HallScene.doBtnFind");
        this.destroyChildNode();
        this.HallTitle.string = "发现";
        this.PopNode.removeAllChildren(true);
        var findView = cc.instantiate(this.FindView);
        this.PopNode.addChild(findView);
        findView.setPosition(cc.p(0, 0));
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
    },

    doBtnSuccess: function doBtnSuccess() {
        cc.log("HallScene.doBtnSuccess");
        this.destroyChildNode();
        this.HallTitle.string = "战绩";
        this.PopNode.removeAllChildren(true);
        var successView = cc.instantiate(this.SuccessView);
        this.PopNode.addChild(successView);
        successView.setPosition(cc.p(0, 0));
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
    },

    doBtnMine: function doBtnMine() {
        cc.log("HallScene.doBtnMine");
        this.destroyChildNode();
        this.HallTitle.string = "我";
        this.PopNode.removeAllChildren(true);
        var mineView = cc.instantiate(this.MineView);
        this.PopNode.addChild(mineView);
        mineView.setPosition(cc.p(0, 0));
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
    },

    doBtnMore: function doBtnMore() {
        cc.log("HallScene.doBtnMore");
    },

    doBtnMain: function doBtnMain() {
        cc.log("HallScene.doBtnMain");
        this.destroyChildNode();
        this.PopNode.removeAllChildren(true);
        this.start();
        this.HallTitle.string = "51牛友会";
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
    },

    doBtnHead: function doBtnHead() {
        cc.log("HallScene.doBtnHead");
    },

    doBtnEnterRoom: function doBtnEnterRoom() {
        if (this.RoomIdEditBox.string == "") {
            ToastView.show("房间号不能为空！");
            return;
        }

        var roomId = Number(this.RoomIdEditBox.string);
        cc.log("HallScene.doBtnEnterRoom,roomId = " + roomId);
        LoadingView.show("正在进入...");
        var createRoom = MessageFactory.createMessageReq(window.US_REQ_FIND_TABLE_CMD_ID);
        var data = {
            privateid: roomId
        };
        if (createRoom) {
            createRoom.send(data);
        }
    },

    doBtnCreateRoom: function doBtnCreateRoom() {
        cc.log("HallScene.doBtnCreateRoom");
        var createRoom = cc.instantiate(this.Bullfight_CreateRoom);
        this.node.addChild(createRoom);
        createRoom.getComponent('Bullfight_CreateRoom').setClubId(0, 0);
        createRoom.setPosition(cc.p(0, 0));
        //createRoom.getComponent('Bullfight_CreateRoom').setRoomCardView();

        var createRoom = MessageFactory.createMessageReq(window.US_REQ_CREATE_TABLE_CMD_ID);
        if (createRoom) {
            createRoom.send();
        }
    },

    doBtnClub: function doBtnClub() {
        cc.log("HallScene.doBtnClub");
        this.PopNode.removeAllChildren(true);
        var clubView = cc.instantiate(this.ClubView);
        this.node.addChild(clubView);
        clubView.setPosition(cc.p(0, 0));
    }
});

cc._RFpop();
},{"AlertView":"AlertView","Audio_Common":"Audio_Common","BaseScene":"BaseScene","GameCallOC":"GameCallOC","GamePlayer":"GamePlayer","GameSystem":"GameSystem","HttpManager":"HttpManager","LoadingView":"LoadingView","MessageFactory":"MessageFactory","MusicMgr":"MusicMgr","Platform":"Platform","SocketManager":"SocketManager","ToastView":"ToastView"}],"HeartReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'bb090Rui4lPa6FyL8JrRYud', 'HeartReqPacket');
// Script\Network\Cmd\Cmd_Req\HeartReqPacket.js

"use strict";

/**
 * Created by shrimp on 17/2/22.
 */
var MessageReq = require("MessageReq");

function HeartReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_HEARTBEAT_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = HeartReqPacket;

cc._RFpop();
},{"MessageReq":"MessageReq"}],"HeartRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '4386ez0UShIYJA59rj0xycE', 'HeartRespPacket');
// Script\Network\Cmd\Cmd_Resp\HeartRespPacket.js

"use strict";

/**
 * Created by shrimp on 17/2/22.
 */
var MessageResp = require("MessageResp");

function HeartRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_HEARTBEAT_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        // GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = HeartRespPacket;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"HotUpdateManager":[function(require,module,exports){
"use strict";
cc._RFpush(module, '9412au1AQVAQLXdOR2a5vEv', 'HotUpdateManager');
// Script\Hotupdate\HotUpdateManager.js

"use strict";

/** 
 * 热更新管理
 * Author      : donggang
 * Create Time : 2016.7.29
 * 
 * 需求说明:
 * 1、可后台更新版本资源
 */

var AssetsManager = require("AssetsManager");

var amManager = cc.Class({
    ctor: function ctor() {
        this._updates = {}; // 更新模块集合
        this._queue = []; // 更新对列
        this._isUpdating = false; // 是否正在更新中
        this._current = null; // 当前正在更新的模块
        this._noComplete = {}; // 上次未完成的热更项
    },

    /** 
     * 获取模块版本信息 
     * @param localVersionCb(function)    本地版本信息加载完成
     * @param remoteVersionCb(function)   远程版本信息加载完成
     * 
     */
    getModules: function getModules(remoteVersionCb) {
        if (!cc.sys.isNative) {
            if (remoteVersionCb) remoteVersionCb();
            return;
        }

        game.asset.check(function (modules, versions) {
            this.modules = modules;
            this.versions = versions;
            if (remoteVersionCb) remoteVersionCb();
        }.bind(this));
    },

    /** 载入没更新完的模块状态 */
    load: function load() {
        if (!cc.sys.isNative) return;

        var data = cc.sys.localStorage.getItem("update_no_complete");
        if (data) {
            var json = JSON.parse(data);
            for (var i = 0; i < json.length; i++) {
                this._noComplete[json[i]] = json[i];
            }
            cc.sys.localStorage.removeItem("update_no_complete");
        }
    },

    getProgress: function getProgress(name) {
        var am = this._updates[name];
        return am.getProgress();
    },

    /**
     * 初始化更新模块名
     * @param name(string)                 模块名
     * @param onCheckComplete(function)    检查版本完成
     * @param onComplete(function)         模块名
     * @param onProgress(function)         更新完成
     * @param onNewVersion(function)       已是最新版本
     */
    init: function init(name, onCheckComplete, onComplete, onProgress, onNewVersion) {
        game.AssetConfig.concurrent = 2;

        var am = new AssetsManager();
        am.name = name;
        am.on(game.AssetEvent.NEW_VERSION, onNewVersion);
        am.on(game.AssetEvent.PROGRESS, onProgress);
        am.on(game.AssetEvent.FAILD, this._onFailed.bind(this));
        am.on(game.AssetEvent.NEW_VERSION_FOUND, this._onCheckComplete.bind(this));
        am.on(game.AssetEvent.SUCCESS, this._onUpdateComplete.bind(this));
        am.on(game.AssetEvent.REMOTE_VERSION_MANIFEST_LOAD_FAILD, this._onNetError.bind(this));
        am.on(game.AssetEvent.REMOTE_PROJECT_MANIFEST_LOAD_FAILD, this._onNetError.bind(this));
        am.on(game.AssetEvent.NO_NETWORK, this._onNetError.bind(this));
        am.onCheckComplete = onCheckComplete;
        am.onComplete = onComplete;

        this._updates[name] = am;
    },

    /** 是否没完成 */
    isNoComplete: function isNoComplete(name) {
        if (this._noComplete[name] == null) return false;

        return true;
    },

    /**
     * 检查版本是否需要更新
     */
    check: function check(name) {
        var am = this._updates[name];
        am.check(name);
    },

    /** 断网后恢复状态 */
    recovery: function recovery(name) {
        if (this._current && this._isUpdating == false) {
            this._isUpdating = true;
            this._current.recovery();
        }
    },

    _onFailed: function _onFailed(event) {
        this._isUpdating = false;
        event.target.check(event.target.name);
    },

    _onNetError: function _onNetError(event) {
        this._isUpdating = false;
    },

    /** 检查版本完成 */
    _onCheckComplete: function _onCheckComplete(event) {
        this._queue.push(event.target);

        // 保存下在下载的模块状态
        this._saveNoCompleteModule();

        if (event.target.onCheckComplete) event.target.onCheckComplete();

        if (this._isUpdating == false) {
            this._isUpdating = true;
            this._current = event.target;
            this._current.update();
        }
    },

    _onUpdateComplete: function _onUpdateComplete(event) {
        if (event.target.onComplete) event.target.onComplete();

        // 删除当前完成的更新对象
        this._queue.shift();
        this._isUpdating = false;

        // 保存下在下载的模块状态
        this._saveNoCompleteModule();

        // 更新对列中下一个更新对象
        if (this._queue.length > 0) {
            this._isUpdating = true;
            this._current = this._queue[0];
            this._current.update();
        }
    },

    // 保存下在下载的模块状态
    _saveNoCompleteModule: function _saveNoCompleteModule() {
        var names = [];
        for (var i = 0; i < this._queue.length; i++) {
            names.push(this._queue[i].name);
        }
        cc.sys.localStorage.setItem("update_no_complete", JSON.stringify(names));
    }
});

cc._RFpop();
},{"AssetsManager":"AssetsManager"}],"HttpConfig":[function(require,module,exports){
"use strict";
cc._RFpush(module, '56ce19ep3hMPLbgdA6/FCdr', 'HttpConfig');
// Script\Network\Http\HttpConfig.js

"use strict";

/**
 * Created by shrimp on 17/2/19.
 */

//http消息返回code
window.HttpCode = cc.Enum({
    HTTP_SUCCESS: 0,
    HTTP_JSON_ERROR: 1, //参数错误
    HTTP_MYSQL_ERROR: 2 });

/**
 * http消息
 */
window.HttpMessage = "HttpMessage";

//http消息类型
window.HttpMessageType = cc.Enum({
    HTTP_NOTIFICATION: "http_notification",
    NOTIFY_HTTP_RSP: "notify_http_rsp",
    NOTIFY_HTTP_RSP_ERROR: "notify_http_rsp_error",
    NOTIFY_HTTP_RSP_IMG: "notify_http_rsp_img",
    IMAGE_LOADER: "image_loader"
});

/**
 * http请求
 */
window.HttpTag = {
    HTTP_TAG_GET_ROUTER: "GetRouter",
    HTTP_TAG_LOGIN: "login",
    HTTP_TAG_GAMECONFIG: "gameconfig"
};

/**
 * 本地消息 主命令
 */
window.LocalMessage = "LocalMessage";

/**
 * 本地消息类型
 */
window.LocalMsgType = {
    GetRoomConfig: "getroomconfig", //获取房间配置
    GetAllRoomConfig: "allRoomConfig", //所有房间配置数据
    GetLoginInfo: "getloginInfo", //登录结果
    EnterGame: "enterGame", // 请求进入房间
    EnterRoom: "enterRoom", // 请求进入游戏
    SENDMSG_TIMEOUT: "sendmsg_timeout", //发送消息回传超时
    SENDMSG_CLOSESERVER: "sendmsg_closeserver",
    UPDATE_USERINFO: "update_userInfo", //更新玩家信息
    UPDATE_OnlineNum: "UPDATE_OnlineNum", //在线人数
    UPDATEHISTORY: "updatehistory",
    UPDATEBANKERLIST: "updatebankerlist",
    GetPassWord: "getPassWord", //找回密码
    GetGameSwitchNotice: "GetGameSwitchNotice", //获取游戏开关信息通知
    GetGameDomainNotice: "GetGameDomainNotice", //获取游戏路由信息通知
    UPDATE_MONEY: "UpdateMoney",
    //资源更新
    UPDATE_OK_MESSAGE: "UPDATE_OK_MESSAGE", //确定更新消息
    UPDATE_CANCEL_MESSAGE: "UPDATE_CANCEL_MESSAGE", //取消更新消息
    UPDATE_MESSAGE: "UPDATE_MESSAGE", //更新消息
    UPDATE_END_MESSAGE: "UPDATE_END_MESSAGE", //更新完成消息
    UPDATE_NOT_MESSAGE: "UPDATE_NOT_MESSAGE", //不需要更新消息
    UPDATE_NEED_MESSAGE: "UPDATE_NEED_MESSAGE" };

var HttpConfig = function () {
    var instance;

    function getInstance() {
        if (instance === undefined) {
            instance = new init();
        }
        return instance;
    };

    function init() {
        return {
            //cid: 141 ,
            //pid :window.PRODUCT_ID,
            //cctype : 2 ,
        };
    };
    return {
        getInstance: getInstance
    };
}();

module.exports = HttpConfig;

cc._RFpop();
},{}],"HttpManager":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'cadeeDWV2hHb4wZqIKLiPrt', 'HttpManager');
// Script\Network\Http\HttpManager.js

"use strict";

/**
 * Created by shrimp on 17/2/19.
 */

/**
 * 模拟 C++ 工程架构
 *
 * 使用的XMLHttpRequest  需要解决跨域问题
 * 服务器加上head
 *
 * jQuery 网页可以  但是不能上手机
 *
 */
var GameSystem = require('GameSystem');

function HttpMessage() {
    this.isSucceed = false;
    this.tag = "";
    this.data = null;
    this.code = -1;
    this.error = "";
    this.flag = -1;
}

function HttpMessageGetDoman() {
    HttpMessage.apply(this, []); //集成父类数据
    this.strUcenterUrl;
}

function HttpMessageGetWlanIP() {
    HttpMessage.apply(this, []); //集成父类数据
}

function ImageHolder() {

    this.img = null;
    this.tag = "";
}

function HttpRequest(tag, data, url, type, callback) {
    cc.log("HttpManager.HttpRequest,url = " + url);
    this.tag = tag;
    this.url = url;
    this.callBack = callback;

    var self = this;

    this.sendRequest = function () {
        var self = this;
        var xhr = new XMLHttpRequest();
        var url = this.url;
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 400) {
                    var response = xhr.responseText;
                    if (self.callBack) {
                        self.callBack(this, response);
                    } else {
                        self.success_jsonpCallback(JSON.parse(response));
                    }
                } else {
                    var response = xhr.responseText;
                    cc.log("HttpManager.sendRequest,xhr.status = %d,response = %s", xhr.status, response);
                    var message = new HttpMessage();
                    message.data = null;
                    message.isSucceed = false;

                    GlobalEventManager.getInstance().emitEvent(window.HttpMessage, { tag: window.HttpMessageType.HTTP_NOTIFICATION, msg: message });
                }
            }
            cc.log("HttpManager.sendRequest,xhr.readyState = %d", xhr.readyState);
        };

        xhr.open(type, url + tag, true);
        // xhr.setRequestHeader("Access-Control-Allow-Origin","*");
        xhr.setRequestHeader("CONTENT-TYPE", "application/x-www-form-urlencoded");
        var result = xhr.send(data);
        cc.log("HttpManager.sendRequest,result = " + result);
    };

    this.fail_jsonpCallback = function () {},

    //成功回调
    this.success_jsonpCallback = function (data) {
        var message = new HttpMessage();
        message.tag = tag;
        message.code = data.code;
        if (data.code == window.HttpCode.HTTP_SUCCESS) {
            message.data = data;
            message.isSucceed = true;
            cc.log("http 请求成功 : %s = %s", tag, JSON.stringify(data));
        } else {
            message.data = data;
            message.isSucceed = false;
            cc.warn("http 请求返回异常 非success flag : %s = %s", tag, JSON.stringify(data));
        }

        GlobalEventManager.getInstance().emitEvent(window.HttpMessage, { tag: window.HttpMessageType.HTTP_NOTIFICATION, msg: message });
    };
}

function HttpControl(callback) {
    this.callBack = callback;
}

//发送普通消息
HttpControl.prototype.sendCommonRequest = function (tag, data, url) {
    if (url === undefined) {
        url = GameSystem.getInstance().weburl + "/";
    }

    var sendData = JSON.stringify(data); //encodeURI(JSON.stringify(test));
    new HttpRequest(tag, sendData, url, "post").sendRequest();
    cc.log("发送http请求 = %s  : %s : %s", tag, JSON.stringify(data), sendData);
};

HttpControl.prototype.sendCommonRequestGet = function (tag, data, url) {
    if (url === undefined) {
        url = GameSystem.getInstance().weburl + "/";
    }

    var sendData = JSON.stringify(data); //encodeURI(JSON.stringify(test));
    new HttpRequest(tag, sendData, url, "get").sendRequest();
    cc.log("发送http请求 = %s  : %s : %s", tag, JSON.stringify(data), sendData);
};

//数据加密
HttpControl.prototype.base64EncodeData = function (data) {
    var encodedData = BASE64.encoder(data);

    var md5str = hex_md5(encodedData);

    var encodedData2 = BASE64.encoder(encodedData + md5str);
    return encodedData2;
};

HttpControl.prototype.base64DecodeData = function (data) {
    var encodedData = BASE64.decoder(data);

    if (encodedData.length > 32) {
        encodedData = encodedData.substr(0, encodedData.length - 32);
        var encodedData2 = BASE64.decoder(encodedData);
        return encodedData2;
    }
    return "";
};

HttpControl.prototype.sendUploadImg = function (tag, url, data) {
    if (url = undefined) {
        url = "http://manage.aqddp.cn/Home/Picupload/upload";
    }
    //var sendData = JSON.stringify(data);//encodeURI(JSON.stringify(test));
    new HttpRequest(tag, data, url, "post").sendRequest();
    cc.log("发送http请求 = %s  : %s ", tag, data);
};

/**
 * 创建HttpManager接口
 * @method getInstance
 */
var HttpManager = function () {
    var instance;
    function getInstance() {
        if (instance === undefined) {
            instance = new HttpControl();
        }
        return instance;
    };

    return {
        getInstance: getInstance
    };
}();

module.exports = HttpManager;

cc._RFpop();
},{"GameSystem":"GameSystem"}],"HttpPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e9499W5MNJFDL7ZFeGQbLbs', 'HttpPacket');
// Script\Network\Http\HttpPacket.js

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

cc._RFpop();
},{}],"HttpRequest":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'be1b7vWJopMapy96MVvG2IX', 'HttpRequest');
// Script\Hotupdate\HttpRequest.js

"use strict";

/** 
 * 游戏服务器管理
 * Author      : donggang
 * Create Time : 2016.8.19
 */
var HttpRequest = {};
var urls = {}; // 当前请求地址集合

game.HttpEvent = {};
game.HttpEvent.NO_NETWORK = "http_request_no_network"; // 断网
game.HttpEvent.UNKNOWN_ERROR = "http_request_unknown_error"; // 未知错误

game.http = module.exports = {
    /**
     * HTTP GET请求
     * 例：
     * 
     * Get
        var url = "http://httpbin.org/get?show_env=1";
        var complete = function(response){
               
            cc.log(response);
        }
        var error = function(response){
            cc.log(response);
        }
        game.HttpRequest.get(url, complete, error);
    */
    get: function get(url, completeCallback, errorCallback) {
        game.http.sendRequest(url, null, false, completeCallback, errorCallback);
    },

    getByArraybuffer: function getByArraybuffer(url, completeCallback, errorCallback) {
        game.http.sendRequest(url, null, false, completeCallback, errorCallback, 'arraybuffer');
    },

    getWithParams: function getWithParams(url, params, completeCallback, errorCallback) {
        game.http.sendRequest(url, params, false, completeCallback, errorCallback);
    },

    getWithParamsByArraybuffer: function getWithParamsByArraybuffer(url, params, callback, errorCallback) {
        game.http.sendRequest(url, params, false, completeCallback, errorCallback, 'arraybuffer');
    },

    /** 
     * HTTP POST请求
     * 例：
     *      
     * Post
        var url = "http://192.168.1.188/api/LoginNew/Login1";
        var param = '{"LoginCode":"donggang_dev","Password":"e10adc3949ba59abbe56e057f20f883e"}'
        var complete = function(response){
                var jsonData = JSON.parse(response);
                var data = JSON.parse(jsonData.Data);
            cc.log(data.Id);
        }
        var error = function(response){
            cc.log(response);
        }
        game.HttpRequest.post(url, param, complete, error);
    */
    post: function post(url, params, completeCallback, errorCallback) {
        game.http.sendRequest(url, params, true, completeCallback, errorCallback);
    },

    /**
     * 获得字符串形式的参数
     */
    _getParamString: function _getParamString(params) {
        var result = "";
        for (var name in params) {
            result += "{0}={1}&".format(name, params[name]);
        }

        return result.substr(0, result.length - 1);
    },

    /** 
     * Http请求 
     * @param url(string)               请求地址
     * @param params(JSON)              请求参数
     * @param isPost(boolen)            是否为POST方式
     * @param callback(function)        请求成功回调
     * @param errorCallback(function)   请求失败回调
     * @param responseType(string)      响应类型
     */
    sendRequest: function sendRequest(url, params, isPost, completeCallback, errorCallback, responseType) {
        if (url == null || url == '') return;

        var newUrl;
        if (params) {
            newUrl = url + "?" + this._getParamString(params);
        } else {
            newUrl = url;
        }

        if (urls[newUrl] != null) {
            cc.warn("地址【{0}】已正在请求中，不能重复请求".format(url));
            return;
        }

        // 防重复请求功能
        urls[newUrl] = true;

        var xhr = cc.loader.getXMLHttpRequest();
        if (isPost) {
            xhr.open("POST", url);
        } else {
            xhr.open("GET", newUrl);
        }

        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

        xhr.onerror = function () {
            delete urls[newUrl];
            if (errorCallback == null) return;
            if (xhr.readyState == 1 && xhr.status == 0) {
                errorCallback(game.HttpEvent.NO_NETWORK); // 断网
            } else {
                errorCallback(game.HttpEvent.UNKNOWN_ERROR); // 未知错误
            }
        };

        xhr.onreadystatechange = function () {
            if (xhr.readyState != 4) return;

            delete urls[newUrl];
            if (xhr.status == 200) {
                if (completeCallback) {
                    if (responseType == 'arraybuffer') {
                        xhr.responseType = responseType;
                        completeCallback(xhr.response); // 加载非文本格式
                    } else {
                        completeCallback(xhr.responseText); // 加载文本格式
                    }
                }
            } else {
                if (errorCallback) errorCallback(xhr.status);
            }
        };

        if (params == null || params == "") {
            xhr.send();
        } else {
            xhr.send(JSON.stringify(params));
        }
    }
};

cc._RFpop();
},{}],"JoinClubReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '7cdbehwmIBHH4iycQzRpQRH', 'JoinClubReqPacket');
// Script\Network\Cmd\Cmd_Req\JoinClubReqPacket.js

'use strict';

/**
 * Created by shrimp on 17/4/9.
 */

var MessageReq = require("MessageReq");
var GamePlayer = require('GamePlayer');
var GameSystem = require('GameSystem');
/*
*
* type CLUB_REQ_JOIN_CLUB_T struct {
 ClubHead
 Param PARAM_REQ_JOIN_T `json:"param"`
 }
 type PARAM_REQ_JOIN_T struct {
 Uid     uint32 `json:"uid"`
 Name    string `json:"name"`
 HeadUrl string `json:"headurl"`
 Sex     int    `json:"sex"`
 }*/
function JoinClubReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.CLUB_REQ_JOIN_CLUB_CMD_ID;

    //准备发送的数据
    this.send = function (clubid, msg) {
        cc.log("JoinClubReqPacket.send");

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            clubid: clubid,
            param: msg
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = JoinClubReqPacket;

cc._RFpop();
},{"GamePlayer":"GamePlayer","GameSystem":"GameSystem","MessageReq":"MessageReq"}],"JoinClubRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '8d98bk/yNRFlpPHES8AO448', 'JoinClubRespPacket');
// Script\Network\Cmd\Cmd_Resp\JoinClubRespPacket.js

"use strict";

/**
 * Created by shrimp on 17/4/9.
 */
var MessageResp = require("MessageResp");
/*
* type CLUB_RESP_JOIN_CLUB_T struct {
 JsonHead
 RespHead
 Param PARAM_RESP_JOIN_T `json:"param"`
 }
 type PARAM_RESP_JOIN_T struct {
 ClubId  int    `json:"clubid"`
 Uid     uint32 `json:"uid"`
 isallow
 Name    string `json:"name"`
 HeadUrl string `json:"headurl"`
 Sex     int    `json:"sex"`
 Role    uint8  `json:"role"`
 }
* */
function JoinClubRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.CLUB_RESP_JOIN_CLUB_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.param = msg.param;
    };
}

module.exports = JoinClubRespPacket;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"LeaveGameReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'b66cd7ihkhLI5U2TsVFCkHp', 'LeaveGameReqPacket');
// Script\Network\Cmd\Cmd_Req\LeaveGameReqPacket.js

'use strict';

/**
 * Created by shrimp on 17/2/26.
 */
var MessageReq = require("MessageReq");
var GamePlayer = require('GamePlayer');
var GameSystem = require('GameSystem');

function LeaveGameReqPacket() {
  MessageReq.apply(this, []); //集成父类数据

  this.cmd = window.US_REQ_LEAVE_GAME_CMD_ID;

  //准备发送的数据
  this.send = function (msg) {
    cc.log("LeaveGameReqPacket.send");
    this.data = {
      cmd: this.cmd,
      seq: this.seq,
      uid: this.uid,
      gamesvcid: GameSystem.getInstance().gamesvcid,
      tableid: GameSystem.getInstance().tableid
    };

    GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
  };
}

module.exports = LeaveGameReqPacket;

/*
 //离开游戏
 type US_REQ_LEVEL_GAME_T struct {
 GameHead
 }

 type US_RESP_LEVEL_GAME_T struct {
 JsonHead
 RespHead
 Param string `json:"param"`
 }

 //请求坐下
 const (
 E_DOWN_TYPE = 1 //坐下
 E_RISE_TYPE = 2 //站起
 )

 type US_REQ_SIT_DOWN_T struct {
 GameHead
 SeatId int `json:"seatid"`
 Status int `json:"status"` //1. 坐下，2：站起
 }

 type US_RESP_SIT_DOWN_T struct {
 JsonHead
 RespHead
 Param string `json:"param"`
 }

 //请求携带金币
 type US_REQ_CARRY_COIN_T struct {
 GameHead
 Coin int64 `json:"coin"`
 }

 //如果uid == carryuid, 是自己
 type US_RESP_CARRY_COIN_T struct {
 JsonHead
 RespHead         //同意坐着，拒绝站起
 CarryUid  uint32 `json:"carryuid"`
 CarryCoin int64  `json:"carrycoin"`
 }
 周学士 C++  20:35:01

 //桌主确定玩家是否入坐
 const (
 E_ALLOW_TO_SIT  = 1
 E_REJECT_TO_SIT = 2
 )

 type US_REQ_OWNER_CONFIRM_T struct {
 GameHead
 PlayerUid uint32 `json:"playeruid"`
 Result    int    `json:"result"`
 }

 type US_RESP_OWNER_CONFIRM_T struct {
 JsonHead
 RespHead
 }
*
* */

cc._RFpop();
},{"GamePlayer":"GamePlayer","GameSystem":"GameSystem","MessageReq":"MessageReq"}],"LeaveGameRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '16d5eL79ehKiJalU3LEYv93', 'LeaveGameRespPacket');
// Script\Network\Cmd\Cmd_Resp\LeaveGameRespPacket.js

"use strict";

/**
 * Created by shrimp on 17/2/26.
 */

var MessageResp = require("MessageResp");

function LeaveGameRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_LEAVE_GAME_CMD_ID;

    this.param = "";
    this.tableid = 0;
    this.leaveuid = 0;
    //接收的数据
    this.onMessage = function (msg) {
        //{"cmd":6553604,"seq":4,"uid":10042,"code":0,"desc":"执行成功"}
        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
    };
}

module.exports = LeaveGameRespPacket;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"LoadingScene":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'ad32apQgcZNFbpz02GremG8', 'LoadingScene');
// Script\ComScene\SceneView\LoadingScene.js

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

cc._RFpop();
},{"AlertView":"AlertView","Audio_Common":"Audio_Common","BaseScene":"BaseScene","GameCallOC":"GameCallOC","GamePlayer":"GamePlayer","GameSystem":"GameSystem","HttpManager":"HttpManager","LoadingView":"LoadingView","MusicMgr":"MusicMgr","Platform":"Platform","SocketManager":"SocketManager","ToastView":"ToastView","UtilTool":"UtilTool","WeChatApi":"WeChatApi"}],"LoadingView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '44a72oCdr1Lt4vafscFHEM8', 'LoadingView');
// Script\ComScene\PopView\LoadingView.js

"use strict";

var ToastView = require("ToastView");
var LoadingView = require('LoadingView');

var LoadingView = {};

LoadingView.curView = null;
LoadingView.tipText = null;
LoadingView.timeoutTag = 0; //超时回调句柄

//预防未加载完成 调用关闭
LoadingView.callClose = false;
LoadingView.callLoadPrefabs = false;
LoadingView.m_tips = "";
LoadingView.m_allowCLose = false;

LoadingView.show = function (tips, parent, allowClose) {
    cc.log("LoadingView.show,tips = " + tips);
    if (tips == "") {
        return;
    }
    this.dismiss();
    var self = this;
    this.m_tips = tips;
    this.m_allowCLose = allowClose === undefined ? false : allowClose;

    if (!self.callLoadPrefabs) {
        this.callLoadPrefabs = true;
        window.loadPrefabs("prefabs/LoadingView/LoadingView", function (newNode) {
            self.callLoadPrefabs = false;
            self.curView = newNode;
            if (self.callClose) {
                self.dismiss();
            } else {
                cc.log("LoadingView.show,111");
                self.updateView(newNode, self.m_tips, parent, self.m_allowCLose);
            }
        }, parent);
    } else {
        self.callClose = false;
    }
};

LoadingView.updateView = function (node, tips, parent, allowClose) {

    cc.log("LoadingView.updateView");
    node.on(cc.Node.EventType.TOUCH_START, function (event) {
        event.stopPropagation();
    });

    this.tipText = cc.find("Bg/LabelText", node).getComponent(cc.Label);
    if (tips) {
        this.setText(tips);
    }

    // var clodeBt = cc.find("close",node);
    //
    // var self = this ;
    // clodeBt.on(cc.Node.EventType.TOUCH_START,function () {
    //     self.dismiss() ;
    // });

    //屏蔽关闭 YUNG ADD
    var showClose = false; //allowClose === undefined? true : false ;

    //clodeBt.active = showClose;
    //
    // var aniLoading = cc.find("ani",node).getComponent(cc.Animation) ;
    //
    // var animState = aniLoading.play("loadingani");
    // animState.wrapeMode = cc.WrapMode.Loop;
    // animState.repeatCount = Infinity;
};

LoadingView.setTimeOut = function (time) {
    cc.log("LoadingView.setTimeOut,time = " + time);
    if (time && time > 0) {
        var self = this;
        this.timeoutTag = window.setTimeout("require('LoadingView').onTimeOut()", time * 1000);
        // this.scheduleOnce(function () {//component组件使用
        //     self.onTimeOut();
        // },time) ;
    }
};

LoadingView.onTimeOut = function () {
    cc.log("LoadingView.onTimeOut");
    // this.unschedule(this.onTimeOut);
    ToastView.show("网络请求超时");
    this.dismiss();
}, LoadingView.setText = function (tips) {
    cc.log("LoadingView.setText,tips = " + tips);
    if (this.tipText) {
        this.tipText.string = tips;
    } else {
        this.show(tips);
    }
}, LoadingView.dismiss = function () {
    cc.log("LoadingView.dismiss");
    if (this.timeoutTag) window.clearTimeout(this.timeoutTag);

    if (this.curView) {
        this.curView.removeFromParent(true);
        this.curView = null;
        this.tipText = null;
        this.callClose = false;
        this.callLoadPrefabs = false;
        this.m_tips = "";
        this.m_allowCLose = false;
    } else {
        // if( this.callLoadPrefabs){
        //     this.callClose = true ;
        // }
    }
};

module.exports = LoadingView;

cc._RFpop();
},{"LoadingView":"LoadingView","ToastView":"ToastView"}],"LoginReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '9dbc3VeDpRKWINvGky0DgTX', 'LoginReqPacket');
// Script\Network\Cmd\Cmd_Req\LoginReqPacket.js

'use strict';

/**
 * Created by shrimp on 17/2/22.
 */

var MessageReq = require("MessageReq");
var GamePlayer = require('GamePlayer');
var GameSystem = require('GameSystem');
var Platform = require('Platform');

function LoginReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_LOGIN_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            logintype: GameSystem.getInstance().CustomLoginType,
            unionid: GamePlayer.getInstance().unionid,
            openid: GamePlayer.getInstance().openid,
            nickname: GamePlayer.getInstance().name,
            headurl: GamePlayer.getInstance().headurl,
            sex: GamePlayer.getInstance().sex,
            // deviceid:   "927A79F7-2CEA-4711-B3A8-56D52CB9387F",
            deviceid: Platform.getInstance().generateUUID(),
            productid: GameSystem.getInstance().productid,
            platform: Platform.getInstance().getPlatformType()
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = LoginReqPacket;

cc._RFpop();
},{"GamePlayer":"GamePlayer","GameSystem":"GameSystem","MessageReq":"MessageReq","Platform":"Platform"}],"LoginRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'b02b9bGh39K5oCFrNaip58c', 'LoginRespPacket');
// Script\Network\Cmd\Cmd_Resp\LoginRespPacket.js

"use strict";

/**
 * Created by shrimp on 17/2/22.
 */
var MessageResp = require("MessageResp");
var GameSystem = require("GameSystem");
var GamePlayer = require("GamePlayer");

function LoginRespPacket() {
    MessageResp.apply(this, []); //集成父类数据


    //{"cmd":65540,"seq":15,"uid":11298,"code":0,"desc":"","nickname":"游客11298",
    // "headurl":"","sex":2,"gold":10000,"diamond":10000,"userkey":"b79195adee39be05d5189f7fc1149e08",
    // "clienturl":"","fileurl":"http://manage.aqddp.cn/","weixincs":"niuyouquan1,niuyouquan2",
    // "payurl":"http://baidu.com/","notice":{"title":"hello","doc":"欢迎大家来到牛友圈",
    // "writer":"xxx","time":1491476875,"popup":0,"ismaintain":0}}

    this.cmd = window.US_RESP_LOGIN_CMD_ID;
    this.nickname = "";
    this.headurl = "";
    this.sex = 0;
    this.gold = 0;
    this.diamond = 0;
    this.userkey = "";
    this.notice = {
        title: "",
        doc: "",
        writer: "",
        popup: 0,
        ismaintain: 0,
        time: 0
    };
    this.clienturl = "";
    this.fileurl = "";
    this.weixincs = "";
    this.payurl = "";

    // 接收的数据
    // {"cmd":65540,"seq":15,"uid":11298,"code":0,"desc":"","nickname":"游客11298",
    // "headurl":"","sex":2,"gold":10000,"diamond":10000,"userkey":"b79195adee39be05d5189f7fc1149e08",
    // "clienturl":"","fileurl":"http://manage.aqddp.cn/","weixincs":"niuyouquan1,niuyouquan2",
    // "payurl":"http://baidu.com/","notice":{"title":"hello","doc":"欢迎大家来到牛友圈",
    // "writer":"xxx","time":1491476875,"popup":0,"ismaintain":0}}
    this.onMessage = function (msg) {
        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;

        GamePlayer.getInstance().uid = msg.uid;
        GamePlayer.getInstance().name = msg.nickname;
        GamePlayer.getInstance().headurl = msg.headurl;
        GamePlayer.getInstance().sex = msg.sex;
        GamePlayer.getInstance().gold = msg.gold;
        GamePlayer.getInstance().diamond = msg.diamond;
        GamePlayer.getInstance().userkey = msg.userkey;
        GameSystem.getInstance().notice.title = msg.notice.title;
        GameSystem.getInstance().notice.doc = msg.notice.doc;
        GameSystem.getInstance().notice.writer = msg.notice.writer;
        GameSystem.getInstance().notice.popup = msg.notice.popup;
        GameSystem.getInstance().notice.ismaintain = msg.notice.ismaintain;
        GameSystem.getInstance().notice.time = msg.notice.time;
        GameSystem.getInstance().clienturl = msg.clienturl;
        GameSystem.getInstance().fileurl = msg.fileurl;
        GameSystem.getInstance().weixincs = msg.weixincs;
        GameSystem.getInstance().payurl = msg.payurl;
        GameSystem.getInstance().referralCode = msg.referralid;
        GameSystem.getInstance().ledlist = msg.ledlist;

        GameSystem.getInstance().aesKey = AES.utils.utf8.toBytes(msg.userkey);
    };
}

module.exports = LoginRespPacket;

cc._RFpop();
},{"GamePlayer":"GamePlayer","GameSystem":"GameSystem","MessageResp":"MessageResp"}],"MessageCellDetailView":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e4016kft6pMooCvNuHxuMbD', 'MessageCellDetailView');
// Script\ComScene\PopView\MessageCellDetailView.js

'use strict';

var BasePop = require("BasePop");
var MessageFactory = require('MessageFactory');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require("GameSystem");
cc.Class({
    extends: BasePop,

    properties: {
        Content: cc.Label,
        Time: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {},

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    callBackBtn: function callBackBtn(event, CustomEventData) {
        cc.log("MessageCellDetailView.callbackBtn,CustomEventData = " + CustomEventData);
        var btnName = event.target.getName();
        cc.log("MessageCellDetailView.callbackBtn,btnName = " + btnName);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if (btnName == "BtnClose") {
            this.dismiss();
        }
    },

    setContent: function setContent(msg) {
        this.Content.string = BASE64.decoder(msg.msg);
        if (msg.type == 1) return;
        var data = {
            type: msg.type,
            msgid: msg.msgid
        };
        MessageFactory.createMessageReq(US_REQ_SET_MSG_READ_CMD_ID).send(data);
    }
});

cc._RFpop();
},{"Audio_Common":"Audio_Common","BasePop":"BasePop","GameSystem":"GameSystem","MessageFactory":"MessageFactory","MusicMgr":"MusicMgr"}],"MessageCell":[function(require,module,exports){
"use strict";
cc._RFpush(module, '7c276nXgHVDSoKL/4mYJTLw', 'MessageCell');
// Script\ComScene\PopView\MessageCell.js

'use strict';

var UtilTool = require('UtilTool');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require("GameSystem");

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        Time: cc.Label,
        Content: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.msg = null;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    setMessageCellMsg: function setMessageCellMsg(msg) {
        this.msg = msg;
        this.Content.string = BASE64.decoder(msg.msg);
        this.Time.string = UtilTool.getFormatDataDetail(msg.time);
        cc.log('MessageCell.setMessageCellMsg,msg = ' + JSON.stringify(msg));
    },

    callbackBtn: function callbackBtn(event, CustomEventData) {
        cc.log("MessageCell.callbackBtn,CustomEventData = " + CustomEventData);
        var btnName = event.target.getName();
        cc.log("MessageCell.callbackBtn,btnName = " + btnName);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if (btnName == "Click") {
            this.dismiss();
        }
    }

});

cc._RFpop();
},{"Audio_Common":"Audio_Common","GameSystem":"GameSystem","MusicMgr":"MusicMgr","UtilTool":"UtilTool"}],"MessageDetailView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '1e8b4heBP5I5aZt8IEiTB/B', 'MessageDetailView');
// Script\ComScene\PopView\MessageDetailView.js

'use strict';

var BasePop = require('BasePop');
var MessageFactory = require('MessageFactory');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require("GameSystem");

cc.Class({
    extends: BasePop,

    properties: {
        scrollView: cc.ScrollView,
        MessageCell: cc.Prefab,
        MessageCellDetailView: cc.Prefab,
        SitReqCell: cc.Prefab
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._super();
        this.type = 0;
    },

    /*********************Network***************************/

    onMessage: function onMessage(event) {
        cc.log("MessageDetailView.onMessage");
        //this._super(event);
        var msg = event.data;
        var cmd = msg.cmd;
        switch (cmd) {
            case US_RESP_MSG_LIST_CMD_ID:
                this.onGetMessageList(msg);
                break;

            case CLUB_RESP_OWNER_CONFIRM_CMD_ID:
                cc.log("MessageDetailView.onMessage CLUB_RESP_OWNER_CONFIRM_CMD_ID");
                break;
        }
    },

    sendGetMsgList: function sendGetMsgList(type) {
        this.type = type;
        var data = {
            type: type,
            start: 0,
            total: 50
        };
        MessageFactory.createMessageReq(US_REQ_MSG_LIST_CMD_ID).send(data);
    },

    onGetMessageList: function onGetMessageList(msg) {
        if (msg.code != SocketRetCode.RET_SUCCESS) {
            return;
        }

        if (msg.list == null || msg.list == undefined) {
            return;
        }

        if (msg.type == 1) {
            //系统消息
            var cellHeight = 0;
            this.scrollView.content.removeAllChildren(true);

            for (var index = 0; index < msg.list.length; index++) {
                var json = BASE64.decoder(msg.list[index].msg);
                cc.log("MessageDetailView.onMsgList,json = " + json);
                var MessageCell = cc.instantiate(this.MessageCell);
                this.scrollView.content.addChild(MessageCell);
                cellHeight = MessageCell.getContentSize().height;
                MessageCell.setPosition(cc.p(0, -MessageCell.getContentSize().height * (index + 0.5)));
                MessageCell.getComponent('MessageCell').setMessageCellMsg(msg.list[index]);
                var self = this;
                MessageCell.on(cc.Node.EventType.TOUCH_END, function (event) {
                    var msg = event.target.getComponent('MessageCell').msg;
                    self.createMessageCellDetailView(msg);
                }.bind(this));
            }

            if (cellHeight * msg.list.length > this.scrollView.content.height) {
                this.scrollView.content.height = cellHeight * msg.list.length;
            }
        } else if (msg.type == 2) {
            //俱乐部消息

            this.scrollView.content.removeAllChildren(true);
            var _cellHeight = 0;

            for (var index = 0; index < msg.list.length; index++) {
                var json = BASE64.decoder(msg.list[index].msg);
                msg.list[index].msg = JSON.parse(json);
                cc.log("MessageView.onMsgList,msg.list[index].msg = ", msg.list[index].msg);

                var SitReqCell = cc.instantiate(this.SitReqCell);
                this.scrollView.content.addChild(SitReqCell);
                _cellHeight = SitReqCell.getContentSize().height;
                SitReqCell.setPosition(cc.p(0, -SitReqCell.getContentSize().height * (index + 1)));
                SitReqCell.getComponent("SitReqCell").setMessageInfo(msg.list[index], 2);
            }
            if (_cellHeight * (msg.list.length + 1) > this.scrollView.content.height) {
                this.scrollView.content.height = _cellHeight * (msg.list.length + 1);
            }
        }
    },

    createMessageCellDetailView: function createMessageCellDetailView(msg) {
        var MessageCellDetailView = cc.instantiate(this.MessageCellDetailView);
        this.node.addChild(MessageCellDetailView);
        MessageCellDetailView.setPosition(cc.p(0, 0));
        MessageCellDetailView.getComponent('MessageCellDetailView').setContent(msg);
    },

    callbackBtn: function callbackBtn(event, CustomEventData) {
        cc.log("MessageDetailView.callbackBtn,CustomEventData = " + CustomEventData);
        var btnName = event.target.getName();
        cc.log("MessageDetailView.callbackBtn,btnName = " + btnName);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if (btnName == "BtnClose") {
            this.dismiss();
        }
    }

});

cc._RFpop();
},{"Audio_Common":"Audio_Common","BasePop":"BasePop","GameSystem":"GameSystem","MessageFactory":"MessageFactory","MusicMgr":"MusicMgr"}],"MessageFactory_Bullfight":[function(require,module,exports){
"use strict";
cc._RFpush(module, '54729u6eBhJ8ZbwXHnM0tz5', 'MessageFactory_Bullfight');
// Script\GameScene\Bullfight\Cmd\MessageFactory\MessageFactory_Bullfight.js

'use strict';

/**
 * Created by shrimp on 17/3/2.
 */
var Cmd_Bullfight = require('Cmd_Bullfight');
var Bullfight_BetCoinRespPacket = require('Bullfight_BetCoinRespPacket');
var Bullfight_CallBankerRespPacket = require('Bullfight_CallBankerRespPacket');
var Bullfight_HelpRespPacket = require('Bullfight_HelpRespPacket');
var Bullfight_OpenCardRespPacket = require('Bullfight_OpenCardRespPacket');
var Bullfight_TableDetailRespPacket = require('Bullfight_TableDetailRespPacket');
var Bullfight_BetCoinReqPacket = require('Bullfight_BetCoinReqPacket');
var Bullfight_CallBankerReqPacket = require('Bullfight_CallBankerReqPacket');
var Bullfight_HelpReqPacket = require('Bullfight_HelpReqPacket');
var Bullfight_OpenCardReqPacket = require('Bullfight_OpenCardReqPacket');
var Bullfight_TableDetailReqPacket = require('Bullfight_TableDetailReqPacket');
var Bullfight_NotifyGameOverOncePacket = require('Bullfight_NotifyGameOverOncePacket');
var Bullfight_NotifyGameOverTotalPacket = require('Bullfight_NotifyGameOverTotalPacket');
var Bullfight_ReadyReqPacket = require('Bullfight_ReadyReqPacket');
var Bullfight_ReadyRespPacket = require('Bullfight_ReadyRespPacket');
var Bullfight_NotifyGameStartPacket = require('Bullfight_NotifyGameStartPacket');
var Bullfight_NotifySureBankerPacket = require('Bullfight_NotifySureBankerPacket');
var Bullfight_NotifyOpenCardPacket = require('Bullfight_NotifyOpenCardPacket');
var Bullfight_NotifyKickOutPacket = require('Bullfight_NotifyKickOutPacket');
var Bullfight_NotifyNotCallBankerPacket = require('Bullfight_NotifyNotCallBankerPacket');
var Bullfight_NotifyNotBetPacket = require('Bullfight_NotifyNotBetPacket');
var Bullfight_GetPlayersListReqPacket = require('Bullfight_GetPlayersListReqPacket');
var Bullfight_GetPlayersListRespPacket = require('Bullfight_GetPlayersListRespPacket');

var MessageFactory_Bullfight = {

    //Clint 请求
    createMessageReq: function createMessageReq(cmd) {
        var msg = null;
        switch (cmd) {
            case Cmd_Bullfight.SBF_REQ_BET_COIN_CMD_ID:
                msg = new Bullfight_BetCoinReqPacket();
                break;
            case Cmd_Bullfight.SBF_REQ_CALL_BANKER_CMD_ID:
                msg = new Bullfight_CallBankerReqPacket();
                break;
            case Cmd_Bullfight.SBF_REQ_HELP_CMD_ID:
                msg = new Bullfight_HelpReqPacket();
                break;
            case Cmd_Bullfight.SBF_REQ_OPEN_CARD_CMD_ID:
                msg = new Bullfight_OpenCardReqPacket();
                break;
            case Cmd_Bullfight.US_REQ_TABLE_DETAIL_CMD_ID:
                msg = new Bullfight_TableDetailReqPacket();
                break;
            case Cmd_Bullfight.SBF_REQ_READY_CMD_ID:
                msg = new Bullfight_ReadyReqPacket();
                break;
            case Cmd_Bullfight.US_REQ_PLAYER_LIST_CMD_ID:
                msg = new Bullfight_GetPlayersListReqPacket();
                break;
        }
        return msg;
    },

    // Server 回应
    createMessageResp: function createMessageResp(cmd) {
        var msg = null;
        switch (cmd) {
            case Cmd_Bullfight.SBF_RESP_BET_COIN_CMD_ID:
                msg = new Bullfight_BetCoinRespPacket();
                break;
            case Cmd_Bullfight.SBF_RESP_CALL_BANKER_CMD_ID:
                msg = new Bullfight_CallBankerRespPacket();
                break;
            case Cmd_Bullfight.SBF_RESP_HELP_CMD_ID:
                msg = new Bullfight_HelpRespPacket();
                break;
            case Cmd_Bullfight.SBF_RESP_OPEN_CARD_CMD_ID:
                msg = new Bullfight_OpenCardRespPacket();
                break;
            case Cmd_Bullfight.US_RESP_TABLE_DETAIL_CMD_ID:
                msg = new Bullfight_TableDetailRespPacket();
                break;
            case Cmd_Bullfight.SBF_NOTIFY_ONE_GAME_RESULT_CMD_ID:
                msg = new Bullfight_NotifyGameOverOncePacket();
                break;
            case Cmd_Bullfight.SBF_NOTIFY_TOTAL_GAME_RESULT_CMD_ID:
                msg = new Bullfight_NotifyGameOverTotalPacket();
                break;
            case Cmd_Bullfight.SBF_RESP_READY_CMD_ID:
                msg = new Bullfight_ReadyRespPacket();
                break;
            case Cmd_Bullfight.SBF_NOTIFY_GAME_START_CMD_ID:
                msg = new Bullfight_NotifyGameStartPacket();
                break;
            case Cmd_Bullfight.SBF_NOTIFY_CONFIRM_BANKER_CMD_ID:
                msg = new Bullfight_NotifySureBankerPacket();
                break;
            case Cmd_Bullfight.SBF_NOTIFY_OPEN_CARD_CMD_ID:
                msg = new Bullfight_NotifyOpenCardPacket();
                break;
            case Cmd_Bullfight.SBF_NOTIFY_KICKOUT_CMD_ID:
                msg = new Bullfight_NotifyKickOutPacket();
                break;
            case Cmd_Bullfight.SBF_NOTIFY_NOT_CALL_BANKER_CMD_ID:
                msg = new Bullfight_NotifyNotCallBankerPacket();
                break;
            case Cmd_Bullfight.SBF_NOTIFY_NOT_BET_COIN_CMD_ID:
                msg = new Bullfight_NotifyNotBetPacket();
                break;
            case Cmd_Bullfight.US_RESP_PLAYER_LIST_CMD_ID:
                msg = new Bullfight_GetPlayersListRespPacket();
                break;
        }
        return msg;
    }
};

module.exports = MessageFactory_Bullfight;

cc._RFpop();
},{"Bullfight_BetCoinReqPacket":"Bullfight_BetCoinReqPacket","Bullfight_BetCoinRespPacket":"Bullfight_BetCoinRespPacket","Bullfight_CallBankerReqPacket":"Bullfight_CallBankerReqPacket","Bullfight_CallBankerRespPacket":"Bullfight_CallBankerRespPacket","Bullfight_GetPlayersListReqPacket":"Bullfight_GetPlayersListReqPacket","Bullfight_GetPlayersListRespPacket":"Bullfight_GetPlayersListRespPacket","Bullfight_HelpReqPacket":"Bullfight_HelpReqPacket","Bullfight_HelpRespPacket":"Bullfight_HelpRespPacket","Bullfight_NotifyGameOverOncePacket":"Bullfight_NotifyGameOverOncePacket","Bullfight_NotifyGameOverTotalPacket":"Bullfight_NotifyGameOverTotalPacket","Bullfight_NotifyGameStartPacket":"Bullfight_NotifyGameStartPacket","Bullfight_NotifyKickOutPacket":"Bullfight_NotifyKickOutPacket","Bullfight_NotifyNotBetPacket":"Bullfight_NotifyNotBetPacket","Bullfight_NotifyNotCallBankerPacket":"Bullfight_NotifyNotCallBankerPacket","Bullfight_NotifyOpenCardPacket":"Bullfight_NotifyOpenCardPacket","Bullfight_NotifySureBankerPacket":"Bullfight_NotifySureBankerPacket","Bullfight_OpenCardReqPacket":"Bullfight_OpenCardReqPacket","Bullfight_OpenCardRespPacket":"Bullfight_OpenCardRespPacket","Bullfight_ReadyReqPacket":"Bullfight_ReadyReqPacket","Bullfight_ReadyRespPacket":"Bullfight_ReadyRespPacket","Bullfight_TableDetailReqPacket":"Bullfight_TableDetailReqPacket","Bullfight_TableDetailRespPacket":"Bullfight_TableDetailRespPacket","Cmd_Bullfight":"Cmd_Bullfight"}],"MessageFactory_Common":[function(require,module,exports){
"use strict";
cc._RFpush(module, '494a6ludDBIfJOnYk1g+G9c', 'MessageFactory_Common');
// Script\Network\Cmd\MessageFactory\MessageFactory_Common.js

'use strict';

/**
 * Created by shrimp on 17/2/19.
 */

var HeartReqPacket = require('HeartReqPacket');
var HeartRespPacket = require('HeartRespPacket');
var LoginReqPacket = require('LoginReqPacket');
var LoginRespPacket = require('LoginRespPacket');
var CreateRoomReqPacket = require('CreateRoomReqPacket');
var CreateRoomRespPacket = require('CreateRoomRespPacket');
var FindRoomReqPacket = require('FindRoomReqPacket');
var FindRoomRespPacket = require('FindRoomRespPacket');
var EnterRoomReqPacket = require('EnterRoomReqPacket');
var EnterRoomRespPacket = require('EnterRoomRespPacket');
var LeaveGameReqPacket = require('LeaveGameReqPacket');
var LeaveGameRespPacket = require('LeaveGameRespPacket');
var ServerKickOutPacket = require('ServerKickOutPacket');
//var NotifyTableOwnerSitPacket = require('NotifyTableOwnerSitPacket');
var OwnerConfirmReqPacket = require('OwnerConfirmReqPacket');
var OwnerConfirmRespPacket = require('OwnerConfirmRespPacket');
var OwnerKickOutPlayerReqPacket = require('OwnerKickOutPlayerReqPacket');
var OwnerKickOutPlayerRespPacket = require('OwnerKickOutPlayerRespPacket');
var StartGameReqPacket = require('StartGameReqPacket');
var StartGameRespPacket = require('StartGameRespPacket');
var DismissGameReqPacket = require('DismissGameReqPacket');
//var DismissGameRespPacket = require('DismissGameRespPacket');
var NotifyDismissGame = require('NotifyDismissGame');
var SitDownReqPacket = require('SitDownReqPacket');
var SitDownRespPacket = require('SitDownRespPacket');
var NotifyOwnerOverPacket = require('NotifyOwnerOverPacket');
var ChatReqPacket = require('ChatReqPacket');
var ChatRespPacket = require('ChatRespPacket');
var NotifyOwnerSitPacket = require("NotifyOwnerSitPacket");
var CarryCoinReqPacket = require('CarryCoinReqPacket');
var CarryCoinRespPacket = require('CarryCoinRespPacket');
var NotifyGameStartPacket = require('NotifyGameStartPacket');
var FindRespPacket = require('FindRespPacket');
var FindReqPacket = require('FindReqPacket');
var ScoreListReqPacket = require('ScoreListReqPacket');
var ScoreListRespPacket = require('ScoreListRespPacket');
var ScoreDetailReqPacket = require('ScoreDetailReqPacket');
var ScoreDetailRespPacket = require('ScoreDetailRespPacket');
var ShopConfReqPacket = require('ShopConfReqPacket');
var ShopConfRespPacket = require('ShopConfRespPacket');
var CreateClubReqPacket = require('CreateClubReqPacket');
var CreateClubRespPacket = require('CreateClubRespPacket');
var GetClubListReqPacket = require('GetClubListReqPacket');
var GetClubListRespPacket = require('GetClubListRespPacket');
var GetClubTableReqPacket = require('GetClubTableReqPacket');
var GetClubTableRespPacket = require('GetClubTableRespPacket');
var SearchClubReqPacket = require('SearchClubReqPacket');
var SearchClubRespPacket = require('SearchClubRespPacket');
var ModifyClubInfoReqPacket = require('ModifyClubInfoReqPacket');
var ModifyClubInfoRespPacket = require('ModifyClubInfoRespPacket');
var GetMemberListReqPacket = require('GetMemberListReqPacket');
var GetMemberListRespPacket = require('GetMemberListRespPacket');
var JoinClubReqPacket = require('JoinClubReqPacket');
var JoinClubRespPacket = require('JoinClubRespPacket');
var NotifyClubOwnerConfirmPacket = require('NotifyClubOwnerConfirmPacket');
var ClubOwnerConfirmReqPacket = require('ClubOwnerConfirmReqPacket');
var ClubOwnerConfirmRespPacket = require('ClubOwnerConfirmRespPacket');
var ClubDelMemberReqPacket = require('ClubDelMemberReqPacket');
var ClubDelMemberRespPacket = require('ClubDelMemberRespPacket');
var GetMsgNumReqPacket = require('GetMsgNumReqPacket');
var GetMsgNumRespPacket = require('GetMsgNumRespPacket');
var GetMsgListReqPacket = require('GetMsgListReqPacket');
var GetMsgListRespPacket = require('GetMsgListRespPacket');
var MsgReadReqPacket = require('MsgReadReqPacket');
var MsgReadRespPacket = require('MsgReadRespPacket');
var DismissClubReqPacket = require('DismissClubReqPacket');
var DismissClubRespPacket = require('DismissClubRespPacket');
var ClubOwnerModifyRoleRespPacket = require('ClubOwnerModifyRoleRespPacket');
var ClubOwnerModifyRoleReqPacket = require('ClubOwnerModifyRoleReqPacket');
var ClubCreateRoomReqPacket = require('ClubCreateRoomReqPacket');
var ClubCreateRoomRespPacket = require('ClubCreateRoomRespPacket');
var UserDetailReqPacket = require('UserDetailReqPacket');
var UserDetailRespPacket = require('UserDetailRespPacket');
var CreateTableCostReqPacket = require('CreateTableCostReqPacket');
var CreateTableCostRespPacket = require('CreateTableCostRespPacket');
var ClubUpgradeCostReqPacket = require('ClubUpgradeCostReqPacket');
var ClubUpgradeCostRespPacket = require('ClubUpgradeCostRespPacket');
var ExchangeGoldReqPacket = require('ExchangeGoldReqPacket');
var ExchangeGoldRespPacket = require('ExchangeGoldRespPacket');
var BannerListReqPacket = require('BannerListReqPacket');
var BannerListRespPacket = require('BannerListRespPacket');
var NotifyPayOperatePacket = require('NotifyPayOperatePacket');
var NotifyInGameRespPacket = require('NotifyInGameRespPacket');
var BindReferralReqPacket = require('BindReferralReqPacket');
var BindReferralRespPacket = require('BindReferralRespPacket');
/*
var DismissTableReqPacket = require('DismissTableReqPacket');
var ConfirmDismissTableReqPacket = require('ConfirmDismissTableReqPacket');
var DismissTableRspPacket = require('DismissTableRspPacket');
var ConfirmDismissTableRspPacket = require('ConfirmDismissTableRspPacket');
var DismissTableNotifyPacket  = require('DismissTableNotifyPacket');
var ConfirmDismissTableNotifyPacket = require('ConfirmDismissTableNotifyPacket');
*/
var MessageFactory_Common = {

    //Clint 请求
    createMessageReq: function createMessageReq(cmd) {
        var msg = null;
        switch (cmd) {
            case window.US_REQ_HEARTBEAT_CMD_ID:
                msg = new HeartReqPacket();
                break;
            case window.US_REQ_LOGIN_CMD_ID:
                msg = new LoginReqPacket();
                break;
            case window.US_REQ_CREATE_TABLE_CMD_ID:
                msg = new CreateRoomReqPacket();
                break;
            case window.US_REQ_ENTER_GAME_CMD_ID:
                msg = new EnterRoomReqPacket();
                break;
            case window.US_REQ_FIND_TABLE_CMD_ID:
                msg = new FindRoomReqPacket();
                break;
            case window.US_REQ_LEAVE_GAME_CMD_ID:
                msg = new LeaveGameReqPacket();
                break;
            case window.US_REQ_OWNER_CONFIRM_CMD_ID:
                msg = new OwnerConfirmReqPacket();
                break;
            case window.US_REQ_OWNER_KICKOUT_PLAYERCMD_ID:
                msg = new OwnerKickOutPlayerReqPacket();
                break;
            case window.US_REQ_GAME_SWITCH_CMD_ID:
                msg = new StartGameReqPacket();
                break;
            case window.US_REQ_SIT_DOWN_CMD_ID:
                msg = new SitDownReqPacket();
                break;
            case window.US_REQ_GAME_CHAT_CMD_ID:
                msg = new ChatReqPacket();
                break;
            case window.US_REQ_CARRY_COIN_CMD_ID:
                msg = new CarryCoinReqPacket();
                break;
            case window.US_REQ_FOUND_TABLE_CMD_ID:
                msg = new FindReqPacket();
                break;
            case window.US_REQ_SCORE_LIST_CMD_ID:
                msg = new ScoreListReqPacket();
                break;
            case window.US_REQ_SCORE_DETAIL_CMD_ID:
                msg = new ScoreDetailReqPacket();
                break;
            case window.US_REQ_SHOP_CONF_CMD_ID:
                msg = new ShopConfReqPacket();
                break;
            case window.US_REQ_CREATE_CLUB_CMD_ID:
                msg = new CreateClubReqPacket();
                break;
            case window.US_REQ_CLUB_LIST_CMD_ID:
                msg = new GetClubListReqPacket();
                break;
            case window.US_REQ_CLUB_TABLE_CMD_ID:
                msg = new GetClubTableReqPacket();
                break;
            case window.US_REQ_SEARCH_CLUB_CMD_ID:
                msg = new SearchClubReqPacket();
                break;
            case window.CLUB_REQ_MODIFY_INFO_CMD_ID:
                msg = new ModifyClubInfoReqPacket();
                break;
            case window.CLUB_REQ_GET_MEMBER_LIST_CMD_ID:
                msg = new GetMemberListReqPacket();
                break;
            case window.CLUB_REQ_JOIN_CLUB_CMD_ID:
                msg = new JoinClubReqPacket();
                break;
            case window.CLUB_REQ_OWNER_CONFIRM_CMD_ID:
                msg = new ClubOwnerConfirmReqPacket();
                break;
            case window.CLUB_REQ_OWNER_RM_MEMBER_CMD_ID:
                msg = new ClubDelMemberReqPacket();
                break;
            case window.US_REQ_NEW_MSG_NUM_CMD_ID:
                msg = new GetMsgNumReqPacket();
                break;
            case window.US_REQ_MSG_LIST_CMD_ID:
                msg = new GetMsgListReqPacket();
                break;
            case window.US_REQ_SET_MSG_READ_CMD_ID:
                msg = new MsgReadReqPacket();
                break;
            case window.CLUB_REQ_DISMISS_CLUB_CMD_ID:
                msg = new DismissClubReqPacket();
                break;
            case window.CLUB_REQ_OWNER_MODIFY_ROLE_CMD_ID:
                msg = new ClubOwnerModifyRoleReqPacket();
                break;
            case window.CLUB_REQ_CREATE_TABLE_CMD_ID:
                msg = new ClubCreateRoomReqPacket();
                break;
            case window.US_REQ_USER_DETAIL_CMD_ID:
                msg = new UserDetailReqPacket();
                break;

            case window.US_REQ_CREATE_COST_CMD_ID:
                msg = new CreateTableCostReqPacket();
                break;

            case window.US_REQ_CLUB_UPGRADE_COST_CMD_ID:
                msg = new ClubUpgradeCostReqPacket();
                break;

            case window.US_REQ_EXCHANGE_GOLD_CMD_ID:
                msg = new ExchangeGoldReqPacket();
                break;

            case window.US_REQ_BANNER_LIST_CMD_ID:
                msg = new BannerListReqPacket();
                break;

            case window.US_REQ_BIND_REFERRAL_CMD_ID:
                msg = new BindReferralReqPacket();
                break;

            /*
            case window.US_REQ_DISMISS_TABLE_CMD_ID:
                msg = new DismissTableReqPacket;
                break;
              case window.US_REQ_CONFIRM_DISMISS_TABLE_CMD_ID:
                msg = new ConfirmDismissTableReqPacket;
                break;
             */

        }
        return msg;
    },

    // Server 回应
    createMessageResp: function createMessageResp(cmd) {
        var msg = null;
        switch (cmd) {
            case window.US_RESP_HEARTBEAT_CMD_ID:
                msg = new HeartRespPacket();
                break;

            case window.US_RESP_LOGIN_CMD_ID:
                msg = new LoginRespPacket();
                break;

            case window.US_RESP_CREATE_TABLE_CMD_ID:
                msg = new CreateRoomRespPacket();
                break;

            case window.US_RESP_ENTER_GAME_CMD_ID:
                msg = new EnterRoomRespPacket();
                break;
            case window.US_RESP_FIND_TABLE_CMD_ID:
                msg = new FindRoomRespPacket();
                break;

            case window.US_RESP_LEAVE_GAME_CMD_ID:
                msg = new LeaveGameRespPacket();
                break;

            case window.US_KICK_OUT_CMD_ID:
                msg = new ServerKickOutPacket();
                break;

            case window.US_RESP_OWNER_CONFIRM_CMD_ID:
                msg = new OwnerConfirmRespPacket();
                break;

            case window.US_RESP_OWNER_KICKOUT_PLAYERCMD_ID:
                msg = new OwnerKickOutPlayerRespPacket();
                break;

            case window.US_RESP_GAME_SWITCH_CMD_ID:
                msg = new StartGameRespPacket();
                break;

            case window.US_NOTIFY_DISMISS_GAME_CMD_ID:
                msg = new NotifyDismissGame();
                break;

            case window.US_RESP_SIT_DOWN_CMD_ID:
                msg = new SitDownRespPacket();
                break;

            case window.US_NOTFIY_OWNER_TABLEINFO_CMD_ID:
                msg = new NotifyOwnerOverPacket();
                break;

            case window.US_RESP_GAME_CHAT_CMD_ID:
                msg = new ChatRespPacket();
                break;

            case window.US_NOTIFY_OWNER_CONFIRM_SIT_CMD_ID:
                msg = new NotifyOwnerSitPacket();
                break;

            case window.US_RESP_CARRY_COIN_CMD_ID:
                msg = new CarryCoinRespPacket();
                break;

            case window.US_NOTIFY_GAME_SWITCH_CMD_ID:
                msg = new NotifyGameStartPacket();
                break;

            case window.US_RESP_FOUND_TABLE_CMD_ID:
                msg = new FindRespPacket();
                break;

            case window.US_RESP_SCORE_LIST_CMD_ID:
                msg = new ScoreListRespPacket();
                break;

            case window.US_RESP_SCORE_DETAIL_CMD_ID:
                msg = new ScoreDetailRespPacket();
                break;

            case window.US_RESP_SHOP_CONF_CMD_ID:
                msg = new ShopConfRespPacket();
                break;

            case window.US_RESP_CREATE_CLUB_CMD_ID:
                msg = new CreateClubRespPacket();
                break;

            case window.US_RESP_CLUB_LIST_CMD_ID:
                msg = new GetClubListRespPacket();
                break;

            case window.US_RESP_CLUB_TABLE_CMD_ID:
                msg = new GetClubTableRespPacket();
                break;

            case window.US_RESP_SEARCH_CLUB_CMD_ID:
                msg = new SearchClubRespPacket();
                break;

            case window.CLUB_RESP_MODIFY_INFO_CMD_ID:
                msg = new ModifyClubInfoRespPacket();
                break;

            case window.CLUB_RESP_GET_MEMBER_LIST_CMD_ID:
                msg = new GetMemberListRespPacket();
                break;

            case window.CLUB_RESP_JOIN_CLUB_CMD_ID:
                msg = new JoinClubRespPacket();
                break;

            case window.CLUB_NOTIFY_OWNER_CONFIRM_CMD_ID:
                msg = new NotifyClubOwnerConfirmPacket();
                break;

            case window.CLUB_RESP_OWNER_CONFIRM_CMD_ID:
                msg = new ClubOwnerConfirmRespPacket();
                break;

            case window.CLUB_RESP_OWNER_RM_MEMBER_CMD_ID:
                msg = new ClubDelMemberRespPacket();
                break;

            case window.US_RESP_NEW_MSG_NUM_CMD_ID:
                msg = new GetMsgNumRespPacket();
                break;

            case window.US_RESP_MSG_LIST_CMD_ID:
                msg = new GetMsgListRespPacket();
                break;

            case window.US_RESP_SET_MSG_READ_CMD_ID:
                msg = new MsgReadRespPacket();
                break;

            case window.US_RESP_SEARCH_CLUB_CMD_ID:
                msg = new SearchClubRespPacket();
                break;

            case window.CLUB_RESP_DISMISS_CLUB_CMD_ID:
                msg = new DismissClubRespPacket();
                break;

            case window.CLUB_RESP_OWNER_MODIFY_ROLE_CMD_ID:
                msg = new ClubOwnerModifyRoleRespPacket();
                break;

            case window.CLUB_RESP_CREATE_TABLE_CMD_ID:
                msg = new ClubCreateRoomRespPacket();
                break;

            case window.US_RESP_USER_DETAIL_CMD_ID:
                msg = new UserDetailRespPacket();
                break;

            case window.US_RESP_CREATE_COST_CMD_ID:
                msg = new CreateTableCostRespPacket();
                break;

            case window.US_RESP_CLUB_UPGRADE_COST_CMD_ID:
                msg = new ClubUpgradeCostRespPacket();
                break;

            case window.US_RESP_EXCHANGE_GOLD_CMD_ID:
                msg = new ExchangeGoldRespPacket();
                break;

            case window.US_RESP_BANNER_LIST_CMD_ID:
                msg = new BannerListRespPacket();
                break;
            case window.US_NOTIFY_PAY_OPERATE_CMD_ID:
                msg = new NotifyPayOperatePacket();
                break;

            case window.US_NOTIFY_IN_GAME_CMD_ID:
                msg = new NotifyInGameRespPacket();
                break;

            case window.US_RESP_BIND_REFERRAL_CMD_ID:
                msg = new BindReferralRespPacket();
                break;
            /*
                        case window.US_RSP_DISMISS_TABLE_CMD_ID:
                            msg = new DismissTableRspPacket;
                            break;
            
                        case window.US_RSP_CONFIRM_DISMISS_TABLE_CMD_ID:
                            msg = new ConfirmDismissTableRspPacket;
                            break;
            
                        case window.US_NOTIFY_DISMISS_TABLE_CMD_ID:
                            msg = new DismissTableNotifyPacket;
                            break;
            
                        case window.US_NOTIFY_CONFIRM_DISMISS_TABLE_CMD_ID:
                            msg = new ConfirmDismissTableNotifyPacket;
                            break;
             */

        }

        return msg;
    }
};

module.exports = MessageFactory_Common;

cc._RFpop();
},{"BannerListReqPacket":"BannerListReqPacket","BannerListRespPacket":"BannerListRespPacket","BindReferralReqPacket":"BindReferralReqPacket","BindReferralRespPacket":"BindReferralRespPacket","CarryCoinReqPacket":"CarryCoinReqPacket","CarryCoinRespPacket":"CarryCoinRespPacket","ChatReqPacket":"ChatReqPacket","ChatRespPacket":"ChatRespPacket","ClubCreateRoomReqPacket":"ClubCreateRoomReqPacket","ClubCreateRoomRespPacket":"ClubCreateRoomRespPacket","ClubDelMemberReqPacket":"ClubDelMemberReqPacket","ClubDelMemberRespPacket":"ClubDelMemberRespPacket","ClubOwnerConfirmReqPacket":"ClubOwnerConfirmReqPacket","ClubOwnerConfirmRespPacket":"ClubOwnerConfirmRespPacket","ClubOwnerModifyRoleReqPacket":"ClubOwnerModifyRoleReqPacket","ClubOwnerModifyRoleRespPacket":"ClubOwnerModifyRoleRespPacket","ClubUpgradeCostReqPacket":"ClubUpgradeCostReqPacket","ClubUpgradeCostRespPacket":"ClubUpgradeCostRespPacket","CreateClubReqPacket":"CreateClubReqPacket","CreateClubRespPacket":"CreateClubRespPacket","CreateRoomReqPacket":"CreateRoomReqPacket","CreateRoomRespPacket":"CreateRoomRespPacket","CreateTableCostReqPacket":"CreateTableCostReqPacket","CreateTableCostRespPacket":"CreateTableCostRespPacket","DismissClubReqPacket":"DismissClubReqPacket","DismissClubRespPacket":"DismissClubRespPacket","DismissGameReqPacket":"DismissGameReqPacket","EnterRoomReqPacket":"EnterRoomReqPacket","EnterRoomRespPacket":"EnterRoomRespPacket","ExchangeGoldReqPacket":"ExchangeGoldReqPacket","ExchangeGoldRespPacket":"ExchangeGoldRespPacket","FindReqPacket":"FindReqPacket","FindRespPacket":"FindRespPacket","FindRoomReqPacket":"FindRoomReqPacket","FindRoomRespPacket":"FindRoomRespPacket","GetClubListReqPacket":"GetClubListReqPacket","GetClubListRespPacket":"GetClubListRespPacket","GetClubTableReqPacket":"GetClubTableReqPacket","GetClubTableRespPacket":"GetClubTableRespPacket","GetMemberListReqPacket":"GetMemberListReqPacket","GetMemberListRespPacket":"GetMemberListRespPacket","GetMsgListReqPacket":"GetMsgListReqPacket","GetMsgListRespPacket":"GetMsgListRespPacket","GetMsgNumReqPacket":"GetMsgNumReqPacket","GetMsgNumRespPacket":"GetMsgNumRespPacket","HeartReqPacket":"HeartReqPacket","HeartRespPacket":"HeartRespPacket","JoinClubReqPacket":"JoinClubReqPacket","JoinClubRespPacket":"JoinClubRespPacket","LeaveGameReqPacket":"LeaveGameReqPacket","LeaveGameRespPacket":"LeaveGameRespPacket","LoginReqPacket":"LoginReqPacket","LoginRespPacket":"LoginRespPacket","ModifyClubInfoReqPacket":"ModifyClubInfoReqPacket","ModifyClubInfoRespPacket":"ModifyClubInfoRespPacket","MsgReadReqPacket":"MsgReadReqPacket","MsgReadRespPacket":"MsgReadRespPacket","NotifyClubOwnerConfirmPacket":"NotifyClubOwnerConfirmPacket","NotifyDismissGame":"NotifyDismissGame","NotifyGameStartPacket":"NotifyGameStartPacket","NotifyInGameRespPacket":"NotifyInGameRespPacket","NotifyOwnerOverPacket":"NotifyOwnerOverPacket","NotifyOwnerSitPacket":"NotifyOwnerSitPacket","NotifyPayOperatePacket":"NotifyPayOperatePacket","OwnerConfirmReqPacket":"OwnerConfirmReqPacket","OwnerConfirmRespPacket":"OwnerConfirmRespPacket","OwnerKickOutPlayerReqPacket":"OwnerKickOutPlayerReqPacket","OwnerKickOutPlayerRespPacket":"OwnerKickOutPlayerRespPacket","ScoreDetailReqPacket":"ScoreDetailReqPacket","ScoreDetailRespPacket":"ScoreDetailRespPacket","ScoreListReqPacket":"ScoreListReqPacket","ScoreListRespPacket":"ScoreListRespPacket","SearchClubReqPacket":"SearchClubReqPacket","SearchClubRespPacket":"SearchClubRespPacket","ServerKickOutPacket":"ServerKickOutPacket","ShopConfReqPacket":"ShopConfReqPacket","ShopConfRespPacket":"ShopConfRespPacket","SitDownReqPacket":"SitDownReqPacket","SitDownRespPacket":"SitDownRespPacket","StartGameReqPacket":"StartGameReqPacket","StartGameRespPacket":"StartGameRespPacket","UserDetailReqPacket":"UserDetailReqPacket","UserDetailRespPacket":"UserDetailRespPacket"}],"MessageFactory":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'fe6a4+vaRpGNZhAf3Z6Nwph', 'MessageFactory');
// Script\Network\MessageFactory.js

'use strict';

/**
 * Created by shrimp on 17/2/19.
 */

var MessageFactory_Common = require('MessageFactory_Common');
var MessageFactory_Bullfight = require('MessageFactory_Bullfight');
var GameSystem = require('GameSystem');

var MessageFactory = {};

//生成一个基础消息
MessageFactory.createMessageReq = function (cmd) {
    cc.log("MessageFactory.createMessageReq,cmd = " + cmd.toString(16));
    var message = null;
    if (GameSystem.getInstance().CurGameType == GameSystem.getInstance().GameType.GAME_TYPE_BULLFIGHT) {
        message = MessageFactory_Bullfight.createMessageReq(cmd);
    } else {}
    // cc.error("MessageFactory.createMessage,ERROR,curGameType = " + curGameType);


    //走公共协议
    if (message == null) {
        message = MessageFactory_Common.createMessageReq(cmd);
    }

    if (message == null) {
        cc.error("MessageFactory.createMessageReq,message = null");
    }
    cc.log("MessageFactory.createMessageReq," + message.constructor.name);
    return message;
};

MessageFactory.createMessageResp = function (cmd) {
    cc.log("MessageFactory.createMessageResp,cmd = " + cmd.toString(16));
    var message = null;
    if (GameSystem.getInstance().CurGameType == GameSystem.getInstance().GameType.GAME_TYPE_BULLFIGHT || 1) {
        message = MessageFactory_Bullfight.createMessageResp(cmd);
    } else {}
    // cc.error("MessageFactory.createMessage,ERROR,curGameType = " + curGameType);


    //走公共协议
    if (message == null) {
        message = MessageFactory_Common.createMessageResp(cmd);
    }

    if (message == null) {
        cc.error("MessageFactory.createMessageResp,message = null");
    }
    cc.log("MessageFactory.createMessageResp," + message.constructor.name);
    return message;
};

module.exports = MessageFactory;

cc._RFpop();
},{"GameSystem":"GameSystem","MessageFactory_Bullfight":"MessageFactory_Bullfight","MessageFactory_Common":"MessageFactory_Common"}],"MessageReq":[function(require,module,exports){
"use strict";
cc._RFpush(module, '73c60qzqCxIY5PO4/CMYAFs', 'MessageReq');
// Script\Network\Socket\MessageReq.js

'use strict';

/**
 * Created by shrimp on 17/2/22.
 */

var Message = require('Message');

function MessageReq() {
    Message.apply(this, []); //集成父类数据

    this.seq = SocketSeq++;

    this.send = function () {};

    this.sendHead = function () {
        this.data.cmd = this.cmd;
        this.data.qeq = this.seq;
        this.data.uid = this.uid;
    };
}

module.exports = MessageReq;

cc._RFpop();
},{"Message":"Message"}],"MessageResp":[function(require,module,exports){
"use strict";
cc._RFpush(module, '31548GHSx1NWrpTw9v9X0ie', 'MessageResp');
// Script\Network\Socket\MessageResp.js

"use strict";

/**
 * Created by shrimp on 17/2/22.
 */
var Message = require('Message');

function MessageResp() {
    Message.apply(this, []); //集成父类数据

    this.code = 0;
    this.desc = "";

    this.onMessage = function (msg) {};
}

module.exports = MessageResp;

cc._RFpop();
},{"Message":"Message"}],"MessageView":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e0206hb3rhJRIjcGYCfH2io', 'MessageView');
// Script\ComScene\PopView\MessageView.js

'use strict';

var BasePop = require('BasePop');
var MessageFactory = require('MessageFactory');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require("GameSystem");

cc.Class({
    extends: BasePop,

    properties: {
        MessageDetailView: cc.Prefab,
        ScrollView: cc.ScrollView,
        NoticeMsgCell: cc.Node,
        NoticeRedTip: cc.Node,
        NoticeNum: cc.Label,
        ClubMsgCell: cc.Node,
        ClubMsgRedTip: cc.Node,
        ClubMsgNum: cc.Label,
        SitReqCell: cc.Prefab
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._super();
        MessageFactory.createMessageReq(US_REQ_NEW_MSG_NUM_CMD_ID).send();
        this.initBaseData();
    },

    initBaseData: function initBaseData() {
        this.CellNum = 0;
    },

    /*********************Network***************************/
    onMessage: function onMessage(event) {
        cc.log("MessageView.onMessage");
        //this._super(event);
        var msg = event.data;
        var cmd = msg.cmd;
        switch (cmd) {
            case US_RESP_NEW_MSG_NUM_CMD_ID:
                this.onNewMsg(msg);
                break;

            case US_RESP_MSG_LIST_CMD_ID:
                this.onMsgList(msg);
                break;

            case US_RESP_OWNER_CONFIRM_CMD_ID:
                this.onOwnerConfirm(msg);
                break;
        }
    },

    onOwnerConfirm: function onOwnerConfirm(msg) {
        if (msg.code < SocketRetCode.RET_SUCCESS) {
            cc.log("MessageView.onOwnerConfirm");
            this.dismiss();
        } else {}
    },

    onMsgList: function onMsgList(msg) {
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            if (msg.type == 1) {} else if (msg.type == 2) {} else if (msg.type == 3) {
                var cellCount = this.ScrollView.content.getChildrenCount();
                if (msg.list == null || msg.list == undefined) return;
                var cellHeight = 0;
                for (var index = 0; index < msg.list.length; index++) {
                    var json = BASE64.decoder(msg.list[index].msg);
                    msg.list[index].msg = JSON.parse(json);
                    cc.log("MessageView.onMsgList,json = " + msg.list[index].msg);

                    var SitReqCell = cc.instantiate(this.SitReqCell);
                    this.ScrollView.content.addChild(SitReqCell);
                    cellHeight = SitReqCell.getContentSize().height;
                    SitReqCell.setPosition(cc.p(0, -SitReqCell.getContentSize().height * (cellCount + index + 1)));
                    SitReqCell.getComponent("SitReqCell").setMessageInfo(msg.list[index], msg.type);
                }

                if (cellHeight * (this.ScrollView.content.getChildrenCount() + 1) > this.ScrollView.content.height) {
                    this.ScrollView.content.height = cellHeight * (this.ScrollView.content.getChildrenCount() + 1);
                }
            }
        }
    },

    onNewMsg: function onNewMsg(msg) {
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            if (msg.sysnum > 0) {
                this.NoticeRedTip.active = true;
                this.NoticeNum.string = msg.sysnum;
                this.CellNum++;
            }

            if (msg.clubnum > 0) {
                this.ClubMsgRedTip.active = true;
                this.ClubMsgNum.string = msg.clubnum;
                this.CellNum++;
            }

            var data = {
                type: 3,
                start: 0,
                total: 50
            };
            MessageFactory.createMessageReq(US_REQ_MSG_LIST_CMD_ID).send(data);
        }
    },

    callbackBtn: function callbackBtn(event, CustomEventData) {
        cc.log("MessageView.callbackBtn,CustomEventData = " + CustomEventData);
        var btnName = event.target.getName();
        cc.log("MessageView.callbackBtn,btnName = " + btnName);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);

        if (btnName == "BtnClose") {
            this.dismiss();
        } else if (btnName == "NoticeMsgCell") {
            var MessageDetailView = cc.instantiate(this.MessageDetailView);
            this.node.addChild(MessageDetailView);
            MessageDetailView.setPosition(cc.p(0, 0));
            MessageDetailView.getComponent('MessageDetailView').sendGetMsgList(1);
        } else if (btnName == "ClubMsgCell") {
            cc.log("MessageView.ClubMsgCell");
            var MessageDetailView = cc.instantiate(this.MessageDetailView);
            this.node.addChild(MessageDetailView);
            MessageDetailView.setPosition(cc.p(0, 0));
            MessageDetailView.getComponent('MessageDetailView').sendGetMsgList(2);
        }
    }
});

cc._RFpop();
},{"Audio_Common":"Audio_Common","BasePop":"BasePop","GameSystem":"GameSystem","MessageFactory":"MessageFactory","MusicMgr":"MusicMgr"}],"Message":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'cee66BLZqpP3KF7HDU+NF64', 'Message');
// Script\Network\Socket\Message.js

"use strict";

/**
 * Created by shrimp on 17/2/19.
 */
var GamePlayer = require('GamePlayer');

function Message() {
    this.cmd = 0;
    this.seq = 0;
    this.uid = GamePlayer.getInstance().uid;

    this.data = "";

    this.onMessage = function (data) {};
    this.send = function () {};
    this.proccess = function (ui) {};
}

module.exports = Message;

cc._RFpop();
},{"GamePlayer":"GamePlayer"}],"MineView":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd1d883ZkdFDbZqDkdBBIbzr', 'MineView');
// Script\ComScene\PopView\MineView.js

'use strict';

var BasePop = require('BasePop');
var GamePlayer = require('GamePlayer');
var AlertView = require('AlertView');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require('GameSystem');
var GameCallOC = require('GameCallOC');
var ToastView = require('ToastView');
cc.Class({
    extends: BasePop,

    properties: {
        // ...
        UserNick: cc.Label,
        UserHead: cc.Sprite,
        UserSex: cc.Sprite,
        SexSpriteFrame: [cc.SpriteFrame],
        UidLable: cc.Label,
        Diamond: cc.Label,
        Gold: cc.Label,
        MessageView: cc.Prefab,
        RedTips: cc.Sprite,
        ClubView: cc.Prefab,
        SuccessView: cc.Prefab,
        ShareView: cc.Prefab,
        SettingView: cc.Prefab,
        NoticeView: cc.Prefab,
        ShopView: cc.Prefab,
        BtnShare: cc.Node,
        ReferralCodeView: cc.Prefab,
        BtnNode: [cc.Node],
        RoomCardCount: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.initBaseData();
        this.RedTips.node.active = GameSystem.getInstance().NewMsgNum;
    },

    initBaseData: function initBaseData() {
        this.UserNick.string = GamePlayer.getInstance().name;
        this.UidLable.string = GamePlayer.getInstance().uid;
        this.Diamond.string = GamePlayer.getInstance().diamond;
        this.Gold.string = GamePlayer.getInstance().gold;
        this.RoomCardCount.strng = GamePlayer.getInstance().roomcard;
        UpdateWXHeadIcon(GamePlayer.getInstance().headurl, this.UserHead);
        this.UserSex.spriteFrame = this.UserSex[GamePlayer.getInstance().sex];

        if (GameSystem.getInstance().VerStatus == GameSystem.getInstance().VerStatusType.VERSION_TYPE_AUDIT && GameCallOC.getInstance().checkIsAble()) {
            this.BtnNode[0].active = false;
            this.BtnNode[1].active = true;
        } else {
            this.BtnNode[1].active = false;
            this.BtnNode[0].active = true;
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    callbackBtn: function callbackBtn(event, CustomEventData) {
        cc.log("MineView.callbackBtn,CustomEventData = " + CustomEventData);
        var btnName = event.target.getName();
        cc.log("MineView.callbackBtn,btnName = " + btnName);
        var winSize = cc.director.getWinSize();
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if (btnName == "BtnMessage") {
            var messageView = cc.instantiate(this.MessageView);
            cc.director.getScene().addChild(messageView);
            messageView.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
        } else if (btnName == "BtnClue") {
            var clubView = cc.instantiate(this.ClubView);
            cc.director.getScene().addChild(clubView);
            clubView.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
        } else if (btnName == "BtnSuccess") {
            var successView = cc.instantiate(this.SuccessView);
            cc.director.getScene().addChild(successView);
            successView.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
        } else if (btnName == "BtnShare") {
            if (GameSystem.getInstance().VerStatus == GameSystem.getInstance().VerStatusType.VERSION_TYPE_AUDIT) {
                ToastView.show("功能暂未开放");
                return;
            }

            var shareView = cc.instantiate(this.ShareView);
            cc.director.getScene().addChild(shareView);
            shareView.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
            var string = "我正在玩游戏［" + GameCallOC.getInstance().getAppName() + "］,快点一起来玩吧！！！";
            shareView.getComponent("ShareView").setShareTyep(ShareType.E_SHARETYPE_LINK, string, GameSystem.getInstance().clienturl);
        } else if (btnName == "BtnService") {
            var alertExit = AlertView.create();
            alertExit.showOne(GameSystem.getInstance().weixincs, AlertViewBtnType.E_BTN_CLOSE);
            // var serviceView = cc.instantiate(this.ServiceView);
            // cc.director.getScene().addChild(serviceView);
            // serviceView.setPosition(cc.p(winSize.width/2,winSize.height/2));
        } else if (btnName == "BtnNotice") {
            var noticeView = cc.instantiate(this.NoticeView);
            cc.director.getScene().addChild(noticeView);
            noticeView.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
            noticeView.getComponent('NoticeView').setContent();
        } else if (btnName == "BtnSetting") {
            var settingView = cc.instantiate(this.SettingView);
            cc.director.getScene().addChild(settingView);
            settingView.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
            this.dismiss();
        } else if (btnName == "BtnMineInfo") {
            var shopView = cc.instantiate(this.ShopView);
            cc.director.getScene().addChild(shopView);
            shopView.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
        } else if (btnName == "BtnCode") {
            if (GameSystem.getInstance().referralCode != 0) {

                var self = this;
                var alert = AlertView.create();
                alert.setPositiveButton(function () {
                    // self.createReferralCodeView();
                }, "确定");

                var str = "您已经绑定了推广码:" + GameSystem.getInstance().referralCode;
                alert.show(str, AlertViewBtnType.E_BTN_CLOSE);
                return;
            }
            var referralCodeView = cc.instantiate(this.ReferralCodeView);
            cc.director.getScene().addChild(referralCodeView);
            referralCodeView.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
        }
    }

});

cc._RFpop();
},{"AlertView":"AlertView","Audio_Common":"Audio_Common","BasePop":"BasePop","GameCallOC":"GameCallOC","GamePlayer":"GamePlayer","GameSystem":"GameSystem","MusicMgr":"MusicMgr","ToastView":"ToastView"}],"ModifyClubInfoReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0e217qOSc1Ao4PYJkcWls1i', 'ModifyClubInfoReqPacket');
// Script\Network\Cmd\Cmd_Req\ModifyClubInfoReqPacket.js

'use strict';

/**
 * Created by shrimp on 17/4/8.
 */

/*
* type CLUB_REQ_MODIFY_INFO_T struct {
 ClubHead
 Param PARAM_REQ_MODIFY_INFO_T `json:"param"`
 }
 type PARAM_REQ_MODIFY_INFO_T struct {
 HeadUrl string `json:"headurl"`
 Address string `json:"address"`
 Intro   string `json:"intro"`
 Level   int    `json:"level"`
 Renew   int    `json:"renew"` //续费, 如果不续费就是0
 }
* */
var MessageReq = require("MessageReq");
var GamePlayer = require('GamePlayer');
var GameSystem = require('GameSystem');

function ModifyClubInfoReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.CLUB_REQ_MODIFY_INFO_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("ModifyClubInfoReqPacket.send");

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            clubid: msg.clubid,
            param: {
                headurl: msg.headurl,
                address: msg.address,
                name: msg.name,
                intro: msg.intro,
                level: msg.level
            }
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = ModifyClubInfoReqPacket;

cc._RFpop();
},{"GamePlayer":"GamePlayer","GameSystem":"GameSystem","MessageReq":"MessageReq"}],"ModifyClubInfoRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '65140e8dY1HcblyM9cO3Uta', 'ModifyClubInfoRespPacket');
// Script\Network\Cmd\Cmd_Resp\ModifyClubInfoRespPacket.js

"use strict";

/**
 * Created by shrimp on 17/4/8.
 */
/*
* type CLUB_RESP_MODIFY_INFO_T struct {
 JsonHead
 RespHead
 Param PARAM_RESP_MODIFY_INFO_T `json:"param"`
 }
 type PARAM_RESP_MODIFY_INFO_T struct {
 ClubId  int    `json:"clubid"`
 Status  int    `json:"status"`
 Name    string `json:"name"`
 HeadUrl string `json:"headurl"`
 Address string `json:"address"`
 Intro   string `json:"intro"`
 Level   int    `json:"level"`
 EndTime int64  `json:"endtime"`
 }
* */

var MessageResp = require("MessageResp");

function ModifyClubInfoRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.CLUB_RESP_MODIFY_INFO_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {
        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.param = msg.param;

        cc.log("ModifyClubInfoRespPacket cmd=", this.cmd);
    };
}

module.exports = ModifyClubInfoRespPacket;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"MsgReadReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '4f564w3if1FiYNSC5Usa9Fl', 'MsgReadReqPacket');
// Script\Network\Cmd\Cmd_Req\MsgReadReqPacket.js

"use strict";

/**
 * Created by shrimp on 17/4/13.
 */
/*
* type US_REQ_SET_MSG_READ_T struct {
 JsonHead
 Param PARAM_SET_MSG_READ_T `json:"param"`
 }
* */
var MessageReq = require("MessageReq");

function MsgReadReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_SET_MSG_READ_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("GetMsgNumReqPacket.send");

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = MsgReadReqPacket;

cc._RFpop();
},{"MessageReq":"MessageReq"}],"MsgReadRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '83286ulnEtETbYfBfRshaGJ', 'MsgReadRespPacket');
// Script\Network\Cmd\Cmd_Resp\MsgReadRespPacket.js

"use strict";

/**
 * Created by shrimp on 17/4/13.
 */
/*
* type US_RESP_SET_MSG_READ_T struct {
 JsonHead
 RespHead
 Param PARAM_SET_MSG_READ_T `json:"param"`
 }
 type PARAM_SET_MSG_READ_T struct {
 Type  int `json:"type"`
 MsgId int `json:"msgid"`
 }
* */
var MessageResp = require("MessageResp");

function MsgReadRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_SET_MSG_READ_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        //GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = MsgReadRespPacket;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"MusicMgr":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c58902MZrlNOaHs+msHntQp', 'MusicMgr');
// Script\Manager\MusicMgr.js

"use strict";

var GameSystem = require("GameSystem");

var MusicMgr = {
    _audioVolume: 1.0,
    _musicVolume: 1.0,
    _isShake: true,
    _bgmid: -1,
    m_isAudioOn: true,
    m_isMusicOn: true,

    initAudio: function initAudio() {
        // init
        if (cc.sys.localStorage.hasOwnProperty("SHAKE_OPEN")) {
            this._isShake = cc.sys.localStorage.getItem("SHAKE_OPEN");
            this._isShake = this._isShake == "true" ? true : false;
            cc.log("MusicMgr.initAudio,this._isShake = " + this._isShake);
        }
        if (cc.sys.localStorage.hasOwnProperty("AUDIO_VOLUME")) {
            this._audioVolume = cc.sys.localStorage.getItem("AUDIO_VOLUME");
            this._audioVolume = parseFloat(this._audioVolume);
            cc.log("MusicMgr.initAudio,this._audioVolume = " + this._audioVolume);
        }
        if (cc.sys.localStorage.hasOwnProperty("MUSIC_VOLUME")) {
            this._musicVolume = cc.sys.localStorage.getItem("MUSIC_VOLUME");
            this._musicVolume = parseFloat(this._musicVolume);
            cc.log("MusicMgr.initAudio,this._musicVolume = " + this._musicVolume);
        }
        if (cc.sys.localStorage.hasOwnProperty("m_isAudioOn")) {

            this.m_isAudioOn = cc.sys.localStorage.getItem("m_isAudioOn");
            this.m_isAudioOn = this.m_isAudioOn == "true" ? true : false;
            cc.log("MusicMgr.initAudio,this.m_isAudioOn = " + this.m_isAudioOn);
        }
        if (cc.sys.localStorage.hasOwnProperty("m_isMusicOn")) {
            this.m_isMusicOn = cc.sys.localStorage.getItem("m_isMusicOn");
            this.m_isMusicOn = this.m_isMusicOn == "true" ? true : false;
            cc.log("MusicMgr.initAudio,this.m_isMusicOn = " + this.m_isMusicOn);
        }
    },

    /**
     *
     * @param path
     * @param onjs  是否挂在脚本上
     */
    playBackgroundMusic: function playBackgroundMusic(path, onjs) {
        cc.log("MusicMgr.playBackgroundMusic,path = " + path);
        if (this.m_isMusicOn) {

            if (this._bgmid == -1) {
                var audioID = -1;
                if (onjs) {
                    audioID = cc.audioEngine.play(path, true, this._musicVolume);
                } else {
                    var bgm = cc.url.raw(path);
                    audioID = cc.audioEngine.play(bgm, true, this._musicVolume);
                }

                this._bgmid = audioID;
            } else {
                this.resumeBackgroundMusic();
            }
        }
    },

    stopEffect: function stopEffect(audioID) {
        cc.audioEngine.stop(audioID);
    },

    // add by jackyu
    setVolumeQuite: function setVolumeQuite() {
        cc.audioEngine.setEffectsVolume(0.1);
    },

    stopBackgroundMusic: function stopBackgroundMusic() {
        var state = cc.audioEngine.getState(this._bgmid);
        if (state != cc.audioEngine.AudioState.ERROR) {
            cc.audioEngine.stop(this._bgmid);
            this._bgmid = -1;
        }
    },

    pauseBackgroundMusic: function pauseBackgroundMusic() {
        if (this._bgmid != -1) {
            cc.audioEngine.pause(this._bgmid);
        }
    },

    resumeBackgroundMusic: function resumeBackgroundMusic() {

        if (this._bgmid != -1 && this.m_isMusicOn) {
            cc.audioEngine.resume(this._bgmid);
        }
    },

    setMusicVolume: function setMusicVolume(value) {
        this._musicVolume = value;
        this.m_isMusicOn = this._musicVolume > 0;
        this._saveMusicValue();

        if (this._bgmid != -1) {
            cc.audioEngine.setVolume(this._bgmid, this._musicVolume);
        }
    },

    getMusicVolume: function getMusicVolume() {
        return this._musicVolume;
    },

    _saveMusicValue: function _saveMusicValue() {
        cc.sys.localStorage.setItem("MUSIC_VOLUME", this._musicVolume);
        this.saveMusicON();
    },

    /**this
     *
     * @param path
     * @param loadOnjs  是否挂在 脚本上的资源
     */
    playEffect: function playEffect(path, loadOnjs) {
        if (GameSystem.getInstance().VolumeState == 0) {
            if (this.m_isAudioOn) {
                if (loadOnjs) {
                    cc.audioEngine.play(path, false, this._audioVolume);
                } else {
                    var clip = cc.url.raw(path);
                    cc.audioEngine.play(clip, false, this._audioVolume);
                }
            }
        }
    },

    setEffectsVolume: function setEffectsVolume(value) {
        this._audioVolume = value;
        this.m_isAudioOn = this._audioVolume > 0;
        this._saveEffectValue();
    },

    getEffectVolume: function getEffectVolume() {
        return this._audioVolume;
    },

    _saveEffectValue: function _saveEffectValue() {

        cc.sys.localStorage.setItem("AUDIO_VOLUME", this._audioVolume);
        this.saveAudioON();
    },

    playShake: function playShake() {
        cc.log("震动还未实现！");
    },

    isShakeOn: function isShakeOn() {
        return this._isShake;
    },

    isShakeOpen: function isShakeOpen() {
        return this._isShake;
    },
    setShakeOn: function setShakeOn(bEnable) {
        this._isShake = bEnable;
        cc.sys.localStorage.setItem("SHAKE_OPEN", this._audioVolume);
    },

    preload: function preload(path) {
        cc.audioEngine.preload(path, function () {});
    },

    saveMusicON: function saveMusicON() {
        cc.sys.localStorage.setItem("m_isMusicOn", this.m_isMusicOn);
    },
    saveAudioON: function saveAudioON() {
        cc.sys.localStorage.setItem("m_isAudioOn", this.m_isAudioOn);
    }

};

module.exports = MusicMgr;

cc._RFpop();
},{"GameSystem":"GameSystem"}],"NetMsg":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'b241aOZTHFCHLdmnx6h94O1', 'NetMsg');
// Script\ComScene\PopView\NetMsg.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        lableMsg: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.GameInfoListenerID = -1;
        this.socketMessageListenerID = -1;
        this.node.opacity = 0;
        this.tipsCount = 0;

        this.isNetConnecting = true;

        this.baseTips = "";

        this.onNetCheckListener();
        this.addSocketListener();
    },

    onDestroy: function onDestroy() {
        GlobalEventManager.getInstance().removeListener(this.GameInfoListenerID);
        GlobalEventManager.getInstance().removeListener(this.socketMessageListenerID);
    },

    onNetCheckListener: function onNetCheckListener() {
        var self = this;
        this.GameInfoListenerID = GlobalEventManager.getInstance().addEventListener(window.GameEngineInfo, function (event) {
            if (event) {
                var tag = event.tag;
                if (tag == window.GameInfo.NetOnline) {
                    self.isNetConnecting = true;
                    self.node.opacity = 0;
                    self.unschedule(self.updateTipShow);
                } else if (tag == window.GameInfo.NetOffline) {
                    self.isNetConnecting = false;
                    self.node.opacity = 255;
                    self.tipsCount = 0;

                    self.baseTips = "网络异常，正在重连中";
                    self.lableMsg.string = self.baseTips;
                    self.schedule(self.updateTipShow, 0.3);
                }
            }
        }, this);
    },

    //socket消息
    addSocketListener: function addSocketListener() {
        var self = this;
        this.socketMessageListenerID = GlobalEventManager.getInstance().addEventListener(window.SocketMessage, function (event) {

            if (event == undefined) {
                return;
            }
            var type = event.tag;
            //连接服务器成功
            if (type == window.MessageType.SOCKET_CONNECTED) {
                self.onSocketConnected();
            }
            //断开连接
            else if (type == window.MessageType.SOCKET_DISCONNECTED) {
                    self.onSocketDisconnected();
                }
                //连接中
                else if (type == window.MessageType.SOCKET_CONNECTING) {}
                    //连接失败
                    else if (type == window.MessageType.MSG_NETWORK_FAILURE) {}
                        //收到消息
                        else if (type == window.MessageType.SOCKET_MESSAGE) {}
        }, this);
    },

    onSocketConnected: function onSocketConnected() {
        var self = this;
        self.node.opacity = 0;
        self.unschedule(self.updateTipShow);
    },

    onSocketDisconnected: function onSocketDisconnected() {

        var self = this;
        self.unschedule(self.updateTipShow);
        if (self.isNetConnecting) {
            self.node.opacity = 255;
            self.tipsCount = 0;

            self.baseTips = "服务器连接失败，努力重连中";
            self.lableMsg.string = self.baseTips;

            self.schedule(self.updateTipShow, 0.3);
        }
    },

    updateTipShow: function updateTipShow(tips) {
        this.tipsCount++;
        var tips = this.baseTips;
        var index = this.tipsCount % 4;
        for (var i = 0; i < index; i++) {
            tips += "。";
        }
        this.lableMsg.string = tips;
    }

});

cc._RFpop();
},{}],"NoticeView":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd91b3fop/BGi52uCIfVVvXB', 'NoticeView');
// Script\ComScene\PopView\NoticeView.js

"use strict";

var BasePop = require("BasePop");
var GameSystem = require('GameSystem');
var MusicMgr = require("MusicMgr");
var Audio_Common = require("Audio_Common");
var UtilTool = require('UtilTool');

cc.Class({
    extends: BasePop,

    properties: {
        Title: cc.Label,
        Doc: cc.Label,
        Writer: cc.Label,
        Time: cc.Label
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._super();
    },

    callbackBtnClose: function callbackBtnClose() {
        cc.log('NoticeView : callbackBtnClose');
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        this.dismiss();
    },

    setContent: function setContent() {
        // GameSystem.getInstance().notice.title,
        // GameSystem.getInstance().notice.writer
        // GameSystem.getInstance().notice.time
        this.Title.string = GameSystem.getInstance().notice.title + ":";
        this.Doc.string = GameSystem.getInstance().notice.doc;
        this.Writer.string = GameSystem.getInstance().notice.writer;
        this.Time.string = UtilTool.getFormatData(GameSystem.getInstance().notice.time);
    }

});

cc._RFpop();
},{"Audio_Common":"Audio_Common","BasePop":"BasePop","GameSystem":"GameSystem","MusicMgr":"MusicMgr","UtilTool":"UtilTool"}],"NotifyClubOwnerConfirmPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd0aabKFYc1JBYDxuG4s5W4C', 'NotifyClubOwnerConfirmPacket');
// Script\Network\Cmd\Cmd_Resp\NotifyClubOwnerConfirmPacket.js

"use strict";

/**
 * Created by shrimp on 17/4/9.
 */
var MessageResp = require("MessageResp");
/*
* type CLUB_NOTIFY_OWNER_CONFIRM_T struct {
 ClubHead
 Param CLUB_MSG_JOIN_T `json:"param"`
 }
 type CLUB_MSG_JOIN_T struct {
 Uid     uint32 `json:"uid"`
 Name    string `json:"name"`
 HeadUrl string `json:"headurl"`
 Sex     int    `json:"sex"`
 }
* */
function NotifyClubOwnerConfirmPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.CLUB_NOTIFY_OWNER_CONFIRM_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.clubid = msg.clubid;
        this.param = msg.param;
        //GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = NotifyClubOwnerConfirmPacket;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"NotifyDismissGame":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd0140YgebhJEpKefG14ChV2', 'NotifyDismissGame');
// Script\Network\Cmd\Cmd_Resp\NotifyDismissGame.js

"use strict";

/**
 * Created by shrimp on 17/3/1.
 */
var MessageResp = require("MessageResp");

function NotifyDismissGame() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_NOTIFY_DISMISS_GAME_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        //GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = NotifyDismissGame;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"NotifyGameStartPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '882a4oMvFNO66mxqVOAGvBH', 'NotifyGameStartPacket');
// Script\Network\Cmd\Cmd_Resp\NotifyGameStartPacket.js

'use strict';

/**
 * Created by shrimp on 17/3/5.
 */
/*
* type US_NOTIFY_GAME_SWITCH_T struct {
 JsonHead
 RespHead
 IsStart   int `json:"isstart"`
 ReadyTime int `json:"readytime"`
 }
* */

var MessageResp = require('MessageResp');

function NotifyGameStartPacket() {
    MessageResp.apply(this, []); //集成父类数据
    // {"cmd":6553618,"seq":0,"uid":10010,"code":0,"desc":"执行成功","isstart":1,"readytime":7}
    this.cmd = window.US_NOTIFY_GAME_SWITCH_CMD_ID;
    this.isStart = 0;
    this.readyTime = 0;
    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;

        this.isStart = msg.isstart;
        this.readyTime = msg.readytime;
        this.tstatus = msg.tstatus;
        this.ustatus = msg.ustatus;
    };
}

module.exports = NotifyGameStartPacket;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"NotifyInGameRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'eccc0ZLrYBPv5Qnai2Fl7vo', 'NotifyInGameRespPacket');
// Script\Network\Cmd\Cmd_Resp\NotifyInGameRespPacket.js

"use strict";

/**
 * Created by zhouxueshi on 2017/5/14.
 */

var MessageResp = require("MessageResp");

function NotifyInGameRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_NOTIFY_IN_GAME_CMD_ID;
    this.gamesvcid = 0;
    this.tableid = 0;
    this.gameid = 0;
    this.gamelevel = 0;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        this.gamesvcid = msg.gamesvcid;
        this.tableid = msg.tableid;
        this.gameid = msg.gameid;
        this.gamelevel = msg.gamelevel;
    };
}

module.exports = NotifyInGameRespPacket;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"NotifyOwnerOverPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'dd823stCrZOOqrZUc2MxGgy', 'NotifyOwnerOverPacket');
// Script\Network\Cmd\Cmd_Resp\NotifyOwnerOverPacket.js

"use strict";

/**
 * Created by shrimp on 17/3/1.
 */

/*
* type MAIL_MSG_OWNER_OVER_TABLE_T struct {
 GameSvcId uint32 `json:"gamesvcid"`
 TableId   int32  `json:"tableid"`
 PrivateId int    `json:"privateid"`
 TableName string `jons:"tablename"`
 RemainTime int   `json:"remaintime"` //秒
 }

 //通知桌主，本桌游戏结束
 type US_NOTIFY_OWNER_OVER_TABLE_T struct {
 JsonHead
 Param MAIL_MSG_OWNER_OVER_TABLE_T `json:"param"`
 }
* */
var MessageResp = require("MessageResp");

function NotifyOwnerOverPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_NOTFIY_OWNER_TABLEINFO_CMD_ID;
    this.gamesvcid = 0;
    this.tableid = 0;
    this.privateid = 0;
    this.tablename = "";
    this.remaintime = 0;
    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;

        this.gamesvcid = msg.gamesvcid;
        this.tableid = msg.tableid;
        this.privateid = msg.privateid;
        this.tablename = msg.tablename;
        this.remaintime = msg.remaintime;
    };
}

module.exports = NotifyOwnerOverPacket;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"NotifyOwnerSitPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '92920G9vD9JdqKgKLdI7MZT', 'NotifyOwnerSitPacket');
// Script\Network\Cmd\Cmd_Resp\NotifyOwnerSitPacket.js

"use strict";

/**
 * Created by shrimp on 17/3/3.
 */
var MessageResp = require('MessageResp');

function NotifyOwnerSitPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_NOTIFY_OWNER_CONFIRM_SIT_CMD_ID;

    this.tablename = "";
    this.sitUid = 0;
    this.name = "";
    this.headurl = "";
    this.gamesvcid = 0;
    this.tableid = 0;
    this.privateid = 0;
    this.seatid = -1;
    this.coin = 0;
    this.param = "";

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;

        this.param = msg.param;
        // TableName  string `json:"tablename"`
        // SitUid     uint32 `json:"situid"`
        // Name       string `json:"name"`
        // HeadUrl    string `json:"headurl"`
        // GameSvcId  uint32 `json:"gamesvcid"`
        // TableId    int32  `json:"tableid"`
        // PrivateId  int    `json:"privateid"`
        // CreateTime int64  `json:"createtime"`
        // SeatId     int    `json:"seatid"`
        // Coin       int    `json:"coin"`
        // Time       int64  `json:"time"`
        cc.log("NotifyOwnerSitPacket param=" + msg.param);
        var json = msg.param;
        this.tablename = json.tablename;
        this.sitUid = json.situid;
        this.name = json.name;
        this.headurl = json.headurl;
        this.gamesvcid = json.gamesvcid;
        this.tableid = json.tableid;
        this.privateid = json.privateid;
        this.seatid = json.seatid;
        this.coin = json.coin;
    };
}

module.exports = NotifyOwnerSitPacket;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"NotifyPayOperatePacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c340fdaa8JPq5kULRPqTwuu', 'NotifyPayOperatePacket');
// Script\Network\Cmd\Cmd_Resp\NotifyPayOperatePacket.js

"use strict";

/**
 * Created by shrimp on 17/4/30.
 */

/*
 //通知玩家充值成功
 type CS_NOTIFY_PAY_OPERATE_T struct {
 GameHead
 Param REQ_PAY_OPERATE_T `json:"param"`
 }
 type REQ_PAY_OPERATE_T struct {
 OpUid     uint32 `json:"opuid"`
 OpType    int    `json:"optype"` //操作类型
 OpGold    int    `json:"opgold"`
 OpDiamond int    `json:"opdiamond"`
 OrderNum  string `json:"ordernum"` //订单号
 OpTime    int64  `json:"optime"`
 }
* */
var MessageResp = require("MessageResp");

function NotifyPayOperatePacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_NOTIFY_PAY_OPERATE_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.param = msg.param;
    };
}

module.exports = NotifyPayOperatePacket;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"OwnerConfirmReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'bc4b6istnRHZK1NJ0OIsCsy', 'OwnerConfirmReqPacket');
// Script\Network\Cmd\Cmd_Req\OwnerConfirmReqPacket.js

"use strict";

/**
 * Created by shrimp on 17/3/1.
 */

var MessageReq = require("MessageReq");
var GameSystem = require('GameSystem');
function OwnerConfirmReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_OWNER_CONFIRM_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            gamesvcid: msg.gamesvcid,
            tableid: msg.tableid,
            playeruid: msg.playeruid,
            privateid: msg.privateid,
            result: msg.result };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = OwnerConfirmReqPacket;

cc._RFpop();
},{"GameSystem":"GameSystem","MessageReq":"MessageReq"}],"OwnerConfirmRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '1f1c2uz/wVJzrMUuNdAhMiW', 'OwnerConfirmRespPacket');
// Script\Network\Cmd\Cmd_Resp\OwnerConfirmRespPacket.js

"use strict";

/**
 * Created by shrimp on 17/3/1.
 */
var MessageResp = require("MessageResp");

function OwnerConfirmRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_OWNER_CONFIRM_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        // GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = OwnerConfirmRespPacket;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"OwnerKickOutPlayerReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '632bfJq88BM3LwjjAw3tx8K', 'OwnerKickOutPlayerReqPacket');
// Script\Network\Cmd\Cmd_Req\OwnerKickOutPlayerReqPacket.js

"use strict";

/**
 * Created by shrimp on 17/3/1.
 */
var MessageReq = require("MessageReq");

function OwnerKickOutPlayerReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_OWNER_KICKOUT_PLAYERCMD_ID;

    //准备发送的数据
    this.send = function (msg) {

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = OwnerKickOutPlayerReqPacket;

cc._RFpop();
},{"MessageReq":"MessageReq"}],"OwnerKickOutPlayerRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'ed853dGLRJEXqH3LeAQ6aVK', 'OwnerKickOutPlayerRespPacket');
// Script\Network\Cmd\Cmd_Resp\OwnerKickOutPlayerRespPacket.js

"use strict";

/**
 * Created by shrimp on 17/3/1.
 */
var MessageResp = require("MessageResp");

function OwnerKickOutPlayerRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_OWNER_KICKOUT_PLAYERCMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;

        //GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = OwnerKickOutPlayerRespPacket;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"PickerAddressView":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c7846OdUvxD6J3OaAN/wN6f', 'PickerAddressView');
// Script\ComScene\PopView\PickerAddressView.js

'use strict';

var BasePop = require('BasePop');
cc.Class({
    extends: BasePop,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function onLoad() {}

});

cc._RFpop();
},{"BasePop":"BasePop"}],"Platform":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'b472ezU8QpJfr8/EOiZTlMK', 'Platform');
// Script\Platform\Platform.js

"use strict";

/**
 * Created by shrimp on 17/2/19.
 */

window.Platform_Type = cc.Enum({
    E_PLATFORM_UNKONW: 0,
    E_PLATFORM_ANDROID: 1,
    E_PLATFORM_IPHONE: 2,
    E_PLATFORM_IPAD: 3,
    E_PLATFORM_MAC: 4,
    E_PLATFORM_WINDOWS: 5,
    E_PLATFORM_WEB: 6
});

var GameCallOC = require('GameCallOC');

function PlatformManager() {}

PlatformManager.prototype.getPlatformCode = function () {
    cc.log("PlatformManager.prototype.getPlatformType platform = " + cc.sys.platform);
    return parseInt(cc.sys.platform);
};

PlatformManager.prototype.getOsType = function () {
    cc.log("PlatformManager.prototype.getPlatformType os = " + cc.sys);
    return cc.sys.os;
};

PlatformManager.prototype.getPlatformType = function () {
    this.getOsType();
    var platformCode = this.getPlatformCode();
    var platform = window.Platform_Type.E_PLATFORM_UNKONW;
    switch (platformCode) {
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
};

PlatformManager.prototype.getLanguage = function () {
    cc.log("PlatformManager.getLanguage, language = " + cc.sys.language);

    return cc.sys.language;
};

PlatformManager.prototype.getPackageName = function () {
    cc.log("PlatformManager.getPackageName");
    var packageName = "";
    var ojb = jsb.reflection.callStaticMethod("JSCallBackOC", "getPackageName");
    return packageName;
};

PlatformManager.prototype.getAppVersion = function () {
    var version = 1;

    cc.log("PlatformManager.getAppVersion,version = " + version);
    return version;
};

PlatformManager.prototype.getBattery = function () {

    //cc.log("PlatformManager.getBattery,data = " + JSON.stringify(navigator));

    var batteryLevel = 0;

    navigator.getBattery().then(function (battery) {

        batteryLevel = battery.level;
        function updateLevelInfo() {
            console.log("Battery level: " + battery.level * 100 + "%");
            batteryLevel = battery.level;
        }
        updateLevelInfo();

        battery.addEventListener('levelchange', function () {
            updateLevelInfo();
        });
    });

    cc.log("PlatformManager.getBattery, level = " + batteryLevel);

    return;
};

PlatformManager.prototype.getSignalStrength = function () {
    cc.log("PlatformManager.getSignalStrength");
};

PlatformManager.prototype.generateUUID = function () {

    if (this.getPlatformType() == Platform_Type.E_PLATFORM_WEB || this.getPlatformType() == Platform_Type.E_PLATFORM_ANDROID) {
        //web平台上获取设备id的方法，暂时没有更好的，这个方案下的碰撞率不及1/2^^122,保存在本地数据 易被删除
        var uuid = cc.sys.localStorage.getItem('uuid');
        cc.log("PlatformManager.generateUUID111,uuid = " + uuid);
        if (uuid == 0 || uuid == null || uuid == undefined) {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
            });
            cc.sys.localStorage.setItem("uuid", uuid);
        }
    } else if (this.getPlatformType() == Platform_Type.E_PLATFORM_IPHONE || this.getPlatformType() == Platform_Type.E_PLATFORM_IPAD || this.getPlatformType() == Platform_Type.E_PLATFORM_MAC) {
        return GameCallOC.getInstance().getUUID();
    }
    cc.log("PlatformManager.generateUUID,uuid = " + uuid);
    return uuid;
};

var Platform = function () {
    var instance;

    function getInstance() {
        if (instance === undefined) {
            instance = new PlatformManager();
        }
        return instance;
    };

    return {
        getInstance: getInstance
    };
}();

module.exports = Platform;

cc._RFpop();
},{"GameCallOC":"GameCallOC"}],"PlayScore":[function(require,module,exports){
"use strict";
cc._RFpush(module, '058a6cH1rROtYw40krkuPqA', 'PlayScore');
// Script\ComScene\PopView\PlayScore.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        UserName: cc.Label,
        Uid: cc.Label,
        CarryCoin: cc.Label,
        ZhanGuo: cc.Label,
        WinScore: cc.Label,
        Head: cc.Sprite
    },

    // use this for initialization
    onLoad: function onLoad() {},

    //"uid":11279,"name":"游客11279","headurl":" ","carrycoin":4000,"wincoin":-954
    setScoreInfo: function setScoreInfo(msg) {
        UpdateWXHeadIcon(msg.headurl, this.Head);

        this.Uid.string = msg.uid;
        this.UserName.string = msg.name;
        this.CarryCoin.string = "带入" + msg.carrycoin;

        var coin = msg.carrycoin + msg.wincoin;
        this.ZhanGuo.string = "战果" + coin;

        if (msg.wincoin > 0) {
            this.WinScore.string = "+" + msg.wincoin;
        } else if (msg.wincoin == 0) {
            this.WinScore.string = msg.wincoin;
            this.WinScore.node.color = new cc.Color(204, 160, 41, 255);
        } else {
            this.WinScore.string = msg.wincoin;
            this.WinScore.node.color = cc.Color.GREEN;
        }
    }

});

cc._RFpop();
},{}],"Player":[function(require,module,exports){
"use strict";
cc._RFpush(module, '32125vaHUxGBLMX0QExihnG', 'Player');
// Script\Moudle\Player.js

"use strict";

/**
 * Created by shrimp on 17/2/22.
 */

function Player() {
    this.uid = 0;
    this.name = "";
    this.headurl = "";
    this.sex = 0;
    this.gold = 0; //身上金币
    this.diamond = 0; //身上钻石
    this.coin = 0; //携带金币
    this.seatid = -1; //没有坐下
    this.status = 0;
    this.bowner = 0;
    this.winGold = 0;
    this.TotalCarry = 0;
    this.TotalRound = 0;
    this.TotalTable = 0;
    this.fileId = "";
    this.calltype = 0; //叫庄类型
    this.bBanker = 0; //是否是庄家
    this.betcoinmul = 0; //下注倍数
    this.bOpenCard = 0; //是否看牌
    this.bulltype = 0;
    this.cards = [];
    this.finalcoin = 0;
    this.roomcard = 0; // 房卡数量
}

Player.setSeatId = function (seatid) {
    cc.log("Palyer.setSeadId,seatid = " + seatid);
    this.seatid = seatid;
};

module.exports = Player;

cc._RFpop();
},{}],"Poker":[function(require,module,exports){
"use strict";
cc._RFpush(module, '8a43dBxds1J0r5WKqON/ki6', 'Poker');
// Script\Comm\PokerCard\Poker.js

'use strict';

var CARD_UP_POS = 20;
var CARD_COLOR_MARK = 0xf0;
var CARD_VALUE_MARK = 0x0f;

var cardEnum = [0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, //♠️
0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x1b, 0x1c, 0x1d, //♥️
0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2a, 0x2b, 0x2c, 0x2d, //️♣️
0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3a, 0x3b, 0x3c, 0x3d]; //大小王

cc.Class({
    extends: cc.Component,

    properties: {
        cardData: 0,
        cardColor: 0,
        cardValue: 0,
        cardSelected: 0,
        CardBgImg: cc.Sprite,
        ValueImg: cc.Sprite,
        ColorImg: cc.Sprite,
        SmallColorImg: cc.Sprite,
        GrayLayer: cc.Sprite,
        CardGroundImg: cc.Sprite,

        ValueBlackFrame: [cc.SpriteFrame],
        ValueRedFrame: [cc.SpriteFrame],
        ColorFrame: [cc.SpriteFrame],
        SmallFrame: [cc.SpriteFrame],
        CardGround: cc.SpriteFrame,
        CardBg: cc.SpriteFrame
    },

    // use this for initialization
    onLoad: function onLoad() {},

    initCard: function initCard(cardData) {
        cc.log('Poker : initCard,cardData = ' + cardData);
        this.cardData = cardData;
        this.cardColor = this.getCardColorFromData(cardData);
        this.cardValue = this.getCardValueFromData(cardData);
        this.CardGroundImg.node.active = false;
        cc.log("Poker : initCard,cardValue = " + this.cardValue);
        if (cardData == 0) {
            //牌背
            for (var index = 0; index < this.CardBgImg.node.childrenCount; index++) {
                this.CardBgImg.node.children[index].active = false;
            }
            this.CardBgImg.spriteFrame = this.CardGround;
        } else {
            this.CardBgImg.node.active = true;
            this.ColorImg.node.active = true;
            this.ValueImg.node.active = true;
            this.SmallColorImg.node.active = true;
            this.GrayLayer.node.active = false;
            this.CardBgImg.spriteFrame = this.CardBg;
            //牌面
            if (this.cardColor == 0 || this.cardColor == 2) {
                this.ColorImg.spriteFrame = this.ColorFrame[this.cardColor];
                this.SmallColorImg.spriteFrame = this.SmallFrame[this.cardColor];
                this.ValueImg.spriteFrame = this.ValueBlackFrame[this.cardValue - 1];
            } else if (this.cardColor == 1 || this.cardColor == 3) {
                this.ColorImg.spriteFrame = this.ColorFrame[this.cardColor];
                this.SmallColorImg.spriteFrame = this.SmallFrame[this.cardColor];
                this.ValueImg.spriteFrame = this.ValueRedFrame[this.cardValue - 1];
            } else if (this.cardColor === 4) {
                //大小王
                cc.error('Poker : initCard,cardColor error');
            } else {
                cc.error('Poker : initCard,cardColor error');
            }
        }

        cc.log("Poker : initCard,CardGroundImg.active = " + this.CardGroundImg.node.active);
    },

    getValueStringFromData: function getValueStringFromData() {},

    getCardColorFromData: function getCardColorFromData(CardDate) {
        return (CardDate & CARD_COLOR_MARK) >> 4;
    },

    getCardValueFromData: function getCardValueFromData(CardDate) {
        return CardDate & CARD_VALUE_MARK;
    },

    runCardSelect: function runCardSelect(Select) {
        cc.log('Poker : runCardSelect,bSelect = ', Select);

        this.cardSelected = Select;
        if (this.cardSelected == 1) {
            this.node.position = cc.p(this.node.getPosition().x, CARD_UP_POS);
        } else {
            this.node.position = cc.p(this.node.getPosition().x, 0);
        }
    },

    setCardSelecting: function setCardSelecting(bSelect) {
        cc.log('Poker.setCardSelecting,bSelect = ' + bSelect);
        this.cardSelected = bSelect;
        if (bSelect == 1) {
            this.GrayLayer.node.opacity = 180;
        } else {
            this.GrayLayer.node.opacity = 0;
        }
    },

    setBtnCard: function setBtnCard() {
        this.cardSelected = this.cardSelected == 0 ? 1 : 0;
        this.runCardSelect(this.cardSelected);
    }

});

cc._RFpop();
},{}],"ProduceCell":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'f0943bDNCVErrhkTrpk/kl7', 'ProduceCell');
// Script\ComScene\PopView\ProduceCell.js

'use strict';

var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameCallOC = require('GameCallOC');
var GamePlayer = require('GamePlayer');
var MessageFactory = require('MessageFactory');
var AlertView = require('AlertView');
var HttpManager = require('HttpManager');
var WeChatApi = require('WeChatApi');
var GameSystem = require('GameSystem');
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...

        ProduceImg: cc.Sprite,
        ProduceName: cc.Label,
        ProducePrice: cc.Label,
        ProduceDesc: cc.Label,
        MoneyLabel: cc.Label,
        ProducePriceImg: cc.Sprite,
        ProduceGoldFrame: [cc.SpriteFrame],
        ProduceDiamondFrame: [cc.SpriteFrame],
        PropFrame: [cc.SpriteFrame],
        Diamond: cc.Sprite,
        ReferralCodeView: cc.Prefab,
        ActivityFlag: cc.Sprite,
        ActivityFlagFrame: [cc.SpriteFrame]

    },

    // use this for initialization
    onLoad: function onLoad() {
        //this.initData();
    },

    initData: function initData() {
        this.ProduceType = 0; //0 gold 1 diamond
        this.Price = 0;
        this.Name = "";
        this.id = 0;
        this.msg = null;
    },

    setProduceData: function setProduceData(type, msg) {
        this.msg = msg;
        this.ProduceType = type;
        this.setProduceName(msg.name);
        this.setProducePrice(msg.cost);
        this.setProduceTypeAndImg(type, msg.type);
        this.ProduceDesc.string = msg.desc;
        this.MoneyLabel.node.active = false;
    },

    setProduceDataDiamond: function setProduceDataDiamond(type, msg) {
        this.msg = msg;
        this.ProduceType = type;
        this.setProduceName(msg.name);
        this.MoneyLabel.node.active = true;
        this.MoneyLabel.string = "售价：¥" + msg.cost;
        this.Price = msg.cost;
        if (GameSystem.getInstance().VerStatus == GameSystem.getInstance().VerStatusType.VERSION_TYPE_AUDIT && GameCallOC.getInstance().checkIsAble()) {
            this.ProduceDesc.node.active = false;
        } else {
            this.ProduceDesc.node.active = true;
            this.ProduceDesc.string = msg.desc;
        }

        this.ProducePrice.node.active = false;
        this.Diamond.node.active = false;
        this.setProduceTypeAndImg(type, msg.type);
        this.id = msg.id;
    },

    setProduceName: function setProduceName(name) {
        this.Name = name;
        this.ProduceName.string = name;
    },

    setProducePrice: function setProducePrice(price) {
        this.Price = price;
        this.ProducePrice.string = price;
    },

    setProduceTypeAndImg: function setProduceTypeAndImg(type, index) {

        if (type == 0) {
            this.ProduceImg.spriteFrame = this.PropFrame[index - 1];
        } else {
            this.ProduceImg.spriteFrame = this.ProduceDiamondFrame[index - 1];
        }

        var activity = 0;
        if (type == 1 && (index == 4 || index == 5)) activity = 1;
        this.setActivityFlag(type, activity);
    },

    setActivityFlag: function setActivityFlag(type, activity) {
        if (GameSystem.getInstance().VerStatus == GameSystem.getInstance().VerStatusType.VERSION_TYPE_AUDIT && GameCallOC.getInstance().checkIsAble()) {
            this.ActivityFlag.node.active = false;
            return;
        }

        if (activity > 0) {
            this.ActivityFlag.node.active = true;
        } else {
            this.ActivityFlag.node.active = false;
        }
    },

    createReferralCodeView: function createReferralCodeView() {
        var winSize = cc.director.getWinSize();
        var referralCodeView = cc.instantiate(this.ReferralCodeView);
        cc.director.getScene().addChild(referralCodeView);
        referralCodeView.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
    },

    callBtnBuy: function callBtnBuy() {
        cc.log("ProductCell.callBtnBuy");
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if (this.ProduceType == 1) {
            if (GameSystem.getInstance().productid == 2) {
                var self = this;
                var alert = AlertView.create();
                alert.setPositiveButton(function () {}, "确定");

                var str = "请联系微信客服：[" + GameSystem.getInstance().weixincs + "]充值";
                alert.show(str, AlertViewBtnType.E_BTN_CLOSE);
            } else {
                if (GameSystem.getInstance().VerStatus == GameSystem.getInstance().VerStatusType.VERSION_TYPE_AUDIT && GameCallOC.getInstance().checkIsAble()) {
                    GameCallOC.getInstance().payAppstore(this.msg.id, GamePlayer.getInstance().uid);
                } else {
                    if (GameSystem.getInstance().referralCode == 0) {

                        var self = this;
                        var alert = AlertView.create();
                        alert.setPositiveButton(function () {
                            self.createReferralCodeView();
                        }, "绑定");

                        var str = "首次购买钻石请绑定推广人";
                        alert.show(str, AlertViewBtnType.E_BTN_CLOSE);
                        return;
                    } else {
                        WeChatApi.getInstance().weChatPay(this.msg.id, GamePlayer.getInstance().uid);
                    }
                }
            }
        } else {
            var self = this;
            var alert = AlertView.create();
            alert.setPositiveButton(function () {
                var data = {
                    type: self.msg.type
                };
                MessageFactory.createMessageReq(US_REQ_EXCHANGE_GOLD_CMD_ID).send(data);
            }, "兑换");
            alert.setNegativeButton(function () {}, "取消");

            var str = "您是否确定消耗" + this.msg.cost + "个钻石兑换" + this.msg.name + "(" + this.msg.desc + ")";
            alert.show(str, AlertViewBtnType.E_BTN_CANCLE);
        }
    }

});

cc._RFpop();
},{"AlertView":"AlertView","Audio_Common":"Audio_Common","GameCallOC":"GameCallOC","GamePlayer":"GamePlayer","GameSystem":"GameSystem","HttpManager":"HttpManager","MessageFactory":"MessageFactory","MusicMgr":"MusicMgr","WeChatApi":"WeChatApi"}],"ProgressSlider":[function(require,module,exports){
"use strict";
cc._RFpush(module, '504c9tlYPRHLoYfTJJ2lAd8', 'ProgressSlider');
// Script\Comm\ProgressSlider.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        Slider: cc.Slider,
        Bar: cc.ProgressBar,
        Label: cc.Label,
        MaxLabel: cc.Label,
        MinLabel: cc.Label,
        iMax: 0,
        iMin: 0
    },

    // use this for initialization
    onLoad: function onLoad() {},

    getNumFromCurNum: function getNumFromCurNum(num) {
        var targetNum = num;
        var num1 = num % 100;
        if (num1 >= 50) {
            targetNum = num + (100 - num1);
        } else {
            targetNum = num - num1;
        }

        if (targetNum > this.iMax) {
            targetNum = this.iMax;
        } else if (targetNum < this.iMin) {
            targetNum = this.iMin;
        }

        var progress = (targetNum - this.iMin) / (this.iMax - this.iMin);
        this.Bar.progress = progress;
        this.Slider.progress = progress;

        return targetNum;
    },

    setMinAndMax: function setMinAndMax(min, max) {
        this.iMax = max;
        this.iMin = min;
        this.MaxLabel.string = this.iMax;
        this.MinLabel.string = this.iMin;
        this.Bar.progress = this.Slider.progress;
        var num = parseInt(this.iMin + (this.iMax - this.iMin) * this.Slider.progress);
        this.CurCarryNum = this.getNumFromCurNum(num);
        this.Label.string = this.CurCarryNum;
    },

    callBackSlider: function callBackSlider(slider, customEventData) {
        this.Bar.progress = this.Slider.progress;
        var num = parseInt(this.iMin + (this.iMax - this.iMin) * this.Slider.progress);
        this.CurCarryNum = this.getNumFromCurNum(num);
        this.Label.string = this.CurCarryNum;
        this.Label.string = this.CurCarryNum;
    }
});

cc._RFpop();
},{}],"ReferralCodeView":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'da950uqPANGxog4PDcUaP0y', 'ReferralCodeView');
// Script\ComScene\PopView\ReferralCodeView.js

'use strict';

var BasePop = require('BasePop');
var ToastView = require('ToastView');
var LoadingView = require('LoadingView');
var MessageFactory = require('MessageFactory');
var GameSystem = require('GameSystem');

cc.Class({
    extends: BasePop,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        ReferralCode: cc.EditBox
    },

    // use this for initialization
    onLoad: function onLoad() {},

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    callBackBtn: function callBackBtn(event, CustomEventData) {
        var BtnName = event.target.getName();
        cc.log("ReferralCodeView.callBackBtn,BtnName = " + BtnName);
        if (BtnName == "BtnClose") {
            this.dismiss();
        } else if (BtnName == "BtnSure") {
            cc.log('ReferralCodeView.callBackBtn,ReferralCode = ' + this.ReferralCode.string);
            if (this.ReferralCode.string == "") {
                ToastView.show('推荐码不能为空！');
                return;
            }

            var data = {
                referralid: Number(this.ReferralCode.string)
            };

            MessageFactory.createMessageReq(US_REQ_BIND_REFERRAL_CMD_ID).send(data);

            this.dismiss();
        }
    }
});

cc._RFpop();
},{"BasePop":"BasePop","GameSystem":"GameSystem","LoadingView":"LoadingView","MessageFactory":"MessageFactory","ToastView":"ToastView"}],"RollMsg":[function(require,module,exports){
"use strict";
cc._RFpush(module, '2e8561JDMdNrK6WrDK6DwBL', 'RollMsg');
// Script\ComScene\PopView\RollMsg.js

"use strict";

/**
 *
 *
 * 滚动消息  拖入场景 后 自己管理自己
 *
 *
 * 当前版本1.3.2 richtext 有bug  等待官方解决
 */

var BasePop = require('BasePop');

//var ServerSpeakPacket = require('ServerSpeakPacket');
function RollMsgT() {
    this.strMsg = "";
    this.iType = 0;
}

cc.Class({
    extends: BasePop,

    properties: {
        speaker: cc.Sprite,
        speakerTxtHtml: cc.RichText,
        speakerHolder: cc.Node
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._super();

        this.queueSpeakerMsg = new Array();
        this.isShowRollFinish = true;

        this.speaker.node.active = false;

        this.baseX = this.speakerTxtHtml.node.x;

        this.remaindWidth = 960 + this.speakerTxtHtml.node.x;
    },

    onDestroy: function onDestroy() {
        GlobalEventManager.getInstance().removeListener(this.socketMessageListenerID);
    },

    onSceneMsg: function onSceneMsg(event) {
        var msg = event.data;
        if (msg.popView == "HallScene") {
            if (msg.btn == "RollMsg") {
                var ledInfo = msg.data;

                this.addSpeakerMsg(ledInfo.text, 0);
            }
        }
    },

    onMessage: function onMessage(event) {
        var msg = event.data;
        var cmd = msg.cmd;
        switch (cmd) {
            case window.SERVER_SPEAK_NEW_CMD:

                this.addSpeakerMsg(msg.trumpetMsg, msg.trumpetType);
                break;

        }
    },

    addSpeakerMsg: function addSpeakerMsg(content, contenttype) {
        if (content === undefined || content == "") {
            return;
        }
        // <color = 0xFFFFFFFF> 洪福齐天,玩家</color><color = 0x00b8c8FF>元大炮</color><color = 0xFFFFFFFF>在炸金花1元场赢取</color><color = 0x00d236FF>5000金币</color><color = 0xFFFFFFFF>,富甲一方</color>


        var ss = String(content);
        var re = /0x/g;
        var newContent = ss.replace(re, "#");
        var re2 = /FF>/g;
        newContent = newContent.replace(re2, ">");

        var msg = new RollMsgT();
        msg.iType = contenttype;
        msg.strMsg = newContent;

        this.queueSpeakerMsg.push(msg);
    },

    showSpeaker: function showSpeaker(content, contenttype) {
        if (content == "") {
            return;
        }
        this.speakerTxtHtml.node.active = true;
        this.speakerTxtHtml.node.x = this.baseX;
        this.speakerTxtHtml.node.y = this.speakerHolder.height * 2;
        this.speakerTxtHtml.string = content;

        var size = cc.size(this.speakerHolder.width, this.speakerHolder.height);

        var moveTo = cc.moveTo(1.0, cc.p(this.speakerTxtHtml.node.x, 0));
        var delay = cc.delayTime(2.0);
        var actionCallBack = cc.callFunc(this.moveDownCallback, this);
        var actionall = cc.sequence(moveTo, delay, actionCallBack);
        this.speakerTxtHtml.node.runAction(actionall);
    },

    moveDownCallback: function moveDownCallback() {
        var winSize = cc.director.getWinSize();
        var contentSize = cc.size(this.speakerTxtHtml._linesWidth[0], this.speakerTxtHtml.node.height);

        var moveX = 0;
        if (this.remaindWidth < contentSize.width - winSize.width || this.speakerHolder.width < contentSize.width) {
            moveX = contentSize.width + this.remaindWidth;
        }

        if (moveX <= 0) {
            this.moveLeftCallback();
        } else {
            var moveBy = cc.moveBy(moveX / 300, cc.p(moveX > 0 ? -moveX : 0, 0));
            var delay = cc.delayTime(0.8);
            var actionCallBack = cc.callFunc(this.moveLeftCallback, this);
            var actionall = cc.sequence(moveBy, delay, actionCallBack);
            this.speakerTxtHtml.node.runAction(actionall);
        }
    },
    moveLeftCallback: function moveLeftCallback() {
        this.isShowRollFinish = true;
        if (this.speakerTxtHtml) {
            // speakerTxtHtml.removeFromParentAndCleanup(true);
            this.speakerTxtHtml.node.active = false;
        }

        if (this.queueSpeakerMsg.length == 0 && this.speaker && this.speaker.node.activeInHierarchy) ;
        {
            this.speaker.node.active = false;
        }
    },

    update: function update(dt) {
        var self = this;
        if (self.queueSpeakerMsg.length > 0 && self.isShowRollFinish) {
            if (self.speaker && !self.speaker.node.active) {
                self.speaker.node.active = true;
            }

            this.isShowRollFinish = false;
            var msg = self.queueSpeakerMsg.pop();
            self.showSpeaker(msg.strMsg, msg.iType);
        }
    }

});

cc._RFpop();
},{"BasePop":"BasePop"}],"RoomInfoView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '1f118BQOFlNVrXBx+ux8lw0', 'RoomInfoView');
// Script\ComScene\PopView\RoomInfoView.js

'use strict';

var BasePop = require('BasePop');
var MessageFactory = require('MessageFactory');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require('GameSystem');
var UtilTool = require('UtilTool');

cc.Class({
    extends: BasePop,

    properties: {
        RoomName: {
            default: null,
            type: cc.Label
        },
        GameName: {
            default: null,
            type: cc.Label
        },
        GameType: {
            default: null,
            type: cc.Label
        },
        MinAnte: {
            default: null,
            type: cc.Label
        },
        LiveTime: {
            default: null,
            type: cc.Label
        },
        MaxSeat: {
            default: null,
            type: cc.Label
        },

        SelfWinCoin: {
            default: null,
            type: cc.Label
        },
        SelfCarryCoin: {
            default: null,
            type: cc.Label
        },
        SelfPlayNum: {
            default: null,
            type: cc.Label
        },
        SelfWinNum: {
            default: null,
            type: cc.Label
        },
        SelfLoseNum: {
            default: null,
            type: cc.Label
        },
        SelfSuperNum: {
            default: null,
            type: cc.Label
        },
        SelfNormalNum: {
            default: null,
            type: cc.Label
        },
        SelfNotcallNum: {
            default: null,
            type: cc.Label
        },
        SelfBankerNum: {
            default: null,
            type: cc.Label
        },
        SelfGiftNum: {
            default: null,
            type: cc.Label
        },
        SelfUseGold: {
            default: null,
            type: cc.Label
        },
        SelfUseDiamond: {
            default: null,
            type: cc.Label
        },

        scrollView: cc.ScrollView,
        PlayScorePrefab: cc.Prefab,
        BtnShare: cc.Button
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._super();

        if (GameSystem.getInstance().VerStatus == GameSystem.getInstance().VerStatusType.VERSION_TYPE_AUDIT) {
            this.BtnShare.node.active = false;
        }
    },

    /*********************Network***************************/
    onMessage: function onMessage(event) {
        cc.log("RoomInfoView.onMessage");
        //this._super(event);
        var msg = event.data;
        var cmd = msg.cmd;
        switch (cmd) {
            case US_RESP_SCORE_DETAIL_CMD_ID:
                this.onScoreDetailbMsg(msg);
                break;
        }
    },

    //{"cmd":131214,"seq":2,"uid":11279,"code":0,"desc":"执行成功",
    // "param":{
    //  "table":{"tablename":"游客11279","gameid":101,"minante":1,"gametype":1,"livetime":1800,"maxseat":2},
    //  "myself":{"carrycoin":4000,"wincoin":-954,"winnum":6,"losenum":10,"playnum":16,"supernum":10,
    //   "normalnum":3,"notcallnum":3,"bankernum":11,"chatnum":0,"giftnum":0,"usegold":0,"usediamond":100},
    // "list":[{"uid":11279,"name":"游客11279","headurl":" ","carrycoin":4000,"wincoin":-954},
    //         {"uid":11300,"name":"游客11300","headurl":"","carrycoin":1000,"wincoin":954}]}}
    onScoreDetailbMsg: function onScoreDetailbMsg(msg) {
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            this.RoomName.string = msg.table.tablename;
            this.GameName.string = GetGameName(msg.table.gameid);
            this.GameType.string = GetGameType(msg.table.gametype);
            this.MinAnte.string = msg.table.minante;
            this.LiveTime.string = UtilTool.getHourTime(msg.table.livetime);
            this.MaxSeat.string = msg.table.maxseat + "人";

            this.SelfWinCoin.string = msg.myself.wincoin;
            this.SelfCarryCoin.string = msg.myself.carrycoin;
            this.SelfPlayNum.string = msg.myself.playnum;
            this.SelfWinNum.string = msg.myself.winnum;
            this.SelfLoseNum.string = msg.myself.losenum;
            this.SelfSuperNum.string = msg.myself.supernum;
            this.SelfNormalNum.string = msg.myself.normalnum;
            this.SelfNotcallNum.string = msg.myself.notcallnum;
            this.SelfBankerNum.string = msg.myself.bankernum;
            this.SelfGiftNum.string = msg.myself.giftnum;
            this.SelfUseGold.string = msg.myself.usegold;
            this.SelfUseDiamond.string = msg.myself.usediamond;

            cc.log("this.scrollView.content.height =", this.scrollView.content.height);

            var height = 0;
            var defaultPos = 1320;
            for (var index = 0; msg.list != null && index < msg.list.length; index++) {
                var playScore = cc.instantiate(this.PlayScorePrefab);
                this.scrollView.content.addChild(playScore);
                height = playScore.getContentSize().height;
                playScore.setPosition(cc.p(0, -defaultPos - playScore.getContentSize().height * index));
                playScore.getComponent("PlayScore").setScoreInfo(msg.list[index]);
            }
            cc.log("height * (msg.list.length) =" + height * msg.list.length);

            if (height * msg.list.length + defaultPos > this.scrollView.content.height) {
                this.scrollView.content.height = height * msg.list.length + defaultPos;
            }
            cc.log("this.scrollView.content.height =", this.scrollView.content.height);
        }
    },

    sendGetSuccessDetail: function sendGetSuccessDetail(msg) {
        var data = {
            privateid: msg.privateid,
            createtime: msg.createtime
        };
        MessageFactory.createMessageReq(US_REQ_SCORE_DETAIL_CMD_ID).send(data);
    },

    callbackBtn: function callbackBtn(event, CustomEventData) {
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        var BtnName = event.target.getName();
        if (BtnName == "BtnBack") {
            this.dismiss();
        } else if (BtnName == "BtnShare") {
            var message = {
                popView: "RoomInfoView",
                btn: "BtnShare"
            };
            GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.SCENE_MSG, data: message });
        }
    }

});

cc._RFpop();
},{"Audio_Common":"Audio_Common","BasePop":"BasePop","GameSystem":"GameSystem","MessageFactory":"MessageFactory","MusicMgr":"MusicMgr","UtilTool":"UtilTool"}],"RuleView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '429f0FNv/lNsI9YR2n9QoQk', 'RuleView');
// Script\ComScene\PopView\RuleView.js

'use strict';

var BasePop = require('BasePop');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require("GameSystem");

cc.Class({
    extends: BasePop,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            cc.log("stop event");
            event.stopPropagation();
        }.bind(this));

        this.scaleTo(this.bg);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    callbackBtnClose: function callbackBtnClose() {
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        cc.log("RuleView : callbackBtnClose");
        this.dismiss();
    },

    checkEventsRule: function checkEventsRule(event, customEventData) {
        cc.log('RuleView : checkEventsRule,event = ' + event + ',customEventData =' + customEventData);
    }
});

cc._RFpop();
},{"Audio_Common":"Audio_Common","BasePop":"BasePop","GameSystem":"GameSystem","MusicMgr":"MusicMgr"}],"ScoreDetailReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'f460bPPoUdDwZ2HD0LC71Hr', 'ScoreDetailReqPacket');
// Script\Network\Cmd\Cmd_Req\ScoreDetailReqPacket.js

"use strict";

/**
 * Created by shrimp on 17/3/30.
 */
var MessageReq = require("MessageReq");
/*
* type US_REQ_SCORE_DETAIL_T struct {
 JsonHead
 Param PARAM_REQ_SCORE_DETAIL_T `json:"param"`
 }
 type PARAM_REQ_SCORE_DETAIL_T struct {
 PrivateId  int   `json:"privateid"`
 CreateTime int64 `json:"createtime"`
 }
* */
function ScoreDetailReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_SCORE_DETAIL_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            param: msg
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = ScoreDetailReqPacket;

cc._RFpop();
},{"MessageReq":"MessageReq"}],"ScoreDetailRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd9d3eqvEr9GRYMx5gT7w5AO', 'ScoreDetailRespPacket');
// Script\Network\Cmd\Cmd_Resp\ScoreDetailRespPacket.js

"use strict";

/**
 * Created by shrimp on 17/3/30.
 */
/**
 type US_RESP_SCORE_DETAIL_T struct {
     JsonHead
     RespHead
     Param PARAM_RESP_SCORE_DETAIL_T `json:"param"`
 }

 type PARAM_RESP_SCORE_DETAIL_T struct {
     Table  PARAM_TABLE_DETAIL_T `json:"table"`
     MySelf PARAM_MYSELF_SCORE_T `json:"myself"`
    List   []TABLE_USER_SCORE_T `json:"list"`
 }

 type PARAM_TABLE_DETAIL_T struct {
     TableName string `json:"tablename"` //牌局名称
     GameId    int    `json:"gameid"`    //选择玩法(游戏id)
     MinAnte   int    `json:"minante"`   //最小下注(1)
     GameType  int    `json:"gametype"`  //抢庄模式
     LiveTime  int64  `json:"livetime"`  //桌子时间
     MaxSeat   int    `json:"maxseat"`   //本桌人数
 }

 type PARAM_MYSELF_SCORE_T struct {
     CarryCoin  int `json:"carrycoin"`  //带入金币
     WinCoin    int `json:"wincoin"`    //输赢(最终战绩)
     WinNum     int `json:"winnum"`     //赢牌次数
     LoseNum    int `json:"losenum"`    //失败次数
     PlayNum    int `json:"playnum"`    //玩牌次数
     SuperNum   int `json:"supernum"`   //超级抢庄次数
     NormalNum  int `json:"normalnum"`  //普通抢庄次数
     NotCallNum int `json:"notcallnum"` //未叫庄次数
     BankerNum  int `json:"bankernum"`  //坐庄次数
     ChatNum    int `json:"chatnum"`    //聊天次数
     GiftNum    int `json:"giftnum"`    //发送礼物次数
     UseGold    int `json:"usegold"`    //发送礼物消耗金币
     UseDiamond int `json:"usediamond"` //抢庄消耗钻石
 }

 type TABLE_USER_SCORE_T struct {
     Uid       int    `json:"uid"`
     Name      string `json:"name"`
     HeadUrl   string `json:"headurl"`
     CarryCoin int    `json:"carrycoin"`
     WinCoin   int    `json:"wincoin"`
 }
* */
var MessageResp = require("MessageResp");
function ScoreDetailRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_SCORE_DETAIL_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {
        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.param = msg.param;
        this.table = this.param.table;
        this.myself = this.param.myself;
        this.list = this.param.list;
    };
}

module.exports = ScoreDetailRespPacket;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"ScoreListReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '70d7dYRmxtFbq8/L9fHB9FC', 'ScoreListReqPacket');
// Script\Network\Cmd\Cmd_Req\ScoreListReqPacket.js

"use strict";

/**
 * Created by shrimp on 17/3/30.
 */
var MessageReq = require("MessageReq");
/*
 * type US_REQ_SCORE_LIST_T struct {
 JsonHead
 Param PARAM_REQ_SCORE_LIST_T `json:"param"`
 }
 type PARAM_REQ_SCORE_LIST_T struct {
 IsCreate int8 `json:"iscreate` //0：参与的牌局, 1: 创建的牌局
 Start    int  `json:"start"`   //从哪里开始
 Total    int  `json:"total"`   //多少个
 }
 }

 * */
var GameSystem = require("GameSystem");

function ScoreListReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_SCORE_LIST_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            param: msg
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = ScoreListReqPacket;

cc._RFpop();
},{"GameSystem":"GameSystem","MessageReq":"MessageReq"}],"ScoreListRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '6bc69wV3UZE04QsA4SxvQrt', 'ScoreListRespPacket');
// Script\Network\Cmd\Cmd_Resp\ScoreListRespPacket.js

"use strict";

/**
 * Created by shrimp on 17/3/30.
 */

var MessageResp = require("MessageResp");

/*
 * type US_RESP_SCORE_LIST_T struct {
 JsonHead
 RespHead
 Param PARAM_RESP_SCORE_LIST_T `json:"param"`
 }
 type PARAM_RESP_SCORE_LIST_T struct {
 IsCreate int8           `json:"iscreate"` //0：参与的牌局, 1: 创建的牌局
 List     []USER_SCORE_T `json:"list"`
 }
 type USER_SCORE_T struct {
 PrivateId  int    `json:"privateid"`
 CreateTime int64  `json:"createtime"`
 LiveTime   int64  `json:"livetime"`
 TableName  string `json:"tablename"`
 OwnerName  string `json:"ownername"`
 HeadUrl    string `json:"headurl"`
 CarryCoin  int    `json:"carrycoin"` //携带
 WinCoin    int    `json:"wincoin"`   //输赢
 }

 */

function ScoreListRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_SCORE_LIST_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.param = msg.param;
        //var json = JSON.parse(BASE64.decoder(msg.param));
        this.iscreate = this.param.iscreate;
        this.list = this.param.list;
    };
}

module.exports = ScoreListRespPacket;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"SearchClubReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '59ad7nPZS1CWK+opKkhtFJF', 'SearchClubReqPacket');
// Script\Network\Cmd\Cmd_Req\SearchClubReqPacket.js

'use strict';

/**
 * Created by shrimp on 17/4/8.
 */
var MessageReq = require("MessageReq");
var GamePlayer = require('GamePlayer');
var GameSystem = require('GameSystem');

function SearchClubReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_SEARCH_CLUB_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {
        cc.log("FindRoomReqPacket.send");

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            key: msg.key
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = SearchClubReqPacket;

cc._RFpop();
},{"GamePlayer":"GamePlayer","GameSystem":"GameSystem","MessageReq":"MessageReq"}],"SearchClubRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'a8007sAByRNTLX/L4O3bOr8', 'SearchClubRespPacket');
// Script\Network\Cmd\Cmd_Resp\SearchClubRespPacket.js

"use strict";

/**
 * Created by shrimp on 17/4/8.
 */
var MessageResp = require("MessageResp");

function SearchClubRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_SEARCH_CLUB_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;
        this.param = msg.param;
        //GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = SearchClubRespPacket;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"ServerKickOutPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '84b18IYgKdI2omNPTktRT3W', 'ServerKickOutPacket');
// Script\Network\Cmd\Cmd_Resp\ServerKickOutPacket.js

"use strict";

/**
 * Created by shrimp on 17/2/22.
 */
var MessageResp = require("MessageResp");

function ServerKickOutPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_KICK_OUT_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;

        //GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = ServerKickOutPacket;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"ServiceView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '328e8CHESdDD6ErIlSNfHgo', 'ServiceView');
// Script\ComScene\PopView\ServiceView.js

"use strict";

var BasePop = require("BasePop");
var MusicMgr = require("MusicMgr");
var Audio_Common = require("Audio_Common");
var GameSystem = require("GameSystem");

cc.Class({
    extends: BasePop,

    properties: {
        CommitLayout: {
            default: null,
            type: cc.Layout
        },
        HistoryLayout: {
            default: null,
            type: cc.Layout
        },
        ServiceOnlineLayout: {
            default: null,
            type: cc.Layout
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        cc.log('ServiceView : onLoad');
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            cc.log("stop event");
            event.stopPropagation();
        }.bind(this));

        this.scaleTo(this.bg);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    callbackBtnClose: function callbackBtnClose() {
        cc.log("ServiceView : callbackBtnClose");
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        this.dismiss();
    },

    callbackBtnLabel: function callbackBtnLabel(toggle, customEventData) {
        cc.log("ServiceView : callbackBtnLabel,customEventData = " + customEventData);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        this.switchLayout(customEventData);
    },

    switchLayout: function switchLayout(type) {
        if (type === 1) {
            this.CommitLayout.node.setVisible(true);
            //this.CommitLayout.node.opacity = 255;
            this.HistoryLayout.node.opacity = 0;
            this.ServiceOnlineLayout.node.opacity = 0;
        } else if (type === 2) {
            this.CommitLayout.node.setVisible(false);
            //this.CommitLayout.node.opacity = 0;
            this.HistoryLayout.node.opacity = 255;
            this.ServiceOnlineLayout.node.opacity = 0;
        } else {
            this.CommitLayout.node.opacity = 0;
            this.HistoryLayout.node.opacity = 0;
            this.ServiceOnlineLayout.node.opacity = 255;
        }
    }
});

cc._RFpop();
},{"Audio_Common":"Audio_Common","BasePop":"BasePop","GameSystem":"GameSystem","MusicMgr":"MusicMgr"}],"SettingView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '3080a2YtFRA6r61Eg5ZRAxz', 'SettingView');
// Script\ComScene\PopView\SettingView.js

"use strict";

var BasePop = require("BasePop");
var MusicMgr = require("MusicMgr");
var Audio_Common = require("Audio_Common");
var WeChatApi = require('WeChatApi');
var GameSystem = require("GameSystem");

cc.Class({
    extends: BasePop,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        MusicSwitch: cc.Toggle,
        EffectSwitch: cc.Toggle
    },

    // use this for initialization
    onLoad: function onLoad() {
        cc.log('SettingView : onLoad');
        // this.node.on(cc.Node.EventType.TOUCH_START, function(event){
        //     cc.log("stop event");
        //     event.stopPropagation();
        // }.bind(this));

        //this.scaleTo(this.bg);

        this.MusicSwitch.isChecked = MusicMgr.getMusicVolume() == 1;
        this.EffectSwitch.isChecked = MusicMgr.getEffectVolume() == 1;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    callBackBtnMusic: function callBackBtnMusic(toggle, CustomEventData) {
        var btnName = toggle.target.getName();
        cc.log("SettingView.callBackBtnMusic,btnName = " + btnName);
        var isCheck = toggle.isChecked;
        cc.log("SettingView.callBackBtnMusic,isCheck = " + isCheck);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if (CustomEventData == 1) {
            if (isCheck) {
                MusicMgr.setEffectsVolume(1);
            } else {
                MusicMgr.setEffectsVolume(0);
            }
        } else if (CustomEventData == 2) {
            if (isCheck) {
                MusicMgr.setMusicVolume(1);
            } else {
                MusicMgr.setMusicVolume(0);
            }
        } else if (CustomEventData == 3) {}
    },

    callbackBtnClose: function callbackBtnClose() {
        cc.log('SettingView:callbackBtnClose');
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        this.dismiss();
    },

    callbackBtnAbout: function callbackBtnAbout() {
        cc.log('SettingView:callbackBtnAbout');
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        //this.dismiss();
    },

    callbackBtnExitAccout: function callbackBtnExitAccout() {
        cc.log('SettingView:callbackBtnExitAccout');
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        //cc.director.loadScene('HallScene');
        var message = {
            popView: "SettingView",
            btn: "BtnExitLogin"
        };
        GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.SCENE_MSG, data: message });
        WeChatApi.getInstance().clearWeChatLogin();
        this.dismiss();
    }
});

cc._RFpop();
},{"Audio_Common":"Audio_Common","BasePop":"BasePop","GameSystem":"GameSystem","MusicMgr":"MusicMgr","WeChatApi":"WeChatApi"}],"ShareView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '2597cxNdiFJoaVGaAGtQfag', 'ShareView');
// Script\ComScene\PopView\ShareView.js

'use strict';

var BasePop = require('BasePop');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var WeChatApi = require("WeChatApi");
var GameSystem = require("GameSystem");

window.ShareType = cc.Enum({
    E_SHARETYPE_STRING: 1,
    E_SHARETYPE_IMAGE: 2,
    E_SHARETYPE_LINK: 3,
    E_SHARETYPE_APP: 4
});

cc.Class({
    extends: BasePop,

    properties: {},

    // use this for initialization
    onLoad: function onLoad() {
        this._super();
        this.initBaseData();
    },

    initBaseData: function initBaseData() {
        this.ShareString = "";
        this.ImagePath = "";
        this.Url = "";
        this.ShareType = ShareType.E_SHARETYPE_STRING;
    },

    callbackBtn: function callbackBtn(event, CustomEventData) {
        cc.log("ShareView.callbackBtn,CustomEventData = " + CustomEventData);
        var btnName = event.target.getName();
        cc.log("ShareView.callbackBtn,btnName = " + btnName);
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if (btnName == "BtnClose") {
            this.dismiss();
        } else if (btnName == "BtnFriends") {
            this.ShareCallBack(1);
            this.dismiss();
        } else if (btnName == "BtnWechat") {
            this.ShareCallBack(0);
            this.dismiss();
        }
    },

    setShareTyep: function setShareTyep(type, str, url) {
        this.ShareType = type;
        this.ShareString = str;
        this.ImagePath = str;
        this.Url = url;
    },

    ShareCallBack: function ShareCallBack(type) {

        cc.log("ShareCallBack, type=" + type + ', ShareString=' + this.ShareString + ", url=" + this.Url + ", ShareType=" + this.ShareType);

        if (this.ShareType == ShareType.E_SHARETYPE_STRING) {
            if (cc.sys.platform == cc.sys.ANDROID) {
                SocialUtils.shareToWeixin(0, "51牛友会", this.ShareString, this.Url);
            } else {
                WeChatApi.getInstance().sendTextContent(type, this.ShareString, this.Url);
            }
        } else if (this.ShareType == ShareType.E_SHARETYPE_IMAGE) {
            if (cc.sys.platform == cc.sys.ANDROID) {
                SocialUtils.shareToWeixin(2, "51牛友会", this.ShareString, this.Url);
            } else {
                WeChatApi.getInstance().sendImageContent(type, this.ImagePath, this.Url);
            }
        } else if (this.ShareType == ShareType.E_SHARETYPE_LINK) {
            if (cc.sys.platform == cc.sys.ANDROID) {
                SocialUtils.shareToWeixin(0, "51牛友会", this.ShareString, this.Url);
            } else {
                WeChatApi.getInstance().sendLinkContent(type, this.ShareString, this.Url);
            }
        } else if (this.ShareType == ShareType.E_SHARETYPE_APP) {
            if (cc.sys.platform == cc.sys.ANDROID) {
                SocialUtils.shareToWeixin(type, "51牛友会", this.ShareString, this.Url);
            } else {
                WeChatApi.getInstance().sendAppContent(type, this.ShareString, this.Url);
            }
        }
    }

});

cc._RFpop();
},{"Audio_Common":"Audio_Common","BasePop":"BasePop","GameSystem":"GameSystem","MusicMgr":"MusicMgr","WeChatApi":"WeChatApi"}],"ShopConfReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '82fcaNst7VJjZBS2FDYl2Bg', 'ShopConfReqPacket');
// Script\Network\Cmd\Cmd_Req\ShopConfReqPacket.js

"use strict";

/**
 * Created by shrimp on 17/3/30.
 */
var MessageReq = require("MessageReq");
/*
 * type US_REQ_SHOP_CONF_T struct {
 JsonHead
 }
 }
 * */
function ShopConfReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_SHOP_CONF_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = ShopConfReqPacket;

cc._RFpop();
},{"MessageReq":"MessageReq"}],"ShopConfRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '6e125aSHVBFX5nQQG023Z2P', 'ShopConfRespPacket');
// Script\Network\Cmd\Cmd_Resp\ShopConfRespPacket.js

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

cc._RFpop();
},{"MessageResp":"MessageResp"}],"ShopView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '83b2elXxURCfq3qlCyPmY61', 'ShopView');
// Script\ComScene\PopView\ShopView.js

'use strict';

var BasePop = require('BasePop');
var MessageFactory = require('MessageFactory');
var ProduceCell = require('ProduceCell');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
cc.Class({
    extends: BasePop,

    properties: {
        GoldScrollView: cc.ScrollView,
        DiamondScrollView: cc.ScrollView,
        ProduceCell_0: cc.Prefab,
        ProduceCell_1: cc.Prefab
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._super();
        MessageFactory.createMessageReq(window.US_REQ_SHOP_CONF_CMD_ID).send();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    /*********************Network***************************/
    onMessage: function onMessage(event) {
        cc.log("ShopView.onMessage");
        //this._super(event);
        var msg = event.data;
        var cmd = msg.cmd;
        switch (cmd) {
            case US_RESP_SHOP_CONF_CMD_ID:
                this.onShopConfMsg(msg);
                break;
        }
    },
    /*
    * {"cmd":131210,"seq":1,"uid":10688,"code":0,"desc":"执行成功","param":{
    * "goldlist":[
    *   {"type":1,"prop":620,"cost":60,"name":"福袋","desc":"含600牛币,额外送20"},
    *   {"type":2,"prop":3200,"cost":300,"name":"聚宝盆","desc":"含3000牛币,额外送200"},
    *   {"type":3,"prop":13800,"cost":1280,"name":"财神爷","desc":"含12800牛币,额外送1000"}
    *  ],
    *  "diamondlist":[
    *   {"type":1,"prop":60,"cost":6,"name":"60钻石","desc":"\"\""},
    *   {"type":2,"prop":300,"cost":30,"name":"300钻石","desc":"\"\""},
    *   {"type":3,"prop":1280,"cost":128,"name":"1280钻石","desc":"\"\""},
    *   {"type":4,"prop":3280,"cost":328,"name":"3280钻石","desc":"\"\""},
    *   {"type":5,"prop":6180,"cost":618,"name":"6180钻石","desc":"\"\""}]}}
    * */
    onShopConfMsg: function onShopConfMsg(msg) {
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            this.updateGoldList(msg.goldlist);
            this.updateDiamondList(msg.diamondlist);
        }
    },

    updateGoldList: function updateGoldList(goldlist) {

        this.GoldScrollView.content.removeAllChildren(true);
        for (var index = 0; index < goldlist.length; index++) {
            var gold = cc.instantiate(this.ProduceCell_0);
            this.GoldScrollView.content.addChild(gold);
            gold.setPosition(cc.p(0, 0 - gold.getContentSize().height * (index + 0.5)));
            gold.getComponent("ProduceCell").setProduceData(0, goldlist[index]);
        }
    },

    updateDiamondList: function updateDiamondList(diamondlist) {

        this.DiamondScrollView.content.removeAllChildren(true);
        for (var index = 0; index < diamondlist.length; index++) {
            var Diamond = cc.instantiate(this.ProduceCell_0);
            this.DiamondScrollView.content.addChild(Diamond);
            Diamond.setPosition(cc.p(0, 0 - Diamond.getContentSize().height * (index + 0.5)));
            Diamond.getComponent("ProduceCell").setProduceDataDiamond(1, diamondlist[index]);
        }
    },

    callBackBtn: function callBackBtn(event, CustomEventData) {
        this.dismiss();
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
    },

    callBackBtnToggle: function callBackBtnToggle(toggle, CustomEventData) {
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if (CustomEventData == 1) {
            this.GoldScrollView.node.active = true;
            this.DiamondScrollView.node.active = false;
        } else {
            this.GoldScrollView.node.active = false;
            this.DiamondScrollView.node.active = true;
        }
    },

    initScrollView: function initScrollView(type) {}
});

cc._RFpop();
},{"Audio_Common":"Audio_Common","BasePop":"BasePop","MessageFactory":"MessageFactory","MusicMgr":"MusicMgr","ProduceCell":"ProduceCell"}],"SitDownReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '96513vJyz5JuaGZF8gEjRfe', 'SitDownReqPacket');
// Script\Network\Cmd\Cmd_Req\SitDownReqPacket.js

'use strict';

/**
 * Created by shrimp on 17/3/1.
 */

/*E_DOWN_TYPE = 1 //坐下
E_RISE_TYPE = 2 //站起
*/

/*
 SeatId int `json:"seatid"`
 Status int `json:"status"` //1. 坐下，2：站起
*/

var MessageReq = require('MessageReq');
var GameSystem = require('GameSystem');

function SitDownReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_SIT_DOWN_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            gamesvcid: GameSystem.getInstance().gamesvcid,
            tableid: GameSystem.getInstance().tableid,
            seatid: msg.seatid,
            switch: msg.status
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = SitDownReqPacket;

cc._RFpop();
},{"GameSystem":"GameSystem","MessageReq":"MessageReq"}],"SitDownRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '35eaaruYJRLIZ+Amvrorn5m', 'SitDownRespPacket');
// Script\Network\Cmd\Cmd_Resp\SitDownRespPacket.js

"use strict";

/**
 * Created by shrimp on 17/3/1.
 */

/*
 type US_RESP_SIT_DOWN_T struct {
 JsonHead
 RespHead
 Switch    int    `json:"switch"` //1. 坐下，2：站起
 Status    int    `json:"status"` //玩家状态
 SeatId    int    `json:"seatid"`
 SeatUid   uint32 `json:"seatuid"`
 Name      string `json:"name"`
 HeadUrl   string `json:"headurl"`
 Sex       int    `json:"sex"`
 CarryTime int    `json:"carrytime"` //选择携带金币时间
 MinCarry  int    `json:"mincarry"`  //是否需要携带
 IsCarry   int8   `json:"iscarry"`   //是否需要携带金币，1：第一次坐下，需要携带，0：之前参与过，还有金币
 Coin      int    `json:"coin"`      //如果iscarry==0, coin是玩家金币
 }
* */
var MessageResp = require("MessageResp");

function SitDownRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_SIT_DOWN_CMD_ID;
    //this.status    = 0;
    //this.seatid    = 0;
    //this.seatuid   = 0;
    //this.name      = "";
    // this.headurl   = "";
    //this.sex       = 0;
    // this.gold      = 0;
    // this.diamond   = 0;
    //this.coin      = 0;
    //this.carrytime = 0;
    //this.mincarry  = 0;
    //this.iscarry   = 0;
    //this.switch    = 0;
    // this.totalround = 0;
    // this.totaltable = 0;
    //this.tstatus    = 0;
    // this.win        = 0;
    // this.total      = 0;

    //接收的数据
    this.onMessage = function (msg) {
        cc.log("SitDownRespPacket.onMessage, msg.totalround=", msg.totalround, " totaltable=", msg.totaltable);
        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;

        this.switch = msg.switch;
        this.status = msg.status;
        this.seatid = msg.seatid;
        this.seatuid = msg.seatuid;
        this.name = msg.name;
        this.headurl = msg.headurl;
        this.sex = msg.sex;
        this.coin = msg.coin;
        this.carrytime = msg.carrytime;
        this.iscarry = msg.iscarry;
        this.tstatus = msg.tstatus;
        this.totalround = msg.totalround;
        this.totaltable = msg.totaltable;
        this.win = msg.win;
        this.total = msg.total;
        this.gold = msg.gold;
        this.diamond = msg.diamond;
    };
}

module.exports = SitDownRespPacket;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"SitReqCell":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0fd35TL8KlMopgTBGt3ejVo', 'SitReqCell');
// Script\ComScene\PopView\SitReqCell.js

'use strict';

var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var UtilTool = require('UtilTool');
var MessageFactory = require('MessageFactory');
var GamePlayer = require('GamePlayer');
var GameSystem = require("GameSystem");
cc.Class({
    extends: cc.Component,

    properties: {
        BtnAgree: cc.Node,
        BtnRefuse: cc.Node,
        ReqMsg: cc.RichText,
        Time: cc.Label,
        Head: cc.Sprite,
        Title: cc.Label,
        RoomInfoView: cc.Prefab
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.msg = null;
        this.msgType = 0; // 非俱乐部消息
        var self = this;
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            if (this.msgType == 3) {
                if (self.msg.deal == 0) {
                    if (self.msg.type == 3 || self.msg.type == 4) {
                        var data = {
                            type: self.msg.type,
                            msgid: self.msg.id
                        };
                        cc.log("read MsgId=", data.msgid, " type=", data.type);
                        MessageFactory.createMessageReq(US_REQ_SET_MSG_READ_CMD_ID).send(data);
                    }
                } else {
                    cc.log("read MsgId=", data.msgid, " type=", data.type, " deal=", deal);
                }
            } else {
                // if(self.msg.type != 1)
                // {
                //     var data = {
                //         type: self.msg.type,
                //         msgid: self.msg.id,
                //     };
                //     MessageFactory.createMessageReq(US_REQ_SET_MSG_READ_CMD_ID).send(data);
                // }
            }
        });
    },

    setMessageInfo: function setMessageInfo(msg, msgType) {
        cc.log("SitReqCell.setMessageInfo, msg= " + msg.msg);
        this.msg = msg;
        this.msgType = msgType;
        UpdateWXHeadIcon(msg.url, this.Head);

        if (this.msgType == 3) {
            //个人消息
            // Id      int    `json:"id"`
            // Deal    int    `json:"deal"`
            // Type    int    `json:"type"`
            // Url     string `json:"url"`
            // Name    string `json:"name"`
            // Msg     string `json:"msg"`
            // SendUid uint32 `json:"senduid"`
            // Time    int    `json:"time"`

            if (msg.type == 1) {
                this.setMsgSitReq(msg);
            } else if (msg.type == 3) {
                this.setMsgBuyProp(msg);
            } else if (msg.type == 4) {
                this.setMsgCharge(msg);
            }
        } else if (this.msgType == 2) {
            //俱乐部消息
            // Id     int    `json:"id"`
            // Deal   int    `json:"deal"`
            // Url    string `json:"url"`
            // Type   int    `json:"type"`
            // Name   string `json:"name"`
            // Msg    string `json:"msg"`
            // ClubId int    `json:"clubid"`
            // Time   int    `json:"time"`

            if (msg.type == 1) {
                this.setMsgJoinClub(msg);
            } else {
                this.setMsgClubOtherMsg(msg);
            }
        }
        this.Time.string = UtilTool.getFormatData(msg.time);
    },

    setMsgJoinClub: function setMsgJoinClub(msg) {
        cc.log("setMsgJoinClub msg=", msg);

        this.Title.string = "申请加入";
        if (msg.deal == 0) {
            this.ReqMsg.string = "<color=#646464>" + msg.msg.name + "(" + msg.msg.uid + ")申请加入" + "您<color=#0000FF>" + msg.name + "</c>(" + msg.clubid + ")</c>";
            this.BtnAgree.active = true;
            this.BtnRefuse.active = true;
        } else {
            this.BtnAgree.active = false;
            this.BtnRefuse.active = false;
            if (msg.deal == 1) {
                this.ReqMsg.string = "<color=#646464>您<color=#FF0000>同意</c>" + msg.msg.name + "(" + msg.msg.uid + ")加入" + "<color=#0000FF>" + msg.name + "</c>(" + msg.clubid + ")</c>";
            } else {
                this.ReqMsg.string = "<color=#646464>您<color=#FF0000>拒绝</c>" + msg.msg.name + "(" + msg.msg.uid + ")加入" + "<color=#0000FF>" + msg.name + "</c>(" + msg.clubid + ")</c>";
            }
        }
    },

    setMsgClubOtherMsg: function setMsgClubOtherMsg(msg) {
        switch (msg.type) {
            case 2:
                this.Title.string = "申请加入";
                break;

            case 3:
                this.Title.string = "创建俱乐部";
                break;

            case 4:
                this.Title.string = "解散俱乐部";
                break;

            case 5:
                this.Title.string = "升级俱乐部";
                break;

            case 7:
                this.Title.string = "修改管理员";
                break;

            case 8:
                this.Title.string = "删除成员";
                break;
        }

        this.ReqMsg.string = "<color=#646464>" + msg.msg.msg + "</c>";
        this.BtnAgree.active = false;
        this.BtnRefuse.active = false;
    },

    setMsgCharge: function setMsgCharge(msg) {
        this.Title.string = "充值消息";
        this.ReqMsg.string = "<color=#646464>" + msg.msg.msg + "</c>";
        this.BtnAgree.active = false;
        this.BtnRefuse.active = false;
    },

    setMsgBuyProp: function setMsgBuyProp(msg) {
        this.Title.string = "道具消息";
        this.ReqMsg.string = "<color=#646464>" + msg.msg.msg + "</c>";
        this.BtnAgree.active = false;
        this.BtnRefuse.active = false;
    },

    setMsgSitReq: function setMsgSitReq(msg) {
        cc.log("setMsgSitReq msg=", msg);
        this.Title.string = "牌局消息";
        if (msg.deal == 0) {
            this.ReqMsg.string = "<color=#646464>" + msg.msg.name + "(" + msg.msg.situid + ")申请携带<color=#FF0000>" + msg.msg.coin + "</c>牛友币进入您<color=#0000FF>" + msg.msg.privateid + "</c>(" + msg.name + ")牌局</c>";
            this.BtnAgree.active = true;
            this.BtnRefuse.active = true;
        } else if (msg.deal == 1) {
            this.ReqMsg.string = "<color=#646464>您<color=#FF0000>同意</c>" + msg.msg.name + "(" + msg.msg.situid + ")申请携带<color=#FF0000>" + msg.msg.coin + "</c>牛友币进入您<color=#0000FF>" + msg.msg.privateid + "</c>(" + msg.name + ")牌局</c>";
            this.BtnAgree.active = false;
            this.BtnRefuse.active = false;
        } else {
            this.ReqMsg.string = "<color=#646464>您<color=#FF0000>拒绝</c>" + msg.msg.name + "(" + msg.msg.situid + ")申请携带<color=#FF0000>" + msg.msg.coin + "</c>牛友币进入您<color=#0000FF>" + msg.msg.privateid + "</c>(" + msg.name + ")牌局</c>";
            this.BtnAgree.active = false;
            this.BtnRefuse.active = false;
        }
    },

    callbackBtn: function callbackBtn(event, CustomEventData) {
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        cc.log("SitReqCell.callbackBtn,CustomEventData = " + CustomEventData);
        var btnName = event.target.getName();
        cc.log("SitReqCell.callbackBtn,btnName = " + btnName);
        if (btnName == "BtnAgree") {
            if (this.msgType == 3) {
                //个人消息
                if (this.msg.type == 1) {
                    this.sendSitMessage(1); //同意
                    this.msg.deal = 1;
                    this.setMsgSitReq(this.msg);
                }
            } else {
                if (this.msg.type == 1) {
                    this.sendAddClubMessage(1);
                    this.msg.deal = 1;
                    this.setMsgJoinClub(this.msg);
                }
            }
        } else if (btnName == "BtnRefuse") {
            if (this.msgType == 3) {
                if (this.msg.type == 1) {
                    this.sendSitMessage(2); //拒绝
                    this.msg.deal = 2;
                    this.setMsgSitReq(this.msg);
                }
            } else {
                if (this.msg.type == 1) {
                    this.sendAddClubMessage(2);
                    this.msg.deal = 2;
                    this.setMsgJoinClub(this.msg);
                }
            }
        }
    },

    sendAddClubMessage: function sendAddClubMessage(result) {
        cc.log("SitReqCell.sendAddClubMessage ClubId=", this.msg.clubid, " uid=", this.msg.msg.uid, " result=", result);
        var data = {
            uid: this.msg.msg.uid,
            isallow: result };
        cc.log("BaseScene.notifyOwnerConfirmSit.data = ", JSON.stringify(data));
        MessageFactory.createMessageReq(window.CLUB_REQ_OWNER_CONFIRM_CMD_ID).send(data, this.msg.clubid);
    },

    // SitUid     uint32 `json:"situid"`      //申请入座的玩家uid
    // Name       string `json:"name"`        //玩家昵称
    // SeatId     int    `json:"seatid"`      //申请入座的座位号
    // Coin       int    `json:"coin"`        //申请携带金币
    // GameSvcId  uint32 `json:"gamesvcid"`   //在哪一个游戏服务器申请
    // TableId    int32  `json:"tableid"`     //在哪一个桌子申请
    // PrivateId  int    `json:"privateid"`   //6位数私人桌id
    // CreateTime int64  `json:"createtime"`  //创建时间
    sendSitMessage: function sendSitMessage(result) {
        var msg = this.msg.msg;
        var data = {
            gamesvcid: msg.gamesvcid,
            tableid: msg.tableid,
            playeruid: msg.situid,
            privateid: msg.privateid,
            result: result };
        cc.log("sendSitMessage.SitReqCell data=", data);
        MessageFactory.createMessageReq(window.US_REQ_OWNER_CONFIRM_CMD_ID).send(data);
    }
});

cc._RFpop();
},{"Audio_Common":"Audio_Common","GamePlayer":"GamePlayer","GameSystem":"GameSystem","MessageFactory":"MessageFactory","MusicMgr":"MusicMgr","UtilTool":"UtilTool"}],"SocketConfig":[function(require,module,exports){
"use strict";
cc._RFpush(module, '0c61cLVNc9NPZRfyjot1lGL', 'SocketConfig');
// Script\Network\Socket\SocketConfig.js

"use strict";

/**
 * Created by shrimp on 17/2/19.
 */
//socket 回复消息 成功标志

window.SocketSeq = 0;

window.SocketRetCode = cc.Enum({
    RET_REPEAT_REGISTER: -1000, //服务器重复注册(服务器内部消息)
    RET_NOT_CALL_BANKER: -19, //非抢庄状态
    RET_USER_OFFLINE: -18, //玩家离线
    RET_NOT_CLICK_AGAIN: -17, //请勿频繁点击
    RET_SEAT_HAVE_PLAYER: -16, //您选择的座位已经被占领,请从新选择
    RET_SEAT_NOT_EXIST: -15, //您选择的座位不存在
    RET_PLAYER_ACTIVE: -14, //您正在游戏中,不能离开
    RET_PLAYER_HAVE_LEAVE: -13, //您已经离开
    RET_PARAM_ERROR: -12, //参数错误
    RET_DESTROYED_PRIVATE_TBALE: -11, //牌局已销毁
    RET_TABLE_FULL: -10, //私人房爆满
    RET_GAME_PLAYER_FULL: -9, //桌子里面的玩家已满
    RET_GAME_TABLE_FULL: -8, //游戏服务器桌子爆满
    RET_DB_ERROR: -7, //数据库错误
    RET_NOT_FIND_TABLE: -6, //桌子不存在
    RET_NOT_FIND_GAME_SERVER: -5, //未找到匹配服务器
    RET_SERVER_ABNORMAL: -4, //服务异常
    RET_USER_REPEAT_LOGIN: -3, //您的账号已经在其他地点登录
    RET_USERKEY_ERROR: -2, //用户验证失败,请重新登录
    RET_ILLEGAL_REQ: -1, //非法请求(如:如果头部uid,不是自己的socket链接的uid就直接返回,反漏洞)
    RET_SUCCESS: 0, //成功
    RET_BACK_GAME_TABLE: 1, //您已经在游戏中
    RET_GOLD_LACK: 2, //您金币不足
    RET_DIAMOND_LACK: 3, //您钻石不足
    RET_COIN_LACK: 4, //您携带金币不足
    RET_COIN_GREATER_GOLD: 5, //携带金币大于身上金币
    RET_REJECT_SIT_DOWN: 6 });

window.SocketRetDesc = cc.Enum({
    RET_REJECT_SIT_DOWN: "您的请求被拒绝",
    RET_COIN_GREATER_GOLD: "携带金币大于身上金币",
    RET_COIN_LACK: "您带入的金币不足,请从新选择带入金币",
    RET_DIAMOND_LACK: "您钻石不足",
    RET_GOLD_LACK: "您金币不足",
    RET_BACK_GAME_TABLE: "您已经在游戏中",
    RET_SUCCESS: "执行成功",
    RET_ILLEGAL_REQ: "非法请求",
    RET_USERKEY_ERROR: "用户验证失败,请重新登录",
    RET_USER_REPEAT_LOGIN: "您的账号已经在其他地点登录",
    RET_SERVER_ABNORMAL: "服务异常",
    RET_NOT_FIND_GAME_SERVER: "未找到匹配的游戏服务器",
    RET_NOT_FIND_TABLE: "桌子不存在",
    RET_DB_ERROR: "数据库错误",
    RET_GAME_TABLE_FULL: "游戏服务器爆满,请稍后再试",
    RET_GAME_PLAYER_FULL: "桌子里面的玩家已满",
    RET_TABLE_FULL: "房间已满,请选择其他房间",
    RET_DESTROYED_PRIVATE_TBALE: "牌局已销毁",
    RET_PARAM_ERROR: "参数错误",
    RET_PLAYER_ACTIVE: "您正在游戏中,不能离开",
    RET_PLAYER_HAVE_LEAVE: "您已经离开",
    RET_SEAT_NOT_EXIST: "您选择的座位不存在",
    RET_NOT_CLICK_AGAIN: "请勿频繁点击",
    RET_SEAT_HAVE_PLAYER: "您选择的座位已经被占领,请从新选择",
    RET_NOT_CALL_BANKER: "非抢庄状态",
    RET_USER_OFFLINE: "玩家离线",
    RET_REPEAT_REGISTER: "服务器重复注册"
});

window.PACKET_HEADER_SIZE = 18,

//socket消息
window.SocketMessage = "SocketMessage";

/**
 * 引擎状态消息
 * @type {string}
 */
window.SOCKETT_SENDMESSAGE = "SendMessage";

//socket消息类型
window.MessageType = cc.Enum({
    SOCKET_MESSAGE: "socket_message", //socket 回包
    SOCKET_CONNECTING: "socket_connecting", //socket开始重连
    //SOCKETT_SENDMESSAGE  :   "SendMessage",
    MSG_NETWORK_FAILURE: "socket_network_failure",
    SOCKET_DISCONNECTED: "socket_disconnected",
    SOCKET_CONNECTED: "socket_connected",
    SENDMSG_TIMEOUT: "sendmsg_timeout",
    SENDMSG_CLOSESERVER: "sendmsg_closeserver",
    SCENE_MSG: "Scene_Msg" });

/**
 * 引擎状态消息
 * @type {string}
 */
window.GameEngineInfo = "GameEngineInfo";
window.GameInfo = {

    GameHide: "GameHide", //游戏暂停
    GameShow: "GameShow", //游戏唤醒
    NetOnline: "NetOnline", //网络连接
    NetOffline: "NetOffline" };

window.HEART_BEAT_TIME = 30;

cc._RFpop();
},{}],"SocketData":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e2e9bURTFpBK4SddNO0vs5V', 'SocketData');
// Script\Network\Socket\SocketData.js

"use strict";

/**
 * Created by shrimp on 17/2/19.
 */

var m_EncryptMap = [0x51, 0xA1, 0x9E, 0xD7, 0x1E, 0x83, 0x1C, 0x2D, 0xE9, 0x77, 0x3D, 0x13, 0x93, 0x10, 0x45, 0xFF, 0x6D, 0xC9, 0x20, 0x2F, 0x1B, 0x82, 0x1A, 0x7D, 0xF5, 0xCF, 0x52, 0xA8, 0xD2, 0xA4, 0xB4, 0x0B, 0x31, 0x97, 0x57, 0x19, 0x34, 0xDF, 0x5B, 0x41, 0x58, 0x49, 0xAA, 0x5F, 0x0A, 0xEF, 0x88, 0x01, 0xDC, 0x95, 0xD4, 0xAF, 0x7B, 0xE3, 0x11, 0x8E, 0x9D, 0x16, 0x61, 0x8C, 0x84, 0x3C, 0x1F, 0x5A];

function getutf8bytecount(byteval) {
    var bCount = 0;
    for (var i = 7; i >= 0; --i) {
        if (byteval & 1 << i) {
            bCount++;
        } else {
            break;
        }
    }
    return bCount;
}

function utf8tounicode(code) {
    if (code <= 0x7f) {
        return String.fromCharCode(code);
    }
    var bStart = false;
    var bCount = 0;
    var bFinish = false;
    var newCode = 0;
    var bFlag = code & 0xff;
    bCount = getutf8bytecount(bFlag);
    var newCode = 0;
    for (var i = 0; i < bCount; ++i) {
        var val = code & 0xff << i * 8;

        val = val >>> i * 8;
        if (i == 0) {
            for (var t = 1; t <= bCount; ++t) {
                val = val & ~(1 << 8 - t);
            }
        } else {
            val = val & 0x3f;
        }
        newCode += val << 6 * (bCount - i - 1);
    }
    return String.fromCharCode(newCode);
}

function unicodetoutf8(code) {
    if (code <= 0x7f) {
        // 不需要转换
        return { code: code, bytelen: 1 };;
    }

    var bCount = 0; // 二进制位数量
    for (var i = 0; i < 32; ++i) {
        if (code & 1 << i) {
            bCount = i + 1;
        }
    }
    var bByte = 0;
    // utf8编码占用的字节数
    bByte = Math.ceil(bCount / 6);

    // 计算是否要进位
    var bTmp = bCount % 6;
    bTmp = bTmp == 0 ? 6 : bTmp;

    if (bTmp > 7 - bByte) {
        bByte++;
    }
    // 填充编码
    var utf8Code = 0;
    for (var i = 0; i < bByte - 1; ++i) {
        var bValue = code >>> i * 6 & 0x3f; // 最低位放到最高位
        bValue = (1 << 7) + bValue;

        utf8Code += bValue << (bByte - i - 1) * 8;
    }

    // 填充最后剩余的编码
    var bValue = code >>> (bByte - 1) * 6;

    // 填充标识符
    var bFlag = 0;
    for (var i = 0; i < bByte; ++i) {
        bFlag += 1 << 7 - i;
    }

    utf8Code += bFlag + bValue;

    return { code: utf8Code, bytelen: bByte };
}

function utfbytes2string(bytes) {
    if (bytes.length == 0) {
        return "";
    }
    var retString = "";
    for (var i = 0; i < bytes.length;) {
        if (bytes[i] <= 0x7f) {
            retString += utf8tounicode(bytes[i]);
            i++;
            continue;
        }
        var bCount = getutf8bytecount(bytes[i]);
        var utf8code = 0;
        for (var t = 0; t < bCount; ++t) {
            utf8code += bytes[i + t] << t * 8;
        }
        retString += utf8tounicode(utf8code);
        i += bCount;
    }
    return retString;
}

String.prototype.toUtf8 = function () {
    var strLen = this.length;
    var allBytes = [];
    var allLen = 0;
    for (var i = 0; i < strLen; ++i) {
        var unicode = this.charCodeAt(i);
        var result = unicodetoutf8(unicode);
        allLen += result.bytelen;
        allBytes.push(result);
    }
    return { codes: allBytes, bytelens: allLen };
};

//htl，大小端  offset 指定位置
function item(type, len, value, htl, offset) {
    var obj = new Object();
    obj.type = type;
    obj.len = len;
    obj.value = value;
    var bBig = htl === undefined ? true : htl;
    obj.htl = bBig;
    obj.offset = offset;
    return obj;
}

function SocketData(arraybuffer) {
    this.offset = 0;
    this.writeMap = [];

    this.m_nBufPos = window.PACKET_HEADER_SIZE;
    this.m_nPacketSize = window.PACKET_HEADER_SIZE;

    this.aDataArray = null;
    if (arraybuffer) {
        this.aDataArray = new DataView(arraybuffer);
    }
}

//---------------------包头特殊

SocketData.prototype._writeHeaderByte = function (value, offset) {
    this.writeMap.push(item("headbyte", 1, value, true, offset));
};

SocketData.prototype._readHeaderByte = function (offset) {
    var value = this.aDataArray.getUint8(offset, true);
    return value;
};

SocketData.prototype._writeHeaderShort = function (value, offset) {
    this.writeMap.push(item("headshort", 2, value, false, offset));
};

SocketData.prototype._readHeaderShort = function (offset) {
    var value = this.aDataArray.getInt16(offset, false);
    return value;
};

SocketData.prototype._writeHeaderInt = function (value, offset) {
    this.writeMap.push(item("headint", 4, value, false, offset));
};

SocketData.prototype._readHeaderInt = function (offset) {
    var value = this.aDataArray.getInt32(offset, false);
    return value;
};

//-------------------------byte---------------------

SocketData.prototype.WriteByte = function (value, bBig) {
    this.writeMap.push(item("int8", 1, value, bBig));
};
SocketData.prototype.ReadByte = function (bBig) {
    if (this.checkReadOut(1)) {
        return 0;
    }
    var htl = bBig === undefined ? true : bBig;
    var value = this.aDataArray.getUint8(this.offset, htl);
    this.offset += 1;
    return value;
};

//-----------------------short---------------------

SocketData.prototype.WriteShort = function (value, bBig) {
    var htl = bBig === undefined ? false : bBig;
    this.writeMap.push(item("int16", 2, value, htl));
};
SocketData.prototype.ReadShort = function (bBig) {
    if (this.checkReadOut(2)) {
        return 0;
    }
    var htl = bBig === undefined ? false : htl;
    var value = this.aDataArray.getInt16(this.offset, htl);
    this.offset += 2;
    return value;
};

//-----------------------int---------------------

SocketData.prototype.WriteInt = function (value, bBig) {
    var htl = bBig === undefined ? false : bBig;
    this.writeMap.push(item("int32", 4, value, htl));
};
SocketData.prototype.ReadInt = function (bBig) {
    if (this.checkReadOut(4)) {
        return 0;
    }
    var htl = bBig === undefined ? false : bBig;
    var value = this.aDataArray.getInt32(this.offset, htl);
    this.offset += 4;
    return value;
};

//-----------------------int64---------------------
SocketData.prototype.WriteInt64 = function (value, bBig) {
    var htl = bBig === undefined ? false : bBig;
    this.writeMap.push(item("int64", 8, value, htl));
};

SocketData.prototype.ReadInt64 = function (bBig) {
    if (this.checkReadOut(8)) {
        return 0;
    }

    var htl = bBig === undefined ? false : bBig;
    var low = this.aDataArray.getUint32(this.offset, htl);
    this.offset += 4;
    var higt = this.aDataArray.getUint32(this.offset, htl);
    this.offset += 4;
    var longVal = new Long(higt, low, false);
    return longVal.toNumber();
};

//-----------------------string---------------------

SocketData.prototype.WriteString = function (value, bBig) {
    var htl = bBig === undefined ? false : bBig;
    var result = value.toUtf8();
    this.writeMap.push(item("string", result.bytelens + 4 + 1, result, htl)); // +4 是因为字符串前面要写入一个长度
};
SocketData.prototype.ReadString = function (bBig) {

    if (this.checkReadOut(4)) {
        return "";
    }

    var htl = bBig === true ? false : bBig;
    var len = this.aDataArray.getInt32(this.offset);
    this.offset += 4;
    var bytes = [];
    for (var i = 0; i < len; ++i) {
        var b = this.ReadByte();
        // var b = this.aDataArray.getUint8(this.offset);
        bytes.push(b);
        // this.offset += 1;
    }
    return utfbytes2string(bytes);
};

SocketData.prototype.getAllLength = function () {
    var allLen = window.PACKET_HEADER_SIZE;
    for (var i = 0; i < this.writeMap.length; ++i) {
        if (this.writeMap[i].type.indexOf("head") == -1) {
            allLen += this.writeMap[i].len;
        }
    }
    return allLen;
};

SocketData.prototype.checkReadOut = function (length) {
    if (this.offset + length > this.aDataArray.byteLength) {
        return true;
    }
    return false;
};

SocketData.prototype._getbuffer = function () {

    var allLen = this.getAllLength();

    var arraybuffer = new ArrayBuffer(allLen);

    this.aDataArray = new DataView(arraybuffer);

    var offset = window.PACKET_HEADER_SIZE;;

    for (var i = 0; i < this.writeMap.length; ++i) {
        var value = this.writeMap[i].value;
        var htl = this.writeMap[i].htl;
        switch (this.writeMap[i].type) {

            case "headbyte":
                this.aDataArray.setUint8(this.writeMap[i].offset, value, htl);
                break;

            case "headshort":
                this.aDataArray.setInt16(this.writeMap[i].offset, value, htl);
                break;

            case "headint":
                this.aDataArray.setInt32(this.writeMap[i].offset, value, htl);
                break;

            case "int8":
                this.aDataArray.setUint8(offset, value, htl);
                offset += 1;
                break;

            case "int16":
                this.aDataArray.setInt16(offset, value, htl);
                offset += 2;
                break;

            case "int32":
                this.aDataArray.setInt32(offset, value, htl);
                offset += 4;
                break;

            case "string":
                // 写入长度
                this.aDataArray.setInt32(offset, this.writeMap[i].value.bytelens + 1, htl);
                offset += 4;

                // 写入字节数据
                var codes = this.writeMap[i].value.codes;for (var n = 0; n < codes.length; ++n) {
                    var code = codes[n].code;
                    var len = codes[n].bytelen;
                    for (var t = 0; t < len; ++t) {
                        var b = code >> t * 8 & 0xff;
                        this.aDataArray.setUint8(offset, b);
                        offset += 1;
                    }
                }

                this.aDataArray.setUint8(offset, 0);
                offset += 1;
                break;

            case "int64":
                var langValue = Long.fromValue(this.writeMap[i].value, htl);
                var bytes = langValue.toBytesBE();

                for (var j = 0; j < bytes.length; j++) {
                    this.aDataArray.setUint8(offset + j, bytes[j]);
                }
                offset += 8;

                break;

            default:
                break;
        }
    }
    this.m_nPacketSize = offset;
    return arraybuffer;
};

SocketData.prototype.setOffset = function (offset) {
    this.offset = offset;
};

SocketData.prototype._reset = function () {
    this.offset = 0;
    this.writeMap = [];
    this.m_nBufPos = window.PACKET_HEADER_SIZE;
    this.m_nPacketSize = window.PACKET_HEADER_SIZE;
    this.m_isCheckCode = false;
};

SocketData.prototype.Begin = function (nCommand, uid, cVersion) {
    this._begin(nCommand, uid, cVersion);
    this.m_isCheckCode = false;
};

SocketData.prototype._begin = function (nCommand, uid, cVersion) {
    this._reset();
    var cmd = nCommand;
    var uid = uid;
    var source = window.SOURCE_TYPE;

    this._writeHeaderByte(cVersion, 4); // 版本号
    this._writeHeaderShort(cmd, 5); // 命令码
    this._writeHeaderByte(source, 11); // 消息来源

    var type = window.GAME_ID;
    this._writeHeaderByte(type, 12);
    this._writeHeaderInt(uid, 13);
};

SocketData.prototype.SetOptType = function (value) {
    this._writeHeaderByte(value, 12);
};

SocketData.prototype.End = function () {
    this.m_isCheckCode = false;
    this._end();
};

SocketData.prototype._end = function () {
    var nBody = this.getAllLength() - 4; //数据包长度包括命令头和body,4个字节是数据包长度
    var len = nBody;
    this._writeHeaderInt(len, 0); // 包正文长度
    var code = 0;
    this._writeHeaderByte(code, 17); //效验码
};

SocketData.prototype.IsWriteCheckCode = function () {
    return this.m_isCheckCode;
};

/*整个包的长度*/
SocketData.prototype.GetBodyLength = function () {
    var nLen;
    nLen = this._readHeaderInt(0);
    return nLen;
};

SocketData.prototype.EncryptBuffer = function () {
    if (this.IsWriteCheckCode()) return;

    this._getbuffer();

    var wDataSize = this.GetBodyLength() - window.PACKET_HEADER_SIZE + 4;
    var EnCode = Math.floor(Math.random() * window.MAX_ENCRYPT_MAP);
    EnCode = 0;
    var EnCodeNum = m_EncryptMap[EnCode];
    var CheckCode = 0;

    for (var i = 0; i < wDataSize; i++) {
        var data = this.aDataArray.getUint8(window.PACKET_HEADER_SIZE + i, true);
        CheckCode += data;
        CheckCode &= 0xff;
        data ^= EnCodeNum;
        data &= 0xff;
        this.aDataArray.setUint8(window.PACKET_HEADER_SIZE + i, data, true);
    }

    this.SetEnCode(EnCode);
    this.WriteCheckCode(~CheckCode + 1 & 0xff);

    return this.aDataArray.buffer;
};

SocketData.prototype.CrevasseBuffer = function () {

    var wDataSize = this.GetBodyLength() - window.PACKET_HEADER_SIZE + 4;
    var EnCode = this.GetEnCode();
    if (EnCode >= window.MAX_ENCRYPT_MAP) {
        return -1;
    }

    var EnCodeNum = m_EncryptMap[EnCode];
    var CheckCode = this.GetCheckCode();

    for (var i = 0; i < wDataSize; i++) {
        var data = this.aDataArray.getUint8(window.PACKET_HEADER_SIZE + i, true);
        data &= 0xff;
        data ^= EnCodeNum;

        CheckCode &= 0xff;
        CheckCode += data;
        this.aDataArray.setUint8(window.PACKET_HEADER_SIZE + i, data, true);
    }
    if ((CheckCode & 0xff) != 0) {
        return -1;
    }

    return wDataSize;
};

SocketData.prototype.SetEnCode = function (i) {
    // this._writeHeaderByte(i, 8);
    this.aDataArray.setUint8(8, i, true);
};

SocketData.prototype.GetEnCode = function () {
    var encode = this._readHeaderByte(8);
    return encode;
};

SocketData.prototype.WriteCheckCode = function (nValue) {
    // this._writeHeaderByte(nValue,17);
    this.aDataArray.setUint8(17, nValue, true);
    this.m_isCheckCode = true;
};

SocketData.prototype.GetCheckCode = function () {
    var code = this._readHeaderByte(17);
    return code;
};

SocketData.prototype.Reset = function () {
    this._reset();
};

SocketData.prototype.GetCmdType = function () {
    var nCmdType = this._readHeaderShort(5);
    return nCmdType;
};

module.exports = SocketData;

cc._RFpop();
},{}],"SocketManager":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'bcca1j6kqpKqbt11NNhQxFX', 'SocketManager');
// Script\Network\Socket\SocketManager.js

'use strict';

/**
 * Created by shrimp on 17/2/19.
 */
var GameSystem = require('GameSystem');
var SocketData = require('SocketData');
var MessageFactory = require('MessageFactory');

function GameWebSocket() {
    this.m_socket = null;
    this.isSocketConnected = false;
    this.socketListenerID = -1;
    this.netConnected = true;
    this.onListenMessageToSend();
    this.onNetCheckListener();
}

//连接socket
GameWebSocket.prototype.startSocket = function (url) {
    cc.log("SocketManager.startSocket,url = " + GameSystem.getInstance().webSocketUrl);
    this.isSocketConnected = false;
    this.connectSocket(GameSystem.getInstance().webSocketUrl);
},

//重连服务器
GameWebSocket.prototype.reStartSocket = function () {
    cc.log("SocketManager.reStartSocket,url = " + GameSystem.getInstance().webSocketUrl);
    this.isSocketConnected = false;
    this.connectSocket(GameSystem.getInstance().webSocketUrl);
},

//等待玩家发送数据
GameWebSocket.prototype.onListenMessageToSend = function () {
    cc.log("SocketManager.onListenMessageToSend");
    if (this.socketListenerID == -1) {
        var self = this;

        this.socketListenerID = GlobalEventManager.getInstance().addEventListener(window.SOCKETT_SENDMESSAGE, function (event) {
            cc.log("SocketManager.onListenMessageToSend event listener.");
            if (event) {
                self.sendMessage(event);
            }
        }, this);
    }
};

GameWebSocket.prototype.onNetCheckListener = function () {
    cc.log("SocketManager.onNetCheckListener");
    var self = this;

    GlobalEventManager.getInstance().addEventListener(window.GameEngineInfo, function (event) {

        if (event) {
            var tag = event.tag;

            if (tag == window.GameInfo.NetOnline) {
                self.netConnected = true;
            } else if (tag == window.GameInfo.NetOffline) {
                self.netConnected = false;
            }
        }
    }, this);
};

//建立链接
GameWebSocket.prototype.connectSocket = function (url) {
    cc.log("SocketManager.connectSocket, url = " + url);
    var self = this;

    GameSystem.getInstance().aesKey = AES.utils.utf8.toBytes(GameSystem.getInstance().defaultKey);
    this.m_socket = new WebSocket(url);
    this.m_socket.binaryType = "arraybuffer";

    //建立链接
    this.m_socket.onopen = function (event) {
        self.isSocketConnected = true;
        cc.log("SocketManager.connectSocket,socket connected");
        GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.SOCKET_CONNECTED });
    };

    //失败 断开链接
    this.m_socket.onerror = function (event) {
        self.isSocketConnected = false;
        cc.warn("SocketManager.connectSocket,socket error");
        GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.MSG_NETWORK_FAILURE });
    };

    //链接断开
    this.m_socket.onclose = function (event) {
        self.isSocketConnected = false;
        cc.warn("SocketManager.connectSocket,socket disconnect");
        GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.SOCKET_DISCONNECTED });
    };

    //接收服务器到消息
    this.m_socket.onmessage = function (event) {

        var decStr = AesDecode(event.data);
        cc.log("SocketManager.connectSocket ,socket rec message, data = ", decStr);
        var packet = JSON.parse(decStr);

        var cmd = packet.cmd;

        var message = MessageFactory.createMessageResp(cmd);

        if (message == undefined) {
            cc.warn("SocketManager.connectSocket , message = undefined");
            return;
        }
        //解析数据
        message.onMessage(packet);
        // //通知 有新消息到
        GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.SOCKET_MESSAGE, data: message });
    };
};

//关闭链接
GameWebSocket.prototype.disconnect = function () {
    cc.log("SocketManager.connectSocket ");
    //检测是有连接
    if (this.m_socket && this.isConnected() && this.netConnected) {
        this.m_socket.close();
        this.m_socket = null;
        this.isSocketConnected = false;
    }
};

//发送消息
GameWebSocket.prototype.sendMessage = function (data) {
    cc.log("SocketManager.sendMessage ");
    if (!this.netConnected) {
        // ToastView.show("请检查网络") ;
        cc.warn("ocketManager.sendMessage,网络尚未连接 socket发送失败");
        return;
    }

    if (!this.isSocketConnected) {
        cc.warn("ocketManager.sendMessage,socket 尚未连接上");
        //ToastView.show("服务器连接失败") ;
        return;
    }

    if (this.m_socket == null) {
        cc.warn("ocketManager.sendMessage,没有创建socket");
        return;
    }

    if (this.m_socket.readyState === WebSocket.OPEN) {
        cc.log("SocketManager.sendMessage,cmd == 0x0%s", data.data.cmd.toString(16));
        var str = JSON.stringify(data.data);
        cc.log("SocketManager.sendMessage,str = %s", str.toString());
        var enc = AesEncode(str);
        this.m_socket.send(enc);
    } else {
        //ToastView.show("服务器连接失败") ;
        cc.warn("ocketManager.sendMessage,socket 状态关闭");
    }
};

function AesEncode(str) {
    var textBytes = AES.utils.utf8.toBytes(str);
    var aesOfb = new AES.ModeOfOperation.ofb(GameSystem.getInstance().aesKey, GameSystem.getInstance().iv);
    var encryptedBytes = aesOfb.encrypt(textBytes);
    return encryptedBytes;
}

function AesDecode(data) {
    // cc.log("AesDecode,aesKey = " + Array.from(GameSystem.getInstance().aesKey) + ",iv = " + GameSystem.getInstance().iv);
    var aesOfb = new AES.ModeOfOperation.ofb(GameSystem.getInstance().aesKey, GameSystem.getInstance().iv);
    // cc.log("AesDecode,data = " + data);
    // cc.log("AesDecode,bufferLength = " + data.byteLength);
    var text = new Uint8Array(data, 0, data.byteLength);
    // cc.log("AesDecode,text = " + text);
    var desc = aesOfb.decrypt(text);
    // cc.log("AesDecode,desc = " + desc);
    var str = AES.utils.utf8.fromBytes(desc);
    // cc.log("AesDecode,str = " + str);
    return str;
}

//是否连接
GameWebSocket.prototype.isConnected = function () {
    return this.isSocketConnected;
};

GameWebSocket.prototype.base64String = function (data) {
    return BASE64.encoder(data);
};

var SocketManager = function () {
    var instance;
    function getInstance() {
        if (instance === undefined) {
            instance = new GameWebSocket();
        }
        return instance;
    }

    return {
        getInstance: getInstance
    };
}();

module.exports = SocketManager;

cc._RFpop();
},{"GameSystem":"GameSystem","MessageFactory":"MessageFactory","SocketData":"SocketData"}],"StartGameReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c7f59cPbf1BDZ096verEiKZ', 'StartGameReqPacket');
// Script\Network\Cmd\Cmd_Req\StartGameReqPacket.js

"use strict";

/**
 * Created by shrimp on 17/3/1.
 */
var MessageReq = require("MessageReq");
/*
* //游戏开关
 const (
 E_STOP_GAME  = 0
 E_START_GAME = 1
 )

 type US_REQ_GAME_SWITCH_T struct {
 GameHead
 IsStart int `json:"isstart"` //1: start 0: stop
 }

* */
var GameSystem = require("GameSystem");

function StartGameReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_GAME_SWITCH_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid,
            gamesvcid: GameSystem.getInstance().gamesvcid,
            tableid: GameSystem.getInstance().tableid,
            isstart: msg.isstart
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = StartGameReqPacket;

cc._RFpop();
},{"GameSystem":"GameSystem","MessageReq":"MessageReq"}],"StartGameRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '38118+ym3JCjoZIcrN/yn/h', 'StartGameRespPacket');
// Script\Network\Cmd\Cmd_Resp\StartGameRespPacket.js

"use strict";

/**
 * Created by shrimp on 17/3/1.
 */
var MessageResp = require("MessageResp");

/*
* type US_RESP_GAME_SWITCH_T struct {
 JsonHead
 RespHead
 }
 */

function StartGameRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_GAME_SWITCH_CMD_ID;

    //接收的数据
    this.onMessage = function (msg) {

        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        this.isstart = msg.isstart;
    };
}

module.exports = StartGameRespPacket;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"SuccessCell":[function(require,module,exports){
"use strict";
cc._RFpush(module, '6d0025UYOpBRqsI6OX7hIVO', 'SuccessCell');
// Script\ComScene\PopView\SuccessCell.js

'use strict';

var UtilTool = require('UtilTool');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require("GameSystem");
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        dayLabel: cc.Label,
        monthLabel: cc.Label,
        timeLabel: cc.Label,
        RoomName: cc.Label,
        UserName: cc.Label,
        CarryCoin: cc.Label,
        RoomTime: cc.Label,
        WinScore: cc.Label,
        Head: cc.Sprite
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.msg = null;
    },

    setCellInfo: function setCellInfo(msg) {

        this.msg = msg;
        var newDate = new Date();
        newDate.setTime(msg.createtime * 1000);

        this.dayLabel.string = newDate.getDate() + "日";
        this.monthLabel.string = newDate.getMonth() + 1 + "月";
        this.timeLabel.string = UtilTool.getTimeData(newDate.getHours()) + ":" + UtilTool.getTimeData(newDate.getMinutes());
        this.RoomName.string = msg.privateid + " (" + msg.tablename + ")";
        this.RoomName.fontSize = 40;
        this.UserName.string = msg.ownername;
        this.CarryCoin.string = "带入" + msg.carrycoin;
        if (msg.livetime < 1800) {
            this.RoomTime.string = msg.livetime / 60 + "分钟局";
        } else {
            this.RoomTime.string = msg.livetime / 3600 + "小时局";
        }
        UpdateWXHeadIcon(msg.headurl, this.Head);
        if (msg.wincoin > 0) {
            this.WinScore.string = "+" + msg.wincoin;
        } else if (msg.wincoin == 0) {
            this.WinScore.string = msg.wincoin;
            this.WinScore.node.color = new cc.Color(204, 160, 41, 255);
        } else {
            this.WinScore.string = msg.wincoin;
            this.WinScore.node.color = cc.Color.GREEN; //"#00FF00";
        }
    },

    callBackBtn: function callBackBtn(event, CustomEventData) {
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
    }

});

cc._RFpop();
},{"Audio_Common":"Audio_Common","GameSystem":"GameSystem","MusicMgr":"MusicMgr","UtilTool":"UtilTool"}],"SuccessView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '5afaawzjvdLRbkRiiuJ1taG', 'SuccessView');
// Script\ComScene\PopView\SuccessView.js

'use strict';

var BasePop = require('BasePop');
var MessageFactory = require('MessageFactory');
var MusicMgr = require('MusicMgr');
var Audio_Common = require('Audio_Common');
var GameSystem = require("GameSystem");

cc.Class({
    extends: BasePop,

    properties: {
        SuccessCell: cc.Prefab,
        scrollView: cc.ScrollView,
        RoomInfoView: cc.Prefab
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._super();
        var data = {
            iscreate: 0,
            start: 0,
            total: 50
        };
        MessageFactory.createMessageReq(window.US_REQ_SCORE_LIST_CMD_ID).send(data);
    },

    /*********************Network***************************/
    onMessage: function onMessage(event) {
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

    onScoreListMsg: function onScoreListMsg(msg) {
        if (msg.code == SocketRetCode.RET_SUCCESS) {
            var cellHeight = 0;
            for (var index = 0; msg.list != null && index < msg.list.length; index++) {
                var SuccessCell = cc.instantiate(this.SuccessCell);
                this.scrollView.content.addChild(SuccessCell);

                cellHeight = SuccessCell.getContentSize().height;

                SuccessCell.setPosition(cc.p(0, 0 - SuccessCell.getContentSize().height * (index + 0.5)));
                SuccessCell.getComponent("SuccessCell").setCellInfo(msg.list[index]);

                var self = this;
                SuccessCell.on(cc.Node.EventType.TOUCH_END, function (event) {
                    self.createSuccessCellView(event.target.getComponent("SuccessCell").msg);
                }.bind(this));
            }

            var childCount = this.scrollView.content.getChildrenCount() + 1;
            if (cellHeight * childCount > this.scrollView.content.height) {
                this.scrollView.content.height = cellHeight * childCount;
            }
        }
    },

    createSuccessCellView: function createSuccessCellView(msg) {
        var RoomInfoView = cc.instantiate(this.RoomInfoView);
        cc.director.getScene().addChild(RoomInfoView);
        var winSize = cc.director.getWinSize();
        RoomInfoView.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
        RoomInfoView.getComponent('RoomInfoView').sendGetSuccessDetail(msg);
    },

    callbackBtn: function callbackBtn(event, CustomEventData) {
        var btnName = event.target.getName();
        cc.log("SuccessView.callbackBtn,btnName = " + btnName);
        var winSize = cc.director.getWinSize();
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        if (btnName == "BtnClose") {
            this.dismiss();
        }
    },

    callbackToggle: function callbackToggle(toggle, CustomEventData) {
        MusicMgr.playEffect(Audio_Common.AUDIO_BTN_CLICK);
        this.scrollView.content.removeAllChildren(true);
        var data = {
            iscreate: Number(CustomEventData),
            start: 0,
            total: 20
        };
        MessageFactory.createMessageReq(window.US_REQ_SCORE_LIST_CMD_ID).send(data);
    }
});

cc._RFpop();
},{"Audio_Common":"Audio_Common","BasePop":"BasePop","GameSystem":"GameSystem","MessageFactory":"MessageFactory","MusicMgr":"MusicMgr"}],"ToastView":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'd9defR5Fr9O373EPbDY37YE', 'ToastView');
// Script\ComScene\PopView\ToastView.js

"use strict";

var Tview = cc.Class({
    extends: cc.Component,

    properties: {
        tipText: null,
        viewNode: null
    },

    show: function show(tips, delayTime) {

        if (tips == "") {
            return;
        }
        var self = this;

        window.loadPrefabs("prefabs/toastView", function (newNode) {
            self.updateView(newNode, tips, delayTime);
        });
    },

    updateView: function updateView(newNode, tips, delayTime) {
        var self = this;
        if (delayTime === undefined) {
            delayTime = 1;
        }
        this.viewNode = newNode;

        this.tipText = cc.find("txt", newNode).getComponent(cc.Label);
        var bg = cc.find("bg", newNode);
        var lableText = cc.find("txt", newNode);
        this.tipText.string = tips;

        var width = lableText.width + 40 < bg.width ? bg.width : lableText.width + 40;

        var height = lableText.height + 30 < bg.height ? bg.height : lableText.height + 30;

        // newNode.scaleX = width/bg.width;
        // newNode.scaleY = height/bg.height;
        bg.setContentSize(width, height);
        // bg.width = width;
        // bg.height = height ;

        var fadeIn = cc.fadeIn(0.5);
        var delay = cc.delayTime(delayTime);
        var fadeOut = cc.fadeOut(0.5);

        var actionall = cc.sequence(fadeIn, delay, fadeOut, cc.callFunc(this.dismiss, this));
        this.viewNode.runAction(actionall);

        window.scaleTo(newNode);
    },

    setTips: function setTips(tips) {
        if (this.tipText != undefined) {
            this.tipText.string = tips;
        }
    },

    dismiss: function dismiss() {
        if (this.viewNode != null) {
            this.viewNode.removeFromParent(true);
            this.viewNode = null;
        }
    },

    removeFromParent: function removeFromParent(flag) {
        this.dismiss();
    }

});

var ToastView = {

    show: function show(tips, delayTime) {
        this.view = new Tview();
        this.view.show(tips, delayTime);
        return this.view;
    }

};

module.exports = ToastView;

cc._RFpop();
},{}],"UIUtil":[function(require,module,exports){
"use strict";
cc._RFpush(module, '5b7a0limodM4ovWaZtavlWs', 'UIUtil');
// Script\Comm\Util\UIUtil.js

"use strict";

var GameSystem = require('GameSystem');

//内容缩放
window.scaleTo = function (node, flag) {
    node.setScale(0.6);
    var scaleT0 = null;

    scaleT0 = cc.scaleTo(0.2, 1.0).easing(cc.easeBackOut());
    // if(flag || 1){
    //     scaleT0 =  cc.scaleTo(0.2,1.0).easing(cc.easeBackOut()) ;
    // }else{
    //     scaleT0 =  cc.scaleTo(0.2,0.8).easing(cc.easeBackOut()) ;
    // }
    node.runAction(scaleT0);
};

window.moveViewIn = function (node, flag) {

    node.setPosition(cc.p(0, -540));

    var moveto = cc.moveTo(0.2, cc.p(0, 0)); //.easing(cc.easeBackOut()) ;

    node.runAction(moveto);
};

//加载本地预制体
var prefabsMaps = new Map();
window.loadPrefabs = function (resPath, callback, parent) {
    parent = parent === undefined ? 1 : parent;
    //预防同个节点重复加载
    var hasLoad = prefabsMaps.containsKey(resPath);
    // cc.warn("hasLoad = %s" ,hasLoad) ;

    if (hasLoad) {
        if (prefabsMaps.get(resPath).p == parent) {
            cc.log("%s,已经加载中", resPath);
            return;
        }
    }

    prefabsMaps.set(resPath, { p: parent });
    cc.loader.loadRes(resPath, function (err, prefab) {
        prefabsMaps.delete(resPath);
        if (err) {
            cc.error(resPath + " 加载失败");
            // callback(null);
            return;
        }

        var view = cc.instantiate(prefab);
        if (parent != 1) {
            parent.addChild(view);
        } else {
            cc.director.getScene().addChild(view);
        }

        if (callback) {
            callback(view);
        }
    });
};

//加载本地图片
window.loadImg = function (resPath, callBack, sprteType) {
    var type = sprteType === undefined ? cc.SpriteFrame : sprteType;

    cc.loader.loadRes(resPath, type, function (err, spriteFrame) {

        if (err) {
            cc.error("-------------------------------------" + resPath + " 资源加载失败-----------------------");
            return;
        }
        if (callBack) {
            callBack(spriteFrame);
        }
    });
};

//检测数字和数字
window.CheckPerChar = function (cell) {
    if (cell >= 48 && cell <= 57 || // 数字
    cell >= 64 && cell <= 90 // 大写
    || cell >= 97 && cell <= 122 || cell == '_') {
        return true;
    } else {
        return false;
    }
};

window.C1 = 85742;
window.C2 = 76343;
window.KEY = 3965;

//检测密码是否合法
window.CheckAccPwd = function (strPwd) {
    for (var i = 0; i < strPwd.length; i++) {
        var c = strPwd[i].charCodeAt();
        if (!CheckPerChar(c)) {
            return false;
        }
    }
    return true;
};

//账号本地存储加密字符串
window.Encrypt = function (S, Key) {

    var newStr = "";
    for (var i = 0; i < S.length; i++) {
        var str = S.charCodeAt(i);
        str = str ^ Key >> 8;
        str = String.fromCharCode(str);

        // Key = (str.charCodeAt(0)+Key)*C1+C2;

        newStr = newStr + str;
    }

    S = newStr;
    newStr = "";
    for (i = 0; i < S.length; i++) {
        var j = S.charCodeAt(i);
        str = "12";
        var str1 = 65 + Math.floor(j / 26);
        var str2 = 65 + j % 26;
        newStr = newStr + String.fromCharCode(str1) + String.fromCharCode(str2);
    }
    return newStr;
};

//读取本地存储账号解密字符串
window.Decrypt = function (S, Key) {

    var Result = "";
    for (var i = 0; i < S.length / 2; i++) {
        var j = (S.charCodeAt(i * 2) - 65) * 26;
        j += S.charCodeAt(i * 2 + 1) - 65;
        var str = String.fromCharCode(j);
        Result += str;
    }

    S = Result;
    var newStr = "";
    for (i = 0; i < S.length; i++) {
        var str = S.charCodeAt(i);
        str = str ^ Key >> 8;
        str = String.fromCharCode(str);

        // Key = (str.charCodeAt(0)+Key)*C1+C2;

        newStr = newStr + str;
    }

    return newStr;
};

//更新头像
window.UpdateHeadIcon = function (sprIcon, player) {
    var tag = player.iconID;
    if (tag == 0) {
        var isMan = player.sex == 1;
        var icon = isMan ? "hall/userCenterView/headIcon/user_headicon3" : "hall/userCenterView/headIcon/user_headicon0";
        window.loadImg(icon, function (spriteframe) {
            sprIcon.spriteFrame = spriteframe;
        });
    } else if (tag > 0 && tag <= 6) {
        var icon = "hall/userCenterView/headIcon/user_headicon%d";
        icon = icon.replace(/%d/, tag - 1);
        window.loadImg(icon, function (spriteframe) {
            sprIcon.spriteFrame = spriteframe;
        });
    } else {
        // 网络下载
        // std::string headtag = String::createWithFormat("headIcon%d",p->uid)->getCString();
        // HttpManager::getInstance()->sendDownLoadImage(headtag,p->headUrl);
    }
};

window.UpdateWXHeadIcon = function (url, node) {
    if (url == "" || url == " ") return;
    cc.loader.load(url, function (error, texture) {
        cc.log('UpdateWXHeadIcon,error = ' + error);
        cc.log('UpdateWXHeadIcon,texture = ' + texture);
        var spriteFrame = new cc.SpriteFrame(texture);
        node.spriteFrame = spriteFrame;
    });
};

/**
 * 实例对象必须挂载在脚本上
 * @param path
 */
window.playAniOnce = function (path, parent) {
    var view = cc.instantiate(path);
    if (parent) {
        parent.addChild(view);
    } else {
        cc.director.getScene().addChild(view);
    }
    return view;
};

/**
 * 获取字符串长度
 * @param path
 */
window.getDisplayStringLenth = function (strNickName) {
    if (strNickName == undefined || strNickName == "") return 0;

    var unSize = 0;
    for (var i = 0; i < strNickName.length;) {
        if (strNickName[i] < 0) {
            i += 3;
            unSize += 2;
        } else {
            i += 1;
            ++unSize;
        }
    }
    return unSize;
};

window.assert = function (flag) {
    if (!flag) {
        cc.error("!!!!!!!!!!!!!! assert error！！！！！！！！！！！");
    }
};

window.FindNode = function (node, path) {
    return cc.find(path, node);
};

window.splitString = function (msg, fontSize, maxWidth) {
    var arrayString = [];
    var stringLength = msg.length;
    var arrayCount = 0;
    var endIndex = 0;
    var startIndex = 0;
    var curString = "";

    // let arrayIndex = 0 ;
    for (var i = 0; i < stringLength; i++) {

        var curWidth = arrayCount * fontSize;

        if (curWidth + fontSize > maxWidth) {
            endIndex = i;
            curString = msg.slice(startIndex, endIndex);
            startIndex = endIndex;
            arrayCount = 0;
            arrayString.push(curString);
        } else if (i == stringLength - 1) {
            endIndex = i + 1;
            curString = msg.slice(startIndex, endIndex);
            arrayString.push(curString);
            arrayCount = 0;
        }

        arrayCount++;
    }

    return arrayString;
};

window.ReadMoney = function (num) {
    var strNum = num + "";
    var arrStr = [];
    var index = 0;
    for (var i = strNum.length - 1; i >= 0; i--) {
        index++;
        arrStr.push(strNum.charAt(i));
        if (index == 3 && i != 0) {
            arrStr.push(",");
            index = 0;
        }
    }
    var newString = "";
    for (var _i = arrStr.length - 1; _i >= 0; _i--) {
        newString += arrStr[_i];
    }

    return newString;
};

window.GetGameName = function (gamemode) {
    if (gamemode == window.ServerType.E_SIX_BULLFIGHT_TYPE) {
        return "六人斗牛";
    }
    return "游戏";
};

window.GetGameType = function (gametype) {
    if (gametype == 1) {
        return "闭牌抢庄";
    } else if (gametype == 2) {
        return "3张抢庄";
    }
    return "";
};

cc._RFpop();
},{"GameSystem":"GameSystem"}],"UserDetailReqPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '53ca8g0TEJEkpxXxGdZoBSq', 'UserDetailReqPacket');
// Script\Network\Cmd\Cmd_Req\UserDetailReqPacket.js

"use strict";

var MessageReq = require("MessageReq");

function UserDetailReqPacket() {
    MessageReq.apply(this, []); //集成父类数据

    this.cmd = window.US_REQ_USER_DETAIL_CMD_ID;

    //准备发送的数据
    this.send = function (msg) {

        this.data = {
            cmd: this.cmd,
            seq: this.seq,
            uid: this.uid
        };

        GlobalEventManager.getInstance().emitEvent(window.SOCKETT_SENDMESSAGE, this);
    };
}

module.exports = UserDetailReqPacket;

cc._RFpop();
},{"MessageReq":"MessageReq"}],"UserDetailRespPacket":[function(require,module,exports){
"use strict";
cc._RFpush(module, '52426rNPl9Mfp/yTBlk3rbz', 'UserDetailRespPacket');
// Script\Network\Cmd\Cmd_Resp\UserDetailRespPacket.js

"use strict";

var MessageResp = require("MessageResp");

function UserDetailRespPacket() {
    MessageResp.apply(this, []); //集成父类数据

    this.cmd = window.US_RESP_USER_DETAIL_CMD_ID;
    this.gold = 0;
    this.diamond = 0;
    this.playcount = 0;
    this.wincount = 0;
    this.losecount = 0;
    this.tablecount = 0;

    this.onMessage = function (msg) {
        this.seq = msg.seq;
        this.uid = msg.uid;
        this.code = msg.code;
        this.desc = msg.desc;
        if (this.code < SocketRetCode.RET_SUCCESS) return;

        this.gold = msg.gold;
        this.diamond = msg.diamond;
        this.playcount = msg.playcount;
        this.wincount = msg.wincount;
        this.losecount = msg.losecount;
        this.tablecount = msg.tablecount;
    };
}

module.exports = UserDetailRespPacket;

cc._RFpop();
},{"MessageResp":"MessageResp"}],"UtilTool":[function(require,module,exports){
"use strict";
cc._RFpush(module, '08e2d2dTH1Pwq0x7Yaotm5g', 'UtilTool');
// Script\Comm\Util\UtilTool.js

"use strict";

/**
 * Created by shrimp on 17/2/23.
 */

var UtilTool = {
    //获取系统时间
    getNowFormatDate: function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var seperator2 = ":";
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();

        var temp = date.getHours() + seperator2 + date.getMinutes() + seperator2 + date.getSeconds();

        cc.log("UtilTool.getNowFormatDate,date = " + temp + " " + currentdate);
        return currentdate;
    },

    getFormatData: function getFormatData(time) {
        var newDate = new Date();
        newDate.setTime(time * 1000);
        return newDate.getFullYear() + "-" + (newDate.getMonth() + 1) + "-" + newDate.getDate();
    },

    getFormatDataDetail: function getFormatDataDetail(time) {
        var newDate = new Date();
        newDate.setTime(time * 1000);
        return newDate.getFullYear() + "/" + (newDate.getMonth() + 1) + "/" + newDate.getDate() + "  " + this.getTimeData(newDate.getHours()) + ":" + this.getTimeData(newDate.getMinutes()) + ":" + this.getTimeData(newDate.getSeconds());
    },

    //保留两位有效数字
    getTimeData: function getTimeData(time) {
        return (Array(2).join(0) + time).slice(-2);
    },

    captureScreen: function captureScreen(picName, canvas, func) {
        cc.log("UtilTool.screenShot");
        if (!cc.sys.isNative) return;
        var dirpath = jsb.fileUtils.getWritablePath() + 'ScreenShoot/';
        if (!jsb.fileUtils.isDirectoryExist(dirpath)) {
            jsb.fileUtils.createDirectory(dirpath);
        }
        var name = 'ScreenShoot-' + new Date().valueOf() + '.png';
        var filepath = dirpath + picName;
        var size = cc.winSize;
        var rt = cc.RenderTexture.create(size.width, size.height);
        //cc.director.getScene()._sgNode.addChild(rt);
        //rt.setVisible(false);
        rt.begin();
        cc.director.getScene()._sgNode.visit();
        rt.end();

        rt.saveToFile('ScreenShoot/' + picName, cc.IMAGE_FORMAT_PNG, true, function () {
            cc.log('save succ');
            //rt.removeFromParent();
            if (func) {
                func(filepath);
            }
        });
        cc.log("filepath = " + filepath);
    },

    /**
    * 图片压缩，默认同比例压缩
    * @param {Object} path
    *   pc端传入的路径可以为相对路径，但是在移动端上必须传入的路径是照相图片储存的绝对路径
    * @param {Object} obj
    *   obj 对象 有 width， height， quality(0-1)
    * @param {Object} callback
    *   回调函数有一个参数，base64的字符串数据
    */
    dealImage: function dealImage(path, obj, callback) {
        var img = new Image();
        img.src = path;
        img.onload = function () {
            var that = this;
            // 默认按比例压缩
            var w = that.width,
                h = that.height,
                scale = w / h;
            w = obj.width || w;
            h = obj.height || w / scale;
            var quality = 0.7; // 默认图片质量为0.7
            //生成canvas
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            // 创建属性节点
            var anw = document.createAttribute("width");
            anw.nodeValue = w;
            var anh = document.createAttribute("height");
            anh.nodeValue = h;
            canvas.setAttributeNode(anw);
            canvas.setAttributeNode(anh);
            ctx.drawImage(that, 0, 0, w, h);
            // 图像质量
            if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
                quality = obj.quality;
            }
            cc.log("quality = ", quality);
            // quality值越小，所绘制出的图像越模糊
            var base64 = canvas.toDataURL('image/png', quality);
            // 回调函数返回base64的值
            callback(base64);
        };

        //img.saveToFile("a.png",true);
    },

    getTime: function getTime(time) {
        var hour = parseInt(time / 60 / 60);
        var min = parseInt((time - 3600 * hour) / 60);
        var second = time - 3600 * hour - 60 * min;

        return this.getTimeData(hour) + ":" + this.getTimeData(min) + ":" + this.getTimeData(second);
    },

    getHourTime: function getHourTime(time) {
        if (time < 1800) {
            var time = parseFloat(time / 60);
            return time + "min";
        }
        var hour = parseFloat(time / 60 / 60);
        return hour + "h";
    },
    getClubLevelName: function getClubLevelName(level) {
        switch (level) {
            case 1:
                return "一星俱乐部";
            case 2:
                return "二星俱乐部";
            case 3:
                return "三星俱乐部";
            case 4:
                return "四星俱乐部";
            case 5:
                return "五星俱乐部";
            case 6:
                return "六星俱乐部";
            case 7:
                return "七星俱乐部";
            case 8:
                return "八星俱乐部";
            case 9:
                return "九星俱乐部";
            case 10:
                return "十星俱乐部";
        }
    }
};

module.exports = UtilTool;

cc._RFpop();
},{}],"VoicePlayView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '41f62BbEZ1MM71qqAil02JO', 'VoicePlayView');
// Script\ComScene\PopView\VoicePlayView.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        Time: cc.Label,
        VoiceValue: cc.Sprite,
        VoiceValueFrame: [cc.SpriteFrame]
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.time = 0;
        this.setTime(0);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    setTime: function setTime(time) {
        this.time = time;
        this.schedule(this.updateTime, 1);
    },

    updateTime: function updateTime() {
        this.time++;
        if (this.time < 0) {
            this.unschedule(this.updateTime);
            this.dismiss();
        }
        this.Time.string = this.time + '"';
        this.updateVoiceValue();

        if (this.time > 30) {
            this.dismiss();
        }
    },

    updateVoiceValue: function updateVoiceValue() {
        this.VoiceValue.spriteFrame = this.VoiceValueFrame[this.time % 3];
    },

    dismiss: function dismiss() {
        var message = {
            popView: "VoicePlayView",
            btn: "dismiss"
        };
        GlobalEventManager.getInstance().emitEvent(window.SocketMessage, { tag: window.MessageType.SCENE_MSG, data: message });
        this.unschedule(this.updateTime);
        this.node.removeFromParent(true);
    }
});

cc._RFpop();
},{}],"VoiceView":[function(require,module,exports){
"use strict";
cc._RFpush(module, '77b75DJxXFIcqVKxns6L0FR', 'VoiceView');
// Script\ComScene\PopView\VoiceView.js

'use strict';

var GameCallOC = require('GameCallOC');

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        Time: cc.Label,
        VoiceValue: [cc.Sprite]
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.time = 30;
        this.startVoiceTime();
        GameCallOC.getInstance().StartRecord(30000);
    },

    startVoiceTime: function startVoiceTime() {
        this.schedule(this.updateVoiceTime, 1);
    },

    updateVoiceTime: function updateVoiceTime() {
        this.time--;
        this.Time.string = this.time + '"';
        this.updateVoiceValue();
        if (this.time == 0) {
            this.dismiss();
        }
    },

    setVoiceValue: function setVoiceValue(value) {
        for (var index = 0; index < 3; index++) {
            this.VoiceValue[index].node.active = index < value;
        }
    },

    updateVoiceValue: function updateVoiceValue() {
        for (var index = 0; index < 3; index++) {
            this.VoiceValue[index].node.active = index <= this.time % 3;
        }
    },

    dismiss: function dismiss() {
        cc.log("dismiss");
        GameCallOC.getInstance().StopRecording();
        this.unschedule(this.updateVoiceTime);
        this.node.removeFromParent(true);
    }
});

cc._RFpop();
},{"GameCallOC":"GameCallOC"}],"WeChatApi":[function(require,module,exports){
"use strict";
cc._RFpush(module, '7a53c5YqUpKcoIRJV2NF/q2', 'WeChatApi');
// Script\Platform\WeChatApi.js

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

cc._RFpop();
},{"GameCallOC":"GameCallOC","GamePlayer":"GamePlayer","HttpManager":"HttpManager","LoadingView":"LoadingView","Platform":"Platform","SocketManager":"SocketManager"}],"WebView":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'e5799CE3pNGi5mV/ycf1TE0', 'WebView');
// Script\ComScene\PopView\WebView.js

"use strict";

var BasePop = require('BasePop');
cc.Class({
    extends: BasePop,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        WebView: cc.WebView
    },

    // use this for initialization
    onLoad: function onLoad() {
        this._super();
        this.LeftInTo(this.node);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    calllbackBtn: function calllbackBtn(event, CustonEventData) {
        var BtnName = event.target.getName();
        if (BtnName == "BtnClose") {
            this.dismiss();
        }
    },

    setWebViewUrl: function setWebViewUrl(url) {
        this.WebView.url = url;
    }
});

cc._RFpop();
},{"BasePop":"BasePop"}]},{},["BaseView","AdvertItem","AlertView","BasePop","ChineseCity","ClubAddView","ClubAreaCell","ClubAreaView","ClubCell","ClubCreateView","ClubFindPopView","ClubInfoView","ClubJoinView","ClubLevelCell","ClubLevelView","ClubMemberPermissionView","ClubMemberView","ClubPersonsCell","ClubPersonsView","ClubRoomView","ClubSetView","ClubUpgradView","ClubView","CusWebView","FindView","GamblingHouseCell","LoadingView","MessageCell","MessageCellDetailView","MessageDetailView","MessageView","MineView","NetMsg","NoticeView","PickerAddressView","PlayScore","ProduceCell","ReferralCodeView","RollMsg","RoomInfoView","RuleView","ServiceView","SettingView","ShareView","ShopView","SitReqCell","SuccessCell","SuccessView","ToastView","VoicePlayView","VoiceView","WebView","BaseScene","HallScene","LoadingScene","Audio_Common","ButtonScaler","GameSystem","Poker","ProgressSlider","UIUtil","UtilTool","Bullfight_BetCoinReqPacket","Bullfight_CallBankerReqPacket","Bullfight_GetPlayersListReqPacket","Bullfight_HelpReqPacket","Bullfight_OpenCardReqPacket","Bullfight_ReadyReqPacket","Bullfight_TableDetailReqPacket","Bullfight_BetCoinRespPacket","Bullfight_CallBankerRespPacket","Bullfight_GetPlayersListRespPacket","Bullfight_HelpRespPacket","Bullfight_NotifyGameOverOncePacket","Bullfight_NotifyGameOverTotalPacket","Bullfight_NotifyGameStartPacket","Bullfight_NotifyKickOutPacket","Bullfight_NotifyNotBetPacket","Bullfight_NotifyNotCallBankerPacket","Bullfight_NotifyOpenCardPacket","Bullfight_NotifySureBankerPacket","Bullfight_OpenCardRespPacket","Bullfight_ReadyRespPacket","Bullfight_TableDetailRespPacket","Cmd_Bullfight","MessageFactory_Bullfight","Bullfight_AudioConfig","Bullfight_CardType","Bullfighgt_Menu","Bullfight_CarryView","Bullfight_CreateRoom","Bullfight_ExpressionView","Bullfight_MultCell","Bullfight_OwnerView","Bullfight_PlayerCell","Bullfight_Playerlist","Bullfight_RoomInfo","Bullfight_RuleView","Bullfight_TotalResult","Bullfight_TotalResultCell","Bullfight_Tourist","Bullfight_UserInfo","Bullfight_CardItem","Bullfight_CardLayout","Bullfight_Clock","Bullfight_CostomCardType","Bullfight_GameScene","Bullfight_GiftAnimation","Bullfight_PlayerItem","AssetsDownload","AssetsManager","GameConfig","HotUpdateManager","HttpRequest","MusicMgr","GamePlayer","GlobalEventManager","Player","BannerListReqPacket","BindReferralReqPacket","CarryCoinReqPacket","ChatReqPacket","ClubCreateRoomReqPacket","ClubDelMemberReqPacket","ClubOwnerConfirmReqPacket","ClubOwnerModifyRoleReqPacket","ClubUpgradeCostReqPacket","CreateClubReqPacket","CreateRoomReqPacket","CreateTableCostReqPacket","DismissClubReqPacket","DismissGameReqPacket","EnterRoomReqPacket","ExchangeGoldReqPacket","FindReqPacket","FindRoomReqPacket","GetClubListReqPacket","GetClubTableReqPacket","GetMemberListReqPacket","GetMsgListReqPacket","GetMsgNumReqPacket","HeartReqPacket","JoinClubReqPacket","LeaveGameReqPacket","LoginReqPacket","ModifyClubInfoReqPacket","MsgReadReqPacket","OwnerConfirmReqPacket","OwnerKickOutPlayerReqPacket","ScoreDetailReqPacket","ScoreListReqPacket","SearchClubReqPacket","ShopConfReqPacket","SitDownReqPacket","StartGameReqPacket","UserDetailReqPacket","BannerListRespPacket","BindReferralRespPacket","CarryCoinRespPacket","ChatRespPacket","ClubCreateRoomRespPacket","ClubDelMemberRespPacket","ClubOwnerConfirmRespPacket","ClubOwnerModifyRoleRespPacket","ClubUpgradeCostRespPacket","CreateClubRespPacket","CreateRoomRespPacket","CreateTableCostRespPacket","DismissClubRespPacket","DismissGameRespPacket","EnterRoomRespPacket","ExchangeGoldRespPacket","FindRespPacket","FindRoomRespPacket","GetClubListRespPacket","GetClubTableRespPacket","GetMemberListRespPacket","GetMsgListRespPacket","GetMsgNumRespPacket","HeartRespPacket","JoinClubRespPacket","LeaveGameRespPacket","LoginRespPacket","ModifyClubInfoRespPacket","MsgReadRespPacket","NotifyClubOwnerConfirmPacket","NotifyDismissGame","NotifyGameStartPacket","NotifyInGameRespPacket","NotifyOwnerOverPacket","NotifyOwnerSitPacket","NotifyPayOperatePacket","OwnerConfirmRespPacket","OwnerKickOutPlayerRespPacket","ScoreDetailRespPacket","ScoreListRespPacket","SearchClubRespPacket","ServerKickOutPacket","ShopConfRespPacket","SitDownRespPacket","StartGameRespPacket","UserDetailRespPacket","Cmd_Common","MessageFactory_Common","HttpConfig","HttpManager","HttpPacket","MessageFactory","Message","MessageReq","MessageResp","SocketConfig","SocketData","SocketManager","GVoiceJsb","GameCallOC","Platform","WeChatApi"])
