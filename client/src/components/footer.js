import React from 'react';
import styled from 'styled-components';
import { colors } from '../globalStyles';

const Footer = () => {
  return (
    <Container>
      Elon Jefferson
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 75px;
  background: ${colors.white};
  color: ${colors.gray};
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0px 20px;
  position: relative;
  z-index: 5;
`;

export default Footer;
