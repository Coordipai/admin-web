import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import arrowright from '@assets/icons/arrow-right.svg'
import styled from 'styled-components'
import FormInput from '@components/FormInput'
import FormTextarea from '@components/FormTextarea'
import FormDropdown from '@components/FormDropdown'
import Header from '@components/Header'
import { EditContentHeader } from '@components/Edit/EditContentHeader'
import { ButtonBase, MainBox } from '@styles/globalStyle'
import IssueDetailModal from './IssueDetailModal'
import { useProjectStore } from '@store/useProjectStore'
import { useAccessTokenStore } from '@store/useUserStore'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BASE_URL


const FormWrapper = styled.div`
  max-width: 1120px;
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

const LabeledRow = styled.div`
  width: 100%;
  display: flex;
  gap: 2rem;
  padding: 2rem;
`

const TextareaWrapper = styled.div`
  width: 512px;
  display: flex;
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
  height: 100%;
  display: flex;
  align-self: flex-end;
  margin-left: 2rem;
`

const Button = styled(ButtonBase)`
  width: 100%;
  height: 100%;
  padding: 0.5rem 0.87rem;
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

export default function IssueRequestPage () {
  const { projectId, requestId } = useParams()
  const [issueData, setIssueData] = useState(null)
  const [aiFeedback, setAiFeedback] = useState('')
  const [aiFeedbackReason, setAiFeedbackReason] = useState('')
  const [assigneeOptions, setAssigneeOptions] = useState([])
  const iterationOptions = useProjectStore((state) => state.project?.iterationOptions || [])

  
useEffect(() => {
  const fetchIssueData = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/issue-reschedule/${projectId}`);
      const issues = res.data?.content?.data || [];

      const matched = issues.find(issue => issue.issue_number === Number(requestId));

      if (!matched) {
        alert('해당 요청을 찾을 수 없습니다.');
        return;
      }

      const oldAssignee = matched.old_assignees?.[0] || ''
      const newAssignee = matched.new_assignees?.[0] || ''

      const members = useProjectStore.getState().project?.members || []
      const userPart = members.find((m) => m.github_name === oldAssignee)?.role || ''

      const transformed = {
        oldAssignee,
        newAssignee,
        reason: matched.reason,
        currentSprint: matched.old_iteration,
        targetSprint: matched.new_iteration,
        userPart
      }

      setIssueData(transformed);
    } catch (error) {
      console.error('이슈 데이터 가져오기 실패:', error);
    }
  };

  fetchIssueData();
}, [projectId, requestId]);

  useEffect(() => {
    const fetchProjectMembers = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/project/${projectId}`)
        const members = res.data?.content?.data?.members || []

        const mappedOptions = members.map((member) => ({
          title: member.name || member.github_id // 혹은 github_name
        }))

        setAssigneeOptions(mappedOptions)
      } catch (error) {
        console.error('프로젝트 멤버 불러오기 실패:', error)
      }
    }

    fetchProjectMembers()
  }, [projectId])

  useEffect(() => {
    const fetchAiFeedback = async () => {
      try {
        // const response = await axios.get(`/api/issue/${requestId}/ai-feedback`)
        const mockFeedback = {
          feedback: '이건 개선사항임',
          reason: '너가 못한거잖아ㅋㅋㅋ'
        }

        setAiFeedback(mockFeedback.feedback)
        setAiFeedbackReason(mockFeedback.reason)
      } catch (error) {
        console.error('AI 피드백 불러오기 실패:', error)
      }
    }

    fetchAiFeedback()
  }, [requestId]) // Add requestId as a dependency

  const [selectedSprint, setSelectedSprint] = useState(-1)

  const [selectedAssignee, setSelectedAssignee] = useState(-1)

  useEffect(() => {
    if (issueData) {
      const index = assigneeOptions.findIndex(opt => opt.title === issueData.newAssignee)
      setSelectedAssignee(index)
    }
  }, [issueData])

  useEffect(() => {
  if (issueData) {
      const sprintIndex = iterationOptions.findIndex(
        (option) => option.title === issueData.targetSprint
      )
      setSelectedSprint(sprintIndex)
    }
  }, [issueData, iterationOptions])


  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false)

  const accessToken = useAccessTokenStore((state) => state.accessToken);

  const handleDecision = async (isApproved) => {
    const type = isApproved ? 'Approve' : 'Disapprove'
    const confirmMessage = isApproved ? '정말로 변경을 승인하시겠습니까?' : '정말로 반려하시겠습니까?'

    if (!window.confirm(confirmMessage)) return

    try {
      const res = await axios.delete(`${BASE_URL}/issue-reschedule/${requestId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { type },
      })
      console.log(`${type} 완료:`, res.data)
      alert(`${isApproved ? '승인' : '반려'} 처리되었습니다.`)
    } catch (error) {
      console.error(`${type} 실패:`, error);
      alert(`${isApproved ? '승인' : '반려'} 처리에 실패했습니다.`)
    }
  }



  const handleRequestFeedbackAgain = () => {
    console.log('AI 피드백 재요청 처리')
    // TODO: axios.post('/api/issue/feedback-request', { issueId })
  }

  return (
    <MainBox>
      <Header text='변경 요청서' />
      <div style={{ padding: '2rem' }}>
        <EditContentHeader
          title='변경 요청서 작성'
          subAction={{ label: '이슈 상세보기', onClick: () => setIsIssueModalOpen(true) }}
          buttonsData={[
            { value: '변경 반려', onClick: () => handleDecision(false) },
            { value: '변경 승인', onClick: () => handleDecision(true) }
          ]}/>
        <LabeledRow>
          <Label>담당자 / 분야 </Label>
          <RowGroup2>
            <div style={{ width: '244px' }}>
              <FormInput value={issueData?.oldAssignee || ''} readOnly />
            </div>
            <span />
            <div style={{ width: '244px' }}>
              <FormInput value={issueData?.userPart || ''} readOnly />
            </div>
          </RowGroup2>
        </LabeledRow>
        <Divider />

        <LabeledRow>
          <Label>사유</Label>
          <div style={{ width: '512px' }}>
            <FormTextarea value={issueData?.reason || ''} readOnly />
          </div>
        </LabeledRow>
        <Divider />

        <LabeledRow>
          <Label>변경 기한</Label>
          <RowGroup>
            <div style={{ width: '244px' }}>
              <FormInput value={issueData?.currentSprint || ''} readOnly />
            </div>
            <div style={{ padding: '0.275rem', alignContent: 'center' }}>
              <img src={arrowright} alt='arrow' width='12' height='12' />
            </div>
            <div style={{ width: '244px' }}>
              <FormDropdown
                placeholder="스프린트를 선택하세요"
                menus={iterationOptions}
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
              <FormInput value={issueData?.oldAssignee || ''} readOnly />
            </div>
            <div style={{ padding: '0.275rem', alignContent: 'center' }}>
              <img src={arrowright} alt='arrow' width='12' height='12' />
            </div>
            <div style={{ width: '244px' }}>
              <FormDropdown
                placeholder="변경할 사용자를 선택하세요"
                menus={assigneeOptions}
                selectedMenu={selectedAssignee}
                handleChange={setSelectedAssignee}
              />

            </div>
          </RowGroup>
        </LabeledRow>
        <Divider />

        <LabeledRow>
          <Label>AI 피드백</Label>
          <TextareaWrapper>
            <FormTextarea value={aiFeedback} readOnly />
          </TextareaWrapper>
        </LabeledRow>

        <LabeledRow>
          <Label>AI 피드백 사유</Label>
          <TextareaWrapper>
            <FormTextarea value={aiFeedbackReason} readOnly />
          </TextareaWrapper>
          <ButtonWrapper>
            <Button $isHighlighted onClick={handleRequestFeedbackAgain}>
              피드백 재요청
            </Button>
          </ButtonWrapper>
        </LabeledRow>
      </div>
      {isIssueModalOpen && (
        <IssueDetailModal onClose={() => setIsIssueModalOpen(false)} />
      )}
    </MainBox>
  )
}
