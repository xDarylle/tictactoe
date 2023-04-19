import { questions } from "./questions.js"
// player turn counter
let turn_counter = 1

// board state 
let board_state = []

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
    const index = parseInt(id.split('-')[1])
    board_state[index] = 1
    placeMove(id, 1)

    let player_win = checkWinningCondition(board_state)
    playerWin(player_win)

    disableCells(true)

    // cpu's turn
    if (!player_win) {
        setTimeout(() => {
            const cpu_move = getCPUMove()
            board_state[cpu_move] = 2
            placeMove(`cell-${cpu_move}`, 2)
            player_win = checkWinningCondition(board_state)
            playerWin(player_win)

            if (!player_win) {
                setTimeout(() => {
                    openQuestion()
                    disableCells(false)
                }, 1200)
            }
        }, 1000)
    }
}

function getRandomQuestion() {
    return questions[Math.floor(Math.random() * questions.length)]
}

function openQuestion() {
    const question = getRandomQuestion()

    const choices_container = document.getElementById('answer-container')
    choices_container.replaceChildren()

    for (var i = 0; i < question.choices.length; i++) {
        const button = document.createElement('button')
        const choice = question.choices[i]
        button.id = 'choice-' + i
        button.classList.add('answer')
        button.classList.add('answer-hover')
        button.innerText = choice
        button.onclick = function () { clickAnswer(question.answer, choice, this.id) }

        choices_container.appendChild(button)
    }

    const question_container = document.getElementById('question')
    question_container.innerText = question.question

    const modal = document.getElementById('question-container')
    modal.style.visibility = "visible"

    const question_modal = document.getElementById('question-modal')
    question_modal.style.animationName = "modal-reveal"

    setTimeout(() => {
        question_modal.style.transform = "scale(1)"
    }, 200)
}

function clickAnswer(answer, choice, id) {
    const button = document.getElementById(id)
    button.classList.remove('answer-hover')

    let isCorrect = (answer === choice)

    if (isCorrect) {
        button.classList.add('correct')
    } else {
        button.classList.add('incorrect')
    }

    setTimeout(() => {
        const question_modal = document.getElementById('question-modal')
        question_modal.style.animationName = "modal-close"
        question_modal.style.transform = "scale(0)"

        setTimeout(() => {
            const modal = document.getElementById('question-container')
            modal.style.visibility = "hidden"
        }, 250)

        if (!isCorrect) {
            disableCells(true)

            turn_counter += 1
            updateTurn()

            setTimeout(() => {
                const cpu_move = getCPUMove()
                board_state[cpu_move] = 2
                placeMove(`cell-${cpu_move}`, 2)

                let player_win = checkWinningCondition(board_state)
                playerWin(player_win)

                if (!player_win) {
                    setTimeout(() => {
                        openQuestion()
                        disableCells(false)
                    }, 1000)
                }
            }, 1000)
        }
    }, 300)
}

function placeMove(cell_id, player) {
    const button = document.getElementById(cell_id)
    const icon_container = document.createElement('div')

    if (player === 1) {
        icon_container.classList.add('playerX')
    }

    if (player === 2) {
        icon_container.classList.add('playerCircle')
    }

    button.appendChild(icon_container)
    button.disabled = true
    button.classList.remove('hover')

    // next turn
    turn_counter += 1

    // update turn
    updateTurn()
}

function getCPUMove() {
    const empty_cells = []
    const cpu_possible_moves = []
    const player_possible_winning_moves = []

    // find all available moves
    board_state.forEach((cell, index) => {
        if (cell === null) empty_cells.push(index)
    })

    // find winning moves for player 1
    empty_cells.forEach(index => {
        const new_state = board_state.slice()
        new_state[index] = 1

        const player_win = checkWinningCondition(new_state)
        if (player_win) {
            player_possible_winning_moves.push(index)
        }
    })

    // find winning moves for cpu
    empty_cells.forEach(index => {
        const new_state = board_state.slice()
        new_state[index] = 2

        const player_win = checkWinningCondition(new_state)
        if (player_win) {
            cpu_possible_moves.push(index)
        }
    })

    // choose random available move
    let cpu_move = empty_cells[Math.floor(Math.random() * empty_cells.length)]

    // if cpu has no possible winning moves check and if player has possible winning move
    // set player's winning move as cpu's move 
    if (cpu_possible_moves <= 0 && player_possible_winning_moves.length) {
        cpu_move = player_possible_winning_moves[Math.floor(Math.random() * player_possible_winning_moves.length)]
    }

    // choose any of cpu's possible winning moves,
    if (cpu_possible_moves.length > 0) {
        cpu_move = cpu_possible_moves[Math.floor(Math.random() * cpu_possible_moves.length)]
    }

    return cpu_move
}


function playerWin(player_win) {
    if (player_win) {
        const winner = document.getElementById('winner')
        if (player_win === 1) {
            winner.innerText = "PLAYER 1"
        }

        if (player_win === 2) {
            winner.innerText = "CPU"
        }

        if (player_win === 3) {
            winner.innerText = "TIE"
        }

        //disable cells 
        disableCells(true)

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

function checkWinningCondition(board) {
    // check if any of the win conditions is satisfied
    let winner = false
    win_conditions.forEach(combo => {
        if (board[combo[0]] && board[combo[1]] && board[combo[2]]) {
            if (board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
                winner = board[combo[0]]
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

function disableCells(disabled) {
    for (var i = 0; i < 9; i++) {
        if (board_state[i] === null) {
            const button = document.getElementById(`cell-${i}`)
            button.disabled = disabled
        }
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

function closeMenu() {
    const menu = document.getElementById('menu-container')
    menu.style.visibility = "hidden"

    openQuestion()
}

function backMenu() {
    const menu = document.getElementById('menu-container')
    menu.style.visibility = "visible"

    reset()
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
    for (var i = 0; i < 9; i++) {
        const button = document.createElement('button')
        button.id = 'cell-' + i
        button.classList.add('cell')
        button.classList.add('hover')
        button.onclick = function () { cellOnClick(this.id) }
        board.appendChild(button)

        //initialize board state
        board_state.push(null)
    }

    const reset_button = document.getElementById('restart-btn')
    reset_button.onclick = function () { reset() }

    const exit_button = document.getElementById('exit-btn')
    exit_button.onclick = function () { backMenu() }

    const play_button = document.getElementById('play-btn')
    play_button.onclick = function () { closeMenu() }
}

window.onload = function () {
    initializeBoard()
    updateTurn()
}

