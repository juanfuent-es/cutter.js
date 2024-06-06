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
const normalizeFloat = (_n, _precision = 1) => {
    return parseFloat(_n.toFixed(_precision))
}

import HTMLGeometry from "./geometry"

export default class Cutter extends HTMLGeometry {
    constructor(_svg) {
        super(_svg)
        this.zoom = 1
        this.start_pos = {
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
        // this.random_img.src = "https://bienaldeilustracion.com/finalista/andrea-devia-nuno/as-tight-as-you-can.xl.jpg"
        // this.random_img.src = "https://bienaldeilustracion.com/finalista/alex-lechuga/al-final-de-todo-como-piensas-reaccionar.xl.jpg"
    }
    
    events() {
        this.input = document.querySelector("input")
        this.input.addEventListener("input", () => {
            console.log(this.input.value)
            this.zoom = this.input.value
        })
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
    
    onWheel(e) {
        this.zoom += (e.deltaY / 360)
        this.zoom = Math.clamp(this.zoom, this.min_scale, this.max_scale)
        //
        const _rect = this.updateDimensions(this.zoom)
        this.resize(_rect.width, _rect.height) // rescale on dimension, not transformation
        //
        this.dom_element.classList.add("dragging")
        const debounce_time = 100
        clearTimeout(this.timeout)
        this.timeout = setTimeout(() => {
            this.dragTo(this.img.x, this.img.y)
            this.dom_element.classList.remove("dragging")
        }, debounce_time)
    }
    
    onLoad() {
        this.setImg(this.ghost_selector)
        this.setImg(this.img_element)
        //
        this.ghost = new HTMLGeometry(this.ghost_selector)
        this.clip = new HTMLGeometry(this.clip_selector)
        this.img = new HTMLGeometry(this.img_element)
        //
        const _rect = this.updateDimensions(this.min_scale)
        this.zoom = this.min_scale
        this.resize(_rect.width, _rect.height)
        this.dragTo(_rect.x + this.clip.x, _rect.y + this.clip.y)
        //
        this.timeout = null
        this.events()
    }

    updateDimensions(_scale) {
        // Si {scale} no está definido entendemos que la escala es la mínima {min_scale}
        let scale = _scale ? _scale : this.min_scale
        //
        let scaled_width = Math.round(this.width * scale)
        let scaled_height = Math.round(this.height * scale)
        //
        return {
            scale: normalizeFloat(scale, 1),
            width: normalizeFloat(scaled_width, 1),
            height: normalizeFloat(scaled_height, 1),
            x: Math.ceil((this.clip.width - scaled_width) / 2),
            y: Math.ceil((this.clip.height - scaled_height) / 2)
        }
    }

    updateOffsets() {
        const scaled_width = Math.round(this.width * this.zoom)
        const scaled_height = Math.round(this.height * this.zoom)
        const _x = Math.ceil(scaled_width - this.clip.width)
        const _y = Math.ceil(scaled_height - this.clip.height)

        let start_x = -(_x - this.clip.x)
        let start_y = -(_y - this.clip.y)
        this.offset_x = {
            min: start_x,
            max: _x + start_x
        }
        this.offset_y = {
            min: start_y,
            max: _y + start_y
        }
    }
    //events
    onDragDown(e) {
        e.preventDefault()
        let point = e.touches ? e.touches[0] : e
        this.drag = true
        this.dom_element.classList.add("dragging")
        this.offsetX = point.clientX
		this.offsetY = point.clientY
        this.startX = this.img.x
		this.startY = this.img.y
    }

    onDragMove(e) {
        e.preventDefault()
        let point = e.touches ? e.touches[0] : e
        if (this.drag) {
            let _x = (this.startX + point.clientX - this.offsetX)
            let _y = (this.startY + point.clientY - this.offsetY)
            this.dragTo(_x, _y)
            _x = Math.clamp(_x, this.offset_x.min, this.offset_x.max)
            _y = Math.clamp(_y, this.offset_y.min, this.offset_y.max)
            this.img.to(_x, _y)
            this.ghost.to(_x, _y)
        }
    }

    onDragUp(e) {
        e.preventDefault()
        this.drag = false
        this.dom_element.classList.remove("dragging")
    }

    resize(_width, _height) {
        this.ghost.resize(_width, _height)
        this.img.resize(_width, _height)
        this.updateOffsets()
    }

    dragTo(_x = 0, _y = 0) {
        this.ghost.to(_x, _y)
        this.img.to(_x, _y)
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
    
    get min_scale() {
        const mask_width = this.clip.width
        const mask_height = this.clip.height
        const mask_aspect = mask_width / mask_height
        const aspect = this.width / this.height
        //
        const width = mask_aspect > aspect ? mask_width : mask_height * aspect
        /* Este cálculo obtiene la escala para obtener las propiedades fit en la image
        * Emulación de la propiedad fit {cover} css.
        * @ref: https://www.w3schools.com/css/css3_object-fit.asp
        */
       return width / this.width
    }

    get max_scale() {
        return this.width / (this.width * this.min_scale)
    }
}