import { Tablero } from "../models/Tablero.js"

let banderasColocadas = 0

export function startGame() {
    const numFilas = 10
    const numColumnas = 8
    const numBombas = 10

    const buscaminas = new Tablero(numFilas, numColumnas, numBombas)
    const $container = document.getElementById("container")

    pintarTablero($container, buscaminas, numFilas, numColumnas)

    const $playAgainButton = document.getElementById("playAgainButton")
    $playAgainButton.classList.remove("game-over")

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
    container.replaceChildren()
    container.style.pointerEvents = "all"

    container.style.gridTemplateColumns = `repeat(${numColumnas}, 1fr)`

    for (let col = 0; col < numFilas; col++) {
        for (let fil = 0; fil < numColumnas; fil++) {
            const casilla = buscaminas.tablero[col][fil]
            const $casillaGrid = document.createElement("div")
            $casillaGrid.setAttribute("data-coordenadas", `${col},${fil}`)
            $casillaGrid.classList.add("casilla")

            // if (casilla.tieneBomba) $casillaGrid.classList.add("bomba")

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

    if (casilla.estaAbierta) return

    if (!casilla.tieneBandera && banderasColocadas < buscaminas.numeroBombas) {
        $c.classList.add("bandera")
        casilla.toggleBandera()
        banderasColocadas++

        buscaminas.banderas.push(casilla)
    } else if (casilla.tieneBandera) {
        $c.classList.remove("bandera")
        casilla.toggleBandera()
        banderasColocadas--

        const banderaEliminadaIndex = buscaminas.banderas.findIndex(e => e == casilla)
        buscaminas.banderas.splice(banderaEliminadaIndex, 1)
    }
}

function abrirCasilla(buscaminas, $c) {
    const casilla = getCasilla(buscaminas, $c)

    if (casilla.estaAbierta || casilla.tieneBandera) return

    if (casilla.tieneBomba) {
        $c.classList.add("bomba-activa")
        casilla.estaAbierta = true
        gameOver(buscaminas, $c)
        return
    }

    if (casilla.bombasAdyacentes) {
        $c.classList.add(`bombas${casilla.bombasAdyacentes}`)
        casilla.estaAbierta = true
        return
    }
    
    $c.classList.add("casilla-abierta")
    casilla.estaAbierta = true
    buscarAdyacentes(buscaminas, casilla.fila, casilla.columna)
}

function buscarAdyacentes(buscaminas, origenFila, origenColumna) {
    const top = document.querySelector(`[data-coordenadas="${origenFila-1},${origenColumna}"]`)
    if (top) vaciarCasillas(buscaminas, top)

    const bottom = document.querySelector(`[data-coordenadas="${parseInt(origenFila)+1},${origenColumna}"]`)
    if (bottom) vaciarCasillas(buscaminas, bottom)

    const left = document.querySelector(`[data-coordenadas="${origenFila},${origenColumna-1}"]`)
    if (left) vaciarCasillas(buscaminas, left)
    
    const right = document.querySelector(`[data-coordenadas="${origenFila},${parseInt(origenColumna)+1}"]`)
    if (right) vaciarCasillas(buscaminas, right)
}

function vaciarCasillas(buscaminas, $c) {
    const casilla = getCasilla(buscaminas, $c)

    if (casilla.estaAbierta || casilla.tieneBandera) return

    if (casilla.bombasAdyacentes) {
        $c.classList.add(`bombas${casilla.bombasAdyacentes}`)
        casilla.estaAbierta = true
        return
    }

    $c.classList.add("casilla-abierta")
    casilla.estaAbierta = true
    buscarAdyacentes(buscaminas, casilla.fila, casilla.columna)
}

function gameOver(buscaminas, $c) {
    buscaminas.bombas.forEach(bomba => {
        const $bomba = document.querySelector(`[data-coordenadas="${bomba.fila},${bomba.columna}"]`)
        if (!bomba.estaAbierta && !bomba.tieneBandera) $bomba.classList.add("bomba")
    })

    buscaminas.banderas.forEach(bandera => {
        const $bandera = document.querySelector(`[data-coordenadas="${bandera.fila},${bandera.columna}"]`)
        if (!bandera.tieneBomba) $bandera.classList.add("bomba-incorrecta")
    })

    const playAgainButton = document.getElementById("playAgainButton")
    playAgainButton.classList.add("game-over")

    playAgainButton.addEventListener("click", () => startGame())

    const containerTablero = document.getElementById("container")
    containerTablero.style.pointerEvents = "none"
}
