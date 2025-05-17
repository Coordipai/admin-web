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
import { api } from '../../hooks/useAxios'
import dayjs from 'dayjs'
import { useAccessTokenStore, useRefreshTokenStore, useUserStore } from '@store/useUserStore'
import { useNavigate } from 'react-router-dom'


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

	const setAccessToken = useAccessTokenStore(state => state.setAccessToken)
	const setRefreshToken = useRefreshTokenStore(state => state.setRefreshToken)
	const setUser = useUserStore(state => state.setUser)
	const accessToken = useAccessTokenStore(state => state.accessToken)
	const refreshToken = useRefreshTokenStore(state => state.refreshToken)

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

	const inputRef = useRef(null)
	const isSearching = useRef(false)
	const navigate = useNavigate()


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
				</Fieldset>
				<ButtonGroup>
					<Button variant='outlined'onClick={() => (window.location.href = '/')} >취소</Button>
					<Button variant='contained'  onClick={() => {
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
					}} >다음</Button>
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
							console.log('FileTable에서 form에 저장되는 파일:', newFiles)
							setForm(f => ({
								...f,
								files: Array.from(newFiles, file => file instanceof File ? file : file.file)
							}))
						}}
					/>

				</Fieldset>
				<ButtonGroup>
					<Button variant='outlined' onClick={() => (window.location.hash = '#step1')} >취소</Button>
					<Button variant='contained' onClick={() => (window.location.hash = '#step3')} >다음</Button>
				</ButtonGroup>
			</Section>
		</MainBox>
	)

	// 3단계: 팀원 관리 및 제출
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

	const renderStep3 = () => (
		<MainBox>
			<Header text='프로젝트 생성' />
			<Section>
				<Fieldset>
					<SearchInputField
						label='팀원 검색'
						value={search}
						onChange={e => setSearch(e.target.value)}

						options={[]}

						onKeyDown={handleSearchKeyDown}
						placeholder='팀원을 검색하세요'
						ref={inputRef}
					/>
					<UserTable rows={form.members} setRows={rows => setForm(f => ({ ...f, members: rows }))} />
				</Fieldset>
				<ButtonGroup>
					<Button variant='outlined' onClick={() => (window.location.hash = '#step2')} >취소</Button>
					<Button variant='contained' onClick={async () => {
						// 날짜를 ISO 8601로 변환
						const startDate = form.deadline ? new Date().toISOString() : dayjs().format('YYYY-MM-DDT00:00:00[Z]')
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
							await api.post('/project', formData, {
								headers: { Authorization: `Bearer ${accessToken}` }
							})
							
							navigate('/')
						} catch (error) {
							alert('프로젝트 생성 실패')
							console.log('프로젝트 생성 실패:', error)

						}
					}} >완료</Button>
				</ButtonGroup>
			</Section>
		</MainBox>
	)

	if (step === 1) return renderStep1()
	if (step === 2) return renderStep2()
	return renderStep3()
}

export default BuildProject
