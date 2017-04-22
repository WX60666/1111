<template>
    <div class="badge">{{noticeCount}}</div>
</template>
<script>
    export default{
        props: ['noticeCount']
    }
</script>
<style scoped> 
    .badge{
        cursor: pointer;
        background-color: #ED6D01;
        color: #fff;
        width: 30px;
        font-size: 13px;
        height: 20px;
        display: inline-block;
        text-align: center;
        line-height: 20px;
        margin-left: -5px;
        border-radius: 15px;
    }
</style>