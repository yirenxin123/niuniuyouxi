/**
 * Created by jinfangsun on 16/12/14.
 */
function Map(){
    this.elements = new Array();

    //获取Map元素个数
    this.size = function() {
        return this.elements.length;
    },

    //判断Map是否为空
    this.isEmpty = function() {
        return (this.elements.length < 1);
    },

    //删除Map所有元素
    this.clear = function() {
        this.elements = new Array();
    },

    //向Map中增加元素（key, value)
    this.set = function(_key, _value) {
        if (this.containsKey(_key) == true) {
            if(this.containsValue(_value)){
                if(this.remove(_key) == true){
                    this.elements.push( {
                        key : _key,
                        value : _value
                    });
                }
            }else{
                this.elements.push( {
                    key : _key,
                    value : _value
                });
            }
        } else {
            this.elements.push( {
                key : _key,
                value : _value
            });
        }
    },

    //删除指定key的元素，成功返回true，失败返回false
    this.delete = function(_key) {

        if(!this.containsKey(_key)){
            return false ;
        }

        var bln = false;
        try {
            for (var i = 0; i < this.elements.length; i++) {
                if (this.elements[i].key == _key){
                    this.elements.splice(i, 1);
                    return true;
                }
            }
        }catch(e){
            bln = false;
        }
        return bln;
    },

    //获取指定key的元素值value，失败返回null
    this.get = function(_key) {
        var value = null ;
        try{
            for (var i = 0; i < this.elements.length; i++) {
                if (this.elements[i].key == _key) {
                    value = this.elements[i].value;
                    return this.elements[i].value;
                }
            }
            return value;
        }catch(e) {
            return null;
        }
    },

    //获取指定索引的元素（使用element.key，element.value获取key和value），失败返回null
    this.element = function(_index) {
        if (_index < 0 || _index >= this.elements.length){
            return null;
        }
        return this.elements[_index];
    },

    //判断Map中是否含有指定key的元素
    this.containsKey = function(_key) {
        var bln = false;
        try {
            for (var i = 0; i < this.elements.length; i++) {
                if (this.elements[i].key == _key){
                    bln = true;
                }
            }
        }catch(e) {
            bln = false;
        }
        return bln;
    },

    //判断Map中是否含有指定value的元素
    this.containsValue = function(_value) {
        var bln = false;
        try {
            for (var i = 0; i < this.elements.length; i++) {
                if (this.elements[i].value == _value){
                    bln = true;
                }
            }
        }catch(e) {
            bln = false;
        }
        return bln;
    },

    //获取Map中所有key的数组（array）
    this.keys = function() {
        var arr = new Array();
        for (var i = 0; i < this.elements.length; i++) {
            arr.push(this.elements[i].key);
        }
        return arr;
    },

    //获取Map中所有value的数组（array）
    this.values = function() {
        var arr = new Array();
        for (var i = 0; i < this.elements.length; i++) {
            arr.push(this.elements[i].value);
        }
        return arr;
    };


    //遍历
    this.forEach = function (callBack) {
        for (var i = 0; i < this.elements.length; i++) {
            callBack(this.elements[i].value);
        }
    }

    //遍历
    this.forEachKey = function (callBack) {
        for (var i = 0; i < this.elements.length; i++) {
            callBack(this.elements[i].key,this.elements[i].value);
        }
    }

}

