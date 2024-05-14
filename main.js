import HTMLGeometry from "./geometry"
import {
    gsap
} from "gsap"

class Cutter {
    constructor(_svg) {
        this.container = _svg
        this.drag = false
        this.drag = new HTMLGeometry(this.container.querySelector(".drag"))
        this.clip = new HTMLGeometry(this.container.querySelector(".clip"))
        this.img = new HTMLGeometry(this.container.querySelector("image"))
        //this.fitSetup()
        this.events()
    }

    fitSetup() {
        let clip_width = this.clip.dom_element.getAttribute("width")
        let clip_height = this.clip.dom_element.getAttribute("height")
        //
        let img_width = this.img.dom_element.getAttribute("width")
        let img_height = this.img.dom_element.getAttribute("height")
        //
        const rect = fitImage(clip_width, clip_height, img_width, img_height)
        this.img.dom_element.setAttribute("x", rect.x)
        this.img.dom_element.setAttribute("y", rect.y)
        this.img.dom_element.setAttribute("width", rect.width)
        this.img.dom_element.setAttribute("height", rect.height)
    }

    events() {
        //mouse
        this.drag.dom_element.addEventListener('mousedown', e => this.onDragDown(e))
        document.addEventListener('mousemove', e => this.onDragMove(e))
        document.addEventListener('mouseup', e => this.onDragUp(e))
        // touch
        this.drag.dom_element.addEventListener('touchstart', e => this.onDragDown())
        document.addEventListener('touchmove', e => this.onDragMove())
        document.addEventListener('touchend', e => this.onDragUp())
    }
    //events
    onDragDown(e) {
        this.dragging = true
        gsap.to(this.drag.dom_element, {
            duration: .25,
            x: 250,
            y: 250,
            scaleX: .35,
            scaleY: .35,
            opacity: 0
        })
    }

    onDragMove(e) {
        let point = e.touches ? e.touches[0] : e
        if (this.dragging) {
            let _x = point.clientX - this.clip.left
            //
            let _y = point.clientY - this.clip.top
            //
            this.dragTo(_x, _y)
        }
    }

    onDragUp(e) {
        this.dragging = false
        gsap.to(this.drag.dom_element, {
            duration: .15,
            x: 250,
            y: 250,
            scaleX: 1,
            scaleY: 1,
            opacity: 1
        })
    }

    dragTo(_x, _y) {
        this.img.dom_element.setAttribute("x", _x)
        this.img.dom_element.setAttribute("y", _y)
    }

}
const svg = document.querySelector("#app")
const move = new Cutter(svg)