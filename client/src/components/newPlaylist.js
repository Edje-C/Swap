import React, { Component } from "react";
import styled from 'styled-components';
import { colors, fontSizes, fontWeights, boxShadows } from "../globalStyles";


class NewPlaylist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      userId: '',
      userSpotifyId: ''
    };
  }

  render() {
    return (
      <ModalContent
        onClick={(event)=> 
          event.stopPropagation()}
      >
        <ModalTitle>New Swap</ModalTitle>
        <ModalTextGroup>
          <ModalLabel>Playlist Title :</ModalLabel>
          <ModalInput placeholder='Elogalongan 7/4'/>
        </ModalTextGroup>
        <ModalTextGroup>
          <ModalLabel>Songs Per Collaborator :</ModalLabel>
          <ModalInput type="number" min="1" max="50" placeholder="1 - 50"/>
        </ModalTextGroup>
        <DoneButton>Done</DoneButton>
      </ModalContent>
    );
  }
}


const ModalContent = styled.div`
  width: 500px;
  height: 500px;
  background: ${colors.white};
  color: ${colors.gray};
  font-size: ${fontSizes.xsmall};
  display: flex;
  flex-direction: column;
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

const ModalTitle = styled.p`
  color: ${colors.darkGray};
  font-size: ${fontSizes.large};
  font-weight: ${fontWeights.regular};
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ModalTextGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin: 15px 0px;
`;

const ModalLabel = styled.p`
  color: ${colors.gray};
`;

const ModalInput = styled.input`
  width: 100%;
  background: none;
  color: ${colors.lightBlack};
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.semiLight};
  font-family: inherit;
  padding: 10px 15px;
  border-radius: 10px;

  &:focus {
    background: ${colors.lightGray};
  }

  ::placeholder {
    color: ${colors.gray};
  }
`;

const DoneButton = styled.button`
  width: 150px;
  background: ${colors.lightBlue};
  color: ${colors.white};
  font-size: ${fontSizes.small};
  margin: 50px 0px 0px auto;
  padding: 8px 0px;
  border: 2px solid transparent;
  border-radius: 50px;
  box-shadow: ${boxShadows.blue1};
  transition: all .3s ease;

  &:hover {
    box-shadow: ${boxShadows.blue2};
  }
`;

export default NewPlaylist;
