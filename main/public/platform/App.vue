<template>
    <div id="app">
        <router-view
                class="view" keep-alive transition transition-mode="out-in">
        </router-view>
    </div>
</template>

<script>
    import { FastUser } from '../../base/modules/user/user';
    import { LocalStorage } from '../../base/storage/storage';
    import { clients } from '../../base/config/client';

    import UserAdmin from '../../base/userAdmin';
    let storage = new LocalStorage('com.oe');


    export default {
        name:"app",
        data() {
            return {
                isLogin: true,
            }
        },
        components: {
        },
        mounted() {
            /*
            //判断登录状态
            const lastLoginInfo = {
                loginID: null,
                password: null,
                checkCode: null,
                lastUpdate: 0
            };

            let currentUser = new FastUser({
                clientID: clients.defaultClient.clientID
            }, storage, async function(oldInfo) {
                return oldInfo;
            });

            currentUser.getUser().checkReady().then((data) => {
                if (lastLoginInfo.lastUpdate != 0)
                    console.log('用户已登陆，直接进入平台');
                    this.$router.push({path:"/ProductManage"});
            })
                .catch((err) => {
                    this.$router.push({path:"/Login"});
                    console.log('用户未登录,跳转到登录页面.');
                });
             */
            if(this.isLogin){
                this.$router.push({path:"/ProductManage"});
            }else {
                this.$router.push({path:"/Login"});
            }

        }
    }
</script>

<style lang="scss">

    #app{

    }
</style>