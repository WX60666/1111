/**
 * Created by rico on 16/5/29.
 */
"use strict";

// import Log from './log';
// const log = new Log('Format');

/**
 * return a formatted string:
 *  %[0.*-_]#d: 10-integer,
 *  %[0.*-_]#.#d: 10-double,
 *  %[0.*-_]#x: 16-integer, lowercase.
 *  %[0.*-_]#X: 16-integer, uppercase.
 *  %s: A normal string...
 *  %S: A upper case string. A Object is transformed by JSON.stringify().
 *  %@: A object's toString().
 *  %%: %
 * @param fmt
 * @param restArgs
 */
function format(fmt, ...restArgs) {
    if (fmt) {
        let args = restArgs ? [...restArgs] : [];
        let argIdx = 0, argLen = args.length;
        // let ret = fmt.replace(/[^%]%([0.\-+*@#])?(0)?([1-9]\d*)?(\.)?([1-9]\d*)?[dXxsS@%]]/g, function(match, cups) {
        let ret = fmt.replace(/[^%]%([0.\-+*@#])?(0)?([1-9]\d*)?(\.)?([1-9]\d*)?[dXxsS@%]/g, function(match, cups) {
            // log.d("matched: ", match, ...cups); // ...cups: $1, $2, ..., offsetInWhole, WholeString
            if (cups) console.log("matched: ", match, ...cups); // ...cups: $1, $2, ..., offsetInWhole, WholeString
            else console.log("matched: ", match); // ...cups: $1, $2, ..., offsetInWhole, WholeString

            if (match == '%%') return '%';
            return argIdx < argLen ? args[++argIdx] : match;
        });

        ret = ret.replace('%%', '%');
        return ret;
    } else
        return null;
}

console.log(format('1: %3d, 2: %2.3f, 3: %5X, 4: %S, 5: %@, 6: %%', 1, 2, 3, 4, 5));

// export default format;