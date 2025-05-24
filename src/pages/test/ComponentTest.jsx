import { useState } from 'react'
import FormTextarea from '@components/FormTextArea'
import Header from '@components/Header'
import SideBar from '@components/SideBar'
import Modal from '@components/ConfirmModal'
import toastMsg from '@utils/toastMsg'

import { MainBox } from '@styles/globalStyle'

const FormTextAreaTest = () => {
  const [value, setValue] = useState('')

  return (
    <div>
      <FormTextarea
        label='설명'
        placeholder='내용을 입력하세요'
        value={value}
        onChange={(v) => setValue(v)}
        readOnly={false}
        hideCursor={false}
        disabled={false}
        require={false}
        error={false}
      />
      <div style={{ marginTop: '1rem' }}>
        <strong>value:</strong> {value}
      </div>
    </div>
  )
}

const HeaderTest = () => {
  return (
    <div>
      <Header
        text='Header Title'
        isTab={false}
        buttonsData={[
          {
            value: 'Success',
            isHighlighted: false,
            onClick: () => toastMsg('Success!','success')
          },
          {
            value: 'Warning',
            isHighlighted: true,
            onClick: () => toastMsg('Warning!','warning')
          },
          {
            value: 'Error',
            isHighlighted: false,
            onClick: () => toastMsg('An error occurred!','error')
          }
        ]}
      />
    </div>
  )
}

const ModalTest = () => {
  const [showModal, setShowModal] = useState(false)

  return (
    <div>
      <button onClick={() => setShowModal(true)}>Open Modal</button>
      {showModal && (
        <Modal text="정말 삭제하시겠습니까?" setShowModal={setShowModal} handleConfirm={() => console.log("삭제 완료")}/>
      )}
    </div>
  )
}

const ComponentTest = () => {
  return (
    <MainBox>
      {/* <div> Component Test </div> */}
      <HeaderTest />
      <FormTextAreaTest />
      <ModalTest />
    </MainBox>
  )
}

export default ComponentTest
