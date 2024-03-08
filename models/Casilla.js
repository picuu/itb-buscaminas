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

    toggleBandera(buscaminas) {
        if (this.estaAbierta) return
        
        const banderasColocadas = buscaminas.banderas.length
    
        if (!this.tieneBandera && banderasColocadas < buscaminas.numeroBombas) {
            this.tieneBandera = true
            buscaminas.banderas.push(this)

        } else if (this.tieneBandera) {
            this.tieneBandera = false

            const banderaEliminadaIndex = buscaminas.banderas.findIndex(e => e == this)
            buscaminas.banderas.splice(banderaEliminadaIndex, 1)
        }
    }

    abrir(buscaminas) {
        if (this.estaAbierta || this.tieneBandera) return
        this.estaAbierta = true

        if (this.tieneBomba) {
            buscaminas.gameOver = true
            return
        }
        if (!this.bombasAdyacentes) this.abrirAdyacentes(buscaminas)
    }

    abrirAdyacentes(buscaminas) {
        for (let fila = this.fila - 1; fila <= this.fila + 1; fila++) {
            if (fila < 0 || fila >= buscaminas.tablero.length) continue

            for (let columna = this.columna - 1; columna <= this.columna + 1; columna++) {
                if (columna < 0 || columna >= buscaminas.tablero[fila].length) continue

                const casilla = buscaminas.tablero[fila][columna]

                casilla.vaciarAdyacente(buscaminas)
            }
        }
    }

    vaciarAdyacente(buscaminas) {
        if (this.estaAbierta || this.tieneBandera || this.tieneBomba) return

        this.estaAbierta = true
    
        if (this.bombasAdyacentes) return
    
        if (!this.bombasAdyacentes || !this.tieneBandera) this.abrirAdyacentes(buscaminas)
    }
}
