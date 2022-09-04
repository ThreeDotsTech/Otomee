import React from 'react';
import { useSingleCallResult } from 'state/multicall/hooks';
import styled from 'styled-components';
import { ReactComponent as Close } from '../../assets/images/x.svg'

const CloseIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 14px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const CloseColor = styled(Close)`
  path {
    stroke: ${({ theme }) => theme.text4};
  }
`

export const Status = ({}:{}) => {
  return <div  className='flex flex-col w-full py-2 px-3'>
  <div className="relative flex justify-between w-full">

  </div></div>;
};
