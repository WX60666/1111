<template>
    <div id="base">
        <header id="header">
            <div class="left-img">
                <img class="banner" src="../../assets/img/Base/oe.png" alt="偶忆科技">
                <img class="leftside" src="../../assets/img/Base/pack.png" alt="收起">
            </div>
            <div class="right-img">
                <img src="../../assets/img/Base/use-ricon.png" alt="用户头像">
                <img src="../../assets/img/Base/notice.png" alt="通知">
                <div class="badge">
                    <badge :notice-count="notice"></badge>
                </div>
                <img class="full-screen" @click="setFullScreen()" src="../../assets/img/Base/max.png" alt="全屏显示">
            </div>
        </header>
        <div class="content">
            <aside id="aside">
                <div class="group">
                    <p class="title">研发</p>
                    <router-link to="ProductManage"><img src="../../assets/img/Base/product-manager.png" alt="产品管理"><span class="item">产品管理</span></router-link>
                    <router-link to="AppManage"><img src="../../assets/img/Base/app-manager.png" alt="APP管理"><span class="item">APP管理</span></router-link>
                </div>
                <div class="group">
                    <p class="title">生产</p>
                    <router-link to="ProduceCenter"><img src="../../assets/img/Base/product.png" alt="生产中心"><span class="item">生产中心</span></router-link>
                </div>
                <div class="group">
                    <p class="title">市场</p>
                    <router-link to="Mall"><img src="../../assets/img/Base/mall.png" alt="商城管理"><span class="item">商城管理</span></router-link>
                    <router-link to="DataCenter"><img src="../../assets/img/Base/data.png" alt="数据中心"><span class="item">数据中心</span></router-link>
                </div>

                <div class="group">
                    <p class="title">其他</p>
                    <router-link to="Help"><img src="../../assets/img/Base/help.png" alt="帮助文档"><span class="item">帮助文档</span></router-link>
                </div>

            </aside>
            <!--router-view 显示在右边-->
            <div class="router-view">
                <div id="board-container">
                    <router-view></router-view>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import badge from '../../ui/components/Badge.vue';
    import {selectTabUrls, TabUrls, packImgUrl, oeImgUrl, tabArr} from '../../base/platform/imgUrl';
    import classHelper from '../../base/platform/classHelper';
    import tool from '../../base/platform/tool';
    export default{
        data(){
            return{
                notice: 20,
                imgUrl: {
                    selectTabUrls: selectTabUrls,
                    TabUrls: TabUrls,
                    packImgUrl: packImgUrl,
                    oeImgUrl: oeImgUrl,
                    tabArr: tabArr,
                },
                packed: false,
                isFullScreen: false,
            }
        },
        methods: {
            getRouterWidth() {
                let clientWidth = document.body.clientWidth,
                    routerView = document.getElementsByClassName('router-view')[0];
                if(this.packed){
                    routerView.style.left = '70px';
                    routerView.style.width = (clientWidth -70)+'px';

                }else {
                    if(clientWidth <= 1440){
                        routerView.style.left = '160px';
                        routerView.style.width = (clientWidth -160)+'px';
                        $('.banner').css({left: '25px'});
                        $('.leftside').css({left: '160px'});
                    }else {
                        routerView.style.left = '220px';
                        routerView.style.width = (clientWidth -220)+'px';
                        $('.banner').css({left: '70px'});
                        $('.leftside').css({left: '220px'});
                    }
                }
            },
            setFullScreen() {
                if(this.isFullScreen){
                    tool.exitFullScreen();
                }else {
                    let el = document.documentElement;
                    tool.fullScreen(el);
                }
                this.isFullScreen = !this.isFullScreen;

            }
        },
        components:{
            badge
        },
        mounted(){

            this.getRouterWidth();
            window.addEventListener('resize', ()=>{
                this.getRouterWidth();
            });

            let a_tags = document.getElementById('aside').getElementsByTagName('a'),
                PackUp = document.getElementsByClassName('leftside')[0],
                url = this.$route.path,
                str = tool.getLastUrlItem(url),
                index = this.imgUrl.tabArr.indexOf(str);

            console.log("str is ",str);
            this.$router.push({path:"/"+str})

            a_tags[index].childNodes[0].src = this.imgUrl.selectTabUrls[index];

            //console.log(this.imgUrl.tabArr.indexOf(str));

            for(let i = 0;i < a_tags.length; i++){
                a_tags[i].addEventListener('click', ()=> {
                    for(let j=0; j<a_tags.length; j++){
                        a_tags[j].childNodes[0].src = this.imgUrl.TabUrls[j];
                    }
                    a_tags[i].childNodes[0].src = this.imgUrl.selectTabUrls[i];
                });
            }


            PackUp.addEventListener ('click', (event)=>{
                let packer = event.target,
                    routerView = document.getElementsByClassName('router-view')[0],
                    title = document.getElementsByClassName('title'),
                    oeBanner = document.getElementsByClassName('banner')[0],
                    item = document.getElementsByClassName('item'),
                    clientWidth = document.body.clientWidth;
                //先清空所有的动画样式
                classHelper.removeClass(packer, 'packer');
                classHelper.removeClass(packer, 'unPacker');
                classHelper.removeClass(packer, 'packer-middle');
                classHelper.removeClass(packer, 'unPacker-middle');
                classHelper.removeClass(routerView, 'router-animate');
                classHelper.removeClass(routerView, 'unrouter-animate');
                classHelper.removeClass(routerView, 'router-animate-middle');
                classHelper.removeClass(routerView, 'unrouter-animate-middle');

                if(this.packed){
                    //当前是关闭状态，做开启的操作
                    packer.src = this.imgUrl.packImgUrl[1];

                    setTimeout(()=>{
                        oeBanner.src = this.imgUrl.oeImgUrl[1];
                    },200);

                    //判断屏幕宽度：
                    if(clientWidth >= 1440){
                        classHelper.removeClass(packer, 'packer');
                        classHelper.addClass(packer, 'unPacker');
                        packer.style.left = '220px';

                        classHelper.removeClass(oeBanner, 'banner-near');
                        classHelper.addClass(oeBanner, 'banner-far');
                        oeBanner.style.left = '70px';

                        classHelper.removeClass(routerView, 'router-animate');
                        classHelper.addClass(routerView, 'unrouter-animate');
                        routerView.style.left = '220px';

                        let h = routerView.offsetWidth -150;
                        routerView.style.width = h +'px';
                    }else {
                        classHelper.removeClass(packer, 'packer-middle');
                        classHelper.addClass(packer, 'unPacker-middle');
                        packer.style.left = '160px';

                        classHelper.removeClass(routerView, 'router-animate-middle');
                        classHelper.addClass(routerView, 'unrouter-animate-middle');
                        routerView.style.left = '160px';

                        let h = routerView.offsetWidth - 90;
                        routerView.style.width = h +'px';
                    }

                    for(let i=0; i<title.length; i++){
                        classHelper.removeClass(title[i], 'close');
                        classHelper.addClass(title[i], 'open');
                        title[i].style.left = '15px';
                    }
                    for(let i = 0; i<item.length; i++){
                        classHelper.removeClass(item[i], 'hidden');
                        classHelper.addClass(item[i], 'appear');
                        item[i].style.opacity = 1;
                    }

                }else {
                    //当前是开启，做关闭的操作
                    packer.src = this.imgUrl.packImgUrl[0];

                    oeBanner.src = this.imgUrl.oeImgUrl[0];
                    //判断屏幕宽度
                    if(clientWidth > 1440){
                        classHelper.removeClass(packer, 'unPacker');
                        classHelper.addClass(packer, 'packer');
                        packer.style.left = '70px';

                        classHelper.removeClass(oeBanner, 'banner-far');
                        classHelper.addClass(oeBanner, 'banner-near');
                        oeBanner.style.left = '25px';

                        classHelper.removeClass(routerView, 'unrouter-animate');
                        classHelper.addClass(routerView, 'router-animate');
                        routerView.style.left = '70px';

                        setTimeout(() => {
                            let h = routerView.offsetWidth +150;
                            routerView.style.width = h +'px';
                        }, 500);

                    }else {
                        classHelper.removeClass(packer, 'unPacker-middle');
                        classHelper.addClass(packer, 'packer-middle');
                        packer.style.left = '70px';

                        classHelper.removeClass(routerView, 'unrouter-animate-middle');
                        classHelper.addClass(routerView, 'router-animate-middle');
                        routerView.style.left = '70px';

                        setTimeout(()=>{
                            let h = routerView.offsetWidth +90;
                            routerView.style.width = h+'px';
                        },500);

                    }

                    for(let i = 0; i<title.length; i++){
                        classHelper.removeClass(title[i], 'open');
                        classHelper.addClass(title[i], 'close');
                        title[i].style.left = '25px';
                    }
                    for(let i = 0; i<item.length; i++){
                        classHelper.removeClass(item[i], 'appear');
                        classHelper.addClass(item[i], 'hidden');
                        item[i].style.opacity = 0;
                    }
                }
                this.packed = !this.packed;
            })
        }
    }

