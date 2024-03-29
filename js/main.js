import { Tablero } from "./models/Tablero.js"
import { redirect } from "./form.js"

export function startGame() {
    const settings = getGameConfig()

    const buscaminas = new Tablero(settings.rows, settings.cols, settings.bombs)
    const container = document.getElementById("container")

    container.style.gridTemplateColumns = `repeat(${buscaminas.numeroColumnas}, 1fr)`

    pintarTablero(container, buscaminas)

    const playAgainButton = document.getElementById("playAgainButton")
    playAgainButton.addEventListener("click", () => resetGame(buscaminas, container, playAgainButton))

    eventosSeleccionCasillas(buscaminas, container, playAgainButton)
    listenConfigButton()
    showUserInfo()

    tiempo()
}

function getGameConfig() {
    const settings = {
        rows: 9,
        cols: 9,
        bombs: 10
    }
    
    const userSettings = JSON.parse(localStorage.getItem("userSettings"))
    if (userSettings) {
        settings.rows = userSettings.filas
        settings.cols = userSettings.columnas
        settings.bombs = userSettings.bombas
    }

    return settings
}

function showUserInfo() {
    let userSettings = localStorage.getItem("userSettings")
    if (!userSettings) return

    userSettings = JSON.parse(userSettings)
    const infoContainer = document.getElementById("user-info")

    const nick = document.createElement("p")
    const email = document.createElement("p")

    nick.textContent = userSettings.nick
    email.textContent = userSettings.email

    infoContainer.appendChild(nick)
    infoContainer.appendChild(email)
    infoContainer.style.display = "flex"
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
        actualizarContadorBombas(buscaminas)
    })
}

function listenConfigButton() {
    const configBtn = document.getElementById("config-button")
    configBtn.addEventListener("click", (e) => {
        e.preventDefault()
        const userSettings = localStorage.getItem("userSettings")
        let proced = true

        if (userSettings) proced = confirm("Se borrará la configuración almacenada. Quieres continuar?")
        if (proced) {
            localStorage.removeItem("userSettings")
            redirect("/")
        }
    })
}

function eventosSeleccionCasillas(buscaminas, container, playAgainButton) {
    const seleccionCasillasButtons = document.querySelectorAll(".seleccion-casillas button")
    seleccionCasillasButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const filas = btn.getAttribute("data-filas")
            const columnas = btn.getAttribute("data-columnas")
            const bombas = btn.getAttribute("data-bombas")

            buscaminas.numeroFilas = filas
            buscaminas.numeroColumnas = columnas
            buscaminas.numeroBombas = bombas

            resetGame(buscaminas, container, playAgainButton)
        })
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
    showConfetti()
}

function finalizarPartida(playAgainButtonClass) {
    const playAgainButton = document.getElementById("playAgainButton")
    playAgainButton.classList.add(playAgainButtonClass)

    const containerTablero = document.getElementById("container")
    containerTablero.style.pointerEvents = "none"
}

function resetGame(buscaminas, container, playAgainButton) {
    buscaminas.reset()

    playAgainButton.classList.remove("game-over")
    playAgainButton.classList.remove("game-win")

    container.style.gridTemplateColumns = `repeat(${buscaminas.numeroColumnas}, 1fr)`
    container.style.pointerEvents = "all"

    pintarTablero(container, buscaminas)
    actualizarContadorBombas(buscaminas)
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

function tiempo() {
    const contadorTiempo = document.getElementById("contadorTiempo")

    setInterval(() => {
        const tiempo = parseInt(contadorTiempo.textContent) + 1
        let tiempoTxt = `${tiempo}`

        if (tiempoTxt.length < 2) tiempoTxt = "00" + tiempo
        else if (tiempoTxt.length < 3) tiempoTxt = "0" + tiempo

        contadorTiempo.textContent = tiempoTxt
    }, 1000)
}

function actualizarContadorBombas(buscaminas) {
    const contadorBanderas = document.getElementById("contadorBanderas")
    if (contadorBanderas.textContent.length >= 2) contadorBanderas.textContent = `0${buscaminas.numeroBombas - buscaminas.banderas.length}`
    else contadorBanderas.textContent = `00${buscaminas.numeroBombas - buscaminas.banderas.length}`
}
