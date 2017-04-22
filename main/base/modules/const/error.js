/**
 * Created by pisces on 15-17-3.
 */
"use strict";

import _ from '../../utils/objects';
var errCodeMap = {}; //错误码表 rspCode:msg


function error(code, msg, dispmsg) {
    var tmpCode = (code == undefined || code == null) ? 99999 : code;
    var tmpMsg  = (msg == undefined) ? errCodeMap[code][0] : msg;
    if (_.isObject(tmpMsg)) tmpMsg = JSON.stringify(tmpMsg);

    var err     = new Error(tmpMsg);
    err.code    = tmpCode;
    err.dispmsg = (dispmsg == undefined) ? '' : dispmsg;
    return err;
}

function Macro() {
    return {
        BASE: {
            DATA_FORMAT_ERROR: 10000,

            PASSWORD_FORMAT_ERROR: 11001,
            EMAIL_FORMAT_ERROR: 11002,
            PHONE_FORMAT_ERROR: 11003,

            DATA_CONTENT_ERROR: 20000,
            VERIFICATION_CODE_ERROR: 21001,
            ACTIVATION_CODE_ERROR: 21002,
            OPERATION_TOO_OFTEN: 21003,
            APP_CLIENT_VERIFY_FAILED: 21004,

            LOGIC_ERROR: 30000,

            USER_NOT_FOUND: 31001,
            LOGIN_ID_NOT_FOUND: 31002,
            USER_ID_NOT_FOUND: 31003,
            EMAIL_IS_REGISTERED: 31004,
            PHONE_IS_REGISTERED: 31005,
            APP_CLIENT_ID_NOT_REGISTERED: 31006,

            TOKEN_INVALID: 32001,
            TOKEN_PERMISSION_NOT_ENOUGH: 32002,
            NOT_PERMITTED_FOR_CURRENT_USER: 32003,

            USER_STATUS_INVALID: 32100,

            PASSWORD_INCORRECT: 33001,
            FORGOTTEN_PASSWORD_IS_NOT_INVOKED: 33002,

            OAUTH: 40000,
            OAUTH_TOKEN_NOT_FIND: 40001,
            OAUTH_TOKEN_INVALID: 40002,

            SYSTEM_ERROR: 90000,
            EMAIL_SYSTEM_ERROR: 90001,
            MSG_SYSTEM_ERROR: 90002,

            MYSQL_ERROR: 91000,
            MYSQL_DATA_IS_LOCKED: 91001,

            MONGODB_ERROR: 92000,

            REDIS_ERROR: 93000,

            BINARY_SERVER_ERROR: 98000,

            EXTERNAL_SYS_ERROR: 99000,

            INTERNAL_SYS_ERROR: 99500,

            OTHER_ERROR: 99999
        },
        NETWORK: {
            NETWORK_ID_NOT_FOUND: 231001,
            NETWORK_ID_ALREADY_EXISTS: 231002,
            USER_ID_NOT_FOUND: 231003,
            USER_ID_ALREADY_EXISTS: 231004,
            SHARE_ID_NOT_FOUND: 231005,
            DEVICE_ID_NOT_FOUND: 231006,
            GROUP_ID_NOT_FOUND: 231007,
            LAN_ID_NOT_FOUND: 231008,
            DEVICE_IS_NOT_ONLINE: 231009,
            ROUTE_NOT_FIND: 231010,


            NO_AUTHORITY: 232001,

            PASSWORD_INCORRECT: 233001,

            TRANS_URI_NOT_FOUND: 281001,
            TRANS_CFG_NOT_FOUND: 281002,
            TRANS_CFG_ALREADY_EXISTS: 281003,
            SHORT_ID_ALREADY_EXISTS: 281004,

            TRANS_URI_REPLACE_REJECT: 282002
        },
        RSC: {
            NOT_FOUND: 331001,
            APP_CONFIG_NOT_FOUND: 331002,
            APP_NETWORK_CONFIG_NOT_FOUND: 331003,
            RSC_TOO_LARGE: 331010,

            NO_AUTHORITY: 332001
        },
        SNS: {
            GROUP_ID_NOT_FOUND: 531001,
            GROUP_ID_ALREADY_EXISTS: 531002,
            USER_ID_NOT_FOUND: 531003,
            USER_ID_ALREADY_EXISTS: 531004,

            NO_AUTHORITY: 532001,
            GROUP_BIND_IN_NETWORK: 532002,
            OWNER_CAN_NOT_QUIT: 532003
        },
        EXTERNAL_SYS: {
            WEIXIN_API_ERROR: 98001,
            WEIXIN_NET_ERROR: 98002,

            ALI_OTS_ERROR: 98101,
            ALI_OSS_ERROR: 98111,
            ALI_RDS_ERROR: 98121
        }
    }
}

