import { Tablero } from "../models/Tablero.js"

export function startGame() {
    const numFilas = 9
    const numColumnas = 9
    const numBombas = 10

    const buscaminas = new Tablero(numFilas, numColumnas, numBombas)
    const $container = document.getElementById("container")

    $container.style.gridTemplateColumns = `repeat(${numColumnas}, 1fr)`
    $container.style.pointerEvents = "all"

    pintarTablero($container, buscaminas, numFilas, numColumnas)

    const $playAgainButton = document.getElementById("playAgainButton")
    $playAgainButton.classList.remove("game-over")
    $playAgainButton.classList.remove("game-win")

    $playAgainButton.addEventListener("click", () => startGame())
}

function pintarTablero(container, buscaminas, numFilas, numColumnas) {
    container.replaceChildren()

    for (let fil = 0; fil < numFilas; fil++) {
        for (let col = 0; col < numColumnas; col++) {
            const casilla = buscaminas.tablero[fil][col]

            const casillaDOM = document.createElement("div")
            casillaDOM.setAttribute("data-coordenadas", `${fil},${col}`)
            casillaDOM.classList.add("casilla")

            if (casilla.estaAbierta) {
                if (casilla.bombasAdyacentes) casillaDOM.classList.add(`bombas${casilla.bombasAdyacentes}`)
                else if (casilla.tieneBomba) casillaDOM.classList.add("bomba-activa")
                else casillaDOM.classList.add("casilla-abierta")
            }

            if (casilla.tieneBandera) casillaDOM.classList.add("bandera")

            casillaDOM.addEventListener("click", (e) => {
                casilla.abrir(buscaminas)
                pintarTablero(container, buscaminas, numFilas, numColumnas)
            })

            casillaDOM.addEventListener("contextmenu", (e) => {
                e.preventDefault()
                casilla.toggleBandera(buscaminas)
                pintarTablero(container, buscaminas, numFilas, numColumnas)
            })

            // DESCOMENTAR PARA VER DONDE ESTÁN LAS BOMBAS :D
            // if (casilla.tieneBomba) casillaDOM.classList.add("bomba")

            container.appendChild(casillaDOM)
        }
    }
}

function getCasilla(buscaminas, $c) {
    const fila = $c.getAttribute("data-coordenadas").split(",")[0]
    const columna = $c.getAttribute("data-coordenadas").split(",")[1]

    return buscaminas.tablero[fila][columna]
}

function getCasillaDOM(casilla) {
    return document.querySelector(`[data-coordenadas="${casilla.fila},${casilla.columna}"]`)
}


// function toggleBandera(buscaminas, casilla) {
//     const banderaColocada = casilla.toggleBandera(buscaminas)
//     const casillaDOM = getCasillaDOM(casilla)

//     if (banderaColocada) {
//         casillaDOM.classList.add("bandera")
//     } else {
//         casillaDOM.classList.remove("bandera")
//     }
// }

// function abrirCasilla(buscaminas, casilla) {
//     const casillaAbierta = casilla.abrir(buscaminas)

//     if (!casillaAbierta) return

//     if (casilla.tieneBomba) {
//         casilla.classList.add("bomba-activa")
//         return
//     }

//     if (casilla.bombasAdyacentes) {
//         casilla.classList.add(`bombas${casilla.bombasAdyacentes}`)
//         return
//     }
    
//     casilla.classList.add("casilla-abierta")
// }

// function buscarAdyacentes(buscaminas, origenFila, origenColumna) {
//     const top = document.querySelector(`[data-coordenadas="${origenFila-1},${origenColumna}"]`)
//     if (top) vaciarCasillas(buscaminas, top)

//     const bottom = document.querySelector(`[data-coordenadas="${parseInt(origenFila)+1},${origenColumna}"]`)
//     if (bottom) vaciarCasillas(buscaminas, bottom)

//     const left = document.querySelector(`[data-coordenadas="${origenFila},${origenColumna-1}"]`)
//     if (left) vaciarCasillas(buscaminas, left)
    
//     const right = document.querySelector(`[data-coordenadas="${origenFila},${parseInt(origenColumna)+1}"]`)
//     if (right) vaciarCasillas(buscaminas, right)
// }

// function vaciarCasillas(buscaminas, $c) {
//     const casilla = getCasilla(buscaminas, $c)

//     if (casilla.estaAbierta || casilla.tieneBandera) return

//     if (casilla.bombasAdyacentes) {
//         $c.classList.add(`bombas${casilla.bombasAdyacentes}`)
//         casilla.estaAbierta = true
//         return
//     }

//     $c.classList.add("casilla-abierta")
//     casilla.estaAbierta = true
//     buscarAdyacentes(buscaminas, casilla.fila, casilla.columna)
// }

// function gameOver(buscaminas, $c) {
//     buscaminas.bombas.forEach(bomba => {
//         const $bomba = document.querySelector(`[data-coordenadas="${bomba.fila},${bomba.columna}"]`)
//         if (!bomba.estaAbierta && !bomba.tieneBandera) $bomba.classList.add("bomba")
//     })

//     buscaminas.banderas.forEach(bandera => {
//         const $bandera = document.querySelector(`[data-coordenadas="${bandera.fila},${bandera.columna}"]`)
//         if (!bandera.tieneBomba) $bandera.classList.add("bomba-incorrecta")
//     })

//     finalizarPartida("game-over")
// }

// function verificarVictoria(buscaminas) {
//     const casillasDescubiertas = buscaminas.tablero.every(fila => {
//         return fila.every(casilla => !casilla.tieneBomba ? casilla.estaAbierta : true)
//     })

//     if (casillasDescubiertas) {
//         finalizarPartida("game-win")
//         buscaminas.bombas.forEach(bomba => {
//             const $bomba = document.querySelector(`[data-coordenadas="${bomba.fila},${bomba.columna}"]`)
//             if (!bomba.tieneBandera) $bomba.classList.add("bandera")
//         })
//     }
// }

// function finalizarPartida(playAgainButtonClass) {
//     const playAgainButton = document.getElementById("playAgainButton")
//     playAgainButton.classList.add(playAgainButtonClass)

//     playAgainButton.addEventListener("click", () => startGame())

//     const containerTablero = document.getElementById("container")
//     containerTablero.style.pointerEvents = "none"

//     if (playAgainButtonClass == "game-win") showConfetti()
// }

// function showConfetti() {
//     confetti({
//         angle: 130,
//         spread: 80,
//         origin: { x: .55, y: .5 },
//         ticks: 125,
//         scalar: .75,
//         zIndex: -1,
//         disableForReducedMotion: true
//     })
//     confetti({
//         angle: 50,
//         spread: 80,
//         origin: { x: .45, y: .5 },
//         ticks: 125,
//         scalar: .75,
//         zIndex: -1,
//         disableForReducedMotion: true
//     })
// }
