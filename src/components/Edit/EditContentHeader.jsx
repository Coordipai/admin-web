import styled from 'styled-components'
import PropTypes from 'prop-types'
import { ButtonBase } from '@styles/globalStyle'

const EditContentHeaderLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`

const EditContentHeaderSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`

const EditContentHeaderTopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const EditContentHeaderText = styled.span`
  ${({ theme }) => theme.texts.textLG}
  font-weight: ${({ theme }) => theme.weights.semiBold};
  color: ${({ theme }) => theme.colors.gray900};
`

const EditContentSubButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  ${({ theme }) => theme.texts.textSM};
  color: ${({ theme }) => theme.colors.gray500};
  align-self: flex-start;

  &:hover {
    color: ${({ theme }) => theme.colors.gray700};
    text-decoration: underline;
  }
`

const EditContentHeaderActions = styled.div`
  display: flex;
  gap: 0.75rem;
`

const EditContainerDivider = styled.div`
  width: 100%;
  height: 0.0625rem;
  background-color: ${({ theme }) => theme.colors.gray200};
`

const EditContentHeader = ({ title, subAction, buttonsData = [] }) => {
  return (
    <EditContentHeaderLayout>
      <EditContentHeaderSection>
        <EditContentHeaderTopRow>
          <div style={{ display: 'flex', gap: '0.25rem', flexDirection: 'column' }}>
            <EditContentHeaderText>{title}</EditContentHeaderText>
            {subAction && (
              <EditContentSubButton onClick={subAction.onClick}>
                {subAction.label}
              </EditContentSubButton>
            )}
          </div>
          <EditContentHeaderActions>
            {buttonsData.map((item, index) => (
              <ButtonBase
                key={index}
                $isHighlighted={index === buttonsData.length - 1}
                onClick={item.onClick}
              >
                {item.value}
              </ButtonBase>
            ))}
          </EditContentHeaderActions>
        </EditContentHeaderTopRow>
      </EditContentHeaderSection>
      <EditContainerDivider />
    </EditContentHeaderLayout>
  )
}

EditContentHeader.propTypes = {
  title: PropTypes.string.isRequired,
  buttonsData: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      onClick: PropTypes.func
    })
  ),
  subAction: PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func
  })
}

export { EditContentHeader }
