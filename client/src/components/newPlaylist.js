import React, { Component } from "react";
import styled from 'styled-components';
import { colors, fontSizes, fontWeights, boxShadows } from "../globalStyles";
import { copyToClipboard } from "../functions";


class NewPlaylist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      songCount: 0,
      errorMessage: '',
      passwordText: ''
    };
  }

  titleOnChange = (event) => {
    this.setState({
      title: event.target.value
    })    
  }

  songCountOnChange = (event) => {
    this.setState({
      songCount: event.target.value
    })
  }

  onSubmit = () => {
    const { title, songCount } = this.state;

    if(!title) {
      this.setState({
        errorMessage: 'Your playlist needs a title!'
      })
    }
    else if(
      isNaN(songCount) ||
      songCount < 1 ||
      songCount > 50
    ) {
      this.setState({
        errorMessage: 'Song count should be between 1-50.'
      })
    }
    else {
      this.setState({
        passwordText: 'uEyMTw32v9F8dd7H'
      })
    }
  }

  renderCreate = () => {
    return (
      <>
        <Title>New Swap</Title>
        <TextGroup>
          <Label>Playlist Title :</Label>
          <Input 
            onChange={this.titleOnChange}
            onKeyDown={(event) => {
              if(event.keyCode === 13){
                this.onSubmit();
              }
            }}
            placeholder='Elogalongan 7/4'
          />
        </TextGroup>
        <TextGroup>
          <Label>Songs Per Collaborator :</Label>
          <Input 
            onChange={this.songCountOnChange}
            onKeyDown={(event) => {
              if(event.keyCode === 13){
                this.onSubmit();
              }
            }}
            placeholder="1 - 50"
          />
        </TextGroup>
        <SubmitContainer>
          <ErrorMessage>{this.state.errorMessage}</ErrorMessage>
          <SubmitButton onClick={this.onSubmit}>Done</SubmitButton>
        </SubmitContainer>
      </>
    )
  }

  renderPassword = () => {
    return (
      <>
        <Title>Success!</Title>
        <Message>Here's your playlist password, collaborators will need it to join this swap.</Message>
        <Message>It will expire in 24 hours!</Message>
        <PasswordButton
          onClick={() => {
            const password = this.state.passwordText;

            copyToClipboard(password);

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
          }}
        >
          {this.state.passwordText}
        </PasswordButton>
      </>
    )
  }

  render() {
    return (
      <Content
        onClick={(event)=> 
          event.stopPropagation()}
        center={this.state.passwordText}
      >
        {this.state.passwordText ?
          this.renderPassword():
          this.renderCreate()}
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
  justify-content: ${props => props.center ? 'center' : 'start'};
  text-align: ${props => props.center ? 'center' : 'left'};
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
  margin-bottom: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin: 15px 0px;
`;

const Label = styled.p`
  color: ${colors.gray};
`;

const Input = styled.input`
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

const SubmitContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 50px;
`;

const ErrorMessage = styled.p`
  max-width: 200px;
  color: ${colors.gray};
  font-size: ${fontSizes.xsmall};
`;

const SubmitButton = styled.button`
  width: 150px;
  background: ${colors.lightBlue};
  color: ${colors.white};
  font-size: ${fontSizes.small};
  padding: 8px 0px;
  border: 2px solid transparent;
  border-radius: 50px;
  box-shadow: ${boxShadows.blue1};
  transition: all .3s ease;

  &:hover {
    box-shadow: ${boxShadows.blue2};
  }
`;

const Message = styled.p`
  max-width: 350px;
  margin: 0px auto 10px;
`;

const PasswordButton = styled.button`
  width: 100%;
  background: none;
  color: ${colors.opaqueBlue};
  font-size: ${fontSizes.small};
  margin-top: 30px;
  padding: 5px 0px;
`;

export default NewPlaylist;