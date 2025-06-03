import React, { useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'
import Typography from '@components/Edit/Typography'
import Button from './Button'
import IconButton from './IconButton'

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(16, 24, 40, 0.4);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ModalBox = styled.div`
  max-height: 70vh;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.radius.xl};
  box-shadow: 0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08);
  width: 480px;
  max-width: 90vw;
  padding: ${({ theme }) => theme.padding.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.gap.lg};
  align-items: flex-start
`

const UploadBox = styled.div`
  box-sizing: border-box;
  width: 100%;
  border: 1px solid ${({ theme, $dragActive }) => $dragActive ? theme.colors.brand500 : theme.colors.gray200};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.white};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => `${theme.padding.lg} ${theme.padding.xl}`};
  gap: ${({ theme }) => theme.gap.sm};
  transition: border 0.2s;
  ${({ $dragActive, theme }) =>
    $dragActive &&
    css`
      background: ${theme.colors.brand50};
    `}
`

const UploadIcon = styled.div`
  width: 56px;
  height: 56px;
  background: ${({ theme }) => theme.colors.gray100};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.margin.sm};
`

const UploadAction = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.gap.xs};
`

const FileQueue = styled.div`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.gap.sm};
  margin-top: ${({ theme }) => theme.margin.sm};
`

const FileItem = styled.div`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.padding.lg};
  gap: ${({ theme }) => theme.gap.lg};
`

const FileItemIcon = styled.div`
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.colors.brand50};
  border-radius: ${({ theme }) => theme.radius.xl};
  display: flex;
  align-items: center;
  justify-content: center;
`

const FileItemInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.gap.xs};
`

const FileItemName = styled.div`
  font-weight: 500;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray900};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const FileItemSize = styled.div`
  font-weight: 400;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.gray500};
`

const ModalActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.gap.sm};
  width: 100%;
  justify-content: flex-end;
`

const FileQueueContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.gap.sm};
  overflow-y: auto;
`

const FileModal = ({ open, onClose, onAttach }) => {
  const fileInputRef = useRef()
  const [fileQueue, setFileQueue] = useState([])
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    if (!open) return
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [open, onClose])

  useEffect(() => {
    if (!open) setFileQueue([])
  }, [open])

  if (!open) return null

  const handleUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map(f => ({
        file: f,
        name: f.name,
        size: f.size,
        icon: 'file',
        progress: 100
      }))
      setFileQueue(prev => [...prev, ...newFiles])
      e.target.value = ''
    }
  }

  const handleDelete = (idx) => {
    setFileQueue(prev => prev.filter((_, i) => i !== idx))
  }

  const handleAttach = () => {
    if (fileQueue.length > 0) {
      onAttach(Array.from(fileQueue, f => f.file))
      setFileQueue([])
      onClose()
    }
  }

  // 드래그 앤 드롭 핸들러
  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }
  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files).map(f => ({
        file: f,
        name: f.name,
        size: f.size,
        icon: 'file',
        progress: 100
      }))
      setFileQueue(prev => [...prev, ...newFiles])
    }
  }

  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={e => e.stopPropagation()}>
        <Typography variant='textXL' weight='medium' value='Upload and attach files' />
        <UploadBox
          $dragActive={dragActive}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <UploadIcon>
            <img src='/src/assets/icons/upload-icon.svg' alt='upload' width={32} height={32} />
          </UploadIcon>
          <div>
            <UploadAction>
              <Typography variant='textMD' weight='medium' color='brand500' onClick={handleUploadClick} value='Click to upload' />
              <input
                ref={fileInputRef}
                id='file-upload-modal'
                type='file'
                style={{ display: 'none' }}
                onChange={handleFileChange}
                multiple
              />
              <Typography variant='textSM' weight='medium' color='gray500' value='or drag and drop' />
            </UploadAction>
            <Typography
              variant='textSM'
              weight='regular'
              color='gray500'
              value='JSON, DOCX or PDF (max. 4GB)'
            />
          </div>
        </UploadBox>

        <FileQueueContainer>
          {fileQueue.length > 0 && (
            <FileQueue>
              {fileQueue.map((f, idx) => (
                <FileItem key={f.name + idx}>
                  <FileItemIcon>
                    <img src='/src/assets/icons/file-icon.svg' alt='file' width={24} height={24} />
                  </FileItemIcon>
                  <FileItemInfo>
                    <Typography
                      as='div'
                      variant='textSM'
                      weight='medium'
                      color='gray900'
                      style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                      value={f.name}
                    />
                    {/* <Typography
                      as='div'
                      variant='textSM'
                      weight='regular'
                      color='gray500'
                      value={formatFileSize(f.size)}
                    /> */}
                  </FileItemInfo>
                  <IconButton
                    icon={<img src='/src/assets/icons/trash-icon.svg' alt='Delete' />}
                    type='button'
                    onClick={() => handleDelete(idx)}
                  />
                </FileItem>
              ))}
            </FileQueue>
          )}
        </FileQueueContainer>
        <ModalActions>
          <Button variant='outlined' color='brand500' onClick={onClose}>Cancel</Button>
          <Button variant='contained' color='brand500' onClick={handleAttach}>Attach files</Button>
        </ModalActions>
      </ModalBox>
    </Overlay>
  )
}
// // 파일 크기 변환 함수 (FileModal에서 사용한 것과 동일하게 복사)
// function formatFileSize (bytes) {
//   const n = Number(bytes)
//   if (isNaN(n) || n < 0) return '0 B'
//   if (n < 1024) return `${n} B`
//   if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
//   if (n < 1024 * 1024 * 1024) return `${(n / 1024 / 1024).toFixed(1)} MB`
//   return `${(n / 1024 / 1024 / 1024).toFixed(1)} GB`
// }

export default FileModal
