import React from "react";
import styled, { ThemeProvider } from "styled-components";
import { Cell as CellType } from "./mineLogic";
import { theme } from "./theme";

interface StyleProps {
  isRevealed: boolean;
  neighbor: number;
  isMine: boolean;
  isFlagged: boolean;
  isClicked: boolean;
}

const StyledCell = styled.div<StyleProps>`
  background-color: ${props =>
    props.isMine && props.isClicked ? props.theme.red : props.theme.gray};
  width: 50px;
  height: 50px;
  text-align: center;
  border: 2px outset ${props => props.theme.darkGray};
  font-width: bold;
  line-height: 50px;
  margin: 1px;
  text-indent: ${props =>
    props.isRevealed || props.isFlagged ? "0px" : "-9999px"};
  color: ${props => {
    if (props.neighbor === 1) {
      return props.theme.blue;
    } else if (props.neighbor === 2) {
      return props.theme.green;
    } else if (props.neighbor === 3) {
      return props.theme.red;
    } else return props.theme.black;
  }};
  border: ${props =>
    props.isRevealed
      ? `2px solid ${props.theme.lightGray}`
      : `2px outset${props.theme.darkGray}`};
`;

type Props = {
  cell: CellType;
  gameOver: boolean;
  handleOnClick: (cell: CellType) => void;
  contextMenu: (cell: CellType) => void;
};

class Cell extends React.Component<Props> {
  renderCell = () => {
    let { isMine, neighbor, isRevealed, isFlagged } = this.props.cell;
    if (isFlagged && !isRevealed) {
      return "🚩";
    }
    if (isRevealed) {
      if (isMine) {
        return "💣";
      }
      if (neighbor === 0) {
        return null;
      }
      return neighbor;
    }
  };

  onClick = () => {
    if (this.props.gameOver) return;
    this.props.handleOnClick(this.props.cell);
  };

  contextMenu = (e: any) => {
    e.preventDefault();
    if (this.props.gameOver) return;
    this.props.contextMenu(this.props.cell);
  };

  render() {
    return (
      <ThemeProvider theme={theme}>
        <StyledCell
          isRevealed={this.props.cell.isRevealed}
          neighbor={this.props.cell.neighbor}
          isMine={this.props.cell.isMine}
          isFlagged={this.props.cell.isFlagged}
          isClicked={this.props.cell.isClicked}
          onClick={this.onClick}
          onContextMenu={this.contextMenu}
        >
          {this.renderCell()}
        </StyledCell>
      </ThemeProvider>
    );
  }
}

export default Cell;
