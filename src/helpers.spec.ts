import test from 'ava';
import { observable } from './observable';
import { getObservableProperty, watch, getAccessed } from './helpers';
import { ObservableProperty } from './property';

test('get observable property', t => {
    const obj = { foo: 'bar' };
    observable(obj, 'foo');
    obj.foo; // Observable property is created lazily

    const prop = getObservableProperty(obj, 'foo');
    t.true(prop instanceof ObservableProperty);
    t.is(prop.get(), 'bar');
    prop.set('baz');
    t.is(prop.get(), 'baz');
});

test.cb('watch', t => {
    const obj = { foo: 'bar' };
    observable(obj, 'foo');

    watch(obj, 'foo', (value, prev) => {
        t.is(value, 'baz');
        t.is(prev, 'bar');
        t.end();
    });

    obj.foo = 'baz';
});

test('watch destroy', t => {
    const obj = { foo: 'bar' };
    observable(obj, 'foo');

    let i = 0;
    const destroy = watch(obj, 'foo', () => i++);

    obj.foo = 'baz';
    obj.foo = 'foobar';

    destroy();
    obj.foo = 'foobaz';

    t.is(i, 2);
});

test('accessed properties', t => {
    const foo = new ObservableProperty('foo');
    const bar = new ObservableProperty('bar');

    const accessed = getAccessed(() => {
        foo.get();
        bar.get();
        foo.get();
    });

    t.deepEqual(accessed, [foo, bar]);
});
