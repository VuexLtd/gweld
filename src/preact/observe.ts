import { getAccessed } from '../helpers';
import { ObservableProperty } from '../property';

export function observe(target: any): any {
    return class extends target {
        private __gweldSubscribed: ObservableProperty<any>[] = [];
        private __gweldReRender = () => this.forceUpdate();

        render() {
            let jsxNode;
            const accessed = getAccessed(() => (jsxNode = super.render()));
            this.__gweldSubscribed
                .filter(prop => accessed.indexOf(prop) > -1)
                .forEach(prop => prop.removeWatcher(this.__gweldReRender));
            accessed
                .filter(prop => this.__gweldSubscribed.indexOf(prop) === -1)
                .forEach(prop => prop.watch(this.__gweldReRender));

            return jsxNode;
        }

        componentWillUnmount() {
            this.__gweldSubscribed.forEach(prop =>
                prop.removeWatcher(this.__gweldReRender),
            );
        }
    };
}
