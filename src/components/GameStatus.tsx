import React from "react";
import styled from "styled-components";

const StyledGameStatus = styled.div`
  display: flex;
  background: #ccc;
  margin-bottom: 5px;
  padding: 10px;
  justify-content: space-between;
`;

class GameStatus extends React.Component {
  render() {
    return <StyledGameStatus>{this.props.children}</StyledGameStatus>;
  }
}
export default GameStatus;
