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
import dayjs from 'dayjs'
import useFetchWithTokenRefresh from '@api/useFetchWithTokenRefresh'

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
  const { Get, Put, Delete } = useFetchWithTokenRefresh()

  // form 상태로 통합 관리
  const [form, setForm] = useState({
    projectName: '',
    sprint: '',
    github: '',
    discord: '',
    deadline: '',
    design_docs: [],
    files: [],
    members: [],
    startDate: ''
  })
  const [error, setError] = useState({})
  const [search, setSearch] = useState('')

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
        const res = await Get(`/project/${projectId}`)
        // res가 useFetchWithTokenRefresh의 Get이므로 바로 data
        console.log(res)
        setForm({
          projectName: res.name || '',
          github: res.repo_fullname || '',
          deadline: res.end_date ? dayjs(res.end_date).format('YYYY-MM-DD') : '',
          sprint: res.sprint_unit || '',
          discord: res.discord_channel_id || '',
          files: [], // 파일 정보는 별도 처리 필요시 추가
          design_docs: res.design_docs || [],
          members: (res.members || []).map(m => ({
            id: m.github_id,
            name: m.name,
            githubId: m.github_name,
            profileImg: m.profile_img,
            field: m.role || ''
          })),
          startDate: res.start_date || ''
        })
      } catch {
        alert('프로젝트 정보를 불러오지 못했습니다.')
      }
    }
    fetchProject()
  }, [projectId])

  // 완료 버튼 클릭 시 PUT
  const handleUpdate = async () => {
    const sprintMap = { '1주': 7, '2주': 14, '1개월': 30 }
    const sprint_unit = typeof form.sprint === 'number' ? form.sprint : sprintMap[form.sprint] || 7
    const endDate = form.deadline ? `${form.deadline}T00:00:00Z` : ''
    const members = form.members.map(row => ({
      id: row.id,
      role: row.field || 'member'
    }))
    const projectReq = {
      name: form.projectName,
      repo_fullname: form.github,
      start_date: form.startDate,
      end_date: endDate,
      sprint_unit,
      discord_channel_id: form.discord,
      members,
      design_docs: form.design_docs
    }

    try {
      console.log(form.files)
      console.log(projectReq)

        const formData = new FormData()
        formData.append('project_req', JSON.stringify(projectReq))
        form.files.forEach(file => {
          formData.append('files', file)
      })
      await Put(`/project/${projectId}`, formData)
      navigate('/')
    } catch {
      alert('프로젝트 수정 실패')
    }
  }
  const handleDelete = async () => {
    try {
      await Delete(`/project/${projectId}`)
      navigate('/')
    } catch {
      alert('프로젝트 삭제 실패') 
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
            value={form.github}
            onChange={e => {
              setForm(f => ({ ...f, github: e.target.value }))
              if (error.github && e.target.value) setError(prev => ({ ...prev, github: false }))
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
          <TableWrapper>
            <FileTable
              files={[...form.design_docs, ...form.files]}
              setFiles={files => setForm(f => ({
                ...f,
                design_docs: files.filter(f => typeof f === 'string'),
                files: files.filter(f => f instanceof File)
              }))}
            />
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
            <UserTable rows={form.members} setRows={rows => setForm(f => ({ ...f, members: rows }))} />
          </TableWrapper>
          <ButtonGroup>
            <Button variant='contained' onClick={handleDelete}>삭제</Button>
            <Button variant='outlined'  onClick={() => navigate(-1)} >취소</Button>
            <Button variant='contained'  onClick={handleUpdate} >완료</Button>
          </ButtonGroup>
        </Fieldset>
      </Section>
    </MainBox>
  )
}



