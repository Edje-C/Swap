import React from 'react';
import styled from 'styled-components';
import { fontSizes, fontWeights, colors } from '../globalStyles';

function Error() {
  return (
    <Container>
      <Heading>404</Heading>
      <Message>Something went wrong. Please reload and try again.</Message>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: calc(100% - 190px);
  display: flex;
  flex-direction: column;
  padding: 100px;
`;

const Heading = styled.p`
  font-size: ${fontSizes.xxlarge};
  font-weight: ${fontWeights.regular};
  text-shadow: 10px -15px ${colors.opaqueWhite3}, 20px 15px ${colors.opaqueBlue};
`;

const Message = styled.p`
  font-size: ${fontSizes.medium};
`;

export default Error;
