import React, { Component } from "react";
import styled from 'styled-components';
import moment from "moment";

import { colors, fontSizes, fontWeights, boxShadows } from "../globalStyles";
import { copyToClipboard } from "../functions";
import { updatePassword } from "../api";


class SharePlaylist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      passwordText: ''
    };
  }

  onPasswordButtonClick = async () => {
    if(
      this.state.passwordText &&
      this.state.passwordText !== 'copied!'
    ) {
      const password = this.state.passwordText;

      copyToClipboard(this.state.passwordText);

      this.setState(
        { passwordText: 'copied!' },
        () => {
          setTimeout(() => {
            this.setState({
              passwordText: password
            })
          }, 2000);
        }
      );
    }
    else if (!this.state.passwordText) {
      const password = await updatePassword(this.props.playlist._id);

      this.setState({passwordText: password});
    }
  }

  render() {
    return (
      <ModalContent
        onClick={(event)=> 
          event.stopPropagation()}
      >
        <ModalHeader>
          <ModalTitle>{this.props.playlist.title}</ModalTitle>
          <ModalLink
            onClick={() => {
              copyToClipboard(`http://localhost:3000/playlists/${this.props.playlist._id}`);
            }}
          >
            {`http://localhost:3000/playlists/${this.props.playlist._id}`}
            <ModalLinkCopy>copy</ModalLinkCopy>
          </ModalLink>
        </ModalHeader>
        <ModalDetails>
          <ModalDetail>creator: <ModalDetailSpan>{this.props.playlist.creator && this.props.playlist.creator.spotifyId || ''}</ModalDetailSpan></ModalDetail>
          <ModalDetail>date: <ModalDetailSpan>{moment(this.props.playlist.createdAt).format('LL')}</ModalDetailSpan></ModalDetail>
          <ModalDetail>collaborators: <ModalDetailSpan>{this.props.playlist.collaborators}</ModalDetailSpan></ModalDetail>
          <ModalDetail>password expiry: <ModalDetailSpan urgent={this.props.passwordHasExpired}>{moment(this.props.playlist.passwordExpiration).format('LLL')}</ModalDetailSpan></ModalDetail>
          <PasswordButton
            onClick={this.onPasswordButtonClick}
          >
            {this.state.passwordText ? this.state.passwordText : 'generate new password'}
          </PasswordButton>
        </ModalDetails>
      </ModalContent>
    );
  }
}


const ModalHeader = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${colors.gray};
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

const ModalLink = styled.button`
  background: ${colors.lightPurple};
  color: ${colors.gray};
  font-size: ${fontSizes.xsmall};
  font-weight: ${fontWeights.semiLight};
  padding: 5px 68px 5px 8px;
  border-radius: 3px;
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    color: ${colors.lightBlack};
  }
`;

const ModalLinkCopy = styled.p`
  width: 60px;
  height: 100%;
  background: ${colors.opaqueWhite3};
  padding: 5px 8px;
  position: absolute;
  top: 0;
  right: 0;

  ${ModalLink}:hover & {
    color: ${colors.gray};
  }
`;

const ModalDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const ModalDetail = styled.p`
  margin-bottom: 20px;
`;

const ModalDetailSpan = styled.span`
  color: ${props => props.urgent ? colors.purple : colors.darkBlue};
`;

const PasswordButton = styled.button`
  width: 100%;
  background: none;
  color: ${colors.opaqueBlue};
  font-size: ${fontSizes.xsmall};
  margin-top: 20px;
  padding: 5px 0px;
`;


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

export default SharePlaylist;
