// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
import goods from './components/goods/goods.vue';
import ratings from './components/ratings/ratings.vue';
import seller from './components/seller/seller.vue';
import 'common/stylus/index.styl';
// 安装 "VueRouter"这个插件
/* eslint-disable no-new */
Vue.use(VueRouter);
Vue.use(VueResource);
let routes = [
  {path: '/', name: 'index', component: App, children: [{path: '/goods', component: goods}, {path: '/ratings', component: ratings}, {path: '/seller', component: seller}]}
];
let router = new VueRouter({
  'linkActiveClass': 'active',
   routes // （缩写）相当于 routes: routes
});
// 创建vue实例，挂载到#app上
let app = new Vue({
  router
}).$mount('#app');

// router.push相当于router-link也是跳转，即访问根路径，就跳到/goods路径，如果不加这个就会跳转到只有三个tab切换页面也就是根目录，另一种方法也可以使用redirect进行配置
 router.push('/goods');
export default app;
