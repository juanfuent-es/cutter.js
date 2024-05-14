export default class HTMLGeometry {
    constructor(dom_element) {
        this.dom_element = dom_element
    }
    get rect() {
        return this.dom_element.getBoundingClientRect()
    }
    //dom position
    get left() {
        return this.rect.left
    }
    get top() {
        return this.rect.top
    }
    //svg pos
    get x() {
        return this.getAttr("x")
    }
    get y() {
        return this.getAttr("y")
    }
    //size
    get width() {
        return this.getAttr("width")
    }
    get height() {
        return this.getAttr("height")
    }

    getAttr(_attr) {
        return Number(this.dom_element.getAttribute(_attr))
    }
}