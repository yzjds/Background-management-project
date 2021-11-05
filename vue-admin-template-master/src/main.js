import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
// Vue.prototype.$msgbox = MessageBox;
// Vue.prototype.$confirm = MessageBox.confirm;

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon    //引入所有的svg图片 
import '@/permission' // 引入token校验相关（和权限也有关系）

// import trademark from "@/api/product/trademark"
// import {default as trademark} from "@/api/product/trademark"
// Vue.prototype.$API = trademark
// this.$API.addOrUpdate()
// 这样的方法，你只能把trademark相关的api拿到，也就是说$API就只有trademark的接口
// 后期我们还要写attr相关的api，$API内部就没有attr相关的接口

import *as API from "@/api/product"
Vue.prototype.$API = API

// 因为下面这个组件在两个组件都用到了，所以进行全局注册更方便
import CategorySelector from "@/components/CategorySelector"
Vue.component('CategorySelector',CategorySelector)

// 注册全局组件HintButton
import HintButton from "@/components/HintButton"
Vue.component('HintButton',HintButton)

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