</script>

<style lang="scss" rel="stylesheet/scss" >
    $maxWidth : 1920px;
    $minWidth : 1280px;
    $baseMairinLeft: 50px;
    $asideWidth: 220px;
    $animateMin : 70px;
    $animateMiddle: 160px;
    $animateMax: 220px;
    $animateDuration: 0.5s;
    $packLeft: 15px;
    $left: 25px;
    $packer: 70px;
    $unPacker: 220px;
    $bannerNear: 25px;
    $bannerFar: 75px;
    @mixin router($animName:string) {
        @if ($animName == "router"){
            @keyframes router {
                from {left: $animateMax;}
                to {left: $animateMin;}
            }
            @-webkit-keyframes router /*Safari and Chrome*/
            {
                from {left: $animateMax;}
                to {left: $animateMin;}
            }
            @-moz-keyframes router {
                from {left: $animateMax;}
                to {left: $animateMin;}
            }
        }
        @else if($animName == "unRouter"){
            @keyframes unRouter {
                from {left: $animateMin;}
                to {left: $animateMax;}
            }
            @-webkit-keyframes unRouter /*Safari and Chrome*/
            {
                from {left: $animateMin;}
                to {left: $animateMax;}
            }
            @-webkit-keyframes unRouter /*Safari and Chrome*/
            {
                from {left: $animateMin;}
                to {left: $animateMax;}
            }
        }
        @else if($animName == "routerMiddle"){
            @keyframes routerMiddle {
                from {left: $animateMiddle;}
                to {left: $animateMin;}
            }
            @-webkit-keyframes routerMiddle /*Safari and Chrome*/
            {
                from {left: $animateMiddle;}
                to {left: $animateMin;}
            }
            @-moz-keyframes routerMiddle {
                from {left: $animateMiddle;}
                to {left: $animateMin;}
            }
        }
        @else if($animName == "unRouterMiddle"){
            @keyframes unRouterMiddle {
                from {left: $animateMin;}
                to {left: $animateMiddle;}
            }
            @-webkit-keyframes unRouterMiddle /*Safari and Chrome*/
            {
                from {left: $animateMin;}
                to {left: $animateMiddle;}
            }
            @-webkit-keyframes unRouterMiddle /*Safari and Chrome*/
            {
                from {left: $animateMin;}
                to {left: $animateMiddle;}
            }
        }
    }

    @mixin titleMove($animName: string) {
        @if $animName == "opener" {
            @keyframes opener {
                from {left: $left}
                to {left: $packLeft;}
            }
            @-webkit-keyframes opener /*Safari and Chrome*/
            {
                from {left: $left}
                to {left: $packLeft;}
            }
            @-moz-keyframes opener {
                from {left: $left}
                to {left: $packLeft;}
            }
        }@else if $animName == "closer"{
            @keyframes closer {
                from {left: $packLeft}
                to {left: $left;}
            }
            @-webkit-keyframes closer /*Safari and Chrome*/
            {
                from {left: $packLeft}
                to {left: $left;}
            }
            @-moz-keyframes closer {
                from {left: $packLeft}
                to {left: $left;}
            }
        }

    }

    @mixin Packer($animName: string) {
        @if($animName == "packer"){
            @keyframes packer {
                /*220-70*/
                from {left: $unPacker}
                to {left:$packer ;}
            }
            @-webkit-keyframes packer /*Safari and Chrome*/
            {
                from {left: $unPacker}
                to {left:$packer ;}
            }
            @-moz-keyframes packer {
                from {left: $unPacker}
                to {left:$packer ;}
            }
        }@else if($animName == "unPacker"){
            @keyframes unPacker {
                /*70-220*/
                from {left: $packer}
                to {left: $unPacker;}
            }
            @-webkit-keyframes unPacker /*Safari and Chrome*/
            {
                from {left: $packer}
                to {left: $unPacker;}
            }
            @-moz-keyframes unPacker {
                from {left: $packer}
                to {left: $unPacker;}
            }
        }@else if($animName == "packerMiddle"){
            @keyframes packerMiddle {
                /*160-70*/
                from {left: $animateMiddle}
                to {left:$packer ;}
            }
            @-webkit-keyframes packerMiddle /*Safari and Chrome*/
            {
                from {left: $animateMiddle}
                to {left:$packer ;}
            }
            @-moz-keyframes packerMiddle {
                from {left: $animateMiddle}
                to {left:$packer ;}
            }
        }
        @else if($animName == "unPackerMiddle"){
            @keyframes unPackerMiddle {
                /*70-160*/
                from {left: $packer}
                to {left: $animateMiddle;}
            }
            @-webkit-keyframes unPackerMiddle /*Safari and Chrome*/
            {
                from {left: $packer}
                to {left: $animateMiddle;}
            }
            @-moz-keyframes unPackerMiddle {
                from {left: $packer}
                to {left: $animateMiddle;}
            }
        }
    }

    @mixin itemAnim($animName: string) {
        @if($animName == "itemHide") {
            @keyframes itemHide {
                from{opacity: 1}
                to{opacity: 0}
            }
            @-webkit-keyframes itemHide /*Safari and Chrome*/
            {
                from{opacity: 1}
                to{opacity: 0}
            }
            @-moz-keyframes itemHide {
                from{opacity: 1}
                to{opacity: 0}
            }
        }@else if($animName == "itemAppear"){
            @keyframes itemAppear {
                from{opacity: 0}
                to{opacity: 1}
            }
            @-webkit-keyframes itemAppear /*Safari and Chrome*/
            {
                from{opacity: 0}
                to{opacity: 1}
            }
            @-moz-keyframes itemAppear {
                from{opacity: 0}
                to{opacity: 1}
            }
        }

    }

    @mixin bannerMove($animName :string) {
        @if($animName == 'bannerNear') {
            @keyframes bannerNear {
                from{left: $bannerFar}
                to{left: $bannerNear}
            }
            @-webkit-keyframes bannerNear {
                from{left: $bannerFar}
                to{left: $bannerNear}
            }
            @-moz-keyframes bannerNear {
                from{left: $bannerFar}
                to{left: $bannerNear}
            }
        } @else if($animName == 'bannerFar'){
            @keyframes bannerFar {
                from{left: $bannerNear}
                to{left: $bannerFar}
            }
            @-webkit-keyframes bannerFar {
                from{left: $bannerNear}
                to{left: $bannerFar}
            }
            @-moz-keyframes bannerFar {
                from{left: $bannerNear}
                to{left: $bannerFar}
            }
        }
    }

    @mixin animate($anim: string) {
        animation: $anim $animateDuration ease;
        -webkit-animation: $anim $animateDuration ease;
        -moz-animation: $anim $animateDuration ease;
    }


    @import "../../styles/defaultStyles";

    #board-container{
        border: 1px solid #E6E6E6;
        background-color: #fff;
        width: 99%;
        height: 100%;
        border-radius: 8px;
    }

    #base {
        height: 960px;
    }

    #header {
        height: 60px;
        line-height: 60px;
        width: 100%;
        .left-img{
            position: relative;
            cursor: pointer;
            float: left;
            top: 15px;
            img{
                position: absolute;
                vertical-align: middle;
            }
            .banner{
                /*left: 25px;*///收起距离
                left: 70px;//展开距离
            }
            .leftside{
                left: 220px;//展开距离,大屏
                padding: 10px;
                margin-left: -10px;
                /*left: 160px;*///展开距离，中屏
            }
        }
        .right-img{
            cursor: pointer;
            position: relative;
            float: right;
            margin-right: $baseMairinLeft;
            img{
                vertical-align: middle;
                margin-left:  $baseMairinLeft;
            }
            .badge{
                position: absolute;
                left: 76px;
                top: 6px;
            }
            .full-screen{
                padding: 10px;
            }
        }
    }

    #aside {
        position: absolute;
        height: 900px;
        a{
            display: inline-block;
            width: 100%;
            height: 55px;
            line-height: 55px;
            text-align: left;
            padding-left: 30px;
            font-size: 14px;
            color: #666;
            &:hover{
                background-color: #EBEBEB;
            }
            img{
                vertical-align: middle;
                margin-top: -5px;
                margin-right:15px;
            }

        }
        .router-link-active{
            color: #000000;
            background-color: #EBEBEB;

        }
        .group{
            position: relative;
            padding-top: 30px;
            margin-bottom: 15px;
            /*margin-bottom: 10px;*/
        }
        .title{
            position: absolute;
            top: 10px;
            text-align: left;
            font-size: 12px;
            left: 15px;
            pointer-events: none;
            color: #B0B0B0;
        }

    }

    .router-view {
        position: absolute;
        max-width: 1830px;
        min-width: 1020px;
        left: 220px;
        height: 900px;
        right: 0;
    }

    //title动画(不分中/大屏)
    .open {
        @include animate(opener);
    }
    .close {
        @include animate(closer);
    }
    @include titleMove("opener");
    @include titleMove("closer");

    //route-view动画(大屏)
    .router-animate {
        @include animate(router);
    }
    .unrouter-animate {
        @include animate(unRouter);
    }
    @include router('router');
    @include router('unRouter');

    //route-view动画(中屏)
    .router-animate-middle {
        @include animate(routerMiddle);
    }
    .unrouter-animate-middle {
        @include animate(unRouterMiddle);
    }

    @include router('routerMiddle');
    @include router('unRouterMiddle');


    //收起按钮动画(大屏)
    .packer {
        @include animate(packer);
    }
    .unPacker {
        @include animate(unPacker)
    }
    @include Packer("packer");
    @include Packer("unPacker");

    //收起按钮动画(中屏)
    .packer-middle {
        @include animate(packerMiddle);
    }
    .unPacker-middle {
        @include animate(unPackerMiddle);
    }
    @include Packer("packerMiddle");
    @include Packer("unPackerMiddle");

    //item动画
    .hidden {
        @include animate(itemHide);
    }
    .appear {
        @include animate(itemAppear);
    }
    @include itemAnim('itemHide');
    @include itemAnim('itemAppear');

    //公司图标动画(大屏,中屏不需要动画,只需要改变显示的图片即可)
    .banner-near {
        @include animate(bannerNear);

    }
    .banner-far {
        @include animate(bannerFar);
    }
    @include bannerMove('bannerNear');
    @include bannerMove('bannerFar');

    /**
        @media screen and (max-width: $minWidth){
        .router-view{
            width: 1040px;
        }
    }
    /
     */



</style>