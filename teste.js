var scale = require('./scale.js');
var getTask = require('./DateTask.js');

function queryData( json,  callback ) {
    var mongodb = new MongoDB( {'db':'pulse'} );
    mongodb.read('hour_pv' , json, function( data ){
        callback && callback(data);
    })
}

function getDate( str ) {
    if (str.length == 8) {
        str = [str.substr(0, 4), str.substr(4, 2) , str.substr(6, 2)];
        str = str.join('-');
    }
    return new Date(str);
}

queryData( 
    {time: {'$gt': new Date( '2013-03-05 23:59:59') , 
    '$lt': new Date( '2013-05-10 23:59:59') } }
    , function( data ) {
        if(data ) {
            var task = getTask( ['year', 'month', 'date'] ,'cnt');
            var rst = scale.compute(data, task);
            
            for (var item in rst) {
                var t = rst[item];
                console.log(item, JSON.stringify(t));
            }
        }
});
