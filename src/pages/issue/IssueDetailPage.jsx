import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useParams } from 'react-router-dom'
import Badge from '@components/Edit/Badge'
import InputField from '@components/Edit/InputField'
import Typography from '@components/Edit/Typography'
import Header from '@components/Header'
import { DropDownItem, DropDownMenu } from '@components/Edit/DropDown'
import Modal from '@components/ConfirmModal'
import styled from 'styled-components'
import {
  MainBox,
  ContainerBox,
  styledIcon
} from '@styles/globalStyle'
import FormTextarea from '@components/FormTextarea'
import { Plus, X } from '@untitled-ui/icons-react'

import { createIssue, updateIssue, deleteIssue, fetchIssueDetail } from '@api/issueAPI'

const PlusIcon = styledIcon({ icon: Plus, strokeColor: '9E77ED', style: { width: '1.5rem', height: '1.5rem' } })
const CancelIcon = styledIcon({ icon: X, strokeColor: '9E77ED', style: { width: '1.5rem', height: '1.5rem' } })

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.gap.lg};
`

const IterationBox = styled.div`
  display: flex;
  flex-direction: column;
`

const LabelContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.gap.sm};
`

const LabelBadge = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.5rem;
  gap: 0.25rem;
  background-color: ${({ theme }) => theme.colors.brand50};
  border-radius: 1rem;
  cursor: pointer;
  ${({ theme }) => theme.texts.textSM}
  color: ${({ theme }) => theme.colors.brand700};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray200};
  }
