var scale = require('./scale');
var getTask = require('./DateTask');

var task = getTask( ['year', 'month', 'date'], 'cnt');
var rst = scale.compute(data, task);
