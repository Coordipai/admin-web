import React from 'react';
import styled, { css } from 'styled-components';
import Typography from '../Edit/Typography';

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.gap.sm};
  padding: ${({ theme, $variant }) =>
    $variant === 'icon' ? `${theme.padding.sm}` : `${theme.padding.sm} ${theme.padding.lg}`};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid
    ${({ theme, $color }) =>
      $color === 'white'
        ? theme.colors.gray300
        : $color
        ? theme.colors[$color]
        : theme.colors.brand500};
  background: ${({ theme, $color }) => $color ? theme.colors[$color] : theme.colors.brand500};
  color: ${({ theme, $color }) => $color === 'white' ? theme.colors.gray700 : theme.colors.white};
  font-family: Poppins, sans-serif;
  font-weight: ${({ theme }) => theme.weights.semiBold};
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  box-sizing: border-box;
  ${({ disabled, theme }) =>
    disabled &&
    css`
      background: ${theme.colors.gray200};
      color: ${theme.colors.gray400};
      border-color: ${theme.colors.gray200};
      cursor: not-allowed;
    `}
  &:hover {
    background: ${({ theme, $color, disabled }) =>
      disabled
        ? theme.colors.gray200
        : $color === 'white'
        ? theme.colors.gray200
        : theme.colors.brand600};
  }
  ${({ $variant, theme }) =>
    $variant === 'text' &&
    css`
      background: none;
      border: none;
      color: ${theme.colors.brand500};
      padding: 0;
      &:hover {
        background: none;
        color: ${theme.colors.brand600};
      }
    `}
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

/**
 * 버튼 컴포넌트
 * @param {string} text - 버튼에 표시될 텍스트
 * @param {ReactNode} icon - 버튼에 표시될 아이콘
 * @param {'default'|'text'} variant - 버튼의 스타일 변형 ('default' 또는 'text')
 * @param {function} onClick - 클릭 이벤트 핸들러
 * @param {'button'|'submit'|'reset'} type - 버튼의 타입
 * @param {boolean} disabled - 버튼의 비활성화 여부
 * @param {Object} props - 추가 props
 * @returns {JSX.Element} 버튼 컴포넌트
 * 
 * @example
 * // 기본 버튼
 * <Button text="확인" onClick={() => console.log('clicked')} />
 * 
 * @example
 * // 아이콘이 있는 버튼
 * <Button 
 *   text="업로드" 
 *   icon={<UploadIcon />} 
 *   onClick={handleUpload} 
 * />
 * 
 * @example
 * // 텍스트 변형 버튼
 * <Button 
 *   text="더 보기" 
 *   variant="text" 
 *   onClick={handleShowMore}
 * />
 * 
 * @example
 * // 제출 버튼
 * <Button 
 *   text="저장" 
 *   type="submit"
 *   disabled={!isValid}
 * />
 */
const Button = ({
  text,
  icon,
  variant = 'default',
  color,
  onClick,
  type = 'button',
  disabled = false,
  ...props
}) => {
  return (
    <StyledButton
      type={type}
      onClick={onClick}
      disabled={disabled}
      $variant={variant}
      $color={color}
      {...props}
    >
      {icon && <IconWrapper>{icon}</IconWrapper>}
      {text && (
        <Typography
          variant="textMD"
          weight={variant === 'text' ? 'medium' : 'semibold'}
          color={color === 'white' ? 'gray700' : 'white'}
          value={text}
        />
      )}
    </StyledButton>
  );
};

export default Button; 