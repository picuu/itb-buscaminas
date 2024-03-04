import { Tablero } from "../models/Tablero.js"

export function init() {
    const numFilas = 10
    const numColumnas = 8
    const numBombas = 10

    const buscaminas = new Tablero(numFilas, numColumnas, numBombas)
    const $container = document.getElementById("container")


    pintarTablero($container, buscaminas, numFilas, numColumnas)

    const $casillas = $container.querySelectorAll(".casilla")
    $casillas.forEach($c => {
        $c.addEventListener("click", (e) => {
            console.log("CASILLA ORIGEN: ", $c)
            abrirCasilla(buscaminas, $c)
        })
    })
}

function pintarTablero(container, buscaminas, numFilas, numColumnas) {
    container.style.gridTemplateColumns = `repeat(${numColumnas}, 1fr)`

    for (let col = 0; col < numFilas; col++) {
        for (let fil = 0; fil < numColumnas; fil++) {
            const casilla = buscaminas.tablero[col][fil]
            const $casillaGrid = document.createElement("div")
            $casillaGrid.setAttribute("data-coordenadas", `${col},${fil}`)
            $casillaGrid.classList.add("casilla")

            if (casilla.tieneBomba) {
                // $casillaGrid.classList.add("bomba")
            } else {
                // $casillaGrid.classList.add(`bombas${casilla.bombasAdyacentes}`)
            }


            container.appendChild($casillaGrid)
        }
    }
}

function abrirCasilla(buscaminas, $c) {
    const fila = $c.getAttribute("data-coordenadas").split(",")[0]
    const columna = $c.getAttribute("data-coordenadas").split(",")[1]

    const casilla = buscaminas.tablero[fila][columna]

    if (casilla.estaAbierta) return

    if (casilla.tieneBomba) {
        $c.classList.add("bomba-activa")
    }
    else if (!casilla.bombasAdyacentes) {
        $c.classList.add("casilla-abierta")
        casilla.estaAbierta = true
        abrirAdyacentes(buscaminas, fila, columna)
    }
    else {
        $c.classList.add(`bombas${casilla.bombasAdyacentes}`)
        casilla.estaAbierta = true
    }
}

function abrirAdyacentes(buscaminas, origenFila, origenColumna) {
    if (origenFila != 0) {
        const top = document.querySelector(`[data-coordenadas="${origenFila-1},${origenColumna}"]`)
        if (top) vaciarCasillaVacia(buscaminas, top)
    }
    if (origenFila != buscaminas.tablero.length) {
        const bottom = document.querySelector(`[data-coordenadas="${parseInt(origenFila)+1},${origenColumna}"]`)
        if (bottom) vaciarCasillaVacia(buscaminas, bottom)
    }
    if (origenColumna != 0) {
        const left = document.querySelector(`[data-coordenadas="${origenFila},${origenColumna-1}"]`)
        if (left) vaciarCasillaVacia(buscaminas, left)
    }
    if (origenColumna != buscaminas.tablero[0].length) {
        const right = document.querySelector(`[data-coordenadas="${origenFila},${parseInt(origenColumna)+1}"]`)
        if (right) vaciarCasillaVacia(buscaminas, right)
    }
}

function vaciarCasillaVacia(buscaminas, $casilla) {
    const fila = $casilla.getAttribute("data-coordenadas").split(",")[0]
    const columna = $casilla.getAttribute("data-coordenadas").split(",")[1]

    const casilla = buscaminas.tablero[fila][columna]

    if (casilla.estaAbierta) return

    if (casilla.bombasAdyacentes) {
        $casilla.classList.add(`bombas${casilla.bombasAdyacentes}`)
        $casilla.estaAbierta = true
        return
    }

    $casilla.classList.add("casilla-abierta")
    casilla.estaAbierta = true
    abrirAdyacentes(buscaminas, fila, columna)
}
