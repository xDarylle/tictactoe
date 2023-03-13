// player turn counter
let turn_counter = 1

// board state 
let board_state = []

let player1_score = 0
let player2_score = 0
let tie_score = 0

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
    }
}

function checkWinningCondition() {
    // per row checking
    for (i = 0; i < 9; i += 3) {
        if (board_state[i] && board_state[i + 1] && board_state[i + 2]) {
            if (board_state[i] === board_state[i + 1] && board_state[i + 1] === board_state[i + 2]) {
                return board_state[i]
            }
        }
    }

    // per column checking
    for (i = 0; i < 3; i++) {
        if (board_state[i] && board_state[i + 3] && board_state[i + 6]) {
            if (board_state[i] === board_state[i + 3] && board_state[i + 3] === board_state[i + 6]) {
                return board_state[i]
            }
        }
    }

    // diagonal checking from left to right
    if (board_state[0] && board_state[4] && board_state[8]) {
        if (board_state[0] === board_state[4] && board_state[4] === board_state[8]) {
            return board_state[0]
        }
    }

    // diagonal checking from right to left
    if (board_state[2] && board_state[4] && board_state[6]) {
        if (board_state[2] === board_state[4] && board_state[4] === board_state[6]) {
            return board_state[2]
        }
    }

    // game is tied if no moves left and no one won
    if (turn_counter === 10) {
        return 3
    }

    return false
}

function updateTurn() {
    const turn_text = document.getElementById('player-turn')

    if (turn_counter % 2 !== 0) {
        turn_text.innerText = "Player 1 (X)"
    }

    else {
        turn_text.innerText = "Player 2 (O)"
    }
}

function initializeBoard() {
    const board = document.getElementById('board')

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

