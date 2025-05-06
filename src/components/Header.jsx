import { useState } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { ButtonBase, HorizontalDivider } from '@styles/globalStyle'

/* ===== Layout Styles ===== */
const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1.5rem;
`

const HeaderLayout = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: space-between;
`

const HeaderTextBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const HeaderText = styled.span`
  ${({ theme }) => theme.texts.displayXS}
  font-weight: ${({ theme }) => theme.weights.semiBold};
  color: ${({ theme }) => theme.colors.gray900};
`

const HeaderActionsBox = styled.div`
  display: flex;
  gap: 0.5rem;
  align-self: flex-start;
`

/* ===== Tabs (Internal to Header) ===== */
const EditHeaderTabsLayout = styled.div`
  display: flex;
  flex-direction: column;
`

const HeaderTabsBox = styled.div`
  display: flex;
  gap: 1rem;
`

const HeaderTabBase = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: space-between;
  cursor: pointer;
`

const HeaderTabText = styled.span`
  padding: 0 0.25rem 1rem 0.25rem;
  ${({ theme }) => theme.texts.textSM}
  font-weight: ${({ theme }) => theme.weights.semiBold};
  color: ${({ theme, $selected }) =>
    $selected ? theme.colors.brand700 : theme.colors.gray500};
`

const HeaderTabBottomBorder = styled.div`
  width: 100%;
  height: ${({ $selected }) => ($selected ? `${2 / 16}rem` : '0')};
  background-color: ${({ theme }) => theme.colors.brand700};
`

const EditHeaderTabsDivider = styled.div`
  width: 100%;
  height: 0.0625rem;
  background-color: ${({ theme }) => theme.colors.gray200};
`

/**
 * Header Component
 * 
 * @param {string} text - 헤더 타이틀 텍스트
 * @param {array} buttonsData - 버튼 목록 [{ value, onClick, icon, isHighlighted }]
 * @param {boolean} isTab - true면 하단에 이슈/요청 탭 표시
 */
const Header = ({ text, buttonsData = [], isTab }) => {
  const [selectedTab, setSelectedTab] = useState(0)

  const renderTabs = () => (
    <EditHeaderTabsLayout>
      <HeaderTabsBox>
        <HeaderTabBase onClick={() => setSelectedTab(0)}>
          <HeaderTabText $selected={selectedTab === 0}>이슈 목록</HeaderTabText>
          <HeaderTabBottomBorder $selected={selectedTab === 0} />
        </HeaderTabBase>
        <HeaderTabBase onClick={() => setSelectedTab(1)}>
          <HeaderTabText $selected={selectedTab === 1}>변경 요청 목록</HeaderTabText>
          <HeaderTabBottomBorder $selected={selectedTab === 1} />
        </HeaderTabBase>
      </HeaderTabsBox>
      <EditHeaderTabsDivider />
    </EditHeaderTabsLayout>
  )

  return (
    <HeaderContainer>
      <HeaderLayout>
        <HeaderTextBox>
          <HeaderText>{text}</HeaderText>
        </HeaderTextBox>
        <HeaderActionsBox>
          {buttonsData.map((item, index) => (
            <ButtonBase
              key={index}
              $isHighlighted={item.isHighlighted}
              onClick={item.onClick}
            >
              {item.icon}
              {item.value}
            </ButtonBase>
          ))}
        </HeaderActionsBox>
      </HeaderLayout>
      {isTab ? renderTabs() : <HorizontalDivider />}
    </HeaderContainer>
  )
}

Header.propTypes = {
  text: PropTypes.string.isRequired,
  buttonsData: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      onClick: PropTypes.func,
      icon: PropTypes.element,
      isHighlighted: PropTypes.bool
    })
  ),
  isTab: PropTypes.bool
}

export default Header
