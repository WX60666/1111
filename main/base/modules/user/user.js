/**
 * Created by rico on 16/5/12.
 */

import Log from '../../utils/log';
import ListenerList from '../../utils/listenerList';

import req from '../../utils/http';

import uuid from '../../nodeport/node-uuid';

import apiConf from '../../config/api';

import Interval from '../../utils/interval';

import ApiProxy from '../../utils/apiProxy';

// import InvokePromise from '../../utils/InvokePromise';

import _ from "../../utils/objects";

import { Macro } from '../const/error';
const ErrorCode = Macro();

function isUUID(uuidStr) {
    return /[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}/i.test(uuidStr);
}

function isValidUUID(uuidStr) { return isUUID(uuidStr) && "00000000-0000-0000-0000-0000-00000000000".indexOf(uuidStr) != 0; }

//noinspection JSUnusedLocalSymbols
let __empty__ = {
    config: 0,
    checkCode: 0,
    magic: 0,
    v4: () => {},
    reqLoginInfo: () => {}
};

/**
 * ClientKit is used to get authToken for specified clientID.
 * @constructor
 */
function ClientKit(config_) {

    if (!config_ || !isValidUUID(config_.clientID))
        throw `Cannot init ClientKit with invalid config: ${config_}`;

    // validate param.
    const clientID = config_.clientID;

    const checkConfigValid = () => {
        if (!isValidUUID(this.config.terminalID) || !isValidUUID(this.config.clientID)) {
            this.config = ClientKit.defaultConfig(clientID);
            this.listeners.configChanged(this.config);
        }

        if ( this.config.status < ClientKit.State.Loaded || this.config.status >= ClientKit.State.MAX_STATE) {
            this.config = ClientKit.defaultConfig(clientID);
            this.listeners.configChanged(this.config);
        }

        if (!isValidUUID(this.config.authToken)) {
            this.config.status = ClientKit.State.Inited;
        }
    };

    const setStatus = (newState) => {
        if (newState != this.config.status) {
            this.log.i("ClientKit status change from ", this.config.status, " to ", newState, this.config);
            let oldState = this.config.status;
            this.config.status = newState;
            this.listeners.stateChanged(newState, oldState);
            this.listeners.configChanged(this.config);
        }
    };

    const resetAuth = () => {
        this.config.authToken = null;
        checkConfigValid();
        this.checkReady();
    };

    /**
     * Used for outside env to handle errors.
     * @param error
     * @returns {*|boolean} return if error already processed.
     */
    this.rspErrorHandler = async function (error) {
        if (error) {
            switch (error.rspCode) {
                case ErrorCode.BASE.TOKEN_INVALID: {
                    resetAuth();
                    return true;
                } break;
            }
        }

        return false;
    };

    /**
     * Used for outside-env to refresh token.
     */
    this.invalidateToken = function () {
        resetAuth();
        this.checkReady();
    };

    /**
     * returns a boolean-promise indicate whether all process is done.
     * @returns {*}
     */
    let tryGap = new Interval(1000);    // 1 seconds timeout to try.
    let self = this;    // Fucking babel/async do not bind this to UserKit...
    this.checkReady = async function () {
        // console.log('Checking mem: ', this, this.log, self);
        // self.log.i("Checking status: ", self.config.status, ', for: ', self);

        if (self.config.status == ClientKit.State.Ready)
            return true;

        //noinspection FallThroughInSwitchStatementJS
        switch (self.config.status) {
            case ClientKit.State.Loaded: {
                setStatus(ClientKit.State.Inited);
            } // break; // just to fall through.

            case ClientKit.State.Inited: {

                if (!tryGap.available()) {
                    self.log.w("Do not refresh ClientKit authToken too soon: ", self.config.terminalID, "!");
                    return false;
                }

                self.log.i("Start to request client for terminal ID: ", self.config.terminalID, "!");
                let data = await self.Api.getAuthToken(self.config.terminalID, self.config.clientID);

                self.config.authToken = data.authToken;
                self.config.expiresIn = data.expiresIn;
                self.config.lastUpdate = new Date().getTime();
                
                self.log.i("Succeed get authToken(" + self.config.authToken + ") for clientID: ", self.config.clientID,", and terminal ID: ", self.config.terminalID, "!");
                setStatus(ClientKit.State.Ready);
            } // break; // just to fall through.

            case ClientKit.State.Ready: {
                //
            } break;

            default: {
                self.log.i("Do nothing for status: ", self.config.status);
            }
        }

        return self.config.status == ClientKit.State.Ready;
    };

    const isAuthTokenValid = () => isAuthTokenValid(this.config.authToken)
        && (new Date().getTime() < (this.config.lastUpdate || 0) + (this.config.expiresIn || 0) * 1000);

    this.getTerminalID = async function() {
        return isValidUUID(self.config.terminalID) ? self.config.terminalID : null;
    };

    this.getAgentInfo = function () {
        return this.config.agent;
    };

    this.getRobotAuth = async function() {
        return self.Api.getRobotAuth(await self.getTerminalID(), await self.waitAuthToken());
    };

    this.waitAuthToken = async function() {
        let isReady = await self.checkReady();
        if (isReady) return self.config.authToken;
        else return Promise.reject('ClientKit not ready.');
    };

    this.waitEnvironmentID = async function() {
        // self.log.i("Waiting EnvID: ", self.config.status, ', for: ', self);
        return (await self.checkReady() && isValidUUID(self.config.terminalID)) ? self.config.terminalID : Promise.reject('ClientKit not ready.');
    };

    this.waitAuthInfo = async function() {
        let isReady = await self.checkReady();
        // self.log.d('readyState: ', isReady);
        if (isReady) return {
            authToken:     self.config.authToken,
            environmentID: self.config.terminalID,
            terminalID:    self.config.terminalID
        };
        else return Promise.reject('ClientKit not ready.');
    };

    this.toSave = () => this.config;    // nothing more.


    /*
     constructor
     */
    {
        this.config = config_ || ClientKit.defaultConfig(clientID);

        this.listeners = new ListenerList([
            {tag: "ClientKit.status", func: "stateChanged"},
            {tag: "ClientKit.config", func: "configChanged"}
        ]);

        checkConfigValid();
        setTimeout(this.checkReady, 0);   // at last, check status and run machine.

        this.Api = new ApiProxy(this, ClientKit.Api);
    }

}

