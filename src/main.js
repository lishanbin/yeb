import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue'
import router from './router'
import store from './store';
import 'font-awesome/css/font-awesome.css'

import { postRequest } from "./utils/api";
import { putRequest } from "./utils/api";
import { getRequest } from "./utils/api";
import { deleteRequest } from "./utils/api";
import { initMenu } from "./utils/menu";
import { downloadRequest } from './utils/download';

Vue.config.productionTip = false
Vue.use(ElementUI, { size: 'small' });
//插件的形式使用请求
Vue.prototype.postRequest = postRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.getRequest = getRequest;
Vue.prototype.deleteRequest = deleteRequest;

Vue.prototype.downloadRequest = downloadRequest;

router.beforeEach((to, from, next) => {
  if (window.sessionStorage.getItem('tokenStr')) {
    initMenu(router, store);
    if (!window.sessionStorage.getItem('user')) {
      //判断用户信息是否存在
      return getRequest('/api/Student/Student', { 'id': window.sessionStorage.getItem('stuId') }).then(resp => {
        if (resp) {
          window.sessionStorage.setItem('user', JSON.stringify(resp.data));
          next();
        }
      });
    }
    next();
  } else {
    if (to.path == '/') {
      next();
    } else {
      next('/?redirect=' + to.path);
    }
  }

})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
