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

## Usage with React/Preact (using TypeScript)
```tsx
import { h, Component } from 'preact';
import { observable } from 'gweld';
import { observe } from 'gweld/preact'; // or gweld/react

@observe
class App extends Component<{}, {}> {
    @observable name = 'James';
    updateName = evt => this.name = evt.target.value;

    render() {
        return (
            <div>
                <div>Hello {this.name}</div>
                <input value={this.name} onInput={this.updateName} />
            </div>
        )
    }
}

```