ClientKit.prototype.defaultConfig = ClientKit.defaultConfig = (clientID) => ({
    status: ClientKit.State.Loaded,
    agent: {
        description: "ff-36",
        kernel: "webkit",
        version: "36.12.2"
    },

    clientID: clientID,
    terminalID: uuid.v4(),
    authToken: null,
    lastUpdate: 0,
    expiresIn: 0
});

ClientKit.prototype.State = ClientKit.State = {
    Loaded: 0,  // init state.
    Inited: 1,  // checked all config all do init state.
    Ready: 2,   // got authToken from server.
    MAX_STATE: 3
};

ClientKit.prototype.log = ClientKit.log = new Log('ClientKit');

ClientKit.Listener = function(stateChanged) {
    this.stateChanged = stateChanged ? stateChanged : function (newState) {
        //
    };
};

ClientKit.prototype.Api = ClientKit.Api = {
    /**
     * Just returns the authToken.
     * @param terminalID
     * @param clientID
     * @returns {*} success: authToken;
     */
    getAuthToken: async function (terminalID, clientID) {
        let url     = apiConf.url('/environment/clientAuth/' + terminalID);
        let reqData = await req.put(url, {clientID: clientID}, (e) => {
            ClientKit.log.w("Failed to prepare authToken: ", e, ', for: { terminalID: ' + terminalID + ', clientID: ' + clientID + '}');
            this.rspErrorHandler(e);
        });

        ClientKit.log.i("Succ prepare authToken: ", reqData, ', for: { terminalID: ' + terminalID + ', clientID: ' + clientID + '}');

        let authData = await req.delete(url, {clientAuth: {authResult: reqData.clientAuth.magic.toString()}}, (e) => {
            ClientKit.log.w("Failed to get authToken: ", e, ', for: { terminalID: ' + terminalID + ', clientID: ' + clientID + '}');
            this.rspErrorHandler(e);
        });

        ClientKit.log.i("Succ req authToken: ", authData, ', for: { terminalID: ' + terminalID + ', clientID: ' + clientID + '}');

        return authData.tokens;
    },

    /**
     * Returns robotAuth structure.
     *  Currently: { data: base64, environmentID: envID, mime: like"image/png" }
     *  How to use the base64-data: $('#checkCodeImg').attr({
     *                  src: 'data:image/png;base64,' + robotAuth.data,
     *                  environmentId: robotAuth.environmentId
     *              });
     *              see, just to set 'src' to the <img> with prefix: 'data:image/png;base64,'
     * @param terminalID
     * @param authToken
     * @returns {*} success: { data: base64, environmentID: envID, mime: like"image/png" }
     */
    getRobotAuth: async function (terminalID, authToken) {
        let url     = apiConf.url('/environment/robotAuth/' + terminalID);
        let reqData = await req.get(url, {authToken: authToken}, (e) => {
            ClientKit.log.w("Failed to get robot auth: ", e, ', for: { terminalID: ' + terminalID + ', authToken: ' + authToken + '}');
            this.rspErrorHandler(e);
        });

        ClientKit.log.i("Succ get robot auth(mostly a image): ", reqData, ', for: { terminalID: ' + terminalID + ', authToken: ' + authToken + '}');

        return reqData.robotAuth.data;
    }
};

