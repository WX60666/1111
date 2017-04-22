/**
 * Created by test on 2017/4/20.
 */


import ProductManage from './aside/ProductManage.vue';
import AppManage from './aside/AppManage.vue';
import DataCenter from './aside/DataCenter.vue';
import Help from './aside/Help.vue';
import Mall from './aside/Mall.vue';
import ProduceCenter from './aside/ProduceCenter.vue';

import Base from  './Base.vue';
import Login from './Login.vue'

let config = {
    routes:[
        {path:"/Base", component:Base,
            children:[
                {path: '/Base/ProductManage', component: ProductManage},
                {path: "/Base/AppManage", component: AppManage},
                {path: "/Base/DataCenter", component: DataCenter},
                {path: "/Base/Help", component: Help},
                {path: "/Base/Mall", component: Mall},
                {path: "/Base/ProduceCenter", component: ProduceCenter},
            ]
        },
        {path:"/Login", component: Login},
        // {path:'*',redirect: '/Login'}
    ]
};

export default config;