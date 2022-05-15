import { createStore } from 'vuex'

type Theme = 'light' | 'dark'

export interface State { theme: Theme }

const state: State = { theme: 'light' }

export default createStore({
  state,
  mutations: {
    setTheme(state, newValue: Theme) {
      state.theme = newValue
    },
    toggleTheme(state) {
      state.theme = state.theme === 'light' ? 'dark' : 'light'
    }
  },
  actions: {
  },
  modules: {
  }
})
