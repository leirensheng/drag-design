import mitt from 'mitt'

const eventBus = mitt()

export default (app) => {
  app.config.globalProperties.$eventBus = eventBus
  app.config.globalProperties.$uniqueId = () => {
    return Math.random().toString(16).slice(-6)
  }
}
