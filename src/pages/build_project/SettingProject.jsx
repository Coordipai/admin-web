import { useState } from 'react'
import InputField from '@components/Edit/InputField'
import styled from 'styled-components'
import Typography from '@components/Edit/Typography'
import DropDown from '@components/Edit/DropDown'
import FileTable from '@components/Edit/FileTable'
import Button from '@components/Common/Button'
import { HorizontalDivider, MainBox } from '@styles/globalStyle'
import { useNavigate } from 'react-router-dom'
import SearchInputField from '@components/Edit/SearchInputField'
import UserTable from '@components/Edit/UserTable'
import { DatePicker } from '@components/Edit/DatePicker'
import Header from '@components/Header'

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
	min-height: 300px;
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
  // buildproject (BuildProject.jsx) 관련 state
  const [projectName, setProjectName] = useState('')
  const [sprint, setSprint] = useState('')
  const [github, setGithub] = useState('')
  const [discord, setDiscord] = useState('')
  const [error, setError] = useState({})
  const [deadline, setDeadline] = useState('')

  // buildproject2 (BuildProject2.jsx) 관련 state
  const [files, setFiles] = useState([])

  // buildproject3 (BuildProject3.jsx) 관련 state
  const [rows, setRows] = useState([
    {
      id: 1,
      name: '홍길동',
      githubId: 'hong-gildong',
      profileImg: 'https://avatars.githubusercontent.com/u/66457807?v=4',
      field: 'frontend'
    },
    {
      id: 2,
      name: '김철수',
      githubId: 'kimcs',
      profileImg: '',
      field: ''
    },
    {
      id: 3,
      name: '이영희',
      githubId: 'lee-younghee',
      profileImg: '',
      field: ''
    }
  ])
  const [search, setSearch] = useState('')
  const searchOptions = [
    { value: 'apple', label: '사과' },
    { value: 'apple1', label: '사과1' },
    { value: 'apple2', label: '사과2' },
    { value: 'apple3', label: '사과3' },
    { value: 'apple4', label: '사과4' },
    { value: 'apple5', label: '사과5' },
    { value: 'apple6', label: '사과6' },
    { value: 'apple7', label: '사과7' },
    { value: 'apple8', label: '사과8' },
    { value: 'apple9', label: '사과9' },
    { value: 'banana', label: '바나나' },
    { value: 'orange', label: '오렌지' },
    { value: 'grape', label: '포도' },
    { value: 'melon', label: '멜론' }
  ]

  const navigate = useNavigate()

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
              options={[
								  { value: '', label: 'Select team member' },
								  { value: '1주', label: '1주' },
								  { value: '2주', label: '2주' },
								  { value: '1개월', label: '1개월' }
              ]}
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
          {/* buildproject2 (파일 테이블) */}
          <TableWrapper>
            <FileTable files={files} setFiles={setFiles} />
          </TableWrapper>
          {/* buildproject3 (팀원 검색 및 테이블) */}
          <SearchInputField
            label='팀원 검색'
            value={search}
            onChange={e => setSearch(e.target.value)}
            options={searchOptions}
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
            <Button text='완료' type='button' onClick={() => navigate('/')} />
          </ButtonGroup>
        </Fieldset>
      </Section>
    </MainBox>
  )
}
