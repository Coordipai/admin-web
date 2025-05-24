import { toast, Bounce } from 'react-toastify'

/**
 * 토스트 메시지를 띄웁니다.
 *
 * @param {string|Object} message - 표시할 메시지. error variant의 경우 error 객체를 받을 수 있습니다.
 * @param {'success'|'error'|'warning'} [variant='success'] - 토스트 타입
 *
 * @example
 * // App.jsx 등 최상위 컴포넌트에 ToastContainer를 반드시 추가해야 합니다.
 * import { ToastContainer } from 'react-toastify'
 * import toastMsg from '@utils/toastMsg'
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
 * toastMsg('성공!', 'success')
 *
 * // 에러 메시지 (문자열)
 * toastMsg('상세 메시지', 'error')
 *
 * // 에러 메시지 (error 객체)
 * toastMsg(error, 'error')
 *
 * // 경고 메시지
 * toastMsg('경고!', 'warning')
 */
export default function toastMsg(message, variant = 'success') {
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
  else if (variant === 'error') {
    if (typeof message === 'object' && message !== null && 'message' in message) {
      toast.error(`${message.message}`, options)
    } else {
      toast.error(message, options)
    }
  }
  else if (variant === 'warning') toast.warn(message, options)
} 