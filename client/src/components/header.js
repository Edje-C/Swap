import React from 'react';
import styled from 'styled-components';
import { Link as ReactLink } from 'react-router-dom'
import { colors, fontSizes, images } from '../globalStyles';

const Header = () => {
  return (
    <Container>
      <LogoLink to='/'><Logo src={images.logo}/></LogoLink>
      <Links>
        <Link>how it works</Link>
      </Links>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  position: fixed;
  z-index: 5;
`;

const LogoLink = styled(ReactLink)`
  display: flex;
`;

const Logo = styled.img`
  width: 75px;
  height: 75px;
`;

const Links = styled.div`
  display: flex;
`;

const Link = styled.p`
  font-size: ${fontSizes.small};
  cursor: pointer;

  &::after {
    content: '';
    width: 50px;
    height: 2px;
    background: ${colors.white};
    display: flex;
    margin: 5px auto 0px;
    transition: all .3s ease;
  }

  &:hover {
    &::after {
      content: '';
      width: 100%;
      height: 2px;
      background: ${colors.white};
      display: flex;
      margin: 5px auto 0px;
    }
  }
`;

export default Header;