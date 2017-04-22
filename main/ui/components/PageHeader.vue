<template>
    <div id="page-header">
        <hgroup>
            <h1>{{toLocol(main_title)}}</h1>
            <h3>{{toLocol(sub_title)}}</h3>
        </hgroup>
        <div class="control">
            <Button class="long"  @click="childCreate" type="warning">{{toLocol(title_new)}}</Button>
            <Button class="short" @click="childDelete" icon="trash-a" type="ghost">{{toLocol(title_delete)}}</Button>
            <Button class="short" @click="childConnect" :icon="icon" type="ghost">{{toLocol(title_connect)}}</Button>
        </div>
        <div class="count">全部产品 &nbsp;({{product_count}})</div>
    </div>
</template>

<script>
    import resource from '../../../main/base/i18n/resource';
    export default {
        props: {
            main_title: String,
            sub_title: String,
            title_new : String,
            title_delete : String,
            title_connect : String,
            product_count: Number,
            icon: String,
        },
        data() {
            return {

            }
        },
        methods: {
            childCreate() {
                this.$emit('childCreate');
            },
            childDelete() {
                this.$emit('childDelete');
            },
            childConnect() {
                this.$emit('childConnect');
            },
            toLocol (str) {
                return resource.localStr(str);
            }

        },
        mounted () {

        }

    }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
    @import "../../styles/baseStyle";

    $shortBtnColor: #F6B681;
    $marginLeft: 40px;

    #page-header{
        width: 100%;
        height: 160px;
        border-bottom: 1px solid #f8f8f8;
    }
    hgroup {
        h1{
            color: #0D0D0D;
            font-size: 20px;
        }
        h3{
            color: #808080;
            font-size: 12px;
        }
        text-align: left;
        margin:30px 0 0 $marginLeft;
    }
    .control {
        margin: 30px 0 20px $marginLeft;
        text-align: left;
        button {
            margin-right: 20px;
            height: 35px;
            font-size: 14px;
            &:hover {
                opacity: .8;
            }
        }
        .long{
            background-color: $btnBgColor;
            width: 160px;
            color: #fff;
        }
        .short{
            border: 1px solid $shortBtnColor;
            width: 100px;
            color: $shortBtnColor;
        }

    }
    .count{
        text-align: left;
        margin: 0 0 0 $marginLeft;
    }
</style>