/**
 * @author linkwisdom
 * @mail liu@liandong.org
 *  
 *
 * a time-sequence data scaling methods;
 * var task = getTask( ['year', 'month', 'date'] ,'cnt');
 * 
 * var task = getTask( 'date');
 * 
 */

var date = {};

//a baseTime from 2000-01-01
var baseTime = new Date('2000-01-01 23:59:59');
function getWeek(time) {
    var span = time - baseTime;
    return parseInt(span / 604800000, 10);
}

function getDimKey(time, dim) {
    switch(dim) {
        case 'minute':
            return time.getMinutes();
        case 'hour':
            return time.getHours();
        case 'date':
            return time.getDate();
        case 'week':
            return getWeek(time);
        case 'day':
            return time.getDay();
        case 'month':
            return (time.getMonth() + 1);
        case 'year':
            return time.getFullYear();
        default:
            return time.getMonth();
    }
}

function getDimKeys(time, dims) {
    var arr = dims.map( function(dim) {
        return getDimKey(time, dim);
    });
    return arr.join('-');
}

function getTask(dim, key, reduce) {
    var task = {
        map: function(data) {
            var time = data.time;
            if ('string' == typeof time) {
                time = new Date(time);  
            }
            
            var dimKey = null;
            
            if (dim instanceof Array) {
                dimKey = getDimKeys(time, dim);
            }
            else {
                dimkey = getDimKey(time, dim);
            }
            
            return {
                key: dimKey,
                value: (key? data[key]: data)
            };
        },
        reduce: reduce
    };
    return task;
}

module.exports = getTask;
