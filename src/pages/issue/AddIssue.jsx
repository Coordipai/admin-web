import React from "react";
import Badge from "@components/Edit/Badge";
import InputField from "@components/Edit/InputField";
import Typography from "@components/Edit/Typography";
import Header from "@components/Header";
import styled from "styled-components";
import {
  PageBox,
  MainBox,
  ContainerBox,
  ButtonBase,
} from "@styles/globalStyle";

// 셀렉트 박스 커스텀
const SelectBox = styled.select`
  width: 100%;
  padding: ${({ theme }) => `${theme.padding.sm} ${theme.padding.md}`};
  border: 0.0625rem solid ${({ theme }) => theme.colors.gray300};
  border-radius: 0.5rem;
  font-size: 1rem;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray900};
  margin-top: 0.5rem;
  ${({ theme }) => theme.texts.textMD}
`;

const Label = styled.div`
  font-weight: ${({ theme }) => theme.weights.semiBold};
  margin-bottom: 0.5rem;
  ${({ theme }) => theme.texts.textMD}
  color: ${({ theme }) => theme.colors.gray700};
`;

const AddIssue = () => {
  return (
    <MainBox>
        <Header text="이슈 추가" />
    <ContainerBox>
        <InputField label="이슈 타이틀" placeholder="이슈 제목을 입력해주세요." />
    </ContainerBox>
    </MainBox>
  );
};

export default AddIssue;
