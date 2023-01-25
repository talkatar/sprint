'use strict'

var gNUMSMINES = 2
var gSize = 16
var gLevel = { SIZE: gSize, MINES: gNUMSMINES }
const MINE = '💣'
const FLAG = '🚩'
var gBoard
var gLeftflags = gNUMSMINES
var gTimerInterval
var gGameoverInterval


var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}




function onInit() {
    gGame.isOn = true
    // emogirestart()
    gBoard = buildBoard(gSize, gNUMSMINES)

    renderBoard()
    addingmines()

    setMinesNegsCount()
    console.log(gBoard);
    // gGameoverInterval=setInterval(checkGameOver,100)


}


function Levelgame(size, MINES) {

    gSize = size
    gNUMSMINES = MINES
    onInit()


}



function buildBoard(size, gMINES) {

    gNUMSMINES = gMINES
    gSize = size

    const ROW = gSize ** 0.5
    const COL = gSize ** 0.5


    const board = []

    for (var i = 0; i < ROW; i++) {
        board[i] = []
        for (var j = 0; j < COL; j++) {

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

    for (var i = 0; i < gSize ** 0.5; i++) {
        for (var j = 0; j < gSize ** 0.5; j++) {
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
        if (i < 0 || i >= gSize) continue

        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j >= gBoard[i].length) continue
            gBoard[i][j].minesAroundCount += 1
        }
    }
}





function onCellClicked(elCell, i, j) {
    if (gGame.isOn = false) {
        // emogirestart()
        return
    }
    if (gBoard[i][j].isMine) {
        elCell.innerText = MINE
        gGame.isOn = false
    }

    gGame.markedCount++

    gBoard[i][j].isShow = true
    gGame.shownCount++
    if (gGame.shownCount = gSize - gNUMSMINES) {
        // gameover()

    }




    gBoard[i][j].isShow = true
    elCell.innerText = gBoard[i][j].minesAroundCount



}







function onCellMarked(elCell) {
    console.log(elCell);



    // if (gGame.markedCount === gNUMSMINES) return
    // gGame.markedCount++

    // gBoard[i][j].isMarked = true
    // var elflags = document.querySelector('.leftflegs')
    // elflags.innerText = +gLeftflags
    // }


}

// function expandShown(board, elCell, i, j) {

// }




function addingmines() {
    var counter = gNUMSMINES
    console.log(counter);
    while (counter > 0) {
    var i = getRandomInt(0, gSize ** 0.5 - 1)
    var j = getRandomInt(0, gSize ** 0.5 - 1)
    console.log(i, j);

    if (gBoard[i][j].isMine === false) {
        counter--

        gBoard[i][j].isMine = true
        console.log(gBoard);
        var elCell = document.querySelector(`.cell-${i}-${j}`)
        elCell.innerHTML= '💣'
    }
}
}






window.addEventListener("contextmenu", e => e.preventDefault());
