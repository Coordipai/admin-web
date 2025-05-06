import React from 'react'
import styled, { css, useTheme } from 'styled-components'

const FieldWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.margin.label};
  width: 100%;
  max-width: 100%;
`

const Label = styled.label`
  ${({ theme }) => theme.texts.textSM}
  font-weight: ${({ theme }) => theme.weights.medium};
  color: ${({ theme }) => theme.colors.gray700};
`

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`

const StyledInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  padding: ${({ theme, $hasIcon }) => $hasIcon ? `${theme.padding.sm} ${theme.padding.md} ${theme.padding.sm} 36px` : `${theme.padding.sm} ${theme.padding.md}`};
  ${({ theme }) => theme.texts.textMD}
  color: ${({ theme }) => theme.colors.gray900};
  background: ${({ theme, disabled }) => (disabled ? theme.colors.gray50 : theme.colors.white)};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.radius.lg};
  outline: none;
  transition: border 0.2s;

  &::placeholder {
    ${({ theme }) => theme.texts.textSM}
    font-weight: ${({ theme }) => theme.weights.medium};
    color: ${({ theme }) => theme.colors.gray500};
    opacity: 1;
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.brand600};
  }

  ${({ theme, $error }) =>
    $error &&
    css`
      border-color: ${theme.colors.error500} !important;
    `}

  ${({ theme, disabled }) =>
    disabled &&
    css`
      color: ${theme.colors.gray400};
      cursor: not-allowed;
    `}
`

const HelperText = styled.span`
  ${({ theme }) => theme.texts.textSM}
  color: ${({ theme, $error }) => ($error ? theme.colors.error500 : theme.colors.gray500)} !important;
`

const IconImg = styled.img`
  width: 16px;
  height: 16px;
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  filter: brightness(0) saturate(100%) invert(62%) sepia(6%) saturate(0%) hue-rotate(175deg) brightness(97%) contrast(88%);
`

/**
 * @param {object} props - 컴포넌트의 props
 * @param {string} [props.label] - 입력 필드 위에 표시될 레이블 텍스트
 * @param {string} props.value - 입력 필드의 현재 값
 * @param {function} props.onChange - 입력값 변경 시 호출될 콜백 함수
 * @param {string} [props.placeholder] - 입력 필드의 플레이스홀더 텍스트
 * @param {string} [props.helperText] - 입력 필드 아래에 표시될 도움말 텍스트
 * @param {boolean} [props.error=false] - 오류 상태를 표시. true일 경우 빨간색 테두리와 오류 메시지 스타일 적용
 * @param {boolean} [props.disabled=false] - 입력 필드 비활성화 여부
 * @param {boolean} [props.require=false] - 필수 입력 항목 여부
 * @returns {JSX.Element} 스타일이 적용된 입력 필드 컴포넌트
 *
 * @example
 * // 기본 사용법
 * <InputField
 *   label="이메일"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   placeholder="이메일을 입력하세요"
 * />
 *
 * // 오류 상태 표시
 * <InputField
 *   label="비밀번호"
 *   value={password}
 *   onChange={(e) => setPassword(e.target.value)}
 *   error={true}
 *   helperText="비밀번호는 8자 이상이어야 합니다"
 * />
 */

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  helperText,
  error = false,
  disabled = false,
  icon,
  require = false,
  ...props
}) => {
  const theme = useTheme()
  // error가 true일 때만 helperText 노출, error가 false면 helperText도 무조건 숨김
  let showHelper
  if (error) {
    showHelper = helperText || (require ? '필수 입력 항목입니다.' : undefined)
  }
  return (
    <FieldWrapper>
      {label && <Label>{label}{require && <span style={{ color: theme.colors.error500, marginLeft: 4 }}>*</span>}</Label>}
      <InputWrapper>
        {icon && (
          <IconImg src={icon} alt='icon' />
        )}
        <StyledInput
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          $error={error}
          disabled={disabled}
          $hasIcon={!!icon}
          {...props}
        />
      </InputWrapper>
      {showHelper && <HelperText $error={error}>{showHelper}</HelperText>}
    </FieldWrapper>
  )
}

export default InputField
