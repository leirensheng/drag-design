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
    elementManager(state, { type, value, parentUuid }) {
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
        this.commit('setEditingElement', element)
      }

      const copy = () => {
        elements.push(editingElement.clone())
      }

      const remove = () => {
        const handleRemove = (source, allIds) => {
          const curId = allIds.shift()
          const i = source.findIndex((one) => one.uuid === curId)
          if (allIds.length) {
            const target = source[i]
            handleRemove(target.children, allIds)
          } else {
            source.splice(i, 1)
          }
        }
        const allIds = [...parentUuid.split('~'), editingElement.uuid].filter(
          Boolean
        )
        Modal.confirm({
          title: '确定删除吗？',
          icon: h(ExclamationCircleOutlined),

          onOk: (close) => {
            handleRemove(elements, allIds)
            state.editingElement = null
            close()
          }
        })
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
