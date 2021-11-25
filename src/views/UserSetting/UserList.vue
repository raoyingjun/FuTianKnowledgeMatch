<template>
  <div>
    <p style="text-align: right">
      <a-button
        v-if="cid"
        style="margin-right: 10px;"
        :type="searchFilter.added ? '' : 'primary'"
        @click="filterUserList">
        {{ searchFilter.added ? '查询所有用户' : '查询已添加到可答题名单的用户' }}</a-button>
      <a-radio-group v-model="searchFilter.type" style="margin-right: 10px;">
        <a-radio-button value="" @focus="clearFilter">
          全部
        </a-radio-button>
        <a-radio-button value="phone">
          手机号
        </a-radio-button>
        <a-radio-button value="username">
          用户名
        </a-radio-button>
      </a-radio-group>
      <a-input-search
        enter-button
        @search="listUser"
        allow-clear
        :placeholder="`查询指定${searchFilter.type === 'username' ? '用户名' : '手机号'}`"
        style="width: 300px;
        margin-right: 10px;"
        v-model="searchFilter.name"
        v-show="searchFilter.type"/>
      <a-button type="primary" @click="listUser">刷新数据</a-button>
    </p>
    <a-table
      :columns="columns"
      :data-source="list"
      row-key="uid"
      :loading="dataLoading"
      :pagination="{
        total,
        current: page,
        defaultPageSize: 10,
        showTotal: total => `共 ${total} 条数据`,
        onChange: page => {
          this.page = page;
          this.listUser();
        }
      }">
      <template v-slot:action="record">
        <template v-if="cid">
          <a-button :type="record.canAttend ? 'danger' : 'primary'" @click="toggleFromList(record)">{{ record.canAttend ? '从可答题名单移除' : '添加到可答题名单' }}</a-button>
        </template>
        <template v-else>
          <a-button
            @click="setRole(record)"
            :type="record.roleName === 'ROLE_MANAGER' ? 'primary' : ''"
            style="margin-right: 10px;">
            {{ record.roleName === 'ROLE_MANAGER' ? '取消系统管理员权限' : '设为系统管理员' }}
          </a-button>
          <a-popconfirm
            title="确认删除该用户吗？"
            placement="bottom"
            ok-text="删除"
            @confirm="delUser(record)"
            cancel-text="取消">
            <a-button type="danger">删除</a-button>
          </a-popconfirm>
        </template>
      </template>
    </a-table>
  </div>

</template>
<script>
import {
  delUser,
  listUser,
  setRole,
  addUserToChapter,
  delUserFromChapter,
} from '../../assets/api';

const ROLE_MANAGER = 1;
const ROLE_USER = 2;

const columns = [
  {
    title: '姓名',
    dataIndex: 'username',
  }, {
    title: '手机号',
    dataIndex: 'phone',
  }, {
    title: '所属部门',
    dataIndex: 'departmentName',
  }, {
    title: '操作',
    scopedSlots: { customRender: 'action' },
  },
];

export default {
  props: {
    cid: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      list: [],
      columns,
      total: 0,
      page: 1,
      visible: false,
      dataLoading: false,
      delLoading: false,
      setLoading: false,
      userExamLoading: false, // 添加用户到考试和从考试列表移除用户加载状态记录
      searchFilter: {
        type: '', // 要查询的类型，用户名或手机号
        name: '', // 输入的查询条件
        added: false,
        chapterId: this.cid,
      },
    };
  },
  methods: {
    // 切换用户的可答题次数
    async toggleFromList(record) {
      if (this.userExamLoading) {
        this.$message.warning('正在更改用户可答题权限，请稍后');
        return;
      }
      const hide = this.$message.loading(`正在更改用户'${record.username}'的可答题权限...`, 0);
      this.userExamLoading = true;
      try {
        const form = {
          userId: record.uid,
          chapterId: this.cid,
        };
        const { data } = await (record.canAttend ? delUserFromChapter(form.chapterId, form.userId) : addUserToChapter(form));
        if (data.code === 400) {
          this.$message.warning(data.message);
          window.localStorage.setItem('hasUserInfo', '');
          window.localStorage.removeItem('hasUserInfo');
          this.$router.push('/login');
          return;
        }
        const ok = data.code === 200;
        if (ok) this.listUser();
        this.$message.open({
          type: ok ? 'success' : 'warning',
          content: data.message,
        });
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        this.userExamLoading = false;
        hide();
      }
    },
    filterUserList() {
      this.searchFilter.added = !this.searchFilter.added;
      this.listUser();
    },
    clearFilter() {
      this.searchFilter.type = '';
      this.searchFilter.name = '';
      this.listUser();
    },
    async setRole(record) {
      if (this.setLoading) {
        this.$message.warning('正在修改权限，请稍后');
        return;
      }
      const hide = this.$message.loading(`正在修改用户'${record.username}'的权限...`, 0);
      this.setLoading = true;
      try {
        const { data } = await setRole(record.uid, record.roleName === 'ROLE_MANAGER' ? ROLE_USER : ROLE_MANAGER);
        if (data.code === 400) {
          this.$message.warning(data.message);
          window.localStorage.setItem('hasUserInfo', '');
          window.localStorage.removeItem('hasUserInfo');
          this.$router.push('/login');
          return;
        }
        const ok = data.code === 200;
        if (ok) this.listUser();
        this.$message.open({
          type: ok ? 'success' : 'warning',
          content: data.message,
        });
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        this.setLoading = false;
        hide();
      }
    },
    async delUser(record) {
      if (this.delLoading) {
        this.$message.warning('正在删除用户，请稍后');
        return;
      }
      const hide = this.$message.loading(`正在删除用户'${record.username}'...`, 0);
      this.delLoading = true;
      try {
        const { data } = await delUser(record.uid);
        if (data.code === 400) {
          this.$message.warning(data.message);
          window.localStorage.setItem('hasUserInfo', '');
          window.localStorage.removeItem('hasUserInfo');
          this.$router.push('/login');
          return;
        }
        const ok = data.code === 200;
        if (ok) this.listUser();
        this.$message.open({
          type: ok ? 'success' : 'warning',
          content: data.message,
        });
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        this.delLoading = false;
        hide();
      }
    },
    async listUser() {
      this.dataLoading = true;
      try {
        const { data } = await listUser(this.page, { ...this.searchFilter });
        if (data.code === 400) {
          this.$message.warning(data.message);
          window.localStorage.setItem('hasUserInfo', '');
          window.localStorage.removeItem('hasUserInfo');
          this.$router.push('/login');
          return;
        }
        if (data.code === 200) {
          this.list = data.data.list;
          this.total = data.data.total;
        } else {
          this.list = [];
          this.total = 0;
          this.$message.warning(data.message);
        }
      } catch (e) {
        this.$message.error(e.message);
      } finally {
        this.dataLoading = false;
      }
    },
  },
  created() {
    this.listUser();
  },
};
</script>

<style>
</style>
