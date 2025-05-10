import styled from 'styled-components'
import Typography from '@components/Edit/Typography'
import React, { useState, useEffect } from 'react'
import IssueTable from '@components/Edit/IssueTable'
import SearchInputField from '@components/Edit/SearchInputField'
import { MainBox, ButtonBase } from '@styles/globalStyle'
import { useNavigate, useLocation } from 'react-router-dom'

const HeaderSection = styled.div`
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.gap.md};
	width: 100%;
`

const HeaderRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	width: 100%;
`

const TitleBox = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
`

const TabsWrapper = styled.div`
	width: 100%;
	margin-top: 24px;
`

const TabsRow = styled.div`
	display: flex;
	gap: 16px;
`

const TabButton = styled.button`
	background: none;
	border: none;
	padding: 0;
	cursor: pointer;
	display: flex;
	flex-direction: column;
	align-items: center;
	outline: none;
`

const TabLabel = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 0px 4px 16px;
	font-family: Inter, sans-serif;
	font-weight: 600;
	font-size: 14px;
	color: ${({ $active, theme }) => $active ? theme.colors.brand500 : theme.colors.gray500};
	transition: color 0.2s;
`

const TabUnderline = styled.div`
	width: 100%;
	height: 4px;
	background: ${({ $active, theme }) => $active ? theme.colors.brand500 : 'transparent'};
	border-radius: 2px;
	transition: background 0.2s;
`

const TabsDivider = styled.div`
	width: 100%;
	height: 1px;
	background: ${({ theme }) => theme.colors.gray200};
	margin-top: 0;
`

const Fieldset = styled.div`
	max-height: 100%;
	display: flex;
	flex-direction: column;
	gap: ${({ theme }) => theme.gap.xl};
	width: 100%;
	align-items: stretch;
	overflow-y: auto;
	max-height: 100%;
	overflow-x: hidden;
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
	max-width: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 100%;
		max-height: 100%;
	gap: ${({ theme }) => theme.gap.xl};
	overflow-y: hidden;
	overflow-x: hidden;