module.exports.error = error;
module.exports.Macro = Macro;
export default { error, Macro };

/**
 * 错误码定义
 * 格式： 6位数整数 ******
 * 前2位表示 大错误类型
 * 后4位表示 子错误类型
 *
 * 01**** : 数据格式错误
 * 02**** : 数据内容错误
 * 03**** : 一般逻辑错误
 *
 * 09**** : 内部错误
 *
 *
 * 1***** : 账户类逻辑错误
 * 2***** : 网络类逻辑错误
 * 3***** : 系统消息类错误，包括各种系统推送的消息
 * 4***** : 资源类逻辑错误
 * 5***** : SNS逻辑类错误
 */

var E = Macro();

errCodeMap[0] = ['', '', ''];

var BASE = E.BASE;
// 一般格式错误 01**** start
errCodeMap[BASE.DATA_FORMAT_ERROR] = ['Data format error', '数据格式错误！', 'Please check data format.'];

errCodeMap[BASE.PASSWORD_FORMAT_ERROR] = ['Password format error', '密码格式错误！密码长度6 - 31位，且仅能够包含数字，大小写字母，-_.!@#*，请确认重试', 'Password format error, length is required 6 - 31. A-Z a-z , . - _ . ! @ # can be used!'];
errCodeMap[BASE.EMAIL_FORMAT_ERROR]    = ['Email format error', '邮箱格式错误，请确认重试！', 'E-mail format error, please check and retry!'];
errCodeMap[BASE.PHONE_FORMAT_ERROR]    = ['Phone format error', '电话格式错误，请确认是11位手机号码！', 'Phone number format error, please confirm the length of 11!'];
// 一般格式错误 01**** end


// 一般内容错误 02**** start
errCodeMap[BASE.DATA_CONTENT_ERROR]       = ['Data content error', '数据内容错误！', 'Please check data content.'];
errCodeMap[BASE.VERIFICATION_CODE_ERROR]  = ['Verification code error', '验证码错误，请确认重试！', 'Verification error, please check and retry.'];
errCodeMap[BASE.ACTIVATION_CODE_ERROR]    = ['Activation code error', '注册激活码已失效，请重新获取激活短信或者邮件进行重试！', 'Activation code error, please retrieve a new SMS code or e-mail!'];
errCodeMap[BASE.OPERATION_TOO_OFTEN]      = ['Operation too often', '请不要太频繁的进行操作', 'Please operate a bit slower and wait.'];
errCodeMap[BASE.APP_CLIENT_VERIFY_FAILED] = ['App-Client verify failed', '此终端应用验证失败，App可能被破解！', 'App verify failed, the app may be cracked!'];
// 一般内容错误 02**** end


// 一般逻辑错误 03**** start
errCodeMap[BASE.LOGIC_ERROR]                  = ['Logic error', '数据不合理！', 'Please check data validation.'];
errCodeMap[BASE.USER_NOT_FOUND]               = ['User not found', '用户信息不存在', 'User information not found.'];
errCodeMap[BASE.LOGIN_ID_NOT_FOUND]           = ['Login id not found', '登录用户名不存在', 'Login name not found.'];
errCodeMap[BASE.USER_ID_NOT_FOUND]            = ['User id not found'];
errCodeMap[BASE.EMAIL_IS_REGISTERED]          = ['E-mail is registered', '邮箱已经被注册', 'E-mail is registered'];
errCodeMap[BASE.PHONE_IS_REGISTERED]          = ['Phone is registered', '电话号码已经被注册', 'Phone number is registered'];
errCodeMap[BASE.APP_CLIENT_ID_NOT_REGISTERED] = ['App-Client Id not registered', '此终端应用尚未注册，请勿使用非法App！', 'Please use a valid app!'];

errCodeMap[BASE.TOKEN_INVALID]                  = ['Token invalid'];
errCodeMap[BASE.TOKEN_PERMISSION_NOT_ENOUGH]    = ['Token permission not enough'];
errCodeMap[BASE.NOT_PERMITTED_FOR_CURRENT_USER] = ['Not permitted for current user', '您没有权限进行这个操作！', 'Sorry, permission is denied!'];

errCodeMap[BASE.USER_STATUS_INVALID] = ['User status abnormal', '您的用户状态异常！', 'Sorry, your account is abnormal!'];

errCodeMap[BASE.PASSWORD_INCORRECT]                = ['Password incorrect', '请确认密码正确并重试！', 'Please check password and retry!'];
errCodeMap[BASE.FORGOTTEN_PASSWORD_IS_NOT_INVOKED] = ['Forgotten password is not invoked', '若需要找回密码，请首先开始找回密码流程！', 'Please do password-forgotten flow before!'];
// 一般逻辑错误 03****  end

