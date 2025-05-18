import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Calendar, List, LogOut01 } from '@untitled-ui/icons-react'
import { useProjectStore } from '@store/useProjectStore'

import {
  HorizontalDivider,
  VerticalDivider,
  styledIcon
} from '@styles/globalStyle'
import { useUserStore } from '@store/useUserStore'


const LogOutIcon = styledIcon({ icon: LogOut01, strokeColor: '#717680', style: { width: '1.5rem', height: '1.5rem' } })
const CalendarIcon = styledIcon({ icon: Calendar, strokeColor: '#717680', style: { width: '1.5rem', height: '1.5rem' } })
const ListIcon = styledIcon({ icon: List, style: { cursor: 'pointer' } })

// 전체 레이아웃
const SidebarLayout = styled.div`
  height: 100vh;
  min-width: 20rem;
  display: flex;
`

const ContentWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

// NavHeaderSection
const NavHeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem 1rem 1rem 1rem;
  gap: 1.5rem;
  cursor: pointer;
`

const NavHeaderBox = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  ${({ theme }) => theme.texts.displayXS}
  font-weight: ${({ theme }) => theme.weights.semiBold};
  color: ${({ theme }) => theme.colors.gray700};
`

const NavHeaderImg = styled.img`
  width: 2rem;
  height: 2rem;
`

const NavHeaderText = styled.span`
  ${({ theme }) => theme.texts.textXL};
  font-weight: ${({ theme }) => theme.weights.semiBold};
  color: ${({ theme }) => theme.colors.gray700};
`

// NavBodySection
const NavBox = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 1rem;
    padding: 0.5rem 1.5rem;
`

const NavProjectHeaderText = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    ${({ theme }) => theme.texts.textLG};
    font-weight: ${({ theme }) => theme.weights.semiBold};
`

const NavProjectItemBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
`
const NavProjectItemTextContainer = styled.div`
    display: flex;
    flex-direction: column;
`

const NavProjectItemHeaderText = styled.span`
    display: flex;
    ${({ theme }) => theme.texts.textMD};
    font-weight: ${({ theme }) => theme.weights.semiBold};
`

const NavProjectItemSubText = styled.span`
    display: flex;
    ${({ theme }) => theme.texts.textXS};
    color: ${({ theme }) => theme.colors.gray500};
`

const NavProjectCategoryBox = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`

const NavProjectCategoryHeaderText = styled.span`
    ${({ theme }) => theme.texts.textXS};
    color: ${({ theme }) => theme.colors.gray500};
`

const NavProjectCategoryItemBox = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0 0 0 0.5rem;
    gap: 0.5rem;
`

// NavFooterSection
const NavFooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 0 1rem 2rem 1rem;
`

// FormAccount
const FormAccountContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0 0.5rem;
  gap: 0.75rem;
`

const FormAccountProfileImage = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
`

const FormAccountAvatar = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`

const FormAccountAvatarText = styled.div`
  ${({ theme }) => theme.texts.textSM}
  font-weight: ${({ theme }) => theme.weights.semiBold};
  color: ${({ theme }) => theme.colors.gray900};
`

const FormAccountAvatarSupportingText = styled.div`
  ${({ theme }) => theme.texts.textSM}
  font-weight: ${({ theme }) => theme.weights.regular};
  color: ${({ theme }) => theme.colors.gray600};
`

const LogoutButton = styled.div`
  width: 2.25rem;
  height: 2.25rem;
  display: flex;
