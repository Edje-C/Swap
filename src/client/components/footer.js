import React from 'react';
import styled from 'styled-components';
import { colors, fontSizes } from '../globalStyles';

const Footer = () => {
  return (
    <Container>
      <Link href="https://www.elonjefferson.com">Elon Jefferson</Link>
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

const Link = styled.a`
  padding-top: 5px;
  font-size: ${fontSizes.small};

  &::after {
    content: '';
    width: 50%;
    height: 2px;
    display: flex;
    margin: 5px auto 0px;
    transition: all .3s ease;
  }

  &:hover {
    &::after {
      width: 100%;
      background: ${colors.gray};
    }
  }
`;

export default Footer;
