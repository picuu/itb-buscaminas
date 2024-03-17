import { Casilla } from "./Casilla.js"

export class Tablero {
    numeroFilas
    numeroColumnas
    numeroBombas
    bombas
    banderas
    gameOver
    gameWin
    tablero

    constructor(numeroFilas, numeroColumnas, numeroBombas) {
        this.numeroFilas = numeroFilas
        this.numeroColumnas = numeroColumnas
        this.numeroBombas = numeroBombas
        this.bombas = []
        this.banderas = []
        this.gameOver = false
        this.gameWin = false
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
            this.bombas.push(casilla)
        }
        console.log(this.bombas)
    }

    contarBombas() {
        this.bombas.forEach(bomba => {
            for (let fila = bomba.fila - 1; fila <= bomba.fila + 1; fila++) {
                if (fila < 0 || fila >= this.tablero.length) continue
    
                for (let columna = bomba.columna - 1; columna <= bomba.columna + 1; columna++) {
                    if (columna < 0 || columna >= this.tablero[fila].length) continue
    
                    const casilla = this.tablero[fila][columna]

                    if (!casilla.tieneBomba) casilla.bombasAdyacentes++
                }
            }
        })
    }

    verificarVictoria() {
        const casillasDescubiertas = this.tablero.every(fila => {
            return fila.every(casilla => !casilla.tieneBomba ? casilla.estaAbierta : true)
        })

        if (casillasDescubiertas) this.gameWin = true
    }

    reset() {
        this.bombas = []
        this.banderas = []
        this.gameOver = false
        this.gameWin = false
        this.tablero = []
        this.generarTablero()
        this.plantarBombas()
        this.contarBombas()
    }
}
