/**
 * Created by rico on 16/5/13.
 */

'use strict';

const api = {
    // schema: 'http',
    // host: 'business.we-smart.cn',
    // port: '8108',
    // path: '',
    // query: '',
    schema: 'http',
    host: '192.168.1.227',
    port: '80',
    path: '',
    query: '',

    url: () => api.schema + "://" + api.host + ":" + api.port + "/" + api.path + (api.query ? ('?' + api.query) : '')
};

export default api;