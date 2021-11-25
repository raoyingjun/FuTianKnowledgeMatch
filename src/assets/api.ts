import axios from './CustomAxios';

const login = (userInfo: {
  imageCode: string,
  username: string,
  password: string
}) => axios({
  url: '/login',
  method: 'post',
  params: userInfo,
});

const logout = () => axios({
  url: '/logout',
});

const addChapter = (chapterInfo: {
  name: string,
  scope: 'GLOBAL' | 'SINGAL',
  type: 'FIRST_EXAM' | 'REPEATED_EXAM',
  startTime: string,
  endTime: string
}) => axios({
  url: '/manager/chapter',
  method: 'post',
  data: chapterInfo,
});

const addUserToChapter = (examUserInfo: {
  chapterId: number,
  userId: number
}) => axios({
  url: '/manager/chapter/exam/user',
  method: 'post',
  data: examUserInfo,
});

const delUserFromChapter = (cid: number, uid: number) => axios({
  url: `/manager/chapter/exam/user/${cid}/${uid}`,
  method: 'delete',
});

const updateChapter = (chapterInfo: {
  name: string,
  scope: 'GLOBAL' | 'SINGAL',
  type: 'FIRST_EXAM' | 'REPEATED_EXAM',
  startTime: string,
  endTime: string
}) => axios({
  url: '/manager/chapter',
  method: 'put',
  data: chapterInfo,
});

const updateChapterConfig = (chapterConfig: {
  cid: number,
  examNum: number,
  examTime: number,
  multiScore: number,
  multiSize: number,
  singleScore: number,
  singleSize: number,
  tfScore: number,
  tfSize: number,
  totalScore: number,
  totalSize: number
}) => axios({
  url: '/manager/chapter/data',
  method: 'put',
  data: chapterConfig,
});

const delChapter = (id: number) => axios({
  url: `/manager/chapter/${id}`,
  method: 'delete',
});

const listChapter = () => axios({
  url: '/manager/chapters',
});

const addDept = (deptInfo: {
  name: string,
  pdid: number
}) => axios({
  url: '/manager/department',
  method: 'post',
  data: deptInfo,
});

const delDept = (id: number) => axios({
  url: `/manager/department/${id}`,
  method: 'delete',
});

const listDept = (page: number, pdid: number) => axios({
  url: `/manager/department/${page}/${pdid}`,
});

const delQA = (cid: number, qid: number) => axios({
  url: '/manager/deleteQuestion',
  method: 'post',
  params: { cid, qid },
});

const listQA = (cid: number, page: number) => axios({
  url: `/manager/question/${cid}/list/${page}`,
});

const delUser = (id: number) => axios({
  url: `/manager/user/${id}`,
  method: 'delete',
});

const listUser = (page: number, filter: {
  type: string,
  name: string
  added?: boolean,
  chapterId?: number
}) => axios({
  url: filter.chapterId ? `/manager/chapter/exam/condition/${page}` : `/manager/user/list/${page}`,
  params: filter,
});

const delCarousel = (id: number) => axios({
  url: `/manager/image/${id}`,
  method: 'delete',
});

const listCarousel = () => axios({
  url: '/manager/image/list',
});

const setRole = (uid: number, rid: 1 | 2) => axios({
  url: `/manager/role/${uid}/${rid}`,
});

export {
  login,
  logout,
  addChapter,
  addUserToChapter,
  delUserFromChapter,
  updateChapter,
  updateChapterConfig,
  delChapter,
  listChapter,
  addDept,
  delDept,
  listDept,
  delQA,
  listQA,
  delUser,
  listUser,
  delCarousel,
  listCarousel,
  setRole,
};
