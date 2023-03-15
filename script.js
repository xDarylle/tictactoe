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

let winning_cells = []

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
        const winner = document.getElementById('winner')
        if (player_win === 1) {
            player1_score++
            const score = document.getElementById('score-player-1')
            score.innerText = player1_score
            winner.innerText = "PLAYER 1"
        }

        if (player_win === 2) {
            player2_score++
            const score = document.getElementById('score-player-2')
            score.innerText = player2_score
            winner.innerText = "CPU"
        }

        if (player_win === 3) {
            tie_score++
            const score = document.getElementById('score-tie')
            score.innerText = tie_score
            winner.innerText = "TIE"
        }

        //disable cells 
        disableCells()

        //animate winning cells
        winning_cells.forEach(index => {
            const cell = document.getElementById(`cell-${index}`)
            cell.firstChild.style.animation = "winner 500ms"
        })

        // popup modal
        const container = document.getElementById('restart-container')
        container.style.visibility = "visible"

        if (player_win === 3) {
            container.style.transitionDelay = "500ms"
        } else {
            container.style.transitionDelay = "1s"
        }
    }
}

function checkWinningCondition() {
    // check if any of the win conditions is satisfied
    let winner = false
    win_conditions.forEach(combo => {
        if (board_state[combo[0]] && board_state[combo[1]] && board_state[combo[2]]) {
            if (board_state[combo[0]] === board_state[combo[1]] && board_state[combo[1]] === board_state[combo[2]]) {
                winner = board_state[combo[0]]
                winning_cells = [combo[0], combo[1], combo[2]]
            }
        }
    })

    // game is tied if no moves left and no one won
    if (turn_counter === 10 && !winner) {
        winner = 3
        winning_cells = []
    }

    return winner
}

function disableCells() {
    for (i = 0; i < 9; i++) {
        const button = document.getElementById(`cell-${i}`)
        button.disabled = true
    }
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
    // popup modal
    const container = document.getElementById('restart-container')
    container.style.visibility = "hidden"
    container.style.transitionDelay = "0ms"

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

