import React, { Component } from "react";
import styled from 'styled-components';
import passwordGenerator from 'generate-password';
import { colors, fontSizes, fontWeights, boxShadows } from "../globalStyles";
import { copyToClipboard, ellipsisInCenter } from "../functions";
import { createPlaylist } from "../api";
import Button from "./button";


class NewPlaylist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: '',
      songCount: 0,
      errorMessage: '',
      keyText: '',
      error: false
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

  onSubmit = async () => {
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
      const password = passwordGenerator.generate({
        numbers: true,
        strict: true,
        length: 16
      });

      try {
        const playlist = await createPlaylist(this.props.apiToken, this.props.userId, this.state.title, this.state.songCount, password);
  
        this.props.addPlaylistToState(playlist);
  
        this.setState({
          keyText: `${playlist._id}:${password}`
        })
      }
      catch(err) {
        this.setState({error: true});
        console.log(err)
      }
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
        <Message>Here's your playlist key.</Message>
        <Message>Collaborators will need it to join this Swap.</Message>
        <ExpireMessage>It will expire in 24 hours!</ExpireMessage>
        <PasswordButton
          onClick={() => {
            const password = this.state.keyText;

            copyToClipboard(password);

            this.setState(
              { keyText: 'copied!' },
              () => {
                setTimeout(() => {
                  this.setState({
                    keyText: password
                  })
                }, 1000);
              }
            );
          }}
        >
          {ellipsisInCenter(this.state.keyText, 15)}
        </PasswordButton>
      </>
    )
  }

  renderError = () => {
    return (
      <>
        <Title>Oh no!</Title>
        <Message>Something went wrong. Please refresh and try again.</Message>
      </>
    )
  }

  render() {
    return (
      <>
        {this.state.error ?
          this.renderError() :
            this.state.keyText ?
              this.renderPassword():
              this.renderCreate()}
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

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  margin: 15px 0px;
`;

const Label = styled.p`
  color: ${colors.gray};
  text-align: left;
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

const SubmitButton = styled(Button)`
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
  color: ${colors.gray};
`;

const ExpireMessage = styled(Message)`
  color: ${colors.purple};
  margin-top: 15px;
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