`

const FormAccount = ({ text, supportingText, onClick, logout, image }) => {
  return (
    <FormAccountContainer onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <FormAccountProfileImage src={image} alt='프로필' />
      <FormAccountAvatar>
        <FormAccountAvatarText>{text}</FormAccountAvatarText>
        <FormAccountAvatarSupportingText>{supportingText}</FormAccountAvatarSupportingText>
      </FormAccountAvatar>
      {logout && (
        <LogoutButton
          onClick={(e) => {
            e.stopPropagation()
            logout()
          }}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <LogOutIcon />
        </LogoutButton>
      )}
    </FormAccountContainer>
  )
}

FormAccount.propTypes = {
  text: PropTypes.string.isRequired,
  supportingText: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  logout: PropTypes.func,
  image: PropTypes.string
}

const NavBodySection = ({ projectName, iteration, issueSummary, categories }) => {
  return (
    <NavBox>
      <NavProjectHeaderText>{projectName}</NavProjectHeaderText>
      <NavProjectItemBox>
        <CalendarIcon />
        <NavProjectItemTextContainer>
          <NavProjectItemHeaderText>Iteration {iteration.sprint}</NavProjectItemHeaderText>
          <NavProjectItemSubText>기간 {iteration.period}</NavProjectItemSubText>
        </NavProjectItemTextContainer>
      </NavProjectItemBox>
      <NavProjectItemBox>
        <ListIcon />
        <NavProjectItemTextContainer>
          <NavProjectItemHeaderText>Issues</NavProjectItemHeaderText>
          <NavProjectItemSubText>{issueSummary.openedIssues}개 진행중 / {issueSummary.allIssues}개</NavProjectItemSubText>
        </NavProjectItemTextContainer>
      </NavProjectItemBox>

      {categories.map((category, index) => (
        <NavProjectCategoryBox key={index}>
          <NavProjectCategoryHeaderText>{category.categoryName}</NavProjectCategoryHeaderText>
          <NavProjectCategoryItemBox>
            {category.people.map((person, idx) => (
              <FormAccount
                key={idx}
                image={person.image}
                text={person.userName}
                supportingText={person.githubId}
              />
            ))}
          </NavProjectCategoryItemBox>
        </NavProjectCategoryBox>
      ))}
    </NavBox>
  )
}

NavBodySection.propTypes = {
  projectName: PropTypes.string.isRequired,
  nowIteration: PropTypes.shape({
    sprint: PropTypes.string.isRequired,
    period: PropTypes.string.isRequired
  }).isRequired,
  issueSummary: PropTypes.shape({
    openedIssues: PropTypes.number.isRequired,
    allIssues: PropTypes.number.isRequired
  }).isRequired,
  categories: PropTypes.arrayOf(
    PropTypes.shape({
      categoryName: PropTypes.string.isRequired,
      people: PropTypes.arrayOf(
        PropTypes.shape({
          image: PropTypes.elementType.isRequired,
          userName: PropTypes.string.isRequired,
          githubId: PropTypes.string.isRequired
        })
      ).isRequired
    })
  ).isRequired
}

const SideBar = ({
  brandIcon,
  brandTitle,
  titleOnClick,
  userOnClick,
  logout
}) => {
  const currentProject = useProjectStore((state) => state.project)
  const userInfo = useUserStore((state) => state.user)

  return (
    <SidebarLayout>
      <ContentWrapper>
        <NavHeaderSection onClick={titleOnClick}>
          <NavHeaderBox>
            <NavHeaderImg src={brandIcon} />
            <NavHeaderText>{brandTitle}</NavHeaderText>
          </NavHeaderBox>
          <HorizontalDivider />
        </NavHeaderSection>

        {currentProject && (
          <NavBodySection
            projectName={currentProject.repo_fullname}
            iteration={currentProject.nowIteration}
            issueSummary={currentProject.issueSummary}
            categories={currentProject.categories}
          />
        )}

        <NavFooterSection>
          <HorizontalDivider />
        {userInfo && (
          <FormAccount
            image={userInfo.profile_img}
            text={userInfo.name}
            supportingText={userInfo.github_name}
            logout={logout}
            onClick={userOnClick}
          />
        )}
        </NavFooterSection>
      </ContentWrapper>
      <VerticalDivider />
    </SidebarLayout>
  )
}

SideBar.propTypes = {
  brandIcon: PropTypes.string.isRequired,
  brandTitle: PropTypes.string.isRequired,
  titleOnClick: PropTypes.func.isRequired,
  userOnClick: PropTypes.func,
  logout: PropTypes.func.isRequired
}

export default SideBar
