/**
 * Created by rico on 16/5/17.
 */

export default class DataValidator {

    /**
     * Not null/undefined/NaN
     * @param v
     * @returns {boolean}
     */
    static isRegular(v) {
        return v !== null && v !== undefined && !(v != v);
    }

    /**
     * Return a regular(not: null/undefined/NaN) data or undefined.
     * @param v
     * @param defaultValue
     * @returns {undefined}
     */
    static getRegular(v, defaultValue) {
        return (v !== null && v !== undefined && !(v != v)) ? v : defaultValue;
    }

    static strByteLen(str) {
        var len = 0;
        for (var i = 0; i < str.length; i++) {
            var c = str.charCodeAt(i);
            len += ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) ? 1 : 2;
        }
        return len;
    }

    static checkNumber(v, min, max, required) {
        if (!v) return required ? false : true;

        var num = Number(v);
        return num >= min && num <= max;
    }

    static checkByteLen(v, min, max, required) {
        if (!v) return required ? false : true;

        var strLen = DataValidator.strByteLen(v);
        return strLen >= min && strLen <= max;
    }

}