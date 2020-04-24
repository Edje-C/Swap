import React, { Component } from "react";
import styled from 'styled-components';
import moment from "moment";

import { colors, fontSizes, fontWeights, boxShadows } from "../globalStyles";
import { copyToClipboard } from "../functions";
import { updatePassword } from "../api";
import Button from "./button";


class PlaylistDetails extends Component {
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
      <>
        <Details>
          <Title>{this.props.playlist.title}</Title>
          <TextGroup>
            <DetailLabel>creator : </DetailLabel>
            <DetailSpan>{this.props.playlist.creator.displayName}</DetailSpan>
          </TextGroup>
          <TextGroup>
            <DetailLabel>date : </DetailLabel>
            <DetailSpan>{moment(this.props.playlist.createdAt).format('LL')}</DetailSpan>
          </TextGroup>
          {this.props.playlist.link ? 
            <TextGroup>
              <DetailLabel>link : </DetailLabel>
              <DetailLink>{this.props.playlist.link}</DetailLink>
            </TextGroup> : null}
          <TextGroup>
            <DetailLabel>password expiry : </DetailLabel>
            <DetailSpan urgent={this.props.passwordHasExpired}>{moment(this.props.playlist.passwordExpiration).format('LLL')}</DetailSpan>
          </TextGroup>
          <TextGroup>
            <DetailLabel>password : </DetailLabel>
            <PasswordButton
              onClick={this.onPasswordButtonClick}
            >
              {this.state.passwordText ? this.state.passwordText : 'generate new password'}
            </PasswordButton>
          </TextGroup>
          <TextGroup>
            <DetailLabel>collaborators : </DetailLabel>
            <CollaboratorsContainer>
              {this.props.playlist.collaborators.length ?
                this.renderCollaborators(this.props.playlist.collaborators) :
                <DetailSpan>0</DetailSpan>
              }
            </CollaboratorsContainer>
          </TextGroup>
          {this.props.playlist.link ? null : <SaveButton>Save Playlist</SaveButton>}
        </Details>
      </>
    );
  }
}

const Title = styled.p`
  color: ${colors.darkGray};
  font-size: ${fontSizes.large};
  font-weight: ${fontWeights.regular};
  margin-bottom: 15px;
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
  margin-bottom: 15px;
`;

const DetailLabel = styled.p`
  color: ${colors.gray};
  margin-right: 5px;
`;

const DetailSpan = styled.span`
  color: ${props => props.urgent ? colors.purple : colors.darkBlue};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  text-align: left;
`;

const DetailLink = styled.a`
  color: ${colors.opaqueBlue};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  text-align: left;

  &:hover {
    color: ${colors.blue};
  }
`;

const PasswordButton = styled.button`
  width: 19ch;
  background: none;
  color: ${colors.gray};
  font-size: ${fontSizes.xsmall};
`;

const CollaboratorsContainer = styled.div`
  width: 200px;
  height: 100px;
  background: ${colors.lightGray};
  margin: 5px 10px;
  padding: 20px 20px 10px;
  border-radius: 10px;
  overflow: scroll;
  text-align: left;
`;

const Collaborator = styled.p`
  color: ${colors.opaqueBlack};
  margin-bottom: 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

const SaveButton = styled(Button)`
  background: ${colors.opaqueBlue};
  color: ${colors.white};
  margin: 20px 0px 0px auto;
`;

export default PlaylistDetails;
