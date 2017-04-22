/**
 * Created by rico on 16/5/25.
 */
"use strict";

const _ =  {

    deepAssign: function (dest, from) {
        if (!_.isObject(dest)) return dest;
        for (let k in from) {
            dest[k] = {};
            _.deepAssign(dest[k], from[k]);
        }
        return dest;
    },

    shadowAssign: function (dest, from) {
        if (!_.isObject(dest)) return dest;
        for (let k in from) dest[k] = from[k];
        return dest;
    },

    override: function (dest, from) {
        return _.shadowAssign(dest, from);
    },

    extend: function (dest, from) {
        return _.shadowAssign(dest, from);
    },

    deepExtend: function (dest, form) {
        return _.deepAssign(dest, form);
    },

    isRegular: function (o) { return o !== null && o !== undefined && o === o; },
    isPrimitiveRegular: function (o) { return o !== null && o !== undefined && o === o && typeof o != 'object'; },
    getRegular: function (o, def=null) { return o !== null && o !== undefined && o === o ? o : def; },

    isArray: function (o) { return o instanceof Array; },
    isArrayLike: function (o) { return o && _.isRegular(o.length); },
    isObject: function (o) { return o !== null && typeof o === 'object'; },
    isFunction: function(o) { return typeof o === 'function' || Object.toString.call(o) === '[object Function]'; },
    isNumber: function(o) { return typeof o === 'number' || o instanceof Number; },
    isString: function(o) { return typeof o === 'string' || o instanceof String; },

    isInteger: function(o) { return _.isNumber(o) && o == Math.floor(o); },

    version: 1
};

export default _;