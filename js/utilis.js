'use strict'





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

            strHTML += `<td class="${className}"  onclick="onCellClicked(this,${i},${j})" 
            onclick="onCellMarked(elCell)"></td>`
        }
        strHTML += '</tr>'
    }
    strHTML += '</tbody></table>'
    
    const elContainer = document.querySelector('.gboard')
    elContainer.innerHTML = strHTML
}




// function emogirestart(){

//     if(gGame.isOn===false){
//     var elrestart = document.querySelector('.btn-restart')
//     elrestart.innerText ='😞'}

//     else{
//         elrestart.innerText ='😎'
//     }

// }



// function timer() {
//     var startTime = Date.now()

//      gTimerInterval = setInterval( () => {
//         var elapsedTime = Date.now() - startTime
//         document.querySelector('.timer').innerText = (
//             elapsedTime)
//     }, 37)
// }

// function checkGameOver() {
//     // if (gGame.isOn=false)
// clearInterval(gGameoverInterval)



    
// }

window.addEventListener("contextmenu", e => e.preventDefault());





