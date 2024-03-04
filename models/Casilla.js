export class Casilla {
    posicionX
    posicionY
    tieneBomba
    bombasAdyacentes
    tieneBandera
    estaAbierta

    constructor(posicionX, posicionY) {
        this.posicionX = posicionX
        this.posicionY = posicionY
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

        for (let x = this.posicionX - 1; x <= this.posicionX + 1; x++) {
            if (x < 0 || x >= tablero.length) continue

            for (let y = this.posicionY - 1; y <= this.posicionY + 1; y++) {
                if (y < 0 || y >= tablero[x].length) continue

                this.bombasAdyacentes += tablero[x][y].tieneBomba
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
