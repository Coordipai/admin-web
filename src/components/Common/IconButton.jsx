import React from 'react';
import styled, { css } from 'styled-components';

const StyledIconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: ${({ theme }) => theme.padding.sm};
  border: none;
  background: none;
  color: ${({ theme }) => theme.colors.gray700};
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: none;
  }
  ${({ disabled, theme }) =>
    disabled &&
    css`
      color: ${theme.colors.gray300};
      cursor: not-allowed;
    `}
`;

/**
 * 아이콘 버튼 컴포넌트
 * @param {ReactNode} icon - 버튼에 표시될 아이콘
 * @param {function} onClick - 클릭 이벤트 핸들러
 * @param {'button'|'submit'|'reset'} type - 버튼의 타입
 * @param {boolean} disabled - 버튼의 비활성화 여부
 * @param {Object} props - 추가 props
 * @returns {JSX.Element} 아이콘 버튼 컴포넌트
 * 
 * @example
 * // 기본 아이콘 버튼
 * <IconButton 
 *   icon={<DeleteIcon />} 
 *   onClick={handleDelete} 
 * />
 * 
 * @example
 * // 비활성화된 아이콘 버튼
 * <IconButton
 *   icon={<EditIcon />}
 *   onClick={handleEdit}
 *   disabled={true}
 * />
 */
const IconButton = ({ icon, onClick, type = 'button', disabled = false, ...props }) => (
  <StyledIconButton type={type} onClick={onClick} disabled={disabled} {...props}>
    {icon}
  </StyledIconButton>
);

export default IconButton; 