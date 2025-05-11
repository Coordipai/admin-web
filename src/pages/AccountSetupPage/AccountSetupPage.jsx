import { useState, useEffect } from 'react'
import styled from 'styled-components'
import Header from '@components/Header'
import FormInput from '@components/FormInput'
import FormDropdown from '@components/FormDropdown'
import FormTextarea from '@components/FormTextarea'
import { ButtonBase } from '@styles/globalStyle'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

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
  const [selectedField, setSelectedField] = useState(-1)
  const [error, setError] = useState({})
  const navigate = useNavigate()

  const fieldOptions = [
    { title: '프론트엔드' },
    { title: '백엔드' },
    { title: '기획' },
    { title: '디자인' },
    { title: '기타' }
  ]

  // GitHub 로그인 이후, /register/:githubId 에 도달했을 때
  useEffect(() => {
    const login = async () => {
      try {
        const res = await axios.post(
          'https://coordipai-web-server.knuassignx.site/auth/login',
          {},
          {
            withCredentials: true
          }
        )
        const token = res.data?.content?.data?.access_token
        if (token) {
          localStorage.setItem('accessToken', token)
          console.log('🔐 Access token 저장됨!')
        }
      } catch (err) {
        console.error('access token 요청 실패', err)
      }
    }

    login()
  }, [])

  const handleNext = async () => {
    const newError = {}
    if (!username.trim()) newError.username = true
    if (!discordId.trim()) newError.discordId = true
    if (!career.trim()) newError.career = true
    if (selectedField === -1) newError.selectedField = true

    setError(newError)

      if (Object.keys(newError).length === 0) {
        const payload = {
          name: username,
          discord_id: Number(discordId),
          category: fieldOptions[selectedField].title || '',
          career,
        }
        try {
          const response = await axios.post(
            'https://coordipai-web-server.knuassignx.site/auth/register',
            payload,
            {
              withCredentials: true, // access_token 쿠키 포함
            }
          )

          console.log('회원가입 성공:', response.data)
          navigate('/repositorycheckpage', { state: payload })

        } catch (error) {
            console.error('회원가입 실패:', error.response?.data || error.message)
            alert('회원가입 중 오류가 발생했습니다.')
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
        <FormDropdown
          placeholder='분야 선택'
          menus={fieldOptions}
          selectedMenu={selectedField}
          handleChange={(v) => {
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
