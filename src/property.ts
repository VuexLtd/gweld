export type PropertyListener<T> = (value: T, prev: T) => void;
export type ReadListener = (prop: ObservableProperty<any>) => void;

export class ObservableProperty<T> {
    private value: T;
    private listeners = new Set<PropertyListener<T>>();

    constructor(initialValue?: T) {
        if (initialValue !== undefined) {
            this.value = initialValue;
        }
    }

    public set(value: T): this {
        const old = this.value;
        if (value !== old) {
            this.value = value;
            this.notifyChange(value, old);
        }

        return this;
    }

    public sneakySet(value: T): this {
        this.value = value;
        return this;
    }

    public get(): T {
        notifyRead(this);
        return this.value;
    }

    public watch(listener: PropertyListener<T>) {
        this.listeners.add(listener);
    }

    public removeWatcher(listener: PropertyListener<T>) {
        this.listeners.delete(listener);
    }

    private notifyChange(newVal: T, oldVal: T) {
        this.listeners.forEach(notify => notify(newVal, oldVal));
    }
}

const readListeners = new Set<ReadListener>();
function notifyRead(property: ObservableProperty<any>) {
    readListeners.forEach(notify => notify(property));
}

export function watchReads(listener: ReadListener): () => void {
    readListeners.add(listener);

    return () => readListeners.delete(listener);
}
