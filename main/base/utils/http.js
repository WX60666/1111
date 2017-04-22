/**
 * Created by rico on 16/5/13.
 */

import Log from './log';
import { cbApi2pro } from './cb2promise';

const log = new Log('http');

// import $ from 'jquery';
let $ = {
    getXmlHttp: () => {
        if (window.XMLHttpRequest) {// code for all new browsers
            return new XMLHttpRequest();
        }
        else if (window.ActiveXObject) {// code for IE5 and IE6
            return new ActiveXObject("Microsoft.XMLHTTP");
        }
    },

    ajax: (opt) => {
        let xmlHttp = $.getXmlHttp();

        if (xmlHttp != null) {
            xmlHttp.onreadystatechange = () => {
                if (xmlHttp.readyState == 4) {      // 4 = "loaded"
                    if (xmlHttp.status == 200) {    // 200 = OK
                        let ret = null;
                        if (xmlHttp.responseType == '' || xmlHttp.responseType == 'text')
                            ret = JSON.parse(xmlHttp.responseText);
                        else ret = xmlHttp.response;

                        opt.success(ret);
                    } else {
                        opt.error({ rspCode: 99999, reason: `httpResponse: { status: ${xmlHttp.status}, statusText: ${xmlHttp.statusText} }` });
                    }
                }
            };

            xmlHttp.open(opt.type, opt.url, true);

            // xmlHttp.setRequestHeader('Accept-Encoding', 'gzip, deflate');    // will be set by browser.
            xmlHttp.setRequestHeader('Accept', 'application/json');
            xmlHttp.setRequestHeader('Content-Type', opt.contentType + '; charset=UTF-8');

            xmlHttp.send(opt.data);
        } else {
            opt.error({ rspCode: 99999, reason: "Your browser does not support xmlHttpRequest!"});
        }
    }
};

function jsonReq(method, url, data, callback, errHandler) {
    /*  // using jquery.
    $.ajax({
        type: method,
        url: url,
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: data => data.rspCode === 0 ? callback(null, data) : callback(data),
        error: err => callback(err)
    });
    */
    //noinspection CommaExpressionJS
    $.ajax({
        type:        method,
        url:         url,
        dataType:    'json',
        contentType: 'application/json',
        data:        JSON.stringify(data),
        success:     data => {
            // log.d('Success http: ', data);
            if (data.rspCode === 0) callback(null, data); else {
                callback(data);
                if (errHandler) setTimeout(() => errHandler(data), 0)
            }
        },
        error:       err => {
            callback(err);
            if (errHandler) setTimeout(() => errHandler(err), 0);
        }
    })
}

function putReq(url, data, errHandler, callback) {
    log.v(JSON.stringify({ method: "PUT", url: url, data: data }));

    jsonReq('PUT', url, data, callback, errHandler);
}

function postReq(url, data, errHandler, callback) {
    log.v(JSON.stringify({ method: "POST", url: url, data: data }));

    jsonReq('POST', url, data, callback, errHandler);
}

function getReq(url, data, errHandler, callback) {
    log.v(JSON.stringify({ method: "GET", url: url, data: data }));

    jsonReq('GET', url + '?body=' + JSON.stringify(data), null, callback, errHandler);
}

function delReq(url, data, errHandler, callback) {
    log.v(JSON.stringify({ method: "DELETE", url: url, data: data }));

    jsonReq('DELETE', url, data, callback, errHandler);
}

const http = {
    get: getReq,
    put: putReq,
    post: postReq,
    delete: delReq
};
const promised = {
    get: cbApi2pro(getReq),
    put: cbApi2pro(putReq),
    post: cbApi2pro(postReq),
    delete: cbApi2pro(delReq)
};
// JUST USED for generate IDE tips...
const httpPro = {
    get: (url, data, errHandler) => promised.get(url, data, errHandler),
    put: (url, data, errHandler) => promised.put(url, data, errHandler),
    post: (url, data, errHandler) => promised.post(url, data, errHandler),
    delete: (url, data, errHandler) => promised.delete(url, data, errHandler)
};

export default httpPro;

export {
    http,
    httpPro
}

