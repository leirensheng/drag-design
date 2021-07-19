import { guid } from '@/utils/element'
import commonProps from '../views/editor/components/commonProps'
// #! 编辑状态，不可以点击的按钮，因为点击按钮会触发一些默认动作，比如表单提交等
const disabledPluginsForEditMode = [
  'lbp-form-input',
  'lbp-form-button',
  'lbp-video'
]
const cloneObj = (value) => JSON.parse(JSON.stringify(value))

function getUUID(ele) {
  const numberReg = /^\d+$/
  return !ele.uuid || numberReg.test(ele.uuid) || !ele.uuid.includes('_')
    ? `${ele.name}_${guid()}`
    : ele.uuid
}

export default class Element {
  constructor(ele) {
    this.name = ele.name
    if (this.name === 'Container') {
      this.children = []
    }
    this.pluginType = ele.name
    this.uuid = getUUID(ele)
    this.pluginProps = this.getPluginProps(ele)
    this.commonProps = this.getCommonProps(ele)
    this.events = []
    this.methodList = ele.methodList || []
    this.scripts = ele.scripts || []
    this.animations = ele.animations || []
  }

  clone() {
    return new Element({
      name: this.name,
      pluginProps: this.pluginProps
    })
  }

  getCommonProps(ele) {
    // 复制的时候调用
    if (typeof ele.commonProps === 'object') {
      return cloneObj({ ...ele.commonProps, uuid: this.uuid })
    }

    const res = {
      uuid: this.uuid
    }
    Object.keys({ ...commonProps }).forEach((key) => {
      const defaultValue = commonProps[key].default
      res[key] =
        typeof defaultValue === 'function' ? defaultValue() : defaultValue
    })
    return res
  }

  getPluginProps(ele) {
    // 复制的时候调用
    if (typeof ele.pluginProps === 'object') {
      return cloneObj({ ...ele.pluginProps, uuid: this.uuid })
    }

    const { props = {}, shortcutProps = {} } = ele
    const pluginProps = {
      uuid: this.uuid
    }
    Object.keys({ ...props }).forEach((key) => {
      const defaultValue = props[key].default
      pluginProps[key] =
        typeof defaultValue === 'function' ? defaultValue() : defaultValue
    })
    return {
      ...pluginProps,
      ...shortcutProps
    }
  }
}
