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