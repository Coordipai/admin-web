import { useState, useEffect } from 'react'
import styled from 'styled-components'
import Header from '@components/Header'
import FormInput from '@components/FormInput'
import DropDown from '@components/Edit/DropDown'
import FormTextarea from '@components/FormTextarea'
import { ButtonBase } from '@styles/globalStyle'
import { useAccessTokenStore, useUserStore } from '@store/useUserStore'
import { useNavigate } from 'react-router-dom'
import  api  from '@hooks/useAxios'
import { categoryOptions } from '@constant/options'
import toastMsg from '@utils/toastMsg'
import ConfirmModal from '@components/ConfirmModal'

const PageContainer = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  overflow-y: auto;
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

const BASE_URL = import.meta.env.VITE_BASE_URL;


export default function UserPage () {
  const navigate = useNavigate()
  //const { githubId } = useParams() // 여기서 param으로 받아오기
  const [githubId, setGithubId] = useState('') // 초기값으로 사용
  const [githubName, setGithubName] = useState('')
  const [repoList, setRepoList] = useState([])
  const [username, setUsername] = useState('')
  const [discordId, setDiscordId] = useState('')
  const [career, setCareer] = useState('')
  const [selectedRepos, setSelectedRepos] = useState([])
  const accessToken = useAccessTokenStore((state) => state.accessToken)

 const user = useUserStore((state) => state.user)

 useEffect(() => {
  if (!user || !accessToken) return

  console.log("accessToken before fetch:", accessToken) // 🔍 이게 undefined면 문제

  // fetchRepos 실행
  }, [user, accessToken])

  useEffect(() => {
    if (!user || !accessToken) {
      toastMsg('로그인이 필요합니다.', 'warning')
      navigate('/login')
      return
    }

  setGithubName(user.github_name|| '')
  setGithubId(user.github_id || '')
  setUsername(user.name || '')
  setDiscordId(user.discord_id || '')
  setCareer(user.career || '')
  setField(user.category || '')

  const fetchRepos = async () => {
    try {
      // 🔹 선택된 레포 불러오기
      const selectedRes = await api.get(`/user-repo`)
      const selected = selectedRes.map((r) => r.repo_fullname)

      // 🔹 GitHub의 전체 레포 불러오기
      const allRes = await api.get(`/user-repo/github`)
      const all = allRes.map((r) => r.repo_fullname)

      // 상태에 반영
      setRepoList(all)
      setSelectedRepos(selected)
    } catch (error) {
      console.error('레포지토리 불러오기 실패:', error)
    }
  }

  fetchRepos()
}, [user, accessToken, navigate])


  const [field, setField] = useState('')
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)

  

  
  const handleSave = async () => {
    try {
      const payload = {
        name: username,
        discord_id: discordId,
        career,
        category: field || '',
      }
      // 기본 정보 저장
      await api.put(`/auth/update`, payload)

    const repoPayload = selectedRepos.map((repo) => ({ repo_fullname: repo }))
    await api.post(`/user-repo`, repoPayload)

    // 저장 후 상태 갱신
    const updatedUser = {
      ...user,
      name: username,
      discord_id: discordId,
      career,
      category: field,
    }

    useUserStore.getState().setUser(updatedUser)
 
      toastMsg('정보가 성공적으로 저장되었습니다!', 'success')
    }catch (error) {
      console.error('❌ 저장 실패:', error)
      toastMsg('저장 중 오류가 발생했습니다.', 'error')
    }
  }

 const handleWithdraw = async () => {
   try {
     const response = await api.delete(`/auth/unregister`)
     console.log('✅ 탈퇴 성공:', response.data)
     toastMsg('탈퇴가 완료되었습니다.', 'success')
     useUserStore.getState().clearUser()
     useAccessTokenStore.getState().clearAccessToken()
     navigate('/login')
   } catch (error) {
     console.error('❌ 탈퇴 실패:', error)
     toastMsg('탈퇴 중 오류가 발생했습니다.', 'error')
   }
 }



const handleEvaluationRequest = async () => {
  try {
    const response = await api.post(`/agent/assess_stat`,{})
    console.log('✅ 평가 결과:', response)
    toastMsg('평가 요청이 완료되었습니다!', 'success')
  } catch (error) {
    console.error('❌ 평가 요청 실패:', error)
    toastMsg('평가 요청 중 오류가 발생했습니다.', 'error')
  }
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
            <FormInput placeholder='이름을 입력해주세요' value={username} handleChange={(v) => {
              setUsername(v)
            }} />
            </FieldWrapper>

          <FieldWrapper>
            <LabelText>GitHub 계정이름</LabelText>
            <FormInput
              placeholder='깃허브 계정'
              value={githubName}
              readOnly
            />
          </FieldWrapper>

          <FieldWrapper>
            <LabelText>Discord ID</LabelText>
            <FormInput placeholder='디스코드 ID' value={discordId} handleChange={(v) =>{
              setDiscordId(v)
            }} />
           </FieldWrapper>

          <FieldWrapper>
            <LabelText>분야 선택</LabelText>
            <DropDown
              placeholder='분야 선택'
              options={categoryOptions}
              value={field}
              onChange={(v) => {
                setField(v)
            }}
            />
          </FieldWrapper>

          <FieldWrapper>
            <LabelText>간단한 경력을 입력해주세요.</LabelText>
            <FormTextarea placeholder='ex. 사이드 프로젝트 2회 경험' value={career} onChange={setCareer} />
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
            <TextButton $isHighlighted onClick={() => setShowWithdrawModal(true)}>
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
      {showWithdrawModal && (
        <ConfirmModal
          text='정말로 탈퇴하시겠습니까?'
          setShowModal={setShowWithdrawModal}
          handleConfirm={handleWithdraw}
        />
      )}
    </PageContainer>
  )
}
