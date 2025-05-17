import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
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
  styledIcon,
  ButtonBase
} from '@styles/globalStyle'
import FormTextarea from '@components/FormTextarea'
import { Plus, X } from '@untitled-ui/icons-react'

import useLoadingStore from '@store/useLoadingStore'
import { mockIssueList } from '@mocks/issueList'
import { getGeneratedIssues } from '@api/agentApi'
import { useParams } from 'react-router-dom'
import { useProjectStore } from '@store/useProjectStore'

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
  const { isLoading, setLoading } = useLoadingStore()
  const { project } = useProjectStore()
  // project 정보
  const [priorityOptions] = useState([
    { value: 'M', label: '[M] Must Have' },
    { value: 'S', label: '[S] Should Have' },
    { value: 'C', label: '[C] Could Have' },
    { value: 'W', label: '[W] Won\'t Have' }
  ])
  const [iterationOptions, setIterationOptions] = useState([{ title: 'iteration 선택', period: 'iteration을 선택해주세요.'}])
  const [labelOptions] = useState(['기능', '설정', '테스트', '배포', '버그 수정', '문서', '리팩토링', '질문', '정리'])
  const [assigneeOptions, setAssigneeOptions] = useState([])
  
  // issue 정보
  const [issueTitle, setIssueTitle] = useState('')
  const [issueContent, setIssueContent] = useState('')
  const [priority, setPriority] = useState(priorityOptions[0].value)
  const [iteration, setIteration] = useState(iterationOptions[0])
  const [selectedLabels, setSelectedLabels] = useState([])
  const [assignees, setAssignees] = useState([])
  const [selectedIssue, setSelectedIssue] = useState(null)
  const [issueList, setIssueList] = useState([])
  const [isCompleted, setIsCompleted] = useState(false)
  const isIssueSelected = !!selectedIssue

  // projectStore에서 정보 가져오기
  const fetchProject = useCallback(async () => {
    try {
      // dummy
      // const iterations = [    
      //   { title: 'Iteration 1', period: '2023-10-01 ~ 2023-10-15' },
      //   { title: 'Iteration 2', period: '2023-10-16 ~ 2023-10-31' },
      //   { title: 'Iteration 3', period: '2023-11-01 ~ 2023-11-15' }
      // ]
      // const assignees = [
      //   'makisepel'
      // ]
      setIterationOptions(project.iterationOptions)
      setAssigneeOptions(project.assigneeOptions)
    } catch (error) {
      console.error('Failed to get project data:', error)
      // 기본값 설정
      setIterationOptions([{ title: '선택해주세요', period: '' }])
      setIteration({ title: '선택해주세요', period: '' })
      setAssigneeOptions([])
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const fetchSuggestedIssues = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getGeneratedIssues(projectId)
      console.log(response)

      // const response = mockIssueList.map(issue => ({
      //   ...issue,
      //   isCompleted: false,
      //   priority: 'M',
      //   iteration: iterationOptions[0],
      //   assignees: []
      // }))
      // setIssueList(response)

    } catch (error) {
      console.error('Failed to fetch issue list:', error)
      setIssueList([])
    } finally {
      setLoading(false)
    }
  }, [setLoading, iterationOptions])  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      try {
        await fetchProject()
        await fetchSuggestedIssues()
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleIssueSelect = (issue) => {
    setSelectedIssue(issue)
    // Update form fields with selected issue data
    setIssueTitle(issue.title)
    setIssueContent(issue.description)
    setPriority(issue.priority || 'M')
    setIteration(issue.iteration || iterationOptions[0])
    setSelectedLabels(issue.labels || [])
    setAssignees(issue.assignees || [])
    setIsCompleted(issue.isCompleted || false)
  }

  const handleStateToggle = () => {
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

  return (
    <MainBox>
      <Header
        text={'이슈 생성하기'}
        buttonsData={[
          { 
            value: '저장', 
            onClick: () => {}, 
            isHighlighted: true 
          },
          { 
            value: '삭제', 
            onClick: () => {}, 
            isHighlighted: true 
          },
          { value: '취소', onClick: () => window.history.back() }
        ]}
      />
      {!isLoading && (
        <SplitContainer>
          <LeftContainer>
            <ContentWrapper>
              <InputField disabled={!isIssueSelected} label='이슈 타이틀' placeholder='이슈를 선택해주세요.' value={issueTitle} onChange={(e) => setIssueTitle(e.target.value)} />
              <FormTextarea disabled={!isIssueSelected} label='이슈 내용' placeholder='이슈를 선택해주세요.' value={issueContent} onChange={setIssueContent} />
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
                  }}>
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
                {iteration && (
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
                        <Typography value={iteration.title} variant='textSM' weight='regular' color='gray900' />
                        <Typography value={iteration.period} variant='textXS' weight='regular' color='gray500' />
                      </IterationBox>
                    </div>
                    {iterationDropdownOpen && isIssueSelected && createPortal(
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
                    value={renderAssigneeText()}
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
                onClick={() => {
                  const updated = issueList.map(issue => ({ ...issue, isCompleted: true }))
                  setIssueList(updated)
                }}
              >
                전체 이슈 확정
              </ButtonBase>
              <ButtonBase $isHighlighted>전체 이슈 재요청</ButtonBase>
            </Footer>
          </LeftContainer>


          <RightContainer>
            <Typography value='이슈 목록' variant='textLG' weight='medium' color='gray900' />
            <IssueList>
              {issueList.map((issue) => (
                <IssueBox
                  key={issue.name}
                  $checked={selectedIssue?.name === issue.name}
                  onClick={() => handleIssueSelect(issue)}
                >
                  <Typography value={issue.title} variant='textSM' weight='medium' color='gray900' />
                  {issue.isCompleted && <CheckIcon>✓</CheckIcon>}
                </IssueBox>
              ))}
            </IssueList>
          </RightContainer>
        </SplitContainer>
      )}
    </MainBox>
  )
}

export default IssueSuggestPage
