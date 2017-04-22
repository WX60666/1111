<template>
    <form>
        <label for="{{_id}}_loginID"> 用户名 </label> <input id="{{_id}}_loginID" v-modle="{{loginID}}" placeholder="请输入邮箱或手机号">
        <label for="{{_id}}_psw"> 密码 </label> <input id="{{_id}}_psw" v-modle="{{loginID}}" placeholder="请输入登录密码">
        <template v-if="{{reqCheckCide && checkCodeImg}}">
            <label for="{{_id}}_checkCode"> 验证码 </label> <input id="{{_id}}_checkCode" v-modle="{{loginID}}" placeholder="请输入右侧验证码"> <img src="{{checkCodeImg}}">
        </template>
        <button @submit.prevent="{{login}}"></button>
    </form>
</template>

<style lang="scss" rel="stylesheet/scss" scoped>
    form label { width: 4em; }
    form label:after { content: ':'; }
    form input { width: 10em; }
</style>

<script>
    'use strict';

    export default {
        data(){
            return {
                _id: Math.random() * 1000 % 1000,
                loginID: null,
                password: null,
                checkCode: null,
                checkCodeImg: null,
                reqCheckCode: false
            }
        },

        methods: {
            login: function () { return ; },

            waitLogin: async function (opt) {
                this.loginID = opt.loginID;
                this.password = opt.password;
                this.checkCodeImg = opt.checkCode;
            }
        }
    }

</script>