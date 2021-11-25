<template>
  <div style="padding-top: 10%;">
    <a-form-model
      ref="form"
      :model="form"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 12 }"
      class="form"
      :rules="rules">
      <h2 style="text-align: center">党员竞赛CMS系统</h2>
      <a-form-model-item label="手机号" prop="username">
        <a-input v-model="form.username"/>
      </a-form-model-item>
      <a-form-model-item label="密码" prop="password">
        <a-input-password v-model="form.password"/>
      </a-form-model-item>
      <a-form-model-item :wrapper-col="{ span: 12, offset: 6 }" style="text-align: center">
        <a-button type="primary" @click="onSubmit" :loading="loading">
          {{ loading ? '正在登录' : '登录' }}
        </a-button>
        <a-button style="margin-left: 10px;" @click="$refs.form.resetFields()">
          清空表单
        </a-button>
      </a-form-model-item>
    </a-form-model>
  </div>
</template>
<script>
import { login } from '../assets/api';

export default {
  data() {
    return {
      form: {
        username: process.env.NODE_ENV === 'development' ? '15999649246' : '',
        password: process.env.NODE_ENV === 'development' ? '123456' : '',
        imageCode: process.env.NODE_ENV === 'development' ? 'random' : '',
      },
      rules: {
        username: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur',
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur',
        }],
      },
      loading: false,
    };
  },
  methods: {
    async onSubmit() {
      if (await this.$refs.form.validate()) {
        this.loading = true;
        try {
          const { data } = await login(this.form);
          if (data.code === 500) {
            this.$message.warning(data.message);
          } else {
            window.localStorage.setItem('hasUserInfo', 'true');
            this.$router.push('/setting/chapter/');
          }
        } catch (e) {
          this.$message.error(e.message);
        } finally {
          this.loading = false;
        }
      }
    },
  },
  beforeRouteEnter(to, from, next) {
    if (window.localStorage.getItem('hasUserInfo') === 'true') {
      next('/setting/chapter/');
      // window.history.back();
      return;
    }
    next();
  },
};

</script>

<style scoped>
.form {
  padding: 50px;
  width: 600px;
  margin: 0 auto;
  border: 1px solid #e3e3e3;
  border-radius: 12px;
}
</style>
