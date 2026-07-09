// DOM elements
const statusText = document.getElementById('status')
const hourText = document.getElementById('hh')
const minText = document.getElementById('mm')
const dateText = document.getElementById('dd')
const suffixText = document.getElementById('sf')
const monthText = document.getElementById('month')
const glassUI = document.getElementById('glass')
const dayProgressValue = document.getElementById('dayProgressValue')
const dayProgress = document.getElementById('dayProgress')
const monthProgress = document.getElementById('monthProgress')
const monthProgressValue = document.getElementById('monthProgressValue')
const monthProgressText = document.getElementById('monthProgressText')
const yearProgress = document.getElementById('yearProgress')
const yearProgressValue = document.getElementById('yearProgressValue')
const yearProgressText = document.getElementById('yearProgressText')

// Variables
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const suffix = ["st", "nd", "rd", "th"]
const statuses = ["A new day began", "Now it's midnight", "Cool & calm dawn", "Mindful morning", "Bright noon", "Afternoon dusk", "Energetic evening", "Starry night"]
const flashSequences = [[500, "hide"], [30, "show"], [300, "hide"], [100, "show"], [2, "hide"], [2, "show"], [2, "hide"], [50, "show"], [200, "hide"], [12, "show"], [4, "hide"], [2, "show"]]

let clockInterval = null
let flashAnimationTimeout = null


// FUNC - Suffix (st / nd / rd / th) determinor for date
function dateSuffix(inputDate) {
    inputDate = String(inputDate)
    if (inputDate.endsWith('1')) {
        return suffix[0]
    } else if (inputDate.endsWith('2')) {
        return suffix[1]
    } else if (inputDate.endsWith('3')) {
        return suffix[2]
    } else {
        return suffix[3]
    }
}

// FUNC - Status text selector based on daytime
function dayStatus(inputHour) {
    inputHour = Number(inputHour)
    if (inputHour >= 22) {
        return statuses[7]
    } else if (inputHour >= 18) {
        return statuses[6]
    } else if (inputHour >= 14) {
        return statuses[5]
    } else if (inputHour >= 12) {
        return statuses[4]
    } else if (inputHour >= 6) {
        return statuses[3]
    } else if (inputHour >= 4) {
        return statuses[2]
    } else if (inputHour >= 1) {
        return statuses[1]
    } else if (inputHour == 0) {
        return statuses[0]
    }
}

function timeDisplay() {
    // Current datetime
    const currentDatetime = new Date()

    // Dynamic datetime definitions for progress calculations
    const startOfMonth = new Date(currentDatetime.getFullYear(), currentDatetime.getMonth(), 1)
    const endOfMonth = new Date(currentDatetime.getFullYear(), currentDatetime.getMonth() + 1, 0, 23, 59, 59);
    const startOfYear = new Date(currentDatetime.getFullYear(), 0, 1)
    const endOfYear = new Date(currentDatetime.getFullYear(), 11, 31, 23, 59, 59)

    // Number formats for displaying
    const currentHours = currentDatetime.getHours()
    const currentHH = Number(currentHours) > 9 ? currentHours : `0${currentHours}`
    const currentMins = currentDatetime.getMinutes()
    const currentMM = Number(currentMins) > 9 ? currentMins : `0${currentMins}`
    const currentSecs = currentDatetime.getSeconds()
    const currentDate = currentDatetime.getDate()
    const currentDD = Number(currentDate) > 9 ? currentDate : `0${currentDate}`
    const currentMonth = monthNames[currentDatetime.getMonth()]

    // Progress (day, month, year) calculations
    // FROMULA: day progress = (elapsed / duration * 100); elapsed day = (currentHours * 3600 + currentMins * 60 + currentSecs); day duration = (24 * 60 * 60 = 86400)
    const currentDayProgress = ((currentHours * 3600 + currentMins * 60 + currentSecs) / 86400 * 100).toFixed(2)
    // FORMULA: month progress = (elapsed / duration * 100); month elapsed = (currentDatetime - startOfMonth); month duration = (endOfMonth - startOfMonth)
    const currentMonthProgress = (((currentDatetime - startOfMonth) / (endOfMonth - startOfMonth)) * 100).toFixed(2)
    // FORMULA: year progress = (elapsed / duration * 100); year elapsed = (currentDatetime - startOfYear); year duration = (endOfYear - startOfYear)
    const currentYearProgress = (((currentDatetime - startOfYear) / (endOfYear - startOfYear)) * 100).toFixed(2)

    // Datetime display
    statusText.innerText = dayStatus(currentHours)
    hourText.innerText = currentHH
    minText.innerText = currentMM
    dateText.innerText = currentDD
    suffixText.innerText = dateSuffix(currentDD)
    monthText.innerText = currentMonth

    // HUD glass display
    dayProgressValue.innerText = `${Math.round(currentDayProgress)}% `
    dayProgress.setAttribute('style', `--height: ${currentDayProgress}%`)
    monthProgress.setAttribute('style', `--value: ${currentMonthProgress}`)
    monthProgressValue.innerText = `${Math.round(currentMonthProgress)}%`
    monthProgressText.innerText = `of ${currentMonth}`
    yearProgress.setAttribute('style', `--value: ${currentYearProgress}`)
    yearProgressValue.innerText = `${Math.round(currentYearProgress)}%`
    yearProgressText.innerText = `of ${currentDatetime.getFullYear()}`
}

// Main loop in every second
function startClock() {
    if (clockInterval) {
        clearInterval(clockInterval)
        clockInterval = null
    }

    clockInterval = setInterval(timeDisplay, 1000);
    console.log(clockInterval);
}





// HUD Glass Flash Animation
let currentSequence = 0

function flashAnimation() {
    const [delay, action] = flashSequences[currentSequence]
    
    flashAnimationTimeout = setTimeout(() => {
        action === 'hide' ? glassUI.classList.add('hide') : glassUI.classList.remove('hide')
        currentSequence = (currentSequence + 1) % flashSequences.length
        flashAnimation()
    }, delay * 50);
}



// STARTUP

window.addEventListener('DOMContentLoaded', () => {
    startClock()
    flashAnimation()
})



// CLEANUP

window.addEventListener('beforeunload', () => {
    if (clockInterval) {
        clearInterval(clockInterval)
        clockInterval = null
    }
    if (flashAnimationTimeout) {
        clearTimeout(flashAnimationTimeout)
        flashAnimationTimeout = null
    }
})