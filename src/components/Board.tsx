import React from "react";
import styled, { ThemeProvider } from "styled-components";
import {
  initBoard,
  revealBoard,
  revealEmptyCells,
  MAX_MINES,
  countFlaggedCells,
  countRevealedCells,
  PLAYGROUND_SIZE
} from "./mineLogic";
import Cell from "./Cell";
import { Cell as CellType } from "./mineLogic";
import GameStatus from "./GameStatus";
import Button from "./Button";
import { theme } from "./theme";

const StyledBoard = styled.div`
  display: flex;
  margin: auto;
  background-color: ${props => props.theme.gray};
  border: 5px outset ${props => props.theme.darkGray};
`;

type StateType = {
  board: Cell[][];
  gameOver: boolean;
  mineCount: number;
};

class Board extends React.Component {
  state = {
    board: initBoard(),
    gameOver: false,
    mineCount: MAX_MINES,
    gameStatus: "Hit the cell to start the game!!"
  };

  componentDidMount() {
    document.addEventListener("contextmenu", () => this.contextMenu);
  }

  componentWillUnmount() {
    document.removeEventListener("contextmenu", () => this.contextMenu);
  }

  handleClick = (cell: CellType) => {
    if (this.state.gameOver) return;
    let { isMine, isEmpty, isRevealed, x, y } = cell;
    if (isEmpty && isRevealed) return;
    /// mark cells as revealed and clicked
    let newBoard = this.state.board.map((row, rowIndex) =>
      row.map((col, colIndex) =>
        rowIndex === x && colIndex === y
          ? { ...col, isRevealed: true, isClicked: true }
          : col
      )
    );
    newBoard = isEmpty ? revealEmptyCells(newBoard, x, y) : newBoard;
    this.setState({ board: newBoard }, () => this.checkGameStatus(isMine));
  };

  contextMenu = (cell: CellType) => {
    let { x, y, isEmpty, isRevealed } = cell;
    if (isRevealed || (!isEmpty && isRevealed)) return;
    /// mark cells as flagged
    const newBoard = this.state.board.map((row, rowIndex) =>
      row.map((col, colIndex) =>
        rowIndex === x && colIndex === y
          ? { ...col, isFlagged: !col.isFlagged }
          : col
      )
    );

    let count = countFlaggedCells(newBoard);
    // add +1 is necessary to display the last flag
    if (count === MAX_MINES + 1) return;

    let flagged = 0;
    newBoard[x][y].isFlagged ? flagged-- : flagged++; // if cell is flagged, then subtract

    this.setState((state: StateType) => ({
      board: newBoard,
      mineCount: state.mineCount + flagged
    }));
  };

  checkGameStatus = (isMine: boolean) => {
    /// game over status
    if (isMine) {
      const newBoard = revealBoard(this.state.board);
      this.setState({
        board: newBoard,
        gameOver: true,
        gameStatus: "Game over"
      });
      return;
    }
    const countMaxCells = PLAYGROUND_SIZE * PLAYGROUND_SIZE;
    const countRevealed = countRevealedCells(this.state.board);
    /// win status
    if (countRevealed === countMaxCells - MAX_MINES && !isMine) {
      this.setState({ gameStatus: "You win!!!", gameOver: true });
      return;
    }
    /// game in progress
    if (countRevealed > 0 && !this.state.gameOver) {
      this.setState({ gameStatus: "Game in progress" });
    }
  };

  resetGame = () => {
    const newBoard = initBoard();
    this.setState({
      board: newBoard,
      gameOver: false,
      mineCount: MAX_MINES,
      gameStatus: "Hit the cell to start the game!!"
    });
  };

  render() {
    return (
      <div>
        <ThemeProvider theme={theme}>
          <GameStatus>
            <div>
              <strong>Mines: </strong>
              {this.state.mineCount}
            </div>
            <div>
              <strong>Game status: </strong> {this.state.gameStatus}
            </div>
            <Button onClick={this.resetGame}>PLAY AGAIN</Button>
          </GameStatus>
          <StyledBoard>
            {this.state.board.map((row, rowIndex) => (
              <div key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <Cell
                    key={cellIndex}
                    cell={cell}
                    handleOnClick={this.handleClick}
                    contextMenu={this.contextMenu}
                    gameOver={this.state.gameOver}
                  />
                ))}
              </div>
            ))}
          </StyledBoard>
        </ThemeProvider>
      </div>
    );
  }
}

export default Board;
