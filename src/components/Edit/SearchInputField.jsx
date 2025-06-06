import React, { useState, useRef, useEffect } from 'react'
import InputField from '@components/Edit/InputField'
import searchIcon from '@assets/icons/search-icon.svg'

// DropDownMenu, DropDownItem 스타일 재사용
import { DropDownMenu, DropDownItem } from '@components/Edit/DropDown.jsx'

/**
 * @param {object} props
 * @param {string} [props.label]
 * @param {string} props.value
 * @param {function} props.onChange
 * @param {Array<{value: string, label: string, disabled?: boolean}>} [props.options=[]]
 * @param {function} props.onSelect - 메뉴에서 항목 선택 시 호출 (value)
 * @param {string} [props.placeholder]
 * @param {string} [props.helperText]
 * @param {boolean} [props.error=false]
 * @param {boolean} [props.disabled=false]
 */
const SearchInputField = ({
  label,
  value,
  onChange,
  options = [],
  onSelect,
  placeholder,
  helperText,
  error = false,
  disabled = false,
  ...props
}) => {
  const [open, setOpen] = useState(false)
  const ref = useRef()
  const menuRef = useRef()
  const inputRef = useRef()
  const [menuStyle, setMenuStyle] = useState({})

  useEffect(() => {
    if (open && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect()
      setMenuStyle({
        position: 'fixed',
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        zIndex: 9999,
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      })
    }
  }, [open])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        ref.current &&
        !ref.current.contains(e.target) &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      <InputField
        label={label}
        value={value}
        onChange={e => {
          onChange(e)
          setOpen(!!e.target.value)
        }}
        placeholder={placeholder}
        helperText={helperText}
        error={error}
        disabled={disabled}
        ref={inputRef}
        onFocus={() => setOpen(!!value)}
        icon={searchIcon}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            e.preventDefault()
            e.stopPropagation()
            if (props.onKeyDown) props.onKeyDown(e)
          }
        }}
        {...Object.fromEntries(Object.entries(props).filter(([k]) => k !== 'onKeyDown'))}
      />
      {open && value && options.length > 0 && <DropDownMenu
        ref={menuRef}
        role='listbox'
        style={{
          ...menuStyle,
          maxHeight: options.length > 5 ? 'calc(2.5rem * 5)' : undefined,
          overflowY: options.length > 5 ? 'auto' : undefined,
          display: 'block'
        }}
                                              >
        {options.map(opt => (
          <DropDownItem
            key={opt.value}
            selected={false}
            disabled={opt.disabled}
            onClick={() => {
              if (opt.disabled) return
              onSelect && onSelect(opt.value, opt.label)
              setOpen(false)
            }}
          >
            {opt.label}
          </DropDownItem>
        ))}
      </DropDownMenu>}
    </div>
  )
}

export default SearchInputField
