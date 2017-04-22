<template>
    <div v-show="{{show}}">
        <span class="closeRT"> X </span>
        <slot name="content">
            <span style="width: 10em; text-align: center;">{{content}}</span>
        </slot>
    </div>
</template>

<style lang="scss" rel="stylesheet/scss" scoped>

    div>span.closeRT {
        border-radius: 0.5em;
        line-height: 1.0em;
        color: $warnColor;
    }

</style>

<script>

    import _ from '../../utils/objects';

    import css from "../../../styles/style/color";

    export default {
        data(){
            return {
                content:':)',
                show: false,
                defaultTimeout: 3000
            }
        },

        show: function(msg, timeOut) {
            this.date().content = msg;
            this.date().show = true;
            setTimeout(this.hide, _.getRegular(timeOut, this.date().defaultTimeout))
        },

        hide: function () {
            this.data().show = false;
        },

        attach: function (to) {
            this.$mount(to || '#body');
        },

        detach: function () { this.$destroy(); },

        ready: function () {
            this.attach(this.$el);
        }
    }

</script>