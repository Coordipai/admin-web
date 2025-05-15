import { useEffect, useState } from 'react'
import InputField from '@components/Edit/InputField'
import styled, { useTheme } from 'styled-components'
import Typography from '@components/Edit/Typography'
import DropDown from '@components/Edit/DropDown'
import FileTable from '@components/Edit/FileTable'
import SearchInputField from '@components/Edit/SearchInputField'
import Button from '@components/Common/Button'
import { HorizontalDivider, MainBox } from '@styles/globalStyle'
import { useProjectStore } from '@store/useProjectStore'
import { extractDate } from '@utils/dateUtils'

import { useNavigate } from 'react-router-dom'
import Header from '@components/Header'
import { api } from '../hooks/useAxios'
import { useUserStore, useAccessTokenStore, useRefreshTokenStore } from '@store/useUserStore'

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
  const accessToken = useAccessTokenStore(state => state.accessToken)
  const setUser = useUserStore(state => state.setUser)
  const setAccessToken = useAccessTokenStore(state => state.setAccessToken)
  const setRefreshToken = useRefreshTokenStore(state => state.setRefreshToken)
  const refreshToken = useRefreshTokenStore(state => state.refreshToken)

  const [projects, setProjects] = useState([])  // 프로젝트 목록 

  useEffect(() => {
    const loginAndFetchProjects = async () => {
      try {
        // 1. 로그인 요청 (쿠키 기반)
        let loginData = null
        try {
          const loginRes = await api.post('/auth/login', {}, { withCredentials: true })
          loginData = loginRes.data?.content?.data
          if (loginData) {
            setUser(loginData.user)
            setAccessToken(loginData.access_token)
            setRefreshToken(loginData.refresh_token)
          }
        } catch {
          // 로그인 실패 시 refresh 시도
          if (refreshToken) {
            try {
              const refreshRes = await api.post('/auth/refresh', {
                refresh_token: refreshToken
              })
              const refreshData = refreshRes.data?.content?.data
              if (refreshData) {
                setUser(refreshData.user)
                setAccessToken(refreshData.access_token)
                setRefreshToken(refreshData.refresh_token)
                loginData = refreshData
              } else {
                navigate('/login')
                return
              }
            } catch {
              navigate('/login')
              return
            }
          } else {
            navigate('/login')
            return
          }
        }

        // 2. 프로젝트 목록 요청 (로그인/리프레시 후 토큰 사용)
        let tokenToUse = loginData?.access_token || accessToken
        let projectRes
        try {
          projectRes = await api.get('/project', {
            headers: {
              Authorization: `Bearer ${tokenToUse}`
            }
          })
        } catch (err) {
          // 401 에러 시 토큰 갱신
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
                // 갱신된 토큰으로 재요청
                projectRes = await api.get('/project', {
                  headers: {
                    Authorization: `Bearer ${refreshData.access_token}`
                  }
                })
              } else {
                navigate('/login')
                return
              }
            } catch {
              navigate('/login')
              return
            }
          } else {
            navigate('/login')
            return
          }
        }
        const data = projectRes?.data?.content?.data || []
        setProjects(data)

        console.log(data)
      } catch {
        navigate('/login')
      }
    }
    loginAndFetchProjects()
  }, [])

  
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
          <Button text='프로젝트 생성' onClick={()=>{navigate('/buildproject')}} />
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
                  // setProject(project)
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
