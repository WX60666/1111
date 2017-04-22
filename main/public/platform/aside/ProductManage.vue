<template>
    <div id="product-manage">
        <pageHeader :icon="btnTitle.icon" :sub_title="btnTitle.sub_title" :main_title="btnTitle.main_title" :title_new = "btnTitle.create_btn " :title_delete="btnTitle.delete_btn" :title_connect="btnTitle.connect_btn" :product_count="btnTitle.product_count"
        v-on:childCreate="createNew" v-on:childDelete="deleteItems" v-on:childConnect="connectApp">
        </pageHeader>

        <div id="content">
            <noneData  v-if="product.noneProduct"></noneData>
            <div class="product-list" v-if="product.haveProduct">
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



    export default {
        name: "product-manage",
        data () {
            return {
                btnTitle: {
                    main_title: "产品管理",
                    sub_title: "Product Management",
                    create_btn: "新建一个智能产品",
                    delete_btn: "删除",
                    connect_btn: "关联APP",
                    product_count: 10,
                    icon:"android-phone-portrait",
                },
                product: {
                    noneProduct: false,
                    haveProduct: true,
                },
            }
        },
        mounted () {
            console.log(this.$router);

//            console.log('im chanpinguanli ');
        },
        methods: {
            createNew () {
                alert("createNew");
            },
            deleteItems () {
                alert("deleteItems");
            },
            connectApp() {
                alert("connectApp");
            }
        },
        components : {
            pageHeader,
            noneData
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
    /*@import "../../../styles/base/reset";*/
    @import "../../../styles/baseStyle";
    #content {
        width: 100%;
        height: auto;
    }
    .none {
        margin: 200px auto 0 auto;
    }
    .product-list {
        li{
            width: 480px;
            height: 190px;
            border: 1px solid #E6E6E6;
        }
    }
</style>