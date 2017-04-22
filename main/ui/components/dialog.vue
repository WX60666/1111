<template>
    <msg isModel="{{isModel}}">
        <div class="dialogRoot" v-slot="content">
            <slot name="header">
                <div class="header">
                    <p class="title">{{title}}</p>
                    <span class="closeRT">X</span>
                </div>
            </slot>

            <!--<div class="content">-->
            <slot name="content">
                <span style="width: 100%; text-align: center;">{{content}}</span>
            </slot>
        </div>
    </msg>
</template>

<style lang="scss" rel="stylesheet/scss" scoped>

    /*getID(): {*/
    div.dialogRoot {
        width: 100%;

    }

    p.header {
        color: $primaryText;
        background: $primaryTextBg;
        font:  1.2em/1.4;
    }

    span.closeRT {
        color: $alertColor;
    }
    /*}*/

</style>

<script>
    import DV from '../../utils/dataValidator';
    import rsc from '../../i18n/resource';

    import Msg from './popup.vue';
//    import css from "../../public/platform/style.scss";

    export default {
        data() {
            return {
                content: rsc.localStr(':)'),
                title: rsc.localStr('提示'),
                closeRightTop: true,
                rootID: Math.floor(Math.random() * 10000).toString() + '_dialog',
                buttOpts: opt.buttOpts,  // { msg: 'Cancel', level: 'error/warn/alert/normal(default)', onclick }
                usingTemplate: false
            }
        },

        props: {
            isModel: { default: true }
        },

        computed: {
        },

        components: {
            pop: Popup
        },

        ready: {
            //
        }
    };

</script>