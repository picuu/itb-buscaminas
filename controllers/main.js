import { Tablero } from "../models/Tablero.js"

let banderasColocadas = 0

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
            abrirCasilla(buscaminas, $c)
        })
    })

    $casillas.forEach($c => {
        $c.addEventListener("contextmenu", (e) => {
            e.preventDefault()
            toggleBandera(buscaminas, $c)
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
                $casillaGrid.classList.add("bomba")
            } else {
                // $casillaGrid.classList.add(`bombas${casilla.bombasAdyacentes}`)
            }


            container.appendChild($casillaGrid)
        }
    }
}

function getCasilla(buscaminas, $c) {
    const fila = $c.getAttribute("data-coordenadas").split(",")[0]
    const columna = $c.getAttribute("data-coordenadas").split(",")[1]

    return buscaminas.tablero[fila][columna]
}

function toggleBandera(buscaminas, $c) {
    const casilla = getCasilla(buscaminas, $c)

    console.log(casilla)

    if (casilla.estaAbierta) return

    if (!casilla.tieneBandera && banderasColocadas < buscaminas.numeroBombas) {
        $c.classList.add("bandera")
        casilla.toggleBandera()
        banderasColocadas++
    } else if (casilla.tieneBandera) {
        $c.classList.remove("bandera")
        casilla.toggleBandera()
        banderasColocadas--
    }
}

function abrirCasilla(buscaminas, $c) {
    const casilla = getCasilla(buscaminas, $c)

    console.log(casilla)

    if (casilla.estaAbierta) return

    if (casilla.tieneBomba) {
        $c.classList.add("bomba-activa")
        casilla.estaAbierta = true
    }
    else if (!casilla.bombasAdyacentes && !casilla.tieneBandera) {
        $c.classList.add("casilla-abierta")
        casilla.estaAbierta = true
        buscarAdyacentes(buscaminas, casilla.fila, casilla.columna)
    }
    else if (casilla.bombasAdyacentes && !casilla.tieneBandera) {
        $c.classList.add(`bombas${casilla.bombasAdyacentes}`)
        casilla.estaAbierta = true
    }
}

function buscarAdyacentes(buscaminas, origenFila, origenColumna) {
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

function vaciarCasillaVacia(buscaminas, $c) {
    const casilla = getCasilla(buscaminas, $c)

    if (casilla.estaAbierta) return

    if (casilla.bombasAdyacentes && !casilla.tieneBandera) {
        $c.classList.add(`bombas${casilla.bombasAdyacentes}`)
        $c.estaAbierta = true
        return
    }

    if (!casilla.tieneBandera) {
        $c.classList.add("casilla-abierta")
        casilla.estaAbierta = true
    }
    
    buscarAdyacentes(buscaminas, casilla.fila, casilla.columna)
}
