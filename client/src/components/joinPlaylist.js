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
      songsAdded: false
    }
  }

  joinSwap = async () => {
    try {
      await saveTracks(this.state.key, this.props.userId);

      this.setState({
        songsAdded: true
      })
    }
    catch(err) {
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
        />
        <JoinButton
          onClick={this.joinSwap}
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

  render() {
    return (
      <>
        {this.state.songsAdded ?
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
  padding: 10px 15px;
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
`;

const Message = styled.p`
  color: ${colors.gray};
  margin-bottom: 10px;
`;

export default JoinPlaylist;
