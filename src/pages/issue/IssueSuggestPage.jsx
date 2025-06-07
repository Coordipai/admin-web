import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components'
import { useParams, useNavigate, useLocation } from 'react-router-dom'

import Badge from '@components/Edit/Badge'
import InputField from '@components/Edit/InputField'
import Typography from '@components/Edit/Typography'
import Header from '@components/Header'
import { DropDownItem, DropDownMenu } from '@components/Edit/DropDown'
import FormTextarea from '@components/FormTextarea'
import {
  MainBox,
  styledIcon,
  ButtonBase
} from '@styles/globalStyle'
import { Plus, X } from '@untitled-ui/icons-react'
import loadingSvg from '@assets/icons/loading-indicator.svg'
import toastMsg from '@utils/toastMsg'

import { useProjectStore } from '@store/useProjectStore'
import { useAccessTokenStore } from '@store/useUserStore'
import { postAssignIssues } from '@api/agentApi'
import { createIssue } from '@api/issueApi'

const PlusIcon = styledIcon({ icon: Plus, strokeColor: '9E77ED', style: { width: '1.5rem', height: '1.5rem' } })
const CancelIcon = styledIcon({ icon: X, strokeColor: '9E77ED', style: { width: '1.5rem', height: '1.5rem' } })

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
`

const SplitContainer = styled.div`
  display: flex;
  gap: 2rem;
  width: 100%;
  height: calc(100vh - 80px);
  overflow: hidden;
`

const LeftContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: 1rem;
`

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 2rem;
  gap: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
`

const Footer = styled.div`
  padding: 1.5rem 2rem;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 0 0 1rem 1rem;
`

const RightContainer = styled.div`
  width: 360px;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: 1rem;
  padding: 2rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
`

const IssueBox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  background-color: ${({ theme, $checked }) =>
    $checked ? theme.colors.brand200 : theme.colors.white};
  transition: background-color 0.2s ease;
  position: relative;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray100};
  }
`

const CheckIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.green600};
  font-size: 1.25rem;
