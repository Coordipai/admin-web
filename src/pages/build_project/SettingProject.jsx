import { useState, useEffect, useRef } from 'react'
import InputField from '@components/Edit/InputField'
import styled from 'styled-components'
import DropDown from '@components/Edit/DropDown'
import FileTable from '@components/Edit/FileTable'
import Button from '@components/Common/Button'
import { MainBox } from '@styles/globalStyle'
import { useNavigate, useParams } from 'react-router-dom'
import SearchInputField from '@components/Edit/SearchInputField'
import UserTable from '@components/Edit/UserTable'
import { DatePicker } from '@components/Edit/DatePicker'
import Header from '@components/Header'
import dayjs from 'dayjs'
import api from '@hooks/useAxios'
import toastMsg from '@utils/toastMsg'
import ConfirmModal from '@components/ConfirmModal'

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
  const inputRef = useRef(null)

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

  const [searchOptions, setSearchOptions] = useState([])
  const [searchResults, setSearchResults] = useState([])

  const [showDeleteModal, setShowDeleteModal] = useState(false)

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

        setForm({
          projectName: res.name || '',
          github: res.repo_fullname || '',
          deadline: res.end_date ? dayjs(res.end_date).format('YYYY-MM-DD') : '',
          sprint: res.sprint_unit || '',
          discord: res.discord_channel_id || '',
          files: [], // 파일 정보는 별도 처리 필요시 추가
          design_docs: res.design_docs || [],
          members: (res.members || []).map(m => ({
            id: m.id || 1,
            name: m.name,
            githubId: m.github_name,
            profileImg: m.profile_img,
            field: m.role || ''
          })),
          startDate: res.start_date || ''
        })
      } catch {
        toastMsg('프로젝트 정보를 불러오지 못했습니다.', 'error')
      }
    }
    fetchProject()
  }, [projectId])

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

  // 완료 버튼 클릭 시 PUT
  const handleUpdate = async () => {
    const sprintMap = { '1주': 7, '2주': 14, '1개월': 30 }
    const sprintUnit = typeof form.sprint === 'number' ? form.sprint : sprintMap[form.sprint] || 7
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
      sprint_unit: sprintUnit,
      discord_channel_id: form.discord,
      members,
      design_docs: form.design_docs
    }

    try {
      const formData = new FormData()
      formData.append('project_req', JSON.stringify(projectReq))
      form.files.forEach(file => {
        formData.append('files', file)
      })
      await api.put(`/project/${projectId}`, formData)
      toastMsg('프로젝트 수정 완료', 'success')
      navigate(-1)
    } catch(error) {
      toastMsg(`${error.response.data.title}`, 'error')
      navigate(-1)
    }
  }
  const handleDelete = async () => {
    try {
      await api.delete(`/project/${projectId}`)
      navigate('/')
    } catch {
      toastMsg('프로젝트 삭제 실패', 'error')
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

          <TableWrapper>
            <UserTable rows={form.members} setRows={rows => setForm(f => ({ ...f, members: rows }))} />
          </TableWrapper>
          <ButtonGroup>
            <Button variant='contained' onClick={() => setShowDeleteModal(true)}>삭제</Button>
            <Button variant='outlined' onClick={() => navigate(-1)}>취소</Button>
            <Button variant='contained' onClick={handleUpdate}>완료</Button>
          </ButtonGroup>
        </Fieldset>
      </Section>
      {showDeleteModal && (
        <ConfirmModal
          text='정말로 프로젝트를 삭제하시겠습니까?'
          setShowModal={setShowDeleteModal}
          handleConfirm={handleDelete}
        />
      )}
    </MainBox>
  )
}
