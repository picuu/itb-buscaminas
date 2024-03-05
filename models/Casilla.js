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

    toggleBandera() {
        this.tieneBandera = !this.tieneBandera
    }
}
