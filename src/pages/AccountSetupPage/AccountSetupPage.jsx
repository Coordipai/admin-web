import { useState } from 'react'
import styled from 'styled-components'
import Header from '@components/Header'
import FormInput from '@components/FormInput'
import FormDropdown from '@components/FormDropdown'
import FormTextarea from '@components/FormTextarea'
import { ButtonBase } from '@styles/globalStyle'
import { useNavigate } from 'react-router-dom'



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
  {({ theme }) => theme.texts.textMD};
  font-weight: {({ theme }) => theme.weights.medium};
  color: {({ theme }) => theme.colors.gray700};
`
const Textarea = styled(FormTextarea)`
  textarea {
    height: 1000px;
    overflow-y: auto;
  }
`
const Button = styled(ButtonBase)`
  width: 110px;                  // 원하는 너비
  display: flex;                // 혹시 ButtonBase가 안 가지고 있다면 안전하게 다시 선언
  align-items: center;          // 세로 중앙 정렬
  justify-content: center;      // 가로 중앙 정렬
  ${({ theme }) => theme.texts.textSM};
`

export default function AccountSetupPage() {
  const [username, setUsername] = useState('')
  const [githubId, setGithubId] = useState('my-github-id') // OAuth 결과로 들어온 값
  const [discordId, setDiscordId] = useState('')
  const [career, setCareer] = useState('')
  const [selectedField, setSelectedField] = useState(-1)
  const navigate = useNavigate()
  const handleNext = () => {
    const formData = {
      username,
      githubId,
      discordId,
      career,
      field: fieldOptions[selectedField]?.title || '',
    }

    navigate('/repositorycheckpage', { state: formData })
  }

  const fieldOptions = [
    { title: '프론트엔드' },
    { title: '백엔드' },
    { title: '기획' },
    { title: '디자인' },
    { title: '기타' },
  ]
  
  return (
    <>
      <FormWrapper>
        <Header text="계정 생성하기" />
        <FieldWrapper>
          <LabelText>사용자 이름</LabelText>
          <FormInput placeholder="이름을 입력해주세요" value={username} handleChange={setUsername} />
        </FieldWrapper>

        <FieldWrapper>
          <LabelText>GitHub 계정이름</LabelText>
          <FormInput
            placeholder="깃허브 계정"
            value={githubId}
            handleChange={setGithubId}
            readOnly
          />
        </FieldWrapper>

        <FieldWrapper>
          <LabelText>Discord ID</LabelText>
          <FormInput placeholder="디스코드 ID" value={discordId} handleChange={setDiscordId} />
        </FieldWrapper>

        <FieldWrapper>
          <LabelText>분야 선택</LabelText>
          <FormDropdown
            placeholder="분야 선택"
            menus={fieldOptions}
            selectedMenu={selectedField}
            handleChange={setSelectedField}
          />
        </FieldWrapper>

        <FieldWrapper>
          <LabelText>간단한 경력을 입력해주세요.</LabelText>
          <Textarea
            placeholder="ex. 사이드 프로젝트 2회 경험"
            value={career}
            onChange={setCareer}  // 이렇게 직접 넘김
          />

          </FieldWrapper>

        <ButtonWrapper>
          <Button $isHighlighted onClick={handleNext}>
            다음
          </Button>
        </ButtonWrapper>

      </FormWrapper>
    </>
  )
}
