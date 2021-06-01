import { createStore } from 'vuex'
import { Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { h } from 'vue'

import Element from '../models/element'

import Page from '../models/page'
import Work from '../models/work'
import testJson from './test.json'

function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

const defaultState = {
  work: null,
  editingPage: null,
  editingElement: null
}

export default createStore({
  state() {
    return defaultState
  },
  mutations: {
    elementManager(state, { type, value }) {
      const { editingPage, editingElement } = state
      const { elements } = editingPage

      const add = () => {
        const { props, extra } = value.component
        const element = new Element({
          props,
          width: state.work.width,
          extra,
          ...value
        })
        elements.push(element)
      }

      const copy = () => {
        elements.push(editingElement.clone())
      }
      const remove = () => {
        const index = elements.findIndex((e) => e.uuid === editingElement.uuid)
        if (index !== -1) {
          Modal.confirm({
            title: '确定删除吗？',
            icon: h(ExclamationCircleOutlined),

            onOk: (close) => {
              editingPage.elements.splice(index, 1)
              close()
            }
          })
        }
        state.editingElement = null
      }

      const handlers = {
        copy,
        add,
        remove
      }
      handlers[type]()
    },

    setEditingElement(state, payload) {
      state.editingElement = payload
    },
    setEditingPage(state, pageIndex = 0) {
      state.editingPage = state.work.pages[pageIndex]
    },
    setWork(state, work) {
      work.pages = work.pages.map((page) => {
        page.elements = page.elements.map((element) => new Element(element))
        return new Page(page)
      })
      state.work = new Work(work)
    }
  },
  actions: {
    setEditingElement({ commit }, payload) {
      commit('setEditingElement', payload)
    },
    async fetchWork({ commit }) {
      await sleep(600)
      commit('setWork', testJson)
      commit('setEditingPage')
    }
  },
  getters: {}
})
