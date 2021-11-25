import axios from 'axios';
// 添加响应拦截器
axios.interceptors.response.use(undefined, (error) => {
  if (error.response) {
    let msg = '';
    // 401登录未授权。账号可能被顶了，使用服务器的返回消息，否则使用通用错误消息
    if (error.response.status === 401) {
      msg = error.response.data;
      window.location.href = '/#/login';
    } else msg = '服务器响应出错';
    // eslint-disable-next-line no-param-reassign
    error.message = msg;
  } else if (error.request) {
    // eslint-disable-next-line no-param-reassign
    error.message = '服务器未响应';
  } else {
    // eslint-disable-next-line no-param-reassign
    error.message = '请求出错';
  }
  console.log('AJAX ERROR：\n', error);
  return Promise.reject(error);
});

export default axios;
