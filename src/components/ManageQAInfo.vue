<template>
  <a-form-model
    :rules="rules"
    :model="form"
    :label-col="{ span: 6 }"
    :wrapper-col="{ span: 12 }"
    ref="form">
    <a-form-model-item label="抽取单选题数量" prop="singleSize">
      <a-input-number v-model="form.singleSize" :min="0"/>
    </a-form-model-item>
    <a-form-model-item label="每道单选题分值" prop="singleScore">
      <a-input-number v-model="form.singleScore" :min="0"/>
    </a-form-model-item>
    <a-form-model-item label="抽取多选题数量" prop="multiSize">
      <a-input-number v-model="form.multiSize" :min="0"/>
    </a-form-model-item>
    <a-form-model-item label="每道多选题分值" prop="multiScore">
      <a-input-number v-model="form.multiScore" :min="0"/>
    </a-form-model-item>
    <a-form-model-item label="抽取判断题数量" prop="tfSize">
      <a-input-number v-model="form.tfSize" :min="0"/>
    </a-form-model-item>
    <a-form-model-item label="每道判断题分值" prop="tfScore">
      <a-input-number v-model="form.tfScore" :min="0"/>
    </a-form-model-item>
    <a-form-model-item label="总题数（自动计算）">
      <a-input v-model="totalSize" read-only/>
    </a-form-model-item>
    <a-form-model-item label="总分数（自动计算）">
      <a-input v-model="totalScore" read-only/>
    </a-form-model-item>
    <a-form-model-item label="答题时长（单位：分钟）" prop="examTime">
      <a-input-number v-model="form.examTime" :min="0"/>
    </a-form-model-item>
    <a-form-model-item label="每人可以作答的次数" prop="examNum">
      <a-input-number v-model="form.examNum" :min="0"/>
    </a-form-model-item>
    <a-form-model-item :wrapper-col="{ span: 14, offset: 6 }">
      <a-button type="primary" @click="onSubmit" :loading="loading">修改题目配置</a-button>
      <a-button style="margin-left: 10px;" @click="$refs.form.resetFields()">重置表单</a-button>
    </a-form-model-item>
  </a-form-model>
</template>
<script>

import { updateChapterConfig } from '../assets/api';

export default {
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      form: this.data ? { ...this.data } : {
        cid: this.cid,
        singleScore: 0,
        singleSize: 0,
        multiScore: 0,
        multiSize: 0,
        tfScore: 0,
        tfSize: 0,
        examTime: 0, // 考试时间
        examNum: 0, // 总共可答多少次
      },
      rules: {
        singleScore: [{
          required: true,
          message: '请指定每道单选题分值',
          trigger: 'blur',
        }],
        singleSize: [{
          required: true,
          message: '请指定要抽取的单选题数量',
          trigger: 'blur',
        }],
        multiScore: [{
          required: true,
          message: '请指定每道多选题分值',
          trigger: 'blur',
        }],
        multiSize: [{
          required: true,
          message: '请指定要抽取的多选题数量',
          trigger: 'blur',
        }],
        tfScore: [{
          required: true,
          message: '请指定每道判断题分值',
          trigger: 'blur',
        }],
        tfSize: [{
          required: true,
          message: '请指定要抽取的判断题数量',
          trigger: 'blur',
        }],
        examTime: [{
          required: true,
          message: '请指定作答的限制的时长',
          trigger: 'blur',
        }],
        examNum: [{
          required: true,
          message: '请指定每人可以作答的次数',
          trigger: 'blur',
        }],
      },
      loading: false,
    };
  },
  computed: {
    // 必须使用常规函数，否则 this 指向有误
    totalSize() {
      return this.form.singleSize + this.form.multiSize + this.form.tfSize;
    },
    totalScore() {
      return this.form.singleSize * this.form.singleScore
        + this.form.multiSize * this.form.multiScore
        + this.form.tfSize * this.form.tfScore;
    },
  },
  methods: {
    async onSubmit() {
      if (await this.$refs.form.validate()) {
        this.loading = true;
        try {
          const { data } = await updateChapterConfig({
            ...this.form,
            totalScore: this.totalScore,
            totalSize: this.totalSize,
          });
          if (data.code === 400) {
            this.$message.warning(data.message);
            window.localStorage.setItem('hasUserInfo', '');
            window.localStorage.removeItem('hasUserInfo');
            this.$router.push('/login');
            return;
          }
          const ok = data.code === 200;
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
