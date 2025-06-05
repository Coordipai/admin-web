import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import arrowright from '@assets/icons/arrow-right.svg'
import styled from 'styled-components'
import FormInput from '@components/FormInput'
import FormTextarea from '@components/FormTextarea'
import DropDown from '@components/Edit/DropDown'
import Header from '@components/Header'
import { EditContentHeader } from '@components/Edit/EditContentHeader'
import { ButtonBase, MainBox } from '@styles/globalStyle'
import IssueDetailModal from './IssueDetailModal'
import { useProjectStore } from '@store/useProjectStore'
import api from '@hooks/useAxios'
import toastMsg from '@utils/toastMsg'
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
  const rawIterationOptions = useProjectStore((state) => state.project?.iterationOptions || [])

  const iterationOptions = rawIterationOptions.map((opt) => {
    const match = opt.title.match(/\d+/)  // 숫자만 추출
    const numericValue = match ? match[0] : ''  // 없으면 빈 문자열 fallback

    return {
      value: numericValue,                    // ex: "1"
      label: opt.title                        // ex: "Iteration 1"
    }
  })



  
useEffect(() => {
  const fetchIssueData = async () => {
    try {
      const res = await api.get(`/issue-reschedule/${projectId}`)
      console.log('✅ API 전체 응답:', res)
      const issues = res || []

        const matched = issues.find(issue => issue.issue_number === Number(requestId))
        console.log('Matched issue:', matched)

        if (!matched) {
          toastMsg('해당 요청을 찾을 수 없습니다.', 'error')
          return
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
        targetSprint: String(matched.new_iteration),
        userPart
      }
      

        setIssueData(transformed)
      } catch (error) {
        console.error('이슈 데이터 가져오기 실패:', error)
      }
    }

    fetchIssueData()
  }, [projectId, requestId])

  useEffect(() => {
    const fetchProjectMembers = async () => {
      try {
        const res = await api.get(`/project/${projectId}`)
        const members = res.members || []

        const mappedOptions = members.map((member) => ({
          value: member.github_name,
          label: member.name || member.github_id,
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
      const res = await api.get(`/issue-reschedule/${projectId}`)
      const issues = res
      const matched = issues.find(issue => issue.issue_number === Number(requestId))
      console.log('number(requstId)', Number(requestId))
      console.log('issue: ',issues)
      console.log('matched: ', matched)
      if (!matched) {
        toastMsg('해당 요청을 찾을 수 없습니다.', 'error')
        return
      }

      const response = await api.post('/agent/feedback', {
        project_id: Number(projectId),
        issue_rescheduling_id: matched.id, // ✅ 정확한 id 사용
      })

      console.log('여기까지는 오는거냐?')
      console.log('AI 피드백 전체 응답:', response)
      // 👇 aiFeedback: 담당자 + 스프린트
      const suggested = response?.suggested_assignees
      const suggestedIter = response?.suggested_iteration
      setAiFeedback(`Suggested assignee: ${suggested ?? '담당자 없음'} \nSuggested Iteration: Iteration ${suggestedIter ?? '?'}`)

      // 👇 aiFeedbackReason: 이유 설명 두 줄 합치기
      const reason1 = response?.reason_for_assignees ?? ''
      const reason2 = response?.reason_for_iteration ?? ''
      setAiFeedbackReason(`${reason1}\n${reason2}`)
    } catch (error) {
      console.error('AI 피드백 요청 실패:', error.response?.data || error.message)
      toastMsg('AI 피드백 요청 실패', 'error')
    }
  }

  fetchAiFeedback()
}, [projectId, requestId])




  const [selectedSprint, setSelectedSprint] = useState(-1)

  const [selectedAssignee, setSelectedAssignee] = useState(-1)

  useEffect(() => {
    if (issueData && assigneeOptions.length > 0) {
      const index = assigneeOptions.findIndex(opt => opt.value === issueData.newAssignee)
      setSelectedAssignee(index)
    }
  }, [issueData, assigneeOptions])

  useEffect(() => {
    if (issueData && iterationOptions.length > 0) {
      const sprintIndex = iterationOptions.findIndex(
        (option) => option.value === issueData.targetSprint
      )
      setSelectedSprint(sprintIndex)
    }
  }, [issueData, iterationOptions])





  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false)

  const handleDecision = async (isApproved) => {
    const type = isApproved ? 'Approve' : 'Disapprove'
    const confirmMessage = isApproved ? '정말로 변경을 승인하시겠습니까?' : '정말로 반려하시겠습니까?'

    if (!window.confirm(confirmMessage)) return

    try {
      const res = await api.delete(`/issue-reschedule/${requestId}`, {
        params: { type }
      })

      toastMsg(`${isApproved ? '승인' : '반려'} 처리되었습니다.`, 'success')
    } catch (error) {
      console.error(`${type} 실패:`, error)
      toastMsg(`${isApproved ? '승인' : '반려'} 처리에 실패했습니다.`, 'error')
    }
  }


const handleRequestFeedbackAgain = async () => {
  try {
    const response = await api.post('/agent/feedback', {
      project_id: Number(projectId),
      issue_rescheduling_id: Number(requestId),
    })

    // 👇 aiFeedback: 담당자 + 스프린트
    const suggested = response?.suggested_assignees
    const suggestedIter = response?.suggested_iteration
    setAiFeedback(`Suggested assignee: ${suggested ?? '담당자 없음'} \nSuggested Iteration: Iteration ${suggestedIter ?? '?'}`)

    // 👇 aiFeedbackReason: 이유 설명 두 줄 합치기
    const reason1 = response?.reason_for_assignees ?? ''
    const reason2 = response?.reason_for_iteration ?? ''
    setAiFeedbackReason(`${reason1}\n${reason2}`)

    toastMsg('AI 피드백이 갱신되었습니다.', 'success')
  } catch (error) {
    console.error('AI 피드백 재요청 실패:', error)
    toastMsg('AI 피드백 재요청 실패', 'error')
  }
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
          ]}
        />
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
              <FormInput value={`Iteration ${issueData?.currentSprint || ''}`} readOnly />
            </div>
            <div style={{ padding: '0.275rem', alignContent: 'center' }}>
              <img src={arrowright} alt='arrow' width='12' height='12' />
            </div>
            <div style={{ width: '244px' }}>
              <DropDown
                options={iterationOptions}
                value={issueData?.targetSprint || ''}
                onChange={(val) =>
                  setIssueData(prev => ({ ...prev, targetSprint: val }))
                }
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
              <DropDown
                options={assigneeOptions}
                value={issueData?.newAssignee || ''}
                onChange={(val) =>
                  setIssueData(prev => ({ ...prev, newAssignee: val }))
                }
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
