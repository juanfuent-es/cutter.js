import {
    gsap
} from "gsap"
export default class HTMLGeometry {
    constructor(dom_element) {
        this.dom_element = dom_element
        this.zoom = 1
        this.pos = {
            x: 0,
            y: 0
        }
    }

    set(_x, _y) {
        this.pos.x = _x
        this.pos.y = _y
    }

    to(_x = null, _y = null) {
        this.pos.x = _x
        this.pos.y = _y
        this.dom_element.setAttribute("x", this.pos.x)
        this.dom_element.setAttribute("y", this.pos.y)
    }

    scaleTo(_scale = 1) {
        this.zoom = _scale
        this.dom_element.style.scale = this.zoom
    }

    resize(_width = null, _height = null) {
        gsap.set(this.dom_element, {
            width: _width,
            height: _height
        })
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
        if (this.scale == 1) {
            return this.rect.width
        } else {
            return this.getAttr("width")
        }
    }
    get height() {
        if (this.scale == 1) {
            return this.rect.height
        } else {
            return this.getAttr("height")
        }
    }

    get scale() {
        return (this.rect.width / this.getAttr("width"))
    }

    getAttr(_attr) {
        return Number(this.dom_element.getAttribute(_attr).replace("px", ""))
    }
}