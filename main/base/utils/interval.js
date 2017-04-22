/**
 * Created by rico on 16/5/13.
 */

export default class Interval {
    constructor(interval_) {
        if (!isFinite(interval_))
            throw 'Please init Interval with a finite number, not: ' + interval_;

        this.lastPass = 0;
        this.interval = interval_;
    }

    available() {
        let utc = new Date().getTime();
        if (this.lastPass + this.interval <= utc) {
            this.lastPass = utc;
            return true;
        }

        return false;
    }

    reset() {
        this.lastPass = 0;
    }

    toNow() {
        this.lastPass = new Date().getTime;
    }
}