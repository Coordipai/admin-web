import styled from 'styled-components'
import coordipaiLogo from '../../assets/coordipaiLogo.png'
import githubLogo from '../../assets/gitHubLogo.png'
import CheckLineGraphic from './CheckLineGraphic'
import GitHubLoginButton from './loginButton'

const Title = styled.h2`
  ${({ theme }) => theme.texts.displayMD};
  font-weight: ${({ theme }) => theme.weights.semiBold};
  //font-family: 'Poppins', sans-serif;
`

// 화면 정중앙 위치하게하는 wrapper
const LoginWrapper = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`
// LogoRow 와 text, 로그인 버튼 감싸는 wrapper
const ContentBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`

// 로고, 체크라인, 로고 배치 wrapper
const LogoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
`

export default function LoginPage() {
  return (
    <LoginWrapper>
      <ContentBox>
        <LogoRow>
          <img src={coordipaiLogo} alt="CoordiPAI Logo" width="100" height="100" />
          <CheckLineGraphic />
          <img src={githubLogo} alt="GitHub Logo" width="100" height="100" />
        </LogoRow>

        <h2 style={{ fontSize: '36px'}} >
          Authorize GitHub
        </h2>

        <GitHubLoginButton onClick={() => console.log('로그인 시도')} />
      </ContentBox>
    </LoginWrapper>
  )
}
