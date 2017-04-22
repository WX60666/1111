/**
 * Created by rico on 16/5/13.
 */

export default class Collection {
    getLast(map, count, identifier) {
        var idx = 0;
        var ret = {};
        for (let key in map) {
            if (key[identifier]) {
                ret[key] = map[key];
                ++idx;

                if (idx > count) {
                    break;
                }
            }
        }
        return ret;
    }

    exclude(dest, excluded) {
        var ret = {};
        return ret;
    }

    union(left, right) {

    }
};