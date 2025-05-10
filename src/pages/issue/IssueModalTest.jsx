import { useState } from 'react'
import IssueDetailModal from './IssueDetailModal'

export default function IssueModalTest () {
  const [showModal, setShowModal] = useState(true)
  const [formData, setFormData] = useState({
    assignee: '쓰레기',
    period: 'sprint 3',
    description: '대충 겁나 긴 상세내용 에베베ㅔ벱베ㅔㅂ베베베베베베ㅔㅂ베ㅔㅂ베ㅔ벱베베베베베ㅔㅂ베베베베베베베ㅔㅔ베ㅔㅂ베ㅔ벱베ㅔㅂㅂ베베ㅔ베베베베베ㅔ베ㅔ베ㅔ베베베베베베ㅔㅔㅔ베베ㅔ베ㅔㅔ베ㅔ베벱베베ㅔ벰에베베ㅔ벱베ㅔㅂ베베베베베베ㅔㅂ베ㅔㅂ베ㅔ벱베베베베베ㅔㅂ베베베베베베베ㅔㅔ베ㅔㅂ베ㅔ벱베ㅔㅂㅂ베베ㅔ베베베베베ㅔ베ㅔ베ㅔ베베베베베베ㅔㅔㅔ베베ㅔ베ㅔㅔ베ㅔ베벱베베ㅔ벰에베베ㅔ벱베ㅔㅂ베베베베베베ㅔㅂ베ㅔㅂ베ㅔ벱베베베베베ㅔㅂ베베베베베베베ㅔㅔ베ㅔㅂ베ㅔ벱베ㅔㅂㅂ베베ㅔ베베베베베ㅔ베ㅔ베ㅔ베베베베베베ㅔㅔㅔ베베ㅔ베ㅔㅔ베ㅔ베벱베베ㅔ벰에베베ㅔ벱베ㅔㅂ베베베베베베ㅔㅂ베ㅔㅂ베ㅔ벱베베베베베ㅔㅂ베베베베베베베ㅔㅔ베ㅔㅂ베ㅔ벱베ㅔㅂㅂ베베ㅔ베베베베베ㅔ베ㅔ베ㅔ베베베베베베ㅔㅔㅔ베베ㅔ베ㅔㅔ베ㅔ베벱베베ㅔ벰에베베ㅔ벱베ㅔㅂ베베베베베베ㅔㅂ베ㅔㅂ베ㅔ벱베베베베베ㅔㅂ베베베베베베베ㅔㅔ베ㅔㅂ베ㅔ벱베ㅔㅂㅂ베베ㅔ베베베베베ㅔ베ㅔ베ㅔ베베베베베베ㅔㅔㅔ베베ㅔ베ㅔㅔ베ㅔ베벱베베ㅔ벰에베베ㅔ벱베ㅔㅂ베베베베베베ㅔㅂ베ㅔㅂ베ㅔ벱베베베베베ㅔㅂ베베베베베베베ㅔㅔ베ㅔㅂ베ㅔ벱베ㅔㅂㅂ베베ㅔ베베베베베ㅔ베ㅔ베ㅔ베베베베베베ㅔㅔㅔ베베ㅔ베ㅔㅔ베ㅔ베벱베베ㅔ벰'
  })

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <>
      <button onClick={() => setShowModal(true)}>모달 열기</button>
      {showModal && (
        <IssueDetailModal
          title='변경하고자하는 이슈1'
          assignee={formData.assignee}
          period={formData.period}
          description={formData.description}
          onClose={() => setShowModal(false)}
          onChange={handleChange}
        />
      )}
    </>
  )
}
