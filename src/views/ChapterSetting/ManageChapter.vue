<template>
  <a-form-model
    :rules="rules"
    :model="form"
    :label-col="{ span: 4 }"
    :wrapper-col="{ span: 14 }"
    ref="form">
    <a-form-model-item label="章节名称" prop="name">
      <a-input v-model="form.name" />
    </a-form-model-item>
    <a-form-model-item label="开放时间" prop="endTime">
      <a-range-picker
        :locale="locale"
        v-model="time"
        show-time
        :placeholder="['开始时间', '结束时间']"
      />
    </a-form-model-item>
    <a-form-model-item label="开放范围" prop="scope">
      <a-radio-group v-model="form.scope" :disabled="!!data">
        <a-radio-button value="GLOBAL">
          全部人可答
        </a-radio-button>
        <a-radio-button value="SINGLE">
          指定人选可答
        </a-radio-button>
      </a-radio-group>
      创建后无法修改
    </a-form-model-item>
    <a-form-model-item label="章节类型" prop="type">
      <a-radio-group v-model="form.type" :disabled="!!data">
        <a-radio-button value="FIRST_EXAM">
          热身赛
        </a-radio-button>
        <a-radio-button value="REPEATED_EXAM">
          资格赛
        </a-radio-button>
      </a-radio-group>
      创建后无法修改
    </a-form-model-item>
    <a-form-model-item :wrapper-col="{ span: 16, offset: 4 }">
      <a-button type="primary" @click="onSubmit" :loading="loading">{{ data ? '编辑章节' : '添加章节' }}</a-button>
      <a-button style="margin-left: 10px;" @click="resetForm">{{ data ? '重置表单' : '清空表单' }}</a-button>
    </a-form-model-item>
  </a-form-model>
</template>
<script>
import 'moment/locale/zh-cn';
import moment from 'moment';
import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import { addChapter, updateChapter } from '../../assets/api';

export default {
  props: {
    data: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      locale,
      form: this.data ? { ...this.data } : {
        name: '',
        type: '',
        scope: '',
        startTime: '',
        endTime: '',
      },
      time: this.data ? [moment(this.data.startTime), moment(this.data.endTime)] : [],
      rules: {
        name: [{
          required: true,
          message: '请输入章节名称',
          trigger: 'blur',
        }],
        scope: [{
          required: true,
          message: '请选择开放的范围',
          trigger: 'blur',
        }],
        type: [{
          required: true,
          message: '请选择章节类型',
          trigger: 'blur',
        }],
        // startTime和endTime是同步的，判断里面只要有一个没有，就说明未选择时间
        endTime: [{
          required: true,
          message: '请选择时间',
          trigger: 'blur',
        }],
      },
      loading: false,
    };
  },
  watch: {
    time(newVal) {
      if (!newVal.length) return; // 说明用户清空了开放时间，无需在更新startTime和endTime的值了
      const [startTime, endTime] = newVal;
      this.form.startTime = startTime.valueOf();
      this.form.endTime = endTime.valueOf();
    },
  },
  methods: {
    resetForm() {
      this.$refs.form.resetFields();
      if (this.data) {
        this.time = [moment(this.data.startTime), moment(this.data.endTime)];
      } else {
        this.time = [];
      }
    },
    async onSubmit() {
      if (await this.$refs.form.validate()) {
        this.loading = true;
        try {
          const { data } = await (this.data ? updateChapter(this.form) : addChapter(this.form));
          if (data.code === 400) {
            this.$message.warning(data.message);
            window.localStorage.setItem('hasUserInfo', '');
            window.localStorage.removeItem('hasUserInfo');
            this.$router.push('/login');
            return;
          }
          const ok = data.code === 200;
          if (ok) {
            if (!this.data) this.resetForm();
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
