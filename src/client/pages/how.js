import React from 'react';
import styled from 'styled-components';
import { fontSizes, fontWeights, colors, breakpoints } from '../globalStyles';

function How() {
  return (
    <Container>
      <Heading>How Does It Work?</Heading>
      <Section>
        <Message>Swap pulls music from your spotify account to create a playlist.</Message>
      </Section>
      <Section>
        <Message>When you create a Swap, you assign a title and a <OpaqueItalic>songCount</OpaqueItalic>. The <OpaqueItalic>songCount</OpaqueItalic> will let Swap know how many songs to pull from each collaborator for the playlist.</Message>
        <IndentedMessage><Opaque>40% </Opaque> of the songs will be from your saved songs.</IndentedMessage>
        <IndentedMessage><Opaque>40% </Opaque> of the songs will be from your top songs.</IndentedMessage>
        <IndentedMessage><Opaque>20% </Opaque> of the songs will be recommendations.</IndentedMessage>
        <Message>After you create a Swap, you are given a key which will give collaborators access to your Swap. This key will expire in 24 hours and you will not be able to retrieve it again but you can generated a new one from the Swap details.</Message>
      </Section>
      <Section>
        <Message>When you save a Swap, a playlist is created in your Spotify account and you can find all the collected songs there. After you save a Swap, collaborators will no longer be able to collaborate on that playlist.</Message>
      </Section>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  min-height: calc(100% - 190px);
  display: flex;
  flex-direction: column;
  padding: 50px 100px;

  @media (max-width: ${breakpoints.xlarge}) {
    text-align: center;
  }

  @media (max-width: ${breakpoints.large}) {
    padding: 50px;
  }
`;

const Heading = styled.p`
  width: fit-content;
  font-size: ${fontSizes.xlarge};
  font-weight: ${fontWeights.regular};
  margin-bottom: 50px;

  &::after { 
    content: '';
    width: 100%;
    height: 5px;
    background: ${colors.white};
    display: block;
  }

  @media (max-width: ${breakpoints.xlarge}) {
    margin: 0px auto 50px;
  }
`;

const Section = styled.div`
  width: calc(100% - 30px);
  max-width: 1000px;
  margin: 0px 0px 20px 30px;
  display: flex;
  flex-direction: column;

  @media (max-width: ${breakpoints.xlarge}) {
    margin: 0px auto 20px;
  }
`;

const Message = styled.p`
  width: 100%;
  color: ${colors.white};
  margin-bottom: 15px;
`;

const IndentedMessage = styled(Message)`
  width: calc(100% - 50px);
  margin-left: 50px;


  @media (max-width: ${breakpoints.xlarge}) {
    width: inherit;
    margin: inherit;
  }
`;

const Opaque = styled.span`
  color: ${colors.opaqueWhite2};
`;

const OpaqueItalic = styled(Opaque)`
  font-style: italic;
`;

export default How;
