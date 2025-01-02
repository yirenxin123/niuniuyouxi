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