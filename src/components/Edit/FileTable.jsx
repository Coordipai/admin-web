import React, { useState } from 'react'
import styled from 'styled-components'
import Typography from '@components/Edit/Typography'
import Button from '@components/Common/Button'
import IconButton from '@components/Common/IconButton'
import FileModal from '@components/Common/FileModal'

const TableWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  max-height: 100%;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.white};
  overflow: hidden;
  box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.06), 0px 1px 3px rgba(16, 24, 40, 0.1);
  display: flex;
  flex-direction: column;
`

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  height: fit-content;
  flex-shrink: 0;
`

const Table = styled.div`
  width: 100%;
  height: 100%;
  max-height: 100%;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
`

const TableHeaderRow = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
  background: ${({ theme }) => theme.colors.white};
`

const TableHeaderCell = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const TableRowContainer = styled.div`
box-sizing: border-box;
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

const TableRow = styled.div`
box-sizing: border-box;
  width: 100%;
  min-width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};
  padding: ${({ theme }) => theme.padding.md};
  height: fit-content;
  background: ${({ $isEven, theme }) => $isEven ? theme.colors.gray25 : theme.colors.white};
  &:last-child { border-bottom: none; }
`

const FileIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.colors.brand50};
  border-radius: 20px;
  margin-right: 12px;
`

const DeleteButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    opacity: 0.7;
  }
`

const FileIconCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: fit-content;
  min-width: 52px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar { display: none; }
  &:hover, &:focus-within {
    overflow-x: auto;
    text-overflow: unset;
  }
`

const FileInfoCell = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar { display: none; }
  &:hover, &:focus-within {
    overflow-x: auto;
    text-overflow: unset;
  }
`

const ActionCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: fit-content;
  min-width: 40px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar { display: none; }
  &:hover, &:focus-within {
    overflow-x: auto;
    text-overflow: unset;
  }
`

const FileTable = ({ files, setFiles }) => {
  const [modalOpen, setModalOpen] = useState(false)

  // 파일 삭제
  const handleDelete = (name, size) => {
    setFiles(files.filter((f) => {
      if (typeof f === 'string') {
        return f !== name
      } else {
        return !(f.name === name && f.size === size)
      }
    }))
  }

  // 파일 첨부(모달에서 Attach 클릭)
  const handleAttach = (newFiles) => {
    setFiles([
      ...files,
      ...newFiles
    ])
    setModalOpen(false)
  }

  return (
    <>
      <FileModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAttach={handleAttach}
      />
      <TableWrapper>
        <TableHeader>
          <Typography variant='displaySM' weight='medium' value='프로젝트 자료' />

          <Button
            icon={<img src='/src/assets/icons/upload-icon.svg' alt='Upload' />}
            variant='contained'
            color='brand500'
            onClick={() => setModalOpen(true)}
          >Upload
          </Button>
        </TableHeader>
        <Table>
          <TableHeaderRow>
            <TableHeaderCell>
              <Typography variant='textXS' weight='medium' value='File name' />
            </TableHeaderCell>
          </TableHeaderRow>
          <TableRowContainer>
            {files.map((file, index) => {
              const fileName = typeof file === 'string' ? file : file.name
              const fileSize = typeof file === 'string' ? undefined : file.size
              return (
                <TableRow key={fileName + fileSize + index} $isEven={index % 2 === 0}>
                  <FileIconCell>
                    <FileIcon>
                      <img
                        src='/src/assets/icons/file-icon.svg'
                        alt='file'
                      />
                    </FileIcon>
                  </FileIconCell>
                  <FileInfoCell>
                    <Typography variant='textSM' weight='medium' value={fileName} />
                  </FileInfoCell>
                  <ActionCell>
                    <IconButton
                      icon={<img src='/src/assets/icons/trash-icon.svg' alt='Delete' />}
                      type='button'
                      onClick={() => handleDelete(fileName, fileSize)}
                    />
                  </ActionCell>
                </TableRow>
              )
            })}
          </TableRowContainer>
        </Table>
      </TableWrapper>
    </>
  )
}

export default FileTable
