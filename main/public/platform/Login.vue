<template>
    <div id="login">
        <!--<button @click="login">登录</button>-->
        <div  id="reg-container">
            <img src="../../assets/img/login/login-banner.png" alt=""><img class="login-logo" src="../../assets/img/login/login-logo.png"/>
            <div class="title">{{tips.title}}</div>
            <h4 class="intro">{{tips.intro}}</h4>
            <div class="btns">
                <a  :class="{ 'select-pad': isRegisterPad}"  @click="doRgeister()">注 册</a>
                <span>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                <a :class="{ 'select-pad': isLoginPad}"  @click="doLogin()">登 陆</a>
            </div>

            <div v-if="isRegisterPad == true">
                <ul>
                    <li>
                        <input type="text" v-model="formData.userName" placeholder="请输入公司名或昵称">
                        <tips class="validate-tips" :tipsMsg="formValidate.nullName"></tips>
                    </li>
                    <li>
                        <input type="text" v-model="formData.userId" placeholder="请输入手机号或邮箱">
                        <tips class="validate-tips"  :tipsMsg="formValidate.errorNumber"></tips>
                    </li>
                    <li>
                        <input type="password" v-model="formData.passWord" placeholder="设置登录密码,至少六位">
                        <tips class="validate-tips"  :tipsMsg="formValidate.nullPwd"></tips>
                    </li>
                    <li>
                        <input type="password" v-model="formData.confirmPwd" placeholder="确认登录密码">
                        <tips class="validate-tips"  :tipsMsg="formValidate.conPwd"></tips>
                    </li>

                    <li>
                        <input type="text" v-model="formData.oauthCode" placeholder="请输入右侧验证码">
                        <img class="base64" @click="changeOauthCode" alt="点击获取验证码"/>
                        <tips class="validate-tips"  :tipsMsg="formValidate.illOauthCode"></tips>
                    </li>
                </ul>
                <div><button @click="register()" class="register-btn">注&nbsp;&nbsp;&nbsp;&nbsp;册</button></div>
                <div class="tips"><a  @click="checkProrocol">{{tips.confirmPro}}</a></div>
            </div>

            <div v-if="isLoginPad== true">
                <ul>
                    <li>
                        <input type="text" v-model="loginFormData.loginName" placeholder="请输入手机号或邮箱">
                        <tips class="validate-tips" :tipsMsg="loginFormValidate.nullLoginName"></tips>
                    </li>
                    <li>
                        <input type="password" v-model="loginFormData.loginPwd" placeholder="请输入密码">
                        <tips class="validate-tips" :tipsMsg="loginFormValidate.errLoginPwd"></tips>
                    </li>
                </ul>
                <div><button @click="loginPadLogin" class="register-btn">登&nbsp;&nbsp;&nbsp;&nbsp;录</button></div>
            </div>

        </div>

        <Modal title="输入验证码之后即可注册成功" class="modal8" v-model="modals.modal8"  :mask-closable="false">
            <div class="model-input">
                <input type="text" v-model="formData.userId">
                <input type="text" v-model="formData.vialdate" placeholder="收到的验证码">
                <input class="count-down"  @click="sendVfCode" type="button" value="重新发送验证码">
                <tips class="ill-vialdate" :tipsMsg="formValidate.illVialdate"></tips>
            </div>

            <div slot="footer">
                <Button type="warning" size="large"  class="Button" :loading="modals.modal_loading"  @click="doneVialDoLogin">提&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;交</Button>
            </div>
        </Modal>
        <Modal v-model="modals.modal2" title="偶忆账户激活" class="modal2" @on-ok="mailRegModal" @on-cancel="mailRegModal">
            <p>尊敬的用户：</p>
            <p>您好！欢迎您注册成为偶忆用户</p>
            <p>{{tips.mailTips}}</p>
        </Modal>

        <Modal v-model="modals.modal1" class="reg" title="偶忆智能云平台用户注册协议"  :scrollable="true">
            <h3>一、总则</h3>
            <p>1.1 保宝网的所有权和运营权归深圳市永兴元科技有限公司所有。</p>
            <p>1.2 用户在注册之前，应当仔细阅读本协议，并同意遵守本协议后方可成为注册用户。一旦注册成功，则用户与保宝网之间自动形成协议关系，用户应当受本协议的约束。用户在使用特殊的服务或产品时，应当同意接受相关协议后方能使用。 </p>
            <p> 1.3 本协议则可由保宝网随时更新，用户应当及时关注并同意本站不承担通知义务。本站的通知、公告、声明或其它类似内容是本协议的一部分。</p>

           <h3>二、服务内容</h3>
            <p>1.1 保宝网的所有权和运营权归深圳市永兴元科技有限公司所有。</p>
            <p>1.2 用户在注册之前，应当仔细阅读本协议，并同意遵守本协议后方可成为注册用户。一旦注册成功，则用户与保宝网之间自动形成协议关系，用户应当受本协议的约束。用户在使用特殊的服务或产品时，应当同意接受相关协议后方能使用。 </p>
            <p> 1.3 本协议则可由保宝网随时更新，用户应当及时关注并同意本站不承担通知义务。本站的通知、公告、声明或其它类似内容是本协议的一部分。</p>
            <h3>三、用户帐号</h3>
            <p>1.1 保宝网的所有权和运营权归深圳市永兴元科技有限公司所有。</p>
            <p>1.2 用户在注册之前，应当仔细阅读本协议，并同意遵守本协议后方可成为注册用户。一旦注册成功，则用户与保宝网之间自动形成协议关系，用户应当受本协议的约束。用户在使用特殊的服务或产品时，应当同意接受相关协议后方能使用。 </p>
            <p> 1.3 本协议则可由保宝网随时更新，用户应当及时关注并同意本站不承担通知义务。本站的通知、公告、声明或其它类似内容是本协议的一部分。</p>
        </Modal>

        <!--<BaseFooter></BaseFooter>-->

    </div>

