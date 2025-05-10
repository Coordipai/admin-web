import styled from "styled-components";
import { ButtonBase, styledIcon } from "@styles/globalStyle";
import { ArrowLeft } from "@untitled-ui/icons-react";
import { useNavigate } from "react-router-dom";

const ContainerBox = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3rem;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const TextHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const ErrorCodeText = styled.span`
  ${({ theme }) => theme.texts.textMD};
  font-weight: ${({ theme }) => theme.weights.medium};
  color: ${({ theme }) => theme.colors.gray700};
`;

const ErrorTitleText = styled.div`
  ${({ theme }) => theme.texts.displayXL};
  font-weight: ${({ theme }) => theme.weights.semiBold};
  color: ${({ theme }) => theme.colors.gray900};
`;

const ErrorMessageText = styled.div`
  ${({ theme }) => theme.texts.textXL};
  font-weight: ${({ theme }) => theme.weights.regular};
  color: ${({ theme }) => theme.colors.gray600};
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const ArrowLeftIcon = styledIcon({ icon: ArrowLeft, strokeColor: "#344054" });

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <ContainerBox>
      <TextContainer>
        <TextHeader>
          <ErrorCodeText>404 error</ErrorCodeText>
          <ErrorTitleText>페이지를 찾을 수 없습니다</ErrorTitleText>
        </TextHeader>
        <ErrorMessageText>
          찾으시려는 페이지는 삭제되거나 없는 페이지입니다
        </ErrorMessageText>
      </TextContainer>
      <ButtonContainer>
        <ButtonBase onClick={() => navigate(-1)}>
          <ArrowLeftIcon />
          뒤로가기
        </ButtonBase>
        <ButtonBase $isHighlighted={true} onClick={() => navigate("/")}>
          홈으로 이동
        </ButtonBase>
      </ButtonContainer>
    </ContainerBox>
  );
};

export default NotFoundPage;
