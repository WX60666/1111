<template>
    <div id="tips">
        {{tipsMsg}}
    </div>
</template>
<script>
    export default{
        props: ['tipsMsg']
    }
</script>
<style scoped>
    #tips{
        position: absolute;
        color: red;
        top: 15px;
        /*right: -165px;*/
    }
</style>