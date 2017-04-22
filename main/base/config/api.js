/**
 * Created by rico on 16/5/13.
 */

'use strict';

const api = {
    // schema: 'https',
    // host: 'api.we-smart.cn',
    // port: '',
    // path: '',
    // query: '',
    schema: 'http',
    host: '192.168.1.227',
    port: '30000',
    path: '',
    query: '',

    url: (path) => api.__prefix + (path ? ((path.startsWith('/') ? '' : '/') + path) : '') + api.__query
};

api.__prefix = api.schema + "://" + api.host + (api.port ? (":" + api.port) : '') + (api.path ? ('/' + api.path) : '');
api.__query = api.query ? ('?' + api.query) : '';

export default api;