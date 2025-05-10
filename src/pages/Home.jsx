import { useState } from 'react'
import InputField from '@components/Edit/InputField'
import styled, { useTheme } from 'styled-components'
import Typography from '@components/Edit/Typography'
import DropDown from '@components/Edit/DropDown'
import FileTable from '@components/Edit/FileTable'
import SearchInputField from '@components/Edit/SearchInputField'
import Button from '@components/Common/Button'
import { HorizontalDivider, MainBox } from '@styles/globalStyle'

import { useNavigate } from 'react-router-dom'
import Header from '@components/Header'

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

function ProjectCard ({ name, createdAt, updatedAt, onClick, selected }) {
  return (
    <Card onClick={onClick} selected={selected}>
      <Typography variant='displayXS' weight='semiBold' value={name} />
      <Typography variant='textMD' weight='medium' color='gray500' value={`${createdAt} ~ ${updatedAt}`} />
    </Card>
  )
}

export const Home = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const [projects] = useState([
    { id: 1, name: '프로젝트1', createdAt: '2021-01-01', updatedAt: '2021-01-01' },
    { id: 2, name: '프로젝트2', createdAt: '2021-01-01', updatedAt: '2021-01-01' },
    { id: 3, name: '프로젝트3', createdAt: '2021-01-01', updatedAt: '2021-01-01' }
  ])
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  const filteredProjects = search
    ? projects.filter(project =>
      project.name.includes(search)
    )
    : projects

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
                {...project}
                selected={selectedId === project.id}
                onClick={() => {
								  setSelectedId(project.id)
                  navigate(`/project/${project.id}`)
                }}
              />
            ))}
          </div>
        </Fieldset>
      </Section>
    </MainBox>
  )
}
