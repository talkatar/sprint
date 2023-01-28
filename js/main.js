'use strict'

var gNUMSMINES = 2
var gSize = 16
var gMatLength  //The mat we get from the user is square. length is relvat for rows and cols
var gLevel = { SIZE: gSize, MINES: gNUMSMINES }
const MINE = '💣'
const FLAG = '🚩'
const EMPTY = ''
var gThreeLife = '❤️❤️❤️'
var gOneLife = '❤️'
var gHintCounter = 3
var gIsHintOn = false
var gSafeCounter = 3
var gIsmanuallyMines = false
var gCounterMines = gNUMSMINES
var gIsDarkMode = false

var gBoard
var gTimerInterval
var gCheckGameOver
var gSecPassInterval
var gFirstClick = 1
var gLifeCounter = 3
var gLifeBeginCounter = 1

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
    gLifeCounter = 3
    gLifeBeginCounter = 1
    gHintCounter = 3
    gSafeCounter = 3
    gIsHintOn = false
    gIsmanuallyMines = false
    gIsDarkMode = false

    gCounterMines = gNUMSMINES

    clearingIntervals()
    initQuerSel()



    gGame.isOn = true
    gBoard = buildBoard(gSize, gNUMSMINES)
    renderBoard()

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

    if (gGame.isOn === false) {
        return
    }

    if (gIsHintOn === true) {
        showNg(i, j)
        gIsHintOn = false
        return
    }
    else if (gIsmanuallyMines === false) {
        document.querySelector('.manuallyMines').style.display = 'none'
    }

    if (gIsmanuallyMines === true) {

        if (gBoard[i][j].isMine === true) return

        gBoard[i][j].isMine = true
        gCounterMines--
        console.log(gCounterMines
        );

        if (gCounterMines > 0) {
            return
        }
        gIsmanuallyMines = false
        setMinesNegsCount()
        return
    }

    if (gCounterMines === 0) {
        timer()
    }


    if (gBoard[i][j].isShown === true || gBoard[i][j].isMarked === true) {

        return
    }

    if (gFirstClick === 1) {

        gBoard[i][j].isShown = true



        var isMines = checkingIfMines()

        if (!isMines) //the user didnt use safe click or hint for first time or manuallymines
        {
            addingmines()
            setMinesNegsCount()
            timer()
        }
        var elTime = document.querySelector('.timer span')
        gSecPassInterval = setInterval(() => { gGame.secsPassed = +elTime.innerText }, 1)
        gFirstClick++
        console.log(gBoard);
    }


    if (gBoard[i][j].isMine) {


        if (gSize === 16) {
            gLifeBeginCounter--
        }

        else { gLifeCounter-- }

        renderCell(i, j, MINE)
        lifeStr()

        if (gLifeCounter === 0 || gLifeBeginCounter === 0) gGame.isOn = false

        return
    }

    gGame.shownCount++

    gBoard[i][j].isShown = true

    if (gGame.shownCount === (gSize - gNUMSMINES) && gGame.markedCount === gNUMSMINES) {
        gGame.isOn = false
    }

    gBoard[i][j].isShown = true
    elCell.innerText = gBoard[i][j].minesAroundCount

    if (gBoard[i][j].minesAroundCount === 0) {
        expandShown(i, j)
    }



}

function expandShown(i, j) {


    var rowIdx = i
    var colIdx = j

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gMatLength) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= gMatLength) continue
            var elCell = document.querySelector(`.cell-${i}-${j}`)
            onCellClicked(elCell, i, j)
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

        if (gBoard[i][j].isMine === false && gBoard[i][j].isShown === false
        ) {
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
        var elCell = document.querySelector(`h3`)
        elCell.innerText = 'You Are A Queen\\King 🤩👑'

        bestTime()

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
    else if (gGame.shownCount === (gSize - gNUMSMINES) && gGame.markedCount === gNUMSMINES) {
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

    document.querySelector('.timer span').innerText = '0'
    document.querySelector('h3').innerText = ''
    document.querySelector('.btn-restart').innerText = '😎'
    document.querySelector('.leftflegs').innerText = ''
    document.querySelector('.hint').innerText = '🔔🔔🔔'
    document.querySelector('.safeclick span').innerText = '3'
    document.querySelector('.manuallyMines').style.display = 'block'
    if (gSize === 16) document.querySelector('.bestime span').innerText = localStorage.getItem('bestTimeBg');
    else if (gSize === 64) document.querySelector('.bestime span').innerText = localStorage.getItem('besTimMed');
    else { document.querySelector('.bestime span').innerText = localStorage.getItem('besTimexp'); }


    if (gSize === 16) {
        document.querySelector('h2').innerText = gOneLife
    }
    else {
        document.querySelector('h2').innerText = gThreeLife
    }

}


function lifeStr() {

    var lifeStr = ''

    if (gSize === 16) lifeStr = ''
    else {
        for (var i = 0; i < (gLifeCounter); i++) {
            lifeStr += '❤️'
        }
        if (gLifeCounter === 0) lifeStr = ''
    }

    document.querySelector('h2').innerText = `${lifeStr} `

}


function hintInitialize() {
    if (gGame.isOn === false) return


    var isMines = checkingIfMines()
    if (!isMines) //if user click hint before first click and safe click
    {

        addingmines()
        setMinesNegsCount()
        timer()
    }

    gHintCounter--
    if (gHintCounter === -1) return
    var elHint = document.querySelector('.hint')
    if (gHintCounter === 2) elHint.innerText = '🔕🔔🔔'
    else if (gHintCounter === 1) elHint.innerText = '🔕🔕🔔'
    else elHint.innerText = '🔕🔕🔕'
    gIsHintOn = true


}

function showNg(i, j) {


    var rowIdx = i
    var colIdx = j

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i >= gMatLength) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j >= gMatLength) continue



            if (gBoard[i][j].isMine) {
                renderCell(i, j, MINE)
            }

            else {
                renderCell(i, j, gBoard[i][j].minesAroundCount)
            }
            setTimeout(() => {

                for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
                    if (i < 0 || i >= gMatLength) continue
                    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
                        if (j < 0 || j >= gMatLength) continue
                        if (gBoard[i][j].isShown === false) {
                            renderCell(i, j, EMPTY)
                        }
                    }
                }

            }, 1000)
        }
    }
}

