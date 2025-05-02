import React, { useState } from 'react';
import styled from 'styled-components';
import Typography from './Typography';
import Button from '../Common/Button';
import IconButton from '../Common/IconButton';
import FileModal from '../Common/FileModal';

const TableContainer = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 1px 2px rgba(16, 24, 40, 0.06), 0px 1px 3px rgba(16, 24, 40, 0.1);
  display: flex;
  flex-direction: column;
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const UploadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: ${({ theme }) => theme.colors.brand500};
  border: 1px solid ${({ theme }) => theme.colors.brand500};
  border-radius: 8px;
  color: ${({ theme }) => theme.colors.white};
  font-family: Poppins, sans-serif;
  font-weight: ${({ theme }) => theme.weights.semiBold};
  font-size: 0.875rem;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.colors.brand600};
  }
`;

const Table = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const TableHeaderRow = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
  background: ${({ theme }) => theme.colors.white};
`;

const TableHeaderCell = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const TableRowContainer = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
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
`;

const TableRow = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
  background: ${({ isEven, theme }) => isEven ? theme.colors.gray50 : theme.colors.white};
  &:last-child {
    border-bottom: none;
  }
`;

const FileIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.colors.brand50};
  border-radius: 20px;
  margin-right: 12px;
`;

const FileInfo = styled.div`
  flex: 1;
`;

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
`;

const FileTable = ({ files, setFiles }) => {
  const [modalOpen, setModalOpen] = useState(false);

  // 파일 삭제
  const handleDelete = (name) => {
    setFiles(files.filter((f) => f.name !== name));
  };

  // 파일 첨부(모달에서 Attach 클릭)
  const handleAttach = (newFiles) => {
    // 실제 API 전송 예시 (주석처리)
    // const formData = new FormData();
    // newFiles.forEach(file => formData.append('files', file));
    // await axios.post('/api/upload', formData);

    setFiles([
      ...files,
      ...newFiles.map(f => ({
        name: f.name,
        size: f.size,
        icon: 'file',
      }))
    ]);
    setModalOpen(false);
  };

  return (
    <>
      <FileModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAttach={handleAttach}
      />
      <TableContainer>
        <TableHeader>
          <Typography variant="displayMD" weight="medium" value="프로젝트 자료" />
          <Button
            text="Upload"
            icon={<img src="/src/assets/icons/upload-icon.svg" alt="Upload" />}
            variant="default"
            type="button"
            onClick={() => setModalOpen(true)}
          />
        </TableHeader>
        <Table>
          <TableHeaderRow>
            <TableHeaderCell>
              <Typography variant="textXS" weight="medium" value="File name" />
            </TableHeaderCell>
          </TableHeaderRow>
          <TableRowContainer>
            {files.map((file, index) => (
              <TableRow key={file.name + index} isEven={index % 2 === 0}>
                <FileIcon>
                  <img
                    src={`/src/assets/icons/${file.icon}-icon.svg`}
                    alt={file.icon}
                  />
                </FileIcon>
                <FileInfo>
                  <Typography variant="textSM" weight="medium" value={file.name} />
                  <Typography variant="textSM" weight="regular" color="gray500" value={typeof file.size === 'number' ? formatFileSize(file.size) : file.size} />
                </FileInfo>
                <DeleteButton>
                  <IconButton
                    icon={<img src="/src/assets/icons/trash-icon.svg" alt="Delete" />}
                    type="button"
                    onClick={() => handleDelete(file.name)}
                  />
                </DeleteButton>
              </TableRow>
            ))}
          </TableRowContainer>
        </Table>
      </TableContainer>
    </>
  );
};

// 파일 크기 변환 함수 (FileModal에서 사용한 것과 동일하게 복사)
function formatFileSize(bytes) {
  const n = Number(bytes);
  if (isNaN(n) || n < 0) return '0 B';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`;
  return `${(n / 1024 / 1024 / 1024).toFixed(1)} GB`;
}

export default FileTable; 