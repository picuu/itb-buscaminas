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
        for (let x = 0; x < this.numeroFilas; x++) {
            this.tablero[x] = []
            for (let y = 0; y < this.numeroColumnas; y++) {
                this.tablero[x][y] = new Casilla(x, y, this.tablero)
            }
        }
    }

    plantarBombas() {
        let bombasPlantadas = 0
        while (bombasPlantadas < this.numeroBombas) {
            const x = Math.floor(Math.random() * this.numeroFilas)
            const y = Math.floor(Math.random() * this.numeroFilas)

            const casilla = this.tablero[x][y]

            if (casilla.tieneBomba) continue

            casilla.plantarBomba()
            bombasPlantadas++
        }
    }

    contarBombas() {
        for (let x = 0; x < this.numeroFilas; x++) {
            for (let y = 0; y < this.numeroColumnas; y++) {
                this.tablero[x][y].contarBombas(this.tablero)
            }
        }
    }
}
