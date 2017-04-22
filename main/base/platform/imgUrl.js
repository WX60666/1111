/**
 * Created by test on 2017/4/18.
 */
//use in base.vue

//选中图标
let productManager_sel = require('../../assets/img/Base/product-manager-sel.png');
let appManager_sel = require('../../assets/img/Base/app-manager-sel.png');
let product_sel = require('../../assets/img/Base/product-sel.png');
let mall_sel = require('../../assets/img/Base/mall-sel.png');
let data_sel = require('../../assets/img/Base/data-sel.png');
let help_sel = require('../../assets/img/Base/help-sel.png');
//未选中图标
let productManager = require('../../assets/img/Base/product-manager.png');
let appManager = require('../../assets/img/Base/app-manager.png');
let product = require('../../assets/img/Base/product.png');
let mall = require('../../assets/img/Base/mall.png');
let data = require('../../assets/img/Base/data.png');
let help = require('../../assets/img/Base/help.png');

let pack_sel = require('../../assets/img/Base/pack.png');
let pack= require('../../assets/img/Base/pack-sel.png');

let oe_sel = require('../../assets/img/Base/oe-sel.png');
let oe = require('../../assets/img/Base/oe.png');

let selectTabUrls: Array<string> = [productManager_sel, appManager_sel, product_sel, mall_sel, data_sel, help_sel];
let TabUrls: Array<string> = [productManager, appManager, product, mall, data, help];
let packImgUrl: Array<string> = [pack, pack_sel];
let oeImgUrl: Array<string> = [oe_sel, oe];

let tabArr:Array<string> = ['ProductManage', 'AppManage', 'ProduceCenter', 'Mall', 'DataCenter', 'Help'];

export {selectTabUrls, TabUrls, packImgUrl, oeImgUrl, tabArr};