import React from "react";
import styled from "styled-components";

const StyledButton = styled.div`
  background: #ccc;
  border: 2px outset #b8b8b8;
  padding: 3px;
  cursor: pointer;
`;

type Props = {
  onClick: () => void;
};

class Button extends React.Component<Props> {
  render() {
    return (
      <StyledButton onClick={this.props.onClick}>
        {this.props.children}
      </StyledButton>
    );
  }
}
export default Button;
