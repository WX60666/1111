/**
 * Created by rico on 16/5/16.
 */

const co = require('../nodeport/co');

const cbApi2Thunk = (api, ...args) => (cb) => api(...args, cb);
const thunk2Promise = (thunk) => cbApi2Promise(thunk);

const cbApi2Promise = (cbApi) => {
    if (!cbApi) throw `Cannot convert cbApi(${cbApi}) to promiseApi!`;

    return (...all) => {
        return new Promise((res, rej) =>
            cbApi(...all, (err, ...data) => {
                if (err) rej(err);
                else res(...data);
            })
        );
    }
};

const promiseApi2Cb = (proApi) => {
    if (!proApi) throw `Cannot convert promiseApi(${proApi}) to cbApi!`;

    return (...all) => {
        let cb = all.pop();
        proApi(...all)
            .then(data => cb(null, data))
            .catch(err => cb(err));
    }
};

const cb2Promise = (cb) => {
    if (!cb) throw `Cannot convert cb(${cb}) to promise!`;

    return (err, data) => co( function *() {
        if (!err) return Promise.resolve(data);
        else return Promise.reject(err);
    });
};

const promise2Cb = (pro, cb) => {
    if (!cb || !pro) throw `Cannot convert promise(${pro}}) to cb(${cb})!`;

    pro.then(data => cb(null, data))
       .catch(err => cb(err));

    return cb;
};

export {
    cbApi2Promise as cbApi2pro, promiseApi2Cb as proApi2cb,
    cb2Promise as cb2pro, promise2Cb as pro2cb,
};
