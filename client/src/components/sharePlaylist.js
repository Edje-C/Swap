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

  render() {
    return (
      <Content
        onClick={(event)=> 
          event.stopPropagation()}
      >
        <Header>
          <Title>{this.props.playlist.title}</Title>
          <Link
            onClick={() => {
              copyToClipboard(`http://localhost:3000/playlists/${this.props.playlist._id}`);
            }}
          >
            {`http://localhost:3000/playlists/${this.props.playlist._id}`}
            <LinkCopy>copy</LinkCopy>
          </Link>
        </Header>
        <Details>
          <Detail>creator: <DetailSpan>{this.props.playlist.creator && this.props.playlist.creator.spotifyId || ''}</DetailSpan></Detail>
          <Detail>date: <DetailSpan>{moment(this.props.playlist.createdAt).format('LL')}</DetailSpan></Detail>
          <Detail>collaborators: <DetailSpan>{this.props.playlist.collaborators}</DetailSpan></Detail>
          <Detail>password expiry: <DetailSpan urgent={this.props.passwordHasExpired}>{moment(this.props.playlist.passwordExpiration).format('LLL')}</DetailSpan></Detail>
          <PasswordButton
            onClick={this.onPasswordButtonClick}
          >
            {this.state.passwordText ? this.state.passwordText : 'generate new password'}
          </PasswordButton>
        </Details>
      </Content>
    );
  }
}


const Header = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${colors.opaqueBlue};
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

const Link = styled.button`
  background: ${colors.lightGray};
  color: ${colors.opaqueBlack};
  font-size: ${fontSizes.xsmall};
  font-weight: ${fontWeights.semiLight};
  padding: 5px 68px 5px 8px;
  border-radius: 3px;
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover {
    color: ${colors.gray};
  }
`;

const LinkCopy = styled.p`
  width: 60px;
  height: 100%;
  background: ${colors.lightBlue};
  color: ${colors.white};
  font-weight: ${fontWeights.semiLight};
  padding: 5px 8px;
  position: absolute;
  top: 0;
  right: 0;

  ${Link}:hover & {
    color: ${colors.white};
  }
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
`;

const Detail = styled.p`
  margin-bottom: 20px;
`;

const DetailSpan = styled.span`
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

export default SharePlaylist;
