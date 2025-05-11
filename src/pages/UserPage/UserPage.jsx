import { useState, useEffect } from 'react'
import styled from 'styled-components'
import Header from '@components/Header'
import FormInput from '@components/FormInput'
import FormDropdown from '@components/FormDropdown'
import FormTextarea from '@components/FormTextarea'
import { ButtonBase } from '@styles/globalStyle'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const PageContainer = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
`

const ContentArea = styled.div`
  flex: 1;
  padding: 2rem;
`

const FormWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow-y: auto;
  overflow-x: hidden; // x축 스크롤 제거
`

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
  gap: 10px;
`

const LabelText = styled.span`
  {({ theme }) => theme.texts.textMD};
  font-weight: {({ theme }) => theme.weights.medium};
  color: {({ theme }) => theme.colors.gray700};
`

const CheckboxList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 200px;              // 높이 제한
  overflow-y: auto;               // 세로 스크롤 가능
  padding-right: 0.25rem;         // 스크롤바 안 가리도록 여유
  width: 100%;
  box-sizing: border-box;
`

const RepositoryBox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  background-color: ${({ theme, $checked }) =>
    $checked ? theme.colors.brand200 : theme.colors.white};

  transition: background-color 0.2s ease;
`
const Button = styled(ButtonBase)`
  width: 110px;                  // 원하는 너비
  display: flex;                // 혹시 ButtonBase가 안 가지고 있다면 안전하게 다시 선언
  align-items: center;          // 세로 중앙 정렬
  justify-content: center;      // 가로 중앙 정렬
  ${({ theme }) => theme.texts.textSM};
`
const TextButton = styled(ButtonBase)`
  width: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: ${({ theme }) => theme.colors.brand500};
  border: none;
  box-shadow: none;

  &:hover {
    background: ${({ theme }) => theme.colors.brand50}; // 선택사항
  }
`

export default function UserPage () {
  const navigate = useNavigate()
  const { githubId } = useParams() // 여기서 param으로 받아오기

  const [repoList, setRepoList] = useState([])
  const [username, setUsername] = useState('')
  const [discordId, setDiscordId] = useState('')
  const [career, setCareer] = useState('')
  const [selectedRepos, setSelectedRepos] = useState([])


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        if (!token) {
          alert('로그인이 필요합니다.')
          navigate('/login')
          return
        }
        const userRes = await axios.get(
          `https://coordipai-web-server.knuassignx.site/auth/user/${githubId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        )

        const userData = userRes.data.content.data


        const repoRes = await axios.get('https://coordipai-web-server.knuassignx.site/user-repo', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        })
        const repos = repoRes.data.content.data.map((r) => r.repo_fullname)

        setUsername(userData.name || '')
        setDiscordId(userData.discord_id || '')
        setCareer(userData.career || '')
        setField(
        ['프론트엔드', '백엔드', '기획', '디자인', '기타'].findIndex(
            (f) => f === userData.category
          )
        )
        setSelectedRepos(repos)
        setRepoList(repos)
      } catch (error) {
        console.error('유저 정보 불러오기 실패:', error)
        alert('로그인이 필요합니다.')
        navigate('/login')
      }
    }

    fetchUser()
  }, [githubId, navigate])

  const fieldOptions = [
    { title: '프론트엔드' },
    { title: '백엔드' },
    { title: '기획' },
    { title: '디자인' },
    { title: '기타' }
  ]

  const [field, setField] = useState(-1)

  const handleSave = () => {
    const payload = {
      username,
      githubId,
      discordId,
      career,
      field: fieldOptions[field]?.title || '',
      repositories: selectedRepos
    }

    console.log('보낼 데이터:', payload)

    // axios.post('/api/endpoint', payload) 등으로 연결 가능
  }

  const handleWithdraw = () => {
    // 추후 API 연결을 위한 준비 작업
    const confirmed = window.confirm('정말로 탈퇴하시겠습니까?')
    if (confirmed) {
      console.log('탈퇴 처리 진행')
      // 예: axios.post('/api/user/delete', { githubId })
    }
  }

  const handleEvaluationRequest = () => {
    console.log('평가 요청 처리 진행')
    // 예: axios.post('/api/evaluation/request', { githubId, field })
  }

  const toggleRepo = (repo) => {
    setSelectedRepos((prev) =>
      prev.includes(repo)
        ? prev.filter((r) => r !== repo)
        : [...prev, repo]
    )
  }

  return (
    <PageContainer>
      <ContentArea>
        <FormWrapper>
          <Header text='계정 정보' />
          <FieldWrapper>
            <LabelText>사용자 이름</LabelText>
            <FormInput placeholder='이름을 입력해주세요' value={username} handleChange={setUsername} />
          </FieldWrapper>

          <FieldWrapper>
            <LabelText>GitHub 계정이름</LabelText>
            <FormInput
              placeholder='깃허브 계정'
              value={githubId}
              readOnly
            />
          </FieldWrapper>

          <FieldWrapper>
            <LabelText>Discord ID</LabelText>
            <FormInput placeholder='디스코드 ID' value={discordId} handleChange={setDiscordId} />
          </FieldWrapper>

          <FieldWrapper>
            <LabelText>분야 선택</LabelText>
            <FormDropdown
              placeholder='분야 선택'
              menus={fieldOptions}
              selectedMenu={field}
              handleChange={setField}
            />
          </FieldWrapper>

          <FieldWrapper>
            <LabelText>간단한 경력을 입력해주세요.</LabelText>
            <FormTextarea placeholder='ex. 사이드 프로젝트 2회 경험' value={career} handleChange={setCareer} />
          </FieldWrapper>

          <FieldWrapper>
            <LabelText>적용할 레포지토리</LabelText>

            <CheckboxList>
              {repoList.map((repo) => {
                const isChecked = selectedRepos.includes(repo)

                return (
                  <RepositoryBox key={repo} $checked={isChecked} onClick={() => toggleRepo(repo)}>
                    <input
                      type='checkbox'
                      checked={isChecked}
                      onChange={() => toggleRepo(repo)}
                    />
                    {repo}
                  </RepositoryBox>
                )
              })}
            </CheckboxList>
          </FieldWrapper>

          <ButtonWrapper>
            <TextButton $isHighlighted onClick={handleWithdraw}>
              탈퇴하기
            </TextButton>
            <Button $isHighlighted onClick={handleSave}>
              저장하기
            </Button>
            <Button $isHighlighted onClick={handleEvaluationRequest}>
              평가요청
            </Button>
          </ButtonWrapper>
        </FormWrapper>
      </ContentArea>
    </PageContainer>
  )
}
