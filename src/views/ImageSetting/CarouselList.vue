<template>
  <div>
    <p style="text-align: right">
      <a-button type="primary" @click="listCarousel">刷新数据</a-button>
    </p>
    <a-table
      :columns="columns"
      :data-source="list"
      row-key="id"
      :loading="dataLoading"
      :pagination="false">
      <template v-slot:preview="{ url }">
        <a
          style="margin-left: 10px;"
          :href="url"
          target="_blank"
          title="查看原图">
          <img :src="url" class="preview"/>
        </a>
      </template>
      <template v-slot:action="record">
        <a-popconfirm
          title="确认删除该图片吗？"
          placement="bottom"
          ok-text="删除"
          @confirm="delCarousel(record)"
          cancel-text="取消">
          <a-button type="danger">删除</a-button>
        </a-popconfirm>
      </template>
    </a-table>
  </div>
</template>

<script>

import { listCarousel, delCarousel } from '../../assets/api';

const columns = [
  {
    title: '图片预览',
    scopedSlots: { customRender: 'preview' },
  },
  {
    title: '操作',
    scopedSlots: { customRender: 'action' },
  },
];

export default {
  data() {
    return {
      list: [],
      columns,
      dataLoading: false,
      delLoading: false,
    };
  },
  methods: {
    async delCarousel(record) {
      if (this.delLoading) {
        this.$message.warning('正在删除图片，请稍后');
        return;
      }
      const hide = this.$message.loading('正在删除该轮播图片...', 0);
      this.delLoading = true;
      try {
        const { data } = await delCarousel(record.id);
        if (data.code === 400) {
          this.$message.warning(data.message);
          window.localStorage.setItem('hasUserInfo', '');
          window.localStorage.removeItem('hasUserInfo');
          this.$router.push('/login');
          return;
        }
        const ok = data.code === 200;
        if (ok) this.listCarousel();
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
    async listCarousel() {
      this.dataLoading = true;
      try {
        const { data } = await listCarousel(this.page);
        if (data.code === 400) {
          this.$message.warning(data.message);
          window.localStorage.setItem('hasUserInfo', '');
          window.localStorage.removeItem('hasUserInfo');
          this.$router.push('/login');
          return;
        }
        if (data.code === 200) {
          this.list = data.data;
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
    this.listCarousel();
  },
};
</script>

<style scoped>

.preview {
  height: 150px;
  width: 300px;
  border-radius: 10px;
}

</style>
