import { useState, useEffect, useRef } from 'react'
import InputField from '@components/Edit/InputField'
import styled from 'styled-components'
import Typography from '@components/Edit/Typography'
import DropDown from '@components/Edit/DropDown'
import FileTable from '@components/Edit/FileTable'
import Button from '@components/Common/Button'
import { DatePicker } from '@components/Edit/DatePicker'
import Header from '@components/Header'
import UserTable from '@components/Edit/UserTable'
import SearchInputField from '@components/Edit/SearchInputField'
import { MainBox } from '@styles/globalStyle'
import api from '@hooks/useAxios'
import { useNavigate } from 'react-router-dom'
import toastMsg from '@utils/toastMsg'
import useLoadingStore from '@store/useLoadingStore'

const Fieldset = styled.div`
	display: flex;
	flex-direction: column;
	gap: 32px;
	width: 100%;
	align-items: center;
`

const DropDownWrapper = styled.div`
	display: flex;
	gap: ${({ theme }) => theme.margin?.xl || '32px'};
	width: 100%;
`

const ButtonGroup = styled.div`
	display: flex;
	justify-content: flex-end;
	gap: 16px;
	margin-top: 32px;
	width: 100%;
`

const Section = styled.section`
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 100%;
`

const sprintOptions = [
  { value: '', label: 'Select team member' },
  { value: 7, label: '1주' },
  { value: 14, label: '2주' },
  { value: 30, label: '1개월' }
]

