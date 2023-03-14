// player turn counter
let turn_counter = 1

// board state 
let board_state = []

let player1_score = 0
let player2_score = 0
let tie_score = 0

const win_conditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]

function cellOnClick(id) {
    const button = document.getElementById(id)
    const icon_container = document.createElement('div')
    const index = parseInt(id.split('-')[1])

    if (turn_counter % 2 !== 0) {
        icon_container.classList.add('playerX')
        board_state[index] = 1
    }

    else {
        icon_container.classList.add('playerCircle')
        board_state[index] = 2
    }

    button.appendChild(icon_container)
    button.disabled = true
    button.classList.remove('hover')

    // next turn
    turn_counter += 1
    updateTurn()


    checkWin()
}

function checkWin() {
    const player_win = checkWinningCondition()
    if (player_win) {
        if (player_win === 1) {
            player1_score++
            const score = document.getElementById('score-player-1')
            score.innerText = player1_score
        }
        if (player_win === 2) {
            player2_score++
            const score = document.getElementById('score-player-2')
            score.innerText = player2_score
        }

        if (player_win === 3) {
            tie_score++
            const score = document.getElementById('score-tie')
            score.innerText = tie_score
        }

        // reset game
        reset()        
    }
}

function checkWinningCondition() {
    // check if any of the win conditions is satisfied
    let winner = false
    win_conditions.forEach(combo => {
        if (board_state[combo[0]] && board_state[combo[1]] && board_state[combo[2]]) {
            if (board_state[combo[0]] === board_state[combo[1]] && board_state[combo[1]] === board_state[combo[2]]) {
                winner =  board_state[combo[0]]
            }
        }
    })

    // game is tied if no moves left and no one won
    if (turn_counter === 10 && !winner) {
        winner = 3
    }

    return winner
}

function updateTurn() {
    const turn_text = document.getElementById('player-turn')

    if (turn_counter % 2 !== 0) {
        turn_text.innerText = "Player 1 (X)"
    }

    else {
        turn_text.innerText = "CPU (O)"
    }
}

function reset() {
    // reset board state
    board_state = []

    // reset turn counter
    turn_counter = 1

    // update turn
    updateTurn()

    // reset the board
    initializeBoard()
}

function initializeBoard() {
    const board = document.getElementById('board')

    // empty the board
    board.replaceChildren()

    // add cells to board 
    for (i = 0; i < 9; i++) {
        const button = document.createElement('button')
        button.id = 'cell-' + i
        button.classList.add('cell')
        button.classList.add('hover')
        button.onclick = function () { cellOnClick(this.id) }
        board.appendChild(button)

        //initialize board state
        board_state.push(null)
    }
}

window.onload = function () {
    initializeBoard()
    updateTurn()
}

