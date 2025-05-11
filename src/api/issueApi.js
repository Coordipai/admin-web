import { api } from '@hooks/useAxios'

/**
 * 1. 모든 이슈 받아오기 (프로젝트별)
 * @param {number} projectId
 */
export const fetchIssues = (projectId) => {
  return api.get('/issue/', {
    params: { project_id: projectId }
  })
}

/**
 * 2. 이슈 상세보기 (단일 이슈)
 * @param {number} projectId
 * @param {number} issueNumber
 */
export const fetchIssueDetail = (projectId, issueNumber) => {
  return api.get('/issue/detail', {
    params: {
      project_id: projectId,
      issue_number: issueNumber
    }
  })
}

/**
 * 3. 이슈 추가하기
 * @param {object} issueData
 */
export const createIssue = (issueData) => {
  return api.post('/issue/', issueData)
}

/**
 * 4. 이슈 수정하기
 * @param {object} issueData
 */
export const updateIssue = (issueData) => {
  return api.put('/issue/', issueData)
}

/**
 * 5. 이슈 닫기 (삭제로 간주)
 * @param {object} closeData { project_id, issue_number }
 */
export const closeIssue = (closeData) => {
  return api.patch('/issue/', closeData)
}