</template>

<script>
    import BaseFooter from  '../../ui/components/BaseFooter.vue';
    import CountDown from  '../../base/platform/countDown';
    import tips from  '../../ui/components/tips.vue';
    import { FastUser } from '../../base/modules/user/user';
    import { LocalStorage } from '../../base/storage/storage';
    import { clients } from '../../base/config/client';


    export default {
        name: 'entry',
        data() {
              return{
                  tips: {
                      title: "偶忆智能云平台",
                      intro: "更加领先的体验一站式智能化平台，走在未来的前面",
                      confirmPro: "点击注册按钮即表示同意《偶忆注册协议》",
                      mailTips: "我们已经将确认链接发送至您的注册邮箱，请您前往邮箱激活您的账号，链接两个小时之内有效，请妥善保存您的账号和密码。"
                  },
                  isRegisterPad: true,
                  isLoginPad: false,
                  isPhoneId : false,
                  single: true,
                  modals: {
                      modal8: false,
                      modal1: false,
                      modal2: false,
                      modal_loading: false,
                  },
                  formData: {
                      userName: "",
                      userId: '',
                      passWord: "",
                      confirmPwd: "",
                      vialdate: "",
                      oauthCode: ""
                  },
                  formValidate: {
                      nullName: "",
                      errorNumber: "",
                      nullPwd: "",
                      conPwd: "",
                      illVialdate: "",
                      illOauthCode: "",

                  },
                  loginFormData: {
                      loginName: "",
                      loginPwd: "",
                  },
                  loginFormValidate: {
                      nullLoginName: "",
                      errLoginPwd: "",
                  },
                  reg_phone: /^1\d{10}$/,
                  reg_email: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                  currentUser: {}
              }
        },
        methods:{
            doLogin() {
                this.isRegisterPad = false;
                this.isLoginPad = true;
            },
            doRgeister() {
                this.getOauthCode();
                this.isRegisterPad = true;
                this.isLoginPad = false;
            },
            login() {
                this.$router.push({path: "/ProductManage"});
            },
            regFormValidation() {
                //表单验证
                if(this.formData.userName === ""){
                    this.formValidate.nullName = '提示 : 公司名或昵称不能为空';
                    return false;
                }else {
                    this.formValidate.nullName = '';
                }

                if(this.formData.userId ===""){
                    this.formValidate.errorNumber = '提示 : 手机号或邮箱不能为空';
                    return false;
                }else {
                    let res = this.reg_phone.test(this.formData.userId) || this.reg_email.test(this.formData.userId);
                    if(!res){
                        this.formValidate.errorNumber = '提示 : 手机号或邮箱格式错误';
                        return false;
                    }else {
                        this.formValidate.errorNumber = '';
                    }
                }
                if(this.formData.passWord === ""){
                    this.formValidate.nullPwd = '提示 : 平台登录密码不能为空';
                    return false;
                }else if(this.formData.passWord.length < 6){
                    this.formValidate.nullPwd = '提示 : 平台密码长度至少六位';
                    return false;
                }else{
                    this.formValidate.nullPwd = '';
                }
                if(this.formData.confirmPwd !== this.formData.passWord){
                    this.formValidate.conPwd = '提示 : 两次输入的密码不一致';
                    return false;
                }else {
                    this.formValidate.conPwd = '';
                }
                if(this.formData.oauthCode === '') {
                    this.formValidate.illOauthCode = '提示 : 验证码输入不能为空';
                    return false;
                }else {
                    this.formValidate.illOauthCode = '';
                }

                return true;
            },

            //点击注册按钮
            register() {
                if (this.regFormValidation()) {
                    $('.register-btn').attr('disabled',true);
                    //2. 发送注册请求:判断是邮箱还是手机号
                    let userId = this.formData.userId;
                    if(this.reg_phone.test(this.formData.userId)) {
                        this.isPhoneId = true;
                        userId = "+86-"+ this.formData.userId;
                    }
                    this.currentUser.getUser().notLoginApi.requestRegister(userId, this.formData.passWord, this.formData.oauthCode).then((data)=> {
                        console.log('data is ', data);
                        if(data.rspCode === 0){
                            if(this.isPhoneId){
                                //1.调用sendVfcode接口 2.发送注册信息.
                                this.sendVfCode();
                                this.modals.modal8 = true;
                            } else {
                                //邮箱注册用户
                                this.modals.modal2 = true;
                            }
                        }
                        $('.register-btn').removeAttr('disabled');

                    },(err) =>{
                        console.log(err);
                        if(err.rspCode === 21001){
                            this.$Message.error('验证码输入错误,请重新输入');
                            this.getOauthCode();
                        }else if (err.rspCode === 90002){
                            this.$Message.error(err.reason);
                        }
                        $('.register-btn').removeAttr('disabled');
                    });
                }
            },

            //注册提交手机收到的验证码.
            doneVialDoLogin () {
                if(this.formData.vialdate === ""){
                    this.formValidate.illVialdate = "验证码为空";
                    return false;
                }

                this.modals.modal_loading = true;
                //发送验证(发送注册信息)loginID,这里只是手机号了, validationCode：发送回来的手机验证码。
                this.currentUser.getUser().notLoginApi.register(this.formData.userId, this.formData.vialdate).then((data) => {
                    console.log("data is ---------" ,data);
                    setTimeout(() => {
                        this.modals.modal_loading = false;
                        this.modals.modal8 = false;
                        this.$Message.success('注册成功');
                        this.$router.push({path: "/ProductManage"});
                    }, 2000);

                }, (err) => {
                    console.log(err);
                    this.$Message.error('网络错误， 请刷新重试');
                });
            },
            //查看协议
            checkProrocol () {
                this.modals.modal1 = true;
            },
            loginPadLogin (){
                //表单判断:
                //用户名
                if(this.loginFormData.loginName === ""){
                    this.loginFormValidate.nullLoginName = '提示 : 手机号或邮箱不能为空';
                    return false;
                }else {
                    let res = this.reg_phone.test(this.loginFormData.loginName) || this.reg_email.test(this.loginFormData.loginName);
                    if(!res){
                        this.loginFormValidate.nullLoginName = '提示 : 手机号或邮箱格式错误';
                        return false;
                    }else {
                        this.loginFormValidate.nullLoginName = '';
                    }
                }
                //密码
                if(this.loginFormData.loginPwd === ""){
                    this.loginFormValidate.errLoginPwd = '提示 : 平台登录密码不能为空';
                    return false;
                }else {
                    this.loginFormValidate.errLoginPwd = '';
                }
                //密码验证
                $('.register-btn').css({
                    disabled: "disabled",
                    cursor: "wait"
                });
                this.$router.push({path: "/ProductManage"});

            },

            sendVfCode() {
                let c : CountDown = new CountDown();
                c.init('count-down');
            },
            //点击切换验证码
            changeOauthCode() {
                this.getOauthCode();
            },
            //获取图片验证码
            getOauthCode() {
                console.log("Load robot auth.");
                this.currentUser.getClient().getRobotAuth().then((robotAuth) => {
                    $('.base64').attr("src", ("data: image/jpg;base64," + robotAuth));
                }).catch(err => {
                    //TODO
                    this.$Message.error('验证码获取失败,请刷新页面');
                });

            },
            //邮箱注册提示消息弹框点击
            mailRegModal() {
                //清空表单
                this.clearFormData(this.formData);
                //切换面板
                this.isLoginPad = true;
                this.isRegisterPad = false;
            },
            clearFormData(formData) {
                for(let d in formData) {
                    formData[d] = "";
                }
            },
        },

        components: {
            BaseFooter,
            tips,
        },
        mounted(){
            console.log("start to login.");
            const lastLoginInfo = {
                loginID: null,
                password: null,
                checkCode: null,
                lastUpdate: 0
            };

            let storage = new LocalStorage('com.oe');
            this.currentUser = new FastUser({
                clientID: clients.defaultClient.clientID
            }, storage, async function(oldInfo) {

                if (lastLoginInfo.lastUpdate + 10 * 1000 > new Date().getTime())
                    return lastLoginInfo;

                lastLoginInfo.loginID = this.formData.userId;
                lastLoginInfo.password = this.formData.passWord;
                lastLoginInfo.checkCode = this.formData.oauthCode;
                lastLoginInfo.lastUpdate = new Date().getTime();

            });

            this.getOauthCode();
            console.log(lastLoginInfo);
        }
    }
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    @import "../../styles/base/reset";
    @import "../../styles/baseStyle";

    @include PlaceHolder(#C9C9C9);
    $inputHeight: 50px;

    @mixin inputStyle(){
        height: $inputHeight;
        width: 322px;
        background-color: #FFF;
        font-size: 14px;
        text-indent: 10px;
    }
    body{
        background-color: #F8F8F8 !important;
    }
    #login{
        width: 100%;
        height: 100%;
        padding-top: 6%;
        background-color: #F8F8F8;
        #reg-container{
            height: 900px;
            position: relative;
            margin: 0 auto;
            width: 330px;
            text-align: center;
        }
    }

    .login-logo{
        position: absolute;
    }
    .title{
        margin-top: 20px;
        font-size: 22px;
        color: #393939;
    }
    .intro{
        color: #888;
        margin-top: 10px;
        font-size: 14px;
    }
    .btns{
        margin: 20px 0 20px 0;
        a{
            font-size: 16px;
            margin-left: 15px;
            margin-right: 15px;
            &:hover{
                color: $btnBgColor;
            }
        }
    }
    .select-pad{
        color: $btnBgColor;
    }

    ul {
        border: 1px solid #DADADA;
        border-radius: 8px;
        background-color: #FFF;
        li{
            border-bottom: 1px solid #ECECEC;
            position: relative;
        }
        input{
            @include inputStyle;
        }
        .validate-tips {
            position: absolute;
            right: -165px;
        }
        .base64{
            position: absolute;
            right: 0;
            width: 100px;
            height: 50px;
            cursor: pointer;

        }

    }

    .register-btn{
        margin: 15px 0 15px 0;
        width: 330px;
        height: 40px;
        background-color: $btnBgColor;
        border-radius: 5px;
        cursor: pointer;
        color: #FFF;
        font-size: 16px;
        &:hover{
            background-color: $btnHoverColor;
            opacity: .8;
        }
    }
    .tips{
        color: #95989a;
        font-size: 13px;
        padding: 5px;
        a{
            text-decoration: underline;
        }
    }
    .reg{
        text-align: left;
        p{
            line-height: 25px;
        }
        h3{
            margin-top: 15px;
            font-weight: bold;
        }
    }

    .modal8{
        text-align: center;
        .model-input{
            position: relative;
            input{
                @include inputStyle;
                border: 1px solid #ECECEC;
            }
            .count-down{
                cursor: pointer;
                position: absolute;
                height: $inputHeight;
                text-align: center;
                width: 125px !important;
                color: #666 !important;
                right: 84px;
                background-color: #E6E6E6 !important;
            }
        }
        .ill-vialdate{
            position: absolute;
            top: 65px !important;
        }
        .Button{
            text-align: center;
            margin-right: 80px;
            width: 322px;
            background-color: $btnBgColor;
            &:hover{
                opacity: .9;
            }

        }
    }

    .modal2{
        p{
            text-align: left;
            margin: 8px;
            font-size: 13px;
        }
    }









</style>