import test from 'ava';
import { ObservableProperty, watchReads } from './property';

test('get', t => {
    const prop = new ObservableProperty('foo');
    t.is(prop.get(), 'foo');
});

test('set', t => {
    const prop = new ObservableProperty<string>().set('foo');
    t.is(prop.get(), 'foo');
});

test.cb('watch', t => {
    const prop = new ObservableProperty('foo');

    prop.watch((value, prev) => {
        t.is(value, 'bar');
        t.is(prev, 'foo');
        t.end();
    });
    prop.set('bar');
});

test('watch called multiple times', t => {
    const prop = new ObservableProperty('foo');

    let i = 0;
    prop.watch(() => i++);
    prop.set('bar');
    prop.set('baz');
    prop.set('foo');

    t.is(i, 3);
});

test('sneaky set', t => {
    const prop = new ObservableProperty('foo');

    prop.watch((value, prev) => t.fail('watch should not be triggered'));
    prop.sneakySet('bar');

    t.is(prop.get(), 'bar');
});

test('global reads', t => {
    const foo = new ObservableProperty('foo');
    const bar = new ObservableProperty('bar');

    let i = 0;
    const destroy = watchReads(() => i++);

    foo.get();
    bar.get();
    foo.get();
    destroy();
    bar.get();

    t.is(i, 3);
});
