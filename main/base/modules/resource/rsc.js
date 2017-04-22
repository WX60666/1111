/**
 * Created by rico on 16/5/13.
 */
import http from '../../utils/http';
import Log from '../../utils/log';
const log = new Log('rsc');

/*
    file: file content.
    meta: {
        mime: 'image/jpeg',
        encode: 'base64'/'bin'/'gzip',
        id: 'path/to/rsc'
    }
 */

function uploadUserFile(file, meta, cb) {
    return uploadRsc(host + '/user/' + userID, file, meta, cb);
}

function uploadPublicUserFile(file, meta, cb) {
    return uploadRsc(host + '/public/' + userID, file, meta, cb);
}

function uploadRsc(url, file, meta, cb) {
    cb = cb || function() { };

    function process (err, data) {
        if(!err && data && data.rspCode === 0 && data.rsc && data.rsc.length > 0 && data.rsc[0].rspCode === 0) {
            // alert('上传成功!');
            data.rscUrl = url + '/' + meta.id;
            cb(null, data);
        } else {
            log.w('上传失败!');
            cb(err);
            log.d('upload file result: ', JSON.stringify(data));
        }
    }

    http.put(url, {
        rsc: [{
            file: file,
            mime: meta.mime,
            id: meta.id,
            encode: meta.encode
        }]
    }, process);
}

function downloadRsc(url, id, cb) {
    cb = cb || function() { };

    // var rscUrl = url + ('/' + id);

    function process (err, data) {
        if(!err && data && data.rspCode === 0 && data.rsc && data.rsc.length > 0 && data.rsc[0].rspCode === 0) {
            // alert('上传成功!');
            data.rscUrl = url + '/' + id;
            cb(null, data);
        } else {
            log.w('上传失败!');
            cb(err);
            log.d('upload file result: ', JSON.stringify(data));
        }
    }

    http.get(url, {
        rsc: [ id ]
    }, process);
}


function rscPut(pathHeader) {
    var data = {
        "accessToken": v('accessToken'),
        "file": 'url:' + pathHeader + '\n' + '资源测试文件\n' + new Date()
    };
    $.ajax({
        type: 'PUT',
        url: '/rscs/' + pathHeader + '/' + v('rscPATH'),
        dataType: 'json',
        data: JSON.stringify(data),
        success: ajaxSuccess,
        error: ajaxError
    })
}

function rscGet(pathHeader) {
    $.ajax({
        type: 'GET',
        url: '/rscs/' + pathHeader + '/' + v('rscPATH') + '?body={"accessToken":"' + v('accessToken') + '"}',
        dataType: 'json',
        success: ajaxSuccess,
        error: ajaxError
    })
}

function rscDel(pathHeader) {
    var data = {
        "accessToken": v('accessToken')
    };
    $.ajax({
        type: 'DELETE',
        url: '/rscs/' + pathHeader + '/' + v('rscPATH'),
        dataType: 'json',
        data: JSON.stringify(data),
        success: ajaxSuccess,
        error: ajaxError
    })
}



const module = {
    upload: {
        rsc: uploadRsc,
        userRsc: uploadUserFile,
        userPubRsc: uploadPublicUserFile
    },

    download: {
        rsc: uploadRsc,
        userRsc: uploadUserFile,
        userPubRsc: uploadPublicUserFile
    }
};

export default module;