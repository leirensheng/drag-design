import { reactive } from 'vue'
// 获取 string path 对应的 value
function getVMVal(vm, exp) {
  const val = vm
  exp = exp.split('.')
  return exp.reduce((prev, k) => {
    return prev[k] || {}
  }, val)
}

export default function bindData(obj) {
  const ds = reactive({ DS: {} })
  // 插值替换 <span>{{a}}<spam> => {a: 10}=> <span>10</span>
  // https://zhuanlan.zhihu.com/p/25680606
  const reg = /\{\{(.*?)\}\}/g
  const newObj = JSON.parse(
    JSON.stringify(obj).replace(reg, (match, exp) => {
      // 表达式包含数组：dataCenter.page[0].title
      // https://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-and-arays-by-string-path
      exp = exp.trim().replace(/\[(\w+)\]/g, '.$1') // convert indexes to properties
      exp = exp.replace(/^\./, '') // strip a leading dot
      if (/DS\./.test(exp)) {
        return getVMVal(ds, exp)
      }
      return exp
    })
  )
  return newObj
}
