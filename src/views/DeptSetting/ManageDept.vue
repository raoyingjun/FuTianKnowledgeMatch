<template>
  <a-form-model
    :model="form"
    :label-col="{ span: 4 }"
    :wrapper-col="{ span: 14 }"
    ref="form"
    :rules="rules">
    <a-form-model-item :label="`${pdid ? '子' : ''}部门名称`" prop="name">
      <a-input v-model="form.name"/>
    </a-form-model-item>
    <a-form-model-item :wrapper-col="{ span: 16, offset: 4 }">
      <a-button type="primary" @click="onSubmit" :loading="loading">添加{{ pdid ? '子' : '顶级'}}部门</a-button>
      <a-button style="margin-left: 10px;" @click="$refs.form.resetFields()">重置表单</a-button>
    </a-form-model-item>
  </a-form-model>
</template>
<script>

import { addDept } from '../../assets/api';

export default {
  props: {
    pdid: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      form: {
        name: '',
      },
      rules: {
        name: [{
          required: true,
          message: '请输入部门名称',
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
          const { data } = await addDept({ ...this.form, pdid: this.pdid });
          if (data.code === 400) {
            this.$message.warning(data.message);
            window.localStorage.setItem('hasUserInfo', '');
            window.localStorage.removeItem('hasUserInfo');
            this.$router.push('/login');
            return;
          }
          const ok = data.code === 200;
          if (ok) {
            this.$refs.form.resetFields();
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
      }
    },
  },
};
</script>
