import Link from 'next/link';
import styled from 'styled-components';
import { flexbox } from 'styles/mixin';

type TProps = {
  type?: string;
  fontSize?: string;
  lineheight?: string;
};

const LinkBtn = styled(Link)<TProps>`
  display: block;
  padding: 0 16px;
  border: ${({ type, theme }) => (type === 'secondary' ? `1px solid ${theme.color_purple_50}` : 'none')};
  border-radius: 6px;
  font-size: ${({ fontSize }) => fontSize || '1.6rem'};
  line-height: ${({ lineheight }) => lineheight || '50px'};
  color: ${({ type, theme }) => {
    if (type === 'secondary') return theme.color_purple_50;
    if (type?.includes('text')) return theme.color_purple_50;
    return theme.white;
  }};
  background: ${({ type, theme }) => {
    if (type === 'cancel') return theme.color_gray_70;
    if (type === 'disabeled') return theme.color_gray_90;
    if (type === 'secondary') return theme.white;
    if (type?.includes('text')) return 'transparent';
    return theme.color_purple_50;
  }};
  text-align: center;
  text-transform: capitalize;

  ${({ type }) => type?.includes('arrow') && flexbox('row', 'nowrap', 'space-between', 'center')}
  ${({ type, theme }) => {
    if (type?.includes('arrow__right'))
      return `gap: 15px;
            &::after {
              content: "";
              width: 8px;
              height: 8px;
              border-right: 2px solid ${theme.color_purple_50};
              border-top: 2px solid ${theme.color_purple_50};
              transform: rotate(45deg);
            }`;
    else if (type?.includes('arrow__left'))
      return `gap: 15px;
            &::before {
              content: "";
              width: 8px;
              height: 8px;
              border-left: 2px solid ${theme.color_purple_50};
              border-top: 2px solid ${theme.color_purple_50};
              transform: rotate(-45deg);
            }`;
  }}
`;

export default LinkBtn;
