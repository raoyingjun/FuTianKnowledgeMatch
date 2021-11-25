<template>
  <a-popover
    placement="bottom"
    trigger="click">
    <template v-slot:title>
      <strong>问题：</strong>
      {{ question.content }}
      <a-tag color="blue">{{ question.type | formatType }}题</a-tag>
    </template>
    <template v-slot:content>
      <p
        v-for="answer in question.answers"
        :key="answer.id">
        {{ answer.content }}
        <a-tag :color="answer.status === 'RIGHT' ? 'green' : 'red'">
          {{ answer.status === 'RIGHT' ? '正确' : '错误' }}
        </a-tag>
      </p>
    </template>
    <a-button>查看题目</a-button>
  </a-popover>
</template>

<script>

const TYPES = {
  SINGLE: '单选',
  MULTI: '多选',
  TF: '判断',
};

export default {
  props: {
    question: {
      type: Object,
      default: () => ({}),
    },
  },
  filters: {
    formatType(type) {
      return TYPES[type];
    },
  },
};
</script>
