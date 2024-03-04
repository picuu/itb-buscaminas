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
    const x = $c.getAttribute("data-coordenadas").split(",")[0]
    const y = $c.getAttribute("data-coordenadas").split(",")[1]

    const casilla = buscaminas.tablero[x][y]

    if (casilla.estaAbierta) return
    else if (casilla.tieneBomba) $c.classList.add("bomba-activa")
    else if (!casilla.bombasAdyacentes) $c.classList.add("casilla-abierta")
    else $c.classList.add(`bombas${casilla.bombasAdyacentes}`)
}
