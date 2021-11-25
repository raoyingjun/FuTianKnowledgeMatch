<template>
  <div>
    <a-upload
      accept="text/plain"
      :action="`/manager/question/file?cid=${cid}`"
      @change="change">
      <a-button type="primary">批量添加题目</a-button>
    </a-upload>
    <div style="margin: 10px 0">
      <a target="_blank" download href="/image/党建-问题数据导入模板.txt">不知道批量上传题目的格式？点我下载模板</a>
    </div>
    <a-alert
      message="批量上传题目的文件名后缀必须为 .txt 格式"
      type="warning"
      show-icon
      closable/>
  </div>
</template>
<script>
export default {
  props: ['cid'],
  data() {
    return {
    };
  },
  methods: {
    change({ file }) {
      if (file.status === 'done') {
        if (file.response.code === 400) {
          this.$message.warning(file.response.message);
          window.localStorage.setItem('hasUserInfo', '');
          window.localStorage.removeItem('hasUserInfo');
          this.$router.push('/login');
          return;
        }
        this.$message.open({
          type: file.response.code === 200 ? 'success' : 'warning',
          content: file.response.message,
        });
      } else if (file.status === 'error') {
        this.$message.error('文件上传失败');
      }
    },
  },
};
</script>
