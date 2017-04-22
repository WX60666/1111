<template>
    <footer id="BaseFooter">
        2017 偶忆科技（深圳）有限公司-官网 粤ICP备17031752号 OE - Theme By Puro 官网
    </footer>
</template>
<script>
    export default{
        mounted() {
           window.addEventListener('resize',()=>{
                let clientHe = document.documentElement.clientHeight ;
                let $bf =  $('#BaseFooter');
                if(clientHe > 900){
                    $bf.css({
                        position: "fixed",
                        bottom: "20px",
                    });

                }else {
                    $bf.css({
                        position: "relative",
                });
                }
           })
        }
    }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
    #BaseFooter{
        margin: 0 auto;
        position: fixed;
        bottom: 10px;
        color: #ED6C00;
        left:0;
        right:0;
        font-size: 14px;
    }
</style>