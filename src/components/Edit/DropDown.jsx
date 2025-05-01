import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.margin.sm};
  width: 100%;
  max-width: 100%;
  
  position: relative;
`;

const Label = styled.label`
  ${({ theme }) => theme.texts.textSM}
  font-weight: ${({ theme }) => theme.weights.medium};
  color: ${({ theme }) => theme.colors.gray700};
  margin-bottom: ${({ theme }) => theme.margin.label};
`;

const DropDownBase = styled.button`
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.padding.sm} ${theme.padding.md}`};
  ${({ theme }) => theme.texts.textMD}
  color: ${({ theme, $hasValue }) => $hasValue ? theme.colors.gray900 : theme.colors.gray500};
  background: ${({ theme, disabled }) => (disabled ? theme.colors.gray50 : theme.colors.white)};
  border: 1px solid ${({ theme, $error }) => $error ? theme.colors.error500 : theme.colors.gray300};
  border-radius: ${({ theme }) => theme.radius.lg};
  outline: none;
  transition: border 0.2s;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  position: relative;

  &:focus {
    border-color: ${({ theme }) => theme.colors.brand600};
  }

  &::after {
    content: '';
    display: inline-block;
    margin-left: ${({ theme }) => theme.margin.sm};
    border: 0.25rem solid transparent;
    border-top: 0.375rem solid ${({ theme }) => theme.colors.gray500};
    vertical-align: middle;
  }
`;

const DropDownMenu = styled.ul`
  position: absolute;
  top: calc(100% + ${({ theme }) => theme.margin.xs});
  left: 0;
  width: 100%;
  min-width: 0;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: 0px 8px 24px 0px rgba(16, 24, 40, 0.08);
  margin: 0;
  padding: ${({ theme }) => `${theme.padding.xs} 0`};
  z-index: 10;
  list-style: none;
  max-height: 16rem;
  overflow-y: auto;
  overflow-x: hidden;
  white-space: nowrap;
`;

const DropDownItem = styled.li`
  width: 100%;
  padding: ${({ theme }) => `${theme.padding.sm} ${theme.padding.md}`};
  ${({ theme }) => theme.texts.textMD}
  color: ${({ theme, selected, disabled, isplaceholder }) =>
    disabled
      ? theme.colors.gray300
      : isplaceholder
      ? theme.colors.gray500
      : selected
      ? theme.colors.brand600
      : theme.colors.gray700};
  background: ${({ selected, theme, isplaceholder }) =>
    isplaceholder
      ? theme.colors.white
      : selected
      ? theme.colors.brand50
      : 'transparent'};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  transition: background 0.15s, color 0.15s;

  &:hover {
    background: ${({ theme, disabled, isplaceholder }) =>
      disabled || isplaceholder ? theme.colors.white : theme.colors.brand50};
  }
`;

const HelperText = styled.span`
  ${({ theme }) => theme.texts.textSM}
  color: ${({ theme, $error }) => ($error ? theme.colors.error500 : theme.colors.gray500)};
  margin-top: ${({ theme }) => theme.margin.label};
`;

const Placeholder = styled.span`
  ${({ theme }) => theme.texts.textSM}
  font-weight: ${({ theme }) => theme.weights.medium};
  color: ${({ theme }) => theme.colors.gray500};
`;
/**
 * @param {object} props - 컴포넌트의 props
 * @param {string} [props.label] - 드롭다운 위에 표시될 레이블 텍스트
 * @param {string|string[]} props.value - 선택된 값. multi가 true일 경우 배열
 * @param {function} props.onChange - 값 변경 시 호출될 콜백 함수
 * @param {Array<{value: string, label: string, disabled?: boolean}>} [props.options=[]] - 드롭다운 옵션 배열
 * @param {string} [props.helperText] - 드롭다운 아래에 표시될 도움말 텍스트
 * @param {boolean} [props.error=false] - 오류 상태를 표시. true일 경우 오류 스타일 적용
 * @param {boolean} [props.disabled=false] - 드롭다운 비활성화 여부
 * @param {boolean} [props.multi=false] - 다중 선택 가능 여부
 * @param {string} [props.placeholder='선택하세요'] - 기본 표시 텍스트
 * @returns {JSX.Element} 스타일이 적용된 드롭다운 컴포넌트
 * 
 * @example
 * // 기본 사용법
 * <DropDown
 *   label="카테고리"
 *   value={category}
 *   onChange={setCategory}
 *   options={[
 *     { value: 'food', label: '음식' },
 *     { value: 'drink', label: '음료' }
 *   ]}
 * />
 * 
 * // 다중 선택 사용
 * <DropDown
 *   label="태그"
 *   value={tags}
 *   onChange={setTags}
 *   options={tagOptions}
 *   multi={true}
 *   placeholder="태그를 선택하세요"
 * />
 */

const DropDown = ({
  label,
  value,
  onChange,
  options = [],
  helperText,
  error = false,
  disabled = false,
  multi = false,
  placeholder = '선택하세요',
  ...props
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleSelect = (option) => {
    if (disabled || option.disabled) return;
    if (multi) {
      if (Array.isArray(value)) {
        if (value.includes(option.value)) {
          onChange(value.filter((v) => v !== option.value));
        } else {
          onChange([...value, option.value]);
        }
      } else {
        onChange([option.value]);
      }
    } else {
      onChange(option.value);
      setOpen(false);
    }
  };

  const getLabel = (val) => {
    if (multi && Array.isArray(val)) {
      return options.filter(opt => val.includes(opt.value)).map(opt => opt.label).join(', ');
    }
    const found = options.find(opt => opt.value === val);
    return found ? found.label : '';
  };

  const hasValue = multi ? Array.isArray(value) && value.length > 0 : !!value;

  return (
    <FieldWrapper ref={ref}>
      {label && <Label>{label}</Label>}
      <DropDownBase
        type="button"
        onClick={() => !disabled && setOpen((prev) => !prev)}
        disabled={disabled}
        $error={error}
        $hasValue={hasValue}
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={open}
        {...props}
      >
        {hasValue ? (
          <span>{getLabel(value)}</span>
        ) : (
          <Placeholder>{placeholder}</Placeholder>
        )}
      </DropDownBase>
      {open && (
        <DropDownMenu role="listbox">
          {options.map((opt) => (
            <DropDownItem
              key={opt.value}
              selected={multi ? Array.isArray(value) && value.includes(opt.value) : value === opt.value}
              disabled={opt.disabled || opt.value === ''}
              isplaceholder={opt.value === ''}
              onClick={() => {
                if (opt.disabled || opt.value === '') return;
                handleSelect(opt);
              }}
              role="option"
              aria-selected={multi ? Array.isArray(value) && value.includes(opt.value) : value === opt.value}
            >
              {opt.label}
            </DropDownItem>
          ))}
        </DropDownMenu>
      )}
      {helperText && <HelperText $error={error}>{helperText}</HelperText>}
    </FieldWrapper>
  );
};

export default DropDown; 