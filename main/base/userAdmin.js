/**
 * Created by rico on 16/5/13.
 */
'use strict';

import { httpPro as http } from './utils/http';
// import ApiProxy from './utils/apiProxy';
import Log from './utils/log';
const log = new Log('UserAdmin');
import apiConf from './config/api';

function UserAdmin (getUser) {
    {
        this.getUser = getUser;
    }

    let Api = {
        add: (opt) => {
            var data = {
                accessToken: opt.accessToken,

                newUserInfo: opt.newUserInfo /* {
                 "baseInfo": {
                 "userPsw": "123456",
                 "nickName":  "NICK_NAME",
                 "gender":    "F",
                 "avatarUri": "imgUri",
                 "birthday":  "1990/02/12",
                 "birthTime": "12:00:01",
                 "status":    "normal"
                 },

                 "contactInfo": {
                 "phone":  "+86-12345678901",
                 "email":  loginID,
                 "qq":     "123456",
                 "weixin": "weixin"
                 }
                 }*/
            };

            var url = apiConf.url('/userAdmin/admin/newUsers/' + opt.loginID);
            return http.put(url, data, this.getUser().rspErrorHandler);
        },

        del: (opt)  => new Promise(() => {
            throw 'not support for user-deletion.';
        }),

        edit: (opt) => {
            // var loginID = "example@we-smart.cn";
            // var rand    = Math.floor(Math.random() * 100);
            var data    = {
                accessToken: opt.accessToken,

                userInfo: opt.userInfo /*{
                 "baseInfo": {
                 "userPsw":   "654321",
                 "nickName":  "NICK_" + rand,
                 "gender":    "M",
                 "avatarUri": "imgUri" + rand,
                 "birthday":  "1989/03/12",
                 "birthTime": "13:00:01",
                 "status":    "block"
                 },

                 "contactInfo": {
                 "phone":  "+86-15820488477",
                 "email":  loginID,
                 "qq":     "599",
                 "weixin": "wrui"
                 }
                 }*/
            };

            var url = apiConf.url('/userAdmin/admin/users/' + opt.userID);
            return http.post(url, data, this.getUser().rspErrorHandler);
        },

        get: (opt) => {
            var data = {
                accessToken: opt.accessToken
            };

            var url = apiConf.url('/userAdmin/admin/users/' + opt.userID);
            return http.get(url, data, this.getUser().rspErrorHandler);
        },

        search: (opt) => {
            var data = {
                accessToken: opt.accessToken
            };

            var url = apiConf.url(`/userAdmin/admin/loginUsers/${opt.loginID}/allInfo`);
            return http.get(url, data, this.getUser().rspErrorHandler);
        },

        list: (opt) => {
            // log.d('Try to list user: ', opt);
            var data = {
                accessToken: opt.accessToken,

                range: opt.range
            };

            var url = apiConf.url('/userAdmin/admin/users/');
            return http.get(url, data, this.getUser().rspErrorHandler);
        }
    };
    // this.User = new ApiProxy(this, Api);
    this.User = Api;

    log.d('UserAdmin list: ', this.User.list);
}

export default UserAdmin;