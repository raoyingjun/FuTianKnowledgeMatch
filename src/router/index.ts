import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Setting from '../views/Setting.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/setting',
    name: 'Setting',
    children: [{
      path: 'chapter',
      component: () => import(/* webpackChunkName: "about" */ '../views/ChapterSetting/ChapterList.vue'),
    }, {
      path: 'chapter/manage',
      component: () => import(/* webpackChunkName: "about" */ '../views/ChapterSetting/ManageChapter.vue'),
    }, {
      path: 'image/carousel',
      component: () => import(/* webpackChunkName: "about" */ '../views/ImageSetting/CarouselList.vue'),
    }, {
      path: 'image/carousel/manage',
      component: () => import(/* webpackChunkName: "about" */ '../views/ImageSetting/ManageCarouselImage.vue'),
    }, {
      path: 'user',
      component: () => import(/* webpackChunkName: "about" */ '../views/UserSetting/UserList.vue'),
    }, {
      path: 'user/manage',
      component: () => import(/* webpackChunkName: "about" */ '../views/UserSetting/BatchAddUser.vue'),
    }, {
      path: 'department',
      component: () => import(/* webpackChunkName: "about" */ '../views/DeptSetting/DeptList.vue'),
    }, {
      path: 'department/manage',
      component: () => import(/* webpackChunkName: "about" */ '../views/DeptSetting/ManageDept.vue'),
    }],
    component: Setting,
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue'),
  },
];

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes,
});

export default router;
