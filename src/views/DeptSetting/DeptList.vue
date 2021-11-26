<template>
  <div>
    <p style="text-align: right">
      <a-button type="primary" @click="listDept">刷新数据</a-button>
      <a-button
        type="primary"
        @click="manageSubDepVisible = true"
        v-if="isSub && !cid"
        style="margin-left: 10px">添加子部门</a-button>
    </p>
    <a-table
      :columns="columns"
      :data-source="list"
      row-key="did"
      :loading="dataLoading"
      :pagination="{
        total,
        current: page,
        defaultPageSize: 10,
        showTotal: total => `共 ${total} 条数据`,
        onChange: page => {
          this.page = page;
          this.listDept();
        }
      }">
      <template v-slot:action="record">
        <template v-if="!cid">
          <a-popconfirm
            title="确认删除该部门吗？"
            placement="bottom"
            ok-text="删除"
            @confirm="delDept(record)"
            cancel-text="取消">
            <a-button type="danger">删除</a-button>
          </a-popconfirm>
          <a-button
            type="primary"
            v-if="!isSub"
            @click="manageSubDept(record)"
            style="margin-left: 10px">管理子部门</a-button>
        </template>
        <template v-else>
          <a
            target="_blank"
            download
            :href="`/manager/download/log/${cid}/${record.did}`"
            style="margin-right: 10px">导出该部门的人员竞赛成绩</a>
          <a
            target="_blank"
            download
            :href="`/manager/download/department/${cid}/${record.did}`"
            style="margin-right: 10px">导出该部门的练习情况</a>
          <a-button
            type="primary"
            v-if="!isSub"
            @click="manageSubDept(record)"
            style="margin-left: 10px">导出指定子部门数据</a-button>
        </template>
      </template>
    </a-table>
    <a-modal
      v-if="!isSub"
      destroy-on-close
      v-model="subDeptVisible"
      title="管理子部门"
      width="90%"
      :footer="null">
      <DepList is-sub :spdid="pdid" :cid="cid"/>
    </a-modal>
    <a-modal
      v-if="isSub"
      destroy-on-close
      :after-close="listDept"
      title="添加子部门"
      width="90%"
      v-model="manageSubDepVisible"
      :footer="null">
      <ManageDept :pdid="pdid"/>
    </a-modal>
  </div>
</template>
<script>

import { delDept, listDept } from '../../assets/api';
import ManageDept from './ManageDept.vue';

const columns = [
  {
    title: '部门名称',
    dataIndex: 'name',
  }, {
    title: '部门人数',
    dataIndex: 'count',
  }, {
    title: '操作',
    scopedSlots: { customRender: 'action' },
  },
];

export default {
  name: 'DepList',
  props: {
    // 有 cid 则说明需要导出数据
    cid: {
      type: Number,
      default: 0,
    },
    // 用来递归生成子组件，因为有子部门
    isSub: {
      type: Boolean,
      default: false,
    },
    spdid: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      list: [],
      columns,
      dataLoading: false,
      page: 1,
      total: 0,
      delLoading: false,
      subDeptVisible: false,
      pdid: this.spdid,
      manageSubDepVisible: false,
    };
  },
  methods: {
    manageSubDept(record) {
      this.pdid = record.did;
      this.subDeptVisible = true;
    },
    async delDept(record) {
      if (this.delLoading) {
        this.$message.warning('正在删除部门，请稍后');
        return;
      }
      const hide = this.$message.loading(`正在删除'${record.name}'部门...`, 0);
      this.delLoading = true;
      try {
        const { data } = await delDept(record.did);
        if (data.code === 400) {
          this.$message.warning(data.message);
          window.localStorage.setItem('hasUserInfo', '');
          window.localStorage.removeItem('hasUserInfo');
          this.$router.push('/login');
          return;
        }
        const ok = data.code === 200;
        if (ok) this.listDept();
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
    async listDept() {
      this.dataLoading = true;
      try {
        const { data } = await listDept(this.page, this.isSub ? this.pdid : 0);
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
    this.listDept();
  },
  components: {
    ManageDept,
  },
};
</script>

<style>
</style>
