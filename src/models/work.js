import { PAGE_MODE } from '../constants/work'
import Page from './page'

export default class Work {
  constructor(work = {}) {
    this.id = work.id
    this.title = work.title || '标题'
    this.description = work.description || '描述'
    this.pages = work.pages || [new Page()]

    this.cover_image_url = ''

    this.is_publish = !!work.is_publish
    this.is_template = false
    this.width = work.width || 320
    this.height = work.height || 568
    this.page_mode = work.page_mode || PAGE_MODE.SWIPPER_PAGE
  }
}
