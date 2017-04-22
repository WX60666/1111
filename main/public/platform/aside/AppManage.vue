<template>
    <div id="app-manage">
        <pageHeader :icon="btnTitle.icon" :sub_title="btnTitle.sub_title" :main_title = "btnTitle.main_title" :title_new = "btnTitle.create_btn " :title_delete="btnTitle.delete_btn" :title_connect="btnTitle.connect_btn" :product_count="btnTitle.product_count"
                    v-on:childCreate="createNewApp" v-on:childDelete="deleteItemsApp" v-on:childConnect="connectProduct"></pageHeader>
        <div id="content">
            <noneData v-if="app.noneProduct"></noneData>
            <div class="product-list" v-if="app.haveProduct">
                <ul>
                    <li>

                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    import pageHeader from '../../../ui/components/PageHeader.vue';
    import noneData from '../../../ui/components/NoneData.vue';
    import resource from '../../../base/i18n/resource';

    export default{
        name: 'app-manage',
        data() {
            return {
                btnTitle: {
                    main_title: "APP管理",
                    sub_title: "APP Management",
                    create_btn: "创建一个APP",
                    delete_btn: "删除",
                    connect_btn: "关联产品",
                    product_count: 10,
                    icon: "ionic"
                },
                app: {
                    noneProduct: false,
                    haveProduct: true,
                    apps: [],
                },
            }
        },
        methods: {
            toLocol (str) {
              return resource.localStr(str);
            },
            createNewApp () {
                alert("createNewApp");
            },
            deleteItemsApp () {
                alert("deleteItemsApp");
            },
            connectProduct () {
              alert("connectProduct");
            },
        },
        mounted () {
            this.$router.push({path:"/AppManage"});
            let This = this;
            console.log('this is msg from appmanage',this.$router );
            window.onunload = function() {
                This.$router.push({path:"/AppManage"});
//                this.$router.push({path:"/ProductManage"});
            };
          //加载数据.
        },
        components:{
            pageHeader,
            noneData
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
    @import "../../../styles/base/reset";
    @import "../../../styles/baseStyle";
    $marginLeft: 40px;
    #content {
        width: 100%;
        height: auto;
    }
    .product-list {
        margin-left: $marginLeft;
        li{
            width: 480px;
            height: 190px;
            border: 1px solid #E6E6E6;
        }
    }

</style>