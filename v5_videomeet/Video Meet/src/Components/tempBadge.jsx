import React, { useState } from 'react';
import { styled } from '@mui/system';
import { Badge as BaseBadge, badgeClasses } from '@mui/base/Badge';

export default function ShowZeroBadge({ icon, top, right, background }) {


    return (
        <Badge badgeContent={5} top={top} right={right} background={background} showZero>
            {icon}
        </Badge>
    );
}


const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
};

const Badge = styled(BaseBadge)(
    ({ theme, top, right, background }) => `
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-size: 14px;
  list-style: none;
  font-family: 'IBM Plex Sans', sans-serif;
  position: relative;
  display: inline-block;
  line-height: 1;

  & .${badgeClasses.badge} {
    z-index: auto;
    position: absolute;
    top:${top};
    right: ${right};
    min-width: 22px;
    height: 22px;
    padding: 0 6px;
    color: #fff;
    font-weight: 600;
    font-size: 12px;
    line-height: 22px;
    white-space: nowrap;
    text-align: center;
    border-radius: 12px;
    background: ${background};
    box-shadow: 0px 4px 6x ${theme.palette.mode === 'dark' ? grey[900] : grey[300]};
    transform: translate(50%, -50%);
    transform-origin: 100% 0;
  }

  & .${badgeClasses.invisible} {
    display: none;
  }
  `,
);