const BuildProject = () => {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    projectName: '',
    deadline: '',
    sprint: 7,
    github: '',
    discord: '',
    files: [],
    members: []
  })
  const [error, setError] = useState({})
  const [search, setSearch] = useState('')
  const [searchOptions, setSearchOptions] = useState([])
  const [searchResults, setSearchResults] = useState([])

  const inputRef = useRef(null)
  const navigate = useNavigate()

  // 검색어가 변경될 때마다 API 호출
  useEffect(() => {
    const searchUsers = async () => {
      if (!search) {
        setSearchOptions([])
        setSearchResults([])
        return
      }
      try {
        const response = await api.get('/user/search', {
          params: { user_name: search }
        })
        const res = response.length > 0 ? response : []
        setSearchResults(res)
        setSearchOptions(res.map(user => ({
          value: user.id.toString(),
          label: user.name
        })))
      } catch {
        setSearchOptions([])
        setSearchResults([])
      }
    }

    searchUsers()
  }, [search])

  // hash로 단계 관리
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash === 'step2') setStep(2)
    else if (hash === 'step3') setStep(3)
    else setStep(1)
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash === 'step2') setStep(2)
      else if (hash === 'step3') setStep(3)
      else setStep(1)
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  // 1단계: 프로젝트 기본 정보
  const renderStep1 = () => (
    <MainBox>
      <Header text='프로젝트 생성' />
      <Section>
        <Fieldset>
          <InputField
            label='프로젝트 명 입력'
            placeholder='입력하세요'
            value={form.projectName}
            onChange={e => {
						  setForm(f => ({ ...f, projectName: e.target.value }))
						  if (error.projectName && e.target.value) setError(prev => ({ ...prev, projectName: false }))
            }}
            require
            error={error.projectName}
          />
          <DropDownWrapper>
            <div style={{ width: '100%' }}>
              <DatePicker
                label='마감기한 설정'
                require
                paramYear={form.deadline ? Number(form.deadline.split('-')[0]) : undefined}
                paramMonth={form.deadline ? Number(form.deadline.split('-')[1]) : undefined}
                paramDate={form.deadline ? Number(form.deadline.split('-')[2]) : undefined}
                setPickedDate={date => {
								  setForm(f => ({ ...f, deadline: date }))
								  if (error.deadline && date) setError(prev => ({ ...prev, deadline: false }))
                }}
                error={error.deadline}
              />
            </div>
            <DropDown
              label='스프린트 단위'
              placeholder='Select team member'
              value={form.sprint}
              onChange={v => {
							  setForm(f => ({ ...f, sprint: v }))
							  if (error.sprint && v !== '') setError(prev => ({ ...prev, sprint: false }))
              }}
              options={sprintOptions}
              require
              error={error.sprint}
            />
          </DropDownWrapper>
          <InputField
            label='Github Repo 주소 입력'
            placeholder='입력하세요'
            value={form.githubInput ?? form.github}
            onChange={e => {
						  const input = e.target.value
						  // 입력값은 그대로 저장
						  setForm(f => ({ ...f, githubInput: input }))
						  // 내부적으로만 "Coordipai/admin-web" 형태로 저장
						  const match = input.match(/github\.com\/([^/]+\/[^/.]+)(?:\.git)?$/)
						  const repo = match ? match[1] : input
						  setForm(f => ({ ...f, github: repo }))
						  if (error.github && input) setError(prev => ({ ...prev, github: false }))
            }}
            require
            error={error.github}
          />
          <InputField
            label='Discord 서버 ID 입력'
            placeholder='입력하세요'
            value={form.discord}
            onChange={e => {
						  setForm(f => ({ ...f, discord: e.target.value }))
						  if (error.discord && e.target.value) setError(prev => ({ ...prev, discord: false }))
            }}
            require
            error={error.discord}
          />
        </Fieldset>
        <ButtonGroup>
          <Button variant='outlined' onClick={() => (window.location.href = '/')}>취소</Button>
          <Button
            variant='contained' onClick={() => {
					  const newError = {}
					  if (!form.projectName) newError.projectName = true
					  if (!form.deadline) newError.deadline = true
					  if (!form.sprint) newError.sprint = true
					  if (!form.github) newError.github = true
					  if (!form.discord) newError.discord = true
					  setError(newError)
					  if (Object.keys(newError).length === 0) {
					    window.location.hash = '#step2'
					  }
            }}
          >다음
          </Button>
        </ButtonGroup>
      </Section>
    </MainBox>
  )

  // 2단계: 파일 업로드/선택
  const renderStep2 = () => (
    <MainBox>
      <Header text='프로젝트 생성' />
      <Section>
        <Fieldset>

          <FileTable
            files={form.files}
            setFiles={newFiles => {
              setForm(f => ({
						    ...f,
						    files: Array.from(newFiles, file => file instanceof File ? file : file.file)
						  }))
            }}
          />

        </Fieldset>
        <ButtonGroup>
          <Button variant='outlined' onClick={() => (window.location.hash = '#step1')}>취소</Button>
          <Button variant='contained' onClick={() => (window.location.hash = '#step3')}>다음</Button>
        </ButtonGroup>
      </Section>
    </MainBox>
  )

  // 3단계: 팀원 관리 및 제출
  const renderStep3 = () => (
    <MainBox>
      <Header text='프로젝트 생성' />
      <Section>
        <Fieldset>
          <SearchInputField
            label='팀원 검색'
            value={search}
            onChange={e => setSearch(e.target.value)}
            options={searchOptions}
            onSelect={(value, label) => {
						  setSearch('')
						  const selectedUser = searchResults.find(user => user.id.toString() === value)
						  if (form.members.some(member => member.id.toString() === value)) {
						    toastMsg('이미 추가된 팀원입니다', 'error')
						    return
						  }
						  setForm(prev => ({
						    ...prev,
						    members: [...prev.members, {
						      id: value,
						      name: label,
						      githubId: selectedUser?.github_name || '',
						      profileImg: selectedUser?.profile_img || '',
						      field: ''
						    }]
						  }))
            }}
            placeholder='팀원을 검색하세요'
            ref={inputRef}
          />
          <UserTable rows={form.members} setRows={rows => setForm(f => ({ ...f, members: rows }))} />
        </Fieldset>
        <ButtonGroup>
          <Button variant='outlined' onClick={() => (window.location.hash = '#step2')}>취소</Button>
          <Button
            variant='contained' onClick={async () => {
					  // 날짜를 ISO 8601로 변환
					  const startDate = new Date(new Date().getTime() + 9 * 60 * 60 * 1000).toISOString()
					  const endDate = form.deadline ? `${form.deadline}T00:00:00Z` : ''

					  const members = form.members.map(row => ({
					    id: row.id,
					    role: row.field || 'member'
					  }))

					  const projectReq = {
					    name: form.projectName,
					    repo_fullname: form.github,
					    start_date: startDate,
					    end_date: endDate,
					    sprint_unit: Number(form.sprint),
					    discord_channel_id: String(form.discord),
					    members
					  }
					  /**
						 * Coordipai/admin-web
						 */
					  const formData = new FormData()
					  formData.append('project_req', JSON.stringify(projectReq))
					  form.files.forEach(file => {
					    formData.append('files', file)
					  })
					  try {
              useLoadingStore.getState().setLoading(true)
              toastMsg('프로젝트 생성을 시작합니다!', 'success')
					    await api.post('/project', formData)
					    navigate('/')
					  } catch (error) {
					    toastMsg(`${error.response?.data?.title}`, 'error')
					  } finally {
              toastMsg('프로젝트 생성이 완료되었습니다!', 'success')
              useLoadingStore.getState().setLoading(false)
            }
            }}
          >완료
          </Button>
        </ButtonGroup>
      </Section>
    </MainBox>
  )

  if (step === 1) return renderStep1()
  if (step === 2) return renderStep2()
  return renderStep3()
}

export default BuildProject
