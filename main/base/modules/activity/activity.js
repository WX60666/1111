/**
 * Created by rico on 16/5/12.
 */

import Log from '../../utils/log';
import ListenerList from '../../utils/listenerList';

import req from '../../utils/http';

import uuid from '../../nodeport/node-uuid';

import apiConf from '../../config/api';

import Interval from '../../utils/interval';
import _ from "../utils/objects";

/**
 * RoleKit is used for more process for UserKit.
 * @constructor
 * @param: roleConfig_: roleConfig runtime.
 * @param: userKit: userKit used for new instance.
 */

function RoleKit() {
    //大屏幕业务内容
    const BaseRoleKit = function (roleConfig_, userKit) {
        var State = {
            Loaded: 1,
            UserReady: 2,
            Connected: 3,
            Authenticated: 4,
            Joined: 5,
            Ready: 6,

            MAX_STATE: 7
        };

        var context = {
            activityID: undefined,
            status: State.Ready,
            socket: undefined,

            comment: {
                config: {
                    scale: 1,
                    maxInScreen: 10,
                    count: 0
                },
                comments: {}
            },

            user: {
                config: {
                    count: 0
                },

                users: {}
            },

            games: [
                //
            ]
        };

        // @NO_GUARD
        this.Listener = {
            userChanged: function (userInfo) {
            },
            commentChanged: function (commentInfo) {
            },
            stateChanged: function () {
            }
        };

        var listeners = new ListenerList();
        listeners.bindListenerTemplate([
            {tag:"", func: "configChanged"},
            {tag:"", func: "stateChanged"}
        ]);

        this.bindUserKit = function (userKit) {
            setState(RoleKit.State.Inited);
            this.checkReady();
        };

        function checkReady() {
            switch (context.status) {
                case State.Ready:
                    return true;

                case State.Connected:
                    // auth
                    context
                    break;

                case State.Joined:
                    // will ready.
                    break;
            }

            return State.Ready == context.status;
        }

        // x.1 bind user & comment events.
        function bindUserAndCommet() {

            // x.1 事件监听:
            socket.on("activity.join", function (data) {
                /*
                 data = {
                 "openid":"oai0Ft62SS16uMeCwB3ttryhs7qM",
                 "nickname":"pisces",
                 "sex":1,
                 "language":"zh_CN",
                 "city":"Shenzhen",
                 "province":"Guangdong",
                 "country":"CN",
                 "headimgurl":"http://wx.qlogo.cn/mmopen/ujEN3G2N0darFPMO0HHwMw76HwaRwz0poquDId8tKUmHZbT1oIfIUtfic1fdMKShgcmUTNKiaMTz5Y8qlJ9OAEY8icZAiaw0LjEe/0",
                 "privilege":[],
                 "unionid":"oGyvljrrng0yjGleHz7q6Geq1TV8"
                 }
                 */
                context.users[data.openid] = data;

                context.users.listener.userChanged(data);
            });

            socket.on('activity.quit', function (data) {
                context.user.remove(data.openid);

                context.users.listener.userChanged(data);
            });
            socket.on('activity.monitor', function (data) {
                //
            });
            socket.on('activity.comment', function (data) {
                context.comment.comments[data.openid] = data;

                context.users.listener.commentChanged(data);
            });

            socket.emit('activity.getUser', data, func);
            socket.on('activity.getUser', function (data) {
                context.users = {};

                context.users.listener.userChanged(undefined);
            });
            socket.on('activity.getComment', function (data) {
                /*
                 data = [
                 $userInfo
                 ]
                 */
                context.comment.comments = {};

                context.users.listener.commentChanged(undefined);
            });

        }

        function getKV(activityID, key, future) {
            socket.emit('activity.getKV', {activityID: activityID, key: key}, function (data) {
                console.log('Got KV: ', data);
                future.gotKV(key, data.rspCode == 0 ? data.value : undefined);
            });
        }

        function setKV(activityID, key, value, future) {
            socket.emit('activity.setKV', {activityID: activityID, key: key, value: value}, function (data) {
                console.log('Set KV: ', data);
                future.setKV(key, data.rspCode == 0);
            });
        }

    };

    this.Screen = function () {
    };
    this.Screen.prototype = BaseRoleKit;

    this.User = function() {
        //
    };
    this.User.prototype = BaseRoleKit;

    this.Admin = function () {

    };

    this.Admin.prototype = BaseRoleKit;

    this.Controller = function () {

    };

    this.Controller.prototype = BaseRoleKit;

}


