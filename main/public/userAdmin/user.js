/**
 * Created by rico on 16/5/11.
 */

import css from "./user.scss";

import Vue from 'vue';
import _ from '../../base/utils/objects';
import $ from '../../base/utils/dom';

import { FastUser } from '../../base/modules/user/user';
import { LocalStorage } from '../../base/storage/storage';
import { clients } from '../../base/config/client';

// import Dialog from '../../base/ui/components/dialog.vue';
// import LoginBox from '../../base/ui/login.vue';

// import { Loader } from '../../base/utils/loader';
import Log from '../../base/utils/log';

import Toast from '../../ui/uiutils/toast';
import DataValidator from '../../base/utils/dataValidator';

import UserAdmin from '../../base/userAdmin';

// console.log('Loaded userAdmin: ', requirejs ? requirejs : null, define, this);

const log = new Log('UserAdmin:UserUI');
let storage = new LocalStorage('com.oe');

// log.d('Making FastUser: ', storage);

const lastLoginInfo = {
    loginID: null,
    password: null,
    checkCode: null,
    lastUpdate: 0
};

let currentUser = new FastUser({
    clientID: clients.defaultClient.clientID
}, storage, async function(oldInfo) {

    // A input will last for 10 second.
    if (lastLoginInfo.lastUpdate + 10 * 1000 > new Date().getTime())
        return lastLoginInfo;

    lastLoginInfo.loginID = prompt('UserName: ', (oldInfo && oldInfo.loginID) || '请输入登录帐号');
    if (lastLoginInfo.loginID == null) { Toast.toast('取消登录'); return null; }
    lastLoginInfo.password = prompt('User Password: ', (oldInfo && oldInfo.loginID) || '请输入登录密码');
    if (lastLoginInfo.password == null) { Toast.toast('取消登录'); return null; }
    lastLoginInfo.lastUpdate = new Date().getTime();

    return lastLoginInfo;
});

currentUser.getUser().listeners.add({
    //
});

currentUser.getUser().checkReady().then((data) => {
    log.d("User's ready: ", data);
    if (lastLoginInfo.lastUpdate != 0)
        Toast.toast('登录成功!');

    userInfoTip.config = currentUser.getUser().config;
    setTimeout(mainBoardVM.refresh, 300);
})
    .catch((err) => {
        log.w("User's not ready: ", err);
        Toast.toast('登录失败...');
        userInfoTip.config = currentUser.getUser().config;
    });

let userInfoTip = new Vue({
    el: '#userInfoTop',
    data: {
        config: {}
    }
});

var userAdmin = new UserAdmin( () => {
    return currentUser.getUser();
});

const api = userAdmin.User;

const accessToken = function () {  return currentUser.getUser().getAccessToken(); };

const toDate = function (date) {
    date = new Date(date);
    if (!date) return undefined;

    let y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate();
    return (y < 1000 ? '0' + y.toString() : y) + '-' + (m < 10 ? '0' + m.toString() : m) + '-' + (d < 10 ? '0' + d.toString() : d);
};

const fromDate = function (date) {
    if (!date)
        return undefined;

    let ret = new Date();
    let ymd = date.split('-');
    ret.setYear(ymd[0]);
    ret.setMonth(ymd[1] - 1);
    ret.setDate(ymd[2]);
    return ret;
};

