/**
 * memset: dataset in memory
 *
 * @author: Liandong Liu (liu@liandong.org)
 * @author: Pride Leong<lykling.lyk@gmail.com>
 */

/**
 * Memset
 *
 * @param {Object} data data set
 * @constructor
 */
function Memset(data) {
    this.set = [].concat(data);
}

var conditionMap = {
    $gt: function (valueA, valueB) {
        return valueA > valueB;
    },
    $gte: function (valueA, valueB) {
        return valueA >= valueB;
    },
    $lt: function (valueA, valueB) {
        return valueA < valueB;
    },
    $lte: function (valueA, valueB) {
        return valueA <= valueB;
    },
    $eq: function (valueA, valueB) {
        return valueA === valueB;
    }
};

/**
 *
 * @param {Object} criteria
 *  Specifies selection criteria using query operators.
 * @return {Function} callback
 *  Function to test each element of the array.
 *  Return true to keep the element, false otherwise
 */
function matcher(criteria) {
    var fields = Object.keys(criteria || {});
    return function (item, index) {
        return fields.every(function (field) {
            var condition = criteria[field];
            var exist = item.hasOwnProperty(field);
            var type = Object.prototype.toString.call(condition);
            switch (type) {
                case '[object Boolean]':
                    return condition === exist;
                case '[object String]':
                    return condition === item[field];
                case '[object Number]':
                    return condition === item[field];
                case '[object RegExp]':
                    return condition.test(item[field]);
                case '[object Object]':
                    var valueA = item[field];
                    var conditionKeys = Object.keys(condition);
                    return conditionKeys.every(function (key) {
                        var cmpFunc = conditionMap[key];
                        var valueB = condition[key];
                        if ('function' === typeof cmpFunc) {
                            return cmpFunc(valueA, valueB);
                        }
                        return true;
                    });
                default:
                    return true;
            }
        });
    };
}

Memset.prototype = {
    /**
     * @method find
     * @param {Object} criteria
     *  Specifies selection criteria using query operators.
     * @param {Object} projection
     *  Specifies the fields to return using projection operators
     * @return {Array.<Object>} data set
     */
    find: function (criteria, projection) {
        var set = this.set.filter(matcher(criteria));
        var result = [];
        if ('object' === typeof projection) {
            var keys = Object.keys(projection);
            set.forEach(function (item) {
                var value = {};
                keys.forEach(function (key) {
                    value[key] = item[key];
                });
                result.push(value);
            });
            set = result;
        }
        return set;
    },
    remove: function (criteria) {
        var set = this.set;
        var lst = this.find(criteria);
        lst.forEach(function (item) {
            set[item._id] = null;
        });
        this.clear();
        return set.length;
    },
    insert: function (docs) {
        this.set.concat(docs);
    },
    clear: function () {
        this.set = this.set.filter(function(item) {
            return item;
        });
    }
};

Memset.prototype.__defineGetter__('length', function() {
    return this.set.length;
});


module.exports = Memset;
