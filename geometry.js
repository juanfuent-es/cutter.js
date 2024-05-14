const PX_RATIO = window.devicePixelRatio
import {
    gsap
} from "gsap"
export default class HTMLGeometry {
    constructor(dom_element) {
        this.dom_element = dom_element
        this.pos = {
            x: 0,
            y: 0
        }
    }

    to(_x = null, _y = null) {
        gsap.to(this.pos, {
            ease: "power0.linear",
            duration: .1,
            overwrite: true,
            x: (_x || this.pos.x),
            y: (_y || this.pos.y),
            onUpdate: () => {
                this.dom_element.setAttribute("x", this.pos.x)
                this.dom_element.setAttribute("y", this.pos.y)
            }
        })
    }

    resize(_width = null, _height = null) {
        this.dom_element.setAttribute("width", (_width || this.width))
        this.dom_element.setAttribute("height", (_height || this.height))
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