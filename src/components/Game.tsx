import React from "react";
import styled from "styled-components";
import Board from "./Board";

const StyledGame = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 800px;
  width: 514px;
  margin: auto;
`;

class Game extends React.Component {
  render() {
    return (
      <StyledGame>
        <h2>MINESWEEPER</h2>
        <Board />
      </StyledGame>
    );
  }
}

export default Game;
