import React from 'react'
import styled from 'styled-components'
import Typography from './Typography'
import DropDown from './DropDown'
import IconButton from '@components/Common/IconButton'

const TableWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  
  max-height: 100%;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.white};
  overflow: hidden;
  box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.06), 0px 1px 3px rgba(16, 24, 40, 0.1);
`

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
`

const Table = styled.div`
  width: 100%;
  height: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
`

const TableHeaderCell = styled.div`
  flex: ${({ $flex }) => $flex || 1};
  display: flex;
  align-items: center;
  ${({ $align }) => $align === 'center' && 'justify-content: center;'}
`
const TableRow = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};
  padding: ${({ theme }) => theme.padding.md};
  height: fit-content;
  background: ${({ $isEven, theme }) => $isEven ? theme.colors.gray25 : theme.colors.white};
  &:last-child { border-bottom: none; }
`

const NameCell = styled.div`
  flex: 1.7;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.gap.md};
`
const ProfileImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  background: ${({ theme }) => theme.colors.gray100};
`
const NameInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.gap.xs};
`
const FieldCell = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`
const ActionCell = styled.div`
  flex: 0.3;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const TableRowContainer = styled.div`
  width: 100%;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 100%;
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.gray100};
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray300};
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.gray400};
  }
`

const fieldOptions = [
  { value: '', label: '분야 선택' },
  { value: 'WEB_FE', label: '웹 프론트엔드' },
  { value: 'WEB_BE', label: '웹 백엔드' },
  { value: 'AI', label: 'AI' },
  { value: 'MOBLIE_APP', label: '모바일 앱' },
];

const UserTable = ({ rows, setRows }) => {
  const handleFieldChange = (id, value) => {
    setRows(rows.map(row => row.id === id ? { ...row, field: value } : row))
  }
  const handleDelete = (id) => {
    setRows(rows.filter(row => row.id !== id))
  }

  return (
    <TableWrapper>
      <Table>
        <TableHeader>
          <TableHeaderCell $flex={1.7}>
            <Typography variant='textXS' weight='medium' value='이름' />
          </TableHeaderCell>
          <TableHeaderCell $flex={1}>
            <Typography variant='textXS' weight='medium' value='분야' />
          </TableHeaderCell>
          <TableHeaderCell $flex={0.3} $align='center'>
            <Typography variant='textXS' weight='medium' value='' />
          </TableHeaderCell>
        </TableHeader>
        <TableRowContainer>
          {rows.map((row, idx) => (
            <TableRow key={row.id} $isEven={idx % 2 === 0}>
              <NameCell>
                <ProfileImg src={row.profileImg || 'https://avatars.githubusercontent.com/u/86557146?v=4'} alt='프로필' />
                <NameInfo>
                  <Typography variant='textSM' weight='regular' value={row.name} />
                  {row.githubId && (
                    <Typography variant='textSM' weight='regular' color='gray500' value={row.githubId} />
                  )}
                </NameInfo>
              </NameCell>
              <FieldCell>
                <DropDown
                  value={row.field}
                  onChange={v => handleFieldChange(row.id, v)}
                  options={fieldOptions}
                  placeholder='분야 선택'
                />
              </FieldCell>
              <ActionCell>
                <IconButton
                  icon={<img src='/src/assets/icons/trash-icon.svg' alt='삭제' />}
                  onClick={() => handleDelete(row.id)}
                  type='button'
                />
              </ActionCell>
            </TableRow>
          ))}
        </TableRowContainer>
      </Table>
    </TableWrapper>
  )
}

export default UserTable
