/**
 * Created by test on 2017/4/17.
 */

import 'babel-polyfill';
import 'eventsource-polyfill';
import 'eventsource';
import css from './style.scss';

import Vue from  'vue';
import App from './App.vue';
import VueRouter from 'vue-router';
import $ from 'jquery';

import config from  './router.config'

//iView
import iView from 'iview';
import 'iview/dist/styles/iview.css';    // 使用 CSS



Vue.use(VueRouter);
Vue.use(iView);

const router = new VueRouter(config);

new Vue({
    router,
    el:"#app",
    render:h=>h(App),
});