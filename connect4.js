class Player {
  constructor(color) {
    this.color = color;
  }
}

class ConnectFour {
  constructor(height = 6, width = 7) {
    this.height = height;
    this.width = width;
    this.players = [new Player('red'), new Player('blue')]; // default colors
    this.currPlayer = this.players[0];
    this.board = [];
    this.gameOver = false;

    this.makeBoard();
    this.makeHtmlBoard();
    this.addStartButton();
  }

  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }

  makeHtmlBoard() {
    const board = document.getElementById('board');

    // make column tops (clickable area for adding a piece to that column)
    const top = document.createElement('tr');
    top.setAttribute('id', 'column-top');

    // update: store the handleClick bound method so it can be removed and re-added
    this.boundHandleClick = this.handleClick.bind(this);

    top.addEventListener('click', this.boundHandleClick);

    for (let x = 0; x < this.width; x++) {
      const headCell = document.createElement('td');
      headCell.setAttribute('id', x);
      top.append(headCell);
    }
    board.append(top);

    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const row = document.createElement('tr');
      for (let x = 0; x < this.width; x++) {
        const cell = document.createElement('td');
        cell.setAttribute('id', `${y}-${x}`);
        row.append(cell);
      }
      board.append(row);
    }
  }

  findSpotForCol(x) {
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    return null;
  }

  checkForWin() {
    // Check four cells to see if they're all color of current player
    const _win = cells =>
      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        // get "check list" of 4 cells (starting here) for each of the different
        // ways to win
        const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
        const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
        const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
        const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

        // find winner (only checking each win-possibility as needed)
        if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
          return true;
        }
      }
    }
  }

  endGame(msg) {
    alert(msg);
    const top = document.querySelector("#column-top");
    top.removeEventListener("click", this.boundHandleClick);
  }

  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.classList.add('piece');
    piece.style.backgroundColor = this.currPlayer.color;
    piece.style.top = -50 * (y + 2);

    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }

  handleClick(evt) {
    if (this.gameOver) return; // stop handling clicks when the game is over

    const x = +evt.target.id;
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }

    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

    if (this.checkForWin()) {
      this.gameOver = true;
      return this.endGame(`Player ${this.currPlayer.color} won!`);
    }

    if (this.board.every(row => row.every(cell => cell))) {
      this.gameOver = true;
      return this.endGame('Tie!');
    }

    // switch players
    this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  }

  addStartButton() {
    const button = document.createElement('button');
    button.innerText = 'Start Game';
    button.addEventListener('click', () => this.startGame());

    const game = document.getElementById('game');
    game.append(button);
  }

  startGame() {
    this.gameOver = false;
    this.board = [];
    this.makeBoard();
    const htmlBoard = document.getElementById('board');
    while (htmlBoard.firstChild) {
      htmlBoard.firstChild.remove();
    }
    this.makeHtmlBoard();

    // get player colors from inputs
    const color1 = document.getElementById('player1-color').value;
    const color2 = document.getElementById('player2-color').value;
    if (color1) this.players[0].color = color1;
    if (color2) this.players[1].color = color2;

    this.currPlayer = this.players[0]; // reset the current player
  }
}

let cf = new ConnectFour();
