// IssueDetailModal.jsx
import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import FormInput from '@components/FormInput'
import FormTextarea from '@components/FormTextarea'

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`

const ModalContainer = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  width: 520px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`

const HeaderText = styled.span`
  {({ theme }) => theme.texts.displaySM};
  font-weight: {({ theme }) => theme.weights.medium};
`

const InputRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  
`

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
`

const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
`

const LabelText = styled.span`
  {({ theme }) => theme.texts.textSM};
  font-weight: {({ theme }) => theme.weights.medium};
  color: {({ theme }) => theme.colors.gray700};
`

const IssueDetailModal = ({ title, assignee, period, description, onClose }) => {
  return (
    <ModalOverlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <HeaderText>{title}</HeaderText>
          <CloseButton onClick={onClose}>✕</CloseButton>
        </ModalHeader>
        <InputRow>
          <FieldWrapper>
            <LabelText>담당자</LabelText>
            <FormInput
              placeholder="담당자"
              value={assignee}
              readOnly
            />
          </FieldWrapper>
          <FieldWrapper>
            <LabelText>기간</LabelText>
            <FormInput
              placeholder="기간"
              value={period}
              readOnly
            />
          </FieldWrapper>
        </InputRow>
        <FieldWrapper>
          <LabelText>내용</LabelText>
          <FormTextarea
            placeholder="내용을 입력하세요"
            value={description}
            readOnly
          />
        </FieldWrapper>
      </ModalContainer>
    </ModalOverlay>
  )
}

IssueDetailModal.propTypes = {
  title: PropTypes.string.isRequired,
  assignee: PropTypes.string.isRequired,
  period: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired
}

export default IssueDetailModal;
