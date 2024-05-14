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

export default class Cutter extends HTMLGeometry {
    constructor(_svg) {
        super(_svg)
        this.offset = {
            x: 0,
            y: 0
        }
        //
        this.drag = false
        this.clip = new HTMLGeometry(this.dom_element.querySelector(".clip"))
        this.ghost = new HTMLGeometry(this.dom_element.querySelector(".ghost"))
        this.img = new HTMLGeometry(this.dom_element.querySelector(".img"))
        this.events()
    }

    events() {
        this.sensible = this.dom_element.querySelector(".sensible")
        //mouse
        this.sensible.addEventListener('mousedown', e => this.onDragDown(e))
        document.addEventListener('mousemove', e => this.onDragMove(e))
        document.addEventListener('mouseup', e => this.onDragUp(e))
        // touch
        this.sensible.addEventListener('touchstart', e => this.onDragDown(e))
        document.addEventListener('touchmove', e => this.onDragMove(e))
        document.addEventListener('touchend', e => this.onDragUp(e))
        //
    }
    //events
    onDragDown(e) {
        this.drag = true
        this.dom_element.classList.add("dragging")
    }

    onDragMove(e) {
        let point = e.touches ? e.touches[0] : e
        if (this.drag) {
            /*
            * La operación para el cálculo de {x} requiere de la conversión a escala de {clip.x}
            * El contenedor svg se adapta al contenedor, mientras svg maneja puntos en el espacio, el dom maneja pixeles
            * La posición {x, y} de clip serán iguales a pixeles en el DOM siempre y cuando la escala sea 1
            * Si el contenedor es menor al tamaño del svg, este cambiará su escala, el nuevo valor de {x, y} será igual a su valor multiplicado por la escala
            */
            let _x = (point.clientX - this.left - (this.clip.x * this.scale)) * PX_RATIO
            let _y = (point.clientY - this.top - (this.clip.y * this.scale)) * PX_RATIO
            let percent_x = Math.round((_x * 100) / this.clip.width)
            percent_x = Math.max(0, percent_x)
            percent_x = Math.min(100, percent_x)
            let percent_y = Math.round((_y * 100) / this.clip.height)
            percent_y = Math.max(0, percent_y)
            percent_y = Math.min(100, percent_y)
            this.dragTo(percent_x, percent_y)
        }
    }

    onDragUp(e) {
        this.drag = false
        this.dom_element.classList.remove("dragging")
    }

    dragTo(_x, _y) {
        let cropTo = this.updateOffsets(_x, _y)
        this.cutter(cropTo)
    }

    cutter(_to) {
        let min_x = this.clip.x
        let min_y = this.clip.y
        let max_w = (this.img.width - this.clip.width - this.clip.x)
        let max_h = (this.img.height - this.clip.height - this.clip.y)
        const _x = (Math.map(_to.x, 0, 100, min_x, -max_w))
        const _y = (Math.map(_to.y, 0, 100, min_y, -max_h))
        // 
        this.img.to(_x, _y)
        this.ghost.to(_x, _y)
    }

    updateOffsets(_x = 0, _y = 0) {
        let x = Math.max(_x, 0)
        x = Math.min(x, this.clip.width)
        //
        let y = Math.max(_y, 0)
        y = Math.min(y, this.clip.height)
        return {
            x: ~~x,
            y: ~~y
        }
    }
}