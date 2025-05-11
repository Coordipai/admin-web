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
import { api } from '@hooks/useAxios'
import dayjs from 'dayjs'

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
	const [searchResults, setSearchResults] = useState([])
	const inputRef = useRef(null)

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
					<Button text='취소' type='button' onClick={() => (window.location.href = '/')} />
					<Button text='다음' type='button' onClick={() => {
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
					}} />
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
						setFiles={newFiles => setForm(f => ({ ...f, files: newFiles }))}
					/>
				</Fieldset>
				<ButtonGroup>
					<Button text='취소' type='button' onClick={() => (window.location.hash = '#step1')} />
					<Button text='다음' type='button' onClick={() => (window.location.hash = '#step3')} />
				</ButtonGroup>
			</Section>
		</MainBox>
	)

	// 3단계: 팀원 관리 및 제출
	const handleSearchKeyDown = async (e) => {
		if (e.key !== 'Enter') return;
		const keyword = e.target.value;
		if (!keyword) return;
		try {
			const res = await api.get('/user/search', { params: { user_name: keyword } })
			const users = res.data?.content?.data || []
			if (users.length === 0) {
				alert('해당 사용자가 없습니다')
				setSearchResults([])
				return
			}
			setSearchResults(users.map(user => ({
				value: user.github_name,
				label: `${user.name} (${user.github_name})`,
				_raw: user
			})))
		} catch {
			setSearchResults([])
			alert('해당 사용자가 없습니다')
		}
	}

	const handleSelectUser = (githubName) => {
		if (form.members.some(member => member.githubId === githubName)) return
		const selectedUser = searchResults.find(user => user.value === githubName)
		if (!selectedUser) return
		const userInfo = selectedUser._raw
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
		setSearchResults([])
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
						options={searchResults}
						onSelect={handleSelectUser}
						onKeyDown={handleSearchKeyDown}
						placeholder='팀원을 검색하세요'
						ref={inputRef}
					/>
					<UserTable rows={form.members} setRows={rows => setForm(f => ({ ...f, members: rows }))} />
				</Fieldset>
				<ButtonGroup>
					<Button text='취소' type='button' onClick={() => (window.location.hash = '#step2')} />
					<Button text='완료' type='submit' onClick={async () => {
						const sprintMap = { '1주': 1, '2주': 2, '1개월': 4 }
						const sprint_unit = sprintMap[form.sprint] || 1
						const today = dayjs().format('YYYY-MM-DDT00:00:00[Z]')
						const members = form.members.map(row => ({
							id: row.id,
							role: row.field || 'member'
						}))
						const endDate = form.deadline ? `${form.deadline}T00:00:00Z` : ''
						const body = {
							name: form.projectName,
							repo_fullname: form.github,
							start_date: today,
							end_date: endDate,
							sprint_unit,
							discord_chnnel_id: form.discord,
							members
						}
						const formData = new FormData()
						formData.append('project_req', JSON.stringify(body))
						form.files.forEach(file => {
							formData.append('files', file)
						})
						const accessToken = window.localStorage.getItem('accessToken')
						try {
							const res = await fetch(`${import.meta.env.VITE_BASE_URL}/project`, {
								method: 'POST',
								body: formData,
								headers: { Authorization: `Bearer ${accessToken}` }
							})
							if (!res.ok) throw new Error('프로젝트 생성 실패')
							window.location.href = '/'
						} catch {
							alert('프로젝트 생성 실패')
						}
					}} />
				</ButtonGroup>
			</Section>
		</MainBox>
	)

	if (step === 1) return renderStep1()
	if (step === 2) return renderStep2()
	return renderStep3()
}

export default BuildProject