`

const IssueList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: auto;
  flex: 1;
  padding: 0.5rem 0.5rem 2rem 0;
  margin-top: 1rem;
  margin-bottom: -1rem;
  width: 100%;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.gray100};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray300};
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.gray400};
  }
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

const IssueSuggestPage = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [isFetching, setIsFetching] = useState(false)
  const { project } = useProjectStore()
  const [step, setStep] = useState(() => {
    const hash = location.hash.replace('#', '')
    return hash === 'confirm' ? 'confirm' : 'assign'
  })

  useEffect(() => {
    const hash = location.hash.replace('#', '')
    setStep(hash === 'confirm' ? 'confirm' : 'assign')
  }, [location.hash])

  // project 정보
  const [priorityOptions] = useState([
    { value: 'M', label: '[M] Must Have' },
    { value: 'S', label: '[S] Should Have' },
    { value: 'C', label: '[C] Could Have' },
    { value: 'W', label: '[W] Won\'t Have' }
  ])
  const [iterationOptions, setIterationOptions] = useState([{ title: 'iteration 선택', period: 'iteration을 선택해주세요.' }])
  const [labelOptions] = useState(['기능', '설정', '테스트', '배포', '버그 수정', '문서', '리팩토링', '질문', '정리'])
  const [assigneeOptions, setAssigneeOptions] = useState([])

  // issue 정보
  const [issueTitle, setIssueTitle] = useState('')
  const [issueContent, setIssueContent] = useState('')
  const [priority, setPriority] = useState(priorityOptions[0].value)
  const [sprintIndex, setSprintIndex] = useState(null)
  const [selectedLabels, setSelectedLabels] = useState([])
  const [assignees, setAssignees] = useState([])
  const [isCompleted, setIsCompleted] = useState(false)

  // issue 목록
  const [selectedIssue, setSelectedIssue] = useState(null)
  const isIssueSelected = !!selectedIssue
  const [issueList, setIssueList] = useState([])
  const isAllCompleted = issueList.every(issue => issue.isCompleted)

  const abortControllerRef = useRef(null)

  const fetchProject = useCallback(async () => {
    try {
      setIterationOptions(project.iterationOptions)
      setAssigneeOptions(project.assigneeOptions)
    } catch (error) {
      console.error('Failed to get project data:', error)

      // 기본값 설정
      setIterationOptions([{ title: '선택해주세요', period: '' }])
      setAssigneeOptions([])
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchSuggestedIssues = useCallback(async () => {
    toastMsg('프로젝트 정보를 바탕으로 자동으로 생성합니다...', 'success')
    setIsFetching(true)
    const token = useAccessTokenStore.getState().accessToken
    if (!token) {
      console.error('Access token is not available')
      return
    }

    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/agent/generate_issues/${projectId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        },
        signal: controller.signal
      })

      const reader = response.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value, { stream: true })
        buffer += chunk

        try {
          // Try to parse complete JSON objects from the buffer
          const jsonObjects = buffer.split('}{').map((obj, index, array) => {
            if (index === 0) return obj + '}'
            if (index === array.length - 1) return '{' + obj
            return '{' + obj + '}'
          })

          for (const jsonStr of jsonObjects) {
            try {
              const parsed = JSON.parse(jsonStr)
              const processed = appendContentInline(parsed)
              setIssueList(prev => [...prev, processed])
            } catch {
              continue
            }
          }
          buffer = '' // Clear buffer after successful parsing
        } catch {
          continue
        }
        toastMsg('자동 이슈 생성중...', 'success')
      }
      toastMsg('자동 이슈 생성 완료', 'success')
    } catch (error) {
      if (error.name === 'AbortError') {
        toastMsg('자동 이슈 생성이 취소되었습니다.', 'success')
        navigate(-1)
        return
      }
      console.error('Error fetching issues:', error)
      toastMsg('이슈 생성 중 오류가 발생했습니다.', 'error')
      setIssueList([])
    } finally {
      setIsFetching(false)
    }

    function appendContentInline (issue) {
      if (!issue.body || !Array.isArray(issue.body)) {
        return { ...issue, content: '' }
      }

      const findValueById = (id) => {
        const item = issue.body.find((field) => field.id === id)
        return item?.attributes?.value || ''
      }

      const description = findValueById('description')
      const todos = findValueById('todos')
      const assigneeInfo = findValueById('wish-assignee-info')

      const content = `📌 기능 설명\n${description}\n\n✅ 구현 단계 (TODO)\n${todos}\n\n👤 희망 담당자 정보\n${assigneeInfo}`
      return { ...issue, content }
    }
  }, [projectId])

  useEffect(() => {
    if (issueList.length > 0) return
    const init = async () => {
      setIsFetching(true)
      try {
        await fetchProject()
        await fetchSuggestedIssues()
      } finally {
        setIsFetching(false)
      }
    }
    init()
  }, [projectId]) // eslint-disable-line react-hooks/exhaustive-deps

  // render 부분
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
    if (!assignees || assignees.length === 0) return '배정하기'
    const ordered = assigneeOptions.filter(name => assignees.includes(name))
    return ordered.join(', ')
  }

  const handleLabelClick = (label) => {
    const updatedLabels = selectedLabels.includes(label)
      ? selectedLabels.filter((l) => l !== label)
      : [...selectedLabels, label]
    setSelectedLabels(updatedLabels)
    updateSelectedIssueField('labels', updatedLabels)
    setLabelDropdownOpen(false)
  }

  const handleIssueSelect = (issue) => {
    setSelectedIssue(issue)
    setIssueTitle(issue.title)
    setIssueContent(issue.content)
    setPriority(issue.priority || 'M')
    setSprintIndex(issue.sprint ? Number(issue.sprint) - 1 : null)
    setSelectedLabels(issue.labels || [])
    setAssignees(issue.assignees || [])
    setIsCompleted(issue.isCompleted || false)
  }

  const handleStateToggle = () => {
    if (step === 'assign') {
      if (!assignees || assignees.length === 0) {
        toastMsg('담당자를 먼저 선택해주세요.', 'warning')
        return
      }
    }

    setIsCompleted(prev => !prev)
    if (selectedIssue) {
      setIssueList(prev =>
        prev.map(issue =>
          issue.name === selectedIssue.name
            ? { ...issue, isCompleted: !isCompleted }
            : issue
        )
      )
    }
  }

  const updateSelectedIssueField = (key, value) => {
    if (!selectedIssue) return
    setIssueList(prev =>
      prev.map(issue =>
        issue.name === selectedIssue.name ? { ...issue, [key]: value } : issue
      )
    )
  }

  return (
    <MainBox>
      <Header
        text={step === 'confirm'
          ? '이슈 자동 생성 - 내용 확인'
          : '이슈 자동 생성 - 팀원 배정'}
        buttonsData={[
          step === 'confirm'
            ? {
                value: '다음',
                onClick: async () => {
                  if (issueList.length <= 0 || isFetching === true) {
                    toastMsg('이슈가 자동으로 생성될때까지 기다려주세요.', 'warning')
                    return
                  }
                  if (!isAllCompleted) {
                    toastMsg('모든 이슈를 확정해주세요.', 'warning')
                    return
                  }

                  try {
                    const response = await postAssignIssues(projectId, issueList)

                    const updatedIssues = issueList.map(issue => {
                      const matched = response.issues.find(res => res.issue === issue.title)
                      const assigneesArray = matched?.assignee
                        ? matched.assignee.split(',').map(name => name.trim())
                        : []

                      return {
                        ...issue,
                        assignees: assigneesArray,
                        isCompleted: false
                      }
                    })
                    setIssueList(updatedIssues)
                    const firstUpdatedIssue = updatedIssues.find(
                      issue => issue.title === selectedIssue?.title
                    )
                    setSelectedIssue(firstUpdatedIssue ?? null)
                    setAssignees(firstUpdatedIssue?.assignees ?? [])
                    setIsCompleted(false)
                    navigate(`${location.pathname}#assign`)
                  } catch (error) {
                    console.error('이슈 할당 실패:', error)
                  }
                },
                isHighlighted: true
              }
            : {
                value: '완료',
                onClick: async () => {
                  if (!isAllCompleted) {
                    toastMsg('모든 이슈를 확정해주세요.', 'warning')
                    return
                  }
                  try {
                    for (const issue of issueList) {
                      const filteredAssignees = (issue.assignees || []).filter(name =>
                        assigneeOptions.includes(name)
                      )

                      const issueData = {
                        project_id: Number(projectId),
                        title: issue.title,
                        body: issue.content,
                        assignees: filteredAssignees,
                        priority: issue.priority,
                        iteration: Number(issue.sprint),
                        labels: issue.labels
                      }
                      await createIssue(issueData)
                    }

                    toastMsg('모든 이슈가 성공적으로 생성되었습니다!', 'success')
                    navigate(`/project/${projectId}`)
                  } catch (err) {
                    console.error('이슈 생성 중 오류 발생:', err)
                  }
                },
                isHighlighted: true
              },
          step === 'confirm'
            ? { 
              value: '취소', 
              onClick: () => {
                if (abortControllerRef.current) {
                  abortControllerRef.current.abort()
                  abortControllerRef.current = null
                }
                setIsFetching(false)
                setIssueList([])
              }}
            : { value: '뒤로', onClick: () => window.history.back() }
        ]}
      />
      <SplitContainer>
        <LeftContainer>
          <ContentWrapper>
            <InputField
              disabled={!isIssueSelected}
              label='이슈 타이틀'
              placeholder='이슈를 먼저 선택해주세요.'
              value={issueTitle}
              onChange={(e) => {
                const newTitle = e.target.value
                setIssueTitle(newTitle)
                updateSelectedIssueField('title', newTitle)
              }}
            />
            <FormTextarea
              disabled={!isIssueSelected}
              label='이슈 내용'
              placeholder='이슈를 먼저 선택해주세요.'
              value={issueContent}
              onChange={(text) => {
                setIssueContent(text)
                updateSelectedIssueField('content', text)
              }}
            />
            <Row>
              <Typography value='Priority' variant='textSM' weight='medium' color='gray900' />
              <div
                ref={badgeRef}
                onClick={() => {
                  if (!isIssueSelected) return
                  setBadgeDropdownOpen(prev => !prev)
                }}
                style={{
                  cursor: isIssueSelected ? 'pointer' : 'not-allowed',
                  opacity: isIssueSelected ? 1 : 0.5
                }}
              >
                <Badge priority={priority} />
              </div>
              {badgeDropdownOpen && isIssueSelected && createPortal(
                <DropDownMenu ref={badgeMenuRef} style={badgeMenuStyle}>
                  {priorityOptions.map((opt) => {
                    const isSelected = priority === opt.value
                    return (
                      <DropDownItem
                        key={opt.value}
                        selected={isSelected}
                        onClick={() => {
                          setPriority(opt.value)
                          updateSelectedIssueField('priority', opt.value)
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
              {sprintIndex !== null && (
                <>
                  <div
                    ref={iterationRef}
                    onClick={() => {
                      if (!isIssueSelected) return
                      setIterationDropdownOpen(prev => !prev)
                    }}
                    style={{
                      cursor: isIssueSelected ? 'pointer' : 'not-allowed',
                      opacity: isIssueSelected ? 1 : 0.5
                    }}
                  >
                    <IterationBox>
                      <IterationBox>
                        <Typography
                          value={
                              iterationOptions[sprintIndex]
                                ? iterationOptions[sprintIndex].title
                                : 'Iteration을 선택해주세요'
                            }
                          variant='textSM'
                          weight='regular'
                          color={iterationOptions[sprintIndex] ? 'gray900' : 'gray400'}
                        />
                        <Typography
                          value={
                              iterationOptions[sprintIndex]
                                ? iterationOptions[sprintIndex].period
                                : ''
                            }
                          variant='textXS'
                          weight='regular'
                          color='gray500'
                        />
                      </IterationBox>
                    </IterationBox>
                  </div>
                  {iterationDropdownOpen && isIssueSelected && createPortal(
                    <DropDownMenu ref={iterationMenuRef} style={iterationMenuStyle}>
                      {iterationOptions.map((opt, index) => {
                        const isSelected = sprintIndex === index
                        return (
                          <DropDownItem
                            key={index}
                            selected={isSelected}
                            onClick={() => {
                              setSprintIndex(index)
                              updateSelectedIssueField('sprint', index)
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
                </>
              )}
            </Row>

            <Row>
              <Typography value='Label' variant='textSM' weight='medium' color='gray900' />
              <LabelContainer>
                {selectedLabels.map((label) => (
                  <LabelBadge
                    key={label}
                    onClick={() => {
                      if (!isIssueSelected) return
                      handleLabelClick(label)
                    }}
                    style={{
                      cursor: isIssueSelected ? 'pointer' : 'not-allowed',
                      opacity: isIssueSelected ? 1 : 0.5
                    }}
                  >
                    <Typography value={label} variant='textXS' weight='medium' color='brand700' />
                    <CancelIcon />
                  </LabelBadge>
                ))}

                <LabelBadge
                  ref={labelRef}
                  onClick={() => {
                    if (!isIssueSelected) return
                    setLabelDropdownOpen(prev => !prev)
                  }}
                  style={{
                    cursor: isIssueSelected ? 'pointer' : 'not-allowed',
                    opacity: isIssueSelected ? 1 : 0.5
                  }}
                >
                  <PlusIcon />
                </LabelBadge>

                {labelDropdownOpen && isIssueSelected && createPortal(
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

            {step === 'assign' && (
              <Row>
                <Typography value='Assignee' variant='textSM' weight='medium' color='gray900' />
                <div
                  ref={assigneeRef}
                  onClick={() => {
                    if (!isIssueSelected) return
                    setAssigneeDropdownOpen(prev => !prev)
                  }}
                  style={{
                    cursor: isIssueSelected ? 'pointer' : 'not-allowed',
                    opacity: isIssueSelected ? 1 : 0.5
                  }}
                >
                  <Typography
                    value={renderAssigneeText() || '배정하기'}
                    variant='textSM'
                    weight='regular'
                    color={assignees.length > 0 ? 'gray900' : 'gray400'}
                  />
                </div>

                {assigneeDropdownOpen && isIssueSelected && createPortal(
                  <DropDownMenu ref={assigneeMenuRef} style={assigneeMenuStyle}>
                    {assigneeOptions.map((name, index) => {
                      const isSelected = assignees.includes(name)
                      return (
                        <DropDownItem
                          key={index}
                          selected={isSelected}
                          onClick={() => {
                            if (!isIssueSelected) return
                            if (isSelected) {
                              const updated = assignees.filter((a) => a !== name)
                              setAssignees(updated)
                              updateSelectedIssueField('assignees', updated)
                            } else {
                              const updated = [...assignees, name]
                              setAssignees(updated)
                              updateSelectedIssueField('assignees', updated)
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
            )}

            <Row>
              <ButtonBase
                $isHighlighted={isCompleted}
                onClick={() => {
                  if (!isIssueSelected) return
                  handleStateToggle()
                }}
                style={{
                  marginLeft: 'auto',
                  cursor: isIssueSelected ? 'pointer' : 'not-allowed',
                  opacity: isIssueSelected ? 1 : 0.5
                }}
              >
                {isCompleted ? '확정됨' : '확정하기'}
              </ButtonBase>
            </Row>
          </ContentWrapper>

          <Footer>
            <ButtonBase
              disabled={step === 'assign' || isAllCompleted}
              onClick={() => {
                const updated = issueList.map(issue => ({ ...issue, isCompleted: true }))
                setIssueList(updated)
                setIsCompleted(true)
              }}
              style={{
                cursor: step === 'assign' || isAllCompleted ? 'not-allowed' : 'pointer',
                opacity: step === 'assign' || isAllCompleted ? 0.5 : 1
              }}
            >
              전체 이슈 확정
            </ButtonBase>
            <ButtonBase
              $isHighlighted
              disabled={isFetching}
              style={{
                cursor: step === 'assign' || isAllCompleted ? 'not-allowed' : 'pointer',
                opacity: step === 'assign' || isAllCompleted ? 0.5 : 1
              }}
              onClick={() => {
                if (isFetching) return
                navigate(`${location.pathname}#confirm`)
                setIssueTitle('이슈를 선택해주세요')
                setIssueContent('이슈를 선택해주세요')
                setPriority('M')
                setSprintIndex(null)
                setSelectedLabels([])
                setAssignees([])
                setIsCompleted(false)
                setSelectedIssue(null)
                setIssueList([])
                fetchSuggestedIssues()
              }}
            >
              전체 이슈 재요청
            </ButtonBase>
          </Footer>
        </LeftContainer>

        <RightContainer>
          <Typography value='이슈 목록' variant='textLG' weight='medium' color='gray900' />
          <IssueList>
            {issueList.map((issue, idx) => (
              <IssueBox
                key={`${issue.name}-${idx}`}
                $checked={selectedIssue === issue}
                onClick={() => { handleIssueSelect(issue) }}
              >
                <Typography value={issue.title} variant='textSM' weight='medium' color='gray900' />
                {issue.isCompleted && <CheckIcon>✓</CheckIcon>}
              </IssueBox>
            ))}
            {isFetching && (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img src={loadingSvg} alt='로딩 중' style={{ width: '2rem' }} />
              </div>
            )}
          </IssueList>
        </RightContainer>
      </SplitContainer>
    </MainBox>
  )
}

export default IssueSuggestPage
