import React, { Component } from "react";
import styled from 'styled-components';
import moment from "moment";

import { colors, fontSizes, fontWeights } from "../globalStyles";
import { copyToClipboard, ellipsisInCenter } from "../functions";
import { updatePassword, savePlaylist } from "../api";
import Button from "./button";


class PlaylistDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      passwordText: '',
      savingPlaylist: false,
      error: false
    };
  }

  onPasswordButtonClick = async () => {
    if (
      this.state.passwordText === 'copied!' ||
      this.state.error
    ) {
      return
    }
    else if (!this.state.passwordText) {
      try {
        const password = await updatePassword(this.props.playlist._id);
  
        this.setState({passwordText: `${this.props.playlist._id}:${password}`});
      }
      catch(err) {
        this.setState({passwordText: 'Something went wrong...'})
      }
    }
    else {
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
  }

  savePlaylist = async () => {
    try {
      this.setState({
        savingPlaylist: true
      });

      const playlist = await savePlaylist(this.props.spotifyId, this.props.playlist._id);

      this.props.updatePlaylistLink(playlist.link);

      this.setState({
        savingPlaylist: false
      });
    }
    catch(err) {
      this.setState({
        error: true
      })
      console.log(err)
    }
  }
  
  renderCollaborators = (collaborators) => {
    return collaborators.map(collaborator => {
      return collaborator._id !== this.props.playlist.creator._id ? (
        <Collaborator>{collaborator.displayName}</Collaborator>
      ) : null
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
              <DetailLink href={this.props.playlist.link} target="_blank">{ellipsisInCenter(this.props.playlist.link, 20)}</DetailLink>
            </TextGroup> : null}
          {this.props.playlist.link ? null : <TextGroup>
            <DetailLabel>password expiry : </DetailLabel>
            <DetailSpan urgent={this.props.passwordHasExpired}>{moment(this.props.playlist.passwordExpiration).format('LLL')}</DetailSpan>
          </TextGroup>}
          {this.props.userId === this.props.playlist.creator._id &&
            !this.props.playlist.link ?
              <TextGroup>
              <DetailLabel>password : </DetailLabel>
              <PasswordButton
                onClick={this.onPasswordButtonClick}
              >
                {this.state.passwordText ? ellipsisInCenter(this.state.passwordText, 12) : 'generate new password'}
              </PasswordButton>
            </TextGroup> : null}
          <TextGroup>
            <DetailLabel>collaborators : </DetailLabel>
            {this.props.playlist.collaborators.length > 1 ? 
              <CollaboratorsContainer>
                {this.renderCollaborators(this.props.playlist.collaborators)}
              </CollaboratorsContainer> :
              <DetailSpan>0</DetailSpan>}
          </TextGroup>
          {
            this.props.playlist.link || 
            this.props.userId !== this.props.playlist.creator._id ? 
              null : this.state.error ?
                <ErrorMessage>Something went wrong. Please refresh and try again.</ErrorMessage> :
                <SaveButton onClick={this.savePlaylist} disabled={this.state.savingPlaylist}>Save Playlist</SaveButton>
          }
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
  flex: 1;
  text-align: left;

  &:hover {
    color: ${colors.blue};
  }
`;

const PasswordButton = styled.button`
  background: none;
  color: ${colors.gray};
  font-size: ${fontSizes.xsmall};
  flex: 1;
  text-align: left;
}
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

const ErrorMessage = styled.p`
  color: ${colors.opaqueBlue};
  margin-top: 20px;
  padding: 7px 0px;
`;

export default PlaylistDetails;
