const PX_RATIO = window.devicePixelRatio
/*
 * Re-maps a number from one range to another. Thank's processing
 * @see: https://processing.org/reference/map_.html
 */
Math.map = (n, start, stop, start2, stop2) => {
    const newval = (n - start) / (stop - start) * (stop2 - start2) + start2
    return newval
}

Math.clamp = (value, min, max) => {
    return Math.min(Math.max(min, value), max)
}

import HTMLGeometry from "./geometry"
import normalizeWheel from 'normalize-wheel'

export default class Cutter extends HTMLGeometry {
    constructor(_svg) {
        super(_svg)
        this.zoom = 1
        this.pos = {
            x: 0,
            y: 0
        }
        this.offset = {
            x: 0,
            y: 0
        }
        this.offset_x = {
            min: 0,
            max: 0
        }
        this.offset_y = {
            min: 0,
            max: 0
        }
        //
        this.drag = false
        //
        this.clip_selector = this.dom_element.querySelector(".clip")
        this.ghost_selector = this.dom_element.querySelector(".ghost")
        this.img_element = this.dom_element.querySelector(".img")
        //
        this.random_img = new Image()
        this.random_img.onload = () => this.onLoad()
        this.random_img.src = "https://source.unsplash.com/random"

    }

    onLoad() {
        this.setImg(this.ghost_selector)
        this.setImg(this.img_element)
        //
        this.ghost = new HTMLGeometry(this.ghost_selector)
        this.clip = new HTMLGeometry(this.clip_selector)
        this.img = new HTMLGeometry(this.img_element)
        //
        this.cover = this.fit()
        this.ghost.resize(this.cover.width, this.cover.height)
        this.ghost.to(this.cover.x, this.cover.y)
        this.img.to(this.cover.x, this.cover.y)
        this.img.resize(this.cover.width, this.cover.height)
        //
        this.offset_x = {
            min: -this.cover.x,
            max: this.cover.x
        }
        this.offset_y = {
            min: -this.cover.y,
            max: this.cover.y
        }
        //
        this.events()
    }

    setImg(_element) {
        _element.setAttribute('xlink:href', this.random_img.src)
        _element.setAttribute('width', this.width)
        _element.setAttribute('height', this.height)
    }

    get width() {
        return this.random_img.naturalWidth
    }

    get height() {
        return this.random_img.naturalHeight
    }

    events() {
        this.sensible = this.dom_element.querySelector(".sensible")
        this.hammertime = new Hammer(this.sensible)
        this.hammertime.get('pinch').set({
            enable: true
        })
        this.hammertime.on('pinch pinchmove', ev => {

        })

        //mouse
        this.sensible.addEventListener('mousedown', e => this.onDragDown(e))
        document.addEventListener('mousemove', e => this.onDragMove(e))
        document.addEventListener('mouseup', e => this.onDragUp(e))
        // touch
        this.sensible.addEventListener('touchstart', e => this.onDragDown(e))
        document.addEventListener('touchmove', e => this.onDragMove(e))
        document.addEventListener('touchend', e => this.onDragUp(e))
        //zoom wheel
        document.addEventListener('wheel', e => this.onWheel(e))
    }

    fit() {
        const mask_width = this.clip.width
        const mask_height = this.clip.height
        const mask_aspect = mask_width / mask_height
        const aspect = this.width / this.height
        //
        const width = mask_aspect > aspect ? mask_width : mask_height * aspect
        let scale = width / this.width
        //
        const scaled_width = Math.round(this.width * scale)
        const scaled_height = Math.round(this.height * scale)
        return {
            scale: scale,
            width: scaled_width,
            height: scaled_height,
            x: this.clip.x + Math.ceil((mask_width - scaled_width) / 2),
            y: this.clip.y + Math.ceil((mask_height - scaled_height) / 2)
        }
    }

    onWheel(e) {
        const delta = Math.sign(e.deltaY)
        this.zoom += delta * .025
        this.zoom = Math.clamp(this.zoom, -10, 10)
        const w_scaled = this.width * this.zoom
        const h_scaled = this.height * this.zoom
        // const normalized = normalizeWheel(e)
        if (w_scaled >= this.clip.width && h_scaled >= this.clip.height) {
            this.img.scaleTo(this.zoom)
            this.ghost.scaleTo(this.zoom)
        }
        this.updateOffsets()
    }
    //events
    onDragDown(e) {
        let point = e.touches ? e.touches[0] : e
        this.drag = true
        this.dom_element.classList.add("dragging")
        let _x = (point.clientX - this.clip.x)
        let _y = (point.clientY - this.clip.y)
        this.pos = {
            x: _x,
            y: _y
        }
    }

    onDragMove(e) {
        let point = e.touches ? e.touches[0] : e
        if (this.drag) {
            // let _x = (point.clientX - this.clip.x)
            // let _y = (point.clientY - this.clip.y)
            // this.offset.x = _x - this.pos.x
            // this.offset.y = _y - this.pos.y
            this.img.to(this.offset.x, this.offset.y)
            this.ghost.to(this.offset.x, this.offset.y)
        }
    }

    updateOffsets() {
        let _offset_x = Math.round((this.cover.width * this.zoom - this.clip.width) / 2)
        let _offset_y = Math.round((this.cover.height * this.zoom - this.clip.height) / 2)
        this.offset_x = {
            min: -_offset_x,
            max: _offset_x
        }
        console.log("this.offset_x", this.offset_x)
        this.offset_y = {
            min: -_offset_y,
            max: _offset_y
        }
        console.log("this.offset_y", this.offset_y)
    }

    onDragUp(e) {
        this.drag = false
        this.dom_element.classList.remove("dragging")
    }

    // dragTo(_x, _y) {
    //     let cropTo = this.updateOffsets(_x, _y)
    //     this.cutter(cropTo)
    // }

    // cutter(_to) {
    //     this.img.to(_x, _y)
    //     this.ghost.to(_x, _y)
    // }

}