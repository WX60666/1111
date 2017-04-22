/**
 * Created by rico on 16/5/13.
 */
'use strict';

import { svrConf } from '../../config/configs';

import user from '../user/user';

import Log from '../../utils/log';
const log = new Log('rsc/From');

function hostName() {
    return svrConf.api.url();
}

/*

form type:

<form>

<input type='file' name='file1PathPart' accept='image/*,audio/mp3,audio/wma'></input>
<input type='file' name='file2PathPart' accept='.pem,.wma,.*'></input>
<input type='hidden' name='accessToken'></input>
<input type='submit'></input>

</form>

 */

function uploadUserFile(form, cb) {
    $(form).attr('action', hostName() + '/rsc/users/' + userID);
    return uploadRsc(form, cb);
}

function uploadPublicUserFile(form, path, cb) {
    $(form).attr('action', hostName() + '/rsc/public/' + userID);
    $(form).attr('path', path);
    return uploadRsc(form, cb);
}

function uploadRsc(form, cb) {
    cb = cb || function() { };

    $(form).find('.accessToken').val(user.accessToken);
    var url = $(form).attr('action');
    var rscUrl = url + '/' + $(form).attr('path');

    function proc (err, data) {
        if(!err && data && data.rspCode === 0 && data.rsc && data.rsc.length > 0 && data.rsc[0].rspCode === 0) {
            // log.d('上传成功!');
            cb(null, rscUrl);
        } else {
            cb(err);
            log.w(JSON.stringify(data));
        }
    }

    var option = {
        type: 'POST',
        url: url,
        success: proc.bind(null, null),
        error: proc
    };
    log.d('Form: ', $(form));
    $(form).ajaxSubmit(option);
}

function autoUpload(form) {
    $(form).on('change', (/*event*/)=> {
        uploadRsc(form);
    })
}

const module = {
    upload: {
        rsc: uploadRsc,
        userRsc: uploadUserFile,
        userPubRsc: uploadPublicUserFile,

        autoUpload: autoUpload
    },

    download: {
        rsc: uploadRsc,
        userRsc: uploadUserFile,
        userPubRsc: uploadPublicUserFile
    }
};

export default module;