<template>
    <div class="popBackground">
        <slot name="content">
            <span style="width: 100%; text-align: center;">{{content}}</span>
        </slot>
    </div>
</template>

<style lang="scss" rel="stylesheet/scss" scoped>

    div.popBackground {
        background-color: $cModelBg;
    }

</style>

<script>
    import css from "../../public/platform/style.scss";

    export default {
        data() {
            return {
                content: ':)'
            }
        },

        props: {
            isModel: {
                default: true
            }
        }
    }
</script>