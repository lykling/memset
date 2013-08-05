/**
 *  
 * for some purpose, we need map meta-data and sequence data in certain property-space;
 * such as collection of time-squence data, we want scale down or up the time dimmension;
 * in a larger scope, a lot of types of data can procced by this techs.
 *  we call it dimmension-scale;
 * here, we given a simple dimmension-scale method by a map and reduce tech. 
 * as following.
 * all suggestions and complaints are welcome!
 * 
 * @autho linkwisdom
 * @mail liu@liandong.org
 * @date 2013-04-07 
 */

var scale = {};
/**
 * scale.compute will hand meta-data with a map-reduce procedure 
 * functions which are defined by task
 * 
 * @param {Object} data
 * data: Array or Asociation Array object of souce metaData;
 * for asco. keys represent the indecies of items. 
 * such as timestamps or number indecies;
 * for array, data contains all items we need.
 * 
 * @param {Object} task
 * var task = {
 *     map: function(item, data)
 *     reduce: function(item, key, object)
 * }
 */

scale.compute = function (data, task) {
    var result = {};
    if (data instanceof Array) {
        result = mapArray(data, task.map);
    }
    else {
        result = mapObject(data, task.map);
    }
    
    result = reduce(result, task.reduce);
    return result;
};

/**
 * 
 * @param {Object} data meta-data
 * @param {Object} mapFunc should return an object
 *  with properties of key and value;
 * map-Function map one item to a certain colletion,
 *  the collection is indecied by the key;
 * the return value can be a object or one computable number
 */
function mapArray(data, mapFunc) {
    var cur = null;
    var result = {};
    
    function map(item, idx) {
        var cur = mapFunc(item, data);
        if (cur && cur.key ) {
            result[cur.key] || (result[cur.key] = []);
            result[cur.key].push(cur.value);
        }
    }
    
    data.forEach(map);
    return result;
}

function mapObject(data, mapFunc) {
    var cur = null;
    var result = {};
    for (var key in data) {
        cur = mapFunc(data[key], key,  data);
        if (cur && cur.key ) {
            result[cur.key] || (result[cur.key] = []);
            result[cur.key].push(cur.value);
        }
    }
    return result;
}

/**
 * the reduce procedure 
 * @param {Object} data
 * @param {Object} reduceFunc
 * reduce Function reduce one collection into one number or object 
 */
function reduce(data, reduceFunc) {
    reduceFunc || (reduceFunc = sumReduce);
    var cur = null;
    var result = {};
    for (var key in data) {
        cur = reduceFunc(data[key], key, data);
        if (cur) {
            result[cur.key] = cur.value;
        }
    }
    return result;
}

/**
 * followings are the implementation of the default reduce funtion,
 * which sum of a number array.
 * 
 * @param {Object} arr
 * @param {Object} key
 */
function sumReduce(arr, key) {
    return {
        key: key,
        value: sum(arr)
    };
}

function sum( arr, vkey) {
    var func = null;
    if (vkey) {
        func = function(pre, next) {
            if ('number' != typeof pre) {
                pre = pre[vkey];
            }
            return pre + next[vkey];
        };
    }
    else {
        func = function(pre, next) {
            return pre + next;
        };
    }
   
    return arr.reduce(func);
}

module.exports = scale;