/**
 * UserKit is used for user's operation such as:
 *  login:
 *  logout:
 *  register:
 *  password: password
 *  e-mail/telephone:
 *  baseInfo: avatar/nickname/birthday/gender.
 *
 *  NOTE:
 *      UserID
 *
 * @constructor:
 *  @param: {Object} config_, storage
 *  @param: {ClientKit} clientKit, instance of ClientKit.
 */
function UserKit(config_, clientKit) {

    const setStatus = (newState) => {
        if (newState != this.config.status) {
            this.log.i("UserKit status change from ", this.config.status, " to ", newState, this.config);
            let oldState = this.config.status;
            this.config.status = newState;
            this.listeners.stateChanged(newState, oldState);
        }
    };

    const configChanged = () => {
        this.listeners.configChanged(this.config);
    };

    let self = this;
    const getLoginInfo = async function() {
        const prom = new Promise((res, rej) => {
            let processed = false;
            const infoCb  = (loginInfo) => {
                if (processed)  // do nothing.
                    return;

                processed = true;
                if (lastLoginPromise === prom)
                    lastLoginPromise = null;

                if (!loginInfo || !loginInfo.loginID || !loginInfo.password) {
                    self.log.w('Get loginInfo failed, data not exist: ', loginInfo);
                    rej(loginInfo);
                } else {
                    self.log.i('Get loginInfo: ', loginInfo);
                    res(loginInfo);
                }
            };

            self.listeners.reqLoginInfo(infoCb);
            setTimeout(infoCb, 60 * 1000);  // at most for
        });
        return prom;
    };

    const getRobotAuth = async function (checkCode, envID) {
        envID = isValidUUID(envID) || await clientKit.waitEnvironmentID();
        if (checkCode !== null && checkCode !== undefined && envID) {
            return {
                environmentId: envID,
                verifyResult:  checkCode
            };
        }

        return null;
    };

    const invalidateTokens = () => {
        this.config.refreshToken = null;
        this.config.accessToken = null;
        this.config.lastRefresh = 0;
    };

    /**
     * Used for outside env to handle errors.
     * @param error
     * @param reqData
     * @returns {boolean}
     */
    this.rspErrorHandler = async function (error, reqData) {
        self.log.d(`Checking user's rspErrorHandler(status: ${self.config.status}): `, error, reqData);

        if (reqData && reqData.authToken)
            await clientKit.rspErrorHandler(error);

        if (error) {
            switch (error.rspCode) {
                case ErrorCode.BASE.TOKEN_INVALID: {
                    switch (self.config.status) {
                        case UserKit.State.Loaded:
                        case UserKit.State.ClientReady:
                        case UserKit.State.LoginInfoReady:
                        case UserKit.State.LoginReady:
                            setStatus(UserKit.State.Loaded);
                            invalidateTokens();
                            clientKit.invalidateToken();
                            break;

                        case UserKit.State.Ready:
                            setStatus(UserKit.State.LoginReady);
                            setTimeout(self.checkReady, 0);
                            break;

                        default:
                            self.log.w(`Do nothing for UserKit's invalid token: `, self.config);
                            break;
                    }
                    return true;
                } break;
            }
        }

        return false;
    };

    /**
     * Return promise{boolean}: whether all is ready
     * @returns {boolean}
     */
    let lastLoginPromise = null;
    // const tryGap = new Interval(3 * 1000);
    this.checkReady = async function () {
        let loginInfo = null;

        if (self.config.status == UserKit.State.Ready)
            return true;

        self.log.d('Checking UserKit: ', self);

        //noinspection FallThroughInSwitchStatementJS
        switch (self.config.status) {
            case UserKit.State.Loaded:
            {
                // check client.
                let clientReady =  await clientKit.checkReady();

                if (!clientReady) {
                    setStatus(UserKit.State.Loaded);
                    return false;
                } else
                    setStatus(UserKit.State.ClientReady);
            } // break; // just continue.

            case UserKit.State.ClientReady:
            {
                if (lastLoginPromise) {
                    let reason = 'Get loginInfo once a time please! old promise will be deprecated.';
                    self.log.w(reason);
                    // lastLoginPromise.throw(reason);
                }

                lastLoginPromise = getLoginInfo();
                loginInfo = await lastLoginPromise;

                if (self.config.status != UserKit.State.ClientReady) {
                    self.log.e(`UserKit's status changed when waiting for loginInfo, failed and retry later.`);
                    return false;
                } else
                    setStatus(UserKit.State.LoginInfoReady);
            }
                // break;   // just to fall through.

            case UserKit.State.LoginInfoReady:
            {
                self.log.d('Start to login for: ', loginInfo);
                // get accessToken.
                if (    isValidUUID(self.config.refreshToken)
                    &&  isAccessTokenValid() ) {
                    self.log.i('UserKit is ready!');
                    setStatus(UserKit.State.Ready);
                    break;
                } else if (!isValidUUID(self.config.refreshToken) || !isValidUUID(self.config.userID)) {

                    if (!loginInfo) {
                        self.log.i('Failed to get loginInfo, retry later...');
                        setStatus(UserKit.State.ClientReady);
                        setTimeout(self.checkReady, 0);

                        return false;
                    }

                    let clientInfo = await clientKit.waitAuthInfo();
                    // self.log.d('GetAuthInfo: ', clientInfo, self.Api);
                    let userInfo = await self.Api.login(clientInfo.authToken, loginInfo.loginID, loginInfo.password, clientKit.getAgentInfo(), clientInfo.terminalID, await getRobotAuth(loginInfo.checkCode, clientInfo.environmentID));

                    self.log.i("Succ login & refresh a accessToken: ", userInfo);
                    self.config.userID = userInfo.userID;
                    // self.config.accessToken = userInfo.tokens.accessToken;
                    // self.config.refreshToken = userInfo.tokens.refreshToken;
                    self.config.loginID = loginInfo.loginID;
                    _.extend(self.config, userInfo.tokens);
                    self.config.lastRefresh = new Date().getTime();

                    self.log.i('UserKit is ready!');
                    setStatus(UserKit.State.Ready);
                    break;
                } else {
                    setStatus(UserKit.State.LoginReady);
                }

            }
                // break;

            case UserKit.State.LoginReady: {
                if (isValidUUID(self.config.refreshToken) && isValidUUID(self.config.userID)) {
                    self.log.d(`User's refreshToken(${self.config.refreshToken}) & userID(${self.config.userID}) all valid, try to refresh accessToken...`);
                    let data = await self.Api.refreshAccessToken(self.config.userID, await clientKit.getTerminalID(), self.config.refreshToken);
                    self.log.i("Succ refresh a accessToken: ", data);
                    _.override(self.config, data.tokens);
                    self.config.lastRefresh = new Date().getTime();

                    setStatus(UserKit.State.Ready);
                } else {
                    self.log.d(`User's refreshToken(${self.config.refreshToken}) & userID(${self.config.userID}) not valid, back to ClientReady...`);
                    setStatus(UserKit.State.ClientReady);
                    setTimeout(self.checkReady, 0);

                    return false;
                }
            }

            case UserKit.State.Ready: {
                self.log.i('UserKit is ready, start refresh baseInfo...');
                // refresh baseInfo here.
                await self.getUserInfo(true);
                self.log.i('UserKit refreshed baseInfo: ', self.config.baseInfo);
                // if (!self.config.userInfo.avatar || !self.config.userInfo.name) {
                //     let userInfo = await self.Api.getUserInfo(self.config.userID, self.config.accessToken);
                // }
            } break;

            case UserKit.State.Closed: {
                self.log.w('Never try to get info from a Closed UserKit.');
                return false;
            }
        }

        return self.config.status == UserKit.State.Ready;
    };

    this.changePassword = async function(newPassword, oldPassword) {
        return await self.Api.updatePsw(await self.getAccessToken(), self.config.userID, newPassword, oldPassword);
    };

    this.logout = async function () {
        try {
            await self.Api.logout(self.config.userID, await clientKit.getTerminalID(), await self.getAccessToken());
            self.close();
        } catch (e) { }

        return true;
    };

    this.waitUserInfo = async function() {
        let isReady = await self.checkReady();
        if (!isReady)
            return {};

        let allInfo = await self.Api.getUserBaseInfo(this.config.userID, await self.getAccessToken());
        let userInfo = allInfo.baseInfo;
        if (userInfo) {
            userInfo.lastUpdate  = new Date().getTime();
            self.config.userInfo = userInfo;

            self.listeners.configChanged(self.config);

            self.log.v('Updated userInfo: ', userInfo);
        } else {
            self.log.w('Failed updated userInfo for: ', self.config);
        }
        return userInfo;
    };

    const isAccessTokenValid = (currUtc) => isValidUUID(this.config.accessToken) && !isAccessTokenTimeout(currUtc);

    const isAccessTokenTimeout = (currUtc) =>
        (currUtc || new Date().getTime()) - (this.config.lastRefresh || 0) >= (this.config.expiresIn || 0) * 1000;

    const isUserInfoTimeout = (currUtc) =>
        (currUtc || new Date().getTime()) - ( (this.config.userInfo && this.config.userInfo.lastUpdate) || 0) >= 1000 * 60 * 60 * 24;

    this.getUserInfo = async function(notFromCache) {
        if (notFromCache && !isUserInfoTimeout()) {
            return self.config.userInfo;
        }

        return await self.waitUserInfo();
    };

    this.getAccessToken = function() {
        return isAccessTokenValid() ?  self.config.accessToken : null;
    };

    this.getLoginID = function () { //noinspection JSUnresolvedVariable
        return this.config ? this.config.loginID : '*';
    };

    this.waitAccessToken = async function () {
        if (isAccessTokenValid())
            return self.config.accessToken;

        let isReady = await self.checkReady();
        if (isReady) return self.config.accessToken;
        return Promise.reject('AccessToken not exist.');
    };

    this.close = function () {
        // Release all data
        setStatus(this.State.Closed);
        this.config = { userInfo: {} };
        clientKit = null;
    };

    this.toSave = function () {
        return this.config; // do nothing more...
    };

    /*
     Constructor
     */
    {
        if (!config_ || !clientKit)
            throw `Cannot init UserKit with invalid config(${config_}) or clientKit(${clientKit}).`;

        this.config = config_;

        this.listeners = new ListenerList([
            {tag: "UserKit.config", func: "configChanged"},
            {tag: "UserKit.status", func: "stateChanged"},
            {tag: "UserKit.reqLoginInfo", func: "reqLoginInfo"}
        ], this);

        this.Api = new ApiProxy(this, UserKit.Api);
        // this.log.d('UserApi.getRobotAuth: ', this.Api.requestRegister);

        /**
         * Register flow:
         *  1. Do 'requestRegister' with loginID/password/checkCode. And server will send SMS/email to the loginAccount. Retry by send 'sendRegisterValidation'.
         *  2. Active account by 'register' with loginID/validationCode(get from SMS or email).
         *
         * Find password flow:
         *  1. Do 'requestForgetPassword' with loginId/authToken/checkCode, support retry. Server will send SMS/email to the loginID-account.
         *  2. Find password by 'validatePassword' with loginID/newPassword/ValidationCode(get from SMS or email).
         *
         * @type {{requestForgetPassword: UserKit.notLoginApi.requestForgetPassword, validatePassword: UserKit.notLoginApi.validatePassword, requestRegister: UserKit.notLoginApi.requestRegister, sendRegisterValidation: UserKit.notLoginApi.sendRegisterValidation, register: UserKit.notLoginApi.register}}
         */
        this.notLoginApi = new ApiProxy(this, {
            requestForgetPassword: async function (loginID, authToken, checkCode) {
                //noinspection JSPotentiallyInvalidUsageOfThis
                return this.Api.sendPswValidation(loginID, authToken, await getRobotAuth(checkCode));
            },

            validatePassword: async function (loginID, newPassword, verificationCode) {
                //noinspection JSPotentiallyInvalidUsageOfThis
                return this.Api.validateNewPsw(loginID, await clientKit.waitAuthToken(), verificationCode, newPassword);
            },

            requestRegister: async function (loginID, password, checkCode) {
                //noinspection JSPotentiallyInvalidUsageOfThis
                return this.Api.requestRegister(await clientKit.waitAuthToken(), loginID, password, await getRobotAuth(checkCode));
            },

            sendRegisterValidation: async function (loginID, checkCode) {
                //noinspection JSPotentiallyInvalidUsageOfThis
                return this.Api.sendRegisterValidation(loginID, await getRobotAuth(checkCode));
            },

            register: async function (loginID, validationCode) {
                //noinspection JSPotentiallyInvalidUsageOfThis
                return this.Api.register(loginID, await clientKit.waitAuthToken(), await getRobotAuth(validationCode));
            }
        });

        // Do not check clientKit here.
        if ( !isValidUUID( this.config.userID ) || !isValidUUID(this.config.refreshToken) ) {
            setStatus(UserKit.State.ClientReady);
        } else if (isValidUUID(this.config.accessToken)) {
            setStatus(isAccessTokenTimeout() ? UserKit.State.LoginReady : UserKit.State.Ready);
        } else {
            setStatus(UserKit.State.LoginReady);
        }

        if (!this.config.userInfo || !this.config.userInfo.baseInfo)
            this.waitUserInfo();

        let userKit = this;
        clientKit.listeners.add({
            stateChanged: (newState/*, oldState*/) => {
                switch (newState) {
                    case ClientKit.State.Ready: {
                        setStatus(UserKit.State.Loaded);
                        setTimeout(userKit.checkReady, 0);
                    } break;
                }
            }
        });
    }
}

