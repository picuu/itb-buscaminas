import { Tablero } from "../models/Tablero.js"

export function init() {
    const numFilas = 10
    const numColumnas = 10
    const numBombas = 20

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
    container.style.gridTemplateColumns = `repeat(${numFilas}, 1fr)`

    for (let x = 0; x < numFilas; x++) {
        for (let y = 0; y < numColumnas; y++) {
            const casilla = buscaminas.tablero[x][y]
            const $casillaGrid = document.createElement("div")
            $casillaGrid.setAttribute("data-coordenadas", `${casilla.posicionX},${casilla.posicionY}`)
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
