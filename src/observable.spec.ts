import test from 'ava';
import { observable } from './observable';
import { ObservableProperty } from './property';
import { watch } from './helpers';

test('property works as normal', t => {
    const obj = { foo: 'bar' };
    observable(obj, 'foo');

    t.is(obj.foo, 'bar');
    obj.foo = 'baz';
    t.is(obj.foo, 'baz');
});

test('decorator', t => {
    class Test {
        @observable foo = 'bar';
    }

    const a = new Test();
    const b = new Test();

    t.is(a.foo, 'bar');
    t.is(b.foo, 'bar');

    a.foo = 'baz';
    t.is(a.foo, 'baz');
    t.is(b.foo, 'bar');
});

test.cb('decorator watch', t => {
    class Test {
        @observable foo = 'bar';
    }

    const a = new Test();

    watch(a, 'foo', (value, prev) => {
        t.is(value, 'baz');
        t.is(prev, 'bar');
        t.end();
    });
    a.foo = 'baz';
});