UserKit.prototype.State = UserKit.State = {
    Loaded: 0,              // Alloc
    ClientReady: 1,         // ClientKit is ready.
    LoginInfoReady: 2,      // All required loginInfo is ready.
    LoginReady: 3,          // User login to server.
    Ready: 4,               // All accessToken / refreshToken is ready.
    Closed: 5,              // Kit is closed. Resume not possible.
    MAX_STATE: 6
};

UserKit.defaultConfig = () => ({
    status: UserKit.State.Loaded,

    userID: null,
    loginID: null,
    userType: UserKit.UserType.Standard,

    accessToken: null,
    accessPermission: [],
    lastRefresh: 0,
    expiresIn: 0,       // accessToken expires, unit: second.
    refreshToken: null,

    userInfo: {
        lastUpdate: 0,

        baseInfo: {
            nickName: "Not login",
            avatar:   "",
            birthday: '0000-00-00'
        },

        contactInfo: {
            email: '',
            phone: ''
        },

        extendInfo: {
            // QQ/Weixin not same
        }
    }
});

UserKit.prototype.log = UserKit.log = new Log('UserKit');

UserKit.UserType = {
    Standard: 0,
    OAuthQQ: 1,
    OAuthWeixin: 2,
    Anonymous: 3
};

UserKit.Listener = function () {
    this.stateChanged = function (newState) {
    };
    this.configChanged = function (newConfig) {
    };
    this.reqLoginInfo = function (newConfig) {
    };
};

