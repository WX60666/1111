/**
 * Created by rico on 16/5/16.
 */


function SDKDemo() {

    var env = {
        sdkLoaded: false,
        uiLoaded: false
    };

    function sdkLoaded() { // bind to js-load call back.
        /*
         Load and init SDK
         */
        //require sdk = window.we-smart.sdk;
        //require tools = window.we-smart.tools;
        env.sdk = window.wesmart.sdk;
        env.businessSdk = sdk.loadSDK("com.we-smart.sdk.business");
        env.tools = window.wesmart.tools;

        env.clientInfo = new sdk.ClientKit();
        env.user = new sdk.UserKit();
        env.user.bindClientInfo(env.clientInfo);

        env.role = new businessSdk.RoleKit.ScreenKit();
        env.role.bindUser(env.user);

        env.activity = new businessSdk.ActivityKit();
        env.activity.bindRole(env.role);

        env.activity.loadItem("itemID");

        env.appId = "12345678-0000-0000-0000-0000-123456789012";
        env.configManager = new businessSdk.getAppConfigManager(appId);
        env.configManager.bindUser(user);

        env.sdkLoaded = true;

        checkBind();
    }

    function uiLoaded() { // bind to ready event
        env.uiLoaded = true;

        checkBind();
    }

    function Binder(bindCall) {
        var vtag = 'a sample binder';

        var binded = false;
        var bind = bindCall ? bindCall : function (env) {
            return false;
        };

        var check = function () {
            if (!binded) {
                binded = bind(env);
            }
        }
    }

    function checkBind() {

        if (env.sdkLoaded) {
            //
        }

        if (env.uiLoaded) {
            //
        }

        if (env.uiLoaded && env.sdkLoaded) {
            if (!env.bindCheck.uiSdk)
                env.bindCheck.uiSdk = new Binder(function () {
                    bindSDKEvents();
                    bindUIEvents();
                });

            env.bindCheck.uiSdk.check();
        }
    }

    /*
     Bind SDK events to UI.
     */
    function bindSDKEvents() {
        env.listeners.role = new role.Listener();
        env.listeners.role.userChanged = function (userInfo) {
            dom.getObject("$header.userInfo.roleName").setText(role.config.role);
        };
        env.listeners.role.commentChanged = function (commentInfo) {
        };
        env.listeners.role.stateChanged = function () {
        };
        env.role.listeners.addListener(env.listeners.role);

        env.listeners.activity = new activty.Listener();
        env.listeners.activity.stateChanged = function () {
            //
        };

        env.listeners.activity.eventInvoked = function () {
            //
        };

        env.listeners.activity.userChanged = function (user) {
            //
        }
    }
    env.activity.listeners.addListener(env.listeners.activity);

    /*
     Bind UI events to SDK
     */
    function bindUIEvents() {

        var globalUIBinder = new Binder();
        globalUIBinder.check = function () {
            dom.getObject("$header.complete").onClick(function (event) {
                env.role.join();
            });

            dom.getObject("$header.quit").onClick(function (event) {
                env.user.quit();
            });
        };

        env.binders.uiSdk.pushHeader(globalUIBinder);

        /*
         Process binder registered.
         */
        for (var binder in env.binders.uiSdk) {
            if (binder instanceof Binder)
                binder.check();
            else if (binder instanceof Function)
                binder();
            else
                Log.e("Binder", "Found a invalid binder: " + binder.vtag);
        }
    }

}
