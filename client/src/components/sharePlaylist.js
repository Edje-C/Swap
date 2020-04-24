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
          }, 1000);
        }
      );
    }
    else if (!this.state.passwordText) {
      const password = await updatePassword(this.props.playlist._id);

      this.setState({passwordText: password});
    }
  }
  
  renderCollaborators = (collaborators) => {
    return collaborators.map(collaborator => {
      return (
        <Collaborator>{collaborator.displayName}</Collaborator>
      )
    })
  }

  render() {
    return (
      <Content
        onClick={(event)=> 
          event.stopPropagation()}
      >
        <Details>
          <Title>{this.props.playlist.title}</Title>
          <TextGroup>
            <DetailLabel>creator</DetailLabel>
            <DetailSpan>{this.props.playlist.creator.displayName}</DetailSpan>
          </TextGroup>
          <TextGroup>
            <DetailLabel>date</DetailLabel>
            <DetailSpan>{moment(this.props.playlist.createdAt).format('LL')}</DetailSpan>
          </TextGroup>
          <TextGroup>
            <DetailLabel>password expiry</DetailLabel>
            <DetailSpan urgent={this.props.passwordHasExpired}>{moment(this.props.playlist.passwordExpiration).format('LLL')}</DetailSpan>
          </TextGroup>
          <TextGroup>
            <DetailLabel>password</DetailLabel>
            <PasswordButton
              onClick={this.onPasswordButtonClick}
            >
              {this.state.passwordText ? this.state.passwordText : 'generate new password'}
            </PasswordButton>
          </TextGroup>
          <TextGroup>
            <DetailLabel>collaborators</DetailLabel>
            <CollaboratorsContainer>
              {this.props.playlist.collaborators.length ?
                this.renderCollaborators(this.props.playlist.collaborators) :
                <DetailSpan>0</DetailSpan>
              }
            </CollaboratorsContainer>
          </TextGroup>
        </Details>
      </Content>
    );
  }
}

const Content = styled.div`
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

const Title = styled.p`
  color: ${colors.darkGray};
  font-size: ${fontSizes.large};
  font-weight: ${fontWeights.regular};
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
`;

const TextGroup = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const DetailLabel = styled.p`
`;

const DetailSpan = styled.span`
  color: ${props => props.urgent ? colors.purple : colors.darkBlue};
  padding: 0px 5px;
`;

const PasswordButton = styled.button`
  width: fit-content;
  background: none;
  color: ${colors.opaqueBlue};
  font-size: ${fontSizes.xsmall};
  padding: 0px 5px;
`;

const CollaboratorsContainer = styled.div`
  width: 200px;
  height: 100px;
  background: ${colors.lightGray};
  margin: 5px 10px;
  padding: 20px 20px 10px;
  border-radius: 10px;
  overflow: scroll;
`;

const Collaborator = styled.p`
  color: ${colors.opaqueBlack};
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`


export default SharePlaylist;
