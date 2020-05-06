import React from 'react';
import styled from 'styled-components';
import { colors, fontSizes, boxShadows, breakpoints } from '../globalStyles';

function Modal(props) {
  return (
    <ModalBackground
      onClick={props.onClick}
    >
      <Content
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <CloseButton
          onClick={props.onClick}
        >
          <CloseIcon className="material-icons">close</CloseIcon>
        </CloseButton>
        {props.children}
      </Content>
    </ModalBackground>
  );
}

const ModalBackground = styled.div`
  width: 100%;
  background: ${colors.opaqueBlack};
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  overflow: scroll;
  z-index: 10;
`;


const Content = styled.div`
  width: 500px;
  height: 500px;
  background: ${colors.white};
  color: ${colors.darkGray};
  font-size: ${fontSizes.xsmall};
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  padding: 50px;
  position: relative;
  border-radius: 10px;
  box-shadow: ${boxShadows.blue2};

  animation: .1s ease slidein;

  @keyframes slidein {
    0% {
      margin-top: 100px;
    },
    100% {
      margin-top: 0px;
    }
  }

  @media (max-width: ${breakpoints.small}) {
    width: 100%;
    height: 100%;
    border-radius: 0px;
  }
`;

const CloseButton = styled.button`
  width: 30px;
  height: 30px;
  background: ${colors.opaqueBlack};
  color: ${colors.white};
  display: none;
  justify-content: center;
  border-radius: 100px;
  position: absolute;
  top: 20px;
  left: 20px;

  @media (max-width: ${breakpoints.small}) {
    display: flex;
  }
`;

const CloseIcon = styled.span`
  font-size: ${fontSizes.small};
`;

export default Modal;
