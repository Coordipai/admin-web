import { useEffect, useState } from 'react'
import styled from 'styled-components'
import Header from '@components/Header'
import FormInput from '@components/FormInput'
import FormDropdown from '@components/FormDropdown'
import FormTextarea from '@components/FormTextarea'
import { ButtonBase } from '@styles/globalStyle'
import { useNavigate, useParams } from 'react-router-dom'
import  api  from '@hooks/useAxios'

const FormWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  overflow-y: auto;
`

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
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
  max-height: 480px;              // 높이 제한
  overflow-y: auto;               // 세로 스크롤 가능
  padding-right: 0.25rem;         // 스크롤바 안 가리도록 여유
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
const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function AccountSetupPage () {
  // 추가
  const { githubId } = useParams()
  const [selectedRepos, setSelectedRepos] = useState([])
  const [repoList, setRepoList] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        // zustand에서 access_token 꺼내기
        const res = await api.get(`/user-repo/github`)
        const repos = res.map((item) => item.repo_fullname).filter(Boolean)
        setRepoList(repos)
      } catch (error) {
        console.error('레포지토리 불러오기 실패: ', error)
        alert('레포지토리 목록을 불러오는 데 실패했습니다.')
      }
    }

    fetchRepos()
  }, [])

  const toggleRepo = (repo) => {
    setSelectedRepos((prev) =>
      prev.includes(repo)
        ? prev.filter((r) => r !== repo)
        : [...prev, repo]
    )
  }

  const handleCreateAccount = async () => {

    try{
      
      const repoPayload = selectedRepos.map(repo => ({ repo_fullname: repo }))
      const res = await api.post(`/user-repo`, repoPayload)

      console.log('레포 등록 성공: ', res)
      const combinedData = {
        name: '', // 필요 시 localStorage 등에서 복구
        githubId, // ← param으로 받은 githubId 사용
        repositories: selectedRepos
      }
      navigate(`/userform/${githubId}`, { state: combinedData })
    } catch (error) {
        console.error('레포 등록 실패: ', error.response || error.message)
        alert('레포 등록 중 오류가 발생했습니다.')
        }
    }


  return (
    <>
      <FormWrapper>
        <Header text='계정 생성하기' />

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
          <Button $isHighlighted onClick={handleCreateAccount}>
            계정 생성하기
          </Button>
        </ButtonWrapper>

      </FormWrapper>
    </>
  )
}
