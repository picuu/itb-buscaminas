export class Casilla {
    fila
    columna
    tieneBomba
    bombasAdyacentes
    tieneBandera
    estaAbierta

    constructor(fila, columna) {
        this.fila = fila
        this.columna = columna
        this.tieneBomba = 0
        this.bombasAdyacentes = 0
        this.tieneBandera = false
        this.estaAbierta = false
    }

    plantarBomba() {
        this.tieneBomba = 1
    }

    contarBombas(tablero) {
        if (this.tieneBomba) return

        for (let fila = this.fila - 1; fila <= this.fila + 1; fila++) {
            if (fila < 0 || fila >= tablero.length) continue

            for (let columna = this.columna - 1; columna <= this.columna + 1; columna++) {
                if (columna < 0 || columna >= tablero[fila].length) continue

                this.bombasAdyacentes += tablero[fila][columna].tieneBomba
            }
        }
    }

    toggleBandera() {
        this.tieneBandera = !this.tieneBandera
    }

    abrir() {
        if (this.tieneBomba) console.log("game over")
        else console.log("abrir casilla, contar adyacentes")
    }
}
