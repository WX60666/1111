/**
 * Created by rico on 16/5/13.
 */
'use strict';

import Log from '../utils/log';
import _ from '../utils/objects';

void({
    domain: '',
    data: { },
    storage: { }
});

class ObjectStorage {
    constructor(domain_) {
        this.data = { };
        this.setDomain(domain_ || 'com.we-smart.storage');
    }

    setDomain(newDomain) { this.domain = newDomain; }

    save (key, value) { };

    restore (key, originValue) { };

    del (key) { }
}
ObjectStorage.prototype.log = new Log('ObjectStorage');

class NoneStorage extends ObjectStorage {
    save (key, value) {
        // save data to key.
        this.log.w("Saving data ignored: ", {key: key, value: value});
    };

    restore (key, originValue) {
        // return data.
        this.log.w("Restoring data ignored: ", {key: key, value: originValue});
    };

    del (key) {
        // return data.
        this.log.w("Delete data ignored: ", key);
    };
}
NoneStorage.prototype.log = new Log('NoneStorage');

class LocalStorage extends ObjectStorage {

    static localStorageSupport(type) {
        try {
            let storage = window[type],
                x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch (e) {
            return false;
        }
    }

    static getStorage(type) { return LocalStorage.localStorageSupport(type) ? window[type] : null; }

    getStorageType() { return 'localStorage'; }

    constructor (domain) {
        super(domain);
        // this.setDomain(domain);
    }

    __getKey(k) { return this.domain + '/' + k; }

    __getValue(k) {
        try { return JSON.parse( _.getRegular(this.storage[this.__getKey(k)], '{}') ); }
        catch (e) { this.log.w(`Failed restore Storage.${this.getStorageType()}.`); }
        return { };
    }

    setDomain(newDomain) {
        if (newDomain != this.domain) {
            this.domain = newDomain;
            this.storage = LocalStorage.getStorage(this.getStorageType());
            this.data = { };

            if (!this.storage) {
                this.log.w(`Storage.${this.getStorageType()} not exist... All data will be lost when closed.`);
                this.storage = { };
            }

            let domain = this.domain;
            if (this.storage && domain !== null && domain !== undefined) {
                let len = this.storage.length;
                for (let idx = 0; idx < len; ++idx) {
                    let key = this.storage.key(idx);
                    let prefix = domain + '/';
                    if (key.startsWith(prefix) && key !== prefix) {
                        let subKey = key.substring(prefix.length, key.length);
                        this.data[subKey] = this.__getValue(subKey);
                    }
                }
            }
            // this.log.i(`In\ited Storage.${this.getStorageType()}:`, this.data);
        }
    }

    save (key, value) {
        this.data[key] = value;
        this.storage[this.__getKey(key)] = _.isObject(value) ? JSON.stringify(value) : '{}';
        if (!_.isObject(value))
            this.log.w(`Cannot save non-object data to Storage.${this.getStorageType()}.`);

        this.log.d(`Saving data(${this.domain}): `, {key: key, value: value});
    };

    restore (key, originValue) {
        let value = _.getRegular(this.data[key])
            || _.getRegular(this.data[key] = this.__getValue(key))
            || originValue;
        this.log.d(`Restoring data(${this.domain}): `, {key: key, value: value, originValue: originValue });
        return value;
    };

    del (key) {
        this.data.removeItem(key);
        this.storage[this.__getKey(key)] = null;
        this.log.w(`Delete data(${this.domain}): `, key);
    };
}
LocalStorage.prototype.log = new Log('LocalStorage');

class SessStorage extends LocalStorage {
    constructor(domain) {
        super(domain);
    }

    getStorageType() { return 'sessionStorage'; }
}
SessStorage.prototype.log = new Log('SessStorage');

class Cookie extends ObjectStorage {

    constructor(domain) {
        super(domain);
        throw 'Cookie not implement...';
    }

    /*
    save (key, value, param) {
        var path = '',
            Days = 0;
        if (typeof param !== 'undefined') {
            if (typeof param.path !== 'undefined') {
                path = param.path;
            }
            if (typeof param.days !== 'undefined') {
                Days = param.days;
            }
        }
        var exp = new Date();
        exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
        if (!!path) {
            if (!!Days) {
                document.cookie = key + "=" + encodeURIComponent(value) + ";path=" + path + ";expires=" + exp.toGMTString();
            } else {
                document.cookie = key + "=" + encodeURIComponent(value) + ";path=" + path;
            }
        } else {
            document.cookie = key + "=" + encodeURIComponent(value);
        }
    }

    restore (key) {
        var arr, reg = new RegExp("(^| )" + key + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return decodeURIComponent(arr[2]);
        else
            return null;
    }

    del (key) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cVal = getCookie(key);
        if (cVal != null)
            document.cookie = key + "=" + cVal + ";expires=" + exp.toGMTString();
    }
    // */
}
Cookie.prototype.log = new Log('Cookie');

class DBStorage extends ObjectStorage {

    /**
     * dbName is ignored.
     * @param dbName, ignored.
     * @param tableName, data to storage.
     */
    constructor(dbName, tableName) {
        super(dbName + tableName);
        throw 'DBStorage not implement...'
    }

    save (key, value) {
        // save data to key.
        this.log.w("Saving data ignored: ", {key: key, value: value});
    };

    restore (key, originValue) {
        // return data.
        this.log.w("Restoring data ignored: ", {key: key, value: originValue});
    };

    del (key) {
        // return data.
        this.log.w("Delete data ignored: ", key);
    };
}
DBStorage.prototype.log = new Log('DBStorage');

class IndexDB extends DBStorage {
    constructor(dbName, tableName) {
        super(dbName + tableName);
        throw 'IndexDB not implement...'
    }
    /*
    indexDBSupport() {
        try {
            return 'indexDB' in window && window['indexDB'] !== null;
        } catch (e) {
            return false;
        }
    }
    // */
}
IndexDB.prototype.log = new Log('IndexDB');

function FastObjectStorage(domain) {
    return LocalStorage(domain);
}

export {
    ObjectStorage,
    NoneStorage,
    Cookie,
    LocalStorage,
    SessStorage,
    FastObjectStorage,

    IndexDB
};
