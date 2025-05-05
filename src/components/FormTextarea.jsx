import React, { useState } from 'react';
import styled, { useTheme, css } from 'styled-components';
import PropTypes from 'prop-types';
import { InputFieldBase } from '@styles/globalStyle';

const FieldWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.margin.label};
  width: 100%;
  max-width: 100%;
`;

const Label = styled.label`
  ${({ theme }) => theme.texts.textSM}
  font-weight: ${({ theme }) => theme.weights.medium};
  color: ${({ theme }) => theme.colors.gray700};
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  border: none;
  outline: none;
  resize: vertical;
  ${({ theme }) => theme.texts.textMD}
  color: ${({ theme }) => theme.colors.gray900};
  background: ${({ theme, disabled }) => (disabled ? theme.colors.gray50 : theme.colors.white)};
  caret-color: ${({ $hideCursor }) => ($hideCursor ? 'transparent' : 'auto')};
  
  &::placeholder {
    ${({ theme }) => theme.texts.textSM}
    font-weight: ${({ theme }) => theme.weights.medium};
    color: ${({ theme }) => theme.colors.gray500};
    opacity: 1;
  }

  ${({ theme, disabled }) =>
    disabled &&
    css`
      color: ${theme.colors.gray400};
      cursor: not-allowed;
    `}
`;

const HelperText = styled.span`
  ${({ theme }) => theme.texts.textSM}
  color: ${({ theme, $error }) => ($error ? theme.colors.error500 : theme.colors.gray500)} !important;
`;

const FormTextarea = ({
  label,
  value,
  onChange,
  onBlur = () => {},
  placeholder,
  helperText,
  error = false,
  disabled = false,
  readOnly = false,
  hideCursor = false,
  require = false,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const theme = useTheme();

  let showHelper = undefined;
  if (error) {
    showHelper = helperText || (require ? '필수 입력 항목입니다.' : undefined);
  }

  return (
    <FieldWrapper>
      {label && (
        <Label>
          {label}
          {require && <span style={{ color: theme.colors.error500, marginLeft: 4 }}>*</span>}
        </Label>
      )}
      <InputFieldBase $focused={focused}>
        <StyledTextarea
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.currentTarget.value)}
          onBlur={(e) => {
            onBlur(e.currentTarget.value);
            setFocused(false);
          }}
          onFocus={() => setFocused(true)}
          $hideCursor={hideCursor}
          readOnly={readOnly}
          disabled={disabled}
          rows="6"
          {...props}
        />
      </InputFieldBase>
      {showHelper && <HelperText $error={error}>{showHelper}</HelperText>}
    </FieldWrapper>
  );
};

FormTextarea.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  helperText: PropTypes.string,
  error: PropTypes.bool,
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,
  hideCursor: PropTypes.bool,
  require: PropTypes.bool,
};

export default FormTextarea;
