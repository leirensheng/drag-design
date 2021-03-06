import app from '@/app'
import { parsePx, guid } from '@/utils/element'
import bindData from '@/utils/data-binding'

// #! 编辑状态，不可以点击的按钮，因为点击按钮会触发一些默认动作，比如表单提交等
const disabledPluginsForEditMode = [
  'lbp-form-input',
  'lbp-form-button',
  'lbp-video'
]
const cloneObj = (value) => JSON.parse(JSON.stringify(value))

const defaultStyle = {
  top: 100,
  left: 100,
  width: 100,
  height: 40,
  zindex: 1,
  textAlign: 'center',
  color: '#000000',
  backgroundColor: 'rgba(255, 255, 255, 0)',
  fontSize: 14,
  margin: {
    top: {
      value: 0,
      unit: 'px'
    },
    right: {
      value: 0,
      unit: 'px'
    },
    bottom: {
      value: 0,
      unit: 'px'
    },
    left: {
      value: 0,
      unit: 'px'
    }
  },
  padding: {
    top: {
      value: 0,
      unit: 'px'
    },
    right: {
      value: 0,
      unit: 'px'
    },
    bottom: {
      value: 0,
      unit: 'px'
    },
    left: {
      value: 0,
      unit: 'px'
    }
  },
  border: {
    top: {
      value: 0,
      unit: 'px'
    },
    right: {
      value: 0,
      unit: 'px'
    },
    bottom: {
      value: 0,
      unit: 'px'
    },
    left: {
      value: 0,
      unit: 'px'
    },
    color: {
      value: '#000'
    },
    style: {
      value: 'solid'
    }
  },
  'border-style': 'solid',
  boxModelPart: '' // 可选值 margin、padding、border
}

function getUUID(ele) {
  const numberReg = /^\d+$/
  return !ele.uuid || numberReg.test(ele.uuid) || !ele.uuid.includes('_')
    ? `${ele.name}_${guid()}`
    : ele.uuid
}

function getCommonStyle(ele) {
  if (typeof ele.commonStyle === 'object') {
    return cloneObj({ ...defaultStyle, ...ele.commonStyle })
  }
  return {
    ...defaultStyle,
    zindex: ele.zindex,
    ...(ele.extra && ele.extra.defaultStyle),
    ...ele.dragStyle // 拖拽结束落点的top、left
  }
}

export default class Element {
  constructor(ele) {
    this.name = ele.name
    this.pluginType = ele.name
    this.uuid = getUUID(ele)

    this.pluginProps = this.getPluginProps(ele)
    this.commonStyle = getCommonStyle(ele)
    this.events = []
    this.methodList = ele.methodList || []

    this.scripts = ele.scripts || []
    this.animations = ele.animations || []
  }

  getPluginProps(ele) {
    if (typeof ele.pluginProps === 'object') {
      return cloneObj({ ...ele.pluginProps, uuid: this.uuid })
    }
    return this.getDefaultPluginProps(ele)
  }

  // init prop of plugin
  getDefaultPluginProps(ele) {
    const { props = {}, shortcutProps = {} } = ele

    const pluginProps = {
      uuid: this.uuid
    }
    Object.keys(props).forEach((key) => {
      const defaultValue = props[key].default
      pluginProps[key] =
        typeof defaultValue === 'function' ? defaultValue() : defaultValue
    })

    return {
      ...pluginProps,
      ...shortcutProps
    }
  }

  packPosData(obj, prefix) {
    const init = {}
    Object.keys(obj).forEach((key) => {
      init[`${prefix}-${key}`] = obj[key].value + (obj[key].unit || '')
    })
    return init
  }

  packBorderData() {
    const { top, right, bottom, left, color, style } = this.commonStyle.border
    return {
      /**
       * 使用 border-left border-right 等方式，在 chrome 浏览器中会导致渲染问题
       * 这里就将他拼接成完整的 border-width解决bug，不知道是什么原因
       */
      'border-width': `${top.value}${top.unit} ${right.value}${right.unit} ${bottom.value}${bottom.unit} ${left.value}${left.unit} `,
      'border-style': style.value,
      'border-color': color.value
    }
  }

  getStyle({ position = 'static', isRem = false, isNodeWrapper = true } = {}) {
    if (this.name === 'lbp-background' || !isNodeWrapper) {
      return {
        width: '100%',
        height: '100%'
      }
    }
    const { pluginProps } = this
    const { commonStyle } = this
    const { margin, padding } = commonStyle
    // 由于在 defaultStyle 定义的时候是对象，这里需要将数据重新组装成 margin-top 这种形式
    const boxModel = {
      ...this.packPosData(margin, 'margin'),
      ...this.packPosData(padding, 'padding'),
      ...this.packBorderData()
    }
    const style = {
      top: parsePx(pluginProps.top || commonStyle.top, isRem),
      left: parsePx(pluginProps.left || commonStyle.left, isRem),
      width: parsePx(pluginProps.width || commonStyle.width, isRem),
      height: parsePx(pluginProps.height || commonStyle.height, isRem),
      fontSize: parsePx(pluginProps.fontSize || commonStyle.fontSize, isRem),
      ...boxModel,
      color: pluginProps.color || commonStyle.color,
      // backgroundColor: pluginProps.backgroundColor || commonStyle.backgroundColor,
      textAlign: pluginProps.textAlign || commonStyle.textAlign,
      'z-index': commonStyle.zindex,
      position
    }
    return style
  }

  getProps({ mode = 'edit' } = {}) {
    const pluginProps =
      mode === 'preview' ? bindData(this.pluginProps, window) : this.pluginProps
    return {
      ...pluginProps,
      disabled:
        disabledPluginsForEditMode.includes(this.name) && mode === 'edit'
    }
  }

  getAttrs() {
    const attrs = {
      'data-uuid': this.uuid
    }

    if (this.animations.length > 0) {
      const animation = this.animations[0]
      attrs['data-swiper-animation'] = animation.type // "fadeIn"
      attrs['data-duration'] = `${animation.duration}s` // ".5s"
      attrs['data-delay'] = `${animation.delay}s` // "1s"
    }
    return attrs
  }

  getPreviewData({
    position = 'static',
    isRem = false,
    mode = 'preview',
    isNodeWrapper = true
  } = {}) {
    const data = {
      // 与 edit 组件保持样式一致
      style: this.getStyle({ position, isNodeWrapper }),
      props: this.getProps({ mode }),
      attrs: this.getAttrs(),
      nativeOn: this.getEventHandlers()
    }
    return data
  }

  clone({ zindex = this.commonStyle.zindex + 1 } = {}) {
    return new Element({
      zindex,
      name: this.name,
      pluginProps: this.pluginProps,
      commonStyle: {
        ...this.commonStyle,
        top: this.commonStyle.top + 20,
        left: this.commonStyle.left + 20,
        zindex
      }
    })
  }

  getEventHandlers() {
    const Ctor = app.component(this.uuid)
    const vm = new Ctor()
    const handlers = this.methodList.reduce((handlers, method) => {
      // bind is fine too：handlers[method.trigger] = vm[method.name].bind(vm, method.arguments)
      handlers[method.trigger] = () =>
        vm[method.name].apply(vm, method.arguments)
      return handlers
    }, {})
    return handlers
  }
}