`

const EmptyIssueWrapper = styled.div`
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: ${({ theme }) => theme.gap.md};
`

export const Project = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(() => {
    const hash = location.hash.replace('#', '')
    return hash === 'request' ? 'request' : 'issue'
  })

  // URL 해시에 따라 탭 상태 설정
  useEffect(() => {
    const hash = location.hash.replace('#', '')
    if (hash === 'request') {
      setActiveTab('request')
    } else {
      setActiveTab('issue')
      // 해시가 없거나 'issue'가 아닌 경우 'issue'로 설정
      if (!hash || hash !== 'issue') {
        navigate(`${location.pathname}#issue`, { replace: true })
      }
    }
  }, [location.hash, navigate, location.pathname])

  // 탭 변경 시 URL 해시 업데이트
  const handleTabChange = (tab) => {
    setActiveTab(tab)
    navigate(`${location.pathname}#${tab}`, { replace: true })
  }

  const [issueRows] = useState([
    { repo_fullname: '레포이름', issue_number: 1, title: '타이틀', body: '바디', assignee: '어사이니', priority: 'W', iteration: 1, labels: ['레이블1', '레이블2', '레이블3'] },
    { repo_fullname: '레포이름', issue_number: 1, title: '타이틀', body: '바디', assignee: '어사이니', priority: 'W', iteration: 1, labels: ['레이블1', '레이블2', '레이블3'] },
    { repo_fullname: '레포이름', issue_number: 1, title: '타이틀', body: '바디', assignee: '어사이니', priority: 'W', iteration: 1, labels: ['레이블1', '레이블2', '레이블3'] },
    { repo_fullname: '레포이름', issue_number: 1, title: '타이틀', body: '바디', assignee: '어사이니', priority: 'W', iteration: 1, labels: ['레이블1', '레이블2', '레이블3'] },
    { repo_fullname: '레포이름', issue_number: 1, title: '타이틀', body: '바디', assignee: '어사이니', priority: 'W', iteration: 1, labels: ['레이블1', '레이블2', '레이블3'] },
    { repo_fullname: '레포이름', issue_number: 1, title: '타이틀', body: '바디', assignee: '어사이니', priority: 'W', iteration: 1, labels: ['레이블1', '레이블2', '레이블3'] },
    { repo_fullname: '레포이름', issue_number: 1, title: '타이틀', body: '바디', assignee: '어사이니', priority: 'W', iteration: 1, labels: ['레이블1', '레이블2', '레이블3'] },
    { repo_fullname: '레포1이름', issue_number: 1, title: '타이틀', body: '바디', assignee: '어사이니', priority: 'W', iteration: 1, labels: ['레이블1', '레이블2', '레이블3'] },
    { repo_fullname: '레포이름', issue_number: 1, title: '타이틀', body: '바디', assignee: '어사이니', priority: 'W', iteration: 1, labels: ['레이블1', '레이블2', '레이블3'] },
    { repo_fullname: '레포이름', issue_number: 1, title: '타이틀', body: '바디', assignee: '어사이니', priority: 'W', iteration: 1, labels: ['레이블1', '레이블2', '레이블3'] },
    { repo_fullname: '레포이름', issue_number: 1, title: '타이틀', body: '바디', assignee: '어사이니', priority: 'W', iteration: 1, labels: ['레이블1', '레이블2', '레이블3'] },
    { repo_fullname: '레포이름', issue_number: 1, title: '타이틀', body: '바디', assignee: '어사이니', priority: 'W', iteration: 1, labels: ['레이블1', '레이블2', '레이블3'] },
    { repo_fullname: '레포이름', issue_number: 1, title: '타이틀', body: '바디', assignee: '어사이니', priority: 'W', iteration: 1, labels: ['레이블1', '레이블2', '레이블3'] },
    { repo_fullname: '레포이름', issue_number: 1, title: '타이틀', body: '바디', assignee: '어사이니', priority: 'W', iteration: 1, labels: ['레이블1', '레이블2', '레이블3'] },
    { repo_fullname: '레포이름', issue_number: 1, title: '타이틀', body: '바디', assignee: '어사이니', priority: 'W', iteration: 1, labels: ['레이블1', '레이블2', '레이블3'] },
    { repo_fullname: '레포이름', issue_number: 1, title: '타이틀', body: '바디', assignee: '어사이니', priority: 'W', iteration: 1, labels: ['레이블1', '레이블2', '레이블3'] },
    { repo_fullname: '레포이름', issue_number: 1, title: '타이틀', body: '바디', assignee: '어사이니', priority: 'W', iteration: 1, labels: ['레이블1', '레이블2', '레이블3'] },
    { repo_fullname: '레포이름', issue_number: 1, title: '타이틀', body: '바디', assignee: '어사이니', priority: 'W', iteration: 1, labels: ['레이블1', '레이블2', '레이블3'] },
    { repo_fullname: '레포이름', issue_number: 1, title: '타이틀', body: '바디', assignee: '어사이니', priority: 'W', iteration: 1, labels: ['레이블1', '레이블2', '레이블3'] },
    { repo_fullname: '레포이름', issue_number: 1, title: '타이틀', body: '바디', assignee: '어사이니', priority: 'W', iteration: 1, labels: ['레이블1', '레이블2', '레이블3'] },
    { repo_fullname: '레포이름', issue_number: 1, title: '타이틀', body: '바디', assignee: '어사이니', priority: 'W', iteration: 1, labels: ['레이블1', '레이블2', '레이블3'] },

    { repo_fullname: '레포이름', issue_number: 1, title: '타이틀', body: '바디', assignee: '어사이니', priority: 'W', iteration: 1, labels: ['레이블1', '레이블2', '레이블3'] }
  ])
  const [search, setSearch] = useState('')
  const [requestSearch, setRequestSearch] = useState('')
  const [requestRows] = useState([
    { repo_fullname: '레포이름', issue_number: 2, title: '변경요청 ㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴ타이틀', body: '변경ㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴㄴ요청 바디', assignee: '담당자', priority: 'S', iteration: 2, labels: ['요청1', '요청2'] }
    // 필요시 더미 데이터 추가
  ])
  const filteredRows = search
    ? issueRows.filter(row =>
      row.title.includes(search) ||
			row.body.includes(search) ||
			row.assignee.includes(search) ||
			row.repo_fullname.includes(search)
    )
    : issueRows
  const filteredRequestRows = requestSearch
    ? requestRows.filter(row =>
      row.title.includes(requestSearch) ||
			row.body.includes(requestSearch) ||
			row.assignee.includes(requestSearch) ||
			row.repo_fullname.includes(requestSearch)
    )
    : requestRows
  const [page, setPage] = useState(1)

  return (
    <MainBox>
      <HeaderSection>
        <HeaderRow>
          <Typography variant='displayXS' weight='semiBold' color='gray700' value='대시보드' />
          <ButtonBase
            $isHighlighted
            onClick={() => navigate(`${location.pathname}/edit`)}
          >
            프로젝트 설정
          </ButtonBase>
        </HeaderRow>
        <TabsWrapper>
          <TabsRow>
            <TabButton onClick={() => handleTabChange('issue')}>
              <TabLabel $active={activeTab === 'issue'}>
                <Typography variant='textSM' weight='semiBold' color={activeTab === 'issue' ? 'brand500' : 'gray700'} value='이슈 목록' />
              </TabLabel>
              <TabUnderline $active={activeTab === 'issue'} />
            </TabButton>
            <TabButton onClick={() => handleTabChange('request')}>
              <TabLabel $active={activeTab === 'request'}>
                <Typography variant='textSM' weight='semiBold' color={activeTab === 'request' ? 'brand500' : 'gray700'} value='변경 요청 목록' />
              </TabLabel>
              <TabUnderline $active={activeTab === 'request'} />
            </TabButton>
          </TabsRow>
          <TabsDivider />
        </TabsWrapper>
      </HeaderSection>

      <Section>
        {activeTab === 'issue' && (
          <Fieldset>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ width: '40%' }}>
                <SearchInputField
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder='이슈를 검색하세요'
                />
              </div>
              <ButtonBase
                $isHighlighted={false}
                onClick={() => navigate(`${location.pathname}/issue/new`)}
              >
                이슈 추가
              </ButtonBase>
            </div>
            <IssueTable
              rows={filteredRows.length > 0 ? filteredRows : []}
              page={page}
              onPageChange={setPage}
              variant='issue'
            />
          </Fieldset>
        )}
        {activeTab === 'request' && (
          <Fieldset>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ width: '40%' }}>
                <SearchInputField
                  value={requestSearch}
                  onChange={e => setRequestSearch(e.target.value)}
                  placeholder='변경 요청을 검색하세요'
                />
              </div>
            </div>
            <IssueTable
              rows={filteredRequestRows.length > 0 ? filteredRequestRows : []}
              page={page}
              onPageChange={setPage}
              variant='request'
            />
          </Fieldset>
        )}
      </Section>
    </MainBox>
  )
}
