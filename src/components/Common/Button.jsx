import React from 'react'
import styled, { css } from 'styled-components'
import Typography from '@components/Edit/Typography'

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.gap.sm};
  padding: ${({ theme }) => `${theme.padding.sm} ${theme.padding.lg}`};
  border-radius: ${({ theme }) => theme.radius.lg};
  font-family: Poppins, sans-serif;
  font-weight: ${({ theme }) => theme.weights.semiBold};
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
  box-sizing: border-box;
  border-width: 1px;
  border-style: solid;

  ${({ theme, $variant = 'text', $color = 'brand500', disabled }) => {
    const colorValue = theme.colors[$color] || theme.colors.brand500
    if (disabled) {
      return css`
        background: ${theme.colors.gray200};
        color: ${theme.colors.gray400};
        border-color: ${theme.colors.gray200};
        cursor: not-allowed;
      `
    }
    switch ($variant) {
      case 'contained':
        return css`
          background: ${colorValue};
          color: ${theme.colors.white};
          border-color: ${colorValue};
          &:hover {
            background: ${theme.colors[$color + '600'] || colorValue};
            border-color: ${theme.colors[$color + '600'] || colorValue};
          }
        `
      case 'outlined':
        return css`
          background: ${theme.colors.white};
          color: ${colorValue};
          border-color: ${colorValue};
          &:hover {
            background: ${theme.colors.gray50};
            color: ${theme.colors[$color + '600'] || colorValue};
            border-color: ${theme.colors[$color + '600'] || colorValue};
          }
        `
      case 'text':
      default:
        return css`
          background: ${theme.colors.white};
          color: ${colorValue};
          border: none;
          &:hover {
            background: ${theme.colors.gray50};
            color: ${theme.colors[$color + '600'] || colorValue};
          }
        `
    }
  }}
`

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`

/**
 * 버튼 컴포넌트
 * @param {ReactNode} children - 버튼에 표시될 내용(텍스트 또는 노드)
 * @param {ReactNode} icon - 버튼에 표시될 아이콘
 * @param {'contained'|'outlined'|'text'} variant - 버튼의 스타일 변형
 * @param {string} color - theme.js에 정의된 색상 키
 * @param {function} onClick - 클릭 이벤트 핸들러
 * @param {'button'|'submit'|'reset'} type - 버튼의 타입
 * @param {boolean} disabled - 버튼의 비활성화 여부
 * @param {Object} props - 추가 props
 * @returns {JSX.Element} 버튼 컴포넌트
 *
 * @example
 * <Button variant="contained" color="brand500">확인</Button>
 */
const Button = ({
  children,
  icon,
  variant = 'text',
  color = 'brand500',
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
      {children && (
        <Typography
          variant='textMD'
          weight={variant === 'text' ? 'medium' : 'semibold'}
          color={
            disabled
              ? 'gray400'
              : variant === 'contained'
                ? 'white'
                : color
          }
          value={children}
        />
      )}
    </StyledButton>
  )
}

export default Button
