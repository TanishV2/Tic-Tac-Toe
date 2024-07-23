document.addEventListener('DOMContentLoaded', () => {
  const gridItems = document.querySelectorAll('.grid-item');
  const display = document.querySelector('.display');
  const newGameButton = document.getElementById('new-game-button');
  const toggleButton = document.getElementById('toggle-button');

  let currentPlayer = 'Player 1';
  let gameMode = 'human';
  let gameActive = true;
  let board = ['', '', '', '', '', '', '', '', ''];
  let computerMoveTimeout;

  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  function handleCellClick(event) {
    if (currentPlayer === 'Computer') {
      return; // Prevent player move during computer's turn
    }

    const clickedCell = event.target;
    const clickedCellIndex = Array.from(gridItems).indexOf(clickedCell);

    if (board[clickedCellIndex] !== '' || !gameActive) {
      return;
    }

    markCell(clickedCell, clickedCellIndex);
    checkResult();

    if (gameMode === 'computer' && gameActive) {
      computerMoveTimeout = setTimeout(computerMove, 1000);
    }
  }

  function markCell(cell, index) {
    if (currentPlayer === 'Player 1' || currentPlayer === 'Player') {
      board[index] = 'X';
      cell.classList.add('x');
      currentPlayer = gameMode === 'human' ? 'Player 2' : 'Computer';
    } else if (currentPlayer === 'Player 2' || currentPlayer === 'Computer') {
      board[index] = 'O';
      cell.classList.add('o');
      currentPlayer = gameMode === 'human' ? 'Player 1' : 'Player';
    }
    updateDisplay();
  }

  function updateDisplay() {
    if (!gameActive) {
      return;
    }
    display.textContent = `${currentPlayer}'s turn`;
  }

  function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winningConditions.length; i++) {
      const winCondition = winningConditions[i];
      let a = board[winCondition[0]];
      let b = board[winCondition[1]];
      let c = board[winCondition[2]];

      if (a === '' || b === '' || c === '') {
        continue;
      }
      if (a === b && b === c) {
        roundWon = true;
        break;
      }
    }

    if (roundWon) {
      if (gameMode === 'computer' && currentPlayer === 'Player') {
        display.textContent = 'Computer Wins!';
      } else {
        display.textContent = `${gameMode === 'human' ? (currentPlayer === 'Player 1' ? 'Player 2 Wins!' : 'Player 1 Wins!') : 'Player Wins!'}`;
      }
      gameActive = false;
      return;
    }

    if (!board.includes('')) {
      display.textContent = 'Draw!';
      gameActive = false;
      return;
    }
  }

  function computerMove() {
    const bestMove = findBestMove(board);
    const cell = gridItems[bestMove];

    markCell(cell, bestMove);
    checkResult();
  }

  function findBestMove(board) {
    let bestVal = -1000;
    let bestMove = -1;

    for (let i = 0; i < board.length; i++) {
      if (board[i] === '') {
        board[i] = 'O';
        let moveVal = minimax(board, 0, false);
        board[i] = '';

        if (moveVal > bestVal) {
          bestMove = i;
          bestVal = moveVal;
        }
      }
    }
    return bestMove;
  }

  function minimax(board, depth, isMax) {
    let score = evaluate(board);

    if (score === 10) return score - depth;
    if (score === -10) return score + depth;
    if (!board.includes('')) return 0;

    if (isMax) {
      let best = -1000;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
          board[i] = 'O';
          best = Math.max(best, minimax(board, depth + 1, !isMax));
          board[i] = '';
        }
      }
      return best;
    } else {
      let best = 1000;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
          board[i] = 'X';
          best = Math.min(best, minimax(board, depth + 1, !isMax));
          board[i] = '';
        }
      }
      return best;
    }
  }

  function evaluate(board) {
    for (let i = 0; i < winningConditions.length; i++) {
      const winCondition = winningConditions[i];
      let a = board[winCondition[0]];
      let b = board[winCondition[1]];
      let c = board[winCondition[2]];

      if (a === 'O' && b === 'O' && c === 'O') {
        return 10;
      } else if (a === 'X' && b === 'X' && c === 'X') {
        return -10;
      }
    }
    return 0;
  }

  function newGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    gridItems.forEach(cell => {
      cell.classList.remove('x', 'o');
    });

    // Clear any pending computer move
    clearTimeout(computerMoveTimeout);

    // Reset current player and display based on game mode
    if (gameMode === 'human') {
      currentPlayer = 'Player 1';
      display.textContent = 'Player 1\'s turn';
    } else {
      currentPlayer = 'Player'; // Start with Player in vs computer mode
      display.textContent = 'Player\'s turn';
    }
  }

  function toggleMode() {
    gameMode = gameMode === 'human' ? 'computer' : 'human';
    toggleButton.textContent = gameMode === 'human' ? 'Vs Computer' : 'Vs Player';
    newGame(); // Call newGame to reset the board and current player
  
    // Update the display based on the game mode and current player
    updateDisplay();
  }

  gridItems.forEach(cell => cell.addEventListener('click', handleCellClick));
  newGameButton.addEventListener('click', newGame);
  toggleButton.addEventListener('click', toggleMode);

  updateDisplay();
});
