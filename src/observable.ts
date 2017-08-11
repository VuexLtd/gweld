import { ObservableProperty } from './property';
import { getObservableProperty } from './helpers';

export const propertiesKey = Symbol('gweldProperties');

export function observable(target: Object, propertyKey: string) {
    const initialValue = (target as { [key: string]: any })[propertyKey];
    let initial = true;

    Object.defineProperty(target, propertyKey, {
        get(this: any) {
            const prop = getObservableProperty(this, propertyKey);
            if (initial) {
                prop.sneakySet(initialValue);
                initial = false;
            }

            return prop.get();
        },
        set(this: any, value: any) {
            const prop = getObservableProperty(this, propertyKey);
            if (initial) {
                prop.sneakySet(initialValue);
                initial = false;
            }

            prop.set(value);
        },
    });
}
