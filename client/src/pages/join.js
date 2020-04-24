import React, { Component } from 'react';
import { useParams } from 'react-router-dom'
import styled from 'styled-components';
import { fontSizes, fontWeights, colors, boxShadows } from '../globalStyles';
import { saveTracks, verifyPassword } from '../api';

class Join extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playlistId: '',
      password: ''
    }
  }

  componentDidMount = () => {
    const path = window.location.pathname;
    const splitPath = path && path.split('/');
    const playlistId = splitPath && splitPath[2];
    playlistId &&
      this.setState({
        playlistId
      })
  }

  joinSwap = async () => {
    try {
      const verifyPasswordResponse = await verifyPassword(this.state.playlistId, this.state.password);
      const passwordIsCorrect = verifyPasswordResponse.data;

      if(passwordIsCorrect) {
        const playlist = await saveTracks(this.state.playlistId, this.props.userId);
      }
      else {
        console.log('Error: Password is incorrect.')
      }
    }
    catch(err) {
      console.log(err)
    }
  }

  renderLogin = () => {
    return (
      <>
        <Heading>Swap id:</Heading>
        <SwapId>{this.state.playlistId}</SwapId>
        <LoginButton>
          Login
        </LoginButton>
      </>
    );
  }

  renderPassword = () => {
    return (
      <>
        <Heading>Enter Password</Heading>
        <Input 
          onChange={(event) => {
            this.setState({
              password: event.target.value
            })
          }}
          type="password"
        />
        <JoinButton
          onClick={this.joinSwap}
        >
          Join
        </JoinButton>
      </>
    );
  }

  render() {
    return (
      <Container>
        <ModalBackground>
          <Content>
            {
              this.props.userId &&
              this.props.userSpotifyId &&
              this.props.displayName ?
                this.renderPassword() :
                this.renderLogin()
            }
          </Content>
        </ModalBackground>
      </Container>
    );
  }
}


const Container = styled.div`
  width: 100%;
  height: calc(100% - 190px);
  display: flex;
  padding: 100px;
`;


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

const Heading = styled.p`
  font-size: ${fontSizes.large};
  font-weight: ${fontWeights.regular};
  margin-bottom: 15px;
`;

const SwapId = styled.p`
  background: ${colors.lightGray};
  color: ${colors.gray};
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 10px;
`;

const LoginButton = styled.button`
  width: 150px;
  background: ${colors.purple};
  color: ${colors.white};
  font-size: ${fontSizes.regular};
  margin: 50px auto 0px;
  padding: 8px 0px;
  border-radius: 50px;
  box-shadow: ${boxShadows.blue1};
  transition: all .3s ease;

  &:hover {
    box-shadow: ${boxShadows.blue2};
  }
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

const JoinButton = styled.button`
  width: 150px;
  background: ${colors.lightBlue};
  color: ${colors.white};
  font-size: ${fontSizes.regular};
  margin: 50px auto 0px;
  padding: 8px 0px;
  border-radius: 50px;
  box-shadow: ${boxShadows.blue1};
  transition: all .3s ease;

  &:hover {
    box-shadow: ${boxShadows.blue2};
  }
`;


export default Join;
