export const PLAYGROUND_SIZE = 9;
export const MAX_MINES = 10;

export type Cell = {
  x: number;
  y: number;
  isMine: boolean;
  neighbor: number;
  isRevealed: boolean;
  isEmpty: boolean;
  isFlagged: boolean;
  isClicked: boolean;
};

export const initBoard = () => {
  let board = createEmptyBoard();
  board = plantMines(board);
  board = setNumberOfMines(board);
  return board;
};

const createEmptyBoard = (): Cell[][] =>
  Array.from({ length: PLAYGROUND_SIZE }).map((_, rowIndex) =>
    Array.from({ length: PLAYGROUND_SIZE }).map((_, columnIndex) => ({
      x: rowIndex,
      y: columnIndex,
      isMine: false,
      neighbor: 0,
      isRevealed: false,
      isEmpty: false,
      isFlagged: false,
      isClicked: false
    }))
  );

export const getRandomNumber = () => {
  return Math.floor(Math.random() * PLAYGROUND_SIZE);
};

/**
 * Randomly plants mines to the board
 * @param board
 */
const plantMines = (board: Cell[][]) => {
  let plantMines = 0;

  while (plantMines < MAX_MINES) {
    let x = getRandomNumber();
    let y = getRandomNumber();
    if (!board[x][y].isMine) {
      board[x][y].isMine = true;
      board[x][y].isEmpty = false;
      plantMines++;
    }
  }
  return board;
};

/**
 * Sets number of mines each neighbor cell where is mine planted
 * @param board
 */
const setNumberOfMines = (board: Cell[][]) =>
  board.map(row =>
    row.map(col => {
      if (!col.isMine) {
        let mine = 0;
        const area = checkNearestNeighbor(col.x, col.y, board);
        area.forEach(item => {
          if (item.isMine) {
            mine++;
          }
        });
        if (mine === 0) {
          col.isEmpty = true;
        }
        col.neighbor = mine;
      }
      return col;
    })
  );

/**
 * Check all neighbor positions of targeted cell and adds to an array
 * @param x axisX
 * @param y axisY
 * @param board
 */
const checkNearestNeighbor = (x: number, y: number, board: Cell[][]) => {
  let mines: Array<Cell> = [];
  /// check right neighbor cell
  if (x < PLAYGROUND_SIZE - 1) {
    mines = [...mines, { ...board[x + 1][y] }];
  }
  /// check left neighbor cell
  if (x > 0) {
    mines = [...mines, { ...board[x - 1][y] }];
  }
  /// check up neighbor cell
  if (y > 0) {
    mines = [...mines, { ...board[x][y - 1] }];
  }
  /// check down neighbor cell
  if (y < PLAYGROUND_SIZE - 1) {
    mines = [...mines, { ...board[x][y + 1] }];
  }
  /// check top right neighbor cell
  if (x < PLAYGROUND_SIZE - 1 && y > 0) {
    mines = [...mines, { ...board[x + 1][y - 1] }];
  }
  /// check top left neighbor cell
  if (x > 0 && y > 0) {
    mines = [...mines, { ...board[x - 1][y - 1] }];
  }
  /// check down right neighbor cell
  if (x < PLAYGROUND_SIZE - 1 && y < PLAYGROUND_SIZE - 1) {
    mines = [...mines, { ...board[x + 1][y + 1] }];
  }
  /// check down left neighbor cell
  if (x > 0 && y < PLAYGROUND_SIZE - 1) {
    mines = [...mines, { ...board[x - 1][y + 1] }];
  }
  return mines;
};

/**
 * Reveals whole board when game is over
 * @param board
 */
export const revealBoard = (board: Cell[][]) =>
  board.map(row => row.map(col => ({ ...col, isRevealed: true })));

/**
 * Recursively reveals empty cells
 * @param board
 * @param x axisX
 * @param y axisY
 */
export const revealEmptyCells = (board: Cell[][], x: number, y: number) => {
  let area = checkNearestNeighbor(x, y, board);
  area.forEach(value => {
    if (
      !value.isFlagged &&
      !value.isRevealed &&
      (value.isEmpty || !value.isMine)
    ) {
      board[value.x][value.y].isRevealed = true;
      if (value.isEmpty) {
        revealEmptyCells(board, value.x, value.y);
      }
    }
  });
  return board;
};

/**
 * @param board
 * @returns number of flagged cells
 */
export const countFlaggedCells = (board: Cell[][]) => {
  let count = 0;
  board.forEach(row => {
    row.forEach(col => {
      if (col.isFlagged) {
        count++;
      }
    });
  });
  return count;
};

/**
 * @param board
 * @returns number of revealed cells
 */
export const countRevealedCells = (board: Cell[][]) => {
  let count = 0;
  board.forEach(row => {
    row.forEach(col => {
      if (col.isRevealed) {
        count++;
      }
    });
  });
  return count;
};
