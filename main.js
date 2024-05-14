const PX_RATIO = window.devicePixelRatio
/*
 * Re-maps a number from one range to another. Thank's processing
 * @see: https://processing.org/reference/map_.html
 */
Math.map = (n, start, stop, start2, stop2) => {
    const newval = (n - start) / (stop - start) * (stop2 - start2) + start2
    return newval
}

import HTMLGeometry from "./geometry"
import {
    gsap
} from "gsap"

class Cutter {
    constructor(_svg) {
        this.container = _svg
        this.offset = {
            x: 0,
            y: 0
        }
        //
        this.dragging = false
        this.drag = new HTMLGeometry(this.container.querySelector(".drag"))
        this.clip = new HTMLGeometry(this.container.querySelector(".clip"))
        this.ghost = new HTMLGeometry(this.container.querySelector(".ghost"))
        this.img = new HTMLGeometry(this.container.querySelector(".img"))
        //this.fitSetup()
        this.events()
    }

    fitSetup() {
        let clip_width = this.clip.width
        let clip_height = this.clip.height
        //
        let img_width = this.img.width
        let img_height = this.img.height
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
        //
    }
    //events
    onDragDown(e) {
        this.dragging = true
        gsap.to(this.drag.dom_element, {
            transformOrigin: "center center",
            duration: .15,
            x: 250,
            y: 250,
            scaleX: .65,
            scaleY: .65,
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
            transformOrigin: "center center",
            duration: .15,
            x: 250,
            y: 250,
            scaleX: 1,
            scaleY: 1,
            opacity: 1
        })
    }

    dragTo(_x, _y) {
        let cropTo = this.updateOffsets(_x, _y)
        this.cutter(cropTo)
    }

    cutter(_to) {
        let min_x = this.img.width - this.clip.width - this.clip.x
        let min_y = this.img.height - this.clip.height - this.clip.y
        // console.log()
        // 
        const _x = Math.map(_to.x, 0, 100, this.clip.x, -min_x)
        const _y = Math.map(_to.y, 0, 100, this.clip.y, -min_y)

        this.img.to(_x, _y)
        this.ghost.to(_x, _y)
    }

    updateOffsets(_x = 0, _y = 0) {
        let _width = this.clip.width
        let x = (~~(_x * 100) / _width)
        x = Math.max(x, 0)
        x = Math.min(x, 100)
        //
        let _height = this.clip.height
        let y = (~~(_y * 100) / _height)
        y = Math.max(y, 0)
        y = Math.min(y, 100)
        return {
            x: ~~x,
            y: ~~y
        }
    }
}
const svg = document.querySelector("#app")
const move = new Cutter(svg)