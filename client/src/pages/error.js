import React from 'react';
import styled from 'styled-components';
import { fontSizes, fontWeights, colors } from '../globalStyles';

function Error() {
  return (
    <Container>
      <Message>Nothing To See Here...</Message>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: calc(100% - 190px);
  display: flex;
  padding: 100px;
`;

const Message = styled.p`
  font-size: ${fontSizes.xlarge};
  font-weight: ${fontWeights.regular};
  text-shadow: 10px -15px ${colors.opaqueWhite3}, 20px 15px ${colors.opaqueBlue};
`;

export default Error;
