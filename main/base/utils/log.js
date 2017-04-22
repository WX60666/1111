/**
 * Created by rico on 16/5/12.
 */

const debug = true;

/**
 * A log constructor.
 * @param tag
 * @param enable
 * @constructor
 */
class Log {
    constructor(tag, enable = true) {
        this.debug = debug && enable;
        this.tag   = tag;

        this.enableDebug(enable);
    }

    enableDebug (enable) {
        if (enable) {
            let dispTag = this.tag + ' : ';
            this.d       = console.log.bind(console, '[d] ' + dispTag);
            this.v       = console.log.bind(console, '[v] ' + dispTag);
            this.i       = console.info.bind(console, '[i] ' + dispTag);
            this.w       = console.warn.bind(console, '[w] ' + dispTag);
            this.e       = console.error.bind(console, '[e] ' + dispTag);
            this.a       = console.assert.bind(console, '[a] ' + dispTag);
            // console.log('Logger: ', this.d);
            // this.d('Enable log for tag: ' + this.tag);
        } else {
            this.d = this.v = this.i = this.w = this.e = this.a = () => { };  // do nothing.
            // console.log('Disable log for tag: ' + this.tag);
        }
    }
}

/**
 * A log with tag constructor.
 * @param tag
 * @param enable
 * @constructor
 */
class LogWithTag {
    constructor(enable = true) {
        if (withTagLog)
            return withTagLog;

        withTagLog = this;

        this.debug = debug && enable;

        this.enableDebug(enable);
    }

    enableDebug (enable) {
        if (enable) {
            this.d = (TAG, ...args) => { console.log('[d] ' + TAG, ...args); };
            this.v = (TAG, ...args) => { console.log('[v] ' + TAG, ...args); };
            this.i = (TAG, ...args) => { console.info('[i] ' + TAG, ...args); };
            this.w = (TAG, ...args) => { console.warn('[w] ' + TAG, ...args); };
            this.e = (TAG, ...args) => { console.error('[e] ' + TAG, ...args); };
            this.a = (TAG, ...args) => { console.assert('[a] ' + TAG, ...args); };
            // console.log('Enable log for global.');
        } else {
            this.d = this.v = this.i = this.w = this.e = this.a = () => { };  // do nothing.
            // console.log('Disable log for global.');
        }
    }
}
var withTagLog = null;

export default Log;
export { Log, LogWithTag }