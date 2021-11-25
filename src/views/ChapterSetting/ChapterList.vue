<template>
  <div>
    <p style="text-align: right">
      <a-button type="primary" @click="listChapter">刷新数据</a-button>
    </p>
    <a-table
      :columns="columns"
      :data-source="list"
      row-key="cid"
      :loading="dataLoading"
      :pagination="false">
      <template v-slot:status="record">
        <p>
          <a-tag
            :color="record.status | getColorByStatus">
            {{ record.status | formatStatus }}
          </a-tag>
        </p>
        <p>
          <a-tag
            :color="record.type === 'FIRST_EXAM' ? '#87d068' : '#108ee9'">
            {{ record.type === 'FIRST_EXAM' ? '热身赛' : '资格赛' }}
          </a-tag>
        </p>
        <p>
          <a-tag
            :color="record.scope === 'GLOBAL' ? '#ff5500' : '#2db7f5'">
            {{ record.scope === 'GLOBAL' ? '全部人可答' : '指定人选可答' }}
          </a-tag>
        </p>
      </template>
      <template v-slot:time="record">
        {{ record.startTime | formatDataTime }} 至 {{ record.endTime | formatDataTime }}
      </template>
      <template v-slot:export="record">
        <p>
          <a
            target="_blank"
            download
            :href="`/manager/download/all/log/${record.cid}`"
            style="margin-right: 10px">导出全部人员的竞赛情况</a>
        </p>
        <p>
          <a
            target="_blank"
            download
            :href="`/manager/download/department/${record.cid}`"
            style="margin-right: 10px">导出各部门的竞赛情况</a>
        </p>
        <p>
          <a-button type="primary" @click="exportData(record)">导出指定部门数据</a-button>
        </p>
      </template>
      <template v-slot:action="record">
        <p>
          <a-popconfirm
            title="确认删除该章节吗？"
            placement="bottom"
            ok-text="删除"
            @confirm="delChapter(record)"
            cancel-text="取消">
            <a-button type="danger" style="margin-right: 10px">删除</a-button>
          </a-popconfirm>
        </p>
        <p>
          <a-button type="primary" @click="manageChapter(record)" style="margin-right: 10px;">编辑章节</a-button>
        </p>
        <p>
          <a-button type="primary" @click="manageQAInfo(record)" style="margin-right: 10px;">题目配置</a-button>
        </p>
        <p>
          <a-button type="primary" @click="manageQA(record)" style="margin-right: 10px">题目管理</a-button>
        </p>
        <p v-if="record.scope === 'SINGLE'">
          <a-button type="primary" @click="manageUser(record)">设置可答题人选</a-button>
        </p>
      </template>
    </a-table>
    <a-modal
      destroy-on-close
      :after-close="listChapter"
      title="题目管理"
      width="90%"
      v-model="qAListVisible"
      :footer="null">
      <QAList :cid="cid"/>
    </a-modal>
    <a-modal
      destroy-on-close
      title="导出指定部门数据"
      width="90%"
      v-model="deptListVisible"
      :footer="null">
      <DeptList :cid="cid"/>
    </a-modal>
    <a-modal
      destroy-on-close
      :after-close="listChapter"
      title="编辑章节"
      width="90%"
      v-model="manageChapterVisible"
      :footer="null">
      <ManageChapter :data="chapterData"/>
    </a-modal>
    <a-modal
      destroy-on-close
      title="设置可答题人选"
      width="90%"
      v-model="manageUserListVisible"
      :footer="null">
      <UserList :cid="cid"/>
    </a-modal>
    <a-modal
      destroy-on-close
      :after-close="listChapter"
      title="题目配置"
      width="90%"
      v-model="manageQAInfoVisible"
      :footer="null">
      <ManageQAInfo :data="chapterExamData"/>
    </a-modal>
  </div>
</template>
<script>
import DeptList from '@/views/DeptSetting/DeptList.vue';
import QAList from '../QASetting/QAList.vue';
import ManageChapter from './ManageChapter.vue';
import UserList from '../UserSetting/UserList.vue';
import ManageQAInfo from '../../components/ManageQAInfo.vue';
import { delChapter, listChapter } from '../../assets/api';

const STATUS_MSG = {
  UN_SET: '未配置',
  PUBLISH: '已开始',
  UN_PUBLISH: '未开始',
  EXPIRED: '已过期',
};

const STATUS_COLOR = {
  PUBLISH: 'green',
  UN_PUBLISH: 'blue',
  EXPIRED: 'orange',
};

const columns = [
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '总题数',
    dataIndex: 'questionCount',
  },
  {
    title: '状态',
    scopedSlots: {
      customRender: 'status',
    },
  },
  {
    title: '起止日期',
    scopedSlots: {
      customRender: 'time',
    },
  },
  {
    title: '导出数据',
    scopedSlots: {
      customRender: 'export',
    },
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
      cid: 0,
      qAListVisible: false,
      deptListVisible: false,
      dataLoading: false,
      delLoading: false,
      manageChapterVisible: false,
      manageUserListVisible: false,
      manageQAInfoVisible: false,
      chapterData: {},
      chapterExamData: {},
    };
  },
  filters: {
    getColorByStatus(status) {
      return STATUS_COLOR[status];
    },
    formatStatus(status) {
      return STATUS_MSG[status];
    },
    formatDataTime(date) {
      return (new Date(date)).toLocaleString();
    },
  },
  methods: {
    manageQAInfo(record) {
      this.manageQAInfoVisible = true;
      this.chapterExamData = record.examChapterData;
    },
    manageUser(record) {
      this.manageUserListVisible = true;
      this.cid = record.cid;
    },
    manageChapter(record) {
      this.manageChapterVisible = true;
      this.chapterData = record;
    },
    manageQA(record) {
      this.cid = record.cid;
      this.qAListVisible = true;
    },
    exportData(record) {
      this.cid = record.cid;
      this.deptListVisible = true;
    },
    async delChapter(record) {
      if (this.delLoading) {
        this.$message.warning('正在删除章节，请稍后');
        return;
      }
      const hide = this.$message.loading(`正在删除'${record.name}'章节...`, 0);
      this.delLoading = true;
      try {
        const { data } = await delChapter(record.cid);
        if (data.code === 400) {
          this.$message.warning(data.message);
          window.localStorage.setItem('hasUserInfo', '');
          window.localStorage.removeItem('hasUserInfo');
          this.$router.push('/login');
          return;
        }
        const ok = data.code === 200;
        if (ok) this.listChapter();
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
    async listChapter() {
      this.dataLoading = true;
      try {
        const { data } = await listChapter();
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
  components: {
    QAList,
    DeptList,
    ManageChapter,
    UserList,
    ManageQAInfo,
  },
  created() {
    this.listChapter();
  },
};
</script>

<style>
</style>
