import plugins from '../plugins'

export default (app) => {
  const modules = import.meta.glob('../global/*.vue')

  Object.values(modules).forEach((loader) => {
    loader().then((mod) => {
      app.component(mod.default.name, mod.default)
    })
  })
  plugins.forEach(({ component, name }) => {
    app.component(name, component)
  })
}
