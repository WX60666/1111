/**
 * Created by rico on 16/5/26.
 */
"use strict";

var i18nMaps = new Map();

const Resource = {
    localStr: function (key, ...params) {
        let str = i18nMaps[key];

        /*
        let getParam = /[^\\]%([\d]?[sSfduxX])/g;
        let matched = 0;
        while (true) {
            let match = getParam.exec(str);
            if (!match || params.length <= matched)
                break;
            ++matched;
        }
        */

        return str || key;
    },

    localUrl: (key) => {
        return "../../assets/" + getLangPath() + "/" + key;
    },

    getLangPath: () => {
        LANG_DIR_MAP[env.lang];
    }
};

export default Resource;