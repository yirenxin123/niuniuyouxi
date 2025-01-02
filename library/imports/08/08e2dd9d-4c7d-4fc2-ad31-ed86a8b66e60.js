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