function bestTime() {

    var bestTimeBg = +localStorage.getItem('bestTimeBg');
    var besTimMed = +localStorage.getItem('bestTimeBg');
    var besTimexp = +localStorage.getItem('bestTimeBg');


    if (gSize === 16) {

        if (!bestTimeBg) { bestTimeBg = gGame.secsPassed }
        else if (gGame.secsPassed < bestTimeBg) {
            bestTimeBg = gGame.secsPassed

        }

        else return

        localStorage.setItem('bestTimeBg', JSON.stringify(bestTimeBg))
        document.querySelector('.bestime span').innerText = +localStorage.getItem('bestTimeBg');



    }

    else if (gSize === 64) {

        if (!besTimMed) { besTimMed = gGame.secsPassed }

        else if (gGame.secsPassed < besTimMed) {
            besTimMed = gGame.secsPassed

        }

        else return

        localStorage.setItem('besTimMed', JSON.stringify(besTimMed))
        document.querySelector('.bestime span').innerText = localStorage.getItem('besTimMed');
    }


    else {

        if (!besTimexp) { besTimexp = gGame.secsPassed }

        else if (gGame.secsPassed < besTimexp) {
            besTimexp = gGame.secsPassed
        }

        else return

        localStorage.setItem('besTimexp', JSON.stringify(besTimexp))
        document.querySelector('.bestime span').innerText = localStorage.getItem('besTimexp')
    }
}


function safeClickInit() {

    if (gGame.isOn === false) return
    if (gSafeCounter === 0) return

    var isMines = checkingIfMines()
    if (!isMines)  // if the user using safe click for first time without clicking any cell
    {
        addingmines()
        setMinesNegsCount()
        timer()
    }

    gSafeCounter--
    document.querySelector('.safeclick span').innerText = `${gSafeCounter}`

    console.log('hi');
    var safeCells = []

    for (var i = 0; i < gMatLength; i++) {
        for (var j = 0; j < gMatLength; j++) {

            if (gBoard[i][j].isMine === false && gBoard[i][j].isShown === false
                && gBoard[i][j].isMarked === false
            ) {
                safeCells.push({ i, j })
            }
        }
    }

    console.log(safeCells);
    if (safeCells.length === 0) return
    var randIdx = getRandomInt(0, safeCells.length - 1)
    var safeRdCell = safeCells[randIdx]


    document.querySelector('.manuallyMines').style.display = 'none'



    document.querySelector(`.cell-${safeRdCell.i}-${safeRdCell.j}`).style.backgroundColor = '#f6ff00'

    if (gIsDarkMode === true) {
        setTimeout(() => {
            document.querySelector(`.cell-${safeRdCell.i}-${safeRdCell.j}`).style.backgroundColor = '#49ff18'
            // document.querySelector(`.cell-${safeRdCell.i}-${safeRdCell.j}`).classList.add('.cell')

        }, 2000)


    }

    else {
        setTimeout(() => {
            document.querySelector(`.cell-${safeRdCell.i}-${safeRdCell.j}`).style.backgroundColor = '#0ae4dd'
            // document.querySelector(`.cell-${safeRdCell.i}-${safeRdCell.j}`).classList.add('.cell')

        }, 2000)
    }
}

function checkingIfMines() {

    var isMines = false

    for (var i = 0; i < gMatLength; i++) {
        for (var j = 0; j < gMatLength; j++) {

            if (gBoard[i][j].isMine === true) isMines = true

        }
    }

    return isMines
}

function manuallyMines() {
    var isMines = checkingIfMines()

    if (isMines) return // if there are already mines
    gIsmanuallyMines = true



}

function darkMode() {

    if (gIsDarkMode === false) {

        document.querySelector('body').style.backgroundImage = 'url(https://img3.goodfon.com/original/1920x1080/f/e6/polosy-neon-chernyy.jpg)'
        for (var i = 0; i < gMatLength; i++) {
            for (var j = 0; j < gMatLength; j++) {
                document.querySelector(`.cell-${i}-${j}`).style.backgroundColor = '#49ff18'
                document.querySelector(`.cell-${i}-${j}`).style.color = '#1833ff'

            }
        }

        gIsDarkMode = true

    }


    else {

        document.querySelector('body').style.backgroundImage = 'url(https://cdnb.artstation.com/p/assets/images/images/033/752/895/large/sibylle-hell-litegames-minesweeperworld-defaultbg.jpg?1610477693)'

        for (var i = 0; i < gMatLength; i++) {
            for (var j = 0; j < gMatLength; j++) {
                document.querySelector(`.cell-${i}-${j}`).style.backgroundColor = '#0ae6df'
                document.querySelector(`.cell-${i}-${j}`).style.color = '#0044ff'
            }
        }

        gIsDarkMode = false
    }

}


