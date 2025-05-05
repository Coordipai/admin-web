import { useState } from 'react'
import arrowright from '../../assets/icons/arrow-right.svg'
import styled from 'styled-components'
import FormInput from '@components/FormInput'
import FormTextarea from '@components/FormTextarea'
import FormDropdown from '@components/FormDropdown'
import Header from '@components/ChangeIssueHeader'
import { EditContentHeader } from '../../components/Edit/EditContentHeader'
import { ButtonBase } from '@styles/globalStyle'
import IssueDetailModal from './IssueDetailModal'
import SideBar from '@components/SideBar' // 경로는 실제 위치에 맞게 조정
import brandIcon from '@assets/brandIcon.png' // 브랜드 로고 아이콘

const PageWrapper = styled.div`
  display: flex;
`

const SidebarPlaceholder = styled.div`
  height: 100vh;
  min-width: 19.5rem;
  display: flex;
  justify-content: space-between;
  position: sticky;
  top: 0;
  align-self: flex-start;
`

const FormWrapper = styled.div`
  max-width: 1120px;
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const LabeledRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  padding: 1.25rem 0;
`

const TextareaWrapper = styled.div`
  width: 512px;
`
const Label = styled.span`
  width: 280px;
  flex-shrink: 0;
  ${({ theme }) => theme.texts.textMD};
  font-weight: ${({ theme }) => theme.weights.medium};
  color: ${({ theme }) => theme.colors.gray700};
`

const Divider = styled.div`
  height: 1px;
  background-color: ${({ theme }) => theme.colors.gray200};
  width: 100%;
`

const RowGroup = styled.div`
  display: flex;
  gap: 0.1rem;
`
const RowGroup2 = styled.div`
  display: flex;
  gap: 0.75rem;
`

const ButtonWrapper = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 2rem;
  align-items: end;
  padding-top: 2.5rem;
`

const Button = styled(ButtonBase)`
  width: 98px;
  height: 34px;
  padding: 0rem;
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ theme }) => theme.texts.textXS};

  ${({ $variant, theme }) =>
    $variant === 'text' &&
    `
    background: white;
    color: ${theme.colors.gray700};
    border: 1px solid ${theme.colors.gray300};
  `}
`

export default function changeIssuePage() {
  const [currentSprint, setCurrentSprint] = useState('sprint1')
  const sprintOptions = [
    { title: 'sprint 1' },
    { title: 'sprint 2' },
    { title: 'sprint 3' },
    { title: 'sprint 4' },
  ];
  const [selectedSprint, setSelectedSprint] = useState(-1)
  const [username, setUsername] = useState('Oliva')
  const [userPart, setUserPart] = useState('프론트엔드')
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false)


  return (
    <PageWrapper>
      <SidebarPlaceholder>
      <SideBar
        brandIcon={brandIcon}
        brandTitle="CoordiPai"
        project={{
          projectName: 'KNU-AssignX',
          iteration: { week: '9', period: '3/11 ~ 3/22' },
          issues: 70,
          categories: [
            {
              categoryName: 'Frontend',
              people: [
                { image: brandIcon, userName: '이름', githubId: 'Github ID' },
                { image: brandIcon, userName: '이름', githubId: 'Github ID' }
              ]
            },
            {
              categoryName: 'Backend',
              people: [
                { image: brandIcon, userName: '이름', githubId: 'Github ID' }
              ]
            },
            {
              categoryName: 'AI',
              people: [
                { image: brandIcon, userName: '이름', githubId: 'Github ID' }
              ]
            }
          ]
        }}
        userInfo={{
          image: brandIcon,
          userName: '이름',
          githubId: 'Github ID'
        }}
        logout={() => alert('로그아웃')}
      />
      </SidebarPlaceholder>

      <FormWrapper>
        <Header text="변경 요청서" />
          <div style={{padding: '2rem'}}>
            <EditContentHeader
              title="변경 요청서 작성"
              subAction={{ label: '이슈 상세보기', onClick: () => setIsIssueModalOpen(true) }}
              
              buttonsData={[
                { value: "변경 반려", onClick: () => {} },
                { value: "변경 승인", onClick: () => {} }
              ]}
            />
            <LabeledRow>
              <Label>담당자 / 분야 </Label>
              <RowGroup2>
                <div style={{ width: '244px' }}>
                  <FormInput value={username} handleChange={setUsername} readOnly />
                </div>
                <span></span>
                <div style={{ width: '244px' }}>
                  <FormInput value={userPart} handleChange={setUserPart} readOnly />
                </div>
                
              </RowGroup2>
            </LabeledRow>
            <Divider />

            <LabeledRow>
              <Label>사유</Label>
              <div style={{ width: '512px' }}>
                <FormTextarea value="변경 사유 내용" />
              </div>
            </LabeledRow>
            <Divider />

            <LabeledRow>
              <Label>변경 기한</Label>
              <RowGroup>
                <div style={{ width: '244px' }}>
                  <FormInput value={currentSprint} handleChange={setCurrentSprint} readOnly />
                </div>
                <div style={{ padding: '0.275rem', alignContent: 'center'}}> 
                  <img src={arrowright} alt="arrow" width="12" height="12" />
                </div>
                <div style={{ width: '244px' }}>

                <FormDropdown
                  placeholder="스프린트를 선택하세요"
                  menus={sprintOptions}
                  selectedMenu={selectedSprint}
                  handleChange={setSelectedSprint}
                />
                </div>
              </RowGroup>
            </LabeledRow>
            <Divider />

            <LabeledRow>
              <Label>담당자 변경</Label>
              <RowGroup>
                <div style={{ width: '244px' }}>
                  <FormInput value="Oliva" readOnly />
                </div>
                <div style={{padding: '0.275rem', alignContent: 'center'}}> 
                  <img src={arrowright} alt="arrow" width="12" height="12" />
                </div>
                <div style={{ width: '244px' }}>
                  <FormDropdown
                    placeholder="변경할 사용자를 선택하세요"
                    menus={sprintOptions}
                    selectedMenu={selectedSprint}
                    handleChange={setSelectedSprint}
                  />
                </div>
                
              </RowGroup>
            </LabeledRow>
            <Divider />

            <LabeledRow>
              <Label>AI 피드백</Label>
              <TextareaWrapper>
                <FormTextarea value="이건 개선사항임" />
              </TextareaWrapper>
            </LabeledRow>


            <LabeledRow>
              <Label>AI 피드백 사유</Label>
              <TextareaWrapper>
                <FormTextarea value="너가 못한거잖아ㅋㅋㅋ" />
              </TextareaWrapper>
              <ButtonWrapper>
                <Button $isHighlighted style={{ height: '40px'}}>
                    피드백 재요청
                </Button>
              </ButtonWrapper>
            </LabeledRow>
          </div>
      </FormWrapper>
      {isIssueModalOpen && (
        <IssueDetailModal onClose={() => setIsIssueModalOpen(false)} />
      )}

    </PageWrapper>
  )
}
