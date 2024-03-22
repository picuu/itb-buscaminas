const emailRegex = /^([a-zA-Z]|[0-9]|\.)+@itb.cat$/
const emptyTextRegex = /^\s*$/

export function init() {
    if (localStorage.getItem("userSettings")) redirect("/game.html")
    else {
        checkForm()
        listenGuestButton()
    }
}

function listenGuestButton() {
    const guestBtn = document.getElementById("guest")
    guestBtn.addEventListener("click", (e) => {
        e.preventDefault()
        localStorage.removeItem("userSettings")
        redirect("/game.html")
    })
}

function checkForm() {
    const form = document.querySelector("form")
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        const data = Object.fromEntries(new FormData(e.target))
        
        const fechaNacimiento = document.getElementById("form-fecha")
        const email = document.getElementById("form-email")
        const nick = document.getElementById("form-nick")
        const filas = document.getElementById("form-filas")
        const columnas = document.getElementById("form-columnas")
        const bombas = document.getElementById("form-bombas")

        resetErrorMessages(form, fechaNacimiento, email, nick, filas, columnas, bombas)

        const okBrithDate = checkBirthDate(fechaNacimiento)
        const okNick = checkNick(nick)
        const okEmail = checkEmail(email)
        const okRows = checkRows(filas)
        const okCols = checkCols(columnas)
        const okBombs = checkBombs(filas, columnas, bombas)

        if (okBrithDate && okNick && okEmail && okRows && okCols && okBombs) {
            submitForm(data)
            redirect("/game.html")
        }
    })
}

function resetErrorMessages(form, fechaNacimiento, email, nick, filas, columnas, bombas) {
    const errorMessages = form.querySelectorAll("span[class]")
    errorMessages.forEach((element) => {
        element.style.display = "none"
    })

    const inputs = [fechaNacimiento, email, nick, filas, columnas, bombas]
    inputs.forEach(input => {
        input.classList.remove("invalid-input")
    })
}

function checkBirthDate(input) {
    if (emptyTextRegex.test(input.value)) {
        showInputError(input, "Este campo es obligatorio")
        return false
    }

    const fechas = input.value.split("-").map(v => parseInt(v))
    const year = new Date().getFullYear()
    if (fechas[0] > year) {
        showInputError(input, "Introduce una fecha válida")
        return false
    }

    if (year - fechas[0] < 18) {
        showInputError(input, "Debes ser mayor de edad para jugar")
        return false
    }
    return true
}

function checkNick(input) {
    const nickRegex = /.+\d$/

    if (emptyTextRegex.test(input.value)) {
        showInputError(input, "Este campo es obligatorio")
        return false
    }
    if (!nickRegex.test(input.value)) {
        showInputError(input, "El nick debe finalizar con un número")
        return false
    }
    return true
}

function checkEmail(input) {
    if (!emailRegex.test(input.value)) {
        showInputError(input, "Debes introducir un email del ITB válido")
        return false
    }
    return true
}

function checkRows(input) {
    const minRows = 3
    const maxRows = 40
    if (input.value < minRows) {
        showInputError(input, `El número mínimo de filas es ${minRows}`)
        return false
    }
    if (input.value > maxRows) {
        showInputError(input, `El número máximo de filas es ${maxRows}`)
        return false
    }
    return true
}

function checkCols(input) {
    const minCols = 3
    const maxCols = 40
    if (input.value < minCols) {
        showInputError(input, `El número mínimo de columnas es ${minCols}`)
        return false
    }
    if (input.value > maxCols) {
        showInputError(input, `El número máximo de columnas es ${maxCols}`)
        return false
    }
    return true
}

function checkBombs(rows, cols, bombs) {
    const maxBombs = Math.round((parseInt(rows.value) * parseInt(cols.value)) / 2)
    if (bombs.value < 1) {
        showInputError(bombs, "Almenos debe haber una bomba")
        return false
    }
    if (bombs.value > maxBombs) {
        showInputError(bombs, `El número máximo de bombas es ${maxBombs}`)
        return false
    }
    return true
}

function showInputError(input, message) {
    input.classList.add("invalid-input")

    const inputName = input.id.split("-")[1]
    const errMessage = document.getElementById(`${inputName}-error`)
    errMessage.textContent = message
    errMessage.style.display = "block"
}

function submitForm(data) {
    const jsonData = JSON.stringify(data)
    localStorage.setItem("userSettings", jsonData)
}

export function redirect(url) {
    window.location.assign(url)
}
