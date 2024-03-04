import { Tablero } from "../models/Tablero.js"
import { pintarTablero, abrirCasilla, toggleBandera } from "./Functions.js"

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
