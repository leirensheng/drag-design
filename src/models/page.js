import Element from './element'

class Page {
  constructor(page = {}) {
    this.uuid = page.uuid || Date.now()
    this.title = page.title || ''
    this.elements = page.elements || []
  }

  clone() {
    const elements = this.elements.map((element) => new Element(element))
    return new Page({ title: this.title, elements })
  }
}

export default Page