function ActivityKit() {
    var State = {
        Loaded: 0,
        Inited: 1,
        NotStart: 2,
        Ready: 3,
        Paused: 4,
        Stopped: 5,
        MAX_STATE: 6
    };

    var Listener = {
        stateChanged: function () {
            //
        },

        eventInvoked: function () {
            //
        },

        userChanged: function (user) {
            //
        }
    };

    var config = {
        itemConfigs: [],
        items: [],

        users: [],

        listeners: new ListenerList(),

        status: State.NotInited,
    }
}

function ItemKit() {
    let config = {
        gift: {
            selected: [], // openids
            reset: [],

            level1: {
                level: 1,
                description: "一等奖",
                number: 1,
                gift: "$600",

                status: 'Ready',
                startUtc: 123
            }
        },

        vote: [
            //
        ]
    };

    const State = {
        Loaded: 0,
        Inited: 1,
        ActivityReady: 2,
        Ready: 3,
        Pause: 4,
        Stopped: 5,
        MAX_STATE: 6
    };

    class Listener {
        constructor(opt) {
            this.stateChanged = opt.stateChanged || (() => {
            });

            this.userChanged = opt.userChanged || (() => {
            });

            this.messageChanged = opt.messageChanged || (() => {
            });

            this.onError = opt.onError || ((error, reason) => {
            });
        }
    }

    class BaseItem {
        constructor () {
            _.extends(this, {
                activity: undefined,
                config:   undefined,

                status: State.UnknownError,

                listeners: {}
            });

            init();
        }

        init (data) {

            socket.on('user.join', function (data) {
                /*
                 data = {
                 level: 1,
                 description: "一等奖",
                 number: 1,
                 gift: "$600",
                 }
                 */
                this.status = State.Loaded;

                activity.context.user.listener.giftChanged(data);
            });

            socket.on('user.quit', function (data) {
                activity.context.users.listener.giftChanged(data);
            });

            socket.on('message.broadcast', function (data) {
                //
            });

        }

        start () {
            //
        }

        close () {
            socket.emit('flow.close', {activityID: context.activityID, data: undefined}, function () {
                //
            });
        }

        repeat () {
            //
        }

        retry () {
            //
        }

        pause () {
            //
        }
    }

    class Gift extends BaseItem {
        constructor (data) {
            super();

            socket.on('gift.start', function (data) {
                /*
                 data = {
                 level: 1,
                 description: "一等奖",
                 number: 1,
                 gift: "$600",
                 }
                 */

                context.user.listener.giftChanged(data);
            });

            socket.on('gift.stop', function (data) {
                context.users.listener.giftChanged(data);
            });

            socket.on('gift.getStatus', function (data) {
                //
            });

        }

        close () {
            //
        }

        repeat () {
            //
        }

        retry () {
            //
        }

        pause () {
            //
        }
    }

    class Vote extends BaseItem {
        constructor () {
            super();

            /*
            socket.on('vote.start', function (data) {
                // show vote info.
            });

            socket.on('vote.stop', function (data) {
                // show vote result.
            });

            socket.on('vote.voted', function (data) {
                // show new user & voted.
            });
            */
        }
    }

    class Login extends BaseItem {
        constructor () {
            super();
            // do nothing...
        }
    }

    class CommentShow extends BaseItem {
        constructor () {
            super();
            // do nothing...
        }
    }

}

export { ActivityKit, ItemKit };