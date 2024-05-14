export default class HTMLGeometry {
    constructor(dom_element) {
        this.dom_element = dom_element
    }
    get rect() {
        return this.dom_element.getBoundingClientRect()
    }
    get width() {
        return this.rect.width
    }
    get height() {
        return this.rect.height
    }
    get left() {
        return this.rect.left
    }
    get top() {
        return this.rect.top
    }
}