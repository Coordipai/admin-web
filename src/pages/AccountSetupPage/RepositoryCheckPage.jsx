import { useState } from 'react'
import styled from 'styled-components'
import Header from '@components/Header'
import FormInput from '@components/FormInput'
import FormDropdown from '@components/FormDropdown'
import FormTextarea from '@components/FormTextarea'
import { ButtonBase } from '@styles/globalStyle'
import { useLocation, useNavigate } from 'react-router-dom'

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

export default function AccountSetupPage () {
  const [selectedRepos, setSelectedRepos] = useState([])
  const location = useLocation()
  const navigate = useNavigate()
  const formData = location.state // 이전 페이지에서 전달된 데이터

  const toggleRepo = (repo) => {
    setSelectedRepos((prev) =>
      prev.includes(repo)
        ? prev.filter((r) => r !== repo)
        : [...prev, repo]
    )
  }

  const handleCreateAccount = () => {
    const combinedData = {
      ...formData,
      repositories: selectedRepos
    }

    navigate('/userform', { state: combinedData }) // 다음 페이지로 이동하면서 데이터 전달
    console.log('보낼 데이터:', combinedData)

    // axios.post('/api/endpoint', payload) 등으로 연결 가능

    console.log(combinedData)
  }

  const repoList = [
    'coordipai/admin-web',
    'coordipai/admin-api',
    'coordipai/landing-page',
    '레포1111',
    '레포22',
    '레포3333333',
    '레포14231423342432',
    '레포1234125253125',
    'sdfadafaffdasdfsafsd',
    'asdfasdfasdfasdfasdfas',
    'asdfasdfasdfasdfasdfasdf',
    'asdfasdfasdfasfddfasfsdafdsfd',
    'assssssssbbbbbbbaaaaaaaaa'
  ]

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
