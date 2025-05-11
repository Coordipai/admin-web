import { useState, useEffect } from 'react'
import InputField from '@components/Edit/InputField'
import styled from 'styled-components'
import Typography from '@components/Edit/Typography'
import DropDown from '@components/Edit/DropDown'
import FileTable from '@components/Edit/FileTable'
import Button from '@components/Common/Button'
import { HorizontalDivider, MainBox } from '@styles/globalStyle'
import { useNavigate, useParams } from 'react-router-dom'
import SearchInputField from '@components/Edit/SearchInputField'
import UserTable from '@components/Edit/UserTable'
import { DatePicker } from '@components/Edit/DatePicker'
import Header from '@components/Header'
import { api } from '@hooks/useAxios'
import dayjs from 'dayjs'

const Fieldset = styled.div`
	flex: 1;
	min-height: 600px;
	max-height: 100%;
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.gap.xl};
	width: 100%;
	align-items: stretch;
	overflow-y: auto;
	scrollbar-width: none;
	-ms-overflow-style: none;
	&::-webkit-scrollbar {
		display: none;
	}
`

const TableWrapper = styled.div`
	min-height: fit-content;
	width: 100%;
	overflow-y: auto;
	scrollbar-width: none;
	-ms-overflow-style: none;
	&::-webkit-scrollbar {
		display: none;
	}
`

const ButtonGroup = styled.div`
	display: flex;
	justify-content: flex-end;
	gap: ${({ theme }) => theme.gap.md};
	width: 100%;
`

const Section = styled.section`
	width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 100%;
	max-height: 100%;
	flex: 1;
	min-height: 0;
	gap: ${({ theme }) => theme.gap.xl};
	overflow-y: hidden;
	overflow-x: hidden;
`
const DropDownWrapper = styled.div`
	display: flex;
	gap: ${({ theme }) => theme.margin.xl};
	width: 100%;
`

export const SettingProject = () => {
  const { projectId } = useParams()
  const navigate = useNavigate()

  // 상태 정의
  const [projectName, setProjectName] = useState('')
  const [sprint, setSprint] = useState('')
  const [github, setGithub] = useState('')
  const [discord, setDiscord] = useState('')
  const [error, setError] = useState({})
  const [deadline, setDeadline] = useState('')
  const [files, setFiles] = useState([])
  const [rows, setRows] = useState([])
  const [search, setSearch] = useState('')
  const [startDate, setStartDate] = useState('')

  // 스프린트 옵션 (숫자값)
  const sprintOptions = [
    { value: '', label: 'Select team member' },
    { value: 7, label: '1주' },
    { value: 14, label: '2주' },
    { value: 30, label: '1개월' }
  ]

  // 프로젝트 정보 불러오기
  useEffect(() => {
    if (!projectId) return
    const fetchProject = async () => {
      try {
        const res = await api.get(`/project/${projectId}`)
        const data = res.data?.content?.data
        setProjectName(data.name || '')
        setGithub(data.repo_fullname || '')
        setDeadline(data.end_date ? dayjs(data.end_date).format('YYYY-MM-DD') : '')
        setSprint(data.sprint_unit || '')
        setDiscord(data.discord_channel_id || '')
        setFiles([]) // 파일 정보는 별도 처리 필요시 추가
        setRows(
          (data.members || []).map(m => ({
            id: m.github_id,
            name: m.name,
            githubId: m.github_name,
            profileImg: m.profile_img,
            field: m.role || ''
          }))
        )
        setStartDate(data.start_date || '')
      } catch {
        alert('프로젝트 정보를 불러오지 못했습니다.')
      }
    }
    fetchProject()
  }, [projectId])

  // 팀원 검색 (buildproject와 동일하게 구현 필요시 추가)
  // ... (생략, 필요시 buildproject 참고)

  // 완료 버튼 클릭 시 PUT
  const handleUpdate = async () => {
    const sprintMap = { '1주': 7, '2주': 14, '1개월': 30 }
    const sprint_unit = typeof sprint === 'number' ? sprint : sprintMap[sprint] || 7
    const endDate = deadline ? `${deadline}T00:00:00Z` : ''
    const members = rows.map(row => ({
      id: row.id,
      role: row.field || 'member'
    }))
    const body = {
      name: projectName,
      repo_fullname: github,
      start_date: startDate,
      end_date: endDate,
      sprint_unit,
      discord_chnnel_id: discord,
      members,
      files
    }
    try {
      await api.put(`/project/${projectId}`, body)
      navigate('/')
    } catch {
      alert('프로젝트 수정 실패')
    }
  }

  return (
    <MainBox>
      <Header text='프로젝트 설정' />
      <Section>
        <Fieldset>
          <InputField
            label='프로젝트 명 입력'
            placeholder='입력하세요'
            value={projectName}
            onChange={e => {
              setProjectName(e.target.value)
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
                paramYear={deadline ? Number(deadline.split('-')[0]) : undefined}
                paramMonth={deadline ? Number(deadline.split('-')[1]) : undefined}
                paramDate={deadline ? Number(deadline.split('-')[2]) : undefined}
                setPickedDate={date => {
                  setDeadline(date)
                  if (error.deadline && date) setError(prev => ({ ...prev, deadline: false }))
                }}
                error={error.deadline}
              />
            </div>
            <DropDown
              label='스프린트 단위'
              placeholder='Select team member'
              value={sprint}
              onChange={v => {
                setSprint(v)
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
            value={github}
            onChange={e => {
              setGithub(e.target.value)
              if (error.github && e.target.value) setError(prev => ({ ...prev, github: false }))
            }}
            require
            error={error.github}
          />
          <InputField
            label='Discord 서버 ID 입력'
            placeholder='입력하세요'
            value={discord}
            onChange={e => {
              setDiscord(e.target.value)
              if (error.discord && e.target.value) setError(prev => ({ ...prev, discord: false }))
            }}
            require
            error={error.discord}
          />
          <TableWrapper>
            <FileTable files={files} setFiles={setFiles} />
          </TableWrapper>
          <SearchInputField
            label='팀원 검색'
            value={search}
            onChange={e => setSearch(e.target.value)}
            options={[]}
            onSelect={(val, label) => {
              setSearch(label)
            }}
            placeholder='팀원을 검색하세요'
          />
          <TableWrapper>
            <UserTable rows={rows} setRows={setRows} />
          </TableWrapper>
          <ButtonGroup>
            <Button text='취소' type='button' onClick={() => navigate(-1)} />
            <Button text='완료' type='button' onClick={handleUpdate} />
          </ButtonGroup>
        </Fieldset>
      </Section>
    </MainBox>
  )
}
