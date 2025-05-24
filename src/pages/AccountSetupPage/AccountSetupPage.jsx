import { useState } from 'react'
import styled from 'styled-components'
import Header from '@components/Header'
import FormInput from '@components/FormInput'
import DropDown from '@components/Edit/DropDown'
import FormTextarea from '@components/FormTextarea'
import { ButtonBase } from '@styles/globalStyle'
import { useNavigate, useParams } from 'react-router-dom'
import { useUserStore, useAccessTokenStore, useRefreshTokenStore } from '@store/useUserStore'
import  api  from '@hooks/useAxios'
import { categoryOptions } from '@constant/options'
import Toast from '@utils/Toast'

const BASE_URL = import.meta.env.VITE_BASE_URL;


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
  gap: 0.5rem;
`
const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`

const LabelText = styled.span`
  ${({ theme }) => theme.texts.textMD};
  font-weight: ${({ theme }) => theme.weights.medium};
  color: ${({ theme }) => theme.colors.gray700};
`
const Textarea = styled(FormTextarea)`
  textarea {
    height: 1000px;
    overflow-y: auto;
  }
`
const Button = styled(ButtonBase)`
  width: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.texts.textSM};
`

export default function AccountSetupPage () {
  const { githubId } = useParams() // ← 여기에서 추출
  const [username, setUsername] = useState('')
  const [discordId, setDiscordId] = useState('')
  const [career, setCareer] = useState('')
  const [selectedField, setSelectedField] = useState('')
  const [error, setError] = useState({})
  const navigate = useNavigate()

  const handleNext = async () => {
    const newError = {}
    if (!username.trim()) newError.username = true
    if (!discordId.trim()) newError.discordId = true
    if (!career.trim()) newError.career = true
    if (!selectedField) newError.selectedField = true

    setError(newError)

    if (Object.keys(newError).length === 0) {
      const payload = {
        name: username,
        discord_id: discordId,
        category: selectedField || '',
        career: career,
      }

      try {
        const response = await api.post(`/auth/register`,payload)

        useUserStore.getState().setUser(response.user)
        useAccessTokenStore.getState().setAccessToken(response.access_token)
        useRefreshTokenStore.getState().setRefreshToken(response.refresh_token)
        navigate(`/repositorycheckpage/${githubId}`, { state: payload })
      } catch (error) {
        console.error('회원가입 실패:', error.response?.data || error.message)
        Toast('회원가입 중 오류가 발생했습니다.', 'error')
      }
    }
  }


  return (
    <FormWrapper>
      <Header text='계정 생성하기' />

      <FieldWrapper>
        <LabelText>사용자 이름</LabelText>
        <FormInput
          placeholder='이름을 입력해주세요'
          value={username}
          handleChange={(v) => {
            setUsername(v)
            if (error.username) setError((prev) => ({ ...prev, username: false }))
          }}
        />
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
        <FormInput
          placeholder='디스코드 ID'
          value={discordId}
          handleChange={(v) => {
            setDiscordId(v)
            if (error.discordId) setError((prev) => ({ ...prev, discordId: false }))
          }}
        />
      </FieldWrapper>

      <FieldWrapper>
        <LabelText>분야 선택</LabelText>
        <DropDown
          placeholder='분야 선택'
          options={categoryOptions}
          value={selectedField}
          onChange={(v) => {
            setSelectedField(v)
            if (error.selectedField) setError((prev) => ({ ...prev, selectedField: false }))
          }}
        />
      </FieldWrapper>

      <FieldWrapper>
        <LabelText>간단한 경력을 입력해주세요.</LabelText>
        <Textarea
          placeholder='ex. 사이드 프로젝트 2회 경험'
          value={career}
          onChange={(v) => {
            setCareer(v)
            if (error.career) setError((prev) => ({ ...prev, career: false }))
          }}
        />
      </FieldWrapper>

      <ButtonWrapper>
        <Button $isHighlighted type='button' onClick={handleNext}>
          다음
        </Button>
      </ButtonWrapper>
    </FormWrapper>
  )
}
