import React, { useRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import Typography from '@components/Edit/Typography'
import Button from '@components/Common/Button'
import IconButton from '@components/Common/IconButton'
import Badge from '@components/Edit/Badge'
import ArrowLeftIcon from '@assets/icons/arrow-left-icon.svg'
import ArrowRightIcon from '@assets/icons/arrow-right-icon.svg'
import { useNavigate, useLocation } from 'react-router-dom'

const TableWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  flex:1;
  flex-direction: column;
  width: 100%;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.1);
  overflow: hidden;
`

const Table = styled.table`
  
  width: 100%;
  max-width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  background: ${({ theme }) => theme.colors.white};
  table-layout: fixed;
`

const Thead = styled.thead`
  background: ${({ theme }) => theme.colors.gray50};
`

const Th = styled.th`
  padding: ${({ theme }) => `${theme.padding.md} ${theme.padding.sm}`};
  text-align: left;
  ${({ theme }) => theme.texts.textSM};
  font-weight: ${({ theme }) => theme.weights.semiBold};
  color: ${({ theme }) => theme.colors.gray700};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
`

const Td = styled.td`
  padding: ${({ theme }) => `${theme.padding.sm} ${theme.padding.sm}`};
  ${({ theme }) => theme.texts.textSM};
  font-weight: ${({ theme }) => theme.weights.regular};
  color: ${({ theme }) => theme.colors.gray900};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
  vertical-align: middle;
  gap: ${({ theme }) => theme.gap.xs};
  white-space: nowrap;
  max-width: 11.25rem;
  overflow: hidden;
  text-overflow: ellipsis;
  position: relative;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar { display: none; }
`

const Tr = styled.tr`

  max-height:60px;
  &:hover {
    background: ${({ theme }) => theme.colors.gray200};
  }
`

const TrHeader = styled.tr`
  &:last-child ${Td} {
    border-bottom: none;
  }
`

const LabelBadge = styled.span`
  display: inline-block;
  background: ${({ theme }) => theme.colors.gray100};
  color: ${({ theme }) => theme.colors.gray700};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 2px 10px;
  ${({ theme }) => theme.texts.textXS};
  font-weight: ${({ theme }) => theme.weights.medium};
  margin-right: 4px;
`

const PaginationWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => `${theme.padding.md} ${theme.padding.lg}`};
  // border-top: 1px solid ${({ theme }) => theme.colors.gray200};
  background: ${({ theme }) => theme.colors.white};
  width: 100%;
  max-width: 100%;
  height: 66px;
`

const IssueTable = ({ rows = [], page = 1, onPageChange, variant = 'issue' }) => {
  const wrapperRef = useRef(null)
  const [pageSize, setPageSize] = useState(99)
  const HEADER_HEIGHT = 53 // px
  const PAGINATION_HEIGHT = 66 // px
  const ROW_HEIGHT = 40.5 // px
  const navigate = useNavigate()
  const location = useLocation()

  // pageSize 계산 함수
  const calculatePageSize = () => {
    if (wrapperRef.current) {
      const height = wrapperRef.current.clientHeight
      const availableHeight = height - HEADER_HEIGHT - PAGINATION_HEIGHT
      return Math.max(1, Math.floor(availableHeight / ROW_HEIGHT))
    }
    return 1
  }

  useEffect(() => {
    const handleResize = () => {
      setPageSize(calculatePageSize())
    }
    setPageSize(calculatePageSize())
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleNext = (issueNumber) => {
    const basePath = location.pathname
    if (variant === 'issue') navigate(`${basePath}/issue/${issueNumber}`)
    else if (variant === 'request') navigate(`${basePath}/request/${issueNumber}`)
    else navigate('/notfound')
  }

  const total = Math.ceil(rows.length / pageSize) || 1
  const pagedRows = rows.slice((page - 1) * pageSize, page * pageSize)

  return (
    <TableWrapper ref={wrapperRef}>
        <Table>
          <Thead>
            <TrHeader>
              <Th># 이슈번호</Th>
              <Th>레포이름</Th>
              <Th>제목</Th>
              <Th>어사이니</Th>
              <Th>우선순위</Th>
              <Th>이터레이션</Th>
            </TrHeader>
          </Thead>
          <tbody>
            {pagedRows.length === 0
              ? (
                <tr>
                  <Td colSpan={7} rowSpan={8} align="center">
                    <Typography variant='textMD' color='gray500' value={variant === 'request' ? '변경요청서가 없습니다.' : '이슈가 없습니다.'} />
                  </Td>
                </tr>
                )
              : (
                  pagedRows.map((row, idx) => (
                    <Tr key={row.issue_number + row.title + idx} onClick={() => handleNext(row.issue_number)}>
                      <Td># {row.issue_number}</Td>
                      <Td>{row.repo_fullname}</Td>
                      <Td>{row.title}</Td>
                      <Td>
                        {Array.isArray(row.assignees) && row.assignees.length > 0
                          ? row.assignees.map(a => a.github_name).join(', ')
                          : ''}
                      </Td>
                      <Td><Badge priority={row.priority} /></Td>
                      <Td>Iteration {row.iteration}</Td>
                    </Tr>
                  ))
                )}
          </tbody>
        </Table>

      <PaginationWrapper>
        <Button
          icon={<img src={ArrowLeftIcon} alt='이전' />}
          color='white'
          style={{ minWidth: 32 }}
          onClick={() => onPageChange && onPageChange(page - 1)}
          disabled={page <= 1}
        />
        <Typography variant='textSM' color='gray700' value={`Page ${page} of ${total}`} />
        <Button
          icon={<img src={ArrowRightIcon} alt='다음' />}
          color='white'
          style={{ minWidth: 32 }}
          onClick={() => onPageChange && onPageChange(page + 1)}
          disabled={page >= total}
        />
      </PaginationWrapper>
    </TableWrapper>
  )
}

export default IssueTable