// OAUTH错误 04**** start
errCodeMap[BASE.OAUTH]                = ['oauth error'];
errCodeMap[BASE.OAUTH_TOKEN_NOT_FIND] = ['oauth not find token'];
errCodeMap[BASE.OAUTH_TOKEN_INVALID]  = ['oauth token invalid'];
// OAUTH错误 04****  end

// 一般内部错误 09**** start
errCodeMap[BASE.SYSTEM_ERROR] = ['System error']; // 系统错误
errCodeMap[BASE.EMAIL_SYSTEM_ERROR] = ['Email system error']; // 邮件平台错误
errCodeMap[BASE.MSG_SYSTEM_ERROR] = ['Msg system error']; // 短信平台错误

// mysql错误
errCodeMap[BASE.MYSQL_ERROR]          = ['Mysql error'];
errCodeMap[BASE.MYSQL_DATA_IS_LOCKED] = ['data is locked'];

// mongodb错误
errCodeMap[BASE.MONGODB_ERROR] = ['Mongodb error'];

// redis错误
errCodeMap[BASE.REDIS_ERROR] = ['Redis error'];

// 二进制服务器错误
errCodeMap[BASE.BINARY_SERVER_ERROR] = ['binary server error'];

// 外部系统服务错误
errCodeMap[BASE.EXTERNAL_SYS_ERROR] = ['external system error'];

// 内部系统服务错误
errCodeMap[BASE.INTERNAL_SYS_ERROR] = ['internal system error'];

errCodeMap[BASE.OTHER_ERROR] = ['Other error']; // 未知错误
// 一般内部错误 09**** end


/**
 * network 2*****
 */
var NETWORK = E.NETWORK;

errCodeMap[NETWORK.NETWORK_ID_NOT_FOUND] = ['network id not found'];//
errCodeMap[NETWORK.NETWORK_ID_ALREADY_EXISTS] = ['network id already exists'];//
errCodeMap[NETWORK.USER_ID_NOT_FOUND]      = ['user id not found'];
errCodeMap[NETWORK.USER_ID_ALREADY_EXISTS] = ['user id already exists'];
errCodeMap[NETWORK.SHARE_ID_NOT_FOUND]     = ['share id not found'];
errCodeMap[NETWORK.DEVICE_ID_NOT_FOUND]    = ['device id not found'];
errCodeMap[NETWORK.GROUP_ID_NOT_FOUND]     = ['group id not found'];
errCodeMap[NETWORK.LAN_ID_NOT_FOUND]       = ['lan id not found'];
errCodeMap[NETWORK.DEVICE_IS_NOT_ONLINE]   = ['Device is not online'];
errCodeMap[NETWORK.ROUTE_NOT_FIND]         = ['not find route'];

errCodeMap[NETWORK.NO_AUTHORITY] = ['network no authority'];

errCodeMap[NETWORK.PASSWORD_INCORRECT] = ['network password incorrect'];

errCodeMap[NETWORK.TRANS_URI_NOT_FOUND]      = ['uri not found'];
errCodeMap[NETWORK.TRANS_CFG_NOT_FOUND]      = ['config not found'];
errCodeMap[NETWORK.TRANS_CFG_ALREADY_EXISTS] = ['config already exists'];
errCodeMap[NETWORK.SHORT_ID_ALREADY_EXISTS]  = ['short id already exists'];

errCodeMap[NETWORK.TRANS_URI_REPLACE_REJECT] = ['uri replace reject'];

/**
 * rsc/app 3*****
 */
var RSC = E.RSC;

errCodeMap[RSC.NOT_FOUND]                    = ['resource not found'];
errCodeMap[RSC.APP_CONFIG_NOT_FOUND]         = ['app config not found'];
errCodeMap[RSC.APP_NETWORK_CONFIG_NOT_FOUND] = ['app network config not found'];

errCodeMap[RSC.NO_AUTHORITY] = ['resource no authority'];

/**
 * SNS 5*****
 */
var SNS = E.SNS;

errCodeMap[SNS.GROUP_ID_NOT_FOUND] = ['group id not found'];//
errCodeMap[SNS.GROUP_ID_ALREADY_EXISTS] = ['group id already exists'];//
errCodeMap[SNS.USER_ID_NOT_FOUND]      = ['user id not found'];
errCodeMap[SNS.USER_ID_ALREADY_EXISTS] = ['user id already exists'];

errCodeMap[SNS.NO_AUTHORITY]          = ['group no authority'];
errCodeMap[SNS.GROUP_BIND_IN_NETWORK] = ['group bind in network'];
errCodeMap[SNS.OWNER_CAN_NOT_QUIT]    = ["Owner can't quit"];

var E_SYS = E.EXTERNAL_SYS;
errCodeMap[E_SYS.WEIXIN_API_ERROR] = ['weixin api call error'];
errCodeMap[E_SYS.WEIXIN_NET_ERROR]    = ["weixin server network error"];