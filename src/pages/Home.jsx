import { useEffect, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import Typography from '@components/Edit/Typography'
import SearchInputField from '@components/Edit/SearchInputField'
import Button from '@components/Common/Button'
import { MainBox } from '@styles/globalStyle'
import { useProjectStore } from '@store/useProjectStore'
import { extractDate } from '@utils/dateUtils'

import { useNavigate } from 'react-router-dom'
import Header from '@components/Header'
import { useUserStore, useAccessTokenStore, useRefreshTokenStore } from '@store/useUserStore'
import api from '@hooks/useAxios'
import toastMsg from '@utils/toastMsg'
import useLoadingStore from '@store/useLoadingStore'

const Fieldset = styled.div`
	flex: 1;
	min-height: 0;
	max-height: 100%;
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.gap.xl};
	width: 100%;
	align-items: stretch;
	overflow-y: auto;
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

const Card = styled.div`
	border: 1px solid ${({ theme, selected }) => selected ? theme.colors.brand600 : theme.colors.gray300};
	border-radius: ${({ theme }) => theme.radius.lg};
	padding: ${({ theme }) => theme.padding.md};
	background: ${({ theme }) => theme.colors.white};
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.gap.md};
	box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
	transition: border 0.2s;
	cursor: pointer;

	&:hover {
		border: 1.5px solid ${({ theme }) => theme.colors.brand600};
	}
`

const CardTitle = styled.div`
	font-size: 1.5rem;
	font-weight: 500;
	color: #000;
	width: fit-content;
`

const CardDesc = styled.div`
	font-size: 1rem;
	color: #717680;
	width: fit-content;
`

function ProjectCard ({ name, start_date, end_date, onClick, selected }) {
  return (
    <Card onClick={onClick} selected={selected}>
      <Typography variant='displayXS' weight='semiBold' value={name} />
      <Typography 
        variant='textMD' 
        weight='medium' 
        color='gray500' 
        value={`${extractDate(start_date)} ~ ${extractDate(end_date)}`} 
      />
    </Card>
  )
}

export const Home = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const { setProject, clearProject } = useProjectStore();
  const setUser = useUserStore(state => state.setUser)
  const setAccessToken = useAccessTokenStore(state => state.setAccessToken)
  const setRefreshToken = useRefreshTokenStore(state => state.setRefreshToken)
  const refreshToken = useRefreshTokenStore(state => state.refreshToken)
  const [isLoggedIn,setIsLoggedIn] = useState(false)

  const [projects, setProjects] = useState([])  // 프로젝트 목록 

  // 로그인 처리
  useEffect(() => {
    const login = async () => {
      try {
        const loginRes = await api.post('/auth/login')
        
        if (!loginRes) {
          throw new Error('Login failed')
        }

        setUser(loginRes.user)
        setAccessToken(loginRes.access_token)
        setRefreshToken(loginRes.refresh_token)
      } catch {
        toastMsg('로그인 실패', 'error')
      }
    }
    if(!refreshToken){
      login()
      setIsLoggedIn(true)
    }
      
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps

  // 로그인 성공 후 프로젝트 목록 요청
  useEffect(() => {
    const fetchProjects = async () => {
      if (!refreshToken) return

      try {
        useLoadingStore.getState().setLoading(true)
        const data = await api.get('/project')
        setProjects(data || [])
      } catch {
        toastMsg('프로젝트 조회 실패', 'error')
      } finally {
        useLoadingStore.getState().setLoading(false)
      }
    }
    fetchProjects()
  }, [isLoggedIn])  // eslint-disable-line react-hooks/exhaustive-deps

  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  const filteredProjects = search
    ? projects.filter(project =>
      project.name.includes(search)
    )
    : projects

  useEffect(() => {
    clearProject()  
  }, [])  // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <MainBox>
      <Header text='프로젝트' />
      <Section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ width: '40%' }}>
            <SearchInputField
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder='프로젝트를 검색하세요'
            />
          </div>
          <Button variant='contained'onClick={()=>{navigate('/buildproject')}} >프로젝트 생성</Button>
        </div>

        <Fieldset>
          <div style={{ display: 'flex', gap: theme.gap.lg, flexWrap: 'wrap' }}>
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                name={project.name}
                start_date={project.start_date}
                end_date={project.end_date}
                selected={selectedId === project.id}
                onClick={() => {
                  setSelectedId(project.id)
                  setProject(project.id)
                  navigate(`/project/${project.id}#issue`)
                }}
              />
            ))}
          </div>
        </Fieldset>
      </Section>
    </MainBox>
  )
}