UserKit.Api = UserKit.prototype.Api = {
    /**
     * Request register.
     * @param authToken
     * @param loginID
     * @param psw
     * @param robotAuth
     * @returns {*} success: { }
     */
    requestRegister: async function(authToken, loginID, psw, robotAuth) {
        let data = {
            authToken: authToken,
            robotAuth: robotAuth,

            newUserInfo: {
                password: psw
            }
        };

        return req.put(apiConf.url(`/user/newUsers/${loginID}`), data, (e) => {
            UserKit.log.w(`Failed to request pre register for ${loginID}, req: ${JSON.stringify(data)}.`);
            this.rspErrorHandler(e, data);
        });
    },

    /**
     * Send register validation.
     * @param loginID
     * @param robotAuth
     * @returns {*} success: { }
     */
    sendRegisterValidation: async function (loginID, robotAuth) {
        let data = {
            authToken: authToken,
            robotAuth: robotAuth
        };

        return req.put(apiConf.url(`/user/newUsers/${loginID}/validation`), data, e => {
            UserKit.log.w(`Failed to send register validate for ${loginID}, req: ${JSON.stringify(data)}.`);
            this.rspErrorHandler(e, data);
        });
    },

    /**
     * Register
     * @param loginID
     * @param authToken
     * @param validationCode
     * @returns {*} success: { }
     */
    register: async function (loginID, authToken, validationCode) {
        let data = {
            authToken: authToken,
            validationInfo: {
                validationCode: validationCode
            }
        };
        return req.delete(apiConf.url(`/user/newUsers/${loginID}/validation`), data, e => {
            UserKit.log.w(`Failed to validate register for ${loginID}, req: ${JSON.stringify(data)}.`);
            this.rspErrorHandler(e, data);
        });
    },

    /**
     * Forget password and send validation to email/phone.
     * @param loginID
     * @param authToken
     * @param robotAuth
     * @returns {*} success: { }
     */
    sendPswValidation: async function (loginID, authToken, robotAuth) {
        var data = {
            authToken: v('authToken'),
            robotAuth: robotAuth
        };

        return req.get(apiConf.url('/user/loginUsers/' + loginID), data, e => {
            UserKit.log.w(`Failed to send password validation for ${loginID}, req: ${JSON.stringify(data)}.`);
            this.rspErrorHandler(e, data);
        })
    },

    /**
     * Retrieve and validate forgotten password.
     * @param loginID
     * @param authToken
     * @param retrieveToken
     * @param newPsw
     * @returns {*} success: { }
     */
    validateNewPsw: async function (loginID, authToken, retrieveToken, newPsw) {
        var data = {
            authToken: authToken,
            retrievePasswordToken: retrieveToken,
            newPassword: newPsw
        };

        return req.post(apiConf.url('/user/loginUsers/' + loginID + '/password'), data, e => {
            UserKit.log.w(`Failed to validate new password for ${loginID}, req: ${JSON.stringify(data)}.`);
            this.rspErrorHandler(e, data);
        })
    },

    /**
     * Login.
     * @param authToken
     * @param loginID
     * @param password
     * @param terminalInfo
     * @param sessID
     * @param robotAuth
     * @returns {*} success: {
                                 "userId": "userId",

                                 "tokens": {
                                    "accessToken": :"$UUID",
                                    "accessPermission": ["access.user.baseInfo.rw"],
                                    "expiresIn":3600,    // Expire info of accessToken. Unit: second.

                                    "refreshToken": "$UUID",
                                 }
                              },
     */
    login: async function (authToken, loginID, password, terminalInfo, sessID, robotAuth) {
        var data = {
            authToken: authToken,
            password: password,
            robotAuth: robotAuth,
            terminalInfo: terminalInfo /*{
                system: "android",
                deviceName: "xiao mi",
                deviceModelInfo: "HongMi2"
            }*/
        };

        // UserKit.log.d('LoginInfo: ', data);
        return req.put(apiConf.url('/user/loginUsers/' + loginID + '/sessions/' + sessID), data, e => {
            UserKit.log.w(`Failed to login user for ${loginID}, req: ${JSON.stringify(data)}.`);
            this.rspErrorHandler(e, data);
        });
    },

    /**
     * Update password
     * @param accessToken
     * @param userID
     * @param oldPsw
     * @param newPsw
     * @returns {*} success: { }
     */
    updatePsw: async function (accessToken, userID, oldPsw, newPsw) {
        var data = {
            accessToken: accessToken,
            oldPassword: oldPsw,
            newPassword: newPsw
        };

        return req.post(apiConf.url('/user/users/' + userID + '/password'), data, e => {
            UserKit.log.w(`Failed to update password for ${this.getLoginID()}/${userID}, req: ${JSON.stringify(data)}.`);
            this.rspErrorHandler(e);
        })
    },

    /**
     * refresh accessToken from refreshToken.
     * @param userID
     * @param sessID
     * @param refreshToken
     * @returns {*} success: {
                                 "tokens": {
                                    "accessToken": :"$UUID",
                                    "accessPermission": ["BASE", ""],
                                    "expiresIn":3600,    // Expire info of accessToken.

                                    "refreshToken": "$UUID",    //
                                 }
                              }
     */
    refreshAccessToken: async function (userID, sessID, refreshToken) {
        let data = { refreshToken: refreshToken };
        return req.get(apiConf.url('/user/users/' + userID + '/sessions/' + sessID + '/tokens'), data, e => {
            UserKit.log.w(`Failed to refreshAccessToken for ${this.getLoginID()}/${userID}, req: ${JSON.stringify(data)}.`);
            this.rspErrorHandler(e);
        });
    },

    /**
     * Caution: UserKit MUST clear user loginInfo whether logout() operation success.
     * @param userID
     * @param sessID
     * @param accessToken
     * @returns {*} success: { }, please clear login info always.
     */
    logout: async function(userID, sessID, accessToken) {
        var data = {
            accessToken: accessToken
        };

        return req.delete(apiConf.url('/user/users/' + userID + '/sessions/' + sessID), data, e => {
            UserKit.log.w(`Failed to logout for ${this.getLoginID()}/${userID}, req: ${JSON.stringify(data)}.`);
            this.rspErrorHandler(e);
        });
    },

    unRegister: async function () {
        throw 'Cannot unRegister a user';
    },

    /**
     * get UserInfo
     * @param userID
     * @param accessToken
     * @returns {*}, success: {
            "baseInfo": {
                "userId":"$userId",
                "nickName":"NICK_NAME",
                "gender":"F/M",
                "avatarUri":"imgUri",
                "birthday":"YYYY/MM/DD",
                "birthTime": "HH:MM:SS",
                "status": "reg|normal|abnormal|block|close"
            },

            "contactInfo": {
                "phone":"+86-12345678901",
                "email":"example@we-smart.cn",
                "qq":"123456",
                "weixin":"weixin",
            },

            "extendInfo": {
                "oauth": [
                    "qq": {
                        "id": "123456789",
                        "token":"oauth_token",
                    },
                    "weixin": {
                        "id": "123456789",
                        "token": "oauth_token",
                    }
                ]
            },
        }
     */
    getUserBaseInfo: async function (userID, accessToken) {
        let data = {
            accessToken: accessToken
        };

        return req.get(apiConf.url('/user/users/' + userID + '/baseInfo'), data, e => {
            UserKit.log.w(`Failed to getUserBaseInfo for ${this.getLoginID()}/${userID}, req: ${JSON.stringify(data)}.`);
            this.rspErrorHandler(e);
        });
    },

    /**
     * Update userInfo
     * @param userID
     * @param accessToken
     * @param baseInfo
     * @returns {*} success: { }
     */
    updateUserBaseInfo: async function (userID, accessToken, baseInfo) {
        let data = {
            accessToken: accessToken,
            baseInfo: baseInfo
        };

        return req.post(apiConf.url('/user/users/' + userID + '/baseInfo'), data, e => {
            UserKit.log.w(`Failed to updateUserBaseInfo for ${this.getLoginID()}/${userID}, req: ${JSON.stringify(data)}.`);
            this.rspErrorHandler(e);
        });
    },

    /**
     * Send email/phone update validation
     * @param userID
     * @param emailOrPhone
     * @param accessToken
     * @returns {*} success: { }
     */
    sendImportantInfoUpdateValidation: async function (userID, emailOrPhone, accessToken) {
        let data = {
            accessToken: v('accessToken'),
            password: v('password'),
            contactInfo: {}
        };
        if (/@/.test(emailOrPhone))
            data.contactInfo.email = emailOrPhone;
        else
            data.contactInfo.phone = emailOrPhone;

        return req.get(apiConf.url('/user/users/' + userID + '/baseInfo/contactInfo/verification'), data, e => {
            UserKit.log.w(`Failed to send email/phone/... update-validation for ${this.getLoginID()}/${userID}, req: ${JSON.stringify(data)}.`);
            this.rspErrorHandler(e);
        });
    },

    /**
     * Update contact/important info
     * @param accessToken
     * @param userID
     * @param validation
     * @returns {*} success: { }
     */
    updateEmailPhone: async function (accessToken, userID, validation) {
        let data = {
            accessToken: accessToken,
            confirmCode: validation
        };

        return req.post(apiConf.url('/user/users/' + userID + '/baseInfo/contactInfo'), data, e => {
            UserKit.log.w(`Failed to update email/phone/... for ${this.getLoginID()}/${userID}, req: ${JSON.stringify(data)}.`);
            this.rspErrorHandler(e);
        });
    },

    /**
     * Update other important info exclude phone/email.
     * @param userID
     * @param accessToken
     * @param psw
     * @param modifiedInfo
     * @returns {*} success: { }
     */
    updateImportantInfo: async function (userID, accessToken, psw, modifiedInfo) {
        let data = {
            accessToken: accessToken,
            password: psw,

            modifiedInfo: modifiedInfo /*{
                extendInfo: {
                    "oauth": [
                        {
                            type:    "qq",
                            "id":    "123456789",
                            "token": "oauth_token",
                        },
                        {
                            type:    "weixin",
                            "id":    "123456789",
                            "token": "oauth_token",
                        }
                    ]
                }
            } */
        };

        return req.get(apiConf.url('/user/users/' + userID + '/baseInfo/importantInfo'), data, e => {
            UserKit.log.w(`Failed to update important info for ${this.getLoginID()}/${userID}, req: ${JSON.stringify(data)}.`);
            this.rspErrorHandler(e);
        });
    }
};

