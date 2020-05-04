import React, { Component } from 'react';
import styled from 'styled-components';
import { fontSizes, fontWeights, colors, boxShadows } from '../globalStyles';
import { saveTracks } from '../api';
import Button from './button';

class JoinPlaylist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      key: '',
      songsAdded: false,
      error: false
    }
  }

  joinSwap = async () => {
    try {
      const playlist = await saveTracks(this.props.apiToken, this.state.key, this.props.userId);

      this.props.addPlaylistToState(playlist);

      this.setState({
        songsAdded: true
      })
    }
    catch(err) {
      this.setState({error: true})
      console.log(err)
    }
  }

  renderJoin = () => {
    return (
      <>
        <Heading>Enter Swap Key</Heading>
        <Input 
          onChange={(event) => {
            this.setState({
              key: event.target.value
            })
          }}
          onKeyDown={(event) => {
            if(
              this.state.key &&
              event.keyCode === 13
            ){
              this.joinSwap();
            }
          }}
          type='password'
        />
        <JoinButton
          onClick={this.joinSwap}
          disabled={!this.state.key}
        >
          Join
        </JoinButton>
      </>
    );
  }

  renderSuccess = () => {
    return (
      <>
        <Heading>Success</Heading>
        <Message>Your songs have been added to this Swap.</Message>
        <Message>When the creator saves the playlist you'll be able to find the link in your profile.</Message>
      </>
    );
  }

  renderError = () => {
    return (
      <>
        <Heading>Oh no!</Heading>
        <Message>Something went wrong. Please refresh and try again.</Message>
      </>
    );
  }

  render() {
    return (
      <>
        {this.state.error ?
          this.renderError() :
            this.state.songsAdded ?
              this.renderSuccess() :
              this.renderJoin()}
      </>
    );
  }
}

const Heading = styled.p`
  font-size: ${fontSizes.large};
  font-weight: ${fontWeights.regular};
  margin-bottom: 15px;
`;

const Input = styled.input`
  width: 100%;
  background: ${colors.lightGray};
  color: ${colors.lightBlack};
  font-size: ${fontSizes.regular};
  font-weight: ${fontWeights.semiLight};
  font-family: inherit;
  margin-top: 10px;
  padding: 10px 50px;
  border-radius: 10px;
  text-align: center;
  letter-spacing: 3px;

  ::placeholder {
    color: ${colors.gray};
  }
`;

const JoinButton = styled(Button)`
  background: ${colors.purple};
  color: ${colors.white};
  margin: 50px auto 0px;

  &:disabled {
    background: ${colors.opaqueBlue};
  }
`;

const Message = styled.p`
  color: ${colors.gray};
  margin-bottom: 10px;
`;

export default JoinPlaylist;
