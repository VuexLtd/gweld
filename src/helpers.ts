import { ObservableProperty, PropertyListener, watchReads } from './property';
import { propertiesKey } from './observable';

export function getObservableProperty<T, K extends keyof T>(
    target: T,
    propertyKey: K,
): ObservableProperty<T[K]> {
    let properties: {
        [key: string]: ObservableProperty<any>;
    } = (target as any)[propertiesKey];
    if (!properties) {
        properties = (target as any)[propertiesKey] = {};
    }

    if (properties[propertyKey] == null) {
        properties[propertyKey] = new ObservableProperty<T[K]>();
    }

    return properties[propertyKey];
}

export function watch<T, K extends keyof T>(
    target: T,
    propertyKey: K,
    listener: PropertyListener<T[K]>,
): () => void {
    const prop = getObservableProperty(target, propertyKey);
    prop.watch(listener);

    return () => prop.removeWatcher(listener);
}

export function getAccessed(func: Function): ObservableProperty<any>[] {
    const accessed = new Set<ObservableProperty<any>>();
    const destroy = watchReads(prop => accessed.add(prop));
    func();
    destroy();

    return Array.from(accessed);
}