function FastUser(appInfo, storage, getLoginInfoPromise) {

    const log = new Log('FastUser');

    if (!appInfo || !isValidUUID(appInfo.clientID))
        throw `Cannot init FastUser with invalid appInfo: ${appInfo}`;

    const clientKey = 'clientKit',
          userKey = 'userKit'
    ;

    let clientStorage = storage.restore(clientKey, { });
    if (clientStorage) {
        if (clientStorage.clientID != appInfo.clientID)
            clientStorage.clientID = appInfo.clientID;
    }
    let clientKit = this.clientKit = new ClientKit(clientStorage);
    clientKit.listeners.add({ configChanged: () => storage.save(clientKey, clientKit.toSave()) });

    let userKit = this.userKit = new UserKit(storage.restore(userKey, {}), clientKit);

    this.getLoginInfo = getLoginInfoPromise ? getLoginInfoPromise : () => { throw 'Please register FastUser.getLoginInfo!'; };

    userKit.listeners.add({
        stateChanged: () => storage.save(userKey, userKit.toSave()),
        configChanged: () => storage.save(userKey, userKit.toSave()),
        reqLoginInfo: (callback) => {
            this.getLoginInfo(appInfo).then(newLoginInfo => {
                appInfo.loginID = newLoginInfo.loginID;
                appInfo.password = newLoginInfo.password;
                appInfo.checkCode = newLoginInfo.checkCode;

                callback({
                    loginID:   appInfo.loginID,
                    password:  appInfo.password,
                    checkCode: appInfo.checkCode
                });
            }).catch((err) => {
                log.w('Failed to get loginInfo: ', err);
            })
        }
    });
}
FastUser.prototype.getUser = function() { return this.userKit; };
FastUser.prototype.getClient = function() { return this.clientKit; };

function AnonymousUser(storage) {
    return new FastUser({
        loginID: 'anonymous@we-smart.cn',
        password: '12345678'
    }, storage);
}

export { UserKit, ClientKit, FastUser, AnonymousUser };