import { createStore } from 'vuex'
import { swapZindex } from '@/utils/element'
import { Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { h, defineComponent } from 'vue'

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
    /**
     * 元素管理：增/删/复制/上移/下移
     * @param {*} state
     * @param {*} {
     *  type:  add/copy/delete/move2Top/move2Bottom 增/删/复制/上移/下移
     *  value(elementShortcutConfig) 左侧元素列表中元素对应的配置，主要包含：
     *   - shortcutProps：默认Props，比如一个Chart是饼图、折线图、漏斗图，可以通过此指定
     *   - dragStyle：用于拖拽结束，确定最终放置的位置, // {left: Number, top: Number}
     * }
     */
    elementManager(state, { type, value }) {
      const { editingPage, editingElement } = state
      const { elements } = editingPage
      const len = elements.length

      const add = () => {
        const { props, extra } = value.component
        const element = new Element({
          props,
          extra,
          ...value,
          zindex: len + 1
        })
        elements.push(element)
      }

      const copy = () => {
        elements.push(editingElement.clone({ zindex: len + 1 }))
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
      const move2Bottom = () => {
        const index = elements.findIndex((e) => e.uuid === editingElement.uuid)
        elements.splice(index, 1)
        const newElements =
          type === 'move2Top'
            ? [...elements, editingElement]
            : [editingElement, ...elements]
        newElements.forEach((ele, i) => {
          ele.commonStyle.zindex = i + 1
        })
        editingPage.elements = newElements
      }
      const move2Top = move2Bottom

      const addZindex = () => {
        const maxZindex = elements.length
        const eleZindex = editingElement.commonStyle.zindex
        if (eleZindex === maxZindex && type === 'addZindex') return
        if (eleZindex === 1 && type === 'minusZindex') return

        const direction = type === 'addZindex' ? 1 : -1
        const swapElement = elements.find(
          (ele) => ele.commonStyle.zindex === eleZindex + direction
        )
        swapZindex(editingElement, swapElement)
      }

      const minusZindex = addZindex

      const handlers = {
        copy,
        add,
        remove,
        move2Bottom,
        move2Top,
        addZindex,
        minusZindex
      }
      handlers[type]()
    },
    setElementCommonStyle(state, payload) {
      state.editingElement.commonStyle = {
        ...state.editingElement.commonStyle,
        ...payload
      }
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
      // payload && window.EditorApp.$emit('setEditingElement', payload)
    },
    async fetchWork({ commit }, workId) {
      await sleep(600)
      commit('setWork', testJson)
      commit('setEditingPage')
    }
  },
  getters: {}
})
