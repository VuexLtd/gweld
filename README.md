# Gweld
A small library to react to changes on object properties

## Install
```
npm i -S gweld
```

## Usage

```js
import { watch, observable } from 'gweld';

const myObj = { foo: 'bar' };
observable(myObj, 'foo');

const stopWatching = watch(myObj, 'foo', (value, prev) => {
    console.log(`foo changed from ${prev} to ${value}`)
});

myObj.foo = 'baz'; // => foo changed from bar to baz
myObj.foo = 'foobar'; // => foo changed from baz to foobar
stopWatching();
myObj.foo = 'foobaz';


// observable can also be used as a decorator, e.g.

class MyClass {
    @observable foo = 'bar';
}

```
