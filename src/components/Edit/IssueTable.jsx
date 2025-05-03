import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import Typography from '@components/Edit/Typography';
import Button from '@components/Common/Button';
import IconButton from '@components/Common/IconButton';
import TrashIcon from '@assets/icons/trash-icon.svg';
import EditIcon from '@assets/icons/edit-icon.svg';
import Badge from '@components/Edit/Badge';
import ArrowLeftIcon from '@assets/icons/arrow-left-icon.svg';
import ArrowRightIcon from '@assets/icons/arrow-right-icon.svg';

const TableWrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  max-height: 100%;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: 8px;
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.1);
  overflow-x: auto;
  overflow-y: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

const Thead = styled.thead`
  background: ${({ theme }) => theme.colors.gray50};
`;

const Th = styled.th`
  padding: 16px 12px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray700};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const Td = styled.td`
  padding: 14px 12px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray900};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
  vertical-align: middle;
  gap: ${({ theme }) => theme.gap.xs};
  max-width: 180px;
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
`;

const Tr = styled.tr`
  &:last-child ${Td} {
    border-bottom: none;
  }
`;

const LabelBadge = styled.span`
  display: inline-block;
  background: ${({ theme }) => theme.colors.gray100};
  color: ${({ theme }) => theme.colors.gray700};
  border-radius: 12px;
  padding: 2px 10px;
  font-size: 12px;
  font-weight: 500;
  margin-right: 4px;
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.gray200};
  background: ${({ theme }) => theme.colors.white};
`;

const IssueTable = ({ rows = [], page = 1, onPageChange, onEdit, onDelete }) => {
  const wrapperRef = useRef(null);
  const [pageSize, setPageSize] = useState(99);
  const HEADER_HEIGHT = 47; // px
  const PAGINATION_HEIGHT = 57; // px
  const ROW_HEIGHT = 52.5; // px

  // pageSize 계산 함수
  const calculatePageSize = () => {
    if (wrapperRef.current) {
      const height = wrapperRef.current.clientHeight;
      const availableHeight = height - HEADER_HEIGHT - PAGINATION_HEIGHT;
      return Math.max(1, Math.floor(availableHeight / ROW_HEIGHT));
    }
    return 1;
  };

  useEffect(() => {
    const handleResize = () => {
      setPageSize(calculatePageSize());
    };
    setPageSize(calculatePageSize());
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const total = Math.ceil(rows.length / pageSize) || 1;
  const pagedRows = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <TableWrapper ref={wrapperRef}>
      <Table>
        <Thead>
          <Tr>
            <Th># 이슈번호</Th>
            <Th>레포이름</Th>
            <Th>제목</Th>
            <Th>바디</Th>
            <Th>어사이니</Th>
            <Th>우선순위</Th>
            <Th>이터레이션</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <tbody>
          {pagedRows.length === 0 ? (
            <Tr>
              <Td colSpan={8} style={{ textAlign: 'center', color: undefined }}>
                <Typography variant="textMD" color="gray500" value="검색된 이슈가 없습니다." />
              </Td>
            </Tr>
          ) : (
            pagedRows.map((row, idx) => (
              <Tr key={row.issue_number + row.title + idx}>
                <Td># {row.issue_number}</Td>
                <Td>{row.repo_fullname}</Td>
                <Td>{row.title}</Td>
                <Td>{row.body}</Td>
                <Td>{row.assignee}</Td>
                <Td><Badge priority={row.priority} /></Td>
                <Td>Iteration {row.iteration}</Td>
                <Td>
                  <IconButton icon={<img src={TrashIcon} alt="Delete" />} onClick={() => onDelete && onDelete(row)} />
                  <IconButton icon={<img src={EditIcon} alt="Edit" />} onClick={() => onEdit && onEdit(row)}/>
                </Td>
              </Tr>
            ))
          )}
        </tbody>
      </Table>
      <PaginationWrapper>
        <Button 
          icon={<img src={ArrowLeftIcon} alt="이전" />} 
          color="white" 
          style={{ minWidth: 32 }} 
          onClick={() => onPageChange && onPageChange(page - 1)} 
          disabled={page <= 1} 
        />
        <Typography variant="textSM" color="gray700" value={`Page ${page} of ${total}`}/>
        <Button 
          icon={<img src={ArrowRightIcon} alt="다음" />} 
          color="white" 
          style={{ minWidth: 32 }} 
          onClick={() => onPageChange && onPageChange(page + 1)} 
          disabled={page >= total} 
        />
      </PaginationWrapper>
    </TableWrapper>
  );
};

export default IssueTable; 