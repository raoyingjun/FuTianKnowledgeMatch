<template>
  <a-layout class="cms">
    <a-layout-header class="header">
      <div class="logo">党员竞赛CMS系统</div>
      <a-button @click="visible = true">退出登录</a-button>
    </a-layout-header>
    <a-layout>
      <a-layout-sider width="200" style="background: #fff">
        <a-menu
          mode="inline"
          :defaultSelectedKeys="[$route.path]"
          :style="{ height: '100%', borderRight: 0 }"
        >
          <a-sub-menu v-for="menu in menus" :key="menu.path">
            <span slot="title">{{ menu.title }}</span>
            <a-menu-item v-for="subMenu in menu.children" :key="menu.path + '/' + subMenu.path">
              <router-link :to="menu.path + '/' + subMenu.path">
                {{ subMenu.title }}
              </router-link>
            </a-menu-item>
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>
      <a-layout style="padding: 0 24px 24px">
        <a-layout-content class="view">
          <router-view/>
        </a-layout-content>
      </a-layout>
    </a-layout>
    <a-modal
      v-model="visible"
      title="提醒"
      :confirm-loading="loading"
      ok-text="确认退出"
      cancel-text="取消"
      @ok="logout">
      <p>确认退出登录吗？</p>
    </a-modal>
  </a-layout>
</template>
<script>

import { logout } from '@/assets/api';

export default {
  data() {
    return {
      visible: false,
      loading: false,
      menus: [{
        title: '章节管理',
        key: '1',
        path: '/setting/chapter',
        children: [{
          title: '章节列表',
          key: '1-1',
          path: '',
        }, {
          title: '添加章节',
          key: '1-2',
          path: 'manage',
        }],
      }, {
        title: '图片管理',
        key: '2',
        path: '/setting/image',
        children: [{
          title: '轮播图片列表',
          key: '2-2',
          path: 'carousel',
        }, {
          title: '添加轮播图片',
          key: '2-3',
          path: 'carousel/manage',
        }],
      }, {
        title: '用户管理',
        key: '3',
        path: '/setting/user',
        children: [{
          title: '用户列表',
          key: '3-1',
          path: '',
        }, {
          title: '添加用户',
          key: '3-2',
          path: 'manage',
        }],
      }, {
        title: '部门管理',
        key: '4',
        path: '/setting/department',
        children: [{
          title: '部门列表',
          key: '4-1',
          path: '',
        }, {
          title: '添加部门',
          key: '4-2',
          path: 'manage',
        }],
      }],
    };
  },
  methods: {
    async logout() {
      this.loading = true;
      try {
        const { data } = await logout(this.page);
        const ok = data.code === 200;
        if (ok) {
          window.localStorage.setItem('hasUserInfo', '');
          window.localStorage.removeItem('hasUserInfo');
          this.$router.push('/login');
        }
        this.$message.open({
          type: ok ? 'success' : 'warning',
          content: data.message,
        });
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        this.loading = false;
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    if (!window.localStorage.getItem('hasUserInfo')) {
      next('/login');
      return;
    }
    next();
  },
};
</script>

<style>

.cms {
  height: 100%;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  color: white;
  font-size: 18px;
  padding: 10px 15px;
  line-height: initial;
  background-color: rgba(255, 255, 255, .2);
}

.view {
  background: #fff;
  padding: 24px;
  margin: 0;
  min-height: 280px;
  overflow: auto
}
</style>