`

const IssueDetailPage = () => {
  const { projectId, issueId } = useParams()

  // project 정보
  const [priorityOptions] = useState([
    { value: 'M', label: '[M] Must Have' },
    { value: 'S', label: '[S] Should Have' },
    { value: 'C', label: '[C] Could Have' },
    { value: 'W', label: '[W] Won\'t Have' }
  ])
  const [iterationOptions, setIterationOptions] = useState([
    { title: 'Iteration 1', period: '2023-10-01 ~ 2023-10-15' },
    { title: 'Iteration 2', period: '2023-10-16 ~ 2023-10-31' },
    { title: 'Iteration 3', period: '2023-11-01 ~ 2023-11-15' }
  ])
  const [labelOptions] = useState(['기능', '설정', '테스트', '배포', '버그 수정', '문서', '리팩토링', '질문', '정리'])
  const [assigneeOptions, setAssigneeOptions] = useState([])

  useEffect(() => {
    if (issueId !== 'new') {
      const response = fetchIssueDetail(projectId, issueId)
      response.then((res) => {
        // projectId에서 가져옴
        // setIterationOptions(res.data.iteration)
        // setAssigneeOptions(res.data.assignees)

        console.log('res.data:', res.data)
        setIssueTitle(res.data.title)
        setIssueContent(res.data.body)
        setPriority(res.data.priority)
        setIteration(res.data.iteration)
        setSelectedLabels(res.data.labels)
        setAssignees(res.data.assignees)
      }
      ).catch((error) => {
        console.error('Error fetching issue detail:', error) 
      })
    }
  }, [projectId, issueId])

  // issue 정보
  const [issueTitle, setIssueTitle] = useState('')
  const [issueContent, setIssueContent] = useState('')
  const [priority, setPriority] = useState(priorityOptions[0].value)
  const [iteration, setIteration] = useState(iterationOptions[0])
  const [selectedLabels, setSelectedLabels] = useState([])
  const [assignees, setAssignees] = useState([])

  // UI
  const [badgeDropdownOpen, setBadgeDropdownOpen] = useState(false)
  const [iterationDropdownOpen, setIterationDropdownOpen] = useState(false)
  const [labelDropdownOpen, setLabelDropdownOpen] = useState(false)
  const [assigneeDropdownOpen, setAssigneeDropdownOpen] = useState(false)

  const badgeRef = useRef()
  const badgeMenuRef = useRef()
  const iterationRef = useRef()
  const iterationMenuRef = useRef()
  const labelRef = useRef()
  const labelMenuRef = useRef()
  const assigneeRef = useRef()
  const assigneeMenuRef = useRef()

  const [badgeMenuStyle, setBadgeMenuStyle] = useState({})
  const [iterationMenuStyle, setIterationMenuStyle] = useState({})
  const [labelMenuStyle, setLabelMenuStyle] = useState({})
  const [assigneeMenuStyle, setAssigneeMenuStyle] = useState({})

  const [showModal, setShowModal] = useState(false)
  const [modalText, setModalText] = useState('Modal Text')
  const [isEdit, setIsEdit] = useState(false)

  useEffect(() => {
    if (badgeDropdownOpen && badgeMenuRef.current) {
      const rect = badgeRef.current.getBoundingClientRect()
      setBadgeMenuStyle({
        position: 'absolute',
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: 'auto',
        zIndex: 9999
      })
    }
  }, [badgeDropdownOpen])

  useEffect(() => {
    if (iterationDropdownOpen && iterationMenuRef.current) {
      const rect = iterationRef.current.getBoundingClientRect()
      setIterationMenuStyle({
        position: 'absolute',
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: 'auto',
        zIndex: 9999
      })
    }
  }, [iterationDropdownOpen])

  useEffect(() => {
    if (labelDropdownOpen && labelMenuRef.current) {
      const rect = labelRef.current.getBoundingClientRect()
      setLabelMenuStyle({
        position: 'absolute',
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: 'auto',
        zIndex: 9999
      })
    }
  }, [labelDropdownOpen])

  useEffect(() => {
    if (assigneeDropdownOpen && assigneeRef.current) {
      const rect = assigneeRef.current.getBoundingClientRect()
      setAssigneeMenuStyle({
        position: 'absolute',
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: 'auto',
        zIndex: 9999
      })
    }
  }, [assigneeDropdownOpen])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (badgeDropdownOpen && !badgeRef.current?.contains(e.target) && !badgeMenuRef.current?.contains(e.target)) setBadgeDropdownOpen(false)
      if (iterationDropdownOpen && !iterationRef.current?.contains(e.target) && !iterationMenuRef.current?.contains(e.target)) setIterationDropdownOpen(false)
      if (assigneeDropdownOpen && !assigneeRef.current?.contains(e.target) && !assigneeMenuRef.current?.contains(e.target)) setAssigneeDropdownOpen(false)
      if (labelDropdownOpen && !labelRef.current?.contains(e.target) && !labelMenuRef.current?.contains(e.target)) setLabelDropdownOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [badgeDropdownOpen, iterationDropdownOpen, assigneeDropdownOpen, labelDropdownOpen])

  const renderAssigneeText = () => {
    if (assignees.length === 0) return '배정하기'
    const ordered = assigneeOptions.filter(name => assignees.includes(name))
    return ordered.join(', ')
  }

  const handleLabelClick = (label) => {
    setSelectedLabels(prev =>
      prev.includes(label)
        ? prev.filter(l => l !== label)
        : [...prev, label]
    )
    setLabelDropdownOpen(false)
  }

  return (
    <MainBox>
      <Header
        text={issueId === 'new' ? '이슈 추가' : '이슈 수정'}
        buttonsData={
            issueId === 'new'
              ? [
                  { 
                    value: '저장',
                    onClick: () => {  // issue 추가
                      setModalText('저장하시겠습니까?')
                      setShowModal(true)
                    }, 
                    isHighlighted: true 
                  },
                  { value: '취소', onClick: () => window.history.back() }
                ]
              : [
                  { 
                    value: '저장', 
                    onClick: () => { // issue 수정
                      setModalText('저장하시겠습니까?')
                      setShowModal(true)
                      setIsEdit(true)
                    }, 
                    isHighlighted: true 
                  },
                  { 
                    value: '삭제', 
                    onClick: () => {  // issue 삭제
                      setModalText('삭제하시겠습니까?')
                      setShowModal(true)
                      setIsEdit(false)
                    }, 
                    isHighlighted: true 
                  },
                  { value: '취소', onClick: () => window.history.back() }
                ]
          }
      />
      <ContainerBox>
        <InputField label='이슈 타이틀' placeholder='이슈 제목을 입력해주세요.' value={issueTitle} onChange={(e) => setIssueTitle(e.target.value)} />
        <FormTextarea label='이슈 내용' placeholder='이슈 내용을 입력해주세요.' value={issueContent} onChange={setIssueContent} />
        <Row>
          <Typography value='Priority' variant='textSM' weight='medium' color='gray900' />
          <div ref={badgeRef} onClick={() => setBadgeDropdownOpen(prev => !prev)} style={{ cursor: 'pointer' }}>
            <Badge priority={priority} />
          </div>
          {badgeDropdownOpen && createPortal(
            <DropDownMenu ref={badgeMenuRef} style={badgeMenuStyle}>
              {priorityOptions.map((opt) => {
                const isSelected = priority === opt.value
                return (
                  <DropDownItem
                    key={opt.value}
                    selected={isSelected}
                    onClick={() => {
                      setPriority(opt.value)
                      setBadgeDropdownOpen(false)
                    }}
                    role='option'
                  >
                    {opt.label}
                  </DropDownItem>
                )
              })}
            </DropDownMenu>,
            document.body
          )}
        </Row>
        <Row>
          <Typography value='Iteration' variant='textSM' weight='medium' color='gray900' />
          <div ref={iterationRef} onClick={() => setIterationDropdownOpen(prev => !prev)} style={{ cursor: 'pointer' }}>
            <IterationBox>
              <Typography value={iteration.title} variant='textSM' weight='regular' color='gray900' />
              <Typography value={iteration.period} variant='textXS' weight='regular' color='gray500' />
            </IterationBox>
          </div>
          {iterationDropdownOpen && createPortal(
            <DropDownMenu ref={iterationMenuRef} style={iterationMenuStyle}>
              {iterationOptions.map((opt, index) => {
                const isSelected = iteration.title === opt.title
                return (
                  <DropDownItem
                    key={index}
                    selected={isSelected}
                    onClick={() => {
                      setIteration(opt)
                      setIterationDropdownOpen(false)
                    }}
                    role='option'
                  >
                    {opt.title} / {opt.period}
                  </DropDownItem>
                )
              })}
            </DropDownMenu>,
            document.body
          )}
        </Row>
        <Row>
          <Typography value='Label' variant='textSM' weight='medium' color='gray900' />
          <LabelContainer>
            {selectedLabels.map((label) => (
              <LabelBadge key={label} onClick={() => handleLabelClick(label)}>
                <Typography value={label} variant='textXS' weight='medium' color='brand700' />
                <CancelIcon />
              </LabelBadge>
            ))}
            <LabelBadge ref={labelRef} onClick={() => setLabelDropdownOpen(prev => !prev)}>
              <PlusIcon />
            </LabelBadge>
            {labelDropdownOpen && createPortal(
              <DropDownMenu ref={labelMenuRef} style={labelMenuStyle}>
                {labelOptions.map((label) => {
                  const isSelected = selectedLabels.includes(label)
                  return (
                    <DropDownItem
                      key={label}
                      selected={isSelected}
                      onClick={() => handleLabelClick(label)}
                      role='option'
                    >
                      {label}
                    </DropDownItem>
                  )
                })}
              </DropDownMenu>,
              document.body
            )}
          </LabelContainer>
        </Row>
        <Row>
          <Typography value='Assignee' variant='textSM' weight='medium' color='gray900' />
          <div ref={assigneeRef} onClick={() => setAssigneeDropdownOpen(prev => !prev)} style={{ cursor: 'pointer' }}>
            <Typography
              value={renderAssigneeText()}
              variant='textSM'
              weight='regular'
              color={assignees.length > 0 ? 'gray900' : 'gray400'}
            />
          </div>
          {assigneeDropdownOpen && createPortal(
            <DropDownMenu ref={assigneeMenuRef} style={assigneeMenuStyle}>
              {assigneeOptions.map((name, index) => {
                const isSelected = assignees.includes(name)
                return (
                  <DropDownItem
                    key={index}
                    selected={isSelected}
                    onClick={() => {
                      if (isSelected) {
                        setAssignees(prev => prev.filter(a => a !== name))
                      } else {
                        setAssignees(prev => [...prev, name])
                      }
                    }}
                    role='option'
                  >
                    {name}
                  </DropDownItem>
                )
              })}
            </DropDownMenu>,
            document.body
          )}
        </Row>
      </ContainerBox>
      {showModal && createPortal(
        <Modal
          text={modalText}
          setShowModal={setShowModal}
          handleConfirm={() => {
            if (issueId === 'new') {
              const issueData = {
                project_id: projectId,
                title: issueTitle,
                body: issueContent,
                assignees: assignees,
                priority: priority,
                iteration: iteration,
                labels: selectedLabels,
              }
              createIssue(issueData)
            } else {
              if (isEdit) {
                const issueData = {
                  project_id: projectId,
                  issue_number: issueId,
                  title: issueTitle,
                  body: issueContent,
                  assignees: assignees,
                  priority: priority,
                  iteration: iteration,
                  labels: selectedLabels,
                }
                updateIssue(issueData)
              } else {
                const issueData = {
                  project_id: projectId,
                  issue_number: issueId
                }
                deleteIssue(issueData)
              }
            }
            // window.history.back()
          }}
        />,
        document.body
      )}
    </MainBox>
  )
}

export default IssueDetailPage
