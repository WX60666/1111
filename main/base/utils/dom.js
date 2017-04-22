/**
 * Created by rico on 16/5/30.
 */
"use strict";

import _ from './objects';
import { LogWithTag } from './log';
const log = new LogWithTag();

const api = {

    getAttr(root, attr) {
        throw 'not impliment: getAttr.';
    },
    
    getAttrVal(root, attr) {
        throw 'not impliment: getAttr.';
    },
    
    getTagAttrVal (root, tag, attrSel, attrSelVal, valAttr) {
        if (_.isString(root)) {
            root = window.document.getElementById(root);
        }

        if (!_.isRegular(root))
            return undefined;

        let coll = root.getElementsByTagName(tag);
        if (!coll)
            return undefined;

        for (var i = 0; i < coll.length; i++) {
            let e = coll[i];
            let attrVal = e.getAttribute(attrSel);
            if (attrVal == attrSelVal) {
                let ret = valAttr == 'value' ? e.value : e.getAttribute(valAttr);
                log.d('Utils/DOM', 'Get attr: ', attrVal, valAttr, ret);
                return ret === null ? undefined : ret;
            }
        }
        return undefined;
    },

    getInputVal (root, name) { return this.getTagAttrVal(root, 'input', 'name', name, 'value'); },
    getSelVal (root, name) { return this.getTagAttrVal(root, 'select', 'name', name, 'value'); },
    getPlaceHolder (root, name) { return this.getTagAttrVal(root, 'input', 'name', name, 'placeholder'); }

};

export default api;