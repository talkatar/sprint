'use strict'

var gNUMSMINES = 2
var gSize = 16
var gMatLength  //The mat we get from the user is square. length is relvat for rows and cols
var gLevel = { SIZE: gSize, MINES: gNUMSMINES }

const MINE = '💣'
const FLAG = '🚩'
const EMPTY = ''

var gBoard
var gTimerInterval
var gCheckGameOver
var gSecPassInterval
var gFirstClick = 1

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}


function onInit() {

    gGame.shownCount = 0
    gGame.markedCount = 0
    gGame.secsPassed = 0
    gFirstClick = 1

    clearingIntervals()
    initQuerSel()



    gGame.isOn = true
    gBoard = buildBoard(gSize, gNUMSMINES)
    renderBoard()
    addingmines()
    setMinesNegsCount()
    gCheckGameOver = setInterval(checkGameOver, 100)

    console.log(gBoard);

}


function Levelgame(size, MINES) {

    gSize = size
    gNUMSMINES = MINES
    onInit()
}


function buildBoard(size, gMINES) {

    gNUMSMINES = gMINES
    gSize = size
    gMatLength = gSize ** 0.5


    const board = []

    for (var i = 0; i < gMatLength; i++) {
        board[i] = []
        for (var j = 0; j < gMatLength; j++) {

            const cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }

            board[i][j] = cell
        }
    }
    return board
}


function setMinesNegsCount() {

    for (var i = 0; i < gMatLength; i++) {
        for (var j = 0; j < gMatLength; j++) {
            if (gBoard[i][j].isMine === true) {

                minesAroundCount(i, j)
            }
        }
    }
}


function minesAroundCount(i, j) {

    var rowIdx = i
    var colIdx = j

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gMatLength) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= gMatLength) continue
            gBoard[i][j].minesAroundCount += 1
        }
    }
}


function onCellClicked(elCell, i, j) {

    if (gBoard[i][j].isShown === true || gBoard[i][j].isMarked === true) {

        return
    }

    if (gFirstClick === 1) {
        timer()
        var elTime = document.querySelector('.timer')
        gSecPassInterval = setInterval(() => { gGame.secsPassed = elTime.innerText }, 37)
        gFirstClick++
    }

    if (gGame.isOn === false) {
        return
    }


    if (gBoard[i][j].isMine) {
        gGame.isOn = false
        return
    }

    gGame.shownCount++

    gBoard[i][j].isShown = true

    if (gGame.shownCount === (gSize - gNUMSMINES) && gGame.markedCount === gNUMSMINES) {
        gGame.isOn = false
    }

    gBoard[i][j].isShown = true
    elCell.innerText = gBoard[i][j].minesAroundCount

    expandShown(i, j)

}

function expandShown(i, j) {

    var rowIdx = i
    var colIdx = j

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gMatLength) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= gMatLength) continue

            if (gBoard[i][j].isMine === false && gBoard[i][j].isMarked === false) {


                if (gBoard[i][j].isShown === false) {
                    gGame.shownCount++
                    gBoard[i][j].isShown = true
                }

                if (gGame.shownCount === (gSize - gNUMSMINES) && gGame.markedCount === gNUMSMINES) {
                    gGame.isOn = false
                }

                gBoard[i][j].isShown = true
                var elCell = document.querySelector(`.cell-${i}-${j}`)
                elCell.innerText = gBoard[i][j].minesAroundCount

            }
        }
    }
}


function onCellMarked(elCell, i, j) {


    if (gBoard[i][j].isShown === true || gGame.isOn === false) return


    if (gBoard[i][j].isMarked === true) {
        gBoard[i][j].isMarked = false
        renderCell(i, j, EMPTY)
        gGame.markedCount--
    }

    else if (gGame.markedCount === gNUMSMINES) return

    else {
        gBoard[i][j].isMarked = true
        renderCell(i, j, FLAG)
        gGame.markedCount++
    }

    var elflags = document.querySelector('.leftflegs')

    if ((gNUMSMINES - gGame.markedCount) > 1)

        elflags.innerText = `${gNUMSMINES - gGame.markedCount} Flags Left ${FLAG}`

    else if ((gNUMSMINES - gGame.markedCount) === 1) {
        elflags.innerText = `${gNUMSMINES - gGame.markedCount} Flag Left ${FLAG}`
    }

    else {
        elflags.innerText = `No Flags Left ${FLAG}`
    }


    if (gGame.shownCount === (gSize - gNUMSMINES) && gGame.markedCount === gNUMSMINES) {
        gGame.isOn = false
    }

}

function addingmines() {

    var counter = gNUMSMINES

    while (counter > 0) {
        var i = getRandomInt(0, gMatLength - 1)
        var j = getRandomInt(0, gMatLength - 1)

        if (gBoard[i][j].isMine === false) {
            counter--
            gBoard[i][j].isMine = true
        }
    }
}

function checkGameOver() {
    if (gGame.isOn === false) {
        gameover()
    }
}


function gameover() {
    
    if (gGame.shownCount === (gSize - gNUMSMINES) && gGame.markedCount === gNUMSMINES) {
        var elCell = document.querySelector(`h2`)
        elCell.innerText = 'You Are A Queen\\King 🤩👑'
    }

    clearingIntervals()

    console.log(gLevel);
    console.log(gGame);
    console.log(gBoard);

    for (var i = 0; i < gMatLength; i++) {
        for (var j = 0; j < gMatLength; j++) {
            if (gBoard[i][j].isMine === true) {
                renderCell(i, j, MINE)
            }
        }
    }
    emogirestart()
}


function emogirestart() {
    if (gGame.shownCount !== gSize - gNUMSMINES) {
        var elrestart = document.querySelector('.btn-restart')
        elrestart.innerText = '😞'
    }
    else if (gGame.shownCount === (gSize - gNUMSMINES) && gGame.markedCount === gNUMSMINES)  {
        var elrestart = document.querySelector('.btn-restart')
        elrestart.innerText = '👑'
    }


    else {
        var elrestart = document.querySelector('.btn-restart')
        elrestart.innerText = '😎'
    }
}


function clearingIntervals() {
    clearInterval(gCheckGameOver)
    clearInterval(gTimerInterval)
    clearInterval(gSecPassInterval)
}


function initQuerSel() {
    document.querySelector('.timer').innerText = '00.000'
    document.querySelector('h2').innerText = ''
    document.querySelector('.btn-restart').innerText = '😎'
    document.querySelector('.leftflegs').innerText = ''
}




