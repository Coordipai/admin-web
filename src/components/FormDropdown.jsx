import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { ChevronUp, ChevronDown } from '@untitled-ui/icons-react'

import { InputFieldBase, styledIcon } from '@styles/globalStyle'

const FormDropdownLayout = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
`

const FormInputLayout = styled.div`
  width: 100%;
  display: flex;
`

const FormInputBox = styled.input`
  width: 100%;
  display: flex;
  border: 0;
  outline: none;
  cursor: pointer;
  caret-color: transparent;
`

const DropdownBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin-top: 0.5rem;
  max-height: ${({ $isOpen, $maxHeight }) =>
    $isOpen ? ($maxHeight > 40 ? '32vh' : `${$maxHeight}rem`) : 0};
  border: ${({ theme, $isOpen }) =>
    $isOpen ? `0.0625rem solid ${theme.colors.gray100}` : null};
  border-radius: 0.5rem;
  overflow: hidden;
  overflow-y: auto;
  transition: max-height 0.3s ease-out;
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 2;
`

const DropdownItemBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const DropdownMenuBox = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.625rem 0.875rem;
  ${({ theme }) => theme.texts.textMD}
  font-weight: ${({ theme }) => theme.weights.medium};
  color: ${({ theme }) => theme.colors.gray900};
  background-color: ${({ theme, $selected }) =>
    $selected ? theme.colors.gray50 : theme.colors.white};
  cursor: pointer;
`

const ChevronUpIcon = styledIcon({ icon: ChevronUp })
const ChevronDownIcon = styledIcon({ icon: ChevronDown })

const FormDropdown = ({ placeholder, menus, selectedMenu, handleChange }) => {
  const [value, setValue] = useState(
    selectedMenu !== -1 && menus[selectedMenu] ? menus[selectedMenu].title : ''
  )
  const [focused, setFocused] = useState(false)
  const [dropdownBoxHeight, setDropdownBoxHeight] = useState(0)

  const dropdownMenuWrapperRef = useRef()
  const dropdownRef = useRef()

  useLayoutEffect(() => {
    if (dropdownMenuWrapperRef.current) { setDropdownBoxHeight(dropdownMenuWrapperRef.current.scrollHeight) }
  }, [focused])

  useEffect(() => {
    if (selectedMenu != -1 && menus.length != 0) { setValue(menus[selectedMenu].title) }
  }, [value, selectedMenu, menus])

  return (
    <FormDropdownLayout>
      <FormInputLayout>
        <InputFieldBase
          $focused={focused}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        >
          <FormInputBox
            value={value}
            placeholder={placeholder}
            readOnly
            ref={dropdownRef}
          />
          {focused ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </InputFieldBase>
      </FormInputLayout>
      <DropdownBox
        ref={dropdownMenuWrapperRef}
        $isOpen={focused}
        $maxHeight={dropdownBoxHeight}
      >
        {menus.map((menuItem, menuIndex) => {
          return (
            <DropdownItemBox key={menuIndex}>
              <DropdownMenuBox
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setValue(menuItem.title)
                  handleChange(menuIndex)
                  dropdownRef.current.blur()
                }}
                $selected={menuIndex === selectedMenu}
              >
                {menuItem.title}
              </DropdownMenuBox>
            </DropdownItemBox>
          )
        })}
      </DropdownBox>
    </FormDropdownLayout>
  )
}

FormDropdown.propTypes = {
  placeholder: PropTypes.string,
  menus: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired
    })
  ).isRequired,
  selectedMenu: PropTypes.number.isRequired,
  handleChange: PropTypes.func
}

export default FormDropdown
