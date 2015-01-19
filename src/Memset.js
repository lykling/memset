/**
 * @file memset 内存集合，mockservice插件
 *
 * @author: Liandong Liu (liu@liandong.org)
 * @author: Pride Leong<lykling.lyk@gmail.com>
 */
/* eslint-env node */

/**
 * Memset
 *
 * @param {Array|Object} data document(s)
 * @constructor
 */
function Memset(data) {
    this.set = [].concat(data);
}

// 大于
function $gt(valA, valB) {
    return valA > valB;
}

// 大于等于
function $gte(valA, valB) {
    return valA >= valB;
}

// 小于
function $lt(valA, valB) {
    return valA < valB;
}

// 小于等于
function $lte(valA, valB) {
    return valA <= valB;
}

// 严格等于
function $eq(valA, valB) {
    return valA === valB;
}

// 不等
function $ne(valA, valB) {
    return valA !== valB;
}

// 指定值在队列中
function $in(val, arr) {
    return -1 !== arr.indexOf(val);
}
// 指定的值不在队列中
function $nin(val, arr) {
    return -1 === arr.indexOf(val);
}

/**
 * 条件比较方法
 */
var querySelectors = {
    // 大于
    $gt: $gt,

    // 大于等于
    $gte: $gte,

    // 小于
    $lt: $lt,

    // 小于等于
    $lte: $lte,

    // 严格等于
    $eq: $eq,

    // 不等
    $ne: $ne,

    // 在队列中
    $in: $in,

    // 不在队列中
    $nin: $nin
};

/**
 * 获取对象类型
 * @param {*} obj 判断的对象
 * @return {string} obj的类型
 */
function getType(obj) {
    var type = Object.prototype.toString.call(obj);
    return type.replace(/\[object (\w+)\]/, '$1');
}

/**
 * 匹配方法
 * @type {Object}
 */
var matchMap = {
    // 判断数据中是否含有field字段
    'Boolean': function (item, field, condition) {
        var exist = item.hasOwnProperty(field);
        return $eq(condition, exist);
    },

    // 判断所给字段串是否严格相等于当前字段值
    'String': function (item, field, condition) {
        return $eq(condition, item[field]);
    },

    // 判断所给数是否严格相等于当前字段值
    'Number': function (item, field, condition) {
        return $eq(condition, item[field]);
    },

    // 判断所给正则表达式是否匹配当前字段值
    'RegExp': function (item, field, condition) {
        return condition.test(item[field]);
    },

    // 判断所级条件集是否均满足当前字段值
    'Object': function (item, field, condition) {
        return Object.keys(condition).every(function (key) {
            var cmpFunc = querySelectors[key];
            if ('Function' === getType(cmpFunc)) {
                return cmpFunc(item[field], condition[key]);
            }
            // 不支持的判断规则直接返回true
            return true;
        });
    }
};

/**
 * 转到真正的匹配方法
 * @param {Object} item 单个数据对象
 * @param {string} field 字段名
 * @param {condition} condition 匹配条件
 * @return {boolean} 执行匹配的返回
 */
function goMatch(item, field, condition) {
    var type = getType(condition);
    // 不支持匹配类型，走Boolean的流程
    var matchFunc = matchMap[type] || matchMap.Boolean;
    return matchFunc.call(this, item, field, condition);
}

/**
 * 根据筛选条件生成筛选方法
 * @param {Object} criteria 筛选条件
 * @return {Function} callback 筛选方法
 */
function matcher(criteria) {
    var fields = Object.keys(criteria || {});
    return function (item, index) {
        return fields.every(function (field) {
            return goMatch(item, field, criteria[field]);
        });
    };
}

/**
 * 抽取对象中的指定字段返回一个新的对象
 * @param {Object} obj 指定对象
 * @return {Object} ret 返回的新对象
 */
function pick(obj) {
    return [].slice.call(arguments, 1).reduce(function (fields, field) {
        // 将二维数组打平
        return fields.concat(field);
    }, []).reduce(function (ret, field) {
        ret[field] = obj[field];
        return ret;
    }, {});
}

Memset.prototype = {
    /**
     * @method find
     * @param {Object} criteria 查找条件
     * @param {Object} projection 查找字段，不指定时直接返回源数据
     * @return {Array.<Object>} data set
     */
    find: function (criteria, projection) {
        var set = this.set.filter(matcher(criteria));
        if ('Object' === getType(projection)) {
            var fields = Object.keys(projection);
            return set.map(function (item) {
                return pick(item, fields);
            });
        }
        return set;
    },

    /**
     * 移除数据
     * @method remove
     * @param {Object} criteria 筛选条件
     * @return {number} 集合长度
     */
    remove: function (criteria) {
        var set = this.set;
        set.reduceRight(function (_, item, idx, docs) {
            if ((matcher(criteria))(item, idx)) {
                docs.splice(idx, 1);
            }
        }, null);
        return this;
    },

    /**
     * 插入数据
     * @param {Array|Object} docs 要插入的数据
     * @return {Memset} 返回自身，以便进行链式调用
     */
    insert: function (docs) {
        this.set = this.set.concat(docs);
        return this;
    }
};

Memset.prototype.__defineGetter__('length', function() {
    return this.set.length;
});


module.exports = Memset;
