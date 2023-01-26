'use strict'

var gSec=0
// var gMillisec = 0

function getRandomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min)) + min //The maximum is inclusive and the minimum is inclusive
}

function renderBoard() {

    var strHTML = '<table><tbody>'
    for (var i = 0; i < gBoard.length; i++) {

        strHTML += '<tr>'
        for (var j = 0; j < gBoard[0].length; j++) {

            const cell = gBoard[i][j]
            const className = `cell cell-${i}-${j}`

            strHTML += `<td class="${className}"  onclick="onCellClicked(this,${i},${j})" oncontextmenu="onCellMarked(this,${i},${j})"></td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'
    
    const elContainer = document.querySelector('.gboard')
    elContainer.innerHTML = strHTML
}

function renderCell(i,j,value){
    var elCell = document.querySelector(`.cell-${i}-${j}`)
        elCell.innerHTML= value

}


function timer(){
    gSec=0
 gTimerInterval = setInterval( () => {
    gSec += 1
    document.querySelector('.timer').innerText = (
        gSec)
}, 1000)
}


document.addEventListener("contextmenu", function(){
})
window.addEventListener("contextmenu", e => e.preventDefault());


// function timer() {
//     gMillisec=0
//     gSec=0
//     gTimerInterval = setInterval(() => {
//     gMillisec += 10
//     var elTimer = document.querySelector('.timer')
//     elTimer.innerText = `${gSec}.${gMillisec}`
//     if (gMillisec > 999) {
//         gMillisec = 0
//         gSec++
//     }
// },37)

// }




// function timer() {
//     var startTime = Date.now()

//      gTimerInterval = setInterval( () => {
//         var elapsedTime = Date.now() - startTime
//         document.querySelector('.timer').innerText = (
//             elapsedTime)
//     }, 1000)
// }


// function timer() {

// gSec+=1
//     var elTimer = document.querySelector('.timer')
//     elTimer.innerText =`${gSec}`

// }




