/**
 * Created by rico on 16/5/20.
 */

function ApiProxy(target, api) {
    for (let key in api) {
        if (api.hasOwnProperty(key))
            this[key] = (...args) => api[key].call(target, ...args);
    }
}

export default ApiProxy;