const countPerPage = 10;
const mainBoardConf = {
    el: '#mainBoard',
    data: {
        currPage: 0,
        currUserInfo: { },
        selUserInfo: null,
        userList: []
    },

    methods: {

        refresh () { this.getUserList(this.currPage); },

        colClicked (idx) {
            log.d('Clicked column: ', idx);
            this.updateUserInfoUI(this.userList[idx]);
        },

        updateUserInfoUI (thisUser) {
            let baseInfo = thisUser.baseInfo;
            this.selUserInfo = thisUser;
            this.currUserInfo = {
                loginID: (thisUser.contactInfo.email || thisUser.contactInfo.phone),
                gender: baseInfo.gender,
                // password: undefined,
                status: baseInfo.status == 'normal' ? 'ready' : 'block',
                nickName: baseInfo.nickName,
                avatarUri: baseInfo.avatarUri,
                birthday: toDate(new Date(baseInfo.birthday))
            };
        },

        edit () {
            let userInfo = this.collectUserInfo();
            if (!userInfo)
                return;

            let user = this.selUserInfo;
            // log.d('user & userInfo: ', user, userInfo);
            let userID = user && (user.contactInfo.email || user.contactInfo.phone) == userInfo.loginID ? user.baseInfo.userID : undefined;
            delete userInfo.loginID;
            delete userInfo.contactInfo;

            if (userID == undefined) {
                Toast.toast('请先选择需要进行修改的用户!');
                return;
            }

            log.d('Editing userInfo: ', userInfo);
            // return;
            api.edit({ userInfo: userInfo, accessToken: accessToken(), userID: userID })
               .then(data => {
                   this.refresh();
                   Toast.toast(`更新用户信息成功!`);
               })
               .catch(err => Toast.toast(`更新用户信息失败(${JSON.stringify(err)}), 请稍后重试!`));
        },

        add () {
            let userInfo = this.collectUserInfo();
            if (!userInfo)
                return;

            let loginID = userInfo.loginID;
            delete userInfo.loginID;

            log.d('Adding userInfo: ', userInfo, loginID);
            api.add({ newUserInfo: userInfo , accessToken: accessToken(), loginID: loginID })
               .then(data => {
                   this.refresh();
                   Toast.toast(`更新用户信息成功!`);
               })
               .catch(err => Toast.toast('添加用户信息失败(' + JSON.stringify(err) + '), 请稍后重试!'));
        },

        search () {
            // const loginID = $('#infoForm').find('input[name="name"]').val();
            log.v('Searching user: ', this.currUserInfo);
            const loginID = this.currUserInfo.loginID;

            api.search({loginID: loginID, accessToken: accessToken() })
               .then(data => {
                   log.d('Searched user: ', data);
                   this.updateUserInfoUI(data.userInfo);
               })
               .catch(err => Toast.toast('查找失败(' + JSON.stringify(err) + ')...'));
        },

        getUserList (pageIdx) {
            // log.d('Trying to get userList, idx: ', pageIdx, api, api.list);
            if (pageIdx < 0)
                return;

            api.list({
                accessToken: accessToken(),
                range: {
                    offset: pageIdx * countPerPage,
                    count: countPerPage
                }
            }).then( data => {
                if (data && data.users && data.users.length) {
                    this.currPage = pageIdx;
                    this.userList = data.users;
                } else
                    Toast.toast('未获取到更多用户信息...');
            } )
               .catch( err => Toast.toast('刷新失败(' + JSON.stringify(err) + '),请稍后重试!') );
        },

        /*
        updateUserInfoUI(info) {
            currUserInfo = info;

            let bi = info.baseInfo || {};
            let ci = info.contactInfo || {};

            const root = $('#infoForm');
            const setVal = (name, val) => root.find(`input[name=${name}]`).val(val);
            setVal('name', ci.phone || ci.email);
            setVal('psw', '--');
            setVal('status', bi.status == 'ready' ? 'ready' : 'block');
            setVal('nickName', bi.nickName);
            setVal('gender', /[FfMm]/.test(bi.gender) ? bi.gender.toUpperCase() : 'U' );
            setVal('avatar', bi.avatar);
            setVal('birthday', bi.birthday);
        },
        */

        collectUserInfo () {
            const dv = DataValidator;
            const root = window.document.getElementById('infoForm');

            const loginID = $.getInputVal(root, 'name');
            const isEmail = /@/.test(loginID);

            const getLenStr = (name, min, max, pattern) => {
                let v = $.getInputVal(root, name);
                if (v === undefined)
                    return v;

                if (dv.checkByteLen(v, min, max) && (pattern ? pattern.test(v) : true))
                    return v.length > 0 ? v : undefined;
                throw $.getPlaceHolder(root, name);
            };

            const getStr = (name, pattern) => {
                let v = $.getInputVal(root, name);
                if (v === undefined)
                    return v;

                if (pattern.test(v))
                    return v.length > 0 ? v : undefined;
                throw $.getPlaceHolder(root, name);
            };

            try {
                let data = {
                    baseInfo: {
                        "userPsw":   $.getInputVal(root, 'psw') == '' ? undefined : getStr('psw', /[\w\-_]{6,15}/),
                        "nickName":  getLenStr('nickName', 1, 31),
                        "gender":    $.getSelVal(root, 'gender'),
                        "avatarUri": getLenStr('avatar', 0, 255),
                        "birthday":  getStr('birthday', /\d{4}-((0[1-9])|(1[0-2]))-((0[1-9])|([1-2]\d)|(3[0-1]))/),
                        // "birthTime": "12:00:01",
                        "status":    $.getSelVal(root, 'status') == 'ready' ? 'normal' : 'block'
                    },

                    "contactInfo": {
                        "phone": isEmail ? undefined : loginID,
                        "email": isEmail ? loginID : undefined
                    },
                    loginID: loginID
                };

                const delUndefined = function (o) {
                    log.d('checking data: ', o);

                    for (let k in o) {
                        if (o[k] === undefined)
                            delete o[k];
                        else if (_.isObject(o[k])) delUndefined(o[k]);
                    }
                };

                delUndefined(data);

                log.d('Collected info: ', data, ', currUserInfo:', this.currUserInfo);
                return data;
            } catch (e) {
                Toast.toast('数据有错误：' + e);
                return null;
            }
        }
    },

    ready: function () {
        // this.refresh(); // do when user's ready.
    }
};

var mainBoardVM = new Vue(mainBoardConf);