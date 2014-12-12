/**
 * memsetSpec.js
 */

var db = require('../src');

var data = [];

for (var i = 0; i < 100000; i++) {
    data.push({
        _id: i,
        name: 'user' + i,
        age: i + 20,
        mod: i % 100
    });
}

db.create('user', data);

describe('jasmine-node', function () {
    it('Testing find all', function () {
        var items;
        items = db.user.find();
        expect(items.length).toBe(data.length)

        items = db.user.find({});
        expect(items.length).toBe(data.length)
    });

    it('Testing find invalid field', function () {
        var items;

        items = db.user.find({ invalueField: true });
        expect(items.length).toBe(0)

        items = db.user.find({ invalueField: true, age: 55 });
        expect(items.length).toBe(0)
    });

    it('Testing find one field', function () {
        var items;

        items = db.user.find({ _id: { $eq: 90 } });
        expect(items.length).toBe(1);

        items = db.user.find({ age: { $eq: 30 } });
        expect(items.length).toBe(1);

        items = db.user.find({ mod: { $eq: 3 } });
        expect(items.length).toBe(1000);

        items = db.user.find({ name: { $eq: 'user99' } });
        expect(items.length).toBe(1);
    });

    it('Testing find with regexp', function () {
        var items;

        items = db.user.find({ name: /user3[1-5]$/ });
        expect(items.length).toBe(5);

        items = db.user.find({ name: /user[0-9]+/ });
        expect(items.length).toBe(data.length);

        items = db.user.find({ age: /^99$/ });
        expect(items.length).toBe(1);

        items = db.user.find({ age: /abc/ });
        expect(items.length).toBe(0);
    });

    it('Testing find with number', function () {
        var items;

        items = db.user.find({ age: 39 });
        expect(items.length).toBe(1);
        expect(items[0].name).toBe('user19');

        items = db.user.find({ mod: 99 });
        expect(items.length).toBe(1000);

        items = db.user.find({ name: 89 });
        expect(items.length).toBe(0);
    });

    it('Testing find with string', function () {
        var items;

        items = db.user.find({ name: 'user39' });
        expect(items.length).toBe(1);
        expect(items[0].age).toBe(59);

        items = db.user.find({ age: '39' });
        expect(items.length).toBe(0);

        items = db.user.find({ mod: '99' });
        expect(items.length).toBe(0);
    });

    it('Testing find with boolean', function () {
        var items;

        items = db.user.find({ age: true });
        expect(items.length).toBe(data.length);

        items = db.user.find({ age: false });
        expect(items.length).toBe(0);

        items = db.user.find({ invalidField: true });
        expect(items.length).toBe(0);

        items = db.user.find({ invalidField: false });
        expect(items.length).toBe(data.length);
    });

    it('Testing find with criteria', function () {
        var items;

        items = db.user.find({ age: { $lt: 10 } });
        expect(items.length).toBe(0);

        items = db.user.find({ age: { $lte: 30 } });
        expect(items.length).toBe(11);

        items = db.user.find({ age: { $gt: 99 } });
        expect(items.length).toBe(data.length - 80);

        items = db.user.find({ age: { $gte: 99 } });
        expect(items.length).toBe(data.length - 79);

        items = db.user.find({ age: { $eq: 99 } });
        expect(items.length).toBe(1);
    });
});
