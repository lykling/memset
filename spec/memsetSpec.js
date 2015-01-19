/**
 * @file memsetSpec.js
 * @author Pride Leong<lykling.lyk@gmail.com>
 */
/* eslint-env node */

var db = require('../src');

var data = Array.apply(null, new Array(10000)).map(function (_, idx) {
    return {
        _id: idx,
        name: 'user' + idx,
        age: idx + 20,
        mod: idx % 100
    };
});

db.create('user', data);

describe('jasmine-node', function () {
    it('查找全部', function () {
        var items;
        items = db.user.find();
        expect(items.length).toBe(data.length);

        items = db.user.find({});
        expect(items.length).toBe(data.length);
    });

    it('查找非法字段', function () {
        var items;

        items = db.user.find({invalueField: true});
        expect(items.length).toBe(0);

        items = db.user.find({invalueField: true, age: 55});
        expect(items.length).toBe(0);
    });

    it('查找一个字段', function () {
        var items;

        items = db.user.find({_id: {$eq: 90}});
        expect(items.length).toBe(1);

        items = db.user.find({age: {$eq: 30}});
        expect(items.length).toBe(1);

        items = db.user.find({mod: {$eq: 3}});
        expect(items.length).toBe(data.length / 100);

        items = db.user.find({name: {$eq: 'user99'}});
        expect(items.length).toBe(1);
    });

    it('使用正则表达式的方法查找', function () {
        var items;

        items = db.user.find({name: /user3[1-5]$/});
        expect(items.length).toBe(5);

        items = db.user.find({name: /user[0-9]+/});
        expect(items.length).toBe(data.length);

        items = db.user.find({age: /^99$/});
        expect(items.length).toBe(1);

        items = db.user.find({age: /abc/});
        expect(items.length).toBe(0);
    });

    it('使用数查找', function () {
        var items;

        items = db.user.find({age: 39});
        expect(items.length).toBe(1);
        expect(items[0].name).toBe('user19');

        items = db.user.find({mod: 99});
        expect(items.length).toBe(data.length / 100);

        items = db.user.find({name: 89});
        expect(items.length).toBe(0);
    });

    it('使用字段串查找', function () {
        var items;

        items = db.user.find({name: 'user39'});
        expect(items.length).toBe(1);
        expect(items[0].age).toBe(59);

        items = db.user.find({age: '39'});
        expect(items.length).toBe(0);

        items = db.user.find({mod: '99'});
        expect(items.length).toBe(0);
    });

    it('使用布尔值查找', function () {
        var items;

        items = db.user.find({age: true});
        expect(items.length).toBe(data.length);

        items = db.user.find({age: false});
        expect(items.length).toBe(0);

        items = db.user.find({invalidField: true});
        expect(items.length).toBe(0);

        items = db.user.find({invalidField: false});
        expect(items.length).toBe(data.length);
    });

    it('使用判断符查找', function () {
        var items;

        items = db.user.find({age: {$lt: 10}});
        expect(items.length).toBe(0);

        items = db.user.find({age: {$lte: 30}});
        expect(items.length).toBe(11);

        items = db.user.find({age: {$gt: 99}});
        expect(items.length).toBe(data.length - 80);

        items = db.user.find({age: {$gte: 99}});
        expect(items.length).toBe(data.length - 79);

        items = db.user.find({age: {$eq: 99}});
        expect(items.length).toBe(1);

        items = db.user.find({age: {$ne: 99}});
        expect(items.length).toBe(data.length - 1);

        items = db.user.find({age: {$in: [99, 98]}});
        expect(items.length).toBe(2);

        items = db.user.find({age: {$nin: [60, 70]}});
        expect(items.length).toBe(data.length - 2);

        // 非法比较符
        items = db.user.find({age: {$xx: 44}});
        expect(items.length).toBe(data.length);
    });

    it('使用数据查找', function () {
        var items;
        var arr;

        arr = [30, 31, 32, 33, 34, 35, 36];
        items = db.user.find({age: {$in: arr}});
        expect(items.length).toBe(7);

        arr = [89, 34, 22, 38, 56];
        items = db.user.find({_id: {$nin: arr}});
        expect(items.length).toBe(data.length - arr.length);
    });

    it('删除', function () {
        var items;
        items = db.user.remove({age: {$in: [22, 23, 24]}});
        expect(items.length).toBe(data.length - 3);

        items = db.user.remove({name: {$eq: 'user99'}});
        expect(items.length).toBe(data.length - 4);

        items = db.user.remove();
        expect(items.length).toBe(0);
    });

    it('增加', function () {
        db.create('test', []);
        var items;

        db.test.insert({
            _id: 99,
            name: 'user99',
            mod: 0,
            age: 21
        });
        items = db.test.find({});
        expect(items.length).toBe(1);

        db.test.insert(Array.apply(null, new Array(10)).map(function (_, idx) {
            return {
                _id: idx,
                name: 'user' + idx,
                mod: idx % 100,
                age: 20 + idx
            };
        }));
        items = db.test.find();
        expect(items.length).toBe(11);
    });
});
