import InputField from '@components/Edit/InputField'
import styled from 'styled-components'
import Typography from '@components/Edit/Typography'
import DropDown from '@components/Edit/DropDown'
import FileTable from '@components/Edit/FileTable'
import Button from '@components/Common/Button'
import React, { useState } from 'react'
import IconButton from '@components/Common/IconButton'
import UserTable from '@components/Edit/UserTable'
import SearchInputField from '@components/Edit/SearchInputField'
import { HorizontalDivider, MainBox } from '@styles/globalStyle'
import { useNavigate } from 'react-router-dom'
import Header from '@components/Header'

const Fieldset = styled.div`
	max-height: 100%;
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.gap.xl};
	width: 100%;
	align-items: stretch;
	overflow-y: auto;
`

const DropDownWrapper = styled.div`
	display: flex;
	gap: ${({ theme }) => theme.gap.xl};
	width: 100%;
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
	gap: ${({ theme }) => theme.gap.xl};
	overflow-y: hidden;
	overflow-x: hidden;
`

export const BuildProject3 = () => {
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
  const navigate = useNavigate()
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

  return (
    <MainBox>
      <Header text='프로젝트 생성' />
      <Section>
        <Fieldset>
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
          <UserTable rows={rows} setRows={setRows} />
        </Fieldset>

        <ButtonGroup>
          <Button text='취소' type='button' onClick={() => navigate(-1)} />
          <Button text='완료' type='submit' />
        </ButtonGroup>
      </Section>
    </MainBox>
  )
}
