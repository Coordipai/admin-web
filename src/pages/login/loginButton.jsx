import { ButtonBase } from '../../styles/globalStyle' // ButtonBase가 정의된 경로에 따라 조정

export default function GitHubLoginButton({ onClick }) {
  return (
    <ButtonBase $isHighlighted={true} onClick={onClick}>
      GitHub 계정으로 로그인
    </ButtonBase>
  )
}
