import { ButtonBase } from '../../styles/globalStyle' // ButtonBase가 정의된 경로에 따라 조정
import styled from 'styled-components'
//import color from '../../styles/theme'


const GitHubButton = styled(ButtonBase)`
  width: 300px;                  // 원하는 너비
  display: flex;                // 혹시 ButtonBase가 안 가지고 있다면 안전하게 다시 선언
  align-items: center;          // 세로 중앙 정렬
  justify-content: center;      // 가로 중앙 정렬
  ${({ theme }) => theme.texts.textXL};
  //font-weight: ${({ theme }) => theme.weights.semiBold};
  //fontFamily: 'Poppins'
`

export default function GitHubLoginButton({ onClick }) {
  return (
    <GitHubButton $isHighlighted={true} onClick={onClick}>
      GitHub 계정으로 로그인
    </GitHubButton>
  )
}
