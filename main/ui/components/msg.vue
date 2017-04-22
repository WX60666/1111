<template>
    <pop isModel="{{isModel}}">
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
    </pop>
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
    import Popup from './popup.vue';
    import _ from "../../utils/objects";
    import rsc from '../../i18n/resource';
    import css from "../../public/platform/style.scss";

    export default {
        data() {
            return {
                title: rsc.localStr('温馨提示'),
                msg: rsc.localStr('空消息')
            }
        },

        methods: {
            getLevel(level) {
                switch (level) {
                    case 'error': return 'errorTxt';
                    case 'warn': return 'warnTxt';
                    case 'alert': return 'alertTxt';
                }

                return 'normalTxt';
            }
        },


        components:{
            'pop': Popup
        }
    }
</script>