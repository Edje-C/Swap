import React from 'react';
import styled from 'styled-components';
import { fontSizes, boxShadows } from '../globalStyles';

const Button = styled.button`
  width: 150px;
  font-size: ${fontSizes.small};
  padding: 8px 0px;
  border-radius: 50px;
  box-shadow: ${boxShadows.blue1};
  transition: all .3s ease;

  &:hover {
    box-shadow: ${boxShadows.blue2};
  }
`;

export default Button;
