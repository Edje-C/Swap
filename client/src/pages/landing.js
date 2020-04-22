import React, { Component } from 'react';
import styled from 'styled-components';
import { colors, fontSizes, fontWeights } from "../globalStyles";

class Landing extends Component {
  render() {
    return (
      <Container>
        <Aurora/>
        <Content>
          <Heading>Swap</Heading>
          <SubHeading>A Playlist Generator</SubHeading>
          <Message>Generate a playlist for you and your friends with songs from each of your Spotify accounts so that everyone can enjoy the music.</Message>
          <EnterButton href="/api/spotify/auth">Enter</EnterButton>
        </Content>
      </Container>
    );
  }
}

const Container = styled.div`
  width: 100%;
  height: calc(100% - 75px);
  display: flex;
  margin-top: -115px;

  background: linear-gradient(to bottom left, ${colors.purple}, ${colors.lightPurple});
  
`;

const Aurora = styled.div`
  width: 100%;
  height: calc(100% - 75px);
  position: fixed;

  animation: 8s linear infinite aurora;

  @keyframes aurora {
    0% {
      background: linear-gradient(to bottom, ${colors.lightBlue}, ${colors.purple}); opacity: 0;
    }
    25% {
      background: linear-gradient(to bottom, ${colors.lightBlue}, ${colors.purple}); opacity: 1;
    }
    50% {
      background: linear-gradient(to bottom, ${colors.lightBlue}, ${colors.purple}); opacity: 0;
    }
    51% {
      background: linear-gradient(to bottom right, ${colors.cyan}, ${colors.blue}); opacity: 0;
    }
    75% {
      background: linear-gradient(to bottom right, ${colors.cyan}, ${colors.blue}); opacity: 1;
    }
    100% {
      background: linear-gradient(to bottom right, ${colors.cyan}, ${colors.blue}); opacity: 0;
    }
  }
`;

const Content = styled.div`
  width: 650px;
  height: calc(100% - 190px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 115px 100px;
  position: relative;
`;

const Heading = styled.p`
  color: ${colors.purple};
  font-family: 'Montserrat Alternates', sans-serif;
  font-size: ${fontSizes.xxlarge}; 
  font-weight: ${fontWeights.bold};
`;

const SubHeading = styled.p`
  font-size: ${fontSizes.large};
  font-weight: ${fontWeights.medium};
  color: ${colors.opaqueWhite1};
  margin-bottom: 20px
`;

const Message = styled.p`
  font-weight: ${fontWeights.light};
  color: ${colors.opaqueWhite2};
  margin-bottom: 50px
`;

const EnterButton = styled.a`
  width: 200px;
  background: none;
  font-size: ${fontSizes.medium};
  padding: 8px 0px;
  border: 2px solid ${colors.purple};
  border-radius: 50px;
  text-align: center;
  transition: all .2s ease;

  &:hover {
    color: ${colors.purple};
    background: ${colors.white};
    border: 2px solid ${colors.white};
  }
`;

export default Landing;
