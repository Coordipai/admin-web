import { useState, useEffect, useRef } from 'react'
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
import { useAccessTokenStore, useRefreshTokenStore, useUserStore } from '@store/useUserStore'
import { api } from '../../hooks/useAxios'

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
	const isSearching = useRef(false)
  const { Get, Put, Delete } = useFetchWithTokenRefresh()
  const setAccessToken = useAccessTokenStore(state => state.setAccessToken)
	const setRefreshToken = useRefreshTokenStore(state => state.setRefreshToken)
	const setUser = useUserStore(state => state.setUser)
	const accessToken = useAccessTokenStore(state => state.accessToken)
	const refreshToken = useRefreshTokenStore(state => state.refreshToken)

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
            id: m.id||1,
            name: m.name,
            githubId: m.github_name,
            profileImg: m.profile_img,
            field: m.role || '',
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

    console.log(form.members)

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
  const handleSearchKeyDown = async (e) => {
		if (e.key !== 'Enter') return;

		if (isSearching.current) return;
		isSearching.current = true;
		e.preventDefault();
		const keyword = e.target.value;
		if (!keyword) {
			isSearching.current = false;
			return;
		}
		let res;
		try {
			res = await api.get('/user/search', {
				headers: {
					Authorization: `Bearer ${accessToken}`
				},
				params: { user_name: keyword }
			})
		} catch (err) {
			if (err.response && err.response.status === 401 && refreshToken) {
				try {
					const refreshRes = await api.post('/auth/refresh', {
						refresh_token: refreshToken
					})
					const refreshData = refreshRes.data?.content?.data
					if (refreshData) {
						setUser(refreshData.user)
						setAccessToken(refreshData.access_token)
						setRefreshToken(refreshData.refresh_token)
						res = await api.get('/user/search', {
							headers: {
								Authorization: `Bearer ${refreshData.access_token}`
							},
							params: { user_name: keyword }
						})
					} else {
						alert('인증이 만료되었습니다. 다시 로그인 해주세요.')
						isSearching.current = false;
						return;
					}
				} catch {
					alert('인증이 만료되었습니다. 다시 로그인 해주세요.')
					isSearching.current = false;
					return;
				}
			} else {
				alert('존재하지 않는 사용자입니다')
				isSearching.current = false;
				return;
			}
		}
		const users = res.data?.content?.data || []
		if (users.length === 0) {
			alert('존재하지 않는 사용자입니다')
			isSearching.current = false;
			return;
		}
		const userInfo = users[0]
		if (form.members.some(member => member.id === userInfo.id)) {
			alert('이미 추가된 팀원입니다')
			isSearching.current = false;
			return;
		}

		setForm(f => ({
			...f,
			members: [
				...f.members,
				{
					id: userInfo.id,
					name: userInfo.name,
					githubId: userInfo.github_name,
					profileImg: userInfo.profile_img,
					field: ''
				}
			]
		}))
		setSearch('')

		isSearching.current = false;

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

						onKeyDown={handleSearchKeyDown}
						placeholder='팀원을 검색하세요'
						ref={inputRef}
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



