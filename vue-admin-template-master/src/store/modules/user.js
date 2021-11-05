import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: ''
  }
}
const state = getDefaultState()
//就相当于
/* const state = {
  token: getToken(),
    name: '',
    avatar: ''
} */

const mutations = {
  RESET_STATE: (state) => {
    // Object.assign合并后面的对象的属性 到 前面的对象当中
    Object.assign(state, getDefaultState())
    /* 
      state如下（属性值是随意写的）
      {
        token:getToken(),
        name:'admin',
        avatar:'xxx'
      }

      getDefaultState()
      {
        token:getToken(),
        name:'',
        avatar:''
      }
    */
    /* 
      上面的代码相当于
      相当于退出登录之后state当中的token及用户信息清空，上面一行代码就是这样
      state.token='',
      state.name ='',
      state.avatar=''
    */
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  }
}

const actions = {
  // user login
  /* login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        setToken(data.token)//原先咱们是吧获取到的token保存在localStorage，而这里它是保存在cookies
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }, */

  async login({ commit }, userInfo){
    
      const result = await login(userInfo)
      if(result.code === 20000){
        commit('SET_TOKEN', result.data.token)
        setToken(result.data.token)
        // resolve()
        return 'ok'
      }else{
        return Promise.reject(new Error('failed'))
      }
   
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // 把cookies内部的token删除掉
        resetRouter() //退出之后重置路由
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

