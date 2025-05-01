import React from 'react';
import styled, { css } from 'styled-components';

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.margin.label};
  width: 100%;
  max-width: 100%;
  padding: ${({ theme }) => theme.padding.sm};
`;

const Label = styled.label`
  ${({ theme }) => theme.texts.textSM}
  font-weight: ${({ theme }) => theme.weights.medium};
  color: ${({ theme }) => theme.colors.gray700};
  margin-bottom: ${({ theme }) => theme.margin.label};
`;

const StyledInput = styled.input`
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  padding: ${({ theme }) => `${theme.padding.sm} ${theme.padding.md}`};
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
      border-color: ${theme.colors.error500};
    `}

  ${({ theme, disabled }) =>
    disabled &&
    css`
      color: ${theme.colors.gray400};
      cursor: not-allowed;
    `}
`;

const HelperText = styled.span`
  ${({ theme }) => theme.texts.textSM}
  color: ${({ theme, $error }) => ($error ? theme.colors.error500 : theme.colors.gray500)};
  margin-top: ${({ theme }) => theme.margin.label};
`;

const InputField = ({
  label,
  value,
  onChange,
  placeholder,
  helperText,
  error = false,
  disabled = false,
  ...props
}) => {
  return (
    <FieldWrapper>
      {label && <Label>{label}</Label>}
      <StyledInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        $error={error}
        disabled={disabled}
        {...props}
      />
      {helperText && <HelperText $error={error}>{helperText}</HelperText>}
    </FieldWrapper>
  );
};

export default InputField; 