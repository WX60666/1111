/**
 * Created by rico on 16/5/26.
 */
"use strict";

import Log from './log';
const log = new Log('InvokePromise');

function InvokePromise(func) {
    let promise = new Promise((resolve, reject) => {
        let done = false;
        promise.doResolve = (...args) => {
            if (!done) {
                done = true;
                resolve(...args);
            } else log.w('Cannot resolve/reject a promise again: ', ...args);
        };
        promise.doReject = (...args) => {
            if (!done) {
                done = true;
                reject(...args);
            } else log.w('Cannot resolve/reject a promise again: ', ...args);
        };

        func(promise.doReject, promise.doReject);
    });

    return promise;
}

export default InvokePromise;