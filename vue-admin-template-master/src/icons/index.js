import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('svg-icon', SvgIcon)


// 将所有的svg图片引入统一打包，不打包后面的项目就没法引用
const req = require.context('./svg', false, /\.svg$/)//webpack里面的语法
const requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
