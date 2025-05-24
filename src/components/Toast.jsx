import { toast, Bounce } from 'react-toastify'

/**
 * 토스트 메시지를 띄웁니다.
 *
 * @param {string} message - 표시할 메시지
 * @param {'success'|'error'|'warning'} [variant='success'] - 토스트 타입
 *
 * @example
 * // App.jsx 등 최상위 컴포넌트에 ToastContainer를 반드시 추가해야 합니다.
 * import { ToastContainer } from 'react-toastify'
 * import Toast from 'src/components/Toast'
 *
 * function App() {
 *   return (
 *     <>
 *       <ToastContainer />
 *       { ... }
 *     </>
 *   )
 * }
 *
 * // 성공 메시지
 * Toast('성공!', 'success')
 *
 * // 에러 메시지
 * Toast('상세 메시지', 'error')
 *
 * // 경고 메시지
 * Toast('경고!', 'warning')
 */
export default function Toast(message, variant = 'success') {
  const options = {
    position: 'top-right',
    autoClose: 1000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
    transition: Bounce,
    
  }
  if (variant === 'success') toast.success(message, options)
  else if (variant === 'error') toast.error(message, options)
  else if (variant === 'warning') toast.warn(message, options)
} 