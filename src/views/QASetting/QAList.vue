<template>
  <div>
    <p style="text-align: right">
      <a-button type="primary" @click="listQA" style="margin-right: 10px">刷新数据</a-button>
      <a-button
        type="primary"
        @click="visible = true">添加题目
      </a-button>
    </p>
    <a-table
      :columns="columns"
      :data-source="list"
      row-key="qid"
      :loading="dataLoading"
      :pagination="{
        total,
        current: page,
        defaultPageSize: 10,
        showTotal: total => `共 ${total} 条数据`,
        onChange: page => {
          this.page = page;
          this.listQA();
        }
      }">
      <template v-slot:qa="record">
        <QA :question="record"/>
      </template>
      <template v-slot:action="record">
        <a-popconfirm
          title="确认删除该题目吗？"
          placement="bottom"
          ok-text="删除"
          @confirm="delQA(record)"
          cancel-text="取消">
          <a-button type="danger">删除</a-button>
        </a-popconfirm>
      </template>
    </a-table>
    <a-modal
      title="添加题目"
      v-model="visible"
      :footer="null">
      <BatchAddQA :cid="cid"/>
    </a-modal>
  </div>

</template>
<script>
import BatchAddQA from './BatchAddQA.vue';
import QA from '../../components/QA.vue';
import { delQA, listQA } from '../../assets/api';

const columns = [
  {
    title: '题目编号',
    dataIndex: 'qid',
  }, {
    title: '题目',
    scopedSlots: { customRender: 'qa' },
  }, {
    title: '操作',
    scopedSlots: { customRender: 'action' },
  },
];

export default {
  props: ['cid'],
  data() {
    return {
      list: [],
      columns,
      page: 1,
      total: 0,
      visible: false,
      dataLoading: false,
      delLoading: false,
    };
  },
  methods: {
    async delQA(record) {
      if (this.delLoading) {
        this.$message.warning('正在删除题目，请稍后');
        return;
      }
      const hide = this.$message.loading(`正在删除编号为'${record.qid}'的题目...`, 0);
      this.delLoading = true;
      try {
        const { data } = await delQA(this.cid, record.qid);
        if (data.code === 400) {
          this.$message.warning(data.message);
          window.localStorage.setItem('hasUserInfo', '');
          window.localStorage.removeItem('hasUserInfo');
          this.$router.push('/login');
          return;
        }
        const ok = data.code === 200;
        if (ok) this.listQA();
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
    async listQA() {
      this.dataLoading = true;
      try {
        const { data } = await listQA(this.cid, this.page);
        if (data.code === 400) {
          this.$message.warning(data.message);
          window.localStorage.setItem('hasUserInfo', '');
          window.localStorage.removeItem('hasUserInfo');
          this.$router.push('/login');
          return;
        }
        if (data.code === 200) {
          this.list = data.data.questions;
          this.total = data.data.count;
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
    this.listQA();
  },
  components: {
    BatchAddQA,
    QA,
  },
};
</script>

<style>
</style>
