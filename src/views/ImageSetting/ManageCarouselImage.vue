<template>
  <div>
    <a-upload
      :before-upload="beforeUpload"
      accept="image/png, image/jpeg, image/jpg"
      action="/manager/banner/file"
      @change="change">
      <a-button type="primary" style="margin-bottom: 10px">添加轮播图片</a-button>
    </a-upload>
    <p>图片预览：</p>
    <template v-if="preview">
      <a
        :href="preview"
        title="查看原图"
        target="_blank">
        <img
          :src="preview"
          alt=""
          class="preview">
      </a>
    </template>
    <template v-else>
      <p>请先添加轮播图片</p>
    </template>
    <a-alert
      message="图片宽高比必须为 2:1。支持 png、jpeg、jpg 格式的图片"
      type="warning"
      show-icon
      closable/>
  </div>
</template>

<script>
import getImageInfo from '../../assets/util';

export default {
  data() {
    return {
      preview: '',
    };
  },
  methods: {
    async beforeUpload(file) {
      const hide = this.$message.loading('正在获取图片宽高');
      try {
        const { width, height } = await getImageInfo(file);
        if (width / height !== 2) {
          throw Error('图片宽高比必须为 2:1');
        }
        return file;
      } catch (e) {
        this.$message.warning(e.message);
      } finally {
        hide();
      }
      return Promise.reject();
    },
    change({ file }) {
      if (file.status === 'done') {
        if (file.response.code === 400) {
          this.$message.warning(file.response.message);
          window.localStorage.setItem('hasUserInfo', '');
          window.localStorage.removeItem('hasUserInfo');
          this.$router.push('/login');
          return;
        }
        const ok = file.response.code === 200;
        if (ok) this.preview = file.response.data;
        this.$message.open({
          type: ok ? 'success' : 'warning',
          content: file.response.message,
        });
      } else if (file.status === 'error') {
        this.$message.error('文件上传失败');
      }
    },
  },
};
</script>

<style>
.preview {
  margin-bottom: 10px;
  width: 300px;
}
</style>
