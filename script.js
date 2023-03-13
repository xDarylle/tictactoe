// player turn counter
let turn_counter = 1

// board state 
let board_state = []

function cellOnClick(id) {
    const button = document.getElementById(id)
    const icon_container = document.createElement('div')

    if (turn_counter % 2 !== 0) {
        icon_container.classList.add('playerX')
    }

    else {
        icon_container.classList.add('playerCircle')
    }

    button.appendChild(icon_container)
    button.disabled = true
    button.classList.remove('hover')

    // next turn
    turn_counter += 1
    updateTurn()
}

function updateTurn() {
    const turn_text = document.getElementById('player-turn')

    if (turn_counter % 2 !== 0) {
        turn_text.innerText= "Player 1 (X)"
    }

    else {
        turn_text.innerText= "Player 2 (O)"
    }
}

function initializeBoard() {
    const board = document.getElementById('board')

    for(i=0; i < 9; i++) {
        const button = document.createElement('button')
        button.id = 'cell-' + i
        button.classList.add('cell')
        button.classList.add('hover')
        button.onclick =  function(){cellOnClick(this.id)}
        board.appendChild(button)
    }
}

window.onload = function() {
    initializeBoard()
    updateTurn()
}

