import { Casilla } from "./Casilla.js"

export class Tablero {
    numeroFilas
    numeroColumnas
    numeroBombas
    tablero

    constructor(numeroFilas, numeroColumnas, numeroBombas) {
        this.numeroFilas = numeroFilas
        this.numeroColumnas = numeroColumnas
        this.numeroBombas = numeroBombas
        this.tablero = []
        this.generarTablero()
        this.plantarBombas()
        this.contarBombas()
    }

    generarTablero() {
        for (let fila = 0; fila < this.numeroFilas; fila++) {
            this.tablero[fila] = []
            for (let columna = 0; columna < this.numeroColumnas; columna++) {
                this.tablero[fila][columna] = new Casilla(fila, columna)
            }
        }
    }

    plantarBombas() {
        let bombasPlantadas = 0
        while (bombasPlantadas < this.numeroBombas) {
            const fila = Math.floor(Math.random() * this.numeroFilas)
            const columna = Math.floor(Math.random() * this.numeroColumnas)

            const casilla = this.tablero[fila][columna]

            if (casilla.tieneBomba) continue

            casilla.plantarBomba()
            bombasPlantadas++
        }
    }

    contarBombas() {
        for (let fila = 0; fila < this.numeroFilas; fila++) {
            for (let columna = 0; columna < this.numeroColumnas; columna++) {
                this.tablero[fila][columna].contarBombas(this.tablero)
            }
        }
    }
}
