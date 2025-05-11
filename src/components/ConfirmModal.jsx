import styled from "styled-components";
import PropTypes from "prop-types";
import Header from "./Header";

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(16, 24, 40, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalLayout = styled.div`
  min-width: 18.75rem;
  max-width: 37.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.25rem 1rem 1rem 1rem;
  border-radius: 0.75rem;
  background-color: white;
`;

const ModalContentBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ModalHeader = styled.h2`
  ${({ theme }) => theme.texts.textLG}
  font-weight: ${({ theme }) => theme.weights.semiBold};
  color: ${({ theme }) => theme.colors.gray900};
`;

const ModalActionsBox = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
`;

const ModalActionsButton = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 0.625rem 0;
  ${({ theme }) => theme.texts.textMD}
  font-weight: ${({ theme }) => theme.weights.semiBold};
  color: ${({ theme, $isConfirmBtn }) =>
    $isConfirmBtn ? theme.colors.white : theme.colors.gray700};
  background-color: ${({ theme, $isConfirmBtn }) =>
    $isConfirmBtn ? theme.colors.brand600 : theme.colors.white};
  border: 0.0625rem solid
    ${({ theme, $isConfirmBtn }) =>
      $isConfirmBtn ? theme.colors.brand600 : theme.colors.gray300};
  border-radius: 0.5rem;
  cursor: pointer;
  white-space: nowrap;
`


const ConfirmModal = ({ text, setShowModal, handleConfirm }) => {
    const _handleConfirm = () => {
        handleConfirm();
        setShowModal(false);
    };

  const _handleCancel = () => {
    setShowModal(false);
  };

  return (
    <ModalBackdrop onClick={_handleCancel}>
      <ModalLayout onClick={(e) => e.stopPropagation()}>
        <ModalContentBox>
          <ModalHeader>
            {text}
          </ModalHeader>
        </ModalContentBox>
        <ModalActionsBox>
          <ModalActionsButton $isConfirmBtn={true} onClick={_handleConfirm}>
            확인
          </ModalActionsButton>
          <ModalActionsButton $isConfirmBtn={false} onClick={_handleCancel}>
            취소
          </ModalActionsButton>
        </ModalActionsBox>
      </ModalLayout>
    </ModalBackdrop>
  );
};

ConfirmModal.propTypes = {
  text: PropTypes.string.isRequired,
  setShowModal: PropTypes.func.isRequired,
  handleConfirm: PropTypes.func.isRequired,
};

export default ConfirmModal;
