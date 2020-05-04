import React from 'react';
import styled from 'styled-components';
import { colors, fontSizes, boxShadows } from '../globalStyles';

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
        {props.children}
      </Content>
    </ModalBackground>
  );
}

const ModalBackground = styled.div`
  width: 100%;
  height: 100%;
  background: ${colors.opaqueBlack};
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
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
`;


export default Modal;
