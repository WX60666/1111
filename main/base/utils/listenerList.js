/**
 * Created by rico on 16/5/12.
 */

import { LogWithTag } from './log';
const log = new LogWithTag();

/**
 * ListenerList for event dispatch center.
 * @constructor
 */
class ListenerList {

    /**
     * Construct a listener and set it's proxy.
     * @param proxies
     */
    constructor(proxies) {
        this.listeners = [];
        // this.target = target;
        this.dynamicProxy(proxies);
    }

    /**
     * Apply to all listener, usage like: listeners.broadcast(l => l.callback(arg1, arg2));
     * @param apply: the function to be applied.
     */
    // @Deprecated
    broadcast (apply) {
        this.listeners.forEach(l => setTimeout(apply.bind(null, l), 0));
    };

    /**
     * Emit a event to all listeners. usage like: listeners.emit('callback', arg1, arg2);
     * @param cb: the function called in args
     * @param args
     */
    emit (cb, ...args) {
        this.listeners.forEach(l => l[cb] && setTimeout(() => l[cb].call(null, ...args), 0));
    };

    /**
     * Add proxy for callbacks. Can be used like: listeners.callback(arg1, arg2);
     * @param proxies: [{ func: 'funcName', tag: 'TAG used in log' }]
     */
    dynamicProxy (proxies) {
        proxies && proxies.forEach(fc => {
            if (typeof fc.func == 'string') {
                if ( !fc.tag || !(typeof fc.tag == 'string' ))
                    fc.tag = fc.func;

                const func = fc.func, TAG = fc.tag;
                this[func] = function (...args) {
                    log.d(TAG, func, ", args: ", ...args);

                    this.emit(func, ...args);
                };
            }
        });
    };

    add (listener) {
        let len = this.listeners.length;
        for (let idx = 0; idx < len; ++idx) {
            if (this.listeners[idx] === listener) {
                return true;
            }
        }

        this.listeners.push(listener);
        return true;
    };

    remove (listener) {
        var len = this.listeners.length;
        for (let idx = 0; idx < len; ++idx) {
            if (this.listeners[idx] === listener) {
                this.listeners.splice(idx);

                return true;
            }
        }

        return false;
    }

    clear () {
        this.listeners = [];
        return true;
    }
}

export default ListenerList;