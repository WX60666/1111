/**
 * Created by rico on 16/5/13.
 */

import _ from './objects';

export default class AutoRefresher {
    constructor(interval, refresher) {
        if (!isFinite(interval))
            throw 'Please init AutoRefresher with a finite number, not: ' + interval;

        if (!_.isFunction(refresher))
            throw 'Please init AutoRefresher with a valid refresher, not: ' + refresher;

        this.lastPass = 0;
        this.interval = interval;
        this.refresher = refresher;

        this.data = null;
    }


    data() {
        let utc = new Date().getTime();
        if (this.lastPass + this.interval >= utc) {
            this.lastPass = utc;
            return this.data = this.refresher(this.data);
        }

        return this.data;
    }

    reset() {
        this.lastPass = 0;
        this.data = null;
    }

    toNow() {
        this.lastPass = new Date().getTime;
    }
}