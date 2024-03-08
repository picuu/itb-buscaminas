import { Tablero } from "../models/Tablero.js"

export function startGame() {
    const numFilas = 9
    const numColumnas = 9
    const numBombas = 10

    const buscaminas = new Tablero(numFilas, numColumnas, numBombas)
    const $container = document.getElementById("container")

    $container.style.gridTemplateColumns = `repeat(${numColumnas}, 1fr)`

    pintarTablero($container, buscaminas)

    const playAgainButton = document.getElementById("playAgainButton")
    playAgainButton.addEventListener("click", () => resetGame(buscaminas, $container, playAgainButton))
}

function pintarTablero(container, buscaminas) {
    container.replaceChildren()

    const numFilas = buscaminas.numeroFilas
    const numColumnas = buscaminas.numeroColumnas

    for (let fil = 0; fil < numFilas; fil++) {
        for (let col = 0; col < numColumnas; col++) {
            const casilla = buscaminas.tablero[fil][col]

            const casillaDOM = crearCasilla(casilla)
            container.appendChild(casillaDOM)

            eventosAbrir(casilla, casillaDOM, container, buscaminas)

            eventosBandera(casilla, casillaDOM, container, buscaminas)

            // DESCOMENTAR PARA VER DONDE ESTÁN LAS BOMBAS :D
            // if (casilla.tieneBomba) casillaDOM.classList.add("bomba")            
        }
    }
    buscaminas.verificarVictoria()

    if (buscaminas.gameOver) gameOver(buscaminas)
    else if (buscaminas.gameWin) gameWin(buscaminas)
}

function crearCasilla(casilla) {
    const casillaDOM = document.createElement("div")
    casillaDOM.setAttribute("data-coordenadas", `${casilla.fila},${casilla.columna}`)
    casillaDOM.classList.add("casilla")

    if (casilla.estaAbierta) {
        if (casilla.bombasAdyacentes) casillaDOM.classList.add(`bombas${casilla.bombasAdyacentes}`)
        else if (casilla.tieneBomba) casillaDOM.classList.add("bomba-activa")
        else casillaDOM.classList.add("casilla-abierta")
    }

    if (casilla.tieneBandera) casillaDOM.classList.add("bandera")

    return casillaDOM
}

function eventosAbrir(casilla, casillaDOM, container, buscaminas) {
    casillaDOM.addEventListener("click", (e) => {
        e.preventDefault()
        casilla.abrir(buscaminas)
        pintarTablero(container, buscaminas)
    })
}

function eventosBandera(casilla, casillaDOM, container, buscaminas) {
    casillaDOM.addEventListener("contextmenu", (e) => {
        e.preventDefault()
        casilla.toggleBandera(buscaminas)
        pintarTablero(container, buscaminas)
    })
}

function getCasillaDOM(casilla) {
    return document.querySelector(`[data-coordenadas="${casilla.fila},${casilla.columna}"]`)
}

function gameOver(buscaminas) {
    buscaminas.bombas.forEach(bomba => {
        const casillaDOM = getCasillaDOM(bomba)
        if (!bomba.estaAbierta && !bomba.tieneBandera) casillaDOM.classList.add("bomba")
    })

    buscaminas.banderas.forEach(bandera => {
        const casillaDOM = getCasillaDOM(bandera)
        if (!bandera.tieneBomba) casillaDOM.classList.add("bomba-incorrecta")
    })

    finalizarPartida("game-over")
}

function gameWin(buscaminas) {
    buscaminas.bombas.forEach(bomba => {
        const casillaDOM = getCasillaDOM(bomba)
        casillaDOM.classList.add("bandera")
    })
    finalizarPartida("game-win")
}


function finalizarPartida(playAgainButtonClass) {
    const playAgainButton = document.getElementById("playAgainButton")
    playAgainButton.classList.add(playAgainButtonClass)

    const containerTablero = document.getElementById("container")
    containerTablero.style.pointerEvents = "none"

    if (playAgainButtonClass == "game-win") showConfetti()
}

function resetGame(buscaminas, $container, playAgainButton) {
    buscaminas.reset()

    playAgainButton.classList.remove("game-over")
    playAgainButton.classList.remove("game-win")

    $container.style.pointerEvents = "all"

    pintarTablero($container, buscaminas)
}

function showConfetti() {
    confetti({
        angle: 130,
        spread: 80,
        origin: { x: .55, y: .5 },
        ticks: 125,
        scalar: .75,
        zIndex: -1,
        disableForReducedMotion: true
    })
    confetti({
        angle: 50,
        spread: 80,
        origin: { x: .45, y: .5 },
        ticks: 125,
        scalar: .75,
        zIndex: -1,
        disableForReducedMotion: true
    })
}
